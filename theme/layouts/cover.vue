<template>
  <div class="slidev-layout gp-cover">
    <div class="gp-cover-orb gp-cover-orb-1" />
    <div class="gp-cover-orb gp-cover-orb-2" />
    <div class="gp-cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.gp-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 3rem;
}

/* Floating orbs for extra depth */
.gp-cover-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.gp-cover-orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(0, 212, 255, 0.12);
  top: -10%;
  right: -5%;
  animation: gp-orb-float 12s ease-in-out infinite;
}

.gp-cover-orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(124, 58, 237, 0.1);
  bottom: -10%;
  left: -5%;
  animation: gp-orb-float 15s ease-in-out infinite reverse;
}

@keyframes gp-orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

.gp-cover-content {
  position: relative;
  z-index: 1;
  max-width: 80%;
}

.gp-cover :deep(h1) {
  font-size: 4.5rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--gp-accent) 0%, var(--gp-accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gp-headline-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  margin-bottom: 1.5rem;
}

.gp-cover :deep(p) {
  color: var(--gp-text-muted);
  font-size: 1.4rem;
  margin-top: 0.5rem;
  animation: gp-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
  letter-spacing: 0.02em;
}
</style>
