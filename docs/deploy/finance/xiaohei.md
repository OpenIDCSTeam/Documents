# 小黑云（规划中）

::: warning 当前版本未包含实现
旧文档曾把小黒云（XiaoHei Cloud）写成可用插件，但 `CloudHost/plugins/` 下**没有** `OpenIDC-XiaoHei` 目录。本页只说明规划与替代方案，不提供安装步骤，避免误导。
:::

## 现状

| 项目 | 状态 |
|---|---|
| 插件目录 | 不存在 |
| 对接文档 | 旧版遗留 |
| 仓库引用 | `Documents/docs` 旧页已迁移到本页并标注 |

## 规划中的能力

如果后续实现，预期与其它插件一致：

- 以 SwapIDC 协议扩展的方式对接小黑云；
- 复用主控 `/api/client/*` 接口；
- 支持开通、续费、暂停、删除与控制台跳转。

## 现在可以怎么做

| 需求 | 替代方案 |
|---|---|
| 小黑云节点售卖 | 用 [SwapIDC](/deploy/finance/swapidc) 或 [IDCSmart](/deploy/finance/idcsmart) 把节点当作普通主机接入 |
| 多节点统一计费 | 每个节点一个 `hs_name`，在财务系统建多个服务器组 |
| 定制对接 | 参考 `OpenIDC-SwapIDC/openidc.php` 的调用方式自行实现 |

## 相关页面

- [财务系统对接总览](/deploy/finance/)
- [API 概览](/structure/api)
