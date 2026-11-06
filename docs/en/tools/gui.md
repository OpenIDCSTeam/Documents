# opidcs Desktop

A Tauri desktop client for daily management, sharing the same capability model as the CLI.

## Architecture

| Layer | Tech | Role |
|---|---|---|
| Shell | Tauri v2 (Rust) | window, tray, updater, local credential file |
| UI | React 18 + TypeScript + Vite | pages and interactions |
| Privileged ops | bundled `opidcs` sidecar | service/platform install, local token reset |
| Remote ops | controller REST API | hosts, instances, network, users, tasks |

## Layout

```text
Sidebar: Overview · Hosts · Instances · Port forwarding · Reverse proxy
         Users · Tasks · Logs · Settings
Top bar: controller switcher · connection state · search · settings
```

## Multiple controllers

- Add controller name, URL and token; test connectivity before saving.
- Tokens are stored in `cores.json` under the app config directory (mode 0600), never logged.
- Default controller and quick switching; offline state is visible.

## Pages

| Page | Capabilities |
|---|---|
| Overview | counts, resource charts, recent tasks |
| Hosts | list, status, create/edit, scan |
| Instances | power, detail, console, screenshot, backup |
| Port forwarding | rules, create/delete |
| Reverse proxy | domains, upstream, certificate state |
| Users | list, quotas, enable/disable, reset password |
| Tasks | progress, cancel, retry |
| Logs | level filter, keyword, export |
| Settings | ports, token, admin password, updates |

## Packaging

| OS | Format | Tool |
|---|---|---|
| Windows | `.exe` setup | Tauri NSIS (pipeline default) + Inno Setup script `packaging/windows/opidcs.iss` |
| Linux | `.AppImage` | `tauri build --bundles appimage` |
| macOS | `.app` / `.dmg` | `tauri build --bundles app,dmg` |

Auto-update is wired through `tauri-plugin-updater` with a `latest.json` from Releases. The pipeline currently sets `createUpdaterArtifacts` to `false` so builds succeed without secrets; add the signing key (public key in `tauri.conf.json`, private key in GitHub Secrets) and enable it to ship signed updates.
