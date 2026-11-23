# 用户与配额

## 用户模型

| 字段 | 说明 |
|---|---|
| `username` | 登录名，唯一 |
| `email` | 邮箱，可用于找回密码与验证 |
| `role` | `admin` / `user` 两级（未实现细粒度 RBAC） |
| `status` | 启用 / 禁用 |
| 配额 | CPU、内存、磁盘、实例数、流量（按用户累计） |

::: warning 没有「角色权限矩阵」
当前版本只有管理员与普通用户两级身份，没有自定义角色、对象级 ACL 或策略引擎。实例级别的访问控制通过「归属 + 共享者 + 访问密钥」实现，见 [共享与访问密钥](/features/access)。
:::

## 管理接口

```text
GET    /api/users/current        当前用户
GET    /api/users                用户列表（管理员）
POST   /api/users                新建（管理员）
GET    /api/users/:id            详情（管理员）
PUT    /api/users/:id            修改（管理员）
DELETE /api/users/:id            删除（管理员）
POST   /api/users/change-password
POST   /api/users/change-email
```

## 配额

配额在创建或修改实例时校验，超了直接拒绝。`POST /api/system/recalculate-quotas` 重算全部用户的配额（管理员）。主机侧还有 `limits_nums`，限制单台主机的实例数，防超卖。

配额计算口径：

```text
已用 CPU  = Σ 运行中/停止实例的 CPU 核数
已用内存  = Σ 实例内存
已用磁盘  = Σ 系统盘 + 数据盘
已用实例  = 实例记录数（不含已删除墓碑）
```

## 实例归属

每个实例只有一个所有者（`owner`）。管理员可以改归属（`POST /api/client/owners/:hs/:uuid/transfer`）、加或删共享者（`POST/DELETE /api/client/owners/:hs/:uuid`）、调共享者权限（`PUT /api/client/owners/:hs/:uuid/permission`）。

## 注册与找回密码

| 功能 | 接口 | 说明 |
|---|---|---|
| 注册 | `POST /api/register` | 可在系统设置中关闭 |
| 邮箱验证 | `GET /verify_email` | 需配置 SMTP |
| 找回密码 | `POST /api/forgot-password` | 发送重置邮件 |
| 管理员重置 | `POST /api/system/reset-password` | 需系统级凭据 |

## 相关页面

- [用户管理教程](/usage/users)
- [系统设置](/usage/settings)
- [共享与访问密钥](/features/access)
