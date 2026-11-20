# 监控与日志

## 概览指标

系统概览页展示主控视角的聚合数据：

```text
GET /api/system/statis     汇总统计（主机数、实例数、运行中、用户数）
GET /api/system/stats      资源使用（CPU / 内存 / 磁盘 / 流量）
```

数据来源：

- 主机：驱动实时查询，失败时回退缓存；
- 实例：平台列表 + 主控记录合并；
- 用户：配额与用量表。

## 实例监控

实例详情页展示：

- 当前状态与运行时长；
- CPU / 内存 / 磁盘 / 网络曲线（取决于平台能力与历史采样）；
- 最近任务与操作记录；
- 截图缩略图。

::: info 采样口径
监控数据来自平台 API 或宿主机采集，不同平台的采样间隔与精度不同；主控不伪造缺失数据，取不到时显示「—」。
:::

## 日志

日志分两级：

| 级别 | 去向 | 用途 |
|---|---|---|
| 文件日志 | `logs/` 或数据目录 | 排障、审计留档 |
| 数据库日志 | SQLite | 控制台检索、按级别过滤 |

接口：

```text
GET  /api/system/logger/detail    分页查询（级别、关键字、时间范围）
GET  /api/system/logger/stats     各级别数量
POST /api/system/logger/clear     清空（管理员）
```

启动参数可分别控制控制台、文件、数据库级别：

```bash
./hostagent --log-level info --log-file-level debug --log-db-level info
```

## 告警

当前版本没有独立的告警中心，推荐两种做法：

1. 在宿主机侧用 Prometheus / node_exporter + Alertmanager 监控硬件；
2. 用 `opidcs` 定时拉取 `GET /api/system/stats`，在外部系统做阈值判断。

::: tip 不要依赖面板告警做唯一保障
面板本身故障时告警也会失效，生产环境至少保留一套独立的宿主机监控。
:::

## 相关页面

- [系统概览](/usage/dashboard)
- [日志查看](/usage/logs)
- [监控与告警教程](/usage/monitoring)
