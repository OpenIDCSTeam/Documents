# 主机配置详解

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>每个平台的连接参数、权限要求与路径约定差异较大，本页只给出字段口径与通用流程；<strong>各平台正文由维护者逐页补充</strong>。</p>
</div>

## 主机是什么

一台「主机」= 一个已安装虚拟化运行时、可被主控管理的节点。主控保存它的连接方式、存储路径、网络参数与配额。

## 新增主机的通用流程

1. **选类型**：服务器类型决定表单可用字段（GPU、ISO、数据盘等）。
2. **填连接**：API 平台填地址 + 账号；命令通道平台填 SSH 地址 + 账号。
3. **填路径**：模板、光盘、系统盘、数据盘、备份目录（宿主机视角）。
4. **配网络**：公网 IP、直连/中转、爱快地址、端口区间。
5. **保存并测试**：状态变为「在线」，再拉取实例列表。

## 通用字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `name` | ✅ | 主机显示名（唯一） |
| `type` | ✅ | 引擎类型，见下表 |
| `server_addr` | ✅ | `host[:port]`；留空/localhost 表示本机；`ssh://` 前缀表示 SSH 转发 |
| `server_user` | 远程必填 | SSH / API 账号 |
| `server_pass` | 远程必填 | 密码 |
| `filter_name` | 建议 | 只纳管带该前缀的实例，避免误管 |
| `server_port` | 视平台 | API / 服务端口 |
| `public_addr` | 建议 | 公网 IP，多个用逗号分隔 |
| `proxy_mode` | 建议 | `direct` / `relay` |
| `images_path` | 建议 | 模板/镜像 |
| `dvdrom_path` | 视平台 | ISO |
| `system_path` | 建议 | 系统盘 |
| `extern_path` | 建议 | 数据盘 |
| `backup_path` | 建议 | 备份 |
| `ports_start` / `ports_close` | 建议 | NAT 端口区间 |
| `limits_nums` | 建议 | 单主机实例上限 |

## 引擎类型对照

| 平台 | type | 接入 |
|---|---|---|
| Docker | `OCInterface` | 本地 / SSH |
| LXD | `LxContainer` | 本地 / SSH |
| Proxmox VE | `PromoxSetup` | API `8006` |
| ESXi | `vSphereESXi` | API `443` |
| Hyper-V | `HyperVSetup` | WinRM `5985` |
| QEMU | `QEMUServer` | 本地 / SSH |
| VirtualBox | `VirtualBoxs` | 仅本机 |
| Workstation | `VMWareSetup` | API `8697` |
| SmolVM | `SmolVM` | 本地 / SSH |
| MuMu | `MemuAndroid` | 仅本机 |

## 用命令行登记

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host list
opidcs host show pve-lab
opidcs host status pve-lab
```

## 逐平台页面

- [Docker / Podman](/deploy/host-config/docker)
- [LXC / LXD](/deploy/host-config/lxd)
- [SmolVM](/deploy/host-config/smolvm)
- [QEMU / KVM](/deploy/host-config/qemu)
- [VirtualBox](/deploy/host-config/virtualbox)
- [VMware Workstation](/deploy/host-config/vmware)
- [VMware ESXi](/deploy/host-config/esxi)
- [Proxmox VE](/deploy/host-config/proxmox)
- [Hyper-V](/deploy/host-config/hyperv)
- [MuMu 模拟器](/deploy/host-config/memu)
