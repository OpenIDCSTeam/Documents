# Tools overview

Two clients, one capability model.

| Tool | Form | Best for |
|---|---|---|
| **opidcs CLI** | Linux / macOS / Windows | automation, scripting, headless servers |
| **opidcs Desktop** | Tauri app | daily operations, multiple controllers |

Both call the controller REST API. Local privileged actions (service install, platform runtime, token reset) go through the bundled `opidcs` sidecar.

## Capability matrix

| Capability | CLI | Desktop |
|---|---|---|
| Controller install/start/update | `opidcs core` | sidecar |
| Platform runtime | `opidcs plat` | yes |
| Hosts | `opidcs host` | yes |
| Instances & power | `opidcs vm` | yes |
| Port forwarding | `opidcs port` | yes |
| Reverse proxy | `opidcs webx` | yes |
| Users / tasks / logs | yes | yes |
| Settings / token | `opidcs conf` | yes |
| Multiple controllers | `--core` | switcher |

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh
```

```powershell
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.ps1 | iex
```

## Conventions

- One command table drives `--help`, the interactive menu, and this documentation.
- Config is stored in `~/.config/opidcs/config.yaml` (0600).
- Tokens are masked unless `--show-secret`.
- Every command supports `--output json` and returns non-zero exit codes on failure.
