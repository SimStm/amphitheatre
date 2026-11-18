import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, TheaterSkeleton } from "./skeleton.tsx";

const meta = {
  title: "Base/Skeleton",
  component: Skeleton,
  args: { className: "h-12 w-64" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Room: Story = { render: () => <TheaterSkeleton /> };
