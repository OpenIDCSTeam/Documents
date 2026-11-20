# Docker / Podman 部署

Docker 适合轻量容器场景：交付快、密度高、镜像生态完整。OpenIDCS 通过 `docker` 命令管理容器，因此**不需要开放 Docker TCP 端口**。

## 前置条件

- Linux（x86_64 / aarch64）或 macOS
- 内核支持 cgroups v2（主流发行版默认满足）
- 一个可用的镜像仓库或本地 rootfs

## 安装

### Linux 一键脚本

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
```

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
```

### RHEL / Rocky / Alma

```bash
sudo dnf install -y docker
sudo systemctl enable --now docker
```

### macOS

```bash
brew install --cask docker
# 或使用 colima
brew install colima docker
colima start
```

## 授权

主控通过 SSH 执行 `docker`，账号需要能免 sudo 调用：

```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps
```

::: tip 安全
把账号加入 `docker` 组等价于 root 权限。生产环境建议为主控单独建账号，并在 SSH 侧限制来源 IP。
:::

## 主控侧配置

在 Web「主机管理 → 新增」填写：

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `docker-01` | 唯一标识（`hs_name`） |
| 服务器类型 | Docker Runtime Env | `OCInterface` |
| 服务器地址 | `10.0.0.51` 或 `localhost` | 留空/localhost 表示主控本机 |
| 服务器用户 | `root` | SSH 账号 |
| 服务器密码 | `******` | SSH 密码或使用密钥 |
| 模板存储路径 | `/data/images` | 镜像/rootfs |
| 数据存储路径 | `/data/vms` | 容器数据 |

或用命令行：

```bash
opidcs plat install docker
opidcs host add --name docker-01 --type OCInterface --addr 10.0.0.51 --user root
opidcs host status docker-01
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | ❌ |
| PCI / USB 直通 | ❌ |
| ISO 挂载 | ❌ |
| 额外数据盘 | ❌ |
| 上下行限速 | ❌ |
| 控制台 | Web 终端 / 日志 |
| 备份 | 镜像导出（视驱动） |

## 镜像准备

容器实例使用镜像或 rootfs：

```bash
# 拉取基础镜像
docker pull debian:12

# 或导入 rootfs
docker import debian-rootfs.tar debian12
```

把镜像名写入主控的镜像列表，创建实例时即可选择。

## 验证

```bash
docker version
docker ps
```

主控「主机管理」中状态应为在线，实例列表能拉取到已有容器。

## 常见问题

| 现象 | 原因 | 处理 |
|---|---|---|
| 主机离线 | SSH 不通 | 检查 22 端口与账号 |
| `permission denied` | 不在 docker 组 | `usermod -aG docker` 后重登 |
| 拉不到镜像 | 网络 / 仓库 | 配置镜像加速 |
| 创建慢 | 镜像太大 | 预拉取镜像 |
