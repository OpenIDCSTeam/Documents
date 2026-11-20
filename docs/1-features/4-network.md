# 网络与端口

OpenIDCS 的网络能力分三层：**主控与宿主机之间的管理通道**、**实例的对外暴露（NAT）**、**域名访问（反向代理）**。这一页讲清三层的边界。

## 三层模型

```text
用户浏览器
   │  80/443
   ▼
Caddy（主控托管）──► 反向代理规则 ──► 实例 IP:端口
   │
   │  管理流量
   ▼
CloudHost 主控 ──► 宿主机（SSH / API）
   │
   │  NAT 规则
   ▼
公网 IP:端口 ──► 实例内网 IP:端口
```

## NAT 端口转发

用于「没有独立公网 IP、但需要暴露端口」的场景（游戏服、面板、SSH）。

- 规则维度：主机 + 实例 + 公网端口 + 内网端口（TCP）；
- 存储：规则随实例记录保存，删除实例时可选择一并回收；
- 下发：由平台驱动写入 iptables / 爱快 / 云厂商安全组（视平台而定）；
- 接口：`GET/POST/DELETE /api/client/nat*`。

```bash
# 命令行查看某主机的全部转发
opidcs port list --core 0
```

## 爱快（iKuai）联动

爱快承担两件事：

1. **DHCP 静态绑定**：按实例 MAC 分配固定内网 IP；
2. **ARP 绑定**：防止 IP 冲突与漂移。

主控在主机配置里保存爱快地址与账号（`i_kuai_addr / i_kuai_user / i_kuai_pass`），在实例网络页执行绑定/解绑：

```text
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid
```

::: warning 网络设置正文待补充
爱快的安装、VLAN、DHCP、端口映射拓扑由项目维护者亲自撰写，见 [网络设置](/deploy/network)。本页只说明主控侧的行为。
:::

## 反向代理（Caddy）

主控以子进程方式托管 Caddy，并维护 `Caddyfile`：

- 二进制位置：`CADDY_BIN` 环境变量，或 `bin/caddy`；
- 管理端口：Caddy Admin API `2019`；
- 配置文件：`<dataDir>/Caddyfile`；
- 能力：域名 → 实例端口，自动申请/续期证书（需要 80/443 可达）。

接口：

```text
GET    /api/client/proxys/list                        用户可见代理
POST   /api/client/proxys/create/:hs_name/:vm_uuid    新建
PUT    /api/client/proxys/update/:hs_name/:vm_uuid/:idx
DELETE /api/client/proxys/delete/:hs_name/:vm_uuid/:idx
GET    /api/admin/proxys/list                          管理员全量
```

## 两种代理模式

主机配置里的「反向代理模式」决定流量怎么走：

| 模式 | 适用 | 行为 |
|---|---|---|
| `direct` 直连 | 主控与平台同机 / 同内网 | 反代直接指向实例内网 IP |
| `relay` 中转 | 主控在公网、实例在爱快后面 | 反代指向爱快中转地址，再由爱快 DNAT |

相关字段：`relay_addr`、`vnc_ip`、`vnc_wan`、`network_nat`、`network_pub`。

## 端口规划建议

| 端口 | 用途 | 是否对外 |
|---|---|---|
| 1881 | 主控 Web / API | 建议仅反代 443 暴露 |
| 6080 | VNC 代理 | 可反代为 `wss://` |
| 7681 | Web SSH | 建议仅管理员网段 |
| 2019 | Caddy Admin | **仅本机** |
| 8006 / 443 / 5985 | 平台 API | 仅主控可达 |

## 相关页面

- [端口转发教程](/usage/nat)
- [反向代理教程](/usage/proxies)
- [网络设置（爱快）](/deploy/network)
