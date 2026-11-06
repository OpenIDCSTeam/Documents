# CloudInit 虚拟机内 Agent 安装

CloudInit 是运行在 **虚拟机内部** 的轻量 Agent（Go 单二进制），与 OpenIDCS 主控端配合，负责虚拟机内部的状态采集与指令执行。

主要能力：

- **状态上报**：定时采集 CPU / 内存 / 磁盘 / GPU / 网络并上报主控端
- **指令执行**：改密、改主机名、软关机 / 重启、远程命令下发与结果回传
- **磁盘扩容**：首次启动自动检测并扩容根分区（ext4 / xfs / btrfs / APFS / NTFS）
- **系统初始化（Windows）**：静默激活、KVM 环境自动安装 virtio 驱动、清理非 VMware 环境残留的 VMware Tools
- **远程桌面信息**：采集 ToDesk / AnyDesk / 向日葵 的地址与密码，随状态一起上报
- **自动更新**：主程序与 `tool/` 目录工具独立更新，优先走 EdgeOne 镜像，失败回退 GitHub

---

## 支持平台

| 系统 | 架构 | 说明 |
|------|------|------|
| Windows 7 SP1 / 8.1 / Server 2008 R2+ | x64 / x86 | 专用 `win78` 构建（Go 1.20 编译） |
| Windows 10 / 11 / Server 2016+ | x64 / x86 / ARM64 | 默认构建 |
| Linux（systemd） | x64 / ARM64 | 主流发行版 |
| macOS | x64 / Apple Silicon | launchd 托管 |

> 虚拟机需要能访问主控端端口（默认 `1880`），并且网卡配置了网关；否则主动上报无法找到主控。

---

## 一键安装

安装脚本会完成：下载最新版本 → 停止旧服务 → 替换二进制 → 注册开机自启服务（服务名统一为 `cloudinit`）。

### Linux / macOS

```bash
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo sh
```

指定版本：

```bash
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo sh -s v0.4.7
```

镜像不可用时改用 GitHub：

```bash
curl -fsSL https://github.com/OpenIDCSTeam/CloudInit/releases/latest/download/install.sh | sudo sh
```

### Windows

以**管理员身份**打开 PowerShell：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://eo-idc.pika.net.cn/cloudinit/install.ps1 | iex"
```

指定版本：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((irm https://eo-idc.pika.net.cn/cloudinit/install.ps1))) -Version v0.4.7"
```

GitHub 回退：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://github.com/OpenIDCSTeam/CloudInit/releases/latest/download/install.ps1 | iex"
```

> 一键安装脚本从 `v0.4.7` 起随正式版发布（脚本本身也在 Release 资产与 EdgeOne 镜像中）。
> Windows 二进制内置原生服务支持，无需 NSSM 等第三方包装。

---

## 安装位置与服务

| 平台 | 安装目录 | 服务名 | 开机启动 |
|------|----------|--------|----------|
| Windows | `C:\cloudinit` | Windows 服务 `cloudinit` | 自动（`sc query cloudinit`） |
| Linux | `/opt/cloudinit` | systemd `cloudinit` | `systemctl enable` |
| macOS | `/opt/cloudinit` | launchd `cloudinit` | `RunAtLoad` |

安装后的目录结构：

```
<安装目录>/
├── CloudInit(.exe)     # 主程序
├── IDCConfig.ini       # 可选，覆盖默认配置
├── .version            # 运行时生成，记录当前版本
├── logs/               # 日志目录
└── tool/               # MASAIO.cmd、ToDesk.exe 等工具（支持在线更新）
```

自定义安装目录：

```bash
# Linux / macOS
curl -fsSL https://eo-idc.pika.net.cn/cloudinit/install.sh | sudo INSTALL_DIR=/data/cloudinit sh
```

```powershell
# Windows：先下载脚本再带参数执行
.\install.ps1 -InstallDir "D:\cloudinit"
```

---

## 安装后管理

**Linux**

```bash
systemctl status cloudinit
systemctl restart cloudinit
journalctl -u cloudinit -f
tail -f /opt/cloudinit/logs/cloudinit_$(date +%F).log
```

**macOS**

```bash
sudo launchctl print system/cloudinit
sudo launchctl kickstart -k system/cloudinit
tail -f /opt/cloudinit/logs/*.log
```

**Windows**

```powershell
sc.exe query cloudinit
sc.exe stop cloudinit
sc.exe start cloudinit
Get-Content C:\cloudinit\logs\cloudinit_$(Get-Date -Format yyyy-MM-dd).log -Tail 50 -Wait
```

---

## 升级

重复执行对应平台的安装命令即可。升级流程会先停服务、替换二进制，以下内容全部保留：

- `IDCConfig.ini`（自定义配置）
- `.version`（当前版本记录）
- `tool/`（激活脚本与远程桌面工具）

---

## 卸载

**Windows**（管理员 PowerShell）：

```powershell
sc.exe stop cloudinit
sc.exe delete cloudinit
Remove-Item -Recurse -Force C:\cloudinit
```

**Linux**：

```bash
sudo systemctl disable --now cloudinit
sudo rm -rf /opt/cloudinit /etc/systemd/system/cloudinit.service
sudo systemctl daemon-reload
```

**macOS**：

```bash
sudo launchctl bootout system/cloudinit
sudo rm -rf /opt/cloudinit /Library/LaunchDaemons/cloudinit.plist
```

---

## 配置

配置文件为安装目录下的 `IDCConfig.ini`，不存在时使用默认值。常用配置：

```ini
[server]
# 上报间隔（秒），默认 60
# report_interval = 60

# 主控端端口与路径
# report_port = 1880
# report_path = /api/client/upload

# 固定上报地址（留空则自动从网关推算并在子网内探测主控）
# report_host = 10.0.0.2

# 自动探测的起始地址：默认从 x.x.x.2 开始，0/1 表示从网关开始
# gateway_offset = 2

[update]
# 自动更新开关与检查周期（秒）
# enabled = true
# interval = 86400

# 镜像优先，失败回退 GitHub
# mirror_url = https://eo-idc.pika.net.cn/cloudinit

[system]
# KVM 环境自动安装 virtio 驱动
# virtio_enabled = true
# virtio_url_x64 = https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.302-1/virtio-win-gt-x64.msi
# virtio_url_x86 = https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.302-1/virtio-win-gt-x86.msi

[log]
# level = INFO
# retention = 7 days
```

---

## 主控发现机制

未配置 `report_host` 时，Agent 使用自动发现：

1. 读取每块网卡的网关，取前三段作为 `/24` 子网前缀（网关不要求以 `.1` 结尾）；
2. 优先尝试上次成功的主控地址（5 秒超时）；
3. 失败后按 `gateway_offset` 生成候选地址，**32 并发**探测（900ms 超时），首个返回主控协议响应的地址即命中；
4. 命中后缓存该地址，后续每轮直接上报；主控迁移会自动重新探测；
5. 整段子网都未命中时，本轮不上报并在日志中告警。

> 主控响应必须同时包含 `code` 与 `timestamp` 字段才会被认定为 OpenIDCS 主控，避免把防火墙或透明代理的 JSON 响应误判为主控。

---

## 常见问题

### 日志里看不到上报

按顺序检查以下三行日志：

```text
[上报] 主循环已启动，间隔 60s，网卡数 2
[上报] 网卡 AA:BB:CC:DD:EE:FF | IP: 10.0.0.100 | 网关: 10.0.0.1
[上报] 状态已上报（主控 10.0.0.2）
```

- 只有第一行：网卡没有取到网关 → 检查虚拟机网卡与路由表；
- 有前两行但没有第三行：日志会出现 `未找到主控`，确认主控端口（默认 `1880`）可达、虚拟机与主控同网段；
- 出现 `上报连接失败`：检查防火墙与主控服务状态。

### Windows 服务无法启动

确认安装的是 `v0.4.7` 及以上版本（内置服务支持）；可用 `sc.exe query cloudinit` 查看状态，`事件查看器 → Windows 日志 → 应用程序` 中会有对应错误。

### KVM 虚拟机缺少 virtio 驱动

Agent 会自动识别 KVM 平台并安装 virtio 驱动包。若虚拟机只有 virtio 网卡且完全无网络，请先把 `virtio-win-gt-x64.msi` 放到安装目录的 `tool/` 下（已存在会直接复用），或把 `virtio_url_x64` 指向内网镜像。

### Windows 未激活

激活脚本为 `tool/MASAIO.cmd`，首次部署时可能还在自动下载，Agent 会等待最多 10 分钟再执行；也可以在日志中搜索 `[Windows激活]` 查看脚本版本与执行结果。

---

## 下一步

- 📖 阅读 [受控端配置](/config/client) 配置宿主机侧的虚拟化平台
- 🏗️ 了解 [架构设计](/guide/architecture) 中 Agent 与主控端的交互流程
- 🚀 参考 [快速上手](/guide/quick-start) 完成主控端部署
