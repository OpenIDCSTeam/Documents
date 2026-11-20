# Tasks & scheduling

Operations that may exceed HTTP timeouts run as async tasks: create, reinstall, delete, backup, restore, network sync.

## Task model

| Field | Description |
|---|---|
| `task_id` | identifier |
| `type` | create / delete / reinstall / backup / restore / sync |
| `status` | pending / running / success / failed / canceled |
| `progress` | 0–100 |
| `hs_name` / `vm_uuid` | related resource |
| `message` | current step or error |

Tasks run in a worker pool (4 workers by default). Writes to the same instance are serialized.

## APIs

```text
GET  /api/tasks
GET  /api/tasks/stats
GET  /api/tasks/:task_id
POST /api/tasks/:task_id/cancel

GET  /api/system/async_task/list
POST /api/system/async_task/:task_id/retry
```

## Maintenance jobs

| Job | Purpose |
|---|---|
| Host sync | reconcile platform state |
| Orphan cleanup | remove records whose platform resource is gone |
| Quota recalculation | fix usage drift |
| Outbox reconciliation | retry failed operations |
| Screenshot cleanup | delete expired thumbnails |

## Failure handling

1. Inspect the last step and raw error.
2. Check host connectivity.
3. Cancel if possible, then retry.
4. Failed deletions converge through tombstone reconciliation.

::: tip Avoid blind retries
Non-idempotent tasks (create/reinstall) may duplicate resources. Verify platform state first.
:::

## CLI

```bash
opidcs task list --core 0
opidcs task list --status running
```
