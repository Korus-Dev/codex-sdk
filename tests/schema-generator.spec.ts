import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const directories: string[] = [];
afterEach(() => { for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true }); });

function fixture(version: string) {
  const dir = mkdtempSync(join(tmpdir(), 'codex-schema-test-'));
  directories.push(dir);
  const command = join(dir, 'codex');
  const marker = join(dir, 'generated');
  writeFileSync(command, `#!${process.execPath}
import { cpSync, writeFileSync } from 'node:fs';
if (process.argv.includes('--version')) console.log(${JSON.stringify(version)});
else {
  writeFileSync(${JSON.stringify(marker)}, 'yes');
  cpSync(${JSON.stringify(join(root, 'src/protocol/generated'))}, process.argv[process.argv.indexOf('--out') + 1], { recursive: true });
}
`);
  chmodSync(command, 0o755);
  return { command, marker };
}

it('checks the pinned schema and both method maps using an explicit CLI', () => {
  const { command, marker } = fixture('codex-cli 0.167.0');
  const output = execFileSync(process.execPath, ['scripts/generate-codex-schema.mjs', '--check', '--codex', command], {
    cwd: root, encoding: 'utf8',
  });
  expect(output).toContain('schema matches codex-cli 0.167.0');
  expect(readFileSync(marker, 'utf8')).toBe('yes');
});

it('rejects a mismatched CLI before generating or writing schema files', () => {
  const { command, marker } = fixture('codex-cli 0.166.0');
  expect(() => execFileSync(process.execPath, ['scripts/generate-codex-schema.mjs', '--check', '--codex', command], {
    cwd: root, stdio: 'pipe',
  })).toThrow(/Expected codex-cli 0.167.0, received codex-cli 0.166.0/);
  expect(() => readFileSync(marker)).toThrow();
});
