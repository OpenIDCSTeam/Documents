# 特性总览

这一章按能力拆开讲：每篇说明适用范围、平台限制和操作入口。项目概况见[项目简介](/intro/)。

## 资源

- [虚拟平台](/features/platforms)：10 种服务器类型，接入方式和能力差异。
- [实例生命周期](/features/lifecycle)：创建、开关机、重置、重装、暂停、删除和截图。
- [存储、镜像与备份](/features/storage)：镜像上传、ISO 挂载、数据盘、备份恢复。
- [控制台与远程访问](/features/console)：noVNC、Web SSH、RDP 和 ADB。

## 网络

[网络与端口](/features/network)：NAT 端口转发、爱快静态绑定、Caddy 反向代理。

## 账号与权限

[用户与配额](/features/users) 讲用户、配额重算和实例归属；[共享与访问密钥](/features/access) 讲共享者、临时凭据和 16 位访问密钥。

## 运维

[任务与调度](/features/tasks) 是异步任务、取消重试和后台维护；[监控与日志](/features/monitoring) 看资源统计、实例监控和日志检索；[多数据库支持](/features/database) 说明 SQLite 与 MySQL、PostgreSQL 怎么切。

## 商业化

[财务系统对接](/features/finance)：三个快简云（Quick IDC）插件和对接模型。

## 总览表

| 能力 | 入口（控制台） | 主要接口 |
|---|---|---|
| 系统概览 | 系统概览 | `GET /api/system/stats` |
| 主机管理 | 主机管理 | `GET/POST/PUT/DELETE /api/server/*` |
| 实例管理 | 实例管理 | `GET/POST/PUT/DELETE /api/client/*` |
| 电源操作 | 实例详情 | `POST /api/client/powers/:hs/:uuid` |
| 控制台 | 实例详情 | `GET /api/client/remote/:hs/:uuid` |
| 端口转发 | 端口转发 | `GET/POST/DELETE /api/client/nat*` |
| 反向代理 | 反向代理 | `GET/POST/PUT/DELETE /api/client/proxys/*` |
| 用户管理 | 用户管理 | `GET/POST/PUT/DELETE /api/users` |
| 任务管理 | 任务管理 | `GET /api/tasks`、`POST /api/tasks/:id/cancel` |
| 日志查看 | 日志查看 | `GET /api/system/logger/*` |
| 系统设置 | 系统设置 | `GET/POST /api/system/settings` |
| 令牌管理 | 系统设置 | `GET/POST /api/token/*` |

> 完整接口清单见 [API 概览](/structure/api)。

## 设计约定

1. 平台能力由元信息决定。前端读 `/api/system/engine` 的 `ban_init`、`ban_edit`、`tab_lock`、`messages`，不写死某平台支持什么。
2. 危险操作走异步任务。创建、重装、删除、备份返回任务 ID，前端轮询状态，避免长连接超时。
3. 删除可追溯。删除实例时写墓碑记录，对账任务跟平台实际状态比对，失败的可以重试。
