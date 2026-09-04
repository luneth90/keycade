.pragma library
.import "../../Session.js" as Session
.import "../../Profiles.js" as Profiles

// What a pack-backed training ground still decides at run time.
//
// Almost nothing, and that is the point: a pack was curated when it was built.
// tools/build_packs.py already dropped what a compact keyboard cannot press,
// what answers with Esc, what carries no description, what nobody needs taught,
// and anything whose notation could not be read - each with a counted reason.
// PackSource.qml bounded and de-duplicated what was left, on its own.
//
// So the only thing left here is the user's own set-aside list, which is the
// same mechanism the Hyprland ground uses and lands in the same place: an
// entry in settings.json, namespaced by ground, holding the local id.

function filter(bindings, options) {
  var opts = options || {}
  var profileId = Profiles.valid(opts.profile) ? String(opts.profile) : ""
  // Re-derived from the stored array on every call: this side never trusts
  // what settings.json happened to hold.
  var userExcluded = Session.excludedSet(opts.excludedBindings, profileId)
  var eligible = []
  var excluded = []
  for (var index = 0; index < bindings.length; index++) {
    var item = bindings[index]
    if (Object.prototype.hasOwnProperty.call(userExcluded, item.localId))
      excluded.push({ binding: item, reason: "user-excluded" })
    else
      eligible.push(item)
  }
  return { eligible: eligible, excluded: excluded }
}

function categories(bindings) {
  var names = []
  for (var index = 0; index < bindings.length; index++) {
    var name = String(bindings[index].category || "")
    if (name && names.indexOf(name) === -1) names.push(name)
  }
  return names.sort()
}
