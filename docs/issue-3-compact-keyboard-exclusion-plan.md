# issue #3 · 紧凑配列按键不可达

起因是 [issue #3](https://github.com/luneth90/keycade/issues/3)（GerritWanderer 报告）：
用户在 75% 紧凑键盘上遇到 `CTRL+ALT+DELETE`（关闭所有窗口），因物理键盘缺少独立
`DELETE` 键而无法输入，要求提供在训练中跳过该按键的选项。

本文分两部分：**第一部分是已落地的缓解**（把 `DELETE` 并入既有的设备特殊键排除
清单），**第二部分是尚未设计完成的通用方案**（用户自定义排除）。两者不是同一件事，
第一部分只解决被报告的这一例。

---

## 一 · 缺陷现象与根本原因

以下四条均已对着实现核对，非推测。

### 1. 纠错死锁

`Keycade.qml` 的主循环在超时或按错后进入 `correctionRequired`，此时必须输入完全正确的
和弦才能推进（`completeCorrection()`）。物理上按不出目标键的用户被永久卡住。
按 Esc 退出也无用：`saveRunSession()` 会把 `correctionRequired` 一并持久化
（`Keycade.qml:324`），下次 Resume 经 `showCard(session.correctionRequired)`
（`Keycade.qml:365`）恢复到同一张死锁卡。

### 2. 调度死循环

运行时"临时跳过"治标不治本。失误会经 `scheduleRetest()` 在同局稍后被
`Scheduler.insertRemedial` 重新插入；即使跳过整局，该键作为 `unseen` 或 `weak`
在后续每局都会被 `coverageOrder` 优先抽入。

### 3. 100% 精通阻断

精通分母是 `Stats.counts()` 的 `total: bindings.length`（`lib/Stats.js:314`），
按 `eligibleBindings` 计算；`checkFirstMastery()` 要求 `mastered === total`。
不可达按键只要还在合规集合里，全通庆祝就永远触发不了。

### 4. Apple 键盘的虚假肌肉记忆

`bin/keybinds-json` 的 `keycode_map()` 在检测到 Apple 键盘时把 `BackSpace` 的
keycode 并入 `DELETE`，`lib/InputNormalizer.js` 的 `trainingKey()` / `matches()`
另有一份同向特例。苹果用户按右上角会被判对，但在真实 Hyprland 下内核发的是
BackSpace，绑定根本不触发——训出来的按键在实机无效。

---

## 二 · 已落地：把 DELETE 并入设备特殊键清单（v0.4.1）

### 1. 改动

`lib/Eligibility.js` 的 `deviceSpecialKeys` 增加 `"DELETE"`。三条 Omarchy 默认
DELETE 绑定（关闭所有窗口、关闭屏幕、屏幕镜像）在所有设备上被判为
`device-special-key` 并排除，issue #3 报告的那一例即刻消失。

### 2. 清单判据（L1 要求的出处）

`deviceSpecialKeys` 的判据是**物理键盘上不保证存在**，具体取"常见 60%/65%/75%
与 HHKB 裁掉的导航/编辑簇，加上它上方的 print/system 键"。这不是任何规范能锚定的
清单，因此不能声称它有权威出处——**它是一条按主流紧凑配列调过的经验判据**，
判据本身写在 `lib/Eligibility.js` 的注释里，随配列生态演进需要复核。

判据无法做到自洽这一点必须写明：60% 键盘同样没有独立方向键，而方向键仍在训练池中
（65%/75% 保留方向键、砍掉导航簇，40% 与 60% 用户则通过层切换按到）。这类"清单覆盖
不到"的缺口正是第三节通用方案存在的理由，**不要试图靠继续往清单里加键来解决**。

同时这条改动**推翻了 d0cd1dd（`fix: omit dedicated navigation keys from training`）
当初的决定**：那次特意把 `DELETE` 留在导航簇之外，并在
`tests/qml/tst_algorithms.qml` 里写死了"DELETE 可训练"的断言。

### 3. 连带的行为变更（已确认，非副作用）

排除 `DELETE` 会改变歧义扫描看到的东西。`Eligibility.filter()` 先按 `reason()`
过滤，再用剩下的 candidates 建 `signatures` 判定 `ambiguous-chord`。此前在 Apple
键盘上，`trainingKey()` 的合并让 `SUPER+DELETE` 与 `SUPER+BACKSPACE` 撞成同一个
chord，两条一起被判 `ambiguous-chord` 丢弃；现在 `DELETE` 在 `reason()` 阶段就出局，
进不了 `signatures`，于是 **`SUPER+BACKSPACE` 独占该 chord 并重新进入训练池**。

这对该硬件是正确答案——那颗键本来就发 BackSpace。测试
`test_excludingDeleteFreesTheAppleBackspaceBind` 把这个新事实钉住。

### 4. Apple 特例代码本次不动

Tier 1 落地后，`bin/keybinds-json` 的 keycode 合并与 `InputNormalizer` 的
`trainingKey()` / `matches()` 特例对**训练**已成死代码：DELETE 绑定在 `reason()`
就被拦下，永远不会成为卡片，走不到 chordId 与 matches。留着无害，而拆除要动 helper
的输出 schema 与 `lib/KeybindSource.qml` 的 header 校验——那是 issue #1 评审正在看的
同一片代码。等 issue #1 合入后单独一次改动清理，届时一并决定 `appleKeyboard` 这个
header 字段是整条拆掉还是留作诊断。

### 5. 可逆性与数据影响

stats 按 binding id 存，精通率分母按 `eligibleBindings` 现算。DELETE 移出训练池
只是不再参与统计，历史进度仍留在 `stats.json` 里；将来通用方案把它加回来，进度原样
回来。**这次缓解没有数据代价。**

一个预期内的效果：分母少了三条，原本卡在 `total - 3` 的用户下次启动就会触发全通庆祝。

### 6. 本次缓解解决不了的

- 60%/40% 上没有方向键的用户照样会撞进同一个纠错死锁，退出后 session 还会把死锁卡
  恢复回来；
- 客制化改键、用户主观不想练的绑定，均无出路。

changelog 的口径应是"issue #3 报告的 DELETE 一例已缓解"，**不是"紧凑键盘问题已解决"**。

---

## 三 · 待设计：用户自定义排除

通用形态是**让用户把某条绑定永久移出合规集合**，可查看、可恢复。触发方式倾向顶栏
鼠标点击而非键盘快捷键：Keycade 是全屏抑制器下的盲打应用，任何键都可能是和弦的一部分，
键盘触发极易误触。

设计尚未收敛。以下是已经查清、方案必须回答的问题，避免下一轮重新踩：

1. **settings 有聚合上限。** `Session.safeId` 允许 id 长 2300
   （`lib/Session.js:5`），而 settings 写入上限 64 KiB，超限走的是
   `root.fail()`（`lib/StateStore.qml:250`）——整个状态层硬失败而不是丢字段。
   条数 × 单项长度必须由文件上限反推，不能各拍各的。
2. **全部排除会把用户锁在门外。** `maybeShowHome()` 在 `!eligibleBindings.length`
   时直接 `guard.fail(noBindings)`（`Keycade.qml:147`），而恢复入口若挂在
   home/summary 顶栏，view 就永远到不了。必须留保底路径。
3. **`eligibleBindings` 一次性计算。** 只在 `maybeShowHome()` 里算一次
   （`Keycade.qml:141`）。排除或恢复后不重算，精通分母就不变，第一节第 3 条根本没解决。
   排除宜原地过滤数组（保住 deck 里 binding 对象的一致性），恢复需完整重跑
   `Eligibility.filter`，两者都要跟一次 `refreshProgressCounts()`。
4. **排除点必须在 signatures 之后。** `item.id` 在第二个循环末尾才赋值
   （`lib/Eligibility.js:88`）；且若在第一轮就跳过被排除项，同一 chord 的歧义判定会
   随用户排除而改变，可能让原本 `ambiguous-chord` 的绑定悄悄复活——第二节第 3 条
   就是这个机制的一次真实演示。
5. **"不计入 Miss"做不到。** 进入 `correctionRequired` 之前，`missCurrent()` 已经
   `Stats.recordFirstTry(..., false, ...)` 落盘并累加 `runResults.misses`
   （`Keycade.qml:561`）。死锁场景必然先有一次 miss，要么改口径，要么显式设计回滚。
6. **settings schemaVersion 要表态。** 现为 3，`loadSettings` 只接受 `[1,2,3]`
   （`lib/StateStore.qml:127`）。留在 3：旧版本读到新文件静默丢弃排除项；升到 4：
   旧版本判为 unsupported schema 并 quarantine，**全部设置丢失**。
7. **resume 与残留 id。** `Session.restoreCards` 以 eligibleBindings 建 map，被排除的卡
   自然掉出；但 `canResume` 要求恢复出的卡片数 > 0（`lib/Session.js:69`），整局都被排除
   时 resume 会静默失效。`pendingReinforcements` / `runResults` 里的残留 id 需一并清理。
8. **profile 命名空间。** [`app-profile-extension-plan.md`](app-profile-extension-plan.md)
   已规划每 profile 各自的 eligibility，扁平 id 数组以后会跨 profile 撞 id。
9. **产品取舍。** 通用方案落地后，本次的引擎内置排除是否应降级为"默认排除、可手动加回"，
   让全尺寸键盘用户拿回那三条绑定，一并决定。

---

## 四 · 本次改动的评审不变量复核

依 [`review-invariants.md`](review-invariants.md) 逐条复核，对象是**第二节已落地的
改动**（第三节尚未实现，不在此表内）。

| 规则 | 是否触及 | 结论与依据 |
| :--- | :---: | :--- |
| **R1 不执行用户配置** | 未触及 | 判定只读内存中已解析的 binding，不新增任何数据来源 |
| **R2 双端有界** | 未触及 | 不新增字段、条数或数据通路，`deviceSpecialKeys` 是源码内常量 |
| **R3 descriptor-relative 状态** | 未触及 | 不新增持久化字段与文件操作 |
| **R4 原型安全** | 未触及 | 无新增动态键 |
| **R5 纯文本渲染** | 未触及 | 无新增 UI 文本 |
| **R6 标准安装路径** | 未触及 | 不改安装、更新、卸载流程 |
| **R7 不经 ambient PATH 解析** | 未触及 | 不新增子进程、命令或动态库加载 |
| **R8 预分配上界与进程树回收** | 未触及 | 无新增流式 I/O 与子进程 |
| **L1 枚举外部输入标注出处** | 触及 | **守住**。`deviceSpecialKeys` 无规范可锚定，故不宣称权威出处，改为在源码注释与本文第二节第 2 点写明经验判据、其不自洽之处与复核时机；判据覆盖不到的缺口交由第三节的通用方案，而非继续扩清单 |

**结论：R1–R8 未触及，L1 已按其复核方法作答。**

---

## 五 · 验收

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
QT_QPA_PLATFORM=offscreen /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_keybind_source_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

真机复核：Omarchy 默认配置下打完整一局，确认牌面不再出现任何 DELETE 绑定，
且既有卡片与学习进度不受影响。
