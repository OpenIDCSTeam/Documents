# Conventions

## General

- Comments, commits and docs in Chinese; identifiers in English.
- Do not commit build outputs (except `static/` per release flow), `DataSaving/`, `node_modules/`, `.env`.
- One concern per PR with a verification note.

## Go

```text
Handler → Service → Driver → Data
```

- No business rules in handlers.
- No SQL in services.
- Drivers do not return HTTP errors.
- Wrap errors with `%w`.

| Item | Style |
|---|---|
| Package | lowercase |
| File | `vm_handlers.go` |
| Exported | PascalCase |
| Private | camelCase |

```bash
gofmt -w .
go vet ./...
go test ./...
```

New platform drivers must implement `HostDriver`; new endpoints require auth and validation; shell commands must be escaped or parameterized.

## TypeScript / React

- Function components + hooks.
- Types in `src/types`; avoid `any`.
- API calls through `src/utils/apis.ts`.
- Use design tokens, not hard-coded colors.
- Split components around 300 lines.

```bash
npx tsc --noEmit
npm run build
```

## Docs

- Ports, flags and endpoint names must exist in code.
- Mark placeholders with the `oidc-todo` block.
- Use absolute site links (`/en/deploy/...`).

## Commits

```text
<type>(<scope>): <subject>

<body>
```

`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

## Branches

`main`, `feat/*`, `fix/*`, `docs/*`.
