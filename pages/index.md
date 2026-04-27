---
layout: home

hero:
  name: OpenIDCS
  text: 开源 IDC 虚拟化统一管理平台
  tagline: 一套 Web 界面 + RESTful API，统一管理 VMware / LXC / Docker / Proxmox / Hyper-V / ESXi / 青州云 等多种虚拟化平台
  image:
    src: /logo.svg
    alt: OpenIDCS
  actions:
    - theme: brand
      text: 快速开始 →
      link: /guide/quick-start
    - theme: alt
      text: 项目介绍
      link: /guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/OpenIDCSTeam/OpenIDCS-Client

features:
  - icon: 🔧
    title: 七大虚拟化平台
    details: 原生对接 VMware Workstation、vSphere ESXi、LXC/LXD、Docker/Podman、Proxmox VE、Windows Hyper-V、青州云；一个平台管理所有异构虚拟化资源。
  - icon: 🖥️
    title: 完整生命周期管理
    details: 创建 / 启动 / 关机 / 重启 / 删除、CPU 与内存在线调整、磁盘扩容与挂载、ISO 装载、快照备份与一键还原，全部平台统一操作体验。
  - icon: 🌐
    title: 网络与反向代理
    details: 内置 IP 池管理、NAT 端口转发、iptables 防火墙、HTTP/HTTPS 反向代理与自动 SSL，让虚拟机暴露服务从未如此简单。
  - icon: 👥
    title: 多租户与 RBAC
    details: 基于角色的访问控制、细粒度权限（创建 / 修改 / 删除 / 控制台）、按用户的 CPU / 内存 / 磁盘 / 流量配额限制，轻松支撑团队与租户共享。
  - icon: 📊
    title: 实时监控与日志审计
    details: 主机与虚拟机 CPU / 内存 / 磁盘 / 网络实时可视化，操作日志、登录审计、告警通知一应俱全，运维可追溯、有迹可循。
  - icon: 🔌
    title: Web 控制台 & SSH 终端
    details: 浏览器直接访问 noVNC 远程桌面、基于 ttyd 的 Web 终端，SSL 加密无需安装客户端，随时随地接管虚拟机。
  - icon: 🌍
    title: 中英双语 & 主题切换
    details: 内置中文 / 英文界面切换，暗黑 / 白天主题一键切换，契合不同团队与工作场景。
  - icon: 🚀
    title: RESTful API & Token 认证
    details: 前后端分离架构，完整的 RESTful API 支持 Token 与 Session 双重认证，可无缝嵌入 CMDB、魔方财务、自助云门户等上下游系统。
  - icon: 📦
    title: 轻量部署与跨平台
    details: 支持 Windows / Linux / macOS 运行，基于 Python + React + SQLite，单机即可部署，也可使用 Nuitka 打包为原生二进制。
---

<div style="text-align:center; margin-top: 3rem; color: var(--press-c-text-2);">
  <p>🌟 如果 OpenIDCS 对您的工作有帮助，请在 <a href="https://github.com/OpenIDCSTeam/OpenIDCS-Client" target="_blank">GitHub</a> 为我们点亮一颗 Star，这是对开源团队最大的支持！</p>
  <p style="font-size: 0.9em;">基于 <strong>AGPLv3</strong> 开源协议 · Copyright © 2024-present OpenIDCS Team</p>
</div>
