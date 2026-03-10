<template>
  <div class="gp-glow-card">
    <div class="gp-glow-card-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-glow-card {
  position: relative;
  border-radius: var(--gp-radius);
  padding: 2px;
  background: linear-gradient(135deg, var(--gp-accent), var(--gp-accent-secondary), var(--gp-accent));
  background-size: 300% 300%;
  animation: gp-glow-rotate 6s ease-in-out infinite;
}

@keyframes gp-glow-rotate {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gp-glow-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--gp-radius) + 2px);
  background: inherit;
  filter: blur(20px);
  opacity: 0.5;
  z-index: -1;
}

.gp-glow-card-inner {
  background: var(--gp-bg-surface);
  border-radius: calc(var(--gp-radius) - 2px);
  padding: 2rem 2.5rem;
  backdrop-filter: blur(10px);
  font-size: 1.15rem;
  line-height: 1.7;
}
</style>
