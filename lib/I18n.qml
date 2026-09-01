import QtQuick
import Quickshell.Io

Item {
  id: root
  property string locale: "en"
  property var messages: ({})
  readonly property var supported: ["en", "zh-CN", "ja", "es"]
  readonly property string localePath: String(Qt.resolvedUrl("../assets/locales/" + locale + ".json")).replace("file://", "")

  function t(key, variables) {
    var template = String(root.messages[key] || key)
    var values = variables || {}
    return template.replace(/\{(\w+)\}/g, function(_, name) {
      return values[name] === undefined ? "{" + name + "}" : String(values[name])
    })
  }

  function cycle() {
    var index = supported.indexOf(locale)
    locale = supported[(index + 1) % supported.length]
  }

  onLocaleChanged: localeFile.reload()

  FileView {
    id: localeFile
    path: root.localePath
    onLoaded: {
      try {
        var value = JSON.parse(text())
        if (value.schemaVersion === 1) root.messages = value
      } catch (error) {
        console.warn("Keycade locale parse failed:", error)
      }
    }
  }
}

