# ESXi 网卡配置

ESXi 用 vSwitch 加端口组区分公网和内网：iKuai 的 WAN 接带物理上行的端口组，LAN 接一个只在本机内部的 vSwitch。

## 建内网 vSwitch

在 vSphere 里选中主机 → 网络 → 虚拟交换机 → 添加标准虚拟交换机：

| 字段 | 值 |
|---|---|
| 名称 | `vSwitch-Internal` |
| 上行链路 | 不添加（截图里示例接了一条 `vmnic1`，那是公网交换机用的，内网不要接） |
| 安全 → 混杂模式、MAC 地址更改、伪传输 | 都选「接受」 |

然后在「端口组」里新建 `Internal`，绑定这个 vSwitch。

<figure class="oidc-figure">
  <img src="/imgs/esxi/vswitch-create.png" alt="ESXi 新建标准虚拟交换机" loading="lazy" decoding="async">
  <figcaption>示例：新建 vSwitch 时把安全策略三项都设为「接受」，内网用的这台不接上行链路</figcaption>
</figure>

## 挂到 iKuai

虚拟机 → 编辑设置 → 添加网络适配器：

| 网卡 | 端口组 | 适配器类型 |
|---|---|---|
| 网卡 1（公网） | `VM Network` | VMXNET3 |
| 网卡 2（内网） | `Internal` | VMXNET3 |

内网 vSwitch 不要接物理上行，否则内网和公网会在二层打通。

## 验证

- iKuai 控制台 eth0、eth1 均为「已连接」；
- 内网实例与 iKuai LAN 口互通。
