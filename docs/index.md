---
layout: home

hero:
  name: OpenIDCS
  text: 开源 IDC 虚拟化统一管理平台
  tagline: 一套 Web 界面 + 完整 RESTful API · 统管 Docker / LXD / VMware / ESXi / Proxmox / Hyper-V / 青州云 · 原生对接 SwapIDC、魔方财务、小黑云
  image:
    src: /logo.svg
    alt: OpenIDCS
  actions:
    - theme: brand
      text: 🚀 一键安装
      link: /guide/quick-start
    - theme: alt
      text: 项目介绍
      link: /guide/introduction
    - theme: alt
      text: 下载 / Releases
      link: https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases
    - theme: alt
      text: GitHub
      link: https://github.com/OpenIDCSTeam

features:
  - icon: 🧩
    title: 七大虚拟化平台统一纳管
    details: 原生对接 Docker / Podman、LXC / LXD、VMware Workstation、vSphere ESXi、Proxmox VE、Hyper-V、青州云 / 小黑云，异构资源一个控制台搞定。
  - icon: 🔁
    title: 完整生命周期管理
    details: 创建 / 克隆 / 启动 / 关机 / 重启 / 删除、在线调整 CPU 内存、磁盘扩容与挂载、ISO 装载、快照与一键还原，跨平台一致体验。
  - icon: 🌐
    title: 网络与反向代理
    details: 内置 IP 池、NAT 端口转发、iptables 防火墙、HTTP/HTTPS 反向代理 + 自动 SSL，让虚拟机一键暴露服务。
  - icon: 👥
    title: 多租户 & 细粒度 RBAC
    details: 基于角色的访问控制，按用户限制 CPU / 内存 / 磁盘 / 流量 / VM 数配额，天然适配多部门或 IDC 售卖场景。
  - icon: 📊
    title: 实时监控与审计
    details: 主机与虚拟机实时指标、操作日志、登录审计、告警通知全打通，ECharts 可视化面板一目了然。
  - icon: 🖥
    title: Web VNC + SSH 终端
    details: 浏览器即开即用 noVNC 远程桌面 + ttyd Web 终端，SSL 加密、免客户端，随时随地接管虚拟机。
  - icon: 🔌
    title: FSPlugins 财务系统对接
    details: 官方提供 SwapIDC / 魔方财务 IDCSmart / 小黑云 插件，一键联动开通、续费、暂停、删除，让 OpenIDCS 直接变身售卖平台。
  - icon: 🚀
    title: 一键安装 · 跨平台部署
    details: 提供 Linux 一键脚本与 Windows 安装包，支持 Ubuntu / Debian / CentOS / RHEL / Windows / macOS，单机即可跑。
  - icon: 🆓
    title: 100% 开源 AGPLv3
    details: 前端 React + 后端 Python + SQLite，完整源码开放，可二次开发、可商用（遵循 AGPLv3），无 License 费。
---

## ⚡ 60 秒极速体验

::: code-group

```bash [🐧 Linux 一键安装]
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.sh | sudo bash
```

```powershell [🪟 Windows 一键安装]
iwr -useb https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.ps1 | iex
```

```bash [🐳 Docker 部署]
docker run -d --name openidcs \
  -p 1880:1880 \
  -v openidcs_data:/app/data \
  --restart=unless-stopped \
  openidcsteam/openidcs:latest
```

:::

安装完成后打开 <http://localhost:1880>，使用控制台输出的初始 Token 登录即可。

> 更多安装方式见 [快速上手](/guide/quick-start) 与 [完整安装部署](/guide/installation)。

## 📦 下载地址

| 类型 | 地址 | 说明 |
|------|------|------|
| 源码 | <https://github.com/OpenIDCSTeam/OpenIDCS-Client> | 主仓库，含所有源码与脚本 |
| Releases | <https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases> | Windows/Linux 预编译二进制 |
| Docker Hub | <https://hub.docker.com/r/openidcsteam/openidcs> | 官方镜像 |
| FSPlugins | <https://github.com/OpenIDCSTeam/FSPlugins> | 财务系统对接插件（SwapIDC / 魔方财务 / 小黑云） |
| 镜像下载 | <https://mirror.openidcs.org> | 国内加速镜像 |

## 🧱 支持的虚拟化平台

| 平台 | 状态 | 运行环境 | 适用场景 |
|------|:----:|----------|----------|
| [LXC / LXD](/vm/lxd) | ✅ GA | Linux | 容器化 VPS 批量售卖 |
| [Docker / Podman](/vm/docker) | ✅ GA | Win/Linux/macOS | 轻量容器 / 镜像交付 |
| [VMware Workstation](/vm/vmware) | ✅ GA | Windows | 桌面级虚拟机管理 |
| [VMware vSphere ESXi](/vm/esxi) | ✅ GA | 裸金属 | 企业级 VM 集群 |
| [Proxmox VE](/vm/proxmox) | ✅ GA | Linux | 开源企业级虚拟化 |
| [Windows Hyper-V](/vm/hyperv) | ✅ GA | Windows Server | 微软生态虚拟化 |
| [青州云 / 小黑云](/vm/qingzhou) | ✅ GA | — | 国产云对接 |

## 🔌 FSPlugins 财务系统插件

| 插件 | 对接平台 | 文档 |
|------|----------|------|
| **OpenIDC-SwapIDC** | SwapIDC | [📖 SwapIDC 集成](/fsplugins/swapidc) |
| **OpenIDC-IDCSmart** / **LxdServer-IDCSmart** | 魔方财务（IDCSmart） | [📖 魔方财务集成](/fsplugins/idcsmart) |
| **OpenIDC-XiaoHei** | 小黑云（XiaoHei Cloud） | [📖 小黑云集成](/fsplugins/xiaohei) |

<div style="text-align:center; margin-top: 3rem; color: var(--vp-c-text-2);">
  <p>🌟 如果 OpenIDCS 对您的工作有帮助，请在 <a href="https://github.com/OpenIDCSTeam" target="_blank">GitHub</a> 为我们点亮 Star，这是对开源团队最大的支持！</p>
  <p style="font-size: 0.9em;">基于 <strong>AGPLv3</strong> 开源协议 · Copyright © 2024-present OpenIDCS Team</p>
</div>
