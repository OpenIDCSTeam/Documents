# 实例生命周期

实例（VM / 容器）是主控的核心资源。所有生命周期动作都由 `POST /api/client/powers/:hs_name/:vm_uuid` 或对应的资源接口触发，耗时操作统一进入异步任务。

## 状态模型

| 状态 | 含义 | 可执行动作 |
|---|---|---|
| `running` | 运行中 | 关机、重启、强制断电、暂停（平台支持时）、VNC |
| `stopped` | 已停止 | 开机、重装、删除、修改配置 |
| `paused` | 已暂停 | 恢复、强制断电（部分平台） |
| `creating` | 创建中 | 查看任务、取消 |
| `error` | 异常 | 查看任务详情、重试、删除 |

::: tip 状态以平台为准
主控不维护「想象的」状态：列表与详情会向平台查询实时状态；平台不可达时返回上一次缓存并标注离线。
:::

## 创建实例

创建分四步，其中某些步骤会因平台能力被裁掉。

1. 选主机。只列启用的主机，平台做不到的规格不会出现，比如 LXD 没有 GPU。
2. 选镜像或模板。来源是该主机的 `images_path` 或系统镜像列表。
3. 填规格。CPU、内存、磁盘、带宽、IP 数量，被 `ban_init` 禁用的字段不显示。
4. 网络与初始化。选 IP 分配方式，填 CloudInit 的用户名、密码、SSH 公钥和自定义脚本。

提交后返回任务 ID，前端轮询任务状态；创建成功会写入实例记录与归属关系。

## 电源操作

| 动作 | 说明 | 平台差异 |
|---|---|---|
| `start` | 开机 | 全部平台 |
| `stop` | 正常关机（走 ACPI / guest agent） | 需要平台或 Agent 支持 |
| `poweroff` | 强制断电 | 全部平台 |
| `restart` | 重启 | 全部平台 |
| `reset` | 硬重启 | 部分平台 |
| `pause` / `resume` | 暂停 / 恢复 | MEmu 等平台不支持（`ban` 元信息会提示） |

## 重置与重装

重置密码走平台能力或 CloudInit，QEMU 的虚拟机里得装 `qemu-guest-agent` 才生效。重装系统保留实例记录、重建系统盘，数据盘可以选留或删。改主机是把实例记录迁到同平台另一台主机，依赖磁盘移交，见下一节。

## 磁盘移交

`POST /api/client/hdd/transfer/:hs_name/:vm_uuid` 用于把数据盘移交给另一台实例（同主机或支持迁移的平台）。这是「换机器不丢数据」的基础能力，不等同于在线热迁移。

## 删除

删除分两步：

1. 平台侧删除实例（失败则任务失败，记录保留）；
2. 写入墓碑（tombstone），由后台对账任务确认平台侧已不存在。

对账与重试入口在系统设置 → 运维接口（管理员）：`/api/system/outbox/*`、`/api/system/tombstone/*`。

## 截图与控制台

- `GET /api/client/screenshot/:hs_name/:vm_uuid` 返回当前画面（data URL），用于列表缩略图与详情预览。
- `GET /api/client/remote/:hs_name/:vm_uuid` 返回 noVNC / RDP / ADB 连接信息，前端据此打开控制台。

## 相关接口

```text
GET    /api/client/detail/:hs_name              实例列表
GET    /api/client/detail/:hs_name/:vm_uuid     实例详情
POST   /api/client/create/:hs_name              创建
PUT    /api/client/update/:hs_name/:vm_uuid     修改配置
POST   /api/client/powers/:hs_name/:vm_uuid     电源与生命周期
POST   /api/client/reinstall/:hs_name/:vm_uuid  重装
DELETE /api/client/delete/:hs_name/:vm_uuid     删除
```
