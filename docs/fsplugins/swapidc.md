# SwapIDC 集成教程

> 🔌 使用 `OpenIDC-SwapIDC` 插件让 OpenIDCS 与 SwapIDC 无缝对接，**下单即开通**。

## 🎯 适用场景

- 主机商已使用 **SwapIDC** 作为客户 / 订单 / 财务系统
- 希望通过 SwapIDC 直接售卖 OpenIDCS 管理的 **VPS / 独立 VM / 容器**
- 希望客户在 SwapIDC 客户区直接自助 **开关机、重启、VNC、重装、改密码**

## 📦 插件与仓库

- 插件目录：`FSPlugins/OpenIDC-SwapIDC/`
- 版本：见 `version` 文件（当前 `1.0`）
- 核心文件：

| 文件 | 作用 |
|------|------|
| `openidc.php` | 模块主文件，定义 SwapIDC Hook（创建 / 暂停 / 删除 / 续费等） |
| `clientarea.tpl` | 客户区模板（开关机、VNC、流量统计） |
| `whm.lib.php` | HTTP 工具（签名、请求、重试） |
| `lang/Chinese.php` | 中文语言包 |
| `version` | 当前插件版本 |

## 📋 前置条件

| 项 | 要求 |
|----|------|
| SwapIDC | 已搭建并正常运行 |
| OpenIDCS | 主控端已部署，可通过 HTTPS 访问 |
| API Token | OpenIDCS 中已生成用于 SwapIDC 的 Token |
| PHP | SwapIDC 运行环境 PHP 7.2+ / 8.x |
| cURL | 启用 `php-curl` 扩展 |

## 🚀 安装步骤

### 步骤 1 · 下载插件到 SwapIDC

SSH 登录 SwapIDC 服务器：

```bash
cd /path/to/swapidc/mods/server/
git clone https://github.com/OpenIDCSTeam/FSPlugins.git /tmp/fsplugins
cp -r /tmp/fsplugins/OpenIDC-SwapIDC ./openidc
chown -R www-data:www-data ./openidc   # 按 Web 用户实际改
```

或手动：

```
SwapIDC/mods/server/openidc/
    ├── openidc.php
    ├── clientarea.tpl
    ├── whm.lib.php
    ├── lang/Chinese.php
    └── version
```

### 步骤 2 · 在 OpenIDCS 中生成对接 Token

1. 登录 OpenIDCS → **系统设置 → API Token → 新建 Token**。
2. 配置：
   - **名称**：`swapidc-integration`
   - **权限**：`vm:create`、`vm:manage`、`vm:delete`、`vm:console`、`user:readonly`
   - **IP 白名单**：填写 SwapIDC 服务器出口 IP
   - **有效期**：建议 1 年，到期续期
3. 生成后复制 Token（形如 `OID-xxxxxxxxxxxxxxxxxxxx`），**只显示一次**。

### 步骤 3 · 在 SwapIDC 创建产品

1. SwapIDC 管理后台 → **产品 / 服务 → 新建产品**。
2. 基本信息：产品名 `OpenIDCS-VPS-1C1G`、分类 `VPS`。
3. **模块设置**：
   - 模块：`openidc`
   - API 地址：`https://openidcs.example.com`
   - API Token：`OID-xxxxxxxxxxxxxxxx`
   - 节点 ID：`1`（OpenIDCS 主机 ID，可在"主机管理"查看）
   - 套餐规格：
     - CPU：`1`
     - 内存：`1024` MB
     - 磁盘：`10` GB
     - 带宽：`100` Mbps
     - 流量：`500` GB / 月
   - 默认镜像：`ubuntu-22.04`
4. 测试连接 → 绿勾后保存。

### 步骤 4 · 客户下单

1. SwapIDC 前台 → 选择产品下单 → 支付成功。
2. SwapIDC 自动调用 `openidc.php` 的 `_CreateAccount` 函数 → OpenIDCS 创建 VM。
3. 开通成功后，SwapIDC 订单详情显示 VM IP、初始密码、到期时间。

### 步骤 5 · 客户区自助面板

`clientarea.tpl` 提供以下自助功能：

- ✅ 开机 / 关机 / 重启 / 强制关机
- ✅ VNC 控制台（嵌入 noVNC）
- ✅ 查看实时 CPU / 内存 / 磁盘 / 流量
- ✅ 重装系统（可选镜像）
- ✅ 重置 root 密码
- ✅ 到期续费

## 🔁 生命周期映射

| SwapIDC 事件 | 插件函数 | OpenIDCS 动作 |
|--------------|----------|----------------|
| 订单开通 | `_CreateAccount` | POST `/api/vms` 创建 VM |
| 订单暂停 | `_SuspendAccount` | POST `/api/vms/{id}/suspend` |
| 订单解除暂停 | `_UnsuspendAccount` | POST `/api/vms/{id}/unsuspend` |
| 订单删除 | `_TerminateAccount` | DELETE `/api/vms/{id}` |
| 订单续费 | `_Renew`（可选） | POST `/api/vms/{id}/renew` |
| 客户区操作 | `_ClientArea` → AJAX | 对应 REST 接口 |

## 🧾 流量统计回传

OpenIDCS 每小时推送用量数据到 SwapIDC：

- 接口：`<swapidc>/modules/server/openidc/usage.php`
- 字段：`vm_id, cpu_avg, mem_avg, disk_used, traffic_in, traffic_out`
- 超流量可自动暂停（SwapIDC 策略）

## 🧪 测试 & 验证

```bash
# 1. 在 SwapIDC 服务器测试 API 连通
curl -H "Authorization: Token OID-xxxxxxxx" \
     https://openidcs.example.com/api/hosts

# 2. 在 SwapIDC 后台模拟开通
管理员 → 订单 → 手动创建测试订单 → 观察日志
```

日志位置：

- SwapIDC：`SwapIDC/logs/module_openidc.log`
- OpenIDCS：管理后台 → 审计日志

## 🛡 安全建议

- ✅ 生产环境 **必须** 启用 HTTPS（SwapIDC ↔ OpenIDCS）
- ✅ API Token 启用 IP 白名单
- ✅ SwapIDC 管理后台启用 2FA
- ✅ 定期滚动 Token（每季度）
- ✅ OpenIDCS 审计日志定期归档

## 🧯 常见问题

<details>
<summary><b>开通时报 "签名错误 / 401"</b></summary>

- 检查 API Token 是否完整
- SwapIDC 服务器时间是否同步 NTP
- Token 是否加了 IP 白名单且匹配
</details>

<details>
<summary><b>客户区 VNC 空白</b></summary>

- 浏览器 F12 查看 WebSocket 连接
- 确认 OpenIDCS 的 VNC 代理端口对 SwapIDC / 客户端网络开放
- HTTPS 场景下需使用 `wss://`
</details>

<details>
<summary><b>流量统计未同步</b></summary>

- 检查 OpenIDCS 定时任务是否运行（`系统 → 计划任务 → usage_push`）
- SwapIDC `usage.php` 端点返回是否 200
</details>

---

## 📦 配套面板插件

对于 **使用 cPanel 克隆面板 / 虚拟主机** 的主机商，还可以同时启用：

- `Easypanel-SwapIDC`：EasyPanel × SwapIDC
- `VistaPanel-SwapIDC`：VistaPanel × SwapIDC

两者作为 **非 VM 的 Web 托管产品** 与 OpenIDCS 的 VPS 产品并存售卖。

---

👉 相关：[魔方财务集成](/fsplugins/idcsmart) · [小黑云集成](/fsplugins/xiaohei) · [FSPlugins 总览](/fsplugins/)
