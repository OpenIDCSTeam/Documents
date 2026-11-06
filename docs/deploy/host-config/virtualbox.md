# VirtualBox 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
</div>

::: warning 必须同机
VirtualBox 引擎 `is_remote = false`，主控必须与 VirtualBox 安装在同一台机器；填远程地址无效。
:::

前置：[VirtualBox 已安装](/deploy/platform/virtualbox)，`VBoxManage` 可用。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `vbox-local` | 唯一 |
| 服务器类型 | Oracle VirtualBox | `VirtualBoxs` |
| 服务器地址 | `localhost` | 固定本机 |
| 程序启动路径 | `C:\Program Files\Oracle\VirtualBox` | VBoxManage |
| 模板存储路径 | `D:\VBox\Images` | 镜像 |
| 数据存储路径 | `D:\VBox\VMs` | 实例 |
| 虚拟机数量限制 | `20` | — |

```bash
opidcs host add --name vbox-local --type VirtualBoxs --addr localhost
```

## 验证

- [ ] `VBoxManage list vms` 正常
- [ ] 主控在线
- [ ] VRDE（RDP）控制台可连接

## 待维护者补充

- [ ] Extension Pack 与 USB 配置
- [ ] VRDE 端口规划
- [ ] 与主控同机部署的资源占用建议
