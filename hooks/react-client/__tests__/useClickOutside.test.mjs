import { renderHook, act } from '@testing-library/react';

import useClickOutside from '@/hooks/react-client/useClickOutside';

describe('useClickOutside', () => {
  it('should call the callback function when clicked outside the element', () => {
    const fn = jest.fn();
    const ref = { current: document.createElement('div') };
    renderHook(() => useClickOutside(ref, fn));

    const mockEvent = new MouseEvent('click', { bubbles: true });

    act(() => {
      document.dispatchEvent(mockEvent);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback function when clicked inside the element', () => {
    const fn = jest.fn();
    const element = document.createElement('div');
    const child = document.createElement('button');
    element.appendChild(child);
    document.body.appendChild(element);
    const ref = { current: element };

    try {
      renderHook(() => useClickOutside(ref, fn));

      act(() => {
        child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(fn).not.toHaveBeenCalled();

      // The listener must still answer, or the assertion above proves nothing.
      act(() => {
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(fn).toHaveBeenCalledTimes(1);
    } finally {
      element.remove();
    }
  });
});
