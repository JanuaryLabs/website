'use strict';
import rehypeShiki from '@shikijs/rehype';

import { nodeTypes } from '@mdx-js/mdx';
import remarkHeadings from '@vcarl/remark-headings';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import readingTime from 'remark-reading-time';

/**
 * Provides all our Rehype Plugins that are used within MDX
 *
 * @type {Array<import('unified').Plugin>}
 */
export function NEXT_REHYPE_PLUGINS() {
  return [
    // Allows for raw HTML to be used in MDX
    [rehypeRaw, { passThrough: nodeTypes }],

    // Generates `id` attributes for headings (H1, ...)
    rehypeSlug,
    // Automatically add anchor links to headings (H1, ...)
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    // Syntax highlighting for code blocks
    [
      rehypeShiki,
      {
        themes: {
          light: 'nord',
          dark: 'nord',
        },
      },
    ],
  ];
}

/**
 * Provides all our Remark Plugins that are used within MDX
 *
 * @type {Array<import('unified').Plugin>}
 */
export const NEXT_REMARK_PLUGINS = [remarkGfm, remarkHeadings, readingTime];
