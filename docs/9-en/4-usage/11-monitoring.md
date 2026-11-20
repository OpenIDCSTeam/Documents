# Monitoring

## Instance monitoring

Instance detail → Monitoring: CPU, memory, disk IO, network, uptime. Sampling depends on the platform.

## Host monitoring

Host detail shows allocated vs physical CPU/memory, instance distribution and storage usage.

## Alerting

No built-in alert center. Recommended:

1. node_exporter + Prometheus + Alertmanager on hosts.
2. Poll `GET /api/system/stats` through `opidcs` from an external checker.
3. Watch error logs.

```bash
opidcs logs list --level error --limit 50 --output json | jq 'length > 0'
```

## Metric definitions

| Metric | Definition |
|---|---|
| Host online | last probe succeeded |
| Instance running | live platform state |
| CPU allocation | sum of instance vCPU |
| Memory allocation | sum of instance memory |
| Disk allocation | system + data disks |

::: tip Oversubscription
Allocated/physical above 1 means oversubscription. CPU oversubscription is common; memory oversubscription risks OOM.
:::
