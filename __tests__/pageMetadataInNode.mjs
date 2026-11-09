// Asks the real page modules for the metadata of every route at once, as the prerender
// does, and prints it. The hooks stand in for the Next.js bundler and are a copy of those
// in components/__tests__/renderMdxInNode.mjs; see __tests__/copied-test-helpers.md.
import { readFileSync, statSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import ts from 'typescript';

const root = join(import.meta.dirname, '..');

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

    if (/\.(png|svg)$/.test(url)) {
      return {
        format: 'module',
        shortCircuit: true,
        source: 'export default { src: "", height: 1, width: 1 };',
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

const encoded = text => Buffer.from(text).toString('base64');
const projectFile = (title, description) => ({
  content: encoded(JSON.stringify({ title, description })),
});

// The answers of the GitHub contents API for what the explore pages ask, and nothing else
const github = new Map([
  [
    '/repos/januarylabs/.github/contents/projects',
    [{ name: 'roadmap' }, { name: 'google-tasks' }],
  ],
  [
    '/repos/januarylabs/.github/contents/projects/roadmap/config.json',
    projectFile('Roadmap', 'A roadmap API'),
  ],
  [
    '/repos/januarylabs/.github/contents/projects/roadmap/readme.md',
    { content: encoded('# Roadmap') },
  ],
  [
    '/repos/januarylabs/.github/contents/projects/google-tasks/config.json',
    projectFile('Google tasks', 'A tasks API'),
  ],
  [
    '/repos/januarylabs/.github/contents/projects/google-tasks/readme.md',
    { content: encoded('# Google tasks') },
  ],
]);

globalThis.fetch = async url => {
  const answer = github.get(decodeURIComponent(new URL(url).pathname));

  return new Response(JSON.stringify(answer ?? { message: 'Not Found' }), {
    status: answer ? 200 : 404,
    headers: { 'content-type': 'application/json' },
  });
};

const { dynamicRouter } = await import('../next.dynamic.mjs');
const explore = await import('../app/explore/page.tsx');
const project = await import('../app/explore/[id]/page.tsx');

const markdownRoutes = (await dynamicRouter.getRoutesByLanguage()).map(
  pathname => [pathname, dynamicRouter.getPageMetadata(pathname)]
);
const projectRoutes = (await project.generateStaticParams()).map(({ id }) => [
  `explore/${id}`,
  project.generateMetadata({ params: Promise.resolve({ id }) }),
]);
const routes = [
  ...markdownRoutes,
  ['explore', explore.generateMetadata()],
  ...projectRoutes,
];
const metadata = await Promise.all(routes.map(([, pending]) => pending));

process.stdout.write(
  JSON.stringify(
    routes.map(([pathname], index) => ({
      pathname,
      title: metadata[index].title,
      twitterTitle: metadata[index].twitter.title,
      canonical: metadata[index].alternates.canonical,
      xDefault: metadata[index].alternates.languages['x-default'],
    }))
  )
);
