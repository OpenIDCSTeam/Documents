# Qingzhou Cloud (disabled)

The Qingzhou driver remains in the repository but `Enabled: false`, so it never appears in `GET /api/system/engine`.

## Why keep it

- Historical records may still exist.
- The driver implementation is complete.
- Behavior matches the legacy Python version.

## Enabling

1. Set `Enabled: true` for `QingzhouYun` in `internal/driver/engine_config.go`.
2. Rebuild and redeploy the controller.
3. Add a host with the API address and credentials.

```go
{
    Type:        "QingzhouYun",
    Description: "QingzhouYun Cloud",
    Enabled:     true, // default false
    IsRemote:    true,
    // ...
}
```

::: warning Unverified
This driver is outside the regular test matrix. Validate create, power, console and delete flows in isolation before production use.
:::

## Alternatives

| Need | Alternative |
|---|---|
| Cloud VMs | Proxmox VE / ESXi / QEMU |
| Containers | Docker / LXD |
| Multi-tenant selling | any enabled platform + billing plugin |
