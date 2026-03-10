<script setup>
defineProps({
  title: { type: String, default: 'terminal' },
})
</script>

<template>
  <div class="gp-terminal">
    <div class="gp-terminal-header">
      <div class="gp-terminal-dots">
        <span class="gp-dot gp-dot-red" />
        <span class="gp-dot gp-dot-yellow" />
        <span class="gp-dot gp-dot-green" />
      </div>
      <span class="gp-terminal-title">{{ title }}</span>
      <div class="gp-terminal-spacer" />
    </div>
    <div class="gp-terminal-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-terminal {
  border-radius: var(--gp-radius);
  overflow: hidden;
  border: 1px solid var(--gp-border);
  background: var(--gp-bg-surface);
  animation: gp-code-glow 2s ease 0.3s both;
}

.gp-terminal-header {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background: var(--gp-bg-elevated);
  border-bottom: 1px solid var(--gp-border);
}

.gp-terminal-dots {
  display: flex;
  gap: 6px;
}

.gp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.gp-dot-red { background: #ff5f57; }
.gp-dot-yellow { background: #febc2e; }
.gp-dot-green { background: #28c840; }

.gp-terminal-title {
  flex: 1;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--gp-text-muted);
}

.gp-terminal-spacer {
  width: 52px;
}

.gp-terminal-body {
  padding: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--gp-text);
  white-space: pre-wrap;
}

.gp-terminal-body :deep(p) {
  white-space: pre-wrap;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
}

.gp-terminal-body :deep(pre) {
  background: none !important;
  border: none !important;
  border-left: none !important;
  padding: 0 !important;
  margin: 0;
  animation: none !important;
  box-shadow: none !important;
}
</style>
