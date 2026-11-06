# QEMU / KVM 部署

QEMU/KVM 是 Linux 上的通用虚拟化方案，主控通过 `virsh`（libvirt）管理。适合自建、可控成本的场景。

## 前置条件

- Linux（x86_64 / aarch64）
- CPU 开启 VT-x / AMD-V
- `/dev/kvm` 可访问

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo   # >0
ls -l /dev/kvm
```

## 安装

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst
sudo systemctl enable --now libvirtd
sudo usermod -aG libvirt,kvm $USER
newgrp libvirt
```

### RHEL / Rocky

```bash
sudo dnf install -y qemu-kvm libvirt virt-install virt-manager
sudo systemctl enable --now libvirtd
```

## 网络

```bash
# 默认 NAT 网络
virsh net-list --all
virsh net-start default
virsh net-autostart default

# 桥接（示例）
sudo ip link add name br0 type bridge
```

## 存储

```bash
# 默认镜像目录
ls /var/lib/libvirt/images

# 自定义池
virsh pool-define-as vms dir --target /data/vms
virsh pool-build vms
virsh pool-start vms
virsh pool-autostart vms
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `kvm-01` | `hs_name` |
| 服务器类型 | QEMU/KVM Platform | `QEMUServer` |
| 服务器地址 | `10.0.0.61` | 本地/SSH |
| 服务器用户 | `root` | 需能执行 virsh |
| 模板存储路径 | `/var/lib/libvirt/images` | 镜像 |
| 数据存储路径 | `/data/vms` | 实例磁盘 |

```bash
opidcs plat install qemu
opidcs host add --name kvm-01 --type QEMUServer --addr 10.0.0.61 --user root
opidcs host scanvm kvm-01
```

::: tip 改密码依赖 guest agent
QEMU 平台修改密码需要虚拟机内安装 `qemu-guest-agent`，否则只能通过控制台手动改。
:::

## 能力

| 项目 | 支持 |
|---|---|
| GPU / PCI / USB 直通 | ✅ |
| ISO / 数据盘 | ✅ |
| 上下行限速 | ✅ |
| 控制台 | noVNC（自动分配端口） |
| 备份 | `qemu-img` / libvirt 导出 |

## 镜像

```bash
# qcow2 基础镜像
qemu-img create -f qcow2 -b debian12.qcow2 -F qcow2 vm-01.qcow2 20G

# 导入到 libvirt
virsh vol-create-as vms vm-01.qcow2 20G --format qcow2
```

## 验证

```bash
virsh list --all
virsh dominfo <instance>
```

## 常见问题

| 现象 | 处理 |
|---|---|
| `permission denied /dev/kvm` | 加入 `kvm` 组 |
| 实例无网络 | 检查 libvirt 网络 / 桥接 |
| 无法改密 | 安装 qemu-guest-agent |
| 控制台端口冲突 | 检查 VNC 端口段配置 |
