import importlib.machinery
import importlib.util
import io
import json
import os
import signal
import subprocess
import sys
import tempfile
import time
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]


def load_helper():
    loader = importlib.machinery.SourceFileLoader(
        "tmux_keys_json", str(ROOT / "bin" / "tmux-keys-json"))
    spec = importlib.util.spec_from_loader("tmux_keys_json", loader)
    module = importlib.util.module_from_spec(spec)
    loader.exec_module(module)
    return module


helper = load_helper()


class TmuxLiveTests(unittest.TestCase):
    def test_a_live_listing_becomes_the_same_bounded_pack_shape(self):
        pack = helper.collect(
            'C-Space % Split window horizontally\n'
            'C-Space c Create a new window\n'
            'C-Space C-b Send the prefix key\n',
            {"prefix": "C-b", "prefix2": "C-Space"})
        self.assertEqual(len(pack["bindings"]), 3)
        first = pack["bindings"][0]
        self.assertEqual(first["steps"][0], {"option": "prefix"})
        self.assertEqual(first["steps"][1], {"mods": 0, "text": "%"})
        self.assertEqual(first["alternates"][0][0], {"option": "prefix2"})
        self.assertEqual(first["localId"], "prefix/%")
        self.assertEqual(first["category"], "window")
        self.assertEqual(pack["options"], {"prefix": "C-b", "prefix2": "C-Space"})

    def test_c_b_is_primary_only_when_the_server_actually_enables_it(self):
        self.assertEqual(helper.prefix_options("C-Space", "C-b"),
                          {"prefix": "C-b", "prefix2": "C-Space"})
        self.assertEqual(helper.prefix_options("C-a", "C-x"),
                          {"prefix": "C-a", "prefix2": "C-x"})
        self.assertEqual(helper.prefix_options("C-b", "C-b"), {"prefix": "C-b"})

    def test_no_server_never_reaches_list_keys(self):
        calls = []

        def run(command, _limit):
            calls.append(command)
            return 1, ""

        output = io.StringIO()
        with mock.patch.object(helper, "trusted_command", return_value="/usr/bin/tmux"), \
                mock.patch.object(helper, "command", side_effect=run), redirect_stdout(output):
            helper.main()
        self.assertEqual(calls, [["/usr/bin/tmux", "-N", "has-session"]])
        self.assertFalse(json.loads(output.getvalue())["available"])

    def test_running_server_is_queried_and_emitted(self):
        calls = []

        def run(command, _limit):
            calls.append(command)
            if command[-1] == "has-session":
                return 0, ""
            if command[-2:] == ["-gv", "prefix"]:
                return 0, "C-a\n"
            if command[-2:] == ["-gv", "prefix2"]:
                return 0, "C-b\n"
            return 0, "C-a c Create a new window\n"

        output = io.StringIO()
        with mock.patch.object(helper, "trusted_command", return_value="/usr/bin/tmux"), \
                mock.patch.object(helper, "command", side_effect=run), redirect_stdout(output):
            helper.main()
        result = json.loads(output.getvalue())
        self.assertTrue(result["available"])
        self.assertEqual(result["options"], {"prefix": "C-b", "prefix2": "C-a"})
        self.assertEqual(calls[0], ["/usr/bin/tmux", "-N", "has-session"])
        self.assertEqual(calls[1], ["/usr/bin/tmux", "-N", "show-options", "-gv", "prefix"])
        self.assertEqual(calls[2], ["/usr/bin/tmux", "-N", "show-options", "-gv", "prefix2"])
        self.assertEqual(calls[3],
                         ["/usr/bin/tmux", "-N", "list-keys", "-N", "-T", "prefix"])

    def test_unreadable_lines_and_device_keys_are_counted(self):
        pack = helper.collect("not enough\nC-b PPage Previous page\n")
        self.assertEqual(pack["bindings"], [])
        self.assertEqual(pack["dropped"], {"unreadable-line": 1, "device-special-key": 1})

    def test_the_number_of_lines_examined_is_bounded(self):
        listing = "\n".join("C-b x Action" for _ in range(helper.MAX_LINES + 20))
        pack = helper.collect(listing)
        self.assertEqual(pack["dropped"]["too-many-lines"], 20)

    def test_control_characters_in_description_are_sanitized(self):
        pack = helper.collect("C-b c Create a\x00new\x1b[31m window\n")
        self.assertEqual(len(pack["bindings"]), 1)
        self.assertEqual(pack["bindings"][0]["desc"], "Create a new [31m window")

    def test_control_characters_in_keys_are_refused(self):
        pack = helper.collect("C-b\x00 c Action\nC-b c\x00 Action\n")
        self.assertEqual(pack["bindings"], [])
        self.assertEqual(pack["dropped"]["unreadable-notation"], 2)
        with self.assertRaises(helper.Refused):
            helper.prefix_options("C-b\x00")
        with self.assertRaises(helper.Refused):
            helper.parse_key("C-\x00")


class TmuxProcessTests(unittest.TestCase):
    """R7/R8: the tmux command is trusted, bounded, and dies with the helper."""

    def test_the_tmux_command_is_absolute_and_trusted(self):
        source = (ROOT / "bin" / "tmux-keys-json").read_text(encoding="utf-8")
        self.assertTrue(source.startswith("#!/usr/bin/python3"))
        self.assertNotIn("/usr/bin/env", source)
        self.assertNotIn("start_new_session", source)
        self.assertIn("trusted_command(TMUX)", source)
        self.assertIn('TMUX = "/usr/bin/tmux"', source)
        self.assertIn("ctypes.CDLL(trusted_command(LIBC_PATH)", source)
        self.assertIn("PR_SET_PDEATHSIG", source)

    def test_trusted_command_rejects_untrusted_paths(self):
        with tempfile.TemporaryDirectory() as directory:
            planted = Path(directory) / "tmux"
            planted.write_text("#!/bin/sh\necho pwned\n", encoding="utf-8")
            planted.chmod(0o777)
            with self.assertRaises(OSError):
                helper.trusted_command(str(planted))
            with self.assertRaises(OSError):
                helper.trusted_command(str(Path(directory) / "missing"))

    def test_command_stdout_limit_is_enforced(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "tmux"
            script.write_text(
                f"#!{sys.executable}\n"
                "import sys\n"
                "sys.stdout.write('x' * (512 * 1024))\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with self.assertRaisesRegex(OSError, "limit"):
                helper.command([str(script)], 128)

    def test_command_deadline_is_enforced(self):
        with tempfile.TemporaryDirectory() as directory:
            script = Path(directory) / "tmux"
            script.write_text(
                f"#!{sys.executable}\n"
                "import time\n"
                "time.sleep(5)\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with mock.patch.object(helper, "TIMEOUT", 0.2):
                with self.assertRaisesRegex(OSError, "timed out"):
                    helper.command([str(script)], helper.MAX_STDOUT)

    def test_command_deadline_kills_descendants(self):
        with tempfile.TemporaryDirectory() as directory:
            pid_file = Path(directory) / "child.pid"
            child_code = (
                "import os, pathlib, time; "
                f"pathlib.Path({str(pid_file)!r}).write_text(str(os.getpid())); "
                "time.sleep(30)"
            )
            script = Path(directory) / "tmux"
            script.write_text(
                f"#!{sys.executable}\n"
                "import subprocess, sys, time\n"
                f"subprocess.Popen([sys.executable, '-c', {child_code!r}])\n"
                "time.sleep(30)\n",
                encoding="utf-8",
            )
            script.chmod(0o755)
            with mock.patch.object(helper, "TIMEOUT", 0.4):
                with self.assertRaisesRegex(OSError, "timed out"):
                    helper.command([str(script)], helper.MAX_STDOUT)
            child_pid = int(pid_file.read_text())
            for _ in range(20):
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.05)
            else:
                os.kill(child_pid, signal.SIGKILL)
                self.fail("tmux descendant survived the deadline")

    def test_child_dies_with_the_helper(self):
        script = (
            "import subprocess, sys, time, importlib.machinery, importlib.util\n"
            f"loader = importlib.machinery.SourceFileLoader('tk', {str(ROOT / 'bin' / 'tmux-keys-json')!r})\n"
            "tk = importlib.util.module_from_spec(importlib.util.spec_from_loader('tk', loader))\n"
            "loader.exec_module(tk)\n"
            "child = subprocess.Popen(['/usr/bin/sleep', '30'], preexec_fn=tk._prepare_child)\n"
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
