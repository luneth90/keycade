import json
import re
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import build_packs  # noqa: E402


def corpus(name: str):
    text = (ROOT / "tests/fixtures/text-keys.js").read_text(encoding="utf-8")
    start = text.index(f"var {name} = [") + len(f"var {name} = ")
    return json.loads(text[start : text.index("\n]", start) + 2])


class NotationTests(unittest.TestCase):
    """The producer and the consumer must read one notation identically.

    tools/build_packs.py writes the steps into assets/packs/*.json and
    lib/TextKey.js judges key presses against them, so a disagreement teaches
    an answer the trainer will never accept. tests/qml/tst_algorithms.qml holds
    the other side to this same corpus.
    """

    def test_producer_matches_the_corpus(self):
        pairs = corpus("pairs")
        self.assertGreater(len(pairs), 20)
        for notation, expected in pairs:
            with self.subTest(notation=notation):
                self.assertEqual(build_packs.parse_notation(notation), expected)

    def test_refused_notations_are_refused(self):
        for notation in corpus("rejected"):
            with self.subTest(notation=notation):
                with self.assertRaises(build_packs.Rejected):
                    build_packs.parse_notation(notation)

    def test_a_configurable_key_becomes_a_placeholder_not_a_character(self):
        # A pack must not bake in the key the table was built with: LazyVim's
        # leader, tmux's prefix and herdr's prefix are all settings, and
        # someone who moved theirs still has to be training the mapping.
        steps = build_packs.parse_notation(build_packs.LEADER_MARK + "ff")
        self.assertEqual(steps[0], {"option": "leader"})
        self.assertEqual(steps[1:], [{"mods": 0, "text": "f"}, {"mods": 0, "text": "f"}])
        local = build_packs.parse_notation(build_packs.LOCALLEADER_MARK + "r")
        self.assertEqual(local[0], {"option": "localleader"})
        self.assertEqual(build_packs.parse_notation(build_packs.PREFIX_MARK)[0],
                         {"option": "prefix"})

    def test_case_survives_without_a_modifier_and_is_folded_with_one(self):
        self.assertEqual(build_packs.parse_notation("gG"),
                         [{"mods": 0, "text": "g"}, {"mods": 0, "text": "G"}])
        self.assertEqual(build_packs.parse_notation("<C-W>"), [{"mods": 4, "text": "w"}])
        self.assertEqual(build_packs.parse_notation("<S-h>"), [{"mods": 0, "text": "H"}])


class PackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.packs = {path.stem: json.loads(path.read_text(encoding="utf-8"))
                     for path in sorted((ROOT / "assets" / "packs").glob("*.json"))}

    def test_generated_pack_module_matches_the_json_sources(self):
        generated = (ROOT / "lib" / "Packs.js").read_text(encoding="utf-8")
        self.assertEqual(
            generated,
            build_packs.render(),
            "lib/Packs.js is stale; regenerate it with python3 tools/build_packs.py",
        )

    def test_generated_pack_module_has_no_runtime_io(self):
        generated = (ROOT / "lib" / "Packs.js").read_text(encoding="utf-8")
        self.assertTrue(generated.startswith(".pragma library"))
        for forbidden in ("FileView", "XMLHttpRequest", "Qt.include", "import "):
            self.assertNotIn(forbidden, generated)

    def test_a_pack_never_bakes_in_a_configurable_key(self):
        # The tmux table was collected against tmux's own default of C-b, but
        # Omarchy's tmux.conf moves the prefix to C-Space. A baked-in prefix
        # taught the wrong first key on every Omarchy machine.
        declared = {"lazyvim": {"leader", "localleader"}, "tmux": {"prefix"}}
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                used = {step["option"] for entry in pack["bindings"]
                        for step in entry["steps"] if step.get("option")}
                self.assertTrue(used.issubset(declared[name]), used)
                if name == "tmux":
                    # Every tmux binding is the prefix and then a key.
                    for entry in pack["bindings"]:
                        self.assertEqual(entry["steps"][0], {"option": "prefix"})
                        # And the identity never names the key it resolves to,
                        # so moving the prefix keeps the entry's progress.
                        self.assertNotIn("C-b", entry["localId"])

    def test_every_pack_declares_its_own_categories(self):
        # Not a shared table: one ground sorts by which-key group, the next by
        # panes and layouts, and neither list means anything to the other.
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                self.assertTrue(pack["categories"])
                self.assertEqual(sorted(pack["categories"]), sorted(set(pack["categories"])))
                used = {entry["category"] for entry in pack["bindings"]}
                self.assertEqual(used, set(pack["categories"]),
                                 "a declared category with no entries, or the other way round")

    def test_every_pack_declares_the_contexts_its_cards_pose(self):
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                self.assertTrue(pack["contexts"])
                self.assertEqual(sorted(pack["contexts"]), sorted(set(pack["contexts"])))
                for context in pack["contexts"]:
                    self.assertIn(f"context_{context}",
                                  json.loads((ROOT / "assets/locales/en.json").read_text("utf-8")))

    def test_packs_stay_within_their_limits(self):
        # Bounded here and again in PackSource.qml. "The generator checked it"
        # is not a property the runtime can verify.
        self.assertTrue(self.packs)
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                self.assertEqual(pack["schemaVersion"], 1)
                self.assertEqual(pack["profile"], name)
                self.assertEqual(pack["judgeMode"], "text")
                self.assertLessEqual(len(pack["bindings"]), 512)
                size = (ROOT / "assets" / "packs" / f"{name}.json").stat().st_size
                self.assertLess(size, 256 * 1024)
                for entry in pack["bindings"]:
                    self.assertLessEqual(len(entry["localId"]), 128)
                    self.assertLessEqual(len(entry["desc"]), 512)
                    self.assertTrue(1 <= len(entry["steps"]) <= 8)
                    self.assertIn(entry["context"], pack["contexts"])
                    self.assertIn(entry["category"], pack["categories"])

    def test_pack_entries_are_unique_and_answerable(self):
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                ids = [entry["localId"] for entry in pack["bindings"]]
                self.assertEqual(len(ids), len(set(ids)))
                for entry in pack["bindings"]:
                    for step in entry["steps"]:
                        if step.get("option"):
                            continue
                        # Esc saves the run and leaves, so no ground answers
                        # with it; the device cluster is the same rule the
                        # Hyprland ground applies.
                        self.assertNotEqual(step.get("named"), "ESC")
                        self.assertNotIn(step.get("named"), build_packs.DEVICE_SPECIAL)

    def test_provenance_names_its_authority(self):
        # "Where did this come from, and who notices when it changes" has to be
        # answerable from the file itself. What pins it differs by authority: a
        # generated page has a commit, a vendor listing has a version and a
        # checksum. Both are pinned; neither is assumed.
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                provenance = pack["provenance"]
                source = provenance["source"]
                self.assertTrue(provenance["upstream"])
                self.assertTrue(provenance["authority"])
                self.assertTrue(source["url"])
                self.assertRegex(source["checksum"], r"^[0-9a-f]{64}$")
                self.assertRegex(source["date"], r"^\d{4}-\d{2}-\d{2}$")
                self.assertTrue(source.get("commit") or source.get("tag"),
                                "a pack must name the commit or the version it was taken from")
                if source.get("commit"):
                    self.assertRegex(source["commit"], r"^[0-9a-f]{40}$")
                self.assertRegex(provenance["generator"], r"^tools/build_packs\.py@\d+$")

    def test_a_second_authority_is_recorded_when_there_is_one(self):
        # Only the LazyVim table has one, and its drift is data rather than
        # something a reader has to go and discover.
        lazyvim = self.packs["lazyvim"]["provenance"]["crossCheck"]
        self.assertRegex(lazyvim["tag"], r"^v\d+\.\d+\.\d+$")
        self.assertIsInstance(lazyvim["inCheckoutOnly"], list)

    def test_every_description_is_answered_by_both_language_packs(self):
        # The description is the prompt a card asks the keys for, so a missing
        # translation is a Chinese user reading English. A re-collect that
        # brings new upstream wording fails here until it is translated,
        # rather than shipping half a language.
        english = json.loads((ROOT / "assets/locales/en.json").read_text(encoding="utf-8"))
        chinese = json.loads((ROOT / "assets/locales/zh-CN.json").read_text(encoding="utf-8"))
        for name, pack in self.packs.items():
            for entry in pack["bindings"]:
                with self.subTest(pack=name, entry=entry["localId"]):
                    key = entry["descKey"]
                    self.assertEqual(key, build_packs.description_key(entry["desc"]))
                    self.assertIn(key, english)
                    self.assertIn(key, chinese)
                    self.assertEqual(english[key], entry["desc"])
                    # A translation that is still the English text is not one.
                    self.assertNotEqual(chinese[key], entry["desc"])

    def test_no_translation_outlives_the_description_it_was_written_for(self):
        # The key is derived from the English text, so rewritten wording gets a
        # new key and falls back to English. A key nothing uses any more is a
        # translation of wording that is gone, and it does not stay.
        used = {entry["descKey"] for pack in self.packs.values() for entry in pack["bindings"]}
        for locale in ("en", "zh-CN"):
            data = json.loads((ROOT / f"assets/locales/{locale}.json").read_text(encoding="utf-8"))
            stale = {k for k in data if k.startswith("packdesc_")} - used
            self.assertEqual(stale, set(), f"{locale} carries translations nothing uses")

    def test_every_pack_category_has_a_locale_string(self):
        english = json.loads((ROOT / "assets/locales/en.json").read_text(encoding="utf-8"))
        chinese = json.loads((ROOT / "assets/locales/zh-CN.json").read_text(encoding="utf-8"))
        used = {name for pack in self.packs.values() for name in pack["categories"]}
        for category in sorted(used):
            with self.subTest(category=category):
                self.assertIn(f"category_{category}", english)
                self.assertIn(f"category_{category}", chinese)

    def test_the_tool_is_not_shipped_as_a_runtime_component(self):
        manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
        self.assertNotIn("build_packs", json.dumps(manifest))
        # And it reaches nothing on its own: collection takes local checkouts.
        source = (ROOT / "tools" / "build_packs.py").read_text(encoding="utf-8")
        for forbidden in ("urllib", "requests", "http", "git clone"):
            self.assertNotIn(forbidden, re.sub(r"#.*|\"\"\".*?\"\"\"", "", source, flags=re.S))


if __name__ == "__main__":
    unittest.main()
