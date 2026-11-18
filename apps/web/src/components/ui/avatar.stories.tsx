import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar.tsx";

const meta = {
  title: "Base/Avatar",
  component: Avatar,
  args: { id: "rafa", name: "Rafa Lima", size: "rail" },
  argTypes: { size: { control: "select", options: ["xs", "sm", "md", "rail", "railSmall"] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Speaking: Story = { args: { speaking: true } };
export const Self: Story = { args: { self: true } };
export const ChatOnly: Story = { args: { size: "railSmall", dimmed: true } };
