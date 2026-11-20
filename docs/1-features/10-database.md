# 多数据库支持

默认使用 SQLite，开箱即用；当实例量、并发或运维规范要求独立数据库时，可以在 `data/data.yaml` 中切换 MySQL 或 PostgreSQL。

## 支持的数据库

| 驱动 | 版本建议 | 驱动实现 | 说明 |
|---|---|---|---|
| `sqlite` | 内置 | `modernc.org/sqlite`（纯 Go） | 默认，零依赖，数据文件 `data/data.db` |
| `mysql` | MySQL 8.0.13+ / MariaDB 10.6+ | `github.com/go-sql-driver/mysql` | 需要 `utf8mb4`，建议 InnoDB |
| `postgres` | PostgreSQL 13+ | `github.com/lib/pq` | 自动把 `?` 占位符改写为 `$1..$n` |

::: tip 为什么是 MySQL 8.0.13+
文本列使用表达式默认值（`DEFAULT ('')`），需要 8.0.13 及以上；5.7 会报 `BLOB/TEXT column can't have a default value`。
:::

## 切换步骤

1. 建库与账号（示例）：

```sql
CREATE DATABASE openidcs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'openidcs'@'%' IDENTIFIED BY 'change-me';
GRANT ALL PRIVILEGES ON openidcs.* TO 'openidcs'@'%';
FLUSH PRIVILEGES;
```

```sql
CREATE DATABASE openidcs;
CREATE USER openidcs WITH PASSWORD 'change-me';
GRANT ALL PRIVILEGES ON DATABASE openidcs TO openidcs;
```

2. 修改 `data/data.yaml`：

```yaml
database:
  driver: mysql      # 或 postgres
  mysql:
    host: 10.0.0.10
    port: 3306
    user: openidcs
    password: change-me
    database: openidcs
```

3. 重启主控。首次启动会自动建表与索引，随后打印的日志中 `数据库: mysql` 表示生效。

## 表结构与方言差异

- SQLite 的 `INTEGER PRIMARY KEY AUTOINCREMENT` 会按方言转换为 `BIGINT AUTO_INCREMENT`（MySQL）或 `BIGSERIAL`（PostgreSQL）。
- 参与主键/唯一键/索引的文本列在 MySQL 下使用 `VARCHAR(191)`，避免 `utf8mb4` 索引超长；JSON 与大文本列使用 `LONGTEXT`。
- `ON CONFLICT ... DO UPDATE` 在 MySQL 下自动改写为 `ON DUPLICATE KEY UPDATE`；`INSERT OR REPLACE` 改写为 `REPLACE INTO`。
- 时间过滤由 Go 侧计算，SQL 中不再使用 `datetime('now')`，三种数据库行为一致。
- `PRAGMA` 与日志表重建仅对 SQLite 执行。

## 注意事项

- 切换数据库**不会自动搬迁旧数据**。如需迁移，先用 `opidcs host export` 导出主机配置，实例记录可用 SQL 工具搬运。
- SQLite 之外的数据库没有 `data.db` 文件，`data/` 下只保留 `bins/`、`logs/`、`temp/`、`data.yaml`。
- 备份方式随驱动变化：SQLite 用 `.backup` 或停服拷贝，MySQL 用 `mysqldump`，PostgreSQL 用 `pg_dump`。
- 建议先在测试库验证再切生产：MySQL / PostgreSQL 的方言转换已实现并有单元测试覆盖，但不同版本/字符集仍可能有差异，切换前请留好回滚方案。
