#!/usr/bin/env bash

set -euo pipefail

PLUGIN_ID="xiaowei.keycade"
DEFAULT_CHORD="SUPER CTRL + G"
MARKER_BEGIN="-- keycade:begin"
MARKER_END="-- keycade:end"
INSTALL_BINDING=1

usage() {
  cat <<'EOF'
Usage: ./install.sh [--no-bind]

Install Keycade from this repository into the current user's Omarchy plugin
directory, enable it, and add Super + Ctrl + G when that chord is free.

Options:
  --no-bind  Install and enable the plugin without editing Hyprland bindings.
  -h, --help Show this help.
EOF
}

fail() {
  printf 'keycade-install: %s\n' "$*" >&2
  exit 1
}

note() {
  printf '==> %s\n' "$*"
}

while (( $# > 0 )); do
  case "$1" in
    --no-bind)
      INSTALL_BINDING=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

for command_name in git jq omarchy omarchy-shell hyprctl; do
  command -v "$command_name" >/dev/null 2>&1 || fail "required command not found: $command_name"
done

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
repo_root=$(git -C "$script_dir" rev-parse --show-toplevel 2>/dev/null) \
  || fail "install.sh must be run from a Git checkout"
manifest="$repo_root/manifest.json"
[[ -f $manifest ]] || fail "manifest.json not found in $repo_root"

manifest_id=$(jq -r '.id // empty' "$manifest")
[[ $manifest_id == "$PLUGIN_ID" ]] \
  || fail "unexpected plugin id '$manifest_id' (expected '$PLUGIN_ID')"

note "Validating plugin manifest"
omarchy plugin validate "$repo_root"

plugins_dir="$HOME/.config/omarchy/plugins"
target="$plugins_dir/$PLUGIN_ID"
mkdir -p -- "$plugins_dir"

if [[ -e $target || -L $target ]]; then
  installed_id=""
  [[ -f $target/manifest.json ]] && installed_id=$(jq -r '.id // empty' "$target/manifest.json" 2>/dev/null || true)
  [[ $installed_id == "$PLUGIN_ID" ]] \
    || fail "$target already exists and is not a Keycade installation"
  note "Keycade is already installed; keeping the existing plugin copy"
else
  stage="$plugins_dir/.keycade-install.$$"
  cleanup_stage() {
    if [[ -n ${stage:-} && $stage == "$plugins_dir"/.keycade-install.* && -e $stage ]]; then
      rm -rf -- "$stage"
    fi
  }
  trap cleanup_stage EXIT

  note "Cloning Keycade into $target"
  git clone --quiet --local --no-hardlinks -- "$repo_root" "$stage"
  omarchy plugin validate "$stage"
  mv -- "$stage" "$target"
  trap - EXIT
fi

ensure_shell() {
  if omarchy-shell shell ping >/dev/null 2>&1; then
    return 0
  fi

  note "Starting Omarchy shell"
  omarchy restart shell
  for _attempt in $(seq 1 30); do
    omarchy-shell shell ping >/dev/null 2>&1 && return 0
    sleep 0.1
  done
  return 1
}

ensure_shell || fail "Omarchy shell did not become ready"
omarchy-shell shell rescanPlugins >/dev/null

note "Enabling $PLUGIN_ID"
omarchy plugin enable "$PLUGIN_ID" >/dev/null

binding_file="$HOME/.config/hypr/bindings.lua"
state_root="${XDG_STATE_HOME:-$HOME/.local/state}"
backup_dir="$state_root/omarchy/keycade-install-backups"

binding_conflicts() {
  local binds_json menu_output
  binds_json=$(hyprctl -j binds 2>/dev/null || true)
  if jq -e '
    any(.[];
      (.modmask == 68)
      and ((.key // "") | ascii_upcase) == "G"
    )
  ' <<<"$binds_json" >/dev/null 2>&1; then
    return 0
  fi

  menu_output=$(omarchy menu keybindings --print 2>/dev/null || true)
  awk -F '→' -v wanted="$DEFAULT_CHORD" '
    {
      count = split($1, chords, " / ")
      for (i = 1; i <= count; i++) {
        value = chords[i]
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        if (value == wanted) found = 1
      }
    }
    END { exit(found ? 0 : 1) }
  ' <<<"$menu_output"
}

install_binding() {
  if (( ! INSTALL_BINDING )); then
    note "Skipping Hyprland binding (--no-bind)"
    return 0
  fi

  mkdir -p -- "$(dirname -- "$binding_file")" "$backup_dir"
  touch -- "$binding_file"

  if grep -Fq -- "$MARKER_BEGIN" "$binding_file"; then
    note "Keycade Hyprland binding is already present"
    return 0
  fi

  if binding_conflicts; then
    printf 'keycade-install: %s is already bound; leaving your bindings unchanged.\n' "$DEFAULT_CHORD" >&2
    printf 'Launch directly with: omarchy-shell shell summon %s '\''{}'\''\n' "$PLUGIN_ID" >&2
    return 0
  fi

  existing_errors=$(hyprctl configerrors 2>/dev/null || true)
  if [[ -n $existing_errors ]]; then
    printf 'keycade-install: Hyprland already reports config errors; binding was not changed.\n%s\n' "$existing_errors" >&2
    return 0
  fi

  timestamp=$(date -u +%Y%m%dT%H%M%SZ)
  backup="$backup_dir/bindings.lua.$timestamp"
  cp -p -- "$binding_file" "$backup"

  printf '\n%s\n' "$MARKER_BEGIN" >>"$binding_file"
  printf '%s\n' 'o.bind("SUPER + CTRL + G", "Keycade", "omarchy-shell shell summon xiaowei.keycade '\''{}'\''")' >>"$binding_file"
  printf '%s\n' "$MARKER_END" >>"$binding_file"

  hyprctl reload >/dev/null
  config_errors=$(hyprctl configerrors 2>/dev/null || true)
  if [[ -n $config_errors ]]; then
    cp -p -- "$backup" "$binding_file"
    hyprctl reload >/dev/null || true
    fail "binding caused a Hyprland config error and was rolled back: $config_errors"
  fi

  note "Added Super + Ctrl + G binding (backup: $backup)"
}

install_binding

printf '\nKeycade installed successfully.\n'
printf 'Launch: omarchy-shell shell summon %s '\''{}'\''\n' "$PLUGIN_ID"
if (( INSTALL_BINDING )); then
  printf 'Shortcut: Super + Ctrl + G (unless a conflict was reported)\n'
fi
printf 'Uninstall: %s/uninstall.sh\n' "$repo_root"
