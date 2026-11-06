# Tasks

Task management shows progress, results and errors for async operations.

## List

Columns: task ID, type, resource, status, progress, created, actions.

Filters: status, type, host, time range, keyword.

## Detail

- Step timeline with timings.
- Raw platform error.
- Related resource links.
- Retry for idempotent tasks.
- Cancel for running tasks.

## Types

| Type | Idempotent |
|---|---|
| create | no |
| delete | yes (tombstone) |
| reinstall | no |
| backup | yes |
| restore | no (overwrites) |
| sync / scan | yes |

## Stuck tasks

1. Read the last step and error.
2. Check host connectivity.
3. Check whether the platform already has the resource.
4. Cancel if possible, then retry.
5. Deletion failures converge through reconciliation.

::: tip
Do not blindly retry non-idempotent tasks; you may duplicate resources.
:::

## CLI

```bash
opidcs task list
opidcs task list --status running
opidcs task cancel <task-id>
```
