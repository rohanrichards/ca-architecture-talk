/*
 * PORTABLE BRAND — Gradient & SVG Filter Effects
 *
 * Narrative gradient: current state → catalyst → future state.
 * Catalyst occupies a narrow ~10% band — "subtle actions spark
 * meaningful change" (Shapes & Colour PDF).
 *
 * Noise: film grain via feTurbulence (Noise & Blur PDF).
 * Blur: selective edge blur via feGaussianBlur (Noise & Blur PDF).
 */

interface GradientOptions {
  id: string
  current: string
  catalyst: string
  future: string
}

/**
 * SVG linear gradient approximating the angular/conic gradient
 * from the brand guidelines. Three-colour narrative with minimal catalyst.
 */
export function buildGradientDef(options: GradientOptions): string {
  const { id, current, catalyst, future } = options
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0" stop-color="${current}" />
  <stop offset="0.45" stop-color="${catalyst}" />
  <stop offset="0.55" stop-color="${catalyst}" />
  <stop offset="1" stop-color="${future}" />
</linearGradient>`
}

/**
 * Subtle film grain noise filter.
 * Uses feComposite to clip the noise to the shape's alpha channel,
 * so it doesn't spill outside the path as a rectangle.
 */
export function buildNoiseDef(id: string): string {
  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
  <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
  <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="noisy" />
  <feComposite in="noisy" in2="SourceGraphic" operator="in" />
</filter>`
}

/**
 * Selective edge blur for depth.
 */
export function buildBlurDef(id: string): string {
  return `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
</filter>`
}
