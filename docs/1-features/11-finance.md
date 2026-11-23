# 财务系统对接

财务插件把「售卖」接到主控：用户在下单系统付款，插件调用主控 API 创建实例，并把控制台入口回给用户。

## 插件清单

快简云（Quick IDC）自己维护三个插件：

| 插件 | 目标系统 | 目录 |
|---|---|---|
| `QuickIDC-IDCSmart` | 魔方财务（IDCSmart） | `plugins/QuickIDC-IDCSmart` |
| `QuickIDC-SwapIDC` | SwapIDC | `plugins/QuickIDC-SwapIDC` |
| `QuickIDC-XiaoHei` | 小黑云 | 单独发布，主仓库未附带 |

`plugins/` 里还放着三个第三方插件：`LxdServer-IDCSmart`（魔方财务 LXD 专版）、`Easypanel-SwapIDC`、`VistaPanel-SwapIDC`。它们由对应面板方维护，不是快简云的插件，接入方式与上面三个一样。

## 对接模型

```text
财务系统（下单/续费/暂停/删除）
      │  Server Module（PHP 插件）
      ▼
CloudHost REST API（Bearer Token）
      │
      ▼
宿主机平台（Docker / LXD / Proxmox / …）
```

插件配置只有三项：主控地址（如 `https://idc.example.com`）、Bearer Token（「系统设置 → 令牌」，或 `quickidc conf token show` 查看）、主机标识 `hs_name`（主控里的一台主机）。

## 通用能力

| 动作 | 插件调用 | 主控接口 |
|---|---|---|
| 开通 | 创建实例 | `POST /api/client/create/:hs_name` |
| 续费 | 修改到期时间 | `PUT /api/client/update/:hs_name/:uuid` |
| 暂停 | 关机 / 暂停 | `POST /api/client/powers/:hs_name/:uuid` |
| 解除暂停 | 开机 | 同上 |
| 删除 | 删除实例 | `DELETE /api/client/delete/:hs_name/:uuid` |
| 控制台 | 临时登录 | `GET /api/client/templogin` |

## 安全建议

- 插件与主控之间必须 HTTPS；
- 每个财务系统使用独立 Token（当前为单 Token 模型，建议在网络层做来源限制）；
- 插件目录不要暴露在公网；
- 定期轮换 Token，并在轮换后更新插件配置。

## 分平台文档

- [魔方财务 IDCSmart](/deploy/finance/idcsmart)
- [SwapIDC](/deploy/finance/swapidc)
- [小黑云](/deploy/finance/xiaohei)
- 第三方插件：[LxdServer-IDCSmart](/deploy/finance/lxdserver-idcsmart)、[Easypanel-SwapIDC](/deploy/finance/easypanel-swapidc)、[VistaPanel-SwapIDC](/deploy/finance/vistapanel-swapidc)
