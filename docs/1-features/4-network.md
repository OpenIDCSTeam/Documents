# 网络与端口

网络这块分三层：主控跟宿主机的管理通道、实例对外暴露用的 NAT、域名访问用的反向代理。这页说清三者的边界。

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

适合没有独立公网 IP、但要把端口露出去的场景，比如游戏服、面板、SSH。规则按主机 + 实例 + 公网端口 + 内网端口存，只支持 TCP。规则跟着实例记录走，删实例时可以选择一并回收。真正下发由平台驱动来做：写 iptables、调爱快、改云厂商安全组，看平台而定。接口是 `GET/POST/DELETE /api/client/nat*`。

```bash
# 命令行查看某主机的全部转发
quickidc port list --core 0
```

## 爱快（iKuai）联动

爱快干两件事：按实例 MAC 做 DHCP 静态绑定，分配固定内网 IP；再做 ARP 绑定，防 IP 冲突和漂移。主控在主机配置里存爱快地址与账号（`i_kuai_addr / i_kuai_user / i_kuai_pass`），实例网络页执行绑定或解绑：

```text
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid
```

::: warning 网络设置正文待补充
爱快的安装、VLAN、DHCP、端口映射拓扑由项目维护者亲自撰写，见 [网络设置](/deploy/network)。本页只说明主控侧的行为。
:::

## 反向代理（Caddy）

主控以子进程方式托管 Caddy，自己维护 `Caddyfile`。二进制从 `CADDY_BIN` 或 `bin/caddy` 找，Admin API 在 `2019`，配置文件是 `<dataDir>/Caddyfile`。规则就是域名指向实例端口，证书由 Caddy 自动申请续期，前提是 80/443 能从公网进来。

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
