<script setup lang="ts">
import { withBase } from 'vitepress'

type Item = {
  title: string
  desc: string
  href: string
  tone: string
  span?: boolean
  path: string
}

const items: Item[] = [
  {
    title: '多平台统一纳管',
    desc: 'Docker、LXD、Proxmox VE、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM、MuMu，同一套主机模型与 API。',
    href: '/features/platforms',
    tone: 'blue',
    span: true,
    path: 'M4 7h16M4 12h16M4 17h10',
  },
  {
    title: '实例全生命周期',
    desc: '创建、开机、关机、重置、重装、暂停、删除，异步任务串起每一步。',
    href: '/features/lifecycle',
    tone: 'cyan',
    path: 'M12 3v6m0 6v6M3 12h6m6 0h6',
  },
  {
    title: '浏览器控制台',
    desc: '内置 noVNC 与 Web SSH，点开即用，无需本机装客户端。',
    href: '/features/console',
    tone: 'violet',
    path: 'M3 5h18v14H3zM7 10l3 2-3 2',
  },
  {
    title: 'NAT 与反向代理',
    desc: '端口转发规则 + Caddy 反代，域名与证书一次配好。',
    href: '/features/network',
    tone: 'pink',
    path: 'M4 12h16M12 4v16',
  },
  {
    title: '镜像与备份',
    desc: 'CloudInit 注入、镜像上传、实例备份与恢复、数据盘与 ISO 管理。',
    href: '/features/storage',
    tone: 'blue',
    path: 'M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6',
  },
  {
    title: '多用户与配额',
    desc: '用户、配额、实例归属与共享，按宿主与规格下发资源。',
    href: '/features/users',
    tone: 'cyan',
    path: 'M16 20v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  },
  {
    title: '财务系统对接',
    desc: '提供 IDCSmart、SwapIDC、Easypanel、VistaPanel 插件，按接口回填地址与 Token。',
    href: '/features/finance',
    tone: 'violet',
    path: 'M4 18V8m5 10V5m5 13v-7m5 7V9',
  },
  {
    title: '管理工具链',
    desc: 'opidcs 命令行 + 桌面客户端，批量运维与多主控切换。',
    href: '/tools/',
    tone: 'pink',
    path: 'M4 5h16v14H4zM8 9l2 3-2 3M13 15h4',
  },
]
</script>

<template>
  <div class="bento">
    <a
      v-for="item in items"
      :key="item.title"
      class="bento__card"
      :class="[`bento__card--${item.tone}`, { 'bento__card--wide': item.span }]"
      :href="withBase(item.href)"
    >
      <span class="bento__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
          <path :d="item.path" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
      <span class="bento__more">查看详情 →</span>
    </a>
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.bento__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
  box-shadow: var(--oidc-shadow-sm);
  color: inherit;
  text-decoration: none !important;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.bento__card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--oidc-grad);
  opacity: 0;
  transition: opacity 0.22s ease;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.bento__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--oidc-shadow);
}

.bento__card:hover::after {
  opacity: 1;
}

.bento__card--wide {
  grid-column: span 2;
}

.bento__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.bento__card--cyan .bento__icon {
  color: #0e9bbd;
  background: rgba(56, 199, 238, 0.14);
}

.bento__card--violet .bento__icon {
  color: #7c5cf0;
  background: rgba(167, 139, 250, 0.16);
}

.bento__card--pink .bento__icon {
  color: #d4567d;
  background: rgba(255, 143, 177, 0.18);
}

.bento__card h3 {
  margin: 0;
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
}

.bento__card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13.8px;
  line-height: 1.72;
}

.bento__more {
  margin-top: auto;
  padding-top: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.bento__card:hover .bento__more {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 960px) {
  .bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bento__card--wide {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .bento {
    grid-template-columns: minmax(0, 1fr);
  }

  .bento__card--wide {
    grid-column: span 1;
  }
}
</style>
