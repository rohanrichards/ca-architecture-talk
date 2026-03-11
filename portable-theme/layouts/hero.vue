<script setup lang="ts">
/**
 * Hero layout — large display text across diptych panels.
 *
 * Matches the "Catalyst of change" hero brand expression.
 * h1 sits top-left on the dark panel; h2 sits bottom-right
 * on the light panel. Each gets the approved text colour
 * for its panel — no blend modes needed.
 *
 * Usage:
 * ---
 * layout: hero
 * scheme: blue
 * from: organic-2
 * to: organic-3
 * ---
 *
 * # Catalyst
 * ## of change
 */

import { computed } from 'vue'
import { resolveTextPairing, type ColourFamily } from '../components/colours'

const props = defineProps({
  scheme: { type: String, default: 'blue' },
  from: { type: String, default: 'organic-1' },
  to: { type: String, default: 'organic-3' },
  steps: { type: Number, default: 10 },
})

const textColours = computed(() => resolveTextPairing(props.scheme as ColourFamily))
</script>

<template>
  <div class="slidev-layout hero">
    <!-- Left: wireframe on dark -->
    <div class="hero-panel" :class="`bg-${scheme}-dark`">
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
    </div>

    <!-- Right: filled on light -->
    <div class="hero-panel" :class="`bg-${scheme}-light`">
      <BrandShape
        :from="from"
        :to="to"
        :scheme="scheme"
        variant="filled"
        :crop="true"
        size="100%"
        :steps="steps"
      />
    </div>

    <!-- Display text — h1 on dark panel, h2 on light panel -->
    <div
      class="hero-text"
      :style="{
        '--hero-text-on-dark': textColours.onDark,
        '--hero-text-on-light': textColours.onLight,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.hero-panel {
  position: relative;
  overflow: hidden;
}

/* Global alignment: 200% width per panel so shapes share
   a single coordinate system across the 50/50 split. */
.hero-panel :deep(.brand-shape) {
  position: absolute;
  top: 0;
  width: 200% !important;
  height: 100% !important;
}
.hero-panel:nth-child(1) :deep(.brand-shape) {
  left: 0;
}
.hero-panel:nth-child(2) :deep(.brand-shape) {
  left: -100%;
}

.hero-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 4rem;
  z-index: 2;
  pointer-events: none;
}

/* h1: top-left, confined to the left (dark) panel */
.hero-text :deep(h1) {
  font-size: 5rem;
  line-height: 1;
  font-weight: 700;
  color: var(--hero-text-on-dark);
  pointer-events: auto;
  width: 50%;
}

/* h2: bottom-right, confined to the right (light) panel */
.hero-text :deep(h2) {
  font-size: 5rem;
  line-height: 1;
  font-weight: 700;
  text-align: right;
  align-self: flex-end;
  width: 50%;
  color: var(--hero-text-on-light);
  pointer-events: auto;
}

.hero-text :deep(p) {
  font-size: 1.25rem;
  opacity: 0.8;
  pointer-events: auto;
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
