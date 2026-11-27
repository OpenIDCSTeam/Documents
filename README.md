<div align="center">
  <img src="docs/public/logo.svg" width="120" height="120" alt="QuickIDC" />

  <h1>QuickIDC Documents</h1>

  <p><em>QuickIDC 开源 IDC 虚拟化统一管理平台 · 官方文档站</em></p>
  <p>基于 Vite + VitePress 构建，中英双语，推送即自动发布到 GitHub Pages</p>

<a href="https://github.com/QuickIDC/Documents/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/QuickIDC/Documents/deploy.yml?branch=main&style=flat-square&label=deploy" alt="Deploy" /></a>
<a href="https://github.com/QuickIDC/Documents/commits/main"><img src="https://img.shields.io/github/last-commit/QuickIDC/Documents?style=flat-square" alt="Last commit" /></a>
<a href="./LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-9F7AEA?style=flat-square" alt="License" /></a>
<a href="https://vitepress.dev/"><img src="https://img.shields.io/badge/VitePress-1.x-2F6BFF?style=flat-square&logo=vite&logoColor=white" alt="VitePress" /></a>

🌐 [在线文档](https://idcdoc.opkg.cn) · 🏠 [主项目](https://github.com/QuickIDC/CloudHost) · 🐛 [文档纠错](https://github.com/QuickIDC/Documents/issues)

</div>

---

## 项目简介

本仓库是 [QuickIDC](https://github.com/QuickIDC) 的官方文档站源码。文档覆盖产品介绍、功能说明、部署教程、管理工具、操作手册、项目结构与开发指南，同时提供简体中文与英文两个语言版本。

站点由 **VitePress** 驱动，使用 **GitHub Actions** 在每次推送到 `main` 后自动构建并发布到 GitHub Pages，正式域名为 <https://idcdoc.opkg.cn>。

## 文档内容

| 栏目 | 内容 |
|------|------|
| 项目简介 | 产品定位、核心优势、快速开始 |
| 功能特性 | 平台支持、虚拟机生命周期、Web 控制台、网络、存储、用户与权限、访问方式、数据库、财务对接 |
| 部署教程 | 核心安装、各虚拟化平台接入、网络配置、主机配置、镜像管理、CloudInit、财务系统对接 |
| 管理工具 | `quickidc` CLI 与桌面客户端 |
| 功能教程 | 仪表盘、主机、虚拟机、NAT、反向代理、用户、任务、备份、监控 |
| 项目结构与开发 | 架构、API、环境变量、构建、代码规范、发布流程 |
| 常见问题 | 部署与使用中的高频问题 |

## 技术栈

| 能力 | 方案 |
|------|------|
| 构建工具 | [Vite 5](https://vitejs.dev/) |
| 文档框架 | [VitePress 1.x](https://vitepress.dev/) |
| 前端框架 | [Vue 3](https://vuejs.org/) |
| 图表渲染 | [Mermaid 11](https://mermaid.js.org/)（主题感知，页面内按需加载） |
| 包管理 | npm（Node.js ≥ 18） |
| 国际化 | VitePress i18n（简体中文 / English） |
| 全文检索 | VitePress Local Search |
| 部署 | GitHub Actions + GitHub Pages |

## 本地开发

### 前置要求

- Node.js ≥ 18
- npm ≥ 9（或自行适配 pnpm / yarn）

### 常用命令

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5180）
npm run dev

# 3. 生产构建（产物：docs/.vitepress/dist）
npm run build

# 4. 本地预览构建产物
npm run preview

# 5. 清理构建缓存与产物
npm run clean
```

> `dev` 与 `build` 前会自动执行 `npm run legacy`，由 `scripts/generate-legacy-pages.mjs` 生成旧路径兼容页，保证历史链接不失效。

## 编写文档

1. 中文内容写在 `docs/` 对应栏目目录，英文内容放在 `docs/9-en/` 的同名栏目中
2. 新增文件与目录使用 `数字-名称` 前缀（如 `1-core-install.md`），序号决定侧边栏顺序
3. 页面 URL 由配置中的序号映射生成，正文站内链接继续使用**不带序号**的路径
4. 导航与侧边栏：编辑 `docs/.vitepress/config.ts` 中的 `zhNav` / `zhSidebar` / `enNav` / `enSidebar`
5. 支持在 Markdown 中直接编写 Mermaid 图表；主题与组件位于 `docs/.vitepress/theme`
6. 提交到 `main` 后由 GitHub Actions 自动构建发布

> 站点 `base` 可通过环境变量 `DOCS_BASE` 覆盖，默认 `/`。

## 目录结构

```text
Documents/
├── docs/                          # VitePress 文档源目录
│   ├── .vitepress/
│   │   ├── config.ts              # 站点配置（导航、侧边栏、rewrites）
│   │   ├── legacy-redirects.json  # 旧路径重定向表
│   │   ├── plugins/               # 构建插件（Mermaid 等）
│   │   └── theme/                 # 主题、组件与样式
│   ├── public/                    # 静态资源（logo、CNAME 等）
│   ├── 0-index.md                 # 中文首页
│   ├── 0-intro/                   # 项目简介
│   ├── 1-features/                # 功能特性
│   ├── 2-deploy/                  # 部署教程
│   ├── 3-tools/                   # 管理工具
│   ├── 4-usage/                   # 功能教程
│   ├── 5-structure/               # 项目结构、API 与开发
│   ├── 7-faq/                     # 常见问题
│   └── 9-en/                      # 英文站（栏目编号规则相同）
├── scripts/
│   └── generate-legacy-pages.mjs  # 旧路径兼容页生成
├── .github/workflows/deploy.yml   # 构建与部署
├── package.json
└── tsconfig.json
```

文档目录和 Markdown 文件使用 `数字-名称` 排序，VitePress 配置会移除序号生成原有页面路径，站内链接保持不变。

## 部署

### GitHub Pages

1. 在仓库 **Settings → Pages** 中把 Source 设为 `GitHub Actions`
2. 推送代码到 `main`，`.github/workflows/deploy.yml` 自动触发：
   - `build`：`npm ci` → `npm run build` → 上传 `docs/.vitepress/dist`
   - `deploy`：通过 `actions/deploy-pages` 发布
3. 正式站点：<https://idcdoc.opkg.cn>，域名由 `docs/public/CNAME` 指定
4. 若部署到自定义域名或子路径，请设置 `DOCS_BASE` 或调整配置中的 `base`

### 其他平台

构建产物是纯静态文件，可将 `docs/.vitepress/dist` 直接部署到任意静态托管（EdgeOne Pages、Cloudflare Pages、Nginx 等）。

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [CloudHost](https://github.com/QuickIDC/CloudHost) | 虚拟化管理平台后端与内置 Web 控制台 |
| [FrontPage](https://github.com/QuickIDC/FrontPage) | Web 控制台前端源码 |
| [CloudInit](https://github.com/QuickIDC/CloudInit) | 虚拟机内初始化与状态上报服务 |
| [Documents](https://github.com/QuickIDC/Documents) | 本文档站 |

## 开源许可

文档内容基于 [AGPL-3.0](./LICENSE) 发布。Copyright © 2024-present QuickIDC Team.

---

<div align="center">
  <strong>发现文档错误或有改进建议？欢迎提交 Issue 或 Pull Request</strong>
</div>
