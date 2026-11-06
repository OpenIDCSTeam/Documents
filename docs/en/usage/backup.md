# Backup & restore

File-level backups for instances, platform dependent.

## Create

Instance detail → Backup, or:

```text
POST /api/client/backup/create/:hs_name/:vm_uuid
```

Fields: name, type (full), storage (`backup_path`), note. Runs as a task.

## Restore

::: danger
Restore overwrites the current disks. Take a backup first.
:::

1. Select a backup.
2. Confirm the instance will stop.
3. Run the restore task.
4. Start and verify.

## Delete

Backup files are not recoverable. Retention is not automatic; configure cleanup on the host.

## Platform support

| Platform | Implementation |
|---|---|
| Proxmox | `vzdump` / `qmrestore` |
| QEMU | `qemu-img` / disk copy |
| ESXi | driver dependent |
| LXD | `lxc export` / `lxc import` |
| Docker | image export / volume archive |
| Hyper-V | `Export-VM` / checkpoint |
| VirtualBox | `VBoxManage export/import` |
| SmolVM | rootfs copy |
| MuMu | not supported |

Backups are not snapshots: there is no unified snapshot chain.

## Retention

| Scenario | Suggestion |
|---|---|
| Daily changes | daily, keep 7 |
| Weekly changes | weekly, keep 4 |
| Milestones | manual, long-term |
