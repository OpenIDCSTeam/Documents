# Proxmox VE host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [PVE installed](/en/deploy/platform/proxmox), `root@pam` can log in.

| Field | Example |
|---|---|
| Name | `pve-lab` |
| Type | ProxmoxVE Platform |
| Address | `10.0.0.21:8006` |
| User | `root@pam` |
| ISO storage | `local:iso` |
| VM storage | `local-lvm` |
| Backup storage | `local` |
| Instance cap | `100` |

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host status pve-lab
```

## Verify

- [ ] `/api2/json/version` reachable
- [ ] instances listed
- [ ] noVNC opens
- [ ] backup task creates
