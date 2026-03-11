<script setup lang="ts">
/**
 * Image-left layout — image on the left, content on the right.
 *
 * Matches the "Empowering people to make change" slide patterns.
 * Left panel is an image with optional text overlay at the bottom.
 * Right panel is content.
 *
 * Usage:
 * ---
 * layout: image-left
 * image: /photos/team.jpg
 * ---
 *
 * # Content on the right
 *
 * Body text here.
 */

import { computed } from 'vue'
import { resolveAssetUrl } from '../layoutHelper'

const props = defineProps({
  image: { type: String, default: '' },
  split: { type: String, default: 'equal' },
})

const imageStyle = computed(() => {
  if (!props.image) return {}
  return {
    backgroundImage: `url("${resolveAssetUrl(props.image)}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})
</script>

<template>
  <div class="slidev-layout image-left" :class="`image-left--${split}`">
    <!-- Image panel -->
    <div class="image-panel" :style="imageStyle">
      <div class="image-overlay">
        <slot name="left" />
      </div>
    </div>

    <!-- Content panel -->
    <div class="content-panel">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.image-left {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-left--equal { grid-template-columns: 1fr 1fr; }
.image-left--wide { grid-template-columns: 2fr 3fr; }
.image-left--narrow { grid-template-columns: 1fr 2fr; }

.image-panel {
  position: relative;
  background: #e5e5e5;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 1;
}

.content-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
}
</style>
