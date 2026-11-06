# 虚拟平台

主控通过「服务器类型」（engine type）区分平台。类型列表由 `internal/driver/engine_config.go` 定义，`GET /api/system/engine` 返回当前系统可用的类型、注意事项与禁用字段。

## 平台清单

| 平台 | engine type | 运行位置 | 主控接入方式 | 默认状态 |
|---|---|---|---|---|
| Docker / Podman | `OCInterface` | Linux / macOS | 本地或 SSH 执行 `docker` | 启用 |
| LXC / LXD | `LxContainer` | Linux | 本地或 SSH 执行 `lxc` | 启用 |
| Proxmox VE | `PromoxSetup` | 独立宿主 | HTTPS API，默认 `:8006` | 启用 |
| VMware ESXi | `vSphereESXi` | 独立宿主 | HTTPS API，默认 `:443` | 启用 |
| Windows Hyper-V | `HyperVSetup` | Windows | WinRM，默认 `:5985` | 启用 |
| QEMU / KVM | `QEMUServer` | Linux | 本地或 SSH 执行 `virsh` | 启用 |
| Oracle VirtualBox | `VirtualBoxs` | Win / Linux / macOS | 本机 `VBoxManage` | 启用 |
| VMware Workstation | `VMWareSetup` | Windows | vmrest API，默认 `:8697` | 启用 |
| SmolVM（MicroVM） | `SmolVM` | Linux | 本地或 SSH | 启用 |
| MuMu 模拟器 | `MemuAndroid` | Windows | 本机 `memuc` | 启用 |

## 能力矩阵

表中「—」表示平台驱动未提供该能力，或该字段被引擎元信息禁用。

| 平台 | GPU / 显存 | PCI 直通 | USB 直通 | ISO 挂载 | 额外数据盘 | 上下行限速 | 控制台 |
|---|---|---|---|---|---|---|---|
| Docker | — | — | — | — | — | — | Web 终端 / 日志 |
| LXD | — | — | — | — | — | — | noVNC |
| Proxmox VE | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | noVNC |
| ESXi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | noVNC |
| Hyper-V | ✅（GPU-P/DDA） | ✅ | — | ✅ | ✅ | 仅取上下行较低值 | noVNC / RDP |
| QEMU / KVM | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | noVNC |
| VirtualBox | — | — | ✅（需扩展包） | ✅ | ✅ | ✅ | VRDE（RDP） |
| Workstation | 虚拟显存 | — | ✅ | ✅ | ✅ | ✅ | noVNC |
| SmolVM | — | — | — | — | — | — | SSH |
| MuMu | — | — | — | 以 APK 安装替代 | — | — | ADB |

::: warning 口径说明
「备份」不等于「快照」。主控提供的是基于平台能力的**备份 / 恢复 / 删除备份**（`CreateBackup / RestoreBackup / DeleteBackup`），并未抽象统一的「快照链」接口。是否支持取决于对应驱动实现。
:::

## 引擎元信息怎么用

`GET /api/system/engine` 返回结构示例（节选）：

```json
{
  "QEMUServer": {
    "type": "QEMUServer",
    "description": "QEMU/KVM Platform",
    "enabled": true,
    "is_remote": true,
    "platform": ["Linux"],
    "arch": ["x86_64", "aarch64"],
    "options": {},
    "messages": [
      "1、通过virsh/libvirt管理QEMU/KVM虚拟机",
      "2、支持PCI/USB设备直通",
      "3、VNC远程桌面（自动分配端口）",
      "4、修改密码需要虚拟机安装qemu-guest-agent"
    ],
    "ban_init": [],
    "ban_edit": [],
    "tab_lock": []
  }
}
```

- `ban_init` / `ban_edit`：创建/编辑时禁用的字段；
- `tab_lock`：详情页锁住的页签（`pci / usb / iso / hdd / efi / gpu`）；
- `messages`：展示在表单顶部的注意事项。

前端不维护第二份平台能力表，避免「文档说支持、表单却报错」。

## 平台选择建议

| 场景 | 推荐 |
|---|---|
| 轻量容器、快速交付 | Docker（或 LXD，取决于是否需要 systemd 环境） |
| 通用 KVM 虚拟机、可控成本 | Proxmox VE / QEMU |
| 已有 VMware 体系 | ESXi / Workstation（Windows 单机） |
| Windows 生态、Hyper-V 集群 | Hyper-V |
| 桌面级测试机 | VirtualBox（本机） |
| 极轻量 MicroVM | SmolVM（需 KVM + Firecracker/Cloud-Hypervisor） |
| 安卓云手机 | MuMu（Windows） |

## 相关页面

- 安装各平台运行时：[虚拟化平台部署](/deploy/platform/)
- 把主机填进主控：[主机配置详解](/deploy/host-config/)
- 各平台表单限制：[实例管理](/usage/vms)
