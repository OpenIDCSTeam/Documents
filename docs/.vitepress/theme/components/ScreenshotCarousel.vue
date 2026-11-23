<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

type ThemeShot = {
  src: string
  name: string
  palette: string
}

type Shot = {
  src?: string
  themes?: ThemeShot[]
  alt?: string
  tab: string
  kicker: string
  title: string
  desc: string
}

const shots: Shot[] = [
  {
    src: '/imgs/hosts-list.png',
    alt: '主机管理列表：Docker、LXD、Proxmox VE、ESXi、Hyper-V、KVM 等十种平台同屏',
    tab: '主机列表',
    kicker: 'Hosts · List',
    title: '支持十余平台',
    desc: '支持Docker、LXD、Proxmox VE、ESXi、Hyper-V、KVM、VirtualBox、Workstation、SmolVM、MEmu ',
  },
  {
    src: '/imgs/hosts-cards.png',
    alt: '主机管理卡片：Proxmox VE 与 Hyper-V 主机的资源卡片',
    tab: '主机卡片',
    kicker: 'Hosts · Cards',
    title: '资源卡片视图',
    desc: 'Proxmox VE 与 Hyper-V 主机并排展示核数、内存、磁盘、网络吞吐与显卡占用，不必再登录各平台面板维护',
  },
  {
    src: '/imgs/vms-cards.png',
    alt: '实例管理卡片：跨主机实例的 CPU、内存、硬盘、流量与端口信息',
    tab: '实例卡片',
    kicker: 'Instances',
    title: '实例管理卡片',
    desc: 'PVE、Docker、LXD 等宿主机上的实例进入统一实例列表，查看 CPU、内存、硬盘、流量、NAT 端口与内网地址。',
  },
  {
    src: '/imgs/vm-console-vnc.png',
    alt: '浏览器内的 noVNC 控制台：Windows 实例登录界面',
    tab: 'VM控制台',
    kicker: 'Console',
    title: '浏览器控制台',
    desc: '不用装客户端，点开实例即可通过 noVNC 拿到画面和键鼠，装系统、改密码、处理蓝屏都在同一个标签页完成。',
  },
  {
    src: '/imgs/nat-list.png',
    alt: '端口转发管理：跨主机、跨实例的 NAT 映射规则列表',
    tab: '端口转发',
    kicker: 'Network',
    title: '端口映射管理',
    desc: '外网 IP、外网端口、内网 IP、内网端口与备注一眼看清，RDP、HTTP、SSH 等规则按主机和实例筛选。',
  },
  {
    src: '/imgs/dashboard.png',
    alt: '系统概览：主机数量、实例数量、用户数量与主机运行状态',
    tab: '系统概览',
    kicker: 'Overview',
    title: '集群状态监视',
    desc: '从主机、实例、用户数量到 NAT 端口、Web 代理与系统状态，集群整体运行情况集中在概览页。',
  },
  {
    tab: '主题模板',
    kicker: 'Appearance',
    title: '六套主题，随时换',
    desc: '顶部右侧「外观设置」里切换，明暗、圆角、字体跟着变，偏好自动保存。',
    themes: [
      { src: '/imgs/theme/minimal.png', name: '简约纯白', palette: '明净留白 · 克制蓝' },
      { src: '/imgs/theme/tech.png', name: '科技大气', palette: '深海蓝 · 电子青' },
      { src: '/imgs/theme/techLite.png', name: '科技简约', palette: '浅蓝底 · 精密线' },
      { src: '/imgs/theme/gold.png', name: '黑金质感', palette: '墨黑 · 琥珀金' },
      { src: '/imgs/theme/cute.png', name: '清爽可爱', palette: '薄荷绿 · 圆润' },
      { src: '/imgs/theme/glass.png', name: '透明炫酷', palette: '紫雾 · 磨砂层' },
    ],
  },
]

const index = ref(0)
const current = computed(() => shots[index.value])

let timer: number | undefined
let reduceMotion = false

function stopTimer() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

function startTimer() {
  stopTimer()
  if (reduceMotion || document.hidden) return
  timer = window.setInterval(() => {
    index.value = (index.value + 1) % shots.length
  }, 6500)
}

function pause() {
  stopTimer()
}

function resume() {
  startTimer()
}

function go(step: number) {
  index.value = (index.value + step + shots.length) % shots.length
}

function select(i: number) {
  index.value = i
}

let touchX = 0

function onTouchStart(e: TouchEvent) {
  touchX = e.changedTouches[0].clientX
  pause()
}

function onTouchEnd(e: TouchEvent) {
  const delta = e.changedTouches[0].clientX - touchX
  if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1)
  resume()
}

function onVisibilityChange() {
  if (document.hidden) pause()
  else resume()
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  startTimer()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopTimer()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div
    class="shots"
    role="region"
    aria-roledescription="carousel"
    aria-label="QuickIDC 界面截图"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
    @keydown.left.prevent="go(-1)"
    @keydown.right.prevent="go(1)"
  >
    <div class="shots__stage" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <div class="shots__track" :style="{ '--i': index }">
        <figure
          v-for="(shot, i) in shots"
          :key="shot.tab"
          class="shots__slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} / ${shots.length} · ${shot.tab}`"
          :aria-hidden="i !== index"
        >
          <div v-if="shot.themes" class="shots__themes">
            <a
              v-for="theme in shot.themes"
              :key="theme.src"
              class="shots__theme"
              :href="withBase(theme.src)"
              target="_blank"
              rel="noopener"
              :tabindex="i === index ? 0 : -1"
              :title="`${theme.name} · ${theme.palette}`"
            >
              <img :src="withBase(theme.src)" :alt="`${theme.name}主题的系统概览`" loading="lazy" decoding="async">
              <span class="shots__theme-meta">
                <strong>{{ theme.name }}</strong>
                <small>{{ theme.palette }}</small>
              </span>
            </a>
          </div>
          <img
            v-else
            :src="withBase(shot.src || '')"
            :alt="shot.alt"
            :loading="i === 0 ? 'eager' : 'lazy'"
            decoding="async"
          >
        </figure>
      </div>

      <button class="shots__nav shots__nav--prev" type="button" aria-label="上一张" @click="go(-1)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>
      <button class="shots__nav shots__nav--next" type="button" aria-label="下一张" @click="go(1)">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>

      <span class="shots__count">{{ index + 1 }} / {{ shots.length }}</span>
    </div>

    <div class="shots__bar">
      <div class="shots__caption">
        <span class="shots__kicker">{{ current.kicker }}</span>
        <strong>{{ current.title }}</strong>
        <p>{{ current.desc }}</p>
      </div>

      <div class="shots__tabs" role="tablist" aria-label="选择截图">
        <button
          v-for="(shot, i) in shots"
          :key="shot.tab"
          class="shots__tab"
          :class="{ 'is-active': i === index }"
          type="button"
          role="tab"
          :aria-selected="i === index"
          @click="select(i)"
        >
          {{ shot.tab }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shots {
  margin: 24px 0 28px;
  padding: 10px 10px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--oidc-radius);
  background: var(--vp-c-bg-soft);
  box-shadow: var(--oidc-shadow-sm);
}

.shots__stage {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--oidc-radius) - 8px);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  aspect-ratio: 2 / 1;
  touch-action: pan-y;
}

.shots__track {
  display: flex;
  height: 100%;
  transform: translateX(calc(var(--i, 0) * -100%));
  transition: transform 0.55s cubic-bezier(0.4, 0.1, 0.2, 1);
}

.shots__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 100%;
  height: 100%;
  margin: 0;
  padding: 8px;
}

.shots__slide img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: calc(var(--oidc-radius) - 12px);
  object-fit: contain;
}

.shots__themes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px 12px;
  width: 100%;
  height: 100%;
  padding: 0 40px 26px;
  align-content: center;
}

.shots__theme {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  text-decoration: none !important;
  color: inherit;
}

.shots__theme img {
  display: block;
  width: 100%;
  max-width: none;
  max-height: none;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: top center;
  border: 1px solid var(--vp-c-divider);
  border-radius: calc(var(--oidc-radius) - 12px);
  background: var(--vp-c-bg);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.shots__theme:hover img {
  transform: translateY(-2px);
  border-color: rgba(47, 107, 255, 0.4);
  box-shadow: var(--oidc-shadow-sm);
}

.shots__theme-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.shots__theme-meta strong {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.shots__theme-meta small {
  min-width: 0;
  font-size: 11px;
  color: var(--vp-c-text-3);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.shots__nav {
  position: absolute;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transform: translateY(-50%);
  backdrop-filter: blur(6px);
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.shots__nav:hover,
.shots__nav:focus-visible {
  color: var(--vp-c-brand-1);
  border-color: rgba(47, 107, 255, 0.45);
  box-shadow: var(--oidc-shadow-sm);
  outline: none;
}

.shots__nav svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shots__nav--prev {
  left: 16px;
}

.shots__nav--next {
  right: 16px;
}

.shots__count {
  position: absolute;
  right: 14px;
  bottom: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 84%, transparent);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 1.6;
  backdrop-filter: blur(6px);
}

.shots__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px 24px;
  padding: 14px 8px 12px;
}

.shots__caption {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1 1 320px;
}

.shots__kicker {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.shots__caption strong {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.shots__caption p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.shots__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 0 1 auto;
}

.shots__tab {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.6;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.shots__tab:hover {
  color: var(--vp-c-brand-1);
  border-color: rgba(47, 107, 255, 0.4);
}

.shots__tab.is-active {
  color: var(--vp-c-brand-1);
  border-color: rgba(47, 107, 255, 0.45);
  background: var(--vp-c-brand-soft);
  font-weight: 600;
}

.shots__tab:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

@media (max-width: 640px) {
  .shots__stage {
    aspect-ratio: 16 / 10;
  }

  .shots__slide {
    padding: 4px;
  }

  .shots__nav {
    width: 32px;
    height: 32px;
  }

  .shots__nav--prev {
    left: 8px;
  }

  .shots__nav--next {
    right: 8px;
  }

  .shots__tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 100%;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .shots__tabs::-webkit-scrollbar {
    display: none;
  }

  .shots__slide {
    align-items: flex-start;
    overflow-y: auto;
  }

  .shots__themes {
    display: flex;
    gap: 10px;
    padding: 8px;
    height: auto;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .shots__themes::-webkit-scrollbar {
    display: none;
  }

  .shots__theme {
    flex: 0 0 62%;
    scroll-snap-align: center;
  }

  .shots__theme-meta small {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shots__track {
    transition: none;
  }
}
</style>
