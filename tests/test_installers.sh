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

export HOME="$test_root/home"
export XDG_STATE_HOME="$test_root/state"
export PATH="$repo_root/tests/mocks:$PATH"

mkdir -p -- "$HOME/.config/hypr"
printf '%s\n' '-- existing user binding' >"$HOME/.config/hypr/bindings.lua"

"$repo_root/install.sh" >/dev/null

plugin_dir="$HOME/.config/omarchy/plugins/xiaowei.keycade"
[[ -f $plugin_dir/manifest.json ]]
grep -Fq -- '-- keycade:begin' "$HOME/.config/hypr/bindings.lua"
grep -Fq -- 'SUPER + CTRL + G' "$HOME/.config/hypr/bindings.lua"

"$repo_root/install.sh" >/dev/null
[[ $(grep -Fc -- '-- keycade:begin' "$HOME/.config/hypr/bindings.lua") == 1 ]]

"$repo_root/uninstall.sh" >/dev/null

[[ ! -e $plugin_dir ]]
grep -Fq -- '-- existing user binding' "$HOME/.config/hypr/bindings.lua"
if grep -Fq -- '-- keycade:begin' "$HOME/.config/hypr/bindings.lua"; then
  printf 'installer marker remained after uninstall\n' >&2
  exit 1
fi

KEYCADE_MOCK_CONFLICT=1 "$repo_root/install.sh" >/dev/null 2>&1
if grep -Fq -- '-- keycade:begin' "$HOME/.config/hypr/bindings.lua"; then
  printf 'installer overwrote a conflicting binding\n' >&2
  exit 1
fi
"$repo_root/uninstall.sh" >/dev/null

"$repo_root/install.sh" --no-bind >/dev/null
mkdir -p -- "$XDG_STATE_HOME/omarchy/keycade"
printf '{}\n' >"$XDG_STATE_HOME/omarchy/keycade/stats.json"
"$repo_root/uninstall.sh" --purge-state >/dev/null
[[ ! -e $XDG_STATE_HOME/omarchy/keycade ]]

printf 'installer integration test passed\n'
