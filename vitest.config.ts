import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['portable-theme/__tests__/**/*.test.ts'],
  },
})
