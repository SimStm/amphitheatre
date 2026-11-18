import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarStack } from "./avatar-stack.tsx";

const meta = {
  title: "Base/AvatarStack",
  component: AvatarStack,
  args: {
    people: [
      { id: "rafa", name: "Rafa", speaking: true },
      { id: "lia", name: "Lia" },
      { id: "caio", name: "Caio" },
      { id: "bruno", name: "Bruno" },
    ],
  },
} satisfies Meta<typeof AvatarStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
