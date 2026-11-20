# VistaPanel-SwapIDC integration

`VistaPanel-SwapIDC` targets VistaPanel.

## Layout

```text
plugins/VistaPanel-SwapIDC/
├── VistaPanel.php
├── clientarea.tpl
├── version
└── lang/Chinese.php
```

## Install

```bash
cp -r plugins/VistaPanel-SwapIDC /path/to/vistapanel/mods/server/openidc
chown -R www-data:www-data /path/to/vistapanel/mods/server/openidc
```

## Configuration

| Field | Example |
|---|---|
| Controller URL | `https://idc.example.com` |
| Token | Bearer token |
| `host_name` | `lxd-edge` |
| Image | `debian12` |
| Specs | `1 / 1024 / 20` |

## Differences from Easypanel

| Item | Easypanel | VistaPanel |
|---|---|---|
| Entry | `easypanel.php` | `VistaPanel.php` |
| Adapter | EasyPanel API | VistaPanel API |

## Verify

- [ ] module enabled
- [ ] order creates instance
- [ ] console entry works
- [ ] deletion reclaims resources
