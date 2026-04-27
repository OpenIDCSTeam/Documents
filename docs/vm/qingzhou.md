---
title: 青州云配置
date: 2026-01-01
updated: 2026-04-24
categories:
  - 虚拟机配置
---

# 青州云 / 小黑云（Qingzhou · XiaoHei Cloud）

> ☁️ 国产云 API 对接 · 无需自建宿主机 · 代理售卖 / 二级分销场景

## ✨ 平台特性

| 特性 | 描述 |
|------|------|
| ☁️ **云 API 模式** | 直接调用青州云 / 小黑云 OpenAPI，无需自建 Hypervisor |
| 💼 **适合代理** | 主机商以下级代理身份采购资源，二次加价售卖 |
| 🔁 **OpenIDCS 能力** | 开通 / 升降配 / 续费 / 退款 / 重装 / 密码重置 / VNC / 流量统计 |
| 🧾 **计费整合** | 成本价由上游 API 返回，售价在 OpenIDCS 或财务系统自由设定 |
| 🔌 **FSPlugins 适配** | `OpenIDC-XiaoHei` 插件直接对接魔方 / SwapIDC |

::: tip
"小黑云" 是基于 OpenIDCS / 类 OpenIDCS 体系的国产上游云品牌之一，通常提供 LXC / KVM VPS 的批发 API。"青州云" 同理。二者 API 协议高度相似，OpenIDCS 内置统一 Driver 一次适配。
:::

## 📋 前置要求

| 项 | 要求 |
|----|------|
| 上游账号 | 青州云 / 小黑云 **代理账号** |
| API Key | 从上游控制台获取 `AccessKey / SecretKey`（或 `API Token`） |
| 授权 | 已开通经销 / API 对接白名单 |
| 网络 | OpenIDCS MainServer 能访问上游 OpenAPI Endpoint |

---

## 🚀 部署教程

### 步骤 1 · 获取上游 API 凭证

在上游云控制台（示例字段）：

```
控制台 → 个人中心 → API 管理 → 创建 Access Key
```

记录：

- `Endpoint`：`https://api.qingzhou.example.com`
- `AccessKey ID`：`AKID-xxxxxxxxxxxx`
- `Secret Key`：`••••••••`
- `Region / Zone`：`cn-east-1`（按上游提供）

### 步骤 2 · 在 OpenIDCS 中添加平台

1. 后台 → **主机管理 → 添加主机**。
2. 填写：

| 字段 | 示例 |
|------|------|
| 平台类型 | 青州云 / 小黑云 |
| API Endpoint | `https://api.qingzhou.example.com` |
| Access Key | `AKID-xxxxxxxxxxxx` |
| Secret Key | `••••••••` |
| 区域 | `cn-east-1` |
| 默认镜像 | `ubuntu-22.04` |
| 默认套餐 | `1c1g10g` |

3. 测试连接 → 返回账户余额 / 套餐列表即成功。

### 步骤 3 · 同步套餐 & 镜像

**主机管理 → 青州云节点 → 同步资源**：

- 拉取所有可售卖的 **套餐（CPU/内存/磁盘/带宽/价格）**
- 拉取 **镜像列表（Ubuntu / Debian / CentOS / Windows）**
- 拉取 **可用区列表**

OpenIDCS 管理员可基于上游套餐自行定义 **对外套餐**（叠加利润/资源限制）。

### 步骤 4 · 创建第一个云 VM

1. **虚拟机 → 创建 → 平台：青州云**。
2. 配置：

| 字段 | 示例 |
|------|------|
| 区域 | `cn-east-1` |
| 套餐 | `1c1g10g` |
| 镜像 | `ubuntu-22.04` |
| 主机名 | `test-001` |
| 初始密码 | `ChangeMe!` |
| 时长 | 1 个月 |

3. 提交 → OpenIDCS 调 API 在上游下单 → 返回 VM IP / 状态。
4. 用户可直接：启停 / 重装 / 密码重置 / VNC（上游返回 console URL）。

---

## 🧰 常用操作

### 升降配

**虚拟机详情 → 升降配** → 选目标套餐 → 调 API 下单。

### 续费

**虚拟机详情 → 续费** → 选时长 → 调 API `renewInstance`。

### 重装

**虚拟机详情 → 重装系统** → 选镜像 → 调 API `reinstallInstance`。

### 批量操作

可在 **虚拟机列表 → 多选 → 批量 → 关机 / 重启 / 续费 / 删除**。

### 流量 / 账单对账

OpenIDCS 定时拉取上游流量与账单数据，生成对账报表，避免超卖亏损。

---

## 🛡 代理售卖建议

1. **分层定价**：按套餐对不同等级用户（普通 / 代理 / 金牌）设不同加价。
2. **余额预警**：上游余额不足时触发告警，避免开通失败。
3. **配额控制**：限制单用户最大 VM 数 / 月消费 / 并发操作。
4. **FSPlugins 对接**：
   - 魔方财务 → [`OpenIDC-IDCSmart`](/fsplugins/idcsmart)
   - SwapIDC → [`OpenIDC-SwapIDC`](/fsplugins/swapidc)
   - 小黑云体系 → [`OpenIDC-XiaoHei`](/fsplugins/xiaohei)
5. **风控**：开通频率限制、新用户关机审核、疑似滥用封禁。

## 🧯 常见问题

<details>
<summary><b>测试连接提示签名错误？</b></summary>

- 确认服务器时间准确（NTP 同步），签名算法对时间敏感（通常 ± 5 分钟）
- 确认 Access Key/Secret 复制时无多余空格
- 确认账号状态正常，未被风控
</details>

<details>
<summary><b>开通失败 "套餐不存在"？</b></summary>

点击 **同步资源** 重新拉取上游套餐列表，确保 OpenIDCS 缓存与上游一致。
</details>

<details>
<summary><b>VNC 打不开？</b></summary>

上游返回的是时效性 console URL，过期后需重新拉取。OpenIDCS 会自动续期。
</details>

---

👉 相关：[FSPlugins：小黑云集成](/fsplugins/xiaohei) · [用户配额](/tutorials/permissions) · [备份与恢复](/tutorials/backup)
