'use client';

import type { RefObject } from 'react';
import { useContext, useEffect } from 'react';

import { NavigationStateContext } from '@/providers/navigationStateProvider';
import { debounce } from '@/util/debounce';

const useNavigationState = <T extends HTMLElement>(
  id: string,
  ref: RefObject<T>,
  debounceTime = 300
) => {
  const navigationState = useContext(NavigationStateContext);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const saved = navigationState.get(id);
      if (saved && saved.y !== element.scrollTop) {
        element.scroll({ top: saved.y, behavior: 'instant' });
      }

      const handleScroll = debounce(() => {
        navigationState.set(id, {
          x: element.scrollLeft,
          y: element.scrollTop,
        });
      }, debounceTime);

      element.addEventListener('scroll', handleScroll, { passive: true });

      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [id, ref, debounceTime, navigationState]);
};

export default useNavigationState;
