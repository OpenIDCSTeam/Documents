# Platform deployment overview

The controller does not run virtual machines; it manages hosts where a runtime is already installed.

## Choose a platform

| Scenario | Platform |
|---|---|
| Fast containers | [Docker](/en/deploy/platform/docker) |
| systemd-like containers | [LXD](/en/deploy/platform/lxd) |
| General KVM | [Proxmox VE](/en/deploy/platform/proxmox) / [QEMU](/en/deploy/platform/qemu) |
| Existing VMware | [ESXi](/en/deploy/platform/esxi) |
| Windows | [Hyper-V](/en/deploy/platform/hyperv) |
| Desktop tests | [VirtualBox](/en/deploy/platform/virtualbox) |
| Windows VMs | [Workstation](/en/deploy/platform/vmware) |
| MicroVM | [SmolVM](/en/deploy/platform/smolvm) |
| Android | [MuMu](/en/deploy/platform/memu) |
| Qingzhou | disabled — [notes](/en/deploy/platform/qingzhou) |

## Common flow

```mermaid
flowchart LR
    A[Install runtime] --> B[Open management channel]
    B --> C[Verify command]
    C --> D[Prepare images/storage]
    D --> E[Add host]
    E --> F[Create test instance]
```

## Access modes

| Mode | Platforms | How |
|---|---|---|
| API | Proxmox 8006, ESXi 443, Hyper-V 5985, Workstation 8697 | address + credentials |
| Command channel | Docker, LXD, QEMU, SmolVM | local or SSH |
| Local only | VirtualBox, MuMu | same machine as the controller |

::: warning SSH permissions
For command-channel platforms the account must be able to run `docker` / `lxc` / `virsh` without an interactive password. Prefer group membership over root.
:::

## Controller-side commands

```bash
opidcs plat list
opidcs plat install          # interactive
opidcs plat install docker
opidcs plat show docker
opidcs plat credentials show docker
```

Availability by OS:

| OS | Platforms |
|---|---|
| Linux | docker, lxd, smolvm, qemu, virtualbox |
| macOS | docker, smolvm |
| Windows | docker (Desktop), hyperv, vmware, memu, virtualbox |

## Verify virtualization

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
docker version
lxc list
virsh list --all
VBoxManage list vms
```
