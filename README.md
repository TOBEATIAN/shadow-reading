# 影子跟读（Shadow Reading）

面向英语提升的影子跟读练习网站与材料库。每篇材料含英文正文（标粗生词）、生词自查表、好词好句·短语积累与全文中文翻译，配「整篇 + 分段」跟读音频，桌面、手机、平板均可使用。

## 使用方式

- 首页按篇列出材料，点「进入阅读」打开单篇，或直接「播放全文」；
- 阅读页每个自然段都有独立播放按钮，适合反复回听某一小段；
- 生词与短语以表格形式展示，先自查再对照；
- 全文中文翻译放在页面最下方并默认折叠，先跟读、再展开核对。

## 目录结构

```
影子跟读/
├── README.md               ← 本说明
├── 2026-09-08/             ← 材料按生成日期归档（md/mp3，本地留存）
├── publish.ps1 / 发布网站.bat  ← 一键构建并发布
├── scripts/
│   ├── build_site.py       ← md → 网页数据 + 分段音频（默认）
│   └── build_print_docx.py ← md → Word 打印版（按需，默认停用）
├── web/                    ← GitHub Pages 发布目录
│   ├── index.html / read.html / app.css / app.js
│   ├── materials.json      ← 网站数据（由构建脚本生成）
│   └── audio/              ← 整篇与分段音频副本
└── .github/workflows/pages.yml ← 自动部署工作流
```

## 技术说明

- 纯静态站点：HTML + CSS + JavaScript，无框架、无后端；
- 数据单一来源为各篇 md，网页数据与音频由脚本生成，不手工维护第二份内容；
- 托管：GitHub Pages（GitHub Actions 发布 `web/` 目录），公开仓库 [TOBEATIAN/shadow-reading](https://github.com/TOBEATIAN/shadow-reading)。
