# OpenIDCS Documents

> OpenIDCS · 开源 IDC 虚拟化统一管理平台 —— 官方文档站

[![Deploy](https://github.com/OpenIDCSTeam/Documents/actions/workflows/deploy.yml/badge.svg)](https://github.com/OpenIDCSTeam/Documents/actions/workflows/deploy.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

本仓库是 [OpenIDCS](https://github.com/OpenIDCSTeam) 项目的官方文档站源码，基于 **Vite + VitePress** 构建，通过 **GitHub Actions** 自动部署到 GitHub Pages。

---

## 🛠 技术栈

| 能力 | 方案 |
|------|------|
| 构建工具 | [Vite 5](https://vitejs.dev/) |
| 文档框架 | [VitePress 1.x](https://vitepress.dev/) |
| 前端框架 | [Vue 3](https://vuejs.org/) |
| 包管理 | npm (Node.js ≥ 18) |
| 国际化 | VitePress i18n（简体中文 / English） |
| 全文检索 | VitePress Local Search |
| 部署 | GitHub Actions + GitHub Pages |

---

## 📁 目录结构

```text
Documents/
├── docs/                          # VitePress 文档源目录
│   ├── .vitepress/                # 站点配置与主题
│   ├── public/                    # 静态资源
│   ├── 0-index.md                 # 中文首页
│   ├── 0-intro/
│   │   ├── 0-index.md
│   │   ├── 1-advantages.md
│   │   └── 2-quick-start.md
│   ├── 1-features/                # 功能说明，页内文件从 0-index.md 起排
│   ├── 2-deploy/
│   │   ├── 0-index.md
│   │   ├── 1-core-install.md
│   │   ├── 2-platform/
│   │   ├── 3-network.md
│   │   ├── 4-host-config/
│   │   ├── 5-images.md
│   │   ├── 6-cloudinit.md
│   │   └── 7-finance/
│   ├── 3-tools/                   # 管理工具
│   ├── 4-usage/                   # 操作教程
│   ├── 5-structure/               # 项目结构与 API
│   ├── 6-dev/                     # 开发指南
│   ├── 7-faq/                     # 常见问题
│   ├── 8-about/                   # 项目信息
│   └── 9-en/                      # 英文栏目和页面按相同规则编号
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions 构建与部署
├── package.json
├── tsconfig.json
└── README.md
```

文档目录和 Markdown 文件使用 `数字-名称` 排序。VitePress 配置会移除序号生成原有页面路径，站内链接保持不变。

---

## 🚀 本地开发

### 前置要求

- Node.js ≥ 18
- npm ≥ 9（或 pnpm / yarn 自行适配）

### 启动步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5180）
npm run dev

# 3. 生产构建（产物：docs/.vitepress/dist）
npm run build

# 4. 本地预览构建产物
npm run preview

# 5. 清理构建缓存
npm run clean
```

---

## ✍️ 编写文档

1. 在中文栏目目录下新建或修改 `.md` 文件；英文版放在 `docs/9-en/` 对应栏目中。
2. 新增文件和目录时使用 `数字-名称` 前缀，并同步调整 `docs/.vitepress/config.ts` 的导航顺序。
3. 页面 URL 由配置中的序号映射生成，正文继续使用不带序号的站内路径。
4. 修改导航与侧边栏：编辑 `docs/.vitepress/config.ts` 中的 `zhNav / zhSidebar / enNav / enSidebar`。
5. 提交到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

---

## 🌐 GitHub Pages 部署

1. 在 GitHub 仓库 **Settings → Pages** 中将 Source 设置为 `GitHub Actions`。
2. 推送代码到 `main` 分支，工作流 `.github/workflows/deploy.yml` 会自动触发：
   - `build` 作业：`npm ci` → `npm run build` → 上传 `docs/.vitepress/dist` artifact。
   - `deploy` 作业：使用 `actions/deploy-pages@v4` 发布。
3. 发布地址默认：`https://<org>.github.io/Documents/`，配置中 `base = '/Documents/'` 已经适配。
4. 若部署在自定义域名或非子路径，请修改 `docs/.vitepress/config.ts` 中的 `base`。

---

## 📦 相关仓库

- [OpenIDCS-Client](https://github.com/OpenIDCSTeam/OpenIDCS-Client) · 核心管理平台
- [Documents](https://github.com/OpenIDCSTeam/Documents) · 本文档站仓库

---

## 📄 开源协议

本文档内容基于 [AGPLv3](LICENSE) 发布。Copyright © 2024-present OpenIDCS Team.
