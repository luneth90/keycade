pragma ComponentBehavior: Bound

import QtQuick

// A short numeric readout in the dot matrix. The value is coerced to a string
// by the caller; anything outside the supported glyph set renders blank.
Row {
  id: root

  property string value: "0"
  property int cell: 4
  property int gap: 1
  property color color: "#ffffff"

  spacing: root.cell + root.gap

  Repeater {
    model: root.value.split("")
    delegate: DotDigit {
      required property var modelData
      glyph: modelData
      cell: root.cell
      gap: root.gap
      color: root.color
    }
  }
}
