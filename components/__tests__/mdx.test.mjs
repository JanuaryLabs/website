/**
 * @jest-environment node
 */
import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

// A child process, because Jest cannot load @mdx-js/mdx, which is ESM only
const renderMdx = source =>
  promisify(execFile)(process.execPath, [
    '--no-warnings',
    join(__dirname, 'renderMdxInNode.mjs'),
    source,
  ]);

const childProcessTimeout = 60_000;

describe('Mdx', () => {
  it.each(['process.execPath', 'globalThis.navigator'])(
    'refuses to compile a prop that reads %s',
    async expression => {
      const render = renderMdx(`<Mermaid chart={${expression}} />`);

      await expect(render).rejects.toMatchObject({
        stdout: '',
        stderr: expect.stringContaining('Security:'),
      });
    },
    childProcessTimeout
  );

  it(
    'renders a prop that is a JavaScript expression',
    async () => {
      const { stdout } = await renderMdx('<Mermaid chart={`erDiagram`} />');

      expect(stdout).toContain('>erDiagram</div>');
    },
    childProcessTimeout
  );
});
