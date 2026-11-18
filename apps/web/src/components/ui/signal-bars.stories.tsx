import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignalBars } from "./signal-bars.tsx";

const meta = {
  title: "Base/SignalBars",
  component: SignalBars,
  args: { quality: "excellent", label: "Conexão excelente" },
  argTypes: { quality: { control: "select", options: ["excellent", "good", "poor", "lost", "unknown"] } },
} satisfies Meta<typeof SignalBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Excellent: Story = {};
export const Good: Story = { args: { quality: "good", label: "Conexão boa" } };
export const Poor: Story = { args: { quality: "poor", label: "Conexão ruim" } };
export const Lost: Story = { args: { quality: "lost", label: "Conexão perdida" } };
