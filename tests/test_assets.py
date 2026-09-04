import json
import re
import struct
import sys
import unittest
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import build_locales  # noqa: E402


class AssetTests(unittest.TestCase):
    def test_generated_locale_module_matches_the_json_sources(self):
        generated = (ROOT / "lib" / "Locales.js").read_text(encoding="utf-8")
        self.assertEqual(
            generated,
            build_locales.render(),
            "lib/Locales.js is stale; regenerate it with python3 tools/build_locales.py",
        )

    def test_generated_locale_module_has_no_runtime_io(self):
        generated = (ROOT / "lib" / "Locales.js").read_text(encoding="utf-8")
        self.assertTrue(generated.startswith(".pragma library"))
        # The generated module may only expose its embedded catalogue; it must
        # not import another source or perform runtime file/network reads.
        for forbidden in ("FileView", "XMLHttpRequest", "Qt.include", "import "):
            self.assertNotIn(forbidden, generated)

    def test_locales_have_the_same_message_keys(self):
        locale_dir = ROOT / "assets" / "locales"
        locale_files = sorted(locale_dir.glob("*.json"))
        self.assertEqual({path.name for path in locale_files}, {"en.json", "zh-CN.json"})
        messages = {
            path.name: json.loads(path.read_text(encoding="utf-8"))
            for path in locale_files
        }
        expected_ui = {key for key in messages["en.json"] if not key.startswith("action_")}
        common_actions = {key for key in messages["en.json"] if key.startswith("action_")}
        for name, value in messages.items():
            self.assertEqual(value["schemaVersion"], 1, name)
            actual_ui = {key for key in value if not key.startswith("action_")}
            self.assertEqual(actual_ui, expected_ui, name)
            self.assertTrue(common_actions.issubset(value), name)

    def test_sound_effects_are_short_mono_pcm_waves(self):
        expected = {
            "correct.wav",
            "wrong.wav",
            "countdown.wav",
            "countdown-final.wav",
            "eject.wav",
        }
        sound_dir = ROOT / "assets" / "sfx"
        self.assertEqual({path.name for path in sound_dir.glob("*.wav")}, expected)
        for name in expected:
            with wave.open(str(sound_dir / name), "rb") as sound:
                self.assertEqual(sound.getnchannels(), 1, name)
                self.assertEqual(sound.getsampwidth(), 2, name)
                self.assertEqual(sound.getframerate(), 44100, name)
                duration = sound.getnframes() / sound.getframerate()
                self.assertGreater(duration, 0.04, name)
                self.assertLess(duration, 0.35, name)

    def test_scanline_tile_is_a_tiny_transparent_png(self):
        # The overlay is a tiled 1x2 image rather than hundreds of rectangles
        # or a shader, so the only thing worth pinning is that it stays tiny
        # and keeps the shape that makes tiling produce lines.
        tile = ROOT / "assets" / "scanline.png"
        data = tile.read_bytes()
        self.assertLess(len(data), 1024)
        self.assertEqual(data[:8], b"\x89PNG\r\n\x1a\n")
        width, height, depth, colour_type = struct.unpack(">IIBB", data[16:26])
        self.assertEqual((width, height), (1, 2))
        self.assertEqual(depth, 8)
        self.assertEqual(colour_type, 6)

    def test_chinese_covers_every_recognized_builtin_action(self):
        source = (ROOT / "lib" / "ActionLocalizer.js").read_text(encoding="utf-8")
        action_keys = set(re.findall(r'"(action_[A-Za-z]+)"', source))
        chinese = json.loads(
            (ROOT / "assets" / "locales" / "zh-CN.json").read_text(encoding="utf-8")
        )
        self.assertTrue(action_keys.issubset(chinese), sorted(action_keys - set(chinese)))


if __name__ == "__main__":
    unittest.main()
