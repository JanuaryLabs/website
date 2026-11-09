'use client';

import type { RefObject } from 'react';
import { useContext, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { NavigationStateContext } from '@/providers/navigationStateProvider';

const useNavigationState = <T extends HTMLElement>(
  id: string,
  ref: RefObject<T | null>,
  debounceTime = 300
) => {
  const navigationState = useContext(NavigationStateContext);

  const savePosition = useDebouncedCallback(
    (savedId: string, position: { x: number; y: number }) => {
      navigationState.set(savedId, position);
    },
    debounceTime
  );

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const saved = navigationState.get(id);
      if (saved && saved.y !== element.scrollTop) {
        element.scroll({ top: saved.y, behavior: 'instant' });
      }

      // The position is read here, at the scroll, because by the time a
      // cleanup flush runs the element has left the page and reads 0.
      const handleScroll = () =>
        savePosition(id, { x: element.scrollLeft, y: element.scrollTop });

      element.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        element.removeEventListener('scroll', handleScroll);
        // flushOnExit covers unmount only; an id change must also save now,
        // or a scroll under the new id replaces the pending save of the old.
        savePosition.flush();
      };
    }
  }, [id, ref, savePosition, navigationState]);
};

export default useNavigationState;
