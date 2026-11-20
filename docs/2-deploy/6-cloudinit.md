# CloudInit Agent（虚拟机内）

CloudInit 仓库（`OpenIDCSTeam/CloudInit`）提供的 Agent 运行在**被管虚拟机内部**，与主控配合完成：

- 定期上报实例 IP / MAC / 主机名；
- 接收改密、执行命令等指令；
- 自动更新自身；
- Windows 镜像自动安装 virtio 驱动。

::: info 与 cloud-init 的区别
`cloud-init` 是 Linux 发行版的标准初始化工具（首次启动注入用户/网络）；本页的 **CloudInit Agent** 是 OpenIDCS 自研的常驻程序。两者不是一回事。
:::

## 安装

从 [CloudInit Releases](https://github.com/OpenIDCSTeam/CloudInit/releases) 下载对应平台产物，安装为系统服务：

```bash
# Linux
sudo ./cloudinit install
sudo systemctl enable --now cloudinit

# Windows（管理员 PowerShell）
.\cloudinit.exe install
```

程序目录下会生成 `IDCConfig.ini`。

## 配置

```ini
[server]
# 上报间隔（秒）
report_interval = 60

# 上报端口（默认 1880）
# ⚠ 主控默认是 1881，同机/默认部署请显式改成主控端口
report_port = 1881

# 上报路径
report_path = /api/client/upload

# 上报地址；留空则从网关推算
report_host =

# 从网关 x.x.x.2 开始扫描
gateway_offset = 2

[update]
enabled = true
interval = 86400
repo_url = https://api.github.com/repos/OpenIDCSTeam/CloudInit/releases/latest
mirror_url = https://eo-idc.pika.net.cn/cloudinit

[system]
virtio_enabled = true

[log]
level = INFO
retention = 7 days
```

::: danger 端口不一致是最常见的坑
Agent 默认上报 `1880`（Python 版遗留），主控默认监听 `1881`。如果实例 IP 一直不显示，先检查这一项。
:::

## 上报逻辑

1. 读取 `report_host`；为空则取默认网关，按 `gateway_offset` 在同网段顺序探测；
2. 向 `http://<host>:<port>/api/client/upload` POST 实例信息；
3. 主控按 MAC / 实例标识匹配记录并更新 IP；
4. 全部探测失败则本轮跳过，不影响下一轮。

## 命令与改密

主控下发命令后，Agent 在下一次心跳取回并执行，结果回传 `/api/client/cmd_result`。因此：

- 实例必须能访问主控端口；
- 修改密码依赖 Agent 在线（QEMU 也可用 `qemu-guest-agent`）；
- 命令有超时与结果状态，可在实例详情的命令记录查看。

## 自动更新

- 优先使用 `mirror_url`（EdgeOne 镜像），失败回退 GitHub；
- 更新前校验版本号，避免回滚；
- 生产环境建议固定版本，关闭自动更新。

## 验证

```bash
# Linux
systemctl status cloudinit
tail -f /var/log/cloudinit.log

# Windows
Get-Service cloudinit
```

主控侧：实例详情的 IP 字段应在 1–2 个上报周期内出现。

## 相关页面

- [镜像部署教程](/deploy/images)
- [实例生命周期](/features/lifecycle)
