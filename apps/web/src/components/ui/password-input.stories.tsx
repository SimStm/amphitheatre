import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInput } from "./password-input.tsx";

const meta = {
  title: "Base/PasswordInput",
  component: PasswordInput,
  args: { "aria-label": "Senha da sala", defaultValue: "segredo" },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = { args: { error: true } };
