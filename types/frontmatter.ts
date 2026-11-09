import type { Layouts } from './layouts';

// @TODO: Extra data from Frontmatter should not be a thing in the future
export interface LegacyFrontMatter extends Record<string, any> {
  layout?: Layouts;
  title: string;
  labels?: Record<string, string>;
  authors?: string;
  heroImage?: string;
}

// @TODO: Extra data from Frontmatter should not be a thing in the future
export interface LegacyBlogFrontMatter extends LegacyFrontMatter {
  author: string;
  date: string;
}

// @TODO: Extra data from Frontmatter should not be a thing in the future
export interface LegacyDownloadsFrontMatter extends LegacyFrontMatter {
  downloads: Record<string, string>;
  additional: Record<string, string>;
}
