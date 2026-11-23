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
    desc: 'Docker、LXD、Proxmox VE、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM、MEmu 十种服务器类型接入同一套主机与实例模型。字段、页签和操作限制由引擎元信息下发，平台能力变了只改配置，前端不用跟着发版。',
    href: '/features/platforms',
    tone: 'blue',
    span: true,
    path: 'M4 7h16M4 12h16M4 17h10',
  },
  {
    title: '实例全生命周期',
    desc: '创建、开机、关机、重启、重装、暂停、删除都有对应接口，耗时操作统一进异步任务，进度可查、失败可重试。删除会写墓碑记录，对账任务兜底，平台侧不留残留。',
    href: '/features/lifecycle',
    tone: 'cyan',
    path: 'M12 3v6m0 6v6M3 12h6m6 0h6',
  },
  {
    title: '浏览器控制台',
    desc: 'noVNC 和 Web SSH 都内置在主控里，不用装客户端；Windows 实例给 RDP 地址，安卓云手机走 ADB。连接用一次性 token，并绑定来源 IP。',
    href: '/features/console',
    tone: 'violet',
    path: 'M3 5h18v14H3zM7 10l3 2-3 2',
  },
  {
    title: 'NAT 与反向代理',
    desc: '端口转发按实例建规则，支持批量下发与回收；反向代理由主控托管 Caddy，域名指向实例端口，证书自动申请续期。接了爱快还能做 DHCP 静态绑定和 ARP 绑定。',
    href: '/features/network',
    tone: 'pink',
    path: 'M4 12h16M12 4v16',
  },
  {
    title: '镜像与备份',
    desc: '镜像上传带进度，CloudInit 注入用户名、密码和 SSH 公钥；数据盘可挂载、卸载、移交给别的实例。备份按平台能力做创建、恢复、删除，不抽象快照链。',
    href: '/features/storage',
    tone: 'blue',
    path: 'M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6',
  },
  {
    title: '用户、配额与共享',
    desc: '管理员和普通用户两级身份，配额按 CPU、内存、磁盘、实例数和流量累计，创建实例时校验。实例归属可转移，共享者按只读、控制台、管理三档授权，访问密钥可随时吊销。',
    href: '/features/users',
    tone: 'cyan',
    path: 'M16 20v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  },
  {
    title: '任务与调度',
    desc: '工作池默认 4 个 worker，同一实例的写操作串行执行，避免并发改坏配置。后台定时跑主机同步、孤立资源清理、配额重算和外部资源对账。',
    href: '/features/tasks',
    tone: 'violet',
    path: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  },
  {
    title: '监控与日志',
    desc: '概览看主机 CPU、内存、磁盘占用和实例运行状态，详情页有资源曲线；日志同时写文件和数据库，控制台里按级别、关键字和时间范围检索。',
    href: '/features/monitoring',
    tone: 'blue',
    path: 'M3 17l5-6 4 3 5-7 4 4',
  },
  {
    title: '多数据库支持',
    desc: '默认 SQLite，零依赖开箱即用；实例量大或运维规范要求时可切 MySQL 8.0.13+ 或 PostgreSQL 13+，方言差异由主控处理，换库只改 data.yaml。',
    href: '/features/database',
    tone: 'pink',
    path: 'M12 3l9 5-9 5-9-5 9-5M3 12l9 5 9-5M3 16l9 5 9-5',
  },
  {
    title: '财务系统对接',
    desc: '魔方财务、SwapIDC、小黑云三个快简云插件，开通、续费、暂停、删除和控制台跳转都走 REST API，插件里只需填主控地址、Token 和主机标识。',
    href: '/features/finance',
    tone: 'cyan',
    path: 'M4 18V8m5 10V5m5 13v-7m5 7V9',
  },
  {
    title: '管理工具链',
    desc: 'quickidc 命令行管主机、实例、任务和令牌，适合批量运维；Tauri 桌面客户端支持多主控切换，不用开浏览器。',
    href: '/tools/',
    tone: 'violet',
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
