pragma ComponentBehavior: Bound

import QtQuick

// A frame of square blocks that step around the perimeter, the way a cabinet
// marquee does. Blocks rather than a hairline border, because next to a chunky
// outer edge a one pixel rule reads as a border from a word processor.
Item {
  id: root

  property int unit: 5
  property color color: "#ffffff"
  // Motion is opt-in: the caller decides where a moving frame helps and where
  // it would sit in the corner of the eye during timed recall.
  property bool running: false
  property int tickMs: 90

  property int phase: 0

  readonly property int step: root.unit * 2
  readonly property int columns: Math.max(1, Math.floor(root.width / root.step))
  readonly property int rows: Math.max(1, Math.floor(root.height / root.step))
  readonly property int spanH: root.columns * root.step
  readonly property int spanV: root.rows * root.step

  function slide(index: int, span: int): int {
    var value = (index * root.step + root.phase) % span
    return value < 0 ? value + span : value
  }

  // Two pixels a tick rather than a smooth slide: the rest of this interface
  // moves on a grid, so this does too.
  Timer {
    running: root.running
    interval: root.tickMs
    repeat: true
    onTriggered: root.phase = (root.phase + 2) % root.step
  }

  Repeater {
    model: root.columns
    delegate: Rectangle {
      required property int index
      x: root.slide(index, root.spanH)
      y: 0
      width: root.unit; height: root.unit
      color: root.color
    }
  }
  Repeater {
    model: root.rows
    delegate: Rectangle {
      required property int index
      x: root.width - root.unit
      y: root.slide(index, root.spanV)
      width: root.unit; height: root.unit
      color: root.color
    }
  }
  Repeater {
    model: root.columns
    delegate: Rectangle {
      required property int index
      x: root.spanH - root.unit - root.slide(index, root.spanH)
      y: root.height - root.unit
      width: root.unit; height: root.unit
      color: root.color
    }
  }
  Repeater {
    model: root.rows
    delegate: Rectangle {
      required property int index
      x: 0
      y: root.spanV - root.unit - root.slide(index, root.spanV)
      width: root.unit; height: root.unit
      color: root.color
    }
  }

  // Edges are laid out on a whole number of steps, so the far corners fall
  // short by the remainder. These four pin the frame shut at any size.
  Repeater {
    model: [
      { px: 0, py: 0 },
      { px: 1, py: 0 },
      { px: 0, py: 1 },
      { px: 1, py: 1 }
    ]
    delegate: Rectangle {
      required property var modelData
      x: modelData.px ? root.width - root.unit : 0
      y: modelData.py ? root.height - root.unit : 0
      width: root.unit; height: root.unit
      color: root.color
    }
  }
}
