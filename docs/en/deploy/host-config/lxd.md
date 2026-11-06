# LXD host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [LXD initialized](/en/deploy/platform/lxd), account in the `lxd` group.

| Field | Example |
|---|---|
| Name | `lxd-edge` |
| Type | LinuxContainer Env |
| Address | `10.0.0.32` |
| User | user in `lxd` group |
| Image path | `/var/lib/lxd/images` |
| Data path | `/var/lib/lxd/storage-pools` |
| Instance cap | `80` |

```bash
opidcs host add --name lxd-edge --type LxContainer --addr 10.0.0.32 --user root
opidcs host scanvm lxd-edge
opidcs plat credentials show lxd
```

## Verify

- [ ] `lxc list` works
- [ ] host online
- [ ] test instance + noVNC works
- [ ] delete synchronizes
