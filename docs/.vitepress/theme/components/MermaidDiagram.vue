<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type mermaidNs from 'mermaid'

const props = defineProps<{ code: string }>()

const source = decodeURIComponent(props.code)
const canvas = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const error = ref('')

let api: typeof mermaidNs | null = null
let observer: MutationObserver | null = null
let uid = ''
let renderCount = 0
let dark = false
let rendering = false
let pending = false

async function getMermaid() {
  if (!api) {
    const mod = await import('mermaid')
    api = mod.default
  }
  return api
}

async function draw() {
  if (!canvas.value) return
  if (rendering) {
    pending = true
    return
  }
  rendering = true
  loading.value = true
  error.value = ''

  try {
    const mermaid = await getMermaid()
    // 等 Web 字体就绪后再测量文字宽度，否则节点会被裁切
    await document.fonts?.ready
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: dark ? 'dark' : 'default',
      fontFamily: getComputedStyle(document.body).fontFamily || 'sans-serif',
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
      gantt: { useMaxWidth: true },
    })

    renderCount += 1
    const id = `oidc-mermaid-${uid}-${renderCount}`
    const { svg } = await mermaid.render(id, source)
    if (canvas.value) canvas.value.innerHTML = svg
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
    rendering = false
    if (pending) {
      pending = false
      void draw()
    }
  }
}

onMounted(() => {
  uid = Math.random().toString(36).slice(2, 9)
  dark = document.documentElement.classList.contains('dark')
  void draw()

  observer = new MutationObserver(() => {
    const next = document.documentElement.classList.contains('dark')
    if (next === dark) return
    dark = next
    void draw()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="oidc-mermaid">
    <div v-if="error" class="oidc-mermaid__error">
      <p>图表渲染失败：{{ error }}</p>
      <pre><code>{{ source }}</code></pre>
    </div>
    <div v-show="!error" ref="canvas" class="oidc-mermaid__canvas"></div>
    <p v-if="loading && !error" class="oidc-mermaid__loading">图表渲染中…</p>
  </div>
</template>
