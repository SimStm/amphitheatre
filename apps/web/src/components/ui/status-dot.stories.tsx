import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusDot } from "./status-dot.tsx";

const meta = {
  title: "Base/StatusDot",
  component: StatusDot,
  args: { tone: "live" },
  argTypes: { tone: { control: "select", options: ["live", "speaking", "attention", "idle"] } },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = { args: { pulse: true } };
export const Speaking: Story = { args: { tone: "speaking" } };
export const Attention: Story = { args: { tone: "attention" } };
export const Idle: Story = { args: { tone: "idle" } };
