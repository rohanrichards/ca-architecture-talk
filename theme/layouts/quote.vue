<template>
  <div class="slidev-layout gp-quote">
    <div class="gp-quote-mark">"</div>
    <div class="gp-quote-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-quote {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem 6rem;
}

.gp-quote-mark {
  position: absolute;
  top: 1rem;
  left: 3rem;
  font-size: 12rem;
  font-family: Georgia, serif;
  color: rgba(0, 212, 255, 0.06);
  line-height: 1;
  pointer-events: none;
  z-index: 0;
}

.gp-quote-content {
  position: relative;
  z-index: 1;
  max-width: 80%;
}

/* Reset base blockquote border */
.gp-quote :deep(blockquote) {
  border-left: none;
  padding-left: 0;
  font-style: normal;
  color: inherit;
}

.gp-quote :deep(blockquote p) {
  font-size: 2.25rem;
  line-height: 1.4;
  font-style: italic;
  font-weight: 500;
  color: var(--gp-text);
  border-left: 4px solid var(--gp-accent);
  padding-left: 2rem;
  animation: gp-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Attribution */
.gp-quote :deep(blockquote + p),
.gp-quote :deep(p:last-child:not(:first-child)) {
  color: var(--gp-accent);
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 500;
  margin-top: 2rem;
  padding-left: 2rem;
  border-left: none;
  letter-spacing: 0.03em;
  animation: gp-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
</style>
