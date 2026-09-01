# Keycade — Omarchy 快捷键街机

> Keycade = Key + Arcade。它不是 Keycard：名字直接表达“把快捷键练习做成街机游戏”。

一个 Omarchy shell 插件：读取玩家当前 Hyprland 会话里真正生效的快捷键，
把教学提示、自主回忆和速度挑战编进同一个连续街机回合，让玩家边玩边把
“知道快捷键”变成肌肉记忆。

状态：设计版本 v0.5.9　·　对应插件版本 0.2.9　·　插件命名空间已迁移到 luneth90

## 0. 版本记录

| 文档版本 | 插件版本 | 日期 | 主要变化 |
|---|---|---|---|
| **v0.5.9** | **0.2.9** | 2026-09-02 | 插件 ID 与作者前缀从 `xiaowei` 迁移为 `luneth90`，安装器同步迁移旧安装与快捷键 |
| **v0.5.8** | **0.2.8** | 2026-09-02 | 语言收敛为英语/简体中文并默认英语；掌握门槛从 5 次降为跨 3 局连续正确 3 次 |
| **v0.5.7** | **0.2.7** | 2026-09-02 | 首次达到总掌握 100% 后，在本局结束展示一次性恭喜结算与生涯统计 |
| **v0.5.6** | **0.2.6** | 2026-09-02 | 结算页将专业术语“P75 反应”简化为“反应”，计算口径不变 |
| **v0.5.5** | **0.2.5** | 2026-09-02 | 增加总掌握进度条和本次正确反应时间；保留 P75，不展示全部原始时间 |
| **v0.5.4** | **0.2.4** | 2026-09-02 | 严格固定 24 个卡位；复测替换低优先级卡；增加本局学习目标和进度 HUD |
| **v0.5.3** | **0.2.3** | 2026-09-02 | 取消波次和波间暂停，24 张卡作为单一连续自适应序列 |
| **v0.5.2** | **0.2.2** | 2026-09-02 | 修复语言/音效下拉菜单鼠标命中；默认音量调整为 60% |
| **v0.5.1** | **0.2.1** | 2026-09-01 | 中断续玩；按实际展示推进覆盖；语言/音效下拉设置；内置动作本地化；柔和反馈音 |
| **v0.5** | **0.2.0** | 2026-09-01 | 用持续掌握循环替代生命/计分驱动；加入覆盖保证、强制纠错与本地音效设计 |
| v0.4 | 0.1.x | 2026-08-31 | 单一自适应对局、快捷键分类、跨设备输入兼容 |

文档中的 0.2.9 表示本轮产品设计和插件发布版本。源码、测试和安装包必须保持
同步；后续若只修改设计而尚未实现，需要在顶部状态中重新明确标记。

---

## 1. 目标与非目标

**目标**

- 练的是玩家电脑上**真正生效且适合练习**的快捷键，不是一份写死的题库。
- 新玩家无需选择训练模式；新键位在正常对局里获得提示，并自然过渡到回忆。
- 一个完整对局控制在 60–90 秒，随时可以退出，不用人为阶段打断连续回忆。
- 正确率优先、反应速度其次；游戏化反馈服务于学习，不鼓励乱猜。
- 持续游玩时，所有未排除的快捷键都能按计划出现；随机性只改变同优先级题目的
  顺序，不能让待学或到期题目长期饿死。
- 每天愿意再打开一次：弱项复习、每日挑战、连续打卡（streak）和徽章。
- 作为标准 Omarchy 第三方插件分发：`omarchy plugin add <git-url>`。

**非目标（先不做）**

- 不做多人对战、联网排行榜或云同步。
- 不模拟一个假桌面；Keycade 的差异化是“长在真实会话里”，但对局
  中仍然只识别按键，不执行危险动作。
- 不采集全局键盘输入，不做通用键盘记录器。
- 0.2.1 不做 bar widget、通知、徽章和复杂主题动画；只加入对学习有用的最小音效。

---

## 2. 核心体验

### 2.1 单一持续掌握循环

Keycade 只有一个核心入口：**开始练习**。学习不是独立页面或前置课程，而是
同一局内不断循环的“引导 → 独立回忆 → 间隔复习 → 熟练维护”。每个快捷键拥有
独立学习状态，调度器根据状态选择卡片呈现方式：

| 卡片呈现 | 画面和规则 | 何时使用 | 首次作答后的变化 |
|---|---|---|---|
| **引导卡** | 动作名 + 完整键位；不计时 | 从未学过，或用户主动要求提示 | 正确后进入 Learning，并在本局稍后进行无提示回忆 |
| **学习卡** | 只显示动作名；使用宽松时间预算 | Learning、上次出错或已经到期 | 首次正确推进复习间隔；错误进入纠错流程 |
| **维护卡** | 只显示动作名；时间预算按个人历史调整 | 已 Mastered 且到达复习日期 | 首次正确延长复习间隔；错误退回 Learning |
| **纠错卡** | 显示动作名和正确键位；不计时 | 学习卡或维护卡首次错误/超时后 | 必须正确输入才离开；只强化记忆，不重复计入成绩 |

这些是调度器内部的呈现状态，不是让玩家选择的四种模式。牌组可以混合引导、
学习和维护卡；纠错卡由错误即时触发。用户可把任意快捷键标为“需要提示”，它会
回到 Guided，但历史记录仍保留。

快捷键的持久状态为：

```text
Unseen → Guided → Learning → Mastered → Maintenance
                      ↑          │
                      └── lapse ─┘
```

“Mastered”表示已经达到当前的记忆证据门槛，不表示永久掌握；到期后仍会进入
Maintenance。系统保证每个未排除键位得到练习机会，但不能保证玩家在固定天数内
学会——掌握速度仍取决于实际完成次数和首次作答质量。

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
5. 调度器从持久化队列生成 24 张混合牌组；到期项、未学项、薄弱项和维护项在
   同一条连续序列中自适应混排。卡片之间不插入波次结算或固定暂停。
6. 玩家按出卡片对应组合键：
   - **引导卡按对**：立即继续；优先替换本局后 3–5 张内的低优先级卡进行回忆；
     剩余卡位不足时保留到下一局优先复习。
   - **引导卡按错**：显示收到的按键，保留答案并原地重试。
   - **学习/维护卡首次按对**：记录首次正确和反应时间，播放正确音效后继续。
   - **学习/维护卡首次按错或超时**：只记录一次错误，揭晓并持续显示正确答案；
     玩家必须正确跟按一次才能进入下一题。纠错期间的后续错误不重复写入统计。
   - 完成 24 张计划卡后结算；错误不会扣血、提前结束或减少后续练习机会；`Esc`
     随时安全退出，不计为失败，并原子保存剩余牌组、纠错状态和本局统计；下次
     默认继续上局，也允许用户明确放弃后开始新局。
7. 结算页按重要性展示：本局首次正确率、新学会数量、进入 Mastered 数量、仍需
   复习数量和“反应”时间；不再向玩家展示 P75 术语，也不展示生命、分数或“失败”。

### 2.3 首次 100% 里程碑

- 总掌握进度首次达到 100% 时只记录里程碑，不打断正在进行的 24 张卡；若中途
  `Esc` 退出，里程碑与当前牌组都会保存，恢复并完成本局后再展示。
- 完成本局后先展示一次恭喜结算页，再由玩家按 Enter 或点击按钮进入普通本局
  结算。页面只自动展示一次；以后因遗忘退回 99% 再回到 100% 不重复弹出。
  若玩家恰好在最后一张正确反馈尚未结束时退出，下一次启动补展示，不能把尚未
  看见的页面误记为已展示。
- 页面展示当前可训练快捷键总数、累计完成对局、累计有效训练时间、生涯首次作答
  正确率、通俗的“反应”指标与首次达成日期，并说明已经进入维护复习阶段。
- “累计完成对局”只在完整完成 24 张卡后增加；中断后继续仍属于同一局。
  “有效训练时间”从 0.2.7 起累计对局中的思考、纠错和作答时间，不包含首页、
  普通结算及恭喜页停留。旧版本没有足够数据，升级时不虚构历史时长。
- 生涯正确率统计全部有效快捷键的首次独立作答；“反应”继续使用各键最近十次
  正确反应样本合并后的稳健分位值，但玩家界面不出现统计术语。

可以保留“连续首次正确”作为短暂视觉鼓励，但它不影响调度、倒计时、解锁或
结算评价。时间预算由个人历史决定，并限制在舒适范围；速度只用于观察流畅度，
不作为掌握的单独门槛。

### 2.4 输入隔离与安全性：双重保护

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

### 2.5 按键判定与规范化

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

### 2.6 Stage 0：原生输入与隔离探针

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

首页展示各类别可训练数量，卡片显示当前类别。调度器在整局中优先轮换不同类别，
并让重复键位尽量均匀分散。分类均衡是同优先级题目之间的次级
排序规则，不能把已到期或尚未学习的快捷键挤出牌组。这样既避免窗口/工作区绑定
垄断整局，也不破坏学习队列的覆盖保证。

### 2.8 有覆盖保证的调度器

0.2.0 不再从全部快捷键做纯加权随机抽取，而是先按学习义务建立确定性候选队列，
再在同一优先级内打散。每局 24 张计划卡的默认配额为：

| 队列 | 默认张数 | 选取顺序 |
|---|---:|---|
| **到期复习** | 10 | `dueAt` 最早优先，错误项优先于普通到期项 |
| **未学覆盖** | 6 | 从持久化 `coverageCursor` 开始轮转，保证最终遍历全部未排除项 |
| **薄弱巩固** | 6 | 最近首次错误率高、刚发生 lapse、或多次需要纠错的项目优先 |
| **熟练维护** | 2 | 已 Mastered 且最久未见者优先 |

某个队列不足时，空位依次让给到期复习、未学覆盖、薄弱巩固和熟练维护；尚未
到期的 Mastered 项永远不能挤掉未学项或到期项。重复快捷键在整局中均匀分散且
不连续出现。因首次错误产生的纠错跟按不占卡位；无提示复测只能替换本局后
3–5 张内的维护、薄弱、未学或到期卡，优先替换学习义务较低者，牌组长度始终
保持 24。被替换卡仍保留在持久化队列中；若剩余位置不足或候选位置都是其他
复测卡，则把该快捷键保留为下一局到期项，不扩张本局。

顶部 HUD 明确区分五种数字：“本局进度”是已完成计划卡位 `/ 24`，纠错跟按不
推进；“本局复习”和“本局新增”是开局牌组中不同快捷键的计划数量；“待巩固”
是本局已经新学或答错、尚未完成无提示回忆的不同快捷键数量；“待复习总数”是
跨局持久队列当前的全部积压。这样不会再把动态牌组长度误读成学习状态或卡片编号。

`coverageCursor` 只在未学卡真正显示给玩家时推进，不在生成牌组时预先推进。
因此中途退出不会把尚未看到的快捷键标记为已覆盖；保存的剩余牌组恢复后继续使用。

每个快捷键至少持久化以下字段：

```jsonc
{
  "state": "learning",
  "dueAt": "2026-09-02T09:00:00+08:00",
  "intervalStep": 1,
  "firstTryAttempts": 5,
  "firstTryCorrect": 4,
  "recentFirstTry": [true, false, true, true, true],
  "reactions": [980, 910, 845, 820],
  "lastSeenAt": "2026-09-01T09:00:00+08:00",
  "lapseCount": 1
}
```

初始建议复习间隔为“本局稍后 → 下一局 → 1 天 → 3 天 → 7 天 → 14 天”，后续
可根据实测调整。首次错误或超时立即回到 Learning，`intervalStep` 回退，并进入
本局纠错和短间隔重测。

达到 Mastered 至少需要：完成过引导；跨至少 3 个不同对局获得无提示首次正确；
最近 3 次首次作答全部正确。也就是同一局内重复答对不能刷到 Mastered，而一次
错误后需要重新连续正确 3 次。普通卡首次答对时显示本次反应时间；结算页只标为
“反应”，内部仍使用 75 分位抵抗极端值；每个快捷键只持久化最近 10 次有效反应时间，不在主界面罗列全部原始样本。
反应时间用于判断是否流畅和设置舒适倒计时，不单独决定 Mastered。键位配置变化时，新增项进入 Unseen，删除或被用户排除的项标记
inactive；重新启用后恢复原历史并安排一次到期复习。

调度器必须满足以下可测试不变量：

- 只要玩家持续完成对局，`coverageCursor` 必须在有限局数内遍历所有未排除项；
- 到期项不会因为随机数、类别数量或大量熟练项而无限延期；
- 同一输入的纠错跟按只修正记忆，不把首次错误洗成正确统计；
- 随机性只能决定同优先级候选的顺序，不能决定某个键位是否永远得到练习机会。

### 2.9 音效反馈

音效服务于节奏和记忆确认，不承载任何唯一信息。0.2.1 内置本地柔和音效，不联网、
不依赖系统主题，也不在按键路径中启动外部播放器：

| 事件 | 音效设计 | 规则 |
|---|---|---|
| **首次正确** | 约 300ms、带缓入缓出的柔和双音 | 输入确认后播放，不阻塞下一卡；限制并发和触发频率 |
| **首次错误/超时** | 约 310ms、低音量下行双音 | 每张卡只播放一次，纠错期间连续按错不反复轰炸 |
| **纠错完成** | 不播放额外声音 | 只用文字和视觉确认，避免一次错误产生多次短促提示 |
| **倒计时 3/2/1** | 三个短促节拍，最后一拍略高 | 只在有时间预算的学习/维护卡最后 3 秒播放 |

引导卡和纠错卡不倒计时，也不播放倒计时音效。收到输入、暂停、退出或切卡时必须
立即停止上一卡尚未播放的节拍，避免串音。资源随插件放在 `assets/sfx/`，启动时
预加载；设置面板提供反馈音开关、倒计时音效开关和明确的百分比音量，默认开启、
音量 60%，并尊重
系统静音。“减少动态效果”不强制关闭声音，两个设置彼此独立。所有声音必须同时
有文字、颜色之外的形状或状态变化作为视觉替代。

---

## 3. 每日挑战与打卡（v1）

- 每天按本地时区首次进入时生成 10 个固定题目，先取当天已到期项，再由最久未见
  的已学习项补足；每日挑战不加入从未见过的新键，也不替代普通练习的覆盖队列。
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
  "version": "0.2.9",
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
├── session.json       # 未完成牌组、纠错状态和本局统计；结算或主动新开后清空
├── stats.json         # 每键首次作答、反应、累计时长及首次 100% 里程碑
├── progress.json      # 学习状态、dueAt、intervalStep、coverageCursor 和徽章
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
- `stats.json` 的当前 schema 为 3；schema 1/2 自动迁移并保留已有学习记录。
  `totalTrainingMs`、`firstMasteryAt`、`firstMasteryRun` 和
  `firstMasteryCelebrated` 分别记录有效训练时长、首次 100% 时间/局号及一次性
  结算是否已展示。升级前无法可靠推导的训练时长使用 0，不根据对局数猜测。
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
│   ├── locales/                  # en、zh-CN 文案
│   └── sfx/                     # 0.2.1：柔和正确/错误音与倒计时
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
- 倒计时使用分段能量槽，不使用平滑圆环；顶部 HUD 展示“本局进度 / 24”、
  “本局复习”“本局新增”“待巩固”和“本局首次正确率”，侧栏显示“新学会”和
  “待复习总数”；其下用分段条展示“已掌握 / 全部”和百分比，Learning 与
  Mastered 使用不同区段。主界面不展示生命、分数、失败状态或完整时间列表。
- 命中采用 50ms 左右 hit-stop、8 方向方块碎片和短促色板闪烁；失误采用
  2–8px 阶梯抖动。重要反馈不能只依赖红绿颜色。
- 命中反馈总时长控制在 150–320ms，错误提示约 700ms；“减少动态效果”模式
  去掉碎片、闪屏和抖动，只保留边框/文字状态变化。
- 0.2.0 加入可关闭的本地短音效；任何重要反馈都不能只依赖声音。
- 结算页保持轻松语气，但不嘲讽障碍或失败；吐槽文案允许整体关闭。
- `prototype/` 下的零依赖网页原型只用于评审页面、主题和动效，不用于验证系统
  快捷键捕获；浏览器被 Hyprland 抢走快捷键属于预期限制。

### 5.1 多语言策略

- 初次启动默认英文（`en`），并提供简体中文（`zh-CN`）；用户选择写入
  `settings.json`，缺失、无效或旧版日文/西班牙文设置自动回退并保存为英文。
- 所有界面文字、动态反馈、动作通用名和无障碍标签使用稳定文案 key，语言包必须
  与英文基准表键集合一致；品牌名、实际键帽字符和主题专名不翻译。
- 已知 dispatcher/arg 映射为可翻译的动作 key；用户自定义 description 保持原文，
  不做容易产生误义的自动翻译。未知动作使用原始 description 或 dispatcher 回退。
- 排版不能依赖英文固定宽度；中文采用对应 CJK 字体，英文允许按钮
  换行。发布前用最长文案和 200% 缩放检查顶部控件、任务卡及错误状态。
- 网页原型的 `i18n.js` 用来验证切换和版式；正式 QML 版本把语言包拆到
  `assets/locales/`，语言切换不重开对局，也不重置计分、计时和当前题目。

---

## 6. 开发路线图

| 阶段 | 范围 | 验收标准 |
|---|---|---|
| **Stage 0** | QML 输入/隔离探针 + JSON helper spike | 10–20 个真实 chord 正确匹配；Exclusive + inhibitor 双保护通过；普通绑定在游戏内不执行、退出/崩溃后恢复；失败配置被明确拒绝 |
| **MVP / 0.1.x** | Overlay；InputGuard；基础自适应对局；题库过滤；最小持久化 | 只有 `ShortcutInhibitor.active` 且修饰键释放后才开局；完成 24 卡且系统动作零误触；manifest 只声明 overlay |
| **0.2.0** | 持续掌握状态机；确定性覆盖队列；移除生命/计分；首次作答统计；正确、错误和倒计时音效 | 连续模拟对局能遍历全部未排除项；到期项不饿死；错误后必须正确跟按且稍后重测；音效可独立关闭且不串音 |
| **0.2.1** | 中断续玩；实际展示后推进覆盖；语言和声音设置菜单；内置动作本地化；反馈音打磨 | Esc 后恢复相同剩余牌组和纠错状态；未展示项不跳过；中文内置动作不混杂英文；反馈音不重叠 |
| **0.2.2** | 将语言和声音菜单提升为机柜级覆盖层；默认音量改为 60% | 下拉项在按钮边界外仍可接收鼠标点击；旧版默认 30% 设置迁移为 60% |
| **0.2.3** | 取消波次、波间结算和固定暂停；改用连续 24 卡序列 | 卡片连续推进；队列优先级、类别均衡、纠错间隔和中断续玩保持有效；源码中不再保存波次字段 |
| **0.2.4** | 固定 24 个卡位；复测替换未来低优先级卡；增加本局目标、进度和待巩固指标 | 无论新学或错误多少，单局始终为 24；纠错不推进进度；空间不足的复测顺延到下一局；中断恢复后总进度仍不超过 24 |
| **0.2.5** | 增加分段总掌握进度条；首次正确反馈显示本次反应时间；结算保留 P75 | 总进度明确区别于本局进度；引导/纠错不显示速度；每键只保存最近 10 次，不用完整时间列表制造压力 |
| **0.2.6** | 将结算指标“P75 反应”改为通俗的“反应” | 玩家界面不出现统计术语；内部计算、倒计时和历史数据保持兼容 |
| **0.2.7** | 首次总掌握 100% 的一次性恭喜结算与生涯统计 | 不打断当前局；升级保留旧进度；中断可续；庆祝只展示一次；时长从本版本可靠累计 |
| **0.2.8** | 语言收敛为英语/简体中文；掌握证据降为最近 3 次正确且跨 3 局 | 默认英语；旧 ja/es 设置回退英语；同局不能刷掌握；满足新门槛的旧 Learning 数据迁移后自动晋级 |
| **0.2.9** | 插件命名空间迁移为 `luneth90.keycade` | manifest、启动命令、安装目录、shell 启用项和 Hyprland 快捷键保持一致；旧 ID 可自动迁移 |
| **v1** | 五层解锁；题库管理；每日挑战/streak；Service；bar；可选提醒 | 连续 3 天状态正确；移除 bar 后提醒/进度不丢；弱项抽取明显但不连续霸屏 |
| **v2** | 徽章墙、主题和动效打磨、用户分类覆盖 | 完成可访问性检查和社区发布清单，提交社区 registry |
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
| 错误键位被重复轰炸 | 重复项全局均匀分散且不连续；纠错音只播放一次；短间隔重测插在 3–5 卡后 |
| 随机抽题长期遗漏键位 | 持久化 `coverageCursor`；先建义务队列、后做同级打散；用多局模拟验证有限覆盖 |
| 已掌握键位悄然遗忘 | `dueAt` 间隔复习；到期项优先；首次错误立即 lapse 回 Learning |
| 音效延迟、重叠或造成压力 | 本地预加载；输入/切卡时取消倒计时节拍；错误音单卡只播一次；独立开关和音量 |
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
- 从旧版生命/计分统计迁移时保留累计尝试，不伪造首次正确历史；
- 以固定种子模拟足够多局后，所有未排除项都被 `coverageCursor` 覆盖，且到期项
  不会被未到期 Mastered 项挤出；
- 错误只记录一次，正确答案保持显示直到输入正确；空间允许时在 3–5 卡后再次
  无提示出现，否则下一局优先出现；任意错误序列都不能让牌组超过 24；
- 正确、错误和倒计时音效触发准确；纠错完成不播放额外声音；关闭声音后没有
  播放或计时异常；
- 覆盖层内测试不会真正触发关闭窗口或工作区切换。

---

## 8. 已确定与待定项

**本版已确定**

- 0.2.1 不接通知、不做 bar；加入最小本地音效并提供独立开关。
- 移除生命和分数；错误不提前终止对局，结算围绕学习进度和首次正确率。
- 使用确定性覆盖队列和持久化 `coverageCursor`；随机只用于同优先级排序。
- 错误后答案持续显示，必须正确跟按，并在本局稍后进行一次无提示重测。
- 对局只识别不派发；输入隔离必须同时使用 Exclusive focus 和
  Shortcuts Inhibitor；不做通用 Ambient 键盘监听。
- inhibitor 未激活或用户禁止 keybind grabbing 时拒绝开局，不提供不安全降级。
- 先做原生输入探针，再做正式 UI；网页原型仅负责手感调参。
- `Super + G` 只是文档示例，安装后按实际绑定检测冲突。
- 名称使用 Keycade，并在 README 解释 Key + Arcade。

**仍需决定**

- 各层 P75 目标值；通过 Stage 0/MVP 实测后确定，不在纸面拍死。
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
