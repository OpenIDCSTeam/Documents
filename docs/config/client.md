# 受控端配置

受控端是指运行虚拟化平台的服务器，OpenIDCS 通过网络连接到受控端来管理虚拟机。本文档介绍如何配置不同类型的受控端。

::: tip 虚拟机内 Agent
本文档配置的是 **宿主机侧** 受控端。虚拟机内部还需部署 CloudInit Agent（状态上报、改密、远程命令、驱动安装等），
安装方式见 [CloudInit 安装（虚拟机 Agent）](/guide/cloudinit)。
:::

## Docker/Podman 受控端配置

### 自动配置脚本

OpenIDCS 提供了自动配置脚本，支持多种 Linux 发行版：

```bash
# 1. 上传脚本到服务器
scp HostConfig/setups-oci.sh user@your-server:/tmp/

# 2. SSH 登录服务器
ssh user@your-server

# 3. 运行配置脚本
cd /tmp
sudo bash setups-oci.sh
```

脚本会自动：
- 检测系统类型（Ubuntu/Debian/CentOS/RHEL/Fedora/Arch等）
- 安装 Docker 或 Podman
- 配置 TLS 证书
- 创建网桥
- 配置防火墙
- 安装 ttyd Web Terminal

### 支持的发行版

| 发行版 | 包管理器 | Docker | Podman |
|--------|---------|--------|--------|
| Ubuntu 18.04+ | apt | ✅ | ✅ |
| Debian 10+ | apt | ✅ | ✅ |
| CentOS 7/8 | yum/dnf | ✅ | ✅ |
| RHEL 7/8/9 | yum/dnf | ✅ | ✅ |
| Rocky Linux 8/9 | dnf | ✅ | ✅ |
| AlmaLinux 8/9 | dnf | ✅ | ✅ |
| Fedora 36+ | dnf | ✅ | ✅ |
| Arch Linux | pacman | ✅ | ✅ |

### 手动配置步骤

如果需要手动配置，请按以下步骤操作：

#### 1. 安装 Docker

**Ubuntu/Debian:**
```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg

# 添加 Docker GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

**CentOS/RHEL:**
```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. 配置 TLS 证书

```bash
# 创建证书目录
sudo mkdir -p /etc/docker/certs

# 生成 CA 证书
cd /etc/docker/certs
sudo openssl genrsa -out ca-key.pem 4096
sudo openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=OpenIDCS/CN=docker-ca"

# 生成服务器证书
sudo openssl genrsa -out server-key.pem 4096
sudo openssl req -subj "/CN=your-server-ip" -sha256 -new -key server-key.pem -out server.csr

# 配置 SAN
echo "subjectAltName = IP:your-server-ip,IP:127.0.0.1" > extfile.cnf
echo "extendedKeyUsage = serverAuth" >> extfile.cnf

sudo openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem -extfile extfile.cnf

# 生成客户端证书
sudo openssl genrsa -out client-key.pem 4096
sudo openssl req -subj '/CN=client' -new -key client-key.pem -out client.csr
echo "extendedKeyUsage = clientAuth" > extfile-client.cnf
sudo openssl x509 -req -days 365 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out client-cert.pem -extfile extfile-client.cnf

# 设置权限
sudo chmod 0400 ca-key.pem server-key.pem client-key.pem
sudo chmod 0444 ca.pem server-cert.pem client-cert.pem
```

#### 3. 配置 Docker Daemon

编辑 `/etc/docker/daemon.json`：

```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/certs/ca.pem",
  "tlscert": "/etc/docker/certs/server-cert.pem",
  "tlskey": "/etc/docker/certs/server-key.pem"
}
```

重启 Docker：
```bash
sudo systemctl restart docker
```

#### 4. 创建网桥

```bash
# 创建公网网桥
sudo docker network create --driver bridge docker-pub

# 创建内网网桥
sudo docker network create --driver bridge docker-nat
```

#### 5. 配置防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 2376/tcp
sudo ufw allow 7681/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=2376/tcp
sudo firewall-cmd --permanent --add-port=7681/tcp
sudo firewall-cmd --reload
```

#### 6. 下载证书到主控端

```bash
# 在主控端执行
scp user@your-server:/etc/docker/certs/ca.pem ./certs/
scp user@your-server:/etc/docker/certs/client-cert.pem ./certs/
scp user@your-server:/etc/docker/certs/client-key.pem ./certs/
```

## LXC/LXD 受控端配置

### 自动配置脚本

```bash
# 1. 上传脚本到服务器
scp HostConfig/setups-lxd.sh user@your-server:/tmp/

# 2. SSH 登录服务器
ssh user@your-server

# 3. 运行配置脚本
cd /tmp
sudo bash setups-lxd.sh
```

### 手动配置步骤

#### 1. 安装 LXD

**Ubuntu:**
```bash
# 安装 LXD
sudo apt update
sudo apt install -y lxd

# 或使用 snap 安装最新版本
sudo snap install lxd
```

#### 2. 初始化 LXD

```bash
sudo lxd init
```

按照提示配置：
- 存储后端：选择 dir 或 zfs
- 网络配置：创建新网桥
- 远程访问：启用 HTTPS
- 端口：8443（默认）

#### 3. 配置远程访问

```bash
# 设置监听地址
sudo lxc config set core.https_address "[::]:8443"

# 生成客户端证书
sudo lxc config trust add
```

#### 4. 创建网桥

```bash
# 创建公网网桥
sudo lxc network create br-pub

# 创建内网网桥
sudo lxc network create br-nat ipv4.address=10.0.0.1/24 ipv4.nat=true
```

#### 5. 配置防火墙

```bash
sudo ufw allow 8443/tcp
```

#### 6. 导出证书

```bash
# 导出客户端证书
sudo cp /var/snap/lxd/common/config/client.crt /tmp/
sudo cp /var/snap/lxd/common/config/client.key /tmp/
sudo chmod 644 /tmp/client.crt /tmp/client.key
```

## VMware Workstation 受控端配置

### 自动配置脚本

```bash
# Windows 环境
# 1. 以管理员身份运行 PowerShell
# 2. 执行配置脚本
cd HostConfig
.\setups-vmw.ps1
```

### 手动配置步骤

#### 1. 安装 VMware Workstation

从 VMware 官网下载并安装 VMware Workstation Pro。

#### 2. 启用 REST API

VMware Workstation 15+ 内置 REST API 服务。

**Windows:**
```batch
:: 启动 REST API 服务
"C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"

:: 设置为开机自启动
sc create VMwareRESTAPI binPath= "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" start= auto
sc start VMwareRESTAPI
```

**Linux:**
```bash
# 启动 REST API 服务
vmrest &

# 设置为系统服务
sudo systemctl enable vmrest
sudo systemctl start vmrest
```

#### 3. 配置认证

编辑配置文件：

**Windows:** `%APPDATA%\VMware\preferences.ini`
**Linux:** `~/.vmware/preferences`

添加：
```ini
webServer.enabled = "TRUE"
webServer.port = "8697"
```

#### 4. 配置防火墙

**Windows:**
```powershell
New-NetFirewallRule -DisplayName "VMware REST API" -Direction Inbound -Protocol TCP -LocalPort 8697 -Action Allow
```

**Linux:**
```bash
sudo ufw allow 8697/tcp
```

## VMware vSphere ESXi 受控端配置

::: warning 注意
vSphere ESXi 支持目前处于开发阶段。
:::

### 配置步骤

#### 1. 启用 SSH

在 ESXi 主机上启用 SSH 服务：
1. 登录 ESXi Web 界面
2. 进入"主机" > "管理" > "服务"
3. 启动 SSH 服务

#### 2. 配置防火墙

```bash
# SSH 登录 ESXi
ssh root@esxi-host

# 允许 API 访问
esxcli network firewall ruleset set --ruleset-id=httpClient --enabled=true
```

#### 3. 获取 API 凭据

使用 vCenter 或 ESXi 的管理员账户。

## 验证配置

### 测试 Docker 连接

```bash
# 在主控端执行
docker --tlsverify \
  --tlscacert=./certs/ca.pem \
  --tlscert=./certs/client-cert.pem \
  --tlskey=./certs/client-key.pem \
  -H=tcp://your-server:2376 ps
```

### 测试 LXD 连接

```bash
# 在主控端执行
lxc remote add myserver https://your-server:8443
lxc remote list
```

### 测试 VMware 连接

```bash
# 访问 REST API
curl -k https://your-server:8697/api/vms
```

## 故障排查

### Docker 连接失败

**问题：** Connection refused

**解决方案：**
```bash
# 检查 Docker 服务状态
sudo systemctl status docker

# 检查端口监听
sudo netstat -tlnp | grep 2376

# 查看 Docker 日志
sudo journalctl -u docker -n 50
```

### LXD 连接失败

**问题：** Certificate error

**解决方案：**
```bash
# 重新生成证书
sudo lxd init --auto

# 检查 LXD 状态
sudo systemctl status lxd
```

### VMware 连接失败

**问题：** API not responding

**解决方案：**
```batch
:: 检查 REST API 服务
sc query VMwareRESTAPI

:: 重启服务
sc stop VMwareRESTAPI
sc start VMwareRESTAPI
```

## 安全建议

### TLS 证书管理

1. **定期更新证书**：证书默认有效期 365 天
2. **保护私钥**：确保私钥文件权限为 400
3. **备份证书**：定期备份证书文件
4. **限制访问**：仅允许信任的 IP 访问

### 防火墙配置

```bash
# 仅允许特定 IP 访问
sudo ufw allow from 192.168.1.0/24 to any port 2376 proto tcp

# 或使用 iptables
sudo iptables -A INPUT -p tcp --dport 2376 -s 192.168.1.0/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2376 -j DROP
```

### 用户权限

- 使用专用账户运行虚拟化服务
- 避免使用 root 账户
- 定期审查访问日志

## 下一步

- 📖 阅读 [主控端配置](/config/server) 配置管理服务器
- 🐳 查看 [Docker 配置详解](/vm/docker) 了解更多 Docker 配置
- 📦 查看 [LXD 配置详解](/vm/lxd) 了解更多 LXD 配置
