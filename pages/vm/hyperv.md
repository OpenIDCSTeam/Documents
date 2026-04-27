---
title: Windows Hyper-V 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# Windows Hyper-V 配置教程

本文介绍如何将 **Windows Hyper-V** 主机接入 OpenIDCS。Hyper-V 是 Windows Server / Windows 10+ Pro 内置的 Type-1 Hypervisor，特别适合纯 Windows 环境。

## ✨ 优缺点一览

### 👍 优点

- **Windows 原生**：Windows Server / 专业版已内置，开箱即用
- **零成本**：Windows 许可证内包含，无需额外付费
- **Type-1 架构**：性能接近原生
- **AD 集成**：与 Active Directory、WinRM 无缝集成
- **Windows VM 友好**：Windows Guest 性能与兼容性最佳

### 👎 缺点

- **仅限 Windows 宿主**：不能装在 Linux 上
- **Linux VM 兼容性一般**：部分发行版需额外驱动
- **管理工具偏老**：SCVMM 授权昂贵，PowerShell 脚本为主
- **与 Docker Desktop 冲突**：同机器难以共存（资源互抢）

### 🎯 推荐场景

- 纯 Windows Server 数据中心
- 已有 AD 域环境
- 开发测试 Windows 应用栈

## 🖥️ 系统要求

| 组件 | 要求 |
|------|------|
| **操作系统** | Windows Server 2016 / 2019 / 2022，或 Windows 10/11 Pro/Enterprise |
| **CPU** | 64 位，支持 Intel VT-x + EPT 或 AMD-V + RVI |
| **内存** | ≥ 8 GB（建议 16 GB+） |
| **磁盘** | ≥ 50 GB |
| **BIOS** | 开启虚拟化，关闭 Hyper-Threading（非必须） |

## 🚀 受控端安装

### 步骤 1：启用 Hyper-V 角色

#### Windows Server

```powershell
# 以管理员身份运行 PowerShell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```

#### Windows 10 / 11 Pro

```powershell
# 以管理员身份运行 PowerShell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
# 重启
Restart-Computer
```

或通过 GUI：
**控制面板 → 程序 → 启用或关闭 Windows 功能 → 勾选 Hyper-V**

### 步骤 2：验证 Hyper-V 状态

```powershell
Get-WindowsFeature -Name Hyper-V
# InstallState 应为 Installed

Get-VMHost
# 能正常返回主机信息即 OK
```

### 步骤 3：启用 WinRM（远程管理）

OpenIDCS 通过 WinRM 执行 PowerShell 命令管理 Hyper-V：

```powershell
# 启用 WinRM 服务
Enable-PSRemoting -Force

# 配置 HTTP 监听（仅内网环境）
winrm quickconfig -q
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'

# 查看监听
winrm enumerate winrm/config/Listener
```

::: warning 生产环境
生产环境强烈建议启用 **HTTPS + 证书认证**，禁止使用 HTTP + Basic + Unencrypted 组合。
:::

#### （推荐）启用 WinRM HTTPS

```powershell
# 生成自签证书
$cert = New-SelfSignedCertificate -DnsName "<hostname>" `
    -CertStoreLocation Cert:\LocalMachine\My

# 创建 HTTPS Listener
New-Item -Path WSMan:\localhost\Listener `
    -Transport HTTPS -Address * -CertificateThumbPrint $cert.Thumbprint -Force

# 放行 5986
New-NetFirewallRule -DisplayName "WinRM HTTPS" `
    -Direction Inbound -LocalPort 5986 -Protocol TCP -Action Allow
```

### 步骤 4：放行防火墙

```powershell
# HTTP (5985) - 仅内网
New-NetFirewallRule -DisplayName "WinRM HTTP" `
    -Direction Inbound -LocalPort 5985 -Protocol TCP -Action Allow `
    -RemoteAddress 192.168.0.0/16

# Hyper-V 管理端口
Enable-NetFirewallRule -DisplayGroup "Hyper-V"
Enable-NetFirewallRule -DisplayGroup "远程桌面"
```

### 步骤 5：创建虚拟交换机

OpenIDCS 需要预先配置好 vSwitch：

```powershell
# 查看物理网卡
Get-NetAdapter

# 创建外部虚拟交换机（桥接到物理网卡）
New-VMSwitch -Name "vSwitch-External" `
    -NetAdapterName "Ethernet" -AllowManagementOS $true

# 创建内部交换机（仅主机-虚机互通）
New-VMSwitch -Name "vSwitch-Internal" -SwitchType Internal

# 创建专用交换机（VM 之间互通）
New-VMSwitch -Name "vSwitch-Private" -SwitchType Private
```

### 步骤 6：创建专用服务账户

```powershell
# 创建本地用户
net user openidcs 'StrongP@ssw0rd!' /add
net localgroup "Hyper-V Administrators" openidcs /add
net localgroup "Remote Management Users" openidcs /add
net localgroup "Administrators" openidcs /add
```

如果是域环境，推荐使用托管服务账户（gMSA）。

### 步骤 7：配置默认存储路径

```powershell
# 设置 VM 默认存储路径
Set-VMHost -VirtualHardDiskPath "D:\Hyper-V\VHDs" `
           -VirtualMachinePath "D:\Hyper-V\VMs"

# 创建目录
New-Item -Path "D:\Hyper-V\VHDs" -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\VMs" -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\ISOs" -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\Backups" -ItemType Directory -Force
```

### 步骤 8：验证远程连接

在 OpenIDCS 主控端测试：

```bash
# Linux / Windows 主控端
pip install pywinrm

python -c "
import winrm
s = winrm.Session('http://<hyperv-ip>:5985/wsman',
                  auth=('openidcs', 'StrongP@ssw0rd!'))
r = s.run_ps('Get-VMHost | Select Name, LogicalProcessorCount, MemoryCapacity')
print(r.std_out.decode())
"
```

## 🔗 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入 **主机管理 → 添加主机**
3. 填写配置：

   | 字段 | 值 |
   |------|-----|
   | 主机名称 | `hyperv-01` |
   | 主机类型 | `Windows Hyper-V` |
   | 主机地址 | Hyper-V 主机 IP / FQDN |
   | 主机端口 | `5985` (HTTP) 或 `5986` (HTTPS) |
   | 协议 | http / https |
   | 用户名 | `openidcs` 或 `DOMAIN\openidcs` |
   | 密码 | 密码 |
   | 虚拟磁盘路径 | `D:\Hyper-V\VHDs` |
   | 虚拟机路径 | `D:\Hyper-V\VMs` |
   | ISO 路径 | `D:\Hyper-V\ISOs` |
   | 备份路径 | `D:\Hyper-V\Backups` |
   | 默认交换机 | `vSwitch-External` |

4. 点击 **测试连接** → **保存**

## 📘 常用 PowerShell 命令

```powershell
# 列出所有 VM
Get-VM

# 启动/关闭 VM
Start-VM -Name "VM01"
Stop-VM -Name "VM01" -Force

# 创建 VM
New-VM -Name "VM01" -MemoryStartupBytes 4GB `
       -NewVHDPath "D:\Hyper-V\VHDs\VM01.vhdx" -NewVHDSizeBytes 40GB `
       -SwitchName "vSwitch-External" -Generation 2

# 快照
Checkpoint-VM -Name "VM01" -SnapshotName "snap1"

# 导出（备份）
Export-VM -Name "VM01" -Path "D:\Hyper-V\Backups"

# 查看性能
Get-Counter -Counter "\Hyper-V Hypervisor Logical Processor(_Total)\% Total Run Time"
```

## 🐛 故障排查

### 问题 1：Hyper-V 未启用或 CPU 不支持

```powershell
# 检查虚拟化支持
systeminfo | findstr /C:"Hyper-V"
```

应看到所有项为 "是"。若提示 CPU 不支持，检查 BIOS 虚拟化设置。

### 问题 2：WinRM 连接被拒

```powershell
# 测试本地
Test-WSMan

# 测试远程
Test-WSMan -ComputerName <hyperv-ip> -Credential openidcs

# 查看服务
Get-Service WinRM
```

常见原因：
- 防火墙未放行 5985/5986
- `TrustedHosts` 未配置（主控端）
- 密码过期

### 问题 3：主控端无法信任目标

在主控端执行：

```powershell
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "<hyperv-ip>" -Force
```

### 问题 4：Kerberos 认证失败

- 确保主机名 FQDN 可解析
- 时间偏差 ≤ 5 分钟
- 加入域时账户权限正确

## 🔒 安全建议

- 优先使用 **WinRM over HTTPS (5986)**
- 禁用 Basic + Unencrypted，改用 Kerberos / Certificate
- 使用域账户或 gMSA，避免本地 Admin
- 只放行主控端 IP 访问 5985/5986
- 定期 Windows Update

## 📚 参考资源

- [Hyper-V 官方文档](https://docs.microsoft.com/zh-cn/windows-server/virtualization/hyper-v/)
- [PowerShell Hyper-V 模块](https://docs.microsoft.com/zh-cn/powershell/module/hyper-v/)
- [WinRM 安全强化](https://docs.microsoft.com/zh-cn/windows/win32/winrm/authentication-for-remote-connections)

## 下一步

- 🖥️ 查看 [VMware Workstation 配置](/vm/vmware)
- 🏢 查看 [Proxmox VE 配置](/vm/proxmox)
- 🚀 返回 [快速上手](/guide/quick-start)
