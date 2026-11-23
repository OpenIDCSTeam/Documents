# 小黑云

小黑云（XiaoHei Cloud）用 `QuickIDC-XiaoHei` 插件接入。开通、续费、暂停、删除和控制台跳转都走主控的 `/api/client/*` 接口，配置项跟其它 QuickIDC 插件一样。

::: tip 插件不在主仓库
`CloudHost/plugins/` 里没有 `QuickIDC-XiaoHei` 目录，需要单独拿到插件包，再放进 `plugins/`。
:::

## 部署

1. 把 `QuickIDC-XiaoHei` 目录放进 `CloudHost/plugins/`；
2. 在财务系统里启用该模块，填主控地址和 Bearer Token；
3. 选择主机 `hs_name`，配置套餐与镜像；
4. 下一单测试，确认实例建好、控制台能打开。

通用流程和目录结构见[财务系统对接总览](/deploy/finance/)。

## 配置项

| 项目 | 说明 |
|---|---|
| 主控地址 | 如 `https://idc.example.com` |
| Bearer Token | 「系统设置 → 令牌」，或 `quickidc conf token show` 查看 |
| 主机标识 | `hs_name`，主控里已接入的主机 |

## 出问题先看这几处

- 下单后没有实例：打开主控「任务管理」，看有没有失败任务；
- 控制台打不开：检查主控对外域名和反代；
- 接口 401：Token 不对，或者刚轮换过还没同步到插件。

## 相关页面

- [财务系统对接总览](/deploy/finance/)
- [API 概览](/structure/api)
