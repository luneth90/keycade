# issue #1 · 按键判定的结构性修复方案与验收标准

起因是 [issue #1](https://github.com/luneth90/keycade/issues/1)（eric-Lili 报告）：德语 QWERTZ 下
`SUPER+SHIFT+comma` 在 Hyprland 可正常触发，Keycade 判为按错。

但德语只是症状。排查后确认这是**一整类缺陷**，成员至少五个，其中两个在 US 布局上同样成立。
本文不针对任何具体布局，而是消除产生这一类缺陷的结构。

判定语义以本机运行的 **Hyprland v0.56.1** 源码为准，键位与 ABI 数据由本机
**libxkbcommon 1.13.2** 实测。证据清单见第九节。

## 一 · 缺陷类的共同根

Keycade 现在的判定链：

```
物理键 → (布局 + 修饰键) → 产生的字符 → 写死的 US 反查表 → 猜回按键 → 比字符串
```

Hyprland 的判定链（`KeybindManager.cpp:276-283`、`:369`）：

```
物理键 → base level keysym → 比 keysym
```

中间那段"字符往返"是布局相关、修饰键相关、且不可逆的。只要它还在，这一类缺陷就会不断产生新成员。
按布局逐个打补丁只是给错误的链条续命。

**本方案的目标：在能够复现 Hyprland 绑定 keymap 的前提下，删除这段往返。**

## 二 · 已确认的类成员

| # | 症状 | 触发条件 | 受影响布局 |
| --- | --- | --- | --- |
| 1 | Shift + 标点判错 | de 的 kc59 在 Shift 层是 `semicolon`，`shiftedKeyBases` 只覆盖 US | 非 US |
| 2 | `KEY_ALIASES` 六项之外的标点判错 | `bind = SUPER, semicolon` 期望 `"SEMICOLON"`，用户按出 `;` | **含 US** |
| 3 | 布局上按不出的绑定**假通过** | de 的 `SUPER+SHIFT+SLASH`，用户按 Shift+7 得 `/`，Keycade 判对，Hyprland 不触发 | 非 US |
| 4 | 小键盘别名**假通过** | kc82 base 为 `KP_Subtract`、kc20 为 `minus`，Qt 都报 `Key_Minus`；Hyprland 只认 kc20 | **含 US** |
| 5 | AltGr / level3 字符判错 | 同 1 的变体 | 非 US |

3 与 4 是**假通过**：Keycade 在教按不出来的快捷键，比判错更有害。

处理矩阵：

| # | 措施 | 状态 |
| --- | --- | --- |
| 1 / 2 / 5 | 权威模式下判定改为 keysym 比较，删除字符往返 | 待实施 |
| 3 | 在本布局上不可达的绑定从训练中排除 | 待实施 |
| 4 | 同 1，键码唯一标识物理键，小键盘不再与主键区混淆 | 待实施 |

## 三 · Hyprland 的真实判定语义

`KeybindManager.cpp:369`：

```cpp
const xkb_keysym_t keysym = xkb_state_key_get_one_sym(
    pKeyboard->m_resolveBindsBySym ? pKeyboard->m_xkbSymState : m_xkbTranslationState, KEYCODE);
```

`KeybindManager.cpp:276-283`：

```cpp
xkb_keysym_t bindSym = XKB_KEY_NoSymbol;
if (!k->key.empty())
    bindSym = xkb_keysym_from_name(k->key.c_str(), XKB_KEYSYM_CASE_INSENSITIVE);
else if (k->keycode != 0 && m_xkbTranslationState)
    bindSym = xkb_state_key_get_one_sym(m_xkbTranslationState, k->keycode);

if (bindSym != XKB_KEY_NoSymbol && bindSym == keysym)
    return k;
```

**① 方向是 keycode → keysym。** Hyprland 从不把绑定解析成一个物理键。
base keysym 相同的多个 keycode 全部都能触发同一条绑定。

**② 解析发生在 base level。** `m_xkbTranslationState = xkb_state_new(PKEYMAP)` 是全新 state，
从不 update mask；`m_xkbSymState` 在 `IKeyboard.cpp:382` 只被
`xkb_state_update_mask(m_xkbSymState, 0, 0, 0, 0, 0, group)` 更新，修饰键位全为 0。

**③ 有效 keymap 的来源由 `input:resolve_binds_by_sym` 决定。**

| resolve_binds_by_sym | keymap 来源 | layout group |
| --- | --- | --- |
| false（默认） | **全局** `input:kb_file`，否则全局 `kb_rules/kb_model/kb_layout/kb_variant/kb_options` | 0 |
| true | **per-keyboard** keymap（含 per-device 覆盖） | 该键盘的**活动 group** |

默认分支由 `KeybindManager.cpp:289-332` 的 `updateXKBTranslationState()` 构建，读取全局配置项，
**完全不参考任何设备**。

`code:NN` 绑定同样先转 keysym 再比较，与 Keycade 现有 `matchMode: "physical"` 的精确码比较存在偏差，
另行记录，不在本次范围。

## 四 · 两种模式

### 权威模式

成功复现 Hyprland 的绑定 keymap 时：

- 判定**只**比 keysym：`input.physicalCode ∈ keycodeMap[expected]`。
- **逻辑分支关闭**。它是整条错误链，不是安全网——保留它会让成员 3 和 4 继续成立。
- 表中无条目 ⇒ 该绑定在本布局的 base level 上按不出来 ⇒ Hyprland 也不会触发 ⇒
  `Eligibility` 排除为 `unreachable-on-layout`，不生成卡片。
- 表的缺席同样是权威结论：无条目即无任何按键可以命中。

### 降级模式

无法复现 keymap 时，行为与今天**完全一致**（逻辑分支），不产生任何回归。
用户不会变得更糟，只是这一类缺陷未被修复。

### 降级面

原则是**只消费 hyprctl 的运行时输出与系统只读的 XKB 数据**，与 `docs/hardening-plan.md` §01
已公布的边界保持一致。任何需要读取用户可写内容才能复现的配置，一律降级而不猜测：

| 情况 | 处理 | 理由 |
| --- | --- | --- |
| `input:kb_file` 已设置 | 降级 | 复现需要读取用户配置目录下的任意路径，越过 §01 边界 |
| 存在 `~/.xkb` 或 `~/.config/xkb` | 降级 | Hyprland 会加载这些覆盖，helper 不读取用户可写内容，两边 keymap 必然分歧 |
| RMLVO 字符串未通过字符校验 | 降级 | 见 5.4，用户配置串不得未经校验进入解析文件的 API |
| `resolve_binds_by_sym` 为 true，且并非「全部键盘沿用全局布局的单布局」情形 | 降级 | 该组合需要多布局加手动打开一个默认关闭的开关，极其罕见，不值得为其保留一条完整分支 |
| `libxkbcommon` 不可加载或 keymap 编译失败 | 降级 | 无数据 |

降级时行为与今天**完全一致**，不产生任何回归。用户不会变得更糟，只是这一类缺陷未被修复。

前两条对应的用户占比很小：issue #1 报告的场景与绝大多数用户使用纯 `input:kb_layout`，
落在权威模式。用覆盖率换取"不读取任何用户可写内容"，是本方案有意做出的取舍——
详见第十节。

## 五 · 实现

### 5.1 边界

- 不引入新软件包；新增**恰好一次** `hyprctl` 调用（`--batch` 合并七个 `getoption`）。
- ctypes 只在**短命的 helper 子进程**中执行，不在长驻的 QML 进程内；该子进程由
  `bounded-relay` 施加字节、deadline 与进程组约束，异常经既有 exit-code 路径收敛。
- 不改变 `matchMode`，不改变 `bindingId()` / `chordId()` 的取值，学习进度完全保留。
- **不读取任何用户可写内容**：只消费 `hyprctl` 的运行时输出，以及 root 属主的系统 XKB 数据。
- 来自用户配置的字符串（RMLVO）在进入 libxkbcommon 之前必须通过字符白名单校验。

### 5.2 producer · 取得 keymap 描述

一次批量调用，走已审计的 `trusted_command(HYPRCTL_PATH)`，命令串为固定字面量、无任何插值：

```
hyprctl -j --batch "getoption input:kb_file;getoption input:kb_rules;getoption input:kb_model;\
getoption input:kb_layout;getoption input:kb_variant;getoption input:kb_options;\
getoption input:resolve_binds_by_sym"
```

输出为逐行 JSON 对象（非数组），逐条解析。`kb_file` 未设置时返回哨兵串 `[[EMPTY]]`，
与源码的 `STRVAL_EMPTY` 判断一致。

per-device rules 取自 helper 已经获取的 `hyprctl devices`，仅用于与全局值比对：

```
rules: r "", m "", l "us", v "", o "compose:caps,shift:both_capslock_cancel"
```

### 5.3 producer · 选定 keymap 来源

只有一条权威路径：**全局 RMLVO，layout group 0**。凡是不能确认 Hyprland 用的就是这一份的，
一律降级。

```
kb_file 非 [[EMPTY]]                 -> 降级
用户 XKB 覆盖目录存在                 -> 降级
全局 RMLVO 未通过字符校验             -> 降级
编译失败                             -> 降级

resolve_binds_by_sym == false        -> 权威（group 0）
resolve_binds_by_sym == true:
    全部键盘的 rules 五元组等于全局 RMLVO，且 num_layouts == 1  -> 权威（group 0）
    否则                                                      -> 降级
```

`resolve_binds_by_sym` 必须是**严格布尔**：缺失、`1`、`"true"`、`null` 一律降级，
不得当作 false 而跳过后续检查。`getoption` 的每个选项名也必须精确匹配预期集合并拒绝重复。

`resolve_binds_by_sym` 为 true 时 Hyprland 改用 per-keyboard keymap 与活动 group。
只在**全部键盘沿用全局布局且只有一个 group** 时，那份 keymap 与全局 RMLVO 逐位相同、
活动 group 恒为 0，两条路径重合，可安全按权威处理；其余情形一律降级。

**刻意不实现 per-device 多 group 分支。** 触发它需要同时满足：配置了多个布局，
并且手动打开了一个默认关闭的开关。为此保留完整分支需要解析每个键盘的活动 layout index、
按 group 建表、并处理多键盘不一致——数十行代码与一整组测试，服务的用户群极小。
降级后这些用户得到今天的行为，不会变差。

`hyprctl devices` 在此只用于比对 rules 五元组是否等于全局值，不再解析活动 layout index。

用户 XKB 覆盖目录只做存在性检查，经 `pwd.getpwuid(os.getuid()).pw_dir` 取得家目录，
不依赖被清空的环境变量；不打开、不读取。

### 5.4 producer · 编译 keymap

通过 ctypes 加载 libxkbcommon。**按绝对路径 `/usr/lib/libxkbcommon.so.0` 加载，并套用
`trusted_command()` 的同款检查**（普通文件、root 属主、非组或全局可写），
与本项目"不经 ambient 解析"的既有原则一致。所有 `argtypes` / `restype` 显式声明。

**RMLVO 字符校验（必需）。** `kb_rules` / `kb_model` / `kb_layout` / `kb_variant` / `kb_options`
全部来自用户的 Hyprland 配置，而 `xkb_keymap_new_from_names*()` 会按名字解析文件。
实测 `kb_layout = "/etc/passwd"` 会使 libxkbcommon **真的打开并解析 `/etc/passwd`**
（编译随即失败，无内容泄漏，但这是一个由配置串驱动的任意文件打开原语）。
因此传入前逐项校验：

- 长度 ≤ 128。
- 字符集限 `[A-Za-z0-9_,:.+()-]`，用 `fullmatch()` 校验——Python 的 `$`
  也匹配结尾换行之前，`re.match()` 会放过 `"us\n"`。
- 显式拒绝 `/` 与 `..`。
- 任一项不通过即降级，不做截断或清洗。

Hyprland 的真实取值全部通过：`us`、`us,de`、`pc105`、`compose:caps,shift:both_capslock_cancel`。
实测相对路径穿越被 include path 限制挡住，超长名字被库自身的 4096 路径长度检查挡住，
`kb_options` 中的非法项被库忽略——**只有绝对路径会真正落到文件系统上**，故校验以拒绝 `/` 为核心。

include path 需要三重处理，**`append_default()` 本身并不安全**：

```
for name in ("XKB_CONFIG_ROOT", "XKB_CONFIG_EXTRA_PATH", "XDG_CONFIG_HOME", "HOME"):
    os.environ.pop(name, None)                 # 1. 清除能操纵搜索路径的环境变量
ctx = xkb_context_new(XKB_CONTEXT_NO_DEFAULT_INCLUDES)
xkb_context_include_path_append_default(ctx)   # 2. 由库给出系统路径
# 3. 枚举结果，每一项必须是 root 属主、组与其他用户不可写的目录，否则降级
```

**`append_default()` 的结果由环境变量决定，不是常量。** 实测：`XDG_CONFIG_HOME`
指向含 `xkb` 子目录的位置时，该目录会被**前置**进搜索路径；`XKB_CONFIG_ROOT=/tmp`
会把系统路径**整个替换掉**。所以必须先清除、再枚举校验。

**系统路径同样不得硬编码。** 环境清除后 `append_default()` 加入的是
`/usr/share/xkeyboard-config-2`，而非常被假定的 `/usr/share/X11/xkb`；写死会得到错误或空的 keymap。

**还有一个 helper 看不见的来源。** helper 的环境由 `KeybindSource` 重建，因此它无法得知
Hyprland 启动所处的会话是否设置了这些变量——那会让 Hyprland 用上与 helper 不同的系统 keymap。
由启动方检查并通过 `--xkb-environment-overridden` 传入布尔标记，置位即降级。

编译：优先 `xkb_keymap_new_from_names2(ctx, &names, XKB_KEYMAP_FORMAT_TEXT_V2, 0)` 以对齐
Hyprland；该符号自 libxkbcommon **1.11.0** 起提供，`getattr` 探测失败时回退
`xkb_keymap_new_from_names`（自 0.5.0 起始终存在）。

返回 NULL 即降级。成功与失败分支都必须 `xkb_keymap_unref` / `xkb_context_unref`。

libxkbcommon 会把编译错误写入 stderr。helper 由 `bounded-relay` 以
`stderr=subprocess.DEVNULL` 启动，故不会污染输出流，也不会进入 QML。

### 5.5 producer · 构建 keycode → base keysym

遍历 `xkb_keymap_min_keycode()`..`max_keycode()`，取选定 group、level 0；
`xkb_keymap_key_get_syms_by_level()` 返回恰好 1 个 keysym 时记入。

### 5.6 producer · 按绑定实际用到的键名反向收集

`canonical_key()` 已丢弃原始键名，`snapshot()` 拿到的记录只有规范化结果。因此需要一个
**保持索引对齐的 transient sidecar**：`accept_records()` 构建每条记录时同步记下该条的原始
`raw_key`，被拒绝的记录以 `None` 占位，与既有 `rejected` 对齐机制一致。sidecar 不进入输出。

原始键名必须复用 `canonical_key()` 的前置处理，不能整段交给 xkb：

- 先做 `key.rsplit(" + ", 1)[-1]` —— 实测 `hyprctl binds` 的 key 字段包含
  `SUPER + ALT + code:10` 这类完整串。
- 跳过 `code:` 前缀（已是 physical）与 `mouse:272` / `mouse_up` / `switch:off:...` 等非键盘形式。

对剩余键名调用 `xkb_keysym_from_name(name, XKB_KEYSYM_CASE_INSENSITIVE)` ——
与 `KeybindManager.cpp:278` 完全相同的调用，覆盖 `hyprctl binds` 大小写混杂的输出
（实测 `comma` 与 `SLASH` 并存）。实测 `xkb_keysym_from_name("G", CASE_INSENSITIVE)` 返回小写
`g`，与 base level 一致。

### 5.7 producer · 产出表

以 `canonical_key()` 的输出为索引，QML 侧可直接用 `binding.key` 查表：

```json
"keycodeMap": { ",": [59], "TAB": [23], "DELETE": [119, 22] }
```

- 同一规范化键名由多个原始键名贡献且 keycode 集合**不一致**时，丢弃该条目。
- 解析为 `NoSymbol` 的键名视为无贡献，不构成冲突——实测
  `xkb_keysym_from_name("enter", CASE_INSENSITIVE)` 为 NoSymbol，
  而 `KEY_ALIASES` 中 `enter` 与 `return` 都规范化为 `RETURN`。
- **Apple 并集**：`has_apple_keyboard()` 为真时，把 `BackSpace` 的 keycode 并入 `DELETE` 条目。
  苹果键盘上标着 delete 的键发送 `BackSpace`(kc22)，而 `DELETE` 解析到 kc119；
  现有等价规则以数据形式保留，不再依赖判定层的特例分支。
- **同一规范化名称下只要有一种拼写解析不出 keycode，整条丢弃。**
  `canonical_key()` 把 `enter` 与 `return` 都归一为 `RETURN`，而 `enter` 是 NoSymbol：
  若只跳过不可解析的拼写，`return` 建立的条目会让 `SUPER, enter` 也显得可达，
  而 Hyprland 根本不会触发它。
- 上限：条目 ≤ 256、每项 keycode ≤ 16、序列化后 ≤ 4 KiB。
  **超限一律降级，不得截断**——截断会产出一张看似权威、却会拒绝合法 keycode 的表。

实测体积：本机 239 条绑定、131 个不同 key 值，us 解析出 64 项共 **988 字节**，de 为 62 项 962 字节。

### 5.8 producer · 输出

`write_stream()` 的 header 增加两个字段：

- `keycodeMap`：上表；降级时为 `{}`。空表的含义取决于是否存在候选：
  若没有任何绑定给出 keysym 名（全是 `code:` / mouse / switch），空表就是**权威结论**；
  若存在候选却一个都没解析出来，则判为降级——消费端把「不在表中」读作「没有键能命中」，
  发布这样一张表会让所有绑定都答不出来。
- `keymapSource`：`"global-rmlvo" | "none"`，
  供测试与诊断使用；`"none"` 即降级模式。

早期草案曾自我约束"不改 schema"。该约束会把设计逼成 keysym → keycode 的一对一解析，
方向与 Hyprland 相反且天然有损，故予以取消。producer 与 consumer 同仓库同步发布，
不存在版本错配。

实测开销：keymap 编译加全表扫描约 2 ms，反查约 0.1 ms，加一次 `hyprctl --batch`，
远低于 `bounded-relay` 的 4 秒 deadline。

### 5.9 consumer（`lib/KeybindSource.qml`）

header 校验新增两个字段，遵循加固方案 04 的原型安全要求：

- `keycodeMap` 必须是对象且非数组；条目 ≤ 256（空表合法，见 5.8）；键为字符串、长度 ≤ 128，
  拒绝 `__proto__` / `constructor` / `prototype`；值为数组、长度 ≤ 16，
  元素经 `safeInteger(v, 0, 65535)` 校验；以 `Object.create(null)` 重建，不保留原对象。
- `keymapSource` 必须是上述两个字面量之一。
- 违反任一条时**丢弃整张表并置 `keymapSource` 为 `"none"`**（即降级），不使整条快照失败。

新增 `property var keycodeMap: ({})` 与 `property string keymapSource: "none"`，
在 `settle()` 中与 `fingerprint`、`appleKeyboard` 一同原子采纳，`refresh()` 中一并重置。
新增只读 `readonly property bool keymapAuthoritative: root.keymapSource !== "none"`。

### 5.10 判定（`lib/InputNormalizer.js`）

```js
function matches(binding, input, options) {
  if (!binding || !input || Number(binding.modMask || 0) !== Number(input.modMask || 0)) return false
  if (binding.matchMode === "physical") return Number(binding.keycode || 0) === Number(input.physicalCode || 0)

  var opts = options || {}
  var expected = canonicalKey(binding.key)
  var code = Number(input.physicalCode || 0)

  // 权威模式：表是唯一依据，缺席也是结论。
  if (opts.keycodeMap && code) {
    var codes = Object.prototype.hasOwnProperty.call(opts.keycodeMap, expected)
      ? opts.keycodeMap[expected] : null
    return Array.isArray(codes) && codes.indexOf(code) !== -1
  }

  // 降级模式，或事件不携带键码（输入法虚拟键盘）。
  var received = canonicalKey(input.logicalKey)
  if (expected === received) return true
  return Boolean(opts.appleKeyboard && expected === "DELETE" && received === "BACKSPACE")
}
```

`opts.keycodeMap` 仅在权威模式下由调用方传入；降级时传 `null`。

`physicalCode === 0` 的窄回落是必要的：本机存在 `hl-virtual-keyboard-fcitx5` 等虚拟键盘，
其事件可能不携带键码。这是有原则的例外，不是把错误链放回来。

`input.physicalCode` 取自 `event.nativeScanCode`，在 Qt Wayland 下为 xkb keycode（evdev + 8）。

### 5.11 可达性过滤（`lib/Eligibility.js`）

`reason()` 新增一条，位于 `missing-key` 之后、`device-special-key` 之前：

```js
if (opts.keymapAuthoritative && binding.matchMode !== "physical"
    && !Object.prototype.hasOwnProperty.call(opts.keycodeMap, Normalizer.canonicalKey(binding.key)))
  return "unreachable-on-layout"
```

含义是"该绑定在本布局的 base level 上按不出来，Hyprland 自身也不会触发"。
被排除的条数与既有 `rejected` 一样通过 `console.warn` 提示一次。

**影响面须提前知悉**：AZERTY 的 base level 没有任何键产生 `1`，因此
`bind = SUPER, 1` 在 fr 下本就不触发，会被一并排除。这是正确行为；
Omarchy 的工作区切换实测使用 `code:10`..`code:19`（共 59 条 `code:` 绑定），
走 physical 路径不受影响，库存配置不会受损。

### 5.12 调用点（`Keycade.qml`）

`:434` 与 `:438` 两处 `Normalizer.matches()` 的 options 增加
`keycodeMap: keybinds.keymapAuthoritative ? keybinds.keycodeMap : null`；
`Eligibility.filter()` 的 options 增加 `keymapAuthoritative` 与 `keycodeMap`。

## 六 · 为什么可以关闭逻辑分支

关闭它的唯一风险是：若 `nativeScanCode` 不是 xkb 键码（evdev + 8），全部卡片都将无法作答。

**该前提已在生产中被证明。** Omarchy 有 **59 条 `code:` 绑定**（工作区切换整组），
Keycade 现在就以 `matchMode: "physical"` 精确比较键码训练它们，用户一直正常作答。
若单位有误，这 59 张卡今天即全部不可答。

其余现有依据一致：`PHYSICAL_FALLBACKS` 的 `10 → "1"`、
`tests/qml/tst_algorithms.qml` 的 TAB 23 / SPACE 65 / SLASH 61 均为 xkb 单位。

实施前仍应以 `dev/InputProbe.qml` 按一次逗号键复核（期望 59 而非 51）。

## 七 · 改动文件

| 文件 | 改动 |
| --- | --- |
| `bin/keybinds-json` | `hyprctl --batch getoption`、keymap 来源选择、RMLVO 字符校验、libxkbcommon 绑定、raw key sidecar、两个 header 字段 |
| `lib/KeybindSource.qml` | 校验并采纳 `keycodeMap` 与 `keymapSource`，新增 `keymapAuthoritative` |
| `lib/InputNormalizer.js` | `matches()` 改为权威 / 降级双模式 |
| `lib/Eligibility.js` | 新增 `unreachable-on-layout` |
| `Keycade.qml` | 两处判定调用点与 `Eligibility.filter()` 传入新 options |
| `tests/test_keybinds_json.py` | 来源选择、降级条件、RMLVO 校验、sidecar 对齐、ctypes 加载与释放 |
| `tests/qml/tst_algorithms.qml` | 双模式判定与可达性过滤用例 |
| `tests/qml/keybind_source_smoke.qml` | 新字段校验与丢弃用例 |
| `README.md` / `README.zh-CN.md` | 说明按键判定依据物理键位，以及不可达绑定不参与训练 |
| `docs/hardening-plan.md` | §01 边界清单补入 `hyprctl getoption`，与既有三条同类 |

## 八 · 验收

### 8.1 keymap 来源选择

- `resolve_binds_by_sym=false` + 无 `kb_file` → `keymapSource == "global-rmlvo"`，group 0。
- `kb_file` 已设置（任意路径形式）→ `"none"`。
- 家目录存在 `.xkb` 或 `.config/xkb` → `"none"`（临时家目录 + `pwd` 打桩）。
- `resolve_binds_by_sym=true` + 全部键盘沿用全局布局 + `num_layouts==1` → `"global-rmlvo"`，
  **不因该标志降级**。
- `resolve_binds_by_sym=true` + 任一键盘 rules 与全局不同 → `"none"`。
- `resolve_binds_by_sym=true` + `num_layouts > 1` → `"none"`。
- 全局 `kb_options` 参与编译：`compose:caps` 生效时 CapsLock 的 base keysym 随之改变。

### 8.2 编译与 ABI

- libxkbcommon 路径检查：非普通文件 / 非 root 属主 / 组或全局可写时拒绝加载并降级。
- `xkb_keymap_new_from_names2` 不可用时回退成功（模拟 < 1.11.0）。
- 影响 include path 的环境变量在建 context 前被清除；源码中不出现硬编码的
  `/usr/share/X11/xkb`。
- 枚举出的 include path 逐项校验：出现非 root 属主或组/全局可写目录（如 `/tmp`）时降级；
  路径数为 0 时降级。
- 启动方传入 `--xkb-environment-overridden` 时直接降级，且不再调用 `hyprctl getoption`。
- `resolve_binds_by_sym` 为 `{"str":"true"}` / `{"bool":1}` / `{"bool":null}` / 缺失时降级。
- `getoption` 回复含重复或非预期选项名时拒绝。
- 单个 keysym 的 keycode 数超过上限时抛错降级，**不得截断**；Apple 并集导致溢出同样降级。
- RMLVO 字符校验：`/etc/passwd`、`../../../etc/passwd`、`"us\n"`、超长串一律降级，
  且**不得**调用 `xkb_keymap_new_from_names*()`。
- RMLVO 合法取值全部通过：`us`、`us,de`、`pc105`、`compose:caps,shift:both_capslock_cancel`。
- libxkbcommon 的 stderr 不进入 stdout，也不进入 QML。

### 8.3 表内容

- `l "de"`：`,` → `[59]`；`SLASH`、`grave` 不出现在表中。
- `l "fr"`：`,` → `[58]`；`-` → `[15]`。
- `l "us"`：`,` → `[59]`；`/` → `[61]`；`` ` `` → `[49]`。
- 小键盘不与主键区合并：`-` 的条目只含 kc20，不含 kc82（`KP_Subtract`）。
- Apple 并集：`appleKeyboard` 为真时 `DELETE` 条目同时含 kc119 与 kc22；为假时只含 kc119。
- 冲突条目被丢弃。
- **`enter` 与 `return` 同时存在时 `RETURN` 条目被丢弃**，两种顺序结果一致——
  不可解析的拼写不得借用另一种拼写的键。
- 条目 / keycode / 字节任一超限即整体降级。
- 无候选时空表为权威结论；有候选但全部失败时降级。
- raw key sidecar 与记录索引对齐，JSON 与 plain 两条 snapshot 路径分别验证，含被拒绝记录的占位。
- `SUPER + ALT + code:10`、`mouse:272`、`mouse_up`、`switch:off:...` 不被送入
  `xkb_keysym_from_name()`，既不产生条目也不报错。
- `matchMode` 不因本次改动由 `"logical"` 变为 `"physical"`；已有 `code:NN` 的 `keycode` 不被改写。
- JSON 与 plain 记录的对齐结果与改动前逐条一致。

### 8.4 consumer

- `keycodeMap` 缺失 / 非对象 / 数组 / 超量 / 非法元素 / 含 `__proto__` 时整张表被丢弃，
  `keymapSource` 置 `"none"`，快照其余部分照常采纳。
- `keymapSource` 非两个字面量之一时同样降级。
- 采纳后的表以 `Object.create(null)` 构建，`keycodeMap["__proto__"]` 不可达。
- `refresh()` 重置、`settle()` 原子采纳。

### 8.5 判定

权威模式：

- `{ key: "," }` + `{ ",": [59] }` 对 `{ physicalCode: 59, logicalKey: ";" }` **通过**（成员 1）。
- 同一绑定对 `{ physicalCode: 94, logicalKey: ";" }` 不通过。
- `{ key: "-" }` + `{ "-": [20] }` 对 `{ physicalCode: 82, logicalKey: "-" }` **不通过**（成员 4）。
- 表中无条目的绑定：任何输入均不通过（成员 3 的兜底）。
- `physicalCode === 0` 时回落逻辑分支并通过。
- modMask 不一致时不通过。

降级模式：

- `keycodeMap` 为 `null` 时，逐条回归现有全部用例，结果与改动前完全一致。
- Apple DELETE / BACKSPACE 等价规则在降级模式下仍生效。

### 8.6 可达性过滤

- 权威模式下，表中无条目的 logical 绑定被排除为 `unreachable-on-layout`。
- `matchMode: "physical"` 的绑定**不**受该规则影响。
- 降级模式下该规则不生效。
- fr 布局下 `SUPER, 1` 被排除，而 `SUPER, code:10` 保留。

### 8.7 真机

- US 布局：现有绑定判定结果与改动前一致，学习进度与掌握度不变；
  小键盘减号不再被判为主键区减号（成员 4 修复确认）。
- `dev/InputProbe.qml` 按逗号键，确认 `nativeScanCode` 为 59 而非 51。
- `hyprctl keyword input:kb_layout de` 临时切换复现 issue 场景并验证，验证后立即恢复。
- 切换 `input:resolve_binds_by_sym` 为 true，确认单布局下仍为权威模式；
  临时改为多布局后确认降级且判定退回改动前行为。

## 九 · 证据清单

| 结论 | 来源 |
| --- | --- |
| 绑定判定用 keysym 比较，非 keycode 比较 | `KeybindManager.cpp:276-283` @ v0.56.1 |
| 解析发生在 base level | `KeybindManager.cpp:332`、`IKeyboard.cpp:382`（mask 全 0） |
| 默认分支使用全局 `kb_*` / `kb_file`，不参考设备 | `KeybindManager.cpp:289-332` |
| `resolve_binds_by_sym` 切换 per-keyboard + 活动 group | `KeybindManager.cpp:369`、`IKeyboard.cpp:382` |
| Hyprland 使用 `XKB_KEYSYM_CASE_INSENSITIVE` | `KeybindManager.cpp:278` |
| 本机默认 `resolve_binds_by_sym` 为 false 且未被 Omarchy 设置 | `hyprctl getoption` 实测 |
| `kb_file` 未设置时返回 `[[EMPTY]]` | `hyprctl -j --batch getoption` 实测 |
| 各布局 level0 / level1 键位数据 | libxkbcommon 1.13.2 实测 |
| `us,ru` group1 的 kc24 为 `Cyrillic_shorti`（多布局开 true 会失去全部拉丁绑定） | 实测 |
| `de` 的 `num_layouts == 1`，活动 group 恒为 0 | 实测 |
| kc82 base 为 `KP_Subtract`、kc20 为 `minus`（成员 4） | 实测 |
| 多码 base keysym 全为 `XF86*` / `PRINT`，已被 `Eligibility.isDeviceSpecialKey()` 排除 | 实测 + `lib/Eligibility.js:29-31` |
| Omarchy 有 59 条 `code:` 绑定，证明 xkb 键码单位已在生产中验证 | `hyprctl binds` 实测 |
| `append_default()` 加入 `/usr/share/xkeyboard-config-2` 而非 `/usr/share/X11/xkb` | 实测 |
| `XDG_CONFIG_HOME` 会让 `append_default()` 前置用户目录，`XKB_CONFIG_ROOT` 会整个替换系统路径 | 实测 |
| `re.match(r"^...$", "us\\n")` 为真，`fullmatch` 为假 | 实测 |
| `xkb_keysym_from_name("enter", CI)` 为 NoSymbol，而 `enter`/`return` 同归一为 `RETURN` | 实测 |
| `kb_layout="/etc/passwd"` 会使 libxkbcommon 真的打开并解析该文件（编译失败，无泄漏） | 实测 |
| 相对路径穿越被 include path 挡住，超长名字被库的 4096 长度检查挡住，非法 `kb_options` 被忽略 | 实测 |
| `xkb_keymap_new_from_names2` 自 1.11.0 起提供，其余符号自 0.5.0 起 | `nm -D /usr/lib/libxkbcommon.so.0` |
| `xkb_keysym_from_name("enter", CI)` 为 NoSymbol | 实测 |
| `xkb_keysym_from_name("G", CI)` 返回小写 `g` | 实测 |
| 表体积 us 988 B / de 962 B | 基于本机 239 条绑定实测 |
| Hyprland 0.56.1 全部 239 条绑定 keycode 均为 0 | `hyprctl -j binds` 实测 |
| `libxkbcommon.so.0` 为 root 属主、非组或全局可写 | `ls -l` 实测 |
| 自动化基线规则目录仅五条，均为远程执行/提权，本方案不涉及 | `scripts/security-baseline-policy.mjs` |
| 扫描器不识别 ctypes / dlopen / 动态库（1473 行检索零命中） | `scripts/security-baseline-analysis.mjs` |
| `bin/` 下无扩展名文件一律按 shell 解析 | `security-baseline-analysis.mjs:16-23` |
| `installer` 能力为纯文件名判定 | `security-baseline-analysis.mjs:1334-1338` |
| 本仓库对全部触发式零命中 | `git grep` 实测 |

## 十 · 安全评审预期与风险

结论以市场仓库 `omacom/omarchy-plugin-marketplace` 的规则源码为准，非推测。
基线版本 `securityBaselineVersion = "3"`，`enforcementMode = "selective"`。

### 10.1 自动化基线：风险接近零

判定模型（`scripts/security-baseline-policy.mjs`）：

```js
outcome = findings.length ? "needs-fixes"
        : capabilities.length ? "review-required"
        : "passed"
```

**规则目录只有五条**，全部围绕远程代码执行与提权：`curl-pipe-shell`、`cargo-git-unpinned`、
`remote-git-execution-unpinned`、`sudoers-dangerous-passwordless-command`、
`privileged-process-control-from-shared-temp`。本方案一条都不涉及。

**能力目录七项**：`installer`、`package-manager`、`privilege`、`remote-build`、
`bundled-executable-binary`、`service-management`、`sudoers-modification`。本方案一项都不新增。

**扫描器完全不认识动态库加载。** 对 `security-baseline-analysis.mjs`（1473 行）检索
`ctypes` / `dlopen` / `CDLL` / `LD_PRELOAD` / `LD_LIBRARY` / `shared object` **零命中**。
因此加载 libxkbcommon 既不产生 finding 也不产生 capability。既有 `ctypes.CDLL("libc.so.6")`
在已上架 commit 中通过自动基线，亦为佐证。

### 10.2 实施期必须遵守的扫描器约束

`isShellRuntimePath()`（`security-baseline-analysis.mjs:16-23`）第 20 行：

```js
if (!basename.includes(".") && /^(?:bin|scripts)\//i.test(normalized)) return true;
```

**`bin/` 下无扩展名的文件一律按 shell 解析**，与实际语言无关。因此
`bin/keybinds-json`、`bin/state-store`、`bin/bounded-relay` 的 Python 源码会被当作
shell 命令序列逐条扫描。实施时这三个文件（以及根 README 的 shell 代码块）中不得出现：

| 字面量 | 触发 | 检测点 |
| --- | --- | --- |
| `sudo` / `pkexec` | `privilege` 能力 | `invokesPrivilegeBoundary()` |
| `systemctl` / `systemd-run` | `service-management` | 正则直接匹配 |
| `pip install` / `python -m pip install` | `package-manager` | 正则直接匹配 |
| `pacman` / `paru` / `yay` / `apt` / `cargo install` / `npm install` | `package-manager` | 正则直接匹配 |
| `git clone` / `git fetch` / `curl` / `wget` | `remote-build` | 配合仓库归属判定 |

整行注释由 `isCommentOnly()` 过滤，行内 `#` 注释在 privilege 检查前由 `stripInlineComment()`
剥离，但**字符串字面量不会被剥离**。文档中描述这些命令是安全的：`docs/*.md` 既非
`isShellRuntimePath` 也非根 README，不参与命令提取。

另两条文件级约束：

- `installer` 能力是纯文件名判定：`/(?:^|[-_])(install|installer|setup|uninstall)(?:[-_.]|$)/i`。
  新增测试文件**不得**命名为 `test_install*.py` 之类。
- `bundled-executable-binary` 要求 `entry.binary && mode === "100755"`；纯文本 Python 不触发。

实测当前仓库对上述全部触发式**零命中**；规模 57 个文件、最大 178 KB，远低于
`securitySnapshotFileLimit = 1000` / `securityFileByteLimit = 512 KiB` /
`securitySnapshotByteLimit = 8 MiB`。

只要遵守上表，结果仍为 `passed`（零 findings、零 capabilities），
即 `securityBaselineEligibleForVerifiedListing()` 的最优路径。一旦引入任一能力，
结果降为 `review-required`——仍可上架，但每次都需要维护者额外确认，摩擦显著增加。

### 10.3 人工评审：不重开任何一条旧账

两轮人工评审共 8 条结论已固化为 [`docs/review-invariants.md`](review-invariants.md) 的 R1–R8，
本方案的逐条复核表见该文档「当前方案的逐条复核」一节，**结论为 8 条全部满足，R7 相对现状还有改善**。
此处只摘录第一轮六条的核对结果：

| 旧评审项 | 是否重开 | 依据 |
| --- | --- | --- |
| 01 执行用户配置 | 否 | 只消费 hyprctl 输出与 root 属主的系统 XKB 数据；`kb_file` 与用户 XKB 覆盖目录一律降级 |
| 02 无上限 | 否 | 新增表设 4 KiB / 256 项 / 每项 16 码上限；解析对象为系统只读数据 |
| 03 路径读写 | 否 | 方案中不存在按用户提供的路径打开文件的代码 |
| 04 原型污染 | 否 | 新字段按 §04 以 `Object.create(null)` 重建并拒绝危险键 |
| 05 AutoText | 否 | 无新增 UI 文本；排除计数与既有 `rejected` 一样走 `console.warn` |
| 06 可替换路径 | 否，且有改善 | 库按绝对路径加绑定可信检查加载，既有 `libc.so.6` 的 soname 加载一并收敛 |

余下三处新增面及预置回答：

**① 加载 libxkbcommon。** 绝对路径 `/usr/lib/libxkbcommon.so.0` + `trusted_command()` 同款检查；
执行位置在**短命子进程**内，由 `bounded-relay` 施加字节、deadline 与进程组约束，
异常经既有 exit-code 路径收敛，不触及长驻的 QML 进程。

**② 新增一次子进程。** 一次 `hyprctl --batch`，走既有 `trusted_command()` 与有界
`command_output()`，命令串为固定字面量、无任何插值。
**须同步在 `hardening-plan.md` §01 边界清单补入 `hyprctl getoption`** ——
该清单当前只列了三条 hyprctl 命令，不补会被视为未申报的新增。

**③ 新增 schema 字段。** 见 5.9 的校验规则，违规丢弃而非整体失败。

### 10.4 残留风险

**用户配置串进入解析文件的 API。** 这是本方案中唯一仍由用户可控数据驱动的路径。
实测 `kb_layout = "/etc/passwd"` 会使 libxkbcommon 真的打开并解析该文件——编译随即失败，
无内容泄漏、无副作用，但性质上是一个由配置串驱动的任意文件打开原语。
5.4 的字符白名单（长度 ≤ 128、字符集 `[A-Za-z0-9_,:.+()-]`、拒绝 `/` 与 `..`）
在调用前拦截，且**校验失败即降级，不做截断或清洗**。该风险与缓解措施应在提交评审时主动列出。

**覆盖率取舍。** 设了 `input:kb_file` 或拥有自定义 XKB 目录的用户不会得到修复，
退回今天的行为。这是为守住 §01 边界主动付出的代价，而非疏漏，应在评审说明中写清楚。

**流程。** 推送后市场页面显示 `Update unverified`，需走 `verify-plugin.yml` 的
"publish a newer upstream commit" 并等待维护者重新标记 `approved-and-verified`。
此期间用户安装与更新不受影响。

## 十一 · 验收命令

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_keybind_source_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
omarchy plugin validate .
```

## 十二 · 发布

插件已在市场上架，代码分发走 `omarchy plugin update luneth90.keycade`（拉取上游 HEAD），
用户无需等待任何流程即可获得修复。

上架时记录的 `listingValidatedCommit` 仍指向审核通过的 commit，推送后市场页面会显示
`Update unverified`。届时通过 `verify-plugin.yml` 的 "publish a newer upstream commit"
表单提交新 commit SHA，等待维护者重新标记 `approved-and-verified` 即可恢复。
此过程不影响用户安装与更新。
