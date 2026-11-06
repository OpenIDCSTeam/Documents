---
title: Windows Hyper-V 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# Windows Hyper-V

> 🪟 Windows 原生 Type-1 虚拟化 · 深度集成 Windows Server · 适合 Windows VPS 售卖

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🪟 **Windows 原生** | Windows 10/11 Pro 与 Windows Server 内置，无需额外授权 |
| ⚡ **性能优秀** | Type-1 架构，性能接近裸金属 |
| 🌐 **完整网络** | 内置 vSwitch、NAT、VLAN、SR-IOV |
| 🔁 **OpenIDCS 能力** | 创建 / 启停 / 快照（检查点）/ 克隆 / 动态内存 / VNC / WebRDP |
| 💼 **适合 Windows VPS** | IDC 售卖 Windows VPS 首选 |

## 📋 前置要求

| 项 | 要求 |
|----|------|
| OS | Windows Server 2019 / 2022 · Windows 10/11 Pro 或 Enterprise |
| CPU | 64 位、支持 VT-x/AMD-V、SLAT |
| 内存 | ≥ 8GB |
| 磁盘 | ≥ 100GB |
| 角色 | **Hyper-V 角色已启用** |
| 管理员权限 | 必须 |

---

## 🚀 部署教程

### 步骤 1 · 启用 Hyper-V 角色

**Windows Server**（PowerShell 管理员）：

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```

**Windows 10/11 Pro**：

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
# 重启生效
```

启用后：`开始菜单 → Hyper-V 管理器` 可打开。

### 步骤 2 · 创建虚拟交换机

Hyper-V 管理器 → **虚拟交换机管理器 → 新建 → 外部** → 绑定物理网卡 → 命名 `vSwitch-External`。

PowerShell 等价：

```powershell
New-VMSwitch -Name "vSwitch-External" -NetAdapterName "Ethernet" -AllowManagementOS $true
```

### 步骤 3 · 开启 WinRM（供 OpenIDCS 远程）

OpenIDCS 通过 **WinRM / PowerShell Remoting** 管理 Hyper-V。

```powershell
# 启用 WinRM
Enable-PSRemoting -Force

# HTTPS 监听（推荐）
winrm quickconfig -transport:https

# 开放防火墙 5985(HTTP) 5986(HTTPS)
New-NetFirewallRule -DisplayName "WinRM HTTPS" -Direction Inbound -Protocol TCP -LocalPort 5986 -Action Allow

# 基本鉴权（开发可用；生产建议证书/Kerberos）
Set-Item WSMan:\localhost\Service\Auth\Basic $true
Set-Item WSMan:\localhost\Service\AllowUnencrypted $true   # 仅 HTTP 场景
```

创建专用账户：

```powershell
New-LocalUser -Name "openidcs" -Password (ConvertTo-SecureString "StrongPass!" -AsPlainText -Force) -PasswordNeverExpires
Add-LocalGroupMember -Group "Administrators" -Member "openidcs"
Add-LocalGroupMember -Group "Hyper-V Administrators" -Member "openidcs"
```

### 步骤 4 · 安装 OpenIDCS HostAgent（可选）

对 Hyper-V 也可不装 HostAgent，直接由 OpenIDCS MainServer 通过 WinRM 远程操作。
若主控端与 Hyper-V 在不同网段且中间有防火墙，建议装 HostAgent：

```powershell
iwr -useb https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install-agent.ps1 | iex
```

### 步骤 5 · 在 OpenIDCS 中添加平台

1. 后台 → **主机管理 → 添加主机**。
2. 填写：

| 字段 | 示例 |
|------|------|
| 平台类型 | Hyper-V |
| 地址 | `https://hv-host-01.example.com:5986` |
| 协议 | WinRM HTTPS |
| 用户 | `openidcs` |
| 密码 | `••••••••` |
| VHD 目录 | `D:\Hyper-V\VHDs` |
| ISO 库 | `D:\ISOs` |
| 默认交换机 | `vSwitch-External` |

3. 测试连接 → 保存。

### 步骤 6 · 创建 VM

1. **虚拟机 → 创建 → 平台：Hyper-V**。
2. 配置：

| 字段 | 示例 |
|------|------|
| 模板 | Gen2 Windows Server 2022 模板 |
| CPU / 内存 | 2 vCPU / 4 GB（启用动态内存） |
| 磁盘 | 60 GB 动态 VHDX |
| 网络 | `vSwitch-External` |
| 初始密码 | `ChangeMe!` |
| Unattend | 自动 sysprep |

3. 创建 → 通过 Unattend.xml 自动装系统。
4. 装完自动安装 Hyper-V 集成服务，支持 **Web VNC / RDP over Gateway**。

---

## 🧰 常用操作

### 检查点（快照）

```powershell
Checkpoint-VM -Name "web01" -SnapshotName "before-update"
Restore-VMSnapshot -VMName "web01" -Name "before-update"
```

OpenIDCS 直接在前端勾选操作。

### 动态内存

```powershell
Set-VMMemory "web01" -DynamicMemoryEnabled $true -MinimumBytes 1GB -MaximumBytes 8GB
```

### 导出 / 导入（手工迁移）

```powershell
Export-VM -Name "web01" -Path "D:\Export"
Import-VM -Path "D:\Export\web01\Virtual Machines\xxx.vmcx"
```

### 实时迁移（集群/SMB 共享）

配置 Hyper-V 集群或共享存储后，OpenIDCS 可触发 `Move-VM` 实时迁移。

---

## 🛡 IDC 建议

- 🪟 **母盘 + 差异盘**：共享 Windows 母盘，新 VM 用差异盘快速创建。
- 💾 **存储**：SSD 阵列 + ReFS，避免 VHD 碎片化。
- 🔐 **WinRM 安全**：强制 HTTPS，证书校验，最小化权限账户。
- 📜 **Unattend.xml**：提前准备模板 unattend 文件自动激活。
- 📊 **监控**：OpenIDCS 通过 WMI 取 CPU/内存/磁盘指标。

## 🧯 常见问题

<details>
<summary><b>WinRM 连接失败？</b></summary>

检查：
- 5986 端口防火墙
- 证书是否受信（或用 `-SkipCACheck`）
- 账户是否属于 `Hyper-V Administrators`
</details>

<details>
<summary><b>创建 VM 报错 "Insufficient resources"？</b></summary>

确认宿主机实际可用 CPU/内存/磁盘空间，Hyper-V 不会超卖内存（除非启用动态内存）。
</details>

<details>
<summary><b>VNC 显示花屏？</b></summary>

建议使用 Gen2 VM + 最新集成服务；RDP 是 Windows 原生体验最好。OpenIDCS 也支持 Web RDP 网关。
</details>

---

👉 相关：[VMware Workstation](/vm/vmware) · [监控告警](/tutorials/monitoring) · [FSPlugins 售卖 Windows VPS](/fsplugins/)
