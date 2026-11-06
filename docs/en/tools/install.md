# Install & update

## CLI

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh
```

```powershell
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.ps1 | iex
```

The installer detects OS/arch, downloads to `~/.local/bin` (or `%LOCALAPPDATA%\opidcs\bin`), updates PATH, installs shell completion, and prints `opidcs version`.

```bash
# pinned version / custom dir
curl -fsSL .../opidcs-install.sh | sh -s -- --version v1.0.0 --dir /usr/local/bin

# offline
curl -fsSL .../opidcs-install.sh | sh -s -- --file ./opidcs-linux-amd64
```

## Desktop

| OS | File |
|---|---|
| Windows | `opidcs-<ver>-win-x64-setup.exe` |
| Linux | `opidcs-<ver>-x86_64.AppImage` |
| macOS | `opidcs-<ver>.dmg` |

```bash
chmod +x opidcs-1.0.0-x86_64.AppImage
./opidcs-1.0.0-x86_64.AppImage
```

## Update

```bash
opidcs update
opidcs version
```

Desktop checks from Settings → About, or automatically via the updater plugin.

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

```powershell
Get-FileHash .\opidcs-windows-amd64.exe -Algorithm SHA256
```

## Restricted networks

```bash
export OPIDCS_MIRROR=https://mirror.example.com/opidcs
opidcs update
```
