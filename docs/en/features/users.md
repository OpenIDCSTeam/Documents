# Users & quotas

## User model

| Field | Description |
|---|---|
| `username` | unique login |
| `email` | password recovery |
| `role` | `admin` / `user` only |
| `status` | enabled / disabled |
| quota | CPU, memory, disk, instance count, traffic |

::: warning No RBAC matrix
There is no custom-role or object-level ACL engine. Instance-level access uses ownership, shares and access keys.
:::

## APIs

```text
GET    /api/users/current
GET    /api/users                 admin
POST   /api/users                 admin
GET    /api/users/:id             admin
PUT    /api/users/:id             admin
DELETE /api/users/:id             admin
POST   /api/users/change-password
POST   /api/users/change-email
```

## Quotas

- Validated on create/update.
- `POST /api/system/recalculate-quotas` recalculates (admin).
- `limits_nums` caps instances per host.

Calculation:

```text
CPU  = Σ instance vCPU
MEM  = Σ instance memory
DISK = Σ system + data disks
VMs  = instance records (excluding tombstones)
```

## Ownership

- One owner per instance.
- Transfer: `POST /api/client/owners/:hs/:uuid/transfer`.
- Add/remove shares: `POST/DELETE /api/client/owners/:hs/:uuid`.
- Change share permission: `PUT /api/client/owners/:hs/:uuid/permission`.

## Registration and recovery

| Feature | API |
|---|---|
| Register | `POST /api/register` |
| Verify email | `GET /verify_email` |
| Forgot password | `POST /api/forgot-password` |
| Admin reset | `POST /api/system/reset-password` |
