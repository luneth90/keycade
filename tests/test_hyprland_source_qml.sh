#!/usr/bin/env bash

set -euo pipefail

repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
test_root=$(mktemp -d)

cleanup() {
  if [[ $test_root == /tmp/* && -d $test_root ]]; then
    rm -rf -- "$test_root"
  fi
}
trap cleanup EXIT

mkdir -p -- "$test_root/config/lib/sources" "$test_root/config/bin" "$test_root/runtime"
chmod 0700 "$test_root/runtime"
cp -- "$repo_root/lib/sources/HyprlandSource.qml" "$test_root/config/lib/sources/HyprlandSource.qml"
cp -- "$repo_root/bin/keybinds-json" "$test_root/config/bin/keybinds-json"
cp -- "$repo_root/tests/qml/hyprland_source_smoke.qml" "$test_root/config/shell.qml"
cp -- "$repo_root/bin/bounded-relay" "$test_root/config/bin/bounded-relay"

# Assert a real collection only when a compositor is actually reachable.
if [[ -n ${HYPRLAND_INSTANCE_SIGNATURE:-} ]]; then
  expect_live=1
  runtime_dir=${XDG_RUNTIME_DIR:-$test_root/runtime}
else
  expect_live=0
  runtime_dir=$test_root/runtime
fi

run_smoke() {
  env "$@" \
    KEYCADE_SMOKE_EXPECT_LIVE="$expect_live" \
    HYPRLAND_INSTANCE_SIGNATURE="${HYPRLAND_INSTANCE_SIGNATURE:-}" \
    XDG_RUNTIME_DIR="$runtime_dir" \
    QT_QPA_PLATFORM=offscreen \
    QT_QPA_PLATFORMTHEME= \
    QT_STYLE_OVERRIDE=Fusion \
    timeout 10s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
}

output=$(run_smoke KEYCADE_SMOKE_EXPECT_DEGRADED=0)
grep -Fq -- "HYPRLAND_SOURCE_SMOKE_OK" <<<"$output"

# A session that names an XKB source of its own compiles a different keymap
# than this helper would, so the collection must fall back rather than publish
# one. Only meaningful against a live compositor.
if [[ $expect_live == 1 ]]; then
  output=$(run_smoke KEYCADE_SMOKE_EXPECT_DEGRADED=1 XKB_DEFAULT_LAYOUT=de)
  grep -Fq -- "HYPRLAND_SOURCE_SMOKE_OK" <<<"$output"
fi
if grep -Fq -- "HYPRLAND_SOURCE_SMOKE_FAILED" <<<"$output"; then
  printf '%s\n' "$output" >&2
  exit 1
fi

printf 'hyprland-source QML integration test passed\n'
