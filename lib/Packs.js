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
