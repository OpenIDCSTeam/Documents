# opidcs 桌面客户端

桌面客户端用于日常管理：本地保存多个主控、可视化查看与操作，和 CLI 共享同一套能力。

## 技术形态

| 层 | 技术 | 作用 |
|---|---|---|
| 外壳 | Tauri v2（Rust） | 窗口、托盘、自动更新、本地凭据文件 |
| 界面 | React 18 + TypeScript + Vite | 页面与交互 |
| 特权操作 | 随包 `opidcs` sidecar | 服务安装、平台安装、本机 Token 重置 |
| 远程操作 | 主控 REST API | 主机、实例、网络、用户、任务 |

::: tip 为什么用 sidecar
安装系统服务、装 Docker/LXD、读写本机配置需要本地权限。让 GUI 调 `opidcs` 而不是重写一遍，能保证「命令能做的，界面也能做」且行为一致。
:::

## 主界面

```text
┌──────────┬────────────────────────────────────────────┐
│ 概览      │  主控切换器  ● 在线   搜索   通知   设置    │
│ 主机      ├────────────────────────────────────────────┤
│ 实例      │                                            │
│ 端口转发   │   列表 / 详情抽屉 / 图表                    │
│ 反向代理   │                                            │
│ 用户      │                                            │
│ 任务      │                                            │
│ 日志      │                                            │
│ 设置      │                                            │
└──────────┴────────────────────────────────────────────┘
```

## 多主控管理

- 新增主控：名称、地址、Token，保存前做连通性测试；
- Token 存在用户配置目录下的 `cores.json`（权限 0600），不写日志、不进剪贴板历史；
- 支持默认主控、快速切换、离线状态提示；
- 同一窗口内切换不会丢当前页面。

## 页面能力

| 页面 | 能力 |
|---|---|
| 概览 | 主机/实例统计、资源曲线、最近任务 |
| 主机 | 列表、状态、新增/编辑、凭据、扫描实例 |
| 实例 | 列表、详情、电源、控制台外链、截图、备份 |
| 端口转发 | 规则列表、新增/删除、按实例过滤 |
| 反向代理 | 域名、目标、证书状态、启停 |
| 用户 | 列表、配额、启停、重置密码 |
| 任务 | 进度、取消、重试、错误详情 |
| 日志 | 级别过滤、关键字、导出 |
| 设置 | 端口、Token、管理员密码、关于/更新 |

## 危险操作

电源强制断电、删除实例、重置 Token、卸载服务均二次确认，并要求输入资源名或勾选确认框。

## 本地构建

Windows 前置：

- Rust stable（默认 `x86_64-pc-windows-msvc` 目标）；
- Visual Studio 2022 Build Tools，勾选「使用 C++ 的桌面开发」与 Windows 11 SDK（提供 `link.exe`、`kernel32.lib` 与 UCRT）。

```powershell
cd tools/opidcs-gui
npm ci
npm run icon
npm run tauri build -- --no-bundle   # 只产出可执行文件，快速验证
npm run tauri build                  # 产出 NSIS 安装包
```

Linux 需要 `libwebkit2gtk-4.1-dev`、`libappindicator3-dev`、`librsvg2-dev`、`patchelf`；macOS 需要 Xcode Command Line Tools。

## 打包与分发

| 平台 | 发布产物 | 打包方式 |
|---|---|---|
| Windows | `opidcs-<ver>-win-x64-setup.exe` | Inno Setup（`packaging/windows/opidcs.iss`）：GUI 装为 `opidcs.exe`，CLI 装到 `bin\opidcs.exe` 并写入 PATH |
| Linux | `opidcs_<ver>_amd64.AppImage` | `tauri build --bundles appimage` |
| macOS | `opidcs_<ver>_<arch>.dmg` + `.app` zip | `tauri build --target <triple> --bundles app,dmg` |

发布通道：推 `main` 生成 beta（滚动 tag `beta`），推 `v*` tag 生成正式版；两者产出同一套文件名，`checksums.txt` 覆盖全部资产。

自动更新：

- 已接入 `tauri-plugin-updater`，端点指向 Releases 的 `latest.json`；
- 启用前需生成签名密钥：公钥写入 `tauri.conf.json`，私钥存 GitHub Secrets；
- 当前流水线以「可构建」为优先，`createUpdaterArtifacts` 暂为 `false`，配置密钥后改为 `true` 即产出签名包；
- 客户端「设置 → 检查更新」已可调用检查逻辑。

## 与 CLI 的关系

```text
GUI ──HTTP──► 主控 API
 │
 └──spawn──► opidcs sidecar（本地特权）
```

因此：

- 远程管理不依赖 sidecar，当前版本已覆盖主机、实例、端口、反代、用户、任务、日志与设置；
- sidecar 通道已在 `tauri.conf.json` 的 `externalBin` 中预留，随安装包分发 `opidcs`；
- 本机操作（`core` / `plat` / `conf`）目前请使用 CLI，GUI 的按钮化调用在后续版本接入，避免文档承诺超前于实现。

## 系统要求

| 平台 | 最低 |
|---|---|
| Windows | Windows 10 1809+，WebView2 |
| Linux | glibc 2.31+，WebKitGTK 4.1 |
| macOS | 11+（Apple Silicon / Intel） |

## 相关页面

- [命令行](/tools/cli)
- [安装与更新](/tools/install)
