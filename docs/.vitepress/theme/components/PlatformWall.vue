<script setup lang="ts">
import { withBase } from 'vitepress'

type Platform = {
  name: string
  mark: string
  icon?: string
  wide?: boolean
  href: string
  status: '已支持' | '仅 Windows' | '实验中'
  os: string
}

const platforms: Platform[] = [
  { name: 'Docker / Podman', mark: 'DK', icon: '/imgs/platforms/docker.svg', href: '/deploy/platform/docker', status: '已支持', os: 'Linux / Win' },
  { name: 'LXC / LXD', mark: 'LX', icon: '/imgs/platforms/lxd.svg', href: '/deploy/platform/lxd', status: '已支持', os: 'Linux' },
  { name: 'Proxmox VE', mark: 'PVE', icon: '/imgs/platforms/proxmox.svg', href: '/deploy/platform/proxmox', status: '已支持', os: 'Linux' },
  { name: 'VMware ESXi', mark: 'ESX', icon: '/imgs/platforms/vmware.svg', wide: true, href: '/deploy/platform/esxi', status: '已支持', os: '独立宿主' },
  { name: 'Hyper-V', mark: 'HV', icon: '/imgs/platforms/hyperv.svg', href: '/deploy/platform/hyperv', status: '仅 Windows', os: 'Windows' },
  { name: 'QEMU / KVM', mark: 'QEMU', icon: '/imgs/platforms/qemu.svg', href: '/deploy/platform/qemu', status: '已支持', os: 'Linux' },
  { name: 'VirtualBox', mark: 'VB', icon: '/imgs/platforms/virtualbox.svg', href: '/deploy/platform/virtualbox', status: '已支持', os: '通用' },
  { name: 'SmolVM', mark: 'SVM', href: '/deploy/platform/smolvm', status: '实验中', os: 'macOS / Linux' },
  { name: 'VMware Workstation', mark: 'WS', icon: '/imgs/platforms/vmware.svg', wide: true, href: '/deploy/platform/vmware', status: '已支持', os: 'Win / Linux' },
  { name: 'MEmu 模拟器', mark: 'MEMU', icon: '/imgs/platforms/memu.svg', href: '/deploy/platform/memu', status: '仅 Windows', os: 'Windows' },
]
</script>

<template>
  <div class="wall">
    <a
      v-for="p in platforms"
      :key="p.name"
      class="wall__item"
      :href="withBase(p.href)"
      :title="`${p.name} · ${p.status}`"
    >
      <span class="wall__mark" :class="{ 'wall__mark--wide': p.wide }">
        <img v-if="p.icon" :src="withBase(p.icon)" alt="" width="24" height="24" loading="lazy" decoding="async">
        <template v-else>{{ p.mark }}</template>
      </span>
      <span class="wall__meta">
        <strong>{{ p.name }}</strong>
        <small>{{ p.os }} · {{ p.status }}</small>
      </span>
    </a>
  </div>
</template>

<style scoped>
.wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
  padding: 8px 0;
}

.wall__item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  text-decoration: none !important;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.wall__item:hover {
  transform: translateY(-3px);
  border-color: rgba(47, 107, 255, 0.4);
  box-shadow: var(--oidc-shadow);
}

.wall__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--vp-c-brand-1);
  background: #fff;
  border: 1px solid rgba(15, 27, 45, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.wall__mark img {
  display: block;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.wall__mark--wide img {
  width: 34px;
  height: 34px;
}

.wall__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wall__meta strong {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
}

.wall__meta small {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .wall {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
