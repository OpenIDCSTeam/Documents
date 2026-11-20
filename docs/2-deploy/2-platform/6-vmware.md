# VMware Workstation 部署

VMware Workstation 引擎仅支持 **Windows 宿主**，主控通过 `vmrest` REST API（默认 `8697`）管理虚拟机。

## 前置条件

- Windows 10/11 或 Windows Server（x86_64）
- VMware Workstation Pro（需包含 `vmrest`）
- 已开启硬件虚拟化

## 安装

1. 安装 VMware Workstation Pro；
2. 确认安装目录下有 `vmrest.exe`（通常在 `C:\Program Files (x86)\VMware\VMware Workstation\`）；
3. 启动 vmrest 并设置凭据。

```powershell
# 首次配置（交互式输入用户名/密码）
& "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe" -C

# 启动服务，默认监听 8697
& "C:\Program Files (x86)\VMware\VMware Workstation\vmrest.exe"
```

::: tip 开机自启
把 vmrest 注册为 Windows 服务（如 NSSM），避免重启后主控失联。
:::

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `ws-01` | `hs_name` |
| 服务器类型 | VMWare Workstation | `VMWareSetup` |
| 服务器地址 | `10.0.0.71:8697` | vmrest 地址 |
| 服务器用户 | `openidcs` | vmrest 账号 |
| 服务器密码 | `******` | vmrest 密码 |
| 模板存储路径 | `D:\VM\Images` | 镜像 |
| 数据存储路径 | `D:\VM\VMs` | 实例目录 |

```bash
opidcs host add --name ws-01 --type VMWareSetup --addr 10.0.0.71:8697 --user openidcs
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | 仅虚拟显存（`gpu_mem` 可调） |
| PCI 直通 | ❌ |
| USB 直通 | ✅ |
| ISO / 数据盘 | ✅ |
| 上下行限速 | ✅ |
| 控制台 | noVNC |

## 验证

```bash
# 主控同网段
curl -u openidcs:'******' http://10.0.0.71:8697/api/vms
```

## 常见问题

| 现象 | 处理 |
|---|---|
| 连接 8697 失败 | 确认 vmrest 已启动并放行防火墙 |
| 401 | 重新执行 `vmrest -C` 设置凭据 |
| 主控在 Linux 上无法接入 | Workstation 引擎仅支持 Windows 宿主 |
| 虚拟机状态不同步 | 检查 Workstation 是否被本机 GUI 占用 |
