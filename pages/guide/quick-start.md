# 快速上手

本指南带你在 **5 分钟内** 把 OpenIDCS 跑起来并创建第一台虚拟机。

> 想了解更完整的部署方式（Docker / Systemd / Windows 服务 / Nginx+HTTPS），请查阅 [安装部署](/guide/installation)。

## 前置要求

| 项 | 要求 |
|----|------|
| 操作系统 | Windows 10+ / Ubuntu 18.04+ / CentOS 7+ / macOS 10.14+ |
| Python | 3.8+（推荐 3.9 / 3.10） |
| 内存 | 4 GB+ |
| 端口 | 1880 / 6080 / 7681 未被占用 |

## 三步跑起来

### 步骤 1：下载并启动主控端

::: code-group

```bash [二进制 (Linux)]
# 最快方式：下载预编译二进制
wget https://github.com/OpenIDCSTeam/Backends/releases/latest/download/OpenIDCS-Client-linux-x86_64.tar.gz
tar -xzf OpenIDCS-Client-linux-x86_64.tar.gz
cd OpenIDCS-Client
./OpenIDCS-Client
```

```powershell [二进制 (Windows)]
# 从 Releases 下载解压后
cd C:\OpenIDCS-Client
.\OpenIDCS-Client.exe
```

```bash [源码 (Linux/macOS)]
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python3 -m venv venv && source venv/bin/activate
pip install -r HostConfig/pipinstall.txt
python HostServer.py
```

```batch [源码 (Windows)]
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client
python -m venv venv
venv\Scripts\activate
pip install -r HostConfig/pipinstall.txt
python HostServer.py
```

:::

启动成功后，控制台会打印类似输出：

```
========================================
OpenIDCS Server Started Successfully!
========================================
Access Token: abc123def456ghi789jkl012...
Web Interface: http://localhost:1880
========================================
```

### 步骤 2：首次登录并创建管理员

1. 浏览器访问 <http://localhost:1880>
2. 在登录页粘贴**控制台输出的 Token**
3. 进入「用户管理 → 创建用户」，新建一个**管理员**账户
4. 退出登录，用刚创建的账户密码重新登录

> Token 只用作首次引导。创建管理员后建议立即在后台**禁用 Token**。

### 步骤 3：添加第一台受控端

根据你手头的虚拟化平台选择一种即可：

::: code-group

```text [VMware Workstation]
主机类型: VMware Workstation
主机地址: 192.168.1.100
主机端口: 8697
用户名  : administrator
密码    : <受控端密码>
虚拟机路径: C:\Virtual Machines\
```

```text [Docker]
主机类型: Docker
主机地址: 192.168.1.101
主机端口: 2376
证书路径: ~/docker-certs
公网网桥: docker-pub
内网网桥: docker-nat
```

```text [LXD]
主机类型: LXD
主机地址: 192.168.1.102
主机端口: 8443
证书路径: ~/lxd-certs
公网网桥: br-pub
内网网桥: br-nat
```

```text [Proxmox VE]
主机类型: Proxmox VE
主机地址: 192.168.1.103
主机端口: 8006
用户名  : root@pam
密码    : <Proxmox 密码>
```

```text [Hyper-V]
主机类型: Windows Hyper-V
主机地址: 192.168.1.104
WinRM 端口: 5985
用户名  : Administrator
密码    : <Windows 密码>
```

:::

点击「**测试连接**」，提示成功后点击「**保存**」即可。

::: tip 受控端还没配置好？
不同平台的受控端**安装脚本和手动步骤**请在左侧导航"虚拟化平台"下找到对应页面：
- [Docker / Podman](/vm/docker)
- [LXC / LXD](/vm/lxd)
- [VMware Workstation](/vm/vmware)
- [VMware vSphere ESXi](/vm/esxi)
- [Proxmox VE](/vm/proxmox)
- [Windows Hyper-V](/vm/hyperv)
- [青州云](/vm/qingzhou)
:::

## 创建第一台虚拟机

### 1. 进入「虚拟机管理」，点击「创建虚拟机」

### 2. 填写基本信息

| 字段 | 示例 |
|------|------|
| 虚拟机名称 | `demo-01` |
| 所属主机 | 刚才添加的受控端 |
| 操作系统 | Ubuntu 22.04 / Windows 10 / … |
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 20 GB |
| 网络 | NAT（自动分配 IP） |

### 3. 点击创建，几秒后即可启动

### 4. 访问虚拟机

- **Web VNC 控制台**：详情页 → 「控制台」
- **Web SSH 终端**：详情页 → 「终端」
- **RDP / SSH 客户端**：使用分配的 IP + 端口

## 开放端口到公网（可选）

如果你想让外网访问虚拟机内的 Web 服务：

1. 进入虚拟机详情页的「网络」页签
2. 「添加端口转发」：主机端口 `8080` → 虚拟机端口 `80`，协议 TCP
3. 对外访问：`http://<主控端公网IP>:8080`

或者直接绑定域名（需 DNS 已解析到主控端）：

1. 进入「Web 反代」
2. 填写域名、后端 `虚拟机IP:端口`、启用 SSL
3. 保存后自动申请证书并生效

## 创建普通用户（多租户）

1. 「用户管理 → 创建用户」
2. 用户名 / 密码 / 邮箱
3. 配额：CPU `4`、内存 `8 GB`、磁盘 `100 GB`、虚拟机数 `5`
4. 权限：✅ 创建 ✅ 修改 ❌ 删除
5. 保存

该用户登录后只能看到自己的资源，且创建数超过配额会被拒绝。详见 [用户管理](/tutorials/user-management)、[权限管理](/tutorials/permissions)。

## 一分钟看性能

「仪表盘」首页可以看到：

- 主机的 CPU / 内存 / 磁盘 / 网络实时曲线
- 所有虚拟机的状态汇总
- 最近 20 条操作日志
- 用户配额使用率 Top 10

进入单个虚拟机详情 → 「监控」，可查看更细粒度的性能图表。

## 备份虚拟机

1. 详情页 → 「备份」
2. 「创建备份」→ 填写备注 → 开始
3. 完成后可在「备份列表」中**一键还原**或下载

详见 [备份与恢复](/tutorials/backup)。

## 常见问题

### 浏览器打不开 http://localhost:1880

```bash
# Linux
lsof -i :1880
systemctl status openidcs

# Windows
netstat -ano | findstr 1880
```

检查：
- 服务是否启动
- 防火墙是否放行 1880
- 是否使用了错误的 `0.0.0.0` vs `127.0.0.1`

### 添加主机时连接失败

- 在主控端 `ping <受控端IP>`
- 检查受控端**对应端口**是否监听（VMware 8697、LXD 8443、Docker 2376、Proxmox 8006 等）
- 用户名 / 密码 / 证书是否正确
- 查看 `DataSaving/log-main.log` 详细错误

### 创建虚拟机报错

- 主机剩余资源是否充足（CPU、RAM、磁盘）
- 用户配额是否已超限
- 镜像 / ISO / 模板是否存在于受控端
- 查看日志定位具体异常

## 下一步

- 📖 [功能概览](/guide/features) 看清 OpenIDCS 能做什么
- 🏗️ [架构设计](/guide/architecture) 了解内部原理
- ⚙️ [主控端配置](/config/server) 做生产级调优
- 🖥️ [受控端配置](/config/client) 批量添加主机
- 🧑 [用户管理](/tutorials/user-management) / [权限管理](/tutorials/permissions)
- 📊 [监控与告警](/tutorials/monitoring) / [日志管理](/tutorials/logs)

## 获取帮助

- 🐛 [GitHub Issues](https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues)
- 💬 [Gitter 讨论](https://gitter.im/OpenIDCSTeam/community)
- 📧 openidcs@team.org
