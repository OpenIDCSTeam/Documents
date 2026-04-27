# 快速上手

本章帮助您 **5 分钟内** 把 OpenIDCS 跑起来。提供三种极速方式：

1. 🐧 **Linux 一键安装脚本**（推荐 IDC / 服务器场景）
2. 🪟 **Windows 一键安装**
3. 🐳 **Docker 容器部署**

---

## 📥 下载地址

| 资源 | 地址 | 说明 |
|------|------|------|
| 主仓库 | <https://github.com/OpenIDCSTeam/OpenIDCS-Client> | 源码 |
| Releases | <https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases> | 预编译包（Windows/Linux 二进制） |
| Docker 镜像 | <https://hub.docker.com/r/openidcsteam/openidcs> | `openidcsteam/openidcs:latest` |
| 国内加速镜像 | <https://mirror.openidcs.org> | 下载加速 |
| FSPlugins | <https://github.com/OpenIDCSTeam/FSPlugins> | 财务系统对接插件 |

---

## 🐧 方式一：Linux 一键安装脚本（推荐）

### 支持系统

- ✅ Ubuntu 20.04 / 22.04 / 24.04
- ✅ Debian 11 / 12
- ✅ CentOS 7 / 8 · Rocky Linux · AlmaLinux
- ✅ RHEL 8 / 9

### 一行命令安装

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.sh | sudo bash
```

国内用户可使用镜像加速：

```bash
curl -fsSL https://mirror.openidcs.org/install.sh | sudo bash
```

### 脚本做了什么？

1. 🔍 检测系统发行版并安装 Python 3.10+、sqlite、Git、Caddy、ttyd 等依赖。
2. 📦 拉取 OpenIDCS-Client 源码到 `/opt/openidcs/`。
3. 🐍 创建独立 virtualenv 并安装 Python 依赖。
4. ⚙️ 生成默认配置 `/etc/openidcs/config.yaml` 与初始 Token。
5. 🧩 安装 systemd 服务 `openidcs.service` 并设置开机自启。
6. 🔥 开放 `1880` 端口（UFW / firewalld 自动处理）。
7. 🚀 启动服务并打印访问地址与初始 Token。

### 常用参数

```bash
# 自定义端口
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.sh \
  | sudo bash -s -- --port 8080

# 指定安装目录
curl -fsSL ... | sudo bash -s -- --prefix /data/openidcs

# 强制覆盖重装
curl -fsSL ... | sudo bash -s -- --force

# 不启动 systemd（仅安装）
curl -fsSL ... | sudo bash -s -- --no-start
```

### 安装完成后

```bash
systemctl status openidcs      # 查看服务状态
journalctl -u openidcs -f      # 查看实时日志
openidcs-cli token reset       # 重置初始 Token
```

浏览器访问：`http://<服务器IP>:1880`，使用终端输出的 Token 登录。

---

## 🪟 方式二：Windows 一键安装

::: tip 📌 推荐
Windows 10 / 11 / Windows Server 2019+ · 64 位 · PowerShell 5.1 以上
:::

以 **管理员身份** 打开 PowerShell，执行：

```powershell
iwr -useb https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install.ps1 | iex
```

脚本会自动：

1. 下载最新 Release 的 Windows 二进制（Nuitka 打包，免 Python 环境）。
2. 解压到 `C:\Program Files\OpenIDCS\`。
3. 注册 Windows 服务 `OpenIDCS` 并开启自启。
4. 添加防火墙规则放行 `1880`。
5. 打印访问地址与初始 Token。

也可以直接下载安装包：

- [OpenIDCS-Setup-Windows-x64.exe](https://github.com/OpenIDCSTeam/OpenIDCS-Client/releases/latest)

双击安装，一路下一步即可。

---

## 🐳 方式三：Docker 部署

最快速的体验方式（适合测试 / 开发）：

```bash
docker run -d \
  --name openidcs \
  --restart=unless-stopped \
  -p 1880:1880 \
  -v openidcs_data:/app/data \
  -v openidcs_config:/app/config \
  openidcsteam/openidcs:latest
```

获取初始 Token：

```bash
docker logs openidcs | grep -i token
```

使用 `docker-compose`：

```yaml
# docker-compose.yml
services:
  openidcs:
    image: openidcsteam/openidcs:latest
    container_name: openidcs
    restart: unless-stopped
    ports:
      - "1880:1880"
    volumes:
      - ./data:/app/data
      - ./config:/app/config
    environment:
      TZ: Asia/Shanghai
```

```bash
docker compose up -d
```

---

## 🔑 首次登录

1. 打开浏览器访问 `http://<服务器IP>:1880`。
2. 使用终端打印的初始 Token 登录（形如 `OID-xxxxxxxxxxxxxxxx`）。
3. 登录后建议立刻：
   - 创建管理员账号并设置密码。
   - 进入 **系统设置 → 修改初始 Token**。
   - 绑定域名并开启 HTTPS（可用内置 Caddy 自动申请）。

---

## 🧩 接下来做什么？

| 目标 | 去哪里看 |
|------|----------|
| 把虚拟化平台加进来 | [平台对比](/vm/comparison) + 对应平台子页 |
| 配置主控端 / 受控端 | [主控端配置](/config/server) · [受控端配置](/config/client) |
| 创建用户 & 配额 | [用户管理](/tutorials/user-management) |
| 对接财务系统售卖 | [FSPlugins 总览](/fsplugins/) |
| 完整手动安装教程 | [安装部署](/guide/installation) |

---

::: warning 遇到问题？
- 📖 查阅 [安装部署](/guide/installation) 详细章节。
- 🐛 提 Issue：<https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues>
- 💬 加入社区讨论：GitHub Discussions。
:::
