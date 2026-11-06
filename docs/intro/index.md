# 项目简介

OpenIDCS 是一套开源的 **IDC 虚拟化统一管理平台**：一个 Go 单二进制主控（CloudHost）、一套 React 浏览器控制台（FrontPage）、一个虚拟机内 Agent（CloudInit），再加一组财务系统插件（FSPlugins）。它把「开机器、连控制台、做端口映射、配反向代理、管用户与配额、对接计费」收进同一个面板与同一套 REST API。

::: tip 一句话定位
你有一堆宿主机、几种虚拟化平台、一个财务系统 —— OpenIDCS 负责把它们变成「一个可以卖机器的 IDC」。
:::

## 它解决什么问题

| 常见做法 | 痛点 | OpenIDCS 的做法 |
|---|---|---|
| 每台宿主机一套脚本 / 面板 | 账号、端口、镜像、备份各管一摊 | 统一主机模型，平台差异沉到驱动层 |
| 手工建 VM、手工记端口 | 交付慢、易冲突、难对账 | 实例生命周期 + NAT/反代 + 异步任务 |
| 控制台另装客户端 | 用户上手成本高 | 浏览器内 noVNC 与 Web SSH |
| 财务系统与资源脱节 | 开通/续费/暂停靠人 | IDCSmart / SwapIDC 等插件直连主控 API |

## 三个组成部分

<div class="oidc-split">
<div><strong>CloudHost（主控）</strong><br/>Go + Gin + SQLite，单二进制交付；负责主机、实例、网络、用户、任务、日志与全部 REST API。</div>
<div><strong>FrontPage（控制台）</strong><br/>React + Ant Design，管理员与用户两套视图，内置多语言与主题。</div>
<div><strong>CloudInit（Agent）</strong><br/>运行在被管虚拟机内，上报 IP、注入密码、执行初始化命令。</div>
<div><strong>FSPlugins（插件）</strong><br/>魔方财务 IDCSmart、LxdServer、SwapIDC、Easypanel、VistaPanel 对接插件。</div>
</div>

## 虚拟平台

主控内置 10 种服务器类型：

| 平台 | 引擎类型 | 运行位置 | 接入方式 |
|---|---|---|---|
| Docker / Podman | `OCInterface` | Linux / macOS | 本地或 SSH |
| LXC / LXD | `LxContainer` | Linux | 本地或 SSH |
| Proxmox VE | `PromoxSetup` | 独立宿主 | HTTPS API `:8006` |
| VMware ESXi | `vSphereESXi` | 独立宿主 | HTTPS API `:443` |
| Hyper-V | `HyperVSetup` | Windows | WinRM `:5985` |
| QEMU / KVM | `QEMUServer` | Linux | 本地或 SSH（virsh） |
| VirtualBox | `VirtualBoxs` | Win / Linux / macOS | 本机 VBoxManage |
| VMware Workstation | `VMWareSetup` | Windows | vmrest `:8697` |
| SmolVM（MicroVM） | `SmolVM` | Linux | 本地或 SSH |
| MuMu 模拟器 | `MemuAndroid` | Windows | 本机 memuc |

每个平台的能力边界（GPU、PCI/USB 直通、ISO、额外硬盘、带宽限制）不同，详见 [虚拟平台](/features/platforms)。

## 功能地图

- **实例**：创建、开机、关机、重启、强制断电、重置、重装、暂停/恢复、删除、VNC 截图。
- **控制台**：浏览器 noVNC、Web SSH、RDP/远程桌面信息。
- **网络**：NAT 端口转发、爱快 DHCP 静态绑定、Caddy 反向代理（含自动证书）。
- **存储**：镜像上传、ISO 挂载、数据盘挂载/移交、备份与恢复。
- **用户**：用户管理、配额重算、实例归属与共享、临时凭据与访问密钥。
- **运维**：异步任务、日志查看、系统设置、外部资源对账与墓碑清理。
- **计费**：魔方财务（IDCSmart / LxdServer）、SwapIDC、Easypanel、VistaPanel。

## 可以对接的销售平台

| 财务系统 | 插件目录 | 说明 |
|---|---|---|
| 魔方财务（IDCSmart） | `OpenIDC-IDCSmart` | 通用版，适配 OpenIDCS 主机 |
| 魔方财务（LXD 专版） | `LxdServer-IDCSmart` | 面向 LXD 场景的专版 |
| SwapIDC | `OpenIDC-SwapIDC` | 经典 IDC 财务系统 |
| EasyPanel | `Easypanel-SwapIDC` | EasyPanel 面板对接 |
| VistaPanel | `VistaPanel-SwapIDC` | VistaPanel 对接 |
| 小黑云 | `OpenIDC-XiaoHei` | **规划中**，当前仓库未包含实现 |

## 适合谁

- **自建 IDC / 云代理**：需要把多家虚拟化平台统一售卖与运维。
- **企业私有云**：希望用一套面板管理测试机、生产机与容器。
- **二次开发者**：需要一套清晰的 Go 主控 + React 前端 + REST API 作为底座。

## 下一步

- 想先跑起来：[快速体验](/deploy/quick-start)
- 想正式部署：[主控安装](/deploy/core-install)
- 想接平台：[虚拟化平台部署](/deploy/platform/)
- 想接财务：[财务系统对接](/deploy/finance/)
