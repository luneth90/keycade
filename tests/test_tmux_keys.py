import importlib.machinery
import importlib.util
import io
import json
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
        self.assertEqual(calls, [["/usr/bin/tmux", "has-session"]])
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
        self.assertEqual(calls[1], ["/usr/bin/tmux", "show-options", "-gv", "prefix"])
        self.assertEqual(calls[2], ["/usr/bin/tmux", "show-options", "-gv", "prefix2"])
        self.assertEqual(calls[3],
                         ["/usr/bin/tmux", "list-keys", "-N", "-T", "prefix"])

    def test_unreadable_lines_and_device_keys_are_counted(self):
        pack = helper.collect("not enough\nC-b PPage Previous page\n")
        self.assertEqual(pack["bindings"], [])
        self.assertEqual(pack["dropped"], {"unreadable-line": 1, "device-special-key": 1})

    def test_the_number_of_lines_examined_is_bounded(self):
        listing = "\n".join("C-b x Action" for _ in range(helper.MAX_LINES + 20))
        pack = helper.collect(listing)
        self.assertEqual(pack["dropped"]["too-many-lines"], 20)


if __name__ == "__main__":
    unittest.main()
