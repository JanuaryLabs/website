// Renders the real components/mdx.tsx in plain Node and prints the HTML. The hooks
// stand in for what the Next.js bundler does: they compile TypeScript, resolve the
// `@/` alias and extensionless paths, map next/dynamic to its App Router build,
// and give CSS Modules empty class names.
import { statSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { renderToReadableStream } from 'react-dom/server';
import ts from 'typescript';

const root = join(import.meta.dirname, '../..');

const resolveInRepo = path =>
  ['', '.ts', '.tsx', '.mjs', '/index.ts', '/index.tsx', '/index.mjs']
    .map(suffix => path + suffix)
    .find(file => statSync(file, { throwIfNoEntry: false })?.isFile());

const isRepoFile = url =>
  url?.startsWith('file:') && !url.includes('/node_modules/');

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/dynamic') {
      return nextResolve('next/dist/shared/lib/app-dynamic.js', context);
    }

    const path = specifier.startsWith('@/')
      ? join(root, specifier.slice(2))
      : specifier.startsWith('.') && isRepoFile(context.parentURL)
        ? join(fileURLToPath(context.parentURL), '..', specifier)
        : null;
    const file = path && resolveInRepo(path);

    if (file) {
      return { url: pathToFileURL(file).href, shortCircuit: true };
    }

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code !== 'ERR_MODULE_NOT_FOUND') {
        throw error;
      }

      return nextResolve(`${specifier}.js`, context);
    }
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.css')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default new Proxy({}, { get: (_, name) => name });',
      };
    }

    if (isRepoFile(url) && /\.tsx?$/.test(url)) {
      const fileName = fileURLToPath(url);
      const { outputText } = ts.transpileModule(
        readFileSync(fileName, 'utf8'),
        {
          fileName,
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
            jsx: ts.JsxEmit.ReactJSX,
          },
        }
      );

      return { format: 'module', shortCircuit: true, source: outputText };
    }

    return nextLoad(url, context);
  },
});

const { Mdx } = await import('../mdx.tsx');
const stream = await renderToReadableStream(
  await Mdx({ source: process.argv[2] })
);

await stream.allReady;

process.stdout.write(await new Response(stream).text());
