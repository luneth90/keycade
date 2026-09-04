pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import Quickshell.Wayland
import "lib"
import "lib/InputNormalizer.js" as Normalizer
import "lib/Eligibility.js" as Eligibility
import "lib/Scheduler.js" as Scheduler
import "lib/Stats.js" as Stats
import "lib/Categorizer.js" as Categorizer
import "lib/ActionLocalizer.js" as Actions
import "lib/Session.js" as Session

Item {
  id: root

  property var shell: null
  property var manifest: null
  property bool opened: false
  property string view: "closed"
  property string errorMessage: ""
  property bool guardReady: false
  property bool escapeDown: false
  property bool startRequested: false
  property string requestedLocale: ""

  property var eligibleBindings: []
  property var deck: []
  property int cardIndex: 0
  property int runNumber: 1
  property int runOffset: 0
  property int runReviewTarget: 0
  property int runNewTarget: 0
  property int correct: 0
  property int attempts: 0
  property int newLearned: 0
  property int masteredGained: 0
  property var reactions: []
  property var runResults: ({})
  property var pendingReinforcements: ({})
  property var reviewSuggestions: []
  property var masterySnapshot: ({ attempts: 0, correct: 0, accuracy: 0, response: 0 })
  property var progressCounts: ({ unseen: 0, learning: 0, mastered: 0, due: 0, total: 0 })
  property double activeSegmentStartedAt: 0
  property double cardStartedAt: 0
  property double deadline: 0
  property real energy: 1
  property int lastCountdownBeat: 0
  property int countdownSeconds: 0
  // A run-local streak of first-try hits. It is display only: it never reaches
  // stats or the scheduler, which grade recall and spacing rather than speed.
  property int combo: 0
  property bool cardLocked: false
  property bool correctionRequired: false
  property bool cardErrorSoundPlayed: false
  property string feedbackKind: "idle"
  property string feedbackText: ""
  property bool revealChord: false
  property string themeName: "tokyo"
  property bool resumeAvailable: false
  property bool languageMenuOpen: false
  property bool soundMenuOpen: false
  property bool excludedMenuOpen: false
  property var excludedRows: []
  property int staleExcludedCount: 0
  property bool excludeStampVisible: false
  property string excludedCardId: ""
  property bool trainingLockedOut: false

  readonly property var currentCard: deck.length > cardIndex ? deck[cardIndex] : null
  readonly property var currentBinding: currentCard ? currentCard.binding : null
  readonly property int runCardLimit: 24
  readonly property string profileId: "hyprland"
  // Long enough to read the stamp, not long enough to feel like a penalty.
  // 300 ms measured worse than it sounds: the 110 ms fade eats a third of it,
  // so the words were legible for under two tenths of a second.
  readonly property int excludeStampMs: 900
  readonly property bool reducedMotion: Boolean(store.settings.reducedMotion)
  readonly property int activeRunId: Number(store.stats.runs || 0) + 1

  readonly property color voidColor: themeName === "gruvbox" ? "#141412" : "#080b14"
  readonly property color cabinetColor: themeName === "gruvbox" ? "#3c3836" : "#242a46"
  readonly property color screenColor: themeName === "gruvbox" ? "#1b1b18" : "#0d1224"
  readonly property color inkColor: themeName === "gruvbox" ? "#fbf1c7" : "#f1f4ff"
  readonly property color mutedColor: themeName === "gruvbox" ? "#bdae93" : "#9aa5d1"
  readonly property color primaryColor: themeName === "gruvbox" ? "#fabd2f" : "#7aa2f7"
  readonly property color secondaryColor: themeName === "gruvbox" ? "#d3869b" : "#bb9af7"
  readonly property color successColor: themeName === "gruvbox" ? "#b8bb26" : "#9ece6a"
  readonly property color dangerColor: themeName === "gruvbox" ? "#fb4934" : "#f7768e"
  readonly property color coinColor: themeName === "gruvbox" ? "#fe8019" : "#e0af68"

  function open(payloadJson) {
    if (root.opened) return
    var payload = {}
    try { payload = JSON.parse(String(payloadJson || "{}")) } catch (error) { payload = {} }
    root.opened = true
    root.view = "loading"
    root.errorMessage = ""
    root.guardReady = false
    root.startRequested = false
    root.requestedLocale = payload.locale && i18n.supported.indexOf(payload.locale) !== -1
        ? String(payload.locale) : ""
    root.activeSegmentStartedAt = 0
    root.languageMenuOpen = false
    root.soundMenuOpen = false
    root.themeName = String(store.settings.theme || payload.theme || "tokyo")
    var savedLocale = String(store.settings.locale || "en")
    i18n.locale = root.requestedLocale
        || (i18n.supported.indexOf(savedLocale) !== -1 ? savedLocale : "en")
    guard.begin()
    keybinds.refresh()
    Qt.callLater(function() { keyCatcher.forceActiveFocus() })
  }

  function close() { requestSafeClose() }

  function toggle() {
    if (root.opened) requestSafeClose()
    else open("{}")
  }

  function dismiss() {
    root.opened = false
    root.view = "closed"
    if (root.shell && typeof root.shell.hide === "function")
      root.shell.hide((root.manifest && root.manifest.id) || "luneth90.keycade")
  }

  function requestSafeClose() {
    cardTimer.stop()
    sounds.stopCountdown()
    feedbackTimer.stop()
    commitActiveTraining()
    if (root.view === "playing" && root.cardLocked && !root.correctionRequired
        && root.feedbackKind === "hit" && root.cardIndex + 1 >= root.deck.length)
      finishRun(false)
    if (store.ready) {
      saveRunSession()
      store.saveStats()
    }
    root.view = "closing"
    guard.requestClose()
  }

  function maybeShowHome() {
    if (!root.opened || root.view !== "loading" || !root.guardReady || keybinds.loading || !store.ready) return
    var savedLocale = String(store.settings.locale || "en")
    if (i18n.supported.indexOf(savedLocale) === -1) {
      store.settings.locale = "en"
      store.settings = Object.assign({}, store.settings)
      store.saveSettings()
      savedLocale = "en"
    }
    if (!root.requestedLocale) i18n.locale = savedLocale
    root.applyEligibility()
    if (!root.eligibleBindings.length && !root.trainingLockedOut) {
      root.errorMessage = i18n.t("noBindings")
      guard.fail(root.errorMessage)
      return
    }
    root.runNumber = Number(store.stats.runs || 0) + 1
    root.resumeAvailable = hasResumableSession()
    refreshProgressCounts()
    checkFirstMastery(root.activeRunId)
    if (!root.resumeAvailable && Number(store.stats.firstMasteryAt || 0) > 0
        && !Boolean(store.stats.firstMasteryCelebrated)
        && Number(store.stats.firstMasteryRun || 0) <= Number(store.stats.runs || 0)) {
      root.masterySnapshot = Stats.aggregate(store.stats, root.eligibleBindings)
      Stats.markFirstMasteryCelebrated(store.stats)
      store.saveStats()
      root.view = "mastery"
      return
    }
    root.view = "home"
    root.feedbackText = i18n.t("ready")
    if (root.startRequested) {
      root.startRequested = false
      Qt.callLater(function() { root.startPrimary() })
    }
  }

  // The one place eligibility is computed. Excluding and restoring both go
  // through it, so the mastery denominator - which is the size of this set -
  // moves with them instead of at the next launch.
  function applyEligibility() {
    var result = Eligibility.filter(keybinds.bindings, {
      appleKeyboard: keybinds.appleKeyboard,
      keymapAuthoritative: keybinds.keymapAuthoritative,
      keycodeMap: keybinds.keycodeMap,
      excludedBindings: store.settings.excludedBindings,
      profile: root.profileId
    })
    var rows = []
    var matched = Session.safeMap()
    for (var i = 0; i < result.excluded.length; i++) {
      if (result.excluded[i].reason !== "user-excluded") continue
      rows.push(result.excluded[i].binding)
      matched[result.excluded[i].binding.id] = true
    }
    var stored = Session.excludedSet(store.settings.excludedBindings, root.profileId)
    var stale = 0
    Object.keys(stored).forEach(function(id) { if (!matched[id]) stale += 1 })
    root.eligibleBindings = result.eligible
    root.excludedRows = rows
    root.staleExcludedCount = stale
    // An exclusion can outlive the bind it names, so a config change between
    // two launches can empty the eligible set. Failing here would close the
    // overlay after five seconds with the restore list out of reach, so home
    // stays reachable and starting a run is what gets refused instead.
    root.trainingLockedOut = !result.eligible.length && (rows.length > 0 || stale > 0)
    refreshProgressCounts()
    return result
  }

  function excludeCurrentBinding() {
    if (root.view !== "playing" || !root.currentBinding || root.excludeStampVisible) return
    if (root.eligibleBindings.length <= 1) {
      root.feedbackKind = "miss"
      root.feedbackText = i18n.t("excludeRejectedLast")
      return
    }
    var id = root.currentBinding.id
    var next = Session.withExclusion(store.settings.excludedBindings, root.profileId, id)
    if (!next) {
      root.feedbackKind = "miss"
      root.feedbackText = i18n.t("excludeRejectedFull")
      return
    }

    // Seal the card before anything else. A timer left running would reach
    // zero while the stamp is up and record a miss against a bind the user
    // just took out of training.
    root.cardLocked = true
    root.correctionRequired = false
    cardTimer.stop()
    feedbackTimer.stop()
    sounds.stopCountdown()
    root.deadline = 0
    root.energy = 1
    root.feedbackKind = "idle"
    root.feedbackText = i18n.t("excludeStamp")
    root.excludeStampVisible = true
    sounds.playEject()
    if (!root.reducedMotion) excludedPulse.restart()

    store.settings.excludedBindings = next
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
    // The eligible set shrinks now, not at the next launch, so the mastery
    // denominator and the drawer count answer for this run.
    root.applyEligibility()

    // The deck is left alone until the stamp clears: emptying it here would
    // blank the card behind the stamp. Nothing can reach the old card in the
    // meantime - it is locked and its timers are stopped - and a crash inside
    // the beat is harmless, because a resumed deck keeps only cards whose
    // binding is still eligible.
    root.excludedCardId = id
    excludeStampTimer.restart()
  }

  function dropExcludedCard(bindingId) {
    var removedBefore = 0
    var remaining = []
    for (var i = 0; i < root.deck.length; i++) {
      if (root.deck[i].binding.id === bindingId) {
        if (i < root.cardIndex) removedBefore += 1
        continue
      }
      remaining.push(root.deck[i])
    }
    root.deck = remaining
    root.cardIndex = Math.max(0, root.cardIndex - removedBefore)
    root.setReinforcementPending(bindingId, false)
    // The miss that led here stays in stats - it happened - but the run's own
    // tally drops the row, so an excluded bind cannot head the review list.
    if (root.runResults[bindingId]) {
      var results = {}
      Object.keys(root.runResults).forEach(function(key) {
        if (key !== bindingId) results[key] = root.runResults[key]
      })
      root.runResults = results
    }
  }

  // Restoring is offered while idle only: putting a bind back mid-run would
  // mean rebuilding the deck and its plan counts for no benefit.
  function restoreBinding(bindingId) {
    if (root.view === "playing") return
    store.settings.excludedBindings =
        Session.withoutExclusion(store.settings.excludedBindings, root.profileId, bindingId)
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
    root.applyEligibility()
    root.resumeAvailable = root.hasResumableSession()
  }

  // Entries whose bind no longer exists cannot be shown or restored, but they
  // still spend the budget. They are never dropped silently: clearing them is
  // a button, because a bind commented out today may come back tomorrow.
  function clearStaleExclusions() {
    var live = Session.safeMap()
    for (var i = 0; i < root.excludedRows.length; i++) live[root.excludedRows[i].id] = true
    var prefix = root.profileId + ":"
    var stored = Session.excludedList(store.settings.excludedBindings)
    var keep = []
    for (var j = 0; j < stored.length; j++) {
      var entry = stored[j]
      if (entry.slice(0, prefix.length) !== prefix || live[entry.slice(prefix.length)])
        keep.push(entry)
    }
    store.settings.excludedBindings = keep
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
    root.applyEligibility()
  }

  function categorySummary() {
    var counts = {}
    for (var i = 0; i < root.eligibleBindings.length; i++) {
      var name = String(root.eligibleBindings[i].category || "uncategorized")
      counts[name] = Number(counts[name] || 0) + 1
    }
    var labels = []
    var order = Categorizer.categories()
    for (var j = 0; j < order.length; j++) {
      if (counts[order[j]]) labels.push(i18n.t("category_" + order[j]) + " " + counts[order[j]])
    }
    return labels.join(" · ")
  }

  function localeLabel(code) {
    if (code === "zh-CN") return "简体中文"
    return "English"
  }

  function selectLocale(code) {
    if (i18n.supported.indexOf(code) === -1) return
    i18n.locale = code
    store.settings.locale = code
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
    root.languageMenuOpen = false
  }

  function cycleTheme() {
    var themes = ["tokyo", "gruvbox"]
    root.themeName = themes[(themes.indexOf(root.themeName) + 1) % themes.length]
    store.settings.theme = root.themeName
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function toggleSound() {
    store.settings.feedbackSound = !Boolean(store.settings.feedbackSound)
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function adjustSoundVolume(delta) {
    var value = Math.round(Number(store.settings.soundVolume || 0.6) * 10) / 10
    store.settings.soundVolume = Math.max(0.1, Math.min(1.0, value + Number(delta || 0)))
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function toggleCountdownSound() {
    store.settings.countdownSound = !Boolean(store.settings.countdownSound)
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  // The reproduced keymap decides judging when it is available; without it the
  // matcher keeps comparing characters exactly as before.
  function matchOptions() {
    return {
      appleKeyboard: keybinds.appleKeyboard,
      keycodeMap: keybinds.keymapAuthoritative ? keybinds.keycodeMap : null
    }
  }

  function refreshProgressCounts() {
    root.progressCounts = Stats.counts(store.stats, root.eligibleBindings, Date.now(), root.activeRunId)
  }

  function commitActiveTraining() {
    if (root.activeSegmentStartedAt <= 0) return
    Stats.addTrainingTime(store.stats, Date.now() - root.activeSegmentStartedAt)
    root.activeSegmentStartedAt = 0
  }

  function checkFirstMastery(runId) {
    if (root.progressCounts.total <= 0
        || root.progressCounts.mastered !== root.progressCounts.total) return false
    var reached = Stats.noteFirstMastery(store.stats, Date.now(), runId || root.activeRunId)
    if (reached) store.saveStats()
    return reached
  }

  function formatTrainingTime(milliseconds) {
    var minutes = Math.floor(Math.max(0, Number(milliseconds || 0)) / 60000)
    if (minutes < 1) return i18n.t("underOneMinute")
    if (minutes < 60) return i18n.t("durationMinutes", { minutes: minutes })
    return i18n.t("durationHours", {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    })
  }

  function formatMasteryDate(timestamp) {
    var date = new Date(Number(timestamp || Date.now()))
    var month = String(date.getMonth() + 1).padStart(2, "0")
    var day = String(date.getDate()).padStart(2, "0")
    return date.getFullYear() + "-" + month + "-" + day
  }

  function continueFromMastery() {
    if (root.view === "mastery") root.view = "summary"
  }

  function completedCardCount() {
    if (root.view === "summary") return root.runCardLimit
    var completed = root.runOffset + root.cardIndex
    if (root.view === "playing" && root.cardLocked && !root.correctionRequired
        && root.feedbackKind === "hit") completed += 1
    return Math.max(0, Math.min(root.runCardLimit, completed))
  }

  function pendingReinforcementCount() {
    return Object.keys(root.pendingReinforcements || {}).length
  }

  function setReinforcementPending(bindingId, pending) {
    var updated = Object.assign({}, root.pendingReinforcements)
    if (pending) updated[bindingId] = true
    else delete updated[bindingId]
    root.pendingReinforcements = updated
  }

  function hasResumableSession() {
    return Session.canResume(store.session, root.activeRunId, root.eligibleBindings, root.runCardLimit)
  }

  function saveRunSession() {
    if (root.view !== "playing") return
    var resumeIndex = root.cardIndex
    var resumeCorrection = root.correctionRequired
    if (root.cardLocked && !root.correctionRequired && root.feedbackKind === "hit") resumeIndex += 1
    var cards = Session.cardsFrom(root.deck, resumeIndex)
    if (!cards.length) {
      store.clearSession()
      root.resumeAvailable = false
      return
    }
    store.saveSession({
      schemaVersion: 1,
      runId: root.activeRunId,
      offset: root.runOffset + resumeIndex,
      cards: cards,
      correct: root.correct,
      attempts: root.attempts,
      newLearned: root.newLearned,
      masteredGained: root.masteredGained,
      runReviewTarget: root.runReviewTarget,
      runNewTarget: root.runNewTarget,
      pendingReinforcements: Object.keys(root.pendingReinforcements || {}),
      reactions: root.reactions,
      runResults: Session.serializableResults(root.runResults),
      correctionRequired: resumeCorrection && resumeIndex === root.cardIndex,
      savedAt: Date.now()
    })
    root.resumeAvailable = true
  }

  function resumeRun() {
    if (!root.resumeAvailable || !guard.active) return
    var session = store.session
    var offset = Math.max(0, Math.min(root.runCardLimit - 1, Number(session.offset || 0)))
    var restoredDeck = Session.restoreCards(session.cards, root.eligibleBindings)
    restoredDeck = restoredDeck.slice(0, root.runCardLimit - offset)
    if (!restoredDeck.length) {
      store.clearSession()
      root.resumeAvailable = false
      startRun()
      return
    }
    guard.play()
    root.deck = restoredDeck
    root.cardIndex = 0
    root.runOffset = offset
    root.runNumber = Number(session.runId || root.activeRunId)
    root.correct = Math.max(0, Number(session.correct || 0))
    root.attempts = Math.max(0, Number(session.attempts || 0))
    root.newLearned = Math.max(0, Number(session.newLearned || 0))
    root.masteredGained = Math.max(0, Number(session.masteredGained || 0))
    var plan = Scheduler.planCounts(restoredDeck)
    root.runReviewTarget = Math.max(0, Number(session.runReviewTarget === undefined
                                             ? plan.review : session.runReviewTarget))
    root.runNewTarget = Math.max(0, Number(session.runNewTarget === undefined
                                          ? plan.added : session.runNewTarget))
    root.pendingReinforcements = ({})
    var pendingIds = Array.isArray(session.pendingReinforcements) ? session.pendingReinforcements : []
    for (var pendingIndex = 0; pendingIndex < pendingIds.length; pendingIndex++)
      root.setReinforcementPending(String(pendingIds[pendingIndex]), true)
    root.reactions = Array.isArray(session.reactions) ? session.reactions : []
    root.runResults = Session.restoreResults(session.runResults, root.eligibleBindings)
    root.reviewSuggestions = []
    root.activeSegmentStartedAt = Date.now()
    root.view = "playing"
    showCard(Boolean(session.correctionRequired))
  }

  function startPrimary() {
    if (root.view === "home" && root.resumeAvailable) resumeRun()
    else startRun()
  }

  function startRun() {
    if (root.view !== "home" && root.view !== "summary") return
    if (root.trainingLockedOut) return
    if (!guard.active) {
      guard.fail("Shortcut inhibition is not active.")
      return
    }
    guard.play()
    store.clearSession()
    root.resumeAvailable = false
    root.runNumber = root.activeRunId
    root.deck = Scheduler.build(root.eligibleBindings, store.stats, root.runCardLimit,
                                { runId: root.activeRunId })
    var plan = Scheduler.planCounts(root.deck)
    root.runReviewTarget = plan.review
    root.runNewTarget = plan.added
    root.cardIndex = 0
    root.runOffset = 0
    root.correct = 0
    root.attempts = 0
    root.newLearned = 0
    root.masteredGained = 0
    root.reactions = []
    root.combo = 0
    root.runResults = ({})
    root.pendingReinforcements = ({})
    root.reviewSuggestions = []
    root.correctionRequired = false
    refreshProgressCounts()
    store.saveStats()
    root.activeSegmentStartedAt = Date.now()
    root.view = "playing"
    showCard()
  }

  function showCard(resumeCorrection) {
    feedbackTimer.stop()
    cardTimer.stop()
    sounds.stopCountdown()
    if (root.cardIndex >= root.deck.length) {
      finishRun()
      return
    }
    root.cardLocked = false
    root.correctionRequired = false
    root.cardErrorSoundPlayed = false
    root.feedbackKind = "idle"
    root.revealChord = root.currentCard.tier === "guided"
    root.feedbackText = i18n.t(root.currentCard.tier === "guided" ? "copyChord" : "waiting")
    root.cardStartedAt = Date.now()
    root.lastCountdownBeat = 0
    root.countdownSeconds = 0
    if (root.currentCard.queue === "unseen") {
      Scheduler.markCovered(root.eligibleBindings, store.stats, root.currentBinding.id)
      store.saveStats()
    }
    if (resumeCorrection) {
      root.correctionRequired = true
      root.revealChord = true
      root.feedbackText = i18n.t("correctionPrompt")
      root.energy = 1
      root.deadline = 0
      saveRunSession()
      return
    }
    var duration = Scheduler.durationFor(root.currentCard, store.stats)
    root.energy = 1
    root.deadline = duration ? Date.now() + duration : 0
    if (duration) cardTimer.start()
    saveRunSession()
  }

  function handleGameInput(event) {
    if (root.view !== "playing" || root.cardLocked || !root.currentBinding) return
    var input = Normalizer.normalizeEvent(event)
    if (input.autoRepeat || Normalizer.isModifier(input.logicalKey)) return
    if (root.correctionRequired) {
      if (Normalizer.matches(root.currentBinding, input, root.matchOptions())) completeCorrection()
      else missCorrection(Normalizer.inputDisplay(input))
      return
    }
    if (Normalizer.matches(root.currentBinding, input, root.matchOptions())) hitCurrent()
    else missCurrent("received", Normalizer.inputDisplay(input))
  }

  function beginCorrection() {
    if (!root.correctionRequired || root.view !== "playing") return
    root.cardLocked = false
    root.revealChord = true
    root.feedbackKind = "idle"
    root.feedbackText = i18n.t("correctionPrompt")
    root.deadline = 0
    root.energy = 1
  }

  function missCorrection(received) {
    root.revealChord = true
    root.feedbackKind = "miss"
    root.feedbackText = i18n.t("correctionMiss", { keys: received || "?" })
    if (!root.reducedMotion) missShake.restart()
  }

  function completeCorrection() {
    root.cardLocked = true
    root.correctionRequired = false
    root.revealChord = true
    root.feedbackKind = "hit"
    root.feedbackText = i18n.t("correctionHit")
    if (!root.reducedMotion) hitFlash.restart()
    saveRunSession()
    feedbackTimer.interval = 320
    feedbackTimer.restart()
  }

  function scheduleRetest(binding) {
    root.setReinforcementPending(binding.id, true)
    root.deck = Scheduler.insertRemedial(root.deck, root.cardIndex, binding)
  }

  function retryGuided() {
    root.cardLocked = false
    root.feedbackKind = "idle"
    root.feedbackText = i18n.t("copyChord")
    root.revealChord = true
    root.deadline = 0
    root.energy = 1
    saveRunSession()
  }

  function hitCurrent() {
    if (root.cardLocked) return
    root.cardLocked = true
    cardTimer.stop()
    sounds.stopCountdown()
    var reaction = Math.max(0, Date.now() - root.cardStartedAt)
    var guided = root.currentCard.tier === "guided"
    var hitResult = root.runResults[root.currentBinding.id] || { binding: root.currentBinding, misses: 0, reactions: [] }
    if (guided) {
      var before = Stats.entry(store.stats, root.currentBinding.id)
      if (!before.guidedCompleted) root.newLearned += 1
      Stats.recordGuided(store.stats, root.currentBinding.id, root.activeRunId, Date.now())
      for (var i = root.cardIndex + 1; i < root.deck.length; i++) {
        if (root.deck[i].binding.id === root.currentBinding.id) root.deck[i].tier = "learning"
      }
      root.deck = root.deck.slice()
      scheduleRetest(root.currentBinding)
    } else {
      if (root.currentCard.remedial)
        root.setReinforcementPending(root.currentBinding.id, false)
      root.correct += 1
      root.attempts += 1
      root.reactions = root.reactions.concat([reaction])
      hitResult.reactions.push(reaction)
      var transition = Stats.recordFirstTry(store.stats, root.currentBinding.id, true,
                                            reaction, root.activeRunId, Date.now())
      if (transition.masteredGained) root.masteredGained += 1
      root.combo += 1
      if (root.combo % 5 === 0) sounds.playCombo()
    }
    root.runResults[root.currentBinding.id] = hitResult
    refreshProgressCounts()
    checkFirstMastery(root.activeRunId)
    store.saveStats()
    root.revealChord = true
    root.feedbackKind = "hit"
    root.feedbackText = guided ? i18n.t("guidedHit")
                               : i18n.t("hitReaction", { ms: Math.round(reaction) })
    saveRunSession()
    sounds.playCorrect()
    if (!root.reducedMotion) hitFlash.restart()
    feedbackTimer.interval = 320
    feedbackTimer.restart()
  }

  function missCurrent(reason, received) {
    root.combo = 0
    if (root.cardLocked) return
    cardTimer.stop()
    sounds.stopCountdown()
    var guided = root.currentCard.tier === "guided"
    root.cardLocked = true
    root.feedbackKind = "miss"
    if (!root.cardErrorSoundPlayed) {
      sounds.playWrong()
      root.cardErrorSoundPlayed = true
    }
    if (guided) {
      root.feedbackText = i18n.t("guidedMiss", { keys: received || "?" })
      if (!root.reducedMotion) missShake.restart()
      feedbackTimer.interval = 700
      feedbackTimer.restart()
      saveRunSession()
      return
    }
    root.correctionRequired = true
    root.attempts += 1
    root.revealChord = true
    root.feedbackText = i18n.t(reason === "timeout" ? "timeout" : "miss")
    Stats.recordFirstTry(store.stats, root.currentBinding.id, false, -1,
                         root.activeRunId, Date.now())
    scheduleRetest(root.currentBinding)
    var missResult = root.runResults[root.currentBinding.id] || { binding: root.currentBinding, misses: 0, reactions: [] }
    missResult.misses += 1
    root.runResults[root.currentBinding.id] = missResult
    refreshProgressCounts()
    store.saveStats()
    saveRunSession()
    if (!root.reducedMotion) missShake.restart()
    feedbackTimer.interval = 700
    feedbackTimer.restart()
  }

  function advanceCard() {
    if (root.currentCard && root.currentCard.tier === "guided" && root.feedbackKind === "miss") {
      retryGuided()
      return
    }
    root.cardIndex += 1
    if (root.cardIndex >= root.deck.length) {
      finishRun()
      return
    }
    showCard()
  }

  function finishRun(showMastery) {
    cardTimer.stop()
    commitActiveTraining()
    store.clearSession()
    root.resumeAvailable = false
    // Reassign (not just mutate) store.stats: it's a property var, so a
    // plain store.stats.runs = ... update never fires statsChanged, and
    // root.activeRunId (a binding on store.stats.runs) would stay frozen
    // at whatever it last was for the rest of this keepLoaded session —
    // every following run would reuse the same stale run number instead
    // of counting up.
    store.stats = Object.assign({}, store.stats, { runs: Number(store.stats.runs || 0) + 1 })
    var resultRows = Object.keys(root.runResults).map(function(id) { return root.runResults[id] })
    resultRows.sort(function(left, right) {
      if (left.misses !== right.misses) return right.misses - left.misses
      return Stats.percentile75(right.reactions) - Stats.percentile75(left.reactions)
    })
    root.reviewSuggestions = resultRows.slice(0, 3)
    refreshProgressCounts()
    root.masterySnapshot = Stats.aggregate(store.stats, root.eligibleBindings)
    if (Number(store.stats.firstMasteryAt || 0) > 0
        && !Boolean(store.stats.firstMasteryCelebrated)) {
      if (showMastery === false) root.view = "summary"
      else {
        Stats.markFirstMasteryCelebrated(store.stats)
        root.view = "mastery"
      }
    } else root.view = "summary"
    store.saveStats()
  }

  function accuracyPercent() {
    return root.attempts ? Math.round(root.correct / root.attempts * 100) : 0
  }

  function p75Reaction() {
    return Stats.percentile75(root.reactions)
  }

  function requestHint(bindingId) {
    Stats.requestGuidance(store.stats, bindingId)
    refreshProgressCounts()
    store.saveStats()
  }

  I18n { id: i18n }
  SoundManager {
    id: sounds
    feedbackEnabled: Boolean(store.settings.feedbackSound)
    countdownEnabled: Boolean(store.settings.countdownSound)
    volume: Number(store.settings.soundVolume || 0.6)
  }
  StateStore {
    id: store
    onReadyChanged: root.maybeShowHome()
    onFailed: function(message) {
      root.errorMessage = message
      guard.fail(message)
    }
  }
  KeybindSource {
    id: keybinds
    onLoaded: root.maybeShowHome()
    onFailed: function(message) {
      root.errorMessage = message
      guard.fail(message)
    }
  }

  InputGuard {
    id: guard
    window: panel
    keyboardFocused: keyCatcher.activeFocus
    onReady: {
      root.guardReady = true
      root.maybeShowHome()
    }
    onBlocked: function(message) {
      root.errorMessage = message
      root.view = "blocked"
      blockedClose.restart()
    }
    onClosed: root.dismiss()
  }

  Timer {
    id: cardTimer
    interval: 33
    repeat: true
    onTriggered: {
      var remaining = root.deadline - Date.now()
      var duration = root.deadline - root.cardStartedAt
      root.energy = Math.max(0, remaining / duration)
      var beat = Math.ceil(remaining / 1000)
      root.countdownSeconds = Math.max(0, Math.min(99, beat))
      if (beat > 0 && beat <= 3 && beat !== root.lastCountdownBeat) {
        root.lastCountdownBeat = beat
        sounds.playCountdown(beat === 1)
      }
      if (remaining <= 0) {
        stop()
        root.missCurrent("timeout", "")
      }
    }
  }

  Timer {
    id: feedbackTimer
    repeat: false
    onTriggered: {
      if (root.correctionRequired) root.beginCorrection()
      else root.advanceCard()
    }
  }
  Timer { id: blockedClose; interval: 5000; repeat: false; onTriggered: root.dismiss() }

  // The stamp holds for a fixed beat so the exclusion is legible, then the run
  // moves on. reducedMotion drops the fade, never this delay: the confirmation
  // is the point.
  Timer {
    id: excludeStampTimer
    interval: root.excludeStampMs
    repeat: false
    onTriggered: {
      root.excludeStampVisible = false
      if (root.excludedCardId) root.dropExcludedCard(root.excludedCardId)
      root.excludedCardId = ""
      if (root.view !== "playing") return
      if (root.cardIndex >= root.deck.length) root.finishRun()
      else root.showCard()
    }
  }

  SequentialAnimation {
    id: hitFlash
    NumberAnimation { target: cardGlow; property: "opacity"; to: 1; duration: 50 }
    PauseAnimation { duration: 45 }
    NumberAnimation { target: cardGlow; property: "opacity"; to: 0; duration: 160 }
  }

  SequentialAnimation {
    id: excludedPulse
    NumberAnimation { target: excludedLamp; property: "opacity"; to: 1; duration: 90 }
    NumberAnimation { target: excludedLamp; property: "opacity"; to: 0; duration: 420 }
  }

  SequentialAnimation {
    id: missShake
    NumberAnimation { target: cardShift; property: "x"; to: -8; duration: 45 }
    NumberAnimation { target: cardShift; property: "x"; to: 8; duration: 55 }
    NumberAnimation { target: cardShift; property: "x"; to: -4; duration: 55 }
    NumberAnimation { target: cardShift; property: "x"; to: 0; duration: 55 }
  }

  PanelWindow {
    id: panel
    visible: root.opened
    anchors { top: true; bottom: true; left: true; right: true }
    color: "transparent"
    WlrLayershell.namespace: "keycade"
    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: guard.wantsFocus ? WlrKeyboardFocus.Exclusive : WlrKeyboardFocus.None
    exclusionMode: ExclusionMode.Ignore

    onVisibleChanged: if (visible) Qt.callLater(function() { keyCatcher.forceActiveFocus() })

    Rectangle {
      anchors.fill: parent
      color: root.voidColor
      opacity: 0.96
    }

    Item {
      id: keyCatcher
      anchors.fill: parent
      focus: true
      Keys.priority: Keys.BeforeItem

      Keys.onPressed: function(event) {
        guard.updateInput(Normalizer.modifierMask(event.modifiers))
        if (event.isAutoRepeat) { event.accepted = true; return }
        // Whether this Escape is a bare safe-exit or part of a modifier chord
        // (e.g. Super + Esc) is decided on release, not here: on a fast chord
        // Wayland can deliver the "modifiers" update for a just-pressed Super
        // slightly after this Escape press event, so event.modifiers briefly
        // under-reports it at press time. The release event has consistently
        // shown the correct modifiers by the time it arrives.
        if (event.key === Qt.Key_Escape) {
          if (root.languageMenuOpen || root.soundMenuOpen) {
            root.languageMenuOpen = false
            root.soundMenuOpen = false
            root.escapeDown = false
            event.accepted = true
            return
          }
          root.escapeDown = true
          event.accepted = true
          return
        }
        if (root.view === "loading"
            && (event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
          root.startRequested = true
          event.accepted = true
          return
        }
        if (root.view === "mastery"
            && (event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
          root.continueFromMastery()
          event.accepted = true
          return
        }
        if ((root.view === "home" || root.view === "summary")
            && (event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
          root.startPrimary()
          event.accepted = true
          return
        }
        if (root.view === "playing") {
          root.handleGameInput(event)
          event.accepted = true
        }
      }

      Keys.onReleased: function(event) {
        guard.updateInput(Normalizer.modifierMask(event.modifiers))
        if (event.key === Qt.Key_Escape && root.escapeDown) {
          root.escapeDown = false
          if (Normalizer.modifierMask(event.modifiers) === 0) {
            root.requestSafeClose()
          } else if (root.view === "playing") {
            root.handleGameInput(event)
          }
        }
        event.accepted = true
      }
    }

    Rectangle {
      id: cabinetShadow
      width: Math.min(1040, panel.width - 64)
      height: Math.min(720, panel.height - 64)
      anchors.centerIn: parent
      anchors.horizontalCenterOffset: 12
      anchors.verticalCenterOffset: 12
      color: "#05070e"
    }

    Rectangle {
      id: cabinet
      width: cabinetShadow.width
      height: cabinetShadow.height
      anchors.centerIn: parent
      color: root.cabinetColor
      border.width: 4
      border.color: root.inkColor

      Rectangle { width: 12; height: 12; anchors.left: parent.left; anchors.top: parent.top; color: root.voidColor }
      Rectangle { width: 12; height: 12; anchors.right: parent.right; anchors.top: parent.top; color: root.voidColor }
      Rectangle { width: 12; height: 12; anchors.left: parent.left; anchors.bottom: parent.bottom; color: root.voidColor }
      Rectangle { width: 12; height: 12; anchors.right: parent.right; anchors.bottom: parent.bottom; color: root.voidColor }

      Rectangle {
        id: topbar
        z: 20
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.margins: 4
        height: 88
        color: root.primaryColor

        Rectangle {
          width: 50; height: 50
          anchors.left: parent.left; anchors.leftMargin: 24
          anchors.verticalCenter: parent.verticalCenter
          color: root.voidColor
          border.width: 4; border.color: root.voidColor
          SafeText {
            anchors.centerIn: parent
            text: "K"
            color: root.primaryColor
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: 30
            font.bold: true
          }
        }

        Column {
          anchors.left: parent.left; anchors.leftMargin: 92
          anchors.verticalCenter: parent.verticalCenter
          spacing: 0
          SafeText { text: "KEYCADE"; color: root.voidColor; font.family: "monospace"; font.pixelSize: 32; font.bold: true; font.letterSpacing: 4 }
          SafeText { text: i18n.t("brandSubtitle"); color: root.voidColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
        }

        Row {
          id: topControls
          anchors.right: parent.right; anchors.rightMargin: 22
          anchors.verticalCenter: parent.verticalCenter
          spacing: 10

          Rectangle {
            id: excludeButton
            width: 122; height: 36
            visible: root.view === "playing"
            color: root.screenColor; border.width: 3; border.color: root.dangerColor
            SafeText {
              anchors.centerIn: parent
              text: i18n.t("excludeAction")
              color: root.dangerColor; font.family: "monospace"; font.bold: true; font.pixelSize: 10
            }
            MouseArea { anchors.fill: parent; onClicked: root.excludeCurrentBinding() }
          }
          Rectangle {
            id: excludedButton
            width: 140; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            Rectangle { id: excludedLamp; anchors.fill: parent; color: root.coinColor; opacity: 0 }
            SafeText {
              anchors.centerIn: parent
              text: i18n.t("excludedMenu", { count: root.excludedRows.length + root.staleExcludedCount }) + " ▾"
              color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 10
            }
            MouseArea {
              anchors.fill: parent
              onClicked: {
                root.excludedMenuOpen = !root.excludedMenuOpen
                root.soundMenuOpen = false
                root.languageMenuOpen = false
              }
            }
          }
          Rectangle {
            id: soundButton
            width: 116; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            SafeText {
              anchors.centerIn: parent
              text: store.settings.feedbackSound || store.settings.countdownSound
                    ? i18n.t("soundVolume", { volume: Math.round(Number(store.settings.soundVolume || 0.6) * 100) })
                    : i18n.t("soundOff")
              color: store.settings.feedbackSound || store.settings.countdownSound ? root.successColor : root.mutedColor
              font.family: "monospace"; font.bold: true; font.pixelSize: 10
            }
            MouseArea {
              anchors.fill: parent
              onClicked: {
                root.soundMenuOpen = !root.soundMenuOpen
                root.languageMenuOpen = false
                root.excludedMenuOpen = false
              }
            }
          }
          Rectangle {
            id: languageButton
            width: 124; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            SafeText { anchors.centerIn: parent; text: root.localeLabel(i18n.locale) + " ▾"; color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 10 }
            MouseArea {
              anchors.fill: parent
              onClicked: {
                root.languageMenuOpen = !root.languageMenuOpen
                root.soundMenuOpen = false
                root.excludedMenuOpen = false
              }
            }
          }
          Rectangle {
            width: 112; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            SafeText { anchors.centerIn: parent; text: root.themeName.toUpperCase(); color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 11 }
            MouseArea { anchors.fill: parent; onClicked: root.cycleTheme() }
          }
        }
      }

      Rectangle {
        id: soundMenu
        x: topbar.x + topControls.x + soundButton.x + soundButton.width - width
        y: topbar.y + topbar.height + 8
        width: 250; height: 150
        visible: root.soundMenuOpen
        z: 100
        color: root.cabinetColor; border.width: 3; border.color: root.primaryColor
        Column {
          anchors.fill: parent; anchors.margins: 10; spacing: 8
          SafeText { text: i18n.t("soundSettings"); color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 11 }
          Row {
            spacing: 8
            Rectangle {
              width: 38; height: 30; color: root.screenColor; border.width: 2; border.color: root.mutedColor
              SafeText { anchors.centerIn: parent; text: "−"; color: root.inkColor; font.pixelSize: 18; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.adjustSoundVolume(-0.1) }
            }
            SafeText {
              width: 130; height: 30; verticalAlignment: Text.AlignVCenter; horizontalAlignment: Text.AlignHCenter
              text: i18n.t("volumePercent", { volume: Math.round(Number(store.settings.soundVolume || 0.6) * 100) })
              color: root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true
            }
            Rectangle {
              width: 38; height: 30; color: root.screenColor; border.width: 2; border.color: root.mutedColor
              SafeText { anchors.centerIn: parent; text: "+"; color: root.inkColor; font.pixelSize: 18; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.adjustSoundVolume(0.1) }
            }
          }
          Row {
            spacing: 8
            Rectangle {
              width: 108; height: 32; color: store.settings.feedbackSound ? root.successColor : root.screenColor; border.width: 2; border.color: root.mutedColor
              SafeText { anchors.centerIn: parent; text: i18n.t(store.settings.feedbackSound ? "feedbackOn" : "feedbackOff"); color: store.settings.feedbackSound ? root.voidColor : root.mutedColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.toggleSound() }
            }
            Rectangle {
              width: 108; height: 32; color: store.settings.countdownSound ? root.coinColor : root.screenColor; border.width: 2; border.color: root.mutedColor
              SafeText { anchors.centerIn: parent; text: i18n.t(store.settings.countdownSound ? "countdownOn" : "countdownOff"); color: store.settings.countdownSound ? root.voidColor : root.mutedColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.toggleCountdownSound() }
            }
          }
        }
      }

      Rectangle {
        id: excludedMenu
        x: topbar.x + topControls.x + excludedButton.x + excludedButton.width - width
        y: topbar.y + topbar.height + 8
        width: 560
        height: 58 + Math.min(240, Math.max(28, root.excludedRows.length * 40))
                + (root.staleExcludedCount > 0 ? 40 : 0)
        visible: root.excludedMenuOpen
        z: 100
        color: root.cabinetColor; border.width: 3; border.color: root.primaryColor
        Column {
          anchors.fill: parent; anchors.margins: 10; spacing: 8
          SafeText { text: i18n.t("excludedTitle"); color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 11 }
          SafeText {
            width: parent.width
            visible: root.excludedRows.length === 0
            text: i18n.t("excludedEmpty"); color: root.mutedColor; font.pixelSize: 11
            wrapMode: Text.WordWrap; maximumLineCount: 2; elide: Text.ElideRight
          }
          Flickable {
            width: parent.width
            height: Math.min(240, root.excludedRows.length * 40)
            visible: root.excludedRows.length > 0
            contentHeight: excludedRowList.height
            clip: true
            Column {
              id: excludedRowList
              width: parent.width
              Repeater {
                model: root.excludedRows
                delegate: Item {
                  id: excludedRow
                  required property var modelData
                  width: excludedRowList.width
                  height: 40
                  Row {
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 10
                    SafeText {
                      width: 170; elide: Text.ElideRight; maximumLineCount: 1
                      text: Normalizer.display(excludedRow.modelData)
                      color: root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true
                    }
                    SafeText {
                      width: 230; elide: Text.ElideRight; maximumLineCount: 1
                      text: Actions.actionName(excludedRow.modelData, i18n)
                      color: root.mutedColor; font.pixelSize: 11
                    }
                  }
                  Rectangle {
                    anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter
                    width: 92; height: 28
                    visible: root.view !== "playing"
                    color: root.screenColor; border.width: 2; border.color: root.mutedColor
                    SafeText { anchors.centerIn: parent; text: i18n.t("restoreAction"); color: root.inkColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
                    MouseArea { anchors.fill: parent; onClicked: root.restoreBinding(excludedRow.modelData.id) }
                  }
                }
              }
            }
          }
          Item {
            width: parent.width; height: 32
            visible: root.staleExcludedCount > 0
            SafeText {
              anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter
              width: 400; elide: Text.ElideRight; maximumLineCount: 1
              text: i18n.t("excludedStale", { count: root.staleExcludedCount })
              color: root.coinColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true
            }
            Rectangle {
              anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter
              width: 92; height: 28
              visible: root.view !== "playing"
              color: root.screenColor; border.width: 2; border.color: root.mutedColor
              SafeText { anchors.centerIn: parent; text: i18n.t("excludedClearStale"); color: root.inkColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.clearStaleExclusions() }
            }
          }
        }
      }

      Rectangle {
        id: languageMenu
        x: topbar.x + topControls.x + languageButton.x + (languageButton.width - width) / 2
        y: topbar.y + topbar.height + 8
        width: 164; height: i18n.supported.length * 36 + 8
        visible: root.languageMenuOpen
        z: 100
        color: root.cabinetColor; border.width: 3; border.color: root.primaryColor
        Column {
          anchors.fill: parent; anchors.margins: 4
          Repeater {
            model: i18n.supported
            delegate: Rectangle {
              id: languageOption
              required property string modelData
              width: parent.width; height: 36
              color: languageOption.modelData === i18n.locale ? root.primaryColor : root.screenColor
              SafeText { anchors.centerIn: parent; text: root.localeLabel(languageOption.modelData); color: languageOption.modelData === i18n.locale ? root.voidColor : root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.selectLocale(languageOption.modelData) }
            }
          }
        }
      }

      Rectangle {
        id: screenArea
        anchors.left: parent.left; anchors.right: parent.right
        anchors.top: topbar.bottom
        anchors.bottom: statusStrip.top
        anchors.margins: 22
        color: root.screenColor
        border.width: 4
        border.color: "#05070e"

        // Scanlines belong to the screen, so they live inside it: a child of
        // this rectangle cannot reach the top bar however its z is set, and
        // the exclude and drawer buttons up there must stay clickable. It
        // takes no input of its own either.
        Image {
          anchors.fill: parent
          anchors.margins: 4
          z: 30
          visible: !root.reducedMotion
          enabled: false
          source: Qt.resolvedUrl("assets/scanline.png")
          fillMode: Image.Tile
          // Tuned on hardware: 0.05 was invisible on this panel. Half the
          // tile is opaque, so this is the darkening of every second line.
          opacity: 0.14
          smooth: false
        }

        Column {
          anchors.fill: parent
          anchors.margins: 18
          spacing: 12

          Row {
            width: parent.width; height: 58
            Repeater {
              model: [
                { label: i18n.t("run"), value: String(root.runNumber).padStart(2, "0") },
                { label: i18n.t("progress"), value: String(root.completedCardCount()).padStart(2, "0") + " / " + root.runCardLimit },
                { label: i18n.t("runReview"), value: root.runReviewTarget },
                { label: i18n.t("runNew"), value: root.runNewTarget },
                { label: i18n.t("reinforce"), value: root.pendingReinforcementCount() },
                { label: i18n.t("accuracy"), value: root.accuracyPercent() + "%" }
              ]
              delegate: Item {
                id: hudDatum
                required property var modelData
                width: parent.width / 6; height: 58
                Column {
                  width: parent.width
                  anchors.centerIn: parent
                  SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; text: hudDatum.modelData.label; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
                  // Deliberately the small cell: the widest reading here is
                  // "07 / 24", seven glyphs, and at cell 3 that outgrows a
                  // sixth of the strip on a 1024 wide screen.
                  Item {
                    width: parent.width; height: 26
                    DotNumber {
                      anchors.horizontalCenter: parent.horizontalCenter
                      anchors.verticalCenter: parent.verticalCenter
                      value: String(hudDatum.modelData.value)
                      cell: 2
                      gap: 1
                      color: root.inkColor
                    }
                  }
                }
              }
            }
          }

          Item {
            width: parent.width; height: 24
            SafeText {
              id: totalProgressLabel
              width: 118; anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter
              text: i18n.t("totalProgress")
              color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true
            }
            Rectangle {
              id: totalProgressTrack
              anchors.left: totalProgressLabel.right; anchors.right: totalProgressValue.left
              anchors.leftMargin: 10; anchors.rightMargin: 12; anchors.verticalCenter: parent.verticalCenter
              height: 12; color: "#293252"; border.width: 1; border.color: root.mutedColor
              Rectangle {
                id: masteredProgressSegment
                anchors.left: parent.left; anchors.top: parent.top; anchors.bottom: parent.bottom
                anchors.margins: 1
                width: Math.max(0, (parent.width - 2) * root.progressCounts.mastered
                                / Math.max(1, root.progressCounts.total))
                color: root.successColor
              }
            }
            SafeText {
              id: totalProgressValue
              width: 154; anchors.right: parent.right; anchors.verticalCenter: parent.verticalCenter
              horizontalAlignment: Text.AlignRight
              text: root.progressCounts.mastered + " / " + root.progressCounts.total
                    + " · " + Math.round(root.progressCounts.mastered * 100
                                         / Math.max(1, root.progressCounts.total)) + "%"
              color: root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true
            }
          }

          Item {
            width: parent.width
            height: parent.height - 106

            Column {
              width: 90
              anchors.left: parent.left
              anchors.verticalCenter: parent.verticalCenter
              spacing: 8
              SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: i18n.t("newLearned"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
              SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: "+" + root.newLearned; color: root.successColor; font.family: "monospace"; font.pixelSize: 28; font.bold: true }
            }

            Column {
              width: 90
              anchors.right: parent.right
              anchors.verticalCenter: parent.verticalCenter
              spacing: 8
              SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: i18n.t("due"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
              SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: root.progressCounts.due; color: root.coinColor; font.family: "monospace"; font.pixelSize: 28; font.bold: true }
            }

            Item {
              id: cardHost
              width: Math.min(620, parent.width - 220)
              height: parent.height - 12
              anchors.centerIn: parent
              transform: Translate { id: cardShift; x: 0 }

              Rectangle {
                id: cardGlow
                anchors.fill: card
                anchors.margins: -8
                color: root.successColor
                opacity: 0
              }

              Rectangle {
                id: card
                anchors.fill: parent
                anchors.margins: 8
                color: root.cabinetColor
                border.width: 4
                border.color: root.feedbackKind === "hit" ? root.successColor : root.feedbackKind === "miss" ? root.dangerColor : root.primaryColor

                Rectangle {
                  id: excludeStamp
                  z: 5
                  anchors.centerIn: parent
                  width: Math.min(parent.width - 60, 430); height: 88
                  color: root.voidColor
                  border.width: 4; border.color: root.coinColor
                  opacity: root.excludeStampVisible ? 1 : 0
                  visible: opacity > 0
                  // The fade is the only part reducedMotion removes. The stamp
                  // itself still holds for its full beat, because it is the
                  // confirmation that the key left training.
                  Behavior on opacity {
                    enabled: !root.reducedMotion
                    NumberAnimation { duration: 110; easing.type: Easing.OutQuad }
                  }
                  SafeText {
                    anchors.centerIn: parent
                    width: parent.width - 24
                    horizontalAlignment: Text.AlignHCenter
                    text: i18n.t("excludeStamp")
                    color: root.coinColor; font.family: "monospace"; font.bold: true; font.pixelSize: 15
                    wrapMode: Text.WordWrap; maximumLineCount: 2; elide: Text.ElideRight
                  }
                }

                Loader {
                  anchors.fill: parent
                  sourceComponent: root.view === "playing" ? playCard
                                 : root.view === "mastery" ? masteryCard
                                 : root.view === "summary" ? summaryCard
                                 : root.view === "blocked" ? blockedCard
                                 : root.view === "closing" ? closingCard : homeCard
                }
              }
            }
          }
        }
      }

      Rectangle {
        id: statusStrip
        height: 42
        anchors.left: parent.left; anchors.right: parent.right; anchors.bottom: parent.bottom
        anchors.leftMargin: 4; anchors.rightMargin: 4; anchors.bottomMargin: 4
        color: root.voidColor
        Row {
          anchors.centerIn: parent
          spacing: 28
          Repeater {
            model: [i18n.t("localOnly"), i18n.t("inputSafe"), i18n.t("noDispatch")]
            SafeText { required property var modelData; text: modelData; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true; font.letterSpacing: 2 }
          }
        }
      }
    }
  }

  Component {
    id: homeCard
    Item {
      Column {
        anchors.centerIn: parent
        width: parent.width - 70
        spacing: 18
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.view === "home" ? i18n.t("ready") : (keybinds.loading ? i18n.t("loading") : i18n.t("acquiring"))
          color: root.successColor; font.family: "monospace"; font.bold: true; font.pixelSize: 13; font.letterSpacing: 2
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.view !== "home" ? "···"
                : root.trainingLockedOut ? i18n.t("allExcluded")
                : i18n.t(root.resumeAvailable ? "resumeTitle" : "start")
          color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 28; wrapMode: Text.WordWrap
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.trainingLockedOut ? i18n.t("allExcludedHint")
                                       : i18n.t(root.resumeAvailable ? "resumeHint" : "startHint")
          color: root.trainingLockedOut ? root.coinColor : root.mutedColor
          font.pixelSize: 15; wrapMode: Text.WordWrap
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.categorySummary(); color: root.secondaryColor
          font.family: "monospace"; font.pixelSize: 11; font.bold: true
          wrapMode: Text.WordWrap
        }
        Rectangle {
          width: 240; height: 48; anchors.horizontalCenter: parent.horizontalCenter
          visible: root.view === "home" && !root.trainingLockedOut
          color: root.primaryColor; border.width: 4; border.color: root.voidColor
          SafeText { anchors.centerIn: parent; text: "▶  " + i18n.t(root.resumeAvailable ? "resumeRun" : "startRun"); color: root.voidColor; font.family: "monospace"; font.bold: true; font.pixelSize: 15 }
          MouseArea { anchors.fill: parent; onClicked: root.startPrimary() }
        }
        Rectangle {
          width: 240; height: 38; anchors.horizontalCenter: parent.horizontalCenter
          visible: root.view === "home" && root.resumeAvailable
          color: root.screenColor; border.width: 2; border.color: root.mutedColor
          SafeText { anchors.centerIn: parent; text: i18n.t("startFresh"); color: root.mutedColor; font.family: "monospace"; font.bold: true; font.pixelSize: 11 }
          MouseArea { anchors.fill: parent; onClicked: root.startRun() }
        }
      }
    }
  }

  Component {
    id: playCard
    Item {
      Row {
        id: comboBadge
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.leftMargin: 22
        anchors.topMargin: 22
        spacing: 8
        visible: root.combo >= 2
        opacity: 1
        SafeText {
          anchors.verticalCenter: parent.verticalCenter
          text: i18n.t("combo")
          color: root.coinColor
          font.family: "monospace"; font.pixelSize: 11; font.bold: true; font.letterSpacing: 2
        }
        DotNumber {
          anchors.verticalCenter: parent.verticalCenter
          value: String(root.combo)
          cell: 3
          gap: 1
          color: root.coinColor
        }
        SequentialAnimation {
          id: comboPulse
          NumberAnimation { target: comboBadge; property: "opacity"; to: 0.35; duration: 70 }
          NumberAnimation { target: comboBadge; property: "opacity"; to: 1; duration: 200 }
        }
        Connections {
          target: root
          function onComboChanged() {
            if (root.combo >= 2 && !root.reducedMotion) comboPulse.restart()
          }
        }
      }
      DotNumber {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.rightMargin: 22
        anchors.topMargin: 22
        visible: root.deadline > 0
        value: String(root.countdownSeconds)
        cell: 4
        gap: 1
        color: root.energy < 0.25 ? root.dangerColor : root.primaryColor
      }
      Column {
        anchors.fill: parent
        anchors.margins: 28
        spacing: 10
        SafeText {
          // Narrowed so a long category line cannot run under the combo badge
          // on one side or the countdown on the other.
          width: parent.width - 260; anchors.horizontalCenter: parent.horizontalCenter
          horizontalAlignment: Text.AlignHCenter
          elide: Text.ElideRight; maximumLineCount: 1
          text: (root.currentBinding ? i18n.t("category_" + root.currentBinding.category) + " · " : "")
                + i18n.t(root.correctionRequired ? "correction" : root.currentCard && root.currentCard.remedial ? "remedial" : root.currentCard && root.currentCard.tier === "guided" ? "guided" : root.currentCard && root.currentCard.tier === "maintenance" ? "maintenance" : "learning")
          color: root.currentCard && root.currentCard.tier === "maintenance" ? root.coinColor : root.secondaryColor
          font.family: "monospace"; font.pixelSize: 12; font.bold: true; font.letterSpacing: 2
        }
        SafeText {
          width: parent.width; height: 82; verticalAlignment: Text.AlignVCenter; horizontalAlignment: Text.AlignHCenter
          text: root.currentBinding ? Actions.actionName(root.currentBinding, i18n) : ""
          color: root.inkColor; font.pixelSize: 27; font.bold: true; wrapMode: Text.WordWrap
          maximumLineCount: 2; elide: Text.ElideRight; clip: true
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: i18n.t(root.correctionRequired ? "correctionInstruction" : root.currentCard && root.currentCard.remedial ? "remedialInstruction" : root.currentCard && root.currentCard.tier === "guided" ? "guidedInstruction" : root.currentCard && root.currentCard.tier === "maintenance" ? "maintenanceInstruction" : "learningInstruction")
          color: root.mutedColor; font.pixelSize: 14; wrapMode: Text.WordWrap
        }
        // Correction only advances on the exact chord, so someone whose
        // keyboard cannot produce it is stuck. This line is how they learn
        // there is a way out; without it the top bar button may as well not
        // exist.
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          visible: root.correctionRequired
          text: i18n.t("excludeHint")
          color: root.coinColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true
          elide: Text.ElideRight; maximumLineCount: 1
        }
        Item {
          width: parent.width; height: 74
          Row {
            anchors.centerIn: parent
            spacing: 8
            visible: root.revealChord
            Repeater {
              model: root.currentBinding ? Normalizer.display(root.currentBinding).split(" + ") : []
              delegate: Row {
                id: keyDatum
                required property var modelData
                required property int index
                spacing: 8
                Rectangle {
                  width: Math.max(54, keyText.implicitWidth + 24); height: 46
                  color: root.screenColor; border.width: 3; border.color: root.inkColor
                  Rectangle { anchors.left: parent.left; anchors.right: parent.right; anchors.bottom: parent.bottom; height: 5; color: "#05070e" }
                  SafeText { id: keyText; anchors.centerIn: parent; width: parent.width - 8; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; maximumLineCount: 1; text: keyDatum.modelData; color: root.inkColor; font.family: "monospace"; font.pixelSize: 14; font.bold: true }
                }
                SafeText { visible: keyDatum.index < (root.currentBinding ? Normalizer.display(root.currentBinding).split(" + ").length - 1 : 0); text: "+"; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 20; font.bold: true; anchors.verticalCenter: parent.verticalCenter }
              }
            }
          }
        }
        Row {
          width: parent.width; height: 14; spacing: 3
          visible: root.deadline > 0
          Repeater {
            model: 20
            Rectangle {
              required property int index
              width: (parent.width - 57) / 20; height: 14
              color: index / 20 < root.energy ? (root.energy < 0.25 ? root.dangerColor : root.primaryColor) : "#293252"
            }
          }
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.feedbackText
          color: root.feedbackKind === "hit" ? root.successColor : root.feedbackKind === "miss" ? root.dangerColor : root.mutedColor
          font.family: "monospace"; font.pixelSize: 13; font.bold: true; elide: Text.ElideRight; maximumLineCount: 1
        }
      }
    }
  }

  Component {
    id: masteryCard
    Item {
      Column {
        anchors.centerIn: parent; width: parent.width - 44; spacing: 10
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: "★  " + i18n.t("masteryCelebration") + "  ★"
          color: root.coinColor; font.family: "monospace"; font.bold: true; font.pixelSize: 24
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter; wrapMode: Text.WordWrap
          text: i18n.t("masteryBody", { count: root.progressCounts.total })
          color: root.inkColor; font.pixelSize: 13
        }
        Grid {
          width: parent.width; columns: 3; spacing: 7
          Repeater {
            model: [
              { label: i18n.t("shortcutTotal"), value: root.progressCounts.total },
              { label: i18n.t("totalRuns"), value: Number(store.stats.runs || 0) },
              { label: i18n.t("trainingTime"), value: root.formatTrainingTime(store.stats.totalTrainingMs) },
              { label: i18n.t("accuracy"), value: root.masterySnapshot.accuracy + "%" },
              { label: i18n.t("response"), value: root.masterySnapshot.response ? root.masterySnapshot.response + " ms" : "—" },
              { label: i18n.t("masteryDate"), value: root.formatMasteryDate(store.stats.firstMasteryAt) }
            ]
            delegate: Rectangle {
              id: masteryDatum
              required property var modelData
              width: (parent.width - 14) / 3; height: 62
              color: root.screenColor; border.width: 2; border.color: root.successColor
              Column {
                width: parent.width - 10; anchors.centerIn: parent; spacing: 3
                SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; text: masteryDatum.modelData.label; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 9; font.bold: true }
                SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; text: masteryDatum.modelData.value; color: root.inkColor; font.family: "monospace"; font.pixelSize: 17; font.bold: true }
              }
            }
          }
        }
        SafeText {
          width: parent.width; horizontalAlignment: Text.AlignHCenter; wrapMode: Text.WordWrap
          text: i18n.t("maintenanceUnlocked")
          color: root.secondaryColor; font.pixelSize: 12; font.bold: true
        }
        Rectangle {
          width: 220; height: 36; anchors.horizontalCenter: parent.horizontalCenter
          color: root.successColor; border.width: 3; border.color: root.voidColor
          SafeText { anchors.centerIn: parent; text: i18n.t("continueSummary"); color: root.voidColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
          MouseArea { anchors.fill: parent; onClicked: root.continueFromMastery() }
        }
      }
    }
  }

  Component {
    id: summaryCard
    Item {
      Column {
        anchors.centerIn: parent; width: parent.width - 60; spacing: 18
        SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("summary"); color: root.coinColor; font.family: "monospace"; font.bold: true; font.pixelSize: 28 }
        Row {
          width: parent.width; spacing: 8
          Repeater {
            model: [
              { label: i18n.t("accuracy"), value: root.accuracyPercent() + "%" },
              { label: i18n.t("newLearned"), value: "+" + root.newLearned },
              { label: i18n.t("masteredNow"), value: "+" + root.masteredGained },
              { label: i18n.t("response"), value: root.p75Reaction() ? root.p75Reaction() + " ms" : "—" }
            ]
            delegate: Rectangle {
              id: summaryDatum
              required property var modelData
              width: (parent.width - 24) / 4; height: 94; color: root.screenColor; border.width: 2; border.color: root.primaryColor
              Column { anchors.centerIn: parent; spacing: 5
                SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: summaryDatum.modelData.label; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
                SafeText { anchors.horizontalCenter: parent.horizontalCenter; text: summaryDatum.modelData.value; color: root.inkColor; font.family: "monospace"; font.pixelSize: 22; font.bold: true }
              }
            }
          }
        }
        SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("again"); color: root.successColor; font.family: "monospace"; font.pixelSize: 14; font.bold: true }
        SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("review") + " · " + i18n.t("reviewHint"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true; wrapMode: Text.WordWrap }
        Row {
          anchors.horizontalCenter: parent.horizontalCenter
          spacing: 8
          Repeater {
            model: root.reviewSuggestions
            delegate: Rectangle {
              id: reviewDatum
              required property var modelData
              width: 154; height: 42
              color: root.screenColor; border.width: 2; border.color: root.secondaryColor
              SafeText { anchors.centerIn: parent; width: parent.width - 12; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; text: Normalizer.display(reviewDatum.modelData.binding); color: root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
              MouseArea { anchors.fill: parent; onClicked: root.requestHint(reviewDatum.modelData.binding.id) }
            }
          }
        }
      }
    }
  }

  Component {
    id: blockedCard
    Item {
      Column {
        anchors.centerIn: parent; width: parent.width - 70; spacing: 18
        SafeText { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: "×  " + i18n.t("blocked"); color: root.dangerColor; font.family: "monospace"; font.bold: true; font.pixelSize: 24; wrapMode: Text.WordWrap }
        SafeText { width: parent.width; height: 150; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter; text: root.errorMessage; color: root.inkColor; font.pixelSize: 15; wrapMode: Text.WordWrap; maximumLineCount: 5; elide: Text.ElideRight; clip: true }
      }
    }
  }

  Component {
    id: closingCard
    Item {
      SafeText { anchors.centerIn: parent; width: parent.width - 70; horizontalAlignment: Text.AlignHCenter; text: i18n.t("closing"); color: root.coinColor; font.pixelSize: 18; wrapMode: Text.WordWrap }
    }
  }
}
