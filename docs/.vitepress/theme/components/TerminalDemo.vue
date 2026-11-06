<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Line = { text: string; cls?: 'ok' | 'muted' }

const lines: Line[] = [
  { text: '$ curl -fsSL https://raw.githubusercontent.com/OpenIDCSTeam/CloudHost/main/install.sh | sudo bash', cls: 'muted' },
  { text: '✔ 已安装 CloudHost 到 /opt/openidcs' },
  { text: '✔ systemd 服务 openidcs 已启动（端口 1881）' },
  { text: '  Bearer Token: 6f1c…a92d', cls: 'ok' },
  { text: '' },
  { text: '$ opidcs host list' },
  { text: 'ID  名称        类型        地址              状态' },
  { text: '0   pve-lab     ProxmoxVE   10.0.0.21:8006    在线' },
  { text: '1   lxd-edge    LXD         10.0.0.32:8443    在线' },
  { text: '2   win-hv      HyperV      10.0.0.44:5985    维护中', cls: 'muted' },
  { text: '' },
  { text: '$ opidcs vbox list --core 0' },
  { text: '✔ 已从主控 0 拉取 12 台实例（运行 9 · 停止 3）' },
]

const shown = ref<string[]>([])
const typing = ref('')
const done = ref(false)
const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lineIdx = 0
let charIdx = 0
let timer: number | undefined

function step() {
  if (lineIdx >= lines.length) {
    done.value = true
    return
  }
  const line = lines[lineIdx]
  if (charIdx < line.text.length) {
    typing.value += line.text[charIdx]
    charIdx += 1
    timer = window.setTimeout(step, line.cls === 'muted' ? 6 : 16)
    return
  }
  shown.value.push(typing.value)
  typing.value = ''
  charIdx = 0
  lineIdx += 1
  timer = window.setTimeout(step, 180)
}

function start() {
  window.clearTimeout(timer)
  shown.value = []
  typing.value = ''
  done.value = false
  lineIdx = 0
  charIdx = 0
  if (reduce) {
    shown.value = lines.map((l) => l.text)
    done.value = true
    return
  }
  step()
}

onMounted(start)
onUnmounted(() => window.clearTimeout(timer))
</script>

<template>
  <div class="oidc-terminal">
    <div class="oidc-terminal__bar">
      <span class="oidc-terminal__dot" style="background: #ff5f57"></span>
      <span class="oidc-terminal__dot" style="background: #febc2e"></span>
      <span class="oidc-terminal__dot" style="background: #28c840"></span>
      <span class="oidc-terminal__title">opidcs — zsh</span>
      <button class="term__replay" type="button" @click="start">重新播放</button>
    </div>
    <pre><code><span v-for="(l, i) in shown" :key="i" :class="lines[i]?.cls">{{ l }}
</span><span v-if="!done">{{ typing }}<span class="term__caret">▍</span></span></code></pre>
  </div>
</template>

<style scoped>
.term__replay {
  margin-left: auto;
  border: 1px solid rgba(147, 165, 191, 0.25);
  background: transparent;
  color: #93a5bf;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.term__replay:hover {
  color: #eaf2ff;
  border-color: rgba(56, 199, 238, 0.5);
}

.term__caret {
  color: #38c7ee;
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
