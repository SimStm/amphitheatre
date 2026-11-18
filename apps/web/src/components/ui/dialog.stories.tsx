import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button.tsx";
import { Dialog } from "./dialog.tsx";

function Demo({ size }: { size: "md" | "lg" | "xl" | "full" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Sair da sala?"
        size={size}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Ficar
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Sair
            </Button>
          </>
        }
      >
        Você pode voltar pelo mesmo link enquanto a sala existir.
      </Dialog>
    </>
  );
}

const meta = {
  title: "Base/Dialog",
  component: Demo,
  args: { size: "md" },
  argTypes: { size: { control: "select", options: ["md", "lg", "xl", "full"] } },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };
