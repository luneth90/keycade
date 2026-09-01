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
    volume: root.volume * 0.5
  }

  SoundEffect {
    id: wrongSound
    source: Qt.resolvedUrl("../assets/sfx/wrong.wav")
    volume: root.volume * 0.4
  }

  SoundEffect {
    id: countdownSound
    source: Qt.resolvedUrl("../assets/sfx/countdown.wav")
    volume: root.volume * 0.45
  }

  SoundEffect {
    id: countdownFinalSound
    source: Qt.resolvedUrl("../assets/sfx/countdown-final.wav")
    volume: root.volume * 0.5
  }
}
