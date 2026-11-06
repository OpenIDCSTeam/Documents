# opidcs Desktop

A Tauri desktop client for daily management, sharing the same capability model as the CLI.

## Architecture

| Layer | Tech | Role |
|---|---|---|
| Shell | Tauri v2 (Rust) | window, tray, updater, keychain |
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
- Tokens go to the OS keychain (Credential Manager / Keychain / libsecret).
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
| Windows | `.exe` setup | Inno Setup (`packaging/windows/opidcs.iss`) |
| Linux | `.AppImage` | `tauri build --bundles appimage` |
| macOS | `.app` / `.dmg` | `tauri build --bundles app,dmg` |

Auto-update uses `tauri-plugin-updater` with a signed `latest.json` from Releases.
