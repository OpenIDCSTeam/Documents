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
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh

# beta
curl -fsSL .../opidcs-install.sh | sh -s -- --channel beta

# pinned version / custom dir / offline
curl -fsSL .../opidcs-install.sh | sh -s -- --version 1.2.3 --dir /usr/local/bin
curl -fsSL .../opidcs-install.sh | sh -s -- --file ./opidcs-linux-amd64
```

```powershell
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.ps1 | iex
.\opidcs-install.ps1 -Channel beta
```

The installer detects OS/arch, installs to `~/.local/bin` (or `%LOCALAPPDATA%\opidcs\bin`), updates PATH, adds shell completion and prints the version.

| Env | Description |
|---|---|
| `OPIDCS_REPO` | repository, default `OpenIDCSTeam/CloudHost` |
| `OPIDCS_DOWNLOAD_BASE` | mirror prefix, requests `<base>/<tag>/<asset>` |

## Desktop

| OS | File | Packaging |
|---|---|---|
| Windows | `opidcs-<ver>-win-x64-setup.exe` | Inno Setup (GUI + `bin\opidcs.exe` CLI) |
| Linux | `opidcs_<ver>_amd64.AppImage` | Tauri AppImage |
| macOS | `opidcs_<ver>_aarch64.dmg`, `opidcs_<ver>_x64.dmg` | Tauri app + dmg, plus a zipped `.app` |

For beta builds `<ver>` is `0.0.<run>` and files live under `releases/download/beta/`.

```bash
chmod +x opidcs_0.0.123_amd64.AppImage
./opidcs_0.0.123_amd64.AppImage
```

## Update

```bash
opidcs update                 # stable
opidcs update --channel beta  # beta
opidcs update --check
opidcs version
```

Desktop builds check from Settings → About; auto-update requires signing secrets in CI.

## Uninstall

```bash
opidcs uninstall
opidcs core uninstall          # keep data
opidcs core uninstall --purge  # delete data
```

Config directories: `~/.config/opidcs`, `~/Library/Application Support/opidcs`, `%APPDATA%\opidcs`.

## Verify checksums

```bash
sha256sum -c checksums.txt --ignore-missing
```

Beta builds replace assets and regenerate `checksums.txt` on every run.
