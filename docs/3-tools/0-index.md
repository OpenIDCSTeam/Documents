# 管理工具总览

OpenIDCS 提供两套管理工具，能力同源：

| 工具 | 形态 | 适用 |
|---|---|---|
| **opidcs CLI** | 跨平台命令行（Linux / macOS / Windows） | 批量运维、脚本、CI、无图形环境 |
| **opidcs Desktop** | Tauri 桌面客户端 | 日常管理、多主控切换、可视化操作 |

两者都直接调用主控 REST API；涉及本机特权操作（安装服务、安装平台运行时、重置本机 Token）时，桌面端通过随包附带的 `opidcs` sidecar 执行，避免两套逻辑漂移。

## 能力对照

| 能力 | CLI | Desktop |
|---|---|---|
| 主控安装/启停/更新 | ✅ `opidcs core` | ✅（调用 sidecar） |
| 平台运行时安装/检测 | ✅ `opidcs plat` | ✅ |
| 主机管理 | ✅ `opidcs host` | ✅ |
| 实例与电源 | ✅ `opidcs vm` | ✅ |
| 端口转发 | ✅ `opidcs port` | ✅ |
| 反向代理 | ✅ `opidcs webx` | ✅ |
| 用户 / 任务 / 日志 | ✅ | ✅ |
| 系统设置 / Token | ✅ `opidcs conf` | ✅ |
| 多主控 | ✅ `--core` | ✅ 切换器 |
| 输出格式 | table / json / yaml | 表格 + 详情抽屉 |

## 安装

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh

# Windows（PowerShell）
irm https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.ps1 | iex
```

桌面端从 Releases 下载对应安装包。详见 [安装与更新](/tools/install)。

## 设计约定

- **能力表唯一**：CLI 的 `--help`、交互式菜单、文档三处由同一份命令表生成；
- **凭据安全**：配置写入 `~/.config/opidcs/config.yaml`（0600），桌面端存系统密钥串；
- **默认遮罩**：Token 只显示前后各 4 位，`--show-secret` 才明文；
- **可脚本化**：所有命令支持 `--output json`，失败返回非 0 退出码。

## 下一步

- [opidcs 命令行](/tools/cli)
- [opidcs 桌面客户端](/tools/gui)
- [安装与更新](/tools/install)
