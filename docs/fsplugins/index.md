# FSPlugins 财务系统插件

> 🔌 让 OpenIDCS 无缝对接主流 IDC 财务系统，**零开发即可售卖**。

## 📦 什么是 FSPlugins？

**FSPlugins**（Financial System Plugins）是 OpenIDCS 官方维护的一组 **财务系统对接插件**，用于把 OpenIDCS 直接接入到市面上主流的 IDC 财务/客户系统中，实现：

- 🛒 客户在财务系统下单 → OpenIDCS 自动开通 VM
- 💰 到期自动暂停 / 续费后恢复
- 🔄 客户在财务前端直接操作开/关机、重启、重装、VNC、修改密码
- 📊 流量 / 用量 / 配额数据回传财务系统计费
- 🛠 工单、客户区、带宽面板、NAT 面板、反代面板嵌入

仓库：<https://github.com/OpenIDCSTeam/FSPlugins>

## 🧩 支持的财务系统

| 系统 | 插件 | 适配后端 | 文档 |
|------|------|----------|------|
| **SwapIDC** | `OpenIDC-SwapIDC`、`Easypanel-SwapIDC`、`VistaPanel-SwapIDC` | OpenIDCS / EasyPanel / VistaPanel | [📖 SwapIDC 集成](/fsplugins/swapidc) |
| **魔方财务（IDCSmart）** | `OpenIDC-IDCSmart`、`LxdServer-IDCSmart` | OpenIDCS 通用 / LXD 专版 | [📖 魔方财务集成](/fsplugins/idcsmart) |
| **小黑云 / XiaoHei Cloud** | `OpenIDC-XiaoHei`（基于 SwapIDC 协议扩展） | 国产云代理 | [📖 小黑云集成](/fsplugins/xiaohei) |

## 🧱 插件仓库结构

```
FSPlugins/
├── OpenIDC-SwapIDC/         # OpenIDCS × SwapIDC 通用插件
│   ├── openidc.php          # 核心逻辑（开通/续费/暂停/删除）
│   ├── clientarea.tpl       # 客户区模板
│   ├── whm.lib.php          # HTTP 工具
│   ├── lang/Chinese.php     # 中文语言包
│   └── version
│
├── OpenIDC-IDCSmart/        # OpenIDCS × 魔方财务 通用插件
│   ├── idcserver.php        # 主逻辑
│   └── templates/
│       ├── info.html        # 信息面板
│       ├── ipv4.html / ipv6.html
│       ├── nat.html         # NAT 端口转发
│       └── proxy.html       # 反向代理
│
├── LxdServer-IDCSmart/      # LXD 专版魔方插件（更贴合 LXD 特性）
│   ├── lxdserver.php
│   └── templates/ ...
│
├── Easypanel-SwapIDC/       # EasyPanel 主机面板 × SwapIDC
├── VistaPanel-SwapIDC/      # VistaPanel 主机面板 × SwapIDC
```

## 🚀 快速开始

1. 在财务系统上 **创建产品** → 选择对应插件作为对接模块。
2. 在插件配置中填写 **OpenIDCS 主控端地址 + API Token**。
3. 在 OpenIDCS 中 **生成财务专用 Token**（权限最小化）。
4. 在财务系统上 **下单测试** → 确认自动开通。
5. 进入 **客户区** 测试开关机、VNC、重装、修改密码等自助功能。

详细配置见各插件专页：

- 👉 [SwapIDC 集成教程](/fsplugins/swapidc)
- 👉 [魔方财务集成教程](/fsplugins/idcsmart)
- 👉 [小黑云集成教程](/fsplugins/xiaohei)

## 🔐 权限与安全

- **专用 Token**：为每个财务对接创建独立 Token，避免共享 root Token。
- **IP 白名单**：Token 绑定财务系统服务器 IP。
- **HTTPS**：OpenIDCS 与财务系统之间务必启用 HTTPS。
- **日志审计**：所有来自 FSPlugins 的调用都会记录在 OpenIDCS 审计日志中。

## 🧯 故障排查

<details>
<summary><b>下单开通失败</b></summary>

- 查 OpenIDCS 审计日志：请求是否到达
- 查财务系统模块日志：插件返回的错误信息
- 检查 Token、套餐 ID、镜像 ID 是否匹配
</details>

<details>
<summary><b>客户区功能按钮无效？</b></summary>

- 确认 `clientarea.tpl` / `templates/*.html` 已正确部署
- 浏览器控制台查看 AJAX 错误
- 检查 OpenIDCS 是否允许跨域（通常由财务系统后端代理，无需 CORS）
</details>

---

## 🤝 贡献新插件

想把 OpenIDCS 对接到其它财务系统（如 WHMCS、Blesta、独立云控等）？欢迎 PR！

插件实现需提供：

1. `createAccount` · `suspendAccount` · `unsuspendAccount` · `terminateAccount`
2. `changePackage`（升降配）· `renew`（续费）
3. `clientArea` 客户区模板 + 自助功能 AJAX 接口
4. 中英文语言包

详见仓库 [CONTRIBUTING.md](https://github.com/OpenIDCSTeam/FSPlugins)。
