# Keycade

[English](README.md) | **简体中文**

> 一台快捷键记忆街机——练 Omarchy、herdr、tmux、Vim、Neovim 和 LazyVim

![Keycade 简体中文学习界面](docs/screenshots/keycade-zh-CN.png)

![首页上每个机台各自的进度](docs/screenshots/keycade-grounds-zh-CN.png)

![LazyVim 的 leader 连打](docs/screenshots/keycade-lazyvim-zh-CN.png)

Keycade 是 Omarchy 的原生覆盖层，把快捷键编成一局局简短的记忆练习。
按键只在本地判定，不会触发它原本的动作。

六个训练场，在首页像街机选机台一样切换。每个各有自己的牌组、进度和掌握度，
一排看下来就是全部：

| 训练场 | 快捷键从哪来 |
| --- | --- |
| **Hyprland** | 这台机器上真正生效的快捷键，从运行中的合成器读取 |
| **herdr** | 这台机器上真正生效的键位，来自 Omarchy 的只读清单 |
| **tmux** | server 在跑就读它真正生效的前缀和键位表，否则读本地配置里的前缀，配内置表 |
| **VIM** | 操作符、移动、文本对象和它们的组合，每条都对着 Neovim 的 help 核过 |
| **NEOVIM** | 从干净 Neovim 实例采集的内置键位 |
| **LazyVim** | 官方发布的键位，按你的 leader、extras 和顶格改键校准 |

新装和升级后都停在 Hyprland，其他随时可以切过去。

## 核心功能

- 前三个训练场直接读这台机器，不是发一套通用题库；后三个用上游发布的表。
- 连打和组合键一样判——`<leader>ff`、`gcc`、`C-b %`——卡片按步显示，打对一步亮一步。
- 练习时按键只有 Keycade 收得到，不会触发桌面上的任何动作。
- 一局 24 张，把没学过的、到期的、生疏的和已掌握的混在一起。持续练能覆盖全部，
  并按间隔复习重新出现。
- 连续两次一遍打对、且跨了两局，才算掌握。
- 答错后答案留在屏幕上，要跟着按一遍，本局稍后还会再考。
- 进度存在本地，中断的对局能续上；全部掌握时有一次庆祝。
- 按不出或不想练的快捷键可以排除，随时放回，进度不丢。
- leader 和 prefix 从你自己的配置里读出来，不用再手工设一遍。
- 中英双语、本地音效，五套配色：Catppuccin、Tokyo Night、Gruvbox、Everforest、Ristretto。
- 街机质感：点阵数字、扫描线、跑马灯边框。开「减少动效」只停动画，读数照旧。

紧凑配列键盘不保证有的键会被排除：F 功能键、媒体键、Print/Pause/SysRq、
独立的 Home/End/Insert/Page/Delete，以及有歧义或认不准的绑定。
答案是单独一个 Esc 的也排除——松开 Esc 就存盘退出，这张卡永远清不掉。
带修饰键的 Esc 是另一回事，照常出题。

## 系统要求

- Omarchy 4.x
- Quickshell 0.3.1，含 `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland，且 `binds:disable_keybind_grabbing = false`
- Python 3

确认不了输入保护已经生效时，Keycade 拒绝开始，不会退到只靠焦点的不安全模式。

## 键盘布局

Keycade 按**按下的物理键**判定，和 Hyprland 决定绑定是否触发的方式一致：
一条绑定指的是「不按修饰键时产生那个 keysym 的键」，跟按住 Shift 后它打出什么无关。
这在非 US 布局上很关键——德语下 `SUPER + SHIFT + comma` 指的是键帽上写着 `,` 的那个键，
虽然按住 Shift 它打出的是 `;`。

布局取自 Hyprland 自己的 `input:kb_*`。当前布局上根本按不出来的绑定不会出题。
两种情况会退回按字符比较：`input:kb_file` 指定的键盘映射，以及 `~/.xkb`、
`~/.config/xkb` 下的自定义布局——Hyprland 输出以外的文件 Keycade 不读，宁可退让也不猜。

## 安装

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

然后往 `~/.config/hypr/bindings.lua` 加一个快捷键，例如：

```bash
echo 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >> ~/.config/hypr/bindings.lua
```

## 更新

```bash
omarchy plugin update luneth90.keycade
omarchy restart shell
```

重启这一步必须做：只更新不重启，Keycade 不一定会刷新。

## 使用

- 按 `Super + Shift + K` 启动，或执行
  `omarchy-shell shell summon luneth90.keycade '{}'`。
- 在首页选机台，按回车开始或继续。每个机台都显示自己的进度，从没开过的显示「—」。
- 想换个机台，按「← 返回」：本局照常存好，切回来从断点继续。
- 顶栏切换语言、声音、音量和配色，选择会记住。
- 按不出或不想练的快捷键，点顶栏 `✕ 排除此键`，它就不再出题也不计入掌握。
  点「已排除」可以随时放回，历史进度原样保留。列表有上限，最后一条不允许排除。
- 松开 Esc 存盘退出。只有单独按 Esc 才触发；`Super + Esc` 这类组合按普通快捷键处理，
  所以练到它的时候也能正常作答。

进度存在 `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`，更新插件不会丢。

## 卸载

```bash
omarchy plugin remove luneth90.keycade
```

进度仍在 `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`。Keycade 有意不提供
在卸载时删除用户数据或修改 Hyprland 配置的脚本。

## 开发与测试

### 从本机读什么

键位表用上游默认，本机配置只用来校准 leader 和 prefix：读固定路径下形状固定、
能静态确认的写法，读不准就跳过并计数，回退到上游默认。不跑 Lua，不起编辑器，
不跟 `require` 链。

tmux 是唯一的实时查询：`has-session` 确认 server 已经在跑之后，用 `show-options`
读实际生效的 `prefix` / `prefix2`，再用 `list-keys` 读键位。没有 server 就只静态解析
`~/.config/tmux/tmux.conf` 和 `~/.tmux.conf` 里的全局 `set`，键位仍用内置表。
两个前缀都会触发，所以都判对；其中如果有官方默认 `C-b`，卡面显示它。

### 词条包

LazyVim、tmux、VIM、NEOVIM 的内置表是在维护者机器上采集、以可 review 的 JSON
提交进仓库的静态数据。用户机器上不跑采集，运行时也不联网。

上游发新版时重新采集，然后看 JSON 的 git diff 对账：

```bash
git clone https://github.com/LazyVim/LazyVim.github.io ../LazyVim.github.io
git clone https://github.com/LazyVim/LazyVim ../LazyVim && git -C ../LazyVim checkout v16.0.0
python3 tools/build_packs.py --collect lazyvim --site ../LazyVim.github.io --lazyvim ../LazyVim

printf '# tmux %s\n' "$(tmux -V | awk '{print $2}')" > /tmp/tmux-keys.txt
tmux -L keycade-build -f /dev/null list-keys -N -T prefix >> /tmp/tmux-keys.txt
tmux -L keycade-build kill-server
python3 tools/build_packs.py --collect tmux --listing /tmp/tmux-keys.txt

python3 tools/build_packs.py --collect vim --runtime /usr/share/nvim/runtime \
  --runtime-version 'NVIM v0.12.5'
```

`-f /dev/null` 不能省：不加它 tmux 会拉起 server 并 source 你自己的 `tmux.conf`，
采到的就成了你的键位，而不是人人都有的默认键位。

### 测试与截图

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_hyprland_source_qml.sh
./tests/test_ground_switching_qml.sh
./tests/test_run_counters_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml lib/sources/*.qml dev/InputProbe.qml
./tools/shoot-screenshots
```

## 许可证

Keycade 使用 [MIT License](LICENSE) 发布。Copyright © 2026 luneth90。
