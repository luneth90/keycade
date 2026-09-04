import importlib.machinery
import importlib.util
import json
import os
import signal
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
LISTING = ROOT / "tests" / "fixtures" / "herdr-keys.txt"


def load_helper():
    loader = importlib.machinery.SourceFileLoader(
        "herdr_keys_json", str(ROOT / "bin" / "herdr-keys-json"))
    spec = importlib.util.spec_from_loader("herdr_keys_json", loader)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


helper = load_helper()


class ListingTests(unittest.TestCase):
    """Omarchy's own tool already resolves herdr's bindings, prefix and all, so
    this ground reads the machine. The listing is written for a person to look
    at, which is where the traps are."""

    @classmethod
    def setUpClass(cls):
        cls.snapshot = helper.snapshot(LISTING.read_text(encoding="utf-8"))
        cls.by_notation = {entry["notation"]: entry for entry in cls.snapshot["bindings"]}

    def test_the_prefix_is_taken_from_the_machine(self):
        # Not guessed and not settable: the listing says what it resolved to.
        self.assertEqual(self.snapshot["prefix"], {"mods": helper.CTRL, "text": "a"})
        for entry in self.snapshot["bindings"]:
            if entry["notation"].startswith("PREFIX"):
                self.assertEqual(entry["steps"][0], self.snapshot["prefix"])

    def test_a_bare_letter_is_the_lower_case_key(self):
        # The listing upper-cases every key for display, but herdr's config
        # says `settings = "prefix+s"`. Taking the display literally would ask
        # for Shift on every letter, because Shift is folded into the character.
        self.assertEqual(self.by_notation["PREFIX + S"]["steps"][1], {"mods": 0, "text": "s"})
        self.assertEqual(self.by_notation["PREFIX + SHIFT + C"]["steps"][1], {"mods": 0, "text": "C"})

    def test_shift_on_an_arrow_is_a_chord_of_its_own(self):
        # A named key has no character for Shift to fold into, so refusing it
        # cost seven real bindings until the rule was narrowed to Tab.
        entry = self.by_notation["CTRL + ALT + SHIFT + LEFT"]
        self.assertEqual(entry["steps"], [{"mods": helper.CTRL | helper.ALT | helper.SHIFT,
                                           "named": "LEFT"}])
        self.assertNotIn("PREFIX + SHIFT + TAB", self.by_notation)
        self.assertEqual(self.snapshot["dropped"].get("unreadable-notation"), 1)

    def test_navigate_mode_is_a_context_rather_than_a_key(self):
        # It is a state you open first, so the card names the mode and asks
        # for the key alone.
        entry = self.by_notation["H"]
        self.assertEqual(entry["context"], "navigate")
        self.assertEqual(entry["steps"], [{"mods": 0, "text": "h"}])
        self.assertIn("navigate", self.snapshot["contexts"])

    def test_a_range_is_not_a_key_anyone_presses(self):
        self.assertEqual(self.snapshot["dropped"].get("range-notation"), 1)
        for entry in self.snapshot["bindings"]:
            self.assertNotIn("..", entry["notation"])

    def test_only_the_first_of_two_bindings_is_dealt(self):
        # "PREFIX + H / ALT + ENTER" is one action reached two ways. The answer
        # model has no room for alternatives yet, so the second is left out
        # rather than dealt as a separate card for the same thing.
        self.assertIn("PREFIX + H", self.by_notation)
        self.assertNotIn("ALT + ENTER", self.by_notation)

    def test_every_entry_is_answerable_and_bounded(self):
        self.assertGreater(len(self.snapshot["bindings"]), 40)
        ids = [entry["localId"] for entry in self.snapshot["bindings"]]
        self.assertEqual(len(ids), len(set(ids)))
        for entry in self.snapshot["bindings"]:
            self.assertTrue(1 <= len(entry["steps"]) <= 8)
            self.assertLessEqual(len(entry["localId"]), helper.MAX_LOCAL_ID_CHARS)
            self.assertIn(entry["category"], self.snapshot["categories"])
            self.assertIn(entry["context"], self.snapshot["contexts"])
            self.assertTrue(entry["descKey"].startswith("herdrdesc_"))
            for step in entry["steps"]:
                self.assertNotEqual(step.get("named"), "ESC")
                self.assertNotIn(step.get("named"), helper.DEVICE_SPECIAL)

    def test_every_description_is_answered_by_both_language_packs(self):
        english = json.loads((ROOT / "assets/locales/en.json").read_text(encoding="utf-8"))
        chinese = json.loads((ROOT / "assets/locales/zh-CN.json").read_text(encoding="utf-8"))
        for entry in self.snapshot["bindings"]:
            with self.subTest(entry=entry["localId"]):
                self.assertIn(entry["descKey"], english)
                self.assertIn(entry["descKey"], chinese)
                self.assertNotEqual(chinese[entry["descKey"]], entry["desc"])

    def test_an_unreadable_listing_produces_an_error_not_a_guess(self):
        # A ground that cannot be read has nothing to teach. Dealing cards
        # built on a guessed prefix would be wrong in a way nobody could see.
        result = subprocess.run(
            [sys.executable, str(ROOT / "bin" / "herdr-keys-json"), "--listing", "/dev/null"],
            capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(result.stdout)["type"], "error")

    def test_the_output_is_one_bounded_json_line(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / "bin" / "herdr-keys-json"), "--listing", str(LISTING)],
            capture_output=True, text=True, check=True)
        self.assertEqual(len(result.stdout.strip().splitlines()), 1)
        self.assertEqual(json.loads(result.stdout)["profile"], "herdr")

    def test_control_characters_in_description_are_sanitized(self):
        listing = "PREFIX → CTRL + A\nPREFIX + C → Create a\x00new\x1b[31m pane\n"
        snap = helper.snapshot(listing)
        self.assertEqual(len(snap["bindings"]), 1)
        self.assertEqual(snap["bindings"][0]["desc"], "Create a new [31m pane")

    def test_control_characters_in_combo_are_rejected(self):
        listing = "PREFIX → CTRL + A\nPREFIX + C\x00 → Action\n"
        snap = helper.snapshot(listing)
        self.assertEqual(snap["bindings"], [])
        self.assertEqual(snap["dropped"]["unreadable-notation"], 1)
        with self.assertRaises(helper.Rejected):
            helper.parse_chord("CTRL + \x00")

    def test_control_characters_in_prefix_are_rejected(self):
        listing = "PREFIX → CTRL + \x00\nPREFIX + C → Action\n"
        snap = helper.snapshot(listing)
        self.assertEqual(snap["bindings"], [])
        self.assertEqual(snap["dropped"]["unreadable-prefix"], 1)


class ListingProcessTests(unittest.TestCase):
    """R7/R8: the listing binary is trusted, bounded, and dies with the helper."""

    def test_the_listing_command_is_absolute_and_trusted(self):
        source = (ROOT / "bin" / "herdr-keys-json").read_text(encoding="utf-8")
        self.assertTrue(source.startswith("#!/usr/bin/python3"))
        self.assertNotIn("/usr/bin/env", source)
        self.assertNotIn("start_new_session", source)
        self.assertIn("trusted_command(LISTING_COMMAND)", source)
        self.assertIn('LISTING_COMMAND = "/usr/share/omarchy/bin/omarchy-menu-herdr-keybindings"', source)
        self.assertIn("ctypes.CDLL(trusted_command(LIBC_PATH)", source)
        self.assertIn("PR_SET_PDEATHSIG", source)

    def test_trusted_command_rejects_untrusted_paths(self):
        with tempfile.TemporaryDirectory() as directory:
            planted = Path(directory) / "omarchy-menu-herdr-keybindings"
            planted.write_text("#!/bin/sh\necho pwned\n", encoding="utf-8")
            planted.chmod(0o777)
            with self.assertRaises(OSError):
                helper.trusted_command(str(planted))
            with self.assertRaises(OSError):
                helper.trusted_command(str(Path(directory) / "missing"))

    def test_listing_stdout_limit_is_enforced(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "listing"
            script.write_text(
                f"#!{sys.executable}\n"
                "import sys\n"
                "sys.stdout.write('x' * (512 * 1024))\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with mock.patch.object(helper, "LISTING_COMMAND", str(script)), \
                    mock.patch.object(helper, "trusted_command", side_effect=lambda path: path), \
                    mock.patch.object(helper, "MAX_STDOUT_BYTES", 128):
                with self.assertRaisesRegex(RuntimeError, "limit"):
                    helper.run_listing()

    def test_listing_deadline_is_enforced(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "listing"
            script.write_text(
                f"#!{sys.executable}\n"
                "import time\n"
                "time.sleep(5)\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with mock.patch.object(helper, "LISTING_COMMAND", str(script)), \
                    mock.patch.object(helper, "trusted_command", side_effect=lambda path: path), \
                    mock.patch.object(helper, "COMMAND_TIMEOUT_SECONDS", 0.2):
                with self.assertRaisesRegex(RuntimeError, "deadline"):
                    helper.run_listing()

    def test_listing_deadline_kills_descendants(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_file = Path(directory) / "child.pid"
            child_code = (
                "import os, pathlib, time; "
                f"pathlib.Path({str(pid_file)!r}).write_text(str(os.getpid())); "
                "time.sleep(30)"
            )
            script = Path(directory) / "listing"
            script.write_text(
                f"#!{sys.executable}\n"
                "import subprocess, sys, time\n"
                f"subprocess.Popen([sys.executable, '-c', {child_code!r}])\n"
                "time.sleep(30)\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with mock.patch.object(helper, "LISTING_COMMAND", str(script)), \
                    mock.patch.object(helper, "trusted_command", side_effect=lambda path: path), \
                    mock.patch.object(helper, "COMMAND_TIMEOUT_SECONDS", 0.4):
                with self.assertRaisesRegex(RuntimeError, "deadline"):
                    helper.run_listing()
            child_pid = int(pid_file.read_text())
            for _ in range(20):
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.05)
            else:
                os.kill(child_pid, signal.SIGKILL)
                self.fail("listing descendant survived the deadline")

    def test_child_dies_with_the_helper(self):
        script = (
            "import subprocess, sys, time, importlib.machinery, importlib.util\n"
            f"loader = importlib.machinery.SourceFileLoader('hk', {str(ROOT / 'bin' / 'herdr-keys-json')!r})\n"
            "hk = importlib.util.module_from_spec(importlib.util.spec_from_loader('hk', loader))\n"
            "loader.exec_module(hk)\n"
            "child = subprocess.Popen(['/usr/bin/sleep', '30'], preexec_fn=hk._prepare_child)\n"
            "print(child.pid, flush=True)\n"
            "time.sleep(30)\n"
        )
        parent = subprocess.Popen(
            [sys.executable, "-c", script], stdout=subprocess.PIPE, text=True
        )
        try:
            child_pid = int(parent.stdout.readline().strip())
            parent.stdout.close()
            parent.kill()
            parent.wait(timeout=5)
            deadline = time.monotonic() + 5
            while time.monotonic() < deadline:
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.05)
            else:
                os.kill(child_pid, signal.SIGKILL)
                self.fail("child survived the helper")
        finally:
            if parent.poll() is None:
                parent.kill()
                parent.wait()


if __name__ == "__main__":
    unittest.main()
