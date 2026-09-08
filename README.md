# 影子跟读（Shadow Reading）

面向六级备考的影子跟读练习网站与材料库。每篇材料含英文正文（标粗生词）、生词自查表、好词好句·短语积累与全文中文翻译，配「整篇 + 分段」跟读音频，桌面、手机、平板均可使用。

## 在线地址

<https://tobeatian.github.io/shadow-reading/>

## 使用方式

- 首页按篇列出材料，点「进入阅读」打开单篇，或直接「播放全文」；
- 阅读页每个自然段都有独立播放按钮，适合反复回听某一小段；
- 生词与短语以表格形式展示，先自查再对照；
- 全文中文翻译放在页面最下方并默认折叠，先跟读、再展开核对。

## 材料清单

| 篇目 | 主题 | 词数 | 音频 |
|------|------|------|------|
| 001《Stop Re-reading, Start Testing Yourself》别再只重读，试试自测 | 学习策略 | 约 280 词 | 整篇约 1 分 49 秒 + 4 段分段音频 |

## 新增一篇材料的流程

1. 把本篇的 md 源稿与整篇 mp3 放入本目录（与现有篇目同目录层级）；
2. 运行 `python scripts/build_site.py`：解析 md、重建 `web/materials.json`，自动补齐每段音频（edge-tts，美音 Aria；需本机代理时用环境变量 `EDGE_TTS_PROXY` 指定）；
3. 双击 `发布网站.bat`（等价于 git 提交并推送 main），GitHub Actions 约 1 分钟自动上线；
4. 如需纸质版，另运行 `python scripts/build_print_docx.py <篇目.md>` 生成 A4 docx 打印版。

## 目录结构

```
影子跟读/
├── README.md               ← 本说明
├── publish.ps1 / 发布网站.bat  ← 一键构建并发布
├── scripts/
│   ├── build_site.py       ← md → 网页数据 + 分段音频
│   ├── build_print_docx.py ← md → A4 docx 打印版
│   └── print-reference.docx
├── web/                    ← GitHub Pages 发布目录
│   ├── index.html / read.html / app.css / app.js
│   ├── materials.json      ← 网站数据（由构建脚本生成）
│   └── audio/              ← 整篇与分段音频副本
└── .github/workflows/pages.yml ← 自动部署工作流
```

## 技术说明

- 纯静态站点：HTML + CSS + JavaScript，无框架、无后端；
- 数据单一来源为各篇 md，网页与打印版都由脚本生成，不手工维护第二份内容；
- 托管：GitHub Pages（GitHub Actions 发布 `web/` 目录），公开仓库 [TOBEATIAN/shadow-reading](https://github.com/TOBEATIAN/shadow-reading)。
