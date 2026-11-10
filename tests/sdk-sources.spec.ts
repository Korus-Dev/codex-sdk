import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build } from 'vite';
import ts from 'typescript';
import { sourceTypecheck, sdkSources } from '../scripts/sdk-sources.mjs';
const folders: string[] = [];
function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'sdk source ')); folders.push(root);
  const app = path.join(root, 'app'); mkdirSync(app);
  writeFileSync(path.join(app, 'package.json'), JSON.stringify({ type: 'module', name: 'example-app' }));
  const sdk = path.join(root, 'codex-sdk'); mkdirSync(path.join(sdk, 'src/protocol'), { recursive: true });
  writeFileSync(path.join(sdk, 'package.json'), JSON.stringify({ name: '@korus-dev/codex-sdk', exports: { '.': { import: './dist/index.js', types: './dist/index.d.ts' }, './protocol/*': { types: './dist/protocol/*.d.ts' } } }));
  writeFileSync(path.join(sdk, 'src/index.ts'), 'export const origin = "local";');
  writeFileSync(path.join(sdk, 'src/protocol/client.ts'), 'export const client = true;');
  const installed = path.join(app, 'node_modules/@korus-dev/codex-sdk'); mkdirSync(installed, { recursive: true });
  writeFileSync(path.join(installed, 'package.json'), JSON.stringify({ name: '@korus-dev/codex-sdk', type: 'module', exports: './index.js' }));
  writeFileSync(path.join(installed, 'index.js'), 'export const origin = "npm";');
  writeFileSync(path.join(app, 'entry.ts'), 'export { origin } from "@korus-dev/codex-sdk";');
  return { root, app, sdk };
}
afterEach(() => folders.splice(0).forEach(f => rmSync(f, { recursive: true, force: true })));
describe('SDK dependency source selection', () => {
  it.each([undefined, '0', '1'])('bundles the intended dependency with SDK_LOCAL_SOURCE=%s', async mode => {
    const { app } = fixture();
    const config = sdkSources(app, { SDK_LOCAL_SOURCE: mode }, ['@korus-dev/codex-sdk']);
    const output = await build({ configFile: false, root: app, logLevel: 'silent', resolve: { alias: config.aliases }, build: { write: false, minify: false, lib: { entry: path.join(app, 'entry.ts'), formats: ['es'] } } });
    const bundle = Array.isArray(output) ? output[0] : output;
    if (!bundle || !('output' in bundle)) throw new Error('Expected a completed build.');
    const code = bundle.output.find(x => x.type === 'chunk')!.code;
    expect(code).toContain(mode === '1' ? '"local"' : '"npm"');
  });
  it('uses .env and resolves a relative source root from the repo, while explicit shell settings win', () => {
    const { root, app, sdk } = fixture();
    writeFileSync(path.join(app, '.env'), 'SDK_LOCAL_SOURCE=1\nSDK_SOURCE_ROOT=..\n');
    const selected = sdkSources(app, {}, ['@korus-dev/codex-sdk']);
    expect(selected.root).toBe(root);
    expect(selected.paths['@korus-dev/codex-sdk']).toEqual([path.join(sdk, 'src/index.ts')]);
    expect(selected.typePaths['@korus-dev/codex-sdk']).toEqual([path.join(sdk, 'dist/index.d.ts')]);
    expect(selected.paths['@korus-dev/codex-sdk/protocol/*']).toEqual([path.join(sdk, 'src/protocol/*')]);
    expect(sdkSources(app, { SDK_LOCAL_SOURCE: '0' }, ['@korus-dev/codex-sdk']).aliases).toEqual([]);
  });
  it('fails clearly for a missing or unrelated checkout instead of silently using npm', () => {
    const { app, sdk } = fixture();
    expect(() => sdkSources(app, { SDK_LOCAL_SOURCE: '1', SDK_SOURCE_ROOT: 'missing' }, ['@korus-dev/codex-sdk'])).toThrow('codex-sdk');
    writeFileSync(path.join(sdk, 'package.json'), JSON.stringify({ name: 'unrelated', exports: {} }));
    expect(() => sdkSources(app, { SDK_LOCAL_SOURCE: '1' }, ['@korus-dev/codex-sdk'])).toThrow('unrelated');
  });
  it('uses local declaration boundaries without changing package declaration layout', () => {
    const { app, sdk } = fixture();
    writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: '@korus-dev/multi-agent-sdk', type: 'module' }));
    mkdirSync(path.join(sdk, 'dist')); writeFileSync(path.join(sdk, 'dist/index.d.ts'), 'export type Header = { origin: "local-declaration" };');
    mkdirSync(path.join(app, 'src')); writeFileSync(path.join(app, 'src/index.ts'), 'export type { Header } from "@korus-dev/codex-sdk";');
    symlinkSync(path.resolve(import.meta.dirname, '../node_modules/typescript'), path.join(app, 'node_modules/typescript'), process.platform === 'win32' ? 'junction' : 'dir');
    const config = path.join(app, 'tsconfig.json');
    writeFileSync(config, JSON.stringify({ compilerOptions: { module: 'ESNext', moduleResolution: 'Bundler', target: 'ES2022', lib: ['ES2022'], rootDir: 'src', outDir: 'dist', declaration: true, emitDeclarationOnly: true, types: [] }, include: ['src/*.ts'] }));
    const selected = sourceTypecheck(app, ['-p', config], { SDK_LOCAL_SOURCE: '1' });
    try {
      const parsed = ts.getParsedCommandLineOfConfigFile(selected.args[1]!, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: error => { throw new Error(ts.flattenDiagnosticMessageText(error.messageText, '\n')); } })!;
      const program = ts.createProgram(parsed.fileNames, parsed.options);
      expect(ts.getPreEmitDiagnostics(program).map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n'))).toEqual([]);
      program.emit();
      expect(existsSync(path.join(app, 'dist/index.d.ts'))).toBe(true);
      expect(readFileSync(path.join(app, 'dist/index.d.ts'), 'utf8')).toContain('@korus-dev/codex-sdk');
    } finally { selected.cleanup(); }
  });
  it('keeps npm resolution independent of nonexistent sibling folders when disabled', () => {
    const { app } = fixture();
    const selected = sdkSources(app, { SDK_LOCAL_SOURCE: '0', SDK_SOURCE_ROOT: 'missing' }, ['@korus-dev/codex-sdk']);
    expect(selected.aliases).toEqual([]); expect(selected.paths).toEqual({});
  });
});
