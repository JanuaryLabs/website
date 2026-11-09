# Copied test helpers

The tests in this repo load modules that Jest cannot load. These tests run a child Node process. Hooks in the child process stand in for the Next.js bundler.

| Source                                     | Copy                               | What changed                                                                  | Why                                                                                  |
| ------------------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `components/__tests__/renderMdxInNode.mjs` | `__tests__/pageMetadataInNode.mjs` | The copy has no `next/dynamic` mapping, CSS Modules step or JSX compile step. | The dynamic router does not import React components, so the copy does not need them. |

Mirror each fix to the hooks in both files. Name both files in the commit. A third place moves the hooks to one shared module.
