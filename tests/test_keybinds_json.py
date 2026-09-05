import ctypes
import importlib.machinery
import pwd
import importlib.util
import json
import os
import signal
import sys
import subprocess
import tempfile
import time
import unittest
from unittest import mock
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOME = pwd.getpwuid(os.getuid()).pw_dir
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
        lines = [json.loads(line) for line in result.stdout.splitlines() if line.strip()]
        self.assertEqual(lines[0]["schemaVersion"], 1)
        self.assertEqual(lines[0]["type"], "header")
        self.assertEqual(lines[0]["count"], len(lines) - 1)
        self.assertTrue(all(record["type"] == "binding" for record in lines[1:]))

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

    def test_commands_and_interpreter_are_absolute_and_trusted(self):
        # Nothing the long-lived plugin executes may be resolved through PATH.
        source = SCRIPT.read_text(encoding="utf-8")
        self.assertTrue(source.startswith("#!/usr/bin/python3"))
        self.assertNotIn("/usr/bin/env", source)
        self.assertNotIn('"hyprctl"', source)
        self.assertEqual(self.helper.HYPRCTL_PATH, "/usr/bin/hyprctl")
        self.assertEqual(self.helper.trusted_command("/usr/bin/hyprctl"), "/usr/bin/hyprctl")

    def test_trusted_command_rejects_untrusted_paths(self):
        with tempfile.TemporaryDirectory() as directory:
            planted = Path(directory) / "hyprctl"
            planted.write_text("#!/bin/sh\necho pwned\n", encoding="utf-8")
            planted.chmod(0o777)
            # Owned by the user rather than root, and world writable.
            with self.assertRaises(self.helper.HelperError):
                self.helper.trusted_command(str(planted))
            with self.assertRaises(self.helper.HelperError):
                self.helper.trusted_command(str(Path(directory) / "missing"))

    def test_child_environment_is_rebuilt_not_inherited(self):
        with mock.patch.dict(
            os.environ,
            {"HYPRLAND_INSTANCE_SIGNATURE": "sig", "XDG_RUNTIME_DIR": "/run/user/1",
             "LD_PRELOAD": "/tmp/evil.so", "PATH": "/tmp/evil"},
            clear=True,
        ):
            environment = self.helper.child_environment()
        self.assertEqual(
            environment,
            {"PATH": "/usr/bin", "HYPRLAND_INSTANCE_SIGNATURE": "sig", "XDG_RUNTIME_DIR": "/run/user/1"},
        )

    def test_child_dies_with_the_helper(self):
        # A helper killed with SIGKILL cannot run cleanup code, so the kernel
        # death signal has to take the child down instead.
        script = (
            "import subprocess, sys, time, importlib.machinery, importlib.util\n"
            f"loader = importlib.machinery.SourceFileLoader('kb', {str(SCRIPT)!r})\n"
            "kb = importlib.util.module_from_spec(importlib.util.spec_from_loader('kb', loader))\n"
            "loader.exec_module(kb)\n"
            "child = subprocess.Popen(['/usr/bin/sleep', '30'], preexec_fn=kb._prepare_child)\n"
            "print(child.pid, flush=True)\n"
            "time.sleep(30)\n"
        )
        helper = subprocess.Popen(
            [sys.executable, "-c", script], stdout=subprocess.PIPE, text=True
        )
        try:
            child_pid = int(helper.stdout.readline().strip())
            helper.kill()
            helper.wait(timeout=5)
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
            if helper.poll() is None:
                helper.kill()
                helper.wait()
            helper.stdout.close()

    def test_stream_records_stay_small_and_line_delimited(self):
        # The QML consumer bounds the stream while reading, which only works
        # if no single record can be large.
        result = subprocess.run(
            [str(SCRIPT), "--input", str(ROOT / "tests/fixtures/binds.txt"),
             "--devices-input", str(ROOT / "tests/fixtures/devices.txt")],
            check=True, capture_output=True, text=True,
        )
        lines = [line for line in result.stdout.splitlines() if line.strip()]
        self.assertGreater(len(lines), 1)
        for line in lines:
            self.assertLessEqual(len(line.encode("utf-8")), self.helper.MAX_RECORD_BYTES)

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


class FakeXkb:
    """A stand-in for libxkbcommon with a hand-written base-level keymap.

    Keeps the keymap tests independent of whichever xkeyboard-config the host
    happens to ship, while still exercising the real call sequence.
    """

    def __init__(self, syms=None, num_layouts=1):
        self.syms = syms if syms is not None else {ord(","): [59], ord("/"): [61]}
        self.num_layouts = num_layouts

    def xkb_keysym_from_name(self, name, flags):
        table = {
            b"comma": ord(","), b"slash": ord("/"), b"minus": ord("-"),
            b"BackSpace": 0xFF08, b"Delete": 0xFFFF, b"less": ord("<"),
        }
        return table.get(name, 0)


def fake_keymap(syms=None):
    return {"source": "global-rmlvo", "syms": syms if syms is not None else {ord(","): [59]},
            "library": FakeXkb(syms)}


class KeymapResolutionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.helper = load_helper()
        cls.binds = (ROOT / "tests/fixtures/binds.txt").read_text()
        cls.devices = (ROOT / "tests/fixtures/devices.txt").read_text()

    def options(self, **overrides):
        values = {name: {"option": f"input:{name}", "str": ""} for name in self.helper.RMLVO_NAMES}
        values["kb_file"] = {"option": "input:kb_file", "str": self.helper.HYPRLAND_EMPTY}
        values["resolve_binds_by_sym"] = {"option": "input:resolve_binds_by_sym", "bool": False}
        for name, value in overrides.items():
            values[name] = value
        return values

    def test_rmlvo_accepts_real_hyprland_values(self):
        options = self.options(
            kb_layout={"str": "us,de"}, kb_model={"str": "pc105"},
            kb_options={"str": "compose:caps,shift:both_capslock_cancel"},
        )
        self.assertEqual(
            self.helper.validated_rmlvo(options),
            ("", "pc105", "us,de", "", "compose:caps,shift:both_capslock_cancel"),
        )

    def test_rmlvo_rejects_values_that_reach_the_filesystem(self):
        # These strings come from the user's config and are handed to an API
        # that resolves names to files; an absolute path makes libxkbcommon
        # open and parse it.
        for value in ("/etc/passwd", "../../../etc/passwd", "a/b", "..", "x" * 129, "a b"):
            with self.subTest(value=value):
                self.assertIsNone(self.helper.validated_rmlvo(self.options(kb_layout={"str": value})))

    def test_kb_file_sentinel_is_read_as_unset(self):
        self.assertEqual(self.helper.option_text(self.options(), "kb_file"), "")
        self.assertEqual(
            self.helper.option_text(self.options(kb_file={"str": "/home/u/map.xkb"}), "kb_file"),
            "/home/u/map.xkb",
        )

    def test_keymap_options_parses_the_batched_reply(self):
        reply = "\n\n".join(
            json.dumps({"option": f"input:{name}", "str": "us" if name == "kb_layout" else ""})
            for name in self.helper.KEYMAP_OPTION_NAMES
        )
        with mock.patch.object(self.helper, "command_output", return_value=reply), \
                mock.patch.object(self.helper, "trusted_command", side_effect=lambda path: path):
            options = self.helper.keymap_options()
        self.assertEqual(options["kb_layout"]["str"], "us")
        self.assertEqual(set(options), set(self.helper.KEYMAP_OPTION_NAMES))

    def test_keymap_options_requires_every_option(self):
        with mock.patch.object(self.helper, "command_output", return_value='{"option":"input:kb_layout","str":"us"}'), \
                mock.patch.object(self.helper, "trusted_command", side_effect=lambda path: path):
            with self.assertRaises(self.helper.HelperError):
                self.helper.keymap_options()

    def test_user_xkb_override_degrades(self):
        with tempfile.TemporaryDirectory() as home:
            entry = mock.Mock(pw_dir=home)
            with mock.patch.object(self.helper.pwd, "getpwuid", return_value=entry):
                self.assertFalse(self.helper.user_xkb_override_present())
                (Path(home) / ".config" / "xkb").mkdir(parents=True)
                self.assertTrue(self.helper.user_xkb_override_present())

    def test_devices_must_all_follow_the_global_layout(self):
        rmlvo = ("", "", "us", "", "")

        def section(layout):
            return f'\tKeyboard at 0x1:\n\t\trules: r "", m "", l "{layout}", v "", o ""'

        self.assertTrue(self.helper.devices_follow_global(
            f"{section('us')}\n{section('us')}", rmlvo))
        self.assertFalse(self.helper.devices_follow_global(
            f"{section('us')}\n{section('de')}", rmlvo))
        self.assertFalse(self.helper.devices_follow_global("", rmlvo))
        # A keyboard whose rule line is missing must not be answered for by the
        # keyboards that did parse.
        self.assertFalse(self.helper.devices_follow_global(
            f"{section('us')}\n\tKeyboard at 0x2:\n\t\tactive layout index: 0", rmlvo))

    def test_keysym_candidate_mirrors_canonical_key_preprocessing(self):
        self.assertEqual(self.helper.keysym_candidate("SUPER + ALT + comma"), "comma")
        self.assertEqual(self.helper.keysym_candidate("SLASH"), "SLASH")
        for skipped in ("SUPER + code:10", "code:10", "mouse:272", "mouse_up",
                        "switch:off:Lid Switch", ""):
            with self.subTest(skipped=skipped):
                self.assertEqual(self.helper.keysym_candidate(skipped), "")

    def test_keycode_map_is_indexed_by_canonical_key(self):
        self.assertEqual(
            self.helper.keycode_map(["comma", "SUPER + ALT + slash"],
                                    fake_keymap({ord(","): [59], ord("/"): [61]}), False),
            {",": [59], "/": [61]})

    def test_keycode_map_skips_keys_with_no_base_level_code(self):
        # A layout where nothing produces slash unshifted: the bind cannot be
        # pressed there, and Hyprland would not fire it either.
        self.assertEqual(
            self.helper.keycode_map(["comma", "slash"], fake_keymap({ord(","): [59]}), False),
            {",": [59]})

    def test_keycode_map_keeps_every_code_for_one_keysym(self):
        self.assertEqual(
            self.helper.keycode_map(["comma"], fake_keymap({ord(","): [59, 91]}), False)[","],
            [59, 91])

    def test_keycode_map_unions_backspace_into_delete_for_apple_keyboards(self):
        keymap = fake_keymap({0xFFFF: [119], 0xFF08: [22]})
        self.assertEqual(self.helper.keycode_map(["Delete"], keymap, True)["DELETE"], [119, 22])
        self.assertEqual(self.helper.keycode_map(["Delete"], keymap, False)["DELETE"], [119])

    def test_keycode_map_refuses_conflicting_spellings(self):
        # Two raw names that canonicalize to one displayed key but resolve to
        # different physical keys. One entry cannot express both.
        keymap = fake_keymap({ord(","): [59], ord("<"): [94]})
        keymap["library"].xkb_keysym_from_name = (
            lambda name, flags: {b"comma": ord(","), b"COMMA": ord("<")}.get(name, 0)
        )
        with self.assertRaises(self.helper.HelperError):
            self.helper.keycode_map(["comma", "COMMA"], keymap, False)

    def test_keycode_map_limits_fail_closed(self):
        syms = {index: [index] for index in range(400)}
        keymap = {"source": "global-rmlvo", "syms": syms, "library": FakeXkb(syms)}
        keymap["library"].xkb_keysym_from_name = lambda name, flags: int(name)
        with self.assertRaises(self.helper.HelperError):
            self.helper.keycode_map([str(index) for index in range(400)], keymap, False)

    def test_keymap_fields_report_no_keymap_when_degraded(self):
        self.assertEqual(self.helper.keymap_fields(["comma"], None, False),
                         {"keymapSource": "none", "keycodeMap": {}})

    def test_an_empty_map_is_a_conclusion_not_a_failure(self):
        # Nothing named a keysym, and nothing named is reachable here: both are
        # determinate answers, and neither depends on unrelated bindings.
        for raw_keys in (["code:10", "mouse_up"], ["nothing-resolves"], []):
            with self.subTest(raw_keys=raw_keys):
                self.assertEqual(
                    self.helper.keymap_fields(raw_keys, fake_keymap(), False),
                    {"keymapSource": "global-rmlvo", "keycodeMap": {}})

    def test_snapshot_carries_the_keymap_fields(self):
        degraded = self.helper.snapshot(self.binds, self.devices)
        self.assertEqual(degraded["keymapSource"], "none")
        self.assertEqual(degraded["keycodeMap"], {})

    def test_snapshot_raw_keys_stay_aligned_when_a_record_is_rejected(self):
        # Rejecting the first record must not shift the raw keys of the ones
        # that follow: only the third binding carries a resolvable key here, so
        # a shifted list would look up "3" or "code:12" and resolve nothing.
        broken = self.binds.replace("key: 3", "key: " + "x" * 200, 1)
        keymap = fake_keymap({ord("W"): [25]})
        keymap["library"].xkb_keysym_from_name = lambda name, flags: {b"W": ord("W")}.get(name, 0)
        result = self.helper.snapshot(broken, self.devices, keymap)
        self.assertEqual(result["rejected"], 1)
        self.assertEqual(result["keycodeMap"], {"W": [25]})

    def test_stream_header_carries_the_keymap_fields(self):
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--input", str(ROOT / "tests/fixtures/binds.txt"),
             "--devices-input", str(ROOT / "tests/fixtures/devices.txt")],
            capture_output=True, text=True, timeout=20,
        )
        header = json.loads(result.stdout.splitlines()[0])
        self.assertEqual(header["type"], "header")
        self.assertEqual(header["keymapSource"], "none")
        self.assertEqual(header["keycodeMap"], {})

    def test_library_is_absolute_and_trusted(self):
        source = SCRIPT.read_text(encoding="utf-8")
        self.assertIn('LIBXKBCOMMON_PATH = "/usr/lib/libxkbcommon.so.0"', source)
        self.assertIn("ctypes.CDLL(trusted_command(LIBXKBCOMMON_PATH)", source)
        # The system XKB directory is whatever the library reports, never a
        # hardcoded guess, and no user directory is ever appended.
        self.assertNotIn("/usr/share/X11/xkb", source)
        self.assertIn("xkb_context_include_path_append_default", source)
        self.assertNotIn("xkb_context_include_path_append(", source)

    def test_every_library_load_is_checked_not_just_absolute(self):
        # R7 covers dynamic libraries, and an absolute path only says where the
        # file is, not who may replace it. Every CDLL argument in a keep-loaded
        # path therefore goes through the same root-owned, non-writable check
        # the commands do.
        loaders = ("trusted_command(", "_trusted_library(")
        keep_loaded = (
            "keybinds-json", "bounded-relay", "state-store",
            "herdr-keys-json", "tmux-keys-json", "app-config-json",
        )
        for script in keep_loaded:
            source = (ROOT / "bin" / script).read_text(encoding="utf-8")
            for index, tail in enumerate(source.split("ctypes.CDLL(")[1:]):
                with self.subTest(script=script, load=index):
                    self.assertTrue(
                        tail.startswith(loaders),
                        f"{script}: unchecked ctypes.CDLL({tail[:40]}...)",
                    )

    def test_no_library_is_loaded_by_soname(self):
        # R7: keep-loaded paths must not resolve executable code, shared
        # objects included, through the loader's ambient search.
        keep_loaded = (
            "keybinds-json", "bounded-relay", "state-store",
            "herdr-keys-json", "tmux-keys-json", "app-config-json",
        )
        for script in keep_loaded:
            source = (ROOT / "bin" / script).read_text(encoding="utf-8")
            with self.subTest(script=script):
                self.assertNotIn('CDLL("lib', source)
                self.assertNotIn("CDLL('lib", source)

    def test_resolve_keymap_degrades_instead_of_raising(self):
        for failure in (OSError("gone"), self.helper.HelperError("no hyprctl")):
            with self.subTest(failure=type(failure).__name__):
                with mock.patch.object(self.helper, "keymap_options", side_effect=failure):
                    self.assertIsNone(self.helper.resolve_keymap(self.devices, session_home=HOME))

    def test_resolve_keymap_degrades_on_kb_file_and_user_overrides(self):
        with mock.patch.object(self.helper, "keymap_options",
                               return_value=self.options(kb_file={"str": "/home/u/map.xkb"})):
            self.assertIsNone(self.helper.resolve_keymap(self.devices, session_home=HOME))
        with mock.patch.object(self.helper, "keymap_options", return_value=self.options()), \
                mock.patch.object(self.helper, "user_xkb_override_present", return_value=True):
            self.assertIsNone(self.helper.resolve_keymap(self.devices, session_home=HOME))

    def test_resolve_keymap_degrades_when_the_library_is_unavailable(self):
        with mock.patch.object(self.helper, "keymap_options", return_value=self.options()), \
                mock.patch.object(self.helper, "user_xkb_override_present", return_value=False), \
                mock.patch.object(self.helper, "xkb_library", side_effect=OSError("missing")):
            self.assertIsNone(self.helper.resolve_keymap(self.devices, session_home=HOME))

    def test_a_broken_keymap_path_never_costs_the_snapshot(self):
        # Judging is an enhancement: every failure inside it degrades.
        for failure in (self.helper.HelperError("boom"), OSError("boom"),
                        ValueError("boom"), AttributeError("boom")):
            with self.subTest(failure=type(failure).__name__):
                with mock.patch.object(self.helper, "keymap_options", side_effect=failure):
                    self.assertIsNone(self.helper.resolve_keymap(self.devices, session_home=HOME))

        exploding = fake_keymap()
        exploding["library"].xkb_keysym_from_name = mock.Mock(side_effect=OSError("boom"))
        result = self.helper.snapshot(self.binds, self.devices, exploding)
        self.assertEqual(result["keymapSource"], "none")
        self.assertEqual(len(result["bindings"]), 3)


class KeymapReviewRegressionTests(unittest.TestCase):
    """One test per finding from the branch review, so none can return."""

    @classmethod
    def setUpClass(cls):
        cls.helper = load_helper()
        cls.devices = (ROOT / "tests/fixtures/devices.txt").read_text()

    def options(self, **overrides):
        values = {name: {"option": f"input:{name}", "str": ""} for name in self.helper.RMLVO_NAMES}
        values["kb_file"] = {"option": "input:kb_file", "str": self.helper.HYPRLAND_EMPTY}
        values["resolve_binds_by_sym"] = {"option": "input:resolve_binds_by_sym", "bool": False}
        values.update(overrides)
        return values

    def test_include_path_environment_is_cleared_before_the_context_is_built(self):
        # XKB_CONFIG_ROOT replaces the system path outright and the others
        # prepend user directories, so the search path must not be steerable
        # by whatever environment the helper was started with.
        # A whitelist, so a variable the library starts reading later cannot
        # slip through: libxkbcommon has four XKB_CONFIG_* path variables today.
        self.assertEqual(
            set(self.helper.HELPER_ENVIRONMENT_KEYS),
            {"PATH", "HYPRLAND_INSTANCE_SIGNATURE", "XDG_RUNTIME_DIR"},
        )
        environment = {"PATH": "/usr/bin", "XKB_CONFIG_ROOT": "/tmp", "HOME": "/tmp"}
        with mock.patch.dict(self.helper.os.environ, environment, clear=True):
            self.helper.scrub_environment()
            self.assertEqual(dict(self.helper.os.environ), {"PATH": "/usr/bin"})

    def test_include_paths_must_be_root_owned_and_not_writable(self):
        self.assertTrue(self.helper.trusted_directory("/usr/share"))
        self.assertFalse(self.helper.trusted_directory("/tmp"))  # world writable
        with tempfile.TemporaryDirectory() as owned:
            self.assertFalse(self.helper.trusted_directory(owned))  # not root owned
            self.assertFalse(self.helper.trusted_directory(owned + "/missing"))

    def test_untrusted_include_path_degrades(self):
        library = mock.Mock()
        library.xkb_context_num_include_paths.return_value = 2
        library.xkb_context_include_path_get.side_effect = [b"/usr/share", b"/tmp"]
        self.assertFalse(self.helper.system_include_paths(library, 1))
        library.xkb_context_num_include_paths.return_value = 0
        self.assertFalse(self.helper.system_include_paths(library, 1))

    def test_launcher_can_report_an_overridden_xkb_environment(self):
        with mock.patch.object(self.helper, "keymap_options") as options:
            self.assertIsNone(self.helper.resolve_keymap(self.devices, True, HOME))
            options.assert_not_called()

    def test_resolve_binds_by_sym_must_be_a_real_boolean(self):
        # Checked directly rather than through resolve_keymap(): a run that
        # degrades earlier would let a broken schema check pass unnoticed.
        for value in ({"str": "true"}, {"bool": 1}, {"bool": None}, {"bool": "true"}, {}):
            with self.subTest(value=value):
                with self.assertRaises(self.helper.HelperError):
                    self.helper.resolve_by_sym(self.options(resolve_binds_by_sym=value))
        self.assertTrue(self.helper.resolve_by_sym(self.options(resolve_binds_by_sym={"bool": True})))
        self.assertFalse(self.helper.resolve_by_sym(self.options(resolve_binds_by_sym={"bool": False})))

    def test_duplicate_or_unknown_options_are_refused(self):
        for reply in (
            '{"option":"input:kb_layout","str":"us"}\n{"option":"input:kb_layout","str":"de"}',
            '{"option":"input:kb_repeat_rate","int":25}',
        ):
            with self.subTest(reply=reply[:40]):
                with mock.patch.object(self.helper, "command_output", return_value=reply), \
                        mock.patch.object(self.helper, "trusted_command", side_effect=lambda path: path):
                    with self.assertRaises(self.helper.HelperError):
                        self.helper.keymap_options()

    def test_too_many_keycodes_for_one_keysym_degrades_instead_of_truncating(self):
        library = mock.Mock()
        library.xkb_keymap_min_keycode.return_value = 8
        library.xkb_keymap_max_keycode.return_value = 8 + self.helper.MAX_KEYCODES_PER_ENTRY
        keysym = ctypes.c_uint32(0x61)

        def one_sym(keymap, code, layout, level, out):
            out._obj.contents = keysym
            return 1
        library.xkb_keymap_key_get_syms_by_level.side_effect = one_sym
        with self.assertRaises(self.helper.HelperError):
            self.helper.base_keysyms(library, 1)

    def test_apple_union_overflow_degrades_instead_of_truncating(self):
        codes = list(range(self.helper.MAX_KEYCODES_PER_ENTRY))
        keymap = fake_keymap({0xFFFF: codes, 0xFF08: [200]})
        with self.assertRaises(self.helper.HelperError):
            self.helper.keycode_map(["Delete"], keymap, True)

    def test_an_unresolvable_spelling_cannot_borrow_another_ones_keys(self):
        # canonical_key() maps both "enter" and "return" to RETURN, but only
        # "return" names a keysym. One entry cannot say RETURN is pressable for
        # the first spelling and not for the second, so the table is refused.
        keymap = fake_keymap({0xFF0D: [36]})
        keymap["library"].xkb_keysym_from_name = (
            lambda name, flags: {b"return": 0xFF0D}.get(name, 0)
        )
        for order in (["return", "enter"], ["enter", "return"]):
            with self.subTest(order=order):
                with self.assertRaises(self.helper.HelperError):
                    self.helper.keycode_map(order, keymap, False)

    def test_unrelated_bindings_cannot_change_a_verdict(self):
        # Adding a binding that has nothing to do with RETURN must not decide
        # whether return/enter are judged by keycode or fall back to characters.
        keymap = fake_keymap({0xFF0D: [36], ord(","): [59]})
        keymap["library"].xkb_keysym_from_name = (
            lambda name, flags: {b"return": 0xFF0D, b"comma": ord(",")}.get(name, 0)
        )
        for raw_keys in (["return", "enter"], ["return", "enter", "comma"]):
            with self.subTest(raw_keys=raw_keys):
                self.assertEqual(
                    self.helper.keymap_fields(raw_keys, keymap, False),
                    {"keymapSource": "none", "keycodeMap": {}})

    def test_rmlvo_whitelist_is_anchored_at_both_ends(self):
        # Python's "$" also matches before a trailing newline.
        self.assertIsNone(self.helper.validated_rmlvo(self.options(kb_layout={"str": "us\n"})))
        self.assertIsNotNone(self.helper.validated_rmlvo(self.options(kb_layout={"str": "us"})))

    def test_session_home_must_match_the_passwd_home(self):
        # The override directories are looked up under the passwd home, so a
        # session with a different HOME would have them searched elsewhere.
        self.assertTrue(self.helper.session_home_matches_passwd(HOME))
        for value in ("/somewhere/else", "", "relative/path", "/" + "a" * 4096,
                      "/home/\x00", "/home/\n"):
            with self.subTest(value=value[:20]):
                self.assertFalse(self.helper.session_home_matches_passwd(value))
        with mock.patch.object(self.helper, "keymap_options") as options:
            self.assertIsNone(self.helper.resolve_keymap(self.devices, False, "/somewhere/else"))
            options.assert_not_called()

    def test_a_missing_passwd_entry_degrades_instead_of_failing(self):
        # The keymap path is an enhancement; nothing in it may cost a snapshot.
        with mock.patch.object(self.helper.pwd, "getpwuid", side_effect=KeyError("no entry")):
            self.assertFalse(self.helper.session_home_matches_passwd(HOME))
            self.assertIsNone(self.helper.resolve_keymap(self.devices, False, HOME))

    def test_keycode_range_outside_the_schema_degrades(self):
        library = mock.Mock()
        for first, last in ((8, self.helper.MAX_KEYCODE + 1), (100, 8)):
            with self.subTest(first=first, last=last):
                library.xkb_keymap_min_keycode.return_value = first
                library.xkb_keymap_max_keycode.return_value = last
                with self.assertRaises(self.helper.HelperError):
                    self.helper.base_keysyms(library, 1)

    def test_extension_path_variables_cannot_reach_the_context(self):
        # Both were missing from the earlier blacklist and each injects a
        # user-writable directory into the default include path.
        for name in ("XKB_CONFIG_VERSIONED_EXTENSIONS_PATH",
                     "XKB_CONFIG_UNVERSIONED_EXTENSIONS_PATH"):
            with self.subTest(name=name):
                result = subprocess.run(
                    [sys.executable, str(SCRIPT), "--session-home", HOME, "--pretty"],
                    capture_output=True, text=True, timeout=30,
                    env={"PATH": "/usr/bin", name: "/tmp",
                         "HYPRLAND_INSTANCE_SIGNATURE": os.environ.get("HYPRLAND_INSTANCE_SIGNATURE", ""),
                         "XDG_RUNTIME_DIR": os.environ.get("XDG_RUNTIME_DIR", "")},
                )
                if result.returncode != 0:
                    self.skipTest("no compositor reachable")
                snapshot = json.loads(result.stdout)
                # Stripped by the whitelist, so the run is unaffected.
                self.assertEqual(snapshot["keymapSource"], "global-rmlvo")


class CanonicalKeyAgreementTests(unittest.TestCase):
    """The producer and the consumer must normalise keys identically.

    The keycode map is indexed by canonical_key()'s output and looked up with
    InputNormalizer canonicalKey(), so any disagreement silently drops a
    binding. tests/qml/tst_algorithms.qml holds the other side to the same
    corpus.
    """

    @classmethod
    def setUpClass(cls):
        cls.helper = load_helper()
        text = (ROOT / "tests/fixtures/canonical-keys.js").read_text(encoding="utf-8")
        cls.pairs = json.loads(text[text.index("["):text.rindex("]") + 1])

    def test_corpus_covers_every_alias(self):
        self.assertGreater(len(self.pairs), 20)
        covered = {raw.lower() for raw, _ in self.pairs}
        for alias in self.helper.KEY_ALIASES:
            self.assertIn(alias, covered, f"{alias} is not in the shared corpus")

    def test_producer_matches_the_corpus(self):
        for raw, expected in self.pairs:
            with self.subTest(raw=raw):
                self.assertEqual(self.helper.canonical_key(raw)[0], expected)

    def test_single_letters_are_upper_cased(self):
        # canonicalKey() upper-cases single characters, so a lower-case bind
        # produced "q" here against "Q" there and lost the binding.
        self.assertEqual(self.helper.canonical_key("q")[0], "Q")
        self.assertEqual(self.helper.canonical_key("SUPER + q")[0], "Q")

    def test_a_lower_case_binding_is_still_reachable(self):
        binds = (ROOT / "tests/fixtures/binds.txt").read_text().replace("key: 3", "key: q", 1)
        keymap = fake_keymap({ord("q"): [24]})
        keymap["library"].xkb_keysym_from_name = lambda name, flags: {b"q": ord("q")}.get(name, 0)
        snapshot = self.helper.snapshot(binds, "", keymap)
        self.assertEqual(snapshot["bindings"][0]["key"], "Q")
        self.assertEqual(snapshot["keycodeMap"], {"Q": [24]})
