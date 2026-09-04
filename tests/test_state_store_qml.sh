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

mkdir -p -- "$test_root/config/lib" "$test_root/config/bin" "$test_root/runtime"
chmod 0700 "$test_root/runtime"
cp -a -- "$repo_root/lib/." "$test_root/config/lib/"
cp -- "$repo_root/bin/state-store" "$test_root/config/bin/state-store"
cp -- "$repo_root/tests/qml/state_store_smoke.qml" "$test_root/config/shell.qml"
cp -- "$repo_root/bin/bounded-relay" "$test_root/config/bin/bounded-relay"

# A value saved by the former manual picker must neither reach runtime nor
# survive the normalization write-back.
printf '%s\n' '{"schemaVersion":3,"locale":"en","activeProfile":"tmux","profileOptions":{"tmux":{"prefix":"C-a"}}}' \
  | XDG_STATE_HOME="$test_root/state" "$repo_root/bin/state-store" write settings

output=$(
  XDG_STATE_HOME="$test_root/state" \
  XDG_RUNTIME_DIR="$test_root/runtime" \
  QT_QPA_PLATFORM=offscreen \
  QT_QPA_PLATFORMTHEME= \
  QT_STYLE_OVERRIDE=Fusion \
  timeout 10s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
)
grep -Fq -- "STATE_STORE_SMOKE_OK" <<<"$output"

settings="$test_root/state/omarchy/keycade/settings.json"
stats="$test_root/state/omarchy/keycade/stats.json"
[[ -f $settings ]]
[[ -f $stats ]]
[[ $(stat -c '%a' "$settings") == 600 ]]
[[ $(stat -c '%a' "$stats") == 600 ]]
grep -Fq -- '"locale":"zh-CN"' "$settings"
grep -Fq -- '"excludedBindings":["hyprland:64|LEFT|movefocus|l"]' "$settings"
! grep -Fq -- '__proto__' "$settings"
! grep -Fq -- 'no-profile-prefix' "$settings"
! grep -Fq -- 'profileOptions' "$settings"
grep -Fq -- '"bindings":{}' "$stats"

printf 'state-store QML integration test passed\n'
