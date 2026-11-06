# Dashboard

The default page after login: platform health, resource usage and recent failures.

## Sections

| Block | Content | API |
|---|---|---|
| Top metrics | hosts, instances, running, users | `GET /api/system/statis` |
| Resource cards | CPU / memory / disk / traffic | `GET /api/system/stats` |
| Trend chart | last 24h (sampling dependent) | same |
| Recent tasks | last 10 tasks | `GET /api/tasks` |
| Alerts | offline hosts, failed tasks, abnormal instances | aggregate |

## Reading the numbers

- **Hosts online**: live probe result; offline is red.
- **Instances running**: platform state, not desired state.
- **CPU / memory**: host level; compare allocated vs physical.
- **Traffic**: per-instance cumulative, reset monthly (configurable).

::: tip Numbers disagree?
Check host connectivity first, then failed tasks. Aggregates fall back to cache when a host is offline.
:::

## Shortcuts

- Click a host card to open it.
- Click the instance count to filter the list.
- Click a failed task to open details.
- Switch range: 1h / 24h / 7d.

## User view

The user dashboard shows only own instances and quota:

| Metric | Description |
|---|---|
| My instances | running / stopped / total |
| Quota usage | CPU / memory / disk / traffic |
| Expiry | instances nearing expiry (if billing is used) |
