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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>bb",
        "notation": "<leader>bb",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>`",
        "notation": "<leader>`",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bd",
        "notation": "<leader>bd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bo",
        "notation": "<leader>bo",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bi",
        "notation": "<leader>bi",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bD",
        "notation": "<leader>bD",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ur",
        "notation": "<leader>ur",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>K",
        "notation": "<leader>K",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>l",
        "notation": "<leader>l",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fn",
        "notation": "<leader>fn",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xl",
        "notation": "<leader>xl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xq",
        "notation": "<leader>xq",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>cf",
        "notation": "<leader>cf",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cd",
        "notation": "<leader>cd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>uf",
        "notation": "<leader>uf",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uF",
        "notation": "<leader>uF",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>us",
        "notation": "<leader>us",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uw",
        "notation": "<leader>uw",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uL",
        "notation": "<leader>uL",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ud",
        "notation": "<leader>ud",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ul",
        "notation": "<leader>ul",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uc",
        "notation": "<leader>uc",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uA",
        "notation": "<leader>uA",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uT",
        "notation": "<leader>uT",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ub",
        "notation": "<leader>ub",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uD",
        "notation": "<leader>uD",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ua",
        "notation": "<leader>ua",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ug",
        "notation": "<leader>ug",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uS",
        "notation": "<leader>uS",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>dpp",
        "notation": "<leader>dpp",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>dph",
        "notation": "<leader>dph",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uh",
        "notation": "<leader>uh",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gL",
        "notation": "<leader>gL",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gb",
        "notation": "<leader>gb",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gf",
        "notation": "<leader>gf",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gl",
        "notation": "<leader>gl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gB",
        "notation": "<leader>gB",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gY",
        "notation": "<leader>gY",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>qq",
        "notation": "<leader>qq",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ui",
        "notation": "<leader>ui",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uI",
        "notation": "<leader>uI",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>L",
        "notation": "<leader>L",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fT",
        "notation": "<leader>fT",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ft",
        "notation": "<leader>ft",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>-",
        "notation": "<leader>-",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>|",
        "notation": "<leader>|",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>wd",
        "notation": "<leader>wd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>wm",
        "notation": "<leader>wm",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uZ",
        "notation": "<leader>uZ",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uz",
        "notation": "<leader>uz",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>l",
        "notation": "<leader><tab>l",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>o",
        "notation": "<leader><tab>o",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>f",
        "notation": "<leader><tab>f",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab><tab>",
        "notation": "<leader><tab><tab>",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>]",
        "notation": "<leader><tab>]",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>d",
        "notation": "<leader><tab>d",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><tab>[",
        "notation": "<leader><tab>[",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cl",
        "notation": "<leader>cl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>ca",
        "notation": "<leader>ca",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cc",
        "notation": "<leader>cc",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cC",
        "notation": "<leader>cC",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cR",
        "notation": "<leader>cR",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cr",
        "notation": "<leader>cr",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cA",
        "notation": "<leader>cA",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>co",
        "notation": "<leader>co",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ss",
        "notation": "<leader>ss",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sS",
        "notation": "<leader>sS",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>bj",
        "notation": "<leader>bj",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bl",
        "notation": "<leader>bl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bp",
        "notation": "<leader>bp",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>bP",
        "notation": "<leader>bP",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>br",
        "notation": "<leader>br",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>cF",
        "notation": "<leader>cF",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>sr",
        "notation": "<leader>sr",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cm",
        "notation": "<leader>cm",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>sna",
        "notation": "<leader>sna",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>snd",
        "notation": "<leader>snd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>snh",
        "notation": "<leader>snh",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>snl",
        "notation": "<leader>snl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>snt",
        "notation": "<leader>snt",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>qd",
        "notation": "<leader>qd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ql",
        "notation": "<leader>ql",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>qs",
        "notation": "<leader>qs",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>qS",
        "notation": "<leader>qS",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader><space>",
        "notation": "<leader><space>",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>,",
        "notation": "<leader>,",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>.",
        "notation": "<leader>.",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>/",
        "notation": "<leader>/",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>:",
        "notation": "<leader>:",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>dps",
        "notation": "<leader>dps",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>e",
        "notation": "<leader>e",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>E",
        "notation": "<leader>E",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fb",
        "notation": "<leader>fb",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fB",
        "notation": "<leader>fB",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fc",
        "notation": "<leader>fc",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fe",
        "notation": "<leader>fe",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fE",
        "notation": "<leader>fE",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>ff",
        "notation": "<leader>ff",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fF",
        "notation": "<leader>fF",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fg",
        "notation": "<leader>fg",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fp",
        "notation": "<leader>fp",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fr",
        "notation": "<leader>fr",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>fR",
        "notation": "<leader>fR",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gd",
        "notation": "<leader>gd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gD",
        "notation": "<leader>gD",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gi",
        "notation": "<leader>gi",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gI",
        "notation": "<leader>gI",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gp",
        "notation": "<leader>gp",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gP",
        "notation": "<leader>gP",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gs",
        "notation": "<leader>gs",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>gS",
        "notation": "<leader>gS",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>n",
        "notation": "<leader>n",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>S",
        "notation": "<leader>S",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>s\"",
        "notation": "<leader>s\"",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>s/",
        "notation": "<leader>s/",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sa",
        "notation": "<leader>sa",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sb",
        "notation": "<leader>sb",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sB",
        "notation": "<leader>sB",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sc",
        "notation": "<leader>sc",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sC",
        "notation": "<leader>sC",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sd",
        "notation": "<leader>sd",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sD",
        "notation": "<leader>sD",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sg",
        "notation": "<leader>sg",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sG",
        "notation": "<leader>sG",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sh",
        "notation": "<leader>sh",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sH",
        "notation": "<leader>sH",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>si",
        "notation": "<leader>si",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sj",
        "notation": "<leader>sj",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sk",
        "notation": "<leader>sk",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sl",
        "notation": "<leader>sl",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sm",
        "notation": "<leader>sm",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sM",
        "notation": "<leader>sM",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sp",
        "notation": "<leader>sp",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sq",
        "notation": "<leader>sq",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sR",
        "notation": "<leader>sR",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>su",
        "notation": "<leader>su",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sw",
        "notation": "<leader>sw",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sW",
        "notation": "<leader>sW",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>uC",
        "notation": "<leader>uC",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>un",
        "notation": "<leader>un",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>st",
        "notation": "<leader>st",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>sT",
        "notation": "<leader>sT",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xt",
        "notation": "<leader>xt",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xT",
        "notation": "<leader>xT",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>cs",
        "notation": "<leader>cs",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>cS",
        "notation": "<leader>cS",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xL",
        "notation": "<leader>xL",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xQ",
        "notation": "<leader>xQ",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xx",
        "notation": "<leader>xx",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
        "localId": "normal/<leader>xX",
        "notation": "<leader>xX",
        "steps": [
          {
            "option": "leader"
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
        "extras": [],
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
        "extras": [],
        "localId": "normal/<leader>?",
        "notation": "<leader>?",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "?"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Ask Avante",
        "descKey": "packdesc_ask_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.claudecode",
          "lazyvim.plugins.extras.ai.copilot-chat",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>aa",
        "notation": "<leader>aa",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Chat with Avante",
        "descKey": "packdesc_chat_with_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.claudecode"
        ],
        "localId": "normal/<leader>ac",
        "notation": "<leader>ac",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Edit Avante",
        "descKey": "packdesc_edit_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante"
        ],
        "localId": "normal/<leader>ae",
        "notation": "<leader>ae",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Focus Avante",
        "descKey": "packdesc_focus_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.claudecode",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>af",
        "notation": "<leader>af",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Avante History",
        "descKey": "packdesc_avante_history",
        "extras": [
          "lazyvim.plugins.extras.ai.avante"
        ],
        "localId": "normal/<leader>ah",
        "notation": "<leader>ah",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Select Avante Model",
        "descKey": "packdesc_select_avante_model",
        "extras": [
          "lazyvim.plugins.extras.ai.avante"
        ],
        "localId": "normal/<leader>am",
        "notation": "<leader>am",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "New Avante Chat",
        "descKey": "packdesc_new_avante_chat",
        "extras": [
          "lazyvim.plugins.extras.ai.avante"
        ],
        "localId": "normal/<leader>an",
        "notation": "<leader>an",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Switch Avante Provider",
        "descKey": "packdesc_switch_avante_provider",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.copilot-chat",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>ap",
        "notation": "<leader>ap",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Refresh Avante",
        "descKey": "packdesc_refresh_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.claudecode"
        ],
        "localId": "normal/<leader>ar",
        "notation": "<leader>ar",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Stop Avante",
        "descKey": "packdesc_stop_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.claudecode",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>as",
        "notation": "<leader>as",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Toggle Avante",
        "descKey": "packdesc_toggle_avante",
        "extras": [
          "lazyvim.plugins.extras.ai.avante",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>at",
        "notation": "<leader>at",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Add current buffer",
        "descKey": "packdesc_add_current_buffer",
        "extras": [
          "lazyvim.plugins.extras.ai.claudecode"
        ],
        "localId": "normal/<leader>ab",
        "notation": "<leader>ab",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Continue Claude",
        "descKey": "packdesc_continue_claude",
        "extras": [
          "lazyvim.plugins.extras.ai.claudecode"
        ],
        "localId": "normal/<leader>aC",
        "notation": "<leader>aC",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Deny diff",
        "descKey": "packdesc_deny_diff",
        "extras": [
          "lazyvim.plugins.extras.ai.claudecode",
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<leader>ad",
        "notation": "<leader>ad",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "d"
          }
        ]
      },
      {
        "category": "ai",
        "context": "visual",
        "desc": "Send to Claude",
        "descKey": "packdesc_send_to_claude",
        "extras": [
          "lazyvim.plugins.extras.ai.claudecode"
        ],
        "localId": "visual/<leader>as",
        "notation": "<leader>as",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Submit Prompt",
        "descKey": "packdesc_submit_prompt",
        "extras": [
          "lazyvim.plugins.extras.ai.copilot-chat"
        ],
        "localId": "normal/<c-s>",
        "notation": "<c-s>",
        "steps": [
          {
            "mods": 4,
            "text": "s"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Quick Chat (CopilotChat)",
        "descKey": "packdesc_quick_chat_copilotchat",
        "extras": [
          "lazyvim.plugins.extras.ai.copilot-chat"
        ],
        "localId": "normal/<leader>aq",
        "notation": "<leader>aq",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Clear (CopilotChat)",
        "descKey": "packdesc_clear_copilotchat",
        "extras": [
          "lazyvim.plugins.extras.ai.copilot-chat"
        ],
        "localId": "normal/<leader>ax",
        "notation": "<leader>ax",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "x"
          }
        ]
      },
      {
        "category": "ai",
        "context": "visual",
        "desc": "Send Visual Selection",
        "descKey": "packdesc_send_visual_selection",
        "extras": [
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "visual/<leader>av",
        "notation": "<leader>av",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "a"
          },
          {
            "mods": 0,
            "text": "v"
          }
        ]
      },
      {
        "category": "ai",
        "context": "normal",
        "desc": "Sidekick Focus",
        "descKey": "packdesc_sidekick_focus",
        "extras": [
          "lazyvim.plugins.extras.ai.sidekick"
        ],
        "localId": "normal/<c-.>",
        "notation": "<c-.>",
        "steps": [
          {
            "mods": 4,
            "text": "."
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Add Surrounding",
        "descKey": "packdesc_add_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsa",
        "notation": "gsa",
        "steps": [
          {
            "mods": 0,
            "text": "g"
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
        "category": "edit",
        "context": "normal",
        "desc": "Delete Surrounding",
        "descKey": "packdesc_delete_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsd",
        "notation": "gsd",
        "steps": [
          {
            "mods": 0,
            "text": "g"
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
        "category": "edit",
        "context": "normal",
        "desc": "Find Right Surrounding",
        "descKey": "packdesc_find_right_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsf",
        "notation": "gsf",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "f"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Find Left Surrounding",
        "descKey": "packdesc_find_left_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsF",
        "notation": "gsF",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "F"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Highlight Surrounding",
        "descKey": "packdesc_highlight_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsh",
        "notation": "gsh",
        "steps": [
          {
            "mods": 0,
            "text": "g"
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
        "category": "edit",
        "context": "normal",
        "desc": "Update `MiniSurround.config.n_lines`",
        "descKey": "packdesc_update_minisurround_config_n_lines",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsn",
        "notation": "gsn",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Replace Surrounding",
        "descKey": "packdesc_replace_surrounding",
        "extras": [
          "lazyvim.plugins.extras.coding.mini-surround"
        ],
        "localId": "normal/gsr",
        "notation": "gsr",
        "steps": [
          {
            "mods": 0,
            "text": "g"
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
        "desc": "Generate Annotations (Neogen)",
        "descKey": "packdesc_generate_annotations_neogen",
        "extras": [
          "lazyvim.plugins.extras.coding.neogen"
        ],
        "localId": "normal/<leader>cn",
        "notation": "<leader>cn",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "c"
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
        "desc": "Open Yank History",
        "descKey": "packdesc_open_yank_history",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/<leader>p",
        "notation": "<leader>p",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Put After Applying a Filter",
        "descKey": "packdesc_put_after_applying_a_filter",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/=p",
        "notation": "=p",
        "steps": [
          {
            "mods": 0,
            "text": "="
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Put Before Applying a Filter",
        "descKey": "packdesc_put_before_applying_a_filter",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/=P",
        "notation": "=P",
        "steps": [
          {
            "mods": 0,
            "text": "="
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Put and Indent Right",
        "descKey": "packdesc_put_and_indent_right",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/>p",
        "notation": ">p",
        "steps": [
          {
            "mods": 0,
            "text": ">"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Put Before and Indent Right",
        "descKey": "packdesc_put_before_and_indent_right",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/>P",
        "notation": ">P",
        "steps": [
          {
            "mods": 0,
            "text": ">"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Put Indented Before Cursor (Linewise)",
        "descKey": "packdesc_put_indented_before_cursor_linewise",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/[p",
        "notation": "[p",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Put Indented Before Cursor (Linewise)",
        "descKey": "packdesc_put_indented_before_cursor_linewise",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/[P",
        "notation": "[P",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Cycle Forward Through Yank History",
        "descKey": "packdesc_cycle_forward_through_yank_history",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/[y",
        "notation": "[y",
        "steps": [
          {
            "mods": 0,
            "text": "["
          },
          {
            "mods": 0,
            "text": "y"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Put Indented After Cursor (Linewise)",
        "descKey": "packdesc_put_indented_after_cursor_linewise",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/]p",
        "notation": "]p",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Put Indented After Cursor (Linewise)",
        "descKey": "packdesc_put_indented_after_cursor_linewise",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/]P",
        "notation": "]P",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Cycle Backward Through Yank History",
        "descKey": "packdesc_cycle_backward_through_yank_history",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/]y",
        "notation": "]y",
        "steps": [
          {
            "mods": 0,
            "text": "]"
          },
          {
            "mods": 0,
            "text": "y"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Put Text After Selection",
        "descKey": "packdesc_put_text_after_selection",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/gp",
        "notation": "gp",
        "steps": [
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
        "category": "edit",
        "context": "normal",
        "desc": "Put Text Before Selection",
        "descKey": "packdesc_put_text_before_selection",
        "extras": [
          "lazyvim.plugins.extras.coding.yanky"
        ],
        "localId": "normal/gP",
        "notation": "gP",
        "steps": [
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
        "category": "debug",
        "context": "normal",
        "desc": "Run with Args",
        "descKey": "packdesc_run_with_args",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>da",
        "notation": "<leader>da",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "a"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Toggle Breakpoint",
        "descKey": "packdesc_toggle_breakpoint",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>db",
        "notation": "<leader>db",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Breakpoint Condition",
        "descKey": "packdesc_breakpoint_condition",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dB",
        "notation": "<leader>dB",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "B"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Run/Continue",
        "descKey": "packdesc_run_continue",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dc",
        "notation": "<leader>dc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Run to Cursor",
        "descKey": "packdesc_run_to_cursor",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dC",
        "notation": "<leader>dC",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Go to Line (No Execute)",
        "descKey": "packdesc_go_to_line_no_execute",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dg",
        "notation": "<leader>dg",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Step Into",
        "descKey": "packdesc_step_into",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>di",
        "notation": "<leader>di",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Down",
        "descKey": "packdesc_down",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dj",
        "notation": "<leader>dj",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "j"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Up",
        "descKey": "packdesc_up",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dk",
        "notation": "<leader>dk",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "k"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Run Last",
        "descKey": "packdesc_run_last",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dl",
        "notation": "<leader>dl",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Step Out",
        "descKey": "packdesc_step_out",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>do",
        "notation": "<leader>do",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Step Over",
        "descKey": "packdesc_step_over",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dO",
        "notation": "<leader>dO",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "O"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Pause",
        "descKey": "packdesc_pause",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dP",
        "notation": "<leader>dP",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Toggle REPL",
        "descKey": "packdesc_toggle_repl",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dr",
        "notation": "<leader>dr",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Session",
        "descKey": "packdesc_session",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>ds",
        "notation": "<leader>ds",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Terminate",
        "descKey": "packdesc_terminate",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dt",
        "notation": "<leader>dt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Widgets",
        "descKey": "packdesc_widgets",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>dw",
        "notation": "<leader>dw",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Eval",
        "descKey": "packdesc_eval",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>de",
        "notation": "<leader>de",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Dap UI",
        "descKey": "packdesc_dap_ui",
        "extras": [
          "lazyvim.plugins.extras.dap.core"
        ],
        "localId": "normal/<leader>du",
        "notation": "<leader>du",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "u"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Increment",
        "descKey": "packdesc_increment",
        "extras": [
          "lazyvim.plugins.extras.editor.dial"
        ],
        "localId": "normal/<C-a>",
        "notation": "<C-a>",
        "steps": [
          {
            "mods": 4,
            "text": "a"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Decrement",
        "descKey": "packdesc_decrement",
        "extras": [
          "lazyvim.plugins.extras.editor.dial"
        ],
        "localId": "normal/<C-x>",
        "notation": "<C-x>",
        "steps": [
          {
            "mods": 4,
            "text": "x"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Increment",
        "descKey": "packdesc_increment",
        "extras": [
          "lazyvim.plugins.extras.editor.dial"
        ],
        "localId": "normal/g<C-a>",
        "notation": "g<C-a>",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 4,
            "text": "a"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Decrement",
        "descKey": "packdesc_decrement",
        "extras": [
          "lazyvim.plugins.extras.editor.dial"
        ],
        "localId": "normal/g<C-x>",
        "notation": "g<C-x>",
        "steps": [
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 4,
            "text": "x"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 1",
        "descKey": "packdesc_harpoon_to_file_1",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>1",
        "notation": "<leader>1",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "1"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 2",
        "descKey": "packdesc_harpoon_to_file_2",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>2",
        "notation": "<leader>2",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "2"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 3",
        "descKey": "packdesc_harpoon_to_file_3",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>3",
        "notation": "<leader>3",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "3"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 4",
        "descKey": "packdesc_harpoon_to_file_4",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>4",
        "notation": "<leader>4",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "4"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 5",
        "descKey": "packdesc_harpoon_to_file_5",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>5",
        "notation": "<leader>5",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "5"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 6",
        "descKey": "packdesc_harpoon_to_file_6",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>6",
        "notation": "<leader>6",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "6"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 7",
        "descKey": "packdesc_harpoon_to_file_7",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>7",
        "notation": "<leader>7",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "7"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 8",
        "descKey": "packdesc_harpoon_to_file_8",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>8",
        "notation": "<leader>8",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "8"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon to File 9",
        "descKey": "packdesc_harpoon_to_file_9",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>9",
        "notation": "<leader>9",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "9"
          }
        ]
      },
      {
        "category": "navigation",
        "context": "normal",
        "desc": "Harpoon Quick Menu",
        "descKey": "packdesc_harpoon_quick_menu",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>h",
        "notation": "<leader>h",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Harpoon File",
        "descKey": "packdesc_harpoon_file",
        "extras": [
          "lazyvim.plugins.extras.editor.harpoon2"
        ],
        "localId": "normal/<leader>H",
        "notation": "<leader>H",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "H"
          }
        ]
      },
      {
        "category": "edit",
        "context": "normal",
        "desc": "Leap from Windows",
        "descKey": "packdesc_leap_from_windows",
        "extras": [
          "lazyvim.plugins.extras.editor.leap"
        ],
        "localId": "normal/gs",
        "notation": "gs",
        "steps": [
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
        "desc": "Toggle mini.diff overlay",
        "descKey": "packdesc_toggle_mini_diff_overlay",
        "extras": [
          "lazyvim.plugins.extras.editor.mini-diff"
        ],
        "localId": "normal/<leader>go",
        "notation": "<leader>go",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Open mini.files (Directory of Current File)",
        "descKey": "packdesc_open_mini_files_directory_of_current_file",
        "extras": [
          "lazyvim.plugins.extras.editor.mini-files"
        ],
        "localId": "normal/<leader>fm",
        "notation": "<leader>fm",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "m"
          }
        ]
      },
      {
        "category": "find",
        "context": "normal",
        "desc": "Open mini.files (cwd)",
        "descKey": "packdesc_open_mini_files_cwd",
        "extras": [
          "lazyvim.plugins.extras.editor.mini-files"
        ],
        "localId": "normal/<leader>fM",
        "notation": "<leader>fM",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "f"
          },
          {
            "mods": 0,
            "text": "M"
          }
        ]
      },
      {
        "category": "task",
        "context": "normal",
        "desc": "Run task",
        "descKey": "packdesc_run_task",
        "extras": [
          "lazyvim.plugins.extras.editor.overseer"
        ],
        "localId": "normal/<leader>oo",
        "notation": "<leader>oo",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "o"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "task",
        "context": "normal",
        "desc": "Task action",
        "descKey": "packdesc_task_action",
        "extras": [
          "lazyvim.plugins.extras.editor.overseer"
        ],
        "localId": "normal/<leader>ot",
        "notation": "<leader>ot",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "o"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "task",
        "context": "normal",
        "desc": "Task list",
        "descKey": "packdesc_task_list",
        "extras": [
          "lazyvim.plugins.extras.editor.overseer"
        ],
        "localId": "normal/<leader>ow",
        "notation": "<leader>ow",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "o"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Debug Cleanup",
        "descKey": "packdesc_debug_cleanup",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rc",
        "notation": "<leader>rc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Extract Function",
        "descKey": "packdesc_extract_function",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rf",
        "notation": "<leader>rf",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Extract Function To File",
        "descKey": "packdesc_extract_function_to_file",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rF",
        "notation": "<leader>rF",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "F"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Inline Variable",
        "descKey": "packdesc_inline_variable",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>ri",
        "notation": "<leader>ri",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Debug Print Variable",
        "descKey": "packdesc_debug_print_variable",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rp",
        "notation": "<leader>rp",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Debug Print Location",
        "descKey": "packdesc_debug_print_location",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rP",
        "notation": "<leader>rP",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "P"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Select Refactor",
        "descKey": "packdesc_select_refactor",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rs",
        "notation": "<leader>rs",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Extract Variable",
        "descKey": "packdesc_extract_variable",
        "extras": [
          "lazyvim.plugins.extras.editor.refactoring"
        ],
        "localId": "normal/<leader>rx",
        "notation": "<leader>rx",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "x"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Ansible Run Playbook/Role",
        "descKey": "packdesc_ansible_run_playbook_role",
        "extras": [
          "lazyvim.plugins.extras.lang.ansible",
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>ta",
        "notation": "<leader>ta",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
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
        "desc": "Evaluate All",
        "descKey": "packdesc_evaluate_all",
        "extras": [
          "lazyvim.plugins.extras.lang.haskell"
        ],
        "localId": "normal/<localleader>e",
        "notation": "<localleader>e",
        "steps": [
          {
            "option": "localleader"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Hoogle Signature",
        "descKey": "packdesc_hoogle_signature",
        "extras": [
          "lazyvim.plugins.extras.lang.haskell"
        ],
        "localId": "normal/<localleader>h",
        "notation": "<localleader>h",
        "steps": [
          {
            "option": "localleader"
          },
          {
            "mods": 0,
            "text": "h"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "REPL (Package)",
        "descKey": "packdesc_repl_package",
        "extras": [
          "lazyvim.plugins.extras.lang.haskell"
        ],
        "localId": "normal/<localleader>r",
        "notation": "<localleader>r",
        "steps": [
          {
            "option": "localleader"
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
        "desc": "REPL (Buffer)",
        "descKey": "packdesc_repl_buffer",
        "extras": [
          "lazyvim.plugins.extras.lang.haskell"
        ],
        "localId": "normal/<localleader>R",
        "notation": "<localleader>R",
        "steps": [
          {
            "option": "localleader"
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
        "desc": "Hoogle",
        "descKey": "packdesc_hoogle",
        "extras": [
          "lazyvim.plugins.extras.lang.haskell"
        ],
        "localId": "normal/<localleader>H",
        "notation": "<localleader>H",
        "steps": [
          {
            "option": "localleader"
          },
          {
            "mods": 0,
            "text": "H"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Markdown Preview",
        "descKey": "packdesc_markdown_preview",
        "extras": [
          "lazyvim.plugins.extras.lang.markdown",
          "lazyvim.plugins.extras.lang.typst"
        ],
        "localId": "normal/<leader>cp",
        "notation": "<leader>cp",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "c"
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
        "desc": "Debug Class",
        "descKey": "packdesc_debug_class",
        "extras": [
          "lazyvim.plugins.extras.lang.python"
        ],
        "localId": "normal/<leader>dPc",
        "notation": "<leader>dPc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "P"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "debug",
        "context": "normal",
        "desc": "Debug Method",
        "descKey": "packdesc_debug_method",
        "extras": [
          "lazyvim.plugins.extras.lang.python"
        ],
        "localId": "normal/<leader>dPt",
        "notation": "<leader>dPt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "d"
          },
          {
            "mods": 0,
            "text": "P"
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
        "desc": "Select VirtualEnv",
        "descKey": "packdesc_select_virtualenv",
        "extras": [
          "lazyvim.plugins.extras.lang.python"
        ],
        "localId": "normal/<leader>cv",
        "notation": "<leader>cv",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "v"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Metals compile cascade",
        "descKey": "packdesc_metals_compile_cascade",
        "extras": [
          "lazyvim.plugins.extras.lang.scala"
        ],
        "localId": "normal/<leader>mc",
        "notation": "<leader>mc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "m"
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
        "desc": "Metals commands",
        "descKey": "packdesc_metals_commands",
        "extras": [
          "lazyvim.plugins.extras.lang.scala"
        ],
        "localId": "normal/<leader>me",
        "notation": "<leader>me",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "m"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "code",
        "context": "normal",
        "desc": "Metals hover worksheet",
        "descKey": "packdesc_metals_hover_worksheet",
        "extras": [
          "lazyvim.plugins.extras.lang.scala"
        ],
        "localId": "normal/<leader>mh",
        "notation": "<leader>mh",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "m"
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
        "desc": "Toggle DBUI",
        "descKey": "packdesc_toggle_dbui",
        "extras": [
          "lazyvim.plugins.extras.lang.sql"
        ],
        "localId": "normal/<leader>D",
        "notation": "<leader>D",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "D"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Run Last (Neotest)",
        "descKey": "packdesc_run_last_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tl",
        "notation": "<leader>tl",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "l"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Show Output (Neotest)",
        "descKey": "packdesc_show_output_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>to",
        "notation": "<leader>to",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Toggle Output Panel (Neotest)",
        "descKey": "packdesc_toggle_output_panel_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tO",
        "notation": "<leader>tO",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "O"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Run Nearest (Neotest)",
        "descKey": "packdesc_run_nearest_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tr",
        "notation": "<leader>tr",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Toggle Summary (Neotest)",
        "descKey": "packdesc_toggle_summary_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>ts",
        "notation": "<leader>ts",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Stop (Neotest)",
        "descKey": "packdesc_stop_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tS",
        "notation": "<leader>tS",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Run File (Neotest)",
        "descKey": "packdesc_run_file_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tt",
        "notation": "<leader>tt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Run All Test Files (Neotest)",
        "descKey": "packdesc_run_all_test_files_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tT",
        "notation": "<leader>tT",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "T"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Toggle Watch (Neotest)",
        "descKey": "packdesc_toggle_watch_neotest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>tw",
        "notation": "<leader>tw",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "w"
          }
        ]
      },
      {
        "category": "test",
        "context": "normal",
        "desc": "Debug Nearest",
        "descKey": "packdesc_debug_nearest",
        "extras": [
          "lazyvim.plugins.extras.test.core"
        ],
        "localId": "normal/<leader>td",
        "notation": "<leader>td",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "t"
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
        "desc": "Edgy Toggle",
        "descKey": "packdesc_edgy_toggle",
        "extras": [
          "lazyvim.plugins.extras.ui.edgy"
        ],
        "localId": "normal/<leader>ue",
        "notation": "<leader>ue",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "ui",
        "context": "normal",
        "desc": "Edgy Select Window",
        "descKey": "packdesc_edgy_select_window",
        "extras": [
          "lazyvim.plugins.extras.ui.edgy"
        ],
        "localId": "normal/<leader>uE",
        "notation": "<leader>uE",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "u"
          },
          {
            "mods": 0,
            "text": "E"
          }
        ]
      },
      {
        "category": "search",
        "context": "normal",
        "desc": "Chezmoi",
        "descKey": "packdesc_chezmoi",
        "extras": [
          "lazyvim.plugins.extras.util.chezmoi"
        ],
        "localId": "normal/<leader>sz",
        "notation": "<leader>sz",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "s"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Close",
        "descKey": "packdesc_close",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gcc",
        "notation": "<leader>Gcc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
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
        "category": "git",
        "context": "normal",
        "desc": "Expand",
        "descKey": "packdesc_expand",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gce",
        "notation": "<leader>Gce",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Open To",
        "descKey": "packdesc_open_to",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gco",
        "notation": "<leader>Gco",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
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
        "category": "git",
        "context": "normal",
        "desc": "Pop Out",
        "descKey": "packdesc_pop_out",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gcp",
        "notation": "<leader>Gcp",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "c"
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
        "desc": "Collapse",
        "descKey": "packdesc_collapse",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gcz",
        "notation": "<leader>Gcz",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "c"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Open",
        "descKey": "packdesc_open",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gio",
        "notation": "<leader>Gio",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "i"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Preview",
        "descKey": "packdesc_preview",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gip",
        "notation": "<leader>Gip",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "i"
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
        "desc": "Toggle Panel",
        "descKey": "packdesc_toggle_panel",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Glt",
        "notation": "<leader>Glt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "l"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Close",
        "descKey": "packdesc_close",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpc",
        "notation": "<leader>Gpc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Details",
        "descKey": "packdesc_details",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpd",
        "notation": "<leader>Gpd",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
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
        "desc": "Expand",
        "descKey": "packdesc_expand",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpe",
        "notation": "<leader>Gpe",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Open",
        "descKey": "packdesc_open",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpo",
        "notation": "<leader>Gpo",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "o"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "PopOut",
        "descKey": "packdesc_popout",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpp",
        "notation": "<leader>Gpp",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
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
        "category": "git",
        "context": "normal",
        "desc": "Refresh",
        "descKey": "packdesc_refresh",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpr",
        "notation": "<leader>Gpr",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Open To",
        "descKey": "packdesc_open_to",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpt",
        "notation": "<leader>Gpt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Collapse",
        "descKey": "packdesc_collapse",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gpz",
        "notation": "<leader>Gpz",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "p"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Begin",
        "descKey": "packdesc_begin",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Grb",
        "notation": "<leader>Grb",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Close",
        "descKey": "packdesc_close",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Grc",
        "notation": "<leader>Grc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Delete",
        "descKey": "packdesc_delete",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Grd",
        "notation": "<leader>Grd",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Expand",
        "descKey": "packdesc_expand",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gre",
        "notation": "<leader>Gre",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Submit",
        "descKey": "packdesc_submit",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Grs",
        "notation": "<leader>Grs",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
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
        "desc": "Collapse",
        "descKey": "packdesc_collapse",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Grz",
        "notation": "<leader>Grz",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "r"
          },
          {
            "mods": 0,
            "text": "z"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Create",
        "descKey": "packdesc_create",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gtc",
        "notation": "<leader>Gtc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Next",
        "descKey": "packdesc_next",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gtn",
        "notation": "<leader>Gtn",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "Toggle",
        "descKey": "packdesc_toggle",
        "extras": [
          "lazyvim.plugins.extras.util.gh"
        ],
        "localId": "normal/<leader>Gtt",
        "notation": "<leader>Gtt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "G"
          },
          {
            "mods": 0,
            "text": "t"
          },
          {
            "mods": 0,
            "text": "t"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitUi (Root Dir)",
        "descKey": "packdesc_gitui_root_dir",
        "extras": [
          "lazyvim.plugins.extras.util.gitui"
        ],
        "localId": "normal/<leader>gg",
        "notation": "<leader>gg",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "GitUi (cwd)",
        "descKey": "packdesc_gitui_cwd",
        "extras": [
          "lazyvim.plugins.extras.util.gitui"
        ],
        "localId": "normal/<leader>gG",
        "notation": "<leader>gG",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "g"
          },
          {
            "mods": 0,
            "text": "G"
          }
        ]
      },
      {
        "category": "git",
        "context": "normal",
        "desc": "List Repos (Octo)",
        "descKey": "packdesc_list_repos_octo",
        "extras": [
          "lazyvim.plugins.extras.util.octo"
        ],
        "localId": "normal/<leader>gr",
        "notation": "<leader>gr",
        "steps": [
          {
            "option": "leader"
          },
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
        "category": "http",
        "context": "normal",
        "desc": "Open scratchpad",
        "descKey": "packdesc_open_scratchpad",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rb",
        "notation": "<leader>Rb",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "b"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Copy as cURL",
        "descKey": "packdesc_copy_as_curl",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rc",
        "notation": "<leader>Rc",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "c"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Paste from curl",
        "descKey": "packdesc_paste_from_curl",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>RC",
        "notation": "<leader>RC",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "C"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Set environment",
        "descKey": "packdesc_set_environment",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Re",
        "notation": "<leader>Re",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "e"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Download GraphQL schema",
        "descKey": "packdesc_download_graphql_schema",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rg",
        "notation": "<leader>Rg",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "g"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Inspect current request",
        "descKey": "packdesc_inspect_current_request",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Ri",
        "notation": "<leader>Ri",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "i"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Jump to next request",
        "descKey": "packdesc_jump_to_next_request",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rn",
        "notation": "<leader>Rn",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "n"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Jump to previous request",
        "descKey": "packdesc_jump_to_previous_request",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rp",
        "notation": "<leader>Rp",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "p"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Close window",
        "descKey": "packdesc_close_window",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rq",
        "notation": "<leader>Rq",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "q"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Replay the last request",
        "descKey": "packdesc_replay_the_last_request",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rr",
        "notation": "<leader>Rr",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "r"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Send the request",
        "descKey": "packdesc_send_the_request",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rs",
        "notation": "<leader>Rs",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "s"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Show stats",
        "descKey": "packdesc_show_stats",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>RS",
        "notation": "<leader>RS",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "S"
          }
        ]
      },
      {
        "category": "http",
        "context": "normal",
        "desc": "Toggle headers/body",
        "descKey": "packdesc_toggle_headers_body",
        "extras": [
          "lazyvim.plugins.extras.util.rest"
        ],
        "localId": "normal/<leader>Rt",
        "notation": "<leader>Rt",
        "steps": [
          {
            "option": "leader"
          },
          {
            "mods": 0,
            "text": "R"
          },
          {
            "mods": 0,
            "text": "t"
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
      "test",
      "task",
      "diagnostics",
      "window",
      "session",
      "ui",
      "terminal",
      "ai",
      "http",
      "edit",
      "navigation",
      "misc"
    ],
    "contexts": [
      "insert",
      "normal",
      "operator",
      "visual"
    ],
    "dropped": {
      "merged-with-an-existing-key": 89,
      "missing-description": 26,
      "unreadable-notation": 3,
      "untrained-mode": 2,
      "well-known": 10
    },
    "extras": [
      "lazyvim.plugins.extras.ai.avante",
      "lazyvim.plugins.extras.ai.claudecode",
      "lazyvim.plugins.extras.ai.copilot-chat",
      "lazyvim.plugins.extras.ai.sidekick",
      "lazyvim.plugins.extras.coding.mini-surround",
      "lazyvim.plugins.extras.coding.neogen",
      "lazyvim.plugins.extras.coding.yanky",
      "lazyvim.plugins.extras.dap.core",
      "lazyvim.plugins.extras.editor.dial",
      "lazyvim.plugins.extras.editor.harpoon2",
      "lazyvim.plugins.extras.editor.leap",
      "lazyvim.plugins.extras.editor.mini-diff",
      "lazyvim.plugins.extras.editor.mini-files",
      "lazyvim.plugins.extras.editor.overseer",
      "lazyvim.plugins.extras.editor.refactoring",
      "lazyvim.plugins.extras.lang.ansible",
      "lazyvim.plugins.extras.lang.haskell",
      "lazyvim.plugins.extras.lang.markdown",
      "lazyvim.plugins.extras.lang.python",
      "lazyvim.plugins.extras.lang.scala",
      "lazyvim.plugins.extras.lang.sql",
      "lazyvim.plugins.extras.lang.typst",
      "lazyvim.plugins.extras.test.core",
      "lazyvim.plugins.extras.ui.edgy",
      "lazyvim.plugins.extras.util.chezmoi",
      "lazyvim.plugins.extras.util.gh",
      "lazyvim.plugins.extras.util.gitui",
      "lazyvim.plugins.extras.util.octo",
      "lazyvim.plugins.extras.util.rest"
    ],
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
          "<leader>gh"
        ],
        "inPageOnly": 260,
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
        "extras": [],
        "localId": "prefix/Space",
        "notation": "prefix Space",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/!",
        "notation": "prefix !",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/\"",
        "notation": "prefix \"",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/#",
        "notation": "prefix #",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/$",
        "notation": "prefix $",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/%",
        "notation": "prefix %",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/&",
        "notation": "prefix &",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/'",
        "notation": "prefix '",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/(",
        "notation": "prefix (",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/)",
        "notation": "prefix )",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/*",
        "notation": "prefix *",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/,",
        "notation": "prefix ,",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/-",
        "notation": "prefix -",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/.",
        "notation": "prefix .",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix//",
        "notation": "prefix /",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/0",
        "notation": "prefix 0",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/1",
        "notation": "prefix 1",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/2",
        "notation": "prefix 2",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/3",
        "notation": "prefix 3",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/4",
        "notation": "prefix 4",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/5",
        "notation": "prefix 5",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/6",
        "notation": "prefix 6",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/7",
        "notation": "prefix 7",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/8",
        "notation": "prefix 8",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/9",
        "notation": "prefix 9",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/:",
        "notation": "prefix :",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/;",
        "notation": "prefix ;",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/<",
        "notation": "prefix <",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/=",
        "notation": "prefix =",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/>",
        "notation": "prefix >",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/?",
        "notation": "prefix ?",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C",
        "notation": "prefix C",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/D",
        "notation": "prefix D",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/E",
        "notation": "prefix E",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/L",
        "notation": "prefix L",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M",
        "notation": "prefix M",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/[",
        "notation": "prefix [",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/]",
        "notation": "prefix ]",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/c",
        "notation": "prefix c",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/d",
        "notation": "prefix d",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/f",
        "notation": "prefix f",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/i",
        "notation": "prefix i",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/l",
        "notation": "prefix l",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/m",
        "notation": "prefix m",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/n",
        "notation": "prefix n",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/o",
        "notation": "prefix o",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/p",
        "notation": "prefix p",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/q",
        "notation": "prefix q",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/r",
        "notation": "prefix r",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/s",
        "notation": "prefix s",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/t",
        "notation": "prefix t",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/w",
        "notation": "prefix w",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/x",
        "notation": "prefix x",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/z",
        "notation": "prefix z",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/{",
        "notation": "prefix {",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/}",
        "notation": "prefix }",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/~",
        "notation": "prefix ~",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/Up",
        "notation": "prefix Up",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/Down",
        "notation": "prefix Down",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/Left",
        "notation": "prefix Left",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/Right",
        "notation": "prefix Right",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-1",
        "notation": "prefix M-1",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-2",
        "notation": "prefix M-2",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-3",
        "notation": "prefix M-3",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-4",
        "notation": "prefix M-4",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-5",
        "notation": "prefix M-5",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-6",
        "notation": "prefix M-6",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-7",
        "notation": "prefix M-7",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-n",
        "notation": "prefix M-n",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-o",
        "notation": "prefix M-o",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-p",
        "notation": "prefix M-p",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-Up",
        "notation": "prefix M-Up",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-Down",
        "notation": "prefix M-Down",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-Left",
        "notation": "prefix M-Left",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/M-Right",
        "notation": "prefix M-Right",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/prefix",
        "notation": "prefix prefix",
        "steps": [
          {
            "option": "prefix"
          },
          {
            "option": "prefix"
          }
        ]
      },
      {
        "category": "misc",
        "context": "prefix",
        "desc": "Rotate through the panes",
        "descKey": "packdesc_rotate_through_the_panes",
        "extras": [],
        "localId": "prefix/C-o",
        "notation": "prefix C-o",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C-z",
        "notation": "prefix C-z",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C-Up",
        "notation": "prefix C-Up",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C-Down",
        "notation": "prefix C-Down",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C-Left",
        "notation": "prefix C-Left",
        "steps": [
          {
            "option": "prefix"
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
        "extras": [],
        "localId": "prefix/C-Right",
        "notation": "prefix C-Right",
        "steps": [
          {
            "option": "prefix"
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
    "extras": [],
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
