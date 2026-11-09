/**
 * @jest-environment node
 */
import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

// A child process, because Jest cannot load modules with a top-level await
const metadataOfEveryRoute = async () => {
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ['--no-warnings', join(__dirname, 'pageMetadataInNode.mjs')],
    { maxBuffer: 10_000_000 }
  );

  return JSON.parse(stdout);
};

const pathnameOf = url => new URL(url).pathname;

describe('page metadata', () => {
  it('gives each route its own URLs when routes render at once', async () => {
    const pages = await metadataOfEveryRoute();

    expect(pages.map(page => page.pathname)).toEqual(
      expect.arrayContaining(['posts/all', 'posts/year-2024'])
    );

    expect(
      pages.map(page => [pathnameOf(page.canonical), pathnameOf(page.xDefault)])
    ).toEqual(pages.map(page => [`/${page.pathname}`, `/${page.pathname}`]));
  }, 60_000);

  it('gives the explore pages their own canonical URL and title', async () => {
    const pages = await metadataOfEveryRoute();

    expect(
      pages
        .filter(page => page.pathname.startsWith('explore'))
        .map(page => [pathnameOf(page.canonical), page.title])
    ).toEqual([
      ['/explore', 'January — Templates and starters'],
      ['/explore/roadmap', 'January — Roadmap'],
      ['/explore/google-tasks', 'January — Google tasks'],
    ]);
  }, 60_000);

  it('gives each route its own Twitter title when routes render at once', async () => {
    const pages = await metadataOfEveryRoute();

    expect(pages.map(page => page.twitterTitle)).toEqual(
      pages.map(page => page.title)
    );
    expect(new Set(pages.map(page => page.title)).size).toBeGreaterThan(1);
  }, 60_000);
});
