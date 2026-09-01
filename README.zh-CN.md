# Keycade

[English](README.md) | **简体中文**

> 快捷键记忆训练机

![Keycade 简体中文学习界面](docs/screenshots/keycade-zh-CN.png)

Keycade 是一个面向 Hyprland 的原生 Omarchy 快捷键训练器。它读取当前电脑上
真正生效的快捷键，并将它们编成简短的自适应回忆练习。正确输入只在本地识别，
不会派发或执行原快捷键动作。

## 核心功能

- 训练当前 Hyprland 会话中的真实快捷键，而不是固定的通用题库。
- 使用 Exclusive 焦点与 Wayland Shortcuts Inhibitor 保护全屏练习输入，避免
  触发桌面动作。
- 将未学、到期、薄弱和已掌握快捷键组成一局连续的 24 张卡，不设置人为波次。
- 持续游玩可以覆盖全部未排除快捷键，并按间隔复习计划重新出现。
- 最近 3 次首次作答连续正确且正确记录跨至少 3 个不同对局后，快捷键进入掌握。
- 答错后持续显示正确答案，必须正确跟按，并在本局稍后再次复测。
- 本地保存学习进度、恢复中断对局、显示总掌握进度，并在首次达到 100% 时展示
  一次性恭喜结算。
- 内置英语和简体中文、本地反馈/倒计时音效，以及 Tokyo Night、Gruvbox、
  Catppuccin 三套配色。

F 功能键、XF86 媒体/设备键、Print/Pause/SysRq、独立的 Home/End/Insert/Page、
有歧义、危险或无法可靠识别的绑定会被排除。

## 系统要求

- Omarchy 4.x
- Quickshell 0.3.1，并包含
  `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland，且 `binds:disable_keybind_grabbing = false`
- Python 3

如果无法确认输入保护已经激活，Keycade 会拒绝开始练习，不会退化为不安全的
仅焦点保护模式。

## 安装

```bash
git clone https://github.com/luneth90/keycade.git
cd keycade
./install.sh
```

安装器会验证并启用插件，并且只在没有冲突时添加 `Super + Shift + K`。如果不希望
修改 Hyprland 快捷键：

```bash
./install.sh --no-bind
```

也可以不使用安装脚本，直接安装插件：

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

然后自行添加一个没有冲突的快捷键。`o.bind(...)` 是 Hyprland Lua 配置里的函数，
不是终端命令，不能直接在 shell 里敲。加之前最好先用 `hyprctl -j binds` 或
`omarchy menu keybindings --print` 确认这个组合键没被占用（`install.sh` 会
自动帮你查，但手动 `o.bind` 只会在已有绑定上再叠加一条，不会提醒你冲突），
然后一条命令追加进 `~/.config/hypr/bindings.lua`：

```bash
echo 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >> ~/.config/hypr/bindings.lua
```

Hyprland 默认会在保存配置文件时自动重新加载，写入即生效；如果你关掉了这个
默认设置，就要自己执行一次 `hyprctl reload`。

## 使用

- 按 `Super + Shift + K` 启动，或执行
  `omarchy-shell shell summon luneth90.keycade '{}'`。
- 按 Enter 开始或继续对局。
- 释放 Esc 保存当前对局并安全退出。这个操作只在单独按 Esc（不带任何修饰键）时触发；
  带修饰键的 Esc 组合（例如 `Super + Esc`）会被当作普通快捷键处理，
  不会跟系统里同样用到 Esc 的绑定（比如 Super + Esc 打开系统菜单）冲突，
  练习到这个组合时也能正常答题。
- 使用顶部菜单切换语言、声音、音量和配色。

学习进度保存在 `$XDG_STATE_HOME/omarchy/keycade/`，更新插件不会丢失。

## 卸载

保留学习进度：

```bash
./uninstall.sh
```

同时删除全部本地设置和学习进度：

```bash
./uninstall.sh --purge-state
```

## 开发与测试

```bash
python3 -m unittest discover -s tests -v
env -u WAYLAND_DISPLAY -u DISPLAY QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= \
  QT_QUICK_BACKEND=software /usr/lib/qt6/bin/qmltestrunner -input tests/qml
./tests/test_installers.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

## 许可证

Keycade 使用 [MIT License](LICENSE) 发布。Copyright © 2026 luneth90。
