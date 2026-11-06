# FAQ

## Installation

**Default port?** `1881`. VNC proxy `6080`, Web SSH `7681`, Caddy Admin `2019` (local only).

**Initial admin password?** The Bearer token generated on first start (64 hex chars):

```bash
journalctl -u openidcs | grep -i token
```

**Home page 404?** `static/` must sit next to the binary and contain `index.html` and `assets/`.

**Which systems?** Linux (systemd), Windows, macOS. The shell installer requires systemd; Windows uses the Inno installer.

**Does upgrading lose data?** No. Data lives in `--data-dir`; back up `hostmanage.db` anyway.

## Platforms

**Which platform should I choose?** Docker/LXD for containers, Proxmox/QEMU for VMs, ESXi/Workstation for VMware, Hyper-V for Windows, VirtualBox for desktop tests, MuMu for Android.

**Host stays offline?** Check address/port, network reachability, credentials, platform service, firewall.

**Docker/LXD permission denied?** Add the account to `docker` / `lxd` group and re-login.

**Proxmox 401?** Use `root@pam`; accounts with 2FA cannot use password auth — create a dedicated API user.

**Hyper-V unreachable?** `Enable-PSRemoting -Force`, open 5985, configure TrustedHosts or use a domain account.

**Why no ISO/extra disk on LXD?** The engine metadata locks those tabs; it is a platform limitation.

**VirtualBox/MuMu cannot be remote?** They are marked `is_remote = false`; the controller must be on the same machine.

## Instances

**Task stuck at 0%?** Open task detail for the raw platform error (missing image, disk space, network name, permissions).

**Black console?** Instance not running, VNC port unreachable, proxy misconfigured, or token expired.

**Instance IP missing?** The CloudInit agent defaults to `1880`; set `report_port = 1881`.

**Live migration?** Not provided. The controller supports disk transfer and backup/restore; use platform-native tools for live migration.

## Networking

**NAT vs reverse proxy?** NAT for TCP/UDP (SSH, games); reverse proxy for HTTP/HTTPS with domains and TLS.

**Certificate pending?** DNS must point to the entry IP and 80/443 must be reachable.

**Public controller, instances behind iKuai?** Use `proxy_mode = relay` and set `relay_addr`, with DNAT on iKuai.

## Billing & tools

**Plugin 401?** Token wrong or rotated; update every plugin after rotating.

**What does token reset break?** Plugins, saved CLI configs and external scripts.

**Old doc links 404?** Legacy paths redirect to the new sections; otherwise start from the top navigation.

**Where is the XiaoHei plugin?** Not shipped. Use SwapIDC or IDCSmart against the node.

## Other

**How to back up?** Copy `<data-dir>/hostmanage.db` plus `Caddyfile` and logs; stop the service or use SQLite `.backup`.

**MySQL support?** No, SQLite only.

**How to contribute?** See [Development](/en/dev/).
