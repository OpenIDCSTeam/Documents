# Docker / Podman

> 🐳 轻量容器虚拟化 · 秒级开通 · 镜像复用 · 跨平台（Linux / Windows / macOS）

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🪶 **超轻量** | 单容器常驻内存最低 10MB，开通速度秒级 |
| 🐧 **镜像生态** | 拉取 Docker Hub / 私有 Registry 镜像即可使用 |
| 🧩 **多平台** | Linux（原生）、Windows（Docker Desktop / WSL2）、macOS |
| 🔁 **OpenIDCS 能力** | 创建 / 启停 / 重启 / 删除 · 镜像管理 · WebSSH · 端口映射 · 日志 · 资源监控 |
| 🛠 **Podman 兼容** | 完全兼容 Docker CLI，无 daemon、无 root，适合企业合规场景 |
| 📦 **Compose 支持** | 支持在 OpenIDCS 中通过 docker-compose.yml 一键部署应用栈 |
| 🌐 **网络** | 自动桥接 / 自定义网络 / 端口转发 / IPv6 |

## 🧱 架构示意

```
OpenIDCS MainServer
      │  HTTPS + Token
      ▼
OpenIDCS HostAgent（运行在宿主机）
      │  dockerd.sock / podman.sock
      ▼
  Docker / Podman Engine
      │
      ├─> Container A（Ubuntu）
      ├─> Container B（Nginx）
      └─> Container C（MySQL）
```

## 📋 前置要求

| 项 | 要求 |
|----|------|
| 操作系统 | Ubuntu 20.04+ / Debian 11+ / CentOS 7+ / Windows 10/11 / Windows Server 2019+ |
| 架构 | x86_64 / ARM64 |
| 内核 | Linux ≥ 4.0，建议 ≥ 5.4 |
| Docker | 20.10+（Podman ≥ 4.0） |
| 磁盘 | ≥ 20GB（存镜像与容器层） |

---

## 🚀 部署教程

### 步骤 1 · 在宿主机安装 Docker

**Linux (Ubuntu/Debian)**：

```bash
curl -fsSL https://get.docker.com | sudo bash
sudo systemctl enable --now docker
docker version
```

**CentOS / Rocky**：

```bash
sudo dnf install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io
sudo systemctl enable --now docker
```

**Podman（替代方案）**：

```bash
sudo dnf install -y podman podman-docker
sudo systemctl enable --now podman.socket
```

**Windows**：下载 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 安装即可，建议启用 WSL2 后端。

### 步骤 2 · 安装 OpenIDCS HostAgent

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install-agent.sh \
  | sudo bash -s -- \
    --server https://openidcs.example.com \
    --token <Agent Token> \
    --driver docker
```

::: tip
`--driver docker` 会自动将 HostAgent 加入 `docker` 用户组，使其能访问 `/var/run/docker.sock`。
:::

### 步骤 3 · 在 OpenIDCS 中添加平台

1. 登录 OpenIDCS 管理后台 → **主机管理 → 添加主机**。
2. 填写：
   - **平台类型**：Docker / Podman
   - **名称**：`docker-node-01`
   - **连接方式**：本地 Socket / TCP / SSH
   - **Socket 路径**（本地）：`/var/run/docker.sock`
   - **TCP 地址**（远程）：`tcp://192.168.1.10:2375`（⚠️ 建议配合 TLS）
3. 点击 **测试连接** → 绿勾后保存。

### 步骤 4 · 创建第一个容器

1. 进入 **虚拟机 → 创建**。
2. 选择 **平台：Docker**、**主机：docker-node-01**。
3. 配置：

| 字段 | 示例 |
|------|------|
| 镜像 | `ubuntu:22.04` |
| 名称 | `test-vm-001` |
| CPU | 1 核 |
| 内存 | 512 MB |
| 磁盘 | 10 GB |
| 端口映射 | `22:22`、`80:8080` |
| 启动命令 | `/sbin/init`（systemd 容器）/ 为空（默认 CMD） |
| 初始密码 | `ChangeMe!` |

4. 点击 **创建**，后台异步拉镜像并启动。
5. 开机后可：**WebSSH**、查看日志、动态扩容、备份。

---

## 🔧 常用操作

### 拉取自定义镜像

```bash
# 在 HostAgent 宿主机预拉
docker pull nginx:1.25
docker pull mysql:8.0
```

OpenIDCS 中创建容器时即可直接选择该镜像。

### 使用 docker-compose 模板

OpenIDCS 支持保存 Compose 模板（**模板中心 → Compose**），用户可一键部署：

```yaml
services:
  nginx:
    image: nginx:1.25
    ports:
      - "80:80"
  app:
    image: myapp:latest
    environment:
      DB_HOST: mysql
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ChangeMe!
```

### systemd 容器（推荐 VPS 售卖）

使用 `jrei/systemd-ubuntu`、`jrei/systemd-debian` 等镜像，可提供"类 VM"体验：

```
镜像：jrei/systemd-ubuntu:22.04
启动命令：/sbin/init
挂载：/sys/fs/cgroup:/sys/fs/cgroup:ro
特权：--privileged
```

### 私有 Registry

**系统设置 → 镜像仓库** 添加：

```
地址：registry.example.com
用户：admin
密码：••••••
```

---

## 🛡 安全建议

- ✅ 默认禁用远程 TCP 无认证 Socket，建议仅本地或通过 TLS 暴露。
- ✅ 对售卖的容器启用 **CPU / 内存 / PID / 磁盘 IO** cgroup 限制。
- ✅ 使用 `--cap-drop ALL` + 按需授权 Capability。
- ✅ 启用用户命名空间（userns-remap）隔离 root。
- ✅ 定期清理未使用的镜像：`docker system prune -af`。

## 🧯 常见问题

<details>
<summary><b>HostAgent 无法访问 Docker？</b></summary>

确认 HostAgent 进程用户在 `docker` 组：

```bash
sudo usermod -aG docker openidcs-agent
sudo systemctl restart openidcs-agent
```
</details>

<details>
<summary><b>容器创建后无法 WebSSH？</b></summary>

镜像需要有 `sshd` 或支持 `docker exec`。对 Alpine 镜像需安装 `openssh`：

```bash
apk add --no-cache openssh
```
</details>

<details>
<summary><b>想用 Podman 但 Socket 路径不同？</b></summary>

Podman Socket 通常是 `/run/podman/podman.sock`，在 OpenIDCS 添加主机时填写即可。
</details>

---

👉 下一步：[创建容器模板](/tutorials/vm-management) · [网络与端口转发](/tutorials/network) · [FSPlugins 售卖容器](/fsplugins/)
