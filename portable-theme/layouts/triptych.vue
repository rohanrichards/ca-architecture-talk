<script setup lang="ts">
/**
 * Triptych layout — three-panel sequential composition.
 *
 * Panel 1: Outlined/wireframe shape (Step 1 / current)
 * Panel 2: Rendered/filled shape (Step 2 / catalyst)
 * Panel 3: Content area (Step 3 / future)
 *
 * Follows the "comic book strip" reading order from the
 * Juxtaposing Imagery guidelines. Panel sizes can be
 * adjusted via the `split` prop.
 *
 * Text content (default slot) routes to the third panel,
 * which has a controlled background colour and approved
 * text pairing — never spanning across panel boundaries.
 *
 * Usage:
 * ---
 * layout: triptych
 * scheme: pink
 * from: organic-2
 * to: angular-1
 * ---
 *
 * Content goes in the third panel automatically.
 *
 * # Or use named slots for specific panels:
 * <template #right>
 *   <img src="/photo.jpg" class="object-cover w-full h-full" />
 * </template>
 */

defineProps({
  scheme: { type: String, default: 'pink' },
  from: { type: String, default: 'organic-1' },
  to: { type: String, default: 'organic-3' },
  steps: { type: Number, default: 10 },
  /** Grid column split: 'equal' (1:1:1) or 'weighted' (1:1.5:1) */
  split: { type: String, default: 'equal' },
})
</script>

<template>
  <div class="slidev-layout triptych" :class="`triptych--${split}`">
    <!-- Panel 1: wireframe / current state -->
    <div class="triptych-panel" :class="`bg-${scheme}-light`">
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
      <div class="triptych-slot">
        <slot name="left" />
      </div>
    </div>

    <!-- Panel 2: filled / rendered shape -->
    <div class="triptych-panel" :class="`bg-${scheme}-dark`">
      <BrandShape
        :from="from"
        :to="to"
        :scheme="scheme"
        variant="filled"
        :crop="true"
        size="100%"
        :steps="steps"
      />
      <div class="triptych-slot">
        <slot name="center" />
      </div>
    </div>

    <!-- Panel 3: content area — default slot routes here -->
    <div class="triptych-panel triptych-panel--content" :class="`${scheme}-dark`">
      <slot name="right">
        <div class="triptych-content">
          <slot />
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.triptych {
  display: grid;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.triptych--equal {
  grid-template-columns: 1fr 1fr 1fr;
}

.triptych--weighted {
  grid-template-columns: 1fr 1.5fr 1fr;
}

.triptych-panel {
  position: relative;
  overflow: hidden;
}

/*
 * Global alignment: each BrandShape renders at 300% panel width
 * (= 100% slide width for equal 3-col split). Panels offset so
 * shapes share a single coordinate system across all three columns.
 */
.triptych-panel :deep(.brand-shape) {
  position: absolute;
  top: 0;
  height: 100% !important;
}
.triptych--equal .triptych-panel:nth-child(1) :deep(.brand-shape) {
  width: 300% !important;
  left: 0;
}
.triptych--equal .triptych-panel:nth-child(2) :deep(.brand-shape) {
  width: 300% !important;
  left: -100%;
}
/* Weighted split (1fr 1.5fr 1fr = total 3.5fr).
   Panel 1 = 1/3.5 ≈ 28.57%, Panel 2 = 1.5/3.5 ≈ 42.86%.
   Each shape must be (1 / panelFraction) × 100% wide,
   offset by the preceding panels' fraction of the slide. */
.triptych--weighted .triptych-panel:nth-child(1) :deep(.brand-shape) {
  width: 350% !important; /* 100% / (1/3.5) */
  left: 0;
}
.triptych--weighted .triptych-panel:nth-child(2) :deep(.brand-shape) {
  width: 233.33% !important; /* 100% / (1.5/3.5) */
  left: -66.67%; /* panel1 width as % of panel2: (1/1.5)*100 */
}

/* Panel 3 content area — text uses the colour-scheme class
   inherited from the parent which sets the approved text pairing */
.triptych-panel--content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.triptych-content {
  padding: 2rem;
}

.triptych-slot {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  z-index: 1;
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
