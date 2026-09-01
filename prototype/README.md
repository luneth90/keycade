# Keycade visual prototype

零依赖的 HTML/CSS/JavaScript 交互原型，用于验证 “16-bit Desktop Arcade”
的像素街机视觉、主题适配和单一自适应对局。动作名和说明使用各语言易读的现代
字体，像素语言集中用于机台、HUD、键帽、图标和反馈动画。

## 运行

直接打开 `index.html`，或在本目录启动静态服务器：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

默认界面为英文，可在右上角即时切换 English、简体中文、日本語和 Español；
静态文字、游戏反馈和无障碍标签会一起更新。也可用 `?lang=zh-CN`、
`?lang=ja` 或 `?lang=es` 直接预览指定语言，例如：

```text
http://localhost:8080/?lang=zh-CN
```

翻译集中在 `i18n.js`，新增语言时需要补齐与英文表相同的键。

## 可交互内容

- 在同一对局中体验引导卡、回忆卡和加速卡；
- 引导卡显示答案且失误不扣命，命中后自动进入正常牌组；
- 连续命中会升级为加速卡，失误则自动增加提示，不需要手动切换模式；
- 切换 Tokyo Night、Gruvbox、Catppuccin 三个主题；
- 切换英文、简体中文、日文和西班牙文；
- 使用键盘输入当前组合键；
- 用“演示命中/失误”预览浏览器可能拦截的 Super 组合；
- 观察计时环、combo、生命值、键帽、命中粒子和失误反馈；
- 切换减弱动效。

这个原型不读取 `hyprctl binds`，也不验证 QML/Wayland 键码。真实输入映射仍由
设计文档中的 Stage 0 `InputProbe.qml` 验证。
