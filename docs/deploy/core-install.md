# 主控安装（CloudHost）

CloudHost 是单二进制主控，默认监听 `1881`，数据目录默认 `./DataSaving`。首次启动会生成 Bearer Token，并用它初始化管理员账号（**管理员初始密码 = Bearer Token**）。

::: tip 本章由项目维护者重写
安装步骤的截图、发行版差异与国内网络加速方案将由维护者补充。本页先给出与当前代码一致的命令与参数，避免旧版（Python / 1880 端口）信息误导。
:::

## 方式 A：Linux 一行命令

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/install.sh | sudo bash
```

脚本会：

1. 识别 `amd64` / `arm64`；
2. 从 Releases 下载对应产物；
3. 安装到 `/opt/openidcs`，数据写入 `/var/lib/openidcs`；
4. 注册 systemd 服务 `openidcs` 并启动；
5. 从 `journalctl` 中提取初始 Token 打印到终端。

要求：**root 权限**、**systemd 发行版**、能访问 GitHub Releases。

### 参数

| 参数 | 说明 | 默认 |
|---|---|---|
| `--version, -v` | 指定版本，如 `v1.0.0` | 最新 |
| `--port, -p` | HTTP 端口 | `1881` |
| `--dir` | 安装目录 | `/opt/openidcs` |
| `--data-dir` | 数据目录 | `/var/lib/openidcs` |
| `--file, -f` | 离线包路径 | 无 |
| `--firewall` | 自动放行端口（1881/6080/7681） | 关闭 |
| `--uninstall` | 卸载服务与程序 | — |
| `--purge` | 卸载时一并删除数据 | 关闭 |

```bash
# 指定版本与端口
sudo bash install.sh --version v1.0.0 --port 1881

# 离线安装
sudo bash install.sh --file ./hostagent-linux-amd64.tar.gz --firewall

# 卸载（保留数据）
sudo bash install.sh --uninstall
```

### 安装后管理

```bash
systemctl status openidcs
systemctl restart openidcs
journalctl -u openidcs -f
```

## 方式 B：Windows 安装包

从 [Releases](https://github.com/OpenIDCSTeam/CloudHost/releases) 下载 `OpenIDCS-HostAgent-<版本>-win-x64-setup.exe`：

- 程序目录：`C:\Program Files\OpenIDCS\HostAgent`
- 服务名：`OpenIDCS-HostAgent`（NSSM 注册，LocalSystem，开机自启）
- 数据目录：`C:\ProgramData\OpenIDCS\HostAgent\DataSaving`
- 服务输出：`DataSaving\service-stdout.log`
- 可选放行 `1881 / 6080 / 7681`

也可以下载免安装包 `hostagent-windows-amd64.zip` 直接运行。

## 方式 C：macOS pkg

仓库提供 `packaging/macos/build-pkg.sh`，安装到 `/usr/local/openidcs`，launchd 服务名 `com.openidcst.hostagent`：

```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 \
  go build -trimpath -ldflags "-s -w" -o dist/hostagent-darwin-arm64 ./cmd/server
./packaging/macos/build-pkg.sh 1.0.0 arm64
sudo installer -pkg BuildCache/OpenIDCS-HostAgent-1.0.0-macos-arm64.pkg -target /
```

> 发布流水线里的 macOS 构建任务默认注释，需要时在 `.github/workflows/release.yml` 取消注释。

## 方式 D：源码构建

```bash
git clone https://github.com/OpenIDCSTeam/CloudHost.git
cd CloudHost
go mod download
go build -o hostagent ./cmd/server

# static 与 VNCConsole 必须与工作目录同级
./hostagent --port 1881 --data-dir ./DataSaving
```

启动参数：

| 参数 | 说明 | 默认 |
|---|---|---|
| `--port` | HTTP 端口 | `1881` |
| `--data-dir` | 数据目录 | `./DataSaving` |
| `--log-level` | 控制台日志级别 | `info` |
| `--log-file-level` | 文件日志级别 | `debug` |
| `--log-db-level` | 数据库日志级别 | `info` |

::: warning 数据库
SQLite 使用纯 Go 实现（`modernc.org/sqlite`），**不需要 CGO 与 gcc**；旧文档中的「必须安装 MinGW / gcc」已过时。
:::

## 首次登录

1. 打开 `http://<服务器IP>:1881`；
2. 用户名 `admin`，密码为启动日志中的 Bearer Token（64 位十六进制）；
3. 登录后立即在「系统设置 → 令牌」重置 Token，并修改管理员密码。

```bash
# 找回初始 Token
journalctl -u openidcs | grep -i token
```

## 发布产物

| 产物 | 内容 |
|---|---|
| `hostagent-linux-amd64.tar.gz` | Linux x86_64 二进制 + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | Linux ARM64 同上 |
| `hostagent-windows-amd64.zip` | Windows 免安装包 |
| `OpenIDCS-HostAgent-<版本>-win-x64-setup.exe` | Windows 服务安装包 |

::: warning 待补充
[ ] 国内加速镜像下载地址<br/>
[ ] 各发行版（Debian / Ubuntu / Rocky）依赖差异<br/>
[ ] 反向代理与 HTTPS 的推荐配置
:::

## 下一步

- [快速体验](/deploy/quick-start)
- [虚拟化平台部署](/deploy/platform/)
- [系统设置](/usage/settings)
