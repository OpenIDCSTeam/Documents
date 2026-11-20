# VMware ESXi deployment

ESXi is a bare-metal hypervisor managed over HTTPS API (`443`).

## Install

1. Boot the ESXi ISO and install.
2. Configure the management network (IP / gateway / DNS).
3. Open `https://<ip>`.

```bash
# enable SSH in the Host Client, then
ssh root@<ip>
esxcli system version get
esxcli storage filesystem list
```

## Add the host

| Field | Example |
|---|---|
| Name | `esxi-01` |
| Type | vSphereESXi Server |
| Address | `10.0.0.31:443` |
| User | `root` |
| ISO path | `[datastore1] ISO` |
| VM path | `[datastore1]` |

```bash
opidcs host add --name esxi-01 --type vSphereESXi --addr 10.0.0.31:443 --user root
```

## Capabilities

GPU/PCI/USB passthrough (hardware and license dependent), ISO, extra disks, bandwidth limits, noVNC, driver-dependent backups.

## Verify

```bash
curl -k -u root:'******' https://10.0.0.31/api/vcenter/host
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Certificate warnings | controller accepts self-signed; prefer trusted certs in production |
| Login fails | verify root password and lockout |
| Cannot create | check datastore space and licensing |
