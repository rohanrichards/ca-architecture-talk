<template>
  <div class="slidev-layout gp-default gp-mesh-bg gp-grid-overlay">
    <div class="gp-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-default {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 4rem;
  height: 100%;
}

.gp-content {
  position: relative;
  z-index: 1;
}
</style>
