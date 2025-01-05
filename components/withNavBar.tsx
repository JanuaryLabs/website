'use client';

import type { FC } from 'react';

import NavBar from '@/components/Containers/NavBar';
import WithBanner from '@/components/withBanner';

const WithNavBar: FC = () => {
  return (
    <div>
      <WithBanner section="index" />

      <NavBar />
    </div>
  );
};

export default WithNavBar;
