# 镜像部署教程

镜像决定实例能不能启动、能不能自动配置网络。这一页分两部分：**去哪拿成品镜像**、**怎么自己做可被 CloudInit 初始化的镜像**。

## 一、成品镜像

### 官方 Cloud 镜像（推荐）

| 系统 | 来源 | 格式 |
|---|---|---|
| Debian 12 | <https://cloud.debian.org/images/cloud/> | qcow2 / raw |
| Ubuntu 22.04 / 24.04 | <https://cloud-images.ubuntu.com/> | img / qcow2 |
| Alpine | <https://alpinelinux.org/downloads/> | qcow2 / tar |
| Rocky / AlmaLinux | 各自 Cloud 镜像站 | qcow2 |
| Windows | 微软评估中心 / 自有授权镜像 | iso / vhdx |

::: warning OpenIDCS 镜像站待补充
项目维护者将补充自有镜像加速地址与校验值（SHA256）。在此之前请使用上游官方源，并自行校验。
:::

### 放到宿主机

| 平台 | 目录 |
|---|---|
| Docker / LXD | 主机配置的 `images_path` |
| Proxmox | `local:iso` 或 `local-lvm` |
| ESXi | `[datastore] ISO` |
| QEMU | `/var/lib/libvirt/images` |
| VirtualBox | 主机配置的 `images_path` |

上传后刷新主控的镜像列表（`GET /api/client/os-images/:hs_name`）。

## 二、手动制作 CloudInit 镜像

以 Debian 12 为例。

### 1. 启动基础系统

在任意平台创建一台临时虚拟机，安装最小系统，创建普通用户并配置 sudo。

### 2. 安装 cloud-init

```bash
sudo apt update
sudo apt install -y cloud-init
```

### 3. 指定数据源

```yaml
# /etc/cloud/cloud.cfg.d/99-openidcs.cfg
datasource_list: [ NoCloud, ConfigDrive, None ]
```

### 4. 清理痕迹（关键）

```bash
sudo cloud-init clean --logs --seed
sudo truncate -s 0 /etc/machine-id
sudo rm -f /var/lib/dbus/machine-id
sudo rm -f /etc/ssh/ssh_host_*
sudo rm -rf /var/lib/cloud/*
sudo rm -f /root/.bash_history
sudo poweroff
```

### 5. 压缩导出

```bash
qemu-img convert -O qcow2 -c base.qcow2 debian12-cloudinit.qcow2
```

把文件放到 `images_path`，在主控创建实例时选择该镜像。

## 三、NoCloud seed（ISO / 磁盘）

需要手动注入配置时，准备两个文件：

```yaml
# meta-data
instance-id: oidc-001
local-hostname: oidc-001
```

```yaml
# user-data
#cloud-config
users:
  - name: root
    ssh_authorized_keys:
      - ssh-ed25519 AAAA... you@example.com
ssh_pwauth: true
chpasswd:
  expire: false
  users:
    - {name: root, password: "修改我", type: text}
runcmd:
  - [ systemctl, enable, --now, qemu-guest-agent ]
```

打包成 seed ISO：

```bash
genisoimage -output seed.iso -volid cidata -joliet -rock user-data meta-data
```

挂载到实例的光驱（Proxmox 用 `cloudinit` 驱动器，QEMU 用 `-drive file=seed.iso,media=cdrom`）。

## 四、平台差异

| 平台 | CloudInit 方式 |
|---|---|
| Proxmox | Cloud-Init 驱动器 + snippets（`user-data` 放 `/var/lib/vz/snippets`） |
| QEMU | seed ISO 或 `virt-install --cloud-init` |
| LXD | `lxc config set <vm> cloud-init.user-data - < user-data` |
| Docker / SmolVM | 不使用 CloudInit，rootfs 内预置或启动脚本 |
| ESXi | guestinfo 注入（`guestinfo.userdata`） |
| Hyper-V | 无人值守 ISO / 首次启动脚本 |

## 五、校验清单

- [ ] 实例首次启动能拿到 IP
- [ ] SSH 公钥或密码可登录
- [ ] `cloud-init status --long` 显示 `done`
- [ ] 主机名与实例名一致（避免批量重名）
- [ ] 镜像大小与磁盘规格匹配

## 相关页面

- [CloudInit Agent](/deploy/cloudinit)
- [存储、镜像与备份](/features/storage)
