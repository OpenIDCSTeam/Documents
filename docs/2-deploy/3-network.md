# 网络设置

本平台网络管理依赖[iKuai软路由](https://www.ikuai8.com/)提供支持，爱快支持所有全虚拟化平台

通过API调用爱快实现DHCP/IP分配、ARP绑定、上下带宽限制等高级功能

注意事项：

1. **并非**每个主机都需要安装iKuai系统，一个IP分配区安装一个即可
2. Docker和LXC容器平台不需要安装iKuai系统，请直接跳过本教程

## 这一章怎么读

先看运行原理搞清地址怎么分，再按平台设置给自己用的虚拟化平台配好网卡，最后照着安装教程装 iKuai。

| 内容 | 说明 |
|---|---|
| [运行原理 · IPv4](/deploy/network/ipv4) | 内网 NAT、公网独立 IP、混合三种分配模式与地址结构 |
| [运行原理 · IPv6](/deploy/network/ipv6) | 公网 / 内网两种模式、地址池字段与和 IPv4 的差异 |
| 平台设置 | 各平台挂两张网卡的做法，见下表 |
| [安装教程](/deploy/network/install) | 下载镜像、装 iKuai、绑网卡、配网段与 DHCP |

## 平台设置

| 平台 | 做法 |
|---|---|
| [Proxmox VE](/deploy/network/pve) | `vmbr0` 公网 + 新建 `vmbr1` 内网 |
| [ESXi](/deploy/network/esxi) | 公网端口组 + 不带上行的 vSwitch |
| [KVM / QEMU](/deploy/network/kvm) | `br0` / `br1` 两个网桥 |
| [Hyper-V](/deploy/network/hyperv) | 外部交换机 + 内部交换机 |
| [VirtualBox](/deploy/network/virtualbox) | 桥接网卡 + 仅主机网络 |
| [VMware Workstation](/deploy/network/workstation) | `VMnet0` + `VMnet1` |
| [Docker / LXC](/deploy/network/container) | 不需要爱快 |

Docker 和 LXC 直接在宿主机分配地址，对外暴露交给主控的端口转发与反向代理，不用装爱快。

## 参考内容

- [网络端口](/features/network)
- [端口转发](/usage/nat)
- [反向代理](/usage/proxies)
