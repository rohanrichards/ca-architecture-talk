import { describe, it, expect } from 'vitest'
import { resolveColour, resolveScheme, type ColourFamily } from '../components/colours'

describe('resolveColour', () => {
  it('resolves primary mid-tone tokens', () => {
    expect(resolveColour('lime')).toBe('#BEF958')
    expect(resolveColour('pink')).toBe('#FF38C0')
    expect(resolveColour('blue')).toBe('#4B01E6')
    expect(resolveColour('vermillion')).toBe('#EE4811')
    expect(resolveColour('brown')).toBe('#81330C')
  })

  it('resolves dark variant tokens', () => {
    expect(resolveColour('lime-dark')).toBe('#263212')
    expect(resolveColour('blue-dark')).toBe('#170045')
  })

  it('resolves light variant tokens', () => {
    expect(resolveColour('lime-light')).toBe('#EDFFCC')
    expect(resolveColour('pink-light')).toBe('#FFC3F6')
  })

  it('resolves white', () => {
    expect(resolveColour('white')).toBe('#FFFFFF')
  })
})

describe('resolveScheme', () => {
  it('maps lime scheme to dark/mid/light', () => {
    const result = resolveScheme('lime')
    expect(result).toEqual({
      current: '#263212',
      catalyst: '#BEF958',
      future: '#EDFFCC',
    })
  })

  it('maps blue scheme to dark/mid/light', () => {
    const result = resolveScheme('blue')
    expect(result).toEqual({
      current: '#170045',
      catalyst: '#4B01E6',
      future: '#DEDAFF',
    })
  })

  it('maps all 5 families', () => {
    const families: ColourFamily[] = ['lime', 'pink', 'blue', 'vermillion', 'brown']
    for (const family of families) {
      const result = resolveScheme(family)
      expect(result.current).toBeTruthy()
      expect(result.catalyst).toBeTruthy()
      expect(result.future).toBeTruthy()
    }
  })
})
