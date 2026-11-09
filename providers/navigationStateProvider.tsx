'use client';

import { createContext, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

type NavigationStateContextType = Map<string, { x: number; y: number }>;

export const NavigationStateContext = createContext<NavigationStateContextType>(
  new Map()
);

export const NavigationStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [navigationState] = useState<NavigationStateContextType>(
    () => new Map()
  );

  return (
    <NavigationStateContext.Provider value={navigationState}>
      {children}
    </NavigationStateContext.Provider>
  );
};
