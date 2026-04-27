# 安装部署

本页提供 OpenIDCS **主控端**的完整安装部署方案，包含 5 种常用模式，选择一种即可。

> 如果只想 5 分钟跑起来试试，直接看 [快速上手](/quick-start/)。

## 部署模式总览

| 模式 | 适用场景 | 复杂度 | 启动速度 |
|------|----------|--------|----------|
| **方式 1：二进制直接运行** | 个人 / 小团队 / 首次体验 | ⭐ | ⭐⭐⭐⭐⭐ |
| **方式 2：源码 + Python 虚拟环境** | 开发者 / 需要自定义 | ⭐⭐ | ⭐⭐⭐⭐ |
| **方式 3：Docker / Docker Compose** | 容器化基础设施 | ⭐⭐ | ⭐⭐⭐⭐ |
| **方式 4：Systemd 系统服务** | 生产 Linux 服务器 | ⭐⭐⭐ | ⭐⭐⭐ |
| **方式 5：Windows 服务 (NSSM)** | 生产 Windows 服务器 | ⭐⭐⭐ | ⭐⭐⭐ |

## 系统要求

### 硬件

| 组件 | 最低 | 推荐 |
|------|------|------|
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8 GB+ |
| 存储 | 20 GB | 50 GB+ |
| 网络 | 100 Mbps | 1 Gbps+ |

### 软件

| 软件 | 版本 |
|------|------|
| Python | 3.8+（推荐 3.9 / 3.10） |
| Git | 2.0+ |
| pip | 最新 |

### 操作系统

- ✅ Windows 10 / 11 / Server 2016+
- ✅ Ubuntu 18.04 / 20.04 / 22.04
- ✅ Debian 10+
- ✅ CentOS / RHEL / Rocky / AlmaLinux 7+
- ✅ macOS 10.14+

### 网络端口

| 端口 | 用途 |
|------|------|
| 1880 | Web 管理界面（可改） |
| 6080 | VNC WebSocket 代理 |
| 7681 | Web SSH 终端 |

---

## 方式 1：二进制直接运行（推荐首次体验）

### Windows

```powershell
# 1. 下载最新版本
# https://github.com/OpenIDCSTeam/Backends/releases

# 2. 解压到任意目录，例如 C:\OpenIDCS\

# 3. 双击 OpenIDCS-Client.exe 或
OpenIDCS-Client.exe

# 4. 浏览器访问
start http://localhost:1880
```

### Linux

```bash
# 1. 下载二进制
wget https://github.com/OpenIDCSTeam/Backends/releases/latest/download/OpenIDCS-Client-linux-x86_64.tar.gz
tar -xzf OpenIDCS-Client-linux-x86_64.tar.gz
cd OpenIDCS-Client

# 2. 运行
chmod +x OpenIDCS-Client
./OpenIDCS-Client

# 3. 访问
curl http://localhost:1880
```

### macOS

```bash
wget https://github.com/OpenIDCSTeam/Backends/releases/latest/download/OpenIDCS-Client-darwin.tar.gz
tar -xzf OpenIDCS-Client-darwin.tar.gz
cd OpenIDCS-Client
./OpenIDCS-Client
```

---

## 方式 2：源码 + Python 虚拟环境

适合希望自定义 / 二开 / 贡献代码的用户。

### Linux / macOS

```bash
# 1. 克隆仓库
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 2. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/pipinstall.txt

# 4. 启动
python HostServer.py
```

### Windows

```batch
:: 1. 克隆仓库
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

:: 2. 创建虚拟环境
python -m venv venv
venv\Scripts\activate

:: 3. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/pipinstall.txt

:: 4. 启动
python HostServer.py
```

### 前端开发（可选）

仅当需要修改前端时：

```bash
cd FrontPages
npm install
npm run dev           # 开发模式，热更新
npm run build         # 生产构建
```

---

## 方式 3：Docker 部署

### 3.1 Dockerfile

项目根目录下已提供 Dockerfile（如无可新建）：

```dockerfile
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc git curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir -r HostConfig/pipinstall.txt

RUN mkdir -p DataSaving logs

EXPOSE 1880 6080 7681

CMD ["python", "HostServer.py", "--production"]
```

### 3.2 docker-compose.yml

```yaml
version: '3.8'

services:
  openidcs:
    build: .
    container_name: openidcs
    restart: unless-stopped
    ports:
      - "1880:1880"
      - "6080:6080"
      - "7681:7681"
    volumes:
      - ./DataSaving:/app/DataSaving
      - ./logs:/app/logs
      # 若本机作为 Docker 受控端，挂载 socket
      # - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=change-me-in-production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1880/api/system/stats"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 3.3 启动

```bash
docker-compose up -d        # 启动
docker-compose logs -f      # 查看日志
docker-compose down         # 停止
docker-compose pull         # 拉取最新镜像
```

---

## 方式 4：Systemd 系统服务（Linux 生产）

### 4.1 准备工作

```bash
# 1. 创建专用用户
sudo useradd -r -s /bin/false openidcs

# 2. 安装到 /opt
sudo mkdir -p /opt/OpenIDCS-Client
sudo chown openidcs:openidcs /opt/OpenIDCS-Client
cd /opt
sudo -u openidcs git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git OpenIDCS-Client
cd OpenIDCS-Client

# 3. Python 虚拟环境
sudo -u openidcs python3 -m venv venv
sudo -u openidcs venv/bin/pip install --upgrade pip
sudo -u openidcs venv/bin/pip install -r HostConfig/pipinstall.txt

# 4. 数据目录
sudo -u openidcs mkdir -p DataSaving logs
```

### 4.2 创建 service 文件

`/etc/systemd/system/openidcs.service`：

```ini
[Unit]
Description=OpenIDCS Server
Documentation=https://github.com/OpenIDCSTeam/OpenIDCS-Client
After=network.target

[Service]
Type=simple
User=openidcs
Group=openidcs
WorkingDirectory=/opt/OpenIDCS-Client
Environment=PATH=/opt/OpenIDCS-Client/venv/bin
Environment=FLASK_ENV=production
ExecStart=/opt/OpenIDCS-Client/venv/bin/python HostServer.py --production
Restart=always
RestartSec=3

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/OpenIDCS-Client/DataSaving /opt/OpenIDCS-Client/logs

MemoryLimit=2G
CPUQuota=200%

[Install]
WantedBy=multi-user.target
```

### 4.3 启用

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now openidcs
sudo systemctl status openidcs
sudo journalctl -u openidcs -f
```

---

## 方式 5：Windows 服务 (NSSM)

### 5.1 安装 NSSM

从 [nssm.cc](https://nssm.cc/download) 下载，解压到任意路径。

### 5.2 安装服务

```batch
:: 以管理员运行 cmd
nssm install OpenIDCS "C:\OpenIDCS-Client\venv\Scripts\python.exe" "HostServer.py --production"
nssm set OpenIDCS AppDirectory "C:\OpenIDCS-Client"
nssm set OpenIDCS DisplayName "OpenIDCS Server"
nssm set OpenIDCS Description "OpenIDCS Virtualization Management Platform"
nssm set OpenIDCS Start SERVICE_AUTO_START
nssm set OpenIDCS AppStdout "C:\OpenIDCS-Client\logs\stdout.log"
nssm set OpenIDCS AppStderr "C:\OpenIDCS-Client\logs\stderr.log"

:: 启动
nssm start OpenIDCS

:: 状态
sc query OpenIDCS
```

---

## 启动后的初始化

无论使用哪种部署方式，**首次启动**都会发生以下事情：

1. 自动在 `DataSaving/` 下生成 `database.db`
2. 控制台输出一个**首次访问 Token**（形如 `abc123def456...`）
3. 监听 `0.0.0.0:1880` 提供 Web / API 服务

### 首次登录

1. 浏览器打开 `http://主控端IP:1880`
2. 输入 Token 登录
3. 进入"用户管理"创建一个管理员账户
4. 之后用账户密码登录即可

> Token 建议只在首次使用，创建管理员后应立即删除 Token 或使其失效。

## 反向代理 + HTTPS（强烈推荐生产环境）

生产环境**不应**让 Flask 直接对外。推荐用 Nginx 反代 + Let's Encrypt 证书：

```nginx
server {
    listen 443 ssl http2;
    server_name idcs.example.com;

    ssl_certificate     /etc/letsencrypt/live/idcs.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/idcs.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass         http://127.0.0.1:1880;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
    }

    location /websockify {
        proxy_pass         http://127.0.0.1:6080;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

server {
    listen 80;
    server_name idcs.example.com;
    return 301 https://$server_name$request_uri;
}
```

完整的 Nginx / 防火墙 / 证书配置见 [主控端配置](/config/server)。

## 升级

```bash
# 1. 备份
cp -r DataSaving DataSaving.backup.$(date +%Y%m%d)

# 2. 停止
sudo systemctl stop openidcs       # systemd
# 或 docker-compose down            # docker

# 3. 更新
git pull
pip install -r HostConfig/pipinstall.txt --upgrade

# 4. 启动
sudo systemctl start openidcs
```

## 卸载

```bash
# systemd
sudo systemctl disable --now openidcs
sudo rm /etc/systemd/system/openidcs.service
sudo rm -rf /opt/OpenIDCS-Client

# docker
docker-compose down -v

# windows
nssm stop OpenIDCS
nssm remove OpenIDCS confirm
```

## 常见问题

| 问题 | 排查 |
|------|------|
| 端口被占用 | `netstat -ano \| findstr 1880` / `lsof -i :1880` |
| 依赖安装失败 | 换国内镜像：`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r ...` |
| 看不到控制台 Token | 查看 `DataSaving/log-main.log` |
| Docker 里启动慢 | 加 `--production` 参数 |
| Windows 下权限问题 | 右键 "以管理员身份运行" |

## 下一步

- 🚀 查看 [快速上手](/guide/quick-start) 进行首次配置
- ⚙️ 查看 [主控端配置](/config/server) 了解性能 / 安全调优
- 🖥️ 查看 [受控端配置](/config/client) 添加第一台虚拟化主机
