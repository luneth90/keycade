import importlib.machinery
import importlib.util
import json
import os
import sys
import subprocess
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "bin" / "keybinds-json"


def load_helper():
    loader = importlib.machinery.SourceFileLoader("keybinds_json", str(SCRIPT))
    spec = importlib.util.spec_from_loader(loader.name, loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


class KeybindHelperTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.helper = load_helper()
        cls.binds = (ROOT / "tests/fixtures/binds.txt").read_text()
        cls.devices = (ROOT / "tests/fixtures/devices.txt").read_text()

    def test_snapshot_preserves_logical_and_physical_bindings(self):
        result = self.helper.snapshot(self.binds, self.devices)
        self.assertEqual(result["schemaVersion"], 1)
        self.assertFalse(result["appleKeyboard"])
        self.assertEqual(len(result["bindings"]), 3)
        self.assertEqual(result["bindings"][0]["key"], "3")
        self.assertEqual(result["bindings"][1]["matchMode"], "physical")
        self.assertEqual(result["bindings"][1]["keycode"], 12)

    def test_apple_keyboard_detection_is_limited_to_keyboard_section(self):
        apple = """Mice:\n  apple-mtp-multi-touch\n\nKeyboards:\n  apple-mtp-keyboard\n\nSwitches:\n"""
        mouse_only = """Mice:\n  apple-mtp-multi-touch\n\nKeyboards:\n  usb-keyboard\n\nSwitches:\n"""
        self.assertTrue(self.helper.has_apple_keyboard(apple))
        self.assertFalse(self.helper.has_apple_keyboard(mouse_only))

    def test_flags_and_commas_are_not_lost(self):
        binding = self.helper.snapshot(self.binds)["bindings"][2]
        self.assertTrue(binding["dontInhibit"])
        self.assertIn("release", binding["flags"])
        self.assertEqual(binding["arg"], "printf 'a,b'")

    def test_cli_fixture_mode_emits_json(self):
        result = subprocess.run(
            [str(SCRIPT), "--input", str(ROOT / "tests/fixtures/binds.txt"),
             "--devices-input", str(ROOT / "tests/fixtures/devices.txt")],
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(json.loads(result.stdout)["schemaVersion"], 1)

    def test_user_lua_configuration_is_never_executed(self):
        with tempfile.TemporaryDirectory() as directory:
            fake_home = Path(directory)
            config = fake_home / ".config" / "hypr"
            config.mkdir(parents=True)
            sentinel = fake_home / "executed"
            (config / "hyprland.lua").write_text(
                f'os.execute("touch {sentinel}")\n', encoding="utf-8"
            )
            environment = os.environ.copy()
            environment["HOME"] = str(fake_home)
            subprocess.run(
                [str(SCRIPT), "--input", str(ROOT / "tests/fixtures/binds.txt"),
                 "--devices-input", str(ROOT / "tests/fixtures/devices.txt")],
                check=True,
                capture_output=True,
                env=environment,
            )
            self.assertFalse(sentinel.exists())

    def test_json_missing_key_is_filled_from_aligned_plain_record(self):
        raw_json = json.dumps([{
            "modmask": 64,
            "key": "",
            "keycode": 0,
            "dispatcher": "__lua",
            "arg": "hl.dsp.workspace(1)",
            "description": "Switch to workspace 1",
            "submap": "",
        }])
        raw_plain = """bind
\tmodmask: 64
\tkey: SUPER + code:10
\tkeycode: 0
\tdispatcher: __lua
\targ: hl.dsp.workspace(1)
\tdescription: Switch to workspace 1
\tsubmap:
"""
        result = self.helper.snapshot_json(raw_json, raw_plain)
        self.assertEqual(result["bindings"][0]["key"], "1")
        self.assertEqual(result["bindings"][0]["keycode"], 10)
        self.assertEqual(result["bindings"][0]["matchMode"], "physical")

    def test_misaligned_plain_record_rejects_json_record(self):
        raw_json = json.dumps([{
            "modmask": 64,
            "key": "",
            "keycode": 0,
            "dispatcher": "__lua",
            "arg": "one",
            "description": "First",
        }])
        raw_plain = """bind
\tmodmask: 64
\tkey: SUPER + code:10
\tdispatcher: __lua
\targ: two
\tdescription: Second
"""
        result = self.helper.snapshot_json(raw_json, raw_plain)
        self.assertEqual(result["bindings"], [])
        self.assertEqual(result["rejected"], 1)

    def test_conflicting_nonempty_keys_reject_json_record(self):
        raw_json = json.dumps([{
            "modmask": 64,
            "key": "K",
            "keycode": 0,
            "dispatcher": "exec",
            "arg": "terminal",
            "description": "Open terminal",
            "submap": "",
        }])
        raw_plain = """bindd
\tmodmask: 64
\tkey: J
\tdispatcher: exec
\targ: terminal
\tdescription: Open terminal
\tsubmap:
"""
        result = self.helper.snapshot_json(raw_json, raw_plain)
        self.assertEqual(result["bindings"], [])
        self.assertEqual(result["rejected"], 1)

    def test_control_characters_are_normalized(self):
        self.assertEqual(self.helper.sanitize_text("safe\u202eevil\n", 20), "safe evil ")

    def test_oversized_record_is_dropped_without_losing_the_rest(self):
        blocks = (
            "bindd\n\tmodmask: 64\n\tkey: K\n\tdescription: " + "A" * 600 + "\n"
            "bindd\n\tmodmask: 64\n\tkey: J\n\tdescription: Usable binding\n"
        )
        result = self.helper.snapshot(blocks)
        self.assertEqual(result["rejected"], 1)
        self.assertEqual([b["description"] for b in result["bindings"]], ["Usable binding"])

    def test_json_oversized_record_is_dropped_without_losing_alignment(self):
        raw_json = json.dumps([
            {
                "modmask": 64, "key": "K", "keycode": 0,
                "dispatcher": "exec", "arg": "bad",
                "description": "A" * 600, "submap": "",
            },
            {
                "modmask": 64, "key": "J", "keycode": 0,
                "dispatcher": "exec", "arg": "good",
                "description": "Usable binding", "submap": "",
            },
        ])
        raw_plain = (
            "bindd\n\tmodmask: 64\n\tkey: K\n\tdispatcher: exec\n\targ: bad\n"
            "\tdescription: " + "A" * 600 + "\n\tsubmap:\n"
            "binddp\n\tmodmask: 64\n\tkey: J\n\tdispatcher: exec\n\targ: good\n"
            "\tdescription: Usable binding\n\tsubmap:\n"
        )
        result = self.helper.snapshot_json(raw_json, raw_plain)
        self.assertEqual(result["rejected"], 1)
        self.assertEqual([binding["key"] for binding in result["bindings"]], ["J"])
        self.assertTrue(result["bindings"][0]["dontInhibit"])

    def test_invalid_plain_record_rejects_corresponding_json_safety_record(self):
        raw_json = json.dumps([{
            "modmask": 64, "key": "K", "keycode": 0,
            "dispatcher": "exec", "arg": "safe",
            "description": "Open terminal", "submap": "",
        }])
        raw_plain = (
            "binddp\n\tmodmask: 64\n\tkey: " + "K" * 129
            + "\n\tdispatcher: exec\n\targ: safe\n"
            "\tdescription: Open terminal\n\tsubmap:\n"
        )
        result = self.helper.snapshot_json(raw_json, raw_plain)
        self.assertEqual(result["bindings"], [])
        self.assertEqual(result["rejected"], 1)

    def test_invalid_plain_numbers_and_booleans_reject_only_their_records(self):
        blocks = (
            "bindd\n\tmodmask: 999999999999\n\tkey: K\n"
            "\tdescription: Open terminal\n"
            "bindd\n\tmodmask: 64\n\tkey: J\n\trelease: sometimes\n"
            "\tdescription: Open editor\n"
            "bindd\n\tmodmask: 64\n\tkey: L\n\tdescription: Lock system\n"
        )
        result = self.helper.snapshot(blocks)
        self.assertEqual(result["rejected"], 2)
        self.assertEqual([binding["key"] for binding in result["bindings"]], ["L"])

    def test_unknown_plain_bind_flag_rejects_only_that_record(self):
        blocks = (
            "binddz\n\tmodmask: 64\n\tkey: K\n\tdescription: Open terminal\n"
            "bindd\n\tmodmask: 64\n\tkey: L\n\tdescription: Lock system\n"
        )
        result = self.helper.snapshot(blocks)
        self.assertEqual(result["rejected"], 1)
        self.assertEqual([binding["key"] for binding in result["bindings"]], ["L"])

    def test_field_and_binding_limits_fail_closed(self):
        with self.assertRaises(self.helper.HelperError):
            self.helper.sanitize_text("x" * 513, 512)
        blocks = "\n".join("bind\n\tkey: A" for _ in range(self.helper.MAX_BINDINGS + 1))
        with self.assertRaises(self.helper.HelperError):
            self.helper.snapshot(blocks)

    def test_subprocess_stdout_limit_is_enforced(self):
        with self.assertRaisesRegex(self.helper.HelperError, "stdout byte limit"):
            self.helper.command_output(
                [sys.executable, "-c", "import sys; sys.stdout.write('x' * 4096)"],
                max_stdout=128,
                timeout=1,
            )

    def test_subprocess_stderr_limit_is_enforced(self):
        with self.assertRaisesRegex(self.helper.HelperError, "stderr byte limit"):
            self.helper.command_output(
                [sys.executable, "-c", "import sys; sys.stderr.write('x' * 4096)"],
                max_stderr=128,
                timeout=1,
            )

    def test_subprocess_deadline_is_enforced(self):
        with self.assertRaisesRegex(self.helper.HelperError, "deadline"):
            self.helper.command_output(
                [sys.executable, "-c", "import time; time.sleep(5)"],
                timeout=0.05,
            )

    def test_subprocess_deadline_kills_descendants(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_file = Path(directory) / "child.pid"
            child_code = (
                "import os,pathlib,time; "
                f"pathlib.Path({str(pid_file)!r}).write_text(str(os.getpid())); "
                "time.sleep(5)"
            )
            parent_code = (
                "import subprocess,sys,time; "
                f"subprocess.Popen([sys.executable, '-c', {child_code!r}]); "
                "time.sleep(5)"
            )
            with self.assertRaisesRegex(self.helper.HelperError, "deadline"):
                self.helper.command_output([sys.executable, "-c", parent_code], timeout=0.2)
            child_pid = int(pid_file.read_text())
            for _ in range(20):
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.05)
            else:
                self.fail("descendant process survived the deadline")


if __name__ == "__main__":
    unittest.main()
