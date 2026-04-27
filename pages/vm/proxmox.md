---
title: Proxmox VE 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# Proxmox VE 配置教程

本文介绍如何将 **Proxmox VE** 主机接入 OpenIDCS 进行统一管理。Proxmox VE 是基于 Debian 的企业级开源虚拟化平台，底层同时支持 KVM（虚拟机）和 LXC（容器），是 VMware vSphere 的主流开源替代方案。

## ✨ 优缺点一览

### 👍 优点

- **开源免费**：GNU AGPLv3，无许可证费用
- **全功能 Hypervisor**：支持 KVM + LXC，一套平台解决虚拟机和容器需求
- **生产级稳定**：基于 Debian Linux，已在大量 IDC 商用环境验证
- **集群 & HA**：原生支持多节点集群、在线迁移、高可用
- **完整 Web UI**：自带 Web 管理界面，REST API 功能完整
- **备份生态**：内置 Proxmox Backup Server 支持增量备份

### 👎 缺点

- **硬件要求高**：建议独立服务器，不建议嵌套虚拟化
- **学习曲线**：集群、存储、网络概念较多
- **ZFS 依赖**：要发挥最佳性能需配合 ZFS 存储，内存占用较高
- **受控端只能 Debian 系**：Proxmox 基于 Debian，无法安装到 CentOS/RHEL 等系统

### 🎯 推荐场景

- IDC 虚拟化平台售卖
- 中小企业核心生产环境
- 开源私有云底座

## 🖥️ 系统要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| **CPU** | 支持 Intel VT-x / AMD-V | 多核服务器 CPU |
| **内存** | 4 GB | 16 GB + |
| **磁盘** | 32 GB SSD | 2 块 SSD (ZFS Mirror) |
| **网卡** | 1 Gbps | 2 × 10 Gbps |
| **操作系统** | Proxmox VE 7.x / 8.x | Proxmox VE 8.x |

::: warning 注意
Proxmox VE 是独立的操作系统，**不能安装在已有的 Linux 发行版上**。需使用官方 ISO 全新安装。
:::

## 🚀 受控端安装

### 步骤 1：下载 Proxmox VE ISO

从官网下载最新 ISO：

```
https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso
```

推荐版本：**Proxmox VE 8.x**

### 步骤 2：安装 Proxmox VE

1. 使用 Rufus / dd 制作启动 U 盘：
   ```bash
   # Linux/macOS
   sudo dd if=proxmox-ve_8.x.iso of=/dev/sdX bs=4M status=progress
   ```
2. 服务器 BIOS 中开启 **Intel VT-x / AMD-V**
3. U 盘启动，按向导完成安装：
   - 选择安装磁盘（推荐 ZFS RAID1 或 LVM）
   - 设置 root 密码
   - 配置网络（静态 IP）
4. 安装完成后访问：`https://<your-ip>:8006`

### 步骤 3：配置软件源（国内加速）

```bash
# SSH 登录 PVE 主机
ssh root@<pve-ip>

# 替换 Debian 源为国内源
sed -i 's|http://deb.debian.org|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list

# 禁用企业源
echo "" > /etc/apt/sources.list.d/pve-enterprise.list

# 添加 PVE 无订阅源
echo "deb https://mirrors.tuna.tsinghua.edu.cn/proxmox/debian/pve bookworm pve-no-subscription" \
  > /etc/apt/sources.list.d/pve-no-subscription.list

# 更新
apt update && apt -y dist-upgrade
```

### 步骤 4：创建 API Token（推荐）

OpenIDCS 推荐使用 API Token 而非密码认证：

```bash
# SSH 登录 PVE
ssh root@<pve-ip>

# 创建用户（如果使用独立账户）
pveum user add openidcs@pve

# 授予管理员权限
pveum aclmod / -user openidcs@pve -role Administrator

# 创建 Token
pveum user token add openidcs@pve openidcs-token --privsep 0
```

输出示例：

```
┌──────────────┬──────────────────────────────────────┐
│ key          │ value                                │
├──────────────┼──────────────────────────────────────┤
│ full-tokenid │ openidcs@pve!openidcs-token          │
│ info         │ {"privsep":"0"}                      │
│ value        │ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx │
└──────────────┴──────────────────────────────────────┘
```

::: tip 保存 Token
`value` 只显示一次，**请立即保存**。
:::

### 步骤 5：配置防火墙

```bash
# 允许 OpenIDCS 主控端访问 8006 端口
iptables -A INPUT -p tcp --dport 8006 -s <openidcs-host>/32 -j ACCEPT

# 持久化（可选，建议使用 PVE Web UI 防火墙）
apt install iptables-persistent -y
netfilter-persistent save
```

或在 Proxmox Web UI 的 "**数据中心 → 防火墙**" 中启用并放行 8006/tcp。

### 步骤 6：配置存储池（可选）

如需用于备份，建议创建独立存储池：

```bash
# 创建 ZFS 数据集
zfs create rpool/backup

# PVE UI: 数据中心 → 存储 → 添加 → 目录
# 路径: /rpool/backup   内容类型: 备份, ISO, 容器模板
```

### 步骤 7：开启嵌套虚拟化（可选）

如果需要在 PVE VM 中再跑虚拟化：

```bash
# Intel 平台
echo "options kvm-intel nested=Y" > /etc/modprobe.d/kvm-intel.conf

# AMD 平台
echo "options kvm-amd nested=1" > /etc/modprobe.d/kvm-amd.conf

# 重启模块
modprobe -r kvm_intel && modprobe kvm_intel
```

## 🔗 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入 **主机管理 → 添加主机**
3. 填写配置：

   | 字段 | 值 |
   |------|-----|
   | 主机名称 | `pve-01` |
   | 主机类型 | `Proxmox VE` |
   | 主机地址 | PVE IP 地址 |
   | 主机端口 | `8006` |
   | 用户名 | `openidcs@pve` 或 `root@pam` |
   | Token ID | `openidcs-token` |
   | Token Secret | 第 4 步保存的 value |
   | 存储池 | `local-zfs` 或 `local-lvm` |
   | 默认网桥 | `vmbr0` |

4. 点击 **测试连接**，成功后点击 **保存**

## 📘 常用运维命令

```bash
# 查看集群状态
pvecm status

# 查看虚拟机列表
qm list

# 启动/停止 VM
qm start 100
qm shutdown 100

# 创建快照
qm snapshot 100 snap1

# 备份
vzdump 100 --mode snapshot --compress zstd --storage local

# 查看容器
pct list

# 进入容器
pct enter 200
```

## 🐛 故障排查

### 问题 1：API 连接超时

```bash
# 1. 检查 pveproxy 服务
systemctl status pveproxy

# 2. 检查端口
ss -tlnp | grep 8006

# 3. 重启
systemctl restart pveproxy pvedaemon
```

### 问题 2：Token 认证失败

```bash
# 列出用户 Token
pveum user token list openidcs@pve

# 检查权限
pveum acl list
```

### 问题 3：VM 创建失败 "no such storage"

Web UI: **数据中心 → 存储**，确认存储池 `local-lvm` / `local-zfs` 存在且启用了虚拟磁盘。

## 🔒 安全建议

- 关闭 root SSH 密码登录，改用 SSH Key
- 启用 Proxmox Firewall，只放行必要端口
- API Token 勾选 **Privilege Separation**（按最小权限授权）
- 定期 `apt update && apt dist-upgrade` 打补丁
- 备份存储与生产存储物理分离

## 📚 参考资源

- [Proxmox VE 官方文档](https://pve.proxmox.com/pve-docs/)
- [Proxmox API 文档](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Proxmox 中文社区](https://foxi.buduanwang.vip/)

## 下一步

- 🏢 查看 [VMware ESXi 配置](/vm/esxi)
- 🪟 查看 [Windows Hyper-V 配置](/vm/hyperv)
- 🚀 返回 [快速上手](/guide/quick-start)
