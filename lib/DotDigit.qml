pragma ComponentBehavior: Bound

import QtQuick
import "DotFont.js" as DotFont

// One glyph of the 5x7 matrix, drawn as cells rather than a font: ten digits
// and a slash do not justify shipping, licensing and keeping a bitmap face
// resident in a plugin that is loaded for the whole session.
Item {
  id: root

  property string glyph: "0"
  property int cell: 4
  property int gap: 1
  property color color: "#ffffff"

  readonly property var rows: DotFont.glyph(root.glyph)

  implicitWidth: 5 * root.cell + 4 * root.gap
  implicitHeight: 7 * root.cell + 6 * root.gap
  width: implicitWidth
  height: implicitHeight

  Repeater {
    model: 35
    delegate: Rectangle {
      required property int index
      readonly property int row: Math.floor(index / 5)
      readonly property int column: index % 5
      x: column * (root.cell + root.gap)
      y: row * (root.cell + root.gap)
      width: root.cell
      height: root.cell
      color: root.color
      visible: (root.rows[row] & (1 << (4 - column))) !== 0
    }
  }
}
