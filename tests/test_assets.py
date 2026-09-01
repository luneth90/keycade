import json
import unittest
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class AssetTests(unittest.TestCase):
    def test_locales_have_the_same_message_keys(self):
        locale_dir = ROOT / "assets" / "locales"
        locale_files = sorted(locale_dir.glob("*.json"))
        self.assertGreaterEqual(len(locale_files), 4)
        messages = {
            path.name: json.loads(path.read_text(encoding="utf-8"))
            for path in locale_files
        }
        expected = set(messages["en.json"])
        for name, value in messages.items():
            self.assertEqual(value["schemaVersion"], 1, name)
            self.assertEqual(set(value), expected, name)

    def test_sound_effects_are_short_mono_pcm_waves(self):
        expected = {
            "correct.wav",
            "wrong.wav",
            "correction.wav",
            "countdown.wav",
            "countdown-final.wav",
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
                self.assertLess(duration, 0.20, name)


if __name__ == "__main__":
    unittest.main()
