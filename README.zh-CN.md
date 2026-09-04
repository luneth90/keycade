# Keycade

[English](README.md) | **简体中文**

> 快捷键记忆训练机

![Keycade 简体中文学习界面](docs/screenshots/keycade-zh-CN.png)

![全部快捷键已掌握庆祝画面](docs/screenshots/keycade-mastery-zh-CN.png)

Keycade 是一个原生 Omarchy 快捷键训练器。它把快捷键编成简短的自适应回忆练习。
正确输入只在本地识别，不会派发或执行原快捷键动作。

它带六个**训练场**，在首页像街机选机台一样切换。每个训练场各有自己的牌组、
自己的进度、自己的掌握度：

| 训练场 | 快捷键从哪来 |
| --- | --- |
| **Hyprland** | 你这台机器上真正生效的快捷键，从运行中的合成器读取 |
| **herdr** | 通过 Omarchy 的只读清单读取本机真正生效的键位 |
| **tmux** | server 运行时读取真实 prefix 与带说明键位表；未运行时读取本地字面量 prefix，并配合内置键位表 |
| **VIM** | 依据 Neovim runtime help 校验的操作符、移动、文本对象及组合语法 |
| **NEOVIM** | 从干净 Neovim 实例采集的内置映射 |
| **LazyVim** | 官方发布的键位，并按 leader、extras 和顶格字面量改键校准 |

新装和升级后都停在 Hyprland；其他训练场想练的时候再选。

## 核心功能

- 训练当前 Hyprland 会话中的真实快捷键，而不是固定的通用题库。
- 也训练需要连打的应用级快捷键——`<leader>ff`、`gcc`、`C-b %`——卡片按步显示，
  打对一步亮一步。
- 使用 Exclusive 焦点与 Wayland Shortcuts Inhibitor 保护全屏练习输入，避免
  触发桌面动作。
- 将未学、到期、薄弱和已掌握快捷键组成一局连续的 24 张卡，不设置人为波次。
- 持续游玩可以覆盖全部未排除快捷键，并按间隔复习计划重新出现。
- 最近 2 次首次作答连续正确且正确记录跨至少 2 个不同对局后，快捷键进入掌握。
- 答错后持续显示正确答案，必须正确跟按，并在本局稍后再次复测。
- 本地保存学习进度、恢复中断对局、显示总掌握进度，并在首次达到 100% 时展示
  一次性恭喜结算。
- 可以排除键盘按不出、或者不想练的快捷键，随时一键恢复，进度不丢。
- 可配置的键——LazyVim 的 leader、tmux 的 prefix——直接从本机真实配置解析，
  不需要用户再维护一份手工选择；顶栏写明检测到的值以及它是从哪来的。
- 内置英语和简体中文、本地反馈/倒计时音效，以及五套配色：Catppuccin、
  Tokyo Night、Gruvbox、Everforest、Ristretto。
- 街机质感：点阵倒计时与计数、屏幕扫描线、跑马灯边框，以及只作展示、
  不参与调度的连击计数。开启「减少动效」后动效停止，但所有读数照常显示。

F 功能键、XF86 媒体/设备键、Print/Pause/SysRq、独立的 Home/End/Insert/Page/Delete、
有歧义、危险或无法可靠识别的绑定会被排除——紧凑配列键盘不保证有这些键。

## 系统要求

- Omarchy 4.x
- Quickshell 0.3.1，并包含
  `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland，且 `binds:disable_keybind_grabbing = false`
- Python 3

如果无法确认输入保护已经激活，Keycade 会拒绝开始练习，不会退化为不安全的
仅焦点保护模式。

## 键盘布局

Keycade 按**按下的物理键**判定，与 Hyprland 决定快捷键是否触发的方式一致：
一条绑定指的是「不按修饰键时产生该 keysym 的那个键」，与按住 Shift 后它打出
什么字符无关。这在非 US 布局上很关键——德语下 `SUPER + SHIFT + comma` 指的
是键帽上写着 `,` 的那个键，尽管按住 Shift 时它打出的是 `;`。

布局取自 Hyprland 自己的 `input:kb_*` 配置。如果一条绑定的按键在当前布局上
没有对应的物理键，它本来就按不出来，Keycade 不会拿它出题。

有两种配置会退回按字符比较，也就是旧版本一直以来的方式：通过
`input:kb_file` 指定的键盘映射文件，以及 `~/.xkb` 或 `~/.config/xkb` 下的自定义
布局。Keycade 不读取 Hyprland 输出以外的文件，因此选择退让而不是猜测。

## 安装

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

这是 Omarchy 的标准插件安装路径。然后向 `~/.config/hypr/bindings.lua`
添加快捷键，例如：

```bash
echo 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >> ~/.config/hypr/bindings.lua
```

## 更新

```bash
omarchy plugin update luneth90.keycade
omarchy restart shell
```

重启这一步必须做——只更新不重启，Keycade 不一定会刷新。

## 使用

- 按 `Super + Shift + K` 启动，或执行
  `omarchy-shell shell summon luneth90.keycade '{}'`。
- 按 Enter 开始或继续对局。
- 释放 Esc 保存当前对局并安全退出。这个操作只在单独按 Esc（不带任何修饰键）时触发；
  带修饰键的 Esc 组合（例如 `Super + Esc`）会被当作普通快捷键处理，
  不会跟系统里同样用到 Esc 的绑定（比如 Super + Esc 打开系统菜单）冲突，
  练习到这个组合时也能正常答题。
- 在首页选训练场——Hyprland、herdr、tmux、VIM、NEOVIM 或 LazyVim——再按回车。对局中不能换训练场：
  一副牌属于它是从哪个训练场发的，进度也是。
- 使用顶部菜单切换语言、声音、音量和配色。内置五套配色，选择会被记住。
- 遇到键盘按不出、或者干脆不想练的快捷键，点顶栏的 `✕ 排除此键`：它会永久离开
  训练题库，也不再计入掌握进度——键盘上没有的键不会再卡住一整局，也不会再挡住
  100% 通关。
- 点顶栏的「已排除」查看放到一边的快捷键，可随时放回。恢复后历史进度原样保留，
  排除不会让你已经学会的东西作废。列表有数量上限，并且最后一条快捷键不允许排除。

学习进度保存在 `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`，更新插件不会丢失。

## 卸载

卸载插件并保留学习进度：

```bash
omarchy plugin remove luneth90.keycade
```

学习进度仍保存在 `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`。Keycade
有意不提供在卸载时删除用户状态或修改 Hyprland 配置的脚本。

## 开发与测试

### 应用级训练场会从本机读什么

键位表是上游默认。Keycade 不再让用户为可配置的 leader / prefix 另维护一份人工选择，
而是从本机配置中形状固定、可静态证明的部分直接解析；只有无法确定时才回退到上游默认值。
这些键直接用在牌上。

LazyVim 读取器兼容常见的等价字面量写法：`vim.g` 的点号或下标赋值、写死参数的
`nvim_set_var` / `vim.cmd("let …")`，以及字面量 `vim.keycode` 包装。
`lua/config/keymaps.lua` 支持直接 `vim.keymap.set/del`、旧式全局 API、括号配平的多行调用、
字面量模式数组和 options table，以及允许列表内可静态确认的局部别名。动态值、块内调用、
未知 wrapper 与 `require` 链全部跳过并计数；不跑 Lua，也不起编辑器。

tmux 是唯一的实时查询：`has-session` 确认 server 已经存在后，先用 `show-options` 读取实际
生效的 `prefix` / `prefix2`，再用 `list-keys` 读取带说明键位。没有 server 时只静态解析
固定的 XDG 与 `~/.tmux.conf` 路径里的全局字面量 `set` / `set-option`，绑定仍用内置表。
tmux 两个前缀都会触发，所以两个都判对：实际启用的前缀里如果有官方默认 `C-b`，
卡面就显示 `C-b`，另一个作为备选答案；只设了别的前缀就完全按配置来。
prefix 读不出来时回退到官方默认 `C-b`，并在顶栏写明，不藏起来。

### 应用级词条包

LazyVim、tmux、VIM 与 NEOVIM 的回退词条包是**在维护者机器上采集、以可 review 的
JSON 提交进仓库**的静态数据。用户机器上不会运行词条包生成流程，运行时也不联网；
上一节所述的有界本机校准与这条构建流水线彼此独立。

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
采到的就是你的键位，而不是人人都有的默认键位。

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_hyprland_source_qml.sh
./tests/test_ground_switching_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml lib/sources/*.qml dev/InputProbe.qml
```

## 许可证

Keycade 使用 [MIT License](LICENSE) 发布。Copyright © 2026 luneth90。
