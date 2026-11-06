# Billing integration

Billing plugins connect a storefront to the controller: a customer pays, the plugin calls the API to create an instance, and returns console access.

## Plugins

| Plugin | Target | Directory |
|---|---|---|
| `OpenIDC-IDCSmart` | IDCSmart | `plugins/OpenIDC-IDCSmart` |
| `LxdServer-IDCSmart` | IDCSmart (LXD) | `plugins/LxdServer-IDCSmart` |
| `OpenIDC-SwapIDC` | SwapIDC | `plugins/OpenIDC-SwapIDC` |
| `Easypanel-SwapIDC` | EasyPanel | `plugins/Easypanel-SwapIDC` |
| `VistaPanel-SwapIDC` | VistaPanel | `plugins/VistaPanel-SwapIDC` |

::: warning XiaoHei
`OpenIDC-XiaoHei` is **not shipped**. The plugin directory does not exist; treat it as planned.
:::

## Integration model

```text
Billing system → PHP module → CloudHost REST API → virtualization platform
```

Required:

1. Controller URL (HTTPS).
2. Bearer token (`System settings → Token` or `opidcs conf token show`).
3. Host identifier (`hs_name`).

## Common operations

| Action | Controller API |
|---|---|
| Create | `POST /api/client/create/:hs_name` |
| Renew | `PUT /api/client/update/:hs_name/:uuid` |
| Suspend | `POST /api/client/powers/:hs_name/:uuid` |
| Unsuspend | same, `start` |
| Delete | `DELETE /api/client/delete/:hs_name/:uuid` |
| Console | `GET /api/client/templogin` |

## Security

- HTTPS only.
- Rotate tokens and update every plugin afterwards.
- Never expose the plugin directory to the public.
- Restrict source IPs at the network layer.
