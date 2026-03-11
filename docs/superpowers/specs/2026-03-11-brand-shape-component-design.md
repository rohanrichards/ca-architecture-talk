# BrandShape Component — Design Spec

## Overview

A generative Vue component for the Portable Slidev theme that renders brand shapes with morphing transitions, narrative gradients, and photographic post-processing effects. Encodes Portable's brand guidelines as a programmable system rather than static assets.

## Context

Portable's brand refresh defines:
- 12 base shapes (4 primitive, 4 organic, 4 angular) exported as SVG paths
- A morphing system that blends between shapes in 5-15 steps, creating wireframe transition patterns ("making change visible")
- Angular gradients with three narrative colours: current state, catalyst, future state — where the catalyst is minimal ("subtle actions spark meaningful change")
- Noise + blur post-processing to make shapes feel "human, organic, and three-dimensional"

This component brings all four systems together in a single, prop-driven Vue component for use in Slidev presentations.

## Architecture

Three standalone modules + one Vue component:

### 1. Shape Library (`shapes.ts`)

Map of all 12 shapes with metadata:

```ts
type ShapeCategory = 'primitive' | 'organic' | 'angular'
type ShapeName = 'primitive-1' | 'primitive-2' | ... | 'angular-4'

interface ShapeDefinition {
  path: string        // raw SVG d attribute
  category: ShapeCategory
  viewBox: string     // original viewBox
}

export const shapes: Record<ShapeName, ShapeDefinition>
```

Paths are extracted directly from the 12 exported SVGs (Vector.svg through Vector-11.svg). Shapes are normalized to a common coordinate space (200x200) before morphing.

### 2. Morph Engine (`morph.ts`)

Uses `flubber` library to interpolate between two SVG paths.

```ts
function generateMorphSteps(fromPath: string, toPath: string, steps: number): string[]
```

- Normalizes both paths to common coordinate space
- Uses flubber's `interpolate()` to create a t→path function
- Samples at evenly-spaced t values (0 to 1) for the requested step count
- Returns array of path strings for all intermediate states

Static mode: renders all steps as stroked outlines in a single SVG.
Animated mode: sweeps t from 0→1 over a duration using requestAnimationFrame.

### 3. Gradient & Effects (`effects.ts`)

**Gradient:** Builds an SVG conic/angular gradient with three stops:
- Current state (dominant, ~45% of arc)
- Catalyst (minimal, ~10% of arc)
- Future state (~45% of arc)

Colour resolution: any colour token from the brand system (e.g. `pink-dark`, `lime`, `blue-light`).

Convenience shorthand: `scheme="lime"` auto-maps to lime-dark → lime (mid) → lime-light.

**Noise:** SVG `<feTurbulence>` filter — subtle film grain.
**Blur:** SVG `<feGaussianBlur>` filter — selective edge blur for depth.

### 4. BrandShape Component (`BrandShape.vue`)

Ties all three modules together. Renders an SVG element with:
- All morph step paths as `<path>` elements (stroked outlines for wireframe look)
- Gradient applied as fill to the from/to shapes (or all steps)
- Filter defs for noise and blur
- Optional animation on trigger

## Props API

```ts
interface BrandShapeProps {
  // Shape selection
  from: ShapeName
  to: ShapeName

  // Morph
  steps?: number              // 5-15, default 8

  // Colour — shorthand
  scheme?: ColourFamily       // 'lime' | 'pink' | 'blue' | 'vermillion' | 'brown'

  // Colour — explicit (overrides scheme)
  current?: ColourToken       // e.g. 'pink-dark', 'lime', 'blue-light'
  catalyst?: ColourToken
  future?: ColourToken

  // Effects
  noise?: boolean             // default true
  blur?: boolean              // default true

  // Animation
  animate?: boolean           // default false (static wireframe)
  trigger?: 'enter' | 'click' // default 'enter'
  duration?: number           // ms, default 1500

  // Layout
  size?: string               // CSS value, default '400px'
  position?: string           // CSS position for absolute placement
}
```

## Usage Examples

```md
<!-- Simple: static wireframe with lime gradient -->
<BrandShape from="primitive-1" to="angular-2" scheme="lime" />

<!-- Animated morph on slide enter -->
<BrandShape from="organic-1" to="organic-3" scheme="pink" :animate="true" />

<!-- Cross-family gradient, more morph steps -->
<BrandShape
  from="primitive-2"
  to="angular-4"
  current="pink-dark"
  catalyst="lime"
  future="blue-light"
  :steps="12"
/>

<!-- Positioned as decorative element -->
<BrandShape
  from="organic-2"
  to="angular-1"
  scheme="vermillion"
  size="500px"
  position="top right"
  :animate="true"
  trigger="click"
/>
```

## Dependencies

- `flubber` — SVG path interpolation (MIT license, ~15KB)

## Scope (Vertical Slice)

- All 12 base shapes
- All 5 colour families + arbitrary cross-family gradients
- Static wireframe mode + animated mode
- Noise and blur SVG filters
- Single component, usable in Slidev markdown

## Out of Scope (Future)

- Procedurally generated shapes (beyond the 12 base shapes)
- Gradient animation (current→catalyst→future transitioning over time)
- Cropped/full-bleed background mode
- Shape randomization helpers
