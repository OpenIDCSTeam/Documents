# 实例管理

实例管理覆盖创建、查看、控制台、电源、存储、网络、备份与共享。列表页在 `/vms`，详情在 `/hosts/:hostName/vms/:uuid`。

## 列表页

| 列 | 说明 |
|---|---|
| 名称 | 实例名（创建时指定） |
| 主机 | 所属 `hs_name` |
| 状态 | 运行 / 停止 / 暂停 / 异常 |
| 规格 | CPU / 内存 / 磁盘 |
| IP | 主控记录或 Agent 上报 |
| 操作 | 开机、关机、控制台、删除 |

筛选：按主机、状态、关键字；支持批量选择。

<figure class="oidc-figure">
  <img src="/imgs/vms-list.png" alt="实例管理列表视图" loading="lazy" decoding="async">
  <figcaption>列表视图：一行一台实例，直接开关机、进控制台或删除</figcaption>
</figure>

<figure class="oidc-figure">
  <img src="/imgs/vms-cards.png" alt="实例管理卡片视图" loading="lazy" decoding="async">
  <figcaption>卡片视图：CPU / 内存 / 磁盘 / 流量 / 端口配额一屏看完，适合巡检</figcaption>
</figure>

## 创建实例

点击「新建」，四步向导：

### 1. 选择主机

只显示在线且启用的主机。平台限制会即时提示（如 LXD 不支持 GPU）。

### 2. 选择镜像

来源：主机的 `images_path` 或平台镜像列表。没有镜像时先去 [镜像部署](/deploy/images)。

### 3. 规格

| 字段 | 说明 | 受限平台 |
|---|---|---|
| CPU | 核数 | 全部 |
| 内存 | MB | 全部 |
| 系统盘 | GB | 全部 |
| 带宽 | Mbps | Docker/LXD/SmolVM 不支持 |
| GPU / 显存 | 数量 / MB | 容器类不支持 |
| 数据盘 | 数量 / 大小 | LXD 不支持 |
| IP 数量 | 独立 IP | 视网络 |

被 `ban_init` 禁用的字段不会出现，不要试图绕过。

### 4. 初始化

| 字段 | 说明 |
|---|---|
| 主机名 | 默认同实例名 |
| 用户名 | CloudInit 创建的用户 |
| 密码 | 初始密码 |
| SSH 公钥 | 可多行 |
| 自定义脚本 | cloud-init `runcmd` |
| 网络 | DHCP / 静态 IP |

提交后进入任务队列，列表会显示「创建中」。

## 详情页页签

管理员视角的实例详情，页签、资源曲线与操作按钮都集中在这一页：

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-admin.png" alt="实例详情（管理员视角）" loading="lazy" decoding="async">
  <figcaption>管理员视角：实例信息、资源用量、电源操作与实例配置</figcaption>
</figure>

| 页签 | 内容 |
|---|---|
| 概览 | 状态、规格、镜像、IP、到期时间 |
| 监控 | CPU / 内存 / 磁盘 / 网络曲线 |
| 控制台 | noVNC 窗口、Web SSH |
| 存储 | 磁盘、ISO、USB |
| 网络 | IP、NAT、反代、DNS |
| 备份 | 备份列表、创建、恢复、删除 |
| 共享 | 所有者、共享者与权限 |
| 访问密钥 | 生成 / 查看 / 吊销 |
| 任务 | 该实例的历史任务 |
| 设置 | 修改配置、重装、删除 |

普通用户在「实例概览」看到的精简视图：

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-user.png" alt="实例概览（用户视角）" loading="lazy" decoding="async">
  <figcaption>用户视角：规格、系统、到期时间，以及 RDP / VNC / ToDesk 三种远程入口</figcaption>
</figure>

### 监控

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-monitoring.png" alt="实例资源监控" loading="lazy" decoding="async">
  <figcaption>资源监控：CPU / 内存 / 磁盘 / 网络曲线，可切换 30 分钟到 30 天的时间范围</figcaption>
</figure>

### 网络

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-network.png" alt="实例网络信息" loading="lazy" decoding="async">
  <figcaption>网络信息：IPv4 / IPv6、上下行带宽、流量上限与网卡 MAC</figcaption>
</figure>

### 端口映射

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-nat.png" alt="实例端口映射" loading="lazy" decoding="async">
  <figcaption>端口映射：一条规则对应一组外网端口与内网端口，可附备注便于识别</figcaption>
</figure>

### 备份

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-backup.png" alt="实例备份管理" loading="lazy" decoding="async">
  <figcaption>备份管理：备份文件、创建时间，以及恢复 / 删除操作</figcaption>
</figure>

### 访问密钥

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-access-key.png" alt="实例访问密钥" loading="lazy" decoding="async">
  <figcaption>访问密钥：免账号登录实例的长期凭据，可复制、重置或撤销</figcaption>
</figure>

### 启动顺序

<figure class="oidc-figure">
  <img src="/imgs/vm-detail-boot-order.png" alt="实例启动顺序" loading="lazy" decoding="async">
  <figcaption>启动顺序：调整硬盘与光盘 / 网络启动的优先级</figcaption>
</figure>

## 电源与生命周期

| 按钮 | 行为 | 注意 |
|---|---|---|
| 开机 | start | — |
| 关机 | 正常关机 | 需要 guest 支持 |
| 强制断电 | poweroff | 可能丢数据 |
| 重启 | restart | — |
| 硬重启 | reset | 视平台 |
| 暂停 / 恢复 | pause / resume | MEmu 不支持 |
| 重装 | reinstall | 系统盘重建 |
| 删除 | delete | 写入墓碑，异步回收 |

## 控制台

- **noVNC**：浏览器内操作，支持 Ctrl+Alt+Del、剪贴板、全屏；
- **Web SSH**：适合 Linux，支持复制粘贴；
- **RDP / ADB**：Hyper-V / Workstation / MEmu 显示连接信息。

<figure class="oidc-figure">
  <img src="/imgs/vm-console-vnc.png" alt="浏览器内 noVNC 控制台" loading="lazy" decoding="async">
  <figcaption>noVNC 控制台：不装客户端，直接在浏览器里操作实例桌面</figcaption>
</figure>

## 修改配置

- 运行中修改 CPU / 内存通常需要重启；
- 磁盘只能扩容，不能缩容；
- 带宽限制修改即时生效（平台支持时）；
- 修改镜像不会重装，重装请用「重装系统」。

## 共享与访问密钥

见 [共享与访问密钥](/features/access)：

- 转移所有者；
- 添加共享者并设置只读 / 控制台 / 管理；
- 生成 16 位访问密钥供用户自助登录。

## 批量操作

勾选多个实例后可：

- 批量开机 / 关机；
- 批量删除（需输入确认）；
- 批量加入同一反代规则（仅同主机）。

## 命令行

```bash
quickidc vm list --host pve-lab
quickidc vm add --host pve-lab --image debian12 --cpu 2 --mem 2048 --disk 40
quickidc vm power start <uuid>
quickidc vm power stop <uuid>
quickidc vm show <uuid>
```

## 常见问题

| 现象 | 处理 |
|---|---|
| 创建卡在 0% | 看任务详情里的平台错误 |
| 开机后无 IP | 检查 DHCP / Agent 上报 |
| 控制台黑屏 | 平台 VNC 端口或实例未启动 |
| 删除失败 | 平台侧仍存在，查看墓碑对账 |
