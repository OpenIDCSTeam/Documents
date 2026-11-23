# Instances

Create, inspect, control and share instances. List at `/vms`, detail at `/hosts/:host/vms/:uuid`.

## List

Columns: name, host, status, specs, IP, actions. Filter by host, status, keyword. Batch selection is supported.

<figure class="oidc-figure">
  <img src="/imgs/vms-list.png" alt="Instance list view" loading="lazy" decoding="async">
  <figcaption>List view: one row per instance with power, console and delete actions</figcaption>
</figure>

<figure class="oidc-figure">
  <img src="/imgs/vms-cards.png" alt="Instance card view" loading="lazy" decoding="async">
  <figcaption>Card view: CPU / memory / disk / traffic / port quota at a glance</figcaption>
</figure>

## Create wizard

1. **Host** — only online, enabled hosts; platform limits are shown inline.
2. **Image** — from `images_path` or platform images.
3. **Specs** — CPU, memory, disk, bandwidth, GPU, data disks, IP count. Disabled fields are hidden.
4. **Init** — hostname, user, password, SSH keys, cloud-init `runcmd`, network mode.

The API returns a task ID; the list shows `creating`.

## Detail tabs

Admin view of the instance detail page:

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-admin.png" alt="Instance detail, admin view" loading="lazy" decoding="async">
  <figcaption>Admin view: instance info, resource usage, power actions and configuration</figcaption>
</figure>

Overview · Monitoring · Console · Storage · Network · Backup · Sharing · Access key · Tasks · Settings.

User view of the same instance:

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-user.png" alt="Instance overview, user view" loading="lazy" decoding="async">
  <figcaption>User view: specs, OS, expiry and RDP / VNC / ToDesk entry points</figcaption>
</figure>

### Monitoring

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-monitoring.png" alt="Instance monitoring" loading="lazy" decoding="async">
  <figcaption>Monitoring: CPU / memory / disk / network curves with 30-minute to 30-day ranges</figcaption>
</figure>

### Network

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-network.png" alt="Instance network info" loading="lazy" decoding="async">
  <figcaption>Network: IPv4 / IPv6, bandwidth, traffic cap and NIC MAC</figcaption>
</figure>

### Port forwarding

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-nat.png" alt="Instance port forwarding" loading="lazy" decoding="async">
  <figcaption>Port forwarding: one rule maps a public port to an instance port</figcaption>
</figure>

### Backup

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-backup.png" alt="Instance backups" loading="lazy" decoding="async">
  <figcaption>Backups: backup files with creation time and restore / delete actions</figcaption>
</figure>

### Access key

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-access-key.png" alt="Instance access key" loading="lazy" decoding="async">
  <figcaption>Access key: long-lived credential for passwordless login; can be reset or revoked</figcaption>
</figure>

### Boot order

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-boot-order.png" alt="Instance boot order" loading="lazy" decoding="async">
  <figcaption>Boot order: set disk and CD-ROM / network boot priority</figcaption>
</figure>

## Power actions

| Action | Notes |
|---|---|
| start | — |
| stop | graceful, guest support required |
| poweroff | may lose data |
| restart | — |
| reset | platform dependent |
| pause / resume | not on MEmu |
| reinstall | rebuilds system disk |
| delete | tombstone + async reclaim |

## Console

- noVNC: Ctrl+Alt+Del, clipboard, fullscreen.
- Web SSH: copy/paste friendly.
- RDP / ADB for Hyper-V, Workstation and MEmu.

<figure class="oidc-figure">
  <img src="/imgs/vm-console-vnc.png" alt="noVNC console in the browser" loading="lazy" decoding="async">
  <figcaption>noVNC console: operate the instance desktop without installing a client</figcaption>
</figure>

## Editing

- CPU/memory changes usually require a restart.
- Disks can grow, not shrink.
- Bandwidth changes apply immediately where supported.
- Changing the image does not reinstall; use "reinstall".

## Sharing

Transfer ownership, add shares (read-only / console / manage), generate a 16-character access key. See [Sharing & access keys](/en/features/access).

## Batch operations

Power on/off and delete multiple instances, or attach several instances to one proxy rule (same host).

## CLI

```bash
quickidc vm list --host pve-lab
quickidc vm add --host pve-lab --image debian12 --cpu 2 --mem 2048 --disk 40
quickidc vm power start <uuid>
```
