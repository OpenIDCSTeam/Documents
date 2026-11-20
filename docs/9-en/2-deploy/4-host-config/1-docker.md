# Docker host configuration

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
</div>

Prerequisite: [Docker installed](/en/deploy/platform/docker), account can run `docker`.

| Field | Example |
|---|---|
| Name | `docker-01` |
| Type | Docker Runtime Env |
| Address | `10.0.0.51` |
| User | user in `docker` group |
| Image path | `/data/images` |
| Data path | `/data/vms` |
| Port range | `20000`–`30000` |
| Instance cap | `50` |

```bash
opidcs host add --name docker-01 --type OCInterface --addr 10.0.0.51 --user root
opidcs host scanvm docker-01
```

## Verify

- [ ] host online
- [ ] instances listed
- [ ] test container created
- [ ] web terminal opens
