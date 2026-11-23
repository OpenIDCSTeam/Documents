# 共享与访问密钥

快简云（Quick IDC）没有 RBAC 权限矩阵，实例级别的访问控制由三样东西组成：**归属**、**共享者**、**访问密钥**。

## 归属（Owner）

每个实例有且只有一个所有者，所有者在用户侧「实例管理」里能看到并操作自己的实例。管理员可以转移归属：

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

打开控制台又不想给长期密码时用这个。由主控签发，短时有效，绑定实例和来源 IP，登录入口是 `/api/client/templogin`。

```text
GET /api/client/temptoken/:hs_name/:vm_uuid
```

## 访问密钥

长期凭据，给用户自助登录控制台或 VNC 用。

```text
GET    /api/client/access-key/:hs_name/:vm_uuid   查看（掩码）
POST   /api/client/access-key/:hs_name/:vm_uuid   生成（16 位）
DELETE /api/client/access-key/:hs_name/:vm_uuid   吊销
```

查看只给掩码，生成的密钥只显示一次。登录入口 `/api/client/keylogin`，登录后的能力和临时凭据一样，吊销立即失效。实例转移或共享结束时顺手吊销。

## 安全建议

密钥只展示一次，发之前先确认接收方；别写进公开工单或群聊；共享者离职先移除共享关系，再吊销密钥；管理员 Token 和用户密码分开，不要复用。

## 相关页面

- [控制台与远程访问](/features/console)
- [用户与配额](/features/users)
