# Host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
  <p>Connection details and permission requirements differ per platform. This page defines the shared fields; platform pages will be expanded by the project owner.</p>
</div>

## What a host is

A host is a node with a virtualization runtime installed and reachable by the controller. The controller stores its connection, storage paths, network settings and quotas.

## Flow

1. Choose the engine type (it determines available fields).
2. Fill credentials (API or SSH).
3. Fill storage paths (host perspective).
4. Configure network (public IP, direct/relay, iKuai).
5. Save and verify.

## Common fields

| Field | Required | Description |
|---|---|---|
| `name` | yes | unique display name |
| `type` | yes | engine type |
| `server_addr` | yes | `host[:port]`; empty/localhost = local |
| `server_user` / `server_pass` | remote | credentials |
| `filter_name` | recommended | only manage instances with this prefix |
| `public_addr` | recommended | public IPs, comma separated |
| `proxy_mode` | recommended | `direct` / `relay` |
| `images_path` / `dvdrom_path` | recommended | images / ISO |
| `system_path` / `extern_path` / `backup_path` | recommended | disks / backups |
| `ports_start` / `ports_close` | recommended | NAT range |
| `limits_nums` | recommended | instance cap |

## Engine types

| Platform | Type | Access |
|---|---|---|
| Docker | `OCInterface` | local / SSH |
| LXD | `LxContainer` | local / SSH |
| Proxmox VE | `PromoxSetup` | API 8006 |
| ESXi | `vSphereESXi` | API 443 |
| Hyper-V | `HyperVSetup` | WinRM 5985 |
| QEMU | `QEMUServer` | local / SSH |
| VirtualBox | `VirtualBoxs` | local only |
| Workstation | `VMWareSetup` | API 8697 |
| SmolVM | `SmolVM` | local / SSH |
| MuMu | `MemuAndroid` | local only |

## CLI

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host list
opidcs host show pve-lab
opidcs host status pve-lab
```

## Platform pages

[Docker](/en/deploy/host-config/docker) · [LXD](/en/deploy/host-config/lxd) · [SmolVM](/en/deploy/host-config/smolvm) · [QEMU](/en/deploy/host-config/qemu) · [VirtualBox](/en/deploy/host-config/virtualbox) · [Workstation](/en/deploy/host-config/vmware) · [ESXi](/en/deploy/host-config/esxi) · [Proxmox](/en/deploy/host-config/proxmox) · [Hyper-V](/en/deploy/host-config/hyperv) · [MuMu](/en/deploy/host-config/memu)
