# Reverse proxy

Caddy fronts instance ports with a domain and TLS.

## List

Columns: domain, host/instance, upstream, certificate, state, actions.

## Create

| Field | Example |
|---|---|
| Domain | `app.example.com` |
| Host | `pve-lab` |
| Instance | `web-01` |
| Upstream port | `8080` |
| Scheme | `http` |
| Path | `/` |
| Enable HTTPS | yes |

## Certificates

- Caddy obtains certificates via ACME; 80/443 must be reachable.
- DNS must point to the entry IP.
- Renewal is automatic.
- Admin API `2019` is localhost only.

::: warning
Never expose `2019` to the internet.
:::

## Direct vs relay

`proxy_mode` decides the upstream:

- `direct`: instance private IP.
- `relay`: iKuai relay address, then DNAT.

## User view

Users manage proxies for their own instances only; the domain suffix can be restricted by the admin.

## CLI

```bash
opidcs webx list
opidcs webx list --host pve-lab
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| 502 | wrong upstream or service not listening |
| Certificate pending | DNS or port 80 |
| Change not applied | Caddy reload failed; check tasks/logs |
