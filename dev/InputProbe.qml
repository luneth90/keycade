import QtQuick
import Quickshell
import Quickshell.Wayland
import Quickshell.Wayland._ShortcutsInhibitor
import "../lib"
import "../lib/InputNormalizer.js" as Normalizer

ShellRoot {
  id: shellRoot

  property string eventKey: "—"
  property string eventText: "—"
  property int scanCode: 0
  property int qtModifiers: 0
  property int normalizedModifiers: 0
  property string normalizedKey: "—"
  property int heldModifiers: 0

  PanelWindow {
    id: probe
    visible: true
    anchors { top: true; bottom: true; left: true; right: true }
    color: "#080b14"
    WlrLayershell.namespace: "keycade-input-probe"
    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive
    exclusionMode: ExclusionMode.Ignore

    ShortcutInhibitor {
      id: inhibitor
      window: probe
      enabled: true
    }

    Item {
      id: catcher
      anchors.fill: parent
      focus: true
      Keys.priority: Keys.BeforeItem

      Keys.onPressed: function(event) {
        var input = Normalizer.normalizeEvent(event)
        shellRoot.eventKey = "0x" + Number(event.key).toString(16).toUpperCase()
        shellRoot.eventText = event.text || "—"
        shellRoot.scanCode = Number(event.nativeScanCode || 0)
        shellRoot.qtModifiers = Number(event.modifiers || 0)
        shellRoot.normalizedModifiers = input.modMask
        shellRoot.normalizedKey = input.logicalKey
        shellRoot.heldModifiers = input.modMask
        event.accepted = true
      }
      Keys.onReleased: function(event) {
        shellRoot.heldModifiers = Normalizer.modifierMask(event.modifiers)
        if (event.key === Qt.Key_Escape && shellRoot.heldModifiers === 0) Qt.quit()
        event.accepted = true
      }
    }

    Rectangle {
      width: Math.min(720, parent.width - 80)
      height: 520
      anchors.centerIn: parent
      color: "#242a46"
      border.width: 4
      border.color: inhibitor.active ? "#9ece6a" : "#f7768e"

      Column {
        anchors.fill: parent
        anchors.margins: 32
        spacing: 15
        SafeText { text: "KEYCADE · INPUT PROBE"; color: "#7aa2f7"; font.family: "monospace"; font.pixelSize: 25; font.bold: true }
        SafeText { text: "Exclusive focus: " + catcher.activeFocus; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "Inhibitor enabled: " + inhibitor.enabled; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "Inhibitor active: " + inhibitor.active; color: inhibitor.active ? "#9ece6a" : "#f7768e"; font.family: "monospace"; font.pixelSize: 16; font.bold: true }
        Rectangle { width: parent.width; height: 3; color: "#3d59a1" }
        SafeText { text: "event.key          " + shellRoot.eventKey; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "event.text         " + shellRoot.eventText; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "nativeScanCode     " + shellRoot.scanCode; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "event.modifiers    " + shellRoot.qtModifiers; color: "#f1f4ff"; font.family: "monospace"; font.pixelSize: 16 }
        SafeText { text: "normalized         mask=" + shellRoot.normalizedModifiers + " key=" + shellRoot.normalizedKey; color: "#e0af68"; font.family: "monospace"; font.pixelSize: 16; font.bold: true }
        SafeText { text: "held modifiers     " + shellRoot.heldModifiers; color: "#bb9af7"; font.family: "monospace"; font.pixelSize: 16 }
        Item { width: 1; height: 8 }
        SafeText { text: "Press chords to inspect · release Esc to exit"; color: "#9aa5d1"; font.pixelSize: 14 }
      }
    }
  }
}
