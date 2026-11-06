# Windows Hyper-V 部署

Hyper-V 是 Windows 内置的 Hypervisor。主控通过 WinRM（默认 `5985`）执行 PowerShell 命令。

## 前置条件

- Windows Server 2016+ 或 Windows 10/11 专业版 / 企业版
- CPU 支持 VT-x / AMD-V，BIOS 已开启
- 管理员账号

## 安装

```powershell
# 启用 Hyper-V 与管理工具
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All
Restart-Computer

# 验证
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
Get-VM
```

## 启用 WinRM

```powershell
Enable-PSRemoting -Force

# 查看监听
winrm enumerate winrm/config/listener

# 工作组环境需要信任主控地址（或用域账号）
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "<主控IP>" -Concatenate
```

防火墙放行：

```powershell
New-NetFirewallRule -DisplayName "WinRM HTTP" -Protocol TCP -LocalPort 5985 -Action Allow
```

## 网络

```powershell
# 外部交换机（桥接到物理网卡）
New-VMSwitch -Name "External" -NetAdapterName "Ethernet" -AllowManagementOS $true

# 内部 / NAT（无独立公网 IP 时）
New-VMSwitch -Name "Internal" -SwitchType Internal
```

实例 IP 建议由爱快 DHCP 统一分配。

## 存储

```powershell
# 默认路径
Get-VMHost | Select VirtualMachinePath, VirtualHardDiskPath

# 自定义路径
Set-VMHost -VirtualMachinePath "D:\HyperV\VMs" -VirtualHardDiskPath "D:\HyperV\VHD"
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `win-hv` | `hs_name` |
| 服务器类型 | Windows HyperV x64 | `HyperVSetup` |
| 服务器地址 | `10.0.0.44:5985` | WinRM |
| 服务器用户 | `Administrator` | 管理员 |
| 服务器密码 | `******` | — |
| 模板存储路径 | `D:\HyperV\Images` | 镜像 |
| 数据存储路径 | `D:\HyperV\VHD` | 实例磁盘 |

```bash
opidcs host add --name win-hv --type HyperVSetup --addr 10.0.0.44:5985 --user Administrator
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU | ✅（GPU-P / DDA） |
| PCI 直通 | ✅（DDA） |
| USB 直通 | ❌ |
| ISO / 数据盘 | ✅ |
| 带宽限制 | 上下行取较低值统一限制 |
| 控制台 | noVNC / RDP |

## 验证

```powershell
Get-VM | Select Name, State
```

主控主机状态在线、实例列表可见。

## 常见问题

| 现象 | 处理 |
|---|---|
| WinRM 拒绝连接 | `Enable-PSRemoting`、放行 5985、检查 TrustedHosts |
| 认证失败 | 使用域账号，或配置 `TrustedHosts` + Basic |
| 创建失败 | 检查交换机名称与磁盘路径权限 |
