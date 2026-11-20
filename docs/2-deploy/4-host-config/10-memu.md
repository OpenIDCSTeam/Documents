# MuMu 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
</div>

::: warning 必须同机
MuMu 引擎 `is_remote = false`，主控必须与模拟器安装在同一台 Windows 上。
:::

前置：[MuMu 与 memuc 已就绪](/deploy/platform/memu)。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `mumu-01` | 唯一 |
| 服务器类型 | MEmu Game Emulator | `MemuAndroid` |
| 服务器地址 | `localhost` | 固定本机 |
| 程序启动路径 | `C:\Program Files\Netease\MuMuPlayer-12.0\shell` | memuc |
| 虚拟机数量限制 | `10` | — |

可选参数：

| 参数 | 示例 |
|---|---|
| `graphics_render_mode` | `1`（DirectX）/ `0`（OpenGL） |
| `enable_su` | `1` |
| `enable_audio` | `0` |
| `fps` | `60` |

```bash
opidcs host add --name mumu-01 --type MemuAndroid --addr localhost
opidcs plat credentials show memu
```

## 验证

- [ ] `memuc listvms` 正常
- [ ] 主控在线、实例可见
- [ ] ADB 地址可连接

## 待维护者补充

- [ ] 多开实例的资源规划
- [ ] APK 安装流程
- [ ] 显卡与渲染模式选择
