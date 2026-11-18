import { Dialog } from "../ui/dialog.tsx";
import { MemberActions, type MemberTarget } from "./member-actions.tsx";

type MemberPermissionsModalProps = MemberTarget & {
  open: boolean;
  onClose: () => void;
};

export function MemberPermissionsModal(props: MemberPermissionsModalProps) {
  return (
    <MemberActions
      {...props}
      shell={({ open, onClose, title, children }) => (
        <Dialog open={open} onClose={onClose} title={title}>
          {children}
        </Dialog>
      )}
    />
  );
}
