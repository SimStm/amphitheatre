import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Role } from "../../shared-types.ts";
import { Avatar } from "./avatar.tsx";
import { RoleBadge, RoleIcon, RoleMark } from "./role-badge.tsx";

const people: { role: Role; name: string }[] = [
  { role: "owner", name: "Rafa Lima" },
  { role: "admin", name: "Bia Souza" },
  { role: "moderator", name: "Caio Reis" },
  { role: "member", name: "Duda Melo" },
];

function Demo() {
  return (
    <ul className="flex flex-col gap-4">
      {people.map(({ role, name }) => (
        <li key={role} className="flex items-center gap-4">
          <span className="relative inline-flex">
            <Avatar id={name} name={name} size="rail" />
            <RoleMark role={role} className="absolute -left-1 -top-1" />
          </span>
          <RoleBadge role={role} />
          <span className="flex items-center gap-1 font-display text-[13px] font-bold text-ink">
            <RoleIcon role={role} />
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

const meta = {
  title: "Base/RoleBadge",
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllRoles: Story = {};
