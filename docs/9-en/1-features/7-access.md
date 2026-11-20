# Sharing & access keys

Instance-level access control is built from **ownership**, **shares** and **access keys**. There is no RBAC layer.

## Ownership

- Every instance has exactly one owner.
- Owners see their instances in the user area.
- Transfer:

```text
POST /api/client/owners/:hs_name/:vm_uuid/transfer
```

## Shares

```text
GET    /api/client/owners/:hs_name/:vm_uuid
POST   /api/client/owners/:hs_name/:vm_uuid
DELETE /api/client/owners/:hs_name/:vm_uuid
PUT    /api/client/owners/:hs_name/:vm_uuid/permission
```

| Permission | Capability |
|---|---|
| read-only | view status and monitoring |
| console | read-only + VNC/SSH |
| manage | console + power operations (no delete/reinstall) |

Shares never expose host credentials, other instances, or system settings.

## Temporary tokens

```text
GET /api/client/temptoken/:hs_name/:vm_uuid
```

Short-lived, bound to the instance and source IP. Login endpoint: `/api/client/templogin`.

## Access keys

```text
GET    /api/client/access-key/:hs_name/:vm_uuid
POST   /api/client/access-key/:hs_name/:vm_uuid
DELETE /api/client/access-key/:hs_name/:vm_uuid
```

- 16-character long-lived credential.
- Login endpoint: `/api/client/keylogin`.
- Same capabilities as a temporary token.
- Revoke immediately when sharing ends.

## Recommendations

1. Show the key only once.
2. Never paste it into tickets or chat.
3. Remove shares before revoking keys when offboarding.
4. Keep the admin token separate from user passwords.
