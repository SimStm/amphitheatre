import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "./button.tsx";

const meta = {
  title: "Base/Button",
  component: Button,
  args: { children: "Criar sala", variant: "primary", size: "lg" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg", "touch"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Voltar" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Cancelar" } };
export const Danger: Story = { args: { variant: "danger", children: "Sair da sala" } };
export const Loading: Story = { args: { loading: true } };
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <IconPlus aria-hidden stroke={1.75} /> Convidar
      </>
    ),
  },
};
