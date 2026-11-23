# 项目简介

**快简云**是开源 IDC 虚拟化管理平台，支持常见10余种虚拟机平台（PVE、KVM、Hyper-V、Virtual Box、ESXi、Docker、Xen、VMware、QEMU、LXC、Smol VM、Memu），创建并管理虚拟化实例周期、主机运维、用户配额、系统任务等，支持对接包括小黑云、魔方财务在内的数十种IDC销售系统。

<ScreenshotCarousel />



## 支持的虚拟平台

| 平台 | 服务器类型 | 主控接入方式 |
|---|---|---|
| Docker / Podman | `OCInterface` | 本地或 SSH 执行 `docker` |
| LXC / LXD | `LxContainer` | 本地或 SSH 执行 `lxc` |
| Proxmox VE | `PromoxSetup` | HTTPS API，默认 `:8006` |
| VMware ESXi | `vSphereESXi` | HTTPS API，默认 `:443` |
| Windows Hyper-V | `HyperVSetup` | WinRM，默认 `:5985` |
| QEMU / KVM | `QEMUServer` | 本地或 SSH 执行 `virsh` |
| Oracle VirtualBox | `VirtualBoxs` | 本机 `VBoxManage` |
| VMware Workstation | `VMWareSetup` | vmrest API，默认 `:8697` |
| SmolVM（MicroVM） | `SmolVM` | 本地或 SSH |
| MuMu 模拟器 | `MemuAndroid` | 本机 `memuc`，仅 Windows |

Hyper-V 和 MuMu 只能装在 Windows 上；SmolVM 需要宿主机有 KVM，配合 Firecracker 或 Cloud-Hypervisor 运行。GPU、PCI/USB 直通、ISO 挂载、限速和控制台，各家差别不小，逐项列在[虚拟平台](/features/platforms)。

## 功能地图

- 开机、关机、重装和删除在[实例生命周期](/features/lifecycle)；备份、镜像和 ISO 挂载见[存储与备份](/features/storage)。
- 进系统用[控制台与远程访问](/features/console)：noVNC 看画面，Web SSH 敲命令，Windows 走 RDP，安卓走 ADB。
- 网络侧是 NAT 端口转发、爱快静态绑定和 Caddy 反向代理，都在[网络](/features/network)里。
- 多用户与配额看[用户与配额](/features/users)；把实例共享给别人、发放访问密钥看[共享与访问密钥](/features/access)。
- 后台这边，耗时操作统一进[异步任务](/features/tasks)，运行数据看[监控与日志](/features/monitoring)；数据库可以换 SQLite、MySQL 或 PostgreSQL，见[多数据库支持](/features/database)。
- 对外销售时需要[财务系统对接](/features/finance)。

## 可对接的销售平台

| 销售系统 | 插件 | 状态 |
|---|---|---|
| 魔方财务（IDCSmart） | `QuickIDC-IDCSmart` | 可用 |
| 魔方财务（LXD 专版） | `LxdServer-IDCSmart` | 可用 |
| SwapIDC | `QuickIDC-SwapIDC` | 可用 |
| EasyPanel | `Easypanel-SwapIDC` | 可用 |
| VistaPanel | `VistaPanel-SwapIDC` | 可用 |
| 小黑云 | `QuickIDC-XiaoHei` | 规划中，仓库未提供 |

对接步骤与插件配置见[财务系统部署](/deploy/finance/)。

## 下一步

<div class="oidc-cta__actions">
  <a class="oidc-btn oidc-btn--primary" href="/intro/quick-start">快速部署</a>
  <a class="oidc-btn" href="/features/">功能特性</a>
  <a class="oidc-btn" href="/deploy/">部署教程</a>
  <a class="oidc-btn" href="/structure/">项目结构</a>
</div>

## 产品定位

**快简云**面向同时运行多种虚拟化平台、且需要把资源对外售卖的场景。它不替换 Docker、Proxmox、ESXi 等平台本身，而是在其之上提供一层统一的管理与交付界面：

- **统一纳管**：主机按「服务器类型」接入，实例、端口、反代、用户和任务共用一套数据模型；
- **能力平台**：每个平台由独立驱动实现，字段、页签和操作限制由引擎元信息下发，前端不硬编码；
- **对接售卖**：财务插件通过 REST API 完成开通、续费、暂停和删除，控制台入口回传给最终用户；
- **轻量交付**：主控是单二进制 `hostagent`，默认 SQLite，监听 `1881`，宿主机只需安装对应运行时。

只使用一种平台、也不需要对外销售资源时，平台自带面板通常更合适；需要跨平台统一运维或接入财务系统时，可评估 QuickIDC。与其他方案的对比见[产品特点](/intro/advantages)。

## 组件

| 组件 | 技术栈 | 作用 |
|---|---|---|
| CloudHost | Go + Gin + SQLite | 主机、实例、网络、用户、任务与 REST API，产物为 `hostagent` |
| FrontPage | React + Ant Design | 管理端与用户端控制台，构建后打进主控 `static/` |
| CloudInit | Go | 虚拟机内 Agent：上报 IP、修改密码、执行初始化命令 |
| FSPlugins | PHP | 财务系统 Server Module，已并入 `CloudHost/plugins/` |

另有两个配套工具：命令行 `quickidc` 与 Tauri 桌面客户端，见[管理工具](/tools/)。