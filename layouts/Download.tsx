import type { FC, PropsWithChildren } from 'react';

import WithFooter from '@/components/withFooter';
import WithNavBar from '@/components/withNavBar';
import { useClientContext } from '@/hooks/react-server';

import styles from './layouts.module.css';

const DownloadLayout: FC<PropsWithChildren> = () => {
  const {
    frontmatter: { title, subtitle },
  } = useClientContext();

  return (
    <>
      <WithNavBar />

      <div className={styles.downloadLayout}>
        <main>
          <h1>{title}</h1>

          <p>{subtitle}</p>
        </main>
      </div>

      <WithFooter />
    </>
  );
};

export default DownloadLayout;
