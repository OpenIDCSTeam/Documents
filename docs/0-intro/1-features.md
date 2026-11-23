# 功能介绍

主控把主机、实例、网络、用户和后台任务放进一个控制台，不用再逐个登录平台面板。

## 系统概览

首页给出主机数、实例数、用户数，加上 NAT 端口、Web 代理和系统状态；主机列表直接带 CPU、内存、硬盘的实时占用。数据由各平台驱动实时拉取，平台掉线就回退缓存并标记离线。

<figure class="oidc-figure">
  <img src="/imgs/theme/minimal.png" alt="系统概览页面" loading="lazy" decoding="async">
  <figcaption>系统概览：主机、实例、用户数量和集群运行状态</figcaption>
</figure>

## 主机管理

主机按服务器类型接入，Docker、LXD、Proxmox VE、ESXi、Hyper-V、KVM 混在同一张表里，在线状态和实例数一眼能看到。实例列表不分来源，创建、开关机、重装、删除都在这里做，细节见[实例生命周期](/features/lifecycle)。

<figure class="oidc-figure">
  <img src="/imgs/hosts-list.png" alt="主机管理列表" loading="lazy" decoding="async">
  <figcaption>主机管理：十种服务器类型同屏，CPU、内存、硬盘占用实时刷新</figcaption>
</figure>

## 实例详情

点开实例直接进 noVNC，画面和键鼠都在浏览器里；Windows 实例给 RDP 地址和账号，安卓云手机走 ADB。连接用一次性 token，绑定来源 IP，用完即失效。更多见[控制台与远程访问](/features/console)。

<figure class="oidc-figure">
  <img src="/imgs/vm-console-vnc.png" alt="浏览器内 noVNC 控制台" loading="lazy" decoding="async">
  <figcaption>控制台：浏览器里的 noVNC 画面，装系统、改密码都不用装客户端</figcaption>
</figure>

## 网络管理

NAT 端口转发按实例维护，能批量下发也能回收；接了爱快可以做 DHCP 静态绑定和 ARP 绑定；反向代理由主控托管 Caddy，域名证书自动申请续期。细节见[网络与端口](/features/network)。

<figure class="oidc-figure">
  <img src="/imgs/nat-list.png" alt="端口转发列表" loading="lazy" decoding="async">
  <figcaption>端口转发：公网端口、内网地址和备注在同一张表里</figcaption>
</figure>

## 用户配额

身份只有管理员和普通用户两级，配额按 CPU、内存、磁盘、实例数和流量累计，创建实例时校验。实例归属、共享者和访问密钥放在同一套模型里，见[共享与访问密钥](/features/access)。

## 任务日志

创建、重装、删除、备份这些耗时操作都进异步任务，能看进度、能取消，失败可以重试。失败任务会保留最后一步和原始错误，方便排查。日志同时写文件和数据库，控制台里按主机或实例检索。

<figure class="oidc-figure">
  <img src="/imgs/tasks.png" alt="任务管理页面" loading="lazy" decoding="async">
  <figcaption>任务管理：左侧任务列表，右侧进度、错误信息和执行参数</figcaption>
</figure>

## 财务对接

三个快简云（Quick IDC）插件把下单流程接到主控：魔方财务（IDCSmart）、SwapIDC、小黑云。用户付款后插件调 API 创建实例，再把控制台入口回给用户。接入方式见[财务系统对接](/features/finance)。
