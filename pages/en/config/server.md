# Master Node Configuration

The master node runs the OpenIDCS management service and is responsible for connecting to and managing all worker nodes. This document explains how to deploy, configure, secure and tune the master node for production use.

## System Requirements

### Hardware

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| **CPU** | 2 cores | 4 cores+ | Scale with the number of managed VMs |
| **Memory** | 4 GB | 8 GB+ | +2 GB per 100 managed VMs |
| **Storage** | 20 GB | 50 GB+ | Used for logs, backups and the database |
| **Network** | 100 Mbps | 1 Gbps+ | Affects management responsiveness |

### Software

| Software | Version | Notes |
|----------|---------|-------|
| **Python** | 3.8+ | 3.9 / 3.10 recommended |
| **pip** | Latest | Python package manager |
| **Git** | 2.0+ | To clone the project |

### Supported Operating Systems

- Windows 10 / 11 and Windows Server 2016+
- Ubuntu 18.04+, Debian 10+
- CentOS 7+, RHEL 7+, Rocky Linux 8+
- macOS 10.14+

## Installation & Deployment

### Option 1: Standard Deployment

#### Windows

```batch
:: 1. Clone the project
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

:: 2. Install dependencies
pip install -r HostConfig/pipinstall.txt

:: 3. Create data directories
mkdir DataSaving
mkdir logs

:: 4. Start the service
python HostServer.py
```

#### Linux

```bash
# 1. Clone the project
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 2. Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install --upgrade pip
pip install -r HostConfig/pipinstall.txt

# 4. Create data directories
mkdir -p DataSaving logs

# 5. Start the service
python HostServer.py
```

### Option 2: Docker Deployment

Create `docker-compose.yml`:

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

Build and run:

```bash
docker-compose up -d
docker-compose logs -f
```

### Option 3: System Service

#### Linux (systemd)

Create `/etc/systemd/system/openidc-server.service`:

```ini
[Unit]
Description=OpenIDCS Server
After=network.target

[Service]
Type=simple
User=openidc
Group=openidc
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

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable openidc-server
sudo systemctl start openidc-server
sudo systemctl status openidc-server
```

#### Windows (NSSM)

```batch
nssm install OpenIDCS "C:\Python39\python.exe" "C:\OpenIDCS-Client\HostServer.py"
nssm set OpenIDCS AppDirectory "C:\OpenIDCS-Client"
nssm set OpenIDCS DisplayName "OpenIDCS Server"
nssm set OpenIDCS Start SERVICE_AUTO_START
nssm start OpenIDCS
```

## Configuration

### Environment Variables (`.env`)

```bash
# Application
FLASK_ENV=production
HOST_SERVER_PORT=1880
SECRET_KEY=your-secret-key-change-in-production

# Database
DATABASE_PATH=DataSaving/database.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=DataSaving/log-main.log
LOG_ROTATION=10 MB
LOG_RETENTION=7 days

# Security
TOKEN_EXPIRE_HOURS=24
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=30
ENABLE_REGISTRATION=false

# Sessions
SESSION_TIMEOUT=3600
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTPONLY=true

# Backup
AUTO_BACKUP=true
BACKUP_INTERVAL=86400
BACKUP_RETENTION_DAYS=30

# Monitoring
ENABLE_MONITORING=true
MONITORING_INTERVAL=60
```

### Host Inventory (`DataSaving/hosts.json`)

```json
{
  "hosts": {
    "docker-01": {
      "server_type": "Docker",
      "server_addr": "192.168.1.101",
      "server_port": 2376,
      "launch_path": "/path/to/certs",
      "network_pub": "docker-pub",
      "network_nat": "docker-nat",
      "enabled": true,
      "max_vms": 100
    },
    "lxd-01": {
      "server_type": "LXD",
      "server_addr": "192.168.1.100",
      "server_port": 8443,
      "launch_path": "/path/to/certs",
      "network_pub": "br-pub",
      "network_nat": "br-nat",
      "enabled": true,
      "max_vms": 50
    },
    "vmware-01": {
      "server_type": "VmwareWork",
      "server_addr": "192.168.1.10",
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

## Network & Firewall

### Ports to Open

| Port | Purpose |
|------|---------|
| 1880 | Web management UI |
| 6080 | noVNC / WebSockify proxy |
| 7681 | Web terminal (ttyd) |

### Linux (ufw)

```bash
sudo ufw allow 1880/tcp
sudo ufw allow 6080/tcp
sudo ufw allow 7681/tcp
```

### Linux (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=1880/tcp
sudo firewall-cmd --permanent --add-port=6080/tcp
sudo firewall-cmd --permanent --add-port=7681/tcp
sudo firewall-cmd --reload
```

### Windows

```powershell
New-NetFirewallRule -DisplayName "OpenIDCS Web" -Direction Inbound -Protocol TCP -LocalPort 1880 -Action Allow
New-NetFirewallRule -DisplayName "OpenIDCS VNC" -Direction Inbound -Protocol TCP -LocalPort 6080 -Action Allow
```

## HTTPS with Nginx

`/etc/nginx/sites-available/openidc`:

```nginx
server {
    listen 443 ssl http2;
    server_name openidc.example.com;

    ssl_certificate /etc/ssl/certs/openidc.crt;
    ssl_certificate_key /etc/ssl/private/openidc.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        proxy_pass http://127.0.0.1:1880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /websockify {
        proxy_pass http://127.0.0.1:6080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

server {
    listen 80;
    server_name openidc.example.com;
    return 301 https://$server_name$request_uri;
}
```

## Performance Tuning

- Run Python with `PYTHONOPTIMIZE=2` in production.
- Raise `ulimit -n 65536` for high-concurrency servers.
- Run `VACUUM` / `ANALYZE` on the SQLite database periodically.
- Use log rotation (loguru rotation policy is enabled by default).

## Backup Strategy

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/openidc"
mkdir -p $BACKUP_DIR

cp DataSaving/database.db $BACKUP_DIR/database_$DATE.db
tar -czf $BACKUP_DIR/config_$DATE.tar.gz DataSaving/*.json
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz DataSaving/*.log

find $BACKUP_DIR -mtime +30 -delete
```

Schedule daily at 02:00:

```bash
0 2 * * * /path/to/backup.sh
```

## Health Check

```bash
#!/bin/bash
systemctl is-active --quiet openidc-server && echo "Service OK" || systemctl start openidc-server
netstat -tlnp | grep -q ":1880" && echo "Port OK" || echo "Port DOWN"

DISK=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
[ $DISK -gt 80 ] && echo "Disk usage high: ${DISK}%"
```

## Troubleshooting

### Service will not start

```bash
netstat -tlnp | grep :1880
pip check
tail -f DataSaving/log-main.log
```

### Performance issues

```bash
top
du -sh DataSaving/database.db
sqlite3 DataSaving/database.db "VACUUM;"
```

## Upgrade Procedure

```bash
cp -r DataSaving DataSaving.backup.$(date +%Y%m%d)
sudo systemctl stop openidc-server
git pull origin main
pip install -r HostConfig/pipinstall.txt --upgrade
python migrate_db.py   # if required
sudo systemctl start openidc-server
curl http://localhost:1880/api/system/stats
```

## Next Steps

- 🐳 Configure a [Docker worker node](/en/vm/docker)
- 📦 Configure an [LXD worker node](/en/vm/lxd)
- 🖥️ Configure a [VMware worker node](/en/vm/vmware)
- 📖 Check the [feature overview](/en/guide/features)
