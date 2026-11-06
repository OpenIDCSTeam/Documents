# 共享与访问密钥

OpenIDCS 没有 RBAC 权限矩阵，实例级别的访问控制由三样东西组成：**归属**、**共享者**、**访问密钥**。

## 归属（Owner）

- 每个实例有且只有一个所有者；
- 所有者可在用户侧「实例管理」看到并操作自己的实例；
- 管理员可转移归属：

```text
POST /api/client/owners/:hs_name/:vm_uuid/transfer
```

## 共享者（Owners / Shares）

管理员或所有者可以把实例共享给其他用户，并指定权限级别：

```text
GET    /api/client/owners/:hs_name/:vm_uuid
POST   /api/client/owners/:hs_name/:vm_uuid
DELETE /api/client/owners/:hs_name/:vm_uuid
PUT    /api/client/owners/:hs_name/:vm_uuid/permission
```

| 权限 | 能力 |
|---|---|
| 只读 | 查看实例信息、状态、监控 |
| 控制台 | 只读 + 打开 VNC / SSH |
| 管理 | 控制台 + 开关机 / 重启（不含删除与重装） |

::: tip 权限口径
共享权限只覆盖实例操作，不会让共享者看到主机凭据、其他实例或系统设置。
:::

## 临时凭据

用于「打开控制台但不想暴露长期密码」的场景：

```text
GET /api/client/temptoken/:hs_name/:vm_uuid
```

- 由主控签发，短时有效；
- 绑定实例与来源 IP；
- 登录入口：`/api/client/templogin`。

## 访问密钥

长期凭据，适合让用户自助登录控制台或 VNC：

```text
GET    /api/client/access-key/:hs_name/:vm_uuid   查看（掩码）
POST   /api/client/access-key/:hs_name/:vm_uuid   生成（16 位）
DELETE /api/client/access-key/:hs_name/:vm_uuid   吊销
```

- 登录入口：`/api/client/keylogin`；
- 登录后能力与临时凭据一致；
- 吊销后立即失效，建议在实例转移或共享结束时吊销。

## 安全建议

1. 访问密钥只展示一次，落库前请确认接收方；
2. 不要把访问密钥写进公开的工单或群聊；
3. 共享者离职时，先移除共享关系，再吊销密钥；
4. 管理员 Token 与用户密码分离，不要复用。

## 相关页面

- [控制台与远程访问](/features/console)
- [用户与配额](/features/users)
