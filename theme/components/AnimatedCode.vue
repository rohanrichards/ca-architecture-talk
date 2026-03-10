<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useIsSlideActive } from '@slidev/client'

const props = defineProps({
  code: { type: String, required: true },
  speed: { type: Number, default: 25 },
  delay: { type: Number, default: 400 },
})

const isActive = useIsSlideActive()
const displayed = ref('')
const showCursor = ref(true)
let timeout = null
let interval = null

function startAnimation() {
  displayed.value = ''
  showCursor.value = true
  clearTimeout(timeout)
  clearInterval(interval)

  timeout = setTimeout(() => {
    let i = 0
    interval = setInterval(() => {
      if (i < props.code.length) {
        displayed.value += props.code[i]
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => { showCursor.value = false }, 1500)
      }
    }, props.speed)
  }, props.delay)
}

watch(isActive, (active) => {
  if (active) startAnimation()
})

onMounted(() => {
  if (isActive.value) startAnimation()
})

onUnmounted(() => {
  clearTimeout(timeout)
  clearInterval(interval)
})
</script>

<template>
  <div class="gp-animated-code">
    <pre><code>{{ displayed }}<span v-if="showCursor" class="gp-cursor">|</span></code></pre>
  </div>
</template>

<style scoped>
.gp-animated-code {
  animation: gp-fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.gp-animated-code pre {
  background: var(--gp-bg-surface) !important;
  border: 1px solid var(--gp-border) !important;
  border-left: 3px solid var(--gp-accent) !important;
  border-radius: var(--gp-radius);
  padding: 1.5rem !important;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--gp-text);
  animation: none !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 212, 255, 0.05);
  min-height: 200px;
}

.gp-cursor {
  color: var(--gp-accent);
  animation: gp-blink 0.7s step-end infinite;
  text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
}

@keyframes gp-blink {
  50% { opacity: 0; }
}
</style>
