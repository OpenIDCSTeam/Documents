# 安装与更新

## 发布通道

| 通道 | 触发 | Release 标签 | 说明 |
|---|---|---|---|
| `stable` | 推送 `v*` tag | `v1.2.3` | 正式版，`/releases/latest` 指向它 |
| `beta` | 推送到 `main` | `beta`（滚动更新） | 预发布，每次覆盖同名资产 |

beta 通道的资产地址固定为：

```text
https://github.com/OpenIDCSTeam/CloudHost/releases/download/beta/<文件名>
```

## quickidc CLI

### Linux / macOS

```bash
# 稳定版
curl -fsSL https://idcgit.opkg.cn/quickidc-install.sh | sh

# beta 通道
curl -fsSL .../quickidc-install.sh | sh -s -- --channel beta

# 指定版本 / 目录 / 离线包
curl -fsSL .../quickidc-install.sh | sh -s -- --version 1.2.3 --dir /usr/local/bin
curl -fsSL .../quickidc-install.sh | sh -s -- --file ./quickidc-linux-amd64
```

脚本会识别 `linux/darwin` 与 `amd64/arm64`，下载到 `~/.local/bin/quickidc`，提示 PATH，并安装 bash/zsh 补全。

可选环境变量：

| 变量 | 说明 |
|---|---|
| `OPIDCS_REPO` | 仓库，默认 `OpenIDCSTeam/CloudHost` |
| `OPIDCS_DOWNLOAD_BASE` | 镜像前缀，形如 `https://mirror.example.com/quickidc`，实际请求 `<前缀>/<tag>/<asset>` |

### Windows

```powershell
# 稳定版
irm https://idcgit.opkg.cn/quickidc-install.ps1 | iex

# beta（下载脚本后执行）
Invoke-WebRequest https://idcgit.opkg.cn/quickidc-install.ps1 -OutFile quickidc-install.ps1
.\quickidc-install.ps1 -Channel beta

# 指定版本 / 目录
.\quickidc-install.ps1 -Version 1.2.3 -Dir "C:\Tools\quickidc"
```

默认安装到 `%LOCALAPPDATA%\quickidc\bin`，并加入用户 PATH。

### 包管理器（规划）

| 平台 | 命令 |
|---|---|
| Homebrew | `brew install quickidcteam/tap/quickidc` |
| Scoop | `scoop install quickidc` |
| apt / dnf | 规划中 |

## 桌面客户端

| 平台 | 文件 | 打包方式 |
|---|---|---|
| Windows | `quickidc-<ver>-win-x64-setup.exe` | Inno Setup（GUI 主程序 + `bin\quickidc.exe` CLI） |
| Linux | `quickidc_<ver>_amd64.AppImage` | Tauri AppImage |
| macOS | `quickidc_<ver>_aarch64.dmg`、`quickidc_<ver>_x64.dmg` | Tauri app + dmg，另附 `.app` 的 zip |

beta 通道把 `<ver>` 换成 `0.0.<run>`，文件位置同样是 `releases/download/beta/`。

```bash
# Linux
chmod +x quickidc_0.0.123_amd64.AppImage
./quickidc_0.0.123_amd64.AppImage
```

::: warning macOS 首次运行
未签名/未公证的构建会被 Gatekeeper 拦截，可在「系统设置 → 隐私与安全性」放行。
:::

## 更新

```bash
quickidc update                 # 稳定版
quickidc update --channel beta  # beta
quickidc update --check         # 只检查
quickidc version                # 当前版本
```

桌面端在「设置 → 关于」中检查更新；自动更新需在 CI 配置签名密钥后开启。

## 卸载

```bash
quickidc uninstall               # 卸载 CLI 自身
quickidc core uninstall          # 卸载主控服务（数据保留）
quickidc core uninstall --purge  # 连同数据
```

桌面端通过系统卸载项移除；配置与主控列表留在用户目录：

| 平台 | 配置目录 |
|---|---|
| Linux | `~/.config/quickidc` |
| macOS | `~/Library/Application Support/quickidc` |
| Windows | `%APPDATA%\quickidc` |

## 校验

每次发布都会生成 `checksums.txt`（覆盖主控、CLI 与桌面端资产）：

```bash
sha256sum -c checksums.txt --ignore-missing
```

```powershell
Get-FileHash .\quickidc-windows-amd64.exe -Algorithm SHA256
```

beta 通道每次构建都会替换旧资产，`checksums.txt` 同步更新。

## 相关页面

- [命令行](/tools/cli)
- [桌面客户端](/tools/gui)
