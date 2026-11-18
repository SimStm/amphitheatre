import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge.tsx";

const meta = {
  title: "Base/Badge",
  component: Badge,
  args: { children: "Novo", tone: "accent" },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "muted", "accent", "stage", "danger", "live", "speaking", "selfhost", "attention"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {};
export const Stage: Story = { args: { tone: "stage", children: "No palco" } };
export const Live: Story = { args: { tone: "live", children: "Ao vivo" } };
export const Full: Story = { args: { tone: "neutral", children: "Cheia" } };
export const SelfHost: Story = { args: { tone: "selfhost", children: "Self-host" } };
export const Attention: Story = { args: { tone: "attention", children: "Modo básico" } };
