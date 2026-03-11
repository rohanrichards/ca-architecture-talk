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

const staticPaths = computed(() => morphResult.value.steps)

// SVG defs
const gradientSvg = computed(() =>
  buildGradientDef({ id: `grad-${uid}`, ...gradientColours.value }),
)
const noiseSvg = computed(() => props.noise ? buildNoiseDef(`noise-${uid}`) : '')
const blurSvg = computed(() => props.blur ? buildBlurDef(`blur-${uid}`) : '')

// Animation state
const animatedPath = ref('')
const isAnimating = ref(false)
const showStatic = ref(true)

function startAnimation() {
  if (isAnimating.value) return
  isAnimating.value = true
  showStatic.value = false

  const interpolator = morphResult.value.interpolator
  const start = performance.now()

  function frame(now: number) {
    const elapsed = now - start
    const t = Math.min(elapsed / props.duration, 1)
    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2

    animatedPath.value = interpolator(eased)

    if (t < 1) {
      requestAnimationFrame(frame)
    } else {
      isAnimating.value = false
    }
  }

  requestAnimationFrame(frame)
}

onMounted(() => {
  if (props.animate && props.trigger === 'enter') {
    startAnimation()
  }
})

function handleClick() {
  if (props.animate && props.trigger === 'click') {
    startAnimation()
  }
}

// Combined filter ref — apply noise to filled shapes, blur to edges
const filterRef = computed(() => {
  if (props.noise) return `url(#noise-${uid})`
  return undefined
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

      <!-- Static wireframe mode: all morph steps as stroked outlines -->
      <template v-if="showStatic">
        <path
          v-for="(pathD, i) in staticPaths"
          :key="'stroke-' + i"
          :d="pathD"
          fill="none"
          :stroke="`url(#grad-${uid})`"
          :stroke-width="1.2"
          :opacity="0.2 + (0.8 * i / Math.max(staticPaths.length - 1, 1))"
        />
        <!-- First and last shapes with subtle fill -->
        <path
          :d="staticPaths[0]"
          :fill="`url(#grad-${uid})`"
          :opacity="0.1"
          :filter="filterRef"
        />
        <path
          :d="staticPaths[staticPaths.length - 1]"
          :fill="`url(#grad-${uid})`"
          :opacity="0.15"
          :filter="filterRef"
        />
      </template>

      <!-- Animated mode: single morphing path -->
      <template v-if="isAnimating">
        <path
          :d="animatedPath"
          :fill="`url(#grad-${uid})`"
          :filter="filterRef"
        />
      </template>

      <!-- After animation: show final shape -->
      <template v-if="animate && !isAnimating && !showStatic">
        <path
          :d="staticPaths[staticPaths.length - 1]"
          :fill="`url(#grad-${uid})`"
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
</style>
