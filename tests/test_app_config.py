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
            ('vim.g["mapleader"] = ","', "assigned in a shape this cannot read"),
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


class TmuxTests(unittest.TestCase):
    def setUp(self):
        self.home = Home()
        self.addCleanup(self.home.close)

    def prefix(self, body: str) -> dict:
        self.home.write(".config/tmux/tmux.conf", body)
        return self.home.snapshot("tmux")

    def test_reads_the_prefix_omarchy_ships(self):
        # The shipped table was built against tmux's own C-b, and every Omarchy
        # machine moves it. This is the read that fixes that on its own.
        found = self.prefix("set -g prefix C-Space\nset -g prefix2 C-b\n")
        self.assertEqual(found["options"], {"prefix": "C-Space"})
        self.assertEqual(found["skipped"], {})

    def test_prefix2_is_never_chosen(self):
        # It is the spare. A card teaches the key the status line calls the
        # prefix, not the one kept for muscle memory.
        found = self.prefix("set -g prefix2 C-b\n")
        self.assertNotIn("prefix", found["options"])

    def test_accepts_the_spellings_tmux_configs_use(self):
        for body in ("set -g prefix C-a", "set-option -g prefix C-a", "  set -g prefix C-a  "):
            with self.subTest(body=body):
                self.assertEqual(self.prefix(body)["options"]["prefix"], "C-a")

    def test_refuses_what_it_cannot_be_sure_of(self):
        self.assertEqual(self.prefix("# set -g prefix C-a")["skipped"]["prefix"], "never set")
        self.assertEqual(self.prefix("set -g prefix C-a\nset -g prefix C-b")["skipped"]["prefix"],
                         "set more than once")


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
