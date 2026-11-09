import { render, waitFor } from '@testing-library/react';

import Mermaid from '@/components/MDX/Mermaid';

const mockMermaid = { initialize: jest.fn(), contentLoaded: jest.fn() };

jest.mock('mermaid', () => ({ __esModule: true, default: mockMermaid }));

describe('Mermaid', () => {
  it('draws the chart only after the page font has loaded', async () => {
    const { promise: fontLoaded, resolve: finishFontLoad } =
      Promise.withResolvers();
    const load = jest.fn(() => fontLoaded);
    Object.defineProperty(document, 'fonts', { value: { load } });
    document.documentElement.style.setProperty(
      '--font-inter',
      'intervariable, sans-serif'
    );

    render(<Mermaid chart="erDiagram" />);

    await waitFor(() =>
      expect(load).toHaveBeenCalledWith('16px intervariable, sans-serif')
    );
    // The import of mermaid resolves on a later task, so give it the chance to run
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(mockMermaid.contentLoaded).not.toHaveBeenCalled();

    finishFontLoad([]);

    await waitFor(() => expect(mockMermaid.contentLoaded).toHaveBeenCalled());
  });
});
