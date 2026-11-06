# LXC / LXD

> 🐧 系统级容器 · 媲美 VM 的隔离 · 超高密度 · IDC 售卖 VPS 首选

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🧱 **系统级容器** | 运行完整 Linux 发行版（Ubuntu/CentOS/Debian/...），类似 VM 但开销极低 |
| 🚀 **极致密度** | 单机可跑 **数百到上千个 VPS**，成本最低 |
| ⚡ **秒级开通** | 从模板克隆新容器仅需 1~3 秒，适合按需开通售卖 |
| 💾 **存储池** | 支持 ZFS / Btrfs / LVM 写时复制，磁盘共享节省空间 |
| 🌐 **网络** | Bridge / Macvlan / OVN，支持 IPv4+IPv6 双栈、NAT、限速、流量统计 |
| 🔁 **OpenIDCS 能力** | 创建 / 启停 / 重启 / 快照 / 迁移 / 流量统计 / 带宽限制 / VNC / WebSSH |
| 🔌 **FSPlugins** | `LxdServer-IDCSmart` 原生对接魔方财务售卖 |

## 🧱 架构示意

```
OpenIDCS MainServer
      │  HTTPS + Token
      ▼
OpenIDCS HostAgent
      │  LXD REST API（:8443）
      ▼
  LXD Daemon（lxd.service）
      │
      ├─> VPS001（Ubuntu 22.04）
      ├─> VPS002（Debian 12）
      └─> VPS003（CentOS 7）
```

## 📋 前置要求

| 项 | 要求 |
|----|------|
| 操作系统 | Ubuntu 20.04 / 22.04 / 24.04（官方推荐） |
| 内核 | ≥ 5.4 |
| 文件系统 | 推荐 **ZFS**（快照/克隆快）；也支持 Btrfs、LVM、dir |
| 内存 | ≥ 2GB（按每 VPS 平均预留） |
| 磁盘 | 独立数据盘 ≥ 50GB |

---

## 🚀 部署教程

### 步骤 1 · 安装 LXD

**Ubuntu（推荐 snap）**：

```bash
sudo snap install lxd --channel=latest/stable
sudo lxd waitready
```

**Debian**：

```bash
sudo apt install -y lxd lxd-client
```

### 步骤 2 · 初始化 LXD

```bash
sudo lxd init
```

推荐选项：

```
Would you like to use LXD clustering? [default=no]: no
Do you want to configure a new storage pool? [default=yes]: yes
Name of the new storage pool [default=default]: default
Name of the storage backend (ceph, btrfs, dir, lvm, zfs) [default=zfs]: zfs
Create a new ZFS pool? [default=yes]: yes
Would you like to use an existing empty block device? [default=no]: no
Size in GiB of the new loop device [default=30GB]: 100GB     # 按需调整
Would you like to connect to a MAAS server? [default=no]: no
Would you like to create a new local network bridge? [default=yes]: yes
What should the new bridge be called? [default=lxdbr0]: lxdbr0
What IPv4 address should be used? [default=auto]: auto
What IPv6 address should be used? [default=auto]: auto
Would you like LXD to be available over the network? [default=no]: yes
Address to bind LXD to (not including port) [default=all]: 0.0.0.0
Port to bind LXD to [default=8443]: 8443
Trust password for new clients: <设置密码>
Would you like stale cached images to be updated automatically? [default=yes]: yes
```

### 步骤 3 · 开放 LXD REST API

```bash
lxc config set core.https_address "[::]:8443"
lxc config set core.trust_password <你的信任密码>
# 防火墙放行
sudo ufw allow 8443/tcp
```

### 步骤 4 · 安装 OpenIDCS HostAgent

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install-agent.sh \
  | sudo bash -s -- \
    --server https://openidcs.example.com \
    --token <Agent Token> \
    --driver lxd
```

### 步骤 5 · 在 OpenIDCS 中添加 LXD 平台

1. 后台 → **主机管理 → 添加主机**。
2. 填写：
   - **平台类型**：LXD
   - **主机地址**：`https://192.168.1.20:8443`
   - **认证方式**：`trust_password` 或 **客户端证书**
   - **信任密码**：步骤 3 中设置的密码
3. 点击 **测试连接 → 保存**。

OpenIDCS 会自动下发客户端证书并完成信任握手。

### 步骤 6 · 创建第一个 LXD 容器

1. **虚拟机 → 创建 → 平台：LXD**。
2. 填写：

| 字段 | 示例 |
|------|------|
| 镜像 | `ubuntu/22.04`（自动从 images.linuxcontainers.org 拉） |
| 名称 | `vps-001` |
| CPU | 2 核 |
| 内存 | 2 GB |
| 磁盘 | 20 GB |
| 网络 | `lxdbr0` + 自动分配 IP |
| 限速 | 100 Mbps（可选） |
| 初始密码 | `ChangeMe!` |

3. 创建 → 等待几秒完成。
4. 可使用 **WebSSH / noVNC / 控制台密码** 登录。

---

## 🧰 常用操作

### 创建自定义模板

先起一个模板容器，安装常用工具后打包：

```bash
lxc launch ubuntu/22.04 template-ubuntu
lxc exec template-ubuntu -- apt update && apt install -y curl wget vim htop
lxc stop template-ubuntu
lxc publish template-ubuntu --alias my-ubuntu-22-tpl
```

OpenIDCS 后续创建时可选该模板，**秒级开通**。

### 限制网络带宽

```bash
lxc config device set vps-001 eth0 limits.egress 10Mbit
lxc config device set vps-001 eth0 limits.ingress 10Mbit
```

OpenIDCS 在创建时可直接填写 **上下行带宽**，自动写入。

### 磁盘配额

```bash
lxc config device set vps-001 root size=20GB
```

OpenIDCS 会根据用户配额自动下发。

### 迁移容器

```bash
lxc move vps-001 host2:vps-001
```

或通过 OpenIDCS **批量迁移 → 选择目标主机**。

---

## 🛡 IDC 售卖模式建议

1. **统一 ZFS 存储池**：开启压缩 `zfs set compression=lz4 tank`。
2. **使用自定义模板**：预装 SSH / sudo / 网络工具，加快开通。
3. **流量统计**：OpenIDCS 自动基于 cgroup 统计入/出流量。
4. **带宽限速**：按套餐自动下发 `limits.ingress/egress`。
5. **快照备份**：每天凌晨自动快照保留 7 天。
6. **联动 FSPlugins**：
   - 魔方财务 → `LxdServer-IDCSmart` 插件
   - SwapIDC → `OpenIDC-SwapIDC` 插件

详见 [FSPlugins 总览](/fsplugins/)。

---

## 🧯 常见问题

<details>
<summary><b>lxd init 选 ZFS 还是 dir？</b></summary>

生产环境一定选 **ZFS** 或 **Btrfs**，克隆 / 快照 / 去重性能碾压 dir。
</details>

<details>
<summary><b>LXD 4.x 与 5.x 都支持吗？</b></summary>

支持 **LXD 4.0 LTS / 5.x / 最新版 incus**。OpenIDCS 会自动检测版本。
</details>

<details>
<summary><b>容器里跑 Docker 行吗？</b></summary>

可以，需要给容器开 `security.nesting=true`：

```bash
lxc config set vps-001 security.nesting true
```

OpenIDCS 创建时勾选 **嵌套虚拟化** 即可。
</details>

---

👉 下一步：[网络与端口转发](/tutorials/network) · [用户配额](/tutorials/permissions) · [魔方财务集成](/fsplugins/idcsmart)
