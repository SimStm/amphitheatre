import { cn } from "../../lib/cn.ts";
import { Avatar } from "./avatar.tsx";

export type AvatarStackPerson = { id: string; name: string; speaking?: boolean };

export function AvatarStack({
  people,
  max = 3,
  className,
}: {
  people: AvatarStackPerson[];
  max?: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("inline-flex items-center", className)}>
      {people.slice(0, max).map((person, index) => (
        <Avatar
          key={person.id}
          id={person.id}
          name={person.name}
          size="xs"
          speaking={person.speaking}
          className={cn("relative ring-2 ring-surface-window", index > 0 && "-ml-1.5")}
        />
      ))}
    </span>
  );
}
