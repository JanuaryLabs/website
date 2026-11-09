'use strict';

import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

import graymatter from 'gray-matter';

import { getMarkdownFiles } from '../../next.helpers.mjs';

// gets the current blog path based on local module path
const blogPath = join(process.cwd(), 'pages/blog');

/**
 * This method parses the source (raw) Markdown content into Frontmatter
 * and returns basic information for blog posts
 *
 * @param {string} filename the filename related to the blogpost
 * @param {string} source the source markdown content of the blog post
 */
const getFrontMatter = (filename, source) => {
  const {
    title = 'Untitled',
    author = 'January Team',
    username,
    date = new Date(),
    category = 'uncategorized',
  } = graymatter(source).data;

  // We also use publishing years as categories for the blog
  const publishYear = new Date(date).getUTCFullYear();

  // Provides a full list of categories for the Blog Post which consists of
  // all = (all blog posts), publish year and the actual blog category
  const categories = [category, `year-${publishYear}`, 'all'];

  // this is the url used for the blog post it based on the category and filename
  const slug = `/posts/${basename(filename, extname(filename))}`;
  return { title, author, username, date: new Date(date), categories, slug };
};

/**
 * This method is used to generate the Node.js Website Blog Data
 * for self-consumption during RSC and Static Builds
 *
 * @return {Promise<import('../../types').BlogData>}
 */
const generateBlogData = async () => {
  // We retrieve the full pathnames of all Blog Posts to read each file individually
  const filenames = await getMarkdownFiles(process.cwd(), 'pages/blog', [
    '**/index.md',
  ]);

  const posts = await Promise.all(
    filenames.map(async filename =>
      getFrontMatter(filename, await readFile(join(blogPath, filename), 'utf8'))
    )
  );

  // Each prerender worker runs this once and pages the result on its own, so every process
  // must reach one order, or a post at a page boundary shows on two pages or on none. The
  // code unit comparison keeps that order the same under every locale
  posts.sort(
    (a, b) => b.date.getTime() - a.date.getTime() || (a.slug < b.slug ? -1 : 1)
  );

  const categories = [
    ...new Set(posts.flatMap(post => post.categories)),
  ].sort();

  return { categories, posts };
};

export default generateBlogData;
