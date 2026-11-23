import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig, type DefaultTheme } from 'vitepress'
import { mermaidMarkdownPlugin } from './plugins/mermaid'

if (process.argv[2] === 'dev' && process.env.NODE_ENV === 'production') {
  process.env.NODE_ENV = 'development'
}

// ---------------------------------------------------------------------------
// Quick IDC 官方文档站 · VitePress 配置
// 结构：0 项目简介 / 1 功能特性 / 2 部署教程 / 3 管理工具 / 4 功能教程
//       5 项目结构 / 6 开发指南 / 7 常见问题 / 8 关于项目
// 目录：docs/        中文站
//       docs/9-en/   英文站
// ---------------------------------------------------------------------------

const base = process.env.DOCS_BASE || '/'

const docsRoot = resolve(process.cwd(), 'docs')
const legacyRedirects = JSON.parse(
  readFileSync(resolve(docsRoot, '.vitepress/legacy-redirects.json'), 'utf8'),
) as Record<string, string>

const legacyRedirectPlugin: Plugin = {
  name: 'quickidc-legacy-route-redirects',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        next()
        return
      }

      const pathname = new URL(request.url || '/', 'http://localhost').pathname
      const siteBase = base.endsWith('/') ? base : `${base}/`
      const pagePath = pathname.startsWith(siteBase)
        ? `/${pathname.slice(siteBase.length)}`
        : pathname
      const normalizedPath = pagePath.length > 1 ? pagePath.replace(/\/+$/, '') : pagePath
      const destination =
        legacyRedirects[pagePath] ??
        legacyRedirects[normalizedPath] ??
        legacyRedirects[`${normalizedPath}/`]

      if (!destination) {
        next()
        return
      }

      response.statusCode = 302
      response.setHeader('Location', `${siteBase}${destination.replace(/^\/+/, '')}`)
      response.end()
    })
  },
}

function getNumberedPageRewrites(directory: string, parentPath = ''): Record<string, string> {
  const rewrites: Record<string, string> = {}

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === '.vitepress' || entry.name === 'public') continue
      const sourcePath = parentPath ? `${parentPath}/${entry.name}` : entry.name
      Object.assign(rewrites, getNumberedPageRewrites(resolve(directory, entry.name), sourcePath))
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) continue

    const sourcePath = parentPath ? `${parentPath}/${entry.name}` : entry.name
    rewrites[sourcePath] = sourcePath
      .split('/')
      .map((part) => part.replace(/^\d+-/, ''))
      .join('/')
  }

  return rewrites
}

const numberedPageRewrites = getNumberedPageRewrites(docsRoot)

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
  { text: '关于项目', link: '/about/', activeMatch: '/about/' },
]

// ==================== 中文侧边栏 ====================
const zhSidebar: DefaultTheme.SidebarMulti = {
  '/intro/': [
    {
      text: '项目简介',
      link: '/intro/',
      collapsed: false,
      items: [
        { text: '产品特点', link: '/intro/advantages' },
        { text: '快速部署', link: '/intro/quick-start' },
      ],
    },
  ],
  '/features/': [
    {
      text: '功能特性',
      link: '/features/',
      collapsed: false,
      items: [
        { text: '虚拟平台', link: '/features/platforms' },
        { text: '生命周期', link: '/features/lifecycle' },
        { text: '远程控制', link: '/features/console' },
        { text: '网络端口', link: '/features/network' },
        { text: '存储备份', link: '/features/storage' },
        { text: '用户配额', link: '/features/users' },
        { text: '共享密钥', link: '/features/access' },
        { text: '任务调度', link: '/features/tasks' },
        { text: '监控日志', link: '/features/monitoring' },
        { text: '多数据库', link: '/features/database' },
        { text: '财务对接', link: '/features/finance' },
      ],
    },
  ],
  '/deploy/platform/': [
    {
      text: '平台部署',
      link: '/deploy/platform/',
      collapsed: false,
      items: [
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
      text: '主机配置',
      link: '/deploy/host-config/',
      collapsed: false,
      items: [
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
      text: '财务对接',
      link: '/deploy/finance/',
      collapsed: false,
      items: [
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
      text: '部署教程',
      link: '/deploy/',
      collapsed: false,
      items: [
        { text: '主控安装', link: '/deploy/core-install' },
        { text: '虚拟平台', link: '/deploy/platform/' },
        { text: '网络设置', link: '/deploy/network' },
        { text: '主机配置', link: '/deploy/host-config/' },
        { text: '镜像配置', link: '/deploy/images' },
        { text: 'CloudInit', link: '/deploy/cloudinit' },
        { text: '财务对接', link: '/deploy/finance/' },
      ],
    },
  ],
  '/tools/': [
    {
      text: '管理工具',
      link: '/tools/',
      collapsed: false,
      items: [
        { text: '命令手册', link: '/tools/cli' },
        { text: '桌面工具', link: '/tools/gui' },
        { text: '安装更新', link: '/tools/install' },
      ],
    },
  ],
  '/usage/': [
    {
      text: '功能教程',
      link: '/usage/',
      collapsed: false,
      items: [
        { text: '系统概览', link: '/usage/dashboard' },
        { text: '主机管理', link: '/usage/hosts' },
        { text: '实例管理', link: '/usage/vms' },
        { text: '端口转发', link: '/usage/nat' },
        { text: '反向代理', link: '/usage/proxies' },
        { text: '用户管理', link: '/usage/users' },
        { text: '任务管理', link: '/usage/tasks' },
        { text: '日志查看', link: '/usage/logs' },
        { text: '系统设置', link: '/usage/settings' },
        { text: '备份恢复', link: '/usage/backup' },
        { text: '监控告警', link: '/usage/monitoring' },
      ],
    },
  ],
  '/structure/': [
    {
      text: '项目结构',
      link: '/structure/',
      collapsed: false,
      items: [
        { text: '技术架构', link: '/structure/architecture' },
        { text: '接口概览', link: '/structure/api' },
      ],
    },
  ],
  '/dev/': [
    {
      text: '开发指南',
      link: '/dev/',
      collapsed: false,
      items: [
        { text: '环境搭建', link: '/dev/environment' },
        { text: '构建调试', link: '/dev/build' },
        { text: '代码规范', link: '/dev/conventions' },
        { text: '发布流程', link: '/dev/release' },
      ],
    },
  ],
  '/faq/': [{ text: '常见问题', link: '/faq/' }],
  '/about/': [
    {
      text: '关于项目',
      link: '/about/',
      collapsed: false,
      items: [
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
      text: 'Introduction',
      link: '/en/intro/',
      collapsed: false,
      items: [
        { text: 'Advantages', link: '/en/intro/advantages' },
        { text: 'Quick deployment', link: '/en/intro/quick-start' },
      ],
    },
  ],
  '/en/features/': [
    {
      text: 'Features',
      link: '/en/features/',
      collapsed: false,
      items: [
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
      text: 'Platform Deployment',
      link: '/en/deploy/platform/',
      collapsed: false,
      items: [
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
      text: 'Host Configuration',
      link: '/en/deploy/host-config/',
      collapsed: false,
      items: [
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
      text: 'Billing Integration',
      link: '/en/deploy/finance/',
      collapsed: false,
      items: [
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
      text: 'Deployment',
      link: '/en/deploy/',
      collapsed: false,
      items: [
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
      text: 'Tools',
      link: '/en/tools/',
      collapsed: false,
      items: [
        { text: 'quickidc CLI', link: '/en/tools/cli' },
        { text: 'quickidc Desktop', link: '/en/tools/gui' },
        { text: 'Install & Update', link: '/en/tools/install' },
      ],
    },
  ],
  '/en/usage/': [
    {
      text: 'Guides',
      link: '/en/usage/',
      collapsed: false,
      items: [
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
      text: 'Structure',
      link: '/en/structure/',
      collapsed: false,
      items: [
        { text: 'Architecture', link: '/en/structure/architecture' },
        { text: 'API Overview', link: '/en/structure/api' },
      ],
    },
  ],
  '/en/dev/': [
    {
      text: 'Development',
      link: '/en/dev/',
      collapsed: false,
      items: [
        { text: 'Environment', link: '/en/dev/environment' },
        { text: 'Build & Debug', link: '/en/dev/build' },
        { text: 'Conventions', link: '/en/dev/conventions' },
        { text: 'Release', link: '/en/dev/release' },
      ],
    },
  ],
  '/en/faq/': [{ text: 'FAQ', link: '/en/faq/' }],
  '/en/about/': [
    {
      text: 'About Quick IDC',
      link: '/en/about/',
      collapsed: false,
      items: [
        { text: 'Team', link: '/en/about/team' },
        { text: 'License', link: '/en/about/license' },
        { text: 'Disclaimer', link: '/en/about/disclaimer' },
      ],
    },
  ],
}

export default defineConfig({
  base,
  rewrites: numberedPageRewrites,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://idcdoc.opkg.cn',
  },

  title: 'Quick IDC',
  description: 'Quick IDC（快简云）文档：IDC 虚拟化平台管理、部署、操作与开发说明。',

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
    ['meta', { property: 'og:title', content: 'Quick IDC（快简云）· 开源虚拟化统一管理平台' }],
    ['meta', { property: 'og:site_name', content: 'Quick IDC Docs' }],
    ['meta', { property: 'og:image', content: `${base}logo.svg` }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Quick IDC',
      description: '开源 IDC 虚拟化统一管理平台 · 官方文档',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdatedText: '最后更新',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '导航菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        editLink: { pattern: repoEdit, text: '在 GitHub 上编辑此页' },
        footer: {
          message: '基于 <a href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3</a> 协议发布',
          copyright: 'Copyright © 2024-present Quick IDC Team',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Quick IDC',
      description: 'Quick IDC · Unified Open-Source Virtualization Management Platform',
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
          copyright: 'Copyright © 2024-present Quick IDC Team',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Quick IDC',
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
    plugins: [legacyRedirectPlugin],
    server: { host: true, port: 5180 },
    build: { chunkSizeWarningLimit: 2048 },
    optimizeDeps: { include: ['mermaid'] },
  },

  markdown: {
    lineNumbers: true,
    theme: { light: 'github-dark', dark: 'github-dark' },
    image: { lazyLoading: true },
    config: (md) => mermaidMarkdownPlugin(md),
  },
})
