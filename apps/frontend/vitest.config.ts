/// <reference types="vitest" />
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    setupFiles: ["test/setup.ts"],
    testTimeout: 60 * 60 * 1000,
  },
})
