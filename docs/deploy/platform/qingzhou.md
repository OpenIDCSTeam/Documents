# 青州云 Qingzhou（未启用）

青州云驱动代码仍保留在仓库中，但引擎元信息默认 `Enabled: false`，**不会出现在 `/api/system/engine` 返回的类型列表中**，因此当前版本无法在界面新增青州云主机。

## 为什么保留

- 历史用户可能仍有存量记录；
- 驱动实现（`qingzhou_driver.go` / `qingzhou_lifecycle.go` / `qingzhou_ext.go`）完整，便于需要时重新启用；
- 与 Python 版行为保持一致（Python 版同样不对外暴露）。

## 如需启用

1. 修改 `CloudHost/internal/driver/engine_config.go` 中 `QingzhouYun` 的 `Enabled` 为 `true`；
2. 重新编译并部署主控；
3. 在「主机管理」新增主机，填写青州云 API 地址与凭据。

```go
{
    Type:        "QingzhouYun",
    Description: "QingzhouYun Cloud",
    Enabled:     true, // 默认 false
    IsRemote:    true,
    Platform:    []string{"Linux", "Windows", "MacOS"},
    // ...
}
```

::: warning 未验证能力
该驱动未参与当前版本的常规测试，启用前请先在隔离环境验证创建、开关机、控制台与删除链路。
:::

## 当前建议

| 需求 | 替代方案 |
|---|---|
| 云主机纳管 | Proxmox VE / ESXi / QEMU |
| 轻量容器 | Docker / LXD |
| 多租户售卖 | 任一已启用平台 + 财务插件 |

## 相关页面

- [支持的虚拟机平台](/features/platforms)
- [主机配置详解](/deploy/host-config/)
