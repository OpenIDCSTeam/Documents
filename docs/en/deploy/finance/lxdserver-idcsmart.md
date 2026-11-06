# LxdServer-IDCSmart integration

LXD-specific module for IDCSmart, sharing the controller API with the generic version.

## Layout

```text
plugins/LxdServer-IDCSmart/
├── lxdserver.php
└── templates/{info,ipv6,nat,proxy}.html
```

::: info No ipv4.html
The LXD variant merges IPv4 information into `info.html`.
:::

## Install

```bash
cp -r plugins/LxdServer-IDCSmart /path/to/idcsmar/modules/server/lxdserver
chown -R www-data:www-data /path/to/idcsmar/modules/server/lxdserver
```

## Configuration

| Field | Example |
|---|---|
| `host_name` | `lxd-edge` |
| Controller URL | `https://idc.example.com` |
| Token | `6f1c…` |
| Image | `debian12` |
| CPU / memory / disk | `2 / 2048 / 40` |
| Network | `lxdbr0` |

## Differences from the generic module

| Item | Generic | LXD |
|---|---|---|
| Entry | `idcserver.php` | `lxdserver.php` |
| Templates | includes `ipv4.html` | no `ipv4.html` |
| Platform | any | LXD focus |

## Verify

- [ ] instance created in LXD
- [ ] IP correct
- [ ] noVNC opens
- [ ] delete reclaims NAT rules
