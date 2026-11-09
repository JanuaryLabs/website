// Runs the real blog generator with each post file finishing its read at a time that the
// argument chooses, and prints what it returns. Both read paths of node:fs wait, so the
// timing reaches the generator however it reads a file.
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { basename } from 'node:path';

const [, , firstToFinish] = process.argv;

const filenames = fs
  .readdirSync('pages/blog', { recursive: true })
  .map(file => basename(file))
  .sort();

const delays = new Map(
  filenames.map((file, index) => [
    file,
    20 * (firstToFinish === 'first-name' ? index : filenames.length - index),
  ])
);

let delayedReads = 0;

const delayOf = path => {
  delayedReads += 1;

  return delays.get(basename(String(path)));
};

const { createReadStream, promises } = fs;
const { readFile } = promises;

fs.createReadStream = (path, options) =>
  createReadStream(path, {
    ...options,
    fs: {
      ...fs,
      open: (...args) => setTimeout(fs.open, delayOf(path), ...args),
    },
  });

promises.readFile = async (path, options) => {
  await new Promise(resolve => setTimeout(resolve, delayOf(path)));

  return readFile(path, options);
};

syncBuiltinESMExports();

const { default: generateBlogData } =
  await import('../next-data/generators/blogData.mjs');
const { categories, posts } = await generateBlogData();

process.stdout.write(
  JSON.stringify({
    delayedReads,
    categories,
    posts: posts.map(({ slug, date }) => ({ slug, time: date.getTime() })),
  })
);
