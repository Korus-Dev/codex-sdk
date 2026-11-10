import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-package-'));
const npm = (args, cwd = temporary) => execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
try {
  const [archive] = JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--pack-destination', temporary], root));
  const files = new Set(archive.files.map(file => file.path));
  for (const file of files) {
    assert(!file.endsWith('.tgz') && !file.split('/').some(part => part === '.env' || part.startsWith('.env.') || ['node_modules', 'src', 'tests', 'docs', '.vitepress'].includes(part)), `Private file: ${file}`);
    assert(['README.md', 'LICENSE', 'CHANGELOG.md', 'package.json'].includes(file) || /^dist\/.*(?:\.js|\.js\.map|\.d\.ts|\.d\.ts\.map)$/.test(file), `Unexpected file: ${file}`);
  }
  for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md', 'package.json', manifest.main, manifest.types]) {
    assert(typeof file === 'string' && files.has(file.replace(/^\.\//, '')), `Missing ${file}`);
  }
  const entries = ['.'];
  fs.writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', path.join(temporary, archive.filename)]);
  // Every public runtime entry must load in plain Node without Vite aliases or a provider process.
  fs.writeFileSync(path.join(temporary, 'imports.mjs'), `import { CodexAppServerClient, CodexAppServerStdioTransport, RpcRemoteError, codexSchemaCliVersion } from '${manifest.name}';\nvoid [CodexAppServerClient, CodexAppServerStdioTransport, RpcRemoteError, codexSchemaCliVersion];\n` + entries.map(entry => `await import(${JSON.stringify(manifest.name + (entry === '.' ? '' : entry.slice(1)))});`).join('\n'));
  execFileSync(process.execPath, ['imports.mjs'], { cwd: temporary, stdio: 'inherit' });
  const publicTypes = entries.map((entry, index) => `import type * as Public${index} from '${manifest.name + (entry === '.' ? '' : entry.slice(1))}';`).join('\n');
  fs.writeFileSync(path.join(temporary, 'consumer.ts'), publicTypes + `
import { CodexAppServerClient, CodexAppServerStdioTransport, RpcRemoteError, codexSchemaCliVersion, type CodexAppServerMethodMap, type CodexServerRequestMethodMap, type ResponseItem, type v2 } from '${manifest.name}';
const client = new CodexAppServerClient(new CodexAppServerStdioTransport());
const start: () => Promise<CodexAppServerMethodMap['thread/start']['result']> = () => client.request('thread/start', {});
const thread: v2.Thread | undefined = undefined;
const questions: CodexServerRequestMethodMap['item/tool/requestUserInput']['params']['questions'] = [];
const items: ResponseItem[] = [];
// @ts-expect-error Invalid methods must remain rejected by TypeScript.
client.request('not/a/method', {});
// @ts-expect-error Thread IDs must remain strings.
client.request('turn/start', { threadId: 42, input: [] });
void [start, thread, questions, items, RpcRemoteError, codexSchemaCliVersion];
`);
  const tsc = path.join(root, 'node_modules/typescript/bin/tsc');
  // Resolve Node types from this repository, never from the consumer's ancestors.
  fs.writeFileSync(path.join(temporary, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
    strict: true, noEmit: true, target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler',
    skipLibCheck: false, types: ['node'], typeRoots: [path.join(root, 'node_modules/@types')],
  }, files: ['consumer.ts'] }));
  execFileSync(process.execPath, [tsc, '-p', path.join(temporary, 'tsconfig.json')], { cwd: temporary, stdio: 'inherit' });
  console.log(`Validated ${files.size} packed files and ${entries.length} public entry points in an isolated ESNext/Bundler consumer.`);
} catch (error) {
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
