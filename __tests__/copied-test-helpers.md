# Copied test helpers

The tests in this repo load modules that Jest cannot load. These tests run a child Node process. Hooks in the child process stand in for the Next.js bundler.

| Source                                     | Copy                               | What changed                         | Why                                                                                   |
| ------------------------------------------ | ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `components/__tests__/renderMdxInNode.mjs` | `__tests__/pageMetadataInNode.mjs` | The copy has a step for image files. | The explore pages import images. The copy loads these pages, and the source does not. |

Mirror each fix to the hooks in both files. Name both files in the commit. A third place moves the hooks to one shared module.
