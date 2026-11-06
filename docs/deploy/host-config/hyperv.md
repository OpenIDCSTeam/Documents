# Hyper-V 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，WinRM 安全配置由维护者补充。</p>
</div>

前置：[Hyper-V 已启用](/deploy/platform/hyperv)，WinRM 5985 对主控可达。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `win-hv` | 唯一 |
| 服务器类型 | Windows HyperV x64 | `HyperVSetup` |
| 服务器地址 | `10.0.0.44:5985` | WinRM |
| 服务器用户 | `Administrator` | 管理员 |
| 服务器密码 | `******` | — |
| 虚拟机前缀 | `oidc-` | 过滤 |
| 模板存储路径 | `D:\HyperV\Images` | 镜像 |
| 数据存储路径 | `D:\HyperV\VHD` | 磁盘 |
| 备份存储路径 | `D:\HyperV\Backup` | 备份 |
| 虚拟机数量限制 | `40` | — |

```bash
opidcs host add --name win-hv --type HyperVSetup --addr 10.0.0.44:5985 --user Administrator
opidcs host status win-hv
```

## 验证

- [ ] `Get-VM` 可执行
- [ ] 主控在线、实例可见
- [ ] 控制台（noVNC/RDP）可用
- [ ] 开关机与删除正常

## 待维护者补充

- [ ] 域账号与基本认证的取舍
- [ ] 虚拟交换机命名与多网卡
- [ ] GPU-P / DDA 的配置前提
