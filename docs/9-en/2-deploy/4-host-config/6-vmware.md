# VMware Workstation host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [Workstation and vmrest ready](/en/deploy/platform/vmware), `8697` reachable.

| Field | Example |
|---|---|
| Name | `ws-01` |
| Type | VMWare Workstation |
| Address | `10.0.0.71:8697` |
| User | vmrest account |
| Image path | `D:\VM\Images` |
| Data path | `D:\VM\VMs` |

```bash
opidcs host add --name ws-01 --type VMWareSetup --addr 10.0.0.71:8697 --user openidcs
opidcs host status ws-01
```

## Verify

- [ ] `/api/vms` reachable
- [ ] host online
- [ ] power and console work
