---
title: Proxmox VE Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# Proxmox VE Configuration

This guide shows how to onboard a **Proxmox VE** host into OpenIDCS. Proxmox VE is an enterprise-grade open-source virtualization platform based on Debian, supporting both KVM (VMs) and LXC (containers). It is the leading open-source alternative to VMware vSphere.

## ✨ Pros & Cons

### 👍 Pros

- **Open-source & free** — GNU AGPLv3, no license fees
- **Full hypervisor** — KVM + LXC in one platform
- **Production-grade** — proven in IDC environments worldwide
- **Cluster & HA** — native multi-node cluster, live migration, high availability
- **Full Web UI + REST API**
- **Backup ecosystem** — Proxmox Backup Server with incremental backups

### 👎 Cons

- **Dedicated hardware required** — nested virtualization not recommended
- **Learning curve** — clustering, storage and networking concepts
- **ZFS memory hungry** — best performance needs ZFS + lots of RAM
- **Debian-only** — can't install on top of CentOS/RHEL/etc.

### 🎯 Recommended Scenarios

- IDC virtualization resale
- SMB production core
- Open-source private cloud base

## 🖥️ System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | Intel VT-x / AMD-V | Multi-core server CPU |
| **Memory** | 4 GB | 16 GB+ |
| **Disk** | 32 GB SSD | 2× SSD (ZFS Mirror) |
| **NIC** | 1 Gbps | 2× 10 Gbps |
| **OS** | Proxmox VE 7.x / 8.x | Proxmox VE 8.x |

::: warning
Proxmox VE is its own OS — **it cannot be installed on an existing Linux distribution**. Use the official ISO for a clean install.
:::

## 🚀 Install on Target Host

### Step 1: Download ISO

From the official site:

```
https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso
```

Recommended: **Proxmox VE 8.x**

### Step 2: Install Proxmox VE

1. Flash a USB stick:
   ```bash
   sudo dd if=proxmox-ve_8.x.iso of=/dev/sdX bs=4M status=progress
   ```
2. Enable **Intel VT-x / AMD-V** in BIOS
3. Boot from USB and follow the installer:
   - Pick install disk (ZFS RAID1 or LVM recommended)
   - Set root password
   - Configure network (static IP)
4. Open `https://<your-ip>:8006` in a browser

### Step 3: Configure Repositories

```bash
ssh root@<pve-ip>

# Keep or switch Debian mirror if you prefer a closer one
# e.g. sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list

# Disable enterprise repo (no subscription)
echo "" > /etc/apt/sources.list.d/pve-enterprise.list

# Add no-subscription repo
echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" \
  > /etc/apt/sources.list.d/pve-no-subscription.list

apt update && apt -y dist-upgrade
```

### Step 4: Create an API Token (Recommended)

OpenIDCS prefers API Tokens over password authentication:

```bash
ssh root@<pve-ip>

# Create a dedicated user (optional)
pveum user add openidcs@pve

# Grant Administrator role
pveum aclmod / -user openidcs@pve -role Administrator

# Create token (privsep=0 => same perms as user)
pveum user token add openidcs@pve openidcs-token --privsep 0
```

Example output:

```
┌──────────────┬──────────────────────────────────────┐
│ key          │ value                                │
├──────────────┼──────────────────────────────────────┤
│ full-tokenid │ openidcs@pve!openidcs-token          │
│ info         │ {"privsep":"0"}                      │
│ value        │ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx │
└──────────────┴──────────────────────────────────────┘
```

::: tip
The `value` is shown **only once** — save it immediately.
:::

### Step 5: Firewall

```bash
# Allow OpenIDCS manager to reach 8006
iptables -A INPUT -p tcp --dport 8006 -s <openidcs-host>/32 -j ACCEPT

# Persist (optional; PVE Web UI firewall is preferred)
apt install iptables-persistent -y
netfilter-persistent save
```

Or use the PVE Web UI: **Datacenter → Firewall** and allow `8006/tcp`.

### Step 6: Add a Storage Pool (Optional)

For backups it's cleanest to create a separate dataset:

```bash
zfs create rpool/backup

# PVE UI: Datacenter → Storage → Add → Directory
# Path: /rpool/backup   Content: Backup, ISO, CT Templates
```

### Step 7: Nested Virtualization (Optional)

Only if you need to run VMs inside PVE VMs:

```bash
# Intel
echo "options kvm-intel nested=Y" > /etc/modprobe.d/kvm-intel.conf

# AMD
echo "options kvm-amd nested=1" > /etc/modprobe.d/kvm-amd.conf

modprobe -r kvm_intel && modprobe kvm_intel
```

## 🔗 Add Host in OpenIDCS

1. Open the OpenIDCS Web UI
2. **Host Management → Add Host**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `pve-01` |
   | Type | `Proxmox VE` |
   | Address | PVE IP |
   | Port | `8006` |
   | Username | `openidcs@pve` or `root@pam` |
   | Token ID | `openidcs-token` |
   | Token Secret | value from Step 4 |
   | Storage | `local-zfs` or `local-lvm` |
   | Default Bridge | `vmbr0` |

4. Click **Test Connection** → **Save**

## 📘 Common Commands

```bash
# Cluster status
pvecm status

# List VMs / containers
qm list
pct list

# Start / stop
qm start 100
qm shutdown 100

# Snapshot
qm snapshot 100 snap1

# Backup
vzdump 100 --mode snapshot --compress zstd --storage local

# Enter container
pct enter 200
```

## 🐛 Troubleshooting

### 1. API Timeout

```bash
systemctl status pveproxy
ss -tlnp | grep 8006
systemctl restart pveproxy pvedaemon
```

### 2. Token Auth Failed

```bash
pveum user token list openidcs@pve
pveum acl list
```

### 3. `no such storage` when creating a VM

In the UI: **Datacenter → Storage**, make sure `local-lvm` / `local-zfs` exists and has "Disk image" enabled.

## 🔒 Security

- Disable root SSH password login, use SSH keys
- Enable Proxmox Firewall, open only required ports
- Use **Privilege Separation** on API tokens (least privilege)
- Run `apt update && apt dist-upgrade` regularly
- Keep backup storage **physically separated** from production storage

## 📚 References

- [Proxmox VE Documentation](https://pve.proxmox.com/pve-docs/)
- [Proxmox API Viewer](https://pve.proxmox.com/pve-docs/api-viewer/)

## Next

- 🏢 [VMware ESXi](/en/vm/esxi)
- 🪟 [Windows Hyper-V](/en/vm/hyperv)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
