# HostAgent-Go 快速启动指南

## 🚀 启动服务

### 1. 编译项目
```bash
cd HostAgent-Go
go build -o hostagent.exe ./cmd/server
```

### 2. 启动服务器
```bash
./hostagent.exe
```

服务将在 `http://localhost:8080` 启动。

---

## 📝 使用异步任务系统

### 创建任务示例

```go
import "github.com/OpenIDCSTeam/HostAgent-Go/internal/task"

// 1. 创建任务
task, err := app.TaskManager.CreateTask(
    "创建虚拟机 VM-001",
    task.TaskTypeVMCreate,
    "admin",
)

// 2. 定义执行器
type VMCreateExecutor struct {
    vmConfig *model.VMConfig
}

func (e *VMCreateExecutor) Execute(ctx context.Context, task *task.Task) error {
    // 更新进度
    app.TaskManager.UpdateProgress(task.ID, 20, "正在分配资源")
    
    // 执行创建逻辑
    vm, err := createVM(e.vmConfig)
    if err != nil {
        return err
    }
    
    // 更新进度
    app.TaskManager.UpdateProgress(task.ID, 80, "正在启动虚拟机")
    
    // 保存结果
    task.Result["vm_uuid"] = vm.UUID
    task.Result["vm_name"] = vm.Name
    
    return nil
}

// 3. 提交任务
executor := &VMCreateExecutor{vmConfig: config}
err = app.TaskManager.SubmitTask(task.ID, executor, map[string]interface{}{
    "cpu": 2,
    "memory": 4096,
})
```

---

## 🔐 CSRF 保护使用

### 前端获取 Token

```javascript
// 1. 获取 CSRF Token
const response = await fetch('/api/csrf-token');
const { csrf_token } = await response.json();

// 2. 在请求中携带 Token（方式一：请求头）
fetch('/api/vms', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf_token
    },
    body: JSON.stringify({ name: 'vm-001' })
});

// 3. 在请求中携带 Token（方式二：表单字段）
const formData = new FormData();
formData.append('csrf_token', csrf_token);
formData.append('name', 'vm-001');
fetch('/api/vms', { method: 'POST', body: formData });
```

### 后端豁免路径

```go
// 在 app.go 中配置豁免路径
csrfMW := auth.CSRFMiddleware(
    "/api/login",        // 登录不需要 CSRF
    "/api/register",     // 注册不需要 CSRF
    "/api/webhook",      // Webhook 不需要 CSRF
)
```

---

## 📊 任务管理 API

### 1. 列出任务
```bash
# 获取所有任务
curl http://localhost:8080/api/tasks

# 按状态过滤
curl "http://localhost:8080/api/tasks?status=pending,running"

# 按类型过滤
curl "http://localhost:8080/api/tasks?type=vm.create"

# 分页查询
curl "http://localhost:8080/api/tasks?limit=20&offset=0"
```

### 2. 获取任务详情
```bash
curl http://localhost:8080/api/tasks/20260814150405-abc12345
```

### 3. 取消任务
```bash
curl -X POST \
  -H "X-CSRF-Token: your-token" \
  http://localhost:8080/api/tasks/20260814150405-abc12345/cancel
```

### 4. 任务统计
```bash
curl http://localhost:8080/api/tasks/stats
```

响应示例：
```json
{
  "total": 100,
  "pending": 10,
  "running": 5,
  "completed": 80,
  "failed": 3,
  "cancelled": 2
}
```

---

## 🖼️ Proxmox 截图功能

### 前置条件

1. **安装 QEMU Guest Agent**（虚拟机内）
```bash
# Debian/Ubuntu
apt-get install qemu-guest-agent

# CentOS/RHEL
yum install qemu-guest-agent

# 启动服务
systemctl start qemu-guest-agent
systemctl enable qemu-guest-agent
```

2. **配置虚拟机**（Proxmox 宿主机）
```bash
# 编辑虚拟机配置
qm set <vmid> --agent enabled=1

# 重启虚拟机生效
```

3. **安装 ImageMagick**（虚拟机内，用于截图）
```bash
apt-get install imagemagick
```

### API 调用

```go
// 获取虚拟机截图
screenshot, err := driver.GetScreenshot("vm-uuid-here")
if err != nil {
    log.Printf("截图失败: %v", err)
}

// screenshot 格式: "data:image/png;base64,iVBORw0KG..."
// 可直接用于 HTML <img src="..." />
```

### 故障排查

**错误: "截图功能暂不可用"**
- 检查虚拟机是否安装 qemu-guest-agent
- 检查虚拟机配置是否启用 agent
- 检查虚拟机是否有 X11 显示环境

**错误: "虚拟机未运行，无法截图"**
- 确保虚拟机状态为 running
- 使用 `qm status <vmid>` 检查状态

---

## 🧪 测试

### 运行单元测试
```bash
# 测试任务系统
go test ./internal/task -v

# 测试所有模块
go test ./... -v

# 测试覆盖率
go test ./internal/task -cover
```

### 手动测试任务系统

1. **启动服务器**
```bash
./hostagent.exe
```

2. **登录获取 Session**
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

3. **获取 CSRF Token**
```bash
curl http://localhost:8080/api/csrf-token \
  -H "Cookie: session=..."
```

4. **创建测试任务**（需要在代码中实现测试端点）

5. **查询任务状态**
```bash
curl http://localhost:8080/api/tasks \
  -H "Cookie: session=..."
```

---

## 📁 项目结构

```
HostAgent-Go/
├── cmd/
│   └── server/          # 服务器入口
├── internal/
│   ├── api/             # API 处理器
│   │   ├── app.go       # 应用容器（新增 TaskManager）
│   │   └── task_api.go  # 任务 API（新增）
│   ├── auth/            # 认证和授权
│   │   └── csrf.go      # CSRF 中间件（新增）
│   ├── data/            # 数据访问层
│   │   ├── db.go        # 数据库（新增 async_tasks 表）
│   │   └── task_repo.go # 任务数据访问（新增）
│   ├── driver/          # 虚拟化驱动
│   │   └── proxmox_driver.go  # Proxmox（新增截图）
│   ├── task/            # 异步任务系统（新增）
│   │   ├── task_model.go
│   │   ├── task_manager.go
│   │   ├── task_executor.go
│   │   └── task_test.go
│   └── ...
└── go.mod
```

---

## 🔧 配置说明

### 任务系统配置

```go
// 在 NewApp 中配置 Worker 数量
taskMgr := task.NewManager(db, 4)  // 4 个并发 Worker
```

### CSRF 配置

```go
// Token 有效期：24 小时（在 csrf.go 中修改）
s.tokens[token] = time.Now().Add(24 * time.Hour)

// 清理间隔：1 小时（在 csrf.go 中修改）
ticker := time.NewTicker(1 * time.Hour)
```

---

## 📚 相关文档

- [第一阶段开发总结](./HostAgent-Go-Phase1-Summary.md)
- [完整修补计划](./HostAgent-Go-Patch-Plan.md)

---

## ❓ 常见问题

### Q: 任务执行失败后会自动重试吗？
A: 当前版本不支持自动重试。失败的任务状态为 `failed`，需要手动创建新任务重试。自动重试功能计划在优化阶段实现。

### Q: 如何监控任务队列大小？
A: 使用 `GET /api/tasks/stats` 接口查看 pending 任务数量。Worker 可能正在处理中，但队列大小不会超过 100。

### Q: CSRF Token 过期后如何处理？
A: 前端收到 403 错误时，重新调用 `/api/csrf-token` 获取新 Token，然后重试请求。

### Q: Proxmox 截图为什么这么慢？
A: 截图需要在虚拟机内执行命令并等待结果，通常需要 2-5 秒。建议添加缓存机制减少重复请求。

---

## 🎯 下一步

1. **前端集成**: 创建任务列表组件，实时显示任务进度
2. **WebSocket 推送**: 实现任务状态变更实时通知
3. **第二阶段开发**: ESXi、Hyper-V、KVM 驱动开发

---

**最后更新**: 2026-08-14  
**维护者**: OpenIDCSTeam
