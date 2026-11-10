import { defineConfig } from 'vite';
import path from 'node:path';
import packageMetadata from './package.json' with { type: 'json' };

const metadata = packageMetadata as { dependencies?: Record<string, string>; peerDependencies?: Record<string, string> };

const dependencies = Object.keys({ ...metadata.dependencies, ...metadata.peerDependencies });

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
    },
    sourcemap: true,
    rollupOptions: {
      external: id => id.startsWith('node:') || dependencies.some(name => id === name || id.startsWith(`${name}/`)),
      output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' },
    },
  },
});
