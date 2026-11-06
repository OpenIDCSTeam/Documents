# 部署教程总览

先用一台 Linux 跑通快速体验，再按需要接入其他平台、网络与财务系统。已有环境可以直接跳到对应章节。

## 章节导航

| 章节 | 内容 | 适合谁 |
|---|---|---|
| [快速体验](/deploy/quick-start) | 一台 Linux 跑通主控 + Docker + 第一台容器 | 第一次接触 |
| [主控安装](/deploy/core-install) | Linux / Windows / macOS、源码与参数 | 所有人 |
| [虚拟平台部署](/deploy/platform/) | Docker、LXD、Proxmox、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM、MuMu | 需要接平台的人 |
| [网络设置](/deploy/network) | 爱快安装、DHCP、NAT、拓扑 | 自建网络的人 |
| [主机配置](/deploy/host-config/) | 每个平台如何填进主控 | 接平台的人 |
| [镜像与初始化](/deploy/images) | 成品镜像、自制镜像、CloudInit | 要做模板的人 |
| [CloudInit](/deploy/cloudinit) | 虚拟机内 Agent 的安装与配置 | 需要 IP 上报/改密 |
| [财务对接](/deploy/finance/) | IDCSmart、SwapIDC、Easypanel、VistaPanel | 需要对接销售系统的人 |

## 全链路流程图

```mermaid
flowchart TD
    A[准备服务器<br/>Linux 2C4G 起] --> B[安装 CloudHost<br/>默认 1881]
    B --> C{选择虚拟化平台}
    C -->|容器| D1[Docker / LXD]
    C -->|虚拟机| D2[Proxmox VE / QEMU / ESXi / Hyper-V]
    C -->|桌面级| D3[VirtualBox / Workstation / MuMu]
    C -->|MicroVM| D4[SmolVM]
    D1 --> E[平台运行时安装<br/>开放管理通道]
    D2 --> E
    D3 --> E
    D4 --> E
    E --> F[主机管理 → 新增主机<br/>地址 / 账号 / 路径]
    F --> G{需要公网访问?}
    G -->|是| H[爱快 DHCP + NAT<br/>或 Caddy 反向代理]
    G -->|否| I[内网直接使用]
    H --> J[镜像 / CloudInit 准备]
    I --> J
    J --> K[创建实例并验证控制台]
    K --> L{需要售卖?}
    L -->|是| M[安装财务插件<br/>回填地址与 Token]
    L -->|否| N[完成]
```

## 三种典型拓扑

### 1. 单机全栈（体验 / 小规模）

```text
一台 Linux
├── CloudHost（1881）
├── Docker / LXD
└── Caddy（可选）
```

主控与平台同机，主机地址填 `localhost` 或留空即可。

### 2. 主控 + 多台宿主机（常见生产）

```text
CloudHost（公网 / 内网）
   ├── Proxmox VE 10.0.0.21:8006
   ├── LXD      10.0.0.32（SSH）
   └── Hyper-V  10.0.0.44:5985
```

主控通过 API / SSH 管理宿主机；用户只访问主控。

### 3. 主控 + 爱快中转（无独立公网 IP）

```text
用户 → 公网 IP（爱快） → DNAT → 实例
主控 → 爱快 API（DHCP 静态绑定）
```

主机配置的「反向代理模式」选 `relay`，并填写中转地址。

## 端口清单

| 端口 | 服务 | 说明 |
|---|---|---|
| 1881 | CloudHost HTTP | 面板与 API，建议反代 443 |
| 6080 | VNC 代理 | 可走 `wss` |
| 7681 | Web SSH | 建议限制来源 |
| 2019 | Caddy Admin | 仅本机 |
| 8006 / 443 / 5985 / 8697 | 平台 API | 仅主控可达 |

## 部署前检查

- [ ] 服务器虚拟化已开启（`egrep -c '(vmx|svm)' /proc/cpuinfo` 大于 0）
- [ ] 时间同步（`timedatectl` / NTP）
- [ ] 磁盘规划：系统盘之外预留镜像与备份目录
- [ ] 防火墙放行主控与平台端口
- [ ] 准备好 Bearer Token 的存放位置（首次启动生成，等同管理员初始密码）

## 下一步

1. [安装主控](/deploy/core-install)
2. [选择并部署平台](/deploy/platform/)
3. [把主机填进主控](/deploy/host-config/)
