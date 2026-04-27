# OpenIDCS 文档站

这是 OpenIDCS 项目的官方文档站，基于 [Valaxy](https://valaxy.site/) 与 [valaxy-theme-press](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-press) 构建。

## ✨ 特性

- 🌐 **中英双语**：完整的中文 (默认) 与英文文档，通过导航栏右上角 🌐 一键切换
- 🌙 **暗黑 / 白天主题**：内置 Appearance 切换按钮，跟随系统或手动切换
- 🔍 **全站搜索**：基于 Fuse.js 的本地全文搜索
- 📱 **响应式设计**：支持桌面、平板、手机访问
- 🚀 **静态站点**：构建后纯静态托管，可部署到 GitHub Pages、CDN、对象存储等

## 📚 文档内容

文档覆盖 OpenIDCS 的全部使用与运维场景：

### 指南 (guide)
- 项目介绍 / 核心优势 / 功能概览 / 架构设计
- 快速上手 / 安装部署

### 配置 (config)
- 主控端配置 (部署、Nginx SSL、systemd、备份)
- 受控端配置 (7 种平台快速入口)

### 虚拟化平台 (vm)
- **平台对比总览** (`/vm/comparison`) — 9 大平台能力矩阵
- 容器：**Docker / Podman**、**LXC / LXD**
- 虚拟机：**VMware Workstation**、**VMware vSphere ESXi**、**Proxmox VE**、**Windows Hyper-V**
- 云平台：**青州云 Qingzhou**

每个平台页面均包含：平台简介、优缺点、适用场景、受控端安装与设置方式、OpenIDCS 对接方法、故障排查。

### 功能教程 (tutorials)
- 虚拟机管理 / 网络与端口转发 / 备份与恢复
- 用户管理 / 权限管理 (RBAC + 配额)
- 日志管理 / 监控与告警

### 关于 (about)
- 开源协议 (AGPLv3) / 免责声明 / 团队介绍

## 📁 目录结构

```
Documents/
├── package.json              # 项目配置
├── valaxy.config.ts          # Valaxy 配置 (导航、侧边栏、双语侧边栏)
├── locales/                  # UI 文本翻译
│   ├── zh-CN.yml
│   └── en.yml
├── pages/                    # 文档页面
│   ├── index.md              # 中文首页
│   ├── guide/                # 指南 (介绍 / 优势 / 功能 / 架构 / 快速上手 / 安装)
│   ├── config/               # 配置 (主控端 / 受控端)
│   ├── vm/                   # 虚拟化平台
│   │   ├── comparison.md     # 平台对比总览
│   │   ├── docker.md         # Docker / Podman
│   │   ├── lxd.md            # LXC / LXD
│   │   ├── vmware.md         # VMware Workstation
│   │   ├── esxi.md           # vSphere ESXi
│   │   ├── proxmox.md        # Proxmox VE
│   │   ├── hyperv.md         # Windows Hyper-V
│   │   └── qingzhou.md       # 青州云
│   ├── tutorials/            # 功能教程
│   │   ├── vm-management.md
│   │   ├── user-management.md
│   │   ├── permissions.md
│   │   ├── logs.md
│   │   ├── monitoring.md
│   │   ├── network.md
│   │   └── backup.md
│   ├── about/                # 开源协议 / 免责声明 / 团队
│   └── en/                   # 英文镜像 (结构与中文一致)
│       ├── index.md
│       ├── guide/
│       ├── config/
│       ├── vm/
│       ├── tutorials/
│       └── about/
└── public/                   # 静态资源 (logo、favicon 等)
```

## 🚀 快速开始

### 安装依赖

```bash
cd Documents
npm install
```

### 本地开发

```bash
npm run dev
```

默认访问地址为 http://localhost:4859。

### 构建生产版本

```bash
npm run build
```

产物输出到 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

## 🌐 双语机制

文档站采用**路径双写**方式实现中英双语，而非 URL 参数切换：

- 中文为默认语言，位于 `pages/` 根目录，访问路径如 `/guide/introduction`
- 英文为镜像版本，位于 `pages/en/` 目录，访问路径如 `/en/guide/introduction`
- 在导航栏 → 关于 → **English** 一键跳转到英文主页；英文站内通过 **中文** 链接跳回

UI 控件 (按钮、Tooltip) 翻译由 `locales/zh-CN.yml` 与 `locales/en.yml` 提供，通过右上角 🌐 按钮切换。

## 🌙 主题切换

主题 `valaxy-theme-press` 原生支持亮色 / 暗色切换：

- 导航栏右上角点击 🌓 图标可切换
- 默认跟随系统偏好 (`prefers-color-scheme`)
- 选择会持久化到 `localStorage`

## 📝 贡献文档

1. Fork 本仓库
2. 创建分支：`git checkout -b docs/your-feature`
3. 编辑对应 `pages/` 下的 Markdown 文件
4. 若修改中文页面，请同步更新 `pages/en/` 下的英文版本
5. 提交并发起 Pull Request

### 编写规范

- 使用清晰的标题层级 (H1 每页仅一个)
- 代码块标注语言 (\`\`\`bash / \`\`\`python / \`\`\`json 等)
- 复杂流程使用 Mermaid 图；表格用于能力对比
- 使用 `::: tip / warning / danger` 自定义容器突出重点
- 中文与英文版本保持结构、章节、链接对应

## 🛠️ 技术栈

- [Valaxy](https://valaxy.site/) — 基于 Vite + Vue 3 的静态站生成器
- [valaxy-theme-press](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-press) — 文档主题
- [vue-i18n](https://vue-i18n.intlify.dev/) — UI 多语言
- [Fuse.js](https://www.fusejs.io/) — 本地全文搜索
- [Mermaid](https://mermaid.js.org/) — 流程图 / 时序图

## 📄 许可证

- 文档内容：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- 代码示例：[MIT License](https://opensource.org/licenses/MIT)
- OpenIDCS 主项目：[AGPLv3](https://github.com/OpenIDCSTeam/OpenIDCS-Client/blob/main/LICENSE)

## 🔗 相关链接

- [OpenIDCS 主项目](https://github.com/OpenIDCSTeam/OpenIDCS-Client)
- [Valaxy 文档](https://valaxy.site/)
- [Issue 反馈](https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues)
- [Gitter 讨论](https://gitter.im/OpenIDCSTeam/community)

## 🌐 GitHub Pages 部署

本项目已通过 `.github/workflows/` 配置 GitHub Pages 自动部署，推送到 `main` 分支即触发构建与发布。

### 启用步骤

1. 仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 推送至 `main` 后自动构建部署

### 访问地址

- https://openidcsteam.github.io/Document/

### 手动触发

在 GitHub Actions 页面选择 **Deploy to GitHub Pages** 工作流 → Run workflow。

---

**OpenIDCS Team** — *Open Source, Open Future*
