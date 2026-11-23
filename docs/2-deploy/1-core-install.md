# 主控安装（CloudHost）


## 方式 A：一键安装

```bash
curl -fsSL https://idcgit.opkg.cn/install.sh | sudo bash
```

脚本会：

1. 识别 `amd64` / `arm64`；
2. 从 Releases 下载对应产物；
3. 安装到 `/opt/quickidc`，数据写入 `/var/lib/quickidc`；
4. 注册 systemd 服务 `quickidc` 并启动；
5. 从 `journalctl` 中提取初始 Token 打印到终端。

要求：**root 权限**、**systemd 发行版**、能访问 GitHub Releases。

### 参数

| 参数 | 说明 | 默认 |
|---|---|---|
| `--version, -v` | 指定版本，如 `v1.0.0` | 最新 |
| `--port, -p` | HTTP 端口 | `1881` |
| `--dir` | 安装目录 | `/opt/quickidc` |
| `--data-dir` | 数据目录 | `/var/lib/quickidc` |
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
systemctl status quickidc
systemctl restart quickidc
journalctl -u quickidc -f
```

## 方式 B：Windows 安装包

从 [Releases](https://github.com/QuickIDC/CloudHost/releases) 下载 `QuickIDC-HostAgent-<版本>-win-x64-setup.exe`：

- 程序目录：`C:\Program Files\QuickIDC\HostAgent`
- 服务名：`QuickIDC-HostAgent`（NSSM 注册，LocalSystem，开机自启）
- 数据目录：`C:\ProgramData\QuickIDC\HostAgent\data`
- 服务输出：`data\logs\service-stdout.log`
- 可选放行 `1881 / 6080 / 7681`

也可以下载免安装包 `hostagent-windows-amd64.zip` 直接运行。

## 方式 C：macOS pkg

仓库提供 `packaging/macos/build-pkg.sh`，安装到 `/usr/local/quickidc`，launchd 服务名 `com.quickidct.hostagent`：

```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 \
  go build -trimpath -ldflags "-s -w" -o dist/hostagent-darwin-arm64 ./cmd/server
./packaging/macos/build-pkg.sh 1.0.0 arm64
sudo installer -pkg BuildCache/QuickIDC-HostAgent-1.0.0-macos-arm64.pkg -target /
```

> 发布流水线里的 macOS 构建任务默认注释，需要时在 `.github/workflows/release.yml` 取消注释。

## 方式 D：源码构建

```bash
git clone https://github.com/QuickIDC/CloudHost.git
cd CloudHost
go mod download
go build -o hostagent ./cmd/server

# static 与 VNCConsole 必须与工作目录同级
./hostagent --data-dir ./data
```

启动参数：

| 参数 | 说明 | 默认 |
|---|---|---|
| `--port` | HTTP 端口（优先于 `data.yaml`） | `1881` |
| `--data-dir` | 数据目录 | `./data` |
| `--log-level` | 控制台日志级别 | `info` |
| `--log-file-level` | 文件日志级别 | `debug` |
| `--log-db-level` | 数据库日志级别 | `info` |

::: warning 数据库
SQLite 使用纯 Go 实现（`modernc.org/sqlite`），**不需要 CGO 与 gcc**；旧文档中的「必须安装 MinGW / gcc」已过时。MySQL / PostgreSQL 驱动同样是纯 Go，可直接交叉编译。
:::

## 数据目录与 data.yaml

首次启动会创建如下结构（Linux 默认 `/var/lib/quickidc`，Windows 为 `C:\ProgramData\QuickIDC\HostAgent\data`，源码运行时为 `./data`）：

```text
data/
├── bins/        # 外部二进制（caddy 等）
├── logs/        # hostagent.log 与按主机拆分的日志
├── temp/        # Caddyfile、备份、临时文件
├── data.db      # SQLite 数据库（使用外部数据库时不生成）
└── data.yaml    # 运行配置
```

`data.yaml` 支持端口、VNC/SSH 端口、数据库与日志级别：

```yaml
server:
  host: 0.0.0.0
  port: 1881
  vnc_port: 6080
  ssh_port: 7681
database:
  driver: sqlite          # sqlite | mysql | postgres
  dsn: ""                 # 填了优先于下方分段配置
  sqlite:
    file: data.db
  mysql:
    host: 127.0.0.1
    port: 3306
    user: quickidc
    password: ""
    database: quickidc
    params: charset=utf8mb4&parseTime=true&loc=Local
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

- 端口优先级：`--port` > `data.yaml` > 1881；修改配置后重启服务即可。
- 旧版 `DataSaving/` 会在首次启动时自动迁移数据库、日志、`Caddyfile`、备份与 `.credkey`，原目录保留可人工确认后删除。
- 切换 MySQL / PostgreSQL 前请先建库并授予建表权限，详见 [多数据库支持](/features/database)。

## 首次初始化与登录

1. 打开 `http://<服务器IP>:1881`，未初始化的系统会自动进入初始化页面；
2. 设置系统标题与管理员密码（至少 8 位），提交后完成初始化；
3. 使用用户名 `admin` 与刚设置的密码登录；
4. 登录后可在「系统设置 → 访问与安全」查看或重置 API Token（供 API、CLI、插件使用）。

```bash
# 找回 API Token（Web 登录不再使用该 Token）
journalctl -u quickidc | grep -i token
```

## 发布产物

| 产物 | 内容 |
|---|---|
| `hostagent-linux-amd64.tar.gz` | Linux x86_64 二进制 + static + VNCConsole |
| `hostagent-linux-arm64.tar.gz` | Linux ARM64 同上 |
| `hostagent-windows-amd64.zip` | Windows 免安装包 |
| `QuickIDC-HostAgent-<版本>-win-x64-setup.exe` | Windows 服务安装包 |

::: warning 待补充
[ ] 国内加速镜像下载地址<br/>
[ ] 各发行版（Debian / Ubuntu / Rocky）依赖差异<br/>
[ ] 反向代理与 HTTPS 的推荐配置
:::

## 下一步

- [快速部署](/intro/quick-start)
- [虚拟化平台部署](/deploy/platform/)
- [系统设置](/usage/settings)
