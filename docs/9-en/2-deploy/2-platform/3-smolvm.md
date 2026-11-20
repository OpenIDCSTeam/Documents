# SmolVM (MicroVM) deployment

SmolVM runs MicroVMs with Docker images as rootfs, using KVM plus Firecracker or Cloud-Hypervisor.

::: warning Experimental
The engine is enabled but limited: no GPU/PCI/USB/ISO/extra disks. Validate in a test environment first.
:::

## Prerequisites

- Linux x86_64 / aarch64
- `/dev/kvm`
- Firecracker or Cloud-Hypervisor
- Docker (to build rootfs)

## Install

```bash
ls -l /dev/kvm

# Firecracker example
curl -fsSL https://github.com/firecracker-microvm/firecracker/releases/latest/download/firecracker-v1.7.0-x86_64.tgz -o fc.tgz
tar -xzf fc.tgz
sudo install -m 0755 release-v1.7.0-x86_64/firecracker-v1.7.0-x86_64 /usr/local/bin/firecracker

mkdir -p /var/lib/smolvm
# place vmlinux at /var/lib/smolvm/vmlinux-smolvm
```

## Build rootfs

```bash
docker pull debian:12
docker create --name rootfs-tmp debian:12
docker export rootfs-tmp -o /tmp/debian12.tar
docker rm rootfs-tmp

truncate -s 2G /var/lib/smolvm/debian12.ext4
mkfs.ext4 -F /var/lib/smolvm/debian12.ext4
sudo mount -o loop /var/lib/smolvm/debian12.ext4 /mnt
sudo tar -C /mnt -xf /tmp/debian12.tar
sudo umount /mnt
```

## Add the host

| Field | Example |
|---|---|
| Name | `smol-01` |
| Type | SmolVM MicroVM Runtime |
| Address | `localhost` or SSH |
| Image path | `/var/lib/smolvm` |
| Data path | `/var/lib/smolvm/vms` |

Options: `smolvm_kernel`, `smolvm_hv`, `smolvm_hv_path`.

```bash
opidcs plat install smolvm
opidcs plat show smolvm
opidcs host add --name smol-01 --type SmolVM --addr localhost
```

## Limits

No GPU/PCI/USB/ISO/extra disks; console over SSH; port forwarding via socat/iptables.
