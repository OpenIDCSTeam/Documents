# Proxmox VE 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，存储与备份策略由维护者补充。</p>
</div>

前置：[PVE 已安装](/deploy/platform/proxmox)，`root@pam` 可登录，8006 对主控可达。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `pve-lab` | 唯一 |
| 服务器类型 | ProxmoxVE Platform | `PromoxSetup` |
| 服务器地址 | `10.0.0.21:8006` | 端口可省略 |
| 服务器用户 | `root@pam` | 必须带 realm |
| 服务器密码 | `******` | 关闭 2FA |
| 虚拟机前缀 | `oidc-` | 过滤 |
| 模板存储路径 | `local:iso` | ISO 存储 |
| 数据存储路径 | `local-lvm` | 实例磁盘 |
| 备份存储路径 | `local` | `vzdump` 目标 |
| 虚拟机数量限制 | `100` | — |

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host status pve-lab
```

## 验证

- [ ] `/api2/json/version` 可访问
- [ ] 主控能列出 `qm` / `pct` 实例
- [ ] noVNC 控制台可打开
- [ ] 备份任务可创建

## 待维护者补充

- [ ] API Token 与 2FA 的兼容方案
- [ ] 集群（多节点）场景下的地址填写
- [ ] 存储命名与 ISO 上传约定
