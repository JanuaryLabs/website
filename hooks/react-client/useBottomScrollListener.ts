import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type CallbackFunction = () => void;

const useBottomScrollListener = (
  callback: CallbackFunction,
  debounceTime = 300
) => {
  const [bottomReached, setBottomReached] = useState(false);

  const debouncedCallback = useDebouncedCallback(callback, debounceTime);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const height = document.documentElement.scrollHeight;

      const bottomOfWindow = Math.ceil(scrollTop + windowHeight) >= height;

      if (bottomOfWindow) {
        setBottomReached(true);
        debouncedCallback();
      } else {
        setBottomReached(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [debouncedCallback]);

  return bottomReached;
};

export default useBottomScrollListener;
