# Repositories & stack

| Repository | Role | Stack | Artifact |
|---|---|---|---|
| `CloudHost` | controller + plugins | Go, Gin, SQLite, Cobra | single binary, installers |
| `FrontPage` | web console | React, TypeScript, Vite, Ant Design | static site bundled into `static/` |
| `CloudInit` | in-guest agent | Go | `cloudinit` binary |
| `Documents` | documentation | VitePress, Vue 3 | static site |
| `XiaoheiFS` | separate business system | Go + React + Flutter | independent |

Financial plugins now live in `CloudHost/plugins/`.

## Stack

```mermaid
graph LR
    FP[FrontPage] --> CH[CloudHost]
    GUI[opidcs Desktop] --> CH
    CH --> DB[(SQLite)]
    CH --> CD[Caddy]
    CH --> VNC[noVNC 6080]
    CH --> SSH[Web SSH 7681]
    CH --> P[Platforms]
```

## Controller layout

```text
CloudHost/
├── cmd/{server,opidcs}
├── internal/{api,auth,data,driver,model,scheduler,security,service,task}
├── pkg/{utils,validator}
├── static/            # frontend build
├── VNCConsole/        # noVNC
├── packaging/         # Inno / pkg
├── plugins/           # billing modules
└── scripts/
```

## Ports

| Port | Process | Purpose |
|---|---|---|
| 1881 | hostagent | HTTP + API + static |
| 6080 | hostagent | VNC proxy |
| 7681 | hostagent | Web SSH |
| 2019 | caddy | Admin API (local) |

## Data

| Data | Location |
|---|---|
| Database | `<data-dir>/data.db` (SQLite, WAL) or external MySQL / PostgreSQL |
| Caddyfile | `<data-dir>/Caddyfile` |
| Logs | `<data-dir>/logs/` |

## Related

- [Architecture](/en/structure/architecture)
- [API overview](/en/structure/api)
