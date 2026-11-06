# Proxmox VE deployment

PVE is a Debian-based KVM + LXC host with a complete API. The controller connects to `https://<host>:8006`.

## Install

1. Boot the PVE ISO and install.
2. Use an FQDN hostname, set timezone, password and management NIC.
3. Open `https://<ip>:8006`.

```bash
pveversion
pvesm status
qm list
pct list
```

## Network

Default bridge `vmbr0`. For VLANs create `vmbr0.<vlan>`. Avoid double NAT: let iKuai or PVE assign IPs, not both.

## Add the host

| Field | Example |
|---|---|
| Name | `pve-lab` |
| Type | ProxmoxVE Platform (`PromoxSetup`) |
| Address | `10.0.0.21:8006` |
| User | `root@pam` |
| ISO storage | `local:iso` |
| VM storage | `local-lvm` |

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host status pve-lab
```

::: warning 2FA
The driver uses username + password. Accounts with TOTP enabled will fail; create a dedicated API user without 2FA.
:::

## Capabilities

GPU/PCI/USB passthrough, ISO, extra disks, bandwidth limits, noVNC with ticket, `vzdump` backups.

## Verify

```bash
curl -k https://10.0.0.21:8006/api2/json/version
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| 401 | use `root@pam` |
| Connection refused | open 8006, check pveproxy |
| Create failed | verify storage names with `pvesm status` |
