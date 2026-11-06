# VMware Workstation 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
</div>

前置：[Workstation 与 vmrest 已就绪](/deploy/platform/vmware)，`8697` 可达。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `ws-01` | 唯一 |
| 服务器类型 | VMWare Workstation | `VMWareSetup` |
| 服务器地址 | `10.0.0.71:8697` | vmrest |
| 服务器用户 | `openidcs` | vmrest 账号 |
| 服务器密码 | `******` | — |
| 模板存储路径 | `D:\VM\Images` | 镜像 |
| 数据存储路径 | `D:\VM\VMs` | 实例 |
| 虚拟机数量限制 | `20` | — |

```bash
opidcs host add --name ws-01 --type VMWareSetup --addr 10.0.0.71:8697 --user openidcs
opidcs host status ws-01
```

## 验证

- [ ] vmrest `/api/vms` 可访问
- [ ] 主控在线、实例可见
- [ ] 开关机与控制台正常

## 待维护者补充

- [ ] vmrest 开机自启（NSSM）
- [ ] 凭据轮换
- [ ] Workstation 与 Hyper-V 共存冲突
