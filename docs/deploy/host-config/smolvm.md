# SmolVM 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
</div>

前置：[SmolVM 运行时已安装](/deploy/platform/smolvm)，`/dev/kvm` 可用，内核与 rootfs 已准备。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `smol-01` | 唯一 |
| 服务器类型 | SmolVM MicroVM Runtime | `SmolVM` |
| 服务器地址 | `localhost` | 本地/SSH |
| 模板存储路径 | `/var/lib/smolvm` | 内核与 rootfs |
| 数据存储路径 | `/var/lib/smolvm/vms` | 实例 |
| 虚拟机数量限制 | `100` | — |

主机可选参数：

| 参数 | 示例 | 说明 |
|---|---|---|
| `smolvm_kernel` | `/var/lib/smolvm/vmlinux` | 留空用默认 |
| `smolvm_hv` | `firecracker` | 或 `cloud-hypervisor` |
| `smolvm_hv_path` | `/usr/local/bin/firecracker` | 留空自动探测 |

```bash
opidcs host add --name smol-01 --type SmolVM --addr localhost
opidcs plat credentials show smolvm
```

## 验证

- [ ] 主机在线
- [ ] 创建实例成功（rootfs 可启动）
- [ ] SSH 端口转发可用

## 待维护者补充

- [ ] 内核与 rootfs 的版本管理
- [ ] socat / iptables 转发规则
- [ ] 资源超卖与并发上限
