import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button.tsx";
import { Popover } from "./popover.tsx";

function Demo({ text }: { text: string }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(event) => {
          setAnchor(event.currentTarget);
          setOpen((value) => !value);
        }}
      >
        Abrir
      </Button>
      <Popover open={open} onClose={() => setOpen(false)} anchor={anchor} label="Detalhes" className="p-4 pr-11">
        {text}
      </Popover>
    </>
  );
}

const meta = {
  title: "Base/Popover",
  component: Demo,
  args: { text: "Fecha no X, com Esc, clicando fora ou no botão de novo." },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
