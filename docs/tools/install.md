# 安装与更新

## opidcs CLI

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh
```

脚本会：

1. 识别 `linux/darwin` 与 `amd64/arm64`；
2. 下载对应版本到 `~/.local/bin/opidcs`（可用 `--dir` 修改）；
3. 写入 PATH（必要时提示重启 shell）；
4. 安装 bash/zsh 补全；
5. 打印 `opidcs version` 结果。

```bash
# 指定版本与目录
curl -fsSL .../opidcs-install.sh | sh -s -- --version v1.0.0 --dir /usr/local/bin

# 离线安装
curl -fsSL .../opidcs-install.sh | sh -s -- --file ./opidcs-linux-amd64
```

### Windows

```powershell
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.ps1 | iex
```

默认安装到 `%LOCALAPPDATA%\opidcs\bin`，并加入用户 PATH。

```powershell
# 指定版本
.\opidcs-install.ps1 -Version v1.0.0 -Dir "C:\Tools\opidcs"
```

### 包管理器（规划）

| 平台 | 命令 |
|---|---|
| Homebrew | `brew install openidcsteam/tap/opidcs` |
| Scoop | `scoop install opidcs` |
| apt / dnf | 规划中 |

## 桌面客户端

| 平台 | 文件 | 说明 |
|---|---|---|
| Windows | `opidcs-<ver>-win-x64-setup.exe` | Inno Setup，注册开始菜单与卸载项 |
| Linux | `opidcs-<ver>-x86_64.AppImage` | 赋可执行权限后直接运行 |
| macOS | `opidcs-<ver>.dmg` | 拖入 Applications |

```bash
# Linux
chmod +x opidcs-1.0.0-x86_64.AppImage
./opidcs-1.0.0-x86_64.AppImage
```

::: warning macOS 首次运行
未签名/未公证的构建会被 Gatekeeper 拦截，可在「系统设置 → 隐私与安全性」放行，或使用官方签名包。
:::

## 更新

```bash
opidcs update            # 检查并更新 CLI
opidcs version           # 查看当前版本
```

桌面端在「设置 → 关于」中检查更新，或由 `tauri-plugin-updater` 自动提示。

## 卸载

```bash
opidcs uninstall         # 卸载 CLI 自身
opidcs core uninstall    # 卸载主控服务（数据保留）
opidcs core uninstall --purge  # 连同数据
```

桌面端通过系统卸载项移除；配置与主控列表留在用户目录，可手动删除：

| 平台 | 配置目录 |
|---|---|
| Linux | `~/.config/opidcs` |
| macOS | `~/Library/Application Support/opidcs` |
| Windows | `%APPDATA%\opidcs` |

## 校验

Release 附带 `checksums.txt`：

```bash
sha256sum -c checksums.txt --ignore-missing
```

```powershell
Get-FileHash .\opidcs-windows-amd64.exe -Algorithm SHA256
```

## 网络受限环境

```bash
# 使用镜像
export OPIDCS_MIRROR=https://mirror.example.com/opidcs
opidcs update

# 或离线包
opidcs update --file ./opidcs-linux-amd64
```

## 相关页面

- [命令行](/tools/cli)
- [桌面客户端](/tools/gui)
