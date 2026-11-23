# 网络设置

本平台网络管理依赖[爱快软路由](https://www.ikuai8.com/)提供支持

通过API调用爱快实现DHCP/IP分配、ARP绑定、上下带宽限制等功能

## 运行原理

## 网卡配置

## 安装爱快

安装之前**请先确保上一步虚拟平台创建好公网网卡和/或内网网卡**

当前教程以PVE为例，其他虚拟机平台安装过程都类似，只是需要注意绑定的网卡

### 下载镜像

前往[爱快路由系统下载](https://www.ikuai8.com/component/download)下载 `ISO 64位镜像`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/01-download-iso.png" alt="爱快下载页选择 ISO 64 位镜像" loading="lazy" decoding="async">
  <figcaption>下载页 ISO 一栏选 64 位</figcaption>
</figure>

### 安装爱快

1. 在虚拟机所在主机新建虚拟机，节点、VM ID、名称按需填，参考[爱快路由系统安装](https://www.ikuai8.com/component/install)。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/02-create-vm1.png" alt="Proxmox VE 新建虚拟机 General 页" loading="lazy" decoding="async">
  <figcaption>新建虚拟机：节点、VM ID 和名称</figcaption>
</figure>

2. 在 OS 页选择爱快镜像，Guest OS 选 `Linux`、版本选 `6.x - 2.6 Kernel`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/03-create-vm2.png" alt="Proxmox VE 新建虚拟机 OS 页选择爱快镜像" loading="lazy" decoding="async">
  <figcaption>OS 页：选 iKuai 的 ISO，类型 Linux 6.x - 2.6 Kernel</figcaption>
</figure>


3. CPU 推荐 2 核。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/04-create-vm3.png" alt="Proxmox VE 新建虚拟机 CPU 页设置 2 核" loading="lazy" decoding="async">
  <figcaption>CPU：Sockets 1、Cores 2</figcaption>
</figure>

5. 内存推荐 4096 MB。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/05-create-vm4.png" alt="Proxmox VE 新建虚拟机内存页设置 4096 MB" loading="lazy" decoding="async">
  <figcaption>内存：4096 MB</figcaption>
</figure>

6. 网络页需要关闭防火墙，取消勾选 `Firewall`，桥接先选公网网卡所在的网桥。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/06-create-vm5.png" alt="Proxmox VE 网络页取消勾选 Firewall" loading="lazy" decoding="async">
  <figcaption>Firewall 不勾，Bridge 选公网网桥（示例 vmbr0）</figcaption>
</figure>

7. 创建完成后进硬件页，点左上角「添加」，选「网络适配器」。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/06-create-vm6.png" alt="Proxmox VE 硬件页添加网络适配器" loading="lazy" decoding="async">
  <figcaption>硬件页左上角「添加」→「网络适配器」</figcaption>
</figure>

8. 向导创建的那张是公网网卡，再加一张内网网卡：桥接选虚拟机所在主机的内网网桥（示例 `vmbr1`），同样不勾 `Firewall`。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/06-create-vm7.png" alt="Proxmox VE 添加内网网卡并选择内网网桥" loading="lazy" decoding="async">
  <figcaption>第二张网卡接内网网桥（示例 vmbr1），Firewall 同样不勾</figcaption>
</figure>

9. 启动虚拟机，根据向导选择 `1` 安装，然后输入 `y` 安装到系统盘。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/09-create-ins.png" alt="爱快安装控制台选择安装到硬盘" loading="lazy" decoding="async">
  <figcaption>控制台输入 1，把系统装到 sda</figcaption>
</figure>

## 设置爱快

装好后控制台会显示 Web 管理地址，右侧是两张网卡的连接状态，两边都「已连接」再往下配。

<figure class="oidc-figure">
  <img src="/imgs/ikuai/10.png" alt="爱快控制台显示 Web 管理地址与网卡状态" loading="lazy" decoding="async">
  <figcaption>控制台菜单：Web 地址默认 <code>192.168.9.1:80</code>，eth0 / eth1 都已连接</figcaption>
</figure>

## 参考内容

- [网络端口](/features/network)
- [端口转发](/usage/nat)
- [反向代理](/usage/proxies)
