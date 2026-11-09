import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { basename, join } from 'path';

import glob from 'fast-glob';

const src = join(process.cwd(), 'pages');
const dist = join(process.cwd(), 'flattened-dir');

const files = await glob('./pages/**/*.md', {
  ignore: ['./pages/archive/**/*.md', './pages/blog/**/*.md'],
});
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of files) {
  console.log(file);
  const content = await readFile(join(src, '../', file), 'utf-8');
  await writeFile(join(dist, basename(file)), content);
}
