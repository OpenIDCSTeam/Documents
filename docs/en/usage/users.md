# Users

Admins manage users at `/users`; users maintain their profile at `/profile`.

## List

Columns: username, email, role, status, instance count, quota, actions.

## Create

| Field | Required |
|---|---|
| Username | yes |
| Password | yes |
| Email | recommended |
| Role | yes (`user` default) |
| Quota | recommended |
| Note | optional |

## Quotas

CPU, memory, disk, instance count, monthly traffic.

- Validated on create/update.
- "Recalculate" fixes drift.
- Lowering quotas does not delete instances.

## Status and passwords

Disable blocks login while keeping instances. Reset password generates or sets a new one.

::: danger Deleting users
Transfer or delete instances first. The default policy blocks deleting users that still own instances.
:::

## User view

Dashboard, instances, port forwarding, reverse proxy, profile.

## CLI

```bash
opidcs user list
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| User sees no instances | check ownership and shares |
| Quota shows 0 | run recalculation |
| No email | check SMTP and spam |
