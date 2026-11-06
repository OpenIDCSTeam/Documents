# API overview

REST API under `/api`, used by the console, CLI, plugins and your scripts.

## Conventions

| Item | Value |
|---|---|
| Base URL | `http(s)://<host>:1881/api` |
| Auth | `Authorization: Bearer <token>` or session |
| CSRF | `X-CSRF-Token` on writes |
| Encoding | JSON / UTF-8 |
| Errors | often HTTP 200 with non-200 `code` |

## Envelope

```json
{
  "code": 200,
  "msg": "成功",
  "data": {},
  "timestamp": 1730000000
}
```

| Code | Meaning |
|---|---|
| 200 | success |
| 400 | bad request |
| 401 | unauthenticated |
| 403 | forbidden / CSRF |
| 404 | not found |
| 500 | server error |

::: warning
Do not rely on the HTTP status alone; check `code`.
:::

## Example

```bash
BASE=https://idc.example.com
TOKEN=6f1c...
CSRF=$(curl -s $BASE/api/csrf-token | jq -r .csrf_token)

curl -s $BASE/api/server/detail -H "Authorization: Bearer $TOKEN"

curl -s -X POST $BASE/api/client/powers/pve-lab/<uuid> \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d '{"action":"start"}'
```

## Groups

| Group | Prefix |
|---|---|
| Auth & users | `/api/users`, `/api/login` |
| System | `/api/system/*`, `/api/token/*` |
| Hosts | `/api/server/*` |
| Instances | `/api/client/*` |
| Network | `/api/client/nat*`, `/api/client/proxys/*`, `/api/admin/proxys/*` |
| Storage / backup | `/api/client/{isos,hdd,backup}/*` |
| Tasks | `/api/tasks`, `/api/system/async_task/*` |
| Maintenance | `/api/system/{outbox,tombstone}/*` |

Full endpoint list: see the Chinese [API 概览](/structure/api) (same paths).
