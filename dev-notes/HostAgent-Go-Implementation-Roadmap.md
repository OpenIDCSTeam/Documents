# HostAgent-Go 完整实施路线图

## 📋 项目现状总结（2026-08-18）

### ✅ 已完成模块（Phase 1 - P0）

#### 1. 核心基础设施
- ✅ 用户认证系统（JWT + Session）
- ✅ 数据库层（SQLite + GORM）
- ✅ RESTful API 框架（Gin）
- ✅ 异步任务系统（TaskManager + Worker Pool）
- ✅ CSRF 防护中间件
- ✅ 日志和错误处理

#### 2. 虚拟化驱动（部分）
- ✅ Proxmox VE 驱动（基础功能 + 截图）
- ✅ SmolVM 驱动（基础功能）
- ⚠️ 9 个平台驱动骨架（仅默认实现，无真实逻辑）

#### 3. API 端点
- ✅ 认证：登录、登出、Token 刷新
- ✅ 虚拟机：CRUD、电源控制、VNC、快照
- ✅ 主机：信息查询、驱动加载
- ✅ 任务：列表、详情、取消、统计
- ✅ CSRF Token 获取

### ⚠️ 未完成功能（待开发）

#### 优先级分类

**🔴 P1 - 主流平台驱动（关键）**
```
1. VMware ESXi/vSphere（80h）
   - vCenter 管理接口集成
   - VM 生命周期管理
   - 高级快照、克隆
   - 存储/网络配置

2. Microsoft Hyper-V（60h）
   - PowerShell/WMI 集成
   - Generation 1/2 VM 支持
   - 虚拟交换机管理
   - 检查点（快照）

3. QEMU/KVM（50h）
   - libvirt API 集成
   - 完整 XML 配置
   - 存储池/卷管理
   - 实时迁移
```

**🟡 P2 - 次要平台驱动（重要）**
```
1. XenServer/XCP-ng（30h）
2. VirtualBox（25h）
3. Docker（30h）
4. Microsoft Azure（35h）
5. AWS EC2（25h）
6. Google Cloud Platform（20h）
```

**🟢 P3 - 存储与网络增强（有用）**
```
1. 网络存储支持
   - iSCSI 挂载/卸载（20h）
   - NFS 管理（15h）
   - Ceph RBD 集成（25h）

2. 高级存储功能
   - 磁盘热插拔（15h）
   - 存储迁移（20h）
   - 快照链管理（15h）
```

**🔵 P4 - 高级功能（增值）**
```
1. 证书管理（25h）
   - 自签名证书生成
   - Let's Encrypt 集成
   - 证书自动续期

2. 监控与告警（30h）
   - 实时性能监控
   - 资源使用趋势
   - 告警规则引擎

3. 调度器增强（20h）
   - 定时任务
   - 自动化运维脚本
   - 备份计划

4. 集群管理（15h）
   - 多主机协调
   - 负载均衡
   - 高可用（HA）
```

---

## 🎯 三阶段实施计划

### Phase 2：主流平台完整支持（6-8 周）

#### Week 1-3: VMware ESXi/vSphere（80h）

**依赖安装**
```bash
go get github.com/vmware/govmomi@latest
```

**实施清单**
- [ ] 创建 `internal/driver/esxi_driver.go`
- [ ] vCenter 客户端封装
- [ ] VM 生命周期管理（创建、删除、重装）
- [ ] 电源控制（开机、关机、重启、暂停）
- [ ] 快照管理（创建、删除、恢复、列表）
- [ ] 克隆与模板
- [ ] 存储管理（数据存储、磁盘）
- [ ] 网络管理（虚拟交换机、端口组）
- [ ] 资源分配（CPU、内存、磁盘）
- [ ] 控制台访问（VMRC/Web Console）
- [ ] 单元测试（模拟 vCenter）

**技术要点**
```go
// 核心结构
type ESXiDriver struct {
    client *govmomi.Client
    ctx    context.Context
}

// 关键方法
func (d *ESXiDriver) CreateVM(cfg *model.VMConfig) error
func (d *ESXiDriver) PowerControl(vmID string, action string) error
func (d *ESXiDriver) CreateSnapshot(vmID, name string) error
```

#### Week 4-5: Microsoft Hyper-V（60h）

**依赖安装**
```bash
go get github.com/masterzen/winrm@latest
go get github.com/go-ole/go-ole@latest
```

**实施清单**
- [ ] 创建 `internal/driver/hyperv_driver.go`
- [ ] WinRM/PowerShell 远程执行封装
- [ ] WMI 查询封装（Msvm_* 类）
- [ ] VM 生命周期管理
- [ ] 电源控制
- [ ] 检查点（快照）管理
- [ ] 虚拟硬盘管理（VHD/VHDX）
- [ ] 虚拟交换机管理
- [ ] Generation 1/2 VM 支持
- [ ] 嵌套虚拟化配置
- [ ] 单元测试（模拟 WMI）

**技术要点**
```go
// PowerShell 执行示例
func (d *HyperVDriver) executePowerShell(script string) (string, error) {
    client, _ := winrm.NewClient(&winrm.Endpoint{
        Host: d.host,
        Port: 5985,
    }, d.username, d.password)
    return client.Run(script, os.Stdout, os.Stderr)
}

// WMI 查询示例
func (d *HyperVDriver) getVM(vmID string) (*HyperVVM, error) {
    query := fmt.Sprintf("SELECT * FROM Msvm_ComputerSystem WHERE Name='%s'", vmID)
    return d.queryWMI(query)
}
```

#### Week 6-8: QEMU/KVM（50h）

**依赖安装**
```bash
go get libvirt.org/go/libvirt@latest
```

**实施清单**
- [ ] 创建 `internal/driver/kvm_driver.go`
- [ ] libvirt 连接管理
- [ ] VM 定义（XML 配置）
- [ ] VM 生命周期管理
- [ ] 电源控制
- [ ] 快照管理（内部/外部）
- [ ] 存储池管理
- [ ] 存储卷管理
- [ ] 网络配置（桥接、NAT）
- [ ] VNC/SPICE 控制台
- [ ] 实时迁移
- [ ] 单元测试（模拟 libvirt）

**技术要点**
```go
// libvirt 连接
func (d *KVMDriver) connect() (*libvirt.Connect, error) {
    return libvirt.NewConnect("qemu+ssh://" + d.host + "/system")
}

// VM 创建（XML）
const vmXMLTemplate = `
<domain type='kvm'>
  <name>{{.Name}}</name>
  <memory unit='GiB'>{{.Memory}}</memory>
  <vcpu>{{.CPU}}</vcpu>
  <os><type arch='x86_64'>hvm</type></os>
  <devices>
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='{{.DiskPath}}'/>
      <target dev='vda' bus='virtio'/>
    </disk>
  </devices>
</domain>
`
```

---

### Phase 3：次要平台与存储增强（4-6 周）

#### Week 9-10: 次要虚拟化平台（110h）

**实施清单**

1. **XenServer/XCP-ng**（30h）
   - [ ] 创建 `internal/driver/xen_driver.go`
   - [ ] XenAPI 集成
   - [ ] VM 管理、存储库、网络

2. **VirtualBox**（25h）
   - [ ] 创建 `internal/driver/vbox_driver.go`
   - [ ] VBoxManage CLI 封装
   - [ ] VM 管理、快照、网络

3. **Docker**（30h）
   - [ ] 创建 `internal/driver/docker_driver.go`
   - [ ] Docker Engine API
   - [ ] 容器管理、镜像、网络、卷

4. **Microsoft Azure**（35h）
   - [ ] 创建 `internal/driver/azure_driver.go`
   - [ ] Azure SDK 集成
   - [ ] VM 管理、资源组、存储

5. **AWS EC2**（25h）
   - [ ] 创建 `internal/driver/aws_driver.go`
   - [ ] AWS SDK 集成
   - [ ] EC2 实例管理、EBS、VPC

6. **Google Cloud Platform**（20h）
   - [ ] 创建 `internal/driver/gcp_driver.go`
   - [ ] GCP SDK 集成
   - [ ] Compute Engine 管理

#### Week 11-12: 网络存储支持（60h）

**实施清单**

1. **iSCSI 支持**（20h）
   - [ ] 创建 `internal/storage/iscsi.go`
   - [ ] Target 发现与登录
   - [ ] LUN 挂载/卸载
   - [ ] CHAP 认证

2. **NFS 支持**（15h）
   - [ ] 创建 `internal/storage/nfs.go`
   - [ ] NFS 挂载/卸载
   - [ ] 共享权限管理

3. **Ceph RBD**（25h）
   - [ ] 创建 `internal/storage/ceph.go`
   - [ ] Ceph 集群连接
   - [ ] RBD 镜像管理
   - [ ] 快照与克隆

**技术要点**
```go
// iSCSI 示例
type ISCSIManager struct {
    executor cmd.Executor
}

func (m *ISCSIManager) DiscoverTargets(portal string) ([]string, error) {
    output, err := m.executor.Execute("iscsiadm", "-m", "discovery", "-t", "st", "-p", portal)
    return parseTargets(output), err
}

func (m *ISCSIManager) Login(target, portal string) error {
    _, err := m.executor.Execute("iscsiadm", "-m", "node", "-T", target, "-p", portal, "--login")
    return err
}
```

---

### Phase 4：高级功能与集成（3-4 周）

#### Week 13: 证书管理（25h）

**实施清单**
- [ ] 创建 `internal/cert/manager.go`
- [ ] 自签名证书生成
- [ ] Let's Encrypt ACME 客户端
- [ ] 证书存储与加载
- [ ] 自动续期调度
- [ ] HTTPS 服务器集成

**技术要点**
```go
import "golang.org/x/crypto/acme/autocert"

func setupTLS() *autocert.Manager {
    return &autocert.Manager{
        Prompt:      autocert.AcceptTOS,
        Cache:       autocert.DirCache("/var/cache/certs"),
        HostPolicy:  autocert.HostWhitelist("example.com"),
    }
}
```

#### Week 14: 监控与告警（30h）

**实施清单**
- [ ] 创建 `internal/monitor/collector.go`
- [ ] 实时性能数据采集
- [ ] 时间序列数据存储
- [ ] 告警规则引擎
- [ ] 通知渠道（Email、Webhook）
- [ ] WebSocket 实时推送

#### Week 15: 调度器与自动化（20h）

**实施清单**
- [ ] 创建 `internal/scheduler/cron.go`
- [ ] Cron 表达式解析
- [ ] 定时任务调度
- [ ] 备份计划管理
- [ ] 运维脚本执行

#### Week 16: 集群与高可用（15h）

**实施清单**
- [ ] 创建 `internal/cluster/manager.go`
- [ ] 节点发现与注册
- [ ] 健康检查
- [ ] 负载均衡策略
- [ ] 故障转移

---

## 🔧 技术实施指南

### 1. 异步任务集成模式

所有耗时操作必须接入任务系统：

```go
// 在 API Handler 中
func (h *VMHandler) handleCreateVM(c *gin.Context) {
    var req CreateVMRequest
    c.BindJSON(&req)
    
    // 创建异步任务
    task := h.taskManager.CreateTask(
        task.TypeVMCreate,
        req.HostID + "/" + req.Name,
        c.GetString("user_id"),
        map[string]interface{}{"config": req},
    )
    
    // 提交到工作队列
    h.taskManager.SubmitTask(task, func(t *task.Task) error {
        driver := h.getDriver(req.HostID)
        return driver.CreateVM(req.ToVMConfig())
    })
    
    c.JSON(200, gin.H{"task_id": task.ID})
}
```

### 2. 驱动统一接口

所有驱动必须实现标准接口：

```go
// internal/driver/interface.go
type VirtualizationDriver interface {
    // 基础操作
    Connect() error
    Disconnect() error
    Ping() error
    
    // VM 生命周期
    CreateVM(cfg *model.VMConfig) (*model.VM, error)
    DeleteVM(vmID string) error
    ReinstallVM(vmID string, osImage string) error
    
    // 电源控制
    PowerControl(vmID string, action PowerAction) error
    GetStatus(vmID string) (*model.VMStatus, error)
    
    // 快照管理
    CreateSnapshot(vmID, name, desc string) (*model.Snapshot, error)
    DeleteSnapshot(vmID, snapID string) error
    RestoreSnapshot(vmID, snapID string) error
    ListSnapshots(vmID string) ([]*model.Snapshot, error)
    
    // 控制台访问
    GetVNCInfo(vmID string) (*model.VNCInfo, error)
    GetScreenshot(vmID string) ([]byte, error)
    
    // 资源管理
    GetGPUList() ([]*model.GPU, error)
    GetUSBList() ([]*model.USB, error)
    SetupPCI(vmID, pciID string) error
    SetupUSB(vmID, usbID string) error
    
    // 存储管理
    MountHDD(vmID string, disk *model.Disk) error
    MountISO(vmID, isoPath string) error
    TransferHDD(vmID, targetHost, targetPath string) error
    
    // 备份与恢复
    CreateBackup(vmID, backupPath string) error
    RestoreBackup(vmID, backupPath string) error
    
    // 网络管理
    GetNetworkList() ([]*model.Network, error)
    AttachNetwork(vmID, networkID string) error
    
    // 批量操作
    ScanVMs() ([]*model.VM, error)
    GetOSImages() ([]*model.OSImage, error)
}
```

### 3. 错误处理规范

```go
// 自定义错误类型
var (
    ErrDriverNotFound    = errors.New("driver not found")
    ErrVMNotFound        = errors.New("virtual machine not found")
    ErrInvalidOperation  = errors.New("invalid operation")
    ErrAuthFailed        = errors.New("authentication failed")
    ErrConnectionTimeout = errors.New("connection timeout")
)

// 错误包装
func (d *ESXiDriver) CreateVM(cfg *model.VMConfig) error {
    if err := d.connect(); err != nil {
        return fmt.Errorf("connect to ESXi: %w", err)
    }
    
    if err := d.validateConfig(cfg); err != nil {
        return fmt.Errorf("validate config: %w", err)
    }
    
    // ... 实现逻辑
}
```

### 4. 并发安全

```go
type ESXiDriver struct {
    mu     sync.RWMutex
    client *govmomi.Client
    cache  map[string]*VM
}

func (d *ESXiDriver) GetVM(vmID string) (*VM, error) {
    d.mu.RLock()
    if vm, ok := d.cache[vmID]; ok {
        d.mu.RUnlock()
        return vm, nil
    }
    d.mu.RUnlock()
    
    d.mu.Lock()
    defer d.mu.Unlock()
    
    vm, err := d.fetchVM(vmID)
    if err == nil {
        d.cache[vmID] = vm
    }
    return vm, err
}
```

### 5. 测试策略

```go
// 单元测试（使用 Mock）
func TestESXiDriver_CreateVM(t *testing.T) {
    mockClient := &MockVCenterClient{}
    driver := &ESXiDriver{client: mockClient}
    
    cfg := &model.VMConfig{
        Name:   "test-vm",
        Memory: 4096,
        CPU:    2,
    }
    
    err := driver.CreateVM(cfg)
    assert.NoError(t, err)
    assert.Equal(t, 1, mockClient.CreateVMCalls)
}

// 集成测试（需要真实环境）
func TestESXiDriver_Integration(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test")
    }
    
    driver := NewESXiDriver(testConfig)
    // ... 真实环境测试
}
```

---

## 📊 资源需求

### 工时估算

| 阶段 | 模块 | 工时 | 人员 | 工期 |
|-----|------|------|------|------|
| Phase 2 | ESXi/vSphere | 80h | 1人 | 2周 |
| Phase 2 | Hyper-V | 60h | 1人 | 1.5周 |
| Phase 2 | KVM | 50h | 1人 | 1.5周 |
| Phase 3 | 次要平台 | 110h | 1人 | 3周 |
| Phase 3 | 网络存储 | 60h | 1人 | 1.5周 |
| Phase 4 | 高级功能 | 90h | 1人 | 2.5周 |
| **总计** | **全部** | **450h** | **1-2人** | **12-15周** |

### 测试环境

1. **VMware 环境**
   - vCenter Server 7.0+
   - ESXi 7.0+ 主机 x2

2. **Hyper-V 环境**
   - Windows Server 2022
   - Hyper-V 角色已启用

3. **KVM 环境**
   - Ubuntu 22.04 LTS
   - libvirt + QEMU 安装

4. **云平台**
   - Azure 测试订阅
   - AWS 测试账户
   - GCP 测试项目

5. **存储**
   - iSCSI Target 服务器
   - NFS 共享
   - Ceph 测试集群（可选）

---

## ✅ 验收标准

### 功能完整性
- [ ] 所有 P1 平台驱动 100% 实现
- [ ] 所有 P2 平台驱动 90% 实现
- [ ] P3/P4 功能 80% 实现

### 代码质量
- [ ] 单元测试覆盖率 ≥ 70%
- [ ] 所有公共 API 有完整文档
- [ ] 通过 `go vet` 和 `golangci-lint` 检查
- [ ] 无已知的并发安全问题

### 性能指标
- [ ] API 响应时间 < 200ms（p95）
- [ ] 并发任务处理 ≥ 100 个/秒
- [ ] 内存占用 < 512MB（空闲）

### 安全性
- [ ] 所有敏感信息加密存储
- [ ] CSRF 防护全面覆盖
- [ ] SQL 注入防护
- [ ] XSS 防护

---

## 🚨 风险与对策

### 技术风险

1. **vSphere API 复杂度**
   - 风险：API 文档不全，调试困难
   - 对策：使用 govmomi 成熟库，参考社区示例

2. **WMI 稳定性**
   - 风险：PowerShell 远程执行可能不稳定
   - 对策：增加重试机制，完善错误处理

3. **并发 Bug**
   - 风险：高并发下出现数据竞争
   - 对策：严格 Code Review，使用 `go run -race` 检测

### 进度风险

1. **工时估算偏差**
   - 风险：实际工时超出 20%+
   - 对策：每周复盘，及时调整优先级

2. **测试环境不足**
   - 风险：无法充分验证所有平台
   - 对策：优先保证 P1 平台，P2 平台使用模拟

---

## 📅 里程碑

| 时间 | 里程碑 | 可交付成果 |
|------|--------|-----------|
| Week 3 | ESXi 完成 | ESXi 驱动 + 测试 + 文档 |
| Week 5 | Hyper-V 完成 | Hyper-V 驱动 + 测试 + 文档 |
| Week 8 | Phase 2 完成 | 3 大主流平台全支持 |
| Week 10 | 次要平台完成 | 6 个次要平台基础支持 |
| Week 12 | Phase 3 完成 | 存储增强 + 次要平台 |
| Week 16 | 项目交付 | 完整功能 + 全量测试 + 文档 |

---

## 🎯 下一步行动

### 立即开始（本周）

1. **安装 VMware 依赖**
   ```bash
   go get github.com/vmware/govmomi@latest
   ```

2. **创建 ESXi 驱动文件**
   ```bash
   touch internal/driver/esxi_driver.go
   touch internal/driver/esxi_driver_test.go
   ```

3. **准备测试环境**
   - 配置 vCenter 测试实例
   - 准备测试用 VM 模板

4. **开始编码**
   - 实现 ESXiDriver 基础结构
   - 实现 Connect/Disconnect 方法
   - 编写第一个单元测试

---

**路线图状态**: 📍 当前位于 Phase 2 起点，准备实施 ESXi 驱动  
**预计完成时间**: 2026-12-01（约 15 周）  
**总体进度**: Phase 1 ✅ 完成 | Phase 2-4 ⏳ 待开始
