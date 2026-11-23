# Install & update

## Channels

| Channel | Trigger | Release tag | Notes |
|---|---|---|---|
| `stable` | push `v*` tag | `v1.2.3` | `/releases/latest` |
| `beta` | push to `main` | `beta` (rolling) | assets replaced on every build |

Beta assets always live at:

```text
https://github.com/OpenIDCSTeam/CloudHost/releases/download/beta/<file>
```

## CLI

```bash
# stable
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/quickidc-install.sh | sh

# beta
curl -fsSL .../quickidc-install.sh | sh -s -- --channel beta

# pinned version / custom dir / offline
curl -fsSL .../quickidc-install.sh | sh -s -- --version 1.2.3 --dir /usr/local/bin
curl -fsSL .../quickidc-install.sh | sh -s -- --file ./quickidc-linux-amd64
```

```powershell
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/quickidc-install.ps1 | iex
.\quickidc-install.ps1 -Channel beta
```

The installer detects OS/arch, installs to `~/.local/bin` (or `%LOCALAPPDATA%\quickidc\bin`), updates PATH, adds shell completion and prints the version.

| Env | Description |
|---|---|
| `OPIDCS_REPO` | repository, default `OpenIDCSTeam/CloudHost` |
| `OPIDCS_DOWNLOAD_BASE` | mirror prefix, requests `<base>/<tag>/<asset>` |

## Desktop

| OS | File | Packaging |
|---|---|---|
| Windows | `quickidc-<ver>-win-x64-setup.exe` | Inno Setup (GUI + `bin\quickidc.exe` CLI) |
| Linux | `quickidc_<ver>_amd64.AppImage` | Tauri AppImage |
| macOS | `quickidc_<ver>_aarch64.dmg`, `quickidc_<ver>_x64.dmg` | Tauri app + dmg, plus a zipped `.app` |

For beta builds `<ver>` is `0.0.<run>` and files live under `releases/download/beta/`.

```bash
chmod +x quickidc_0.0.123_amd64.AppImage
./quickidc_0.0.123_amd64.AppImage
```

## Update

```bash
quickidc update                 # stable
quickidc update --channel beta  # beta
quickidc update --check
quickidc version
```

Desktop builds check from Settings → About; auto-update requires signing secrets in CI.

## Uninstall

```bash
quickidc uninstall
quickidc core uninstall          # keep data
quickidc core uninstall --purge  # delete data
```

Config directories: `~/.config/quickidc`, `~/Library/Application Support/quickidc`, `%APPDATA%\quickidc`.

## Verify checksums

```bash
sha256sum -c checksums.txt --ignore-missing
```

Beta builds replace assets and regenerate `checksums.txt` on every run.
