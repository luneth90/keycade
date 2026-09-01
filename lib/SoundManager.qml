import QtQuick
import QtMultimedia

Item {
  id: root

  property bool soundEnabled: true
  property bool countdownEnabled: true
  property real volume: 0.6

  function playCorrect() {
    if (root.soundEnabled) correctSound.play()
  }

  function playWrong() {
    if (root.soundEnabled) wrongSound.play()
  }

  function playCorrection() {
    if (root.soundEnabled) correctionSound.play()
  }

  function playCountdown(finalBeat) {
    if (!root.soundEnabled || !root.countdownEnabled) return
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
    volume: root.volume
  }

  SoundEffect {
    id: wrongSound
    source: Qt.resolvedUrl("../assets/sfx/wrong.wav")
    volume: root.volume
  }

  SoundEffect {
    id: correctionSound
    source: Qt.resolvedUrl("../assets/sfx/correction.wav")
    volume: root.volume * 0.8
  }

  SoundEffect {
    id: countdownSound
    source: Qt.resolvedUrl("../assets/sfx/countdown.wav")
    volume: root.volume * 0.75
  }

  SoundEffect {
    id: countdownFinalSound
    source: Qt.resolvedUrl("../assets/sfx/countdown-final.wav")
    volume: root.volume * 0.85
  }
}
