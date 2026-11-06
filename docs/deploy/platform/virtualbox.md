# Oracle VirtualBox 部署

VirtualBox 适合单机桌面级测试。注意：该平台引擎的 `is_remote = false`，**主控必须与 VirtualBox 安装在同一台机器**，不能通过远程地址接入。

## 前置条件

- Windows / Linux / macOS（x86_64 或 aarch64）
- 已开启硬件虚拟化
- 建议安装 Extension Pack（USB 直通、VRDE）

## 安装

### Windows

1. 下载 VirtualBox 安装包，双击安装；
2. 安装 Extension Pack；
3. 确认 `VBoxManage` 在 PATH：

```powershell
VBoxManage --version
```

### Linux

```bash
sudo apt install -y virtualbox virtualbox-ext-pack
sudo usermod -aG vboxusers $USER
newgrp vboxusers
VBoxManage --version
```

### macOS

```bash
brew install --cask virtualbox
VBoxManage --version
```

## 配置

```bash
# 查看虚拟机
VBoxManage list vms

# 查看 VRDE 设置（远程桌面）
VBoxManage showvminfo "<vm>" | grep -i vrde

# 开启 VRDE
VBoxManage modifyvm "<vm>" --vrde on --vrdeport 5000
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `vbox-local` | `hs_name` |
| 服务器类型 | Oracle VirtualBox | `VirtualBoxs` |
| 服务器地址 | 留空 / `localhost` | **必须本机** |
| 模拟器/程序路径 | `C:\Program Files\Oracle\VirtualBox` | VBoxManage 所在目录 |
| 模板存储路径 | `D:\VBox\Images` | 镜像 |
| 数据存储路径 | `D:\VBox\VMs` | 实例目录 |

```bash
opidcs plat install virtualbox
opidcs host add --name vbox-local --type VirtualBoxs --addr localhost
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | ❌（仅虚拟显卡） |
| PCI 直通 | ❌ |
| USB 直通 | ✅（需 Extension Pack） |
| ISO / 数据盘 | ✅ |
| 上下行限速 | ✅ |
| 控制台 | VRDE（RDP） |

## 验证

```bash
VBoxManage list runningvms
```

主控主机状态在线、实例列表可见。

## 常见问题

| 现象 | 处理 |
|---|---|
| 主控无法连接 | 确认主控与 VirtualBox 同机 |
| USB 不可用 | 安装 Extension Pack 并启用 USB 控制器 |
| RDP 连不上 | 检查 VRDE 端口与防火墙 |
| 创建失败 | 检查虚拟机目录权限 |
