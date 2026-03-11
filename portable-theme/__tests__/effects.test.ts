import { describe, it, expect } from 'vitest'
import { buildGradientDef, buildNoiseDef, buildBlurDef } from '../components/effects'

describe('buildGradientDef', () => {
  it('returns SVG gradient with three stop colours', () => {
    const svg = buildGradientDef({
      id: 'grad-1',
      current: '#263212',
      catalyst: '#BEF958',
      future: '#EDFFCC',
    })
    expect(svg).toContain('<stop')
    expect(svg).toContain('#263212')
    expect(svg).toContain('#BEF958')
    expect(svg).toContain('#EDFFCC')
    expect(svg).toContain('id="grad-1"')
  })

  it('catalyst occupies narrow band at 45-55%', () => {
    const svg = buildGradientDef({
      id: 'grad-1',
      current: '#263212',
      catalyst: '#BEF958',
      future: '#EDFFCC',
    })
    expect(svg).toContain('offset="0.45"')
    expect(svg).toContain('offset="0.55"')
  })
})

describe('buildNoiseDef', () => {
  it('returns feTurbulence filter', () => {
    const svg = buildNoiseDef('noise-1')
    expect(svg).toContain('<filter')
    expect(svg).toContain('id="noise-1"')
    expect(svg).toContain('feTurbulence')
  })
})

describe('buildBlurDef', () => {
  it('returns feGaussianBlur filter', () => {
    const svg = buildBlurDef('blur-1')
    expect(svg).toContain('<filter')
    expect(svg).toContain('id="blur-1"')
    expect(svg).toContain('feGaussianBlur')
  })
})
