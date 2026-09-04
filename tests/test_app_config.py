import importlib.util
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_helper():
    spec = importlib.util.spec_from_loader(
        "app_config_json",
        importlib.machinery.SourceFileLoader("app_config_json", str(ROOT / "bin" / "app-config-json")),
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


helper = load_helper()


class Home:
    """A synthetic home, so every case is a file rather than a mock."""

    def __init__(self):
        self.directory = tempfile.TemporaryDirectory()
        self.path = Path(self.directory.name)

    def write(self, relative: str, text: str) -> None:
        path = self.path / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    def snapshot(self, profile: str) -> dict:
        return helper.snapshot(profile, self.path)

    def close(self) -> None:
        self.directory.cleanup()


class LeaderTests(unittest.TestCase):
    """A leader read wrongly teaches every card the wrong first key; a leader
    not read at all costs the reader one menu. So the rule is written to fail
    towards the second, and these cases pin which side each shape lands on."""

    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def leader(self, body: str) -> dict:
        self.home.write(".config/nvim/lua/config/options.lua", body)
        return self.home.snapshot("lazyvim")

    def test_reads_every_spelling_people_write(self):
        for body, expected in (
            ('vim.g.mapleader = " "', " "),
            ('vim.g.mapleader = ","', ","),
            ("vim.g.mapleader = ';'", ";"),
            ('vim.g.mapleader=" "', " "),
            ('vim.g.mapleader = " " -- space is leader', " "),
            # Vim substitutes mapleader's text into the left-hand side, so
            # "<Space>" is a working spelling and has to mean the space key.
            ('vim.g.mapleader = "<Space>"', " "),
            ('vim.g.mapleader = "\\\\"', "\\"),
            ('vim.g["mapleader"] = ","', ","),
            ("vim.g['mapleader'] = ';'", ";"),
            ('vim.g.mapleader = [[ ]]', " "),
            ('vim.g.mapleader = vim.keycode("<Space>")', " "),
            ('vim.g.mapleader = vim.keycode "<Bslash>"', "\\"),
            ('vim.api.nvim_set_var("mapleader", ",")', ","),
            ('vim.api.nvim_set_var(\n  "mapleader",\n  ";"\n)', ";"),
            ('vim.cmd("let mapleader = \',\'")', ","),
            ('vim.cmd([[let mapleader = ";"]])', ";"),
            ('vim.cmd([[\nlet mapleader = ","\n]])', ","),
        ):
            with self.subTest(body=body):
                self.assertEqual(self.leader(body)["options"].get("leader"), expected)

    def test_reads_both_leaders_together(self):
        found = self.leader('vim.g.mapleader = ","\nvim.g.maplocalleader = "\\\\"')
        self.assertEqual(found["options"], {"leader": ",", "localleader": "\\"})
        self.assertNotIn("leader", found["skipped"])
        self.assertNotIn("localleader", found["skipped"])

    def test_refuses_every_shape_it_cannot_be_sure_of(self):
        for body, reason in (
            ('-- vim.g.mapleader = ","', "never assigned"),
            ('  vim.g.mapleader = ","', "assigned in a shape this cannot read"),
            ('vim.g.mapleader = vim.env.LEADER or " "', "assigned in a shape this cannot read"),
            ('vim.g["mapleader" .. suffix] = ","', "assigned in a shape this cannot read"),
            ('vim.g.mapleader = ","\nvim.g.mapleader = ";"', "assigned more than one value"),
            ("", "never assigned"),
        ):
            with self.subTest(body=body):
                found = self.leader(body)
                self.assertNotIn("leader", found["options"])
                self.assertEqual(found["skipped"]["leader"], reason)

    def test_never_set_is_told_apart_from_could_not_read(self):
        # The difference decides what the interface says: an unset leader means
        # the upstream default applies and needs no attention, while one set in
        # a shape this cannot follow is something the reader has to check.
        self.assertEqual(self.leader("-- nothing here")["skipped"]["leader"], "never assigned")
        self.assertEqual(self.leader("  vim.g.mapleader = ','")["skipped"]["leader"],
                         "assigned in a shape this cannot read")

    def test_reads_the_other_files_a_leader_is_put_in(self):
        self.home.write(".config/nvim/init.lua", 'vim.g.mapleader = "-"')
        self.assertEqual(self.home.snapshot("lazyvim")["options"]["leader"], "-")

    def test_follows_no_require_chain(self):
        # Following one would mean deciding what the configuration loads, which
        # is interpreting it. The value is skipped and the menu covers it.
        self.home.write(".config/nvim/lua/config/options.lua", 'require("config.mine")')
        self.home.write(".config/nvim/lua/config/mine.lua", 'vim.g.mapleader = ","')
        found = self.home.snapshot("lazyvim")
        self.assertNotIn("leader", found["options"])

    def test_values_inside_long_comments_are_not_configuration(self):
        found = self.leader('--[[\nvim.g.mapleader = ","\n]]\n-- nothing active')
        self.assertNotIn("leader", found["options"])
        self.assertEqual(found["skipped"]["leader"], "never assigned")


class ExtrasAndVersionTests(unittest.TestCase):
    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def test_reads_the_enabled_bundles(self):
        self.home.write(".config/nvim/lazyvim.json", json.dumps(
            {"extras": ["lazyvim.plugins.extras.lang.python", "lazyvim.plugins.extras.dap.core"]}))
        self.assertEqual(self.home.snapshot("lazyvim")["extras"],
                         ["lazyvim.plugins.extras.dap.core",
                          "lazyvim.plugins.extras.lang.python"])

    def test_refuses_bundle_names_that_are_not_module_names(self):
        self.home.write(".config/nvim/lazyvim.json", json.dumps(
            {"extras": ["lazyvim.plugins.extras.lang.go", "../../etc/passwd", 42, "x" * 200]}))
        self.assertEqual(self.home.snapshot("lazyvim")["extras"],
                         ["lazyvim.plugins.extras.lang.go"])

    def test_reads_the_installed_version(self):
        self.home.write(".config/nvim/lazy-lock.json", json.dumps(
            {"LazyVim": {"branch": "main", "commit": "459a4c3b1059671e766a46c7cc223827dc67e3d0"}}))
        self.assertEqual(self.home.snapshot("lazyvim")["upstream"]["commit"],
                         "459a4c3b1059671e766a46c7cc223827dc67e3d0")

    def test_malformed_json_is_skipped_rather_than_guessed(self):
        self.home.write(".config/nvim/lazyvim.json", "{not json")
        found = self.home.snapshot("lazyvim")
        self.assertEqual(found["extras"], [])
        self.assertTrue(found["skipped"])

    def test_a_missing_configuration_reads_as_nothing_at_all(self):
        found = self.home.snapshot("lazyvim")
        self.assertEqual(found["options"], {})
        self.assertEqual(found["extras"], [])
        self.assertEqual(found["upstream"], {})


class KeymapTests(unittest.TestCase):
    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def keymaps(self, body: str) -> dict:
        self.home.write(".config/nvim/lua/config/keymaps.lua", body)
        return self.home.snapshot("lazyvim")

    def test_reads_top_level_literal_add_change_and_delete_in_order(self):
        found = self.keymaps(
            'vim.keymap.set("n", "<leader>xx", run_it, { desc = "Do a thing" })\n'
            'vim.keymap.del("n", "<leader>ff")\n'
            'vim.keymap.set({ "n", "v" }, "gZ", function() end, { desc = "Custom action" })\n')
        self.assertEqual(found["bindings"], [
            {"op": "set", "contexts": ["normal"], "lhs": "<leader>xx",
             "desc": "Do a thing"},
            {"op": "del", "contexts": ["normal"], "lhs": "<leader>ff"},
            {"op": "set", "contexts": ["normal", "visual"], "lhs": "gZ",
             "desc": "Custom action"},
        ])
        self.assertEqual(found["bindingSkipped"], {})

    def test_skips_conditional_dynamic_and_undescribed_calls_visibly(self):
        found = self.keymaps(
            '  vim.keymap.set("n", "x", rhs, { desc = "Conditional" })\n'
            'vim.keymap.set("n", "<leader>" .. suffix, rhs, { desc = "Dynamic" })\n'
            'vim.keymap.set("n", "gx", rhs, {})\n'
            'vim.keymap.set(mode, "gy", rhs, { desc = "Dynamic mode" })\n')
        self.assertEqual(found["bindings"], [])
        self.assertEqual(found["bindingSkipped"], {
            "indented": 1, "non-literal-lhs": 1,
            "missing-description": 1, "untrained-mode": 1,
        })

    def test_ignores_comments_and_unrelated_lua(self):
        found = self.keymaps(
            '-- vim.keymap.set("n", "x", rhs, { desc = "No" })\n'
            '--[[\nvim.keymap.set("n", "z", rhs, { desc = "Also no" })\n]]\n'
            'local x = "vim.keymap.set"\nprint(x)\n')
        self.assertEqual(found["bindings"], [])
        self.assertEqual(found["bindingSkipped"], {})

    def test_a_long_string_is_a_string_however_much_it_looks_like_lua(self):
        """Comments are blanked before anything is read; long strings are not,
        because `vim.cmd [[let mapleader = " "]]` needs its own contents. That
        left the other direction open: a `[[ ]]` block quoting configuration as
        documentation had its lines read as configuration."""
        found = self.keymaps(
            'local doc = [[\n'
            'vim.keymap.set("n", "<leader>zz", rhs, { desc = "Quoted" })\n'
            ']]\n'
            'vim.keymap.set("n", "gx", rhs, { desc = "Real" })\n')
        self.assertEqual(found["bindings"], [
            {"op": "set", "contexts": ["normal"], "lhs": "gx", "desc": "Real"}
        ])
        self.assertEqual(found["bindingSkipped"], {})

    def test_an_alias_survives_a_parameter_of_the_same_name(self):
        """`function helper(map) map = ... end` rebinds that function's own
        parameter, not the file's alias. Retiring the alias there dropped every
        call after it."""
        found = self.keymaps(
            'local map = vim.keymap.set\n'
            'map("n", "ga", rhs, { desc = "Before" })\n'
            'local function helper(map)\n  map = wrap(map)\nend\n'
            'map("n", "gb", rhs, { desc = "After" })\n')
        self.assertEqual([entry["lhs"] for entry in found["bindings"]], ["ga", "gb"])
        self.assertEqual(found["bindingSkipped"], {})

    def test_every_shape_it_will_not_follow_is_counted_not_swallowed(self):
        """One case per row of the compatibility matrix's refusing side. Each
        differs from a readable line by exactly the condition being tested."""
        for body, reason in (
            # An unknown wrapper is not a keymap API because it is spelled
            # like one.
            ('my.map.set("n", "gx", rhs, { desc = "Wrapper" })\n', None),
            # Brackets that never close cannot be a complete statement.
            ('vim.keymap.set("n", "gx", rhs, { desc = "Open"\n', "unsupported-shape"),
            # A buffer-local map belongs to one buffer, not to the machine.
            ('vim.api.nvim_buf_set_keymap(0, "n", "gx", rhs, { desc = "Buf" })\n', None),
            # keycode resolves at runtime unless it is handed a literal.
            ('vim.keymap.set("n", vim.keycode(name), rhs, { desc = "Dyn" })\n',
             "non-literal-lhs"),
            # An options table built by a call is not a literal table.
            ('vim.keymap.set("n", "gx", rhs, opts({ desc = "Built" }))\n',
             "dynamic-options"),
            # An alias retired at the top level really is retired.
            ('local map = vim.keymap.set\nmap = other\n'
             'map("n", "gx", rhs, { desc = "After" })\n', "alias-reassigned"),
        ):
            with self.subTest(body=body):
                found = self.keymaps(body)
                self.assertEqual(found["bindings"], [], body)
                if reason:
                    self.assertIn(reason, found["bindingSkipped"], body)

    def test_reads_balanced_multiline_calls(self):
        found = self.keymaps(
            'vim.keymap.set(\n  "n",\n  "gx",\n  rhs,\n  { desc = "Open" }\n)\n')
        self.assertEqual(found["bindings"], [
            {"op": "set", "contexts": ["normal"], "lhs": "gx", "desc": "Open"}
        ])
        self.assertEqual(found["bindingSkipped"], {})

    def test_reads_legacy_apis_literal_aliases_and_option_spellings(self):
        found = self.keymaps(
            'local map = vim.keymap.set\n'
            'map({ "n", "v", }, [[gZ]], function() return ")" end, '
            '{ ["desc"] = [[Open thing]]; silent = true })\n'
            'vim.api.nvim_set_keymap("n", "gx", "<cmd>Open<cr>", { desc = "Open" })\n'
            'vim.api.nvim_del_keymap("n", "gy")\n'
            'local safe = LazyVim.safe_keymap_set\n'
            'safe("n", "gz", require("thing").open, { remap = true, desc = "Safe" })\n')
        self.assertEqual(found["bindings"], [
            {"op": "set", "contexts": ["normal", "visual"], "lhs": "gZ",
             "desc": "Open thing"},
            {"op": "set", "contexts": ["normal"], "lhs": "gx", "desc": "Open"},
            {"op": "del", "contexts": ["normal"], "lhs": "gy"},
            {"op": "set", "contexts": ["normal"], "lhs": "gz", "desc": "Safe"},
        ])

    def test_reassigned_alias_dynamic_options_and_buffer_maps_are_counted(self):
        found = self.keymaps(
            'local map = vim.keymap.set\n'
            'map = custom_map\n'
            'map("n", "gx", rhs, { desc = "Not provable" })\n'
            'vim.keymap.set("n", "gy", rhs, opts)\n'
            'vim.keymap.set("n", "gz", rhs, { buffer = true, desc = "Local" })\n')
        self.assertEqual(found["bindings"], [])
        self.assertEqual(found["bindingSkipped"], {
            "alias-reassigned": 1,
            "dynamic-options": 1,
            "buffer-local": 1,
        })


class TmuxTests(unittest.TestCase):
    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def prefix(self, body: str) -> dict:
        self.home.write(".config/tmux/tmux.conf", body)
        return self.home.snapshot("tmux")

    def test_reads_the_prefix_omarchy_ships(self):
        # Omarchy enables C-Space and keeps C-b as prefix2; resolution later
        # prefers the actually enabled C-b while preserving both answers.
        found = self.prefix("set -g prefix C-Space\nset -g prefix2 C-b\n")
        self.assertEqual(found["options"], {"prefix": "C-Space", "prefix2": "C-b"})
        self.assertEqual(found["skipped"], {})

    def test_the_spare_prefix_is_read_when_present(self):
        # Resolution decides which value is shown; this reader preserves both
        # effective inputs. No prefix2 is the normal case, not a read failure.
        found = self.prefix("set -g prefix2 C-b\n")
        self.assertNotIn("prefix", found["options"])
        self.assertEqual(found["options"]["prefix2"], "C-b")
        self.assertNotIn("prefix2", self.prefix("set -g prefix C-a")["skipped"])

    def test_accepts_the_spellings_tmux_configs_use(self):
        for body in (
            "set -g prefix C-a",
            "set-option -g prefix C-a",
            "  set -g prefix C-a  ",
            "set -gq prefix 'C-a' # comment",
            'set-option -qg prefix "C-a"',
            "set -q -g prefix \\\nC-a",
        ):
            with self.subTest(body=body):
                self.assertEqual(self.prefix(body)["options"]["prefix"], "C-a")

    def test_later_literal_assignment_wins_and_dynamic_loading_falls_back(self):
        self.assertEqual(self.prefix("# set -g prefix C-a")["skipped"]["prefix"], "never set")
        self.assertEqual(
            self.prefix("set -g prefix C-a\nset -g prefix C-b")["options"]["prefix"], "C-b")
        dynamic = self.prefix("set -g prefix C-a\nsource-file ~/.tmux.local.conf")
        self.assertEqual(dynamic["options"], {})
        self.assertIn("dynamically", dynamic["skipped"]["prefix"])

    def test_a_prefix_set_somewhere_conditional_is_not_read_as_certain(self):
        """tmux takes any unambiguous abbreviation of a command name, and its
        own %if blocks are decided when tmux reads the file. Either way what
        runs is not decidable here, so the whole prefix read is refused rather
        than reported as a value."""
        for body in (
            "%if #{==:#{host},laptop}\nset -g prefix C-a\n%endif\n",
            'if -b "true" "set -g prefix C-a"\nset -g prefix C-x\n',
            'run "true"\nset -g prefix C-a\n',
            "sou other.conf\nset -g prefix C-a\n",
        ):
            with self.subTest(body=body):
                found = self.prefix(body)
                self.assertEqual(found["options"], {}, body)
                self.assertEqual(found["skipped"]["prefix"],
                                 "configuration may set prefix dynamically", body)

    def test_prefix2_none_is_an_explicit_absence(self):
        found = self.prefix("set -g prefix C-a\nset -g prefix2 None")
        self.assertEqual(found["options"], {"prefix": "C-a"})
        self.assertNotIn("prefix2", found["skipped"])

    def test_conflicting_fixed_config_files_are_not_guessed(self):
        self.home.write(".config/tmux/tmux.conf", "set -g prefix C-a")
        self.home.write(".tmux.conf", "set -g prefix C-x")
        found = self.home.snapshot("tmux")
        self.assertEqual(found["options"], {})
        self.assertEqual(found["skipped"]["prefix"], "fixed config files disagree")


class BoundsTests(unittest.TestCase):
    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def test_an_oversized_file_is_skipped_rather_than_read(self):
        self.home.write(".config/nvim/lua/config/options.lua",
                        "-- x\n" * (helper.MAX_FILE_BYTES // 5 + 10))
        found = self.home.snapshot("lazyvim")
        self.assertNotIn("leader", found["options"])
        self.assertTrue(found["skipped"])

    def test_a_symlinked_file_is_not_followed(self):
        # The list of files is the contract; a link would let it point anywhere.
        target = self.home.path / "elsewhere.lua"
        target.write_text('vim.g.mapleader = ","', encoding="utf-8")
        link = self.home.path / ".config/nvim/lua/config/options.lua"
        link.parent.mkdir(parents=True, exist_ok=True)
        os.symlink(target, link)
        self.assertNotIn("leader", self.home.snapshot("lazyvim")["options"])

    def test_a_symlinked_parent_directory_is_not_followed(self):
        outside = self.home.path / "outside"
        outside.mkdir()
        (outside / "options.lua").write_text('vim.g.mapleader = ","', encoding="utf-8")
        config = self.home.path / ".config/nvim/lua/config"
        config.parent.mkdir(parents=True)
        os.symlink(outside, config)
        self.assertNotIn("leader", self.home.snapshot("lazyvim")["options"])

    def test_a_fifo_is_refused_without_reading_it(self):
        fifo = self.home.path / ".config/nvim/lua/config/options.lua"
        fifo.parent.mkdir(parents=True, exist_ok=True)
        os.mkfifo(fifo)
        self.assertNotIn("leader", self.home.snapshot("lazyvim")["options"])

    def test_the_output_is_one_bounded_json_line(self):
        self.home.write(".config/tmux/tmux.conf", "set -g prefix C-a")
        import subprocess
        result = subprocess.run(
            [sys.executable, str(ROOT / "bin" / "app-config-json"),
             "--profile", "tmux", "--home", str(self.home.path)],
            capture_output=True, text=True, check=True)
        self.assertEqual(len(result.stdout.strip().splitlines()), 1)
        self.assertEqual(json.loads(result.stdout)["options"], {"prefix": "C-a"})

    def test_an_unusable_home_is_refused_before_anything_is_opened(self):
        import subprocess
        result = subprocess.run(
            [sys.executable, str(ROOT / "bin" / "app-config-json"),
             "--profile", "tmux", "--home", "relative/path"],
            capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("home", result.stdout + result.stderr)

    def test_it_starts_nothing_and_reaches_nowhere(self):
        source = (ROOT / "bin" / "app-config-json").read_text(encoding="utf-8")
        for forbidden in ("subprocess", "socket", "urllib", "http", "os.system", "popen"):
            self.assertNotIn(forbidden, source.split('"""')[2])


if __name__ == "__main__":
    unittest.main()
