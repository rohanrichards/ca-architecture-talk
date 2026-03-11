<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getShape, type ShapeName } from './shapes'
import { resolveColour, resolveScheme, type ColourFamily, type ColourToken } from './colours'
import { generateMorphSteps } from './morph'
import { buildGradientDef, buildNoiseDef, buildBlurDef, generateStepFills } from './effects'

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

// Per-step solid fills for 'filled' variant
const stepFills = computed(() => {
  const { current, catalyst, future } = gradientColours.value
  return generateStepFills(current, catalyst, future, allPaths.value.length)
})

// SVG defs
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

onMounted(() => {
  if (props.animate && props.trigger === 'enter') {
    startAnimation()
  }
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

// Filter ref
const filterRef = computed(() => {
  if (props.noise) return `url(#noise-${uid})`
  return undefined
})

// Visible paths based on animation progress
const visiblePaths = computed(() => {
  return allPaths.value.slice(0, visibleStepCount.value)
})

// ViewBox: generous for uncropped, tighter for cropped
const viewBox = computed(() => {
  if (props.crop) {
    return '20 10 160 130'
  }
  return '-10 -15 210 180'
})
</script>

<template>
  <div
    class="brand-shape"
    :class="{ 'brand-shape--crop': crop }"
    :style="{ width: size, height: size, cursor: animate && trigger === 'click' ? 'pointer' : undefined }"
    @click="handleClick"
  >
    <svg
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      :preserveAspectRatio="crop ? 'xMidYMid slice' : 'xMidYMid meet'"
    >
      <defs v-html="gradientSvg + noiseSvg + blurSvg" />

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
           Solid filled morph steps, each a different colour
           along the current→catalyst→future narrative.
           Renders back-to-front for layered depth effect.
           ============================================ -->
      <template v-if="variant === 'filled'">
        <path
          v-for="(pathD, i) in visiblePaths"
          :key="'filled-' + i"
          :d="pathD"
          :fill="stepFills[i]"
          stroke="none"
          :filter="filterRef"
        />
      </template>

      <!-- ============================================
           VARIANT: gradient
           Single shape (last morph step) filled with the
           full narrative gradient. Used for cropped hero
           backgrounds from Shapes & Colour examples.
           ============================================ -->
      <template v-if="variant === 'gradient'">
        <path
          v-for="(pathD, i) in visiblePaths"
          :key="'grad-fill-' + i"
          :d="pathD"
          :fill="`url(#grad-${uid})`"
          stroke="none"
          :opacity="0.6 + (0.4 * i / Math.max(allPaths.length - 1, 1))"
          :filter="filterRef"
        />
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
