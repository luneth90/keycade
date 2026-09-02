import QtQuick
import "Locales.js" as Locales

Item {
  id: root

  // The message catalogue is compiled into Locales.js by tools/build_locales.py,
  // so switching locales never touches the filesystem.
  property string locale: "en"
  readonly property var supported: Locales.supported()
  readonly property var messages: Locales.messages(root.locale)

  function t(key, variables) {
    var name = String(key || "")
    var template = Object.prototype.hasOwnProperty.call(root.messages, name)
        ? String(root.messages[name]) : name
    var values = variables || {}
    return template.replace(/\{(\w+)\}/g, function(_, field) {
      return values[field] === undefined ? "{" + field + "}" : String(values[field])
    })
  }

  function cycle() {
    var index = root.supported.indexOf(root.locale)
    root.locale = root.supported[(index + 1) % root.supported.length]
  }
}
