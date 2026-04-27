---
title: LXC / LXD Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# LXC / LXD Configuration

This guide walks you through configuring an LXC / LXD host so it can be managed remotely by OpenIDCS.

## Overview

LXD is the next-generation system container manager built on top of LXC, offering a modern management interface and remote HTTPS access.

### LXC vs LXD

| Feature | LXC | LXD |
|---------|-----|-----|
| Management | CLI tools | REST API + CLI |
| Remote | No | Native HTTPS |
| Images | Manual | Automated image server |
| Snapshots | Yes | Enhanced |
| Migration | Complex | Simple (live migration) |
| Best for | Local use | Remote / cluster |

### Why LXD?

- ✅ **Cross-platform management** — manage Linux containers from Windows / macOS
- ✅ **Secure authentication** — TLS certificate based
- ✅ **Full REST API** — all operations available
- ✅ **High performance** — system-level containers, near-native speed
- ✅ **Easy to use** — simple CLI and API

## ✅ Pros

- Near-native performance, very high density
- Full-distro Linux experience (systemd, multiple services)
- Mature snapshot & image ecosystem
- Native live migration
- Low footprint (~150 MB idle)

## ❌ Cons

- Linux-only (shared host kernel)
- No VNC / graphical console by default
- ISO mount not supported (container semantics)
- Some advanced features (PCI / USB passthrough) limited

## Quick Start (Recommended)

### Automated Script

```bash
scp HostConfig/setups-lxd.sh user@your-server:/tmp/
ssh user@your-server
cd /tmp
sudo bash setups-lxd.sh
```

The script will:
- ✅ Install LXD
- ✅ Run `lxd init`
- ✅ Enable remote access
- ✅ Generate TLS certificates
- ✅ Create bridges (`br-pub`, `br-nat`)
- ✅ Configure firewall
- ✅ Configure storage pool

## Manual Configuration

### Step 1: Install LXD

#### Ubuntu / Debian

```bash
# Option 1: apt (Ubuntu 18.04+)
sudo apt update
sudo apt install -y lxd

# Option 2: snap (recommended, latest version)
sudo snap install lxd
```

#### Other Distributions

```bash
# CentOS / RHEL (requires EPEL)
sudo yum install -y epel-release snapd
sudo systemctl enable --now snapd.socket
sudo snap install lxd

# Arch Linux
sudo pacman -S lxd
```

### Step 2: Initialize LXD

```bash
sudo lxd init
```

Recommended answers:

```
Clustering? no
New storage pool? yes
Storage name: default
Backend: dir (simplest) or zfs (fastest)
MAAS server? no
New local network bridge? yes
Bridge name: lxdbr0
IPv4: auto
IPv6: none
Remote network access? yes
Bind address: all
Port: 8443
Trust password: <strong-password>
```

::: tip
- **Backend**: `dir` is simplest; `zfs` offers best performance.
- **Remote access**: must be `yes` to let OpenIDCS manage the host.
- **Trust password**: used for initial client enrollment.
:::

### Step 3: Configure Remote Access

```bash
sudo lxc config set core.https_address "[::]:8443"
sudo lxc config set core.trust_password "your-strong-password"
sudo lxc config show
```

### Step 4: Create Network Bridges

```bash
# Public bridge (no NAT)
sudo lxc network create br-pub \
    ipv4.address=none ipv6.address=none \
    ipv4.nat=false ipv6.nat=false

# NAT bridge
sudo lxc network create br-nat \
    ipv4.address=10.0.0.1/24 \
    ipv4.nat=true \
    ipv6.address=none

sudo lxc network list
```

### Step 5: Firewall

```bash
# Ubuntu / Debian
sudo ufw allow 8443/tcp
sudo ufw reload

# CentOS / RHEL
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --reload
```

### Step 6: Export Client Certificate

```bash
# snap install
sudo cp /var/snap/lxd/common/config/client.crt /tmp/
sudo cp /var/snap/lxd/common/config/client.key /tmp/

# apt install
sudo cp /var/lib/lxd/client.crt /tmp/
sudo cp /var/lib/lxd/client.key /tmp/

sudo chmod 644 /tmp/client.crt /tmp/client.key
```

## Client-Side (Manager)

### Copy Certificates

```bash
mkdir -p ~/lxd-certs
scp user@your-server:/tmp/client.crt ~/lxd-certs/
scp user@your-server:/tmp/client.key ~/lxd-certs/
```

### Test Connection

#### With `lxc` CLI

```bash
lxc remote add myserver https://your-server:8443
# enter trust password
lxc remote list
lxc list myserver:
```

#### With Python (pylxd)

```python
from pylxd import Client

client = Client(
    endpoint='https://your-server:8443',
    cert=('~/lxd-certs/client.crt', '~/lxd-certs/client.key'),
    verify=False  # production should verify
)

print(client.api.get().json())
```

### Add Host in OpenIDCS

1. Open OpenIDCS → **Host Management** → **Add Host**
2. Fill in:
   - Name: `lxd-01`
   - Type: `LXD`
   - Address: `your-server-ip`
   - Port: `8443`
   - Cert Path: `~/lxd-certs`
   - Public Bridge: `br-pub`
   - NAT Bridge: `br-nat`
   - Container Path: `/var/snap/lxd/common/lxd/containers` (snap) or `/var/lib/lxd/containers` (apt)
3. Click **Test Connection** → **Save**

## Container Management

### Create

```bash
sudo lxc launch ubuntu:22.04 my-container

sudo lxc init ubuntu:22.04 my-container      # create without start

sudo lxc launch ubuntu:22.04 my-container \
    -c limits.cpu=2 -c limits.memory=4GB
```

### Manage

```bash
sudo lxc list
sudo lxc start my-container
sudo lxc stop my-container
sudo lxc restart my-container
sudo lxc delete my-container --force
sudo lxc exec my-container -- bash
```

### Configure

```bash
sudo lxc config set my-container limits.cpu 2
sudo lxc config set my-container limits.memory 4GB
sudo lxc config device override my-container root size=20GB

sudo lxc config device add my-container eth0 nic \
    nictype=bridged parent=br-nat name=eth0
```

### Snapshots & Backup

```bash
sudo lxc snapshot my-container snap1
sudo lxc info my-container
sudo lxc restore my-container snap1
sudo lxc delete my-container/snap1

sudo lxc export my-container my-container.tar.gz
sudo lxc import my-container.tar.gz
```

## Image Management

```bash
sudo lxc image list images:
sudo lxc image list images: ubuntu
sudo lxc image copy images:ubuntu/22.04 local: --alias ubuntu-22.04
sudo lxc image list

# Create image from container
sudo lxc publish my-container --alias my-custom-image
sudo lxc publish my-container/snap1 --alias my-snapshot-image

# Export / import
sudo lxc image export my-custom-image
sudo lxc image import image.tar.gz --alias imported-image
```

## Network Configuration

### Static IP via cloud-init

```bash
sudo lxc config set my-container cloud-init.network-config - <<EOF
version: 2
ethernets:
  eth0:
    addresses:
      - 252.227.81.100/24
    gateway4: 10.0.0.1
    nameservers:
      addresses: [8.8.8.8, 8.8.4.4]
EOF
```

### Port Forwarding

```bash
sudo lxc config device add my-container myport80 proxy \
    listen=tcp:0.0.0.0:8080 \
    connect=tcp:127.0.0.1:80

sudo lxc config device remove my-container myport80
```

## Troubleshooting

### 1. Cannot Connect

```bash
sudo systemctl status lxd
sudo systemctl status snap.lxd.daemon

sudo ss -tlnp | grep 8443
sudo ufw status
sudo firewall-cmd --list-ports

sudo journalctl -u lxd -n 50
```

### 2. Certificate Auth Failed

```bash
sudo lxd init --auto
sudo lxc config trust add client.crt
sudo lxc config set core.trust_password "new-password"
```

### 3. Container Won't Start

```bash
sudo lxc info my-container --show-log
sudo lxc storage list
sudo lxc storage info default
sudo lxc network list
```

### 4. Network Issues

```bash
sudo lxc network show br-nat
ip link show br-nat
sudo iptables -L -n -v
sudo iptables -t nat -L -n -v
```

## Advanced

### Resource Limits

```bash
sudo lxc config set my-container limits.cpu 2
sudo lxc config set my-container limits.cpu.allowance 50%
sudo lxc config set my-container limits.memory 4GB
sudo lxc config set my-container limits.memory.enforce hard
sudo lxc config device set my-container root limits.read 20MB
sudo lxc config device set my-container root limits.write 10MB
sudo lxc config device set my-container eth0 limits.ingress 100Mbit
sudo lxc config device set my-container eth0 limits.egress 100Mbit
```

### Security

```bash
sudo lxc config set my-container security.nesting true
sudo lxc config set my-container security.privileged false
```

### Custom Storage Pool

```bash
sudo lxc storage create mypool dir source=/data/lxd
sudo lxc launch ubuntu:22.04 my-container -s mypool

sudo lxc storage volume create mypool data-vol
sudo lxc config device add my-container data disk \
    pool=mypool source=data-vol path=/mnt/data
```

## Best Practices

- Use ZFS backend for performance + snapshots
- Don't over-commit CPU / memory
- Cache images locally
- Never use `security.privileged=true` unless absolutely required
- Back up containers daily:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backup/lxd"
for c in $(lxc list -c n --format csv); do
    lxc export $c $BACKUP_DIR/${c}_${DATE}.tar.gz
done
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## Next

- 🐳 [Docker / Podman](/en/vm/docker)
- 🖥️ [VMware](/en/vm/vmware)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
