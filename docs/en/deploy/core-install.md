# Install CloudHost

CloudHost is a single binary listening on `1881` with data in `./data` (legacy `DataSaving` is migrated automatically). The first start generates `data/data.yaml` and a Bearer Token, then creates the admin account (initial password = token).

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
- Data: `C:\ProgramData\OpenIDCS\HostAgent\data` (logs in `data\logs`)
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
./hostagent --data-dir ./data
```

| Flag | Default |
|---|---|
| `--port` | 1881 (overrides `data.yaml`) |
| `--data-dir` | ./data |
| `--log-level` | info |
| `--log-file-level` | debug |
| `--log-db-level` | info |

::: warning No CGO needed
SQLite uses the pure-Go `modernc.org/sqlite` driver. MySQL and PostgreSQL drivers are pure Go too, so `CGO_ENABLED=0` cross-compiles fine.
:::

## Data directory and data.yaml

```text
data/
├── bins/        # external binaries (caddy, ...)
├── logs/        # hostagent.log and per-host logs
├── temp/        # Caddyfile, backups, temporary files
├── data.db      # SQLite database (absent when using MySQL/PostgreSQL)
└── data.yaml    # runtime configuration
```

`data.yaml` covers ports, VNC/SSH ports, database and log levels:

```yaml
server:
  port: 1881
  vnc_port: 6080
  ssh_port: 7681
database:
  driver: sqlite          # sqlite | mysql | postgres
  sqlite:
    file: data.db
  mysql:
    host: 127.0.0.1
    port: 3306
    user: openidcs
    password: ""
    database: openidcs
  postgres:
    host: 127.0.0.1
    port: 5432
    user: openidcs
    password: ""
    database: openidcs
    sslmode: disable
log:
  console: info
  file: debug
  db: info
```

- Port precedence: `--port` > `data.yaml` > 1881.
- Legacy `DataSaving/` is migrated on first start (database, logs, Caddyfile, backups, key); the old directory is kept.
- See [multi-database support](/en/features/database) before switching engines.

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
