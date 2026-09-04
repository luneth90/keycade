import QtQuick
import "../Packs.js" as Packs
import "../Profiles.js" as Profiles
import "../TextKey.js" as TextKey

// The source every pack-backed training ground shares. A pack is the upstream's
// own published key table, compiled into lib/Packs.js by tools/build_packs.py
// and shipped with the plugin.
//
// Nothing here reaches outside the plugin: no file is read, no process is
// started, no socket is opened, nothing is fetched. That is the point of a
// pack rather than a reader for the application's own configuration - see
// docs/app-profile-extension-plan.md section 5 for why this ground gets its
// table from upstream while the Hyprland ground reads the machine.
//
// The table was already bounded when it was built. It is bounded again here,
// on its own, because "the generator checked it" is not a property this side
// can verify.
Item {
  id: root

  property string profileId: ""
  // Resolved into the placeholder steps a pack stores for them. Both are
  // settings in the application being trained, not keys, so a user who moved
  // their leader still trains the mapping rather than a key they never press.
  property string leader: " "
  property string localleader: "\\"

  readonly property int maxBindings: 512
  readonly property int maxSteps: 8
  readonly property int maxLocalIdChars: 128
  readonly property int maxDescriptionChars: 512
  readonly property int maxLeaderChars: 8

  property var bindings: []
  property string fingerprint: ""
  property string sourceLabel: ""
  property bool loading: false
  property string error: ""
  // Entries the pack carried that this side refused. Surfaced for the same
  // reason the Hyprland source surfaces its own: a dropped entry has to be
  // observable rather than quietly missing from training.
  property int rejected: 0

  signal loaded()
  signal failed(string message)

  function safeText(value, limit) {
    var text = String(value === undefined || value === null ? "" : value)
    if (!text.length || text.length > limit) return ""
    return text.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
  }

  // A pack stores { leader: true } rather than a character, so the answer
  // follows the setting instead of whatever the table was built with.
  function resolvedStep(step) {
    if (!step || typeof step !== "object" || Array.isArray(step)) return null
    if (step.leader === true) return TextKey.normalizedStep({ mods: 0, text: root.leader })
    if (step.localleader === true) return TextKey.normalizedStep({ mods: 0, text: root.localleader })
    return TextKey.normalizedStep(step)
  }

  function acceptedBinding(record, categories) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return null
    var localId = root.safeText(record.localId, root.maxLocalIdChars)
    var description = root.safeText(record.desc, root.maxDescriptionChars)
    var category = root.safeText(record.category, 32)
    var context = root.safeText(record.context, 32)
    if (!localId || !description || categories.indexOf(category) === -1) return null
    // The modes a card can pose belong to the ground, not to this loader. The
    // first pack's were Neovim's; the second's are not.
    if (Profiles.contexts(root.profileId).indexOf(context) === -1) return null
    if (!Array.isArray(record.steps) || !record.steps.length
        || record.steps.length > root.maxSteps) return null
    var steps = []
    for (var index = 0; index < record.steps.length; index++) {
      var step = root.resolvedStep(record.steps[index])
      // An answer with one unreadable step is not a partially good answer.
      if (!step) return null
      // Esc saves the run and leaves; no ground answers with it.
      if (step.named === "ESC") return null
      steps.push(step)
    }
    return {
      localId: localId,
      id: Profiles.qualify(root.profileId, localId),
      category: category,
      actionName: description,
      notation: root.safeText(record.notation, root.maxLocalIdChars),
      answer: { judgeMode: "text", context: context, steps: steps }
    }
  }

  function fail(message) {
    root.loading = false
    root.bindings = []
    root.error = String(message || "Invalid pack").slice(0, 512)
    root.failed(root.error)
  }

  // Synchronous: the table is already in memory. The signals still exist so a
  // consumer cannot tell a pack ground from one that has to go and collect.
  function refresh() {
    root.loading = true
    root.error = ""
    root.rejected = 0
    if (!Profiles.isPack(root.profileId)) {
      root.fail("Unknown pack profile")
      return
    }
    var pack = Packs.pack(root.profileId)
    if (!pack || pack.schemaVersion !== 1 || pack.profile !== root.profileId
        || pack.judgeMode !== "text" || !Array.isArray(pack.bindings)) {
      root.fail("Unsupported pack schema")
      return
    }
    if (pack.bindings.length > root.maxBindings) {
      root.fail("Pack exceeded its entry limit")
      return
    }
    if (root.leader.length > root.maxLeaderChars
        || root.localleader.length > root.maxLeaderChars) {
      root.fail("Leader exceeded its limit")
      return
    }

    var categories = Array.isArray(pack.categories) ? pack.categories : root.packCategories(pack)
    var accepted = []
    var refused = 0
    var seen = ({})
    for (var index = 0; index < pack.bindings.length; index++) {
      var item = root.acceptedBinding(pack.bindings[index], categories)
      if (!item || !item.id || seen[item.id]) { refused += 1; continue }
      seen[item.id] = true
      accepted.push(item)
    }
    root.bindings = accepted
    root.rejected = refused
    root.sourceLabel = root.provenanceLabel(pack)
    root.fingerprint = root.packFingerprint(pack)
    root.loading = false
    if (refused > 0) console.warn("Keycade skipped " + refused + " invalid pack entr(ies)")
    root.loaded()
  }

  // Every category the pack actually uses, when it names no list of its own.
  function packCategories(pack) {
    var names = []
    for (var index = 0; index < pack.bindings.length; index++) {
      var name = pack.bindings[index] ? String(pack.bindings[index].category || "") : ""
      if (name && names.indexOf(name) === -1) names.push(name)
    }
    return names
  }

  // A table is identified by whatever its authority can be pinned to: a
  // commit for a generated page, a checksum for a vendor listing.
  function packFingerprint(pack) {
    var source = (pack.provenance || {}).source || {}
    return root.safeText(source.commit, 64) || root.safeText(source.checksum, 64)
  }

  // What the ground says about itself on screen. It names the upstream, the
  // version the table describes and the day it was taken, and never implies
  // it read your machine.
  function provenanceLabel(pack) {
    var provenance = pack.provenance || {}
    var source = provenance.source || {}
    var tag = root.safeText(source.tag, 32)
        || (provenance.crossCheck ? root.safeText(provenance.crossCheck.tag, 32) : "")
    return [root.safeText(provenance.upstream, 64), tag, root.safeText(source.date, 32)]
        .filter(Boolean).join(" · ")
  }
}
