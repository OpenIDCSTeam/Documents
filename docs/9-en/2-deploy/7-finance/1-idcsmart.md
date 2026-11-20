# IDCSmart integration

`OpenIDC-IDCSmart` is the server module for IDCSmart (魔方财务).

## Layout

```text
plugins/OpenIDC-IDCSmart/
├── idcserver.php
└── templates/{info,ipv4,ipv6,nat,proxy}.html
```

## Install

```bash
git clone https://github.com/OpenIDCSTeam/CloudHost.git /tmp/cloudhost
cp -r /tmp/cloudhost/plugins/OpenIDC-IDCSmart /path/to/idcsmar/modules/server/openidc
chown -R www-data:www-data /path/to/idcsmar/modules/server/openidc
```

Enable the module in the admin panel and create a server group.

## Configuration

| Field | Example |
|---|---|
| `host_name` | `pve-lab` |
| Controller URL | `https://idc.example.com` |
| Bearer token | `6f1c…` |
| Default image | `debian12` |
| CPU / memory / disk | `2 / 2048 / 40` |
| Bandwidth | `10` |

## Lifecycle mapping

| Action | API |
|---|---|
| Create | `POST /api/client/create/:hs_name` |
| Renew | `PUT /api/client/update/...` |
| Suspend | power off |
| Unsuspend | power on |
| Terminate | `DELETE /api/client/delete/...` |

## Verify

- [ ] module visible
- [ ] settings save
- [ ] order creates an instance
- [ ] console button works
- [ ] termination reclaims the instance

## Common issues

| Symptom | Fix |
|---|---|
| 401 | wrong or rotated token |
| 404 | `host_name` mismatch |
| Console fails | open 6080 / configure proxy |
