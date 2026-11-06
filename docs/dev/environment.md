# 环境搭建

## 必需工具

| 工具 | 版本 | 用途 |
|---|---|---|
| Go | 1.26+（见 `go.mod`） | 主控 / CloudInit / CLI |
| Node.js | 18+ | 前端与文档站 |
| npm | 9+ | 包管理 |
| Git | 2.30+ | — |

可选：

| 工具 | 用途 |
|---|---|
| Rust + Cargo | Tauri 桌面客户端 |
| Inno Setup 6 | Windows 安装包 |
| Docker | 本地平台测试 |
| PHP 8 | 财务插件调试 |

## 获取代码

```bash
mkdir -p ~/openidcs && cd ~/openidcs
git clone https://github.com/OpenIDCSTeam/CloudHost.git
git clone https://github.com/OpenIDCSTeam/FrontPage.git
git clone https://github.com/OpenIDCSTeam/CloudInit.git
git clone https://github.com/OpenIDCSTeam/Documents.git
```

## Go 环境

```bash
go version
go env -w GOPROXY=https://goproxy.cn,direct   # 国内
cd CloudHost
go mod download
go build ./...
```

::: tip 不需要 CGO
SQLite 使用 `modernc.org/sqlite`（纯 Go），Linux 上不需要 gcc；Windows 也不需要 MinGW。
:::

## 前端环境

```bash
cd FrontPage
npm install
npm run dev     # http://localhost:5173
```

前端默认请求同源 `/api`；本地联调可在 `.env.local` 指定后端地址（视版本）。

## 文档环境

```bash
cd Documents
npm install
npm run dev     # http://localhost:5173
npm run build   # 产出 docs/.vitepress/dist
```

## 桌面端环境（可选）

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Linux 依赖（Debian/Ubuntu）
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

cd CloudHost/tools/opidcs-gui
npm install
npm run tauri dev
```

## IDE 建议

| 工具 | 配置 |
|---|---|
| VS Code | Go + ESLint + Vue 插件 |
| GoLand | 直接打开 `CloudHost` |
| WebStorm | 打开 `FrontPage` / `Documents` |

## 常见问题

| 现象 | 处理 |
|---|---|
| `go: module not found` | 设置 GOPROXY |
| `npm install` 卡住 | 换镜像源 |
| Tauri 编译缺库 | 安装 WebKitGTK 依赖 |
| 端口占用 | 改 `--port` 或前端 `server.port` |
