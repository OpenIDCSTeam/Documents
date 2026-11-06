# 日志查看

日志查看用于检索主控运行日志：登录、API 调用、任务执行、平台错误。

## 列表页

`/logs`

| 列 | 说明 |
|---|---|
| 时间 | 精确到秒 |
| 级别 | DEBUG / INFO / WARNING / ERROR |
| 模块 | api / service / driver / task … |
| 消息 | 摘要 |
| 操作 | 查看详情 |

## 检索

| 条件 | 说明 |
|---|---|
| 级别 | 多选 |
| 关键字 | 消息内容模糊匹配 |
| 时间范围 | 最近 1h / 24h / 7d / 自定义 |
| 主机 | 按 `hs_name` 过滤 |
| 实例 | 按 UUID 过滤 |

## 日志级别

启动参数分别控制三个输出：

```bash
./hostagent --log-level info --log-file-level debug --log-db-level info
```

| 输出 | 参数 | 用途 |
|---|---|---|
| 控制台 | `--log-level` | 前台排障 |
| 文件 | `--log-file-level` | 长期留档 |
| 数据库 | `--log-db-level` | 控制台检索 |

::: tip 生产建议
数据库日志保持 `info`，文件日志可开 `debug`。`debug` 写入数据库会快速增长，并影响检索速度。
:::

## 清理

- 手动清理：`POST /api/system/logger/clear`（管理员）；
- 自动清理：按保留天数（系统设置）；
- 清理不影响文件日志。

## 导出

当前版本支持按筛选结果导出 CSV（视版本）；如需长期归档，直接采集 `logs/` 目录。

## 排障常用组合

```text
级别 = ERROR
时间 = 最近 1 小时
关键字 = create

级别 = WARNING
关键字 = timeout

主机 = pve-lab
关键字 = vzdump
```

## 命令行

```bash
opidcs logs list --level error --limit 100
opidcs logs list --host pve-lab --output json
```

## 相关页面

- [监控与日志](/features/monitoring)
- [任务管理](/usage/tasks)
