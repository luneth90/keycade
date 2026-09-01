const { locales, messages } = window.KeycadeI18n;

const bindings = [
  { actionKey: "actionFocusRight", icon: "↗", keys: ["Alt", "L"], tier: "guided" },
  { actionKey: "actionWorkspace3", icon: "03", keys: ["Super", "3"], tier: "recall" },
  { actionKey: "actionFocusLeft", icon: "↙", keys: ["Alt", "H"], tier: "recall" },
  { actionKey: "actionToggleFloat", icon: "◇", keys: ["Super", "V"], tier: "rush" },
  { actionKey: "actionTerminal", icon: ">_", keys: ["Super", "Return"], tier: "guided" },
  { actionKey: "actionCloseWindow", icon: "×", keys: ["Super", "W"], tier: "rush" },
  { actionKey: "actionMoveWorkspace4", icon: "→", keys: ["Super", "Shift", "4"], tier: "recall" },
  { actionKey: "actionLauncher", icon: "⌘", keys: ["Super", "Space"], tier: "rush" },
];

const cardRules = {
  guided: {
    kickerKey: "kickerGuided",
    instructionKey: "instructionGuided",
    chordVisible: true,
    timed: false,
    points: 60,
    hitKey: "guidedHit",
  },
  recall: {
    kickerKey: "kickerRecall",
    instructionKey: "instructionRecall",
    chordVisible: false,
    timed: true,
    duration: 3500,
    points: 100,
    hitKey: "recallHit",
  },
  rush: {
    kickerKey: "kickerRush",
    instructionKey: "instructionRush",
    chordVisible: false,
    timed: true,
    duration: 2400,
    points: 125,
    hitKey: "rushHit",
  },
};

const state = {
  locale: "en",
  run: 1,
  index: 0,
  score: 0,
  combo: 0,
  lives: 3,
  locked: false,
  reducedMotion: false,
  deadline: 0,
  timerFrame: 0,
  feedbackKind: "idle",
  feedbackKey: "guidedWaiting",
  feedbackVars: {},
};

const requestedLocale = new URLSearchParams(window.location.search).get("lang");
if (requestedLocale && locales[requestedLocale]) state.locale = requestedLocale;

const elements = {
  root: document.documentElement,
  themeSelect: document.querySelector("#theme-select"),
  localeSelect: document.querySelector("#locale-select"),
  motionToggle: document.querySelector("#motion-toggle"),
  hudRun: document.querySelector("#hud-run"),
  hudProgress: document.querySelector("#hud-progress"),
  hudScore: document.querySelector("#hud-score"),
  lives: [...document.querySelectorAll(".life")],
  combo: document.querySelector("#combo"),
  timerRing: document.querySelector("#timer-ring"),
  taskCard: document.querySelector("#task-card"),
  cardKicker: document.querySelector("#card-kicker"),
  actionIcon: document.querySelector("#action-icon"),
  actionName: document.querySelector("#action-name"),
  instruction: document.querySelector("#instruction"),
  keyChord: document.querySelector("#key-chord"),
  feedbackIcon: document.querySelector(".feedback__icon"),
  feedbackText: document.querySelector(".feedback__text"),
  sparks: document.querySelector("#sparks"),
  hitButton: document.querySelector("#hit-button"),
  missButton: document.querySelector("#miss-button"),
  nextButton: document.querySelector("#next-button"),
};

function t(key, variables = {}) {
  const template = messages[state.locale]?.[key] ?? messages.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? `{${name}}`));
}

function currentBinding() {
  return bindings[state.index % bindings.length];
}

function currentRule() {
  return cardRules[currentBinding().tier];
}

function keyLabel(key) {
  return key === "Super" ? "SUPER" : key.toUpperCase();
}

function updateMotionButton() {
  elements.motionToggle.setAttribute("aria-pressed", String(state.reducedMotion));
  elements.motionToggle.textContent = t(state.reducedMotion ? "motionReduced" : "motionOn");
}

function updateFeedback() {
  const icons = { idle: "●", hit: "✓", miss: "×" };
  elements.feedbackIcon.textContent = icons[state.feedbackKind];
  elements.feedbackText.textContent = t(state.feedbackKey, state.feedbackVars);
}

function setFeedback(kind, key, variables = {}) {
  state.feedbackKind = kind;
  state.feedbackKey = key;
  state.feedbackVars = variables;
  updateFeedback();
}

function renderLocalizedState() {
  const binding = currentBinding();
  const rule = currentRule();
  elements.cardKicker.textContent = t(rule.kickerKey);
  elements.actionName.textContent = t(binding.actionKey);
  elements.instruction.textContent = t(rule.instructionKey);
  updateFeedback();
  updateMotionButton();
  renderHud();
}

function applyTranslations() {
  elements.root.lang = locales[state.locale].htmlLang;
  elements.localeSelect.value = state.locale;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  renderLocalizedState();
}

function renderChord(keys, visible) {
  elements.keyChord.replaceChildren();
  keys.forEach((key, index) => {
    if (index > 0) {
      const plus = document.createElement("span");
      plus.className = "key-plus";
      plus.textContent = "+";
      elements.keyChord.append(plus);
    }

    const keycap = document.createElement("kbd");
    keycap.textContent = keyLabel(key);
    elements.keyChord.append(keycap);
  });
  elements.keyChord.classList.toggle("is-hidden", !visible);
  elements.keyChord.setAttribute("aria-hidden", String(!visible));
}

function renderHud() {
  elements.hudRun.textContent = String(state.run).padStart(2, "0");
  elements.hudProgress.textContent = `${String(state.index + 1).padStart(2, "0")} / 08`;
  elements.hudScore.textContent = String(state.score).padStart(6, "0");
  elements.combo.textContent = `×${state.combo}`;
  elements.lives.forEach((life, index) => life.classList.toggle("is-on", index < state.lives));
}

function renderCard({ restartTimer = true } = {}) {
  const binding = currentBinding();
  const rule = currentRule();
  state.locked = false;

  elements.taskCard.classList.remove("is-hit", "is-miss");
  elements.actionIcon.textContent = binding.icon;
  renderChord(binding.keys, rule.chordVisible);
  setFeedback("idle", binding.tier === "guided" ? "guidedWaiting" : "waitingInput");
  renderLocalizedState();

  cancelAnimationFrame(state.timerFrame);
  elements.timerRing.style.setProperty("--progress", "1");
  if (rule.timed && restartTimer) startTimer();
}

function createSparks() {
  elements.sparks.replaceChildren();
  for (let index = 0; index < 12; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.setProperty("--angle", `${index * 30}deg`);
    spark.style.animationDelay = `${(index % 3) * 18}ms`;
    elements.sparks.append(spark);
  }
}

function recordHit(binding) {
  binding.errors = 0;
  if (binding.tier === "guided") {
    binding.tier = "recall";
    binding.streak = 0;
    return;
  }

  binding.streak = (binding.streak || 0) + 1;
  if (binding.tier === "recall" && binding.streak >= 2) {
    binding.tier = "rush";
    binding.streak = 0;
  }
}

function recordMiss(binding) {
  binding.streak = 0;
  binding.errors = (binding.errors || 0) + 1;
  if (binding.tier === "rush") binding.tier = "recall";
  else if (binding.tier === "recall" && binding.errors >= 2) binding.tier = "guided";
}

function stepToNextCard() {
  state.index += 1;
  if (state.index >= bindings.length) {
    state.index = 0;
    state.run += 1;
    state.lives = 3;
  }
  renderCard();
}

function advance(delay = 430) {
  window.setTimeout(stepToNextCard, delay);
}

function hit() {
  if (state.locked) return;
  const binding = currentBinding();
  const rule = currentRule();
  state.locked = true;
  cancelAnimationFrame(state.timerFrame);
  state.combo += 1;
  state.score += rule.points + Math.min(state.combo * 8, 50);
  elements.taskCard.classList.add("is-hit");
  elements.keyChord.classList.remove("is-hidden");
  setFeedback("hit", rule.hitKey, { combo: state.combo });
  createSparks();
  renderHud();
  recordHit(binding);
  advance();
}

function miss(reasonKey = "mismatch", variables = {}) {
  if (state.locked) return;
  const binding = currentBinding();

  if (binding.tier === "guided") {
    state.locked = true;
    state.combo = 0;
    elements.taskCard.classList.add("is-miss");
    setFeedback("miss", reasonKey === "received" ? "guidedReceived" : "guidedMiss", variables);
    renderHud();
    window.setTimeout(() => {
      state.locked = false;
      elements.taskCard.classList.remove("is-miss");
      setFeedback("idle", "guidedWaiting");
    }, 700);
    return;
  }

  state.locked = true;
  cancelAnimationFrame(state.timerFrame);
  state.combo = 0;
  state.lives = Math.max(0, state.lives - 1);
  recordMiss(binding);
  elements.taskCard.classList.add("is-miss");
  elements.keyChord.classList.remove("is-hidden");
  setFeedback("miss", reasonKey, variables);
  renderHud();

  if (state.lives === 0) {
    window.setTimeout(() => {
      state.lives = 3;
      state.score = 0;
      state.index = 0;
      state.run += 1;
      renderCard();
      setFeedback("idle", "newRound");
    }, 900);
    return;
  }

  advance(760);
}

function startTimer() {
  const duration = currentRule().duration;
  state.deadline = performance.now() + duration;

  function tick(now) {
    const progress = Math.max(0, Math.min(1, (state.deadline - now) / duration));
    elements.timerRing.style.setProperty("--progress", progress.toFixed(4));
    if (progress <= 0) {
      miss("timeout");
      return;
    }
    state.timerFrame = requestAnimationFrame(tick);
  }

  state.timerFrame = requestAnimationFrame(tick);
}

function normalizedEventKeys(event) {
  const keys = [];
  if (event.metaKey) keys.push("Super");
  if (event.ctrlKey) keys.push("Control");
  if (event.altKey) keys.push("Alt");
  if (event.shiftKey) keys.push("Shift");

  const modifiers = new Set(["Meta", "Control", "Alt", "Shift"]);
  if (!modifiers.has(event.key)) {
    const key = event.key === " " ? "Space" : event.key;
    keys.push(key.length === 1 ? key.toUpperCase() : key);
  }
  return keys;
}

function chordMatches(expected, actual) {
  const aliases = { Ctrl: "Control", Return: "Enter" };
  const normalize = (keys) => keys.map((key) => aliases[key] || key).map((key) => key.toUpperCase()).sort();
  return normalize(expected).join("+") === normalize(actual).join("+");
}

document.addEventListener("keydown", (event) => {
  if (event.repeat || state.locked) return;
  if (["SELECT", "INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

  const actual = normalizedEventKeys(event);
  if (actual.length === 0 || ["Meta", "Control", "Alt", "Shift"].includes(event.key)) return;

  event.preventDefault();
  if (chordMatches(currentBinding().keys, actual)) hit();
  else miss("received", { keys: actual.map(keyLabel).join(" + ") });
});

elements.hitButton.addEventListener("click", hit);
elements.missButton.addEventListener("click", () => miss());
elements.nextButton.addEventListener("click", () => {
  if (!state.locked) stepToNextCard();
});

elements.themeSelect.addEventListener("change", (event) => {
  elements.root.dataset.theme = event.target.value;
});

elements.localeSelect.addEventListener("change", (event) => {
  state.locale = event.target.value;
  applyTranslations();
});

elements.motionToggle.addEventListener("click", () => {
  state.reducedMotion = !state.reducedMotion;
  elements.root.classList.toggle("reduce-motion", state.reducedMotion);
  updateMotionButton();
});

applyTranslations();
renderCard();
