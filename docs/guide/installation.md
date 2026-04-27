# 完整安装部署

本章为 **进阶 / 手动部署** 指南，覆盖从源码构建、自定义配置、生产级高可用部署等场景。
若只是想快速体验，请直接看 [快速上手](/guide/quick-start)。

## 📋 系统要求

| 角色 | 最低配置 | 推荐配置 |
|------|----------|----------|
| 主控端 MainServer | 1C2G / 10GB | 2C4G / 50GB SSD |
| 受控端 HostAgent | 1C1G / 5GB | 2C2G |
| 宿主机（跑 VM） | 取决于业务 | ≥ 4C8G，支持 VT-x/AMD-V |

**软件依赖**：

- Python 3.10+
- SQLite 3.35+（默认）/ MySQL 8.0+ / PostgreSQL 14+
- Git、curl、unzip
- （可选）Caddy 2.x 用于自动 SSL
- （可选）ttyd 1.7+ 用于 Web SSH

---

## 📦 下载渠道

| 方式 | 地址 | 适用 |
|------|------|------|
| 🐙 **GitHub 源码** | <https://github.com/OpenIDCSTeam/OpenIDCS-Client> | 开发 / 二次开发 |
| 📦 **Releases** | <https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases> | 生产环境（预编译二进制） |
| 🐳 **Docker Hub** | `openidcsteam/openidcs:latest` | 容器部署 |
| 🇨🇳 **国内镜像** | <https://mirror.openidcs.org> | 大陆加速 |
| 🔌 **FSPlugins** | <https://github.com/OpenIDCSTeam/FSPlugins> | 财务对接插件 |

---

## 🧰 方式 A：一键脚本（推荐）

```bash
# 标准安装
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.sh | sudo bash

# 自定义端口 + 安装目录
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.sh \
  | sudo bash -s -- --port 8080 --prefix /data/openidcs
```

完整参数列表见 [快速上手 · 方式一](/guide/quick-start#方式一-linux-一键安装脚本推荐)。

---

## 🧱 方式 B：源码手动安装（Linux）

### 1. 安装基础依赖

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git curl sqlite3 ttyd

# CentOS / Rocky / AlmaLinux
sudo dnf install -y python3 python3-pip git curl sqlite
```

### 2. 拉取源码

```bash
sudo mkdir -p /opt/openidcs && cd /opt/openidcs
sudo git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git .
```

### 3. 创建 Python 虚拟环境

```bash
sudo python3 -m venv venv
source venv/bin/activate
pip install -r HostConfig/pipinstall.txt
```

### 4. 初始化配置

```bash
sudo cp HostConfig/config.example.yaml /etc/openidcs/config.yaml
sudo python MainServer.py --init
```

初始化会：
- 创建 SQLite 数据库 `/var/lib/openidcs/data.db`
- 生成随机初始 Token 并打印
- 创建默认管理员权限角色

### 5. 启动服务

```bash
# 前台运行（调试）
sudo python MainServer.py

# 后台运行（生产）
sudo systemctl enable --now openidcs
```

> systemd 单元文件见源码目录 `HostConfig/openidcs.service`。

### 6. 开放防火墙

```bash
# UFW (Ubuntu)
sudo ufw allow 1880/tcp

# firewalld (CentOS / Rocky)
sudo firewall-cmd --permanent --add-port=1880/tcp
sudo firewall-cmd --reload
```

---

## 🪟 方式 C：Windows 安装

### PowerShell 一键

```powershell
iwr -useb https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.ps1 | iex
```

### 手动 Setup 安装包

1. 下载 `OpenIDCS-Setup-Windows-x64.exe`：<https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases>
2. 双击安装，可选择安装路径与端口。
3. 安装完成后，服务 `OpenIDCS` 已注册并启动。
4. 初始 Token 见：`C:\Program Files\OpenIDCS\logs\init.log`。

### 从源码运行

```powershell
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r HostConfig\pipinstall.txt
python MainServer.py
```

---

## 🐳 方式 D：Docker 部署

### 单容器

```bash
docker run -d --name openidcs \
  --restart=unless-stopped \
  -p 1880:1880 \
  -v openidcs_data:/app/data \
  -v openidcs_config:/app/config \
  -e TZ=Asia/Shanghai \
  openidcsteam/openidcs:latest
```

### docker-compose + MySQL

```yaml
services:
  openidcs:
    image: openidcsteam/openidcs:latest
    restart: unless-stopped
    ports:
      - "1880:1880"
    depends_on:
      - mysql
    environment:
      TZ: Asia/Shanghai
      DB_TYPE: mysql
      DB_HOST: mysql
      DB_USER: openidcs
      DB_PASS: ChangeMe!
      DB_NAME: openidcs
    volumes:
      - ./data:/app/data
      - ./config:/app/config

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ChangeMeRoot!
      MYSQL_DATABASE: openidcs
      MYSQL_USER: openidcs
      MYSQL_PASSWORD: ChangeMe!
    volumes:
      - ./mysql:/var/lib/mysql
```

---

## 🔐 启用 HTTPS

### 使用内置 Caddy（推荐）

```yaml
# /etc/openidcs/config.yaml
web:
  enable_ssl: true
  domain: openidcs.example.com
  acme_email: admin@example.com
```

重启服务后，Caddy 会自动向 Let's Encrypt 申请证书。

### Nginx 反代

```nginx
server {
    listen 443 ssl http2;
    server_name openidcs.example.com;

    ssl_certificate     /etc/letsencrypt/live/openidcs.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/openidcs.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:1880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 🎛 部署受控端 HostAgent

每台被 OpenIDCS 管理的虚拟化宿主机都需要安装 HostAgent（除了 ESXi / Proxmox 这类本身已有 API 的平台）。

```bash
# 一键安装受控端
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install-agent.sh \
  | sudo bash -s -- --server https://openidcs.example.com --token <主控端生成的Agent Token>
```

详见 [受控端配置](/config/client)。

---

## ⚙️ 高级：生产级优化

- 数据库切换 MySQL / PostgreSQL（见 [主控端配置](/config/server)）。
- 反向代理启用 Gzip、HTTP/2、WebSocket。
- 定期备份 SQLite/数据库 + `/etc/openidcs/config.yaml`。
- 监控接入 Prometheus：`/metrics` 端点。
- 使用 Supervisor / systemd 做自动重启。

---

## 🧯 常见问题

<details>
<summary><b>安装脚本卡在 pip 下载？</b></summary>

国内环境请加镜像源：

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```
</details>

<details>
<summary><b>忘记初始 Token？</b></summary>

```bash
openidcs-cli token reset
# 或
sudo python MainServer.py --reset-token
```
</details>

<details>
<summary><b>服务启动失败？</b></summary>

```bash
journalctl -u openidcs -n 200 --no-pager
```

常见原因：端口占用、数据库权限不足、配置文件语法错误。
</details>

---

👉 下一步：[主控端配置](/config/server) · [受控端配置](/config/client) · [添加第一个虚拟化平台](/vm/comparison)