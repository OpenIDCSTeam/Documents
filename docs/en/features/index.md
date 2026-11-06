# Features overview

A detailed companion to the [introduction](/en/intro/). Each capability has its own page.

## Resource layer

- [Supported platforms](/en/features/platforms) — 11 engine types and their limits.
- [Instance lifecycle](/en/features/lifecycle) — create, power, reinstall, delete, screenshots.
- [Storage, images & backup](/en/features/storage) — images, ISO, disks, backups.
- [Console & remote access](/en/features/console) — noVNC, Web SSH, RDP/ADB.

## Network

- [Network & ports](/en/features/network) — NAT, iKuai binding, Caddy reverse proxy.

## Accounts

- [Users & quotas](/en/features/users) — users, quotas, ownership.
- [Sharing & access keys](/en/features/access) — shares, temporary tokens, access keys.

## Operations

- [Tasks & scheduling](/en/features/tasks) — async tasks, retries, maintenance jobs.
- [Monitoring & logs](/en/features/monitoring) — metrics, instance monitoring, logs.
- [Multi-database](/en/features/database) — SQLite out of the box, switch to MySQL / PostgreSQL.

## Commercial

- [Billing integration](/en/features/finance) — plugin models.

## Console entry points

| Capability | Menu | Main API |
|---|---|---|
| Overview | Dashboard | `GET /api/system/stats` |
| Hosts | Hosts | `/api/server/*` |
| Instances | Instances | `/api/client/*` |
| Port forwarding | NAT rules | `/api/client/nat*` |
| Reverse proxy | Web proxies | `/api/client/proxys/*` |
| Users | Users | `/api/users` |
| Tasks | Tasks | `/api/tasks` |
| Logs | Logs | `/api/system/logger/*` |
| Settings | Settings | `/api/system/settings` |

## Design rules

1. Platform capability comes from metadata, not hard-coded UI switches.
2. Long operations return a task ID and run asynchronously.
3. Deletions are traceable through tombstones and reconciliation.
