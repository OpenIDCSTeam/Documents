# 架构设计

本文档从整体架构、分层设计、核心模块、数据流、关键流程等角度，系统说明 OpenIDCS 的内部实现。

## 整体架构

OpenIDCS 采用**前后端分离 + 插件化驱动 + 受控端 Agent**的经典三段式架构：

```mermaid
graph TB
    subgraph "浏览器 / 第三方系统"
        U1[Web 用户]
        U2[API 调用方<br/>魔方 / CI / 巡检]
    end

    subgraph "主控端 Host Server"
        FE["🖥️ FrontPages<br/>React 18 + TS + Vite"]
        API["⚙️ Flask RESTful API<br/>Auth / Session / i18n"]
        BIZ["🔧 业务模块层<br/>HostManager / UserManager<br/>DataManager / NetsManager<br/>SSHDManager / HttpManager"]
        OBJ["📦 核心对象层<br/>MainObject: Config / Server / Public"]
        DRV["🖧 驱动层 (HostServer/*)<br/>Workstation / ESXi / LXD<br/>OCI / Proxmox / HyperV / Qingzhou"]
        INF["🏗️ 基础设施<br/>VNCConsole / Websockify / ZJMFServer"]
        DB[(SQLite 数据库)]
    end

    subgraph "受控端"
        C1[VMware Workstation<br/>vmrest :8697]
        C2[ESXi / vCenter<br/>:443]
        C3[LXD Daemon<br/>:8443]
        C4[Docker Daemon<br/>:2376 TLS]
        C5[Proxmox VE<br/>:8006]
        C6[Hyper-V<br/>WinRM :5985]
        C7[青州云 OpenAPI]
    end

    U1 --> FE
    U2 --> API
    FE --> API
    API --> BIZ
    BIZ --> OBJ
    BIZ --> DRV
    BIZ --> DB
    API --> INF
    DRV --> C1 & C2 & C3 & C4 & C5 & C6 & C7
```

## 分层说明

### 1. 前端层（FrontPages）

- **技术栈**：React 18 + TypeScript + Vite + Ant Design 5 + ECharts + TailwindCSS + DaisyUI + Zustand
- **职责**：页面渲染、状态管理、i18n、主题、图表、VNC/SSH 控制台
- **打包产物**：生产时被后端 Flask 作为静态资源托管

```mermaid
graph LR
    A[React 18 + TS] --> B[Ant Design 5]
    A --> C[ECharts 图表]
    A --> D[TailwindCSS + DaisyUI]
    A --> E[Zustand 状态]
    A --> F[Axios HTTP]
    G[Vite 构建] --> A
```

### 2. 应用层（Flask）

- **入口文件**：`HostServer.py` / `MainServer.py`
- **职责**：
  - HTTP 路由 / REST 接口注册
  - Token + Session 双认证
  - i18n（`HostConfig/translates/`）
  - 静态资源托管
  - WebSocket 升级（VNC / SSH）

### 3. 业务模块层（HostModule）

| 模块 | 职责 |
|------|------|
| `HostManager` | 管理所有受控主机，负责驱动实例化与生命周期 |
| `RestManager` | 所有 REST 路由的统一入口 |
| `UserManager` | 用户、角色、RBAC、配额 |
| `DataManager` | SQLite 数据持久化 |
| `NetsManager` | IP 池、NAT、iptables 规则 |
| `HttpManager` | Web 反向代理（域名绑定） |
| `SSHDManager` | Web SSH 终端会话管理 |
| `Translation` | 后端翻译字典 |

### 4. 核心对象层（MainObject）

所有配置与运行时状态被建模为 **强类型对象**：

- `Config/`：`VMConfig`、`HSConfig`、`HostsConfig`、`UserConfig`、`NetConfig` 等
- `Server/`：`HSEngine`（引擎）、`HSStatus`（状态机）、`HSTasker`（任务调度）
- `Public/`：`HWStatus`（硬件监控）、`ZMessage`（消息总线）

### 5. 驱动层（HostServer）

**驱动层是 OpenIDCS 的灵魂**。所有虚拟化平台都继承自统一的 `BasicServer` 抽象类：

```python
class BasicServer:
    def HSLoader(self): ...            # 连接受控端
    def VMCreate(self, cfg): ...       # 创建虚拟机
    def VMPowers(self, id, op): ...    # 电源操作
    def VMPasswd(self, id, pwd): ...   # 改密
    def VMScreen(self, id): ...        # 截图
    def VMBackup(self, id): ...        # 备份
    def Restores(self, id, bk): ...    # 还原
    def HDDMount(self, id, disk): ...  # 挂盘
    def ISOMount(self, id, iso): ...   # 挂 ISO
    # ... 统一接口，所有驱动实现
```

目前已实现的驱动：

```mermaid
graph LR
    BS[BasicServer] --> WS[Workstation.py]
    BS --> ES[vSphereESXi.py]
    BS --> LX[LXContainer.py]
    BS --> DC[OCInterface.py]
    BS --> PX[ProxmoxQemu.py]
    BS --> HV[Win64HyperV.py]
    BS --> QZ[QingzhouYun.py]
```

**优点**：新增平台只需实现接口，业务层和前端**零改动**即可使用。

### 6. 基础设施层

| 模块 | 说明 |
|------|------|
| `VNCConsole/VNCSManager.py` | 为每个虚拟机分配 VNC 会话并维护 |
| `Websockify/` | 将 TCP VNC 流转换为 WebSocket，供浏览器 noVNC 使用 |
| `ZJMFServer/` | 魔方财务 SwapIDC / IDCSmart 对接服务端 |

## 核心数据流：创建一台虚拟机

```mermaid
sequenceDiagram
    participant U as 用户浏览器
    participant FE as React 前端
    participant API as Flask API
    participant UM as UserManager
    participant HM as HostManager
    participant DRV as 驱动 (如 Workstation)
    participant HC as 受控端

    U->>FE: 点击"创建虚拟机"
    FE->>API: POST /api/vms (vm_config)
    API->>UM: 校验用户 + 配额
    UM-->>API: OK
    API->>HM: 选择 host, 调用驱动
    HM->>DRV: VMCreate(cfg)
    DRV->>HC: REST / SDK 调用
    HC-->>DRV: 返回 VM ID
    DRV-->>HM: vm_id
    HM->>API: 写入 SQLite
    API-->>FE: 200 OK + vm_id
    FE-->>U: 显示新虚拟机
```

## VNC / SSH 远程访问流程

```mermaid
sequenceDiagram
    participant U as 浏览器 (noVNC)
    participant FE as 前端
    participant API as Flask API
    participant WS as Websockify
    participant VM as 虚拟机 VNC

    U->>FE: 打开"控制台"
    FE->>API: POST /api/vms/{id}/vnc
    API->>API: 分配端口 + Token
    API-->>FE: ws://host:port?token=xxx
    FE->>WS: WebSocket 连接 (带 Token)
    WS->>WS: 校验 Token
    WS->>VM: TCP VNC 连接
    VM-->>WS: RFB 协议数据
    WS-->>FE: WebSocket 数据
    FE-->>U: noVNC 渲染画面
```

## 数据持久化

- **引擎**：SQLite（`DataSaving/database.db`）
- **特点**：单文件、零依赖、足够支撑数百台主机 / 数千虚拟机
- **表结构**：用户、角色、主机、虚拟机、IP 池、NAT 规则、Web 代理、快照、备份、操作日志

对于超大规模部署，后续会考虑可选的 MySQL / PostgreSQL 后端。

## 多语言 i18n

- 前端：`FrontPages/src/utils/i18n.ts`（React i18next）
- 后端：`HostConfig/translates/`（YAML）
- 支持：中文、English，可通过界面右上角切换

## 安全设计

```mermaid
graph TB
    A[浏览器] -->|HTTPS| B[Nginx 反代]
    B -->|HTTP localhost| C[Flask]
    C --> D{认证}
    D -->|Session Cookie| E[Web 用户]
    D -->|Bearer Token| F[API 调用]
    C --> G{RBAC 权限}
    G --> H[业务模块]
    H -->|TLS 双向| I[Docker / LXD]
    H -->|HTTPS + Token| J[ESXi / Proxmox]
    H -->|WinRM HTTPS| K[Hyper-V]
```

- 所有受控端通信均支持加密（TLS / HTTPS / WinRM-HTTPS）
- 主控端对外建议通过 Nginx + HTTPS
- 敏感字段（密码、Token）在 SQLite 中加密存储
- 操作日志记录调用者 IP、用户、动作、结果

## 构建与打包

| 方式 | 命令 | 适用 |
|------|------|------|
| 开发运行 | `python HostServer.py` | 开发 / 调试 |
| Nuitka | `cd AllBuilder && build_nuitka.bat` | 生产打包，启动快 |
| cx_Freeze | `python HostBuilds.py build` | 跨平台打包 |
| Docker | 见 [主控端配置](/config/server) | 容器化部署 |

## 目录结构速查

```
OpenIDCS-Client/
├── FrontPages/      # React 前端
├── HostServer/      # 驱动层（各虚拟化平台）
├── HostModule/      # 业务模块
├── MainObject/      # 核心对象
├── VNCConsole/      # VNC 管理
├── Websockify/      # WebSocket 代理
├── ZJMFServer/      # 魔方财务对接
├── HostConfig/      # 配置与脚本（含 setups-*.sh）
├── DataSaving/      # 数据 + 日志
├── AllBuilder/      # 构建脚本
└── HostServer.py    # 主程序入口
```

## 扩展性设计

### 新增虚拟化平台

只需 3 步：

1. 在 `HostServer/` 下新建 `YourPlatform.py`，继承 `BasicServer`
2. 实现 `HSLoader()`、`VMCreate()`、`VMPowers()` 等核心方法
3. 在 `HostManager` 的类型字典注册

**前端无需改动**（通用 UI 会自动适配）。

### 新增业务功能

- 新增 REST 接口：在 `HostModule/RestManager.py` 注册蓝图
- 新增前端页面：在 `FrontPages/src/pages/` 创建组件

## 下一步

- 📖 查看 [功能概览](/guide/features) 了解具体功能清单
- 🚀 查看 [快速上手](/guide/quick-start) 部署试用
- 🔧 查看 [主控端配置](/config/server) 了解部署细节
