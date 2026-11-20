# QEMU / KVM 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，libvirt 池与网络实践由维护者补充。</p>
</div>

前置：[QEMU/libvirt 已安装](/deploy/platform/qemu)，账号可执行 `virsh`。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `kvm-01` | 唯一 |
| 服务器类型 | QEMU/KVM Platform | `QEMUServer` |
| 服务器地址 | `10.0.0.61` | 本地/SSH |
| 服务器用户 | `root` | 需能执行 virsh |
| 服务器密码 | `******` | — |
| 虚拟机前缀 | `oidc-` | 过滤 |
| 模板存储路径 | `/var/lib/libvirt/images` | 镜像 |
| 数据存储路径 | `/data/vms` | 实例 |
| 备份存储路径 | `/data/backup` | 备份 |
| VNC服务端口 | `5900` | 起始端口 |
| 虚拟机数量限制 | `60` | — |

```bash
opidcs host add --name kvm-01 --type QEMUServer --addr 10.0.0.61 --user root
opidcs host scanvm kvm-01
```

## 验证

- [ ] `virsh list --all` 正常
- [ ] 主控在线
- [ ] 创建实例 + noVNC 可用
- [ ] 改密（qemu-guest-agent）验证

## 待维护者补充

- [ ] 存储池 vs 目录的差异
- [ ] 桥接网络与 VLAN
- [ ] 直通设备的 IOMMU 前置
