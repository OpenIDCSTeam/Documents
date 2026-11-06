# 构建与调试

## 主控

```bash
cd CloudHost

# 开发运行
go run ./cmd/server --data-dir ./data

# 构建
go build -o hostagent ./cmd/server

# 精简构建
go build -trimpath -ldflags "-s -w" -o dist/hostagent ./cmd/server
```

启动参数：

| 参数 | 默认 |
|---|---|
| `--port` | 1881 |
| `--data-dir` | ./data |
| `--log-level` | info |
| `--log-file-level` | debug |
| `--log-db-level` | info |

### 仓库脚本

```bash
./build.sh          # Linux/macOS
build.bat           # Windows
```

脚本会把前端产物复制到 `static/`（若已构建）。

## 前端

```bash
cd FrontPage
npm run dev          # 开发服务器
npm run build        # 产出 dist/
npx tsc --noEmit     # 类型检查
```

构建产物需要同步到主控的 `static/`：

```bash
rm -rf ../CloudHost/static/assets
cp -r dist/* ../CloudHost/static/
```

## 文档站

```bash
cd Documents
npm run dev
npm run build
npm run preview
```

## CLI

```bash
cd CloudHost
go build -o opidcs ./cmd/opidcs
./opidcs version
```

## 调试技巧

### 主控

- 日志：`journalctl -u openidcs -f` 或前台输出；
- 数据库：默认 `sqlite3 data/data.db`，也可通过 `data/data.yaml` 切换到 MySQL / PostgreSQL；
- 接口：`curl` 或浏览器开发者工具；
- 平台问题：在宿主机手动执行驱动同款命令对比。

### 前端

- React DevTools；
- 网络面板看 `/api` 请求与 `code`；
- 主题：`localStorage` 中的 `theme` / `themePreset`。

### 平台联调

```bash
# 确认主控能看到主机
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:1881/api/server/detail | jq
```

## 测试

```bash
cd CloudHost
go vet ./...
go test ./...
go test ./internal/driver -run TestProxmox -v
```

前端暂无单测，靠类型检查与构建把关。

## 静态资源要求

运行时工作目录必须包含：

```text
hostagent
static/index.html
static/assets/
VNCConsole/vnc.html
```

缺失 `static` 会导致首页 404；缺失 `VNCConsole` 只影响控制台并打印告警。

## 常见问题

| 现象 | 处理 |
|---|---|
| 首页 404 | 确认 `static/` 与二进制同级 |
| 控制台 404 | 确认 `VNCConsole/` |
| 修改未生效 | 前端需重新 build 并复制 |
| 端口冲突 | 改 `--port` |
| CGO 报错 | 不应出现；检查是否误引入 CGO 依赖 |
