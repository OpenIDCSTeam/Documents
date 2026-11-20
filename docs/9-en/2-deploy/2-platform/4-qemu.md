# QEMU / KVM deployment

The controller manages QEMU/KVM through `virsh` (libvirt).

## Install

```bash
# Debian / Ubuntu
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst
sudo systemctl enable --now libvirtd
sudo usermod -aG libvirt,kvm $USER
newgrp libvirt

# RHEL family
sudo dnf install -y qemu-kvm libvirt virt-install
```

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
ls -l /dev/kvm
```

## Network and storage

```bash
virsh net-list --all
virsh net-start default
virsh net-autostart default

virsh pool-define-as vms dir --target /data/vms
virsh pool-build vms && virsh pool-start vms && virsh pool-autostart vms
```

## Add the host

| Field | Example |
|---|---|
| Name | `kvm-01` |
| Type | QEMU/KVM Platform |
| Address | `10.0.0.61` |
| User | root (virsh) |
| Image path | `/var/lib/libvirt/images` |
| Data path | `/data/vms` |

```bash
opidcs plat install qemu
opidcs host add --name kvm-01 --type QEMUServer --addr 10.0.0.61 --user root
opidcs host scanvm kvm-01
```

::: tip Password reset
Install `qemu-guest-agent` inside the guest, otherwise reset via console.
:::

## Capabilities

GPU/PCI/USB passthrough, ISO, extra disks, bandwidth limits, noVNC, `qemu-img` backups.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `/dev/kvm` denied | add user to `kvm` group |
| No network | check libvirt network / bridge |
| Reset fails | install `qemu-guest-agent` |
