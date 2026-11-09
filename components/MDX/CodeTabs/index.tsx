'use client';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import classNames from 'classnames';
import type { ComponentProps, FC, ReactNode } from 'react';

import CodeTabs from '@/components/Common/CodeTabs';

import styles from './index.module.css';

export type NestedExampleTab = {
  id: string;
  title: string;
  hint?: string;
  content: ReactNode;
};
export type ExampleTab = {
  id: string;
  title: string;
  children?: Array<NestedExampleTab>;
};
type MDXCodeTabsProps = Pick<ComponentProps<typeof CodeTabs>, 'hint'> & {
  examples: Array<ExampleTab>;
};

const MDXCodeTabs: FC<MDXCodeTabsProps> = ({ ...props }) => {
  const tabs = props.examples.map(example => {
    return {
      key: example.id,
      label: example.title,
    };
  });

  return (
    <CodeTabs tabs={tabs} defaultValue={props.examples[0].id} {...props}>
      {props.examples.map(item => (
        <TabsPrimitive.Content key={item.id} value={item.id}>
          <NestedTabs examples={item.children ?? []} />
        </TabsPrimitive.Content>
      ))}
    </CodeTabs>
  );
};

const NestedTabs: FC<{ examples: Array<NestedExampleTab> }> = props => {
  const tabs = props.examples.map(example => {
    return {
      key: example.id,
      label: example.title,
    };
  });
  return (
    <>
      <CodeTabs
        tabsListClassName="rounded-t-none! border-b"
        tabs={tabs}
        defaultValue={props.examples[0].id}
        {...props}
      >
        {props.examples.map(item => (
          <TabsPrimitive.Content
            className={classNames(styles.tabsRoot, 'text-sm')}
            value={item.id}
            key={item.id}
          >
            {item.content}
          </TabsPrimitive.Content>
        ))}
      </CodeTabs>
    </>
  );
};
NestedTabs.displayName = 'NestedTabs';

export default MDXCodeTabs;
