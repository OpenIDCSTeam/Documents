# Introduction

OpenIDCS is an open-source **IDC virtualization management platform**: a single Go binary controller (CloudHost), a React web console (FrontPage), an in-guest agent (CloudInit), and a set of billing-system plugins.

::: tip In one sentence
You have hosts, several hypervisors, and a billing system — OpenIDCS turns them into one IDC you can sell from.
:::

## Components

| Component | Stack | Role |
|---|---|---|
| CloudHost | Go + Gin + SQLite | Hosts, instances, network, users, tasks, REST API |
| FrontPage | React + Ant Design | Admin and user console |
| CloudInit | Go | In-guest agent: IP reporting, password, commands |
| FSPlugins | PHP | IDCSmart, LxdServer, SwapIDC, Easypanel, VistaPanel |

## Platforms

| Platform | Engine type | Access |
|---|---|---|
| Docker / Podman | `OCInterface` | local or SSH |
| LXC / LXD | `LxContainer` | local or SSH |
| Proxmox VE | `PromoxSetup` | HTTPS API `:8006` |
| VMware ESXi | `vSphereESXi` | HTTPS API `:443` |
| Hyper-V | `HyperVSetup` | WinRM `:5985` |
| QEMU / KVM | `QEMUServer` | local or SSH (virsh) |
| VirtualBox | `VirtualBoxs` | local only |
| VMware Workstation | `VMWareSetup` | vmrest `:8697` |
| SmolVM | `SmolVM` | local or SSH |
| MuMu emulator | `MemuAndroid` | local only (Windows) |

## Capabilities

Instances (lifecycle, console, snapshots via backups), NAT port forwarding, iKuai DHCP binding, Caddy reverse proxy, image/ISO/disk/backup management, users and quotas, async tasks, logs, reconciliation, and billing plugins.

## Billing systems

| System | Plugin |
|---|---|
| IDCSmart | `OpenIDC-IDCSmart` |
| IDCSmart (LXD) | `LxdServer-IDCSmart` |
| SwapIDC | `OpenIDC-SwapIDC` |
| EasyPanel | `Easypanel-SwapIDC` |
| VistaPanel | `VistaPanel-SwapIDC` |
| XiaoHei | planned, not shipped |

## Next

- [Quick start](/en/deploy/quick-start)
- [Install CloudHost](/en/deploy/core-install)
- [Platform deployment](/en/deploy/platform/)
- [Billing integration](/en/deploy/finance/)
