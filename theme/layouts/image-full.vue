<script setup>
defineProps({
  image: { type: String, required: true },
  dim: { type: String, default: '0.4' },
})
</script>

<template>
  <div class="slidev-layout gp-image-full">
    <img :src="image" class="gp-bg-image" />
    <div class="gp-image-overlay" :style="{ opacity: dim }" />
    <div class="gp-image-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-image-full {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
}

.gp-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gp-image-overlay {
  position: absolute;
  inset: 0;
  background: var(--gp-bg);
}

.gp-image-content {
  position: relative;
  z-index: 1;
}

.gp-image-content :deep(h1) {
  font-size: 3rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}
</style>
