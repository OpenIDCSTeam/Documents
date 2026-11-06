# Install CloudHost

CloudHost is a single binary listening on `1881` with data in `./DataSaving`. The first start generates a Bearer Token and creates the admin account (initial password = token).

::: tip Section maintained by the project owner
Distribution-specific notes and the mirror downloads will be expanded by the maintainer. The commands below match the current code.
:::

## One-liner (Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/install.sh | sudo bash
```

Requirements: root, systemd, access to GitHub Releases.

### Flags

| Flag | Description | Default |
|---|---|---|
| `--version, -v` | release version | latest |
| `--port, -p` | HTTP port | `1881` |
| `--dir` | install directory | `/opt/openidcs` |
| `--data-dir` | data directory | `/var/lib/openidcs` |
| `--file, -f` | offline archive | — |
| `--firewall` | open 1881/6080/7681 | off |
| `--uninstall` | remove service and files | — |
| `--purge` | also delete data | off |

```bash
sudo bash install.sh --version v1.0.0 --port 1881
sudo bash install.sh --file ./hostagent-linux-amd64.tar.gz --firewall
sudo bash install.sh --uninstall
```

Service management:

```bash
systemctl status openidcs
systemctl restart openidcs
journalctl -u openidcs -f
```

## Windows

Download `OpenIDCS-HostAgent-<ver>-win-x64-setup.exe`:

- Program: `C:\Program Files\OpenIDCS\HostAgent`
- Service: `OpenIDCS-HostAgent` (NSSM, LocalSystem, auto-start)
- Data: `C:\ProgramData\OpenIDCS\HostAgent\DataSaving`
- Optional firewall rules for 1881/6080/7681

A portable `hostagent-windows-amd64.zip` is also available.

## macOS

```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 \
  go build -trimpath -ldflags "-s -w" -o dist/hostagent-darwin-arm64 ./cmd/server
./packaging/macos/build-pkg.sh 1.0.0 arm64
sudo installer -pkg BuildCache/OpenIDCS-HostAgent-1.0.0-macos-arm64.pkg -target /
```

The macOS job in the release workflow is commented out by default.

## Build from source

```bash
git clone https://github.com/OpenIDCSTeam/CloudHost.git
cd CloudHost
go mod download
go build -o hostagent ./cmd/server
./hostagent --port 1881 --data-dir ./DataSaving
```

| Flag | Default |
|---|---|
| `--port` | 1881 |
| `--data-dir` | ./DataSaving |
| `--log-level` | info |
| `--log-file-level` | debug |
| `--log-db-level` | info |

::: warning No CGO needed
SQLite uses the pure-Go `modernc.org/sqlite` driver. gcc/MinGW is not required.
:::

## First login

1. Open `http://<ip>:1881`.
2. User `admin`, password = the 64-char hex Bearer token.
3. Reset the token and change the admin password immediately.

```bash
journalctl -u openidcs | grep -i token
```

## Release artifacts

| Artifact | Contents |
|---|---|
| `hostagent-linux-amd64.tar.gz` | binary + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | same for arm64 |
| `hostagent-windows-amd64.zip` | portable zip |
| `OpenIDCS-HostAgent-<ver>-win-x64-setup.exe` | Windows service installer |
