---
title: VMware vSphere ESXi Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# VMware vSphere ESXi Configuration

This guide shows how to onboard a **VMware vSphere ESXi** host into OpenIDCS. ESXi is VMware's enterprise-grade bare-metal (Type-1) hypervisor, widely used in finance, government and large IDCs.

## ✨ Pros & Cons

### 👍 Pros

- **Industry standard** — the most mature enterprise hypervisor
- **Type-1 architecture** — runs directly on hardware, tiny overhead
- **Full feature set** — vMotion, DRS, HA, FT, etc.
- **Huge ecosystem** — the largest HCL, global support
- **Mature tooling** — vCenter + vSphere Client

### 👎 Cons

- **Commercial** — licenses are expensive (even more so after the Broadcom acquisition)
- **Free version is limited** — the free ESXi API is read-only, you cannot create VMs through it
- **Strict HCL** — consumer hardware often lacks drivers
- **Closed ecosystem** — integration with open-source tooling takes extra effort

### 🎯 Recommended Scenarios

- Finance / government production environments
- Enterprises that already own VMware licenses
- Hybrid cloud with vSphere / VCF

::: warning License requirement
OpenIDCS talks to ESXi through **pyvmomi (vSphere SOAP API)**, which requires:
- **Paid ESXi** (Standard or above), OR
- Connection via **vCenter Server**.

The free ESXi API is read-only — VM create/modify is not allowed.
:::

## 🖥️ System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 64-bit x86 with VT-x / AMD-V | Multi-CPU server class |
| Memory | 8 GB | 32 GB+ |
| Disk | 32 GB | 2× SSD + RAID |
| NIC | 1 Gbps, on the HCL | 2× 10 Gbps |
| OS | VMware ESXi 6.7 / 7.0 / 8.0 | ESXi 7.0 U3 / 8.0 |

## 🚀 Install on Target Host

### Step 1: Download ESXi

Broadcom support portal:

```
https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware+vSphere+Hypervisor
```

### Step 2: Install ESXi

1. Flash the installer to a USB stick and boot from it
2. Select the install disk (not a data disk)
3. Set a **strong root password** (≥8 chars, upper + lower + digit + symbol)
4. Configure the management network (F2 → Configure Management Network):
   - Static IP, netmask, gateway
   - DNS
   - FQDN

### Step 3: Enable SSH / ESXi Shell (for troubleshooting)

In the ESXi DCUI:

```
F2 → Troubleshooting Options → Enable SSH
                            → Enable ESXi Shell
```

Or via the Web UI (`https://<esxi-ip>/ui`): **Host → Manage → Services → TSM-SSH → Start**.

### Step 4: Configure NTP (Important)

The API authentication is time-sensitive:

```bash
ssh root@<esxi-ip>

esxcli system ntp set --server=pool.ntp.org
esxcli system ntp set --enabled=true
/etc/init.d/ntpd start
```

Or via the Web UI: **Manage → System → Time & Date → NTP Service**.

### Step 5: Firewall Rules

```bash
esxcli network firewall ruleset set --ruleset-id=httpClient --enabled=true
esxcli network firewall ruleset set --ruleset-id=vpxHeartbeats --enabled=true
```

`443/tcp` is open by default.

### Step 6: Create a Dedicated Service Account

```bash
ssh root@<esxi-ip>

esxcli system account add -i openidcs -p '<StrongPassword>' -c '<StrongPassword>' \
    -d "OpenIDCS Service Account"

esxcli system permission set -i openidcs -r Admin
```

Or via vCenter: **Administration → Permissions** and assign the Administrator role.

### Step 7: Test the API

On the OpenIDCS manager:

```python
from pyVim.connect import SmartConnect, Disconnect
import ssl

ctx = ssl._create_unverified_context()

si = SmartConnect(
    host='<esxi-ip>',
    user='openidcs',
    pwd='<StrongPassword>',
    port=443,
    sslContext=ctx,
)

print("Connected:", si.content.about.fullName)
Disconnect(si)
```

### Step 8: (Optional) Add an ISO Datastore

```
Web UI → Storage → New datastore
Type: VMFS
Name: iso-lib
Capacity: dedicated data disk
```

Used later to upload ISO templates.

## 🔗 Add Host in OpenIDCS

1. Open the OpenIDCS Web UI
2. **Host Management → Add Host**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `esxi-01` |
   | Type | `VMware vSphere ESXi` |
   | Address | ESXi IP / FQDN |
   | Port | `443` |
   | Username | `openidcs` or `root` |
   | Password | your password |
   | Datastore | `datastore1` |
   | Network | `VM Network` |
   | ISO Library | `iso-lib` (optional) |

4. Click **Test Connection** → **Save**

## 📘 Common Commands

```bash
# List VMs
vim-cmd vmsvc/getallvms

# Power
vim-cmd vmsvc/power.on <vmid>
vim-cmd vmsvc/power.shutdown <vmid>

# Info
vim-cmd vmsvc/get.summary <vmid>

# Snapshot
vim-cmd vmsvc/snapshot.create <vmid> "snap-name" "description" 1 0

# Host info
esxcli system version get
esxcli hardware cpu global get
esxcli hardware memory get
```

## 🐛 Troubleshooting

### 1. `vim.fault.InvalidLogin`

- Verify username / password
- Check account status: `esxcli system account list`
- Check permissions: `esxcli system permission list`

### 2. `ServerFaultCode: Permission to perform this operation was denied`

Free ESXi API is read-only. Upgrade to paid or connect via vCenter.

### 3. SSL Verification Failed

ESXi uses a self-signed cert by default. In OpenIDCS host config, enable **Skip SSL verification**, or install a trusted certificate:

```bash
cp /etc/vmware/ssl/rui.crt /etc/vmware/ssl/rui.crt.bak
cp /etc/vmware/ssl/rui.key /etc/vmware/ssl/rui.key.bak

# Replace with your own cert
# ...

/etc/init.d/hostd restart
/etc/init.d/vpxa restart
```

### 4. Clock Skew Breaks Auth

```bash
esxcli system time get
/etc/init.d/ntpd restart
```

## 🔒 Security

- Keep SSH disabled in daily operation; enable only when troubleshooting
- Enable **Lockdown Mode**: **Host → Security → Lockdown Mode → Normal**
- Use a dedicated service account, don't reuse root for API
- Apply VMware Security Advisories patches regularly
- Separate vSwitches / VLANs for business traffic

## 📚 References

- [VMware vSphere Documentation](https://docs.vmware.com/en/VMware-vSphere/)
- [pyvmomi on GitHub](https://github.com/vmware/pyvmomi)
- [ESXi CLI Reference](https://developer.vmware.com/docs/esxcli/)

## Next

- 🖥️ [VMware Workstation](/en/vm/vmware)
- 🏢 [Proxmox VE](/en/vm/proxmox)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
