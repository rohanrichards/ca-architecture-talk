---
theme: ./portable-theme
title: "Portable Theme — Demo Slides"
---

# Portable/

Theme demo slides

---

## Typography Check

### Inter Display on headings

Body text uses **Inter** for readability. Here's a paragraph to see how it flows at body size. We can check weight variations: **bold**, *italic*, and regular.

`Roboto Mono for inline code`

```ts
// Code block check
const portable = {
  brand: 'hyper-chromatic',
  canvas: '#FFFFFF',
  fonts: ['Inter Display', 'Inter', 'Roboto Mono']
}
```

---
layout: cover
---

# Cover Layout

Testing the cover slide with display typography

---
layout: section
---

# Section Divider

---
layout: fact
---

# 5
Primary colours in the system

---
layout: quote
---

# "Unexpected results emerge when different hyper-chromatic colour variations are paired."

Portable Brand Guidelines

---
layout: statement
---

# The catalyst of change

---

## Heading Hierarchy

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Lists & Content

- First item in a list
- Second item with **bold text**
- Third item with `inline code`

1. Ordered item one
2. Ordered item two
3. Ordered item three

> A blockquote to test styling

---

## Two Column Test

<div class="grid grid-cols-2 gap-8">
<div>

### Left Column

Content on the left side to test multi-column layouts.

- Point A
- Point B
- Point C

</div>
<div>

### Right Column

Content on the right side. We'll use this pattern a lot for comparison slides.

- Point D
- Point E
- Point F

</div>
</div>

---
class: blue-dark
---

# Blue Dark

Vermillion Light type on Blue Dark background

`#170045` bg + `#FFCFBF` type

---
class: blue-light
---

# Blue Light

Vermillion Dark type on Blue Light background

`#DEDAFF` bg + `#471605` type

---
class: vermillion-dark
---

# Vermillion Dark

Lime Light type on Vermillion Dark background

`#471605` bg + `#EDFFCC` type

---
class: vermillion-light
---

# Vermillion Light

Lime Dark type on Vermillion Light background

`#FFC6BF` bg + `#263212` type

---
class: brown-dark
---

# Brown Dark

Lime Light type on Brown Dark background

`#341405` bg + `#EDFFCC` type

---
class: brown-light
---

# Brown Light

Lime Dark type on Brown Light background

`#EFD8C2` bg + `#263212` type

---
class: pink-dark
---

# Pink Dark

Lime Light type on Pink Dark background

`#400E30` bg + `#EDFFCC` type

---
class: pink-light
---

# Pink Light

Lime Dark type on Pink Light background

`#FFC3F6` bg + `#263212` type

---
class: lime-dark
---

# Lime Dark

Pink Light type on Lime Dark background

`#263212` bg + `#FFC3F6` type

---
class: lime-light
---

# Lime Light

Pink Dark type on Lime Light background

`#EDFFCC` bg + `#400E30` type

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
clicks: 1
---

## BrandShape — Click to Morph

Advance to play:

<BrandShape
  from="primitive-1"
  to="angular-4"
  scheme="pink"
  :animate="true"
  trigger="click"
  :duration="1500"
  size="400px"
/>

---

## Filled Variant — Stacked Layers

<div class="grid grid-cols-3 gap-4">
  <BrandShape from="organic-3" to="organic-1" scheme="lime" variant="filled" size="280px" :steps="10" />
  <BrandShape from="organic-1" to="organic-3" scheme="pink" variant="filled" size="280px" :steps="10" />
  <BrandShape from="organic-2" to="organic-4" scheme="blue" variant="filled" size="280px" :steps="10" />
</div>

---

## Filled — Cross-Family

<BrandShape
  from="primitive-2"
  to="angular-3"
  current="pink-dark"
  catalyst="vermillion"
  future="blue-light"
  variant="filled"
  size="500px"
  :steps="12"
/>

---

## Filled — Angular Shapes

<div class="grid grid-cols-3 gap-4">
  <BrandShape from="angular-1" to="angular-3" scheme="vermillion" variant="filled" size="280px" :steps="8" />
  <BrandShape from="angular-2" to="angular-4" scheme="brown" variant="filled" size="280px" :steps="8" />
  <BrandShape from="angular-3" to="angular-1" scheme="lime" variant="filled" size="280px" :steps="8" />
</div>

---
class: lime-light
---

## Filled on Coloured Background

<BrandShape
  from="organic-1"
  to="organic-3"
  current="pink-dark"
  catalyst="pink"
  future="vermillion"
  variant="filled"
  size="500px"
  :steps="10"
/>

---
class: blue-dark
---

## Filled on Blue Dark

<BrandShape
  from="organic-2"
  to="angular-1"
  current="vermillion-light"
  catalyst="pink-light"
  future="lime-light"
  variant="filled"
  size="500px"
  :steps="10"
/>

---
class: brown-dark
---

<div class="absolute inset-0">
<BrandShape
  from="organic-1"
  to="organic-3"
  current="brown"
  catalyst="pink-light"
  future="blue"
  variant="gradient"
  :crop="true"
  size="100%"
  :steps="8"
/>
</div>

<div class="absolute bottom-8 left-10 z-10">

## Gradient — Cropped Hero

</div>

---
class: pink-dark
---

<div class="absolute inset-0">
<BrandShape
  from="organic-2"
  to="organic-4"
  current="pink"
  catalyst="vermillion"
  future="brown-dark"
  variant="gradient"
  :crop="true"
  size="100%"
  :steps="10"
/>
</div>

<div class="absolute bottom-8 left-10 z-10">

## Gradient — Cropped Pink

</div>

---

## Filled — Animated Build

<BrandShape
  from="primitive-1"
  to="angular-2"
  scheme="blue"
  variant="filled"
  :animate="true"
  trigger="enter"
  :duration="2000"
  size="500px"
  :steps="10"
/>

---

## Filled — Alignment Directions

<div class="grid grid-cols-3 gap-4">
  <div class="text-center">
    <BrandShape from="organic-1" to="organic-3" scheme="lime" variant="filled" align="left" :spread="1" size="240px" :steps="8" />
    <p class="text-sm mt-2">align=left</p>
  </div>
  <div class="text-center">
    <BrandShape from="organic-1" to="organic-3" scheme="pink" variant="filled" align="right" :spread="1" size="240px" :steps="8" />
    <p class="text-sm mt-2">align=right</p>
  </div>
  <div class="text-center">
    <BrandShape from="organic-1" to="organic-3" scheme="blue" variant="filled" align="top" :spread="1" size="240px" :steps="8" />
    <p class="text-sm mt-2">align=top</p>
  </div>
  <div class="text-center">
    <BrandShape from="organic-1" to="organic-3" scheme="vermillion" variant="filled" align="bottom" :spread="1" size="240px" :steps="8" />
    <p class="text-sm mt-2">align=bottom</p>
  </div>
  <div class="text-center">
    <BrandShape from="organic-1" to="organic-3" scheme="brown" variant="filled" align="center" :spread="1" size="240px" :steps="8" />
    <p class="text-sm mt-2">align=center</p>
  </div>
</div>

---

## Filled — Spread Intensity

<div class="grid grid-cols-3 gap-4">
  <div class="text-center">
    <BrandShape from="primitive-2" to="angular-3" scheme="lime" variant="filled" align="left" :spread="0.5" size="240px" :steps="10" />
    <p class="text-sm mt-2">spread=0.5 (tight)</p>
  </div>
  <div class="text-center">
    <BrandShape from="primitive-2" to="angular-3" scheme="lime" variant="filled" align="left" :spread="1" size="240px" :steps="10" />
    <p class="text-sm mt-2">spread=1 (default)</p>
  </div>
  <div class="text-center">
    <BrandShape from="primitive-2" to="angular-3" scheme="lime" variant="filled" align="left" :spread="2" size="240px" :steps="10" />
    <p class="text-sm mt-2">spread=2 (wide)</p>
  </div>
</div>

---

## Layout Demos

The following slides showcase the brand layout system.

---
layout: diptych
scheme: blue
from: organic-2
to: organic-3
---

---
layout: diptych
scheme: vermillion
from: primitive-2
to: angular-3
---

---
layout: hero
scheme: blue
from: organic-2
to: organic-3
---

# Catalyst

## of change

---
layout: hero
scheme: pink
from: organic-1
to: angular-2
---

# Innovation

## partners

---
layout: brand-left
scheme: blue
from: organic-2
to: organic-3
variant: wireframe
---

# Studio Profile

We develop powerful services for the public and the people who serve it.

- Service design
- Digital transformation
- Research & strategy

---
layout: brand-left
scheme: vermillion
from: primitive-1
to: angular-2
variant: filled
---

# Our Capabilities

Building products and services that create lasting impact for communities across Australia.

---
layout: brand-right
scheme: pink
from: organic-1
to: organic-3
variant: filled
---

# Our Team

A multidisciplinary studio of designers, researchers, and technologists working together.

---
layout: brand-right
scheme: lime
from: angular-1
to: angular-3
variant: wireframe
split: narrow
---

# Partnership

We work alongside government and community organisations to co-design solutions that matter.

---
layout: triptych
scheme: pink
from: organic-2
to: angular-1
---

<template #right>
  <div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
    Photo slot
  </div>
</template>

---
layout: triptych
scheme: lime
from: organic-1
to: organic-3
split: weighted
---

Modern wayfinding has to support our increasingly complex everyday life.

---
layout: image-left
image: https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800
---

# Empowering people to make change

We partner with organisations to design services that are accessible, effective, and human-centered.

---
layout: image-right
image: https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800
---

# Working Together

Our approach combines deep research with hands-on design to deliver outcomes that matter.

---
layout: section
---

# Portable Theme
### A programmable brand system for Slidev

---
layout: brand-left
scheme: lime
from: primitive-1
to: organic-3
variant: filled
---

# The BrandShape Component

12 base shapes. 5 colour families. Morphing, gradients, noise — all from markup.

<div class="mt-4">

```html
<BrandShape
  from="primitive-1"
  to="organic-3"
  scheme="lime"
  variant="filled"
  :steps="10"
/>
```

</div>

---

## Colour Schemes

<div class="grid grid-cols-2 gap-8">
<div>

Every shape takes a `scheme` — one of the five brand colour families. Each scheme maps to **dark** (current), **mid** (catalyst), and **light** (future).

```html
<BrandShape scheme="pink" ... />
<BrandShape scheme="blue" ... />
<BrandShape scheme="vermillion" ... />
```

Or go cross-family:

```html
<BrandShape
  current="pink-dark"
  catalyst="lime"
  future="blue-light"
/>
```

</div>
<div class="flex flex-wrap gap-3 items-start">
  <BrandShape from="organic-1" to="organic-3" scheme="lime" variant="filled" size="180px" :steps="8" />
  <BrandShape from="organic-1" to="organic-3" scheme="pink" variant="filled" size="180px" :steps="8" />
  <BrandShape from="organic-1" to="organic-3" scheme="blue" variant="filled" size="180px" :steps="8" />
  <BrandShape from="organic-1" to="organic-3" scheme="vermillion" variant="filled" size="180px" :steps="8" />
</div>
</div>

---

## Three Variants

<div class="grid grid-cols-3 gap-6">
<div class="text-center">
  <BrandShape from="organic-2" to="angular-1" scheme="blue" variant="wireframe" size="250px" :steps="8" />

**wireframe** — stroked outlines

```html
variant="wireframe"
```

</div>
<div class="text-center">
  <BrandShape from="organic-2" to="angular-1" scheme="blue" variant="filled" size="250px" :steps="8" />

**filled** — conic gradient layers

```html
variant="filled"
```

</div>
<div class="text-center">
  <BrandShape from="organic-2" to="angular-1" scheme="blue" variant="gradient" size="250px" :steps="8" :crop="true" />

**gradient** — hero backgrounds

```html
variant="gradient" :crop="true"
```

</div>
</div>

---

## Morph Shapes

<div class="grid grid-cols-2 gap-8">
<div>

12 base shapes across three families: **primitive**, **organic**, and **angular**.

The `from` and `to` props pick the start and end shapes. The component generates smooth morph steps between them.

```html
<BrandShape
  from="primitive-2"
  to="angular-4"
  :steps="10"
/>
```

Steps are clamped to 5–15 per brand rules.

</div>
<div class="flex flex-col gap-3">
  <div class="flex gap-3">
    <BrandShape from="primitive-1" to="primitive-1" scheme="lime" variant="wireframe" size="120px" :steps="5" />
    <BrandShape from="organic-1" to="organic-1" scheme="pink" variant="wireframe" size="120px" :steps="5" />
    <BrandShape from="angular-1" to="angular-1" scheme="blue" variant="wireframe" size="120px" :steps="5" />
  </div>
  <BrandShape from="primitive-2" to="angular-4" scheme="vermillion" variant="filled" size="280px" :steps="10" />
</div>
</div>

---

## Brand Layouts

<div class="grid grid-cols-2 gap-8">
<div>

Custom Slidev layouts encode the brand's composition rules — diptych juxtaposition, triptychs, hero treatments.

```yaml
---
layout: hero
scheme: blue
from: organic-2
to: organic-3
---

# Catalyst
## of change
```

Available: `diptych`, `triptych`, `hero`, `brand-left`, `brand-right`, `image-left`, `image-right`

</div>
<div>

```yaml
---
layout: brand-left
scheme: pink
variant: filled
---

# Title here

Content in the right panel.
```

```yaml
---
layout: diptych
scheme: vermillion
from: primitive-2
to: angular-3
---
```

</div>
</div>

---
layout: hero
scheme: lime
from: organic-1
to: angular-2
---

# Built with
## TypeScript + Vue + SVG
