<script setup lang="ts">
import { withBase } from 'vitepress'

type Platform = {
  name: string
  mark: string
  href: string
  status: '已支持' | '仅 Windows' | '实验中' | '未启用'
  os: string
}

const platforms: Platform[] = [
  { name: 'Docker / Podman', mark: 'DK', href: '/deploy/platform/docker', status: '已支持', os: 'Linux / Win' },
  { name: 'LXC / LXD', mark: 'LX', href: '/deploy/platform/lxd', status: '已支持', os: 'Linux' },
  { name: 'Proxmox VE', mark: 'PVE', href: '/deploy/platform/proxmox', status: '已支持', os: 'Linux' },
  { name: 'VMware ESXi', mark: 'ESX', href: '/deploy/platform/esxi', status: '已支持', os: '独立宿主' },
  { name: 'Hyper-V', mark: 'HV', href: '/deploy/platform/hyperv', status: '仅 Windows', os: 'Windows' },
  { name: 'QEMU / KVM', mark: 'QEMU', href: '/deploy/platform/qemu', status: '已支持', os: 'Linux' },
  { name: 'VirtualBox', mark: 'VB', href: '/deploy/platform/virtualbox', status: '已支持', os: '通用' },
  { name: 'SmolVM', mark: 'SVM', href: '/deploy/platform/smolvm', status: '实验中', os: 'macOS / Linux' },
  { name: 'VMware Workstation', mark: 'WS', href: '/deploy/platform/vmware', status: '已支持', os: 'Win / Linux' },
  { name: 'MuMu 模拟器', mark: 'MUMU', href: '/deploy/platform/memu', status: '仅 Windows', os: 'Windows' },
  { name: '青州云', mark: 'QZ', href: '/deploy/platform/qingzhou', status: '未启用', os: '—' },
]
</script>

<template>
  <div class="wall">
    <div class="wall__track">
      <a
        v-for="p in [...platforms, ...platforms]"
        :key="`${p.mark}-${p.name}`"
        class="wall__item"
        :href="withBase(p.href)"
        :title="`${p.name} · ${p.status}`"
      >
        <span class="wall__mark">{{ p.mark }}</span>
        <span class="wall__meta">
          <strong>{{ p.name }}</strong>
          <small>{{ p.os }} · {{ p.status }}</small>
        </span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.wall {
  position: relative;
  overflow: hidden;
  padding: 8px 0;
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}

.wall__track {
  display: flex;
  gap: 14px;
  width: max-content;
  animation: marquee 42s linear infinite;
}

.wall:hover .wall__track {
  animation-play-state: paused;
}

.wall__item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 218px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  text-decoration: none !important;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.wall__item:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(47, 107, 255, 0.4);
  box-shadow: var(--oidc-shadow);
}

.wall__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--vp-c-brand-1);
  background: var(--oidc-grad-soft);
  border: 1px solid var(--vp-c-divider);
}

.wall__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wall__meta strong {
  font-size: 13.5px;
  font-weight: 600;
}

.wall__meta small {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wall__track {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
}
</style>
