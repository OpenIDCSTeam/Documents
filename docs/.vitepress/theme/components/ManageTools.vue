<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import TerminalDemo from './TerminalDemo.vue'

type Key = 'cli' | 'gui' | 'web'

type Tool = {
  key: Key
  label: string
  hint: string
  title: string
  desc: string
  points: string[]
  href: string
  link: string
}

const tools: Tool[] = [
  {
    key: 'cli',
    label: '命令行',
    hint: 'quickidc',
    title: 'quickidc 命令行',
    desc: '一条命令装好，主控、平台、主机、实例、端口、反代、用户、任务、日志都能管；需要接脚本时切 JSON 输出。',
    points: ['--core 切换多主控，--output 选 table / json / yaml', '交互式菜单，不记参数也能走完常用操作', '和桌面客户端调同一套接口，行为一致'],
    href: '/tools/cli',
    link: '命令行手册',
  },
  {
    key: 'gui',
    label: '客户端',
    hint: 'Desktop',
    title: 'quickidc 桌面客户端',
    desc: 'Tauri 打包，Windows、Linux、macOS 都有安装包。多个主控存本地，点一下就切；主机、实例、任务、日志在一个窗口里完成。',
    points: ['多主控保存与快速切换，离线状态有提示', '本地凭据文件权限 0600，不写日志', '安装服务、装运行时这类本机操作交给随包的 quickidc'],
    href: '/tools/gui',
    link: '客户端说明',
  },
  {
    key: 'web',
    label: 'Web 页面',
    hint: 'Console',
    title: '浏览器控制台',
    desc: '主控装好就能用，不用再装东西。管理员看主机、实例、端口、反代、用户、任务、日志，普通用户只看自己的实例。',
    points: ['实例详情带资源曲线和截图', 'noVNC 直接在浏览器里开控制台', '六套界面主题，明暗与字体都能换'],
    href: '/usage/dashboard',
    link: '控制台教程',
  },
]

const active = ref<Key>('cli')
const current = computed(() => tools.find((t) => t.key === active.value) ?? tools[0])
</script>

<template>
  <div class="tools">
    <div class="tools__tabs" role="tablist" aria-label="管理方式">
      <button
        v-for="tool in tools"
        :key="tool.key"
        class="tools__tab"
        :class="{ 'is-active': tool.key === active }"
        type="button"
        role="tab"
        :aria-selected="tool.key === active"
        @click="active = tool.key"
      >
        <span class="tools__tab-label">{{ tool.label }}</span>
        <span class="tools__tab-hint">{{ tool.hint }}</span>
      </button>
    </div>

    <div class="tools__panel">
      <div class="tools__media" :class="`tools__media--${active}`">
        <TerminalDemo v-if="active === 'cli'" />
        <div v-else class="tools__window">
          <div class="tools__window-bar">
            <span class="tools__dot" style="background: #ff5f57"></span>
            <span class="tools__dot" style="background: #febc2e"></span>
            <span class="tools__dot" style="background: #28c840"></span>
            <span class="tools__window-title">{{ active === 'gui' ? 'quickidc — 桌面客户端' : '快简云 — 浏览器' }}</span>
          </div>
          <img
            :src="withBase(active === 'gui' ? '/imgs/tools/gui.png' : '/imgs/theme/minimal.png')"
            :alt="active === 'gui' ? 'quickidc 桌面客户端概览页' : '浏览器控制台系统概览页'"
            loading="lazy"
            decoding="async"
          >
        </div>
      </div>

      <div class="tools__info">
        <h3>{{ current.title }}</h3>
        <p>{{ current.desc }}</p>
        <ul>
          <li v-for="point in current.points" :key="point">{{ point }}</li>
        </ul>
        <a class="tools__link" :href="withBase(current.href)">{{ current.link }} →</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tools {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tools__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tools__tab {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.tools__tab-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.tools__tab:hover {
  color: var(--vp-c-brand-1);
  border-color: rgba(47, 107, 255, 0.4);
}

.tools__tab.is-active {
  color: var(--vp-c-brand-1);
  border-color: rgba(47, 107, 255, 0.45);
  background: var(--vp-c-brand-soft);
}

.tools__tab.is-active .tools__tab-hint {
  color: var(--vp-c-brand-1);
  opacity: 0.7;
}

.tools__tab:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.tools__panel {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.tools__media {
  min-width: 0;
}

.tools__window {
  border: 1px solid rgba(147, 165, 191, 0.22);
  border-radius: 14px;
  background: #0d1522;
  overflow: hidden;
  box-shadow: var(--oidc-shadow);
}

.tools__window-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #111b2b;
  border-bottom: 1px solid rgba(147, 165, 191, 0.16);
}

.tools__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.tools__window-title {
  margin-left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #93a5bf;
}

.tools__window img {
  display: block;
  width: 100%;
  height: auto;
}

.tools__info h3 {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 600;
}

.tools__info p {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 13.8px;
  line-height: 1.75;
}

.tools__info ul {
  margin: 0 0 14px;
  padding-left: 18px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.9;
}

.tools__link {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.tools__link:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .tools__panel {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
}
</style>
