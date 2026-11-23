# Install CloudHost

CloudHost is a single binary listening on `1881` with data in `./data` (legacy `DataSaving` is migrated automatically). The first start generates `data/data.yaml` and an API Bearer token; the admin account and system title are created on the browser initialization page. The token is never used as a web login password.

::: tip Section maintained by the project owner
Distribution-specific notes and the mirror downloads will be expanded by the maintainer. The commands below match the current code.
:::

## One-liner (Linux)

```bash
curl -fsSL https://idcgit.opkg.cn/install.sh | sudo bash
```

Requirements: root, systemd, access to GitHub Releases.

### Flags

| Flag | Description | Default |
|---|---|---|
| `--version, -v` | release version | latest |
| `--port, -p` | HTTP port | `1881` |
| `--dir` | install directory | `/opt/quickidc` |
| `--data-dir` | data directory | `/var/lib/quickidc` |
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
systemctl status quickidc
systemctl restart quickidc
journalctl -u quickidc -f
```

## Windows

Download `QuickIDC-HostAgent-<ver>-win-x64-setup.exe`:

- Program: `C:\Program Files\QuickIDC\HostAgent`
- Service: `QuickIDC-HostAgent` (NSSM, LocalSystem, auto-start)
- Data: `C:\ProgramData\QuickIDC\HostAgent\data` (logs in `data\logs`)
- Optional firewall rules for 1881/6080/7681

A portable `hostagent-windows-amd64.zip` is also available.

## macOS

```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 \
  go build -trimpath -ldflags "-s -w" -o dist/hostagent-darwin-arm64 ./cmd/server
./packaging/macos/build-pkg.sh 1.0.0 arm64
sudo installer -pkg BuildCache/QuickIDC-HostAgent-1.0.0-macos-arm64.pkg -target /
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
    user: quickidc
    password: ""
    database: quickidc
  postgres:
    host: 127.0.0.1
    port: 5432
    user: quickidc
    password: ""
    database: quickidc
    sslmode: disable
log:
  console: info
  file: debug
  db: info
```

- Port precedence: `--port` > `data.yaml` > 1881.
- Legacy `DataSaving/` is migrated on first start (database, logs, Caddyfile, backups, key); the old directory is kept.
- See [multi-database support](/en/features/database) before switching engines.

## First initialization and login

1. Open `http://<ip>:1881`; an uninitialized system opens the initialization page automatically.
2. Set the system title and an admin password (8+ characters), then submit.
3. Log in with user `admin` and the password you just set.
4. View or reset the API token under Settings → Access & Security (for API, CLI and plugins only).

```bash
# Show the API token (not used for web login)
journalctl -u quickidc | grep -i token
```

## Release artifacts

| Artifact | Contents |
|---|---|
| `hostagent-linux-amd64.tar.gz` | binary + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | same for arm64 |
| `hostagent-windows-amd64.zip` | portable zip |
| `QuickIDC-HostAgent-<ver>-win-x64-setup.exe` | Windows service installer |
