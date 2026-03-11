<script setup lang="ts">
/**
 * Brand-right layout — content on the left, brand shape panel on the right.
 *
 * Mirror of brand-left. Matches the "type placed over image or graphic"
 * patterns where the brand visual is on the right side.
 *
 * Usage:
 * ---
 * layout: brand-right
 * scheme: pink
 * variant: filled
 * ---
 *
 * # Left side content here
 */

defineProps({
  scheme: { type: String, default: 'pink' },
  from: { type: String, default: 'organic-1' },
  to: { type: String, default: 'organic-3' },
  steps: { type: Number, default: 10 },
  variant: { type: String, default: 'filled' },
  split: { type: String, default: 'equal' },
})
</script>

<template>
  <div class="slidev-layout brand-right" :class="`brand-right--${split}`">
    <!-- Content panel -->
    <div class="content-panel">
      <slot />
    </div>

    <!-- Brand panel -->
    <div class="brand-panel" :class="variant === 'wireframe' ? `bg-${scheme}-dark` : `bg-${scheme}-light`">
      <BrandShape
        :from="from"
        :to="to"
        :scheme="scheme"
        :variant="variant"
        :crop="true"
        size="100%"
        :steps="steps"
        :noise="variant !== 'wireframe'"
      />
      <div class="brand-panel-slot">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-right {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.brand-right--equal { grid-template-columns: 1fr 1fr; }
.brand-right--wide { grid-template-columns: 3fr 2fr; }
.brand-right--narrow { grid-template-columns: 2fr 1fr; }

.brand-panel {
  position: relative;
  overflow: hidden;
}

.brand-panel :deep(.brand-shape) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

.brand-panel-slot {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  z-index: 1;
}

.content-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
}

.bg-lime-dark { background: #263212; }
.bg-lime-light { background: #EDFFCC; }
.bg-pink-dark { background: #400E30; }
.bg-pink-light { background: #FFC3F6; }
.bg-blue-dark { background: #170045; }
.bg-blue-light { background: #DEDAFF; }
.bg-vermillion-dark { background: #471605; }
.bg-vermillion-light { background: #FFC6BF; }
.bg-brown-dark { background: #341405; }
.bg-brown-light { background: #EFD8C2; }
</style>
