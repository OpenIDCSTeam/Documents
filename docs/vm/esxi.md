---
title: VMware vSphere ESXi 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# VMware vSphere ESXi

> 🏢 企业级 Type-1 裸金属虚拟化 · 高性能 · 高可用 · 生产首选之一

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🏋️ **企业级** | 全球使用最广泛的 Type-1 hypervisor |
| ⚡ **高性能** | 直接运行在裸金属，无宿主 OS 开销 |
| 🔁 **HA / DRS** | 集群高可用、资源动态均衡、在线热迁移 vMotion |
| 🔒 **稳定可靠** | 经过多年生产验证，硬件兼容性极佳 |
| 🔁 **OpenIDCS 能力** | 创建 / 启停 / 快照 / 克隆 / 迁移 / 模板 / VNC / WebSSH |
| 🔗 **vCenter 集成** | 可单独对接 ESXi 主机，也可对接 vCenter 统管集群 |

## 📋 前置要求

| 项 | 要求 |
|----|------|
| ESXi | 6.7 / 7.0 / 8.0 |
| vCenter | 7.0 / 8.0（可选，用于集群） |
| 许可 | 有效 vSphere License（Evaluation 60 天可用） |
| 网络 | 宿主机管理网可达 OpenIDCS MainServer |
| 账户 | root 或具 `Admin` 权限的自定义账户 |

---

## 🚀 部署教程

### 步骤 1 · 安装 ESXi（已有可跳过）

1. 下载 ESXi ISO：<https://www.vmware.com/cn/products/esxi-and-esx.html>
2. 通过 IPMI / iLO / iDRAC 挂载 ISO 到服务器，引导安装。
3. 按向导设置 root 密码与管理网卡 IP。
4. 启动完成后可访问 `https://<ESXi-IP>/ui` 进入 Host Client。

### 步骤 2 · 开启 ESXi Web / API 访问

默认 ESXi 开启 HTTPS（443）和 SSH（22）：

```bash
# ESXi Shell 下开启 SSH 与 ESXi Shell（如默认已关）
vim-cmd hostsvc/enable_ssh
vim-cmd hostsvc/start_ssh
```

Host Client 中：**主机 → 操作 → 服务 → 启动 SSH** 与 **ESXi Shell**。

### 步骤 3 · （可选）部署 vCenter

如需集群、热迁移、分布式交换机，推荐部署 vCenter Server Appliance (VCSA)：

1. 下载 VCSA ISO。
2. 运行安装器 → 阶段 1：部署 OVA；阶段 2：配置 SSO。
3. 将 ESXi 主机加入 vCenter 数据中心。

### 步骤 4 · 在 OpenIDCS 中添加平台

OpenIDCS **直接使用 vSphere REST / pyvmomi**，无需在宿主机装 HostAgent。

1. 后台 → **主机管理 → 添加主机**。
2. 填写：

| 字段 | 示例（单 ESXi） | 示例（vCenter） |
|------|-----------------|-----------------|
| 平台类型 | ESXi | vCenter |
| 地址 | `https://192.168.1.40` | `https://vc.example.com` |
| 用户 | `root` | `administrator@vsphere.local` |
| 密码 | `••••••` | `••••••` |
| 验证证书 | 关（自签名） | 开（推荐） |
| 数据存储 | `datastore1` | `cluster-ds-01` |
| 默认网络 | `VM Network` | `DPortGroup-01` |

3. 测试连接 → 保存。

### 步骤 5 · 创建 VM

1. **虚拟机 → 创建 → 平台：ESXi / vCenter**。
2. 配置：

| 字段 | 示例 |
|------|------|
| 创建方式 | ISO 安装 / 从模板克隆 / 链接克隆 |
| 模板 | `ubuntu-22-04-tpl` |
| CPU / 内存 | 2 vCPU / 4 GB |
| 磁盘 | 40 GB Thin Provision |
| 网络 | `VM Network`（自动分配 IP） |
| Guest OS | Ubuntu Linux 64-bit |

3. 创建 → 后台通过 vSphere API 克隆。
4. 创建完成自动开机并可通过 **VMware Remote Console / OpenIDCS VNC Proxy** 查看。

### 步骤 6 · 创建模板（推荐）

1. 装好一台基准 VM（Ubuntu 22.04、预装 open-vm-tools、cloud-init）。
2. 关机 → **操作 → Convert to Template**。
3. OpenIDCS 创建时选此模板，可通过 cloud-init 自动注入主机名 / SSH Key / 网络。

---

## 🧰 常用操作

### 开启 Guest 远程控制台（VMRC）

OpenIDCS 会自动代理 VMRC 的 WebSocket，Web VNC 开箱可用，无需客户端。

### 热迁移 vMotion

vCenter 集群场景下，OpenIDCS 支持 **选中 VM → 迁移 → 选目标主机**，底层调 vSphere API。

### 批量创建（模板 + cloud-init）

模板文件中预置 cloud-init metadata，用 OpenIDCS 的批量功能一次开通数十台。

---

## 🛡 生产建议

- 🔐 **专用账户**：不要直接用 root；在 vCenter 中建 `openidcs` 用户并授 `Administrator` 或自定义最小权限。
- 🧾 **打开审计日志**：vCenter → Event，与 OpenIDCS 审计互为佐证。
- 🚦 **限流**：避免 OpenIDCS 并发超过 vCenter 能承受（建议 ≤ 20 并发任务）。
- 💾 **数据存储**：推荐 vSAN / 全闪，启用 Thin Provisioning 节省空间。
- 🕒 **定期快照清理**：快照长期保留会降低性能，建议 7 天内清理。

## 🧯 常见问题

<details>
<summary><b>证书自签名导致连接失败？</b></summary>

添加主机时关闭 **校验证书**；或在生产环境把 ESXi 证书替换为可信 CA 颁发。
</details>

<details>
<summary><b>连接超时？</b></summary>

检查：
- 443 / 902 端口是否开放
- ESXi Lockdown Mode 是否开启（建议关闭或加白名单）
- 账号权限是否足够
</details>

<details>
<summary><b>VNC 控制台看不到画面？</b></summary>

确认 VM 里安装了 `open-vm-tools`（Linux）/ `VMware Tools`（Windows），并确保 VM VRAM ≥ 8MB。
</details>

---

👉 相关：[Proxmox VE 教程](/vm/proxmox) · [监控与告警](/tutorials/monitoring) · [FSPlugins 售卖独立 VM](/fsplugins/)
