# 快速部署

一台 Linux 主机，装主控、装 Docker、开一台容器。完整安装参数（Windows、macOS、源码、离线）见 [主控安装](/deploy/core-install)。

## 1. 装主控

```bash
curl -fsSL https://idcgit.opkg.cn/install.sh | sudo bash -- --firewall
```

脚本结束后会打印访问地址与 API Token（仅用于 API / CLI / 插件，不能作为 Web 登录密码）。默认端口 `1881`。

## 2. 初始化与登录

浏览器打开 `http://<IP>:1881`，首次访问会进入初始化页面：

1. 设置系统标题（显示在登录页、浏览器标签与后台品牌位）；
2. 设置管理员密码（至少 8 位）；
3. 提交后用用户名 `admin` 与刚设置的密码登录。

登录后可在「系统设置 → 访问与安全」查看或重置 API Token。

## 3. 装 Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
sudo docker version
```

主控与 Docker 同机时，主机地址填 `localhost`；远程机器要保证 SSH 可登录，账号在 `docker` 组。

## 4. 添加主机

「主机管理 → 新增」：

| 字段 | 值 |
|---|---|
| 服务器名称 | `local` |
| 服务器类型 | Docker Runtime Env |
| 服务器地址 | `localhost` |
| 模板存储路径 | `/data/images` |
| 数据存储路径 | `/data/vms` |

保存后状态应为在线。

## 5. 创建实例

「实例管理 → 新建」：

1. 选择主机 `local`；
2. 选择镜像（如 `debian12`，需先在模板路径准备 rootfs，或使用镜像列表）；
3. 规格 1C1G、磁盘 10G；
4. 提交，等待任务完成。

## 6. 打开控制台

实例详情 → 控制台。容器平台使用 Web 终端；虚拟机平台使用 noVNC。

## 常见卡点

| 现象 | 处理 |
|---|---|
| 主机离线 | 检查 SSH 端口、账号密码、`docker` 权限 |
| 无镜像可选 | 检查模板路径是否存在、文件名是否被过滤 |
| 创建任务失败 | 任务详情里有平台原始错误 |
| 控制台 404 | 确认 `static/` 与 `VNCConsole/` 与二进制同级 |

## 下一步

<div class="oidc-cta__actions">
  <a class="oidc-btn oidc-btn--primary" href="/deploy/core-install">主控安装</a>
  <a class="oidc-btn" href="/deploy/platform/">虚拟平台</a>
  <a class="oidc-btn" href="/deploy/host-config/">主机配置</a>
</div>
