# opidcs CLI

`opidcs` covers controller, platforms, hosts, instances, networking, users, tasks, logs and settings.

## Setup

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh
opidcs core install
opidcs host list
```

```bash
opidcs host add --name prod --addr https://idc.example.com --token <TOKEN>
```

## Global flags

| Flag | Description |
|---|---|
| `--core <name\|index>` | saved controller |
| `--url <url>` | override URL |
| `--token <token>` | override token |
| `--output table\|json\|yaml` | output format |
| `--data-dir <path>` | controller data directory (auto-detects `/var/lib/openidcs` and the Windows install path) |
| `--yes` | skip confirmation |
| `--show-secret` | reveal tokens |

Config: `~/.config/opidcs/config.yaml` (0600). The controller-side `data/data.yaml` is located via `--data-dir` / `OPIDCS_DATA_DIR`.

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
opidcs core install|uninstall|enable|disable|start|stop|restart|status|update

# platforms
opidcs plat list|install|uninstall|show|status
opidcs plat credentials show|reset <name>

# hosts
opidcs host list|add|show|status|enable|disable|del|scanvm|scanbackup|export|import

# instances (vbox is an alias)
opidcs vm list|show|detail|add|del
opidcs vm power start|stop|restart|on|off|reset|pause|resume <uuid>

# network
opidcs port list|add|del
opidcs webx list

# accounts and operations
opidcs user list
opidcs logs list
opidcs task list|cancel

# settings
opidcs conf db show|set          # driver, host, credentials (masked)
opidcs conf port show|set
opidcs conf token show|reset
opidcs conf admin reset

# self
opidcs version|update|uninstall
```

Running `opidcs` with no arguments opens an interactive menu backed by the same command table.

## Scripting

```bash
opidcs host list --output json | jq '.[] | .name'

opidcs vm list --host pve-lab --output json \
  | jq -r '.[] | select(.status=="stopped") | .uuid' \
  | xargs -I{} opidcs vm power start {}
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
