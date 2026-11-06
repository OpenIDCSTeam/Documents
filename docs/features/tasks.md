# 任务与调度

所有可能超过 HTTP 超时的操作都走异步任务：创建实例、重装、删除、备份、恢复、批量下发网络规则。

## 任务模型

| 字段 | 说明 |
|---|---|
| `task_id` | 任务标识 |
| `type` | `create / delete / reinstall / backup / restore / sync / …` |
| `status` | `pending / running / success / failed / canceled` |
| `progress` | 0–100 |
| `hs_name` / `vm_uuid` | 关联资源 |
| `message` | 当前步骤或错误信息 |

任务由工作池执行（默认 4 个 worker），同一实例的写操作按队列串行，避免并发改同一份配置。

## 接口

```text
GET  /api/tasks                        任务列表（兼容路径）
GET  /api/tasks/stats                  统计
GET  /api/tasks/:task_id               详情
POST /api/tasks/:task_id/cancel        取消
POST /api/tasks/:task_id/stop          取消（别名）

GET  /api/system/async_task/list       主路径
GET  /api/system/async_task/stats
GET  /api/system/async_task/:task_id
POST /api/system/async_task/:task_id/stop
POST /api/system/async_task/:task_id/retry
```

## 后台维护任务

主控启动后会注册一组定时任务：

| 任务 | 周期（默认） | 作用 |
|---|---|---|
| 主机同步 | 分钟级 | 拉取平台实例状态，修正主控记录 |
| 孤立资源清理 | 小时级 | 清理平台已不存在但主控仍记录的资源 |
| 配额重算 | 定时 / 手动 | 重算用户已用配额 |
| 外部资源对账 | 分钟级 | 重试失败的 outbox 记录，扫描墓碑 |
| 截图缓存清理 | 定时 | 删除过期缩略图 |

具体周期可在系统设置中调整（见 [系统设置](/usage/settings)）。

## 失败处理

1. 任务失败会在详情中保留最后一步与原始错误；
2. 可重试的任务（如 outbox、备份）提供 `retry`；
3. 删除失败不会丢记录：实例仍在列表，可再次删除；
4. 平台不可达时任务进入失败而不是无限等待，避免队列堵塞。

## 对账与墓碑

| 概念 | 作用 |
|---|---|
| outbox | 记录「已提交给平台、待确认结果」的操作，失败重试 |
| tombstone | 记录「主控已删除、待平台确认」的资源，防止残留 |

运维接口（管理员）：

```text
GET  /api/system/outbox/list
POST /api/system/outbox/:id/retry
POST /api/system/outbox/:id/dismiss
GET  /api/system/tombstone/list
POST /api/system/tombstone/sweep
```

## 命令行

```bash
opidcs task list --core 0
opidcs task list --core 0 --status running
```

## 相关页面

- [任务管理教程](/usage/tasks)
- [日志查看](/usage/logs)
