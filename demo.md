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

## Gradient Variant — Cropped Hero

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

---

## Gradient — Cropped Pink

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
