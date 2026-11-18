import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.tsx";
import { Tooltip } from "./tooltip.tsx";

const meta = {
  title: "Base/Tooltip",
  component: Tooltip,
  args: { label: "Configurações", side: "right", children: <Button variant="secondary">Passe o mouse</Button> },
  argTypes: { side: { control: "select", options: ["top", "bottom", "left", "right"] } },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
