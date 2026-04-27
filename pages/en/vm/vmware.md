---
title: VMware Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# VMware Configuration

This guide covers configuring VMware platforms so they can be managed by OpenIDCS.

## Supported VMware Products

| Platform | Status | Supported OS | Notes |
|----------|--------|--------------|-------|
| **VMware Workstation** | ✅ Production | Windows, Linux | Desktop virtualization |
| **VMware vSphere ESXi** | ✅ Production | Windows, Linux, macOS | Enterprise type-1 hypervisor |

## ✅ Pros

- **Mature ecosystem**: battle-tested for 20+ years
- **Best Windows guest support** (tools, shared folders, drag & drop)
- **Snapshot / clone / template** workflow is polished
- **Workstation REST API** works out-of-the-box (port 8697)
- **vSphere / vCenter** scales to hundreds of hosts

## ❌ Cons

- Workstation is single-host, not cluster-aware
- Commercial licensing (Pro / vSphere Standard / Enterprise)
- Higher per-VM overhead than KVM / containers
- ESXi needs dedicated hardware

## VMware Workstation

### System Requirements

#### Hardware
- CPU with Intel VT-x or AMD-V
- ≥ 4 GB RAM (8 GB+ recommended)
- ≥ 50 GB free disk

#### Software
- VMware Workstation Pro 15.0+
- Windows 10/11 or Linux (Ubuntu 18.04+, CentOS 7+)

### Step 1: Install Workstation

#### Windows

1. Download from [VMware website](https://www.vmware.com/products/workstation-pro.html)
2. Run the installer
3. Enter license key (or use trial)
4. Reboot

#### Linux

```bash
wget https://download3.vmware.com/software/wkst/file/VMware-Workstation-Full-17.0.0-20800274.x86_64.bundle
chmod +x VMware-Workstation-Full-*.bundle
sudo ./VMware-Workstation-Full-*.bundle
sudo systemctl enable --now vmware
```

### Step 2: Enable REST API

VMware Workstation 15+ ships the `vmrest` REST API service.

#### Windows

```batch
:: Manual start
"C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"

:: As a Windows service
sc create VMwareRESTAPI binPath= "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" start= auto DisplayName= "VMware REST API Service"
sc description VMwareRESTAPI "VMware Workstation REST API Service"
sc start VMwareRESTAPI
sc query VMwareRESTAPI
```

#### Linux

```bash
vmrest &

sudo tee /etc/systemd/system/vmrest.service > /dev/null <<EOF
[Unit]
Description=VMware REST API Service
After=network.target vmware.service

[Service]
Type=simple
User=root
ExecStart=/usr/bin/vmrest
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now vmrest
```

### Step 3: Configure REST API

First `vmrest` run prompts for credentials:

```
Please input username: admin
Please input password: ********
```

Or edit the preferences file manually:

- **Windows**: `%APPDATA%\VMware\preferences.ini`
- **Linux**: `~/.vmware/preferences`

```ini
webServer.enabled = "TRUE"
webServer.port = "8697"
webServer.https.port = "8697"
```

### Step 4: Firewall

#### Windows

```powershell
New-NetFirewallRule -DisplayName "VMware REST API" -Direction Inbound -Protocol TCP -LocalPort 8697 -Action Allow
Get-NetFirewallRule -DisplayName "VMware REST API"
```

#### Linux

```bash
# Ubuntu / Debian
sudo ufw allow 8697/tcp && sudo ufw reload

# CentOS / RHEL
sudo firewall-cmd --permanent --add-port=8697/tcp
sudo firewall-cmd --reload
```

### Step 5: Test REST API

```bash
curl -k -u "admin:password" https://localhost:8697/api/vms
```

### Step 6: Add Host in OpenIDCS

1. OpenIDCS → **Host Management** → **Add Host**
2. Fill in:
   - Name: `vmware-01`
   - Type: `VMware Workstation`
   - Address: `your-server-ip` (or `localhost`)
   - Port: `8697`
   - Username: `admin`
   - Password: `<your password>`
   - VM Path: `C:\Virtual Machines\` (Windows) or `~/vmware` (Linux)
3. **Test Connection** → **Save**

## VM Operations

### Create a VM (via OpenIDCS Web UI)

1. Go to **VM Management** → **Create VM**
2. Fill in:
   - Name: `my-vm`
   - OS: select template
   - CPU: `2`
   - Memory: `4 GB`
   - Disk: `40 GB`
3. Click **Create**

### Power Operations

- **Start / Stop / Force Stop / Restart / Suspend / Resume**

### Snapshots (via API)

```bash
# Create
curl -k -u "admin:password" -X POST \
  https://localhost:8697/api/vms/{vm-id}/snapshots \
  -H "Content-Type: application/json" \
  -d '{"name": "snapshot1", "description": "First snapshot"}'

# Revert
curl -k -u "admin:password" -X PUT \
  https://localhost:8697/api/vms/{vm-id}/snapshots/{snapshot-id}

# Delete
curl -k -u "admin:password" -X DELETE \
  https://localhost:8697/api/vms/{vm-id}/snapshots/{snapshot-id}
```

### Network Modes

| Mode | Description | Use case |
|------|-------------|----------|
| **Bridged** | VM joins LAN directly | VM must be visible on LAN |
| **NAT** | VM shares host IP via NAT | Share host's network |
| **Host-only** | VM ↔ host only | Isolated test env |
| **Custom** | Custom vmnet | Special needs |

Configure NIC via API:

```bash
curl -k -u "admin:password" -X PUT \
  https://localhost:8697/api/vms/{vm-id}/nic/{nic-index} \
  -H "Content-Type: application/json" \
  -d '{"type": "nat", "vmnet": "vmnet8"}'
```

### Shared Folders

```bash
curl -k -u "admin:password" -X POST \
  https://localhost:8697/api/vms/{vm-id}/sharedfolders \
  -H "Content-Type: application/json" \
  -d '{"folder_id": "shared1", "host_path": "C:\\SharedFolder", "flags": 4}'
```

## VMware vSphere ESXi

See also: [VMware vSphere ESXi](/en/vm/esxi) for the dedicated deployment guide.

### Requirements

- ESXi 6.7+
- Optional vCenter for cluster management
- Port 443 reachable from the manager

### Step 1: Enable SSH (Optional)

1. Log in to the ESXi Web UI
2. **Host → Manage → Services**
3. Start **TSM-SSH**

### Step 2: Firewall

```bash
ssh root@esxi-host
esxcli network firewall ruleset set --ruleset-id=httpClient --enabled=true
esxcli network firewall ruleset list
```

### Step 3: Credentials

Use the ESXi `root` account or a vCenter administrator like `administrator@vsphere.local`.

### Step 4: Test Connection

```python
from pyVim.connect import SmartConnect, Disconnect
import ssl

context = ssl._create_unverified_context()
si = SmartConnect(
    host='esxi-host',
    user='root',
    pwd='password',
    port=443,
    sslContext=context,
)
print("Connected to ESXi successfully!")
Disconnect(si)
```

### Step 5: Add Host in OpenIDCS

1. **Host Management** → **Add Host**
2. Fill in:
   - Name: `esxi-01`
   - Type: `VMware vSphere ESXi`
   - Address: `esxi-host-ip`
   - Port: `443`
   - Username: `root`
   - Password: `<admin password>`
3. **Test Connection** → **Save**

## Troubleshooting

### 1. REST API Unreachable

```batch
:: Windows
sc query VMwareRESTAPI
sc start VMwareRESTAPI
netstat -ano | findstr 8697
```

```bash
# Linux
ps aux | grep vmrest
sudo systemctl restart vmrest
sudo netstat -tlnp | grep 8697
```

### 2. 401 Unauthorized

Re-set credentials:

```bash
# Stop vmrest
sc stop VMwareRESTAPI          # Windows
sudo systemctl stop vmrest     # Linux

# Delete auth
del "%APPDATA%\VMware\preferences.ini"   # Windows
rm ~/.vmware/preferences                 # Linux

# Restart and re-enter credentials
vmrest
```

### 3. VM Won't Start

1. Check `.vmx` file exists
2. Check disk space
3. Check log files:
   - Windows: `%APPDATA%\VMware\vmware.log`
   - Linux: `~/.vmware/vmware.log`

### 4. No Network

```batch
:: Windows
net stop "VMware NAT Service" && net start "VMware NAT Service"
net stop "VMware DHCP Service" && net start "VMware DHCP Service"
```

```bash
# Linux
sudo systemctl restart vmware-networks
```

## Advanced

### Virtual Network Editor

- Windows: run **Virtual Network Editor** as admin
- Linux: edit `/etc/vmware/networking`, then `sudo systemctl restart vmware-networks`

### Performance Tweaks in `.vmx`

```ini
vhv.enable = "TRUE"
MemTrimRate = "0"
sched.mem.pshare.enable = "FALSE"
prefvmx.useRecommendedLockedMemSize = "TRUE"

scsi0.virtualDev = "lsilogic"
scsi0:0.mode = "persistent"

ethernet0.virtualDev = "vmxnet3"
```

### Batch Create VMs

```python
import requests
base_url = "https://localhost:8697/api"
auth = ("admin", "password")

for c in [{"name": "vm1", "memory": 4096, "cpus": 2},
          {"name": "vm2", "memory": 8192, "cpus": 4}]:
    r = requests.post(f"{base_url}/vms", auth=auth, json=c, verify=False)
    print(c["name"], r.status_code)
```

## Best Practices

- Snapshot **before** risky operations
- Encrypt sensitive VMs
- Keep Workstation updated
- Monitor via OpenIDCS dashboard
- Isolate sensitive VMs on separate vmnets

## References

- [VMware Workstation Docs](https://docs.vmware.com/en/VMware-Workstation-Pro/)
- [VMware REST API Reference](https://docs.vmware.com/en/VMware-Workstation-Pro/17.0/com.vmware.ws.using.doc/GUID-C3361DF5-A4C1-4C5C-950C-5AFAB8B68C6E.html)
- [vSphere Automation API](https://developer.vmware.com/apis/vsphere-automation/latest/)

## Next

- 🐳 [Docker](/en/vm/docker)
- 📦 [LXD](/en/vm/lxd)
- 🏢 [Proxmox VE](/en/vm/proxmox)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
