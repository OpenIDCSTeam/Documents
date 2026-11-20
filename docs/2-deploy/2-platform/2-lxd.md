# LXC / LXD 部署

LXD 提供「像虚拟机一样使用容器」的体验：有 systemd、有独立 IP、可快照。OpenIDCS 通过 `lxc` 命令管理实例。

## 前置条件

- Linux（x86_64 / aarch64）
- 建议独立磁盘或分区给 LXD 存储池
- 桥接网络（默认 `lxdbr0`）

## 安装

### Ubuntu / Debian（snap，推荐）

```bash
sudo snap install lxd
sudo lxd init --auto
```

交互式初始化：

```bash
sudo lxd init
# 存储池：default（dir / zfs / btrfs / lvm）
# 网络：lxdbr0，自动 NAT
```

### 授权

```bash
sudo usermod -aG lxd $USER
newgrp lxd
lxc list
```

## 常用配置

```bash
# 查看存储池
lxc storage list

# 查看网络
lxc network list

# 创建 profile（限制资源）
lxc profile create small
lxc profile set small limits.cpu 1
lxc profile set small limits.memory 1GB
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `lxd-edge` | `hs_name` |
| 服务器类型 | LinuxContainer Env | `LxContainer` |
| 服务器地址 | `10.0.0.32` | SSH 地址 |
| 服务器用户 | `root` | 需在 `lxd` 组 |
| 模板存储路径 | `/var/lib/lxd/images` | 镜像 |
| 数据存储路径 | `/var/lib/lxd/storage-pools` | 实例数据 |

```bash
opidcs plat install lxd
opidcs host add --name lxd-edge --type LxContainer --addr 10.0.0.32 --user root
```

::: tip 主控侧需要的两条配置命令
LXD 场景通常还要在主控执行：

```bash
# 扫描该主机已有实例，纳入主控
opidcs host scanvm lxd-edge

# 查看回填主控所需的连接参数
opidcs plat credentials show lxd
```
:::

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | ❌ |
| PCI / USB 直通 | ❌ |
| ISO 挂载 | ❌ |
| 额外数据盘 | ❌（受 `tab_lock` 限制） |
| 上下行限速 | ❌（编辑时禁用） |
| 控制台 | noVNC |
| 备份 | 实例导出 / 快照（视配置） |

## 镜像

```bash
lxc image list
lxc launch images:debian/12 debian12
```

也可以导入本地镜像：

```bash
lxc image import meta.tar rootfs.tar --alias debian12-custom
```

## 验证

```bash
lxc list
lxc info <instance>
```

主控应能列出实例并打开控制台。

## 常见问题

| 现象 | 处理 |
|---|---|
| `lxc` 权限不足 | 加入 `lxd` 组并重新登录 |
| 实例无 IP | 检查 `lxdbr0` 与 NAT / 防火墙 |
| 控制台黑屏 | 实例未装 getty / 未启动 |
| 创建失败 | 存储池空间不足 |
