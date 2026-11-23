# MEmu emulator deployment

MEmu (Microvirt's Android emulator) is for Android cloud-phone scenarios, **Windows only**, managed through `memuc` on the same machine as the controller.

## Install

`quickidc plat install` does not cover this platform; install it by hand.

1. Download and install MEmu from <https://www.memuplay.com/>.
2. Note the `memuc.exe` directory. It defaults to `%APPDATA%\Microvirt\MEmu` (`C:\Users\<you>\AppData\Roaming\Microvirt\MEmu`) and is not on `PATH`.
3. Verify:

```powershell
cd "$env:APPDATA\Microvirt\MEmu"
.\memuc listvms
```

The controller calls ADB through `memuc adb -i <index> -- ...`, so there is no separate ADB setup.

## Add the host

| Field | Example | Note |
|---|---|---|
| Name | `memu-01` | `hs_name` |
| Type | MEmu Game Emulator | `MemuAndroid` |
| Address | `localhost` | must be local |
| Program path | `%APPDATA%\Microvirt\MEmu` | where `memuc.exe` lives |

Options: `graphics_render_mode` (`1` DirectX, `0` OpenGL), `enable_su`, `enable_audio`, `fps`.

```bash
quickidc host add --name memu-01 --type MemuAndroid --addr localhost
```

## Limits

No GPU or extra disks, ISO replaced by APK install, pause/resume unsupported. Console is built in (ADB frame capture plus touch injection) and the ADB port stays open. Supported Android images: 4.4, 5.1, 7.1, 7.1 64-bit, 9, 9 64-bit, 12.

## Troubleshooting

| Symptom | Fix |
|---|---|
| memuc not found | set the program path, default `%APPDATA%\Microvirt\MEmu` |
| Start fails with 0x80070005 | Hyper-V disk permission issue; run "repair runtime" on the host ops page |
| Blank screenshots on OpenGL | switch `graphics_render_mode` back to `1` |
| ADB refused | check that `memuc adb -- devices` lists the instance |
