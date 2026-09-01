import importlib.machinery
import importlib.util
import json
import subprocess
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
        self.assertEqual(len(result["bindings"]), 3)
        self.assertEqual(result["bindings"][0]["key"], "3")
        self.assertEqual(result["bindings"][1]["matchMode"], "physical")
        self.assertEqual(result["bindings"][1]["keycode"], 12)

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


if __name__ == "__main__":
    unittest.main()
