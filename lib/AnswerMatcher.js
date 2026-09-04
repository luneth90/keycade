.pragma library
.import "InputNormalizer.js" as Normalizer
.import "TextKey.js" as TextKey

// An answer is a sequence of steps. A Hyprland chord is the length-1 case, and
// it goes down this same path rather than a branch of its own - that is the
// whole point of the shape.
//
//   Answer := { judgeMode, context, steps: [ Step, ... ] }   // 1..MAX_STEPS
//   Step(keysym) := { modMask, key, keycode, matchMode }     // a Hyprland bind
//   Step(text)   := { mods, text | named }                   // see TextKey.js
//
// The two judging modes are parallel implementations on purpose; see the note
// at the top of TextKey.js for what merging them would break.

var MAX_STEPS = 8

function safeSteps(answer) {
  var steps = answer && Array.isArray(answer.steps) ? answer.steps : []
  return steps.length > MAX_STEPS ? steps.slice(0, MAX_STEPS) : steps
}

function stepCount(answer) {
  return safeSteps(answer).length
}

function judgeMode(answer) {
  return answer && answer.judgeMode === "text" ? "text" : "keysym"
}

// A sequence is typed, not held: the matcher carries only how far the typing
// has got. There is deliberately no per-step deadline - Vim has `timeoutlen`,
// but copying it here would only punish the beginner this is for. The card's
// own deadline still covers the whole sequence.
function begin() { return { cursor: 0 } }

function normalizeInput(answer, event) {
  return judgeMode(answer) === "text"
      ? TextKey.normalizeEvent(event) : Normalizer.normalizeEvent(event)
}

function stepMatches(answer, step, input, options) {
  return judgeMode(answer) === "text"
      ? TextKey.matches(step, input) : Normalizer.matches(step, input, options)
}

// One key press against the answer, with autorepeat and bare modifiers already
// filtered out by the caller.
//
//   "hit"      the last step landed; the card is answered
//   "progress" a step landed and more remain
//   "miss"     the card is wrong, whole - see the note in advance()
//
// A wrong key fails the entire card rather than the step: correcting a
// sequence means typing it again from the start, which is also how the muscle
// memory for one is actually built.
function advance(state, answer, event, options) {
  var steps = safeSteps(answer)
  if (!steps.length) return "miss"
  var cursor = Math.max(0, Math.min(Number(state.cursor || 0), steps.length - 1))
  var input = normalizeInput(answer, event)
  if (!stepMatches(answer, steps[cursor], input, options)) {
    state.cursor = 0
    return "miss"
  }
  state.cursor = cursor + 1
  if (state.cursor < steps.length) return "progress"
  state.cursor = 0
  return "hit"
}

// A completed sequence is a hit even when a longer answer starts the same way:
// the card asked for `gc`, and `gc` is what it gets. The extra keystroke a
// user with `gcc` in their fingers then sends has to be swallowed before the
// next card can see it, which is what the overrun guard in Keycade.qml is for.
function overruns(answer) { return stepCount(answer) > 1 }

// What the card shows: one group of key caps per step.
function stepLabels(answer) {
  var steps = safeSteps(answer)
  var groups = []
  for (var index = 0; index < steps.length; index++) {
    groups.push(judgeMode(answer) === "text"
        ? TextKey.labels(steps[index])
        : Normalizer.display(steps[index]).split(" + ").filter(Boolean))
  }
  return groups
}

// What an unmatched key press reads as in the feedback line.
function inputDisplay(answer, event) {
  if (judgeMode(answer) === "text")
    return TextKey.inputLabels(TextKey.normalizeEvent(event)).join(" ")
  return Normalizer.inputDisplay(Normalizer.normalizeEvent(event))
}

// A single chord, in the shape every layer above now expects. Hyprland's whole
// model is these, so this is the conversion that keeps that ground unchanged.
function chordAnswer(binding) {
  return {
    judgeMode: "keysym",
    context: "",
    steps: [{
      modMask: Number(binding.modMask || 0),
      key: binding.key,
      keycode: Number(binding.keycode || 0),
      matchMode: binding.matchMode
    }]
  }
}
