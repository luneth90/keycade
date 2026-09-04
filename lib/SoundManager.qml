import QtQuick
import QtMultimedia

Item {
  id: root

  property bool feedbackEnabled: true
  property bool countdownEnabled: true
  property real volume: 0.6
  property double lastFeedbackAt: 0
  property int feedbackCooldownMs: 180

  function playFeedback(effect) {
    var now = Date.now()
    if (!root.feedbackEnabled || now - root.lastFeedbackAt < root.feedbackCooldownMs) return
    root.lastFeedbackAt = now
    correctSound.stop()
    wrongSound.stop()
    effect.play()
  }

  function playCorrect() {
    playFeedback(correctSound)
  }

  function playWrong() {
    playFeedback(wrongSound)
  }

  // Deliberately not routed through playFeedback: excluding a bind almost
  // always follows a miss, and that path both stops the sound just played and
  // swallows anything inside its cooldown, so the eject would be silent
  // exactly when it matters most.
  function playEject() {
    if (!root.feedbackEnabled) return
    ejectSound.stop()
    ejectSound.play()
  }

  // Its own path as well: a combo milestone lands on the same beat as the
  // correct-answer sound, and playFeedback would have one cancel the other.
  function playCombo() {
    if (!root.feedbackEnabled) return
    comboSound.stop()
    comboSound.play()
  }

  // The celebration is a one-off, so it bypasses the cooldown too rather than
  // being swallowed by whichever answer sound ended the run.
  function playMastery() {
    if (!root.feedbackEnabled) return
    masterySound.stop()
    masterySound.play()
  }

  function playCountdown(finalBeat) {
    if (!root.countdownEnabled) return
    if (finalBeat) countdownFinalSound.play()
    else countdownSound.play()
  }

  function stopCountdown() {
    countdownSound.stop()
    countdownFinalSound.stop()
  }

  SoundEffect {
    id: correctSound
    source: Qt.resolvedUrl("../assets/sfx/correct.wav")
    volume: root.volume * 0.85
  }

  SoundEffect {
    id: wrongSound
    source: Qt.resolvedUrl("../assets/sfx/wrong.wav")
    volume: root.volume * 0.8
  }

  SoundEffect {
    id: ejectSound
    source: Qt.resolvedUrl("../assets/sfx/eject.wav")
    volume: root.volume * 0.45
  }

  SoundEffect {
    id: comboSound
    source: Qt.resolvedUrl("../assets/sfx/combo.wav")
    volume: root.volume * 0.4
  }

  SoundEffect {
    id: masterySound
    source: Qt.resolvedUrl("../assets/sfx/mastery.wav")
    volume: root.volume * 0.5
  }

  SoundEffect {
    id: countdownSound
    source: Qt.resolvedUrl("../assets/sfx/countdown.wav")
    volume: root.volume * 0.8
  }

  SoundEffect {
    id: countdownFinalSound
    source: Qt.resolvedUrl("../assets/sfx/countdown-final.wav")
    volume: root.volume * 0.9
  }
}
