# VMware 配置教程

本教程将指导您完成 VMware 虚拟化平台的配置，使其能够被 OpenIDCS 远程管理。

## 优点与局限

### ✅ 优点

- **完整硬件虚拟化**：可运行任意操作系统（Windows / Linux / BSD / macOS 等），隔离性极强。
- **功能全面**：OpenIDCS 对 VMware Workstation 的功能矩阵几乎全绿——支持截图、备份/还原、PCI/USB 直通、磁盘挂载/迁移等。
- **成熟稳定**：VMware 生态悠久，Workstation/ESXi 均为企业级产品，文档与工具链丰富。
- **GUI 友好**：桌面端可图形化查看与调试虚拟机，配合 OpenIDCS 的 Web VNC 可远程完整接管桌面。
- **内置 REST API**：Workstation 15+ 自带 `vmrest`，OpenIDCS 通过标准 HTTPS 调用，无需额外 Agent。
- **快照 / 克隆**：支持链接克隆、完整克隆与快照树，便于测试和回滚。

### ⚠️ 局限

- **资源开销大**：完整虚拟化带来 CPU / 内存 / 磁盘开销，单宿主承载的 VM 数量远少于容器。
- **启动慢**：一台 VM 启动通常需要数十秒，不适合秒级扩缩的短生命周期任务。
- **商业许可**：VMware Workstation Pro 为付费产品；ESXi 免费版有功能限制，正式使用建议购买许可。
- **平台覆盖**：Workstation 受控端主要在 Windows 上稳定；Linux 版本在较新内核上可能需要额外编译模块。
- **依赖 Intel VT-x / AMD-V**：宿主需启用硬件虚拟化，嵌套虚拟化场景下性能下降明显。

### 🎯 推荐场景

| 场景 | 建议 |
|------|------|
| 运行 Windows / 多 OS 虚拟机 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 需要 PCI / USB 直通 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 需要图形桌面 / 远程桌面 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 企业级数据中心（ESXi / vSphere） | ⭐⭐⭐⭐ 推荐（Workstation 适合轻量，ESXi 适合集群） |
| 高密度、无状态 Web 服务 | ⭐⭐ 建议改用 Docker / LXC |
| 秒级弹性伸缩任务 | ⭐⭐ 建议改用容器平台 |

## 支持的 VMware 平台

OpenIDCS 支持以下 VMware 产品：

| 平台 | 状态 | 支持的操作系统 | 说明 |
|------|------|----------------|------|
| **VMware Workstation** | ✅ 生产就绪 | Windows, Linux | 桌面虚拟化解决方案 |
| **VMware vSphere ESXi** | 🚧 开发中 | Windows, Linux, macOS | 企业级虚拟化平台 |

## VMware Workstation

> 🖥 桌面级虚拟化 · 完整 GUI · 适合开发测试 / 教学实验室

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| 🪟 **桌面级** | 跑在 Windows / Linux 桌面系统上，安装简单 |
| 🎓 **适合教学** | 学生本地安装即可获得完整 VM 能力 |
| 🛠 **硬件兼容好** | VMware Tools 自动安装，图形/网络/剪贴板无缝 |
| 🔁 **OpenIDCS 能力** | 创建 / 启停 / 重启 / 快照 / 克隆 / 克隆链 / ISO 装载 / VNC |
| 🤝 **混合部署** | 可与 ESXi 同账号管理，从桌面开发到企业上线无缝迁移 |

## 📋 前置要求

| 项 | 要求 |
|----|------|
| VMware Workstation Pro | **16+ / 17+**（官方：Workstation Pro 现已对个人免费） |
| 操作系统 | Windows 10/11 · Windows Server 2019+ · Linux |
| CPU | 支持 VT-x / AMD-V |
| 内存 | ≥ 8GB（建议 16GB+） |
| 磁盘 | ≥ 100GB |

---

## 🚀 部署教程

### 步骤 1 · 安装 VMware Workstation

1. 下载官方安装包：<https://www.vmware.com/products/workstation-pro.html>（个人用户免费）。
2. 双击安装，建议勾选 **Enhanced Keyboard Driver** 与 **Add to PATH**。
3. 启动 VMware，确保可以手动创建一个测试 VM。

### 步骤 2 · 启用 VMware REST API

Workstation 17 起内置 REST API，用于远程管理：

**Windows**：

```powershell
# 初始化账号（设置 REST API 用户名密码）
& "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" -C

# 启动服务（默认监听 127.0.0.1:8697）
& "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"
```

若需远程访问，改为监听全部 IP：

```powershell
vmrest.exe --ip 0.0.0.0 --port 8697
```

建议注册成 Windows 服务后台运行：

```powershell
# 使用 nssm 注册服务
nssm install VMwareREST "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"
nssm set VMwareREST AppParameters "--ip 0.0.0.0 --port 8697"
nssm start VMwareREST
```

**Linux**：

```bash
vmrest -C         # 设置账号密码
vmrest --ip 0.0.0.0 --port 8697 &
```

### 步骤 3 · 安装 OpenIDCS HostAgent

Workstation 宿主机上安装 HostAgent（Windows PowerShell）：

```powershell
iwr -useb https://raw.githubusercontent.com/OpenIDCSTeam/OpenIDCS-Client/main/install-agent.ps1 | iex
# 或传参：
# & .\install-agent.ps1 -Server "https://openidcs.example.com" -Token "xxx" -Driver vmware_ws
```

### 步骤 4 · 在 OpenIDCS 中添加平台

1. 后台 → **主机管理 → 添加主机**。
2. 填写：

| 字段 | 示例 |
|------|------|
| 平台类型 | VMware Workstation |
| API 地址 | `http://192.168.1.30:8697` |
| 用户名 | `admin` |
| 密码 | `••••••••` |
| VM 目录 | `D:\VMs` |
| ISO 库 | `D:\ISOs` |

3. 测试连接 → 保存。

### 步骤 5 · 创建 VM

1. **虚拟机 → 创建 → 平台：VMware Workstation**。
2. 配置：

| 字段 | 示例 |
|------|------|
| 模板来源 | 空白 / 克隆模板 / ISO 安装 |
| ISO 路径 | `D:\ISOs\ubuntu-22.04.iso` |
| 操作系统 | Ubuntu Linux 64 位 |
| CPU | 2 核 |
| 内存 | 4 GB |
| 磁盘 | 40 GB（thin） |
| 网络 | NAT / 桥接 / 仅主机 |

3. 创建 → 首次启动进入 ISO 装系统。
4. 装好 OS 后安装 VMware Tools 获得图形支持。
5. 使用 OpenIDCS **VNC 控制台** 或 **WebSSH** 接入。

---

## 🧰 常用操作

### 克隆 VM（模板化）

1. 先装好一台 Ubuntu 模板 VM。
2. OpenIDCS → 选择该 VM → **转为模板**。
3. 之后创建时选 **从模板克隆**，秒级复制。

### 快照管理

OpenIDCS 前端直接操作：**虚拟机详情 → 快照 → 创建/还原/删除**。

底层等价命令：

```bash
vmrun snapshot "D:\VMs\web01\web01.vmx" snap1
vmrun revertToSnapshot "..." snap1
```

### 自动挂载 ISO

**虚拟机详情 → 光驱 → 选择 ISO → 装载**。

---

## 🛡 使用建议

- 🪶 **资源隔离**：在桌面宿主机只保留必要应用，避免资源争抢。
- 💾 **VMX 存储**：单独 SSD 存 `.vmdk`，性能大幅提升。
- 🛠 **VMware Tools**：务必安装，否则无法热扩容、剪贴板等。
- 🔐 **REST API 安全**：生产环境请在反向代理上加 TLS，并用复杂密码。

## 🧯 常见问题

<details>
<summary><b>vmrest 启动报 license？</b></summary>

Workstation 17+ 已对个人用户免费，登录 Broadcom 账户激活即可。商用请购买企业许可。
</details>

<details>
<summary><b>HostAgent 找不到 vmrun？</b></summary>

把 VMware 安装目录加入 PATH，或在 HostAgent 配置 `vmware.vmrun_path`。
</details>

---

👉 相关：[ESXi 教程](/vm/esxi) · [快照与备份](/tutorials/backup) · [Web VNC](/tutorials/vm-management)

## VMware Workstation 配置

### 系统要求

#### 硬件要求
- CPU：支持硬件虚拟化（Intel VT-x 或 AMD-V）
- 内存：至少 4GB（推荐 8GB+）
- 存储：至少 50GB 可用空间

#### 软件要求
- VMware Workstation Pro 15.0 或更高版本
- Windows 10/11 或 Linux（Ubuntu 18.04+, CentOS 7+）

### 步骤 1：安装 VMware Workstation

#### Windows

1. 从 [VMware 官网](https://www.vmware.com/products/workstation-pro.html) 下载安装程序
2. 运行安装程序并按照向导完成安装
3. 输入许可证密钥（或使用试用版）
4. 重启计算机

#### Linux

```bash
# 下载安装包
wget https://download3.vmware.com/software/wkst/file/VMware-Workstation-Full-17.0.0-20800274.x86_64.bundle

# 添加执行权限
chmod +x VMware-Workstation-Full-*.bundle

# 安装
sudo ./VMware-Workstation-Full-*.bundle

# 启动服务
sudo systemctl start vmware
sudo systemctl enable vmware
```

### 步骤 2：启用 REST API

VMware Workstation 15+ 内置 REST API 服务。

#### Windows

```batch
:: 方式 1：手动启动
"C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"

:: 方式 2：创建 Windows 服务
sc create VMwareRESTAPI binPath= "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" start= auto DisplayName= "VMware REST API Service"
sc description VMwareRESTAPI "VMware Workstation REST API Service"
sc start VMwareRESTAPI

:: 查看服务状态
sc query VMwareRESTAPI
```

#### Linux

```bash
# 启动 REST API 服务
vmrest &

# 创建 systemd 服务
sudo tee /etc/systemd/system/vmrest.service > /dev/null <<EOF
[Unit]
Description=VMware REST API Service
After=network.target vmware.service

[Service]
Type=simple
User=root
ExecStart=/usr/bin/vmrest
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable vmrest
sudo systemctl start vmrest
```

### 步骤 3：配置 REST API

#### 设置认证

首次启动 vmrest 时，会提示设置用户名和密码：

```
Please input username: admin
Please input password: ********
```

或者手动配置：

**Windows:** 编辑 `%APPDATA%\VMware\preferences.ini`

**Linux:** 编辑 `~/.vmware/preferences`

添加或修改：

```ini
webServer.enabled = "TRUE"
webServer.port = "8697"
webServer.https.port = "8697"
```

### 步骤 4：配置防火墙

#### Windows

```powershell
# 允许 REST API 端口
New-NetFirewallRule -DisplayName "VMware REST API" -Direction Inbound -Protocol TCP -LocalPort 8697 -Action Allow

# 验证规则
Get-NetFirewallRule -DisplayName "VMware REST API"
```

#### Linux

```bash
# Ubuntu/Debian
sudo ufw allow 8697/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8697/tcp
sudo firewall-cmd --reload
```

### 步骤 5：测试 REST API

```bash
# 测试连接（替换为实际的用户名和密码）
curl -k -u "admin:password" https://localhost:8697/api/vms

# 应该返回虚拟机列表（JSON 格式）
```

### 步骤 6：在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入"主机管理"页面
3. 点击"添加主机"
4. 填写配置：
   - **主机名称**：vmware-01
   - **主机类型**：VMware Workstation
   - **主机地址**：your-server-ip（或 localhost）
   - **主机端口**：8697
   - **用户名**：admin
   - **密码**：设置的密码
   - **虚拟机路径**：C:\Virtual Machines\（Windows）或 ~/vmware（Linux）
5. 点击"测试连接"
6. 点击"保存"

## 虚拟机管理

### 创建虚拟机

通过 OpenIDCS Web 界面创建虚拟机：

1. 进入"虚拟机管理"页面
2. 点击"创建虚拟机"
3. 填写配置：
   - **虚拟机名称**：my-vm
   - **操作系统**：选择操作系统类型
   - **CPU 核心数**：2
   - **内存大小**：4 GB
   - **磁盘大小**：40 GB
4. 点击"创建"

### 管理虚拟机

#### 电源操作

- **启动**：启动虚拟机
- **停止**：正常关闭虚拟机
- **强制关闭**：强制关闭虚拟机
- **重启**：重启虚拟机
- **暂停**：暂停虚拟机运行
- **恢复**：恢复暂停的虚拟机

#### 快照管理

```bash
# 通过 API 创建快照
curl -k -u "admin:password" -X POST \
  https://localhost:8697/api/vms/{vm-id}/snapshots \
  -H "Content-Type: application/json" \
  -d '{"name": "snapshot1", "description": "My first snapshot"}'

# 恢复快照
curl -k -u "admin:password" -X PUT \
  https://localhost:8697/api/vms/{vm-id}/snapshots/{snapshot-id}

# 删除快照
curl -k -u "admin:password" -X DELETE \
  https://localhost:8697/api/vms/{vm-id}/snapshots/{snapshot-id}
```

### 网络配置

#### 网络模式

VMware Workstation 支持以下网络模式：

| 模式 | 说明 | 使用场景 |
|------|------|----------|
| **Bridged** | 桥接模式，虚拟机直接连接到物理网络 | 需要虚拟机在局域网中可见 |
| **NAT** | 网络地址转换，虚拟机通过主机访问网络 | 共享主机网络连接 |
| **Host-only** | 仅主机模式，虚拟机只能与主机通信 | 隔离的测试环境 |
| **Custom** | 自定义网络 | 特殊网络需求 |

#### 配置网络

```bash
# 通过 API 配置网络
curl -k -u "admin:password" -X PUT \
  https://localhost:8697/api/vms/{vm-id}/nic/{nic-index} \
  -H "Content-Type: application/json" \
  -d '{
    "type": "nat",
    "vmnet": "vmnet8"
  }'
```

### 共享文件夹

```bash
# 添加共享文件夹
curl -k -u "admin:password" -X POST \
  https://localhost:8697/api/vms/{vm-id}/sharedfolders \
  -H "Content-Type: application/json" \
  -d '{
    "folder_id": "shared1",
    "host_path": "C:\\SharedFolder",
    "flags": 4
  }'
```

## VMware vSphere ESXi 配置

::: warning 注意
vSphere ESXi 支持目前处于开发阶段，功能可能不完整。
:::

### 系统要求

- VMware vSphere ESXi 6.7 或更高版本
- vCenter Server（可选，用于集群管理）
- 网络连接到 ESXi 主机的 443 端口

### 步骤 1：启用 SSH（可选）

1. 登录 ESXi Web 界面（https://esxi-host）
2. 进入"主机" > "管理" > "服务"
3. 找到"TSM-SSH"服务
4. 点击"启动"

### 步骤 2：配置防火墙

```bash
# SSH 登录 ESXi
ssh root@esxi-host

# 允许 API 访问
esxcli network firewall ruleset set --ruleset-id=httpClient --enabled=true

# 查看防火墙规则
esxcli network firewall ruleset list
```

### 步骤 3：获取 API 凭据

使用 ESXi 或 vCenter 的管理员账户：

- **用户名**：root（ESXi）或 administrator@vsphere.local（vCenter）
- **密码**：管理员密码

### 步骤 4：测试连接

```python
from pyVim.connect import SmartConnect
import ssl

# 禁用 SSL 验证（仅用于测试）
context = ssl._create_unverified_context()

# 连接到 ESXi
si = SmartConnect(
    host='esxi-host',
    user='root',
    pwd='password',
    port=443,
    sslContext=context
)

print("Connected to ESXi successfully!")

# 断开连接
from pyVim.connect import Disconnect
Disconnect(si)
```

### 步骤 5：在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入"主机管理"页面
3. 点击"添加主机"
4. 填写配置：
   - **主机名称**：esxi-01
   - **主机类型**：VMware vSphere ESXi
   - **主机地址**：esxi-host-ip
   - **主机端口**：443
   - **用户名**：root
   - **密码**：管理员密码
5. 点击"测试连接"
6. 点击"保存"

## 故障排查

### 问题 1：REST API 无法访问

**错误信息**：`Connection refused` 或 `Connection timeout`

**解决方案**：

```batch
:: Windows - 检查服务状态
sc query VMwareRESTAPI

:: 如果服务未运行，启动它
sc start VMwareRESTAPI

:: 检查端口监听
netstat -ano | findstr 8697
```

```bash
# Linux - 检查进程
ps aux | grep vmrest

# 重启服务
sudo systemctl restart vmrest

# 检查端口
sudo netstat -tlnp | grep 8697
```

### 问题 2：认证失败

**错误信息**：`401 Unauthorized`

**解决方案**：

1. 确认用户名和密码正确
2. 重新设置认证信息：

```bash
# 停止 vmrest
# Windows
sc stop VMwareRESTAPI

# Linux
sudo systemctl stop vmrest

# 删除认证文件
# Windows
del "%APPDATA%\VMware\preferences.ini"

# Linux
rm ~/.vmware/preferences

# 重新启动并设置认证
vmrest
```

### 问题 3：虚拟机无法启动

**解决方案**：

1. 检查虚拟机配置文件（.vmx）是否存在
2. 检查磁盘空间是否充足
3. 查看 VMware 日志：

**Windows:** `%APPDATA%\VMware\vmware.log`

**Linux:** `~/.vmware/vmware.log`

### 问题 4：网络不通

**解决方案**：

1. 检查虚拟网络编辑器配置
2. 确认网络适配器已连接
3. 检查防火墙规则
4. 重启 VMware 网络服务：

```batch
:: Windows
net stop "VMware NAT Service"
net start "VMware NAT Service"
net stop "VMware DHCP Service"
net start "VMware DHCP Service"
```

```bash
# Linux
sudo systemctl restart vmware-networks
```

## 高级配置

### 虚拟网络编辑器

#### Windows

1. 打开"虚拟网络编辑器"（以管理员身份运行）
2. 配置 VMnet 网络：
   - **VMnet0**：桥接模式
   - **VMnet1**：仅主机模式
   - **VMnet8**：NAT 模式
3. 配置 DHCP 和 NAT 设置

#### Linux

```bash
# 编辑网络配置
sudo vi /etc/vmware/networking

# 重启网络服务
sudo systemctl restart vmware-networks
```

### 性能优化

#### 虚拟机配置

编辑 .vmx 文件添加以下配置：

```ini
# 启用嵌套虚拟化
vhv.enable = "TRUE"

# 优化内存性能
MemTrimRate = "0"
sched.mem.pshare.enable = "FALSE"
prefvmx.useRecommendedLockedMemSize = "TRUE"

# 优化磁盘性能
scsi0.virtualDev = "lsilogic"
scsi0:0.mode = "persistent"

# 优化网络性能
ethernet0.virtualDev = "vmxnet3"
```

### 自动化脚本

#### 批量创建虚拟机

```python
import requests
import json

# API 配置
base_url = "https://localhost:8697/api"
auth = ("admin", "password")

# 虚拟机配置
vm_configs = [
    {"name": "vm1", "memory": 4096, "cpus": 2},
    {"name": "vm2", "memory": 8192, "cpus": 4},
    {"name": "vm3", "memory": 2048, "cpus": 1},
]

# 创建虚拟机
for config in vm_configs:
    response = requests.post(
        f"{base_url}/vms",
        auth=auth,
        json=config,
        verify=False
    )
    print(f"Created VM: {config['name']}, Status: {response.status_code}")
```

## 最佳实践

### 资源管理

1. **合理分配资源**：避免过度分配 CPU 和内存
2. **使用快照**：在重要操作前创建快照
3. **定期备份**：定期备份虚拟机文件
4. **监控性能**：使用 OpenIDCS 监控虚拟机性能

### 安全建议

1. **使用强密码**：为 REST API 设置强密码
2. **限制访问**：使用防火墙限制访问来源
3. **定期更新**：及时更新 VMware Workstation
4. **加密虚拟机**：对敏感虚拟机启用加密
5. **网络隔离**：使用不同的虚拟网络隔离虚拟机

### 维护建议

1. **定期清理**：删除未使用的虚拟机和快照
2. **磁盘整理**：定期整理虚拟磁盘
3. **日志管理**：定期清理日志文件
4. **性能监控**：监控主机和虚拟机性能

## 参考资源

- [VMware Workstation 官方文档](https://docs.vmware.com/en/VMware-Workstation-Pro/)
- [VMware REST API 文档](https://docs.vmware.com/en/VMware-Workstation-Pro/17.0/com.vmware.ws.using.doc/GUID-C3361DF5-A4C1-4C5C-950C-5AFAB8B68C6E.html)
- [vSphere API 文档](https://developer.vmware.com/apis/vsphere-automation/latest/)

## 下一步

- 🐳 查看 [Docker 配置](/vm/docker) 了解容器化管理
- 📦 查看 [LXD 配置](/vm/lxd) 了解系统容器管理
- 🚀 返回 [快速上手](/guide/quick-start) 开始使用
