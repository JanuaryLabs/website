import { STORYBOOK_MODES, STORYBOOK_SIZES } from '@/.storybook/constants';
import { NotificationProvider } from '@/providers/notificationProvider';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/nextjs';

import '@/next.fonts';
import '@/styles/index.css';

const preview: Preview = {
  parameters: {
    nextjs: { router: { basePath: '' }, appDirectory: true },
    chromatic: { modes: STORYBOOK_MODES },
    viewport: { options: STORYBOOK_SIZES },
  },
  initialGlobals: { viewport: { value: 'large' } },
  decorators: [
    Story => (
      <NotificationProvider viewportClassName="absolute top-0 left-0 list-none">
        <Story />
      </NotificationProvider>
    ),
    withThemeByDataAttribute<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
