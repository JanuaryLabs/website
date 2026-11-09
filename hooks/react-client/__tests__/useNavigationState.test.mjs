import { act, fireEvent, renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';

import useBottomScrollListener from '@/hooks/react-client/useBottomScrollListener';
import useNavigationState from '@/hooks/react-client/useNavigationState';
import { NavigationStateContext } from '@/providers/navigationStateProvider';

describe('useNavigationState', () => {
  it('should save the position when the page also reaches the bottom before the save runs', async () => {
    const navigationState = new Map();
    const element = document.createElement('nav');
    element.scrollTop = 40;
    const callback = jest.fn();
    renderHook(() => useNavigationState('sidebar', { current: element }, 0), {
      wrapper: ({ children }) =>
        createElement(
          NavigationStateContext.Provider,
          { value: navigationState },
          children
        ),
    });
    renderHook(() => useBottomScrollListener(callback, 0));

    // jsdom has no layout, so the page height a browser computes is set here.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 300,
    });
    document.documentElement.scrollTop = 100;

    act(() => {
      fireEvent.scroll(element);
      fireEvent.scroll(window, { target: { innerHeight: 200 } });
    });

    await waitFor(() => {
      expect(navigationState.get('sidebar')).toEqual({ x: 0, y: 40 });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('should save the position of the last scroll when unmounted before the save runs', () => {
    const navigationState = new Map();
    const element = document.createElement('nav');
    element.scrollTop = 40;
    const { unmount } = renderHook(
      () => useNavigationState('sidebar', { current: element }, 0),
      {
        wrapper: ({ children }) =>
          createElement(
            NavigationStateContext.Provider,
            { value: navigationState },
            children
          ),
      }
    );

    act(() => {
      fireEvent.scroll(element);
    });

    expect(navigationState.has('sidebar')).toBe(false);

    // A browser reads 0 from an element that has left the page; jsdom keeps the
    // value, so this stands in for that read.
    element.scrollTop = 0;
    unmount();

    expect(navigationState.get('sidebar')).toEqual({ x: 0, y: 40 });
  });

  it('should save each pending position under the id it was scrolled under when the id changes', async () => {
    const navigationState = new Map();
    const element = document.createElement('nav');
    element.scrollTop = 40;
    const { rerender } = renderHook(
      ({ id }) => useNavigationState(id, { current: element }, 0),
      {
        initialProps: { id: 'first' },
        wrapper: ({ children }) =>
          createElement(
            NavigationStateContext.Provider,
            { value: navigationState },
            children
          ),
      }
    );

    act(() => {
      fireEvent.scroll(element);
    });

    expect(navigationState.has('first')).toBe(false);

    rerender({ id: 'second' });
    element.scrollTop = 70;

    act(() => {
      fireEvent.scroll(element);
    });

    // A save the scroll scheduled with a delay of 0 is queued before this
    // timer, so it has already run when this timer fires.
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigationState.get('first')).toEqual({ x: 0, y: 40 });
    expect(navigationState.get('second')).toEqual({ x: 0, y: 70 });
  });
});
