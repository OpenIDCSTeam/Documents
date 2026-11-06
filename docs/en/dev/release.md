# Release

## Controller

Triggered by a `v*` tag or a manual workflow run.

```bash
git tag v1.0.0
git push origin v1.0.0
```

| Artifact | Content |
|---|---|
| `hostagent-linux-amd64.tar.gz` | binary + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | same |
| `hostagent-windows-amd64.zip` | portable |
| `OpenIDCS-HostAgent-<ver>-win-x64-setup.exe` | Inno Setup installer |

Windows installer registers the `OpenIDCS-HostAgent` service (NSSM). The macOS pkg job is commented out by default.

### Checklist

- [ ] `go build/vet/test` pass
- [ ] frontend built and copied to `static/`
- [ ] version matches tag
- [ ] release notes include breaking changes

## Frontend

Shipped with the controller:

```bash
npm run build
rm -rf ../CloudHost/static/assets
cp -r dist/* ../CloudHost/static/
```

## CloudInit

Independent tags; the agent self-updates from the `latest` release.

## Docs

```bash
npm run build
git push origin main
```

GitHub Actions deploys Pages. `DOCS_BASE` controls the base path.

## CLI / Desktop

| Component | Artifacts |
|---|---|
| CLI | `opidcs-{linux,darwin,windows}-{amd64,arm64}` |
| Desktop | `*-setup.exe`, `*.AppImage`, `*.dmg`, `latest.json` |

Updater signing: private key in `TAURI_SIGNING_PRIVATE_KEY`, public key in `tauri.conf.json`.

## Rollback

| Component | Method |
|---|---|
| Controller | reinstall previous version, keep data |
| Frontend | roll back `static/` |
| Docs | `git revert` |
| CLI/Desktop | reinstall old version, disable auto-update |

## Versioning

`MAJOR.MINOR.PATCH` — breaking / feature / fix.
