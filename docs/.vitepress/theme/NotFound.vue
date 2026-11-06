<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import redirects from '../legacy-redirects.json'

const target = ref('')
const attempted = ref('')

onMounted(() => {
  const map = redirects as Record<string, string>
  const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '')
  const normalized = path.endsWith('/') ? path : `${path}/`
  const hit = map[path] || map[normalized] || map[path.replace(/\/$/, '')]
  if (hit) {
    target.value = withBase(hit)
    window.location.replace(target.value)
    return
  }
  attempted.value = window.location.pathname
})
</script>

<template>
  <div class="oidc-404">
    <div class="oidc-404__glow" aria-hidden="true"></div>
    <p class="oidc-404__code">404</p>
    <h1>这页可能搬家了</h1>
    <p class="oidc-404__desc">
      文档站已按「项目简介 / 功能特性 / 部署教程 / 管理工具 / 功能教程 / 项目结构 / 开发指南 / 常见问题 / 关于」重组。
    </p>
    <p v-if="target" class="oidc-404__hint">正在跳转到 <code>{{ target }}</code> …</p>
    <p v-else class="oidc-404__hint">
      未找到 <code>{{ attempted || '该地址' }}</code> 的跳转规则，请从导航重新进入。
    </p>
    <div class="oidc-404__actions">
      <a class="oidc-btn oidc-btn--primary" :href="withBase('/')">返回首页</a>
      <a class="oidc-btn" :href="withBase('/deploy/')">部署教程</a>
      <a class="oidc-btn" :href="withBase('/usage/')">功能教程</a>
    </div>
  </div>
</template>

<style scoped>
.oidc-404 {
  position: relative;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 96px 24px;
  text-align: center;
  overflow: hidden;
}
.oidc-404__glow {
  position: absolute;
  inset: -20% -10%;
  background:
    radial-gradient(circle at 30% 30%, rgba(47, 107, 255, 0.18), transparent 55%),
    radial-gradient(circle at 70% 60%, rgba(255, 143, 177, 0.16), transparent 55%);
  filter: blur(10px);
  pointer-events: none;
}
.oidc-404__code {
  position: relative;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(72px, 14vw, 148px);
  font-weight: 700;
  line-height: 1;
  margin: 0;
  background: linear-gradient(120deg, #2f6bff, #38c7ee 45%, #a78bfa 80%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.oidc-404 h1 {
  position: relative;
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.02em;
}
.oidc-404__desc {
  position: relative;
  max-width: 560px;
  margin: 0;
  color: var(--vp-c-text-2);
}
.oidc-404__hint {
  position: relative;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.oidc-404__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
}
</style>
