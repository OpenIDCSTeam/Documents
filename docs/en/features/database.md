# Multi-database support

SQLite is the default and needs no setup. For larger deployments or company standards, switch to MySQL or PostgreSQL in `data/data.yaml`.

## Supported engines

| Driver | Version | Implementation | Notes |
|---|---|---|---|
| `sqlite` | built-in | `modernc.org/sqlite` (pure Go) | default, file `data/data.db` |
| `mysql` | MySQL 8.0.13+ / MariaDB 10.6+ | `github.com/go-sql-driver/mysql` | `utf8mb4`, InnoDB recommended |
| `postgres` | PostgreSQL 13+ | `github.com/lib/pq` | `?` placeholders are rebound to `$1..$n` |

::: tip Why MySQL 8.0.13+
Text columns use expression defaults (`DEFAULT ('')`), which requires 8.0.13+. 5.7 fails with `BLOB/TEXT column can't have a default value`.
:::

## Switch steps

1. Create the database and grant privileges:

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

2. Edit `data/data.yaml`:

```yaml
database:
  driver: postgres   # or mysql
  postgres:
    host: 10.0.0.10
    port: 5432
    user: openidcs
    password: change-me
    database: openidcs
```

3. Restart the controller. Tables and indexes are created on first start; the startup banner reports `database: mysql|postgres`.

## Dialect notes

- `INTEGER PRIMARY KEY AUTOINCREMENT` becomes `BIGINT AUTO_INCREMENT` (MySQL) or `BIGSERIAL` (PostgreSQL).
- Indexed text columns use `VARCHAR(191)` on MySQL to stay within `utf8mb4` index limits; JSON/large text use `LONGTEXT`.
- `ON CONFLICT ... DO UPDATE` becomes `ON DUPLICATE KEY UPDATE`; `INSERT OR REPLACE` becomes `REPLACE INTO`.
- Time-window filters are computed in Go, so no `datetime('now')` is emitted.
- `PRAGMA` checks and the log-table rebuild only run on SQLite.

## Caveats

- Switching engines does **not** migrate existing rows. Export host config with `opidcs host export` and move instance rows with SQL tooling.
- With MySQL/PostgreSQL, `data/` contains only `bins/`, `logs/`, `temp/` and `data.yaml`.
- Backups differ: SQLite `.backup` or offline copy, `mysqldump`, `pg_dump`.
- Validate on a staging database first: the dialect layer is covered by unit tests, but version/collation differences are still possible. Keep a rollback plan.
