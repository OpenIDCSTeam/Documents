# Hyper-V deployment

Hyper-V is Windows' built-in hypervisor. The controller uses WinRM (`5985`).

## Install

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All
Restart-Computer
Get-VM
```

## Enable WinRM

```powershell
Enable-PSRemoting -Force
winrm enumerate winrm/config/listener
New-NetFirewallRule -DisplayName "WinRM HTTP" -Protocol TCP -LocalPort 5985 -Action Allow
```

Workgroup environments need `Set-Item WSMan:\localhost\Client\TrustedHosts -Value "<controller-ip>"`.

## Network

```powershell
New-VMSwitch -Name "External" -NetAdapterName "Ethernet" -AllowManagementOS $true
```

## Add the host

| Field | Example |
|---|---|
| Name | `win-hv` |
| Type | Windows HyperV x64 |
| Address | `10.0.0.44:5985` |
| User | `Administrator` |
| Image path | `D:\HyperV\Images` |
| Disk path | `D:\HyperV\VHD` |

```bash
opidcs host add --name win-hv --type HyperVSetup --addr 10.0.0.44:5985 --user Administrator
```

## Capabilities

GPU-P/DDA, PCI passthrough, ISO, extra disks; no USB passthrough; bandwidth capped by the lower of up/down.

## Troubleshooting

| Symptom | Fix |
|---|---|
| WinRM refused | `Enable-PSRemoting`, firewall, TrustedHosts |
| Auth failed | domain account or Basic + TrustedHosts |
| Create failed | check switch name and disk permissions |
