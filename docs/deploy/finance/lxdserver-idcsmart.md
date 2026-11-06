# LxdServer-IDCSmart 对接

`LxdServer-IDCSmart` 是魔方财务的 LXD 专版模块，面向以 LXD 为主力的售卖场景。它与通用版共享主控 API，差异在配置项与模板。

## 目录

```text
plugins/LxdServer-IDCSmart/
├── lxdserver.php
└── templates/
    ├── info.html
    ├── ipv6.html
    ├── nat.html
    └── proxy.html
```

::: info 没有 ipv4.html
LXD 专版模板只包含 `info / ipv6 / nat / proxy`，IPv4 相关展示并入 `info.html`；这是与通用版的主要结构差异。
:::

## 安装

```bash
cp -r plugins/LxdServer-IDCSmart /path/to/idcsmar/modules/server/lxdserver
chown -R www-data:www-data /path/to/idcsmar/modules/server/lxdserver
```

在魔方后台「产品 → 服务器模块」选择 `LxdServer-IDCSmart`，新建服务器组。

## 配置项

| 配置 | 说明 | 示例 |
|---|---|---|
| 主机名称 / `host_name` | 主控中的 LXD 主机标识 | `lxd-edge` |
| 主控地址 | CloudHost 地址 | `https://idc.example.com` |
| Bearer Token | 管理员令牌 | `6f1c…` |
| 默认镜像 | LXD 镜像别名 | `debian12` |
| CPU / 内存 / 磁盘 | 套餐规格 | `2 / 2048 / 40` |
| 网络设备 | LXD 网桥 / 网络名 | `lxdbr0` |

## 与通用版的差异

| 项目 | 通用版 | LXD 专版 |
|---|---|---|
| 入口文件 | `idcserver.php` | `lxdserver.php` |
| 模板 | 含 `ipv4.html` | 无 `ipv4.html` |
| 适用平台 | 任意已启用平台 | 以 LXD 为主 |
| 网络模型 | 通用 NAT/反代 | 偏向 LXD 网桥 + NAT |

## 开通与验证

与 [IDCSmart](/deploy/finance/idcsmart) 一致：

- [ ] 下单后 LXD 出现实例
- [ ] 实例 IP 正确
- [ ] 控制台（noVNC）可打开
- [ ] 删除后实例与 NAT 规则回收

## 常见问题

| 现象 | 处理 |
|---|---|
| 实例无 IP | 检查 LXD 网桥与 DHCP |
| 模板 404 | 确认 `templates/` 完整上传 |
| 开通卡住 | 查看主控任务详情的平台错误 |
