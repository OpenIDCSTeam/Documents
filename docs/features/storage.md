# 存储、镜像与备份

## 三类存储

| 类型 | 默认路径字段 | 用途 |
|---|---|---|
| 模板 / 镜像 | `images_path` | 系统镜像、CloudInit 模板、SmolVM 内核 |
| 光盘 | `dvdrom_path` | ISO 安装介质 |
| 系统 / 数据 / 备份 | `system_path`、`extern_path`、`backup_path` | 实例系统盘、数据盘、备份文件 |

这些路径是**宿主机视角**的路径，主控通过本地或 SSH 访问。

## 镜像

- 列表：`GET /api/client/os-images/:hs_name` 返回该主机可用镜像；
- 上传：`POST /api/client/upload`（multipart），支持进度回传；
- 命名约定：镜像文件名即实例创建时的可选值；Proxmox 使用 `node:storage:iso` 形式时由驱动解析。

::: tip 成品镜像与 CloudInit
常用系统镜像与「手动制作 CloudInit 镜像」的步骤，见 [镜像与 CloudInit](/deploy/images)。
:::

## ISO 挂载

```text
GET    /api/client/isos/detail/:hs_name/:vm_uuid
POST   /api/client/iso/mount/:hs_name/:vm_uuid
DELETE /api/client/iso/unmount/:hs_name/:vm_uuid/:iso_name
```

LXD、Docker、SmolVM、MuMu 不支持 ISO（引擎元信息里 `tab_lock` 会锁住该页签）。

## 数据盘

| 操作 | 接口 | 说明 |
|---|---|---|
| 列出 | `GET /api/client/hdd/detail/:hs/:uuid` | 数据盘与挂载点 |
| 挂载 | `POST /api/client/hdd/mount/:hs/:uuid` | 新建或挂载已有磁盘 |
| 卸载 | `POST /api/client/hdd/unmount/:hs/:uuid` | 保留磁盘文件 |
| 移交 | `POST /api/client/hdd/transfer/:hs/:uuid` | 转移到另一实例 |
| 删除 | `DELETE /api/client/hdd/delete/:hs/:uuid` | 不可恢复 |

## 备份与恢复

主控提供的是**备份文件**级能力，不是快照链：

```text
GET    /api/client/backup/detail/:hs/:uuid
POST   /api/client/backup/create/:hs/:uuid
POST   /api/client/backup/restore/:hs/:uuid
DELETE /api/client/backup/delete/:hs/:uuid
```

- 备份位置由主机配置的 `backup_path` 决定；
- 创建/恢复是异步任务，可在任务管理查看进度；
- 是否支持取决于平台驱动：Proxmox 走 `vzdump`，QEMU 走 `qemu-img`/libvirt，ESXi 走快照导出；
- 备份文件不自动轮转，建议在宿主机侧配置保留策略。

## USB 与 PCI 直通

```text
GET  /api/client/usb-list/:hs_name
POST /api/client/usb/setup/:hs_name/:vm_uuid
POST /api/client/pci/setup/:hs_name/:vm_uuid
GET  /api/client/gpu-list/:hs_name
GET  /api/client/pci-list/:hs_name
```

支持情况见 [虚拟平台](/features/platforms)。直通操作通常需要重启实例生效。

## EFI 启动项

`GET /api/client/efi-list/:hs_name/:vm_uuid` 与 `POST /api/client/efi/setup/:hs_name/:vm_uuid` 用于调整 UEFI 启动顺序（Proxmox / QEMU / Hyper-V 等）。
