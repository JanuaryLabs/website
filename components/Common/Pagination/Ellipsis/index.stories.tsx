import type { Meta as MetaObj, StoryObj } from '@storybook/nextjs';

import Ellipsis from '@/components/Common/Pagination/Ellipsis';

type Story = StoryObj<typeof Ellipsis>;
type Meta = MetaObj<typeof Ellipsis>;

export const Default: Story = {};

export default { component: Ellipsis } as Meta;
