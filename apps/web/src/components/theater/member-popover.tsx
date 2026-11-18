import { Popover } from "../ui/popover.tsx";
import { MemberActions, type MemberTarget } from "./member-actions.tsx";

type MemberPopoverProps = MemberTarget & {
  open: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
};

export function MemberPopover({ anchor, ...props }: MemberPopoverProps) {
  return (
    <MemberActions
      {...props}
      identityClassName="pr-8"
      shell={({ open, onClose, title, children }) => (
        <Popover open={open} onClose={onClose} anchor={anchor} label={title} className="p-4">
          {children}
        </Popover>
      )}
    />
  );
}
