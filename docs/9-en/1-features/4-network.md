# Network & ports

Three layers: **controller-to-host management**, **instance exposure via NAT**, and **domain access via reverse proxy**.

## NAT port forwarding

For instances without a public IP.

- Scope: host + instance + public port + private port (TCP).
- Stored with the instance; can be reclaimed on delete.
- Applied by the driver (iptables, iKuai, or cloud security group).
- API: `GET/POST/DELETE /api/client/nat*`.

```bash
opidcs port list --core 0
```

## iKuai integration

iKuai provides DHCP static binding and ARP binding. Host fields: `i_kuai_addr`, `i_kuai_user`, `i_kuai_pass`.

```text
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid
```

::: warning Network guide pending
The iKuai installation, VLAN and DHCP topology will be written by the maintainer. See [Network setup](/en/deploy/network).
:::

## Reverse proxy (Caddy)

The controller runs Caddy as a child process and manages `Caddyfile`:

- Binary: `CADDY_BIN` or `bin/caddy`.
- Admin API: `2019` (localhost only).
- Config: `<dataDir>/Caddyfile`.
- TLS: automatic via ACME when 80/443 are reachable.

```text
GET    /api/client/proxys/list
POST   /api/client/proxys/create/:hs_name/:vm_uuid
PUT    /api/client/proxys/update/:hs_name/:vm_uuid/:idx
DELETE /api/client/proxys/delete/:hs_name/:vm_uuid/:idx
```

## Direct vs relay

| Mode | When | Behavior |
|---|---|---|
| `direct` | controller and platform on the same network | proxy targets the instance IP |
| `relay` | controller on the internet, instances behind iKuai | proxy targets the iKuai relay address |

Related fields: `relay_addr`, `vnc_ip`, `vnc_wan`, `network_nat`, `network_pub`.

## Port plan

| Port | Service | Exposure |
|---|---|---|
| 1881 | controller HTTP/API | via reverse proxy |
| 6080 | VNC proxy | `wss` recommended |
| 7681 | Web SSH | admin network only |
| 2019 | Caddy Admin | localhost only |
| 8006 / 443 / 5985 / 8697 | platform APIs | controller only |
