# Billing integration overview

Plugins live in `CloudHost/plugins/` and are versioned with the controller.

## Plugins

| Plugin | Target | Entry |
|---|---|---|
| `OpenIDC-IDCSmart` | IDCSmart | `idcserver.php` |
| `LxdServer-IDCSmart` | IDCSmart (LXD) | `lxdserver.php` |
| `OpenIDC-SwapIDC` | SwapIDC | `openidc.php` |
| `Easypanel-SwapIDC` | EasyPanel | `easypanel.php` |
| `VistaPanel-SwapIDC` | VistaPanel | `VistaPanel.php` |
| `OpenIDC-XiaoHei` | XiaoHei | **not shipped** |

## Preparation

1. Controller deployed and able to create instances.
2. At least one online host (`hs_name`).
3. HTTPS enabled.
4. Bearer token:

```bash
opidcs conf token show --core 0
```

## Flow

```mermaid
flowchart LR
    A[Upload plugin] --> B[Enable module]
    B --> C[Controller URL + token]
    C --> D[Select hs_name]
    D --> E[Configure product]
    E --> F[Test order]
    F --> G[Instance created]
```

## Security

- HTTPS only.
- Never expose the plugin directory listing.
- A token equals controller admin rights; rotate and update every plugin.
- Restrict callback source IPs.

## Pages

- [IDCSmart](/en/deploy/finance/idcsmart)
- [LxdServer](/en/deploy/finance/lxdserver-idcsmart)
- [SwapIDC](/en/deploy/finance/swapidc)
- [Easypanel](/en/deploy/finance/easypanel-swapidc)
- [VistaPanel](/en/deploy/finance/vistapanel-swapidc)
- [XiaoHei (planned)](/en/deploy/finance/xiaohei)
