# Tools overview

Two clients, one capability model.

| Tool | Form | Best for |
|---|---|---|
| **quickidc CLI** | Linux / macOS / Windows | automation, scripting, headless servers |
| **quickidc Desktop** | Tauri app | daily operations, multiple controllers |

Both call the controller REST API. Local privileged actions (service install, platform runtime, token reset) go through the bundled `quickidc` sidecar.

## Capability matrix

| Capability | CLI | Desktop |
|---|---|---|
| Controller install/start/update | `quickidc core` | sidecar |
| Platform runtime | `quickidc plat` | yes |
| Hosts | `quickidc host` | yes |
| Instances & power | `quickidc vm` | yes |
| Port forwarding | `quickidc port` | yes |
| Reverse proxy | `quickidc webx` | yes |
| Users / tasks / logs | yes | yes |
| Settings / token | `quickidc conf` | yes |
| Multiple controllers | `--core` | switcher |

## Install

```bash
curl -fsSL https://idcgit.opkg.cn/quickidc-install.sh | sh
```

```powershell
irm https://idcgit.opkg.cn/quickidc-install.ps1 | iex
```

## Conventions

- One command table drives `--help`, the interactive menu, and this documentation.
- Config is stored in `~/.config/quickidc/config.yaml` (0600).
- Tokens are masked unless `--show-secret`.
- Every command supports `--output json` and returns non-zero exit codes on failure.
