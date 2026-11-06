# Supported platforms

Engine types are defined in `internal/driver/engine_config.go` and exposed by `GET /api/system/engine`.

## Platform list

| Platform | Engine type | Runs on | Controller access | Default |
|---|---|---|---|---|
| Docker / Podman | `OCInterface` | Linux / macOS | local or SSH | on |
| LXC / LXD | `LxContainer` | Linux | local or SSH | on |
| Proxmox VE | `PromoxSetup` | dedicated host | HTTPS `:8006` | on |
| VMware ESXi | `vSphereESXi` | dedicated host | HTTPS `:443` | on |
| Hyper-V | `HyperVSetup` | Windows | WinRM `:5985` | on |
| QEMU / KVM | `QEMUServer` | Linux | local or SSH (virsh) | on |
| VirtualBox | `VirtualBoxs` | Win / Linux / macOS | local `VBoxManage` | on |
| Workstation | `VMWareSetup` | Windows | vmrest `:8697` | on |
| SmolVM | `SmolVM` | Linux | local or SSH | on |
| MuMu | `MemuAndroid` | Windows | local `memuc` | on |
| Qingzhou | `QingzhouYun` | — | HTTP API | **off** |

## Capability matrix

| Platform | GPU | PCI | USB | ISO | Extra disk | Bandwidth cap | Console |
|---|---|---|---|---|---|---|---|
| Docker | — | — | — | — | — | — | Web terminal |
| LXD | — | — | — | — | — | — | noVNC |
| Proxmox | yes | yes | yes | yes | yes | yes | noVNC |
| ESXi | yes | yes | yes | yes | yes | yes | noVNC |
| Hyper-V | yes (GPU-P/DDA) | yes | — | yes | yes | min(up, down) | noVNC / RDP |
| QEMU | yes | yes | yes | yes | yes | yes | noVNC |
| VirtualBox | — | — | yes (ext pack) | yes | yes | yes | VRDE (RDP) |
| Workstation | virtual VRAM | — | yes | yes | yes | yes | noVNC |
| SmolVM | — | — | — | — | — | — | SSH |
| MuMu | — | — | — | APK instead | — | — | ADB |
| Qingzhou | — | — | — | yes | yes | yes | noVNC |

::: warning Backup is not snapshot
OpenIDCS abstracts `CreateBackup / RestoreBackup / DeleteBackup`, not a unified snapshot chain. Availability depends on the driver.
:::

## How metadata is used

```json
{
  "QEMUServer": {
    "enabled": true,
    "is_remote": true,
    "ban_init": [],
    "tab_lock": [],
    "messages": ["VNC remote console", "qemu-guest-agent required for password reset"]
  }
}
```

- `ban_init` / `ban_edit`: fields hidden on create/edit.
- `tab_lock`: detail tabs that are locked (`pci`, `usb`, `iso`, `hdd`, `efi`, `gpu`).
- `messages`: hints shown above the form.

## Choosing a platform

| Need | Recommendation |
|---|---|
| Fast containers | Docker or LXD |
| General VMs | Proxmox VE / QEMU |
| Existing VMware | ESXi / Workstation |
| Windows stack | Hyper-V |
| Desktop test | VirtualBox |
| MicroVM | SmolVM |
| Android cloud phones | MuMu |

## Related

- [Platform deployment](/en/deploy/platform/)
- [Host configuration](/en/deploy/host-config/)
