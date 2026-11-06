import { defineConfig, type DefaultTheme } from 'vitepress'

// ---------------------------------------------------------------------------
// OpenIDCS 官方文档站 · VitePress 配置
// 结构：A 项目简介 / B 功能特性 / C 部署教程 / D 管理工具 / E 功能教程
//       F 项目结构 / G 开发指南 / H 常见问题 / I 关于项目
// 目录：docs/        中文站
//       docs/en/     英文站（与中文同构）
// ---------------------------------------------------------------------------

const base = process.env.DOCS_BASE || '/'

const repoEdit = 'https://github.com/OpenIDCSTeam/Documents/edit/main/docs/:path'

// ==================== 中文导航 ====================
const zhNav: DefaultTheme.NavItem[] = [
  { text: '项目简介', link: '/intro/', activeMatch: '/intro/' },
  { text: '功能特性', link: '/features/', activeMatch: '/features/' },
  { text: '部署教程', link: '/deploy/', activeMatch: '/deploy/' },
  { text: '管理工具', link: '/tools/', activeMatch: '/tools/' },
  { text: '功能教程', link: '/usage/', activeMatch: '/usage/' },
  { text: '项目结构', link: '/structure/', activeMatch: '/structure/' },
  { text: '开发指南', link: '/dev/', activeMatch: '/dev/' },
  { text: '常见问题', link: '/faq/', activeMatch: '/faq/' },
  { text: '关于', link: '/about/', activeMatch: '/about/' },
]

// ==================== 中文侧边栏 ====================
const zhSidebar: DefaultTheme.SidebarMulti = {
  '/intro/': [
    {
      text: 'A · 项目简介',
      collapsed: false,
      items: [
        { text: '项目简介', link: '/intro/' },
        { text: '核心优势', link: '/intro/advantages' },
      ],
    },
  ],
  '/features/': [
    {
      text: 'B · 功能特性',
      collapsed: false,
      items: [
        { text: '总览', link: '/features/' },
        { text: '虚拟平台', link: '/features/platforms' },
        { text: '生命周期', link: '/features/lifecycle' },
        { text: '控制台与远程', link: '/features/console' },
        { text: '网络与端口', link: '/features/network' },
        { text: '存储与备份', link: '/features/storage' },
        { text: '用户与配额', link: '/features/users' },
        { text: '共享与密钥', link: '/features/access' },
        { text: '任务与调度', link: '/features/tasks' },
        { text: '监控与日志', link: '/features/monitoring' },
        { text: '多数据库', link: '/features/database' },
        { text: '财务对接', link: '/features/finance' },
      ],
    },
  ],
  '/deploy/platform/': [
    {
      text: 'C · 虚拟平台部署',
      collapsed: false,
      items: [
        { text: '总览', link: '/deploy/platform/' },
        { text: 'Docker / Podman', link: '/deploy/platform/docker' },
        { text: 'LXC / LXD', link: '/deploy/platform/lxd' },
        { text: 'SmolVM', link: '/deploy/platform/smolvm' },
        { text: 'QEMU / KVM', link: '/deploy/platform/qemu' },
        { text: 'VirtualBox', link: '/deploy/platform/virtualbox' },
        { text: 'VMware', link: '/deploy/platform/vmware' },
        { text: 'ESXi', link: '/deploy/platform/esxi' },
        { text: 'Proxmox VE', link: '/deploy/platform/proxmox' },
        { text: 'Hyper-V', link: '/deploy/platform/hyperv' },
        { text: 'MuMu', link: '/deploy/platform/memu' },
      ],
    },
  ],
  '/deploy/host-config/': [
    {
      text: 'C · 主机配置',
      collapsed: false,
      items: [
        { text: '总览', link: '/deploy/host-config/' },
        { text: 'Docker / Podman', link: '/deploy/host-config/docker' },
        { text: 'LXC / LXD', link: '/deploy/host-config/lxd' },
        { text: 'SmolVM', link: '/deploy/host-config/smolvm' },
        { text: 'QEMU / KVM', link: '/deploy/host-config/qemu' },
        { text: 'VirtualBox', link: '/deploy/host-config/virtualbox' },
        { text: 'VMware', link: '/deploy/host-config/vmware' },
        { text: 'ESXi', link: '/deploy/host-config/esxi' },
        { text: 'Proxmox VE', link: '/deploy/host-config/proxmox' },
        { text: 'Hyper-V', link: '/deploy/host-config/hyperv' },
        { text: 'MuMu', link: '/deploy/host-config/memu' },
      ],
    },
  ],
  '/deploy/finance/': [
    {
      text: 'C · 财务对接',
      collapsed: false,
      items: [
        { text: '总览', link: '/deploy/finance/' },
        { text: 'IDCSmart', link: '/deploy/finance/idcsmart' },
        { text: 'LxdServer', link: '/deploy/finance/lxdserver-idcsmart' },
        { text: 'SwapIDC', link: '/deploy/finance/swapidc' },
        { text: 'Easypanel', link: '/deploy/finance/easypanel-swapidc' },
        { text: 'VistaPanel', link: '/deploy/finance/vistapanel-swapidc' },
        { text: '小黑云', link: '/deploy/finance/xiaohei' },
      ],
    },
  ],
  '/deploy/': [
    {
      text: 'C · 部署教程',
      collapsed: false,
      items: [
        { text: '部署总览', link: '/deploy/' },
        { text: '快速体验', link: '/deploy/quick-start' },
        { text: '主控安装', link: '/deploy/core-install' },
        { text: '虚拟平台部署', link: '/deploy/platform/' },
        { text: '网络设置', link: '/deploy/network' },
        { text: '主机配置', link: '/deploy/host-config/' },
        { text: '镜像与初始化', link: '/deploy/images' },
        { text: 'CloudInit', link: '/deploy/cloudinit' },
        { text: '财务对接', link: '/deploy/finance/' },
      ],
    },
  ],
  '/tools/': [
    {
      text: 'D · 管理工具',
      collapsed: false,
      items: [
        { text: '工具总览', link: '/tools/' },
        { text: 'opidcs 命令行', link: '/tools/cli' },
        { text: 'opidcs 桌面客户端', link: '/tools/gui' },
        { text: '安装与更新', link: '/tools/install' },
      ],
    },
  ],
  '/usage/': [
    {
      text: 'E · 功能教程',
      collapsed: false,
      items: [
        { text: '功能教程总览', link: '/usage/' },
        { text: '系统概览', link: '/usage/dashboard' },
        { text: '主机管理', link: '/usage/hosts' },
        { text: '实例管理', link: '/usage/vms' },
        { text: '端口转发', link: '/usage/nat' },
        { text: '反向代理', link: '/usage/proxies' },
        { text: '用户管理', link: '/usage/users' },
        { text: '任务管理', link: '/usage/tasks' },
        { text: '日志查看', link: '/usage/logs' },
        { text: '系统设置', link: '/usage/settings' },
        { text: '备份与恢复', link: '/usage/backup' },
        { text: '监控与告警', link: '/usage/monitoring' },
      ],
    },
  ],
  '/structure/': [
    {
      text: 'F · 项目结构',
      collapsed: false,
      items: [
        { text: '仓库与技术栈', link: '/structure/' },
        { text: '技术架构', link: '/structure/architecture' },
        { text: 'API 概览', link: '/structure/api' },
      ],
    },
  ],
  '/dev/': [
    {
      text: 'G · 开发指南',
      collapsed: false,
      items: [
        { text: '开发总览', link: '/dev/' },
        { text: '环境搭建', link: '/dev/environment' },
        { text: '构建与调试', link: '/dev/build' },
        { text: '代码规范', link: '/dev/conventions' },
        { text: '发布流程', link: '/dev/release' },
      ],
    },
  ],
  '/faq/': [
    {
      text: 'H · 常见问题',
      collapsed: false,
      items: [{ text: '常见问题', link: '/faq/' }],
    },
  ],
  '/about/': [
    {
      text: 'I · 关于项目',
      collapsed: false,
      items: [
        { text: '关于 OpenIDCS', link: '/about/' },
        { text: '团队介绍', link: '/about/team' },
        { text: '开源协议', link: '/about/license' },
        { text: '免责声明', link: '/about/disclaimer' },
      ],
    },
  ],
}

// ==================== 英文导航 ====================
const enNav: DefaultTheme.NavItem[] = [
  { text: 'Introduction', link: '/en/intro/', activeMatch: '/en/intro/' },
  { text: 'Features', link: '/en/features/', activeMatch: '/en/features/' },
  { text: 'Deployment', link: '/en/deploy/', activeMatch: '/en/deploy/' },
  { text: 'Tools', link: '/en/tools/', activeMatch: '/en/tools/' },
  { text: 'Guides', link: '/en/usage/', activeMatch: '/en/usage/' },
  { text: 'Structure', link: '/en/structure/', activeMatch: '/en/structure/' },
  { text: 'Development', link: '/en/dev/', activeMatch: '/en/dev/' },
  { text: 'FAQ', link: '/en/faq/', activeMatch: '/en/faq/' },
  { text: 'About', link: '/en/about/', activeMatch: '/en/about/' },
]

const enSidebar: DefaultTheme.SidebarMulti = {
  '/en/intro/': [
    {
      text: 'A · Introduction',
      items: [
        { text: 'Introduction', link: '/en/intro/' },
        { text: 'Advantages', link: '/en/intro/advantages' },
      ],
    },
  ],
  '/en/features/': [
    {
      text: 'B · Features',
      items: [
        { text: 'Overview', link: '/en/features/' },
        { text: 'Platforms', link: '/en/features/platforms' },
        { text: 'Lifecycle', link: '/en/features/lifecycle' },
        { text: 'Console & Remote', link: '/en/features/console' },
        { text: 'Network & Ports', link: '/en/features/network' },
        { text: 'Storage & Backup', link: '/en/features/storage' },
        { text: 'Users & Quotas', link: '/en/features/users' },
        { text: 'Sharing & Keys', link: '/en/features/access' },
        { text: 'Tasks', link: '/en/features/tasks' },
        { text: 'Monitoring', link: '/en/features/monitoring' },
        { text: 'Databases', link: '/en/features/database' },
        { text: 'Billing', link: '/en/features/finance' },
      ],
    },
  ],
  '/en/deploy/platform/': [
    {
      text: 'C · Platform Deployment',
      items: [
        { text: 'Overview', link: '/en/deploy/platform/' },
        { text: 'Docker / Podman', link: '/en/deploy/platform/docker' },
        { text: 'LXC / LXD', link: '/en/deploy/platform/lxd' },
        { text: 'SmolVM', link: '/en/deploy/platform/smolvm' },
        { text: 'QEMU / KVM', link: '/en/deploy/platform/qemu' },
        { text: 'VirtualBox', link: '/en/deploy/platform/virtualbox' },
        { text: 'VMware', link: '/en/deploy/platform/vmware' },
        { text: 'ESXi', link: '/en/deploy/platform/esxi' },
        { text: 'Proxmox VE', link: '/en/deploy/platform/proxmox' },
        { text: 'Hyper-V', link: '/en/deploy/platform/hyperv' },
        { text: 'MuMu', link: '/en/deploy/platform/memu' },
      ],
    },
  ],
  '/en/deploy/host-config/': [
    {
      text: 'C · Host Configuration',
      items: [
        { text: 'Overview', link: '/en/deploy/host-config/' },
        { text: 'Docker / Podman', link: '/en/deploy/host-config/docker' },
        { text: 'LXC / LXD', link: '/en/deploy/host-config/lxd' },
        { text: 'SmolVM', link: '/en/deploy/host-config/smolvm' },
        { text: 'QEMU / KVM', link: '/en/deploy/host-config/qemu' },
        { text: 'VirtualBox', link: '/en/deploy/host-config/virtualbox' },
        { text: 'VMware', link: '/en/deploy/host-config/vmware' },
        { text: 'ESXi', link: '/en/deploy/host-config/esxi' },
        { text: 'Proxmox VE', link: '/en/deploy/host-config/proxmox' },
        { text: 'Hyper-V', link: '/en/deploy/host-config/hyperv' },
        { text: 'MuMu', link: '/en/deploy/host-config/memu' },
      ],
    },
  ],
  '/en/deploy/finance/': [
    {
      text: 'C · Billing Integration',
      items: [
        { text: 'Overview', link: '/en/deploy/finance/' },
        { text: 'IDCSmart', link: '/en/deploy/finance/idcsmart' },
        { text: 'LxdServer', link: '/en/deploy/finance/lxdserver-idcsmart' },
        { text: 'SwapIDC', link: '/en/deploy/finance/swapidc' },
        { text: 'Easypanel', link: '/en/deploy/finance/easypanel-swapidc' },
        { text: 'VistaPanel', link: '/en/deploy/finance/vistapanel-swapidc' },
        { text: 'XiaoHei', link: '/en/deploy/finance/xiaohei' },
      ],
    },
  ],
  '/en/deploy/': [
    {
      text: 'C · Deployment',
      items: [
        { text: 'Overview', link: '/en/deploy/' },
        { text: 'Quick Start', link: '/en/deploy/quick-start' },
        { text: 'Install CloudHost', link: '/en/deploy/core-install' },
        { text: 'Platforms', link: '/en/deploy/platform/' },
        { text: 'Network', link: '/en/deploy/network' },
        { text: 'Host Config', link: '/en/deploy/host-config/' },
        { text: 'Images & Init', link: '/en/deploy/images' },
        { text: 'CloudInit', link: '/en/deploy/cloudinit' },
        { text: 'Billing', link: '/en/deploy/finance/' },
      ],
    },
  ],
  '/en/tools/': [
    {
      text: 'D · Tools',
      items: [
        { text: 'Overview', link: '/en/tools/' },
        { text: 'opidcs CLI', link: '/en/tools/cli' },
        { text: 'opidcs Desktop', link: '/en/tools/gui' },
        { text: 'Install & Update', link: '/en/tools/install' },
      ],
    },
  ],
  '/en/usage/': [
    {
      text: 'E · Guides',
      items: [
        { text: 'Overview', link: '/en/usage/' },
        { text: 'Dashboard', link: '/en/usage/dashboard' },
        { text: 'Hosts', link: '/en/usage/hosts' },
        { text: 'Instances', link: '/en/usage/vms' },
        { text: 'Port Forwarding', link: '/en/usage/nat' },
        { text: 'Reverse Proxy', link: '/en/usage/proxies' },
        { text: 'Users', link: '/en/usage/users' },
        { text: 'Tasks', link: '/en/usage/tasks' },
        { text: 'Logs', link: '/en/usage/logs' },
        { text: 'Settings', link: '/en/usage/settings' },
        { text: 'Backup & Restore', link: '/en/usage/backup' },
        { text: 'Monitoring', link: '/en/usage/monitoring' },
      ],
    },
  ],
  '/en/structure/': [
    {
      text: 'F · Structure',
      items: [
        { text: 'Repositories & Stack', link: '/en/structure/' },
        { text: 'Architecture', link: '/en/structure/architecture' },
        { text: 'API Overview', link: '/en/structure/api' },
      ],
    },
  ],
  '/en/dev/': [
    {
      text: 'G · Development',
      items: [
        { text: 'Overview', link: '/en/dev/' },
        { text: 'Environment', link: '/en/dev/environment' },
        { text: 'Build & Debug', link: '/en/dev/build' },
        { text: 'Conventions', link: '/en/dev/conventions' },
        { text: 'Release', link: '/en/dev/release' },
      ],
    },
  ],
  '/en/faq/': [
    {
      text: 'H · FAQ',
      items: [{ text: 'FAQ', link: '/en/faq/' }],
    },
  ],
  '/en/about/': [
    {
      text: 'I · About',
      items: [
        { text: 'About OpenIDCS', link: '/en/about/' },
        { text: 'Team', link: '/en/about/team' },
        { text: 'License', link: '/en/about/license' },
        { text: 'Disclaimer', link: '/en/about/disclaimer' },
      ],
    },
  ],
}

export default defineConfig({
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  title: 'OpenIDCS',
  description:
    'OpenIDCS · 开源 IDC 虚拟化统一管理平台 · 一套 Web 界面 + RESTful API 统管 Docker、LXD、Proxmox VE、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM 等虚拟化平台',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap',
      },
    ],
    ['meta', { name: 'theme-color', content: '#2F6BFF' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'OpenIDCS · 开源虚拟化统一管理平台' }],
    ['meta', { property: 'og:site_name', content: 'OpenIDCS Docs' }],
    ['meta', { property: 'og:image', content: `${base}logo.svg` }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'OpenIDCS',
      description: '开源 IDC 虚拟化统一管理平台 · 官方文档',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdatedText: '最后更新',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        editLink: { pattern: repoEdit, text: '在 GitHub 上编辑此页' },
        footer: {
          message: '基于 <a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3</a> 协议发布',
          copyright: 'Copyright © 2024-present OpenIDCS Team',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'OpenIDCS',
      description: 'OpenIDCS · Unified Open-Source Virtualization Management Platform',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdatedText: 'Last updated',
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        editLink: { pattern: repoEdit, text: 'Edit this page on GitHub' },
        footer: {
          message: 'Released under the <a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3</a> License.',
          copyright: 'Copyright © 2024-present OpenIDCS Team',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'OpenIDCS',
    socialLinks: [{ icon: 'github', link: 'https://github.com/OpenIDCSTeam' }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上方向键',
                  navigateDownKeyAriaLabel: '下方向键',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc',
                },
              },
            },
          },
        },
      },
    },
  },

  vite: {
    server: { host: true, port: 5179 },
    build: { chunkSizeWarningLimit: 2048 },
  },

  markdown: {
    lineNumbers: true,
    theme: { light: 'github-dark', dark: 'github-dark' },
    image: { lazyLoading: true },
  },
})
