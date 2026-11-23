# 安装教程

按平台把两张网卡准备好，再装 iKuai。下面以 PVE 为例，其他平台流程一样，差别只在网卡怎么绑。

## 先配好网卡

iKuai 要两张网卡，一张接公网，一张接内网。不同平台挂法不一样，按平台看对应页面：

| 平台 | 做法 |
|---|---|
| [Proxmox VE](/deploy/network/pve) | `vmbr0` 公网 + 新建 `vmbr1` 内网 |
| [ESXi](/deploy/network/esxi) | 公网端口组 + 不带上行的 vSwitch |
| [KVM / QEMU](/deploy/network/kvm) | `br0` / `br1` 两个网桥 |
| [Hyper-V](/deploy/network/hyperv) | 外部交换机 + 内部交换机 |
| [VirtualBox](/deploy/network/virtualbox) | 桥接网卡 + 仅主机网络 |
| [VMware Workstation](/deploy/network/workstation) | `VMnet0` + `VMnet1` |
| [Docker / LXC](/deploy/network/container) | 不需要爱快 |

Docker 和 LXC 直接在宿主机分配地址，对外暴露交给主控的端口转发与反向代理，不用装爱快。

## 安装爱快

安装之前**请先确保上一步虚拟平台创建好公网网卡和/或内网网卡**

下面的教程以 `vmbr0` 作为**公网**网卡，`vmbr1` 作**内网**网卡，不同平台名称不同；截图里公网用 `10.2.1.x`、内网用 `10.2.20.x`，换成你自己的网段即可

当前教程以PVE为例，其他虚拟机平台安装过程都类似，只是需要注意绑定的网卡

### 下载镜像

前往[爱快路由系统下载](https://www.ikuai8.com/component/download)下载 `ISO 64位镜像`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/01-download-iso.png" alt="爱快下载页选择 ISO 64 位镜像" loading="lazy" decoding="async">
  <figcaption>下载页 ISO 一栏选 64 位</figcaption>
</figure>

### 创建并安装

1. 在虚拟机所在主机新建虚拟机，节点、VM ID、名称按需填，参考[爱快路由系统安装](https://www.ikuai8.com/component/install)。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/02-pve-create-general.png" alt="Proxmox VE 新建虚拟机 General 页" loading="lazy" decoding="async">
  <figcaption>新建虚拟机：节点、VM ID 和名称</figcaption>
</figure>

2. 在 OS 页选择爱快镜像，Guest OS 选 `Linux`、版本选 `6.x - 2.6 Kernel`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/03-pve-create-os.png" alt="Proxmox VE 新建虚拟机 OS 页选择爱快镜像" loading="lazy" decoding="async">
  <figcaption>OS 页：选 iKuai 的 ISO，类型 Linux 6.x - 2.6 Kernel</figcaption>
</figure>

3. CPU 推荐 2 核。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/04-pve-create-cpu.png" alt="Proxmox VE 新建虚拟机 CPU 页设置 2 核" loading="lazy" decoding="async">
  <figcaption>CPU：Sockets 1、Cores 2</figcaption>
</figure>

4. 内存推荐 4096 MB。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/05-pve-create-memory.png" alt="Proxmox VE 新建虚拟机内存页设置 4096 MB" loading="lazy" decoding="async">
  <figcaption>内存：4096 MB</figcaption>
</figure>

5. 网络页需要关闭防火墙，取消勾选 `Firewall`，桥接先选公网网卡所在的网桥。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/06-pve-create-network.png" alt="Proxmox VE 网络页取消勾选 Firewall" loading="lazy" decoding="async">
  <figcaption>Firewall 不勾，Bridge 选公网网桥（示例 vmbr0）</figcaption>
</figure>

6. 创建完成后进硬件页，点左上角「添加」，选「网络适配器」。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/07-pve-add-nic.png" alt="Proxmox VE 硬件页添加网络适配器" loading="lazy" decoding="async">
  <figcaption>硬件页左上角「添加」→「网络适配器」</figcaption>
</figure>

7. 向导创建的那张是公网网卡，再加一张内网网卡：桥接选虚拟机所在主机的内网网桥（示例 `vmbr1`），同样不勾 `Firewall`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/08-pve-add-lan-nic.png" alt="Proxmox VE 添加内网网卡并选择内网网桥" loading="lazy" decoding="async">
  <figcaption>第二张网卡接内网网桥（示例 vmbr1），Firewall 同样不勾</figcaption>
</figure>

8. 启动虚拟机，根据向导选择 `1` 安装，然后输入 `y` 安装到系统盘。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/09-install-console.png" alt="爱快安装控制台选择安装到硬盘" loading="lazy" decoding="async">
  <figcaption>控制台输入 1，把系统装到 sda</figcaption>
</figure>

## 设置爱快

装好后控制台会显示 Web 管理地址，右侧是两张网卡的连接状态，两边都「已连接」再往下配。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/10-console-menu.png" alt="爱快控制台显示 Web 管理地址与网卡状态" loading="lazy" decoding="async">
  <figcaption>控制台菜单：Web 地址默认 <code>192.168.9.1:80</code>，eth0 / eth1 都已连接</figcaption>
</figure>

### 绑定网卡

输入 `1` 进入绑定网卡界面。先确认 eth1 和 eth0 的 MAC 地址，分清哪张是公网网卡、哪张是内网网卡。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/11-nic-bind-list.png" alt="爱快控制台绑定网卡界面显示 eth0、eth1 的 MAC" loading="lazy" decoding="async">
  <figcaption>绑定网卡页：eth0 是 <code>bc:24:11:97:e1:b8</code>，eth1 是 <code>bc:24:11:bd:dc:2a</code></figcaption>
</figure>

MAC 地址回 PVE 硬件页对照，这里 `vmbr0` 是公网网卡 eth0，`vmbr1` 是内网网卡 eth1。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/12-pve-nic-mac.png" alt="Proxmox VE 硬件页显示 net0 桥接 vmbr0、net1 桥接 vmbr1" loading="lazy" decoding="async">
  <figcaption>net0 → vmbr0（公网），net1 → vmbr1（内网），MAC 与上面一一对应</figcaption>
</figure>

现在 eth0 被 lan1 占用了，需要先解除。输入 `del lan1`：

<figure class="oidc-figure">
  <img src="/imgs/ikuai/13-del-lan1.png" alt="爱快控制台输入 del lan1 解除绑定" loading="lazy" decoding="async">
  <figcaption>输入 <code>del lan1</code>，解除 lan1 和 eth0 的绑定</figcaption>
</figure>

公网网卡 `eth0(vmbr0)` 要设成 wan，输入 `set wan1 eth0`：

<figure class="oidc-figure">
  <img src="/imgs/ikuai/14-set-wan1-eth0.png" alt="爱快控制台输入 set wan1 eth0 绑定公网网卡" loading="lazy" decoding="async">
  <figcaption>输入 <code>set wan1 eth0</code>，把 vmbr0 绑到 eth0/wan1</figcaption>
</figure>

内网网卡 `eth1(vmbr1)` 要设成 lan，输入 `set lan1 eth1`：

<figure class="oidc-figure">
  <img src="/imgs/ikuai/15-set-lan1-eth1.png" alt="爱快控制台输入 set lan1 eth1 绑定内网网卡" loading="lazy" decoding="async">
  <figcaption>输入 <code>set lan1 eth1</code>，把 vmbr1 绑到 eth1/lan1</figcaption>
</figure>

全部完成后输入 `q` 返回主菜单。

### 设置网段

输入 `2` 进入绑定 IP 界面。

1. 输入 0 设置 lan 地址。这个地址是分配给虚拟机的内网 IP，推荐这些网段：

- `172.16.0-255.1`：最多 256×256 个 IP
- `10.0-255.0-255.1`：最多 256×256×256 个 IP
- `192.168.0-255.1`：最多 256×256 个 IP

注意：这是内网 IP。如果你打算直接给虚拟机分配公网 IP，这里就填公网网段，比如 `223.223.223.1/255.255.255.0`。

下面以 `10.2.20.1/255.255.255.0` 为例，输入 `10.2.20.1/255.255.255.0` 设置 lan 地址：

<figure class="oidc-figure">
  <img src="/imgs/ikuai/16-set-lan-ip.png" alt="爱快控制台设置 lan 地址为 10.2.20.1" loading="lazy" decoding="async">
  <figcaption>lan 地址：<code>10.2.20.1/255.255.255.0</code></figcaption>
</figure>

2. 输入 1 设置 wan 地址，这个地址是虚拟机的公网地址。比如外网地址 `10.2.1.20`、网关 `10.2.1.1`：

<figure class="oidc-figure">
  <img src="/imgs/ikuai/17-set-wan-ip.png" alt="爱快控制台设置 wan 外网地址与网关" loading="lazy" decoding="async">
  <figcaption>wan 地址 <code>10.2.1.20</code>，网关 <code>10.2.1.1</code></figcaption>
</figure>

全部完成后输入 `q` 返回主菜单。

### 开启访问

输入 `o` 进入「其他选项」，按 `2` 开启外网访问 web 页面。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/18-enable-web-access.png" alt="爱快控制台其他选项菜单，输入 2 开启外网访问 web" loading="lazy" decoding="async">
  <figcaption>其他选项：2 开启外网访问 web</figcaption>
</figure>

全部完成后输入 `q` 返回主菜单。

### 设置DHCP

浏览器打开 `http://<爱快外网地址>`，即可进入爱快的 web 管理页面。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/19-web-login.png" alt="浏览器访问爱快 web 管理页面" loading="lazy" decoding="async">
  <figcaption>用外网地址打开爱快 web 页面</figcaption>
</figure>

打开 DHCP 设置，把已有的 DHCP 条目删掉，不需要保留。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/20-dhcp-settings.png" alt="爱快 DHCP 设置页面删除默认 DHCP" loading="lazy" decoding="async">
  <figcaption>DHCP 设置：删除已有条目，地址分配交给主控</figcaption>
</figure>

打开 ARP 绑定，勾选「非 ARP 绑定不允许上网」，并兼容 DHCP 的 ARP 绑定。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/21-arp-bind.png" alt="爱快 ARP 绑定设置勾选非 ARP 绑定不允许上网" loading="lazy" decoding="async">
  <figcaption>ARP 绑定：勾选「非 ARP 绑定不允许上网」并兼容 DHCP</figcaption>
</figure>

## 配置说明

回到主控，主机 → 编辑 → 网络配置：

- 爱快地址和账号信息填外网地址和账号；
- 端口映射范围按你分配的来；
- 内网 IP 池填刚才配置的地址池：
  - 起始 IP 填内网起始地址，例如 `10.2.20.100`
  - 网关填 lan 地址，例如 `10.2.20.1`
  - 子网掩码和之前一致，推荐 `255.255.255.0`

<figure class="oidc-figure">
  <img src="/imgs/ikuai/22-core-network-config.png" alt="主控编辑主机网络配置，填写爱快地址与 IP 地址池" loading="lazy" decoding="async">
  <figcaption>主控「编辑主机 → 网络配置」：爱快地址 <code>10.2.1.20</code>，地址池起始 <code>10.2.20.100</code>、网关 <code>10.2.20.1</code></figcaption>
</figure>

用独立 IP 模式时，地址池换成分配给爱快的公网网段，不再填内网段：

- 起始 IP 填公网地址，例如 `223.223.223.2`
- 网关填 lan 地址，例如 `223.223.223.1`
- 子网掩码和之前一致，推荐 `255.255.255.0`

## 参考内容

- [网络端口](/features/network)
- [端口转发](/usage/nat)
- [反向代理](/usage/proxies)
