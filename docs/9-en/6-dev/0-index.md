# Development

How to build, run and contribute.

## Repositories

| Repo | Language | Entry |
|---|---|---|
| CloudHost | Go | `cmd/server`, `cmd/opidcs` |
| FrontPage | TypeScript / React | `src/main.tsx` |
| CloudInit | Go | `main.go` |
| Documents | Markdown / Vue | `docs/` |

## Quick start

```bash
# controller
git clone https://github.com/OpenIDCSTeam/CloudHost.git
cd CloudHost
go mod download
go run ./cmd/server --data-dir ./data

# frontend
cd FrontPage && npm install && npm run dev

# docs
cd Documents && npm install && npm run dev
```

## Conventions

- Handler → Service → Driver → Data; no business logic in handlers.
- Platform changes must update `engine_config.go`.
- New endpoints need tests in `internal/api`.
- Frontend types live in `src/types`; avoid `any`.
- Docs must match code for ports, flags and endpoint names.

## Where to change what

| Task | Location |
|---|---|
| New platform | `internal/driver/*_driver.go`, `interface.go`, `engine_config.go` |
| New endpoint | `internal/api/app.go` + handler + service |
| Tasks/scheduling | `internal/task`, `internal/scheduler` |
| Auth | `internal/auth`, `internal/middleware` |
| UI | `FrontPage/src/pages` |
| Plugins | `CloudHost/plugins/<name>` |

## Before committing

```bash
go build ./... && go vet ./... && go test ./...
npx tsc --noEmit && npm run build
npm run build            # Documents
```

## Pages

- [Environment](/en/dev/environment)
- [Build & debug](/en/dev/build)
- [Conventions](/en/dev/conventions)
- [Release](/en/dev/release)
