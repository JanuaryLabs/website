/**
 * @jest-environment node
 */
import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const blogDataWhenFirstToFinishIs = async firstToFinish => {
  const { stdout } = await promisify(execFile)(process.execPath, [
    '--no-warnings',
    join(__dirname, 'blogOrderInNode.mjs'),
    firstToFinish,
  ]);

  return JSON.parse(stdout);
};

describe('blog data order', () => {
  it('lists posts in one order whichever file finishes reading first', async () => {
    const [nameFirst, nameLast] = await Promise.all([
      blogDataWhenFirstToFinishIs('first-name'),
      blogDataWhenFirstToFinishIs('last-name'),
    ]);

    expect(nameFirst.delayedReads).toBe(nameFirst.posts.length);
    expect(nameFirst.posts.length).toBeGreaterThan(1);
    expect(nameFirst.posts).toEqual(nameLast.posts);
  }, 60_000);

  it('lists categories in one order whichever file finishes reading first', async () => {
    const [nameFirst, nameLast] = await Promise.all([
      blogDataWhenFirstToFinishIs('first-name'),
      blogDataWhenFirstToFinishIs('last-name'),
    ]);

    expect(nameFirst.categories).toEqual(nameLast.categories);
    expect(nameFirst.categories).toEqual(
      expect.arrayContaining(['all', 'whats-new', 'year-2024'])
    );
  }, 60_000);

  it('lists the newest post first, and posts of one date by slug', async () => {
    const { posts } = await blogDataWhenFirstToFinishIs('last-name');

    const sameDate = posts.filter(
      post => post.time === Date.parse('2024-04-24T17:45:00.000Z')
    );

    expect(sameDate.map(post => post.slug)).toEqual([
      '/posts/github-extension',
      '/posts/node-cron-extension',
      '/posts/vercel-extension',
    ]);
    expect(posts.map(post => post.time)).toEqual(
      posts.map(post => post.time).sort((a, b) => b - a)
    );
  }, 60_000);
});
