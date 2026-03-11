import { describe, it, expect } from 'vitest'
import { buildGradientDef, buildNoiseDef, buildBlurDef, buildConicGradientCSS } from '../components/effects'

describe('buildGradientDef', () => {
  it('returns SVG linear gradient with three stop colours', () => {
    const svg = buildGradientDef({
      id: 'grad-1',
      current: '#263212',
      catalyst: '#BEF958',
      future: '#EDFFCC',
    })
    expect(svg).toContain('<linearGradient')
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

describe('buildConicGradientCSS', () => {
  it('returns CSS conic-gradient string with all three colours', () => {
    const css = buildConicGradientCSS('#263212', '#BEF958', '#EDFFCC')
    expect(css).toContain('conic-gradient')
    expect(css).toContain('#263212')
    expect(css).toContain('#BEF958')
    expect(css).toContain('#EDFFCC')
  })

  it('defaults to 90deg start angle', () => {
    const css = buildConicGradientCSS('#263212', '#BEF958', '#EDFFCC')
    expect(css).toContain('from 90deg')
  })

  it('accepts custom start angle', () => {
    const css = buildConicGradientCSS('#263212', '#BEF958', '#EDFFCC', 180)
    expect(css).toContain('from 180deg')
  })

  it('produces a complete sweep back to current at 360deg', () => {
    const css = buildConicGradientCSS('#263212', '#BEF958', '#EDFFCC')
    expect(css).toContain('#263212 0deg')
    expect(css).toContain('#263212 360deg')
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
