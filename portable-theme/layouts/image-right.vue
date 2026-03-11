<script setup lang="ts">
/**
 * Image-right layout — content on the left, image on the right.
 *
 * Mirror of image-left.
 *
 * Usage:
 * ---
 * layout: image-right
 * image: /photos/team.jpg
 * ---
 *
 * # Content on the left
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
  <div class="slidev-layout image-right" :class="`image-right--${split}`">
    <!-- Content panel -->
    <div class="content-panel">
      <slot />
    </div>

    <!-- Image panel -->
    <div class="image-panel" :style="imageStyle">
      <div class="image-overlay">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-right {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-right--equal { grid-template-columns: 1fr 1fr; }
.image-right--wide { grid-template-columns: 3fr 2fr; }
.image-right--narrow { grid-template-columns: 2fr 1fr; }

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
