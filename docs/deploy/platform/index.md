# 虚拟化平台部署总览

主控本身不跑虚拟机，它管理的是**已经装好运行时的宿主机**。这一节按平台给出运行时安装、管理通道开放与验证命令。

## 选择平台

| 你的场景 | 建议平台 | 页面 |
|---|---|---|
| 只跑容器、要快 | Docker / Podman | [Docker](/deploy/platform/docker) |
| 要 systemd 环境、轻量隔离 | LXC / LXD | [LXD](/deploy/platform/lxd) |
| 通用 KVM、要 Web 管理 | Proxmox VE | [Proxmox VE](/deploy/platform/proxmox) |
| 已有 VMware 虚拟化 | ESXi | [ESXi](/deploy/platform/esxi) |
| Windows 生态 | Hyper-V | [Hyper-V](/deploy/platform/hyperv) |
| 自己管 KVM / libvirt | QEMU / KVM | [QEMU](/deploy/platform/qemu) |
| 单机桌面测试 | VirtualBox | [VirtualBox](/deploy/platform/virtualbox) |
| Windows 桌面虚拟机 | VMware Workstation | [Workstation](/deploy/platform/vmware) |
| 极轻量 MicroVM | SmolVM | [SmolVM](/deploy/platform/smolvm) |
| 安卓云手机 | MuMu | [MuMu](/deploy/platform/memu) |

## 部署流程（每个平台通用）

```mermaid
flowchart LR
    A[安装运行时] --> B[启用管理通道]
    B --> C[验证命令]
    C --> D[准备镜像/存储目录]
    D --> E[主控新增主机]
    E --> F[创建测试实例]
```

## 两种接入方式

| 方式 | 适用平台 | 主控如何连 |
|---|---|---|
| **API** | Proxmox（8006）、ESXi（443）、Hyper-V（5985）、Workstation（8697） | 主机地址 + 账号密码 |
| **命令通道** | Docker、LXD、QEMU、SmolVM | 本地执行，或 SSH 到宿主机执行 |
| **仅本机** | VirtualBox、MuMu | 主控必须与运行时同机 |

::: warning 命令通道的权限
SSH 接入时，主控使用的账号必须能免密（或密码）执行 `docker` / `lxc` / `virsh` 等命令。推荐把账号加入对应用户组，而不是直接用 root。
:::

## 主控侧配置命令

平台运行时装好后，用 `opidcs` 把主机登记进主控（也可以在 Web 界面操作）：

```bash
# 查看本机可安装/已安装的平台
opidcs plat list

# 安装平台运行时（交互式）
opidcs plat install

# 直接指定平台
opidcs plat install docker
opidcs plat install lxd
opidcs plat install smolvm

# 查看平台详情与回填主控所需的参数
opidcs plat show docker
opidcs plat credentials show docker
```

`plat install` 会按当前操作系统过滤可用平台：

| 系统 | 可安装 |
|---|---|
| Linux | docker、lxd、smolvm、qemu、virtualbox |
| macOS | docker、smolvm（VirtualBox 视版本） |
| Windows | docker（Desktop）、hyperv、vmware（Workstation）、memu、virtualbox |

## 平台安装后的统一检查

```bash
# 虚拟化能力
egrep -c '(vmx|svm)' /proc/cpuinfo      # Linux，>0 表示开启
systeminfo | findstr /i virtualization  # Windows

# 运行时
docker version
lxc list
virsh list --all
VBoxManage list vms
```

## 下一步

- [把主机填进主控](/deploy/host-config/)
- [网络设置](/deploy/network)
- [镜像与 CloudInit](/deploy/images)
