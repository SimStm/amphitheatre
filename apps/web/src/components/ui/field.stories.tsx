import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./field.tsx";
import { Input } from "./input.tsx";

const meta = {
  title: "Base/Field",
  component: Field,
  args: { id: "room-name", label: "Nome da sala", children: <Input id="room-name" /> },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Optional: Story = { args: { label: "Senha", optional: "opcional" } };
export const Hint: Story = { args: { hint: "O código diferencia maiúsculas de minúsculas." } };
export const WithError: Story = { args: { error: "Senha incorreta." } };
