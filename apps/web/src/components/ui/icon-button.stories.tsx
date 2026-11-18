import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconMessageCircle, IconMicrophoneOff, IconPhoneOff } from "@tabler/icons-react";
import { IconButton } from "./icon-button.tsx";

const meta = {
  title: "Base/IconButton",
  component: IconButton,
  args: { label: "Chat", children: <IconMessageCircle aria-hidden stroke={1.75} /> },
  decorators: [
    (Story) => (
      <div className="pt-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Raised: Story = { args: { tone: "raised" } };
export const Active: Story = { args: { tone: "active" } };
export const WithBadge: Story = { args: { badge: 2 } };
export const Off: Story = {
  args: { tone: "off", label: "Microfone desligado", children: <IconMicrophoneOff aria-hidden stroke={1.75} /> },
};
export const Danger: Story = {
  args: { tone: "danger", size: "xs", label: "Sair da voz", children: <IconPhoneOff aria-hidden stroke={1.75} /> },
};
