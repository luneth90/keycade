import json
import os
import signal
import subprocess
import sys
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RELAY = ROOT / "bin" / "bounded-relay"


def flood_command(total_bytes: int, delimited: bool) -> list[str]:
    marker = "b'\\n'" if delimited else "b''"
    script = (
        "import sys\n"
        f"chunk = b'x' * 65536 + {marker}\n"
        f"sent = 0\n"
        f"while sent < {total_bytes}:\n"
        "    sys.stdout.buffer.write(chunk)\n"
        "    sys.stdout.buffer.flush()\n"
        "    sent += len(chunk)\n"
    )
    return [sys.executable, "-c", script]


class BoundedRelayTests(unittest.TestCase):
    def run_relay(self, *arguments, timeout=20):
        return subprocess.run(
            [str(RELAY), *arguments],
            capture_output=True,
            timeout=timeout,
        )

    def test_absolute_interpreter_and_no_path_lookup(self):
        source = RELAY.read_text(encoding="utf-8")
        self.assertTrue(source.startswith("#!/usr/bin/python3"))
        self.assertNotIn("/usr/bin/env", source)
        self.assertNotIn("shell=True", source)

    def test_untrusted_libc_is_refused(self):
        # The relay degrades rather than loading a library anyone but root can
        # replace, so a planted file has to be rejected before the CDLL call.
        import importlib.machinery
        import importlib.util
        import tempfile

        loader = importlib.machinery.SourceFileLoader("relay", str(RELAY))
        module = importlib.util.module_from_spec(
            importlib.util.spec_from_loader("relay", loader)
        )
        loader.exec_module(module)
        self.assertEqual(
            module._trusted_library(module.LIBC_PATH), module.LIBC_PATH
        )
        with tempfile.TemporaryDirectory() as directory:
            planted = Path(directory) / "libc.so.6"
            planted.write_bytes(b"")
            planted.chmod(0o777)
            with self.assertRaises(OSError):
                module._trusted_library(str(planted))
            with self.assertRaises(OSError):
                module._trusted_library(str(Path(directory) / "missing"))

    def test_relative_and_untrusted_child_commands_are_refused(self):
        relative = self.run_relay(
            "--max-bytes", "1024", "--deadline", "5",
            "--", "python3", "-c", "print('must not run')",
        )
        self.assertEqual(relative.returncode, 2)
        self.assertIn("not an absolute command", json.loads(relative.stdout)["error"])

        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            planted = Path(directory) / "planted-command"
            planted.write_text("#!/usr/bin/bash\nprintf 'must not run\\n'\n", encoding="utf-8")
            planted.chmod(0o755)
            result = self.run_relay(
                "--max-bytes", "1024", "--deadline", "5", "--", str(planted),
            )
        self.assertEqual(result.returncode, 2)
        self.assertIn("not owned by root", json.loads(result.stdout)["error"])

    def test_output_within_budget_passes_through_unchanged(self):
        payload = "hello\nworld\n"
        result = self.run_relay(
            "--max-bytes", "1048576", "--deadline", "5",
            "--", sys.executable, "-c", f"import sys; sys.stdout.write({payload!r})",
        )
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout.decode(), payload)

    def test_undelimited_flood_is_capped(self):
        # The case QML cannot bound on its own: a child that never emits the
        # split marker. The relay must still stop it well short of the flood.
        limit = 65536
        result = self.run_relay(
            "--max-bytes", str(limit), "--deadline", "15",
            "--", *flood_command(32 * 1024 * 1024, delimited=False),
        )
        self.assertEqual(result.returncode, 1)
        self.assertLessEqual(len(result.stdout), limit + 4096)
        # The error record is appended after whatever was forwarded, which in
        # this case carries no delimiter of its own.
        error = json.loads(result.stdout[result.stdout.rindex(b"{"):])
        self.assertEqual(error["type"], "error")
        self.assertIn("byte budget", error["error"])

    def test_delimited_flood_is_capped(self):
        limit = 65536
        result = self.run_relay(
            "--max-bytes", str(limit), "--deadline", "15",
            "--", *flood_command(32 * 1024 * 1024, delimited=True),
        )
        self.assertEqual(result.returncode, 1)
        self.assertLessEqual(len(result.stdout), limit + 4096)

    def test_deadline_is_enforced(self):
        started = time.monotonic()
        result = self.run_relay(
            "--max-bytes", "1048576", "--deadline", "1",
            "--", "/usr/bin/sleep", "10",
        )
        self.assertLess(time.monotonic() - started, 5)
        self.assertEqual(result.returncode, 1)
        self.assertIn("deadline", json.loads(result.stdout)["error"])

    def test_child_is_killed_when_the_relay_is_killed(self):
        # SIGKILL leaves the relay no chance to clean up, so the kernel death
        # signal has to take the child down.
        relay = subprocess.Popen(
            [str(RELAY), "--max-bytes", "1048576", "--deadline", "30",
             "--", sys.executable, "-c",
             "import os, sys, time; sys.stdout.write(str(os.getpid()) + '\\n'); "
             "sys.stdout.flush(); time.sleep(30)"],
            stdout=subprocess.PIPE, text=True,
        )
        try:
            child_pid = int(relay.stdout.readline().strip())
            relay.kill()
            relay.wait(timeout=5)
            deadline = time.monotonic() + 5
            while time.monotonic() < deadline:
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    break
                time.sleep(0.05)
            else:
                os.kill(child_pid, signal.SIGKILL)
                self.fail("child survived the relay")
        finally:
            if relay.poll() is None:
                relay.kill()
                relay.wait()
            relay.stdout.close()

    def test_invalid_budget_and_missing_command_are_refused(self):
        for arguments in (
            ("--max-bytes", "0", "--deadline", "5", "--", "/usr/bin/true"),
            ("--max-bytes", "1024", "--deadline", "0", "--", "/usr/bin/true"),
            ("--max-bytes", "1024", "--deadline", "5", "--"),
        ):
            result = self.run_relay(*arguments)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(json.loads(result.stdout)["type"], "error")

    def test_child_exit_code_is_propagated(self):
        result = self.run_relay(
            "--max-bytes", "1024", "--deadline", "5",
            "--", sys.executable, "-c", "raise SystemExit(7)",
        )
        self.assertEqual(result.returncode, 7)


if __name__ == "__main__":
    unittest.main()
