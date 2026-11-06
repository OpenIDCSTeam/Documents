# LXC / LXD deployment

LXD provides virtual-machine-like containers with systemd and their own IP. The controller manages instances through the `lxc` CLI.

## Install

```bash
sudo snap install lxd
sudo lxd init --auto
# or interactive: sudo lxd init
```

```bash
sudo usermod -aG lxd $USER
newgrp lxd
lxc list
```

## Configure

```bash
lxc storage list
lxc network list

lxc profile create small
lxc profile set small limits.cpu 1
lxc profile set small limits.memory 1GB
```

## Add the host

| Field | Example |
|---|---|
| Name | `lxd-edge` |
| Type | LinuxContainer Env (`LxContainer`) |
| Address | `10.0.0.32` (SSH) |
| User | user in `lxd` group |
| Image path | `/var/lib/lxd/images` |
| Data path | `/var/lib/lxd/storage-pools` |

```bash
opidcs plat install lxd
opidcs host add --name lxd-edge --type LxContainer --addr 10.0.0.32 --user root
opidcs host scanvm lxd-edge
opidcs plat credentials show lxd
```

## Limits

| Item | Support |
|---|---|
| GPU / VRAM | no |
| PCI / USB | no |
| ISO | no |
| Extra disk | no |
| Bandwidth cap | no (edit disabled) |
| Console | noVNC |

## Images

```bash
lxc image list
lxc launch images:debian/12 debian12
lxc image import meta.tar rootfs.tar --alias debian12-custom
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| permission denied | add user to `lxd` group |
| No IP | check `lxdbr0` and NAT |
| Console black | instance not booted / no getty |
