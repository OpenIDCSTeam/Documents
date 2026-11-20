# 监控与告警

## 实例监控

实例详情 → 监控页签：

| 指标 | 说明 |
|---|---|
| CPU | 使用率（%） |
| 内存 | 已用 / 总量 |
| 磁盘 | IOPS / 吞吐（平台支持时） |
| 网络 | 上行 / 下行 |
| 运行时长 | 自上次启动 |

数据来源为平台 API 或宿主采集，采样间隔因平台而异。

## 主机监控

主机详情展示宿主机资源与实例分布：

- 已分配 vCPU / 内存 vs 物理容量；
- 实例数量与状态分布；
- 磁盘与存储池使用率。

## 告警方式

当前版本没有内置告警中心，推荐：

### 1. 宿主机侧监控

```bash
# node_exporter + Prometheus
node_exporter --web.listen-address=:9100
```

### 2. 用 opidcs 拉取指标

```bash
# 定时采集，交给外部系统判断阈值
opidcs host list --output json > /var/lib/openidcs/hosts.json
```

### 3. 日志告警

```bash
opidcs logs list --level error --limit 50 --output json \
  | jq 'length > 0'
```

## 指标口径

| 指标 | 口径 |
|---|---|
| 主机在线 | 最近一次探测成功 |
| 实例运行 | 平台返回的实时状态 |
| CPU 分配 | 实例规格之和（不是实际使用） |
| 内存分配 | 实例规格之和 |
| 磁盘分配 | 系统盘 + 数据盘 |

::: tip 超卖判断
「分配 / 物理」长期大于 1 表示超卖。CPU 超卖通常可接受，内存超卖容易触发 OOM。
:::

## 相关页面

- [系统概览](/usage/dashboard)
- [监控与日志](/features/monitoring)
- [日志查看](/usage/logs)
