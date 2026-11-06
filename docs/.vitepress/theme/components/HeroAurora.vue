<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'

const art = ref<HTMLElement | null>(null)
let raf = 0

function onMove(event: MouseEvent) {
  if (!art.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const rect = art.value!.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    art.value!.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`)
    art.value!.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`)
  })
}

function onLeave() {
  art.value?.style.setProperty('--tilt-x', '0deg')
  art.value?.style.setProperty('--tilt-y', '0deg')
}

onMounted(() => window.addEventListener('mousemove', onMove))
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(raf)
})

const nodes = [
  { label: 'Docker', tone: 'blue', pos: { left: '8%', top: '12%' } },
  { label: 'LXD', tone: 'cyan', pos: { right: '6%', top: '13%' } },
  { label: 'Proxmox', tone: 'violet', pos: { left: '2%', top: '48%' } },
  { label: 'ESXi', tone: 'pink', pos: { right: '2%', top: '50%' } },
  { label: 'Hyper-V', tone: 'blue', pos: { left: '14%', bottom: '10%' } },
  { label: 'QEMU', tone: 'cyan', pos: { right: '12%', bottom: '10%' } },
]
</script>

<template>
  <section class="oidc-hero">
    <div class="oidc-hero__copy">
      <p class="oidc-hero__eyebrow">
        <span class="dot"></span>
        OpenIDCS · 开源 IDC 管理平台
      </p>
      <h1>
        在一个控制台里<br />
        管理<span class="grad">虚拟化平台</span>
      </h1>
      <p class="oidc-hero__desc">
        Docker、LXD、Proxmox VE、ESXi、Hyper-V、QEMU、VirtualBox、SmolVM 都可以接入同一个 Go 主控。
        主机、实例、端口映射、反向代理、用户与财务对接共用一套数据。
      </p>
      <div class="oidc-hero__actions">
        <a class="oidc-btn oidc-btn--primary" :href="withBase('/deploy/quick-start')">
          快速体验
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a class="oidc-btn" :href="withBase('/deploy/core-install')">安装主控</a>
        <a class="oidc-btn" href="https://github.com/OpenIDCSTeam" target="_blank" rel="noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5Z" />
          </svg>
          GitHub
        </a>
      </div>
      <dl class="oidc-hero__stats">
        <div>
          <dt>10</dt>
          <dd>虚拟化平台</dd>
        </div>
        <div>
          <dt>1</dt>
          <dd>Go 单二进制</dd>
        </div>
        <div>
          <dt>5</dt>
          <dd>财务系统插件</dd>
        </div>
        <div>
          <dt>AGPL</dt>
          <dd>完全开源</dd>
        </div>
      </dl>
    </div>

    <div ref="art" class="oidc-hero__art" aria-hidden="true">
      <div class="orb orb--a"></div>
      <div class="orb orb--b"></div>
      <div class="oidc-hero__stage">
        <div class="grid"></div>
        <div class="core">
          <span class="core__ring"></span>
          <strong>OpenIDCS</strong>
          <small>CloudHost</small>
        </div>
        <div
          v-for="(n, i) in nodes"
          :key="n.label"
          class="node"
          :class="`node--${n.tone}`"
          :style="{ ...n.pos, '--i': i }"
        >
          <span class="node__dot"></span>
          {{ n.label }}
        </div>
        <svg class="links" viewBox="0 0 420 320" preserveAspectRatio="none">
          <path d="M210 160 L80 60" />
          <path d="M210 160 L340 62" />
          <path d="M210 160 L48 176" />
          <path d="M210 160 L372 178" />
          <path d="M210 160 L104 272" />
          <path d="M210 160 L318 272" />
        </svg>
      </div>
      <div class="oidc-hero__caption">
        <span class="pulse"></span>
        统一 API
      </div>
    </div>
  </section>
</template>

<style scoped>
.oidc-hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 84px 24px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 48px;
  align-items: center;
}

.oidc-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 78%, transparent);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  backdrop-filter: blur(10px);
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--oidc-green);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.oidc-hero h1 {
  margin: 0;
  font-size: clamp(34px, 4.4vw, 56px);
  line-height: 1.14;
  letter-spacing: -0.02em;
  font-weight: 800;
}

.grad {
  background: var(--oidc-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.oidc-hero__desc {
  margin: 18px 0 0;
  max-width: 560px;
  color: var(--vp-c-text-2);
  font-size: 15.5px;
  line-height: 1.85;
}

.oidc-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.oidc-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 38px 0 0;
  padding: 18px 20px;
  border-radius: var(--oidc-radius);
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 72%, transparent);
  backdrop-filter: blur(10px);
}

.oidc-hero__stats div {
  text-align: left;
}

.oidc-hero__stats dt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
}

.oidc-hero__stats dd {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.oidc-hero__art {
  position: relative;
  perspective: 900px;
  --tilt-x: 0deg;
  --tilt-y: 0deg;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(46px);
  opacity: 0.7;
}

.orb--a {
  inset: 6% auto auto 8%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(47, 107, 255, 0.5), transparent 70%);
}

.orb--b {
  inset: auto 4% 2% auto;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(255, 143, 177, 0.42), transparent 70%);
}

.oidc-hero__stage {
  position: relative;
  height: 420px;
  border-radius: 28px;
  border: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(circle at 50% 46%, rgba(47, 107, 255, 0.14), transparent 62%),
    color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  box-shadow: var(--oidc-shadow);
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transition: transform 0.24s ease;
  overflow: hidden;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(47, 107, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(47, 107, 255, 0.1) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at 50% 50%, #000 40%, transparent 78%);
}

.core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  justify-items: center;
  gap: 2px;
  width: 132px;
  padding: 18px 10px;
  border-radius: 20px;
  border: 1px solid rgba(47, 107, 255, 0.35);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: 0 20px 50px -24px rgba(47, 107, 255, 0.7);
  z-index: 2;
}

.core strong {
  font-size: 15px;
  letter-spacing: 0.02em;
}

.core small {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--vp-c-text-3);
}

.core__ring {
  position: absolute;
  inset: -10px;
  border-radius: 26px;
  border: 1px dashed rgba(47, 107, 255, 0.3);
  animation: spin 18s linear infinite;
}

.node {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--oidc-shadow-sm);
  animation: float 5.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
  z-index: 3;
}

.node__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--oidc-blue);
}

.node--cyan .node__dot { background: var(--oidc-cyan); }
.node--violet .node__dot { background: var(--oidc-violet); }
.node--pink .node__dot { background: var(--oidc-pink); }

.links {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.links path {
  fill: none;
  stroke: rgba(47, 107, 255, 0.28);
  stroke-width: 1;
  stroke-dasharray: 4 6;
  animation: dash 26s linear infinite;
}

.oidc-hero__caption {
  position: absolute;
  right: 14px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
}

.pulse {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--oidc-cyan);
  box-shadow: 0 0 0 0 rgba(56, 199, 238, 0.5);
  animation: pulse 2.4s ease-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes dash {
  to { stroke-dashoffset: -200; }
}

@keyframes pulse {
  70% { box-shadow: 0 0 0 10px rgba(56, 199, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56, 199, 238, 0); }
}

@media (max-width: 960px) {
  .oidc-hero {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 56px;
    gap: 32px;
  }

  .oidc-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .oidc-hero__stage {
    height: 360px;
  }
}

@media (max-width: 640px) {
  .oidc-hero {
    padding: 40px 16px 32px;
  }

  .oidc-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 14px 16px;
  }

  .oidc-hero__stage {
    height: 300px;
  }

  .node {
    font-size: 11px;
    padding: 5px 9px;
  }
}
</style>
