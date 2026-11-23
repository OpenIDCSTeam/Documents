# MEmu 模拟器部署

MEmu（逍遥安卓模拟器）用于安卓云手机场景，只支持 **Windows 宿主**，通过 `memuc` 命令行管理。主控必须和模拟器装在同一台机器上（`is_remote = false`）。

## 前置条件

- Windows 10/11（x86_64），已开启硬件虚拟化
- 逍遥模拟器，官网 <https://www.memuplay.com/>
- 有独显更好，渲染模式可以在 DirectX 和 OpenGL 之间切

## 安装

`quickidc plat install` 不接管这个平台，需要手动装。装完记下 `memuc.exe` 所在目录，默认是 `%APPDATA%\Microvirt\MEmu`（即 `C:\Users\<用户名>\AppData\Roaming\Microvirt\MEmu`），这个目录不在 PATH 里。

```powershell
cd "$env:APPDATA\Microvirt\MEmu"
.\memuc listvms
```

ADB 不用另外开，主控走 `memuc adb -i <索引> -- ...` 调用。

## 主控侧配置

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `memu-01` | `hs_name` |
| 服务器类型 | MEmu Game Emulator | `MemuAndroid` |
| 服务器地址 | 留空或 `localhost` | 必须本机 |
| 程序启动路径 | `%APPDATA%\Microvirt\MEmu` | `memuc.exe` 所在目录 |

主机可选参数：

| 参数 | 说明 |
|---|---|
| `graphics_render_mode` | `1` DirectX（默认） / `0` OpenGL |
| `enable_su` | 是否以 root 权限启动 |
| `enable_audio` | 是否启用音频 |
| `fps` | 帧率，如 `30` / `60` |

```bash
quickidc host add --name memu-01 --type MemuAndroid --addr localhost
```

## 能力与限制

| 项目 | 支持 |
|---|---|
| GPU / 显存 | 不支持（引擎 `ban` 限制） |
| 额外数据盘 | 不支持 |
| ISO | 用 APK 安装替代 |
| 暂停 / 恢复 | 不支持 |
| 控制台 | 内置 VNC（ADB 抓帧 + 触摸注入），同时保留 ADB 端口 |
| 安卓版本 | 4.4 / 5.1 / 7.1 / 7.1 64 位 / 9 / 9 64 位 / 12 |

## 验证

```powershell
memuc listvms
```

主控实例列表里能看到模拟器，详情页可以开 VNC，也能拿到 ADB 地址。

## 常见问题

| 现象 | 处理 |
|---|---|
| 找不到 memuc | 在主机配置里填对「程序启动路径」，默认 `%APPDATA%\Microvirt\MEmu` |
| 启动报 0x80070005 | Hyper-V 虚拟磁盘权限问题，在主机运维页执行「修复运行环境」 |
| 启动后没有虚拟网络 | 检查 Windows 防火墙服务是否在运行 |
| OpenGL 下截图白屏 | 把 `graphics_render_mode` 改回 `1`（DirectX） |
| 装不上 APK | 用 `memuc adb -i <索引> -- install <apk>` 手动装 |
| 无法暂停 | 引擎不支持，属预期 |
