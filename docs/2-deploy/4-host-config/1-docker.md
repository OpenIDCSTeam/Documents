# Docker 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，截图与截图步骤由维护者补充。</p>
</div>

前置：[Docker 运行时已安装](/deploy/platform/docker)，账号可执行 `docker`。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `docker-01` | 唯一 |
| 服务器类型 | Docker Runtime Env | `OCInterface` |
| 服务器地址 | `10.0.0.51` | 留空/localhost 为本机 |
| 服务器用户 | `root` | 需在 docker 组 |
| 服务器密码 | `******` | — |
| 虚拟机前缀 | `oidc-` | 只纳管该前缀 |
| 模板存储路径 | `/data/images` | rootfs / 镜像 |
| 数据存储路径 | `/data/vms` | 容器数据 |
| TCP端口起始/结束 | `20000` / `30000` | NAT 分配区间 |
| 虚拟机数量限制 | `50` | 防超卖 |

```bash
opidcs host add --name docker-01 --type OCInterface --addr 10.0.0.51 --user root
opidcs host scanvm docker-01
```

## 验证

- [ ] 主机状态在线
- [ ] 实例列表能拉取已有容器
- [ ] 创建一台测试容器成功
- [ ] 控制台（Web 终端）可打开

## 待维护者补充

- [ ] 无 sudo 账号的配置方式
- [ ] 远程 Docker（SSH 隧道）示例
- [ ] 常见镜像与 rootfs 命名约定
