# 主控端配置

主控端是运行 OpenIDCS 管理服务的服务器，负责连接和管理所有受控端。本文档介绍如何配置和优化主控端。

## 系统要求

### 硬件要求

| 组件 | 最低配置 | 推荐配置 | 说明 |
|------|----------|----------|------|
| **CPU** | 2核 | 4核+ | 根据管理的虚拟机数量调整 |
| **内存** | 4GB | 8GB+ | 建议每管理100台虚拟机增加2GB |
| **存储** | 20GB | 50GB+ | 用于日志、备份和数据库 |
| **网络** | 100Mbps | 1Gbps+ | 影响管理响应速度 |

### 软件要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **Python** | 3.8+ | 推荐 3.9 或 3.10 |
| **pip** | 最新版本 | Python 包管理器 |
| **Git** | 2.0+ | 用于下载项目 |

### 操作系统支持

- ✅ Windows 10/11, Windows Server 2016+
- ✅ Ubuntu 18.04+, Debian 10+
- ✅ CentOS 7+, RHEL 7+, Rocky Linux 8+
- ✅ macOS 10.14+

## 安装部署

### 方式一：标准部署

#### Windows 环境

```batch
:: 1. 克隆项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

:: 2. 安装依赖
pip install -r HostConfig/requirements.txt

:: 3. 创建数据目录
mkdir DataSaving
mkdir logs

:: 4. 启动服务
python HostServer.py
```

#### Linux 环境

```bash
# 1. 克隆项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 2. 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/requirements.txt

# 4. 创建数据目录
mkdir -p DataSaving logs

# 5. 启动服务
python HostServer.py
```

### 方式二：Docker 部署

#### 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  openidc-server:
    build: .
    container_name: openidc-server
    ports:
      - "1880:1880"
      - "6080:6080"
      - "7681:7681"
    volumes:
      - ./DataSaving:/app/DataSaving
      - ./logs:/app/logs
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - FLASK_ENV=production
      - HOST_SERVER_PORT=1880
      - SECRET_KEY=${SECRET_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1880/api/system/stats"]
      interval: 30s
      timeout: 10s
      retries: 3
```

创建 `Dockerfile`：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY . .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r HostConfig/requirements.txt

# 创建数据目录
RUN mkdir -p DataSaving logs

# 暴露端口
EXPOSE 1880 6080 7681

# 启动命令
CMD ["python", "HostServer.py", "--production"]
```

启动服务：

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式三：系统服务部署

#### Linux Systemd 服务

创建服务文件 `/etc/systemd/system/openidc-server.service`：

```ini
[Unit]
Description=OpenIDCS Server
Documentation=https://github.com/OpenIDCSTeam/OpenIDCS-Client
After=network.target

[Service]
Type=simple
User=openidc
Group=openidc
WorkingDirectory=/opt/OpenIDCS-Client
Environment=PATH=/opt/OpenIDCS-Client/venv/bin
Environment=FLASK_ENV=production
ExecStart=/opt/OpenIDCS-Client/venv/bin/python HostServer.py --production
ExecReload=/bin/kill -USR1 $MAINPID
Restart=always
RestartSec=3

# 安全设置
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/OpenIDCS-Client/DataSaving /opt/OpenIDCS-Client/logs

# 资源限制
MemoryLimit=2G
CPUQuota=200%

[Install]
WantedBy=multi-user.target
```

部署步骤：

```bash
# 1. 创建专用用户
sudo useradd -r -s /bin/false openidc

# 2. 安装项目
sudo mkdir -p /opt/OpenIDCS-Client
sudo chown openidc:openidc /opt/OpenIDCS-Client
cd /opt
sudo -u openidc git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git OpenIDCS-Client
cd OpenIDCS-Client

# 3. 设置 Python 环境
sudo -u openidc python3 -m venv venv
sudo -u openidc venv/bin/pip install --upgrade pip
sudo -u openidc venv/bin/pip install -r HostConfig/requirements.txt

# 4. 创建数据目录
sudo -u openidc mkdir -p DataSaving logs

# 5. 配置系统服务
sudo systemctl daemon-reload
sudo systemctl enable openidc-server
sudo systemctl start openidc-server

# 6. 查看状态
sudo systemctl status openidc-server
```

#### Windows 服务

使用 NSSM（Non-Sucking Service Manager）：

```batch
:: 1. 下载 NSSM
:: https://nssm.cc/download

:: 2. 安装服务
nssm install OpenIDCS "C:\Python39\python.exe" "C:\OpenIDCS-Client\HostServer.py"

:: 3. 配置服务
nssm set OpenIDCS AppDirectory "C:\OpenIDCS-Client"
nssm set OpenIDCS DisplayName "OpenIDCS Server"
nssm set OpenIDCS Description "OpenIDCS Virtualization Management Platform"
nssm set OpenIDCS Start SERVICE_AUTO_START

:: 4. 启动服务
nssm start OpenIDCS
```

## 配置文件

### 环境变量配置

创建 `.env` 文件：

```bash
# 应用配置
FLASK_ENV=production
HOST_SERVER_PORT=1880
SECRET_KEY=your-secret-key-change-in-production

# 数据库配置
DATABASE_PATH=DataSaving/database.db

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=DataSaving/log-main.log
LOG_ROTATION=10 MB
LOG_RETENTION=7 days

# 安全配置
TOKEN_EXPIRE_HOURS=24
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=30
ENABLE_REGISTRATION=false

# 会话配置
SESSION_TIMEOUT=3600
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTPONLY=true

# 备份配置
AUTO_BACKUP=true
BACKUP_INTERVAL=86400
BACKUP_RETENTION_DAYS=30

# 监控配置
ENABLE_MONITORING=true
MONITORING_INTERVAL=60
```

### 主机配置

首次启动后会在 `DataSaving/` 目录生成配置文件。

#### hosts.json

```json
{
  "hosts": {
    "docker-01": {
      "server_name": "docker-01",
      "server_type": "Docker",
      "server_addr": "192.168.1.101",
      "server_port": 2376,
      "launch_path": "/path/to/certs",
      "network_pub": "docker-pub",
      "network_nat": "docker-nat",
      "images_path": "/var/lib/docker-images",
      "system_path": "/var/lib/docker-data",
      "backup_path": "/var/lib/docker-backups",
      "enabled": true,
      "max_vms": 100
    },
    "lxd-01": {
      "server_name": "lxd-01",
      "server_type": "LXD",
      "server_addr": "192.168.1.100",
      "server_port": 8443,
      "launch_path": "/path/to/certs",
      "network_pub": "br-pub",
      "network_nat": "br-nat",
      "system_path": "/var/lib/lxd/containers",
      "images_path": "/var/lib/lxd/images",
      "backup_path": "/var/lib/lxd/backups",
      "enabled": true,
      "max_vms": 50
    },
    "vmware-01": {
      "server_name": "vmware-01",
      "server_type": "VmwareWork",
      "server_addr": "192.168.1.0",
      "server_port": 8697,
      "server_user": "administrator",
      "server_pass": "encrypted_password",
      "vm_path": "C:\\Virtual Machines\\",
      "enabled": true,
      "max_vms": 50
    }
  }
}
```

#### settings.json

```json
{
  "system": {
    "auto_start": true,
    "backup_interval": 3600,
    "cleanup_temp": true,
    "log_level": "INFO"
  },
  "network": {
    "ip_pools": [
      {
        "name": "public-pool",
        "start": "114.193.206.1",
        "end": "114.193.206.254",
        "gateway": "192.168.1.1",
        "netmask": "255.255.255.0"
      },
      {
        "name": "private-pool",
        "start": "252.227.81.1",
        "end": "252.227.81.254",
        "gateway": "252.227.81.1",
        "netmask": "255.255.255.0"
      }
    ]
  },
  "security": {
    "enable_ip_whitelist": false,
    "ip_whitelist": ["192.168.1.0/24"],
    "enable_rate_limit": true,
    "rate_limit_per_minute": 60,
    "enable_2fa": false
  }
}
```

## 网络配置

### 防火墙设置

#### Linux (ufw)

```bash
# 允许 Web 访问
sudo ufw allow 1880/tcp

# 允许 VNC 代理
sudo ufw allow 6080/tcp

# 允许 WebSocket
sudo ufw allow 7681/tcp

# 限制 SSH 访问
sudo ufw allow from 192.168.1.0/24 to any port 22
```

#### Linux (firewalld)

```bash
# 添加端口
sudo firewall-cmd --permanent --add-port=1880/tcp
sudo firewall-cmd --permanent --add-port=6080/tcp
sudo firewall-cmd --permanent --add-port=7681/tcp

# 重载配置
sudo firewall-cmd --reload
```

#### Windows

```powershell
# 允许 Web 访问
New-NetFirewallRule -DisplayName "OpenIDCS Web" -Direction Inbound -Protocol TCP -LocalPort 1880 -Action Allow

# 允许 VNC 代理
New-NetFirewallRule -DisplayName "OpenIDCS VNC" -Direction Inbound -Protocol TCP -LocalPort 6080 -Action Allow

# 允许 WebSocket
New-NetFirewallRule -DisplayName "OpenIDCS WebSocket" -Direction Inbound -Protocol TCP -LocalPort 7681 -Action Allow
```

### SSL/TLS 配置

#### 使用 Nginx 反向代理

安装 Nginx：

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

配置文件 `/etc/nginx/sites-available/openidc`：

```nginx
server {
    listen 443 ssl http2;
    server_name openidc.example.com;

    # SSL 证书
    ssl_certificate /etc/ssl/certs/openidc.crt;
    ssl_certificate_key /etc/ssl/private/openidc.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 代理设置
    location / {
        proxy_pass http://127.0.0.1:1880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # VNC 代理
    location /websockify {
        proxy_pass http://127.0.0.1:6080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name openidc.example.com;
    return 301 https://$server_name$request_uri;
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/openidc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 性能优化

### Python 优化

```bash
# 使用 PyPy（可选）
pip install pypy3

# 启用字节码缓存
export PYTHONOPTIMIZE=2

# 增加文件描述符限制
ulimit -n 65536
```

### 数据库优化

```python
# 定期优化数据库
import sqlite3

conn = sqlite3.connect('DataSaving/database.db')
conn.execute('VACUUM')
conn.execute('ANALYZE')
conn.close()
```

### 日志优化

```python
# 配置日志轮转
from loguru import logger

logger.add(
    "DataSaving/log-app.log",
    rotation="10 MB",
    retention="30 days",
    compression="zip",
    level="INFO"
)
```

## 备份策略

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/openidc"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
cp DataSaving/database.db $BACKUP_DIR/database_$DATE.db

# 备份配置文件
tar -czf $BACKUP_DIR/config_$DATE.tar.gz DataSaving/*.json

# 备份日志
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz DataSaving/*.log

# 保留最近 30 天的备份
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

设置定时任务：

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点执行备份
0 2 * * * /path/to/backup.sh
```

## 监控与维护

### 健康检查

```bash
#!/bin/bash
# healthcheck.sh

# 检查服务状态
if systemctl is-active --quiet openidc-server; then
    echo "✅ Service is running"
else
    echo "❌ Service is not running"
    systemctl start openidc-server
fi

# 检查端口
if netstat -tlnp | grep -q ":1880"; then
    echo "✅ Port 1880 is listening"
else
    echo "❌ Port 1880 is not listening"
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disk usage is high: ${DISK_USAGE}%"
fi

# 检查内存使用
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3/$2*100}')
if [ $MEM_USAGE -gt 80 ]; then
    echo "⚠️ Memory usage is high: ${MEM_USAGE}%"
fi
```

### 日志分析

```bash
# 查看错误日志
grep -i error DataSaving/log-main.log | tail -20

# 统计访问量
awk '/GET\|POST/ {print $4}' DataSaving/log-access.log | sort | uniq -c

# 监控异常登录
grep "Failed login" DataSaving/log-security.log | awk '{print $1}' | sort | uniq -c | sort -nr
```

## 故障排查

### 服务无法启动

```bash
# 检查端口占用
netstat -tlnp | grep :1880
lsof -i :1880

# 检查 Python 依赖
pip check

# 查看详细错误
tail -f DataSaving/log-main.log
```

### 性能问题

```bash
# 检查系统资源
top
htop

# 检查数据库大小
du -sh DataSaving/database.db

# 优化数据库
sqlite3 DataSaving/database.db "VACUUM;"
```

## 升级指南

```bash
# 1. 备份数据
cp -r DataSaving DataSaving.backup.$(date +%Y%m%d)

# 2. 停止服务
sudo systemctl stop openidc-server

# 3. 更新代码
git pull origin main

# 4. 更新依赖
pip install -r HostConfig/requirements.txt --upgrade

# 5. 数据库迁移（如需要）
python migrate_db.py

# 6. 启动服务
sudo systemctl start openidc-server

# 7. 验证
curl http://localhost:1880/api/system/stats
```

## 下一步

- 🐳 配置 [Docker 受控端](/vm/docker)
- 📦 配置 [LXD 受控端](/vm/lxd)
- 🖥️ 配置 [VMware 受控端](/vm/vmware)
- 📖 查看 [功能概览](/guide/features) 了解更多功能
