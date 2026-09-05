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
  // The ground's configurable keys, by the names its profile declares:
  // { leader: " ", localleader: "\\" } for LazyVim, { prefix: "C-b" } for
  // tmux. They are configuration in the application being trained, not keys, so
  // someone who moved theirs trains the mapping rather than a key they never
  // press. Anything absent here falls back to the profile's own default.
  property var options: ({})
  // The opt-in bundles this machine has turned on, as its own configuration
  // named them. An entry provided only by a bundle that is off is not dealt:
  // teaching a plugin nobody installed is worse than teaching nothing.
  property var enabledExtras: []
  // Literal mappings this machine added, replaced or deleted. Empty for every
  // ground except LazyVim; keeping it on the shared loader makes the merge a
  // property of a pack rather than a branch in the game.
  property var overrides: []
  property var packOverride: null

  readonly property int maxBindings: 512
  readonly property int maxSteps: 8
  readonly property int maxLocalIdChars: 128
  readonly property int maxDescriptionChars: 512
  readonly property int maxOptionChars: 32
  readonly property int maxExtras: 128
  readonly property int maxCategories: 32
  readonly property int maxAlternates: 4

  property var bindings: []
  property string fingerprint: ""
  property string sourceLabel: ""
  property bool loading: false
  property string error: ""
  // Entries the pack carried that this side refused. Surfaced for the same
  // reason the Hyprland source surfaces its own: a dropped entry has to be
  // observable rather than quietly missing from training.
  property int rejected: 0
  // Entries this table carries for bundles this machine has not turned on.
  // Not a rejection - they are simply not here.
  property int disabledCount: 0
  property int customAdded: 0
  property int customChanged: 0
  property int customDeleted: 0
  property int customSkipped: 0

  signal loaded()
  signal failed(string message)

  function safeText(value, limit) {
    if (typeof value !== "string") return ""
    var text = value
    if (!text.length || text.length > limit) return ""
    return text.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
  }

  function safeMap() { return Object.create(null) }

  function usableKey(value) {
    var key = String(value === undefined || value === null ? "" : value)
    return key && ["__proto__", "constructor", "prototype"].indexOf(key) === -1 ? key : ""
  }

  function acceptedCategories(value) {
    if (!Array.isArray(value) || !value.length || value.length > root.maxCategories) return null
    var accepted = []
    var seen = root.safeMap()
    for (var index = 0; index < value.length; index++) {
      var name = root.usableKey(root.safeText(value[index], 32))
      if (!name || seen[name]) return null
      seen[name] = true
      accepted.push(name)
    }
    return accepted
  }

  // What a named option resolves to, as a person would write it.
  function optionValue(name) {
    var defaults = Profiles.options(root.profileId)
    var stored = root.options && root.options[name] !== undefined ? root.options[name] : undefined
    var value = stored !== undefined ? stored : defaults[name]
    return value === undefined ? "" : String(value)
  }

  // A pack stores { option: "leader" } rather than the key it was built with,
  // so the answer follows the detected configuration.
  function resolvedStep(step) {
    if (!step || typeof step !== "object" || Array.isArray(step)) return null
    if (step.option !== undefined) {
      var name = root.safeText(step.option, 32)
      if (!name) return null
      return TextKey.parseKeySpec(root.optionValue(name))
    }
    return TextKey.normalizedStep(step)
  }

  // Whether any bundle that provides an entry is turned on here.
  function anyEnabled(providers) {
    for (var index = 0; index < providers.length; index++) {
      if (root.enabledExtras.indexOf(providers[index]) !== -1) return true
    }
    return false
  }

  function resolvedSteps(value) {
    if (!Array.isArray(value) || !value.length || value.length > root.maxSteps) return null
    var steps = []
    for (var index = 0; index < value.length; index++) {
      var step = root.resolvedStep(value[index])
      // An answer with one unreadable step is not a partially good answer.
      if (!step) return null
      // Esc saves the run and leaves; no ground answers with it.
      if (step.named === "ESC") return null
      steps.push(step)
    }
    return steps
  }

  function acceptedBinding(record, categories) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return null
    var localId = root.usableKey(root.safeText(record.localId, root.maxLocalIdChars))
    var description = root.safeText(record.desc, root.maxDescriptionChars)
    var category = root.safeText(record.category, 32)
    var context = root.safeText(record.context, 32)
    if (!localId || !description || categories.indexOf(category) === -1) return null
    // The modes a card can pose belong to the ground, not to this loader. The
    // first pack's were Neovim's; the second's are not.
    if (Profiles.contexts(root.profileId).indexOf(context) === -1) return null
    if (!Array.isArray(record.steps) || !record.steps.length
        || record.steps.length > root.maxSteps) return null
    var providers = []
    if (record.extras !== undefined && !Array.isArray(record.extras)) return null
    if (Array.isArray(record.extras)) {
      if (record.extras.length > root.maxExtras) return null
      for (var provider = 0; provider < record.extras.length; provider++) {
        var name = root.safeText(record.extras[provider], 128)
        if (name && providers.indexOf(name) === -1) providers.push(name)
      }
    }
    if (providers.length && !root.anyEnabled(providers)) return "disabled"
    var steps = root.resolvedSteps(record.steps)
    if (!steps) return null
    // The other ways in - tmux's prefix2, say. One whose option is unset
    // resolves to nothing and is simply not offered.
    var alternates = []
    var primaryKey = JSON.stringify(steps)
    var alternateKeys = root.safeMap()
    if (record.alternates !== undefined && !Array.isArray(record.alternates)) return null
    if (Array.isArray(record.alternates)) {
      if (record.alternates.length > root.maxAlternates) return null
      for (var other = 0; other < record.alternates.length; other++) {
        var sequence = root.resolvedSteps(record.alternates[other])
        var sequenceKey = root.usableKey(sequence ? JSON.stringify(sequence) : "")
        if (sequence && sequenceKey && sequenceKey !== primaryKey && !alternateKeys[sequenceKey]) {
          alternateKeys[sequenceKey] = true
          alternates.push(sequence)
        }
      }
    }
    return {
      localId: localId,
      id: Profiles.qualify(root.profileId, localId),
      category: category,
      // Empty means the ground's own defaults provide it, so it is always
      // dealt. Otherwise at least one of these has to be on.
      extras: providers,
      actionName: description,
      // The upstream's own English, and the key a language pack answers with
      // a translation of it. An entry whose key no pack answers keeps the
      // English, which is what a rewritten description upstream produces.
      descKey: root.safeText(record.descKey, 128),
      notation: root.safeText(record.notation, root.maxLocalIdChars),
      customKind: root.safeText(record.customKind, 16),
      answer: { judgeMode: "text", context: context, steps: steps, alternates: alternates }
    }
  }

  function mergedBindings(pack) {
    var records = pack.bindings.slice()
    if (root.profileId !== "lazyvim" || !Array.isArray(root.overrides)
        || !root.overrides.length) return records
    var byId = root.safeMap()
    var defaults = root.safeMap()
    // Indexed by the spelling Vim itself would consider the same, so a line
    // written <Leader>ff finds the packaged <leader>ff instead of landing
    // beside it as a second card.
    for (var index = 0; index < records.length; index++) {
      var packedId = root.usableKey(TextKey.canonicalNotation(records[index].localId))
      if (!packedId) continue
      byId[packedId] = index
      defaults[packedId] = true
    }
    var deleted = root.safeMap()
    for (var change = 0; change < root.overrides.length; change++) {
      var item = root.overrides[change]
      var parsed = TextKey.parseNotation(item.lhs)
      if (!parsed) {
        root.customSkipped += 1
        continue
      }
      for (var mode = 0; mode < item.contexts.length; mode++) {
        var context = String(item.contexts[mode] || "")
        var written = context + "/" + String(item.lhs || "")
        var localId = root.usableKey(TextKey.canonicalNotation(written))
        if (!localId) {
          root.customSkipped += 1
          continue
        }
        var position = byId[localId]
        if (item.op === "del") {
          if (position !== undefined && !deleted[localId]) {
            deleted[localId] = true
          }
          continue
        }
        var replacement
        if (position !== undefined) {
          replacement = Object.assign({}, records[position], {
            desc: item.desc, descKey: "", extras: [], steps: parsed,
            alternates: [], customKind: defaults[localId] ? "changed" : "added"
          })
          records[position] = replacement
          deleted[localId] = false
        } else {
          replacement = {
            localId: written, context: context, notation: item.lhs,
            steps: parsed, alternates: [], category: "misc", descKey: "",
            desc: item.desc, extras: [], customKind: "added"
          }
          byId[localId] = records.length
          records.push(replacement)
        }
      }
    }
    var merged = records.filter(function(record) {
      var deletedId = root.usableKey(TextKey.canonicalNotation(record.localId))
      return !deletedId || !deleted[deletedId]
    })
    for (var result = 0; result < merged.length; result++) {
      if (merged[result].customKind === "added") root.customAdded += 1
      else if (merged[result].customKind === "changed") root.customChanged += 1
    }
    Object.keys(defaults).forEach(function(localId) {
      if (deleted[localId]) root.customDeleted += 1
    })
    return merged
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
    root.customAdded = 0
    root.customChanged = 0
    root.customDeleted = 0
    root.customSkipped = 0
    root.bindings = []
    if (!Profiles.isPack(root.profileId)) {
      root.fail("Unknown pack profile")
      return
    }
    var liveOverride = root.packOverride !== null && root.packOverride !== undefined
    var pack = liveOverride ? root.packOverride : Packs.pack(root.profileId)
    if (!pack || pack.schemaVersion !== 1 || pack.profile !== root.profileId
        || pack.judgeMode !== "text" || !Array.isArray(pack.bindings)) {
      if (liveOverride) {
        root.packOverride = null
        root.refresh()
        return
      }
      root.fail("Unsupported pack schema")
      return
    }
    if (pack.bindings.length > root.maxBindings) {
      if (liveOverride) {
        root.packOverride = null
        root.refresh()
        return
      }
      root.fail("Pack exceeded its entry limit")
      return
    }
    var declared = Object.keys(Profiles.options(root.profileId))
    for (var option = 0; option < declared.length; option++) {
      if (String(root.optionValue(declared[option])).length > root.maxOptionChars) {
        root.fail("Option " + declared[option] + " exceeded its limit")
        return
      }
    }

    var categories = root.acceptedCategories(
        Array.isArray(pack.categories) ? pack.categories : root.packCategories(pack))
    if (!categories) {
      if (liveOverride) {
        root.packOverride = null
        root.refresh()
        return
      }
      root.fail("Pack categories exceeded their limits")
      return
    }
    var accepted = []
    var refused = 0
    var disabled = 0
    var seen = root.safeMap()
    var records = root.mergedBindings(pack)
    for (var index = 0; index < records.length; index++) {
      var item = root.acceptedBinding(records[index], categories)
      if (item === "disabled") { disabled += 1; continue }
      if (!item || !root.usableKey(item.id) || seen[item.id]) { refused += 1; continue }
      if (accepted.length >= root.maxBindings) { refused += 1; continue }
      seen[item.id] = true
      accepted.push(item)
    }
    // A live table is optional calibration. If every record was unreadable,
    // an empty cabinet would be a silent failure; reload the reviewed fallback
    // instead. A malformed live top level takes the same path above.
    if (liveOverride && !accepted.length) {
      root.packOverride = null
      root.refresh()
      return
    }
    root.bindings = accepted
    root.rejected = refused
    root.disabledCount = disabled
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
      var name = pack.bindings[index]
          ? root.usableKey(root.safeText(pack.bindings[index].category, 32)) : ""
      if (!name) return []
      if (names.indexOf(name) === -1) {
        if (names.length >= root.maxCategories) return []
        names.push(name)
      }
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
