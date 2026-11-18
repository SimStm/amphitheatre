import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconLock } from "@tabler/icons-react";
import { Input, Textarea } from "./input.tsx";

const meta = {
  title: "Base/Input",
  component: Input,
  args: { placeholder: "Cole o link ou digite o código", "aria-label": "Código" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Leading: Story = { args: { leading: <IconLock stroke={1.75} />, placeholder: "Sem senha" } };
export const WithError: Story = { args: { error: true, defaultValue: "Xk7pQ2" } };
export const Multiline: Story = {
  render: () => <Textarea aria-label="Mensagem" placeholder="Mensagem para a sala" />,
};
