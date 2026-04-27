import { defineConfig, type DefaultTheme } from 'vitepress'

// ---------------------------------------------------------------------------
// OpenIDCS 官方文档站 · VitePress 配置
// 架构：Vite + VitePress（SSG） + GitHub Actions 自动部署到 GitHub Pages
// 目录：docs/          -> 中文文档
//       docs/en/      -> 英文文档
// ---------------------------------------------------------------------------

// 部署在自定义域名根路径（如 http://gh-idc.opkg.cn/）时使用 '/'
// 如改回 https://openidcsteam.github.io/Documents/ 这类子路径，请改回 '/Documents/'
const base = process.env.DOCS_BASE || '/'

// ==================== 中文导航 ====================
const zhNav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
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
    text: '配置',
    items: [
      { text: '主控端配置', link: '/config/server' },
      { text: '受控端配置', link: '/config/client' },
    ],
  },
  {
    text: '虚拟化平台',
    items: [
      { text: '平台对比总览', link: '/vm/comparison' },
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
    text: 'FSPlugins',
    items: [
      { text: '总览', link: '/fsplugins/' },
      { text: 'SwapIDC', link: '/fsplugins/swapidc' },
      { text: '魔方财务（IDCSmart）', link: '/fsplugins/idcsmart' },
      { text: '小黑云（XiaoHei）', link: '/fsplugins/xiaohei' },
    ],
  },
  {
    text: '关于',
    items: [
      { text: '开源协议', link: '/about/license' },
      { text: '免责声明', link: '/about/disclaimer' },
      { text: '团队介绍', link: '/about/team' },
    ],
  },
]

// ==================== 中文侧边栏 ====================
const zhSidebar: DefaultTheme.SidebarMulti = {
  '/guide/': [
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
  ],
  '/config/': [
    {
      text: '⚙️ 配置',
      collapsed: false,
      items: [
        { text: '主控端配置', link: '/config/server' },
        { text: '受控端配置', link: '/config/client' },
      ],
    },
  ],
  '/vm/': [
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
  ],
  '/tutorials/': [
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
  ],
  '/about/': [
    {
      text: 'ℹ️ 关于',
      collapsed: false,
      items: [
        { text: '开源协议', link: '/about/license' },
        { text: '免责声明', link: '/about/disclaimer' },
        { text: '团队介绍', link: '/about/team' },
      ],
    },
  ],
  '/fsplugins/': [
    {
      text: '🔌 FSPlugins 财务系统插件',
      collapsed: false,
      items: [
        { text: '总览', link: '/fsplugins/' },
        { text: 'SwapIDC 集成', link: '/fsplugins/swapidc' },
        { text: '魔方财务 IDCSmart 集成', link: '/fsplugins/idcsmart' },
        { text: '小黑云 XiaoHei 集成', link: '/fsplugins/xiaohei' },
      ],
    },
  ],
}

// ==================== 英文导航 ====================
const enNav: DefaultTheme.NavItem[] = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/en/guide/introduction' },
      { text: 'Advantages', link: '/en/guide/advantages' },
      { text: 'Features', link: '/en/guide/features' },
      { text: 'Quick Start', link: '/en/guide/quick-start' },
      { text: 'Installation', link: '/en/guide/installation' },
    ],
  },
  {
    text: 'Config',
    items: [
      { text: 'Server', link: '/en/config/server' },
      { text: 'Client', link: '/en/config/client' },
    ],
  },
  {
    text: 'Platforms',
    items: [
      { text: 'Comparison', link: '/en/vm/comparison' },
      { text: 'Docker / Podman', link: '/en/vm/docker' },
      { text: 'LXC / LXD', link: '/en/vm/lxd' },
      { text: 'VMware Workstation', link: '/en/vm/vmware' },
      { text: 'VMware vSphere ESXi', link: '/en/vm/esxi' },
      { text: 'Proxmox VE', link: '/en/vm/proxmox' },
      { text: 'Windows Hyper-V', link: '/en/vm/hyperv' },
      { text: 'Qingzhou Cloud', link: '/en/vm/qingzhou' },
    ],
  },
  {
    text: 'Tutorials',
    items: [
      { text: 'VM Management', link: '/en/tutorials/vm-management' },
      { text: 'User Management', link: '/en/tutorials/user-management' },
      { text: 'Permissions', link: '/en/tutorials/permissions' },
      { text: 'Logs', link: '/en/tutorials/logs' },
      { text: 'Monitoring', link: '/en/tutorials/monitoring' },
      { text: 'Network', link: '/en/tutorials/network' },
      { text: 'Backup', link: '/en/tutorials/backup' },
    ],
  },
  {
    text: 'About',
    items: [
      { text: 'License', link: '/en/about/license' },
      { text: 'Disclaimer', link: '/en/about/disclaimer' },
      { text: 'Team', link: '/en/about/team' },
    ],
  },
]

// ==================== 英文侧边栏 ====================
const enSidebar: DefaultTheme.SidebarMulti = {
  '/en/guide/': [
    {
      text: '📖 Guide',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/en/guide/introduction' },
        { text: 'Advantages', link: '/en/guide/advantages' },
        { text: 'Features', link: '/en/guide/features' },
        { text: 'Quick Start', link: '/en/guide/quick-start' },
        { text: 'Installation', link: '/en/guide/installation' },
      ],
    },
  ],
  '/en/config/': [
    {
      text: '⚙️ Config',
      collapsed: false,
      items: [
        { text: 'Server', link: '/en/config/server' },
        { text: 'Client', link: '/en/config/client' },
      ],
    },
  ],
  '/en/vm/': [
    {
      text: '🖥️ Platforms',
      collapsed: false,
      items: [
        { text: 'Comparison', link: '/en/vm/comparison' },
        { text: 'Docker / Podman', link: '/en/vm/docker' },
        { text: 'LXC / LXD', link: '/en/vm/lxd' },
        { text: 'VMware Workstation', link: '/en/vm/vmware' },
        { text: 'VMware vSphere ESXi', link: '/en/vm/esxi' },
        { text: 'Proxmox VE', link: '/en/vm/proxmox' },
        { text: 'Windows Hyper-V', link: '/en/vm/hyperv' },
        { text: 'Qingzhou Cloud', link: '/en/vm/qingzhou' },
      ],
    },
  ],
  '/en/tutorials/': [
    {
      text: '📚 Tutorials',
      collapsed: false,
      items: [
        { text: 'VM Management', link: '/en/tutorials/vm-management' },
        { text: 'User Management', link: '/en/tutorials/user-management' },
        { text: 'Permissions', link: '/en/tutorials/permissions' },
        { text: 'Logs', link: '/en/tutorials/logs' },
        { text: 'Monitoring', link: '/en/tutorials/monitoring' },
        { text: 'Network', link: '/en/tutorials/network' },
        { text: 'Backup', link: '/en/tutorials/backup' },
      ],
    },
  ],
  '/en/about/': [
    {
      text: 'ℹ️ About',
      collapsed: false,
      items: [
        { text: 'License', link: '/en/about/license' },
        { text: 'Disclaimer', link: '/en/about/disclaimer' },
        { text: 'Team', link: '/en/about/team' },
      ],
    },
  ],
}

// ==================== 主配置 ====================
export default defineConfig({
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  // 站点共享元数据
  title: 'OpenIDCS',
  description: 'OpenIDCS · 开源 IDC 虚拟化统一管理平台 · 一套 Web 界面 + RESTful API 统管 7 大虚拟化平台',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#0078E7' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'OpenIDCS · 开源虚拟化统一管理平台' }],
    ['meta', { property: 'og:site_name', content: 'OpenIDCS Docs' }],
    ['meta', { property: 'og:image', content: `${base}logo.svg` }],
  ],

  // ---------- 国际化 ----------
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
        editLink: {
          pattern: 'https://github.com/OpenIDCSTeam/Documents/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
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
        editLink: {
          pattern: 'https://github.com/OpenIDCSTeam/Documents/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the <a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3</a> License.',
          copyright: 'Copyright © 2024-present OpenIDCS Team',
        },
      },
    },
  },

  // ---------- 主题通用配置 ----------
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'OpenIDCS',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenIDCSTeam' },
    ],

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

  // ---------- Vite 额外配置 ----------
  vite: {
    server: {
      host: true,
      port: 5173,
    },
    build: {
      chunkSizeWarningLimit: 2048,
    },
  },

  // ---------- Markdown ----------
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
  },
})
