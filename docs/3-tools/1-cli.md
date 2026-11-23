# quickidc 命令行

`quickidc` 是快简云（Quick IDC）的官方命令行工具，覆盖主控、平台、主机、实例、网络、用户、任务、日志与系统设置。

## 安装与初始化

```bash
curl -fsSL https://idcgit.opkg.cn/quickidc-install.sh | sh
quickidc core install          # 安装并启动主控
quickidc host list             # 验证连通
```

首次连接远程主控：

```bash
quickidc host add --name prod --addr https://idc.example.com --token <TOKEN>
# 或直接对单次命令指定
quickidc host list --url https://idc.example.com --token <TOKEN>
```

## 全局参数

| 参数 | 说明 |
|---|---|
| `--core <name\|index>` | 选择已保存的主控（0、1 或别名） |
| `--url <url>` | 临时指定主控地址 |
| `--token <token>` | 临时指定 Token |
| `--output table\|json\|yaml` | 输出格式，默认 table |
| `--data-dir <path>` | 主控运行目录（默认 `./data`，会自动探测 `/var/lib/quickidc` 与 Windows 安装目录） |
| `--yes` | 跳过确认（危险操作） |
| `--show-secret` | 明文显示 Token（默认遮罩） |

配置文件：`~/.config/quickidc/config.yaml`（Linux/macOS）或 `%APPDATA%\quickidc\config.yaml`（Windows），权限 0600。主控侧的 `data/data.yaml` 由 `--data-dir` / `OPIDCS_DATA_DIR` 定位。

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
quickidc core install [--version v1.0.0] [--port 1881] [--data-dir /var/lib/quickidc]
quickidc core uninstall [--purge]
quickidc core enable | disable
quickidc core start | stop | restart
quickidc core status
quickidc core update
```

### plat / platform —— 虚拟化平台

```bash
quickidc plat list
quickidc plat install [docker|lxd|smolvm|qemu|virtualbox|hyperv|vmware|memu]
quickidc plat uninstall <name>
quickidc plat show <name>
quickidc plat status
quickidc plat credentials show <name>
quickidc plat credentials reset <name>
```

不带参数进入交互式菜单，按当前操作系统过滤可安装项。

### host —— 主机

```bash
quickidc host list
quickidc host add --name <name> --type <engine> --addr <host[:port]> [--user u] [--pass p]
quickidc host show <name>
quickidc host status <name>
quickidc host enable|disable <name>
quickidc host del|remove <name>
quickidc host scanvm <name>
quickidc host scanbackup <name>
quickidc host export <name> --file host.yaml
quickidc host import --file host.yaml
```

### vm（别名 vbox）—— 实例

```bash
quickidc vm list [--host <name>]
quickidc vm show <uuid>
quickidc vm detail <uuid>
quickidc vm add --host <name> --image <image> --cpu 2 --mem 2048 --disk 40
quickidc vm del <uuid>
quickidc vm power start|stop|restart|on|off|reset|pause|resume <uuid>
```

### port / webx / user / logs / task

```bash
quickidc port list [--host <name>] [--vm <uuid>]
quickidc port add --host pve-lab --vm <uuid> --public 20022 --private 22
quickidc port del <rule-id>

quickidc webx list [--host <name>]
quickidc user list
quickidc logs list [--level error] [--limit 100]
quickidc task list [--status running]
quickidc task cancel <task-id>
```

### conf —— 系统设置

```bash
quickidc conf cores                 # 查看本地保存的主控
quickidc conf db show               # 查看数据库驱动与连接（密码遮罩）
quickidc conf db set --driver postgres --host 10.0.0.10 --user quickidc --password '***' --database quickidc
quickidc conf port show             # 优先读 data/data.yaml，其次读服务单元
quickidc conf port set 1881         # 写入 data.yaml 并重启服务
quickidc conf token show [--show-secret]
quickidc conf token reset
quickidc conf admin reset --password '<NEW>'
```

`quickidc conf port set` 会同时更新 `data/data.yaml` 与服务单元（若已安装为系统服务），未安装服务时只改配置。数据路径可用 `OPIDCS_DATA_DIR` 指定。

### self —— 工具自身

```bash
quickidc update [--channel stable|beta] [--check]
quickidc uninstall
quickidc version
```

## 交互式菜单

直接执行 `quickidc` 进入菜单：

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
quickidc host list --output json | jq '.[] | .name'

# 仅取值
quickidc conf token show --output json | jq -r .token

# 批量开机
quickidc vm list --host pve-lab --output json \
  | jq -r '.[] | select(.status=="stopped") | .uuid' \
  | xargs -I{} quickidc vm power start {}
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
