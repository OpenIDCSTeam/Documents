# 控制台与远程访问

OpenIDCS 把「连上这台机器」做成浏览器内的能力，不要求用户安装 VNC 客户端或记住宿主机端口。

## 三种通道

| 通道 | 适用平台 | 端口 | 入口 |
|---|---|---|---|
| noVNC | LXD、Proxmox、ESXi、Hyper-V、QEMU、VirtualBox(VRDE)、Workstation | 主控 `6080` + 平台端口 | 实例详情 → 控制台 |
| Web SSH | 全部 Linux 系平台（容器 / 虚拟机） | 主控 `7681` | 实例详情 → 终端 |
| RDP / ADB | Hyper-V、Workstation（RDP）；MuMu（ADB） | 平台侧 | 实例详情 → 远程信息 |

::: info 全局代理，不是逐实例代理
`6080`（VNC）与 `7681`（SSH）是主控进程内启动的两个代理服务，与具体平台无关；平台差异只体现在「如何拿到 VNC 地址 / 如何执行命令」。
:::

## VNC 工作流程

1. 前端请求 `GET /api/client/remote/:hs_name/:vm_uuid`；
2. 主控向平台驱动索取 VNC 地址与票据（Proxmox 需 `vncwebsocket` 票据，ESXi 需 ticket，LXD 走 `lxc console`）；
3. 主控生成一次性 token，并登记来源 IP；
4. 浏览器打开 `VNCConsole/vnc.html?token=...`，WebSocket 连到主控 `6080/websockify`；
5. 主控校验 token 与 IP 后，与平台建立 TCP 通道并双向转发。

安全约束：

- token 有有效期且绑定客户端 IP；
- 支持 `wss`（由反向代理终止 TLS）；
- 控制台页面为本地静态资源（noVNC），不依赖外部 CDN。

## Web SSH

- 主控内置 SSH 终端服务，默认 `7681`；
- 首次连接使用 TOFU（Trust On First Use）记录主机密钥，后续变更会告警；
- 凭据来自实例的临时凭据或访问密钥，不落库明文。

## 临时凭据与访问密钥

| 类型 | 有效期 | 生成方式 | 用途 |
|---|---|---|---|
| 临时凭据 | 短时（由主控签发） | `GET /api/client/temptoken/:hs/:uuid` | 一次性登录控制台 |
| 访问密钥 | 长期（16 位） | `POST /api/client/access-key/:hs/:uuid` | 用户自助登录，可随时吊销 |

访问密钥登录走 `GET/POST /api/client/keylogin`，登录后权限与临时凭据一致。

## RDP 与安卓

- **Hyper-V / Workstation**：返回 RDP 地址与账号信息，用户用系统远程桌面连接。
- **MuMu**：返回 ADB 连接地址（`adb connect host:port`），用于云手机场景。

## 常见问题

| 现象 | 原因 | 处理 |
|---|---|---|
| 控制台黑屏 | 平台 VNC 端口不可达 | 检查宿主防火墙与 `remote_port` |
| token 失效 | 超过有效期或 IP 变化 | 重新打开控制台生成新 token |
| Web SSH 连不上 | 实例未启动 SSH / 密码错误 | 用 VNC 登录检查 sshd 与账号 |
| 提示主机密钥变更 | 实例重装 | 在系统设置中确认并更新指纹 |

## 相关页面

- [实例管理](/usage/vms)
- [网络与端口](/features/network)
- [共享与访问密钥](/features/access)
