'use strict';

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, normalize, sep } from 'node:path';

import matter from 'gray-matter';
import { cache } from 'react';
import { VFile } from 'vfile';

import { BASE_PATH, BASE_URL, IS_DEVELOPMENT } from './next.constants.mjs';
import {
  DYNAMIC_ROUTES,
  IGNORED_ROUTES,
  PAGE_METADATA,
} from './next.dynamic.constants.mjs';
import { getMarkdownFiles } from './next.helpers.mjs';
import { siteConfig } from './next.json.mjs';
import { compileMDX } from './next.mdx.compiler.mjs';

// This is the combination of the Application Base URL and Base PATH
const baseUrlAndPath = `${BASE_URL}${BASE_PATH}`;

// This is a small utility that allows us to quickly separate locale from the remaining pathname
const getPathname = (path = []) => path.join('/');

// This maps a pathname into an actual route object that can be used
// we use a platform-specific separator to split the pathname
// since we're using filepaths here and not URL paths
const mapPathToRoute = (path = '') => ({
  path: path.split(sep),
});

// Provides an in-memory Map that lasts the whole build process
// and disabled when on development mode (stubbed)
const createCachedMarkdownCache = () => {
  if (IS_DEVELOPMENT) {
    return {
      has: () => false,
      set: () => {},
      get: () => null,
    };
  }

  return new Map();
};

const getDynamicRouter = async () => {
  // Creates a Cache System that is disabled during development mode
  const cachedMarkdownFiles = createCachedMarkdownCache();

  // Keeps the map of pathnames to filenames
  const pathnameToFilename = new Map();

  const websitePages = await getMarkdownFiles(process.cwd(), `pages`);
  // .filter(file => !file.includes('archive/'))
  // .filter(file => !file.includes('learn/'))
  // .filter(file => !file.includes('about/'))
  // .filter(file => !file.includes('blog/'))

  websitePages.forEach(filename => {
    // This Regular Expression is used to remove the `index.md(x)` suffix
    // of a name and to remove the `.md(x)` extensions of a filename.
    let pathname = filename.replace(/((\/)?(index))?\.mdx?$/i, '');

    if (pathname.length > 1 && pathname.endsWith(sep)) {
      pathname = pathname.substring(0, pathname.length - 1);
    }

    pathname = normalize(pathname).replace('.', '');
    if (pathname.startsWith('blog')) {
      const postSlug = pathname.split('/').at(-1);
      pathname = postSlug !== 'blog' ? `posts/${postSlug}` : 'posts';
    }
    // We map the pathname to the filename to be able to quickly
    // resolve the filename for a given pathname
    pathnameToFilename.set(pathname, filename);
  });

  /**
   * This method returns a list of all routes that exist for a given locale
   *
   * @param {string} locale
   * @returns {Promise<Array<string>>}
   */
  const getRoutesByLanguage = async () => {
    const shouldIgnoreStaticRoute = pathname =>
      IGNORED_ROUTES.every(e => !e({ pathname }));

    return [...pathnameToFilename.keys()]
      .filter(shouldIgnoreStaticRoute)
      .concat([...DYNAMIC_ROUTES.keys()]);
  };

  /**
   * This method attempts to retrieve either a localized Markdown file
   * or the English version of the Markdown file if no localized version exists
   * and then returns the contents of the file and the name of the file (not the path)
   *
   * @param {string} pathname
   * @returns {Promise<{ source: string; filename: string }>}
   */
  const _getMarkdownFile = async (pathname = '') => {
    const normalizedPathname = normalize(pathname).replace('.', '');
    // This verifies if the given pathname actually exists on our Map
    // meaning that the route exists on the website and can be rendered
    if (pathnameToFilename.has(normalizedPathname)) {
      const filename = pathnameToFilename.get(normalizedPathname);

      let filePath = join(process.cwd(), 'pages');

      // We verify if our Markdown cache already has a cache entry for a localized
      // version of this file, because if not, it means that either
      // we did not cache this file yet or there is no localized version of this file
      if (cachedMarkdownFiles.has(`${normalizedPathname}`)) {
        const fileContent = cachedMarkdownFiles.get(`${normalizedPathname}`);

        return { source: fileContent, filename };
      }

      // No cache hit exists, so we check if the localized file actually
      // exists within our file system and if it does we set it on the cache
      // and return the current fetched result; If the file does not exist
      // we fallback to the English source
      if (existsSync(join(filePath, filename))) {
        filePath = join(filePath, filename);

        const fileContent = await readFile(filePath, 'utf8');

        cachedMarkdownFiles.set(`${normalizedPathname}`, fileContent);

        return { source: fileContent, filename };
      }

      // We then attempt to retrieve the source version of the file as there is no localised version
      // of the file and we set it on the cache to prevent future checks of the same locale for this file
      const { source: fileContent } = await _getMarkdownFile(pathname);

      // We set the source file on the localized cache to prevent future checks
      // of the same locale for this file and improve read performance
      cachedMarkdownFiles.set(`${normalizedPathname}`, fileContent);

      return { source: fileContent, filename };
    }

    return { filename: '', source: '' };
  };

  // Creates a Cached Version of the Markdown File Resolver
  const getMarkdownFile = cache(async pathname => {
    return await _getMarkdownFile(pathname);
  });

  /**
   * This method runs the MDX compiler on the server-side and returns the
   * parsed JSX ready to be rendered on a page as a React Component
   *
   * @param {string} source
   * @param {string} filename
   */
  const _getMDXContent = async (source = '', filename = '') => {
    // We create a VFile (Virtual File) to be able to access some contextual
    // data post serialization (compilation) of the source Markdown into MDX
    const sourceAsVirtualFile = new VFile(source);

    // Gets the file extension of the file, to determine which parser and plugins to use
    const fileExtension = filename.endsWith('.mdx') ? 'mdx' : 'md';

    // This compiles our MDX source (VFile) into a final MDX-parsed VFile
    // that then is passed as a string to the MDXProvider which will run the MDX Code
    return compileMDX(sourceAsVirtualFile, fileExtension);
  };

  // Creates a Cached Version of the MDX Compiler
  const getMDXContent = cache(async (source, filename) => {
    return await _getMDXContent(source, filename);
  });

  /**
   * This method generates the Next.js App Router Metadata
   * that can be used for each page to provide metadata
   *
   * @param {string} path
   * @param {string} [pageTitle] the title of a page with no Markdown file to read one from
   * @returns {Promise<import('next').Metadata>}
   */
  const _getPageMetadata = async (path = '', pageTitle) => {
    const { source = '' } = await getMarkdownFile(path);

    const { data } = matter(source);

    const heading = pageTitle ?? data.title;

    const title = heading
      ? `${siteConfig.title} — ${heading}`
      : siteConfig.title;

    const canonical = `${baseUrlAndPath}/${path}`;

    // Next.js 16 renders up to 8 pages at once in one process and reads this object after
    // they all ran, so every nested value this page changes must be its own object
    return {
      ...PAGE_METADATA,
      title,
      twitter: { ...PAGE_METADATA.twitter, title },
      alternates: {
        canonical,
        languages: { 'x-default': canonical },
        types: { 'application/rss+xml': `${baseUrlAndPath}/feed/posts.xml` },
      },
    };
  };

  // Creates a Cached Version of the Page Metadata Context
  const getPageMetadata = cache(async (path, pageTitle) => {
    return await _getPageMetadata(path, pageTitle);
  });

  return {
    mapPathToRoute,
    getPathname,
    getRoutesByLanguage,
    getMDXContent,
    getMarkdownFile,
    getPageMetadata,
  };
};

export const dynamicRouter = await getDynamicRouter();
