import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatSurface } from "./float-surface.tsx";

const meta = {
  title: "Base/FloatSurface",
  component: FloatSurface,
  args: { className: "w-60 p-4 text-sm", children: "Superfície flutuante sobre o palco" },
} satisfies Meta<typeof FloatSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Strong: Story = { args: { strong: true } };
