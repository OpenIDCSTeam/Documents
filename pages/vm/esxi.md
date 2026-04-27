---
title: VMware vSphere ESXi 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# VMware vSphere ESXi 配置教程

本文介绍如何将 **VMware vSphere ESXi** 主机接入 OpenIDCS 进行统一管理。ESXi 是 VMware 的企业级裸金属（Type-1）Hypervisor，广泛应用于金融、政企、大型 IDC。

## ✨ 优缺点一览

### 👍 优点

- **业界标杆**：最成熟的企业级 Hypervisor，稳定性极高
- **Type-1 架构**：直接运行于硬件之上，开销极小
- **功能完整**：vMotion、DRS、HA、FT 等企业特性
- **生态强大**：硬件兼容性列表最全，技术支持遍布全球
- **管理成熟**：vCenter + vSphere Client 工具链完善

### 👎 缺点

- **商业软件**：正版许可证昂贵（Broadcom 收购后更贵）
- **免费版受限**：免费 ESXi 有 API 写入限制，无法通过 API 创建 VM
- **硬件兼容性严格**：消费级硬件常遇驱动缺失
- **封闭生态**：与开源工具链整合成本高

### 🎯 推荐场景

- 金融/政府等对稳定性要求极高的生产环境
- 已有 VMware 许可证的大型企业
- 混合云架构中与 vSphere/VCF 配合

::: warning 许可要求
OpenIDCS 通过 **pyvmomi (vSphere SOAP API)** 与 ESXi 交互，需要：
- ESXi 为 **付费版本**（Standard 及以上），或
- 接入 **vCenter Server** 管理集群

免费版 ESXi API 为只读，无法创建/修改 VM。
:::

## 🖥️ 系统要求

| 组件 | 最低 | 推荐 |
|------|-----|-----|
| CPU | 64 位 x86，支持 VT-x/AMD-V | 多 CPU 服务器级 |
| 内存 | 8 GB | 32 GB + |
| 磁盘 | 32 GB | 2 块 SSD + RAID |
| 网卡 | 1 Gbps，在 HCL 列表中 | 2 × 10 Gbps |
| OS | VMware ESXi 6.7 / 7.0 / 8.0 | ESXi 7.0 U3 / 8.0 |

## 🚀 受控端安装

### 步骤 1：下载 ESXi 安装介质

从 Broadcom 支持门户下载：

```
https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware+vSphere+Hypervisor
```

### 步骤 2：安装 ESXi

1. 制作启动 U 盘并从 U 盘启动
2. 选择安装磁盘（不要选数据盘）
3. 设置 root 密码（需强密码：≥8 位，含大小写+数字+符号）
4. 配置管理网络（F2 → Configure Management Network）
   - 静态 IP、子网掩码、网关
   - DNS
   - 主机名 FQDN

### 步骤 3：启用 SSH / ESXi Shell（用于排障）

ESXi 主机控制台（Web 或 DCUI）：

```
F2 → Troubleshooting Options → Enable SSH
                            → Enable ESXi Shell
```

或通过 Web UI（`https://<esxi-ip>/ui`）：

**主机 → 管理 → 服务 → TSM-SSH → 启动**

### 步骤 4：配置 NTP（重要）

API 认证对时间敏感：

```bash
# SSH 登录
ssh root@<esxi-ip>

# 添加 NTP
esxcli system ntp set --server=ntp.aliyun.com
esxcli system ntp set --enabled=true

# 启动 NTP 服务
/etc/init.d/ntpd start
```

或 Web UI：**管理 → 系统 → 时间与日期 → NTP 服务**

### 步骤 5：开启防火墙规则

```bash
# 允许管理 API 访问
esxcli network firewall ruleset set --ruleset-id=httpClient --enabled=true

# 允许 vSphere API（443）
esxcli network firewall ruleset set --ruleset-id=vpxHeartbeats --enabled=true
```

443/tcp 默认放行。

### 步骤 6：创建专用管理账户

```bash
# SSH 登录 ESXi
ssh root@<esxi-ip>

# 创建用户
esxcli system account add -i openidcs -p '<StrongPassword>' -c '<StrongPassword>' -d "OpenIDCS Service Account"

# 分配管理员权限
esxcli system permission set -i openidcs -r Admin
```

或通过 vCenter：**管理 → 权限** 授予 "管理员" 角色。

### 步骤 7：验证 API 连接

在 OpenIDCS 主控端测试：

```python
from pyVim.connect import SmartConnect, Disconnect
import ssl

ctx = ssl._create_unverified_context()

si = SmartConnect(
    host='<esxi-ip>',
    user='openidcs',
    pwd='<StrongPassword>',
    port=443,
    sslContext=ctx,
)

print("连接成功:", si.content.about.fullName)
Disconnect(si)
```

### 步骤 8：（可选）配置数据存储

创建 ISO 上传专用 Datastore：

```
Web UI → 存储 → 新建数据存储
类型: VMFS
名称: iso-lib
容量: 选择独立的数据盘
```

用于后续上传 ISO 模板。

## 🔗 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入 **主机管理 → 添加主机**
3. 填写配置：

   | 字段 | 值 |
   |------|-----|
   | 主机名称 | `esxi-01` |
   | 主机类型 | `VMware vSphere ESXi` |
   | 主机地址 | ESXi IP / FQDN |
   | 主机端口 | `443` |
   | 用户名 | `openidcs` 或 `root` |
   | 密码 | 对应密码 |
   | 数据存储 | `datastore1` |
   | 网络 | `VM Network` |
   | ISO 库 | `iso-lib`（可选） |

4. 点击 **测试连接** → **保存**

## 📘 常用管理命令

```bash
# 列出虚拟机
vim-cmd vmsvc/getallvms

# 虚拟机电源
vim-cmd vmsvc/power.on <vmid>
vim-cmd vmsvc/power.shutdown <vmid>

# 查询虚拟机信息
vim-cmd vmsvc/get.summary <vmid>

# 创建快照
vim-cmd vmsvc/snapshot.create <vmid> "snap-name" "description" 1 0

# 主机信息
esxcli system version get
esxcli hardware cpu global get
esxcli hardware memory get
```

## 🐛 故障排查

### 问题 1：`vim.fault.InvalidLogin`

- 检查用户名和密码
- 确认账户未过期：`esxcli system account list`
- 检查账户权限：`esxcli system permission list`

### 问题 2：`ServerFaultCode: Permission to perform this operation was denied`

免费版 ESXi API 只读。需升级到付费版或接入 vCenter。

### 问题 3：SSL 证书验证失败

ESXi 默认使用自签证书。在 OpenIDCS 主机配置中勾选 **忽略 SSL 证书校验**，或在 ESXi 上安装受信任证书：

```bash
# 备份原证书
cp /etc/vmware/ssl/rui.crt /etc/vmware/ssl/rui.crt.bak
cp /etc/vmware/ssl/rui.key /etc/vmware/ssl/rui.key.bak

# 替换为你自己的证书
# ...

# 重启管理代理
/etc/init.d/hostd restart
/etc/init.d/vpxa restart
```

### 问题 4：时间偏移导致认证失败

```bash
# 检查时间同步
esxcli system time get

# 强制同步
/etc/init.d/ntpd restart
```

## 🔒 安全建议

- 禁用 SSH 日常访问，仅在排障时临时开启
- 启用 **Lockdown Mode**：`Web UI → 主机 → 安全 → 锁定模式 → 正常`
- 专用服务账户，避免使用 root 对接 API
- 定期应用 VMware Security Advisories 补丁
- vSwitch 与业务网络分离 VLAN

## 📚 参考资源

- [VMware vSphere 文档中心](https://docs.vmware.com/cn/VMware-vSphere/)
- [pyvmomi GitHub](https://github.com/vmware/pyvmomi)
- [ESXi CLI 参考](https://developer.vmware.com/docs/esxcli/)

## 下一步

- 🖥️ 查看 [VMware Workstation 配置](/vm/vmware)
- 🏢 查看 [Proxmox VE 配置](/vm/proxmox)
- 🚀 返回 [快速上手](/guide/quick-start)
