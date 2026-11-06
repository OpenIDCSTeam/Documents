# Images & CloudInit

Two parts: where to get images, and how to build a cloud-init ready image.

## Official cloud images

| OS | Source | Format |
|---|---|---|
| Debian 12 | <https://cloud.debian.org/images/cloud/> | qcow2 / raw |
| Ubuntu 22.04 / 24.04 | <https://cloud-images.ubuntu.com/> | img / qcow2 |
| Alpine | <https://alpinelinux.org/downloads/> | qcow2 / tar |
| Rocky / AlmaLinux | vendor cloud images | qcow2 |
| Windows | Microsoft Evaluation Center / licensed media | iso / vhdx |

::: warning OpenIDCS mirror pending
The project mirror and SHA256 checksums will be published by the maintainer. Use upstream sources and verify manually until then.
:::

## Build a cloud-init image (Debian 12)

```bash
# 1. install cloud-init
sudo apt update && sudo apt install -y cloud-init

# 2. datasource
cat | sudo tee /etc/cloud/cloud.cfg.d/99-openidcs.cfg <<'EOF'
datasource_list: [ NoCloud, ConfigDrive, None ]
EOF

# 3. clean state
sudo cloud-init clean --logs --seed
sudo truncate -s 0 /etc/machine-id
sudo rm -f /var/lib/dbus/machine-id /etc/ssh/ssh_host_*
sudo rm -rf /var/lib/cloud/* /root/.bash_history
sudo poweroff

# 4. compress
qemu-img convert -O qcow2 -c base.qcow2 debian12-cloudinit.qcow2
```

Put the result into `images_path`.

## NoCloud seed

```yaml
# meta-data
instance-id: oidc-001
local-hostname: oidc-001
```

```yaml
# user-data
#cloud-config
users:
  - name: root
    ssh_authorized_keys:
      - ssh-ed25519 AAAA... you@example.com
ssh_pwauth: true
chpasswd:
  expire: false
  users:
    - {name: root, password: "change-me", type: text}
```

```bash
genisoimage -output seed.iso -volid cidata -joliet -rock user-data meta-data
```

## Platform notes

| Platform | Cloud-init method |
|---|---|
| Proxmox | Cloud-Init drive + snippets |
| QEMU | seed ISO or `virt-install --cloud-init` |
| LXD | `lxc config set <vm> cloud-init.user-data - < user-data` |
| Docker / SmolVM | no cloud-init; bake rootfs |
| ESXi | `guestinfo.userdata` |
| Hyper-V | unattended ISO or first-boot script |
