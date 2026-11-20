# LXD 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，存储池与 profile 的实践由维护者补充。</p>
</div>

前置：[LXD 已安装并初始化](/deploy/platform/lxd)，账号在 `lxd` 组。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `lxd-edge` | 唯一 |
| 服务器类型 | LinuxContainer Env | `LxContainer` |
| 服务器地址 | `10.0.0.32` | SSH |
| 服务器用户 | `root` | 需在 lxd 组 |
| 服务器密码 | `******` | — |
| 虚拟机前缀 | `oidc-` | 过滤 |
| 模板存储路径 | `/var/lib/lxd/images` | 镜像 |
| 数据存储路径 | `/var/lib/lxd/storage-pools` | 实例 |
| TCP端口起始/结束 | `20000` / `30000` | NAT |
| 虚拟机数量限制 | `80` | — |

```bash
opidcs host add --name lxd-edge --type LxContainer --addr 10.0.0.32 --user root
opidcs host scanvm lxd-edge
opidcs plat credentials show lxd
```

## 验证

- [ ] `lxc list` 能列出实例
- [ ] 主控主机在线
- [ ] 创建测试实例 + noVNC 控制台可打开
- [ ] 删除实例后主控记录同步

## 待维护者补充

- [ ] 存储池选择（dir / zfs / lvm）对备份的影响
- [ ] profile 与限额的最佳实践
- [ ] 迁移场景下的磁盘路径
