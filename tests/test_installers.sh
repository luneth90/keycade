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

plugin_dir="$HOME/.config/omarchy/plugins/luneth90.keycade"
[[ -f $plugin_dir/manifest.json ]]
grep -Fq -- '-- keycade:begin' "$HOME/.config/hypr/bindings.lua"
grep -Fq -- 'SUPER + CTRL + G' "$HOME/.config/hypr/bindings.lua"
grep -Fq -- 'luneth90.keycade' "$HOME/.config/hypr/bindings.lua"
if grep -Fq -- 'xiaowei.keycade' "$HOME/.config/hypr/bindings.lua"; then
  printf 'installer wrote the legacy plugin id\n' >&2
  exit 1
fi

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

migration_remote="$test_root/migration-remote"
git clone --quiet --no-local -- "$repo_root" "$migration_remote"
git -C "$migration_remote" config user.name luneth90
git -C "$migration_remote" config user.email luneth90@icloud.com
jq '.id = "xiaowei.keycade" | .author = "xiaowei"' \
  "$migration_remote/manifest.json" >"$migration_remote/manifest.json.tmp"
mv -- "$migration_remote/manifest.json.tmp" "$migration_remote/manifest.json"
git -C "$migration_remote" add manifest.json
git -C "$migration_remote" commit --quiet -m 'test: legacy plugin id'

legacy_dir="$HOME/.config/omarchy/plugins/xiaowei.keycade"
git clone --quiet --no-local -- "$migration_remote" "$legacy_dir"
jq '.id = "luneth90.keycade" | .author = "luneth90"' \
  "$migration_remote/manifest.json" >"$migration_remote/manifest.json.tmp"
mv -- "$migration_remote/manifest.json.tmp" "$migration_remote/manifest.json"
git -C "$migration_remote" add manifest.json
git -C "$migration_remote" commit --quiet -m 'test: current plugin id'

printf '%s\n' '-- keycade:begin' >>"$HOME/.config/hypr/bindings.lua"
printf '%s\n' 'o.bind("SUPER + CTRL + G", "Keycade", "omarchy-shell shell summon xiaowei.keycade '\''{}'\''")' >>"$HOME/.config/hypr/bindings.lua"
printf '%s\n' '-- keycade:end' >>"$HOME/.config/hypr/bindings.lua"

"$repo_root/install.sh" >/dev/null
[[ ! -e $legacy_dir ]]
[[ -f $plugin_dir/manifest.json ]]
[[ $(jq -r '.id' "$plugin_dir/manifest.json") == luneth90.keycade ]]
grep -Fq -- 'luneth90.keycade' "$HOME/.config/hypr/bindings.lua"
if grep -Fq -- 'xiaowei.keycade' "$HOME/.config/hypr/bindings.lua"; then
  printf 'legacy plugin id remained after migration\n' >&2
  exit 1
fi
"$repo_root/uninstall.sh" >/dev/null

printf 'installer integration test passed\n'
