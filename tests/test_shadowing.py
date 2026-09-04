import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = sorted(
    list((ROOT / "lib").rglob("*.js"))
    + list((ROOT / "lib").rglob("*.qml"))
    + [ROOT / "Keycade.qml"]
    + list((ROOT / "tests" / "qml").glob("*.qml"))
)


def functions(text: str):
    """Every function, with its parameters and its own body.

    Brace-matched rather than line-sliced: a body that ran to the next
    `function` keyword would report matches from the function after it, which
    is noise rather than a finding.
    """
    for match in re.finditer(r"function\s+(\w*)\s*\(([^)]*)\)\s*\{", text):
        depth, index = 0, match.end() - 1
        while index < len(text):
            character = text[index]
            if character in "\"'":
                quote, index = character, index + 1
                while index < len(text) and text[index] != quote:
                    index += 2 if text[index] == "\\" else 1
            elif text[index : index + 2] == "//":
                index = text.find("\n", index)
                if index == -1:
                    break
            elif character == "{":
                depth += 1
            elif character == "}":
                depth -= 1
                if depth == 0:
                    yield (match.group(1), match.group(2), text[match.end() : index],
                           text[: match.start()].count("\n") + 1)
                    break
            index += 1


class ShadowingTests(unittest.TestCase):
    def test_no_parameter_is_redeclared_inside_its_own_function(self):
        """`var` is function-scoped, so redeclaring a parameter overwrites it.

        This cost a real defect: a settings normaliser took the map to
        normalise as `value`, then wrote `var value = ...` inside its inner
        loop. The first training ground was normalised, that assignment
        replaced the map with a string, and every ground after the first was
        dropped without a word - the setting simply would not stick. Nothing
        catches this by reading the code; the shapes are too ordinary.
        """
        offenders = []
        for path in SOURCES:
            text = path.read_text(encoding="utf-8")
            for name, parameters, body, line in functions(text):
                for parameter in (p.strip() for p in parameters.split(",")):
                    if not parameter or not re.fullmatch(r"\w+", parameter):
                        continue
                    if re.search(r"\bvar\s+%s\b" % re.escape(parameter), body):
                        offenders.append(
                            f"{path.relative_to(ROOT)}:{line} function {name}"
                            f"({parameters}) redeclares {parameter}")
        self.assertEqual(offenders, [], "\n".join(offenders))

    def test_the_check_can_see_the_shape_it_is_looking_for(self):
        # A guard nobody has watched fail is not a guard.
        planted = "function normalize(value) {\n  var value = 1\n  return value\n}\n"
        found = [name for name, parameters, body, _ in functions(planted)
                 if re.search(r"\bvar\s+value\b", body)]
        self.assertEqual(found, ["normalize"])


if __name__ == "__main__":
    unittest.main()
