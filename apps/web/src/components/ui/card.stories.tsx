import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconDoor } from "@tabler/icons-react";
import { Card, CardBody } from "./card.tsx";

const meta = {
  title: "Base/Card",
  component: Card,
  args: {
    className: "max-w-md",
    icon: <IconDoor stroke={1.75} />,
    title: "A sala é o produto",
    children: (
      <CardBody>
        <p className="text-[15px] leading-6 text-ink-dim">
          Um código curto e um nome bastam para entrar e passar a noite junto.
        </p>
      </CardBody>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
