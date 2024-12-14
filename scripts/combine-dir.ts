import { writeFile } from 'fs/promises';
import { join } from 'path';

import glob from 'fast-glob';
import { readFileSync } from 'fs';

const src = join(process.cwd(), 'pages');
const dist = join(process.cwd(), 'combined.txt');

const files = await glob('./pages/**/*.md', {
  ignore: ['./pages/archive/**/*.md', './pages/blog/**/*.md'],
});

await writeFile(
  dist,
  files.reduce((acc, file) => {
    const content = readFileSync(join(src, '../', file), 'utf-8');
    return acc + content;
  }, ''),
  'utf-8'
);

// for (const file of files) {
//   console.log(file);
//   const content = await readFile(join(src, '../', file), 'utf-8');
//   await writeFile(join(dist, basename(file)), content);
// }
