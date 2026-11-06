# VMware Workstation deployment

The Workstation engine supports **Windows hosts only** and talks to `vmrest` (default `8697`).

## Install

1. Install VMware Workstation Pro.
2. Locate `vmrest.exe` (usually under `C:\Program Files (x86)\VMware\VMware Workstation\`).
3. Configure credentials and start the service.

```powershell
& "...\vmrest.exe" -C
& "...\vmrest.exe"
```

::: tip Auto-start
Register `vmrest` as a Windows service (for example with NSSM) so it survives reboots.
:::

## Add the host

| Field | Example |
|---|---|
| Name | `ws-01` |
| Type | VMWare Workstation |
| Address | `10.0.0.71:8697` |
| User / Password | vmrest credentials |
| Image path | `D:\VM\Images` |
| Data path | `D:\VM\VMs` |

```bash
opidcs host add --name ws-01 --type VMWareSetup --addr 10.0.0.71:8697 --user openidcs
```

## Capabilities

Virtual VRAM only, no PCI passthrough, USB passthrough, ISO and extra disks, noVNC console.

## Verify

```bash
curl -u openidcs:'******' http://10.0.0.71:8697/api/vms
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| 8697 refused | start `vmrest`, open firewall |
| 401 | rerun `vmrest -C` |
| Linux controller | Workstation requires a Windows host |
