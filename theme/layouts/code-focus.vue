<template>
  <div class="slidev-layout gp-code-focus">
    <div class="gp-code-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-code-focus {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 2.5rem 4rem;
}

.gp-code-content {
  position: relative;
  z-index: 1;
}

.gp-code-focus :deep(pre) {
  font-size: 0.95rem;
  max-height: 75vh;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 212, 255, 0.05);
}

.gp-code-focus :deep(h1),
.gp-code-focus :deep(h2),
.gp-code-focus :deep(h3) {
  margin-bottom: 1.25rem;
  font-size: 1.75rem;
}
</style>
