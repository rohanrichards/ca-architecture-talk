<script setup lang="ts">
/**
 * Diptych layout — the core brand juxtaposition.
 *
 * Two equal panels side by side:
 * - Left: "current state" — wireframe shape on dark background
 * - Right: "future state" — filled shape on light background
 *
 * The same shape morphs across both panels, but rendered differently.
 * Matches the "Juxtaposing Imagery" brand guidelines.
 *
 * Usage:
 * ---
 * layout: diptych
 * scheme: blue
 * from: organic-1
 * to: organic-3
 * ---
 */

defineProps({
  /** Colour family: lime, pink, blue, vermillion, brown */
  scheme: { type: String, default: 'blue' },
  /** Shape morph start */
  from: { type: String, default: 'organic-1' },
  /** Shape morph end */
  to: { type: String, default: 'organic-3' },
  /** Number of morph steps */
  steps: { type: Number, default: 10 },
  /** Alignment for filled side */
  align: { type: String, default: 'right' },
})
</script>

<template>
  <div class="slidev-layout diptych">
    <!-- Left panel: current state (wireframe on dark bg) -->
    <div class="diptych-panel diptych-left" :class="`bg-${scheme}-dark`">
      <BrandShape
        :from="from"
        :to="to"
        :scheme="scheme"
        variant="wireframe"
        :crop="true"
        size="100%"
        :steps="steps"
        :noise="false"
      />
      <div class="diptych-slot diptych-slot--left">
        <slot name="left" />
      </div>
    </div>

    <!-- Right panel: future state (filled on light bg) -->
    <div class="diptych-panel diptych-right" :class="`bg-${scheme}-light`">
      <BrandShape
        :from="from"
        :to="to"
        :scheme="scheme"
        variant="filled"
        :crop="true"
        size="100%"
        :steps="steps"
        :align="align"
      />
      <div class="diptych-slot diptych-slot--right">
        <slot name="right" />
      </div>
    </div>

    <!-- Default slot overlays the full slide (for overlapping text) -->
    <div class="diptych-overlay">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.diptych {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.diptych-panel {
  position: relative;
  overflow: hidden;
}

/*
 * Global alignment: each BrandShape renders at 200% panel width
 * (= 100% slide width). The left panel shows the left half;
 * the right panel shifts left by one panel width to show the
 * right half. Both shapes share the same coordinate system
 * so they align seamlessly at the panel boundary.
 */
.diptych-panel :deep(.brand-shape) {
  position: absolute;
  top: 0;
  width: 200% !important;
  height: 100% !important;
}
.diptych-left :deep(.brand-shape) {
  left: 0;
}
.diptych-right :deep(.brand-shape) {
  left: -100%;
}

.diptych-slot {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  z-index: 1;
}

.diptych-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  z-index: 2;
  pointer-events: none;
}

.diptych-overlay :deep(*) {
  pointer-events: auto;
}

/* Background colour helpers matching the brand tokens */
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
