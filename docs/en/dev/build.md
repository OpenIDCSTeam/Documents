# Build & debug

## Controller

```bash
cd CloudHost
go run ./cmd/server --port 1881 --data-dir ./DataSaving
go build -o hostagent ./cmd/server
go build -trimpath -ldflags "-s -w" -o dist/hostagent ./cmd/server
```

| Flag | Default |
|---|---|
| `--port` | 1881 |
| `--data-dir` | ./DataSaving |
| `--log-level` | info |
| `--log-file-level` | debug |
| `--log-db-level` | info |

## Frontend

```bash
cd FrontPage
npm run dev
npm run build
npx tsc --noEmit
```

Sync build output to the controller:

```bash
rm -rf ../CloudHost/static/assets
cp -r dist/* ../CloudHost/static/
```

## Docs

```bash
cd Documents
npm run dev
npm run build
npm run preview
```

## CLI

```bash
cd CloudHost
go build -o opidcs ./cmd/opidcs
./opidcs version
```

## Debugging

- Logs: `journalctl -u openidcs -f` or stdout.
- Database: `sqlite3 DataSaving/hostmanage.db`.
- API: `curl` or browser devtools.
- Platform: run the same command manually on the host.

## Tests

```bash
go vet ./...
go test ./...
go test ./internal/driver -run TestProxmox -v
```

## Static assets

```text
hostagent
static/index.html
static/assets/
VNCConsole/vnc.html
```

Missing `static` breaks the home page; missing `VNCConsole` only affects the console.
