# 网络设置

本平台网络管理依赖[爱快软路由](https://www.ikuai8.com/)提供支持，通过API调用爱快实现DHCP/IP分配、ARP绑定、上下带宽限制等功能

## 安装爱快

1. 前往[爱快路由系统下载](https://www.ikuai8.com/component/download)下载`ISO 64位镜像`

2. 在虚拟机所在主机安装，参考[爱快路由系统安装](https://www.ikuai8.com/component/install)，此处以PVE为例
  - 


## 设置爱快

## 本页将覆盖的内容

- [ ] 爱快 iKuai 安装（物理机 / 虚拟机 / U 盘）
- [ ] WAN / LAN 口绑定与上网配置
- [ ] DHCP 服务与静态地址池
- [ ] 与快简云（Quick IDC）的联动（`i_kuai_addr / i_kuai_user / i_kuai_pass`）
- [ ] NAT 端口映射（DNAT）与回流
- [ ] 多公网 IP / 共享 IP 的设备名规划（`network_nat` / `network_pub`）
- [ ] 主控侧「直连 / 中转」模式的选择
- [ ] 常见拓扑：单公网 IP、多公网 IP、纯内网

## 主控侧已经实现的行为

在网络正文补齐前，先给出代码层面的确定事实，避免配置时踩空：

### 主机字段

| 字段 | 作用 |
|---|---|
| `i_kuai_addr` | 爱快管理地址（含端口，如 `http://10.0.0.1:80`） |
| `i_kuai_user` | 爱快账号 |
| `i_kuai_pass` | 爱快密码 |
| `proxy_mode` | `direct` 直连 / `relay` 经爱快中转 |
| `relay_addr` | 中转地址，留空取 `public_addr` |
| `public_addr` | 服务器公网 IP（可多个，逗号分隔） |
| `network_nat` | 共享 IP 设备名（如 `nat`） |
| `network_pub` | 独立 IP 设备名（如 `pub`） |
| `ports_start` / `ports_close` | TCP 端口分配区间 |
| `remote_port` | VNC 服务端口 |

### 接口

```text
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid      DHCP 静态绑定 + ARP
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid      解除绑定
GET    /api/client/natget/:hs_name/:vm_uuid           端口映射列表
POST   /api/client/natadd/:hs_name/:vm_uuid           新增映射
DELETE /api/client/natdel/:hs_name/:vm_uuid/:rule_index 删除映射
```

### 端口

| 端口 | 用途 |
|---|---|
| 1881 | 主控 |
| 6080 | VNC 代理 |
| 7681 | Web SSH |
| 2019 | Caddy Admin（仅本机） |

## 先读这些

- [网络与端口（特性说明）](/features/network)
- [端口转发教程](/usage/nat)
- [反向代理教程](/usage/proxies)
