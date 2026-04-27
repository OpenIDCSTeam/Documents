import { defineValaxyConfig } from 'valaxy'

export default defineValaxyConfig({
  // 指定主题
  theme: 'press',

  // GitHub Pages 配置
  base: process.env.NODE_ENV === 'production' ? '/Document/' : '/',

  siteConfig: {
    title: 'OpenIDCS',
    subtitle: '开源 IDC 虚拟化统一管理平台',
    description: '使用统一 Web 界面和 RESTful API 管理多虚拟化平台的虚拟机基础设施',
    author: {
      name: 'OpenIDCS Team',
      email: 'openidcs@team.org',
      link: 'https://github.com/OpenIDCSTeam',
    },
    url: 'https://openidcs.org',
    lang: 'zh-CN',
    languages: ['zh-CN', 'en'],
    favicon: '/favicon.ico',
  },

  themeConfig: {
    logo: '/logo.svg',

    colors: {
      primary: '#0078E7',
    },

    nav: [
      {
        text: '指南',
        items: [
          { text: '项目介绍', link: '/guide/introduction' },
          { text: '功能概览', link: '/guide/features' },
          { text: '快速上手', link: '/guide/quick-start' },
          { text: '安装部署', link: '/guide/installation' },
        ],
      },
      {
        text: '配置',
        items: [
          { text: '主控端配置', link: '/config/server' },
          { text: '受控端配置', link: '/config/client' },
        ],
      },
      {
        text: '虚拟化平台',
        items: [
          { text: 'Docker / Podman', link: '/vm/docker' },
          { text: 'LXC / LXD', link: '/vm/lxd' },
          { text: 'VMware Workstation', link: '/vm/vmware' },
          { text: 'VMware vSphere ESXi', link: '/vm/esxi' },
          { text: 'Proxmox VE', link: '/vm/proxmox' },
          { text: 'Windows Hyper-V', link: '/vm/hyperv' },
          { text: '青州云 Qingzhou', link: '/vm/qingzhou' },
          { text: '平台对比总览', link: '/vm/comparison' },
        ],
      },
      {
        text: '功能教程',
        items: [
          { text: '虚拟机管理', link: '/tutorials/vm-management' },
          { text: '用户管理', link: '/tutorials/user-management' },
          { text: '权限管理', link: '/tutorials/permissions' },
          { text: '日志管理', link: '/tutorials/logs' },
          { text: '监控与告警', link: '/tutorials/monitoring' },
          { text: '网络与端口转发', link: '/tutorials/network' },
          { text: '备份与恢复', link: '/tutorials/backup' },
        ],
      },
      {
        text: '关于',
        items: [
          { text: '开源协议', link: '/about/license' },
          { text: '免责声明', link: '/about/disclaimer' },
          { text: '团队介绍', link: '/about/team' },
          { text: 'English', link: '/en/' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/OpenIDCSTeam/OpenIDCS-Client',
      },
    ],

    sidebar: [
      {
        text: '📖 指南',
        collapsed: false,
        items: [
          { text: '项目介绍', link: '/guide/introduction' },
          { text: '核心优势', link: '/guide/advantages' },
          { text: '功能概览', link: '/guide/features' },
          { text: '架构设计', link: '/guide/architecture' },
          { text: '快速上手', link: '/guide/quick-start' },
          { text: '安装部署', link: '/guide/installation' },
        ],
      },
      {
        text: '⚙️ 配置',
        collapsed: false,
        items: [
          { text: '主控端配置', link: '/config/server' },
          { text: '受控端配置', link: '/config/client' },
        ],
      },
      {
        text: '🖥️ 虚拟化平台',
        collapsed: false,
        items: [
          { text: '平台对比', link: '/vm/comparison' },
          { text: 'Docker / Podman', link: '/vm/docker' },
          { text: 'LXC / LXD', link: '/vm/lxd' },
          { text: 'VMware Workstation', link: '/vm/vmware' },
          { text: 'VMware vSphere ESXi', link: '/vm/esxi' },
          { text: 'Proxmox VE', link: '/vm/proxmox' },
          { text: 'Windows Hyper-V', link: '/vm/hyperv' },
          { text: '青州云 Qingzhou', link: '/vm/qingzhou' },
        ],
      },
      {
        text: '📚 功能教程',
        collapsed: false,
        items: [
          { text: '虚拟机管理', link: '/tutorials/vm-management' },
          { text: '用户管理', link: '/tutorials/user-management' },
          { text: '权限管理', link: '/tutorials/permissions' },
          { text: '日志管理', link: '/tutorials/logs' },
          { text: '监控与告警', link: '/tutorials/monitoring' },
          { text: '网络与端口转发', link: '/tutorials/network' },
          { text: '备份与恢复', link: '/tutorials/backup' },
        ],
      },
      {
        text: 'ℹ️ 关于',
        collapsed: true,
        items: [
          { text: '开源协议', link: '/about/license' },
          { text: '免责声明', link: '/about/disclaimer' },
          { text: '团队介绍', link: '/about/team' },
        ],
      },
      {
        text: '🌐 English Docs',
        collapsed: true,
        items: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'Quick Start', link: '/en/guide/quick-start' },
          { text: 'Installation', link: '/en/guide/installation' },
          { text: 'Server Setup', link: '/en/config/server' },
          { text: 'Client Setup', link: '/en/config/client' },
          { text: 'Platform Comparison', link: '/en/vm/comparison' },
          { text: 'Tutorials: VM', link: '/en/tutorials/vm-management' },
          { text: 'Tutorials: Users', link: '/en/tutorials/user-management' },
          { text: 'Tutorials: Permissions', link: '/en/tutorials/permissions' },
          { text: 'Tutorials: Logs', link: '/en/tutorials/logs' },
          { text: 'Tutorials: Monitoring', link: '/en/tutorials/monitoring' },
          { text: 'Tutorials: Network', link: '/en/tutorials/network' },
          { text: 'Tutorials: Backup', link: '/en/tutorials/backup' },
          { text: 'About / License', link: '/en/about/license' },
        ],
      },
    ],

    footer: {
      message: '基于 AGPLv3 许可发布',
      copyright: 'Copyright © 2024-present OpenIDCS Team',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenIDCSTeam/OpenIDCS-Client' },
    ],

    editLink: {
      pattern: 'https://github.com/OpenIDCSTeam/Documents/edit/main/pages/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      enable: true,
    },
  },
})