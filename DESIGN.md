# Keycade — Omarchy 快捷键街机

> Keycade = Key + Arcade。它不是 Keycard：名字直接表达“把快捷键练习做成街机游戏”。

一个 Omarchy shell 插件：读取玩家当前 Hyprland 会话里真正生效的快捷键，
把教学提示、自主回忆和速度挑战编进同一个连续街机回合，让玩家边玩边把
“知道快捷键”变成肌肉记忆。

状态：设计草案 v0.4　·　单一自适应对局原型已完成　·　原生 Stage 0 尚未实现

---

## 1. 目标与非目标

**目标**

- 练的是玩家电脑上**真正生效且适合练习**的快捷键，不是一份写死的题库。
- 新玩家无需选择训练模式；新键位在正常对局里获得提示，并自然过渡到回忆。
- 一轮 30–60 秒，一个完整对局控制在 60–90 秒，随时可以退出。
- 正确率优先、反应速度其次；游戏化反馈服务于学习，不鼓励乱猜。
- 每天愿意再打开一次：弱项复习、每日挑战、连续打卡（streak）和徽章。
- 作为标准 Omarchy 第三方插件分发：`omarchy plugin add <git-url>`。

**非目标（先不做）**

- 不做多人对战、联网排行榜或云同步。
- 不模拟一个假桌面；Keycade 的差异化是“长在真实会话里”，但对局
  中仍然只识别按键，不执行危险动作。
- 不采集全局键盘输入，不做通用键盘记录器。
- MVP 不做 bar widget、通知、徽章、音效和复杂主题动画。

---

## 2. 核心体验

### 2.1 单一自适应对局

Keycade 只有一个核心入口：**开始对局**。学习不是独立页面或前置课程，而是
每张卡的自适应提示规则。玩家看到的始终是一局连续的街机游戏，系统在后台根据
每个键位的历史表现选择卡片呈现方式：

| 卡片呈现 | 画面和规则 | 何时使用 | 命中后的变化 |
|---|---|---|---|
| **引导卡** | 动作名 + 完整键位；不计时；按错不扣命并原地重试 | 新键位或连续失误的弱项 | 立即加入正常牌组，下次优先变为回忆卡 |
| **回忆卡** | 只显示动作名；3.5 秒能量槽；错误后揭晓答案并扣命 | 已成功跟按、但尚未稳定的键位 | 提高熟练度，逐步缩短时间 |
| **加速卡** | 只显示动作名；约 1.4–2.4 秒；分值稍高 | 正确率和反应时间稳定的键位 | 维持熟练度与 combo |

这些是调度器内部的**卡片呈现状态**，不是三个由玩家选择的模式。牌组可以同时
包含引导卡、回忆卡和加速卡；卡片外观用“新快捷键”“无提示”“加速卡”作即时
说明，但不要求玩家先理解一套课程结构。用户可在结算页把某个键位标为“需要
提示”，下一局它就以引导卡回到牌组。

### 2.2 单局流程

1. 玩家通过自定义快捷键、bar 按钮或通知唤出 Keycade。
2. 覆盖层进入 Overlay layer，以 `WlrLayershell.keyboardFocus: Exclusive`
   获得客户端侧独占焦点，同时为自身 Wayland surface 启用
   `ShortcutInhibitor`，暂停普通 Hyprland 全局快捷键。
3. 插件先进入 **Ready** 状态；只有以下条件全部满足才允许开始：
   - `ShortcutInhibitor.active === true`；
   - 覆盖层已经获得键盘焦点；
   - 唤出快捷键的所有修饰键均已释放。
   条件满足后再倒数 500ms。Ready 期间的按键不计为失误，也不计入反应时间。
4. inhibitor 在 1.5 秒内没有激活，或检测到 Hyprland 禁止应用抓取快捷键时，
   停在错误页并退出对局；绝不在未保护状态下降级继续。
5. 调度器生成 24 张混合牌组，分为 3 波，每波 8 张；新键、弱项和熟练键可以
   出现在同一波，波次之间暂停 2 秒并展示准确率和 combo。
6. 玩家按出卡片对应组合键：
   - **引导卡按对**：获得较低基础分，保留 combo，立即继续；该键位在后续抽到时
     转为回忆卡。
   - **引导卡按错**：显示收到的按键，不扣生命，700ms 后在原卡重试。
   - **回忆/加速卡按对**：基础分 100，加有限的速度和 combo 奖励，立即继续。
   - **回忆/加速卡按错或超时**：揭晓正确键位 700ms，combo 清零，生命值 `-1`。
   - 生命归零或完成 24 张卡后结算；`Esc` 随时安全退出，不计为失败。
7. 结算页按重要性展示：准确率、最佳 combo、P75 反应时间、建议复习的
   3 个键位。得分只作为趣味反馈，不用于解锁新内容。

推荐计分公式：

```text
每次正确 = 100 + speedBonus(0..50) + comboBonus(0..50)
错误/超时 = 0
```

combo 只影响得分和反馈，不直接缩短倒计时。每张卡的时间预算由该键位的
历史熟练度决定，并限制在 1.4–3.5 秒之间，避免“越错越快”的失控难度曲线。

### 2.3 输入隔离与安全性：双重保护

对局中按下目标键位只触发识别成功，**不会由 Keycade 派发
原动作**。但仅设置 layer-shell 的 Exclusive 焦点还不够：Hyprland 会先处理
全局 keybind，再把未消费的事件发给获得焦点的 Wayland 客户端。

```text
键盘 → Hyprland keybind resolver → focused Wayland surface → Keycade Keys.onPressed
```

因此 MVP 必须同时使用两种机制：

| 机制 | 责任 | 单独缺失的后果 |
|---|---|---|
| `WlrKeyboardFocus.Exclusive` | 让 Keycade 获得独占客户端焦点，隔离底层应用 | 底层窗口可能收到按键 |
| `zwp_keyboard_shortcuts_inhibit_v1` | 请求 Hyprland 暂停当前 surface 上的普通全局快捷键 | 切工作区、关闭窗口等绑定可能先于 Keycade 执行 |

本机 Quickshell 0.3.1 暴露
`Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`。MVP 可按以下结构接入：

```qml
import Quickshell.Wayland._ShortcutsInhibitor

PanelWindow {
    id: root

    WlrLayershell.layer: WlrLayer.Overlay
    WlrLayershell.keyboardFocus: root.opened
        ? WlrKeyboardFocus.Exclusive
        : WlrKeyboardFocus.None

    ShortcutInhibitor {
        id: shortcutInhibitor
        window: root
        enabled: root.opened
    }
}
```

下划线模块属于 Quickshell 私有 API：实现时记录并测试支持的 Omarchy/Quickshell
版本；模块不存在时插件应在安装/兼容性检查中明确拒绝加载，不能静默退回
“只有 Exclusive”。若上游提供公开 API，优先迁移到公开类型。

**生命周期规则**

- `InputGuard.qml` 使用显式状态机：

  ```text
  Closed → Acquiring → Ready → Playing → Closing → Closed
                  ↘ Blocked ────────────────────────↗
  ```

  `Acquiring` 只申请焦点和 inhibitor，不接收训练输入；`Ready` 等待修饰键释放；
  `Blocked` 立即停止计时、把 keyboardFocus 恢复为 None，再展示非交互错误信息。
- inhibitor 仅在交互式 overlay 打开期间启用；首页、对局和结算页都属于
  受保护状态。
- `active` 变为 true 之前不生成任务卡、不启动计时器，也不记录按键。
- 唤出用的第一次快捷键已经在 inhibitor 创建前执行，这是预期行为；进入后同一
  快捷键会被抑制，因此使用本地 `Esc` 或画面按钮退出。
- 正常退出在 `Esc` release 后执行；若还有修饰键按下，则进入 Closing 并等待
  全部释放，再禁用 inhibitor、把 keyboardFocus 设为 None、隐藏窗口。
- overlay 或 `omarchy-shell` 崩溃时，Wayland 连接销毁 inhibitor 资源，Hyprland
  应自动恢复普通快捷键；该恢复路径必须做真机测试。

**不承诺拦截的输入**

- Hyprland 标记为 `dont_inhibit` 的绑定；
- VT 切换等 compositor 内部保底操作；
- 固件键、硬件宏或绕过普通 Hyprland keybind resolver 的输入；
- 用户设置 `binds:disable_keybind_grabbing = true` 时的普通全局绑定。

helper 必须读取 `dont_inhibit` 标志并从题库排除对应绑定。打开 overlay 时通过
`hyprctl getoption binds:disable_keybind_grabbing` 做 preflight；若禁止抓取，展示
解释和修复指引后退出，不自动修改用户的 Hyprland 配置。

插件只监听自身 `Keys.onPressed/Released`，忽略自动重复事件；按键正确只更新
本地游戏状态，绝不调用目标 binding 的 dispatcher。

### 2.4 按键判定与规范化

判定不能只比较展示字符串。内部使用规范化结构：

```jsonc
{
  "modMask": 64,
  "logicalKey": "3",
  "physicalCode": 12,
  "matchMode": "logical", // logical | physical
  "flags": [],
  "display": "SUPER + 3"
}
```

- 普通符号绑定按 `logicalKey + modMask` 比较。
- `code:` 绑定按 `physicalCode + modMask` 比较。
- Caps Lock/Num Lock 等锁定状态不参与修饰键比较。
- Shift 产生的符号、XKB 别名和 Qt key 名在同一张映射表中规范化。
- 同一 chord 对应多条动作时只能作为一个可识别输入，MVP 排除该歧义项。

### 2.5 Stage 0：原生输入与隔离探针

在做正式 QML 游戏 UI 之前，先写一个最小 `InputProbe.qml`，同时验证键码匹配
和系统快捷键隔离：

- 展示 `event.key`、`event.text`、`event.nativeScanCode`、`event.modifiers`；
- 同屏展示解析器给出的目标 chord 和规范化结果；
- 用当前用户的 10–20 个真实键位逐个验证；
- 至少覆盖字母、数字、标点、Shift 组合、`code:` 绑定和两种键盘布局；
- 显示 Exclusive focus、`ShortcutInhibitor.enabled/active` 和当前修饰键状态；
- 用一个无破坏性的测试 binding 验证：游戏外能执行，游戏内不执行但 Keycade
  能收到同一 chord，退出后立即恢复；
- 验证按快捷键唤出后，修饰键释放不会造成第一题误判；
- 验证正常退出、强制结束 shell、inhibitor 激活失败和
  `binds:disable_keybind_grabbing = true` 四条恢复/失败路径。

只有输入探针通过后才进入 MVP。网页原型仍可用于调动画、间隔和计时参数，
但不能替代 Wayland/Qt 输入链验证。

### 2.6 可训练题库

“存在于 `hyprctl binds`”不等于“适合出题”。MVP 只收录满足以下条件的项：

- 键盘绑定，且有一个可识别的非修饰主键；
- 仅使用 Ctrl/Shift/Super/Alt 和 MVP 已验证的普通按键；
- 排除 F1–F35、XF86 音量/亮度/媒体/设备键、Print/Pause/SysRq，以及
  Home/End/Insert/PageUp/PageDown 等依赖机型、Fn 层或顶栏模式的特殊键；
  同时排除没有可读键名的纯物理绑定；
- 是按下触发的常规绑定；排除 release、long-press、switch、mouse、滚轮和
  仅在特殊设备上存在的事件；
- 有非空 description，或能由一小组可信 dispatcher 规则生成清晰动作名；
- chord 唯一，不与另一个不同动作共享同一输入；
- 不是 `dont_inhibit`，且已经在目标 Hyprland/Quickshell 组合上验证可被
  Shortcuts Inhibitor 抑制。

无法可靠识别或分类的项进入 `Uncategorized`，默认不出题。v1 提供题库管理页，
让用户启用、停用、改名或手动分类；自动分类永远不覆盖用户选择。

### 2.7 快捷键分类

所有可训练类别默认开放，不以窗口或导航熟练度锁住其他内容。分类来自当前会话
实际生效的绑定及其说明，分为：窗口、工作区、系统、应用、媒体、截屏录制、
效率工具、窗口组和暂存区。无法可靠判断的绑定进入 `Uncategorized`，默认不出题。

首页展示各类别可训练数量，卡片显示当前类别。调度器在每波中优先轮换不同类别，
当类别数量超过单波卡片数时逐波轮换起点；同一类别内部仍按弱项、反应速度和
久未复习程度加权。这样既保持自适应训练，也避免数量较多的窗口/工作区绑定
垄断整局。

### 2.8 自适应抽题

每个键位维护最近尝试窗口、累计命中、最近练习时间和提示等级。抽取权重由以下
因素组成：

- 错误率越高，权重越高；
- P75 反应时间相对目标越慢，权重越高；
- 新学键位有适度 novelty bonus；
- 长期未复习的键位有 stale bonus；
- 已熟练键仍保留低概率出现，防止遗忘。

权重设上限，单个键位在每 8 张卡中最多出现 2 次，且不连续重复。这样能盯住
弱项，又不会让一个失败键位垄断整局。结算页的“建议复习 3 项”按错误优先、
速度其次生成，不再简单等同于“最慢 3 项”。

---

## 3. 每日挑战与打卡（v1）

- 每天按本地时区首次进入时生成 10 个固定题目，题目来自至少成功命中过一次的
  键位，并使用 §2.8 的权重快照；每日挑战不加入从未见过的新键。
- 同一天重试使用相同题目集合，但每次重排顺序，避免记住固定序列而不是快捷键。
- 完成全部题目且准确率达到 80% 即完成今日挑战；允许当天无限重试。
- 每个本地日期最多增加一次 streak。漏过一个完整本地日期后 streak 清零；
  MVP/v1 不做补签卡，避免先引入额外状态规则。
- 徽章使用与解锁相同的滚动指标，例如：
  - 🧭 Navigator — L1 全部键位达到 Mastered
  - 🪟 Window Ninja — L2 对局零失误
  - 🚀 Launch Master — 解锁 L3
  - 🔥 7-Day / 30-Day Streak
- Bar widget 只展示 streak、今日状态和入口；点击后 summon overlay，不在 bar
  组件中运行游戏逻辑或写战绩。
- 提醒默认关闭。用户启用后，service 在指定本地时间调用
  `omarchy-notification-send --exec ...`；若 shell 在提醒时间之后才启动，当天尚未
  完成且尚未提醒，则补发一次。每个日期最多提醒一次。

---

## 4. 插件架构

### 4.1 分阶段 manifest

MVP 只声明已经实现的 overlay，不提前声明不存在的 bar widget：

```json
{
  "schemaVersion": 1,
  "id": "<username>.keycade",
  "name": "Keycade",
  "version": "0.1.0",
  "author": "<username>",
  "description": "A native shortcut-learning arcade for Omarchy and Hyprland.",
  "kinds": ["overlay"],
  "keepLoaded": true,
  "entryPoints": {
    "overlay": "Keycade.qml"
  }
}
```

v1 加入共享后台服务和 bar widget：

```jsonc
{
  "schemaVersion": 1,
  "id": "<username>.keycade",
  "name": "Keycade",
  "version": "1.0.0",
  "author": "<username>",
  "description": "A native shortcut-learning arcade for Omarchy and Hyprland.",
  "kinds": ["service", "overlay", "bar-widget"],
  "keepLoaded": true,
  "entryPoints": {
    "service": "Service.qml",
    "overlay": "Keycade.qml",
    "barWidget": "BarWidget.qml"
  },
  "barWidget": {
    "displayName": "Keycade",
    "description": "Daily shortcut challenge and streak",
    "category": "Productivity",
    "allowMultiple": false,
    "defaultSection": "right"
  }
}
```

全局游戏设置不放进 `barWidget.schema`：这类设置只注入 bar 实例，不能作为
overlay/service 的可靠配置源。Keycade 设置页直接编辑共享 `settings.json`。

### 4.2 唤出方式

- MVP 首次安装后通过命令启动；v1 也可以从 bar 进入设置页并查看候选快捷键。
- 插件读取当前绑定并标记冲突，不声称某个固定 chord 一定空闲。
- 文档可用 `Super + G` 作为示例：

```ini
bind = SUPER, G, exec, omarchy-shell shell summon <id>.keycade '{}'
```

- 通知点击使用相同 summon 命令，并传 `{"mode":"daily"}`。
- overlay 的 `open(payload)` 负责切换首页、普通练习或每日挑战。

### 4.3 键位提取：有版本的 helper

MVP 在插件内提供 `bin/keybinds-json`。它 vendor/adapt
`omarchy-menu-keybindings` 已验证过的 `hyprctl binds`、Lua binding 和 XKB
解析逻辑，但拥有独立、明确的机器接口，不依赖交互菜单输出。

输出格式：

```jsonc
{
  "schemaVersion": 1,
  "keymapFingerprint": "...",
  "bindings": [
    {
      "modMask": 64,
      "key": "3",
      "keycode": 12,
      "matchMode": "logical",
      "flags": [],
      "dontInhibit": false,
      "dispatcher": "workspace",
      "arg": "3",
      "description": "Switch to workspace 3"
    }
  ]
}
```

- helper 使用 `Quickshell.Io.Process` 调用，在首次打开、键位/键盘布局变化或缓存
  失效时刷新；不要求每张卡 fork 子进程。
- 缓存 key 包含 `hyprctl binds` 和 active keymap 的指纹。
- `tests/fixtures/` 保存普通 Hyprland、Lua bind、`code:`、逗号参数、空描述等
  样例，防止上游格式变化静默破坏题库。
- 暂不做 QML 原生解析重写；只有 helper 的真实启动延迟成为问题时再评估。

### 4.4 共享状态和单一写入者

路径：

```text
$XDG_STATE_HOME/omarchy/keycade/          # 默认 ~/.local/state/omarchy/keycade/
├── settings.json      # 全局玩法、提醒、启用题库；由设置页写
├── stats.json         # 每个稳定 chord id 的最近窗口和累计统计
├── progress.json      # 层级、Mastered 状态、徽章
├── streak.json        # current、longest、lastCompletedDate
├── summary.json       # 给 bar 只读的轻量快照
└── daily/
    └── 2026-08-31.json
```

- 所有文件带 `schemaVersion`，用 `FileView.atomicWrites: true` 或临时文件 + rename
  原子写入；解析失败时保留坏文件并回退默认值，不直接覆盖用户数据。
- MVP 只有 overlay，是 stats/progress 的唯一写入者。
- v1 由 `Service.qml` 持有调度和持久化，overlay 调用 service；BarWidget 只观察
  `summary.json` 并发起 summon，避免多个组件同时写同一文件。
- v1 安装时把插件保留在顶层 `plugins[]` 中，bar 布局项只是可选入口；移除 bar
  widget 不应禁用 service，否则每日提醒和状态维护会随 bar 一起停止。
- `settings.json` 是全局配置唯一真源；bar 是否显示不影响提醒和玩法设置。
- chord id 基于规范化输入和动作生成。检测到用户改绑时保留旧历史，但把旧项
  标为 inactive，不把不同键位的反应数据混在一起。

### 4.5 文件结构

```text
keycade/
├── manifest.json
├── Keycade.qml
├── Service.qml                  # v1
├── BarWidget.qml                # v1
├── bin/
│   └── keybinds-json
├── lib/
│   ├── KeybindSource.qml
│   ├── InputGuard.qml             # Exclusive + ShortcutInhibitor 状态机
│   ├── InputNormalizer.js
│   ├── Eligibility.js
│   ├── Categorizer.js
│   ├── Scheduler.js
│   ├── Stats.js
│   └── StateStore.qml
├── dev/
│   └── InputProbe.qml           # Stage 0，发布包可不包含
├── assets/
│   ├── categories.json
│   ├── locales/                  # en、zh-CN、ja、es 文案
│   └── sfx/                     # v2
├── tests/
│   └── fixtures/
└── README.md
```

---

## 5. 视觉、反馈与可访问性

艺术方向定为 **16-bit Desktop Arcade**：让 Keycade 明显像嵌入 Omarchy
桌面的一台小型街机，而不是普通科技 HUD 或 RGB 网页。

- 使用 4px/8px 视觉网格、阶梯像素角、硬边框和无模糊硬阴影；避免毛玻璃、
  大面积柔光、连续渐变和过多细线。
- 像素语言用于机台、HUD、数字、键帽、图标、能量槽和反馈碎片；动作名、
  教学说明和错误信息使用当前语言对应的易读系统字体，不强行像素化。
- 每个 Omarchy 主题映射为 5–7 个核心颜色，保持相同像素结构：Tokyo Night
  使用蓝/紫/暖黄，Gruvbox 使用黄/橙/红，Catppuccin 使用蓝/紫/粉。
- 任务卡以动作名为第一视觉层级；引导卡和错误反馈时显示三层像素斜面键帽。
- 倒计时使用分段能量槽，不使用平滑圆环；生命值使用像素心形，combo/score
  使用大号等宽显示字体。
- 命中采用 50ms 左右 hit-stop、8 方向方块碎片和短促色板闪烁；失误采用
  2–8px 阶梯抖动。重要反馈不能只依赖红绿颜色。
- 命中反馈总时长控制在 150–320ms，错误提示约 700ms；“减少动态效果”模式
  去掉碎片、闪屏和抖动，只保留边框/文字状态变化。
- 音效默认可关、v2 再加入；任何重要反馈都不能只依赖声音。
- 结算页保持轻松语气，但不嘲讽障碍或失败；吐槽文案允许整体关闭。
- `prototype/` 下的零依赖网页原型只用于评审页面、主题和动效，不用于验证系统
  快捷键捕获；浏览器被 Hyprland 抢走快捷键属于预期限制。

### 5.1 多语言策略

- 初次启动默认英文（`en`），首批内置简体中文（`zh-CN`）、日文（`ja`）和
  西班牙文（`es`）；用户选择写入 `settings.json`，缺失或无效语言回退英文。
- 所有界面文字、动态反馈、动作通用名和无障碍标签使用稳定文案 key，语言包必须
  与英文基准表键集合一致；品牌名、实际键帽字符和主题专名不翻译。
- 已知 dispatcher/arg 映射为可翻译的动作 key；用户自定义 description 保持原文，
  不做容易产生误义的自动翻译。未知动作使用原始 description 或 dispatcher 回退。
- 排版不能依赖英文固定宽度；中文和日文采用对应 CJK 字体，拉丁语言允许按钮
  换行。发布前用最长文案和 200% 缩放检查顶部控件、任务卡及错误状态。
- 网页原型的 `i18n.js` 用来验证切换和版式；正式 QML 版本把语言包拆到
  `assets/locales/`，语言切换不重开对局，也不重置计分、计时和当前题目。

---

## 6. 开发路线图

| 阶段 | 范围 | 验收标准 |
|---|---|---|
| **Stage 0** | QML 输入/隔离探针 + JSON helper spike | 10–20 个真实 chord 正确匹配；Exclusive + inhibitor 双保护通过；普通绑定在游戏内不执行、退出/崩溃后恢复；失败配置被明确拒绝 |
| **MVP** | Overlay；InputGuard；L1；单一自适应对局；题库过滤；最小持久化 | 只有 `ShortcutInhibitor.active` 且修饰键释放后才开局；引导卡可在同局自然转入回忆卡；完成 24 卡且系统动作零误触；manifest 只声明 overlay |
| **v1** | 五层解锁；题库管理；每日挑战/streak；Service；bar；可选提醒 | 连续 3 天状态正确；移除 bar 后提醒/进度不丢；弱项抽取明显但不连续霸屏 |
| **v2** | 徽章墙、音效、主题和动效打磨、用户分类覆盖 | 完成可访问性检查和社区发布清单，提交社区 registry |
| **v3（探索）** | 可选本地节奏变体；仅对可观察 compositor 结果做“工作中挑战” | 单独做技术验证和隐私评审后再决定，不承诺通用被动按键识别 |

`prototype/` 网页原型已经用于验证卡片节奏、动画和艺术风格；它不计入输入安全
验收。最终参数和所有快捷键隔离行为必须回到 QML 真机验证，尤其关注 60–90 秒
对局长度、低性能设备动画掉帧和 inhibitor 生命周期。

---

## 7. 风险与测试清单

| 风险 | 对策 |
|---|---|
| Exclusive 只改变焦点，Hyprland binding 仍可能先执行 | 同时启用 Shortcuts Inhibitor；`active` 前禁止开局 |
| Quickshell `_ShortcutsInhibitor` 是私有 API | 记录支持版本、Stage 0 兼容性测试；模块缺失时拒绝运行 |
| 用户禁止应用抓取快捷键 | preflight 检查 `binds:disable_keybind_grabbing`；说明后退出，不自动改配置 |
| `dont_inhibit`/compositor 内部键无法屏蔽 | helper 标记并从题库排除；README 明确支持边界 |
| 退出或崩溃后 inhibitor 未恢复 | Esc release 后关闭；真机覆盖正常退出和强制结束 shell |
| Qt 与 XKB/Hyprland 键名不一致 | Stage 0 输入探针；logical/physical 双匹配模式；fixture 测试 |
| 自动分类误判自定义脚本 | 严格 eligibility；Uncategorized 默认关闭；用户覆盖优先 |
| 错误键位被重复轰炸 | 权重封顶、每波最多两次、不连续重复、可将弱项自动降为引导卡 |
| 指标被极端值或少量样本误导 | 最近 10 次、正确率 + P75、最小样本数 |
| overlay/bar/service 并发写坏状态 | 单一写入者、原子写、summary 只读快照 |
| 固定每日挑战变成背顺序 | 固定题目集合，每次重排顺序 |
| 提醒造成打扰 | 默认关闭、每天最多一次、完成后不提醒 |
| 上游 `hyprctl binds` 格式变化 | helper schema 版本、解析 fixtures、失败时清晰报错而非空题库 |

MVP 必测：

- 普通字母、数字、标点、Shift/Ctrl/Alt/Super 组合；
- `code:` 绑定和至少两种活动键盘布局；
- 唤出时仍按住 Super、自动重复、Esc release 后退出；
- Exclusive 和 `ShortcutInhibitor.active` 分别可观测，任何一项失败都不能开局；
- 同一普通 binding 在游戏外执行、游戏内只被 Keycade 识别、退出后恢复；
- 强制结束 `omarchy-shell` 后快捷键自动恢复；
- `binds:disable_keybind_grabbing = true` 时显示阻断错误且不开始对局；
- 空 description、重复 chord、`dont_inhibit`、鼠标/switch/release binding
  被正确排除；
- stats 文件不存在、损坏、版本未知时安全降级；
- 覆盖层内测试不会真正触发关闭窗口或工作区切换。

---

## 8. 已确定与待定项

**本版已确定**

- MVP 不接通知、不做 bar、不加音效。
- 对局只识别不派发；输入隔离必须同时使用 Exclusive focus 和
  Shortcuts Inhibitor；不做通用 Ambient 键盘监听。
- inhibitor 未激活或用户禁止 keybind grabbing 时拒绝开局，不提供不安全降级。
- 先做原生输入探针，再做正式 UI；网页原型仅负责手感调参。
- `Super + G` 只是文档示例，安装后按实际绑定检测冲突。
- 名称使用 Keycade，并在 README 解释 Key + Arcade。

**仍需决定**

- 插件 id 的用户名前缀（GitHub 用户名或稳定昵称）。
- 各层 P75 目标值；通过 Stage 0/MVP 实测后确定，不在纸面拍死。
- v2 音效素材来源（自制或明确许可证的 CC0 素材）。
- 首批支持的键盘布局范围；MVP 至少覆盖开发者实际使用布局和 US 布局。

---

## 9. 参考

- Omarchy shell 插件架构：`/usr/share/omarchy/shell/plugins/README.md`
- 键位解析现成实现：`/usr/share/omarchy/bin/omarchy-menu-keybindings`
- 插件加载和 summon：`/usr/share/omarchy/shell/shell.qml`
- Bar widget 设置注入：`/usr/share/omarchy/shell/plugins/bar/Bar.qml`
- 原子状态写入参考：`omarchy.clipboard` / `omarchy.notifications`
- 独占键盘焦点参考：`omarchy.emojis` / `omarchy.clipboard`
- Quickshell ShortcutInhibitor 类型：
  `/usr/lib/qt6/qml/Quickshell/Wayland/_ShortcutsInhibitor/quickshell-wayland-shortcuts-inhibit.qmltypes`
- wlr-layer-shell 协议：
  [wlr-layer-shell-unstable-v1.xml](https://gitlab.freedesktop.org/wlroots/wlr-protocols/-/blob/master/unstable/wlr-layer-shell-unstable-v1.xml)
- Hyprland 输入与 inhibitor 行为：
  [InputManager.cpp](https://github.com/hyprwm/Hyprland/blob/main/src/managers/input/InputManager.cpp) / [keybinds/Manager.cpp](https://github.com/hyprwm/Hyprland/blob/main/src/keybinds/Manager.cpp)
- 灵感对照：[sambitcreate/omarchy-doc](https://github.com/sambitcreate/omarchy-doc)
