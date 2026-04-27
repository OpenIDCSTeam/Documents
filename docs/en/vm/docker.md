---
title: Docker / Podman Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# Docker / Podman Configuration

This guide walks you through configuring a Docker / Podman host so it can be managed by OpenIDCS.

## Overview

Docker and Podman are popular container platforms. OpenIDCS manages them remotely over a TLS-secured TCP API.

### Docker vs Podman

| Feature | Docker | Podman |
|---------|--------|--------|
| Daemon | Requires `dockerd` | Daemonless |
| Root required | Yes | Supports rootless |
| Docker Hub | Native | Compatible |
| Compose | `docker-compose` | `podman-compose` |
| Remote API | TCP + TLS | Docker-API compatible |
| Best for | General workloads | Security-sensitive |

## ✅ Pros

- **Ultra lightweight**: ~100 MB memory, seconds to start
- **High density**: run hundreds of containers per host
- **Huge image ecosystem**: Docker Hub + private registries
- **Perfect for microservices and CI/CD**
- **Cross-distro automation scripts** provided by OpenIDCS

## ❌ Cons

- Shared kernel — cannot run non-Linux guests
- Persistence needs explicit volume setup
- Weaker isolation than full VMs
- No native VNC / desktop
- Cannot do live migration like KVM

## Supported Linux Distributions

| Distro | Versions | PM | Docker | Podman |
|--------|----------|----|--------|--------|
| Ubuntu | 18.04+ | apt | ✅ | ✅ |
| Debian | 10+ | apt | ✅ | ✅ |
| CentOS | 7 / 8 | yum/dnf | ✅ | ✅ |
| RHEL | 7 / 8 / 9 | yum/dnf | ✅ | ✅ |
| Rocky Linux | 8 / 9 | dnf | ✅ | ✅ |
| AlmaLinux | 8 / 9 | dnf | ✅ | ✅ |
| Fedora | 36+ | dnf | ✅ | ✅ |
| Arch Linux | Latest | pacman | ✅ | ✅ |

## Quick Start (Recommended)

### Automated Script

OpenIDCS ships a one-click setup script:

```bash
# 1. Upload the script
scp HostConfig/setups-oci.sh user@your-server:/tmp/

# 2. SSH to the server
ssh user@your-server

# 3. Run
cd /tmp
sudo bash setups-oci.sh
```

The script will:
- ✅ Detect distro & version
- ✅ Install Docker or Podman
- ✅ Generate TLS certificates
- ✅ Enable remote API
- ✅ Create bridges (`docker-pub`, `docker-nat`)
- ✅ Configure firewall
- ✅ Install `ttyd` Web Terminal
- ✅ Enable auto-start

Script options:

```bash
sudo bash setups-oci.sh -h    # Help
sudo bash setups-oci.sh -f    # Force reinstall
sudo bash setups-oci.sh -d    # Uninstall
```

## Manual Configuration (Advanced)

### Step 1: Install Docker

#### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo docker run hello-world
```

#### CentOS / RHEL / Rocky / AlmaLinux

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
```

#### Fedora

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo \
    https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
```

#### Arch Linux

```bash
sudo pacman -S docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

### Step 2: Generate TLS Certificates

```bash
sudo mkdir -p /etc/docker/certs
cd /etc/docker/certs

SERVER_IP="your-server-ip"

# CA
sudo openssl genrsa -out ca-key.pem 4096
sudo openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem \
    -subj "/C=US/ST=CA/L=SF/O=OpenIDCS/CN=docker-ca"

# Server cert
sudo openssl genrsa -out server-key.pem 4096
sudo openssl req -subj "/CN=$SERVER_IP" -sha256 -new -key server-key.pem -out server.csr
echo "subjectAltName = IP:$SERVER_IP,IP:127.0.0.1" > extfile.cnf
echo "extendedKeyUsage = serverAuth" >> extfile.cnf
sudo openssl x509 -req -days 365 -sha256 -in server.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out server-cert.pem -extfile extfile.cnf

# Client cert
sudo openssl genrsa -out client-key.pem 4096
sudo openssl req -subj '/CN=client' -new -key client-key.pem -out client.csr
echo "extendedKeyUsage = clientAuth" > extfile-client.cnf
sudo openssl x509 -req -days 365 -sha256 -in client.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out client-cert.pem -extfile extfile-client.cnf

sudo chmod 0400 ca-key.pem server-key.pem client-key.pem
sudo chmod 0444 ca.pem server-cert.pem client-cert.pem
sudo rm -f server.csr client.csr extfile.cnf extfile-client.cnf
```

### Step 3: Configure Docker Daemon

Edit `/etc/docker/daemon.json`:

```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/certs/ca.pem",
  "tlscert": "/etc/docker/certs/server-cert.pem",
  "tlskey": "/etc/docker/certs/server-key.pem",
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" },
  "storage-driver": "overlay2"
}
```

::: warning
If Docker is managed by systemd, edit `/lib/systemd/system/docker.service` and change `ExecStart` to `ExecStart=/usr/bin/dockerd` to let `daemon.json` take over the host setting.
:::

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
sudo ss -tlnp | grep 2376
```

### Step 4: Create Network Bridges

```bash
sudo docker network create --driver bridge \
    --subnet=172.18.0.0/16 --gateway=172.18.0.1 docker-pub

sudo docker network create --driver bridge \
    --subnet=172.19.0.0/16 --gateway=172.19.0.1 docker-nat

sudo docker network ls
```

### Step 5: Firewall

```bash
# Ubuntu / Debian
sudo ufw allow 2376/tcp
sudo ufw allow 7681/tcp
sudo ufw reload

# CentOS / RHEL
sudo firewall-cmd --permanent --add-port=2376/tcp
sudo firewall-cmd --permanent --add-port=7681/tcp
sudo firewall-cmd --reload
```

Restrict by IP (recommended):

```bash
sudo iptables -A INPUT -p tcp --dport 2376 -s MANAGER_IP/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2376 -j DROP
```

### Step 6: Install `ttyd` (Optional)

```bash
cd /tmp
wget https://github.com/tsl0922/ttyd/releases/download/1.7.3/ttyd.x86_64
sudo mv ttyd.x86_64 /usr/local/bin/ttyd
sudo chmod +x /usr/local/bin/ttyd

sudo tee /etc/systemd/system/ttyd.service > /dev/null <<EOF
[Unit]
Description=ttyd Web Terminal
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ttyd -p 7681 -i 0.0.0.0 bash
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now ttyd
```

## Client-Side (Manager)

### Copy Certificates

```bash
mkdir -p ~/docker-certs
scp user@your-server:/etc/docker/certs/ca.pem ~/docker-certs/
scp user@your-server:/etc/docker/certs/client-cert.pem ~/docker-certs/
scp user@your-server:/etc/docker/certs/client-key.pem ~/docker-certs/
```

### Test Connection

```bash
docker --tlsverify \
    --tlscacert=~/docker-certs/ca.pem \
    --tlscert=~/docker-certs/client-cert.pem \
    --tlskey=~/docker-certs/client-key.pem \
    -H=tcp://your-server:2376 ps
```

### Add Host in OpenIDCS

1. Log in to the OpenIDCS Web UI
2. Go to **Host Management** → **Add Host**
3. Fill in:
   - Name: `docker-01`
   - Type: `Docker`
   - Address: `your-server-ip`
   - Port: `2376`
   - Cert Path: `~/docker-certs`
   - Public Bridge: `docker-pub`
   - NAT Bridge: `docker-nat`
4. Click **Test Connection** → **Save**

## Using Podman

```bash
# Install
sudo apt install -y podman           # Debian / Ubuntu
sudo yum install -y podman           # RHEL family
sudo dnf install -y podman           # Fedora

# Enable Docker-compatible socket
sudo systemctl enable --now podman.socket
```

Podman is Docker-API compatible; follow the same TLS setup.

## Troubleshooting

### 1. Connection Refused

```bash
sudo systemctl status docker
sudo netstat -tlnp | grep 2376
sudo ufw status
sudo firewall-cmd --list-ports
sudo journalctl -u docker -n 50
```

### 2. TLS Handshake Error

```bash
ls -la /etc/docker/certs/
sudo chmod 0400 /etc/docker/certs/*-key.pem
sudo chmod 0444 /etc/docker/certs/*.pem
```

### 3. Container Has No Network

```bash
sudo docker network ls
sudo docker network inspect docker-nat
sudo iptables -L -n
sudo systemctl restart docker
```

### 4. Distro Issues

**Ubuntu GPG error**

```bash
sudo rm /etc/apt/keyrings/docker.gpg
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

**CentOS 8 Stream missing repo**

```bash
sudo dnf config-manager --set-enabled powertools
```

## Best Practices

### Security

- Always use TLS verification
- Restrict the 2376 port by source IP
- Rotate certificates yearly
- Don't run containers as root when possible

### Performance

- Use `overlay2` storage driver
- Configure log rotation
- Set CPU / memory limits per container
- Use a local registry for mass deployment

### Maintenance

```bash
sudo docker info
sudo docker stats
sudo docker system prune -a
sudo journalctl -u docker -f
```

## Next

- 📦 [LXC / LXD Configuration](/en/vm/lxd)
- 🖥️ [VMware Configuration](/en/vm/vmware)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
