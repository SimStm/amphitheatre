import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert.tsx";

const meta = {
  title: "Base/Alert",
  component: Alert,
  args: { title: "Voz indisponível", children: "O chat continua funcionando." },
  argTypes: { tone: { control: "select", options: ["info", "warning", "danger"] } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Warning: Story = { args: { tone: "warning" } };
export const Danger: Story = { args: { tone: "danger" } };
