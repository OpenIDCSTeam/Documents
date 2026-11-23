# quickidc CLI

`quickidc` covers controller, platforms, hosts, instances, networking, users, tasks, logs and settings.

## Setup

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/quickidc-install.sh | sh
quickidc core install
quickidc host list
```

```bash
quickidc host add --name prod --addr https://idc.example.com --token <TOKEN>
```

## Global flags

| Flag | Description |
|---|---|
| `--core <name\|index>` | saved controller |
| `--url <url>` | override URL |
| `--token <token>` | override token |
| `--output table\|json\|yaml` | output format |
| `--data-dir <path>` | controller data directory (auto-detects `/var/lib/quickidc` and the Windows install path) |
| `--yes` | skip confirmation |
| `--show-secret` | reveal tokens |

Config: `~/.config/quickidc/config.yaml` (0600). The controller-side `data/data.yaml` is located via `--data-dir` / `OPIDCS_DATA_DIR`.

```yaml
default: local
cores:
  - name: local
    url: http://127.0.0.1:1881
    token: "******"
```

## Commands

```bash
# controller
quickidc core install|uninstall|enable|disable|start|stop|restart|status|update

# platforms
quickidc plat list|install|uninstall|show|status
quickidc plat credentials show|reset <name>

# hosts
quickidc host list|add|show|status|enable|disable|del|scanvm|scanbackup|export|import

# instances (vbox is an alias)
quickidc vm list|show|detail|add|del
quickidc vm power start|stop|restart|on|off|reset|pause|resume <uuid>

# network
quickidc port list|add|del
quickidc webx list

# accounts and operations
quickidc user list
quickidc logs list
quickidc task list|cancel

# settings
quickidc conf db show|set          # driver, host, credentials (masked)
quickidc conf port show|set
quickidc conf token show|reset
quickidc conf admin reset

# self
quickidc version|update|uninstall
```

Running `quickidc` with no arguments opens an interactive menu backed by the same command table.

## Scripting

```bash
quickidc host list --output json | jq '.[] | .name'

quickidc vm list --host pve-lab --output json \
  | jq -r '.[] | select(.status=="stopped") | .uuid' \
  | xargs -I{} quickidc vm power start {}
```

## Exit codes

| Code | Meaning |
|---|---|
| 0 | success |
| 1 | general error |
| 2 | bad arguments |
| 3 | authentication failed |
| 4 | not found |
| 5 | controller unreachable |
