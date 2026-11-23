# 常见问题与关于

## 安装与启动

### 主控默认端口是多少？

`1881`。VNC 代理 `6080`，Web SSH `7681`，Caddy Admin `2019`（仅本机）。

### 管理员初始密码是什么？

没有预设的初始密码。首次访问 Web 页面会进入初始化页，由你设置管理员密码与系统标题；提交后用用户名 `admin` 与刚设置的密码登录。

启动日志中的 API Token 只用于 API / CLI / 插件调用，不能用于 Web 登录：

```bash
journalctl -u quickidc | grep -i token
```

### 启动后首页 404？

`static/` 必须与二进制同级，且包含 `index.html` 与 `assets/`。源码运行时请在前端目录执行 `npm run build` 并复制产物。

### 支持哪些系统？

主控：Linux（systemd）、Windows、macOS。安装脚本仅支持 systemd 发行版；Windows 使用 Inno 安装包。

### 升级会丢数据吗？

不会。数据在 `--data-dir`（默认 `/var/lib/quickidc` 或 `./data`），升级只替换程序。仍建议升级前备份 `data.db`（或外部数据库）。

## 平台接入

### 该选哪个平台？

| 场景 | 选择 |
|---|---|
| 轻量容器 | Docker / LXD |
| 通用虚拟机 | Proxmox VE / QEMU |
| VMware 体系 | ESXi / Workstation |
| Windows | Hyper-V |
| 桌面测试 | VirtualBox |
| 安卓 | MEmu |

### 主机一直显示离线？

按顺序检查：

1. 地址与端口是否正确；
2. 主控到宿主机网络是否通；
3. 账号密码 / 密钥是否正确；
4. 平台服务是否启动（SSH、WinRM、API）；
5. 防火墙是否放行。

### Docker / LXD 提示权限不足？

把主控使用的账号加入对应用户组：

```bash
sudo usermod -aG docker $USER   # 或 lxd
```

然后重新登录或 `newgrp`。

### Proxmox 返回 401？

用户名必须带 realm：`root@pam`。若开启了两步验证，密码登录会失败，请为 API 单独建用户并关闭 2FA。

### Hyper-V 连不上？

确认：

```powershell
Enable-PSRemoting -Force
winrm enumerate winrm/config/listener
```

工作组环境需要配置 `TrustedHosts` 或使用域账号。

### LXD 为什么不能挂 ISO / 加数据盘？

引擎元信息对 LXD 锁定了 `hdd / iso / pci / usb / efi / gpu` 页签。这是平台能力限制，不是 bug。

### VirtualBox / MEmu 为什么不能远程接入？

这两个引擎 `is_remote = false`，主控必须与它们同机。

## 实例与控制台

### 创建任务一直 0%？

打开任务详情看平台原始错误。常见原因：镜像不存在、存储空间不足、网络名错误、账号无权限。

### 控制台黑屏？

- 实例是否运行；
- 平台 VNC 端口是否可达；
- 反向代理是否配置 `vnc_ip` / `vnc_wan`；
- token 是否过期。

### 实例 IP 不显示？

CloudInit Agent 默认上报端口 `1880`，主控默认 `1881`。在 `IDCConfig.ini` 中显式设置 `report_port = 1881`。

### 能在线迁移吗？

主控抽象的是「磁盘移交」（`TransferHDD`）与备份恢复，不提供跨宿主的热迁移。需要热迁移请使用平台自带工具。

## 网络

### NAT 和反向代理怎么选？

| 需求 | 方案 |
|---|---|
| SSH、游戏服、TCP 服务 | 端口转发 |
| Web、面板、HTTPS | 反向代理 |
| 两者都要 | 同时配置 |

### 反向代理证书签发失败？

域名必须解析到入口 IP，且 80/443 可达。Caddy 需要完成 ACME 挑战。

### 主控在公网、实例在爱快后面？

主机配置选「经爱快中转」（`relay`），填写 `relay_addr`，并确保爱快已做 DNAT。

## 财务与工具

### 插件开通失败 401？

Token 错误或已轮换。用 `quickidc conf token show` 核对，并同步更新插件配置。

### 重置 Token 会怎样？

所有插件、CLI 已保存配置、外部脚本立即失效，需要逐个更新。

### 文档里的旧链接 404？

文档站已按九大板块重组，旧路径会通过跳转页自动导向新地址；若仍 404，请从顶部导航进入。

### 小黑云插件在哪？

`QuickIDC-XiaoHei` 是快简云（Quick IDC）的插件，但主仓库 `CloudHost/plugins/` 里没有这个目录，需要单独获取插件包。拿到后放进 `plugins/`，配置方式见[小黑云](/deploy/finance/xiaohei)。

## 其他

### 数据怎么备份？

SQLite：备份 `<data-dir>/data.db`（连同 `temp/Caddyfile`、`logs/` 与 `.credkey`），WAL 模式建议停服或使用 `.backup`。MySQL / PostgreSQL：使用 `mysqldump` / `pg_dump`。

### 能改主数据库为 MySQL 吗？

当前版本仅支持 SQLite，没有 MySQL/PostgreSQL 适配层。

### 如何贡献？

见[项目结构与开发](/structure/)；提交前跑通 `go build/vet/test` 与前端 `tsc`。

## 关于项目

快简云是开源 IDC 虚拟化管理平台，AGPLv3 发布，主控、前端、Agent、文档分别放在四个仓库里。

| 项目 | 内容 |
|---|---|
| 名称 | 快简云（Quick IDC） |
| 协议 | AGPLv3 |
| 主控 | [QuickIDC/CloudHost](https://github.com/QuickIDC/CloudHost) |
| 前端 | [QuickIDC/FrontPage](https://github.com/QuickIDC/FrontPage) |
| Agent | [QuickIDC/CloudInit](https://github.com/QuickIDC/CloudInit) |
| 文档 | [QuickIDC/Documents](https://github.com/QuickIDC/Documents) |
| 镜像 | `quickidcteam/quickidc`（Docker Hub） |

想参与：提 Issue 时附版本、日志和复现步骤；代码走 Fork → 分支 → PR，提交前跑通构建与测试。

- [团队介绍](/faq/team)
- [开源协议](/faq/license)
- [免责声明](/faq/disclaimer)
- [项目结构与开发](/structure/)
