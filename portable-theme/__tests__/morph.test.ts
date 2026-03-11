import { describe, it, expect } from 'vitest'
import { generateMorphSteps } from '../components/morph'
import { getShape } from '../components/shapes'

describe('generateMorphSteps', () => {
  const fromPath = getShape('primitive-1').path
  const toPath = getShape('angular-1').path

  it('returns the requested number of steps', () => {
    const result = generateMorphSteps(fromPath, toPath, 5)
    expect(result.steps).toHaveLength(5)
  })

  it('first step is a valid SVG path', () => {
    const result = generateMorphSteps(fromPath, toPath, 5)
    expect(result.steps[0]).toMatch(/^M/)
  })

  it('last step is a valid SVG path', () => {
    const result = generateMorphSteps(fromPath, toPath, 5)
    expect(result.steps[result.steps.length - 1]).toMatch(/^M/)
  })

  it('all intermediate steps are valid SVG paths', () => {
    const result = generateMorphSteps(fromPath, toPath, 8)
    for (const step of result.steps) {
      expect(step).toMatch(/^M/)
      expect(step.length).toBeGreaterThan(10)
    }
  })

  it('clamps steps to minimum of 5', () => {
    const result = generateMorphSteps(fromPath, toPath, 2)
    expect(result.steps).toHaveLength(5)
  })

  it('clamps steps to maximum of 15', () => {
    const result = generateMorphSteps(fromPath, toPath, 30)
    expect(result.steps).toHaveLength(15)
  })

  it('returns a working interpolator function', () => {
    const result = generateMorphSteps(fromPath, toPath, 8)
    expect(typeof result.interpolator).toBe('function')
    const midPath = result.interpolator(0.5)
    expect(midPath).toMatch(/^M/)
  })
})
