# SmolVM host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [SmolVM runtime installed](/en/deploy/platform/smolvm), `/dev/kvm` available.

| Field | Example |
|---|---|
| Name | `smol-01` |
| Type | SmolVM MicroVM Runtime |
| Address | `localhost` |
| Image path | `/var/lib/smolvm` |
| Data path | `/var/lib/smolvm/vms` |

Options:

| Option | Example |
|---|---|
| `smolvm_kernel` | `/var/lib/smolvm/vmlinux` |
| `smolvm_hv` | `firecracker` |
| `smolvm_hv_path` | `/usr/local/bin/firecracker` |

```bash
opidcs host add --name smol-01 --type SmolVM --addr localhost
opidcs plat credentials show smolvm
```

## Verify

- [ ] host online
- [ ] instance boots
- [ ] SSH forwarding works
