# VMware ESXi 部署

ESXi 是裸金属 Hypervisor，通过 HTTPS API（`443`）管理。适合已有 VMware 体系、需要稳定虚拟化的场景。

## 前置条件

- 兼容的服务器硬件（HCL 查询 VMware 兼容性列表）
- 独立管理网口
- ESXi 许可证（免费版功能受限，API 行为可能不同）

## 安装

1. 下载 ESXi ISO，写入 U 盘启动；
2. 选择安装磁盘，设置 root 密码；
3. 配置管理网络（IP / 网关 / DNS）；
4. 安装完成后访问 `https://<IP>`（DCUI 或 Host Client）。

安装后检查：

```bash
# 开启 SSH（Host Client → 管理 → 服务 → SSH → 启动）
ssh root@<IP>
esxcli system version get
esxcli network ip interface list
```

## 存储

- 本地 VMFS 数据存储用于实例磁盘；
- 共享存储（iSCSI / NFS）可选；
- ISO 上传到数据存储的 ISO 目录。

```bash
# 查看数据存储
esxcli storage filesystem list
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `esxi-01` | `hs_name` |
| 服务器类型 | vSphereESXi Server | `vSphereESXi` |
| 服务器地址 | `10.0.0.31:443` | 可省略端口 |
| 服务器用户 | `root` | — |
| 服务器密码 | `******` | — |
| 模板存储路径 | `[datastore1] ISO` | ISO 目录 |
| 数据存储路径 | `[datastore1]` | 实例磁盘 |

```bash
opidcs host add --name esxi-01 --type vSphereESXi --addr 10.0.0.31:443 --user root
```

## 能力

| 项目 | 支持 |
|---|---|
| GPU / PCI / USB 直通 | ✅（取决于硬件与许可证） |
| ISO 挂载 | ✅ |
| 额外数据盘 | ✅ |
| 上下行限速 | ✅ |
| 控制台 | noVNC（ticket） |
| 备份 | 取决于驱动实现 |

## 验证

```bash
curl -k -u root:'******' https://10.0.0.31/api/vcenter/host
```

或在主控「主机管理」查看状态与实例列表。

## 常见问题

| 现象 | 处理 |
|---|---|
| SSL 证书告警 | 主控默认跳过自签证书校验；生产建议替换为受信证书 |
| 登录失败 | 确认 root 密码与 SSH/API 未锁定 |
| 无法创建 | 数据存储空间或许可证限制 |
| 免费版 API 受限 | 升级许可证或改用 Proxmox |
