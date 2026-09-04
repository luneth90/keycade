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

    def test_leader_becomes_a_placeholder_rather_than_a_character(self):
        # A pack must not bake in the leader the table was built with: someone
        # who moved theirs still has to be training the mapping.
        steps = build_packs.parse_notation(build_packs.LEADER_MARK + "ff")
        self.assertEqual(steps[0], {"leader": True})
        self.assertEqual(steps[1:], [{"mods": 0, "text": "f"}, {"mods": 0, "text": "f"}])
        local = build_packs.parse_notation(build_packs.LOCALLEADER_MARK + "r")
        self.assertEqual(local[0], {"localleader": True})

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
                    self.assertIn(entry["context"], {"normal", "visual", "insert", "operator"})
                    self.assertIn(entry["category"], build_packs.CATEGORIES)

    def test_pack_entries_are_unique_and_answerable(self):
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                ids = [entry["localId"] for entry in pack["bindings"]]
                self.assertEqual(len(ids), len(set(ids)))
                for entry in pack["bindings"]:
                    for step in entry["steps"]:
                        if step.get("leader") or step.get("localleader"):
                            continue
                        # Esc saves the run and leaves, so no ground answers
                        # with it; the device cluster is the same rule the
                        # Hyprland ground applies.
                        self.assertNotEqual(step.get("named"), "ESC")
                        self.assertNotIn(step.get("named"), build_packs.DEVICE_SPECIAL)

    def test_provenance_names_its_authority_and_its_drift(self):
        # "Where did this come from, and who notices when it changes" has to be
        # answerable from the file itself.
        for name, pack in self.packs.items():
            with self.subTest(pack=name):
                provenance = pack["provenance"]
                self.assertTrue(provenance["upstream"])
                self.assertTrue(provenance["authority"])
                self.assertRegex(provenance["site"]["commit"], r"^[0-9a-f]{40}$")
                self.assertRegex(provenance["site"]["checksum"], r"^[0-9a-f]{64}$")
                self.assertRegex(provenance["site"]["date"], r"^\d{4}-\d{2}-\d{2}$")
                self.assertRegex(provenance["crossCheck"]["tag"], r"^v\d+\.\d+\.\d+$")
                self.assertIsInstance(provenance["crossCheck"]["inCheckoutOnly"], list)
                self.assertRegex(provenance["generator"], r"^tools/build_packs\.py@\d+$")

    def test_every_pack_category_has_a_locale_string(self):
        english = json.loads((ROOT / "assets/locales/en.json").read_text(encoding="utf-8"))
        chinese = json.loads((ROOT / "assets/locales/zh-CN.json").read_text(encoding="utf-8"))
        used = {entry["category"] for pack in self.packs.values() for entry in pack["bindings"]}
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
