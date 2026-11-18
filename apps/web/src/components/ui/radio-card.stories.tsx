import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCard } from "./radio-card.tsx";

const meta = {
  title: "Base/RadioCard",
  component: RadioCard,
  args: { name: "visibility", title: "Pública", description: "Aparece na lista de salas abertas" },
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};
export const Selected: Story = { args: { defaultChecked: true } };
