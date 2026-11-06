# Easypanel-SwapIDC integration

`Easypanel-SwapIDC` connects EasyPanel billing to the controller.

## Layout

```text
plugins/Easypanel-SwapIDC/
├── easypanel.php
├── clientarea.tpl
├── whm.lib.php
├── version
└── lang/Chinese.php
```

## Install

```bash
cp -r plugins/Easypanel-SwapIDC /path/to/easypanel/mods/server/openidc
chown -R www-data:www-data /path/to/easypanel/mods/server/openidc
```

## Configuration

| Field | Description |
|---|---|
| Endpoint | controller HTTPS URL |
| API token | Bearer token |
| Node id | `hs_name` |
| Image / specs | match controller images |

## Use cases

| Scenario | Description |
|---|---|
| Existing EasyPanel billing | keep billing, controller provides resources |
| Mixed platforms | multiple `hs_name` hosts under one panel |

## Verify

- [ ] module enabled
- [ ] order creates instance
- [ ] user panel shows instance
- [ ] deletion reclaims resources
