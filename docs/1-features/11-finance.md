# 财务系统对接

财务插件把「售卖」接到主控：用户在下单系统付款，插件调用主控 API 创建实例，并把控制台入口回给用户。

## 五种插件

| 插件 | 目标系统 | 目录 | 状态 |
|---|---|---|---|
| `OpenIDC-IDCSmart` | 魔方财务（IDCSmart） | `plugins/OpenIDC-IDCSmart` | 可用 |
| `LxdServer-IDCSmart` | 魔方财务（LXD 专版） | `plugins/LxdServer-IDCSmart` | 可用 |
| `OpenIDC-SwapIDC` | SwapIDC | `plugins/OpenIDC-SwapIDC` | 可用 |
| `Easypanel-SwapIDC` | EasyPanel | `plugins/Easypanel-SwapIDC` | 可用 |
| `VistaPanel-SwapIDC` | VistaPanel | `plugins/VistaPanel-SwapIDC` | 可用 |

::: warning 小黑云插件
文档旧版提到的 `OpenIDC-XiaoHei` 目前**不在仓库中**，属于规划项。请以 `plugins/` 目录实际内容为准。
:::

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

插件需要三样东西：

1. **主控地址**：如 `https://idc.example.com`；
2. **Bearer Token**：系统设置 → 令牌，或 `opidcs conf token show`；
3. **主机标识**：`hs_name`，对应主控里的一台主机。

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
- [LxdServer-IDCSmart](/deploy/finance/lxdserver-idcsmart)
- [SwapIDC](/deploy/finance/swapidc)
- [Easypanel-SwapIDC](/deploy/finance/easypanel-swapidc)
- [VistaPanel-SwapIDC](/deploy/finance/vistapanel-swapidc)
- [小黑云（规划中）](/deploy/finance/xiaohei)
