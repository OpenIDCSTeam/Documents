# Port forwarding

NAT rules map public ports to instance ports.

## List

Columns: host, instance, protocol, public port, private port, state, actions.

## Create

1. Select host.
2. Select instance.
3. Choose TCP/UDP.
4. Enter public and private ports.
5. Optional note.

A public port + protocol pair can only be used once per host.

## How rules are applied

| Platform | Mechanism |
|---|---|
| Proxmox / QEMU | host iptables DNAT |
| LXD | iptables / proxy device |
| Docker | iptables or socat |
| iKuai | iKuai port-forward API |
| Hyper-V | Windows NAT / port proxy |

Failures are marked red and recorded as tasks.

## NAT vs reverse proxy

| Dimension | NAT | Reverse proxy |
|---|---|---|
| Protocol | TCP / UDP | HTTP / HTTPS |
| Domain | no | yes |
| TLS | no | Caddy |
| Use | SSH, games, databases | web, panels, APIs |

## CLI

```bash
opidcs port list --host pve-lab
opidcs port add --vm <uuid> --proto tcp --public 20022 --private 22
opidcs port del <rule-id>
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Rule exists but fails | check platform firewall and iKuai DNAT |
| Port conflict | change port or delete the other rule |
| Apply failed | inspect task error |
