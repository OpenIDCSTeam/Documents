# Network setup (iKuai)

<div class="oidc-todo">
  <span class="oidc-todo__label">Pending · written by the maintainer</span>
  <p>This page covers iKuai installation, VLANs, DHCP, DNS, port forwarding and relay mode. It will be completed by the project owner.</p>
</div>

## Planned coverage

- [ ] iKuai installation (bare metal / VM / USB)
- [ ] WAN / LAN binding
- [ ] DHCP pools and static leases
- [ ] Controller integration (`i_kuai_addr / i_kuai_user / i_kuai_pass`)
- [ ] DNAT and hairpin
- [ ] Multi-WAN / shared IP naming (`network_nat` / `network_pub`)
- [ ] Direct vs relay mode
- [ ] Typical topologies

## What the controller already does

| Field | Purpose |
|---|---|
| `i_kuai_addr` | iKuai management URL |
| `i_kuai_user` / `i_kuai_pass` | credentials |
| `proxy_mode` | `direct` / `relay` |
| `relay_addr` | relay address |
| `public_addr` | public IPs |
| `network_nat` / `network_pub` | device names |
| `ports_start` / `ports_close` | TCP port range |
| `remote_port` | VNC port |

```text
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid
GET    /api/client/natget/:hs_name/:vm_uuid
POST   /api/client/natadd/:hs_name/:vm_uuid
DELETE /api/client/natdel/:hs_name/:vm_uuid/:rule_index
```

## Related

- [Network & ports](/en/features/network)
- [Port forwarding](/en/usage/nat)
- [Reverse proxy](/en/usage/proxies)
