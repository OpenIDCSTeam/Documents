# VirtualBox 网卡配置

VirtualBox 用「桥接网卡 + 仅主机网络」做内外网。

## 建网络

1. 管理 → 主机网络管理器，确认有一块 `VirtualBox Host-Only Ethernet Adapter`，没有就新建；
2. 双击这块网卡，取消勾选「启用 DHCP 服务器」——DHCP 交给 iKuai，两边都开会抢地址；
3. 网卡 IPv4 设成和内网不冲突的地址，比如 `10.10.10.1/24`，或者干脆不配。

## 挂到 iKuai

iKuai 虚拟机 → 设置 → 网络：

| 网卡 | 连接方式 | 界面名称 | 高级 → 混杂模式 |
|---|---|---|---|
| 网卡 1（公网） | 桥接网卡 | 公网物理网卡 | 全部允许 |
| 网卡 2（内网） | 仅主机（Host-Only）网络 | `VirtualBox Host-Only Ethernet Adapter` | 全部允许 |

## 验证

- 虚拟机窗口里 iKuai 控制台显示 eth0、eth1 已连接；
- 宿主机用 Host-Only 网卡的地址能打开 iKuai 的 Web 管理页。
