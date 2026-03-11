# BrandShape Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a generative Vue component that renders Portable's brand shapes with morphing, narrative gradients, and noise/blur effects.

**Architecture:** Three pure TypeScript modules (shapes, morph, effects) provide the data and logic. One Vue component (`BrandShape.vue`) composes them into a renderable SVG. The modules are independently testable; the component is verified visually in Slidev.

**Tech Stack:** Vue 3 (via Slidev), TypeScript, flubber (path interpolation), SVG filters, vitest

---

## File Structure

```
portable-theme/
├── components/
│   ├── BrandShape.vue      # Main component — composes all modules into SVG
│   ├── shapes.ts           # 12 base shape paths with metadata
│   ├── colours.ts          # Colour token resolution + scheme mappings
│   ├── morph.ts            # Flubber-based path interpolation
│   └── effects.ts          # SVG gradient/filter def generators
├── __tests__/
│   ├── shapes.test.ts      # Shape library lookups
│   ├── colours.test.ts     # Token resolution + scheme expansion
│   ├── morph.test.ts       # Morph step generation
│   └── effects.test.ts     # SVG def structure
```

---

## Chunk 1: Foundation — Setup, Shapes, Colours

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install flubber and vitest**

```bash
cd F:/Documents/GitHub/ca-architecture-talk
npm install flubber
npm install -D vitest @types/node
```

- [ ] **Step 2: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts` at project root:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['portable-theme/__tests__/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Verify vitest runs (no tests yet)**

Run: `npx vitest run`
Expected: "No test files found"

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "add flubber and vitest dependencies"
```

---

### Task 2: Shape Library

**Files:**
- Create: `portable-theme/components/shapes.ts`
- Create: `portable-theme/__tests__/shapes.test.ts`

- [ ] **Step 1: Write failing tests for shape library**

```ts
// portable-theme/__tests__/shapes.test.ts
import { describe, it, expect } from 'vitest'
import { shapes, getShape, shapeNames, type ShapeName } from '../components/shapes'

describe('shapes', () => {
  it('exports exactly 12 shapes', () => {
    expect(Object.keys(shapes)).toHaveLength(12)
  })

  it('has 4 primitive shapes', () => {
    const primitives = Object.values(shapes).filter(s => s.category === 'primitive')
    expect(primitives).toHaveLength(4)
  })

  it('has 4 organic shapes', () => {
    const organics = Object.values(shapes).filter(s => s.category === 'organic')
    expect(organics).toHaveLength(4)
  })

  it('has 4 angular shapes', () => {
    const angulars = Object.values(shapes).filter(s => s.category === 'angular')
    expect(angulars).toHaveLength(4)
  })

  it('each shape has a non-empty path string', () => {
    for (const [name, shape] of Object.entries(shapes)) {
      expect(shape.path, `${name} path`).toBeTruthy()
      expect(shape.path.startsWith('M'), `${name} path starts with M`).toBe(true)
    }
  })

  it('each shape has a viewBox', () => {
    for (const [name, shape] of Object.entries(shapes)) {
      expect(shape.viewBox, `${name} viewBox`).toMatch(/^\d+ \d+ \d+ \d+$/)
    }
  })

  it('getShape returns correct shape by name', () => {
    const shape = getShape('primitive-1')
    expect(shape.category).toBe('primitive')
    expect(shape.path).toBeTruthy()
  })

  it('shapeNames lists all 12 names', () => {
    expect(shapeNames).toHaveLength(12)
    expect(shapeNames).toContain('primitive-1')
    expect(shapeNames).toContain('organic-4')
    expect(shapeNames).toContain('angular-4')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `../components/shapes`

- [ ] **Step 3: Implement shapes.ts**

Create `portable-theme/components/shapes.ts` with all 12 shape paths extracted from the SVG files in `theme_resources/base_shapes/`. Each path is the raw `d` attribute from the corresponding SVG.

Mapping (from brand guidelines shapes & patterns PDF — fig numbers):
- `primitive-1` = Vector.svg (fig 1)
- `primitive-2` = Vector-1.svg (fig 2)
- `primitive-3` = Vector-2.svg (fig 3)
- `primitive-4` = Vector-3.svg (fig 4)
- `organic-1` = Vector-4.svg (fig 5)
- `organic-2` = Vector-5.svg (fig 6)
- `organic-3` = Vector-6.svg (fig 7)
- `organic-4` = Vector-7.svg (fig 8)
- `angular-1` = Vector-8.svg (fig 9)
- `angular-2` = Vector-9.svg (fig 10)
- `angular-3` = Vector-10.svg (fig 11)
- `angular-4` = Vector-11.svg (fig 12)

```ts
// portable-theme/components/shapes.ts

export type ShapeCategory = 'primitive' | 'organic' | 'angular'

export type ShapeName =
  | 'primitive-1' | 'primitive-2' | 'primitive-3' | 'primitive-4'
  | 'organic-1' | 'organic-2' | 'organic-3' | 'organic-4'
  | 'angular-1' | 'angular-2' | 'angular-3' | 'angular-4'

export interface ShapeDefinition {
  path: string
  category: ShapeCategory
  viewBox: string
}

export const shapes: Record<ShapeName, ShapeDefinition> = {
  'primitive-1': {
    category: 'primitive',
    viewBox: '0 0 99 92',
    path: 'M0.00505198 45.1508C-0.391279 16.8457 22.6306 4.22845 34.1868 1.45796C80.2933 -5.27636 99.4911 11.8421 98.9905 41.9964C98.4898 72.1508 76.1492 92.4934 48.6772 91.9909C21.1983 91.4884 0.50568 80.5321 0.00505198 45.1438V45.1508Z',
  },
  'primitive-2': {
    category: 'primitive',
    viewBox: '0 0 164 94',
    path: 'M7.05457 90.5171C-0.772536 82.6684 -3.80878 13.9434 7.05457 3.44804C11.7386 -1.07294 27.225 0.151018 43.2072 0.151018C65.2391 0.151018 78.5284 7.17347 88.0873 13.3621C97.6537 19.5507 105.122 22.4423 114.277 25.3262C123.424 28.2178 140.047 27.8047 154.587 40.182C169.127 52.5592 164.977 67.828 154.587 77.3137C144.197 86.7993 128.001 80.6107 119.67 77.3137C111.363 74.0166 102.216 71.125 88.0873 70.2912C73.9664 69.4574 77.2773 71.1251 46.9377 85.5601C22.6707 97.1188 11.2656 94.7473 7.04693 90.5171H7.05457Z',
  },
  'primitive-3': {
    category: 'primitive',
    viewBox: '0 0 160 71',
    path: 'M121.864 27.6685C146.76 38.5317 161.934 53.4921 159.801 60.9213C157.669 68.3505 148.411 68.342 136.902 70.3736C122.516 72.9066 99.6246 67.883 57.5916 53.0161C15.5586 38.1492 -2.68652 21.0638 0.317651 8.5345C3.32182 -4.00331 24.0972 0.144795 46.3957 3.11987C68.6943 6.09494 90.739 14.0936 121.864 27.6685Z',
  },
  'primitive-4': {
    category: 'primitive',
    viewBox: '0 0 118 103',
    path: 'M5.96826 58.0875C12.4114 61.8322 31.2659 72.9272 40.0928 88.3057C48.9198 103.684 60.8906 106.021 71.6263 99.7917C82.8457 93.2059 99.6186 83.3185 109.016 77.8622C118.413 72.4059 120.65 62.4056 114.725 56.4367C101.173 42.8046 84.0116 28.5904 74.7874 12.5169C63.9308 -6.40641 51.7181 0.683301 44.869 4.67127L44.7827 4.7234C34.2197 12.4387 11.3404 29.6417 4.32724 36.6967C-2.68595 43.7516 -0.474901 54.3515 5.96826 58.0962V58.0875Z',
  },
  'organic-1': {
    category: 'organic',
    viewBox: '0 0 164 104',
    path: 'M75.3752 3.77916C91.8622 8.7361 94.396 44.7448 98.5631 47.1558C102.73 49.5667 108.356 50.2555 110.93 26.5041C113.504 2.75266 122.262 3.78591 141.847 6.36568C159.483 8.68882 164 38.2414 164 62.1346C164 91.5656 152.151 96.7319 132.054 91.5656C115.373 87.2773 119.177 78.66 98.5631 81.753C90.4104 82.9754 103.201 102.405 71.2552 102.405C60.4342 103.607 34.1612 105.295 15.6109 102.405C-2.93937 99.5143 0.495123 93.4566 0.152346 85.3661C-0.190432 77.2756 0.152346 50.681 0.152346 23.4043C0.152346 6.36568 3.24406 0.166128 15.6109 0.166128C30.552 0.166128 58.8883 -1.17778 75.3752 3.77916Z',
  },
  'organic-2': {
    category: 'organic',
    viewBox: '0 0 161 106',
    path: 'M136.908 2.41076C158.53 7.32686 161.871 39.2815 160.834 54.6443C160.834 94.5876 143.918 106 116.527 106C93.0445 106 81.5247 84.931 49.6238 84.931C34.3999 84.931 29.6856 99.4159 16.8366 101.611C3.98762 103.805 0 93.7098 0 48.9381C0 4.16651 6.64604 2.41076 16.8366 2.41076C27.0272 2.41076 31.901 7.67801 39.4332 14.701C46.9653 21.724 62.8095 25.7447 81.5247 14.701C102.349 2.41076 109.881 -3.73436 136.908 2.41076Z',
  },
  'organic-3': {
    category: 'organic',
    viewBox: '0 0 144 142',
    path: 'M23.4258 18.0774C48.8343 23.4936 65.0908 19.1823 86.3436 6.41791C105.773 -5.24157 124.402 1.54398 128.714 6.78397C146.658 28.6252 130.747 38.068 116.504 61.7598C100.505 88.3665 122.158 83.018 137.974 106.744C148.699 122.843 145.933 144.684 122.978 141.729C100.031 138.773 70.9887 133.222 73.7546 104.907C75.646 85.6278 63.7622 79.7303 48.5835 80.8488C33.4049 81.9673 14.4571 99.6531 5.09501 77.5136C-2.47736 59.5431 -5.26375 11.9765 23.4258 18.0842V18.0774Z',
  },
  'organic-4': {
    category: 'organic',
    viewBox: '0 0 169 149',
    path: 'M104.893 135.145C156.977 112.621 72.5538 69.0265 117.055 83.7421C183.591 105.723 201.497 11.0288 77.8822 63.4438C157.918 2.89843 143.392 -12.323 90.7091 9.3365C38.9399 30.6097 16.7399 42.4833 6.26787 73.5883C-4.19494 104.693 -7.24236 176.073 43.7511 138.18C80.6711 110.754 77.5313 146.964 104.893 135.136V135.145Z',
  },
  'angular-1': {
    category: 'angular',
    viewBox: '0 0 116 122',
    path: 'M5.54936 0.31744C2.77127 -0.849108 -0.250338 1.35837 0.0164129 4.35961L10.1423 118.287C10.3823 120.987 13.1814 122.672 15.6794 121.619L63.345 101.541C64.0991 101.223 64.9325 101.144 65.7327 101.315L98.5441 108.318C101.913 109.037 104.555 105.445 102.864 102.443L85.0921 70.8852C84.3195 69.5134 84.4236 67.8158 85.358 66.5486L114.402 27.1592C116.557 24.2365 114.016 20.1857 110.447 20.8536L72.8944 27.8808C72.1255 28.0247 71.3312 27.94 70.61 27.6371L5.54936 0.31744Z',
  },
  'angular-2': {
    category: 'angular',
    viewBox: '0 0 103 143',
    path: 'M35.6138 87.8128C36.35 88.2758 36.9152 88.9661 37.2239 89.7791L56.2504 139.898C57.032 141.957 59.3306 142.997 61.3929 142.224L100.247 127.673C101.809 127.088 102.844 125.595 102.844 123.927V71.0644C102.844 70.1134 102.505 69.1935 101.888 68.4697L76.1483 38.2719C75.8772 37.9539 75.6576 37.5954 75.4976 37.2094L61.0902 2.46877C59.9643 -0.245991 56.3933 -0.860339 54.4249 1.32211L1.02965 60.5256C-0.633708 62.3699 -0.231883 65.2684 1.87047 66.5906L35.6138 87.8128Z',
  },
  'angular-3': {
    category: 'angular',
    viewBox: '0 0 131 128',
    path: 'M24.452 15.6996C20.9536 14.7962 18.1452 18.6268 20.0592 21.6914L35.5662 46.5214C36.4198 47.8882 36.3699 49.6338 35.4395 50.9496L0.736985 100.027C-0.956373 102.422 0.418066 105.764 3.30624 106.275L125.688 127.924C128.625 128.443 131.076 125.683 130.214 122.828L109.647 54.7418C109.428 54.0177 109.42 53.2464 109.621 52.5174L122.761 5.07954C123.701 1.68627 120.115 -1.17834 117.013 0.488133L69.2232 26.1647C68.337 26.6408 67.304 26.7656 66.3299 26.514L24.452 15.6996Z',
  },
  'angular-4': {
    category: 'angular',
    viewBox: '0 0 127 123',
    path: 'M9.60605 62.9879C8.93452 63.6006 8.49171 64.4237 8.35057 65.3217L0.0497166 118.136C-0.386907 120.914 2.10372 123.264 4.85158 122.666L85.073 105.212C85.7821 105.058 86.4359 104.714 86.9643 104.216L125.022 68.3925C127.032 66.4997 126.566 63.1871 124.11 61.9234L87.9908 43.3334C87.2198 42.9366 86.5987 42.3 86.2209 41.5196L67.216 2.25731C65.8624 -0.53916 61.9765 -0.792209 60.2717 1.80509L36.0717 38.6723C35.8883 38.9517 35.6706 39.207 35.4238 39.4323L9.60605 62.9879Z',
  },
}

export const shapeNames = Object.keys(shapes) as ShapeName[]

export function getShape(name: ShapeName): ShapeDefinition {
  return shapes[name]
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: All 8 tests pass

- [ ] **Step 5: Commit**

```bash
git add portable-theme/components/shapes.ts portable-theme/__tests__/shapes.test.ts
git commit -m "add shape library with all 12 brand shapes"
```

---

### Task 3: Colour Token Resolution

**Files:**
- Create: `portable-theme/components/colours.ts`
- Create: `portable-theme/__tests__/colours.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// portable-theme/__tests__/colours.test.ts
import { describe, it, expect } from 'vitest'
import { resolveColour, resolveScheme, type ColourToken, type ColourFamily } from '../components/colours'

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `../components/colours`

- [ ] **Step 3: Implement colours.ts**

```ts
// portable-theme/components/colours.ts

export type ColourFamily = 'lime' | 'pink' | 'blue' | 'vermillion' | 'brown'

export type ColourToken =
  | ColourFamily
  | `${ColourFamily}-dark`
  | `${ColourFamily}-light`
  | 'white'

export interface GradientColours {
  current: string
  catalyst: string
  future: string
}

const colourMap: Record<ColourToken, string> = {
  'white': '#FFFFFF',

  'lime': '#BEF958',
  'lime-dark': '#263212',
  'lime-light': '#EDFFCC',

  'brown': '#81330C',
  'brown-dark': '#341405',
  'brown-light': '#EFD8C2',

  'pink': '#FF38C0',
  'pink-dark': '#400E30',
  'pink-light': '#FFC3F6',

  'vermillion': '#EE4811',
  'vermillion-dark': '#471605',
  'vermillion-light': '#FFC6BF',

  'blue': '#4B01E6',
  'blue-dark': '#170045',
  'blue-light': '#DEDAFF',
}

export function resolveColour(token: ColourToken): string {
  return colourMap[token]
}

export function resolveScheme(family: ColourFamily): GradientColours {
  return {
    current: colourMap[`${family}-dark`],
    catalyst: colourMap[family],
    future: colourMap[`${family}-light`],
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add portable-theme/components/colours.ts portable-theme/__tests__/colours.test.ts
git commit -m "add colour token resolution and scheme mapping"
```

---

## Chunk 2: Processing — Morph Engine + Effects

### Task 4: Morph Engine

**Files:**
- Create: `portable-theme/components/morph.ts`
- Create: `portable-theme/__tests__/morph.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// portable-theme/__tests__/morph.test.ts
import { describe, it, expect } from 'vitest'
import { generateMorphSteps } from '../components/morph'
import { getShape } from '../components/shapes'

describe('generateMorphSteps', () => {
  const fromPath = getShape('primitive-1').path
  const toPath = getShape('angular-1').path

  it('returns the requested number of steps', () => {
    const steps = generateMorphSteps(fromPath, toPath, 5)
    expect(steps).toHaveLength(5)
  })

  it('first step resembles the from shape', () => {
    const steps = generateMorphSteps(fromPath, toPath, 5)
    expect(steps[0]).toMatch(/^M/)
  })

  it('last step resembles the to shape', () => {
    const steps = generateMorphSteps(fromPath, toPath, 5)
    expect(steps[steps.length - 1]).toMatch(/^M/)
  })

  it('all intermediate steps are valid SVG paths', () => {
    const steps = generateMorphSteps(fromPath, toPath, 8)
    for (const step of steps) {
      expect(step).toMatch(/^M/)
      expect(step.length).toBeGreaterThan(10)
    }
  })

  it('respects min/max step constraints (clamps to 5-15)', () => {
    const tooFew = generateMorphSteps(fromPath, toPath, 2)
    expect(tooFew).toHaveLength(5)

    const tooMany = generateMorphSteps(fromPath, toPath, 30)
    expect(tooMany).toHaveLength(15)
  })

  it('creates an interpolator function', () => {
    // Test the lower-level API for animation use
    const { interpolator } = generateMorphSteps(fromPath, toPath, 8, { returnInterpolator: true })
    expect(typeof interpolator).toBe('function')
    const midPath = interpolator(0.5)
    expect(midPath).toMatch(/^M/)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `../components/morph`

- [ ] **Step 3: Implement morph.ts**

```ts
// portable-theme/components/morph.ts
import { interpolate } from 'flubber'

interface MorphOptions {
  returnInterpolator?: boolean
}

interface MorphResult {
  steps: string[]
  interpolator: (t: number) => string
}

const MIN_STEPS = 5
const MAX_STEPS = 15

export function generateMorphSteps(
  fromPath: string,
  toPath: string,
  stepCount: number,
  options?: MorphOptions,
): MorphResult | string[] {
  const clampedSteps = Math.min(MAX_STEPS, Math.max(MIN_STEPS, stepCount))

  const interpolator = interpolate(fromPath, toPath, {
    maxSegmentLength: 10,
  })

  const steps: string[] = []
  for (let i = 0; i < clampedSteps; i++) {
    const t = clampedSteps === 1 ? 0 : i / (clampedSteps - 1)
    steps.push(interpolator(t))
  }

  if (options?.returnInterpolator) {
    return { steps, interpolator }
  }

  return steps
}
```

Note: The test for `returnInterpolator` destructures the result, so we need to handle the overloaded return type. Update the test to match:

```ts
  it('creates an interpolator function when requested', () => {
    const result = generateMorphSteps(fromPath, toPath, 8, { returnInterpolator: true }) as MorphResult
    expect(typeof result.interpolator).toBe('function')
    const midPath = result.interpolator(0.5)
    expect(midPath).toMatch(/^M/)
  })
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: All morph tests pass

- [ ] **Step 5: Commit**

```bash
git add portable-theme/components/morph.ts portable-theme/__tests__/morph.test.ts
git commit -m "add morph engine using flubber path interpolation"
```

---

### Task 5: Effects — Gradient and SVG Filters

**Files:**
- Create: `portable-theme/components/effects.ts`
- Create: `portable-theme/__tests__/effects.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// portable-theme/__tests__/effects.test.ts
import { describe, it, expect } from 'vitest'
import { buildGradientDef, buildNoiseDef, buildBlurDef } from '../components/effects'

describe('buildGradientDef', () => {
  it('returns SVG conicGradient markup with three stops', () => {
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

  it('catalyst stop occupies a narrow band (~10%)', () => {
    const svg = buildGradientDef({
      id: 'grad-1',
      current: '#263212',
      catalyst: '#BEF958',
      future: '#EDFFCC',
    })
    // Catalyst should be around 45-55% range (narrow band in middle)
    expect(svg).toContain('offset="0.45"')
    expect(svg).toContain('offset="0.55"')
  })
})

describe('buildNoiseDef', () => {
  it('returns feTurbulence filter markup', () => {
    const svg = buildNoiseDef('noise-1')
    expect(svg).toContain('<filter')
    expect(svg).toContain('id="noise-1"')
    expect(svg).toContain('feTurbulence')
  })
})

describe('buildBlurDef', () => {
  it('returns feGaussianBlur filter markup', () => {
    const svg = buildBlurDef('blur-1')
    expect(svg).toContain('<filter')
    expect(svg).toContain('id="blur-1"')
    expect(svg).toContain('feGaussianBlur')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL — cannot resolve `../components/effects`

- [ ] **Step 3: Implement effects.ts**

```ts
// portable-theme/components/effects.ts

interface GradientOptions {
  id: string
  current: string
  catalyst: string
  future: string
}

/**
 * Builds an SVG linear gradient that approximates an angular/conic gradient.
 * Three colour narrative: current state (dominant) → catalyst (minimal) → future state.
 * The catalyst occupies ~10% of the gradient, per brand guidelines.
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
 * Emulates photographic film stock per brand guidelines.
 */
export function buildNoiseDef(id: string): string {
  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
  <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
  <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="noisy" />
</filter>`
}

/**
 * Selective edge blur for depth/dimension.
 * Emulates photographic depth of field per brand guidelines.
 */
export function buildBlurDef(id: string): string {
  return `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
</filter>`
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: All effects tests pass

- [ ] **Step 5: Commit**

```bash
git add portable-theme/components/effects.ts portable-theme/__tests__/effects.test.ts
git commit -m "add gradient and SVG filter effect generators"
```

---

## Chunk 3: Integration — Vue Component + Demo

### Task 6: BrandShape Vue Component

**Files:**
- Create: `portable-theme/components/BrandShape.vue`

- [ ] **Step 1: Implement BrandShape.vue**

```vue
<!-- portable-theme/components/BrandShape.vue -->
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
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

// Unique ID for SVG defs (gradient, filters)
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
  // Default to lime
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
    { returnInterpolator: true },
  ) as { steps: string[]; interpolator: (t: number) => string }
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

function startAnimation() {
  if (isAnimating.value) return
  isAnimating.value = true

  const interpolator = morphResult.value.interpolator
  const start = performance.now()

  function frame(now: number) {
    const elapsed = now - start
    const t = Math.min(elapsed / props.duration, 1)

    // Ease in-out
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

// Trigger animation on mount if trigger='enter'
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

// Build combined filter reference
const filterRef = computed(() => {
  const filters: string[] = []
  if (props.noise) filters.push(`url(#noise-${uid})`)
  if (props.blur) filters.push(`url(#blur-${uid})`)
  return filters.length ? filters[0] : undefined
})

// Use a generous viewBox that fits all shapes
const viewBox = '0 0 200 160'
</script>

<template>
  <div
    class="brand-shape"
    :style="{ width: size, height: size }"
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
      <template v-if="!animate || !isAnimating">
        <path
          v-for="(pathD, i) in staticPaths"
          :key="i"
          :d="pathD"
          fill="none"
          :stroke="`url(#grad-${uid})`"
          :stroke-width="1"
          :opacity="0.3 + (0.7 * i / (staticPaths.length - 1))"
          :filter="filterRef"
        />
        <!-- First and last shapes filled -->
        <path
          :d="staticPaths[0]"
          :fill="`url(#grad-${uid})`"
          :opacity="0.15"
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
      <template v-if="animate && isAnimating">
        <path
          :d="animatedPath"
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
```

- [ ] **Step 2: Commit**

```bash
git add portable-theme/components/BrandShape.vue
git commit -m "add BrandShape Vue component"
```

---

### Task 7: Demo Slides

**Files:**
- Modify: `demo.md`

- [ ] **Step 1: Add BrandShape demo slides to demo.md**

Append the following slides to the end of `demo.md`:

```md
---

## BrandShape — Static Wireframe

<BrandShape from="primitive-1" to="angular-2" scheme="lime" :steps="8" />

---

## BrandShape — Cross-Family Gradient

<BrandShape
  from="organic-1"
  to="organic-3"
  current="pink-dark"
  catalyst="lime"
  future="blue-light"
  :steps="10"
/>

---

## BrandShape — Animated Morph

<BrandShape
  from="primitive-2"
  to="angular-4"
  scheme="vermillion"
  :steps="8"
  :animate="true"
  trigger="enter"
  :duration="2000"
/>

---

## BrandShape — All Schemes

<div class="grid grid-cols-3 gap-4">
  <BrandShape from="primitive-1" to="organic-1" scheme="lime" size="250px" :steps="6" />
  <BrandShape from="primitive-2" to="organic-2" scheme="pink" size="250px" :steps="6" />
  <BrandShape from="primitive-3" to="organic-3" scheme="blue" size="250px" :steps="6" />
  <BrandShape from="primitive-4" to="angular-1" scheme="vermillion" size="250px" :steps="6" />
  <BrandShape from="organic-4" to="angular-2" scheme="brown" size="250px" :steps="6" />
  <BrandShape from="angular-3" to="angular-4" scheme="lime" size="250px" :steps="6" />
</div>

---
class: blue-dark
---

## BrandShape on Coloured Background

<BrandShape
  from="organic-2"
  to="angular-3"
  current="vermillion-light"
  catalyst="pink"
  future="lime-light"
  size="500px"
  :steps="12"
/>

---

## BrandShape — Click to Morph

Click the shape:

<BrandShape
  from="primitive-1"
  to="angular-4"
  scheme="pink"
  :animate="true"
  trigger="click"
  :duration="1500"
  size="400px"
/>
```

- [ ] **Step 2: Verify in browser**

Run: `npx slidev demo.md` (should already be running — hot reloads)
Navigate to the new slides and verify:
- Static wireframe morph renders with gradient strokes
- Cross-family gradient uses the correct colours
- Animated morph plays on slide enter
- All 5 schemes render correctly
- Click-to-morph responds to click
- Shape on coloured background looks correct

- [ ] **Step 3: Commit**

```bash
git add demo.md
git commit -m "add BrandShape demo slides"
```

---

### Task 8: Visual Verification & Fixes

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Check Slidev dev server**

Open http://localhost:3030/ and navigate through all slides. Fix any visual issues:
- Shapes rendering at correct size
- Gradients applying to strokes/fills
- Noise filter visible but subtle
- Animation smooth and correctly eased
- No console errors

- [ ] **Step 3: Final commit if fixes needed**

```bash
git add -A
git commit -m "fix visual issues from BrandShape integration"
```
