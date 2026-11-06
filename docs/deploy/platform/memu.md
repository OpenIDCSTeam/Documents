# MuMu 模拟器部署

MuMu 引擎用于安卓云手机场景，仅支持 **Windows 宿主**，通过 `memuc` 命令行管理。主控必须与模拟器同机（`is_remote = false`）。

## 前置条件

- Windows 10/11（x86_64）
- MuMu 模拟器 12（或兼容版本）
- 已开启硬件虚拟化
- 建议独立显卡（渲染模式可切换 DirectX / OpenGL）

## 安装

1. 安装 MuMu 模拟器，记住安装目录（含 `memuc.exe`）；
2. 在设置中开启 ADB 调试；
3. 验证命令行：

```powershell
cd "C:\Program Files\Netease\MuMuPlayer-12.0\shell"
.\memuc listvms
.\memuc adb
```

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `mumu-01` | `hs_name` |
| 服务器类型 | MEmu Game Emulator | `MemuAndroid` |
| 服务器地址 | 留空 / `localhost` | 必须本机 |
| 程序启动路径 | `C:\Program Files\Netease\MuMuPlayer-12.0\shell` | memuc 目录 |

主机可选参数：

| 参数 | 说明 |
|---|---|
| `graphics_render_mode` | `1` DirectX / `0` OpenGL |
| `enable_su` | 是否以 root 启动 |
| `enable_audio` | 是否启用音频 |
| `fps` | 帧率，如 `30` / `60` |

```bash
opidcs plat install memu
opidcs host add --name mumu-01 --type MemuAndroid --addr localhost
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | ❌（受引擎 `ban` 限制） |
| 额外数据盘 | ❌ |
| ISO | 以 APK 安装替代 |
| 暂停 / 恢复 | ❌ |
| 控制台 | ADB 连接信息 |

## 验证

```powershell
memuc listvms
```

主控实例列表应能看到模拟器，详情页给出 ADB 地址。

## 常见问题

| 现象 | 处理 |
|---|---|
| 找不到 memuc | 在主机配置里填对「程序启动路径」 |
| ADB 连不上 | 模拟器设置里开启 ADB，检查端口 |
| 画面卡顿 | 切换渲染模式 / 调整 FPS |
| 无法暂停 | 引擎不支持，属预期 |
