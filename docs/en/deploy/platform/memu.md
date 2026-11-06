# MuMu emulator deployment

MuMu is for Android cloud-phone scenarios, **Windows only**, managed through `memuc` on the same machine.

## Install

1. Install MuMu Player 12 and note the `shell` directory.
2. Enable ADB in settings.
3. Verify:

```powershell
cd "C:\Program Files\Netease\MuMuPlayer-12.0\shell"
.\memuc listvms
```

## Add the host

| Field | Example |
|---|---|
| Name | `mumu-01` |
| Type | MEmu Game Emulator |
| Address | `localhost` |
| Program path | `...\MuMuPlayer-12.0\shell` |

Options: `graphics_render_mode`, `enable_su`, `enable_audio`, `fps`.

```bash
opidcs plat install memu
opidcs host add --name mumu-01 --type MemuAndroid --addr localhost
```

## Limits

No GPU/extra disks; ISO replaced by APK install; pause/resume unsupported; console via ADB.

## Troubleshooting

| Symptom | Fix |
|---|---|
| memuc not found | fix the program path |
| ADB refused | enable ADB, check port |
| Stutter | switch render mode / lower FPS |
