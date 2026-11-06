# Instances

Create, inspect, control and share instances. List at `/vms`, detail at `/hosts/:host/vms/:uuid`.

## List

Columns: name, host, status, specs, IP, actions. Filter by host, status, keyword. Batch selection is supported.

## Create wizard

1. **Host** — only online, enabled hosts; platform limits are shown inline.
2. **Image** — from `images_path` or platform images.
3. **Specs** — CPU, memory, disk, bandwidth, GPU, data disks, IP count. Disabled fields are hidden.
4. **Init** — hostname, user, password, SSH keys, cloud-init `runcmd`, network mode.

The API returns a task ID; the list shows `creating`.

## Detail tabs

Overview · Monitoring · Console · Storage · Network · Backup · Sharing · Access key · Tasks · Settings.

## Power actions

| Action | Notes |
|---|---|
| start | — |
| stop | graceful, guest support required |
| poweroff | may lose data |
| restart | — |
| reset | platform dependent |
| pause / resume | not on MuMu |
| reinstall | rebuilds system disk |
| delete | tombstone + async reclaim |

## Console

- noVNC: Ctrl+Alt+Del, clipboard, fullscreen.
- Web SSH: copy/paste friendly.
- RDP / ADB for Hyper-V, Workstation and MuMu.

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
opidcs vm list --host pve-lab
opidcs vm add --host pve-lab --image debian12 --cpu 2 --mem 2048 --disk 40
opidcs vm power start <uuid>
```
