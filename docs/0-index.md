---
layout: page
title: 快简云（Quick IDC）· 开源 IDC 虚拟化统一管理平台
titleTemplate: false
description: 快简云（Quick IDC）文档：IDC 虚拟化平台管理、部署、操作与开发说明。
---

<div class="oidc-home">

<HeroAurora />

<section class="oidc-section oidc-section--tight">
  <SectionHeading
    kicker="Platforms"
    title="虚拟平台"
    desc="容器、虚拟机和桌面级模拟器都有对应驱动。各平台能力差异由主控统一暴露，凭据与开关集中管理。"
  />
  <PlatformWall />
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Features"
    title="功能完善"
    desc="主机、实例、网络、存储、用户、任务、日志和计费都在一套数据模型里。下面是几页真实界面。"
  />
  <FeatureBento />
  <div class="oidc-shots">
    <figure class="oidc-figure">
      <img src="/imgs/hosts-list.png" alt="主机管理列表" loading="lazy" decoding="async">
      <figcaption>主机列表：十种平台同屏，资源占用实时刷新</figcaption>
    </figure>
    <figure class="oidc-figure">
      <img src="/imgs/vms-cards.png" alt="实例管理卡片视图" loading="lazy" decoding="async">
      <figcaption>实例卡片：CPU、内存、硬盘、流量和端口一屏看全</figcaption>
    </figure>
    <figure class="oidc-figure">
      <img src="/imgs/tasks.png" alt="任务管理页面" loading="lazy" decoding="async">
      <figcaption>任务管理：进度、错误信息和执行参数都能查到</figcaption>
    </figure>
  </div>
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Deploy"
    title="部署容易"
    desc="装主控、接平台、配网络、连财务，四步走完，一般半小时就能上线。主控是单二进制，宿主机只装对应运行时。"
  />
  <DeployFlow />
  <p style="margin-top:22px">
    <a class="oidc-btn" href="/deploy/">查看完整部署教程 →</a>
  </p>
</section>

<section class="oidc-section oidc-section--soft">
  <SectionHeading
    kicker="Manage"
    title="便捷管理"
    desc="命令行、桌面客户端、浏览器控制台三套入口，调的是同一套接口，习惯哪个用哪个。"
  />
  <ManageTools />
</section>

<section class="oidc-section">
  <SectionHeading
    kicker="Docs Map"
    title="文档导航"
    desc="第一次接触先看项目简介；准备上线看部署教程；日常运维看功能教程；二次开发看项目结构与开发指南。"
  />
  <div class="oidc-grid oidc-grid--3">
    <a class="oidc-card" href="/intro/">
      <span class="oidc-card__tag">0 · 项目简介</span>
      <h3>项目简介</h3>
      <p>用途、支持平台、功能地图与销售平台。</p>
    </a>
    <a class="oidc-card" href="/deploy/">
      <span class="oidc-card__tag">2 · 部署教程</span>
      <h3>部署教程</h3>
      <p>主控安装、平台部署、网络与主机配置、镜像与 CloudInit、财务对接。</p>
    </a>
    <a class="oidc-card" href="/usage/">
      <span class="oidc-card__tag">4 · 功能教程</span>
      <h3>功能教程</h3>
      <p>主机、实例、端口、反代、用户、任务、日志与系统设置逐页说明。</p>
    </a>
    <a class="oidc-card" href="/features/">
      <span class="oidc-card__tag">1 · 功能特性</span>
      <h3>功能特性</h3>
      <p>平台能力矩阵、生命周期、控制台、存储备份、配额与计费能力。</p>
    </a>
    <a class="oidc-card" href="/tools/">
      <span class="oidc-card__tag">3 · 管理工具</span>
      <h3>管理工具</h3>
      <p>命令行与桌面客户端的安装、命令手册与多主控管理。</p>
    </a>
    <a class="oidc-card" href="/dev/">
      <span class="oidc-card__tag">6 · 开发指南</span>
      <h3>开发指南</h3>
      <p>环境搭建、构建调试、代码规范与发布流程。</p>
    </a>
  </div>
</section>

<div class="oidc-cta">
  <h2>开始部署</h2>
  <p>CloudHost 提供 Go 主控服务，默认监听 1881。快速部署步骤适用于单台 Linux 主机与 Docker 环境。</p>
  <div class="oidc-cta__actions">
    <a class="oidc-btn oidc-btn--primary" href="/intro/quick-start">快速部署</a>
    <a class="oidc-btn" href="/deploy/core-install">安装主控</a>
    <a class="oidc-btn" href="/faq/">常见问题</a>
  </div>
</div>

</div>
