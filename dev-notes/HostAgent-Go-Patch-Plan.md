# HostAgent-Go 修补计划

> **文档版本**: v1.0  
> **创建日期**: 2026-08-14  
> **目标**: 将 HostAgent-Go 功能完成度从 40-45% 提升至 90%+

---

## 📊 一、项目现状分析

### 1.1 整体评估

**当前完成度**: 40-45%  
**代码量对比**:
- Python 版本: ~800KB+
- Go 版本: ~350KB
- **功能缺口**: 55-60%

### 1.2 已完成模块 (✅ 100% 实现)

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 用户权限系统 | 100% | Session + Bearer Token、角色管理、邮箱验证 |
| Proxmox VE 驱动 | 80% | 虚拟机管理、存储、设备直通、备份（缺截图） |
| SmolVM/Firecracker | 95% | 接近完整实现 |
| 基础设施 | 80% | SQLite、i18n、日志、安全防护 |
| 网络管理 | 70% | IP 管理、NAT、反向代理 |
| 远程控制 | 60% | VNC 代理、SSH 终端 |

### 1.3 部分实现模块 (⚠️ 15-30% 骨架)

仅存在基本结构，无完整功能：
- VMware ESXi
- Hyper-V
- QEMU/KVM
- VMware Workstation
- VirtualBox
- Docker/OCI
- LXC/LXD
- MEmu Android 模拟器
- 青州云

### 1.4 完全缺失的关键功能 (❌ 0% 实现)

1. **异步任务系统** - Python 有完整 TaskManager，Go 完全缺失
2. **网卡热插拔** - 动态网络设备管理
3. **网络 QoS 限速** - 流量控制
4. **数据盘移交** - 存储转移功能
5. **设备直通列表查询** - GPU/PCI/USB 实时扫描
6. **CSRF 防护** - 安全漏洞
7. **SSL 证书管理** - 自动化证书续期
8. **RDP 集成** - 远程桌面支持

---

## 🎯 二、功能缺失清单（按优先级）

### 🔴 P0 - 核心阻塞项（必须立即修复）

| 功能 | 影响范围 | 风险等级 | 预估工时 |
|------|----------|----------|----------|
| 异步任务系统 | 全局 | 高 | 40h |
| CSRF 防护 | 安全 | 高 | 8h |
| Proxmox 截图功能 | Proxmox 驱动 | 中 | 12h |

**合计**: 60 工时 (7.5 人天)

### 🟡 P1 - 主要虚拟化平台（核心业务）

| 平台 | Python 代码量 | 核心功能 | 预估工时 |
|------|---------------|----------|----------|
| VMware ESXi | 95KB | vSphere API 完整集成 | 80h |
| Hyper-V | 68KB | PowerShell/WMI 接口 | 60h |
| QEMU/KVM | 42KB | libvirt Go 绑定 | 50h |

**合计**: 190 工时 (23.75 人天)

### 🟢 P2 - 次要虚拟化平台

| 平台 | 预估工时 |
|------|----------|
| VMware Workstation | 40h |
| VirtualBox | 35h |
| Docker/OCI | 30h |
| LXC/LXD | 25h |
| MEmu Android | 20h |
| 青州云 | 15h |

**合计**: 165 工时 (20.625 人天)

### 🟣 P3 - 网络与存储增强

| 功能 | 预估工时 |
|------|----------|
| 网卡热插拔 | 24h |
| 网络 QoS 限速 | 20h |
| 数据盘移交 | 16h |
| USB 存储挂载 | 12h |
| iKuai 路由器配置 | 18h |

**合计**: 90 工时 (11.25 人天)

### 🔵 P4 - 高级功能

| 功能 | 预估工时 |
|------|----------|
| 设备直通列表扫描 | 16h |
| SSL 证书管理 | 24h |
| RDP 集成 | 20h |
| 数据迁移工具 | 30h |

**合计**: 90 工时 (11.25 人天)

---

## 🚀 三、分阶段实施计划

### 第一阶段：核心补全 (2 周)

**目标**: 修复系统级缺陷，完成基础设施

#### 任务清单

**Task 1.1: 异步任务系统 (40h)**
```
目标: 实现生产级任务调度和进度追踪
位置: HostAgent-Go/internal/task/
参考: HostAgent/utils/task_manager.py

子任务:
1. task_model.go - 定义 Task 数据模型 (4h)
   - ID, Name, Type, Status, Progress, Result
   - CreatedAt, StartedAt, CompletedAt
   - ErrorMessage, Metadata (JSON)

2. task_manager.go - 实现任务管理器 (16h)
   - CreateTask(name, taskType) -> Task
   - UpdateProgress(taskID, progress, message)
   - CompleteTask(taskID, result, err)
   - GetTask(taskID) -> Task
   - ListTasks(filters) -> []Task
   - 并发安全的任务存储 (sync.Map)

3. task_executor.go - 异步执行引擎 (12h)
   - 使用 goroutine pool 限制并发数
   - 上下文传播 (context.Context)
   - 优雅取消 (CancelTask)
   - 超时控制

4. task_api.go - REST API 端点 (8h)
   - POST /api/tasks - 创建任务
   - GET /api/tasks/:id - 查询任务
   - GET /api/tasks - 列出任务
   - DELETE /api/tasks/:id - 取消任务
   - WebSocket 实时进度推送
```

**Task 1.2: CSRF 防护 (8h)**
```
位置: HostAgent-Go/internal/middleware/csrf.go

实现:
1. 生成 CSRF Token (JWT 或随机字符串) (2h)
2. 验证 X-Requested-With: XMLHttpRequest (2h)
3. 验证 Referer/Origin 头 (2h)
4. 集成到现有中间件链 (2h)
```

**Task 1.3: Proxmox 截图功能 (12h)**
```
位置: HostAgent-Go/internal/driver/proxmox/screenshot.go

实现:
1. 调用 Proxmox API: /nodes/{node}/qemu/{vmid}/vncproxy (4h)
2. 通过 VNC 协议截取屏幕 (6h)
   - 使用 go-vnc 库连接 VNC
   - 捕获 framebuffer
3. 转换为 PNG/JPEG 格式 (2h)
```

#### 验收标准

- [ ] 异步任务系统支持至少 3 种任务类型（虚拟机创建、备份、快照）
- [ ] 任务进度可实时查询，延迟 < 1s
- [ ] CSRF 防护通过 OWASP ZAP 扫描
- [ ] Proxmox 截图功能在 1920x1080 分辨率下响应时间 < 3s
- [ ] 所有新增代码测试覆盖率 > 70%

---

### 第二阶段：平台扩展 (6 周)

**目标**: 完整实现三大主流虚拟化平台

#### Task 2.1: VMware ESXi 完整驱动 (80h / 2 周)

**技术栈**: govmomi (官方 vSphere Go SDK)

```
位置: HostAgent-Go/internal/driver/esxi/

核心模块:
1. client.go - vSphere 客户端封装 (12h)
   - 连接池管理
   - Session 自动续期
   - 错误重试机制

2. vm_lifecycle.go - 虚拟机生命周期 (20h)
   - CreateVM (从模板克隆/从头创建)
   - PowerOn/PowerOff/Reset/Suspend
   - DeleteVM (包含磁盘清理)
   - 异步任务集成 (使用第一阶段的任务系统)

3. vm_config.go - 虚拟机配置管理 (16h)
   - CPU/内存热调整
   - 磁盘添加/删除/扩容
   - 网卡添加/删除/配置

4. snapshot.go - 快照管理 (12h)
   - CreateSnapshot/RevertSnapshot/DeleteSnapshot
   - 快照树遍历

5. storage.go - 存储管理 (10h)
   - Datastore 查询
   - VMDK 上传/下载
   - 存储容量监控

6. network.go - 网络管理 (8h)
   - Port Group 配置
   - VLAN 设置
   - 分布式交换机支持

7. console.go - 远程控制 (12h)
   - VNC 代理
   - VMRC 集成
   - 截图功能

参考代码:
- Python: HostAgent/drivers/esxi_driver.py (95KB)
- Go SDK: github.com/vmware/govmomi
```

#### Task 2.2: Hyper-V 完整驱动 (60h / 1.5 周)

**技术栈**: go-ole (COM/WMI 绑定) + PowerShell 调用

```
位置: HostAgent-Go/internal/driver/hyperv/

核心模块:
1. wmi_client.go - WMI 客户端 (10h)
   - 连接 Hyper-V WMI 命名空间
   - 查询虚拟机对象

2. powershell.go - PowerShell 执行器 (8h)
   - 安全的命令构建 (防注入)
   - JSON 输出解析
   - 错误处理

3. vm_lifecycle.go - 虚拟机管理 (18h)
   - New-VM/Start-VM/Stop-VM/Remove-VM
   - 检查点 (快照) 管理

4. vm_config.go - 配置管理 (12h)
   - Set-VMMemory/Set-VMProcessor
   - 添加/删除虚拟硬盘
   - 网络适配器管理

5. vhd_manager.go - VHD/VHDX 管理 (8h)
   - New-VHD/Resize-VHD
   - 差分磁盘创建

6. console.go - 远程控制 (4h)
   - RDP 连接信息生成
   - 截图 (通过 Hyper-V Manager API)

参考代码:
- Python: HostAgent/drivers/hyperv_driver.py (68KB)
- 库: github.com/go-ole/go-ole
```

#### Task 2.3: QEMU/KVM 完整驱动 (50h / 1.25 周)

**技术栈**: libvirt-go (libvirt Go 绑定)

```
位置: HostAgent-Go/internal/driver/kvm/

核心模块:
1. libvirt_client.go - libvirt 连接 (8h)
   - 本地/远程连接 (qemu:///system, qemu+ssh://)
   - 连接池管理

2. vm_lifecycle.go - 域管理 (16h)
   - virDomainDefineXML (从 XML 创建)
   - virDomainCreate/Destroy/Undefine
   - 状态查询

3. xml_builder.go - 虚拟机 XML 构建 (10h)
   - 生成标准 KVM 虚拟机 XML
   - CPU 拓扑、内存、磁盘、网络配置

4. storage.go - 存储池管理 (8h)
   - virStoragePoolLookup
   - qcow2 镜像创建/克隆

5. snapshot.go - 快照管理 (6h)
   - virDomainSnapshotCreateXML
   - 快照列表/回滚/删除

6. console.go - 控制台访问 (2h)
   - VNC/SPICE 端口获取

参考代码:
- Python: HostAgent/drivers/kvm_driver.py (42KB)
- 库: libvirt.org/go/libvirt.html
```

#### 验收标准

- [ ] ESXi 驱动通过 vSphere 6.7 和 7.0 兼容性测试
- [ ] Hyper-V 驱动在 Windows Server 2019/2022 上正常运行
- [ ] KVM 驱动支持 Ubuntu 20.04/22.04 和 CentOS 7/8
- [ ] 所有驱动实现 Python 版本 90% 以上的 API
- [ ] 错误处理覆盖所有常见异常场景
- [ ] 集成测试覆盖虚拟机完整生命周期

---

### 第三阶段：功能增强 (4 周)

**目标**: 补全次要平台和高级功能

#### Task 3.1: 次要虚拟化平台 (165h / 3 周)

**优先级排序**:
1. Docker/OCI (30h) - 容器化趋势
2. VMware Workstation (40h) - 桌面虚拟化
3. VirtualBox (35h) - 开源方案
4. LXC/LXD (25h) - 轻量级容器
5. MEmu Android (20h) - 移动测试
6. 青州云 (15h) - 国产云

**通用实现模式**:
```go
// 每个驱动的标准结构
type XxxDriver struct {
    *driver.BaseDriver
    client *XxxClient
}

// 必须实现的接口
func (d *XxxDriver) ListVMs() ([]VM, error)
func (d *XxxDriver) CreateVM(config VMConfig) (string, error)
func (d *XxxDriver) StartVM(id string) error
func (d *XxxDriver) StopVM(id string) error
func (d *XxxDriver) DeleteVM(id string) error
func (d *XxxDriver) GetVMInfo(id string) (*VMInfo, error)
```

#### Task 3.2: 网络高级功能 (54h)

**3.2.1 网卡热插拔 (24h)**
```
位置: HostAgent-Go/internal/driver/common/network_hotplug.go

实现:
1. Proxmox: POST /api2/json/nodes/{node}/qemu/{vmid}/config
2. ESXi: govmomi.VirtualDeviceConfigSpec
3. Hyper-V: Add-VMNetworkAdapter
4. KVM: virDomainAttachDevice (XML)

特性:
- 支持多种网卡类型 (virtio, e1000, vmxnet3)
- VLAN 配置
- MAC 地址自动/手动分配
```

**3.2.2 网络 QoS 限速 (20h)**
```
位置: HostAgent-Go/internal/driver/common/network_qos.go

实现:
1. Linux tc (Traffic Control) 命令封装
2. 支持上行/下行独立限速
3. 突发流量控制 (burst)
4. 优先级队列 (prio qdisc)
```

**3.2.3 iKuai 路由器集成 (10h)**
```
位置: HostAgent-Go/internal/integration/ikuai/

实现:
- 自动添加 DHCP 静态绑定
- NAT 端口转发规则配置
- 防火墙规则管理
```

#### Task 3.3: 存储高级功能 (28h)

**3.3.1 数据盘移交 (16h)**
```
位置: HostAgent-Go/internal/driver/common/disk_transfer.go

实现:
1. 从源虚拟机分离磁盘
2. 更新磁盘所有权/权限
3. 附加到目标虚拟机
4. 支持跨存储池移动 (可选)
```

**3.3.2 USB 存储挂载 (12h)**
```
位置: HostAgent-Go/internal/driver/common/usb_storage.go

实现:
- USB 设备识别
- 直通到虚拟机
- 自动卸载保护
```

#### Task 3.4: 设备直通增强 (16h)

**位置**: `HostAgent-Go/internal/driver/common/device_passthrough.go`

```go
// 实现实时设备扫描
func ListAvailableGPUs() ([]GPUDevice, error) {
    // 1. 扫描 PCI 总线 (lspci)
    // 2. 过滤已占用设备
    // 3. 返回可用 GPU 列表
}

func ListAvailablePCIDevices() ([]PCIDevice, error)
func ListAvailableUSBDevices() ([]USBDevice, error)
```

#### Task 3.5: SSL 证书管理 (24h)

**位置**: `HostAgent-Go/internal/cert/auto_cert.go`

```go
// 使用 Let's Encrypt (ACME 协议)
import "golang.org/x/crypto/acme/autocert"

func SetupAutoCert(domains []string) *autocert.Manager {
    return &autocert.Manager{
        Prompt:      autocert.AcceptTOS,
        Cache:       autocert.DirCache("/etc/hostagent/certs"),
        HostPolicy:  autocert.HostWhitelist(domains...),
    }
}
```

#### Task 3.6: RDP 远程桌面集成 (20h)

**位置**: `HostAgent-Go/internal/remote/rdp/`

```
实现:
1. rdp_proxy.go - RDP 流量代理 (12h)
   - TCP 代理转发
   - 连接信息生成 (.rdp 文件)

2. rdp_gateway.go - RDP 网关 (8h)
   - WebSocket 到 RDP 的桥接
   - 浏览器内 RDP 客户端集成 (guacamole)
```

#### Task 3.7: 数据迁移工具 (30h)

**位置**: `HostAgent-Go/cmd/migrate/`

```
功能:
1. 从 Python 版本迁移数据 (16h)
   - SQLite 数据库迁移
   - 配置文件转换
   - 用户密码哈希兼容

2. 跨平台虚拟机迁移 (14h)
   - VMDK/VHD/QCOW2 格式转换
   - 虚拟机配置映射
   - 网络配置迁移
```

#### 验收标准

- [ ] 网卡热插拔在所有主要平台测试通过
- [ ] QoS 限速误差 < 5%
- [ ] 数据盘移交成功率 > 99%
- [ ] SSL 证书自动续期测试通过
- [ ] RDP 代理延迟 < 50ms
- [ ] 数据迁移工具完整性校验通过

---

## 🛠️ 四、技术实现指南

### 4.1 异步任务系统设计模式

**推荐架构**: Worker Pool + Task Queue

```go
// 核心接口
type TaskExecutor interface {
    Execute(ctx context.Context, task *Task) error
}

// 任务注册表
var executors = map[string]TaskExecutor{
    "vm.create":   &CreateVMExecutor{},
    "vm.backup":   &BackupVMExecutor{},
    "vm.snapshot": &SnapshotExecutor{},
}

// 执行引擎
type Engine struct {
    workers   int
    taskQueue chan *Task
    manager   *TaskManager
}

func (e *Engine) Start() {
    for i := 0; i < e.workers; i++ {
        go e.worker(i)
    }
}

func (e *Engine) worker(id int) {
    for task := range e.taskQueue {
        executor := executors[task.Type]
        ctx, cancel := context.WithTimeout(context.Background(), task.Timeout)
        
        e.manager.UpdateProgress(task.ID, 0, "开始执行")
        err := executor.Execute(ctx, task)
        
        if err != nil {
            e.manager.CompleteTask(task.ID, nil, err)
        } else {
            e.manager.CompleteTask(task.ID, task.Result, nil)
        }
        
        cancel()
    }
}
```

### 4.2 虚拟化驱动标准化接口

**BaseDriver 统一抽象**:

```go
type Driver interface {
    // 生命周期
    ListVMs() ([]VM, error)
    CreateVM(config VMConfig) (taskID string, err error)
    StartVM(id string) error
    StopVM(id string, force bool) error
    RestartVM(id string) error
    DeleteVM(id string) error
    
    // 配置管理
    GetVMInfo(id string) (*VMInfo, error)
    UpdateVMConfig(id string, config VMConfig) error
    
    // 快照
    CreateSnapshot(vmID, name string) (snapshotID string, err error)
    RevertSnapshot(vmID, snapshotID string) error
    DeleteSnapshot(vmID, snapshotID string) error
    ListSnapshots(vmID string) ([]Snapshot, error)
    
    // 存储
    AttachDisk(vmID string, disk DiskConfig) error
    DetachDisk(vmID, diskID string) error
    ResizeDisk(vmID, diskID string, sizeGB int) error
    
    // 网络
    AttachNetwork(vmID string, network NetworkConfig) error
    DetachNetwork(vmID, networkID string) error
    
    // 远程控制
    GetConsoleURL(vmID string) (string, error)
    GetScreenshot(vmID string) ([]byte, error)
}
```

### 4.3 错误处理最佳实践

**分层错误定义**:

```go
// 业务错误
var (
    ErrVMNotFound      = errors.New("virtual machine not found")
    ErrVMAlreadyRunning = errors.New("virtual machine is already running")
    ErrInsufficientResource = errors.New("insufficient resource")
)

// 错误包装
func (d *ESXiDriver) StartVM(id string) error {
    vm, err := d.client.FindVM(id)
    if err != nil {
        return fmt.Errorf("find vm %s: %w", id, err)
    }
    
    if vm.PowerState == "poweredOn" {
        return ErrVMAlreadyRunning
    }
    
    task, err := vm.PowerOn(context.Background())
    if err != nil {
        return fmt.Errorf("power on vm %s: %w", id, err)
    }
    
    return task.Wait(context.Background())
}
```

### 4.4 并发安全设计

**关键点**:
1. 使用 `sync.Map` 存储任务状态
2. 使用 `sync.Mutex` 保护驱动客户端连接
3. 使用 `context.Context` 传播取消信号
4. 使用 `errgroup` 管理并发任务

```go
import "golang.org/x/sync/errgroup"

func (m *Manager) BatchStartVMs(ids []string) error {
    g, ctx := errgroup.WithContext(context.Background())
    
    for _, id := range ids {
        id := id // 避免闭包陷阱
        g.Go(func() error {
            return m.driver.StartVM(id)
        })
    }
    
    return g.Wait()
}
```

### 4.5 测试策略

**三层测试金字塔**:

```
              /\
             /  \  E2E 测试 (10%)
            /----\
           /      \  集成测试 (30%)
          /--------\
         /          \  单元测试 (60%)
        /______________\
```

**单元测试示例**:
```go
func TestTaskManager_CreateTask(t *testing.T) {
    manager := NewTaskManager()
    
    task := manager.CreateTask("test-vm-create", "vm.create")
    
    assert.NotEmpty(t, task.ID)
    assert.Equal(t, "test-vm-create", task.Name)
    assert.Equal(t, TaskStatusPending, task.Status)
}
```

**集成测试示例**:
```go
func TestProxmoxDriver_Integration(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test")
    }
    
    driver := NewProxmoxDriver(testConfig)
    
    // 创建虚拟机
    vmID, err := driver.CreateVM(VMConfig{
        Name: "test-vm",
        CPU:  2,
        Memory: 2048,
    })
    require.NoError(t, err)
    defer driver.DeleteVM(vmID)
    
    // 启动虚拟机
    err = driver.StartVM(vmID)
    require.NoError(t, err)
    
    // 验证状态
    info, err := driver.GetVMInfo(vmID)
    require.NoError(t, err)
    assert.Equal(t, "running", info.Status)
}
```

---

## ✅ 五、验收标准

### 5.1 第一阶段验收（核心补全）

**功能验收**:
- [ ] 异步任务系统支持创建、查询、取消、列表操作
- [ ] 任务进度更新实时性 < 1s
- [ ] 支持至少 5 种并发任务
- [ ] CSRF 防护通过 OWASP Top 10 检查
- [ ] Proxmox 截图功能响应时间 < 3s

**代码质量**:
- [ ] 单元测试覆盖率 ≥ 70%
- [ ] golangci-lint 零告警
- [ ] 所有公开 API 有完整注释
- [ ] 错误处理符合 Go 最佳实践

**性能指标**:
- [ ] 任务系统支持 1000+ 并发任务
- [ ] 内存占用 < 100MB (空闲状态)
- [ ] API 响应时间 P95 < 200ms

### 5.2 第二阶段验收（平台扩展）

**功能验收**:
- [ ] ESXi 驱动实现 Python 版本 90% 功能
- [ ] Hyper-V 驱动通过 Windows Server 2019/2022 测试
- [ ] KVM 驱动通过 Ubuntu 20.04/22.04 测试
- [ ] 虚拟机完整生命周期测试通过（创建→启动→快照→还原→删除）

**兼容性验收**:
- [ ] ESXi 6.7、7.0、8.0 兼容
- [ ] Hyper-V Server 2016、2019、2022 兼容
- [ ] QEMU 4.x、5.x、6.x 兼容

**压力测试**:
- [ ] 单驱动支持管理 100+ 虚拟机
- [ ] 批量操作（10 台虚拟机同时启动）成功率 > 95%

### 5.3 第三阶段验收（功能增强）

**功能验收**:
- [ ] 6 个次要平台驱动基础功能完整
- [ ] 网卡热插拔在 4 大平台测试通过
- [ ] QoS 限速精度 ≥ 95%
- [ ] 数据盘移交跨存储池测试通过
- [ ] SSL 证书自动续期 90 天测试通过

**文档验收**:
- [ ] API 文档完整（Swagger/OpenAPI）
- [ ] 每个驱动有安装配置指南
- [ ] 提供故障排查手册

### 5.4 最终交付标准

**功能完整度**: ≥ 90%  
**代码覆盖率**: ≥ 70%  
**性能对比 Python 版本**: 提升 50%+  
**内存占用**: 降低 60%+  
**文档完整性**: 100%

---

## ⚠️ 六、风险评估与应对

### 6.1 技术风险

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| vSphere API 复杂度高于预期 | 中 | 高 | 提前进行 PoC 验证，预留 20% 缓冲时间 |
| Hyper-V WMI 接口不稳定 | 低 | 中 | 使用 PowerShell 作为备用方案 |
| libvirt Go 绑定文档不足 | 中 | 中 | 参考 Python libvirt 实现和 C API 文档 |
| 异步任务系统性能瓶颈 | 低 | 高 | 使用 pprof 性能分析，优化热点代码 |

### 6.2 进度风险

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| 估算工时不准确 | 高 | 中 | 每周进度审查，及时调整计划 |
| 人员变动 | 低 | 高 | 知识文档化，代码审查制度 |
| 需求变更 | 中 | 中 | 严格变更控制流程 |

### 6.3 质量风险

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| 测试覆盖不足 | 中 | 高 | 强制 70% 覆盖率门槛 |
| 并发 Bug | 中 | 高 | 使用 race detector，压力测试 |
| 内存泄漏 | 低 | 中 | 定期内存分析 (pprof) |

### 6.4 安全风险

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| CSRF 攻击 | 高 | 中 | 第一阶段优先实现防护 |
| SQL 注入 | 低 | 高 | 使用 ORM，参数化查询 |
| 命令注入 | 中 | 高 | 已有防护，持续审查 |

---

## 📅 七、资源估算

### 7.1 人力投入

**总工时**: 595 小时  
**按 1 人全职计算**: 约 3.7 个月  
**按 2 人团队计算**: 约 1.85 个月  

| 阶段 | 工时 | 人天 (8h/天) | 工作周 |
|------|------|--------------|--------|
| 第一阶段 | 60h | 7.5 天 | 1.5 周 |
| 第二阶段 | 190h | 23.75 天 | 4.75 周 |
| 第三阶段 | 255h | 31.875 天 | 6.375 周 |
| 测试与修复 | 90h | 11.25 天 | 2.25 周 |
| **总计** | **595h** | **74.375 天** | **14.875 周** |

### 7.2 环境需求

**开发环境**:
- Go 1.21+
- VSCode / GoLand
- Git

**测试环境**:
| 平台 | 版本 | 数量 |
|------|------|------|
| Proxmox VE | 7.x/8.x | 1 |
| VMware ESXi | 7.0/8.0 | 1 |
| Hyper-V Server | 2022 | 1 |
| Ubuntu (KVM) | 22.04 | 1 |
| Windows 11 (Workstation) | Pro | 1 |

**硬件资源**:
- 测试服务器: 64GB RAM, 16 核 CPU, 2TB 存储
- 开发机: 16GB RAM, 8 核 CPU

### 7.3 第三方依赖

| 库 | 用途 | 许可证 |
|----|----|--------|
| github.com/vmware/govmomi | ESXi 驱动 | Apache 2.0 |
| github.com/go-ole/go-ole | Hyper-V 驱动 | MIT |
| libvirt.org/go/libvirt | KVM 驱动 | LGPL |
| golang.org/x/crypto/acme | SSL 证书 | BSD-3 |
| github.com/gorilla/websocket | WebSocket | BSD-2 |

---

## 📊 八、进度跟踪

### 8.1 里程碑

| 里程碑 | 目标日期 | 交付物 |
|--------|----------|--------|
| M1: 核心补全完成 | Week 2 | 异步任务、CSRF、Proxmox 截图 |
| M2: ESXi 驱动完成 | Week 4 | ESXi 完整功能 |
| M3: Hyper-V 驱动完成 | Week 6 | Hyper-V 完整功能 |
| M4: KVM 驱动完成 | Week 7 | KVM 完整功能 |
| M5: 次要平台完成 | Week 10 | 6 个次要平台驱动 |
| M6: 功能增强完成 | Week 12 | 网络/存储/证书等高级功能 |
| M7: 测试与修复 | Week 14 | 完整测试报告 |
| **M8: 正式发布** | **Week 15** | **v2.0 Release** |

### 8.2 每周进度模板

```markdown
## Week X 进度报告

### 本周完成
- [ ] 任务 1 (预计 20h / 实际 22h)
- [ ] 任务 2 (预计 16h / 实际 15h)

### 下周计划
- [ ] 任务 3 (预计 24h)
- [ ] 任务 4 (预计 18h)

### 风险与阻碍
- 无 / 风险描述

### 代码提交
- Commits: 25
- Files Changed: 48
- Lines Added: 2341
- Lines Deleted: 156
```

---

## 🎯 九、后续优化方向

完成 90% 功能对等后，建议持续优化：

### 9.1 性能优化
- [ ] 数据库连接池调优
- [ ] API 响应缓存
- [ ] 虚拟机状态批量查询

### 9.2 可观测性
- [ ] Prometheus 指标导出
- [ ] 分布式链路追踪 (OpenTelemetry)
- [ ] 结构化日志增强

### 9.3 高可用性
- [ ] 主从架构支持
- [ ] 任务队列持久化 (Redis)
- [ ] 故障自动恢复

### 9.4 云原生
- [ ] Docker 容器化部署
- [ ] Kubernetes Operator
- [ ] Helm Chart

---

## 📚 十、参考资料

### 官方文档
- [vSphere API Reference](https://developer.vmware.com/apis/vsphere-automation/latest/)
- [Hyper-V WMI Classes](https://docs.microsoft.com/en-us/windows/win32/hyperv_v2/windows-virtualization-portal)
- [libvirt Go Documentation](https://libvirt.org/go/libvirt.html)

### Go 库
- [govmomi Examples](https://github.com/vmware/govmomi/tree/main/examples)
- [go-ole Usage](https://github.com/go-ole/go-ole/tree/master/example)
- [Gorilla WebSocket](https://github.com/gorilla/websocket)

### 最佳实践
- [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)
- [Effective Go](https://golang.org/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)

---

**文档维护者**: HostAgent-Go 开发团队  
**最后更新**: 2026-08-14  
**版本**: v1.0
