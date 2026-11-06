<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'

const root = ref<HTMLElement | null>(null)
const active = ref(0)
let observer: IntersectionObserver | null = null
let timers: number[] = []

const steps = [
  {
    n: '01',
    title: '安装主控',
    desc: '一条 curl 命令拉起 CloudHost，默认 1881 端口，systemd / 服务自启。',
    href: '/deploy/core-install',
    cmd: 'curl -fsSL .../install.sh | sudo bash',
  },
  {
    n: '02',
    title: '接入平台',
    desc: '在宿主机装 Docker / LXD / QEMU 等运行时，用主机管理填入连接参数。',
    href: '/deploy/platform/',
    cmd: 'opidcs plat install docker',
  },
  {
    n: '03',
    title: '配置网络',
    desc: '爱快做 DHCP 与端口映射，主控侧配 NAT 规则与 Caddy 反向代理。',
    href: '/deploy/network',
    cmd: 'opidcs port list',
  },
  {
    n: '04',
    title: '对接财务',
    desc: '选择 IDCSmart / SwapIDC 插件，回填主控地址与 Token。',
    href: '/deploy/finance/',
    cmd: 'opidcs conf token show',
  },
]

onMounted(() => {
  if (!root.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        steps.forEach((_, i) => {
          timers.push(window.setTimeout(() => (active.value = i + 1), 260 * i))
        })
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
  timers.forEach((t) => window.clearTimeout(t))
})
</script>

<template>
  <div ref="root" class="flow" :style="{ '--active': active }">
    <div class="flow__line" aria-hidden="true"></div>
    <a
      v-for="(s, i) in steps"
      :key="s.n"
      class="flow__step"
      :class="{ 'is-on': i < active }"
      :href="withBase(s.href)"
    >
      <span class="flow__badge">{{ s.n }}</span>
      <h3>{{ s.title }}</h3>
      <p>{{ s.desc }}</p>
      <code>{{ s.cmd }}</code>
    </a>
  </div>
</template>

<style scoped>
.flow {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  padding: 8px 0 4px;
}

.flow__line {
  position: absolute;
  left: 6%;
  right: 6%;
  top: 30px;
  height: 2px;
  background: linear-gradient(90deg, rgba(47, 107, 255, 0.15), rgba(56, 199, 238, 0.15));
  overflow: hidden;
}

.flow__line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--oidc-grad);
  transform: scaleX(calc(var(--active) / 4));
  transform-origin: left;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.flow__step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 20px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  text-decoration: none !important;
  color: inherit;
  opacity: 0.55;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.flow__step.is-on {
  opacity: 1;
  transform: translateY(0);
  border-color: rgba(47, 107, 255, 0.35);
  box-shadow: var(--oidc-shadow-sm);
}

.flow__step:hover {
  box-shadow: var(--oidc-shadow);
  transform: translateY(-3px);
}

.flow__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: var(--oidc-grad);
  box-shadow: 0 10px 26px -12px rgba(47, 107, 255, 0.8);
}

.flow__step h3 {
  margin: 2px 0 0;
  font-size: 16px;
  font-weight: 600;
}

.flow__step p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.7;
}

.flow__step code {
  margin-top: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--vp-code-block-bg);
  color: #8fd3ff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 960px) {
  .flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .flow__line {
    display: none;
  }

  .flow__step {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 640px) {
  .flow {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
