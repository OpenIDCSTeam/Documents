# QEMU / KVM host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [QEMU/libvirt installed](/en/deploy/platform/qemu), account can run `virsh`.

| Field | Example |
|---|---|
| Name | `kvm-01` |
| Type | QEMU/KVM Platform |
| Address | `10.0.0.61` |
| User | root or libvirt group |
| Image path | `/var/lib/libvirt/images` |
| Data path | `/data/vms` |
| Backup path | `/data/backup` |
| VNC port | `5900` |

```bash
opidcs host add --name kvm-01 --type QEMUServer --addr 10.0.0.61 --user root
opidcs host scanvm kvm-01
```

## Verify

- [ ] `virsh list --all` works
- [ ] host online
- [ ] test instance + noVNC
- [ ] password reset via guest agent
