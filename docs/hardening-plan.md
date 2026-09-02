# Keycade 加固方案与验收标准

本文对应 Omarchy 插件市场 [issue #4305](https://github.com/omacom/omarchy-plugin-marketplace/issues/4305)
中 HANCORE-linux 对 commit `8b357f1` 的人工评审。六项均为发布阻断项，不再采用“先做部分缓解、等待维护者反馈”
的分阶段策略。

## 处理矩阵

| # | 评审问题 | 最终措施 | 验收状态 |
| --- | --- | --- | --- |
| 01 | 执行用户 Lua 配置发现绑定 | 删除 Lua scanner，从对齐的 `hyprctl binds` 纯文本记录补键 | 已实施 |
| 02 | 子进程输出、字段和模型无上限 | producer 字节/deadline/进程组限制 + QML 独立 schema/model 限制 | 已实施 |
| 03 | 状态文件按路径读写 | 全部迁移到 descriptor-relative state helper | 已实施 |
| 04 | 设置迁移原型污染 | 白名单重建设置；动态 map 使用 null prototype 并拒绝危险键 | 已实施 |
| 05 | 动态文本为 AutoText | 统一 `SafeText`、控制字符规范化、字段和布局限制 | 已实施 |
| 06 | clone-and-run installer 与可替换路径 | 删除自定义安装/卸载脚本，仅保留 Omarchy 标准命令 | 已实施 |

## 01 · 不执行用户配置

### 边界

- 不读取或执行 `~/.config/hypr/hyprland.lua`。
- 不启动 Lua 解释器，不加载用户模块。
- 只消费 `hyprctl -j binds`、`hyprctl binds` 和 `hyprctl devices` 的运行时输出。

### 实现

删除 `LUA_BIND_SCANNER`、`lua_bind_cache()` 和 `resolve_lua_keys()`。当 JSON 记录缺少 key/keycode 时，
只有在 JSON 与纯文本记录总数一致，并且同位置记录的 modmask、description 及非空 dispatcher/arg/submap
一致时，才从纯文本记录补齐键。无法确认对应关系时保留缺键状态，后续 eligibility 层会安全排除。

### 验收

- fixture 覆盖正确对齐和错位拒绝。
- 真机 239 条绑定全部恢复键名，缺键数为 0。
- 源码中不存在 `dofile`、Lua scanner 或 Lua 子进程。

## 02 · 有界子进程和双层模型验证

### Producer 边界

`bin/keybinds-json` 对每个子进程使用：

- 3 秒单调时钟 deadline。
- 独立进程组；超时或超限时杀死整个进程组并 wait 回收。
- stdout 最大 4 MiB，stderr 最大 64 KiB，同时分块读取，避免单管道死锁。
- 最终 JSON 最大 8 MiB、绑定最多 2000 条。
- key 128、dispatcher 128、arg 2048、description 512、submap 128 个字符。
- flags 最多 16 项，每项 32 字符；keycode 为 0–65535；modmask 为 0–2³¹−1。
- JSON 字段严格验证类型、枚举和范围；不把对象或数组隐式转换为字符串。

`InputGuard.qml` 不再直接运行和收集 `hyprctl`，而是调用同一 helper 的受限 `--guard-status` 接口。

### QML 独立边界

`KeybindSource.qml` 在采用模型前重新验证：

- payload 字符数、绑定数和所有字段的类型/长度/枚举/数值范围。
- 所有字符串字段的累计字符预算不超过 4 MiB。
- 只构造白名单对象，不保留 producer 返回的额外键或嵌套对象。
- helper 最长运行 5 秒；组件销毁时终止仍在运行的 helper。

QML 的长度检查不替代 producer 字节限制；`StdioCollector` 收到的数据已经由 helper 的最终 8 MiB 输出上限约束。

### 验收

- 测试覆盖 stdout 超限、deadline、字段超长、绑定超量、错位记录和控制字符。
- 真机 `--guard-status` 返回严格的 `{schemaVersion, disabled}` 小型对象。

## 03 · Descriptor-relative 状态存储

所有 stats/settings/session I/O 由 `bin/state-store` 完成，QML 不再使用 `FileView`、`mv` 或路径名写入状态。

### 目录不变量

- 只接受绝对 `XDG_STATE_HOME`；否则使用 `~/.local/state`。
- `omarchy` 和 `keycade` 通过父目录 fd 加 `O_DIRECTORY | O_NOFOLLOW` 打开或创建。
- 目录必须属于当前 uid；`keycade` 目录权限强制为 0700。
- 打开后所有文件操作绑定在该目录 fd 上，目录路径随后被替换也不会改变操作目标。

### 读取不变量

- 使用 `openat` 语义的 `dir_fd`、`O_NOFOLLOW | O_NONBLOCK`。
- `fstat` 后只接受当前 uid 拥有且链接数为 1 的普通文件。
- stats 最大 2 MiB、settings 最大 64 KiB、session 最大 512 KiB。
- 分块读取再次计算实际字节数，防止检查后增长。
- 符号链接、FIFO、特殊文件、非法 UTF-8 和超大文件通过目录 fd 安全隔离，不跟随目标。

### 写入不变量

- QML 先对白名单模型做有界序列化，helper 再限制 stdin 字节数并验证 JSON。
- 同目录创建随机临时文件，使用 `O_CREAT | O_EXCL | O_NOFOLLOW` 和 0600。
- 完整写入后执行 `fsync(temp)`，再使用 descriptor-relative `replace`，最后 `fsync(directory)`。
- 损坏文件的隔离、session 删除也只通过目录 fd 完成。
- QML 状态操作队列最多 16 项；同类待写操作合并；每次 helper 调用最多 5 秒。

### 模型不变量

- stats 最多保留 4000 个安全 binding ID；计数、时间戳、反应时间和历史数组全部设限。
- session 最多 24 张卡、24 项 run results、10 个反应时间样本；tier/queue 使用枚举。
- settings 只保留 schemaVersion、locale、theme、reducedMotion、feedbackSound、countdownSound、soundVolume。
- 加载和保存都重新构造模型，未知键不会被保留或再次序列化。

### 验收

- 测试覆盖 0700 目录、0600 文件、原子写入、超大文件、超大 stdin、符号链接、硬链接、FIFO、目录符号链接和隔离。
- Quickshell smoke test 覆盖 QML → stdin → helper → 原子文件的完整调用链。

## 04 · 原型安全

- settings 不遍历外部对象的键，直接按固定 schema 重建。
- stats bindings、session binding map 和 run results 使用 `Object.create(null)`。
- 所有来自持久化数据的动态键限制长度，并拒绝 `__proto__`、`constructor`、`prototype`。
- 数字必须有限并被夹在业务范围内；字符串形式的布尔值不会被当作 true。

验收测试使用带 `__proto__` 的真实 `JSON.parse` 对象及 `1e100` 数字，确认原型键被丢弃、数字被夹紧。

## 05 · 纯文本与控制字符

- 主界面所有 `Text` 统一替换为 `SafeText`，其固定声明 `textFormat: Text.PlainText`。
- Hyprland 字段在 Python producer 和 QML consumer 两层处理 NUL、C0/C1、双向控制与 isolate 字符。
- 动作描述、键帽、反馈和错误显示设置固定宽高、`maximumLineCount`、`elide` 或 `clip`。
- 错误消息最多 512 字符，不显示原始无限输出。

验收要求源码主界面不再直接实例化 `Text`，恶意 `<img>` 只作为普通字符显示，控制字符不会改变文本方向或布局。

## 06 · 标准安装与卸载

- 删除 `install.sh`、`uninstall.sh` 及对应路径修改逻辑。
- README 首选且唯一安装方式为 `omarchy plugin add <url> --enable`。
- 更新使用 `omarchy plugin update luneth90.keycade`。
- 卸载使用 `omarchy plugin remove luneth90.keycade`，保留学习进度。
- 项目不再自动编辑/删除 `bindings.lua`、插件目录或用户状态；快捷键由用户明确添加。

因此不再存在需要证明安全的自定义 clone-and-run、mutable `git pull`、备份、回滚或 purge-state 路径。
自动安全基线先前识别的 `installer` capability 也随脚本删除而消失。

## 发布前验收命令

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
omarchy plugin validate .
```

重新提交市场复审时应提供：修复 commit SHA、上述测试结果、真机绑定统计，以及六项逐条对应的文件链接。
