'use client';

import { useCallback, useSyncExternalStore } from 'react';

const mediaQueryChangeSubscribe = (mq: MediaQueryList, handler: () => void) => {
  if (mq.addEventListener) {
    mq.addEventListener('change', handler);
  } else {
    mq.addListener(handler);
  }
};

const mediaQueryChangeUnsubscribe = (
  mq: MediaQueryList,
  handler: () => void
) => {
  if (mq.removeEventListener) {
    mq.removeEventListener('change', handler);
  } else {
    mq.removeListener(handler);
  }
};

const getServerSnapshot = () => undefined;

const useMediaQuery = (query: string): boolean | undefined => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') {
        return () => undefined;
      }

      const mq = window.matchMedia(query);
      mediaQueryChangeSubscribe(mq, onChange);

      return () => mediaQueryChangeUnsubscribe(mq, onChange);
    },
    [query]
  );

  const getSnapshot = () =>
    typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : undefined;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
