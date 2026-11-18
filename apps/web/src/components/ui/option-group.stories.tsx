import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useState } from "react";
import { OptionGroup } from "./option-group.tsx";

function ThemeExample() {
  const [value, setValue] = useState("dark");
  return (
    <OptionGroup
      name="theme-example"
      label="Tema"
      value={value}
      onChange={setValue}
      className="grid max-w-xs grid-cols-2"
      options={[
        { value: "light", label: "Claro", icon: <IconSun stroke={1.75} aria-hidden="true" /> },
        { value: "dark", label: "Escuro", icon: <IconMoon stroke={1.75} aria-hidden="true" /> },
      ]}
    />
  );
}

function SecondsExample() {
  const [value, setValue] = useState(5);
  return (
    <OptionGroup
      name="seconds-example"
      label="Esconder depois de"
      value={value}
      onChange={setValue}
      options={[5, 10, 20, 30].map((seconds) => ({ value: seconds, label: `${seconds} s` }))}
    />
  );
}

const meta = {
  title: "Base/OptionGroup",
  component: ThemeExample,
} satisfies Meta<typeof ThemeExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcons: Story = {};
export const Numbers: Story = { render: () => <SecondsExample /> };
