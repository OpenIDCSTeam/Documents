# 功能教程总览

这一章按控制台菜单逐页说明：每个页面能做什么、字段怎么填、操作后会发生什么。

## 管理员视图

| 菜单 | 路由 | 页面 |
|---|---|---|
| 系统概览 | `/dashboard` | [系统概览](/usage/dashboard) |
| 主机管理 | `/hosts` | [主机管理](/usage/hosts) |
| 实例管理 | `/vms` | [实例管理](/usage/vms) |
| 反向代理 | `/web-proxys` | [反向代理](/usage/proxies) |
| 端口转发 | `/nat-rules` | [端口转发](/usage/nat) |
| 用户管理 | `/users` | [用户管理](/usage/users) |
| 任务管理 | `/tasks` | [任务管理](/usage/tasks) |
| 日志查看 | `/logs` | [日志查看](/usage/logs) |
| 系统设置 | `/settings` | [系统设置](/usage/settings) |

## 用户视图

| 菜单 | 路由 | 页面 |
|---|---|---|
| 资源概览 | `/user/dashboard` | [系统概览](/usage/dashboard) |
| 实例管理 | `/user/vms` | [实例管理](/usage/vms) |
| 反向代理 | `/user/proxys` | [反向代理](/usage/proxies) |
| 端口转发 | `/user/nat` | [端口转发](/usage/nat) |
| 个人资料 | `/profile` | 修改邮箱/密码 |

## 页面通用交互

- **列表**：支持搜索、筛选、分页；状态列会区分「平台真实状态」与「主控记录」。
- **详情**：多数页面右侧打开抽屉，不打断列表上下文。
- **危险操作**：删除、强制断电、重置 Token 需二次确认。
- **异步任务**：提交后显示任务 ID 与进度，可跳转任务管理。
- **空状态**：给出下一步动作，而不是空白表格。

## 建议阅读顺序

1. [主机管理](/usage/hosts) —— 先把宿主机接进来；
2. [实例管理](/usage/vms) —— 创建并打开第一台实例；
3. [端口转发](/usage/nat) / [反向代理](/usage/proxies) —— 对外提供服务；
4. [用户管理](/usage/users) —— 把资源分给用户；
5. [任务](/usage/tasks) / [日志](/usage/logs) —— 排障；
6. [系统设置](/usage/settings) —— 收尾配置。
