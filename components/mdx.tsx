import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

import dynamic from 'next/dynamic';

import { NEXT_REHYPE_PLUGINS, NEXT_REMARK_PLUGINS } from '@/next.mdx.mjs';
import { combinedComponents } from './mdxRenderer';

const MDXRemote = dynamic(() =>
  import('next-mdx-remote/rsc').then(mod => mod.MDXRemote)
);

export const Mdx = async (props: {
  source: string;
  components?: MDXRemoteProps['components'];
}) => {
  return (
    <MDXRemote
      options={{
        // The sources are components/Examples and the readmes of JanuaryLabs/.github,
        // and a readme passes a Mermaid chart as an expression. blockDangerousJS stays on.
        blockJS: false,
        mdxOptions: {
          rehypePlugins: NEXT_REHYPE_PLUGINS() as never,
          remarkPlugins: NEXT_REMARK_PLUGINS,
        },
      }}
      components={
        props.components ?? {
          ...combinedComponents,
          h1: () => <></>,
          h2: () => <></>,
          pre: ({ children }) => <pre>{children}</pre>,
        }
      }
      source={props.source}
    />
  );
};
