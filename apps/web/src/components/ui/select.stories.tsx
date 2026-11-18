import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconMicrophone } from "@tabler/icons-react";
import { Select } from "./select.tsx";

const meta = {
  title: "Base/Select",
  component: Select,
  args: {
    "aria-label": "Idioma",
    defaultValue: "pt-BR",
    children: (
      <>
        <option value="en">English</option>
        <option value="pt-BR">Português (Brasil)</option>
        <option value="es">Español</option>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { leading: <IconMicrophone stroke={1.75} /> } };
export const Disabled: Story = { args: { disabled: true } };
