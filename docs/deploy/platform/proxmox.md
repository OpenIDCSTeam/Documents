# Proxmox VE 部署

Proxmox VE（PVE）是基于 Debian 的 KVM + LXC 宿主，自带 Web 管理与完整 API。OpenIDCS 通过 HTTPS API（默认 `8006`）管理它，功能覆盖最完整。

## 前置条件

- 独立物理机或支持嵌套虚拟化的 VM
- CPU 开启 VT-x / AMD-V
- 至少两块盘（系统 + 实例存储）或一块大盘做 LVM-Thin

## 安装

1. 下载 PVE ISO，写入 U 盘启动；
2. 选择 `Install Proxmox VE`，设置磁盘、时区、密码、管理网卡；
3. 主机名建议使用 FQDN，如 `pve01.idc.local`；
4. 安装完成后访问 `https://<IP>:8006`。

安装后常用检查：

```bash
pveversion
pvesm status
qm list
pct list
```

## 网络

默认 `vmbr0` 桥接物理网卡。多实例场景建议：

```bash
# 查看桥接
cat /etc/network/interfaces

# 如使用 VLAN，创建 vmbr0.100
```

实例 IP 由爱快 DHCP 或 PVE 内网段分配，二选一，不要双层 NAT。

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `pve-lab` | `hs_name` |
| 服务器类型 | ProxmoxVE Platform | `PromoxSetup` |
| 服务器地址 | `10.0.0.21:8006` | 可省略端口，驱动补 8006 |
| 服务器用户 | `root@pam` | 需带 realm |
| 服务器密码 | `******` | — |
| 模板存储路径 | `local:iso` | ISO 存储 |
| 数据存储路径 | `local-lvm` | 实例磁盘 |

```bash
opidcs host add --name pve-lab --type PromoxSetup --addr 10.0.0.21:8006 --user root@pam
opidcs host status pve-lab
```

::: warning 两步验证
主控使用用户名 + 密码调用 API。若账号开启了 TOTP 两步验证，密码登录会失败——请为 API 单独建用户并关闭 2FA，或使用 API Token（视驱动版本支持）。
:::

## 存储与镜像

```bash
# 查看存储
pvesm status

# 上传 ISO 到 local
# Web：local → ISO Images → Upload
```

创建实例时，镜像/ISO 名称要与 PVE 存储中的一致。驱动会解析 `storage:iso` 形式。

## 能力

| 项目 | 支持 |
|---|---|
| GPU / PCI / USB 直通 | ✅ |
| ISO 挂载 | ✅ |
| 额外数据盘 | ✅ |
| 上下行限速 | ✅ |
| 控制台 | noVNC（含票据校验） |
| 备份 / 恢复 | ✅（`vzdump`） |

## 验证

```bash
# 主控同网段执行
curl -k https://10.0.0.21:8006/api2/json/version
```

主控主机状态在线、实例列表能拉取、控制台可打开即接入成功。

## 常见问题

| 现象 | 原因 | 处理 |
|---|---|---|
| 401 | 账号未带 realm | 使用 `root@pam` |
| 595 / 连接失败 | 8006 不可达 | 检查防火墙与 PVE 服务 |
| 创建失败 | 存储名不对 | `pvesm status` 确认 |
| 控制台黑屏 | VNC 票据过期 | 重新打开控制台 |
| 备份失败 | 备份存储未配置 | 在 PVE 添加 backup 存储 |
