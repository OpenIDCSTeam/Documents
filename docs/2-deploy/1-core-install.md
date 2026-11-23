# 主控安装


## 方式 A：一键安装

三个平台都提供一键安装入口。安装完成后用浏览器打开 `http://<服务器IP>:1881`

### Linux

```bash
curl -fsSL https://idcgit.opkg.cn/install.sh | sudo bash
```



要求：**root 权限**、**systemd 发行版**、能访问 GitHub Releases。

<details>
<summary>参数</summary>

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

</details>

<details>
<summary>常用命令示例</summary>

```bash
# 指定版本与端口
sudo bash install.sh --version v1.0.0 --port 1881

# 离线安装
sudo bash install.sh --file ./hostagent-linux-amd64.tar.gz --firewall

# 卸载（保留数据）
sudo bash install.sh --uninstall
```

</details>

#### 安装后管理

<details>
<summary>查看命令</summary>

```bash
systemctl status quickidc
systemctl restart quickidc
journalctl -u quickidc -f
```

</details>

### Windows

1. 从 [Releases](https://github.com/QuickIDC/CloudHost/releases) 下载 `QuickIDC-HostAgent-<版本>-win-x64-setup.exe`；
2. 双击运行，按向导完成安装。安装器会注册 `QuickIDC-HostAgent` 服务（LocalSystem、开机自启）；
3. 向导中可勾选放行 `1881 / 6080 / 7681`；
4. 安装完成后浏览器打开 `http://localhost:1881`。

- 程序目录：`C:\Program Files\QuickIDC\HostAgent`
- 数据目录：`C:\ProgramData\QuickIDC\HostAgent\data`
- 卸载：Windows「设置 → 应用 → 已安装的应用」中卸载 `QuickIDC HostAgent`。

::: tip
安装包未签名时，SmartScreen 会提示「Windows 已保护你的电脑」，点「更多信息 → 仍要运行」即可。
:::

### macOS

从 [Releases](https://github.com/QuickIDC/CloudHost/releases) 下载与芯片匹配的安装包：

| 芯片 | 安装包 |
|---|---|
| Apple Silicon（M 系列） | `QuickIDC-HostAgent-<版本>-macos-arm64.pkg` |
| Intel | `QuickIDC-HostAgent-<版本>-macos-x86_64.pkg` |

然后任选一种方式安装：

1. 双击 `.pkg` 按向导安装；
2. 或执行 `sudo installer -pkg <安装包>.pkg -target /`。

安装器会注册 launchd 服务 `com.quickidc.hostagent`（开机自启），完成后浏览器打开 `http://localhost:1881`。

- 程序目录：`/usr/local/quickidc`
- 数据目录：`/usr/local/var/lib/quickidc`
- 日志：`/usr/local/var/log/quickidc/`

::: tip
pkg 未签名/未公证时会被 Gatekeeper 拦截，可在「系统设置 → 隐私与安全性」中点「仍要打开」，或右键 pkg 选择「打开」。
:::

## 方式 B：手动安装

适合需要自定义目录、端口，或希望手动管理服务的场景。三个平台的产物都来自 [Releases](https://github.com/QuickIDC/CloudHost/releases)。

<details>
<summary>Linux：压缩包手动安装</summary>

**第 1 步：下载压缩包**

按架构选择 `amd64` / `arm64`：

```bash
# 最新正式版；指定版本时把 latest 换成 v1.0.0
ARCH=amd64
curl -fLo hostagent-linux-${ARCH}.tar.gz \
  https://github.com/QuickIDC/CloudHost/releases/latest/download/hostagent-linux-${ARCH}.tar.gz

# 可选：校验完整性
curl -fsSLO https://github.com/QuickIDC/CloudHost/releases/latest/download/checksums.txt
sha256sum -c checksums.txt --ignore-missing
```

**第 2 步：解压到安装目录并建立命令软链**

```bash
sudo mkdir -p /opt/quickidc /var/lib/quickidc/bins /var/lib/quickidc/logs /var/lib/quickidc/temp
sudo tar -xzf hostagent-linux-${ARCH}.tar.gz -C /opt/quickidc
sudo ln -sfn /opt/quickidc/hostagent /usr/local/bin/hostagent
```

压缩包内为 `hostagent`、`static`、`VNCConsole`，三者必须保持同级。

**第 3 步：注册 systemd 服务**

```bash
sudo tee /etc/systemd/system/quickidc.service >/dev/null <<'EOF'
[Unit]
Description=QuickIDC HostAgent (Go)
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/quickidc
ExecStart=/opt/quickidc/hostagent --data-dir /var/lib/quickidc
Restart=on-failure
RestartSec=5
LimitNOFILE=65536
Environment=LANG=en_US.UTF-8
StandardOutput=journal
StandardError=journal
SyslogIdentifier=quickidc

[Install]
WantedBy=multi-user.target
EOF
```

**第 4 步：启动并确认**

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now quickidc
systemctl status quickidc
journalctl -u quickidc -f
```

需要非默认端口时，在 `ExecStart` 行末追加 `--port 8080`（`--port` 优先于 `data.yaml`），然后 `sudo systemctl restart quickidc`。

</details>

<details>
<summary>macOS：命令行安装</summary>

从 Releases 下载与芯片匹配的 `.pkg`：

| 芯片 | 安装包 |
|---|---|
| Apple Silicon（M 系列） | `QuickIDC-HostAgent-<版本>-macos-arm64.pkg` |
| Intel | `QuickIDC-HostAgent-<版本>-macos-x86_64.pkg` |

```bash
sudo installer -pkg QuickIDC-HostAgent-<版本>-macos-arm64.pkg -target /
```

安装完成后的位置：

| 项目 | 路径 / 名称 |
|---|---|
| 程序目录 | `/usr/local/quickidc` |
| 数据目录 | `/usr/local/var/lib/quickidc` |
| 日志 | `/usr/local/var/log/quickidc/stdout.log`、`stderr.log` |
| launchd 服务 | `com.quickidc.hostagent`（开机自启） |

```bash
# 查看 / 重启服务
sudo launchctl print system/com.quickidc.hostagent
sudo launchctl kickstart -k system/com.quickidc.hostagent

# 查看日志
tail -f /usr/local/var/log/quickidc/stdout.log
```

::: tip
Release 未提供对应架构的 pkg 时，可在 macOS 上自行打包（需 Xcode Command Line Tools）：

```bash
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 \
  go build -trimpath -ldflags "-s -w" -o dist/hostagent-darwin-arm64 ./cmd/server
./packaging/macos/build-pkg.sh 1.0.0 arm64
```
:::

</details>

<details>
<summary>Windows：安装包与免安装版</summary>

从 [Releases](https://github.com/QuickIDC/CloudHost/releases) 下载 `QuickIDC-HostAgent-<版本>-win-x64-setup.exe`：

- 程序目录：`C:\Program Files\QuickIDC\HostAgent`
- 服务名：`QuickIDC-HostAgent`（NSSM 注册，LocalSystem，开机自启）
- 数据目录：`C:\ProgramData\QuickIDC\HostAgent\data`
- 服务输出：`data\logs\service-stdout.log`
- 可选放行 `1881 / 6080 / 7681`

也可以下载免安装包 `hostagent-windows-amd64.zip` 直接运行。

</details>

## 方式 C：容器部署

适合用 Docker / Compose 统一管理，或在 NAS、轻量服务器上运行。仓库暂未发布官方镜像，下面给出最小可用镜像与编排文件，放在仓库根目录执行即可。

### 1. Dockerfile

<details>
<summary>展开 Dockerfile</summary>

```dockerfile
FROM golang:1.26-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /out/hostagent ./cmd/server

FROM docker:27-cli AS dockercli

FROM debian:bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates tzdata openssh-client curl \
 && rm -rf /var/lib/apt/lists/*
COPY --from=dockercli /usr/local/bin/docker /usr/local/bin/docker

WORKDIR /opt/quickidc
COPY --from=build /out/hostagent ./hostagent
COPY static ./static
COPY VNCConsole ./VNCConsole

RUN mkdir -p /var/lib/quickidc/bins /var/lib/quickidc/logs /var/lib/quickidc/temp
EXPOSE 1881 6080 7681
VOLUME ["/var/lib/quickidc"]
ENTRYPOINT ["/opt/quickidc/hostagent"]
CMD ["--data-dir", "/var/lib/quickidc"]
```

</details>

`static` 与 `VNCConsole` 必须与二进制同级，镜像内已复制。Caddy 未内置：需要 Web 反向代理时，把 `caddy` 可执行文件放进数据卷的 `bins/` 目录，或改由宿主机反代 `1881`。

### 2. docker run

<details>
<summary>展开 docker run 命令</summary>

```bash
docker build -t quickidc/hostagent:latest .

docker run -d --name quickidc \
  --restart unless-stopped \
  -p 1881:1881 -p 6080:6080 -p 7681:7681 \
  -v quickidc-data:/var/lib/quickidc \
  quickidc/hostagent:latest
```

</details>

需要在容器内管理本机 Docker（主机类型选 Docker）时，在 `docker run` 中追加 `-v /var/run/docker.sock:/var/run/docker.sock`。

### 3. docker compose

`compose.yaml`：

<details>
<summary>展开 compose.yaml</summary>

```yaml
services:
  quickidc:
    build: .
    image: quickidc/hostagent:latest
    container_name: quickidc
    restart: unless-stopped
    ports:
      - "1881:1881"
      - "6080:6080"
      - "7681:7681"
    environment:
      - TZ=Asia/Shanghai
    volumes:
      - quickidc-data:/var/lib/quickidc
      # 需要管理本机 Docker 时取消注释
      # - /var/run/docker.sock:/var/run/docker.sock
volumes:
  quickidc-data:
```

</details>

```bash
docker compose up -d --build
docker compose logs -f

# 升级
docker compose build --pull && docker compose up -d
```

### 容器注意事项

- `/var/lib/quickidc` 必须挂载持久卷：`data.db`、`data.yaml`、日志与 `Caddyfile` 都在其中。
- 挂载 `docker.sock` 等价于把宿主机 root 权限交给容器，仅在需要管理本机 Docker 时开启。
- LXD / Proxmox / ESXi / Hyper-V 通过 API 或 SSH 连接，不需要额外挂载。
- 容器内监听端口由 `CMD` 决定；改端口时同时调整 `CMD --port` 与 `-p` 映射。
- 首次访问 `http://<宿主机IP>:1881` 完成初始化。

## 方式 D：源码构建

<details>
<summary>展开源码构建步骤</summary>

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

</details>

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

<details>
<summary>展开 data.yaml</summary>

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

</details>

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
| `QuickIDC-HostAgent-<版本>-macos-arm64.pkg` | macOS Apple Silicon 安装包 |
| `QuickIDC-HostAgent-<版本>-macos-x86_64.pkg` | macOS Intel 安装包 |

## 国内加速与离线安装

安装脚本本身托管在国内域名，可直接访问：

```text
https://idcgit.opkg.cn/install.sh
```

二进制产物仍从 GitHub Releases 下载。国内服务器拉取缓慢或无法访问 GitHub 时，使用离线安装：

先在可访问 GitHub 的机器上下载对应产物（`hostagent-linux-amd64.tar.gz` / `arm64`），上传到目标服务器，然后指定本地文件安装：

```bash
sudo bash install.sh --file ./hostagent-linux-amd64.tar.gz --firewall
```

没有 `install.sh` 时先下载脚本，再执行离线安装：

```bash
curl -fsSLO https://idcgit.opkg.cn/install.sh
sudo bash install.sh --file ./hostagent-linux-amd64.tar.gz
```

beta 通道的产物地址固定为：

```text
https://github.com/QuickIDC/CloudHost/releases/download/beta/<文件名>
```

下载后建议用 `checksums.txt` 校验：

```bash
sha256sum -c checksums.txt --ignore-missing
```

目前未提供独立的国内产物镜像；如需自建镜像，把 Releases 资产同步到对象存储后，用 `--file` 或「方式 B」手动安装即可。

## 各发行版依赖差异

安装脚本要求 **root 权限**、**systemd**、`amd64` / `arm64` 架构，以及 `curl` 或 `wget`、`tar`。

| 发行版 | 需手动补齐 | 防火墙工具 | 说明 |
|---|---|---|---|
| Debian 12 / Ubuntu 22.04+ | `curl`、`ca-certificates`、`tar` | `ufw` | 最小化镜像通常不带 `curl` |
| RHEL 9 / Rocky / AlmaLinux | `curl`、`tar` | `firewalld` | 与一键脚本的 `--firewall` 配合 |
| Fedora | `curl`、`tar` | `firewalld` | — |
| Arch / Manjaro | `curl`、`tar` | 无默认 | 需自行配置防火墙 |
| openSUSE | `curl`、`tar` | `firewalld` | — |
| Alpine / OpenWrt | — | — | 不支持：没有 systemd |
| Windows / macOS | — | — | 使用安装包，见「方式 A」 |

补齐依赖：

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install -y curl ca-certificates tar

# RHEL / Rocky / AlmaLinux / Fedora
sudo dnf install -y curl tar

# Arch / Manjaro
sudo pacman -S --needed curl tar

# openSUSE
sudo zypper install -y curl tar
```

开机自启、日志与卸载都依赖 systemd / launchd / Windows 服务；容器环境（无 systemd）请改用「方式 C」。

## 反向代理与 HTTPS

推荐只对外暴露 `443`，主控 `1881` 建议只监听本机回环，由反向代理转发。控制台（`6080`）与 Web SSH（`7681`）按需单独反代，二者都需要 WebSocket。

### Caddy（自动 HTTPS）

```text
idc.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:1881
}
```

Caddy 会自动申请证书并处理 WebSocket。需要公网访问控制台时再加子域：

```text
vnc.example.com {
    reverse_proxy 127.0.0.1:6080
}

ssh.example.com {
    reverse_proxy 127.0.0.1:7681
}
```

### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name idc.example.com;

    ssl_certificate     /etc/letsencrypt/live/idc.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/idc.example.com/privkey.pem;

    client_max_body_size 2g;

    location / {
        proxy_pass http://127.0.0.1:1881;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

证书可用 Certbot 申请：`sudo certbot --nginx -d idc.example.com`。

### 注意事项

- 反代 `6080` / `7681` 时必须保留 `Upgrade` / `Connection` 头，否则控制台与终端无法建立连接。
- `proxy_read_timeout` 建议不小于 `3600s`，避免长时间无操作的控制台被断开。
- 主控与反代同机时，把 `data.yaml` 的 `server.host` 改为 `127.0.0.1`，只让反代访问 `1881`。
- 不要对外暴露 Caddy Admin（`2019`）、Docker Socket 等管理端口。
- 使用 HTTPS 后，剪贴板等浏览器能力才完整可用（安全上下文限制）。


## 下一步

- [快速部署](/intro/quick-start)
- [虚拟平台](/deploy/platform/)
- [系统设置](/usage/settings)
