#!/usr/bin/env bash

set -euo pipefail

PLUGIN_ID="luneth90.keycade"
LEGACY_PLUGIN_ID="xiaowei.keycade"
MARKER_BEGIN="-- keycade:begin"
MARKER_END="-- keycade:end"
PURGE_STATE=0

usage() {
  cat <<'EOF'
Usage: ./uninstall.sh [--purge-state]

Disable and remove the locally installed Keycade plugin and remove only the
Hyprland binding block created by install.sh.

Options:
  --purge-state  Also permanently delete Keycade settings and progress.
  -h, --help     Show this help.
EOF
}

fail() {
  printf 'keycade-uninstall: %s\n' "$*" >&2
  exit 1
}

note() {
  printf '==> %s\n' "$*"
}

while (( $# > 0 )); do
  case "$1" in
    --purge-state)
      PURGE_STATE=1
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

for command_name in awk omarchy omarchy-shell hyprctl; do
  command -v "$command_name" >/dev/null 2>&1 || fail "required command not found: $command_name"
done

binding_file="$HOME/.config/hypr/bindings.lua"
plugins_dir="$HOME/.config/omarchy/plugins"
target="$plugins_dir/$PLUGIN_ID"
remove_id="$PLUGIN_ID"
legacy_target="$plugins_dir/$LEGACY_PLUGIN_ID"
if [[ ! -e $target && ! -L $target && ( -e $legacy_target || -L $legacy_target ) ]]; then
  target="$legacy_target"
  remove_id="$LEGACY_PLUGIN_ID"
fi
state_root="${XDG_STATE_HOME:-$HOME/.local/state}"
state_dir="$state_root/omarchy/keycade"
backup_dir="$state_root/omarchy/keycade-install-backups"

remove_binding() {
  [[ -f $binding_file ]] || return 0

  begin_count=$(grep -Fc -- "$MARKER_BEGIN" "$binding_file" || true)
  end_count=$(grep -Fc -- "$MARKER_END" "$binding_file" || true)
  if (( begin_count == 0 && end_count == 0 )); then
    note "No installer-managed Hyprland binding found"
    return 0
  fi
  if (( begin_count != 1 || end_count != 1 )); then
    fail "binding markers are incomplete or duplicated; refusing to edit $binding_file"
  fi

  mkdir -p -- "$backup_dir"
  timestamp=$(date -u +%Y%m%dT%H%M%SZ)
  backup="$backup_dir/bindings.lua.before-uninstall.$timestamp"
  cp -p -- "$binding_file" "$backup"
  temp_file=$(mktemp "${binding_file}.keycade.XXXXXX")

  awk -v begin="$MARKER_BEGIN" -v end="$MARKER_END" '
    $0 == begin { skipping = 1; next }
    $0 == end { skipping = 0; next }
    !skipping { print }
  ' "$binding_file" >"$temp_file"
  chmod --reference="$binding_file" "$temp_file"
  mv -- "$temp_file" "$binding_file"

  hyprctl reload >/dev/null
  config_errors=$(hyprctl configerrors 2>/dev/null || true)
  if [[ -n $config_errors ]]; then
    cp -p -- "$backup" "$binding_file"
    hyprctl reload >/dev/null || true
    fail "binding removal caused a Hyprland config error and was rolled back: $config_errors"
  fi

  note "Removed installer-managed binding (backup: $backup)"
}

remove_binding

if [[ -e $target || -L $target ]]; then
  if ! omarchy-shell shell ping >/dev/null 2>&1; then
    note "Starting Omarchy shell"
    omarchy restart shell
    for _attempt in $(seq 1 30); do
      omarchy-shell shell ping >/dev/null 2>&1 && break
      sleep 0.1
    done
  fi

  omarchy-shell shell ping >/dev/null 2>&1 \
    || fail "Omarchy shell did not become ready; plugin was not removed"
  note "Removing $remove_id"
  omarchy plugin remove "$remove_id" --yes
else
  note "Keycade plugin is not installed"
fi

if (( PURGE_STATE )); then
  expected_state="$state_root/omarchy/keycade"
  [[ $state_dir == "$expected_state" && $state_dir != "/" ]] \
    || fail "refusing to purge unexpected state path: $state_dir"
  if [[ -d $state_dir ]]; then
    rm -rf -- "$state_dir"
    note "Deleted Keycade settings and progress"
  fi
else
  printf 'Progress preserved at: %s\n' "$state_dir"
fi

printf '\nKeycade uninstalled successfully.\n'
