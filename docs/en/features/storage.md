# Storage, images & backup

## Storage paths

| Type | Field | Use |
|---|---|---|
| Images | `images_path` | system images, cloud-init templates, SmolVM kernel |
| ISO | `dvdrom_path` | install media |
| System / data / backup | `system_path`, `extern_path`, `backup_path` | disks and backups |

All paths are from the **host's** perspective; the controller accesses them locally or over SSH.

## Images

- `GET /api/client/os-images/:hs_name` lists images.
- `POST /api/client/upload` uploads (multipart).
- The file name is what users pick when creating an instance.

See [Images & CloudInit](/en/deploy/images).

## ISO

```text
GET    /api/client/isos/detail/:hs_name/:vm_uuid
POST   /api/client/iso/mount/:hs_name/:vm_uuid
DELETE /api/client/iso/unmount/:hs_name/:vm_uuid/:iso_name
```

Docker, LXD, SmolVM and MuMu do not support ISO.

## Data disks

| Action | API |
|---|---|
| List | `GET /api/client/hdd/detail/:hs/:uuid` |
| Mount | `POST /api/client/hdd/mount/:hs/:uuid` |
| Unmount | `POST /api/client/hdd/unmount/:hs/:uuid` |
| Transfer | `POST /api/client/hdd/transfer/:hs/:uuid` |
| Delete | `DELETE /api/client/hdd/delete/:hs/:uuid` |

## Backup & restore

File-level backups, not snapshot chains:

```text
GET    /api/client/backup/detail/:hs/:uuid
POST   /api/client/backup/create/:hs/:uuid
POST   /api/client/backup/restore/:hs/:uuid
DELETE /api/client/backup/delete/:hs/:uuid
```

- Stored under `backup_path`.
- Create/restore are async tasks.
- Rotation is not automatic; configure retention on the host.

## Passthrough

```text
GET  /api/client/usb-list/:hs_name
POST /api/client/usb/setup/:hs_name/:vm_uuid
POST /api/client/pci/setup/:hs_name/:vm_uuid
GET  /api/client/gpu-list/:hs_name
POST /api/client/efi/setup/:hs_name/:vm_uuid
```

Support varies by platform; see [Platforms](/en/features/platforms).
