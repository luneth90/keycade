#!/usr/bin/env bash

set -euo pipefail

PLUGIN_ID="luneth90.keycade"
LEGACY_PLUGIN_ID="xiaowei.keycade"
DEFAULT_CHORD="SUPER SHIFT + K"
MARKER_BEGIN="-- keycade:begin"
MARKER_END="-- keycade:end"
INSTALL_BINDING=1

usage() {
  cat <<'EOF'
Usage: ./install.sh [--no-bind]

Install Keycade from this repository into the current user's Omarchy plugin
directory, enable it, and add Super + Shift + K when that chord is free.

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
legacy_target="$plugins_dir/$LEGACY_PLUGIN_ID"
migrated_legacy=0
mkdir -p -- "$plugins_dir"

if [[ ! -e $target && ! -L $target && ( -e $legacy_target || -L $legacy_target ) ]]; then
  legacy_id=""
  [[ -f $legacy_target/manifest.json ]] \
    && legacy_id=$(jq -r '.id // empty' "$legacy_target/manifest.json" 2>/dev/null || true)
  [[ $legacy_id == "$LEGACY_PLUGIN_ID" ]] \
    || fail "$legacy_target exists but is not the legacy Keycade installation"
  [[ -d $legacy_target/.git ]] \
    || fail "$legacy_target is not a Git checkout; remove it before reinstalling"
  note "Migrating $LEGACY_PLUGIN_ID to $PLUGIN_ID"
  git -C "$legacy_target" pull --quiet --ff-only \
    || fail "legacy plugin copy has local changes or cannot be fast-forwarded"
  updated_id=$(jq -r '.id // empty' "$legacy_target/manifest.json" 2>/dev/null || true)
  [[ $updated_id == "$PLUGIN_ID" ]] \
    || fail "updated legacy copy does not declare $PLUGIN_ID"
  mv -- "$legacy_target" "$target"
  migrated_legacy=1
fi

if [[ -e $target || -L $target ]]; then
  installed_id=""
  [[ -f $target/manifest.json ]] && installed_id=$(jq -r '.id // empty' "$target/manifest.json" 2>/dev/null || true)
  [[ $installed_id == "$PLUGIN_ID" ]] \
    || fail "$target already exists and is not a Keycade installation"
  [[ -d $target/.git ]] \
    || fail "$target is not a Git checkout; remove it with ./uninstall.sh before reinstalling"
  note "Updating the existing Keycade plugin copy"
  git -C "$target" pull --quiet --ff-only \
    || fail "installed copy has local changes or cannot be fast-forwarded"
  omarchy plugin validate "$target"
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

if (( migrated_legacy )); then
  omarchy plugin disable "$LEGACY_PLUGIN_ID" >/dev/null 2>&1 || true
  omarchy-shell shell rescanPlugins >/dev/null
fi

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
      (.modmask == 65)
      and ((.key // "") | ascii_upcase) == "K"
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
    if grep -Fq -- "$LEGACY_PLUGIN_ID" "$binding_file"; then
      timestamp=$(date -u +%Y%m%dT%H%M%SZ)
      backup="$backup_dir/bindings.lua.$timestamp"
      cp -p -- "$binding_file" "$backup"
      temp_file=$(mktemp "${binding_file}.keycade.XXXXXX")
      awk -v begin="$MARKER_BEGIN" -v end="$MARKER_END" '
        $0 == begin { managed = 1 }
        managed { gsub(/xiaowei[.]keycade/, "luneth90.keycade") }
        { print }
        $0 == end { managed = 0 }
      ' "$binding_file" >"$temp_file"
      chmod --reference="$binding_file" "$temp_file"
      mv -- "$temp_file" "$binding_file"
      hyprctl reload >/dev/null
      config_errors=$(hyprctl configerrors 2>/dev/null || true)
      if [[ -n $config_errors ]]; then
        cp -p -- "$backup" "$binding_file"
        hyprctl reload >/dev/null || true
        fail "binding migration caused a Hyprland config error and was rolled back: $config_errors"
      fi
      note "Migrated Keycade binding to $PLUGIN_ID (backup: $backup)"
    else
      note "Keycade Hyprland binding is already present"
    fi
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
  printf '%s\n' 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >>"$binding_file"
  printf '%s\n' "$MARKER_END" >>"$binding_file"

  hyprctl reload >/dev/null
  config_errors=$(hyprctl configerrors 2>/dev/null || true)
  if [[ -n $config_errors ]]; then
    cp -p -- "$backup" "$binding_file"
    hyprctl reload >/dev/null || true
    fail "binding caused a Hyprland config error and was rolled back: $config_errors"
  fi

  note "Added Super + Shift + K binding (backup: $backup)"
}

install_binding

printf '\nKeycade installed successfully.\n'
printf 'Launch: omarchy-shell shell summon %s '\''{}'\''\n' "$PLUGIN_ID"
if (( INSTALL_BINDING )); then
  printf 'Shortcut: Super + Shift + K (unless a conflict was reported)\n'
fi
printf 'Uninstall: %s/uninstall.sh\n' "$repo_root"
