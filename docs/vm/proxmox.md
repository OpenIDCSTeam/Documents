---
title: Proxmox VE 配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# Proxmox VE

> 🚀 开源企业级虚拟化 · KVM + LXC 一体 · 无 License 负担

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🆓 **开源免费** | 基于 Debian + KVM + LXC，完整开源，无 License 费 |
| 🎯 **KVM + LXC** | 一台 PVE 同时运行 VM（KVM）与系统容器（LXC） |
| 🔁 **集群** | 原生支持多节点集群、在线热迁移、HA |
| 🧱 **Ceph 内置** | 集成分布式存储，可做超融合 |
| 🔌 **OpenIDCS 能力** | 创建 / 启停 / 快照 / 克隆 / 模板 / 热迁移 / 备份 / VNC / WebSSH |
| 💼 **适合售卖** | IDC 卖 VPS 首选，配合 `OpenIDC-IDCSmart` 或 `OpenIDC-SwapIDC` 一键变财务售卖平台 |

## 📋 前置要求

| 项 | 要求 |
|----|------|
| PVE 版本 | 7.x / 8.x |
| 宿主机 | ≥ 4C 8G，支持 VT-x/AMD-V，SSD 推荐 |
| 存储 | 本地 LVM-Thin / ZFS / Ceph / NFS |
| 网络 | 管理网可达 OpenIDCS MainServer |

---

## 🚀 部署教程

### 步骤 1 · 安装 Proxmox VE

1. 下载 ISO：<https://www.proxmox.com/en/downloads>
2. 通过 IPMI / U 盘引导安装，按向导设置 root 密码、管理 IP、hostname。
3. 完成后访问 `https://<PVE-IP>:8006`。

### 步骤 2 · 关闭订阅提示（非必须）

```bash
# PVE 8.x
sed -i.bak "s/data.status !== 'Active'/false/g" /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy
```

切换为免费社区源：

```bash
cat > /etc/apt/sources.list.d/pve-no-subscription.list <<EOF
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription
EOF
rm -f /etc/apt/sources.list.d/pve-enterprise.list
apt update && apt -y dist-upgrade
```

### 步骤 3 · 创建 OpenIDCS 专用账户

推荐不要用 root，创建独立 API 账户：

```bash
pveum user add openidcs@pve --password 'StrongPass!' 
pveum aclmod / -user openidcs@pve -role Administrator
# 或最小权限：PVEVMAdmin + PVEPoolAdmin 等
```

或使用 API Token（推荐）：

```bash
pveum user token add openidcs@pve openidcs-token --privsep 0
# 输出类似：PVEAPIToken=openidcs@pve!openidcs-token=xxxxxxxx-xxxx-...
```

### 步骤 4 · 在 OpenIDCS 中添加平台

OpenIDCS 直接调用 PVE REST API（8006），**无需在 PVE 上装 HostAgent**。

1. 后台 → **主机管理 → 添加主机**。
2. 填写：

| 字段 | 示例 |
|------|------|
| 平台类型 | Proxmox VE |
| 地址 | `https://192.168.1.50:8006` |
| 认证 | 用户密码 / API Token |
| 用户 | `openidcs@pve` |
| Token ID | `openidcs-token` |
| Token Secret | `••••••••` |
| 节点 | `pve01`（可选，填则锁定单节点） |
| 默认存储 | `local-lvm` |
| 默认桥接 | `vmbr0` |

3. 测试连接 → 保存。

### 步骤 5 · 准备模板

**KVM VM 模板**：

1. PVE Web → 创建 VM，装好 Ubuntu 22.04。
2. 安装 `qemu-guest-agent` 与 `cloud-init`：

   ```bash
   apt install -y qemu-guest-agent cloud-init
   systemctl enable qemu-guest-agent
   ```

3. PVE 中 → **右键 VM → Convert to Template**。

**LXC 容器模板**：

1. PVE Web → CT 模板下载 Ubuntu 22.04、Debian 12 等。
2. 默认路径 `/var/lib/vz/template/cache/`。

### 步骤 6 · 创建 VM / CT

1. OpenIDCS → **虚拟机 → 创建 → 平台：Proxmox**。
2. 配置：

| 字段 | KVM VM | LXC CT |
|------|--------|--------|
| 类型 | qemu | lxc |
| 模板 | `ubuntu-22-tpl` | `ubuntu-22.04-standard_amd64.tar.zst` |
| CPU / 内存 | 2 / 4GB | 1 / 1GB |
| 磁盘 | 40GB `local-lvm` | 10GB `local-lvm` |
| 网络 | `vmbr0` | `vmbr0` |
| cloud-init | ✅ 注入 SSH Key | N/A |
| 初始密码 | `ChangeMe!` | `ChangeMe!` |

3. 创建 → 秒级完成（LXC）或 1~2 分钟（KVM 克隆）。

---

## 🧰 常用操作

### 热迁移（集群）

多节点集群场景下：OpenIDCS → **VM → 迁移 → 选目标节点**。底层等价：

```bash
qm migrate 100 pve02 --online
```

### 快照备份

PVE 内置 `vzdump`，OpenIDCS 支持配置：

- 定时快照保留 7 天
- vzdump 备份到 NFS/PBS
- 备份成功通过告警通道通知

### Ceph 超融合（进阶）

3 节点以上集群可启用 Ceph：**PVE Web → Datacenter → Ceph**，OpenIDCS 自动识别 Ceph 存储池。

---

## 🛡 IDC 售卖模式

典型配合方案：

- 小规格 VPS（1C1G、1C2G） → **LXC 容器**（密度高，开通快）
- 中大规格 / Windows → **KVM VM**
- 财务系统：
  - SwapIDC → [`OpenIDC-SwapIDC`](/fsplugins/swapidc)
  - 魔方财务 → [`OpenIDC-IDCSmart`](/fsplugins/idcsmart)
  - 小黑云 → [`OpenIDC-XiaoHei`](/fsplugins/xiaohei)

## 🧯 常见问题

<details>
<summary><b>API Token 权限不够？</b></summary>

授权时注意 `--privsep 0` 让 Token 继承用户权限，或单独给 Token 加 ACL。
</details>

<details>
<summary><b>cloud-init 没生效？</b></summary>

模板必须安装 `cloud-init` 包，且 PVE 中 VM 配置包含 `ide2: local-lvm:cloudinit`。
</details>

<details>
<summary><b>集群加节点要重启吗？</b></summary>

不用。`pvecm add` 后 OpenIDCS 会自动发现新节点。
</details>

---

👉 相关：[ESXi 教程](/vm/esxi) · [备份与恢复](/tutorials/backup) · [魔方财务集成](/fsplugins/idcsmart)
