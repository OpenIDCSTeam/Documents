# VMware ESXi host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [ESXi installed](/en/deploy/platform/esxi), `443` reachable.

| Field | Example |
|---|---|
| Name | `esxi-01` |
| Type | vSphereESXi Server |
| Address | `10.0.0.31:443` |
| User | `root` |
| ISO path | `[datastore1] ISO` |
| VM path | `[datastore1]` |
| Instance cap | `60` |

```bash
opidcs host add --name esxi-01 --type vSphereESXi --addr 10.0.0.31:443 --user root
opidcs host status esxi-01
```

## Verify

- [ ] host online
- [ ] instance list matches vSphere
- [ ] console opens
- [ ] create/delete cycle succeeds
