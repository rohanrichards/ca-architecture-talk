<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getShape, type ShapeName } from './shapes'
import { resolveColour, resolveScheme, type ColourFamily, type ColourToken } from './colours'
import { generateMorphSteps } from './morph'
import { buildGradientDef, buildNoiseDef, buildBlurDef } from './effects'

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
}>(), {
  steps: 8,
  noise: true,
  blur: true,
  animate: false,
  trigger: 'enter',
  duration: 1500,
  size: '400px',
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

// SVG defs
const gradientSvg = computed(() =>
  buildGradientDef({ id: `grad-${uid}`, ...gradientColours.value }),
)
const noiseSvg = computed(() => props.noise ? buildNoiseDef(`noise-${uid}`) : '')
const blurSvg = computed(() => props.blur ? buildBlurDef(`blur-${uid}`) : '')

// Animation state: how many steps are currently visible
// For static mode, all steps are visible immediately
// For animated mode, steps are progressively revealed
const visibleStepCount = ref(props.animate ? 0 : allPaths.value.length)
const animationComplete = ref(!props.animate)

function startAnimation() {
  if (visibleStepCount.value > 0 && visibleStepCount.value < allPaths.value.length) return // already running

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

  // Start with a small delay so the empty state is visible briefly
  setTimeout(revealNext, stepDuration * 0.5)
}

onMounted(() => {
  if (props.animate && props.trigger === 'enter') {
    startAnimation()
  }
  // For non-animated mode, ensure all steps visible
  if (!props.animate) {
    visibleStepCount.value = allPaths.value.length
    animationComplete.value = true
  }
})

function handleClick() {
  if (props.animate && props.trigger === 'click') {
    startAnimation()
  }
}

// Filter ref for filled shapes
const filterRef = computed(() => {
  if (props.noise) return `url(#noise-${uid})`
  return undefined
})

// Visible paths based on animation progress
const visiblePaths = computed(() => {
  return allPaths.value.slice(0, visibleStepCount.value)
})

// Use a viewBox large enough for all shapes
const viewBox = '-10 -15 210 180'
</script>

<template>
  <div
    class="brand-shape"
    :style="{ width: size, height: size, cursor: animate && trigger === 'click' ? 'pointer' : undefined }"
    @click="handleClick"
  >
    <svg
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs v-html="gradientSvg + noiseSvg + blurSvg" />

      <!-- Wireframe: stroked outlines for each visible step -->
      <path
        v-for="(pathD, i) in visiblePaths"
        :key="'stroke-' + i"
        :d="pathD"
        fill="none"
        :stroke="`url(#grad-${uid})`"
        :stroke-width="1.2"
        :opacity="0.2 + (0.8 * i / Math.max(allPaths.length - 1, 1))"
      />

      <!-- Subtle fill on first visible shape -->
      <path
        v-if="visiblePaths.length > 0"
        :d="visiblePaths[0]"
        :fill="`url(#grad-${uid})`"
        :opacity="0.1"
        :filter="filterRef"
      />

      <!-- Subtle fill on last visible shape (builds up as animation progresses) -->
      <path
        v-if="visiblePaths.length > 1"
        :d="visiblePaths[visiblePaths.length - 1]"
        :fill="`url(#grad-${uid})`"
        :opacity="0.15"
        :filter="filterRef"
      />
    </svg>
  </div>
</template>

<style scoped>
.brand-shape {
  display: inline-block;
  line-height: 0;
}
</style>
