# Instance lifecycle

Every lifecycle action goes through `POST /api/client/powers/:hs_name/:vm_uuid` or the matching resource endpoint. Long operations become async tasks.

## States

| State | Meaning | Allowed |
|---|---|---|
| `running` | powered on | stop, restart, power off, pause, console |
| `stopped` | powered off | start, reinstall, delete, edit |
| `paused` | suspended | resume, power off |
| `creating` | task in progress | view or cancel task |
| `error` | failed | inspect task, retry, delete |

## Create

1. Select a host (enabled and online).
2. Select an image from `images_path` or platform images.
3. Set CPU, memory, disk, bandwidth, IP count — restricted fields are hidden.
4. Configure network and cloud-init (user, password, SSH key, runcmd).

The API returns a task ID; the console polls progress.

## Power actions

| Action | Notes |
|---|---|
| `start` | all platforms |
| `stop` | graceful; needs guest support |
| `poweroff` | hard power off |
| `restart` | all platforms |
| `reset` | platform dependent |
| `pause` / `resume` | not supported by MuMu |

## Reinstall and password

- Password reset uses the platform API or guest agent; QEMU requires `qemu-guest-agent`.
- Reinstall rebuilds the system disk and keeps the instance record.
- Disk transfer (`POST /api/client/hdd/transfer/...`) moves a data disk between instances; it is not live migration.

## Delete

1. Delete on the platform.
2. Write a tombstone record.
3. A reconciliation job confirms the platform no longer has the resource.

Retry endpoints (admin): `/api/system/outbox/*`, `/api/system/tombstone/*`.

## Screenshots and console

- `GET /api/client/screenshot/:hs_name/:vm_uuid` returns a data URL.
- `GET /api/client/remote/:hs_name/:vm_uuid` returns noVNC / RDP / ADB connection details.

## Related APIs

```text
GET    /api/client/detail/:hs_name
GET    /api/client/detail/:hs_name/:vm_uuid
POST   /api/client/create/:hs_name
PUT    /api/client/update/:hs_name/:vm_uuid
POST   /api/client/powers/:hs_name/:vm_uuid
POST   /api/client/reinstall/:hs_name/:vm_uuid
DELETE /api/client/delete/:hs_name/:vm_uuid
```
