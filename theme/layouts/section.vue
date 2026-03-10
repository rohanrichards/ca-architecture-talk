<template>
  <div class="slidev-layout gp-section">
    <div class="gp-section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem 4rem;
  text-align: center;
}

.gp-section-content {
  position: relative;
  z-index: 1;
}

.gp-section :deep(h1) {
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  animation: gp-headline-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.gp-section :deep(h1)::after {
  content: '';
  display: block;
  height: 3px;
  margin: 1.25rem auto 0;
  background: linear-gradient(90deg, transparent, var(--gp-accent), var(--gp-accent-secondary), transparent);
  animation: gp-underline-draw 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}

.gp-section :deep(p) {
  color: var(--gp-text-muted);
  font-size: 1.3rem;
  margin-top: 1.25rem;
  animation: gp-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}
</style>
