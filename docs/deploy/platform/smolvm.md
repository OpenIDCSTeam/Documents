# SmolVM（MicroVM）部署

SmolVM 是轻量 MicroVM 运行时，用 Docker 镜像做 rootfs，依赖 KVM 与 Firecracker / Cloud-Hypervisor。适合「秒级启动、低开销」的场景。

::: warning 实验特性
该平台引擎已启用，但能力受限（无 GPU / PCI / USB / ISO / 数据盘），建议先在测试环境验证。
:::

## 前置条件

- Linux（x86_64 / aarch64）
- `/dev/kvm` 可访问
- Firecracker 或 Cloud-Hypervisor
- Docker（用于制作 rootfs）

## 安装

```bash
# KVM 检查
ls -l /dev/kvm

# Firecracker（示例：下载官方二进制）
curl -fsSL https://github.com/firecracker-microvm/firecracker/releases/latest/download/firecracker-v1.7.0-x86_64.tgz -o fc.tgz
tar -xzf fc.tgz
sudo install -m 0755 release-v1.7.0-x86_64/firecracker-v1.7.0-x86_64 /usr/local/bin/firecracker

# 或 Cloud Hypervisor
# https://github.com/cloud-hypervisor/cloud-hypervisor/releases

# 内核
mkdir -p /var/lib/smolvm
# 将 vmlinux 放到 /var/lib/smolvm/vmlinux-smolvm（或在主机配置里指定路径）
```

## 制作 rootfs

SmolVM 使用 Docker 镜像转换为 ext4：

```bash
docker pull debian:12
docker create --name rootfs-tmp debian:12
docker export rootfs-tmp -o /tmp/debian12.tar
docker rm rootfs-tmp

# 转为 ext4（示例）
truncate -s 2G /var/lib/smolvm/debian12.ext4
mkfs.ext4 -F /var/lib/smolvm/debian12.ext4
sudo mount -o loop /var/lib/smolvm/debian12.ext4 /mnt
sudo tar -C /mnt -xf /tmp/debian12.tar
sudo umount /mnt
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `smol-01` | `hs_name` |
| 服务器类型 | SmolVM MicroVM Runtime | `SmolVM` |
| 服务器地址 | `localhost` 或 SSH 地址 | 本地/远程 |
| 模板存储路径 | `/var/lib/smolvm` | 内核与 rootfs |
| 数据存储路径 | `/var/lib/smolvm/vms` | 实例 |

主机可选参数（`options`）：

| 参数 | 说明 |
|---|---|
| `smolvm_kernel` | 自定义内核路径，留空用 `images_path/vmlinux-smolvm` |
| `smolvm_hv` | `firecracker` / `cloud-hypervisor` / `qemu-system-x86_64` |
| `smolvm_hv_path` | hypervisor 可执行文件路径，留空自动探测 |

```bash
opidcs plat install smolvm
opidcs plat show smolvm
opidcs host add --name smol-01 --type SmolVM --addr localhost
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | ❌ |
| PCI / USB 直通 | ❌ |
| ISO 挂载 | ❌ |
| 额外数据盘 | ❌ |
| 上下行限速 | ❌ |
| 控制台 | SSH |
| 端口转发 | socat / iptables |

## 验证

```bash
firecracker --version
ls -l /var/lib/smolvm/vmlinux-smolvm
```

## 常见问题

| 现象 | 处理 |
|---|---|
| 启动失败 `KVM` | 确认 `/dev/kvm` 与权限 |
| 找不到内核 | 配置 `smolvm_kernel` |
| 网络不通 | 检查 socat/iptables 转发规则 |
| rootfs 无法启动 | 镜像需包含 init 与 sshd |
