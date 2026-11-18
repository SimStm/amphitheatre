import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconLinkOff, IconLock, IconPlus } from "@tabler/icons-react";
import { IconTile } from "./icon-tile.tsx";

const meta = {
  title: "Base/IconTile",
  component: IconTile,
  args: { children: <IconPlus stroke={1.75} /> },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};
export const Large: Story = { args: { size: "lg", children: <IconLock stroke={1.75} /> } };
export const Danger: Story = { args: { size: "lg", tone: "danger", children: <IconLinkOff stroke={1.75} /> } };
