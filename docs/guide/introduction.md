# 项目介绍

## 什么是 OpenIDCS？

**OpenIDCS**（Open Internet Data Center System）是一款面向 IDC 服务商、私有云运维、中小企业 IT 团队和教育机构的 **开源虚拟化统一管理平台**。它提供一套 **Web 界面 + RESTful API**，把 **Docker、LXD、VMware、Proxmox、Hyper-V、ESXi、青州云 / 小黑云** 等异构虚拟化平台统一纳管，让使用者无需关心底层差异，就像操作单个云平台一样便捷。

::: tip 🎯 一句话定位
**一个平台、七大虚拟化、零 License 费、完整源码、生产可用。**
:::

## 核心能力

- 🧩 **统一管理**：对接七大虚拟化平台，一套账号、一套界面、一套 API。
- 🔁 **生命周期**：创建、克隆、快照、迁移、扩容、关机、销毁全流程覆盖。
- 🌐 **网络编排**：IP 池 / NAT 端口转发 / 反向代理 / 自动 SSL / iptables 防火墙。
- 👥 **多租户**：RBAC 角色权限 + CPU / 内存 / 磁盘 / 流量 / VM 数硬配额。
- 📊 **监控审计**：实时指标可视化、操作日志、登录审计、告警通知。
- 🖥 **Web 控制台**：浏览器直连 noVNC 远程桌面 + ttyd Web SSH 终端。
- 🔌 **FSPlugins**：官方插件对接 SwapIDC、魔方财务、小黑云，直接变身售卖平台。
- 🌓 **i18n & 主题**：内置中英双语 + 深/浅主题切换。
- 🚀 **Open API**：完整 REST API + Token 认证，轻松接入 CMDB / 自助云门户。

## 适用场景

| 场景 | 价值 |
|------|------|
| 🏢 **中小企业 IT** | 开发 / 测试 / 生产 VM 一个控制台管到底 |
| ☁️ **私有云运营** | 为现有的 Proxmox、ESXi 集群补齐多租户 + 售卖门户 |
| 🎓 **教学实验室** | 按班级、按课程分配 VM 配额，学生自助开通 |
| 🏭 **IDC 服务商** | 对接 SwapIDC / 魔方财务 / 小黑云，开通即售卖 |
| 🧪 **研发沙箱** | 自动化 CI/CD 调用 REST API 按需起停环境 |
| 🧑‍💻 **极客 HomeLab** | 把家里的小主机变成自己的「私有阿里云」 |

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                  🌐  Web UI（React + Vite）              │
│       ↕  HTTPS · Token / Session 认证                    │
├─────────────────────────────────────────────────────────┤
│        🧠  MainServer（Python · Flask · AsyncIO）        │
│  ├─ 用户 / 权限 / 配额                                    │
│  ├─ 任务调度 / 计费 / 审计                                │
│  └─ FSPlugins Adapter（SwapIDC / 魔方 / 小黑云）         │
├─────────────────────────────────────────────────────────┤
│                 🔌  Virtualization Drivers               │
│  Docker · LXD · VMware · ESXi · Proxmox · Hyper-V · 青州 │
├─────────────────────────────────────────────────────────┤
│        💾 SQLite（可切换 MySQL / PostgreSQL）            │
└─────────────────────────────────────────────────────────┘
```

详见 [架构设计](/guide/architecture)。

## 与同类产品对比

| 特性 | OpenIDCS | OpenStack | Proxmox | 商业云管 |
|------|:--------:|:---------:|:-------:|:--------:|
| 一键部署 | ✅ 一键脚本 | ❌ 复杂 | ⚠️ 仅 PVE | ⚠️ |
| 多虚拟化后端 | ✅ 7 种 | ⚠️ 主要 KVM | ❌ 仅 QEMU/LXC | ✅ |
| 财务系统对接 | ✅ 原生插件 | ❌ | ❌ | ✅ |
| 开源协议 | ✅ AGPLv3 | ✅ | ✅ | ❌ |
| 硬件要求 | 🪶 单机即可 | 🏋️ 高 | 🏋️ 中 | 🏋️ 高 |
| 适合中小团队 | ✅ | ❌ | ⚠️ | ❌ |

## 项目历史 & 社区

- 📅 立项：2024 年
- 🏷 当前状态：GA（长期维护）
- 📦 主仓库：<https://github.com/OpenIDCSTeam/OpenIDCS-Client>
- 🔌 插件仓库：<https://github.com/OpenIDCSTeam/FSPlugins>
- 📖 文档仓库：<https://github.com/OpenIDCSTeam/Documents>
- 💬 社区：GitHub Discussions / Issues

## 下一步

- 👉 [核心优势](/guide/advantages)
- 👉 [功能概览](/guide/features)
- 👉 [快速上手（含一键脚本）](/guide/quick-start)
- 👉 [完整安装部署](/guide/installation)
