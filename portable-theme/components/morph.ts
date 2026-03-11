/*
 * PORTABLE BRAND — Morph Engine
 *
 * Uses flubber to interpolate between two SVG paths.
 * Produces the wireframe transition patterns from the
 * brand guidelines (Shapes & Patterns PDF).
 *
 * Steps clamped to 5-15 per brand rules.
 */
import { interpolate } from 'flubber'

const MIN_STEPS = 5
const MAX_STEPS = 15

export interface MorphResult {
  steps: string[]
  interpolator: (t: number) => string
}

export function generateMorphSteps(
  fromPath: string,
  toPath: string,
  stepCount: number,
): MorphResult {
  const clampedSteps = Math.min(MAX_STEPS, Math.max(MIN_STEPS, stepCount))

  const interpolator = interpolate(fromPath, toPath, {
    maxSegmentLength: 10,
  })

  const steps: string[] = []
  for (let i = 0; i < clampedSteps; i++) {
    const t = clampedSteps === 1 ? 0 : i / (clampedSteps - 1)
    steps.push(interpolator(t))
  }

  return { steps, interpolator }
}
