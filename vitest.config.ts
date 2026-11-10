import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  test: {
    testTimeout: 2_500,
    hookTimeout: 2_500,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/protocol/generated/**', 'src/protocol/method-map.ts', 'src/protocol/schema-version.ts'],
      thresholds: { statements: 85 },
    },
  },
});
