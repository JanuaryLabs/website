import type { Meta as MetaObj, StoryObj } from '@storybook/nextjs';

import ThemeToggle from '@/components/Common/ThemeToggle';

type Story = StoryObj<typeof ThemeToggle>;
type Meta = MetaObj<typeof ThemeToggle>;

export const Default: Story = {};

export default { component: ThemeToggle } as Meta;
