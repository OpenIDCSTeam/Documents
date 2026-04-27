---
title: Windows Hyper-V Configuration
date: 2026-01-01
updated: 2026-04-24
categories:
  - VM Configuration
---

# Windows Hyper-V Configuration

This guide shows how to onboard a **Windows Hyper-V** host into OpenIDCS. Hyper-V is the Type-1 hypervisor built into Windows Server / Windows 10+ Pro, and it is the best choice for pure Windows shops.

## ✨ Pros & Cons

### 👍 Pros

- **Native to Windows** — already included in Windows Server / Pro
- **Zero extra cost** — covered by your Windows license
- **Type-1 architecture** — near-native performance
- **Deep AD / WinRM integration**
- **Best Windows guest performance & compatibility**

### 👎 Cons

- **Windows host only** — can't run on Linux
- **So-so Linux guest support** — some distros need extra drivers
- **Old-school tooling** — SCVMM is costly; most automation is PowerShell
- **Conflicts with Docker Desktop** on the same machine

### 🎯 Recommended Scenarios

- Pure Windows Server data centers
- Environments that already use Active Directory
- Windows application dev / test

## 🖥️ System Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows Server 2016 / 2019 / 2022, or Windows 10/11 Pro/Enterprise |
| **CPU** | 64-bit with Intel VT-x + EPT or AMD-V + RVI |
| **Memory** | ≥ 8 GB (16 GB+ recommended) |
| **Disk** | ≥ 50 GB |
| **BIOS** | Virtualization enabled |

## 🚀 Install on Target Host

### Step 1: Enable the Hyper-V Role

#### Windows Server

```powershell
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart
```

#### Windows 10 / 11 Pro

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
Restart-Computer
```

Or via GUI: **Control Panel → Programs → Turn Windows features on or off → Hyper-V**

### Step 2: Verify Hyper-V

```powershell
Get-WindowsFeature -Name Hyper-V
# InstallState should be "Installed"

Get-VMHost
# Should return host info
```

### Step 3: Enable WinRM (Remote Management)

OpenIDCS manages Hyper-V by executing PowerShell over WinRM:

```powershell
Enable-PSRemoting -Force

# HTTP listener (intranet only)
winrm quickconfig -q
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'

winrm enumerate winrm/config/Listener
```

::: warning Production
In production, **use HTTPS + certificate** — do not combine HTTP + Basic + Unencrypted.
:::

#### (Recommended) WinRM HTTPS

```powershell
$cert = New-SelfSignedCertificate -DnsName "<hostname>" `
    -CertStoreLocation Cert:\LocalMachine\My

New-Item -Path WSMan:\localhost\Listener `
    -Transport HTTPS -Address * -CertificateThumbPrint $cert.Thumbprint -Force

New-NetFirewallRule -DisplayName "WinRM HTTPS" `
    -Direction Inbound -LocalPort 5986 -Protocol TCP -Action Allow
```

### Step 4: Firewall

```powershell
# HTTP (5985) — intranet only
New-NetFirewallRule -DisplayName "WinRM HTTP" `
    -Direction Inbound -LocalPort 5985 -Protocol TCP -Action Allow `
    -RemoteAddress 192.168.0.0/16

Enable-NetFirewallRule -DisplayGroup "Hyper-V"
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

### Step 5: Create Virtual Switches

OpenIDCS expects vSwitches to already exist:

```powershell
# List physical NICs
Get-NetAdapter

# External (bridge to physical NIC)
New-VMSwitch -Name "vSwitch-External" `
    -NetAdapterName "Ethernet" -AllowManagementOS $true

# Internal (host ↔ VM)
New-VMSwitch -Name "vSwitch-Internal" -SwitchType Internal

# Private (VM ↔ VM only)
New-VMSwitch -Name "vSwitch-Private" -SwitchType Private
```

### Step 6: Create a Service Account

```powershell
net user openidcs 'StrongP@ssw0rd!' /add
net localgroup "Hyper-V Administrators" openidcs /add
net localgroup "Remote Management Users" openidcs /add
net localgroup "Administrators" openidcs /add
```

In a domain environment, prefer a **group Managed Service Account (gMSA)**.

### Step 7: Configure Default Paths

```powershell
Set-VMHost -VirtualHardDiskPath "D:\Hyper-V\VHDs" `
           -VirtualMachinePath "D:\Hyper-V\VMs"

New-Item -Path "D:\Hyper-V\VHDs"    -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\VMs"     -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\ISOs"    -ItemType Directory -Force
New-Item -Path "D:\Hyper-V\Backups" -ItemType Directory -Force
```

### Step 8: Test Remote Connection

On the OpenIDCS manager:

```bash
pip install pywinrm

python -c "
import winrm
s = winrm.Session('http://<hyperv-ip>:5985/wsman',
                  auth=('openidcs', 'StrongP@ssw0rd!'))
r = s.run_ps('Get-VMHost | Select Name, LogicalProcessorCount, MemoryCapacity')
print(r.std_out.decode())
"
```

## 🔗 Add Host in OpenIDCS

1. OpenIDCS → **Host Management → Add Host**
2. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `hyperv-01` |
   | Type | `Windows Hyper-V` |
   | Address | Hyper-V host IP / FQDN |
   | Port | `5985` (HTTP) or `5986` (HTTPS) |
   | Protocol | http / https |
   | Username | `openidcs` or `DOMAIN\openidcs` |
   | Password | your password |
   | VHD Path | `D:\Hyper-V\VHDs` |
   | VM Path | `D:\Hyper-V\VMs` |
   | ISO Path | `D:\Hyper-V\ISOs` |
   | Backup Path | `D:\Hyper-V\Backups` |
   | Default vSwitch | `vSwitch-External` |

3. Click **Test Connection** → **Save**

## 📘 Common PowerShell Commands

```powershell
Get-VM

Start-VM -Name "VM01"
Stop-VM -Name "VM01" -Force

New-VM -Name "VM01" -MemoryStartupBytes 4GB `
       -NewVHDPath "D:\Hyper-V\VHDs\VM01.vhdx" -NewVHDSizeBytes 40GB `
       -SwitchName "vSwitch-External" -Generation 2

Checkpoint-VM -Name "VM01" -SnapshotName "snap1"
Export-VM -Name "VM01" -Path "D:\Hyper-V\Backups"

Get-Counter -Counter "\Hyper-V Hypervisor Logical Processor(_Total)\% Total Run Time"
```

## 🐛 Troubleshooting

### 1. Hyper-V Not Enabled / CPU Unsupported

```powershell
systeminfo | findstr /C:"Hyper-V"
```

All lines should say "Yes". If the CPU line says "No", check BIOS virtualization settings.

### 2. WinRM Refused

```powershell
Test-WSMan
Test-WSMan -ComputerName <hyperv-ip> -Credential openidcs
Get-Service WinRM
```

Common causes:
- Firewall blocking 5985 / 5986
- `TrustedHosts` not set on the manager
- Password expired

### 3. Manager Cannot Trust Target

On the OpenIDCS manager:

```powershell
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "<hyperv-ip>" -Force
```

### 4. Kerberos Auth Failed

- Make sure FQDN resolves
- Clock skew ≤ 5 minutes
- Domain account permissions

## 🔒 Security

- Prefer **WinRM over HTTPS (5986)**
- Disable Basic + Unencrypted, use Kerberos / Certificate
- Use a domain account or gMSA instead of local Admin
- Restrict 5985 / 5986 to the OpenIDCS manager IP
- Keep Windows Update current

## 📚 References

- [Hyper-V Documentation](https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/)
- [Hyper-V PowerShell Module](https://docs.microsoft.com/en-us/powershell/module/hyper-v/)
- [WinRM Authentication](https://docs.microsoft.com/en-us/windows/win32/winrm/authentication-for-remote-connections)

## Next

- 🖥️ [VMware Workstation](/en/vm/vmware)
- 🏢 [Proxmox VE](/en/vm/proxmox)
- 🚀 Back to [Quick Start](/en/guide/quick-start)
