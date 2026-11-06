---
layout: page
title: OpenIDCS · 开源 IDC 虚拟化统一管理平台
titleTemplate: false
description: Docker、LXD、Proxmox VE、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM 统一纳管，一套 Web 控制台 + REST API + 财务系统插件。
---

<div class="oidc-home">

<HeroAurora />

<section class="oidc-section oidc-section--tight">
  <SectionHeading
    kicker="Platforms"
    title="一个面板，接住你的全部虚拟化栈"
    desc="从容器到裸金属虚拟机，从 Windows 宿主到 macOS 边缘节点。平台能力差异由主控统一抽象，凭据与开关集中管理。"
  />
  <PlatformWall />
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Features"
    title="把开机器这件事，做成一整条流水线"
    desc="实例、网络、存储、用户、任务、日志与计费，每一环都在同一套数据模型里，不再靠脚本与表格拼接。"
  />
  <FeatureBento />
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Deploy"
    title="四步上线：装主控、接平台、通网络、连财务"
    desc="主控是单二进制，宿主机只装运行时；平台接入与网络拓扑都有逐平台教程。"
  />
  <DeployFlow />
  <p style="margin-top:22px">
    <a class="oidc-btn" href="/deploy/">查看完整部署教程 →</a>
  </p>
</section>

<section class="oidc-section oidc-section--soft">
  <SectionHeading
    kicker="CLI & Desktop"
    title="opidcs：终端与桌面，同一套能力"
    desc="命令行覆盖主控、平台、主机、实例、端口、反代、用户、任务、日志与系统设置；桌面客户端把同一套能力做成可视化多主控管理台。"
  />
  <TerminalDemo />
  <div class="oidc-grid oidc-grid--3" style="margin-top:22px">
    <a class="oidc-card" href="/tools/cli">
      <span class="oidc-card__tag">CLI</span>
      <h3>opidcs 命令行</h3>
      <p>一行安装、交互式菜单、JSON 输出，支持 <code>--core</code> 多主控切换。</p>
    </a>
    <a class="oidc-card" href="/tools/gui">
      <span class="oidc-card__tag">Desktop</span>
      <h3>opidcs 桌面客户端</h3>
      <p>Tauri 构建，Windows / Linux / macOS 原生安装包，内置自动更新。</p>
    </a>
    <a class="oidc-card" href="/deploy/finance/">
      <span class="oidc-card__tag">Billing</span>
      <h3>财务系统插件</h3>
      <p>IDCSmart、LxdServer、SwapIDC、Easypanel、VistaPanel 五种对接形态。</p>
    </a>
  </div>
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Docs Map"
    title="按你的角色进入文档"
    desc="第一次接触看项目简介；要上线看部署教程；日常运维看功能教程；二次开发看项目结构与开发指南。"
  />
  <div class="oidc-grid oidc-grid--3">
    <a class="oidc-card" href="/intro/">
      <span class="oidc-card__tag">A · 项目简介</span>
      <h3>它是什么，能做什么</h3>
      <p>用途、支持的虚拟平台、功能地图与可对接的销售平台。</p>
    </a>
    <a class="oidc-card" href="/deploy/">
      <span class="oidc-card__tag">C · 部署教程</span>
      <h3>从零到能开机</h3>
      <p>主控安装、平台部署、网络与主机配置、镜像与 CloudInit、财务对接。</p>
    </a>
    <a class="oidc-card" href="/usage/">
      <span class="oidc-card__tag">E · 功能教程</span>
      <h3>每个菜单怎么用</h3>
      <p>主机、实例、端口、反代、用户、任务、日志与系统设置逐页说明。</p>
    </a>
    <a class="oidc-card" href="/features/">
      <span class="oidc-card__tag">B · 功能特性</span>
      <h3>能力边界与差异</h3>
      <p>平台能力矩阵、生命周期、控制台、存储备份、配额与计费能力。</p>
    </a>
    <a class="oidc-card" href="/tools/">
      <span class="oidc-card__tag">D · 管理工具</span>
      <h3>opidcs 工具链</h3>
      <p>命令行与桌面客户端的安装、命令手册与多主控管理。</p>
    </a>
    <a class="oidc-card" href="/dev/">
      <span class="oidc-card__tag">G · 开发指南</span>
      <h3>参与开发</h3>
      <p>环境搭建、构建调试、代码规范与发布流程。</p>
    </a>
  </div>
</section>

<div class="oidc-cta">
  <h2>现在就把第一台机器开出来</h2>
  <p>主控是单个 Go 二进制，宿主机只装运行时。装完打开 1881 端口，剩下的交给面板与 opidcs。</p>
  <div class="oidc-cta__actions">
    <a class="oidc-btn oidc-btn--primary" href="/deploy/core-install">开始安装</a>
    <a class="oidc-btn" href="/deploy/quick-start">快速体验</a>
    <a class="oidc-btn" href="/faq/">常见问题</a>
  </div>
</div>

</div>
