import { defineConfig } from 'vite';
import path from 'node:path';

const entries = ['index', 'protocol/index', 'protocol/client', 'protocol/wire',
  'protocol/schema-version', 'protocol/listener-errors'];

export default defineConfig({
  build: {
    lib: {
      entry: Object.fromEntries(entries.map(name => [name, path.resolve(import.meta.dirname, `src/${name}.ts`)])),
      formats: ['es'],
    },
    sourcemap: true,
    rollupOptions: {
      external: id => id.startsWith('node:'),
      output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' },
    },
  },
});
