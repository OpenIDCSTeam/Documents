# Monitoring & logs

## Controller metrics

```text
GET /api/system/statis    aggregate counts
GET /api/system/stats     resource usage
```

Data comes from live driver queries with cache fallback when a host is unreachable.

## Instance monitoring

Instance detail shows state, uptime, CPU/memory/disk/network charts (platform dependent), recent tasks and a screenshot thumbnail. Missing samples render as "—" rather than fabricated values.

## Logs

| Level | Destination | Purpose |
|---|---|---|
| Console | stdout | foreground debugging |
| File | `logs/` | long-term archive |
| Database | SQLite | console search |

```text
GET  /api/system/logger/detail
GET  /api/system/logger/stats
POST /api/system/logger/clear
```

```bash
./hostagent --log-level info --log-file-level debug --log-db-level info
```

## Alerting

There is no built-in alert center. Recommended:

1. Prometheus + node_exporter on hosts with Alertmanager.
2. Poll `GET /api/system/stats` through `opidcs` from an external checker.
3. Watch `opidcs logs list --level error`.

::: tip Keep an independent monitor
If the panel is down, panel-based alerts are down too. Keep a host-level monitor for production.
:::
