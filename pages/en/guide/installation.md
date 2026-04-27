---
title: Installation
---

# Installation

Production-grade deployment for OpenIDCS. For a 5-minute demo, read [Quick Start](/en/guide/quick-start) first.

## Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8 GB+ |
| Disk | 20 GB | 50 GB+ SSD |
| Network | 100 Mbps | 1 Gbps |
| Python | 3.8 | 3.10 / 3.11 |

OS support: **Windows 10/11**, **Windows Server 2016+**, **Ubuntu 18.04+**, **Debian 10+**, **CentOS 7+ / RHEL 7+**, **Rocky / Alma 8+**, **macOS 10.14+**.

## Deployment Options

1. **From source** (simplest).
2. **systemd service** (recommended on Linux).
3. **Windows service via NSSM** (recommended on Windows).
4. **Docker / Docker Compose**.
5. **Frozen binary** (Nuitka / cx_Freeze).

---

## 1. From Source

```bash
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install --upgrade pip
pip install -r HostConfig/pipinstall.txt

python MainServer.py
```

Open [http://localhost:1880](http://localhost:1880). Data lives under `DataSaving/`.

## 2. systemd (Linux)

Create a dedicated user and install to `/opt/OpenIDCS-Client`:

```bash
sudo useradd -r -s /bin/false openidc
sudo mkdir -p /opt/OpenIDCS-Client
sudo chown openidc:openidc /opt/OpenIDCS-Client

sudo -u openidc git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git \
  /opt/OpenIDCS-Client

cd /opt/OpenIDCS-Client
sudo -u openidc python3 -m venv venv
sudo -u openidc venv/bin/pip install -r HostConfig/pipinstall.txt
sudo -u openidc mkdir -p DataSaving logs
```

Create `/etc/systemd/system/openidc.service`:

```ini
[Unit]
Description=OpenIDCS Controller
After=network.target

[Service]
Type=simple
User=openidc
Group=openidc
WorkingDirectory=/opt/OpenIDCS-Client
Environment=FLASK_ENV=production
ExecStart=/opt/OpenIDCS-Client/venv/bin/python MainServer.py
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/OpenIDCS-Client/DataSaving /opt/OpenIDCS-Client/logs
MemoryLimit=2G

[Install]
WantedBy=multi-user.target
```

Enable & start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now openidc
sudo systemctl status openidc
```

## 3. Windows Service (NSSM)

```batch
:: Download NSSM from https://nssm.cc
nssm install OpenIDCS "C:\Python311\python.exe" "C:\OpenIDCS-Client\MainServer.py"
nssm set OpenIDCS AppDirectory "C:\OpenIDCS-Client"
nssm set OpenIDCS DisplayName "OpenIDCS Controller"
nssm set OpenIDCS Start SERVICE_AUTO_START
nssm start OpenIDCS
```

## 4. Docker / Docker Compose

`Dockerfile`:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc git \
    && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pip install --no-cache-dir -r HostConfig/pipinstall.txt
RUN mkdir -p DataSaving logs
EXPOSE 1880 6080 7681
CMD ["python", "MainServer.py"]
```

`docker-compose.yml`:

```yaml
services:
  openidc:
    build: .
    container_name: openidc
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
      - SECRET_KEY=${SECRET_KEY}
    restart: unless-stopped
```

```bash
docker compose up -d
docker compose logs -f
```

## 5. Frozen Binary

```bash
# Nuitka (recommended, Windows)
cd AllBuilder && build_nuitka.bat

# Nuitka (Linux / macOS)
cd AllBuilder && ./build_nuitkaui.sh

# cx_Freeze
python HostBuilds.py build
```

Binaries appear under `AllBuilder/OpenIDCS-Client.dist/` (or `build/`). Ship the folder as-is.

## Reverse Proxy + TLS (Nginx)

```nginx
server {
  listen 443 ssl http2;
  server_name openidc.example.com;

  ssl_certificate     /etc/ssl/certs/openidc.crt;
  ssl_certificate_key /etc/ssl/private/openidc.key;

  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Frame-Options SAMEORIGIN always;

  location / {
    proxy_pass http://127.0.0.1:1880;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
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

## Firewall

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
New-NetFirewallRule -DisplayName "OpenIDCS Web"       -Direction Inbound -Protocol TCP -LocalPort 1880 -Action Allow
New-NetFirewallRule -DisplayName "OpenIDCS VNC Proxy" -Direction Inbound -Protocol TCP -LocalPort 6080 -Action Allow
New-NetFirewallRule -DisplayName "OpenIDCS Term"      -Direction Inbound -Protocol TCP -LocalPort 7681 -Action Allow
```

## Configuration Files

Generated in `DataSaving/` on first launch.

| File | Purpose |
|------|---------|
| `database.db` | SQLite database (users, VMs, logs) |
| `hosts.json` | Controlled-host definitions |
| `settings.json` | Global settings, IP pools, security |
| `log-*.log` | Rotating logs |

Environment overrides (put in `.env`):

```bash
FLASK_ENV=production
HOST_SERVER_PORT=1880
SECRET_KEY=change-me
DATABASE_PATH=DataSaving/database.db
LOG_LEVEL=INFO
TOKEN_EXPIRE_HOURS=24
MAX_LOGIN_ATTEMPTS=5
ENABLE_REGISTRATION=false
SESSION_TIMEOUT=3600
AUTO_BACKUP=true
BACKUP_INTERVAL=86400
```

## Backup Script

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
DIR=/backup/openidc
mkdir -p $DIR
cp DataSaving/database.db $DIR/db_$DATE.db
tar -czf $DIR/conf_$DATE.tgz DataSaving/*.json
find $DIR -mtime +30 -delete
```

Add to `crontab -e`:

```
0 2 * * * /opt/OpenIDCS-Client/backup.sh
```

## Upgrade

```bash
sudo systemctl stop openidc
cp -r DataSaving DataSaving.backup.$(date +%F)
git pull origin main
venv/bin/pip install -r HostConfig/pipinstall.txt --upgrade
sudo systemctl start openidc
curl -sf http://localhost:1880/api/system/stats && echo OK
```

## Next Steps

- ⚙️ [Server Setup](/en/config/server) — deeper configuration.
- 🖥️ [Client Setup](/en/config/client) — configure every remote host.
- 🎯 [Tutorials](/en/tutorials/vm-management) — operate the platform.
