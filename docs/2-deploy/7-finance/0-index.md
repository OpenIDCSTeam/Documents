# 财务系统对接总览

财务插件把「售卖」接到主控。插件是 PHP 模块，放进 `CloudHost/plugins/`，随主控一起管理。

## 插件清单

快简云（Quick IDC）维护的三个插件：

| 插件 | 目标系统 | 目录 | 入口文件 |
|---|---|---|---|
| `QuickIDC-IDCSmart` | 魔方财务 | `plugins/QuickIDC-IDCSmart` | `idcserver.php` |
| `QuickIDC-SwapIDC` | SwapIDC | `plugins/QuickIDC-SwapIDC` | `openidc.php` |
| `QuickIDC-XiaoHei` | 小黑云 | 单独发布 | — |

仓库里还有三个第三方插件，由对应面板方维护，接入步骤相同：`LxdServer-IDCSmart`（魔方财务 LXD 专版）、`Easypanel-SwapIDC`、`VistaPanel-SwapIDC`。

`QuickIDC-XiaoHei` 不在主仓库的 `plugins/` 目录里，拿到插件包后按同样的方式上传即可。

## 对接前准备

1. 主控已部署并能创建实例；
2. 至少一台在线主机（`hs_name` 已知）；
3. 主控开启 HTTPS（强烈建议）；
4. 取得 Bearer Token：

```bash
quickidc conf token show --core 0
# 或在「系统设置 → 令牌」查看/重置
```

## 通用流程

```mermaid
flowchart LR
    A[上传插件目录] --> B[财务系统启用模块]
    B --> C[填写主控地址 + Token]
    C --> D[选择主机 hs_name]
    D --> E[配置套餐/镜像]
    E --> F[下单测试]
    F --> G[主控创建实例]
    G --> H[用户拿到控制台]
```

## 插件目录结构

```text
plugins/QuickIDC-IDCSmart/
├── idcserver.php          # 模块入口（ConfigOptions / CreateAccount / ...）
└── templates/
    ├── info.html          # 产品详情
    ├── ipv4.html          # IPv4 管理
    ├── ipv6.html          # IPv6 管理
    ├── nat.html           # 端口转发
    └── proxy.html         # 反向代理

plugins/LxdServer-IDCSmart/
├── lxdserver.php
└── templates/{info,ipv6,nat,proxy}.html
```

## 安全要求

- 插件与主控之间必须 HTTPS，禁止明文 Token 走公网；
- 插件目录不要暴露目录索引；
- Token 泄露等同于主控管理员权限，轮换后记得同步所有插件；
- 财务系统的回调地址建议加 IP 白名单。

## 逐系统文档

- [魔方财务 IDCSmart](/deploy/finance/idcsmart)
- [SwapIDC](/deploy/finance/swapidc)
- [小黑云](/deploy/finance/xiaohei)
- 第三方插件：[LxdServer-IDCSmart](/deploy/finance/lxdserver-idcsmart)、[Easypanel-SwapIDC](/deploy/finance/easypanel-swapidc)、[VistaPanel-SwapIDC](/deploy/finance/vistapanel-swapidc)
