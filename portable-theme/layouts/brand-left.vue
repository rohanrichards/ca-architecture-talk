<script setup lang="ts">
/**
 * Brand-left layout — brand shape panel on the left, content on the right.
 *
 * Matches the "Studio Profile", "Innovation partners" slide patterns.
 * Left panel shows a brand shape (wireframe or filled) on a coloured
 * background. Right panel is a clean content area.
 *
 * Usage:
 * ---
 * layout: brand-left
 * scheme: blue
 * from: organic-1
 * to: organic-3
 * variant: wireframe
 * ---
 *
 * # Right side content here
 */

defineProps({
  scheme: { type: String, default: 'blue' },
  from: { type: String, default: 'organic-1' },
  to: { type: String, default: 'organic-3' },
  steps: { type: Number, default: 10 },
  /** 'wireframe' or 'filled' for the brand panel */
  variant: { type: String, default: 'wireframe' },
  /** Grid split ratio: 'equal' (1:1), 'wide' (2:3), 'narrow' (1:2) */
  split: { type: String, default: 'equal' },
})
</script>

<template>
  <div class="slidev-layout brand-left" :class="`brand-left--${split}`">
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
.brand-left {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.brand-left--equal { grid-template-columns: 1fr 1fr; }
.brand-left--wide { grid-template-columns: 2fr 3fr; }
.brand-left--narrow { grid-template-columns: 1fr 2fr; }

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
