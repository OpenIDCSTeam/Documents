---
title: 青州云配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# 青州云 (Qingzhou) 配置教程

本文介绍如何将 **青州云** 接入 OpenIDCS。青州云是一种基于公有云 API 的虚拟化接入方式，适用于已有云资源的用户将其统一纳入 OpenIDCS 管理。

## ✨ 优缺点一览

### 👍 优点

- **开箱即用**：无需自建基础设施，注册账号即可使用
- **弹性计费**：按需开通 / 释放，避免固定投入
- **高可用**：底层由云厂商提供 SLA 保障
- **API 完备**：云厂商提供完整 REST API
- **异地多活**：跨可用区部署简单

### 👎 缺点

- **成本**：长期持有实例成本高于自建
- **网络依赖**：OpenIDCS 与云 API 间需稳定公网
- **功能受限**：部分底层操作（如 PCI 直通）无法实现
- **数据主权**：数据位于云厂商机房

### 🎯 推荐场景

- 已有青州云账户，希望纳入 OpenIDCS 统一管理
- 混合云架构：本地 + 云
- 临时性业务高峰扩容

## 🖥️ 前置要求

| 项目 | 要求 |
|------|------|
| **青州云账号** | 已完成实名认证 |
| **AccessKey** | 控制台创建的 API Key |
| **API Endpoint** | 云厂商 API 网关地址 |
| **网络** | OpenIDCS 主控端能访问公网 |

## 🚀 接入配置

### 步骤 1：在青州云控制台创建 AccessKey

1. 登录青州云控制台
2. 进入 **账户中心 → AccessKey 管理**
3. 点击 **创建 AccessKey**
4. 保存 **AccessKey ID** 和 **AccessKey Secret**（Secret 仅显示一次）

::: warning 注意
AccessKey 拥有账户全部权限，请妥善保管。生产环境建议：
- 使用子账号 / 最小权限策略
- 启用 IP 白名单
- 定期轮换密钥
:::

### 步骤 2：（推荐）创建子账号

```
控制台 → 账户 → 用户管理 → 创建用户
  用户名: openidcs-service
  访问方式: 编程访问

权限策略:
  - ECS 只读 + 实例管理
  - VPC 只读
  - 监控读
```

为子账号单独生成 AccessKey 供 OpenIDCS 使用。

### 步骤 3：获取 API Endpoint

常见 Endpoint 示例：

| Region | Endpoint |
|--------|----------|
| 华北 | `https://api.qingzhou.cn` |
| 华东 | `https://api-hd.qingzhou.cn` |
| 华南 | `https://api-hs.qingzhou.cn` |

具体以你实际购买的 Region 为准。

### 步骤 4：测试 API 连通性

```bash
# 简单 ping 测试
curl -I https://api.qingzhou.cn

# OpenIDCS 主控端预装的 Python 测试
python -c "
import requests
r = requests.get('https://api.qingzhou.cn/v1/regions')
print(r.status_code, r.text[:200])
"
```

### 步骤 5：配置本地网络（可选）

如果希望在 OpenIDCS 中为青州云虚机配置 NAT 端口转发 / Web 反向代理，需要确保：

- OpenIDCS 主控端有公网 IP
- 或通过 VPN / 专线打通 VPC

### 步骤 6：准备镜像 & 套餐

青州云通过 **镜像 ID** 和 **套餐 ID** 创建实例：

```
控制台 → 云主机 → 镜像管理
  记录需要使用的镜像 ID（image-xxxx）

控制台 → 云主机 → 套餐管理
  记录需要使用的套餐 ID（flavor-xxxx）
```

在 OpenIDCS 虚拟机模板中填写这些 ID。

## 🔗 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入 **主机管理 → 添加主机**
3. 填写配置：

   | 字段 | 值 |
   |------|-----|
   | 主机名称 | `qingzhou-01` |
   | 主机类型 | `青州云 (Qingzhou)` |
   | API Endpoint | `https://api.qingzhou.cn` |
   | Region | `cn-north-1` |
   | AccessKey ID | AccessKey ID |
   | AccessKey Secret | AccessKey Secret |
   | VPC ID | 目标 VPC（可选） |
   | 默认镜像 | `image-xxxxx` |
   | 默认套餐 | `flavor-xxxxx` |

4. 点击 **测试连接**，OpenIDCS 会调用 `DescribeRegions` 验证凭证
5. 通过后点击 **保存**

## 🧩 支持的操作

OpenIDCS 通过青州云 OpenAPI 支持以下操作：

| 操作 | 说明 |
|------|------|
| 实例列表 | 拉取 VPC 内所有实例 |
| 创建实例 | 根据模板创建 |
| 启动/停止/重启 | 电源管理 |
| 销毁实例 | 释放云主机 |
| 改密 `VMPasswd` | 调用 `ResetPassword` |
| 重置系统 | 调用 `RebuildInstance` |
| 快照 / 备份 | 基于云厂商快照接口 |
| 磁盘挂载 | 弹性云硬盘挂载 |
| 监控 | CPU/内存/磁盘/网络 |
| VNC 控制台 | `GetVncUrl` 生成免密登录链接 |

## 🐛 故障排查

### 问题 1：签名错误 `InvalidSignature`

- 检查主控端与 API 服务器时间差 ≤ 15 分钟
- 确认 AccessKey Secret 未包含多余空白

```bash
# Linux 同步时间
sudo ntpdate ntp.aliyun.com

# Windows
w32tm /resync
```

### 问题 2：权限不足 `Forbidden.NoPermission`

登录控制台检查子账号策略：

- 是否授予 ECS / VPC 相关 Action
- 是否设置了过严的资源 ARN 限制

### 问题 3：API 限流 `Throttling`

- 开启 OpenIDCS 的 API 缓存（设置中调整 `qingzhou_cache_ttl`）
- 申请提升 QPS 配额

### 问题 4：镜像/套餐不存在

- 确认 Region 与镜像所在 Region 一致
- 确认镜像未被删除或在审核中

## 🔒 安全建议

- **子账号 + 最小权限**：不要用主账号 AccessKey
- **IP 白名单**：控制台限制 AccessKey 仅允许 OpenIDCS 主控端 IP 使用
- **定期轮换**：每 90 天更换一次 AccessKey
- **审计日志**：开启云厂商 ActionTrail，监控异常调用
- **Secret 加密存储**：OpenIDCS 默认使用 SQLite + 字段级加密

## 📚 参考资源

- 青州云 OpenAPI 官方文档（控制台 → 帮助 → API 参考）
- [OpenIDCS HostServer/QingzhouYun.py 源码](https://github.com/OpenIDCSTeam/OpenIDCS-Client/blob/main/HostServer/QingzhouYun.py)

## 下一步

- 🏢 查看 [Proxmox VE 配置](/vm/proxmox)
- 🐳 查看 [Docker / Podman 配置](/vm/docker)
- 🚀 返回 [快速上手](/guide/quick-start)
