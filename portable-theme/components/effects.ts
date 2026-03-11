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

/**
 * Interpolate between two hex colours at position t (0-1).
 */
export function lerpColour(colA: string, colB: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  const [r1, g1, b1] = parse(colA)
  const [r2, g2, b2] = parse(colB)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

/**
 * Generate an array of fill colours for morph steps.
 * Each step samples the current→catalyst→future narrative at its position.
 * Catalyst occupies the narrow middle band (~10%), matching the gradient spec.
 */
export function generateStepFills(
  current: string,
  catalyst: string,
  future: string,
  stepCount: number,
): string[] {
  const fills: string[] = []
  for (let i = 0; i < stepCount; i++) {
    const t = stepCount === 1 ? 0 : i / (stepCount - 1)
    let colour: string
    if (t <= 0.45) {
      // Current → catalyst
      colour = lerpColour(current, catalyst, t / 0.45)
    } else if (t <= 0.55) {
      // Catalyst band
      colour = catalyst
    } else {
      // Catalyst → future
      colour = lerpColour(catalyst, future, (t - 0.55) / 0.45)
    }
    fills.push(colour)
  }
  return fills
}

interface GradientOptions {
  id: string
  current: string
  catalyst: string
  future: string
}

/**
 * SVG linear gradient for the wireframe variant's stroke colour.
 * Uses a simple diagonal sweep: current → catalyst → future.
 * Only used for wireframe strokes — filled/gradient variants use CSS conic-gradient.
 */
export function buildGradientDef(options: GradientOptions): string {
  const { id, current, catalyst, future } = options
  return `<linearGradient id="${id}" x1="0" y1="0" x2="190" y2="160" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="${current}" />
  <stop offset="0.45" stop-color="${catalyst}" />
  <stop offset="0.55" stop-color="${catalyst}" />
  <stop offset="1" stop-color="${future}" />
</linearGradient>`
}

/**
 * CSS conic-gradient string matching the brand's angular gradient style.
 *
 * The Figma brand exports use GRADIENT_ANGULAR (conic) gradients, not radial.
 * Colours sweep around the shape centre creating natural colour bands.
 *
 * Stop positions derived from the brand's gradient examples.svg:
 * - current: dominant, occupying the wide arc (~53% of sweep)
 * - future: secondary colour band (~30%)
 * - catalyst: narrow transitional accent (~17%)
 *
 * This produces the characteristic colour-sweep look from the brand guidelines,
 * rather than the bright-center radial orb.
 */
export function buildConicGradientCSS(
  current: string,
  catalyst: string,
  future: string,
  angleDeg: number = 90,
  centerX: number = 50,
  centerY: number = 50,
): string {
  return `conic-gradient(from ${angleDeg}deg at ${centerX}% ${centerY}%, ${current} 0deg, ${future} 110deg, ${catalyst} 170deg, ${current} 360deg)`
}

/**
 * Subtle film grain noise filter.
 * Very fine grain (baseFrequency 4.5+) mixed at low opacity via feColorMatrix.
 * The noise is overlaid rather than multiplied, so it adds texture
 * without washing out or desaturating the fill colours.
 * Clipped to shape alpha via feComposite.
 */
export function buildNoiseDef(id: string): string {
  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="4.5" numOctaves="4" stitchTiles="stitch" result="noise" />
  <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
  <feColorMatrix type="matrix" in="grayNoise" result="subtleNoise"
    values="1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 0.12 0" />
  <feBlend in="SourceGraphic" in2="subtleNoise" mode="overlay" result="noisy" />
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
