# 魔方财务（IDCSmart）集成教程

> 🔌 使用 `OpenIDC-IDCSmart` / `LxdServer-IDCSmart` 让魔方财务直接对接 OpenIDCS，覆盖 VM 与 LXD 全场景。

## 🎯 适用场景

- 主机商使用 **魔方财务（IDCSmart）** 作为核心 CRM / 工单 / 财务系统
- 需要售卖 **KVM VM / LXC / 独立服务器 / 云主机**
- 客户希望在魔方前台直接管理：开关机、VNC、重装、改密、IPv4/IPv6、NAT 端口转发、反代、流量统计

## 📦 两个配套插件

| 插件 | 对应后端 | 推荐用法 |
|------|----------|----------|
| **`OpenIDC-IDCSmart`** | OpenIDCS 通用（Proxmox / ESXi / Hyper-V / VMware / Docker 等） | 通用产品模块 |
| **`LxdServer-IDCSmart`** | OpenIDCS × LXD 专版 | LXD VPS 售卖（更贴合 LXD 特性与限速/快照/IPv6） |

文件结构（以 `OpenIDC-IDCSmart` 为例）：

```
OpenIDC-IDCSmart/
├── idcserver.php          # 模块主逻辑（~75KB，完整生命周期）
└── templates/
    ├── info.html          # 主信息面板（实时指标）
    ├── ipv4.html          # IPv4 管理（主备 IP、反查）
    ├── ipv6.html          # IPv6 管理
    ├── nat.html           # NAT 端口转发面板
    └── proxy.html         # HTTP/HTTPS 反向代理面板
```

## 📋 前置条件

| 项 | 要求 |
|----|------|
| 魔方财务 | **IDCSmart v3 / v4 / v5**（财务 / 业务一体版） |
| PHP | 7.2+ / 8.x |
| OpenIDCS | 主控端可通过 HTTPS 访问 |
| API Token | OpenIDCS 生成的专用 Token |

## 🚀 安装步骤

### 步骤 1 · 下载并部署插件

```bash
# 魔方财务目录下
cd /path/to/idcsmart/public/plugins/server/

# OpenIDCS 通用版
git clone https://github.com/OpenIDCSTeam/FSPlugins.git /tmp/fsplugins
cp -r /tmp/fsplugins/OpenIDC-IDCSmart ./openidc

# LXD 专版（按需）
cp -r /tmp/fsplugins/LxdServer-IDCSmart ./lxdserver

chown -R www-data:www-data ./openidc ./lxdserver
```

### 步骤 2 · 启用插件

1. 登录魔方财务后台 → **模块 / 插件管理 → 接口模块**。
2. 找到 `openidc`（或 `lxdserver`）→ 点击 **启用**。
3. 启用后会在 **产品管理 → 新建产品** 的模块下拉中出现。

### 步骤 3 · 在 OpenIDCS 中生成 Token

1. OpenIDCS → **系统设置 → API Token → 新建**。
2. 配置：
   - 名称：`idcsmart-integration`
   - 权限：`vm:*`、`network:*`、`user:read`
   - IP 白名单：魔方财务服务器出口 IP
3. 复制生成的 Token。

### 步骤 4 · 配置产品

魔方财务后台 → **产品管理 → 新建产品**：

- 产品分类：`云服务器`
- 产品名称：`OpenIDCS 通用 VPS - 1C2G`
- 接口模块：`openidc`（或 `lxdserver`）
- 配置选项：

| 字段 | 示例 |
|------|------|
| API 地址 | `https://openidcs.example.com` |
| API Token | `OID-xxxxxxxxxxxxxxxx` |
| 节点 ID | `2`（对应 OpenIDCS 中的 Proxmox/ESXi 主机 ID） |
| CPU | `1` |
| 内存（MB） | `2048` |
| 磁盘（GB） | `20` |
| 带宽（Mbps） | `100` |
| 流量（GB） | `1000` |
| 默认镜像 | `ubuntu-22.04` |
| 是否启用 IPv6 | ✅ |
| 是否启用 NAT 转发面板 | ✅ |
| 是否启用反代面板 | ✅ |

点击 **测试连接** → 确认主机可达 → 保存。

### 步骤 5 · 客户下单与开通

1. 魔方前台 → 浏览产品 → 下单支付。
2. 订单变更为 `待开通` → 魔方自动调 `create` 方法 → OpenIDCS 创建 VM。
3. 开通完成后，订单详情显示 IP、端口、初始密码。

### 步骤 6 · 客户区面板

客户登录魔方财务前台进入服务详情，可以看到以下 Tab（由对应 `.html` 模板渲染）：

- **📊 Info**（info.html）
  实时 CPU / 内存 / 磁盘 / 流量，ECharts 曲线；开关机、重启、重装、修改密码按钮。

- **🌐 IPv4**（ipv4.html）
  主/附加 IP 列表，反向 DNS（PTR）设置，带宽/流量统计。

- **🌐 IPv6**（ipv6.html）
  IPv6 地址池分配与管理（LXD 版尤其完善）。

- **🔀 NAT 端口转发**（nat.html）
  自助添加/删除端口转发规则（TCP/UDP，多规则支持）。

- **🔐 反向代理**（proxy.html）
  自助绑定域名，自动申请 SSL 证书（依赖 OpenIDCS Caddy）。

## 🔁 生命周期映射

| 魔方财务动作 | 插件接口 | OpenIDCS 动作 |
|--------------|----------|----------------|
| 开通 | `create()` | POST `/api/vms` |
| 暂停 | `suspend()` | POST `/api/vms/{id}/suspend` |
| 解除暂停 | `unsuspend()` | POST `/api/vms/{id}/unsuspend` |
| 续费 | `renew()` | 更新到期时间 |
| 升降配 | `changePackage()` | PATCH `/api/vms/{id}` |
| 删除 | `terminate()` | DELETE `/api/vms/{id}` |
| 重装 | `reinstall()` | POST `/api/vms/{id}/reinstall` |
| 修改密码 | `crePassword()` | POST `/api/vms/{id}/password` |
| 开关机 | `on()/off()/reboot()` | POST `/api/vms/{id}/action` |
| NAT | `natAdd/natDel` | POST/DELETE `/api/nat` |
| 反代 | `proxyAdd/proxyDel` | POST/DELETE `/api/proxy` |

## 🧾 流量 / 费用对账

- OpenIDCS 定时（默认每 10 分钟）推送 VM 指标到 IDCSmart
- 超流量时可触发魔方自动暂停或限速
- 月末账单自动归集流量费 / 额外 IP 费等

## 🆚 通用版 vs LXD 专版

| 能力 | OpenIDC-IDCSmart | LxdServer-IDCSmart |
|------|:----------------:|:------------------:|
| 虚拟化后端 | Proxmox / ESXi / Hyper-V / VMware / Docker 等 | 仅 LXD |
| 开通速度 | 视后端而定（30s ~ 5min） | ⚡ 秒级 |
| IPv6 原生 | ✅ | ✅✅（LXD 天然支持） |
| 带宽限速 | 通用 | 精细（cgroup） |
| NAT / 反代面板 | ✅ | ✅ |
| 嵌套虚拟化 | 视后端 | ✅ 可选 |

**建议**：以 LXD 为主售卖 VPS，用 LXD 专版；同时售卖 KVM VM，用通用版，两插件并存。

## 🛡 安全建议

- ✅ API Token **一个产品一个 Token**，降低泄露影响面
- ✅ 启用 IP 白名单与 HTTPS
- ✅ 魔方财务管理员账户开启 TOTP 两步验证
- ✅ 客户区 AJAX 接口做签名防重放（插件已实现）

## 🧯 常见问题

<details>
<summary><b>模块列表不显示 openidc？</b></summary>

- 检查插件目录属主与权限
- 检查文件完整：`idcserver.php` + `templates/` 全目录
- 在魔方管理后台 → 插件 → 重新扫描
</details>

<details>
<summary><b>客户区 Tab 空白？</b></summary>

- 浏览器 Console 查看 AJAX 错误
- 模板路径是否正确：`plugins/server/openidc/templates/info.html`
- OpenIDCS 服务是否正常（网络可达 / Token 有效）
</details>

<details>
<summary><b>开通卡在 "等待中"？</b></summary>

- 查看 OpenIDCS 审计日志确认是否收到请求
- 查看魔方插件日志：`plugins/server/openidc/logs/*.log`
- 超时时长可在插件配置项调节
</details>

<details>
<summary><b>NAT 面板添加失败？</b></summary>

- 确认 OpenIDCS 宿主机已启用 iptables / nftables 模块
- 确认端口未被宿主机占用
- 检查防火墙链配置
</details>

---

👉 相关：[SwapIDC 集成](/fsplugins/swapidc) · [小黑云集成](/fsplugins/xiaohei) · [LXD 部署](/vm/lxd) · [Proxmox 部署](/vm/proxmox)
