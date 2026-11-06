# SwapIDC integration

`OpenIDC-SwapIDC` targets classic SwapIDC installations.

## Layout

```text
plugins/OpenIDC-SwapIDC/
├── openidc.php
├── clientarea.tpl
├── whm.lib.php
├── version
└── lang/Chinese.php
```

## Install

```bash
cp -r plugins/OpenIDC-SwapIDC /path/to/swapidc/mods/server/openidc
chown -R www-data:www-data /path/to/swapidc/mods/server/openidc
```

## Configuration

| Field | Example |
|---|---|
| Node URL | `https://idc.example.com` |
| Node token | Bearer token |
| Node ID / `host_name` | `pve-lab` |
| Image | `debian12` |
| Specs | `2 / 2048 / 40 / 10` |

## Flow

```text
Order → openidc_CreateAccount → POST /api/client/create/:hs_name
      → async task → record vm_uuid → templogin for console
```

## Verify

- [ ] module visible
- [ ] server settings save
- [ ] order creates instance
- [ ] user panel shows IP/console
- [ ] delete reclaims resources

## Common issues

| Symptom | Fix |
|---|---|
| Module missing | directory name / permissions / PHP version |
| 401 | token mismatch |
| 404 | `host_name` mismatch |
