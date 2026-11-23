# Proxmox VE 网卡配置

iKuai 这台虚拟机要两张网卡：一张接公网（WAN），一张接内网（LAN）。公网直接用 PVE 默认的 `vmbr0`，内网再建一个桥。

## 建内网网桥

数据中心 → 节点 → 系统 → 网络 → 创建 → Linux Bridge：

| 字段 | 值 |
|---|---|
| 名称 | `vmbr1` |
| IPv4/CIDR | 留空，地址由 iKuai 分配 |
| 网关 | 留空 |
| 桥接端口 | 不填，或填宿主机第二块物理网卡 |

内网桥不要配网关，否则宿主机的默认路由会和 iKuai 抢。

## 挂到 iKuai

打开 iKuai 虚拟机的硬件页，两张网卡都按下面配：

| 网卡 | Bridge | Model | Firewall |
|---|---|---|---|
| 网卡 1（公网） | `vmbr0` | VirtIO | 不勾 |
| 网卡 2（内网） | `vmbr1` | VirtIO | 不勾 |

截图见[网络设置](/deploy/network)里的安装步骤。

## 验证

- iKuai 控制台里 eth0、eth1 都显示「已连接」；
- 内网实例能 ping 通 iKuai 的 LAN 口地址。
