# Keycade

[English](README.md) | **简体中文**

> Shortcut Recall Arcade · 快捷键记忆训练机

![Keycade 简体中文学习界面](docs/screenshots/keycade-zh-CN.png)

Keycade = Key + Arcade。它是一个原生 Omarchy 覆盖层，把当前 Hyprland 会话中
真正生效的快捷键编成简短的自适应练习。0.2.10 对应 v0.5.10 持续掌握设计；
正确输入只在本地识别，不会派发或执行原快捷键动作。

本仓库实现了 [DESIGN.md](DESIGN.md) 中的 Stage 0 与 MVP：

- 通过带版本的 `hyprctl binds` JSON helper 读取逻辑键和物理键绑定；
- 严格排除危险、有歧义或无法可靠识别的绑定；
- 排除 F 功能键、XF86 媒体/设备键、Print/Pause/SysRq、独立的
  Home/End/Insert/Page 键以及没有标签的纯物理键；
- 自动分为窗口、工作区、系统、应用、媒体、截屏录制、效率工具、窗口组和暂存区；
- 使用到期、未学、薄弱和维护队列以及持久化覆盖游标，持续练习不会遗漏快捷键；
- 使用 Exclusive layer-shell 和 Wayland Shortcuts Inhibitor 双重保护输入；
- 每局固定 24 个计划卡位，引导、学习、维护和短间隔复测共享这些卡位；
- 单一连续自适应序列，不设置人为波次或波间暂停；
- HUD 同时显示本局进度、计划复习/新增、待巩固、准确率和全局待复习数量；
- 显示总掌握进度和当前正确反应时间，结算使用通俗的“反应”指标；
- 首次达到总掌握 100% 后，在完成本局时展示一次性里程碑结算；
- 不使用生命和分数：答错后答案会持续显示，正确跟按后再于 3–5 张后复测；
- 掌握要求最近 3 次无提示首次作答连续正确，并且正确记录跨至少 3 个对局；
- 提供正确、错误和 3/2/1 倒计时本地音效，可分别控制；
- `Esc` 会保存剩余牌组和纠错状态，下次可以继续原局或明确开始新局；
- 内置英语和简体中文，默认英语；已识别的 Omarchy 内置动作会本地化；
- 音量默认 60%，语言和音效下拉菜单支持鼠标操作；
- 设置与统计原子保存到 `$XDG_STATE_HOME/omarchy/keycade/`；
- 提供 Tokyo Night、Gruvbox 和 Catppuccin 街机配色；
- 提供独立的原生输入探针，用于真机兼容性验证。

## 系统要求

- Omarchy 4.x
- Quickshell 0.3.1，并包含
  `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland，且 `binds:disable_keybind_grabbing = false`
- Python 3，用于 `bin/keybinds-json`

Shortcuts Inhibitor 当前属于 Quickshell 私有 API。如果 Keycade 无法确认输入保护
已经激活，它会拒绝开始对局，不会退化为仅依靠 Exclusive 焦点的模式。

## 安装与启动

在本地仓库中运行带保护的安装器。它会验证 manifest、克隆到用户插件目录、
启用插件，并且只在 `Super + Ctrl + G` 没有冲突时添加快捷键：

```bash
./install.sh
```

如果不希望安装器修改 Hyprland 快捷键：

```bash
./install.sh --no-bind
```

卸载插件并只删除安装器创建的标记绑定块。默认保留学习进度：

```bash
./uninstall.sh
```

同时永久删除设置和学习进度：

```bash
./uninstall.sh --purge-state
```

脚本修改 `~/.config/hypr/bindings.lua` 前会自动备份，并使用 `hyprctl reload` 和
`hyprctl configerrors` 验证配置；不会修改 `/usr/share/omarchy` 下的文件。

也可以直接从公开仓库安装：

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

确认快捷键没有冲突后，在 `~/.config/hypr/bindings.lua` 中添加：

```lua
o.bind("SUPER + CTRL + G", "Keycade", "omarchy-shell shell summon luneth90.keycade '{}'")
```

验证 Hyprland 配置：

```bash
hyprctl reload
hyprctl configerrors
```

进入 Keycade 后按 Enter 开始，释放 Esc 安全退出。退出时会等待所有修饰键释放，
再关闭 inhibitor 并归还键盘焦点。声音菜单可以按 10% 调节音量，或分别关闭反馈音
和倒计时音效。首次达到全部快捷键 Mastered 时，会在当前 24 张完成后展示一次性
恭喜结算。有效训练时间从 0.2.7 开始累计，旧版本时长无法可靠还原。

## 原生 Stage 0 输入探针

在依赖正式覆盖层前，建议在 Hyprland 会话中运行：

```bash
quickshell -p dev/InputProbe.qml
```

请验证 10–20 个真实快捷键，包括字母、数字、标点、Shift、`code:` 绑定以及你使用
的键盘布局。探针会显示 Qt 逻辑键、文本、原生扫描码、修饰键、焦点和 inhibitor
状态。还应确认一个无破坏性的 Hyprland 绑定在探针外能执行、探针内只被识别而不
执行，并在退出后立即恢复。

Keycade 不支持标记为 `dont_inhibit` 的绑定、compositor 保留操作、固件键，以及
`binds:disable_keybind_grabbing = true` 的配置。

## 开发与测试

```bash
python3 -m unittest discover -s tests -v
env -u WAYLAND_DISPLAY -u DISPLAY QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= \
  QT_QUICK_BACKEND=software /usr/lib/qt6/bin/qmltestrunner -input tests/qml
./tests/test_installers.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

`prototype/` 下保留网页视觉原型，用于评审界面和动效，不能验证 Wayland 键盘隔离。

## 许可证

Keycade 使用 [MIT License](LICENSE) 发布。Copyright © 2026 luneth90。
