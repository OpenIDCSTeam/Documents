# opidcs 命令行

`opidcs` 是 OpenIDCS 的官方命令行工具，覆盖主控、平台、主机、实例、网络、用户、任务、日志与系统设置。

## 安装与初始化

```bash
curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/scripts/opidcs-install.sh | sh
opidcs core install          # 安装并启动主控
opidcs host list             # 验证连通
```

首次连接远程主控：

```bash
opidcs host add --name prod --addr https://idc.example.com --token <TOKEN>
# 或直接对单次命令指定
opidcs host list --url https://idc.example.com --token <TOKEN>
```

## 全局参数

| 参数 | 说明 |
|---|---|
| `--core <name\|index>` | 选择已保存的主控（0、1 或别名） |
| `--url <url>` | 临时指定主控地址 |
| `--token <token>` | 临时指定 Token |
| `--output table\|json\|yaml` | 输出格式，默认 table |
| `--yes` | 跳过确认（危险操作） |
| `--show-secret` | 明文显示 Token（默认遮罩） |

配置文件：`~/.config/opidcs/config.yaml`（Linux/macOS）或 `%APPDATA%\opidcs\config.yaml`（Windows），权限 0600。

```yaml
default: local
cores:
  - name: local
    url: http://127.0.0.1:1881
    token: "******"
  - name: prod
    url: https://idc.example.com
    token: "******"
```

## 命令树

### core —— 主控生命周期

```bash
opidcs core install [--version v1.0.0] [--port 1881] [--data-dir /var/lib/openidcs]
opidcs core uninstall [--purge]
opidcs core enable | disable
opidcs core start | stop | restart
opidcs core status
opidcs core update
```

### plat / platform —— 虚拟化平台

```bash
opidcs plat list
opidcs plat install [docker|lxd|smolvm|qemu|virtualbox|hyperv|vmware|memu]
opidcs plat uninstall <name>
opidcs plat show <name>
opidcs plat status
opidcs plat credentials show <name>
opidcs plat credentials reset <name>
```

不带参数进入交互式菜单，按当前操作系统过滤可安装项。

### host —— 主机

```bash
opidcs host list
opidcs host add --name <name> --type <engine> --addr <host[:port]> [--user u] [--pass p]
opidcs host show <name>
opidcs host status <name>
opidcs host enable|disable <name>
opidcs host del|remove <name>
opidcs host scanvm <name>
opidcs host scanbackup <name>
opidcs host export <name> --file host.yaml
opidcs host import --file host.yaml
```

### vm（别名 vbox）—— 实例

```bash
opidcs vm list [--host <name>]
opidcs vm show <uuid>
opidcs vm detail <uuid>
opidcs vm add --host <name> --image <image> --cpu 2 --mem 2048 --disk 40
opidcs vm del <uuid>
opidcs vm power start|stop|restart|on|off|reset|pause|resume <uuid>
```

### port / webx / user / logs / task

```bash
opidcs port list [--host <name>] [--vm <uuid>]
opidcs port add --host pve-lab --vm <uuid> --public 20022 --private 22
opidcs port del <rule-id>

opidcs webx list [--host <name>]
opidcs user list
opidcs logs list [--level error] [--limit 100]
opidcs task list [--status running]
opidcs task cancel <task-id>
```

### conf —— 系统设置

```bash
opidcs conf port show
opidcs conf port set 1881
opidcs conf token show [--show-secret]
opidcs conf token reset
opidcs conf admin reset --password '<NEW>'
```

### self —— 工具自身

```bash
opidcs update
opidcs uninstall
opidcs version
```

## 交互式菜单

直接执行 `opidcs` 进入菜单：

```text
? 选择操作
  ❯ 主控管理
    平台管理
    主机管理
    实例管理
    端口转发
    反向代理
    用户 / 任务 / 日志
    系统设置
    退出
```

菜单项与子命令一一对应，等价于执行对应命令。

## 输出与脚本

```bash
# JSON 管道
opidcs host list --output json | jq '.[] | .name'

# 仅取值
opidcs conf token show --output json | jq -r .token

# 批量开机
opidcs vm list --host pve-lab --output json \
  | jq -r '.[] | select(.status=="stopped") | .uuid' \
  | xargs -I{} opidcs vm power start {}
```

## 退出码

| 码 | 含义 |
|---|---|
| 0 | 成功 |
| 1 | 通用错误 |
| 2 | 参数错误 |
| 3 | 认证失败 / Token 无效 |
| 4 | 资源不存在 |
| 5 | 主控不可达 |

## 安全

- Token 不写入 shell history：使用 `--token -` 从 stdin 读取；
- 默认遮罩，日志不打印明文；
- `conf token reset` 会使所有插件与旧 CLI 配置失效，执行前确认。

## 相关页面

- [安装与更新](/tools/install)
- [桌面客户端](/tools/gui)
- [API 概览](/structure/api)
