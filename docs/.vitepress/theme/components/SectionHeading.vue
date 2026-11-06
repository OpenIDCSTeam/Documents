<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  desc?: string
}>()
</script>

<template>
  <div class="oidc-heading">
    <p v-if="kicker" class="oidc-heading__kicker">{{ kicker }}</p>
    <h2 class="oidc-heading__title">{{ title }}</h2>
    <p v-if="desc" class="oidc-heading__desc">{{ desc }}</p>
    <slot />
  </div>
</template>

<style scoped>
.oidc-heading {
  margin-bottom: 30px;
}

.oidc-heading__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.oidc-heading__kicker::before {
  content: '';
  width: 22px;
  height: 1px;
  background: var(--oidc-grad);
}

.oidc-heading__title {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.25;
  letter-spacing: -0.01em;
  border: 0;
  padding: 0;
}

.oidc-heading__desc {
  max-width: 720px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}
</style>
