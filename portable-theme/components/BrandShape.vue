<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { getShape, type ShapeName } from './shapes'
import { useSlideContext } from '@slidev/client'
import { resolveColour, resolveScheme, type ColourFamily, type ColourToken } from './colours'
import { generateMorphSteps } from './morph'
import { buildGradientDef, buildNoiseDef, buildBlurDef, buildConicGradientCSS, generateStepFills } from './effects'

const props = withDefaults(defineProps<{
  from: ShapeName
  to: ShapeName
  steps?: number
  scheme?: ColourFamily
  current?: ColourToken
  catalyst?: ColourToken
  future?: ColourToken
  noise?: boolean
  blur?: boolean
  animate?: boolean
  trigger?: 'enter' | 'click'
  duration?: number
  size?: string
  variant?: 'wireframe' | 'filled' | 'gradient'
  crop?: boolean
  /** Direction the filled steps fan out from. Default 'left' fans back steps to the left. */
  align?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  /** How much the steps spread apart (0 = no spread, 1 = default, 2 = exaggerated). */
  spread?: number
}>(), {
  steps: 8,
  noise: true,
  blur: true,
  animate: false,
  trigger: 'enter',
  duration: 1500,
  size: '400px',
  variant: 'wireframe',
  crop: false,
  align: 'left',
  spread: 1,
})

// Unique ID for SVG defs
const uid = Math.random().toString(36).slice(2, 8)

// Resolve gradient colours
const gradientColours = computed(() => {
  if (props.current && props.catalyst && props.future) {
    return {
      current: resolveColour(props.current),
      catalyst: resolveColour(props.catalyst),
      future: resolveColour(props.future),
    }
  }
  if (props.scheme) {
    return resolveScheme(props.scheme)
  }
  return resolveScheme('lime')
})

// Generate morph steps
const fromShape = computed(() => getShape(props.from))
const toShape = computed(() => getShape(props.to))

const morphResult = computed(() => {
  return generateMorphSteps(
    fromShape.value.path,
    toShape.value.path,
    props.steps,
  )
})

const allPaths = computed(() => morphResult.value.steps)

/**
 * Extract bounding box center from an SVG path string.
 * Parses all numeric coordinate pairs and returns the midpoint.
 */
function pathCenter(d: string): { x: number; y: number } {
  const nums = d.match(/-?\d+\.?\d*/g)
  if (!nums || nums.length < 2) return { x: 95, y: 80 }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = parseFloat(nums[i])
    const y = parseFloat(nums[i + 1])
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
}

// ForeignObject bounds match the viewBox for filled/gradient variants
const foBounds = computed(() => {
  if (props.variant === 'filled' || props.variant === 'gradient') {
    const pad = 20 * props.spread
    return { x: -10 - pad, y: -15 - pad, w: 210 + pad * 2, h: 180 + pad * 2 }
  }
  return { x: -10, y: -15, w: 210, h: 180 }
})

/**
 * Compute the gradient center for the middle morph step as a percentage
 * within the foreignObject space. Centers the conic gradient on the
 * actual shape geometry.
 */
const gradientCenter = computed(() => {
  const midIndex = Math.floor(allPaths.value.length / 2)
  const midPath = allPaths.value[midIndex] || allPaths.value[0]
  const center = pathCenter(midPath)
  const fo = foBounds.value
  const pctX = ((center.x - fo.x) / fo.w) * 100
  const pctY = ((center.y - fo.y) / fo.h) * 100
  return { x: pctX, y: pctY }
})

// Per-step solid fills for 'filled' variant
const stepFills = computed(() => {
  const { current, catalyst, future } = gradientColours.value
  return generateStepFills(current, catalyst, future, allPaths.value.length)
})

/**
 * Per-step conic gradient CSS. Each step gets a rotated gradient AND
 * a shifted center so layers show genuinely different colour regions.
 *
 * Base center is computed from the actual shape bounding box midpoint,
 * then shifted per step in the align direction so each layer reveals
 * a distinct part of the colour sweep.
 */
function stepConicGradient(index: number, total: number): string {
  const { current, catalyst, future } = gradientColours.value
  const t = total <= 1 ? 0 : index / (total - 1)

  // Rotate gradient by up to 120° across the full step range
  const rotation = t * 120

  // Start from the shape-geometry center, then shift per step
  const base = gradientCenter.value
  const shift = 15 * props.spread // max shift in %
  let cx = base.x
  let cy = base.y
  switch (props.align) {
    case 'left':   cx += (1 - t) * shift; break
    case 'right':  cx -= (1 - t) * shift; break
    case 'top':    cy += (1 - t) * shift; break
    case 'bottom': cy -= (1 - t) * shift; break
    case 'center': break
  }

  return buildConicGradientCSS(current, catalyst, future, 90 + rotation, cx, cy)
}

// SVG defs (linear gradient for wireframe stroke only)
const gradientSvg = computed(() =>
  buildGradientDef({ id: `grad-${uid}`, ...gradientColours.value }),
)
const noiseSvg = computed(() => props.noise ? buildNoiseDef(`noise-${uid}`) : '')
const blurSvg = computed(() => props.blur ? buildBlurDef(`blur-${uid}`) : '')

// Animation state: how many steps are currently visible
const visibleStepCount = ref(props.animate ? 0 : allPaths.value.length)
const animationComplete = ref(!props.animate)

function startAnimation() {
  if (visibleStepCount.value > 0 && visibleStepCount.value < allPaths.value.length) return

  visibleStepCount.value = 0
  animationComplete.value = false

  const totalSteps = allPaths.value.length
  const stepDuration = props.duration / totalSteps
  let currentStep = 0

  function revealNext() {
    currentStep++
    visibleStepCount.value = currentStep

    if (currentStep < totalSteps) {
      setTimeout(revealNext, stepDuration)
    } else {
      animationComplete.value = true
    }
  }

  setTimeout(revealNext, stepDuration * 0.5)
}

// Template ref for the root element
const rootEl = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!props.animate) {
    visibleStepCount.value = allPaths.value.length
    animationComplete.value = true
    return
  }

  if (props.trigger === 'enter' && rootEl.value) {
    // Use IntersectionObserver to play animation when the slide becomes visible,
    // not when the component mounts (Slidev preloads off-screen slides).
    // Re-plays every time the element enters the viewport.
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startAnimation()
          }
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(rootEl.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

// Slidev click integration: trigger animation on slide click advancement.
// useSlideContext relies on Vue provide/inject which is only available
// during setup, so we call it here but guard against missing context.
let slideContext: ReturnType<typeof useSlideContext> | null = null
try {
  slideContext = useSlideContext()
} catch {
  // Not inside a Slidev slide (e.g. during tests) — click trigger unavailable
}

if (props.animate && props.trigger === 'click' && slideContext) {
  const clicks = slideContext.$clicks
  watch(
    () => clicks.value,
    (newVal, oldVal) => {
      if (newVal > (oldVal ?? 0)) {
        startAnimation()
      }
    },
  )
}

// Filter ref
const filterRef = computed(() => {
  if (props.noise) return `url(#noise-${uid})`
  return undefined
})

// Visible paths based on animation progress
const visiblePaths = computed(() => {
  return allPaths.value.slice(0, visibleStepCount.value)
})

/**
 * Generate a transform for each morph step in filled/gradient mode.
 * Each step progressively scales down and shifts, so earlier (back)
 * steps are larger and visible behind the front steps.
 * This creates the stacked 3D depth effect from the brand examples.
 *
 * align: direction the back steps fan toward ('left', 'right', 'top', 'bottom', 'center')
 * spread: multiplier on offset distance (0 = no movement, 1 = default, 2 = exaggerated)
 */
function filledStepTransform(index: number, total: number): string {
  const t = total <= 1 ? 0 : index / (total - 1)
  const s = props.spread

  // Scale: back steps larger, front steps smaller. spread amplifies the range.
  const scaleRange = 0.2 * s
  const scale = (1 + 0.15 * s) - (t * scaleRange) // e.g. 1.15 → 0.95 at spread=1

  // Base offset magnitude (pixels in SVG space)
  const mag = 12 * s
  const backFactor = 1 - t // 1 at back, 0 at front

  // Direction vector based on align prop
  let dx = 0
  let dy = 0
  switch (props.align) {
    case 'left':   dx = -1; dy = -0.3; break
    case 'right':  dx =  1; dy =  0.3; break
    case 'top':    dx = -0.3; dy = -1; break
    case 'bottom': dx =  0.3; dy =  1; break
    case 'center': dx =  0; dy =  0; break
  }

  const offsetX = backFactor * mag * dx
  const offsetY = backFactor * mag * dy

  // Transform origin is centre of viewBox (~95, 80)
  const cx = 95
  const cy = 80
  return `translate(${cx + offsetX}, ${cy + offsetY}) scale(${scale}) translate(${-cx}, ${-cy})`
}

// ViewBox: needs extra room for filled/gradient transforms (scale + offset).
// Cropped mode uses a tight box for edge-to-edge coverage.
const viewBox = computed(() => {
  if (props.crop) {
    return '-10 -15 210 180'
  }
  // Extra padding for filled/gradient step transforms that scale up + offset
  if (props.variant === 'filled' || props.variant === 'gradient') {
    const pad = 20 * props.spread
    return `${-10 - pad} ${-15 - pad} ${210 + pad * 2} ${180 + pad * 2}`
  }
  return '-10 -15 210 180'
})
</script>

<template>
  <div
    ref="rootEl"
    class="brand-shape"
    :class="{ 'brand-shape--crop': crop }"
    :style="{
      width: size,
      height: crop ? '100%' : size,
    }"
  >
    <svg
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      :preserveAspectRatio="crop ? 'xMidYMid slice' : 'xMidYMid meet'"
    >
      <defs>
        <!-- SVG gradient for wireframe stroke + SVG filters -->
        <g v-html="gradientSvg + noiseSvg + blurSvg" />

        <!-- ClipPaths for filled/gradient variants (one per morph step) -->
        <template v-if="variant === 'filled' || variant === 'gradient'">
          <clipPath
            v-for="(pathD, i) in allPaths"
            :key="'clipdef-' + i"
            :id="`clip-${uid}-${i}`"
          >
            <path :d="pathD" :transform="filledStepTransform(i, allPaths.length)" />
          </clipPath>
        </template>
      </defs>

      <!-- ============================================
           VARIANT: wireframe
           Stroked outlines, building up the morph pattern
           ============================================ -->
      <template v-if="variant === 'wireframe'">
        <path
          v-for="(pathD, i) in visiblePaths"
          :key="'stroke-' + i"
          :d="pathD"
          fill="none"
          :stroke="`url(#grad-${uid})`"
          :stroke-width="1.2"
          :opacity="0.2 + (0.8 * i / Math.max(allPaths.length - 1, 1))"
        />
        <path
          v-if="visiblePaths.length > 0"
          :d="visiblePaths[0]"
          :fill="`url(#grad-${uid})`"
          :opacity="0.1"
          :filter="filterRef"
        />
        <path
          v-if="visiblePaths.length > 1"
          :d="visiblePaths[visiblePaths.length - 1]"
          :fill="`url(#grad-${uid})`"
          :opacity="0.15"
          :filter="filterRef"
        />
      </template>

      <!-- ============================================
           VARIANT: filled
           CSS conic-gradient clipped to each morph step shape.
           Uses foreignObject + clip-path, matching the brand's
           GRADIENT_ANGULAR (conic) style from Figma exports.
           The gradient stays fixed in space — each step reveals
           a different portion, creating natural colour variation.
           ============================================ -->
      <template v-if="variant === 'filled'">
        <g
          v-for="(_pathD, i) in visiblePaths"
          :key="'filled-' + i"
          :filter="filterRef"
        >
          <foreignObject
            :clip-path="`url(#clip-${uid}-${i})`"
            :x="foBounds.x" :y="foBounds.y" :width="foBounds.w" :height="foBounds.h"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              :style="{ background: stepConicGradient(i, allPaths.length), width: '100%', height: '100%' }"
            />
          </foreignObject>
        </g>
      </template>

      <!-- ============================================
           VARIANT: gradient
           Same conic-gradient approach but with progressive
           opacity for layered depth. Used for cropped hero
           backgrounds from Shapes & Colour examples.
           ============================================ -->
      <template v-if="variant === 'gradient'">
        <g
          v-for="(_pathD, i) in visiblePaths"
          :key="'grad-fill-' + i"
          :filter="filterRef"
          :opacity="0.6 + (0.4 * i / Math.max(allPaths.length - 1, 1))"
        >
          <foreignObject
            :clip-path="`url(#clip-${uid}-${i})`"
            :x="foBounds.x" :y="foBounds.y" :width="foBounds.w" :height="foBounds.h"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              :style="{ background: stepConicGradient(i, allPaths.length), width: '100%', height: '100%' }"
            />
          </foreignObject>
        </g>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.brand-shape {
  display: inline-block;
  line-height: 0;
}
.brand-shape--crop {
  overflow: hidden;
}
</style>
