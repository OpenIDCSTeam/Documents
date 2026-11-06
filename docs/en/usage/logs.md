# Logs

Search controller logs: logins, API calls, tasks and platform errors.

## List

Columns: time, level, module, message, actions.

## Filters

Level, keyword, time range, host, instance.

## Levels

```bash
./hostagent --log-level info --log-file-level debug --log-db-level info
```

| Output | Flag | Use |
|---|---|---|
| Console | `--log-level` | foreground debugging |
| File | `--log-file-level` | archive |
| Database | `--log-db-level` | console search |

::: tip Production
Keep database logging at `info`; `debug` grows quickly and slows search.
:::

## Clear

`POST /api/system/logger/clear` (admin) or automatic retention. File logs are unaffected.

## Useful queries

```text
level = ERROR, last 1h, keyword = create
level = WARNING, keyword = timeout
host = pve-lab, keyword = vzdump
```

## CLI

```bash
opidcs logs list --level error --limit 100
opidcs logs list --host pve-lab --output json
```
