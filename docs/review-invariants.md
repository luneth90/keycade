# Keycade 评审不变量 · 变更前必查清单

本文把 Omarchy 插件市场
[issue #4305](https://github.com/omacom/omarchy-plugin-marketplace/issues/4305)
两轮人工评审（HANCORE-linux）提出的 **8 条**结论固化为长期不变量。

它们不是一次性的整改项，而是**本项目的持续约束**：
今后任何代码修改、功能升级、依赖调整，合入前都必须逐条复核，
并在方案文档中给出「是否触及 / 依据」。

- 第一轮（commit `8b357f1`）：R1–R6
- 第二轮（commit `819b46c`）：R7–R8

每条包含：**不变量**（要守住什么）、**评审原文**（评审员的措辞，防止转述走样）、
**复核方法**（怎么证明没破）。

---

## R1 · 不执行用户配置来发现绑定

**不变量。** 不得执行、加载或解释用户的任何配置文件来获取绑定信息。
只消费 `hyprctl` 的只读查询输出，以及 root 属主的系统只读数据。

> `bin/keybinds-json` executes the user's complete `~/.config/hypr/hyprland.lua` with `dofile()` …
> Do not execute the configuration to discover binds; use a non-executing parser or a deliberately
> capability-free parser with a strict input/output contract.

**复核方法。** 源码中不得出现 `dofile`、Lua 子进程或任何用户配置解释器；
新增的外部数据来源必须落在 `hardening-plan.md` §01 的边界清单内，
清单本身的任何扩充都要在方案文档中申报。

---

## R2 · 生产端有界，消费端独立再验一次

**不变量。** 子进程必须有字节、deadline 与进程树上限；字段、条数、聚合体积必须有严格 schema 上限；
QML 侧必须**独立**再做一遍上界与类型校验，并在销毁时清理。

> `hyprctl`/Lua subprocess output is fully captured before parsing, and binding/device counts and all
> fields are unbounded … Add producer-side byte/deadline/process-tree limits, strict per-field/count/
> aggregate schema caps, then enforce an independent bounded QML parse/model layer and teardown cleanup.

**复核方法。** 任何新增的数据通路都要能回答三个问题：单条上限多少、总量上限多少、超限时的行为是什么。
QML 的上限不得依赖生产端的上限成立。

---

## R3 · 状态 I/O 一律 descriptor-relative

**不变量。** stats / settings / session 的读写只经过已验证的私有目录 fd，
no-follow、有界读取，写入用 0600 独占临时文件 + fsync + 原子替换。
不得按路径名读写或移动状态文件。

> `StateStore.qml` reads all state via pathname-following, unbounded `FileView` … Use a verified
> private directory and descriptor-relative no-follow bounded reads plus exclusive 0600 temp files,
> fsync and atomic replacement. Bound/migrate every stats/settings/session field and collection
> before retention or serialization.

**复核方法。** 新增的持久化字段必须在读入与写出两侧都设限并重建；
新增的文件操作必须说明为何不能用 fd，或改为 fd。

---

## R4 · 原型安全

**不变量。** 不得把外部对象的键直接拷进普通 `{}`。使用固定 schema 重建或 null-prototype map，
并拒绝 `__proto__`、`constructor`、`prototype`。

> Settings migration copies arbitrary persisted keys into a normal `{}` … Whitelist the small settings
> schema or use null-prototype maps while rejecting `__proto__`, `constructor`, and `prototype`.

**复核方法。** 任何来自 helper、持久化文件或用户输入的**动态键**，
都要能指出它是在哪里被白名单化或以 `Object.create(null)` 承载的。

---

## R5 · 动态文本一律纯文本

**不变量。** 所有渲染外部数据的文本节点必须显式声明 `Text.PlainText`，
规范化控制字符，并对字符串长度与布局设上限。

> Hyprland-derived keys/descriptions and errors reach `Text` items without an explicit
> `Text.PlainText` contract or reliable field/layout caps. Normalize controls, cap strings, and mark
> every dynamic sink as plain text.

**复核方法。** 主界面不得直接实例化 `Text`，一律使用 `SafeText`；
新增的错误或提示文案要有长度上限与 elide/clip。

---

## R6 · 只用标准安装路径，不留可替换路径

**不变量。** 不提供跟随移动分支的 clone-and-run 安装器，不执行可变 `git pull`，
不通过可替换的路径名修改配置或状态。安装、更新、卸载一律使用 Omarchy 标准命令。

> The documented clone-and-run installer follows a moving branch, later runs mutable `git pull`, and
> edits/removes configuration/state through replaceable pathnames. Prefer the standard marketplace
> install path …

**复核方法。** 仓库中不得出现 `install*` / `setup*` / `uninstall*` 命名的脚本；
README 的安装、更新、卸载段落只出现 `omarchy plugin` 命令。

---

## R7 · 不经 ambient PATH 解析可执行代码

**不变量。** 长驻组件启动的解释器与命令一律使用可信绝对路径，
并做可用性、属主与权限检查；子进程环境从零重建，不继承调用方环境。

> Both runtime helpers still use `#!/usr/bin/env python3` … and `keybinds-json` launches bare
> `hyprctl` names. These keep-loaded paths therefore still resolve executable code through the
> ambient `PATH`. Use trusted absolute interpreter/command paths, availability/ownership/mode checks,
> and a sanitized child environment.

**复核方法。** 源码中不得出现 `/usr/bin/env`；新增的可执行文件或**动态库**引用必须是绝对路径
并经 `trusted_command()` 同款检查；新增的环境变量必须显式加入白名单并说明理由。

---

## R8 · 消费端预分配上界 + 完整进程树回收

**不变量。** QML 必须**边读边限**，不得先完整保留再检查长度；
终止逻辑必须可靠地终结并回收**整棵**进程树，不得留下孤儿子进程。

> The QML consumers still use `StdioCollector` and test payload length only after the complete stream
> has been retained … This is not an independent pre-allocation consumer bound. In addition, QML
> timeout/destruction sends SIGKILL only to the helper, while each `hyprctl` child is placed in its
> own session/process group … Use incremental bounded QML consumption and a teardown design that
> reliably terminates and reaps the complete process tree.

**复核方法。** 新增的流式通路必须逐条消费并在读取过程中计账；
新增的子进程必须纳入既有的 `bounded-relay` + `setsid` + `PR_SET_PDEATHSIG` 回收链。

---

## 当前方案的逐条复核

对象：`docs/issue-1-layout-key-matching-plan.md` 所描述的按键判定结构性修复。

| 规则 | 是否触及 | 结论与依据 |
| --- | --- | --- |
| R1 不执行用户配置 | 触及 | **守住**。`kb_file` 与用户 XKB 覆盖目录一律降级；影响 XKB 搜索路径的环境变量在建 context 前清除，最终 include path 逐项要求 root 属主且组/全局不可写；启动方另以 `--xkb-environment-overridden` 报告会话中的自定义 XKB 来源。新增的 `hyprctl getoption` 已申报并写入 §01 边界清单 |
| R2 双端有界 | 触及 | **守住**。新增表设 4 KiB / 256 项 / 每项 16 码上限，**超限降级而非截断**；`resolve_binds_by_sym` 要求严格布尔，选项名精确匹配并拒绝重复；QML 侧独立复验类型、长度与数值范围，违规丢表而非整体失败 |
| R3 descriptor-relative 状态 | 未触及 | 方案不新增任何状态文件读写；删除 `kb_file` 读取后不存在按路径打开的代码 |
| R4 原型安全 | 触及 | **守住**。新 schema 字段以 `Object.create(null)` 重建，拒绝三个危险键 |
| R5 纯文本 | 未触及 | 无新增 UI 文本；排除计数与既有 `rejected` 一样走 `console.warn` |
| R6 标准安装路径 | 未触及 | 不新增文件，不触及安装、更新、卸载路径 |
| R7 不经 ambient 解析 | 触及 | **守住且有改善**。libxkbcommon 按绝对路径加载并做可信文件检查；既有 `libc.so.6` 的 soname 加载一并收敛为绝对路径 |
| R8 预分配上界与进程树 | 触及 | **守住**。新增的 `hyprctl --batch` 由既有有界 `command_output()` 承载，纳入同一条 `bounded-relay` + `setsid` + `PDEATHSIG` 回收链，不新增独立生命周期 |

**结论：8 条全部满足，其中 R7 相对现状还有改善。**

首次实现时 R1 与 R2 均**未**守住，由分支评审发现：`xkb_context_include_path_append_default()`
的结果由环境变量决定（`XKB_CONFIG_ROOT` 会整个替换系统路径），代码注释宣称的"只含系统只读数据"
不成立；`resolve_binds_by_sym` 的布尔判断把缺失和 `1` / `"true"` 都读成 false，绕过了后续检查；
每项 keycode 超限时静默截断而非降级。三项均已修复，并各有一条回归测试钉住。

这正是本文存在的理由：**逐条复核必须对着实现验证，而不是对着方案。**

需要注意的一点不在这 8 条之内：方案会关闭旧的判定分支并排除本布局上不可达的绑定，
这是**行为变更**而非安全问题。合入前须在真机完整打几局，确认既有卡片与学习进度不受影响。

---

## 使用方式

1. 写方案文档时，附一张与上表同格式的逐条复核表。
2. 改动触及某条时，写明**如何守住**，而不是只写"未违反"。
3. 需要扩充 `hardening-plan.md` §01 边界清单时，必须在方案中显式申报——
   未申报的新增会被视为倒退。
4. 合入前跑一遍 `hardening-plan.md` 的发布前验收命令。
