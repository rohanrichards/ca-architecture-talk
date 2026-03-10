<template>
  <div class="slidev-layout gp-two-cols gp-mesh-bg gp-grid-overlay">
    <div class="gp-cols-header" v-if="$slots.default">
      <slot />
    </div>
    <div class="gp-cols-container">
      <div class="gp-col gp-col-left">
        <slot name="left" />
      </div>
      <div class="gp-col-divider" />
      <div class="gp-col gp-col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gp-two-cols {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 3rem 4rem;
}

.gp-cols-header {
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.gp-cols-container {
  display: flex;
  gap: 2.5rem;
  position: relative;
  z-index: 1;
}

.gp-col {
  flex: 1;
}

.gp-col-divider {
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--gp-border), transparent);
}
</style>
