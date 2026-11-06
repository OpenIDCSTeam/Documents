# API 概览

主控提供 REST API，前缀 `/api`，同时服务控制台、`opidcs`、财务插件与你的自动化脚本。

## 约定

| 项目 | 说明 |
|---|---|
| Base URL | `http(s)://<host>:1881/api` |
| 认证 | `Authorization: Bearer <token>` 或浏览器 Session |
| CSRF | 写操作需 `X-CSRF-Token`（先 `GET /api/csrf-token`） |
| 编码 | JSON，UTF-8 |
| 时间 | 秒级时间戳 / RFC3339（视字段） |
| HTTP 状态 | 业务错误通常仍返回 HTTP 200，需检查 `code` |

## 响应格式

```json
{
  "code": 200,
  "msg": "成功",
  "data": { },
  "timestamp": 1730000000
}
```

| `code` | 含义 |
|---|---|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证 |
| 403 | 无权限 / CSRF 失败 |
| 404 | 资源不存在 |
| 500 | 服务端错误 |

::: warning 注意
不要只看 HTTP 状态码。部分接口失败时 HTTP 仍是 200，但 `code` 为 4xx/5xx。
:::

## 认证示例

```bash
BASE=https://idc.example.com
TOKEN=6f1c...

# 获取 CSRF
CSRF=$(curl -s $BASE/api/csrf-token | jq -r .csrf_token)

# GET
curl -s $BASE/api/server/detail -H "Authorization: Bearer $TOKEN"

# POST
curl -s -X POST $BASE/api/client/powers/pve-lab/<uuid> \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF" \
  -H "Content-Type: application/json" \
  -d '{"action":"start"}'
```

## 资源分组

### 认证与用户

```text
POST   /api/login
POST   /api/register
POST   /api/logout
GET    /api/users/current
GET    /api/users                 管理员
POST   /api/users                 管理员
PUT    /api/users/:id             管理员
DELETE /api/users/:id             管理员
POST   /api/users/change-password
POST   /api/users/change-email
```

### 系统

```text
GET    /api/system/engine
GET    /api/system/statis
GET    /api/system/stats
GET    /api/system/settings       管理员
POST   /api/system/settings       管理员
GET    /api/system/logger/detail
POST   /api/system/logger/clear
GET    /api/system/tasker
POST   /api/system/recalculate-quotas
GET    /api/token/current         管理员
POST   /api/token/set             管理员
POST   /api/token/reset           管理员
```

### 主机

```text
GET    /api/server/detail
GET    /api/server/detail/:hs_name
POST   /api/server/create          管理员
PUT    /api/server/update/:hs_name 管理员
DELETE /api/server/delete/:hs_name 管理员
POST   /api/server/powers/:hs_name 管理员
GET    /api/server/status/:hs_name
GET    /api/server/config/export   管理员
POST   /api/server/config/restore  管理员
POST   /api/server/backup/scan/:hs_name
```

### 实例

```text
GET    /api/client/detail/:hs_name
GET    /api/client/detail/:hs_name/:vm_uuid
POST   /api/client/create/:hs_name
PUT    /api/client/update/:hs_name/:vm_uuid
DELETE /api/client/delete/:hs_name/:vm_uuid
POST   /api/client/powers/:hs_name/:vm_uuid
POST   /api/client/reinstall/:hs_name/:vm_uuid
GET    /api/client/remote/:hs_name/:vm_uuid
GET    /api/client/screenshot/:hs_name/:vm_uuid
POST   /api/client/password/:hs_name/:vm_uuid
POST   /api/client/scaner/:hs_name
POST   /api/client/scaner/:hs_name/cleanup
POST   /api/client/scaner/:hs_name/dedupe
```

### 网络

```text
GET    /api/client/natget/:hs_name/:vm_uuid
POST   /api/client/natadd/:hs_name/:vm_uuid
DELETE /api/client/natdel/:hs_name/:vm_uuid/:rule_index
POST   /api/client/ipaddr/bind/:hs_name/:vm_uuid
DELETE /api/client/ipaddr/bind/:hs_name/:vm_uuid
GET    /api/client/proxys/list
POST   /api/client/proxys/create/:hs_name/:vm_uuid
PUT    /api/client/proxys/update/:hs_name/:vm_uuid/:idx
DELETE /api/client/proxys/delete/:hs_name/:vm_uuid/:idx
GET    /api/admin/proxys/list      管理员
```

### 存储与备份

```text
GET    /api/client/os-images/:hs_name
POST   /api/client/upload
GET    /api/client/isos/detail/:hs_name/:vm_uuid
POST   /api/client/iso/mount/:hs_name/:vm_uuid
DELETE /api/client/iso/unmount/:hs_name/:vm_uuid/:iso_name
GET    /api/client/hdd/detail/:hs_name/:vm_uuid
POST   /api/client/hdd/mount/:hs_name/:vm_uuid
POST   /api/client/hdd/unmount/:hs_name/:vm_uuid
POST   /api/client/hdd/transfer/:hs_name/:vm_uuid
GET    /api/client/backup/detail/:hs_name/:vm_uuid
POST   /api/client/backup/create/:hs_name/:vm_uuid
POST   /api/client/backup/restore/:hs_name/:vm_uuid
DELETE /api/client/backup/delete/:hs_name/:vm_uuid
```

### 归属与凭据

```text
GET    /api/client/owners/:hs_name/:vm_uuid
POST   /api/client/owners/:hs_name/:vm_uuid
DELETE /api/client/owners/:hs_name/:vm_uuid
PUT    /api/client/owners/:hs_name/:vm_uuid/permission
POST   /api/client/owners/:hs_name/:vm_uuid/transfer
GET    /api/client/temptoken/:hs_name/:vm_uuid
GET    /api/client/access-key/:hs_name/:vm_uuid
POST   /api/client/access-key/:hs_name/:vm_uuid
DELETE /api/client/access-key/:hs_name/:vm_uuid
```

### 任务

```text
GET    /api/tasks
GET    /api/tasks/stats
GET    /api/tasks/:task_id
POST   /api/tasks/:task_id/cancel
GET    /api/system/async_task/list
POST   /api/system/async_task/:task_id/retry
```

## 客户端约定

- `opidcs` 在启动时缓存 CSRF，过期自动刷新；
- 401 时提示重新配置 Token，不自动重试；
- 5xx 与网络错误做指数退避重试（最多 3 次）。

## 相关页面

- [技术架构](/structure/architecture)
- [opidcs 命令行](/tools/cli)
