// Asks the real dynamic router for the metadata of every route at once, as the prerender
// does, and prints it. The hooks stand in for the Next.js bundler and are a cut-down copy
// of those in components/__tests__/renderMdxInNode.mjs; see __tests__/copied-test-helpers.md.
import { readFileSync, statSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import ts from 'typescript';

const root = join(import.meta.dirname, '..');

const resolveInRepo = path =>
  ['', '.ts', '.tsx', '.mjs']
    .map(suffix => path + suffix)
    .find(file => statSync(file, { throwIfNoEntry: false })?.isFile());

const isRepoFile = url =>
  url?.startsWith('file:') && !url.includes('/node_modules/');

registerHooks({
  resolve(specifier, context, nextResolve) {
    const path = specifier.startsWith('@/')
      ? join(root, specifier.slice(2))
      : specifier.startsWith('.') && isRepoFile(context.parentURL)
        ? join(fileURLToPath(context.parentURL), '..', specifier)
        : null;
    const file = path && resolveInRepo(path);

    return file
      ? { url: pathToFileURL(file).href, shortCircuit: true }
      : nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (isRepoFile(url) && url.endsWith('.ts')) {
      const fileName = fileURLToPath(url);
      const { outputText } = ts.transpileModule(
        readFileSync(fileName, 'utf8'),
        {
          fileName,
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
          },
        }
      );

      return { format: 'module', shortCircuit: true, source: outputText };
    }

    return nextLoad(url, context);
  },
});

const { dynamicRouter } = await import('../next.dynamic.mjs');
const pathnames = await dynamicRouter.getRoutesByLanguage();
const metadata = await Promise.all(
  pathnames.map(pathname => dynamicRouter.getPageMetadata(pathname))
);

process.stdout.write(
  JSON.stringify(
    pathnames.map((pathname, index) => ({
      pathname,
      title: metadata[index].title,
      twitterTitle: metadata[index].twitter.title,
      canonical: metadata[index].alternates.canonical,
      xDefault: metadata[index].alternates.languages['x-default'],
    }))
  )
);
