import { defineConfig } from 'vite';
import path from 'node:path';
import { sourceAliases } from '../source-aliases.ts';
import metadata from './package.json' with { type: 'json' };
export default defineConfig({
  resolve: { alias: sourceAliases },

  build: { lib: { entry: Object.fromEntries(Object.entries({"index":"src/index.ts"}).map(([name, file]) => [name, path.resolve(import.meta.dirname, file)])), formats: ['es'], cssFileName: 'styles' }, sourcemap: true,
    rollupOptions: { external: id => id.startsWith('node:') || ['vue', 'electron', ...Object.keys(metadata.dependencies ?? {})].some(name => id === name || id.startsWith(name + '/')), output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' } } },
});
