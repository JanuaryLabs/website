import type { Meta as MetaObj, StoryObj } from '@storybook/nextjs';

import NodejsLogo from '@/components/Common/NodejsLogo';

type Story = StoryObj<typeof NodejsLogo>;
type Meta = MetaObj<typeof NodejsLogo>;

export const Default: Story = {};

export default { component: NodejsLogo } as Meta;
