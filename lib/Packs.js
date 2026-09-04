.pragma library

// Generated from assets/packs/*.json by tools/build_packs.py.
// Do not edit by hand; edit the JSON sources and regenerate.
//
// Packs are static data compiled into a QML JavaScript library rather than
// read from disk: an application-level training ground touches nothing on the
// machine it runs on.

var packs = {
  "lazyvim": {
    "bindings": [
      {
        "category": "window",
        "context": "normal",
        "desc": "Go to Left Window",
        "descKey": "packdesc_go_to_left_window",
        "localId": "normal/<C-h>",
        "notation": "<C-h>",
        "steps": [
          {
            "mods": 4,
            "text": "h"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Go to Lower Window",
        "descKey": "packdesc_go_to_lower_window",
        "localId": "normal/<C-j>",
        "notation": "<C-j>",
        "steps": [
          {
            "mods": 4,
            "text": "j"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Go to Upper Window",
        "descKey": "packdesc_go_to_upper_window",
        "localId": "normal/<C-k>",
        "notation": "<C-k>",
        "steps": [
          {
            "mods": 4,
            "text": "k"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Go to Right Window",
        "descKey": "packdesc_go_to_right_window",
        "localId": "normal/<C-l>",
        "notation": "<C-l>",
        "steps": [
          {
            "mods": 4,
            "text": "l"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Increase Window Height",
        "descKey": "packdesc_increase_window_height",
        "localId": "normal/<C-Up>",
        "notation": "<C-Up>",
        "steps": [
          {
            "mods": 4,
            "named": "UP"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Decrease Window Height",
        "descKey": "packdesc_decrease_window_height",
        "localId": "normal/<C-Down>",
        "notation": "<C-Down>",
        "steps": [
          {
            "mods": 4,
            "named": "DOWN"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Decrease Window Width",
        "descKey": "packdesc_decrease_window_width",
        "localId": "normal/<C-Left>",
        "notation": "<C-Left>",
        "steps": [
          {
            "mods": 4,
            "named": "LEFT"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Increase Window Width",
        "descKey": "packdesc_increase_window_width",
        "localId": "normal/<C-Right>",
        "notation": "<C-Right>",
        "steps": [
          {
            "mods": 4,
            "named": "RIGHT"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Move Down",
        "descKey": "packdesc_move_down",
        "localId": "normal/<A-j>",
        "notation": "<A-j>",
        "steps": [
          {
            "mods": 8,
            "text": "j"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Move Up",
        "descKey": "packdesc_move_up",
        "localId": "normal/<A-k>",
        "notation": "<A-k>",
        "steps": [
          {
            "mods": 8,
            "text": "k"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Prev Buffer",
        "descKey": "packdesc_prev_buffer",
        "localId": "normal/<S-h>",
        "notation": "<S-h>",
        "steps": [
          {
            "mods": 0,
            "text": "H"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Next Buffer",
        "descKey": "packdesc_next_buffer",
        "localId": "normal/<S-l>",
        "notation": "<S-l>",
        "steps": [
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Prev Buffer",
        "descKey": "packdesc_prev_buffer",
        "localId": "normal/[b",
        "notation": "[b",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Buffer",
        "descKey": "packdesc_next_buffer",
        "localId": "normal/]b",
        "notation": "]b",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Switch to Other Buffer",
        "descKey": "packdesc_switch_to_other_buffer",
        "localId": "normal/<leader>bb",
        "notation": "<leader>bb",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Switch to Other Buffer",
        "descKey": "packdesc_switch_to_other_buffer",
        "localId": "normal/<leader>`",
        "notation": "<leader>`",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "`"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Buffer",
        "descKey": "packdesc_delete_buffer",
        "localId": "normal/<leader>bd",
        "notation": "<leader>bd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Other Buffers",
        "descKey": "packdesc_delete_other_buffers",
        "localId": "normal/<leader>bo",
        "notation": "<leader>bo",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Invisible Buffers",
        "descKey": "packdesc_delete_invisible_buffers",
        "localId": "normal/<leader>bi",
        "notation": "<leader>bi",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Buffer and Window",
        "descKey": "packdesc_delete_buffer_and_window",
        "localId": "normal/<leader>bD",
        "notation": "<leader>bD",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Redraw / Clear hlsearch / Diff Update",
        "descKey": "packdesc_redraw_clear_hlsearch_diff_update",
        "localId": "normal/<leader>ur",
        "notation": "<leader>ur",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "find",
        "context": "insert",
        "desc": "Save File",
        "descKey": "packdesc_save_file",
        "localId": "insert/<C-s>",
        "notation": "<C-s>",
        "steps": [
          {
            "mods": 4,
            "text": "s"
          }
        ]
      },
      {
        "category": "misc",
        "context": "normal",
        "desc": "Keywordprg",
        "descKey": "packdesc_keywordprg",
        "localId": "normal/<leader>K",
        "notation": "<leader>K",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "K"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Add Comment Below",
        "descKey": "packdesc_add_comment_below",
        "localId": "normal/gco",
        "notation": "gco",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Add Comment Above",
        "descKey": "packdesc_add_comment_above",
        "localId": "normal/gcO",
        "notation": "gcO",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "O"
          }
        ]
      },
      {
        "category": "misc",
        "context": "normal",
        "desc": "Lazy",
        "descKey": "packdesc_lazy",
        "localId": "normal/<leader>l",
        "notation": "<leader>l",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "New File",
        "descKey": "packdesc_new_file",
        "localId": "normal/<leader>fn",
        "notation": "<leader>fn",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Location List",
        "descKey": "packdesc_location_list",
        "localId": "normal/<leader>xl",
        "notation": "<leader>xl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Quickfix List",
        "descKey": "packdesc_quickfix_list",
        "localId": "normal/<leader>xq",
        "notation": "<leader>xq",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Previous Quickfix",
        "descKey": "packdesc_previous_quickfix",
        "localId": "normal/[q",
        "notation": "[q",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Quickfix",
        "descKey": "packdesc_next_quickfix",
        "localId": "normal/]q",
        "notation": "]q",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Format",
        "descKey": "packdesc_format",
        "localId": "normal/<leader>cf",
        "notation": "<leader>cf",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Line Diagnostics",
        "descKey": "packdesc_line_diagnostics",
        "localId": "normal/<leader>cd",
        "notation": "<leader>cd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Diagnostic",
        "descKey": "packdesc_next_diagnostic",
        "localId": "normal/]d",
        "notation": "]d",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Prev Diagnostic",
        "descKey": "packdesc_prev_diagnostic",
        "localId": "normal/[d",
        "notation": "[d",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Error",
        "descKey": "packdesc_next_error",
        "localId": "normal/]e",
        "notation": "]e",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Prev Error",
        "descKey": "packdesc_prev_error",
        "localId": "normal/[e",
        "notation": "[e",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Warning",
        "descKey": "packdesc_next_warning",
        "localId": "normal/]w",
        "notation": "]w",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Prev Warning",
        "descKey": "packdesc_prev_warning",
        "localId": "normal/[w",
        "notation": "[w",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Auto Format (Global)",
        "descKey": "packdesc_toggle_auto_format_global",
        "localId": "normal/<leader>uf",
        "notation": "<leader>uf",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Auto Format (Buffer)",
        "descKey": "packdesc_toggle_auto_format_buffer",
        "localId": "normal/<leader>uF",
        "notation": "<leader>uF",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "F"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Spelling",
        "descKey": "packdesc_toggle_spelling",
        "localId": "normal/<leader>us",
        "notation": "<leader>us",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Wrap",
        "descKey": "packdesc_toggle_wrap",
        "localId": "normal/<leader>uw",
        "notation": "<leader>uw",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Relative Number",
        "descKey": "packdesc_toggle_relative_number",
        "localId": "normal/<leader>uL",
        "notation": "<leader>uL",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Diagnostics",
        "descKey": "packdesc_toggle_diagnostics",
        "localId": "normal/<leader>ud",
        "notation": "<leader>ud",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Line Numbers",
        "descKey": "packdesc_toggle_line_numbers",
        "localId": "normal/<leader>ul",
        "notation": "<leader>ul",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Conceal Level",
        "descKey": "packdesc_toggle_conceal_level",
        "localId": "normal/<leader>uc",
        "notation": "<leader>uc",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Tabline",
        "descKey": "packdesc_toggle_tabline",
        "localId": "normal/<leader>uA",
        "notation": "<leader>uA",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "A"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Treesitter Highlight",
        "descKey": "packdesc_toggle_treesitter_highlight",
        "localId": "normal/<leader>uT",
        "notation": "<leader>uT",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "T"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Dark Background",
        "descKey": "packdesc_toggle_dark_background",
        "localId": "normal/<leader>ub",
        "notation": "<leader>ub",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Dimming",
        "descKey": "packdesc_toggle_dimming",
        "localId": "normal/<leader>uD",
        "notation": "<leader>uD",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Animations",
        "descKey": "packdesc_toggle_animations",
        "localId": "normal/<leader>ua",
        "notation": "<leader>ua",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Indent Guides",
        "descKey": "packdesc_toggle_indent_guides",
        "localId": "normal/<leader>ug",
        "notation": "<leader>ug",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Smooth Scroll",
        "descKey": "packdesc_toggle_smooth_scroll",
        "localId": "normal/<leader>uS",
        "notation": "<leader>uS",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Toggle Profiler",
        "descKey": "packdesc_toggle_profiler",
        "localId": "normal/<leader>dpp",
        "notation": "<leader>dpp",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Toggle Profiler Highlights",
        "descKey": "packdesc_toggle_profiler_highlights",
        "localId": "normal/<leader>dph",
        "notation": "<leader>dph",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Inlay Hints",
        "descKey": "packdesc_toggle_inlay_hints",
        "localId": "normal/<leader>uh",
        "notation": "<leader>uh",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Log (cwd)",
        "descKey": "packdesc_git_log_cwd",
        "localId": "normal/<leader>gL",
        "notation": "<leader>gL",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Blame Line",
        "descKey": "packdesc_git_blame_line",
        "localId": "normal/<leader>gb",
        "notation": "<leader>gb",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Current File History",
        "descKey": "packdesc_git_current_file_history",
        "localId": "normal/<leader>gf",
        "notation": "<leader>gf",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Log",
        "descKey": "packdesc_git_log",
        "localId": "normal/<leader>gl",
        "notation": "<leader>gl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Browse (open)",
        "descKey": "packdesc_git_browse_open",
        "localId": "normal/<leader>gB",
        "notation": "<leader>gB",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Browse (copy)",
        "descKey": "packdesc_git_browse_copy",
        "localId": "normal/<leader>gY",
        "notation": "<leader>gY",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "Y"
          }
        ]
      },
      {
        "category": "session",
        "context": "normal",
        "desc": "Quit All",
        "descKey": "packdesc_quit_all",
        "localId": "normal/<leader>qq",
        "notation": "<leader>qq",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "q"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Inspect Pos",
        "descKey": "packdesc_inspect_pos",
        "localId": "normal/<leader>ui",
        "notation": "<leader>ui",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Inspect Tree",
        "descKey": "packdesc_inspect_tree",
        "localId": "normal/<leader>uI",
        "notation": "<leader>uI",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "I"
          }
        ]
      },
      {
        "category": "misc",
        "context": "normal",
        "desc": "LazyVim Changelog",
        "descKey": "packdesc_lazyvim_changelog",
        "localId": "normal/<leader>L",
        "notation": "<leader>L",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Terminal (cwd)",
        "descKey": "packdesc_terminal_cwd",
        "localId": "normal/<leader>fT",
        "notation": "<leader>fT",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "T"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Terminal (Root Dir)",
        "descKey": "packdesc_terminal_root_dir",
        "localId": "normal/<leader>ft",
        "notation": "<leader>ft",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "terminal",
        "context": "normal",
        "desc": "Terminal (Root Dir)",
        "descKey": "packdesc_terminal_root_dir",
        "localId": "normal/<c-/>",
        "notation": "<c-/>",
        "steps": [
          {
            "mods": 4,
            "text": "/"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Split Window Below",
        "descKey": "packdesc_split_window_below",
        "localId": "normal/<leader>-",
        "notation": "<leader>-",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "-"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Split Window Right",
        "descKey": "packdesc_split_window_right",
        "localId": "normal/<leader>|",
        "notation": "<leader>|",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "|"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Delete Window",
        "descKey": "packdesc_delete_window",
        "localId": "normal/<leader>wd",
        "notation": "<leader>wd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "w"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Toggle Zoom Mode",
        "descKey": "packdesc_toggle_zoom_mode",
        "localId": "normal/<leader>wm",
        "notation": "<leader>wm",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "w"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Zoom Mode",
        "descKey": "packdesc_toggle_zoom_mode",
        "localId": "normal/<leader>uZ",
        "notation": "<leader>uZ",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "Z"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Toggle Zen Mode",
        "descKey": "packdesc_toggle_zen_mode",
        "localId": "normal/<leader>uz",
        "notation": "<leader>uz",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "Last Tab",
        "descKey": "packdesc_last_tab",
        "localId": "normal/<leader><tab>l",
        "notation": "<leader><tab>l",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "Close Other Tabs",
        "descKey": "packdesc_close_other_tabs",
        "localId": "normal/<leader><tab>o",
        "notation": "<leader><tab>o",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "First Tab",
        "descKey": "packdesc_first_tab",
        "localId": "normal/<leader><tab>f",
        "notation": "<leader><tab>f",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "New Tab",
        "descKey": "packdesc_new_tab",
        "localId": "normal/<leader><tab><tab>",
        "notation": "<leader><tab><tab>",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "named": "TAB"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "Next Tab",
        "descKey": "packdesc_next_tab",
        "localId": "normal/<leader><tab>]",
        "notation": "<leader><tab>]",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "]"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "Close Tab",
        "descKey": "packdesc_close_tab",
        "localId": "normal/<leader><tab>d",
        "notation": "<leader><tab>d",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "tab",
        "context": "normal",
        "desc": "Previous Tab",
        "descKey": "packdesc_previous_tab",
        "localId": "normal/<leader><tab>[",
        "notation": "<leader><tab>[",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "TAB"
          },
          {
            "mods": 0,
            "text": "["
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Lsp Info",
        "descKey": "packdesc_lsp_info",
        "localId": "normal/<leader>cl",
        "notation": "<leader>cl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Goto Definition",
        "descKey": "packdesc_goto_definition",
        "localId": "normal/gd",
        "notation": "gd",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "References",
        "descKey": "packdesc_references",
        "localId": "normal/gr",
        "notation": "gr",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Goto Implementation",
        "descKey": "packdesc_goto_implementation",
        "localId": "normal/gI",
        "notation": "gI",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "I"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Goto T[y]pe Definition",
        "descKey": "packdesc_goto_t_y_pe_definition",
        "localId": "normal/gy",
        "notation": "gy",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "y"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Goto Declaration",
        "descKey": "packdesc_goto_declaration",
        "localId": "normal/gD",
        "notation": "gD",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Hover",
        "descKey": "packdesc_hover",
        "localId": "normal/K",
        "notation": "K",
        "steps": [
          {
            "mods": 0,
            "text": "K"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Signature Help",
        "descKey": "packdesc_signature_help",
        "localId": "normal/gK",
        "notation": "gK",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "K"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "insert",
        "desc": "Signature Help",
        "descKey": "packdesc_signature_help",
        "localId": "insert/<c-k>",
        "notation": "<c-k>",
        "steps": [
          {
            "mods": 4,
            "text": "k"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Code Action",
        "descKey": "packdesc_code_action",
        "localId": "normal/<leader>ca",
        "notation": "<leader>ca",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Run Codelens",
        "descKey": "packdesc_run_codelens",
        "localId": "normal/<leader>cc",
        "notation": "<leader>cc",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Refresh & Display Codelens",
        "descKey": "packdesc_refresh_display_codelens",
        "localId": "normal/<leader>cC",
        "notation": "<leader>cC",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Rename File",
        "descKey": "packdesc_rename_file",
        "localId": "normal/<leader>cR",
        "notation": "<leader>cR",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "R"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Rename",
        "descKey": "packdesc_rename",
        "localId": "normal/<leader>cr",
        "notation": "<leader>cr",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Source Action",
        "descKey": "packdesc_source_action",
        "localId": "normal/<leader>cA",
        "notation": "<leader>cA",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "A"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Next Reference",
        "descKey": "packdesc_next_reference",
        "localId": "normal/]]",
        "notation": "]]",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "]"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Prev Reference",
        "descKey": "packdesc_prev_reference",
        "localId": "normal/[[",
        "notation": "[[",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "["
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Next Reference",
        "descKey": "packdesc_next_reference",
        "localId": "normal/<a-n>",
        "notation": "<a-n>",
        "steps": [
          {
            "mods": 8,
            "text": "n"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "Prev Reference",
        "descKey": "packdesc_prev_reference",
        "localId": "normal/<a-p>",
        "notation": "<a-p>",
        "steps": [
          {
            "mods": 8,
            "text": "p"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Organize Imports",
        "descKey": "packdesc_organize_imports",
        "localId": "normal/<leader>co",
        "notation": "<leader>co",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "LSP Symbols",
        "descKey": "packdesc_lsp_symbols",
        "localId": "normal/<leader>ss",
        "notation": "<leader>ss",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "LSP Workspace Symbols",
        "descKey": "packdesc_lsp_workspace_symbols",
        "localId": "normal/<leader>sS",
        "notation": "<leader>sS",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "C[a]lls Incoming",
        "descKey": "packdesc_c_a_lls_incoming",
        "localId": "normal/gai",
        "notation": "gai",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "lsp",
        "context": "normal",
        "desc": "C[a]lls Outgoing",
        "descKey": "packdesc_c_a_lls_outgoing",
        "localId": "normal/gao",
        "notation": "gao",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Pick Buffer",
        "descKey": "packdesc_pick_buffer",
        "localId": "normal/<leader>bj",
        "notation": "<leader>bj",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "j"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Buffers to the Left",
        "descKey": "packdesc_delete_buffers_to_the_left",
        "localId": "normal/<leader>bl",
        "notation": "<leader>bl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Toggle Pin",
        "descKey": "packdesc_toggle_pin",
        "localId": "normal/<leader>bp",
        "notation": "<leader>bp",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Non-Pinned Buffers",
        "descKey": "packdesc_delete_non_pinned_buffers",
        "localId": "normal/<leader>bP",
        "notation": "<leader>bP",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Delete Buffers to the Right",
        "descKey": "packdesc_delete_buffers_to_the_right",
        "localId": "normal/<leader>br",
        "notation": "<leader>br",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Move buffer prev",
        "descKey": "packdesc_move_buffer_prev",
        "localId": "normal/[B",
        "notation": "[B",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Move buffer next",
        "descKey": "packdesc_move_buffer_next",
        "localId": "normal/]B",
        "notation": "]B",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Format Injected Langs",
        "descKey": "packdesc_format_injected_langs",
        "localId": "normal/<leader>cF",
        "notation": "<leader>cF",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "F"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "operator",
        "desc": "Remote Flash",
        "descKey": "packdesc_remote_flash",
        "localId": "operator/r",
        "notation": "r",
        "steps": [
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "search",
        "context": "operator",
        "desc": "Treesitter Search",
        "descKey": "packdesc_treesitter_search",
        "localId": "operator/R",
        "notation": "R",
        "steps": [
          {
            "mods": 0,
            "text": "R"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Flash",
        "descKey": "packdesc_flash",
        "localId": "normal/s",
        "notation": "s",
        "steps": [
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Flash Treesitter",
        "descKey": "packdesc_flash_treesitter",
        "localId": "normal/S",
        "notation": "S",
        "steps": [
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Treesitter Incremental Selection",
        "descKey": "packdesc_treesitter_incremental_selection",
        "localId": "normal/<c-space>",
        "notation": "<c-space>",
        "steps": [
          {
            "mods": 4,
            "named": "SPACE"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Search and Replace",
        "descKey": "packdesc_search_and_replace",
        "localId": "normal/<leader>sr",
        "notation": "<leader>sr",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Mason",
        "descKey": "packdesc_mason",
        "localId": "normal/<leader>cm",
        "notation": "<leader>cm",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Scroll Backward",
        "descKey": "packdesc_scroll_backward",
        "localId": "normal/<c-b>",
        "notation": "<c-b>",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Scroll Forward",
        "descKey": "packdesc_scroll_forward",
        "localId": "normal/<c-f>",
        "notation": "<c-f>",
        "steps": [
          {
            "mods": 4,
            "text": "f"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Noice All",
        "descKey": "packdesc_noice_all",
        "localId": "normal/<leader>sna",
        "notation": "<leader>sna",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Dismiss All",
        "descKey": "packdesc_dismiss_all",
        "localId": "normal/<leader>snd",
        "notation": "<leader>snd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Noice History",
        "descKey": "packdesc_noice_history",
        "localId": "normal/<leader>snh",
        "notation": "<leader>snh",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Noice Last Message",
        "descKey": "packdesc_noice_last_message",
        "localId": "normal/<leader>snl",
        "notation": "<leader>snl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Noice Picker (Telescope/FzfLua)",
        "descKey": "packdesc_noice_picker_telescope_fzflua",
        "localId": "normal/<leader>snt",
        "notation": "<leader>snt",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "session",
        "context": "normal",
        "desc": "Don't Save Current Session",
        "descKey": "packdesc_don_t_save_current_session",
        "localId": "normal/<leader>qd",
        "notation": "<leader>qd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "q"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "session",
        "context": "normal",
        "desc": "Restore Last Session",
        "descKey": "packdesc_restore_last_session",
        "localId": "normal/<leader>ql",
        "notation": "<leader>ql",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "q"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "session",
        "context": "normal",
        "desc": "Restore Session",
        "descKey": "packdesc_restore_session",
        "localId": "normal/<leader>qs",
        "notation": "<leader>qs",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "q"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "session",
        "context": "normal",
        "desc": "Select Session",
        "descKey": "packdesc_select_session",
        "localId": "normal/<leader>qS",
        "notation": "<leader>qS",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "q"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Find Files (Root Dir)",
        "descKey": "packdesc_find_files_root_dir",
        "localId": "normal/<leader><space>",
        "notation": "<leader><space>",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "named": "SPACE"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Buffers",
        "descKey": "packdesc_buffers",
        "localId": "normal/<leader>,",
        "notation": "<leader>,",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": ","
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Toggle Scratch Buffer",
        "descKey": "packdesc_toggle_scratch_buffer",
        "localId": "normal/<leader>.",
        "notation": "<leader>.",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "."
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Grep (Root Dir)",
        "descKey": "packdesc_grep_root_dir",
        "localId": "normal/<leader>/",
        "notation": "<leader>/",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "/"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Command History",
        "descKey": "packdesc_command_history",
        "localId": "normal/<leader>:",
        "notation": "<leader>:",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": ":"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Profiler Scratch Buffer",
        "descKey": "packdesc_profiler_scratch_buffer",
        "localId": "normal/<leader>dps",
        "notation": "<leader>dps",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Explorer Snacks (root dir)",
        "descKey": "packdesc_explorer_snacks_root_dir",
        "localId": "normal/<leader>e",
        "notation": "<leader>e",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Explorer Snacks (cwd)",
        "descKey": "packdesc_explorer_snacks_cwd",
        "localId": "normal/<leader>E",
        "notation": "<leader>E",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "E"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Buffers",
        "descKey": "packdesc_buffers",
        "localId": "normal/<leader>fb",
        "notation": "<leader>fb",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Buffers (all)",
        "descKey": "packdesc_buffers_all",
        "localId": "normal/<leader>fB",
        "notation": "<leader>fB",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Find Config File",
        "descKey": "packdesc_find_config_file",
        "localId": "normal/<leader>fc",
        "notation": "<leader>fc",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Explorer Snacks (root dir)",
        "descKey": "packdesc_explorer_snacks_root_dir",
        "localId": "normal/<leader>fe",
        "notation": "<leader>fe",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Explorer Snacks (cwd)",
        "descKey": "packdesc_explorer_snacks_cwd",
        "localId": "normal/<leader>fE",
        "notation": "<leader>fE",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "E"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Find Files (Root Dir)",
        "descKey": "packdesc_find_files_root_dir",
        "localId": "normal/<leader>ff",
        "notation": "<leader>ff",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Find Files (cwd)",
        "descKey": "packdesc_find_files_cwd",
        "localId": "normal/<leader>fF",
        "notation": "<leader>fF",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "F"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Find Files (git-files)",
        "descKey": "packdesc_find_files_git_files",
        "localId": "normal/<leader>fg",
        "notation": "<leader>fg",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Projects",
        "descKey": "packdesc_projects",
        "localId": "normal/<leader>fp",
        "notation": "<leader>fp",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Recent",
        "descKey": "packdesc_recent",
        "localId": "normal/<leader>fr",
        "notation": "<leader>fr",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Recent (cwd)",
        "descKey": "packdesc_recent_cwd",
        "localId": "normal/<leader>fR",
        "notation": "<leader>fR",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "R"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Diff (hunks)",
        "descKey": "packdesc_git_diff_hunks",
        "localId": "normal/<leader>gd",
        "notation": "<leader>gd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Diff (origin)",
        "descKey": "packdesc_git_diff_origin",
        "localId": "normal/<leader>gD",
        "notation": "<leader>gD",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitHub Issues (open)",
        "descKey": "packdesc_github_issues_open",
        "localId": "normal/<leader>gi",
        "notation": "<leader>gi",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitHub Issues (all)",
        "descKey": "packdesc_github_issues_all",
        "localId": "normal/<leader>gI",
        "notation": "<leader>gI",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "I"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitHub Pull Requests (open)",
        "descKey": "packdesc_github_pull_requests_open",
        "localId": "normal/<leader>gp",
        "notation": "<leader>gp",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitHub Pull Requests (all)",
        "descKey": "packdesc_github_pull_requests_all",
        "localId": "normal/<leader>gP",
        "notation": "<leader>gP",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Status",
        "descKey": "packdesc_git_status",
        "localId": "normal/<leader>gs",
        "notation": "<leader>gs",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Git Stash",
        "descKey": "packdesc_git_stash",
        "localId": "normal/<leader>gS",
        "notation": "<leader>gS",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Notification History",
        "descKey": "packdesc_notification_history",
        "localId": "normal/<leader>n",
        "notation": "<leader>n",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Select Scratch Buffer",
        "descKey": "packdesc_select_scratch_buffer",
        "localId": "normal/<leader>S",
        "notation": "<leader>S",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Registers",
        "descKey": "packdesc_registers",
        "localId": "normal/<leader>s\"",
        "notation": "<leader>s\"",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "\""
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Search History",
        "descKey": "packdesc_search_history",
        "localId": "normal/<leader>s/",
        "notation": "<leader>s/",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "/"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Autocmds",
        "descKey": "packdesc_autocmds",
        "localId": "normal/<leader>sa",
        "notation": "<leader>sa",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Buffer Lines",
        "descKey": "packdesc_buffer_lines",
        "localId": "normal/<leader>sb",
        "notation": "<leader>sb",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Grep Open Buffers",
        "descKey": "packdesc_grep_open_buffers",
        "localId": "normal/<leader>sB",
        "notation": "<leader>sB",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Command History",
        "descKey": "packdesc_command_history",
        "localId": "normal/<leader>sc",
        "notation": "<leader>sc",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Commands",
        "descKey": "packdesc_commands",
        "localId": "normal/<leader>sC",
        "notation": "<leader>sC",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Diagnostics",
        "descKey": "packdesc_diagnostics",
        "localId": "normal/<leader>sd",
        "notation": "<leader>sd",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Buffer Diagnostics",
        "descKey": "packdesc_buffer_diagnostics",
        "localId": "normal/<leader>sD",
        "notation": "<leader>sD",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Grep (Root Dir)",
        "descKey": "packdesc_grep_root_dir",
        "localId": "normal/<leader>sg",
        "notation": "<leader>sg",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Grep (cwd)",
        "descKey": "packdesc_grep_cwd",
        "localId": "normal/<leader>sG",
        "notation": "<leader>sG",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "G"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Help Pages",
        "descKey": "packdesc_help_pages",
        "localId": "normal/<leader>sh",
        "notation": "<leader>sh",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Highlights",
        "descKey": "packdesc_highlights",
        "localId": "normal/<leader>sH",
        "notation": "<leader>sH",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "H"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Icons",
        "descKey": "packdesc_icons",
        "localId": "normal/<leader>si",
        "notation": "<leader>si",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Jumps",
        "descKey": "packdesc_jumps",
        "localId": "normal/<leader>sj",
        "notation": "<leader>sj",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "j"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Keymaps",
        "descKey": "packdesc_keymaps",
        "localId": "normal/<leader>sk",
        "notation": "<leader>sk",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "k"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Location List",
        "descKey": "packdesc_location_list",
        "localId": "normal/<leader>sl",
        "notation": "<leader>sl",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Marks",
        "descKey": "packdesc_marks",
        "localId": "normal/<leader>sm",
        "notation": "<leader>sm",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Man Pages",
        "descKey": "packdesc_man_pages",
        "localId": "normal/<leader>sM",
        "notation": "<leader>sM",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "M"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Search for Plugin Spec",
        "descKey": "packdesc_search_for_plugin_spec",
        "localId": "normal/<leader>sp",
        "notation": "<leader>sp",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Quickfix List",
        "descKey": "packdesc_quickfix_list",
        "localId": "normal/<leader>sq",
        "notation": "<leader>sq",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Resume",
        "descKey": "packdesc_resume",
        "localId": "normal/<leader>sR",
        "notation": "<leader>sR",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "R"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Undotree",
        "descKey": "packdesc_undotree",
        "localId": "normal/<leader>su",
        "notation": "<leader>su",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "u"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Visual selection or word (Root Dir)",
        "descKey": "packdesc_visual_selection_or_word_root_dir",
        "localId": "normal/<leader>sw",
        "notation": "<leader>sw",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Visual selection or word (cwd)",
        "descKey": "packdesc_visual_selection_or_word_cwd",
        "localId": "normal/<leader>sW",
        "notation": "<leader>sW",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "W"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Colorschemes",
        "descKey": "packdesc_colorschemes",
        "localId": "normal/<leader>uC",
        "notation": "<leader>uC",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Dismiss All Notifications",
        "descKey": "packdesc_dismiss_all_notifications",
        "localId": "normal/<leader>un",
        "notation": "<leader>un",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Todo",
        "descKey": "packdesc_todo",
        "localId": "normal/<leader>st",
        "notation": "<leader>st",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Todo/Fix/Fixme",
        "descKey": "packdesc_todo_fix_fixme",
        "localId": "normal/<leader>sT",
        "notation": "<leader>sT",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "T"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Todo (Trouble)",
        "descKey": "packdesc_todo_trouble",
        "localId": "normal/<leader>xt",
        "notation": "<leader>xt",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Todo/Fix/Fixme (Trouble)",
        "descKey": "packdesc_todo_fix_fixme_trouble",
        "localId": "normal/<leader>xT",
        "notation": "<leader>xT",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "T"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Previous Todo Comment",
        "descKey": "packdesc_previous_todo_comment",
        "localId": "normal/[t",
        "notation": "[t",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Next Todo Comment",
        "descKey": "packdesc_next_todo_comment",
        "localId": "normal/]t",
        "notation": "]t",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Symbols (Trouble)",
        "descKey": "packdesc_symbols_trouble",
        "localId": "normal/<leader>cs",
        "notation": "<leader>cs",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "LSP references/definitions/... (Trouble)",
        "descKey": "packdesc_lsp_references_definitions_trouble",
        "localId": "normal/<leader>cS",
        "notation": "<leader>cS",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Location List (Trouble)",
        "descKey": "packdesc_location_list_trouble",
        "localId": "normal/<leader>xL",
        "notation": "<leader>xL",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Quickfix List (Trouble)",
        "descKey": "packdesc_quickfix_list_trouble",
        "localId": "normal/<leader>xQ",
        "notation": "<leader>xQ",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "Q"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Diagnostics (Trouble)",
        "descKey": "packdesc_diagnostics_trouble",
        "localId": "normal/<leader>xx",
        "notation": "<leader>xx",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "x"
          }
        ]
      },
      {
        "category": "diagnostics",
        "context": "normal",
        "desc": "Buffer Diagnostics (Trouble)",
        "descKey": "packdesc_buffer_diagnostics_trouble",
        "localId": "normal/<leader>xX",
        "notation": "<leader>xX",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "x"
          },
          {
            "mods": 0,
            "text": "X"
          }
        ]
      },
      {
        "category": "window",
        "context": "normal",
        "desc": "Window Hydra Mode (which-key)",
        "descKey": "packdesc_window_hydra_mode_which_key",
        "localId": "normal/<c-w><space>",
        "notation": "<c-w><space>",
        "steps": [
          {
            "mods": 4,
            "text": "w"
          },
          {
            "mods": 0,
            "named": "SPACE"
          }
        ]
      },
      {
        "category": "buffer",
        "context": "normal",
        "desc": "Buffer Keymaps (which-key)",
        "descKey": "packdesc_buffer_keymaps_which_key",
        "localId": "normal/<leader>?",
        "notation": "<leader>?",
        "steps": [
          {
            "leader": true
          },
          {
            "mods": 0,
            "text": "?"
          }
        ]
      }
    ],
    "categories": [
      "find",
      "search",
      "git",
      "buffer",
      "tab",
      "code",
      "lsp",
      "debug",
      "diagnostics",
      "window",
      "session",
      "ui",
      "terminal",
      "edit",
      "navigation",
      "misc"
    ],
    "contexts": [
      "insert",
      "normal",
      "operator"
    ],
    "dropped": {
      "duplicate": 6,
      "missing-description": 2,
      "untrained-mode": 2,
      "well-known": 7
    },
    "judgeMode": "text",
    "leader": " ",
    "localleader": "\\",
    "profile": "lazyvim",
    "provenance": {
      "authority": "LazyVim.github.io docs/keymaps.md (generated by its lua/build.lua)",
      "crossCheck": {
        "commit": "c10948c50b18fae7f256433afdef09e432410480",
        "date": "2026-06-02",
        "inCheckoutOnly": [
          "<C-/>",
          "<leader>dp",
          "<leader>gG",
          "<leader>gg",
          "<leader>gh"
        ],
        "inPageOnly": 81,
        "tag": "v16.0.0",
        "url": "https://github.com/LazyVim/LazyVim"
      },
      "generatedAt": "2026-09-04",
      "generator": "tools/build_packs.py@1",
      "source": {
        "checksum": "9ef8eddb70cae87b528a67f67b824f52b006629eb3ab96d6c1534c06762bb189",
        "commit": "85e5b49e5bf0a4208bd9d1600e1710f4bb6c0e9c",
        "date": "2026-05-27",
        "url": "https://github.com/LazyVim/LazyVim.github.io"
      },
      "upstream": "LazyVim"
    },
    "schemaVersion": 1
  },
  "tmux": {
    "bindings": [
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Select next layout",
        "descKey": "packdesc_select_next_layout",
        "localId": "prefix/C-b Space",
        "notation": "C-b Space",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "named": "SPACE"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Break pane to a new window",
        "descKey": "packdesc_break_pane_to_a_new_window",
        "localId": "prefix/C-b !",
        "notation": "C-b !",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "!"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Split window vertically",
        "descKey": "packdesc_split_window_vertically",
        "localId": "prefix/C-b \"",
        "notation": "C-b \"",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "\""
          }
        ]
      },
      {
        "category": "copy",
        "context": "prefix",
        "desc": "List all paste buffers",
        "descKey": "packdesc_list_all_paste_buffers",
        "localId": "prefix/C-b #",
        "notation": "C-b #",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "#"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Rename current session",
        "descKey": "packdesc_rename_current_session",
        "localId": "prefix/C-b $",
        "notation": "C-b $",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "$"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Split window horizontally",
        "descKey": "packdesc_split_window_horizontally",
        "localId": "prefix/C-b %",
        "notation": "C-b %",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "%"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Kill current window",
        "descKey": "packdesc_kill_current_window",
        "localId": "prefix/C-b &",
        "notation": "C-b &",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "&"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Prompt for window index to select",
        "descKey": "packdesc_prompt_for_window_index_to_select",
        "localId": "prefix/C-b '",
        "notation": "C-b '",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "'"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Switch to previous client",
        "descKey": "packdesc_switch_to_previous_client",
        "localId": "prefix/C-b (",
        "notation": "C-b (",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "("
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Switch to next client",
        "descKey": "packdesc_switch_to_next_client",
        "localId": "prefix/C-b )",
        "notation": "C-b )",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": ")"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "New floating pane",
        "descKey": "packdesc_new_floating_pane",
        "localId": "prefix/C-b *",
        "notation": "C-b *",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "*"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Rename current window",
        "descKey": "packdesc_rename_current_window",
        "localId": "prefix/C-b ,",
        "notation": "C-b ,",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": ","
          }
        ]
      },
      {
        "category": "copy",
        "context": "prefix",
        "desc": "Delete the most recent paste buffer",
        "descKey": "packdesc_delete_the_most_recent_paste_buffer",
        "localId": "prefix/C-b -",
        "notation": "C-b -",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "-"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Move the current window",
        "descKey": "packdesc_move_the_current_window",
        "localId": "prefix/C-b .",
        "notation": "C-b .",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "."
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Describe key binding",
        "descKey": "packdesc_describe_key_binding",
        "localId": "prefix/C-b /",
        "notation": "C-b /",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "/"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 0",
        "descKey": "packdesc_select_window_0",
        "localId": "prefix/C-b 0",
        "notation": "C-b 0",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "0"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 1",
        "descKey": "packdesc_select_window_1",
        "localId": "prefix/C-b 1",
        "notation": "C-b 1",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "1"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 2",
        "descKey": "packdesc_select_window_2",
        "localId": "prefix/C-b 2",
        "notation": "C-b 2",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "2"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 3",
        "descKey": "packdesc_select_window_3",
        "localId": "prefix/C-b 3",
        "notation": "C-b 3",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "3"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 4",
        "descKey": "packdesc_select_window_4",
        "localId": "prefix/C-b 4",
        "notation": "C-b 4",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "4"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 5",
        "descKey": "packdesc_select_window_5",
        "localId": "prefix/C-b 5",
        "notation": "C-b 5",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "5"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 6",
        "descKey": "packdesc_select_window_6",
        "localId": "prefix/C-b 6",
        "notation": "C-b 6",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "6"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 7",
        "descKey": "packdesc_select_window_7",
        "localId": "prefix/C-b 7",
        "notation": "C-b 7",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "7"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 8",
        "descKey": "packdesc_select_window_8",
        "localId": "prefix/C-b 8",
        "notation": "C-b 8",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "8"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select window 9",
        "descKey": "packdesc_select_window_9",
        "localId": "prefix/C-b 9",
        "notation": "C-b 9",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "9"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Prompt for a command",
        "descKey": "packdesc_prompt_for_a_command",
        "localId": "prefix/C-b :",
        "notation": "C-b :",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": ":"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Move to the previously active pane",
        "descKey": "packdesc_move_to_the_previously_active_pane",
        "localId": "prefix/C-b ;",
        "notation": "C-b ;",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": ";"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Display window menu",
        "descKey": "packdesc_display_window_menu",
        "localId": "prefix/C-b <",
        "notation": "C-b <",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "<"
          }
        ]
      },
      {
        "category": "copy",
        "context": "prefix",
        "desc": "Choose a paste buffer from a list",
        "descKey": "packdesc_choose_a_paste_buffer_from_a_list",
        "localId": "prefix/C-b =",
        "notation": "C-b =",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "="
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Display pane menu",
        "descKey": "packdesc_display_pane_menu",
        "localId": "prefix/C-b >",
        "notation": "C-b >",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": ">"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "List key bindings",
        "descKey": "packdesc_list_key_bindings",
        "localId": "prefix/C-b ?",
        "notation": "C-b ?",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "?"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Customize options",
        "descKey": "packdesc_customize_options",
        "localId": "prefix/C-b C",
        "notation": "C-b C",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Choose and detach a client from a list",
        "descKey": "packdesc_choose_and_detach_a_client_from_a_list",
        "localId": "prefix/C-b D",
        "notation": "C-b D",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Spread panes out evenly",
        "descKey": "packdesc_spread_panes_out_evenly",
        "localId": "prefix/C-b E",
        "notation": "C-b E",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "E"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Switch to the last client",
        "descKey": "packdesc_switch_to_the_last_client",
        "localId": "prefix/C-b L",
        "notation": "C-b L",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "L"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Clear the marked pane",
        "descKey": "packdesc_clear_the_marked_pane",
        "localId": "prefix/C-b M",
        "notation": "C-b M",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "M"
          }
        ]
      },
      {
        "category": "copy",
        "context": "prefix",
        "desc": "Enter copy mode",
        "descKey": "packdesc_enter_copy_mode",
        "localId": "prefix/C-b [",
        "notation": "C-b [",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "["
          }
        ]
      },
      {
        "category": "copy",
        "context": "prefix",
        "desc": "Paste the most recent paste buffer",
        "descKey": "packdesc_paste_the_most_recent_paste_buffer",
        "localId": "prefix/C-b ]",
        "notation": "C-b ]",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "]"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Create a new window",
        "descKey": "packdesc_create_a_new_window",
        "localId": "prefix/C-b c",
        "notation": "C-b c",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Detach the current client",
        "descKey": "packdesc_detach_the_current_client",
        "localId": "prefix/C-b d",
        "notation": "C-b d",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Search for a pane",
        "descKey": "packdesc_search_for_a_pane",
        "localId": "prefix/C-b f",
        "notation": "C-b f",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Display window information",
        "descKey": "packdesc_display_window_information",
        "localId": "prefix/C-b i",
        "notation": "C-b i",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select the previously current window",
        "descKey": "packdesc_select_the_previously_current_window",
        "localId": "prefix/C-b l",
        "notation": "C-b l",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Toggle the marked pane",
        "descKey": "packdesc_toggle_the_marked_pane",
        "localId": "prefix/C-b m",
        "notation": "C-b m",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select the next window",
        "descKey": "packdesc_select_the_next_window",
        "localId": "prefix/C-b n",
        "notation": "C-b n",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Select the next pane",
        "descKey": "packdesc_select_the_next_pane",
        "localId": "prefix/C-b o",
        "notation": "C-b o",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select the previous window",
        "descKey": "packdesc_select_the_previous_window",
        "localId": "prefix/C-b p",
        "notation": "C-b p",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Display pane numbers",
        "descKey": "packdesc_display_pane_numbers",
        "localId": "prefix/C-b q",
        "notation": "C-b q",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Redraw the current client",
        "descKey": "packdesc_redraw_the_current_client",
        "localId": "prefix/C-b r",
        "notation": "C-b r",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Choose a session from a list",
        "descKey": "packdesc_choose_a_session_from_a_list",
        "localId": "prefix/C-b s",
        "notation": "C-b s",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Show a clock",
        "descKey": "packdesc_show_a_clock",
        "localId": "prefix/C-b t",
        "notation": "C-b t",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Choose a window from a list",
        "descKey": "packdesc_choose_a_window_from_a_list",
        "localId": "prefix/C-b w",
        "notation": "C-b w",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Kill the active pane",
        "descKey": "packdesc_kill_the_active_pane",
        "localId": "prefix/C-b x",
        "notation": "C-b x",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "x"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Zoom the active pane",
        "descKey": "packdesc_zoom_the_active_pane",
        "localId": "prefix/C-b z",
        "notation": "C-b z",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Swap the active pane with the pane above",
        "descKey": "packdesc_swap_the_active_pane_with_the_pane_above",
        "localId": "prefix/C-b {",
        "notation": "C-b {",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "{"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Swap the active pane with the pane below",
        "descKey": "packdesc_swap_the_active_pane_with_the_pane_below",
        "localId": "prefix/C-b }",
        "notation": "C-b }",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "}"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Show messages",
        "descKey": "packdesc_show_messages",
        "localId": "prefix/C-b ~",
        "notation": "C-b ~",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "text": "~"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Select the pane above the active pane",
        "descKey": "packdesc_select_the_pane_above_the_active_pane",
        "localId": "prefix/C-b Up",
        "notation": "C-b Up",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "named": "UP"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Select the pane below the active pane",
        "descKey": "packdesc_select_the_pane_below_the_active_pane",
        "localId": "prefix/C-b Down",
        "notation": "C-b Down",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "named": "DOWN"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Select the pane to the left of the active pane",
        "descKey": "packdesc_select_the_pane_to_the_left_of_the_active_pane",
        "localId": "prefix/C-b Left",
        "notation": "C-b Left",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "named": "LEFT"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Select the pane to the right of the active pane",
        "descKey": "packdesc_select_the_pane_to_the_right_of_the_active_pane",
        "localId": "prefix/C-b Right",
        "notation": "C-b Right",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 0,
            "named": "RIGHT"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the even-horizontal layout",
        "descKey": "packdesc_set_the_even_horizontal_layout",
        "localId": "prefix/C-b M-1",
        "notation": "C-b M-1",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "1"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the even-vertical layout",
        "descKey": "packdesc_set_the_even_vertical_layout",
        "localId": "prefix/C-b M-2",
        "notation": "C-b M-2",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "2"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the main-horizontal layout",
        "descKey": "packdesc_set_the_main_horizontal_layout",
        "localId": "prefix/C-b M-3",
        "notation": "C-b M-3",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "3"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the main-vertical layout",
        "descKey": "packdesc_set_the_main_vertical_layout",
        "localId": "prefix/C-b M-4",
        "notation": "C-b M-4",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "4"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Select the tiled layout",
        "descKey": "packdesc_select_the_tiled_layout",
        "localId": "prefix/C-b M-5",
        "notation": "C-b M-5",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "5"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the main-horizontal-mirrored layout",
        "descKey": "packdesc_set_the_main_horizontal_mirrored_layout",
        "localId": "prefix/C-b M-6",
        "notation": "C-b M-6",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "6"
          }
        ]
      },
      {
        "category": "layout",
        "context": "prefix",
        "desc": "Set the main-vertical-mirrored layout",
        "descKey": "packdesc_set_the_main_vertical_mirrored_layout",
        "localId": "prefix/C-b M-7",
        "notation": "C-b M-7",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "7"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select the next window with an alert",
        "descKey": "packdesc_select_the_next_window_with_an_alert",
        "localId": "prefix/C-b M-n",
        "notation": "C-b M-n",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "n"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Rotate through the panes in reverse",
        "descKey": "packdesc_rotate_through_the_panes_in_reverse",
        "localId": "prefix/C-b M-o",
        "notation": "C-b M-o",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "o"
          }
        ]
      },
      {
        "category": "window",
        "context": "prefix",
        "desc": "Select the previous window with an alert",
        "descKey": "packdesc_select_the_previous_window_with_an_alert",
        "localId": "prefix/C-b M-p",
        "notation": "C-b M-p",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "text": "p"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane up by 5",
        "descKey": "packdesc_resize_the_pane_up_by_5",
        "localId": "prefix/C-b M-Up",
        "notation": "C-b M-Up",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "named": "UP"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane down by 5",
        "descKey": "packdesc_resize_the_pane_down_by_5",
        "localId": "prefix/C-b M-Down",
        "notation": "C-b M-Down",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "named": "DOWN"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane left by 5",
        "descKey": "packdesc_resize_the_pane_left_by_5",
        "localId": "prefix/C-b M-Left",
        "notation": "C-b M-Left",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "named": "LEFT"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane right by 5",
        "descKey": "packdesc_resize_the_pane_right_by_5",
        "localId": "prefix/C-b M-Right",
        "notation": "C-b M-Right",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 8,
            "named": "RIGHT"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Send the prefix key",
        "descKey": "packdesc_send_the_prefix_key",
        "localId": "prefix/C-b C-b",
        "notation": "C-b C-b",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "text": "b"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Rotate through the panes",
        "descKey": "packdesc_rotate_through_the_panes",
        "localId": "prefix/C-b C-o",
        "notation": "C-b C-o",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "text": "o"
          }
        ]
      },
      {
        "category": "session",
        "context": "prefix",
        "desc": "Suspend the current client",
        "descKey": "packdesc_suspend_the_current_client",
        "localId": "prefix/C-b C-z",
        "notation": "C-b C-z",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "text": "z"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane up",
        "descKey": "packdesc_resize_the_pane_up",
        "localId": "prefix/C-b C-Up",
        "notation": "C-b C-Up",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "named": "UP"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane down",
        "descKey": "packdesc_resize_the_pane_down",
        "localId": "prefix/C-b C-Down",
        "notation": "C-b C-Down",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "named": "DOWN"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane left",
        "descKey": "packdesc_resize_the_pane_left",
        "localId": "prefix/C-b C-Left",
        "notation": "C-b C-Left",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "named": "LEFT"
          }
        ]
      },
      {
        "category": "pane",
        "context": "prefix",
        "desc": "Resize the pane right",
        "descKey": "packdesc_resize_the_pane_right",
        "localId": "prefix/C-b C-Right",
        "notation": "C-b C-Right",
        "steps": [
          {
            "mods": 4,
            "text": "b"
          },
          {
            "mods": 4,
            "named": "RIGHT"
          }
        ]
      }
    ],
    "categories": [
      "pane",
      "window",
      "session",
      "layout",
      "copy",
      "misc"
    ],
    "contexts": [
      "prefix"
    ],
    "dropped": {
      "device-special-key": 2,
      "unreadable-notation": 4
    },
    "judgeMode": "text",
    "profile": "tmux",
    "provenance": {
      "authority": "tmux -f /dev/null list-keys -N -T prefix (the vendor's own read-only listing, with no configuration sourced)",
      "generatedAt": "2026-09-04",
      "generator": "tools/build_packs.py@1",
      "source": {
        "checksum": "af5127697c30678bd7e016a49017fd2524ca7154c3b4c8db45c9a3568660106d",
        "commit": "",
        "date": "2026-09-04",
        "tag": "3.7c",
        "url": "https://github.com/tmux/tmux"
      },
      "upstream": "tmux"
    },
    "schemaVersion": 1
  }
}

function ids() {
  return ["lazyvim", "tmux"]
}

function pack(id) {
  return Object.prototype.hasOwnProperty.call(packs, id) ? packs[id] : null
}
