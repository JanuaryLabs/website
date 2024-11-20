'use client';

import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';

import Button from '@/components/Common/Button';
import type { NodeRelease } from '@/types';

import styles from './index.module.css';

type DownloadButtonProps = { release: NodeRelease };

const PlaygroundButton: FC<PropsWithChildren<DownloadButtonProps>> = ({
  children,
}) => {
  return (
    <>
      <Button
        kind="special"
        href={'/learn'}
        className={classNames(styles.downloadButton, styles.special, 'w-full')}
      >
        {children}
      </Button>

      <Button
        kind="primary"
        href={'/learn/getting-started/quick-start'}
        className={classNames(styles.downloadButton, styles.primary, 'w-full')}
      >
        {children}
      </Button>
    </>
  );
};

export default PlaygroundButton;
