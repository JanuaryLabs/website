import { fireEvent, renderHook, act, waitFor } from '@testing-library/react';

import useBottomScrollListener from '@/hooks/react-client/useBottomScrollListener';

describe('useBottomScrollListener', () => {
  it('should call the callback when the scroll reaches the bottom', async () => {
    const callback = jest.fn();
    renderHook(() => useBottomScrollListener(callback, 0));

    // jsdom has no layout, so the page height a browser computes is set here.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 300,
    });
    document.documentElement.scrollTop = 100;

    act(() => {
      fireEvent.scroll(window, { target: { innerHeight: 200 } });
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
  });

  it('should not call the callback when the scroll does not reach the bottom', async () => {
    const callback = jest.fn();
    renderHook(() => useBottomScrollListener(callback, 0));

    // jsdom has no layout, so the page height a browser computes is set here.
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 300,
    });
    document.documentElement.scrollTop = 50;

    act(() => {
      fireEvent.scroll(window, { target: { innerHeight: 200 } });
    });

    // A callback the scroll scheduled with a delay of 0 is queued before this
    // timer, so it has already run when this timer fires.
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(callback).not.toHaveBeenCalled();

    // The listener must still answer, or the assertion above proves nothing.
    document.documentElement.scrollTop = 100;

    act(() => {
      fireEvent.scroll(window, { target: { innerHeight: 200 } });
    });

    await waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
  });
});
