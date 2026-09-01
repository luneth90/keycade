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

  property var eligibleBindings: []
  property var deck: []
  property int cardIndex: 0
  property int runNumber: 1
  property int correct: 0
  property int attempts: 0
  property int newLearned: 0
  property int masteredGained: 0
  property var reactions: []
  property var runResults: ({})
  property var reviewSuggestions: []
  property var progressCounts: ({ unseen: 0, learning: 0, mastered: 0, due: 0, total: 0 })
  property double cardStartedAt: 0
  property double deadline: 0
  property real energy: 1
  property int lastCountdownBeat: 0
  property bool cardLocked: false
  property bool correctionRequired: false
  property bool cardErrorSoundPlayed: false
  property string feedbackKind: "idle"
  property string feedbackText: ""
  property bool revealChord: false
  property string themeName: "tokyo"

  readonly property var currentCard: deck.length > cardIndex ? deck[cardIndex] : null
  readonly property var currentBinding: currentCard ? currentCard.binding : null
  readonly property int waveNumber: currentCard ? currentCard.wave : Math.min(3, Math.floor(cardIndex / 8) + 1)
  readonly property bool reducedMotion: Boolean(store.settings.reducedMotion)
  readonly property int activeRunId: Number(store.stats.runs || 0) + 1

  readonly property color voidColor: themeName === "gruvbox" ? "#141412" : themeName === "catppuccin" ? "#090912" : "#080b14"
  readonly property color cabinetColor: themeName === "gruvbox" ? "#3c3836" : themeName === "catppuccin" ? "#313244" : "#242a46"
  readonly property color screenColor: themeName === "gruvbox" ? "#1b1b18" : themeName === "catppuccin" ? "#11111b" : "#0d1224"
  readonly property color inkColor: themeName === "gruvbox" ? "#fbf1c7" : themeName === "catppuccin" ? "#cdd6f4" : "#f1f4ff"
  readonly property color mutedColor: themeName === "gruvbox" ? "#bdae93" : themeName === "catppuccin" ? "#a6adc8" : "#9aa5d1"
  readonly property color primaryColor: themeName === "gruvbox" ? "#fabd2f" : themeName === "catppuccin" ? "#89b4fa" : "#7aa2f7"
  readonly property color secondaryColor: themeName === "gruvbox" ? "#d3869b" : themeName === "catppuccin" ? "#cba6f7" : "#bb9af7"
  readonly property color successColor: themeName === "gruvbox" ? "#b8bb26" : themeName === "catppuccin" ? "#a6e3a1" : "#9ece6a"
  readonly property color dangerColor: themeName === "gruvbox" ? "#fb4934" : themeName === "catppuccin" ? "#f38ba8" : "#f7768e"
  readonly property color coinColor: themeName === "gruvbox" ? "#fe8019" : themeName === "catppuccin" ? "#f9e2af" : "#e0af68"

  function open(payloadJson) {
    if (root.opened) return
    var payload = {}
    try { payload = JSON.parse(String(payloadJson || "{}")) } catch (error) { payload = {} }
    root.opened = true
    root.view = "loading"
    root.errorMessage = ""
    root.guardReady = false
    root.startRequested = false
    root.themeName = String(store.settings.theme || payload.theme || "tokyo")
    if (payload.locale && i18n.supported.indexOf(payload.locale) !== -1) i18n.locale = payload.locale
    else i18n.locale = String(store.settings.locale || "en")
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
      root.shell.hide((root.manifest && root.manifest.id) || "xiaowei.keycade")
  }

  function requestSafeClose() {
    cardTimer.stop()
    sounds.stopCountdown()
    feedbackTimer.stop()
    waveTimer.stop()
    if (store.ready) store.saveStats()
    root.view = "closing"
    guard.requestClose()
  }

  function maybeShowHome() {
    if (!root.opened || root.view !== "loading" || !root.guardReady || keybinds.loading || !store.ready) return
    var result = Eligibility.filter(keybinds.bindings, { appleKeyboard: keybinds.appleKeyboard })
    root.eligibleBindings = result.eligible
    if (!root.eligibleBindings.length) {
      root.errorMessage = i18n.t("noBindings")
      guard.fail(root.errorMessage)
      return
    }
    root.runNumber = Number(store.stats.runs || 0) + 1
    refreshProgressCounts()
    root.view = "home"
    root.feedbackText = i18n.t("ready")
    if (root.startRequested) {
      root.startRequested = false
      Qt.callLater(function() { root.startRun() })
    }
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

  function cycleLocale() {
    i18n.cycle()
    store.settings.locale = i18n.locale
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function cycleTheme() {
    var themes = ["tokyo", "gruvbox", "catppuccin"]
    root.themeName = themes[(themes.indexOf(root.themeName) + 1) % themes.length]
    store.settings.theme = root.themeName
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function toggleSound() {
    store.settings.soundEnabled = !Boolean(store.settings.soundEnabled)
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function toggleCountdownSound() {
    store.settings.countdownSound = !Boolean(store.settings.countdownSound)
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function cycleSoundVolume() {
    var value = Number(store.settings.soundVolume || 0)
    if (!store.settings.soundEnabled) {
      store.settings.soundEnabled = true
      store.settings.soundVolume = 0.3
    } else if (value < 0.45) store.settings.soundVolume = 0.6
    else if (value < 0.8) store.settings.soundVolume = 1.0
    else store.settings.soundEnabled = false
    store.settings = Object.assign({}, store.settings)
    store.saveSettings()
  }

  function refreshProgressCounts() {
    root.progressCounts = Stats.counts(store.stats, root.eligibleBindings, Date.now(), root.activeRunId)
  }

  function startRun() {
    if (root.view !== "home" && root.view !== "summary") return
    if (!guard.active) {
      guard.fail("Shortcut inhibition is not active.")
      return
    }
    guard.play()
    root.runNumber = root.activeRunId
    root.deck = Scheduler.build(root.eligibleBindings, store.stats, 24, { runId: root.activeRunId })
    root.cardIndex = 0
    root.correct = 0
    root.attempts = 0
    root.newLearned = 0
    root.masteredGained = 0
    root.reactions = []
    root.runResults = ({})
    root.reviewSuggestions = []
    root.correctionRequired = false
    refreshProgressCounts()
    store.saveStats()
    root.view = "playing"
    showCard()
  }

  function showCard() {
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
    var duration = Scheduler.durationFor(root.currentCard, store.stats)
    root.energy = 1
    root.deadline = duration ? Date.now() + duration : 0
    if (duration) cardTimer.start()
  }

  function handleGameInput(event) {
    if (root.view !== "playing" || root.cardLocked || !root.currentBinding) return
    var input = Normalizer.normalizeEvent(event)
    if (input.autoRepeat || Normalizer.isModifier(input.logicalKey)) return
    if (root.correctionRequired) {
      if (Normalizer.matches(root.currentBinding, input, { appleKeyboard: keybinds.appleKeyboard })) completeCorrection()
      else missCorrection(Normalizer.inputDisplay(input))
      return
    }
    if (Normalizer.matches(root.currentBinding, input, { appleKeyboard: keybinds.appleKeyboard })) hitCurrent()
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
    sounds.playCorrection()
    if (!root.reducedMotion) hitFlash.restart()
    feedbackTimer.interval = 320
    feedbackTimer.restart()
  }

  function scheduleRetest(binding) {
    root.deck = Scheduler.insertRemedial(root.deck, root.cardIndex, binding)
  }

  function retryGuided() {
    root.cardLocked = false
    root.feedbackKind = "idle"
    root.feedbackText = i18n.t("copyChord")
    root.revealChord = true
    root.deadline = 0
    root.energy = 1
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
      root.correct += 1
      root.attempts += 1
      root.reactions = root.reactions.concat([reaction])
      hitResult.reactions.push(reaction)
      var transition = Stats.recordFirstTry(store.stats, root.currentBinding.id, true,
                                            reaction, root.activeRunId, Date.now())
      if (transition.masteredGained) root.masteredGained += 1
    }
    root.runResults[root.currentBinding.id] = hitResult
    refreshProgressCounts()
    store.saveStats()
    root.revealChord = true
    root.feedbackKind = "hit"
    root.feedbackText = i18n.t(guided ? "guidedHit" : "hit")
    sounds.playCorrect()
    if (!root.reducedMotion) hitFlash.restart()
    feedbackTimer.interval = 320
    feedbackTimer.restart()
  }

  function missCurrent(reason, received) {
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
    if (root.cardIndex % 8 === 0) {
      root.view = "wave"
      waveTimer.restart()
    } else showCard()
  }

  function finishRun() {
    cardTimer.stop()
    root.view = "summary"
    store.stats.runs = Number(store.stats.runs || 0) + 1
    var resultRows = Object.keys(root.runResults).map(function(id) { return root.runResults[id] })
    resultRows.sort(function(left, right) {
      if (left.misses !== right.misses) return right.misses - left.misses
      return Stats.percentile75(right.reactions) - Stats.percentile75(left.reactions)
    })
    root.reviewSuggestions = resultRows.slice(0, 3)
    refreshProgressCounts()
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
    soundEnabled: Boolean(store.settings.soundEnabled)
    countdownEnabled: Boolean(store.settings.countdownSound)
    volume: Number(store.settings.soundVolume || 0.6)
  }
  StateStore {
    id: store
    onReadyChanged: root.maybeShowHome()
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
  Timer { id: waveTimer; interval: 2000; repeat: false; onTriggered: { root.view = "playing"; root.showCard() } }
  Timer { id: blockedClose; interval: 5000; repeat: false; onTriggered: root.dismiss() }

  SequentialAnimation {
    id: hitFlash
    NumberAnimation { target: cardGlow; property: "opacity"; to: 1; duration: 50 }
    PauseAnimation { duration: 45 }
    NumberAnimation { target: cardGlow; property: "opacity"; to: 0; duration: 160 }
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
        if (event.key === Qt.Key_Escape) {
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
        if ((root.view === "home" || root.view === "summary")
            && (event.key === Qt.Key_Return || event.key === Qt.Key_Enter)) {
          root.startRun()
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
          root.requestSafeClose()
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
          Text {
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
          Text { text: i18n.t("tagline"); color: root.voidColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
          Text { text: "KEYCADE"; color: root.voidColor; font.family: "monospace"; font.pixelSize: 32; font.bold: true; font.letterSpacing: 4 }
        }

        Row {
          anchors.right: parent.right; anchors.rightMargin: 22
          anchors.verticalCenter: parent.verticalCenter
          spacing: 10

          Rectangle {
            width: 94; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            Text {
              anchors.centerIn: parent
              text: store.settings.soundEnabled ? "SFX " + Math.round(Number(store.settings.soundVolume || 0.6) * 100) : "SFX OFF"
              color: store.settings.soundEnabled ? root.successColor : root.mutedColor
              font.family: "monospace"; font.bold: true; font.pixelSize: 10
            }
            MouseArea { anchors.fill: parent; onClicked: root.cycleSoundVolume() }
          }
          Rectangle {
            width: 86; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            Text {
              anchors.centerIn: parent
              text: store.settings.countdownSound ? "3·2·1 ON" : "3·2·1 OFF"
              color: store.settings.countdownSound ? root.coinColor : root.mutedColor
              font.family: "monospace"; font.bold: true; font.pixelSize: 9
            }
            MouseArea { anchors.fill: parent; onClicked: root.toggleCountdownSound() }
          }
          Rectangle {
            width: 86; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            Text { anchors.centerIn: parent; text: i18n.locale.toUpperCase(); color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 12 }
            MouseArea { anchors.fill: parent; onClicked: root.cycleLocale() }
          }
          Rectangle {
            width: 112; height: 36; color: root.screenColor; border.width: 3; border.color: root.voidColor
            Text { anchors.centerIn: parent; text: root.themeName.toUpperCase(); color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 11 }
            MouseArea { anchors.fill: parent; onClicked: root.cycleTheme() }
          }
        }
      }

      Rectangle {
        anchors.left: parent.left; anchors.right: parent.right
        anchors.top: topbar.bottom
        anchors.bottom: statusStrip.top
        anchors.margins: 22
        color: root.screenColor
        border.width: 4
        border.color: "#05070e"

        Column {
          anchors.fill: parent
          anchors.margins: 18
          spacing: 12

          Row {
            width: parent.width; height: 58
            Repeater {
              model: [
                { label: i18n.t("run"), value: String(root.runNumber).padStart(2, "0") },
                { label: i18n.t("card"), value: String(Math.min(root.cardIndex + 1, root.deck.length || 24)).padStart(2, "0") + " / " + String(root.deck.length || 24) },
                { label: i18n.t("accuracy"), value: root.accuracyPercent() + "%" },
                { label: i18n.t("mastered"), value: root.progressCounts.mastered + " / " + root.progressCounts.total }
              ]
              delegate: Item {
                id: hudDatum
                required property var modelData
                width: parent.width / 4; height: 58
                Column {
                  anchors.centerIn: parent
                  Text { anchors.horizontalCenter: parent.horizontalCenter; text: hudDatum.modelData.label; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
                  Text { anchors.horizontalCenter: parent.horizontalCenter; text: hudDatum.modelData.value; color: root.inkColor; font.family: "monospace"; font.pixelSize: 24; font.bold: true }
                }
              }
            }
          }

          Item {
            width: parent.width
            height: parent.height - 70

            Column {
              width: 90
              anchors.left: parent.left
              anchors.verticalCenter: parent.verticalCenter
              spacing: 8
              Text { anchors.horizontalCenter: parent.horizontalCenter; text: i18n.t("newLearned"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
              Text { anchors.horizontalCenter: parent.horizontalCenter; text: "+" + root.newLearned; color: root.successColor; font.family: "monospace"; font.pixelSize: 28; font.bold: true }
            }

            Column {
              width: 90
              anchors.right: parent.right
              anchors.verticalCenter: parent.verticalCenter
              spacing: 8
              Text { anchors.horizontalCenter: parent.horizontalCenter; text: i18n.t("due"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
              Text { anchors.horizontalCenter: parent.horizontalCenter; text: root.progressCounts.due; color: root.coinColor; font.family: "monospace"; font.pixelSize: 28; font.bold: true }
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

                Loader {
                  anchors.fill: parent
                  sourceComponent: root.view === "playing" ? playCard : root.view === "summary" ? summaryCard : root.view === "wave" ? waveCard : root.view === "blocked" ? blockedCard : root.view === "closing" ? closingCard : homeCard
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
            Text { required property var modelData; text: modelData; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true; font.letterSpacing: 2 }
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
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.view === "home" ? i18n.t("ready") : (keybinds.loading ? i18n.t("loading") : i18n.t("acquiring"))
          color: root.successColor; font.family: "monospace"; font.bold: true; font.pixelSize: 13; font.letterSpacing: 2
        }
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.view === "home" ? i18n.t("start") : "···"
          color: root.inkColor; font.family: "monospace"; font.bold: true; font.pixelSize: 28; wrapMode: Text.WordWrap
        }
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("startHint"); color: root.mutedColor; font.pixelSize: 15 }
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.categorySummary(); color: root.secondaryColor
          font.family: "monospace"; font.pixelSize: 11; font.bold: true
          wrapMode: Text.WordWrap
        }
        Rectangle {
          width: 240; height: 48; anchors.horizontalCenter: parent.horizontalCenter
          visible: root.view === "home"
          color: root.primaryColor; border.width: 4; border.color: root.voidColor
          Text { anchors.centerIn: parent; text: "▶  START RUN"; color: root.voidColor; font.family: "monospace"; font.bold: true; font.pixelSize: 15 }
          MouseArea { anchors.fill: parent; onClicked: root.startRun() }
        }
      }
    }
  }

  Component {
    id: playCard
    Item {
      Column {
        anchors.fill: parent
        anchors.margins: 28
        spacing: 10
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: (root.currentBinding ? i18n.t("category_" + root.currentBinding.category) + " · " : "")
                + i18n.t(root.correctionRequired ? "correction" : root.currentCard && root.currentCard.remedial ? "remedial" : root.currentCard && root.currentCard.tier === "guided" ? "guided" : root.currentCard && root.currentCard.tier === "maintenance" ? "maintenance" : "learning")
          color: root.currentCard && root.currentCard.tier === "maintenance" ? root.coinColor : root.secondaryColor
          font.family: "monospace"; font.pixelSize: 12; font.bold: true; font.letterSpacing: 2
        }
        Text {
          width: parent.width; height: 82; verticalAlignment: Text.AlignVCenter; horizontalAlignment: Text.AlignHCenter
          text: root.currentBinding ? root.currentBinding.actionName : ""
          color: root.inkColor; font.pixelSize: 27; font.bold: true; wrapMode: Text.WordWrap; maximumLineCount: 2
        }
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: i18n.t(root.correctionRequired ? "correctionInstruction" : root.currentCard && root.currentCard.remedial ? "remedialInstruction" : root.currentCard && root.currentCard.tier === "guided" ? "guidedInstruction" : root.currentCard && root.currentCard.tier === "maintenance" ? "maintenanceInstruction" : "learningInstruction")
          color: root.mutedColor; font.pixelSize: 14; wrapMode: Text.WordWrap
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
                  Text { id: keyText; anchors.centerIn: parent; text: keyDatum.modelData; color: root.inkColor; font.family: "monospace"; font.pixelSize: 14; font.bold: true }
                }
                Text { visible: keyDatum.index < (root.currentBinding ? Normalizer.display(root.currentBinding).split(" + ").length - 1 : 0); text: "+"; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 20; font.bold: true; anchors.verticalCenter: parent.verticalCenter }
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
        Text {
          width: parent.width; horizontalAlignment: Text.AlignHCenter
          text: root.feedbackText
          color: root.feedbackKind === "hit" ? root.successColor : root.feedbackKind === "miss" ? root.dangerColor : root.mutedColor
          font.family: "monospace"; font.pixelSize: 13; font.bold: true
        }
      }
    }
  }

  Component {
    id: waveCard
    Item {
      Column {
        anchors.centerIn: parent; width: parent.width - 70; spacing: 20
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("wave", { wave: Math.floor(root.cardIndex / 8) }); color: root.coinColor; font.family: "monospace"; font.bold: true; font.pixelSize: 30 }
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("waveStats", { accuracy: root.accuracyPercent(), learned: root.newLearned, mastered: root.masteredGained }); color: root.inkColor; font.pixelSize: 17 }
      }
    }
  }

  Component {
    id: summaryCard
    Item {
      Column {
        anchors.centerIn: parent; width: parent.width - 60; spacing: 18
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("summary"); color: root.coinColor; font.family: "monospace"; font.bold: true; font.pixelSize: 28 }
        Row {
          width: parent.width; spacing: 8
          Repeater {
            model: [
              { label: i18n.t("accuracy"), value: root.accuracyPercent() + "%" },
              { label: i18n.t("newLearned"), value: "+" + root.newLearned },
              { label: i18n.t("masteredNow"), value: "+" + root.masteredGained },
              { label: i18n.t("p75"), value: root.p75Reaction() ? root.p75Reaction() + " ms" : "—" }
            ]
            delegate: Rectangle {
              id: summaryDatum
              required property var modelData
              width: (parent.width - 24) / 4; height: 94; color: root.screenColor; border.width: 2; border.color: root.primaryColor
              Column { anchors.centerIn: parent; spacing: 5
                Text { anchors.horizontalCenter: parent.horizontalCenter; text: summaryDatum.modelData.label; color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true }
                Text { anchors.horizontalCenter: parent.horizontalCenter; text: summaryDatum.modelData.value; color: root.inkColor; font.family: "monospace"; font.pixelSize: 22; font.bold: true }
              }
            }
          }
        }
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("again"); color: root.successColor; font.family: "monospace"; font.pixelSize: 14; font.bold: true }
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: i18n.t("review") + " · " + i18n.t("reviewHint"); color: root.mutedColor; font.family: "monospace"; font.pixelSize: 10; font.bold: true; wrapMode: Text.WordWrap }
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
              Text { anchors.centerIn: parent; width: parent.width - 12; horizontalAlignment: Text.AlignHCenter; elide: Text.ElideRight; text: Normalizer.display(reviewDatum.modelData.binding); color: root.inkColor; font.family: "monospace"; font.pixelSize: 11; font.bold: true }
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
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: "×  " + i18n.t("blocked"); color: root.dangerColor; font.family: "monospace"; font.bold: true; font.pixelSize: 24; wrapMode: Text.WordWrap }
        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: root.errorMessage; color: root.inkColor; font.pixelSize: 15; wrapMode: Text.WordWrap }
      }
    }
  }

  Component {
    id: closingCard
    Item {
      Text { anchors.centerIn: parent; width: parent.width - 70; horizontalAlignment: Text.AlignHCenter; text: i18n.t("closing"); color: root.coinColor; font.pixelSize: 18; wrapMode: Text.WordWrap }
    }
  }
}
