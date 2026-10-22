// Render review stills in one bundle: node scripts/stills.mjs <CompositionId> 3 10 16.5 ...  (seconds)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, ...rest] = process.argv.slice(2);
const secs = rest.map(Number);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id });
for (const s of secs) {
  const frame = Math.round(s * 30);
  const output = path.join(root, 'stills', `${id}-t${String(s).replace('.', '_')}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5 });
  console.log('ok', s, output);
}
