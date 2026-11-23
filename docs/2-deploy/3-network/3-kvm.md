# KVM / QEMU 网卡配置

宿主机上建两个桥：`br0` 接公网网卡，`br1` 只在本机内部，给内网用。iKuai 的两张网卡分别桥到这两个桥上。

## 建桥

NetworkManager 的写法（Debian / Ubuntu 的 netplan 同理，`lxcbr0` 这类已有桥可以复用）：

```bash
# 公网桥：接物理网卡 eth0
sudo nmcli con add type bridge ifname br0
sudo nmcli con add type bridge-slave ifname eth0 master br0

# 内网桥：不配地址、不接物理网卡
sudo nmcli con add type bridge ifname br1 ipv4.method disabled ipv6.method disabled
```

`br1` 不给 IP，地址全部交给 iKuai 分配。宿主机自己要访问内网实例时，临时加一条路由指向 iKuai 的 LAN 口即可。

## 挂到 iKuai

主控创建实例时，或者直接编辑 libvirt 的域定义：

```xml
<interface type='bridge'>
  <source bridge='br0'/>
  <model type='virtio'/>
</interface>
<interface type='bridge'>
  <source bridge='br1'/>
  <model type='virtio'/>
</interface>
```

SmolVM 走同一套桥接，把网卡桥到 `br0` / `br1` 就行。

## 验证

```bash
bridge link show
bridge link show master br1
```

iKuai 控制台里两张网卡都「已连接」之后，再继续下面的配置。
