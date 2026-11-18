import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { banMember, kickMember, muteMember, setMemberRole } from "../../lib/api.ts";
import { cn } from "../../lib/cn.ts";
import { canManageRoles, canModerateTarget } from "../../lib/permissions.ts";
import type { AssignableRole, Role, RoomMember } from "../../shared-types.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { Avatar } from "../ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import { Dialog } from "../ui/dialog.tsx";
import { RoleBadge } from "../ui/role-badge.tsx";

type Pending = "kick" | "ban" | "mute" | AssignableRole | null;

export type MemberTarget = {
  roomId: string;
  actorRole?: Role;
  member: RoomMember;
  isSelf: boolean;
  localMuted?: boolean;
};

export type MemberActionsShell = (props: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) => ReactNode;

type MemberActionsProps = MemberTarget & {
  open: boolean;
  onClose: () => void;
  shell: MemberActionsShell;
  identityClassName?: string;
};

/** Member details and actions, shown by a dialog or a popover through `shell`. */
export function MemberActions({
  open,
  onClose,
  shell,
  identityClassName,
  roomId,
  actorRole,
  member,
  isSelf,
  localMuted,
}: MemberActionsProps) {
  const { t } = useTranslation();
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);
  const setLocalMuted = useRoomStore((s) => s.setLocalMuted);

  const canKick = Boolean(actorRole && !isSelf && canModerateTarget(actorRole, member.role, "kick"));
  const canMute = Boolean(actorRole && !isSelf && canModerateTarget(actorRole, member.role, "mute"));
  const canBan = Boolean(actorRole && !isSelf && canModerateTarget(actorRole, member.role, "ban"));
  const canRoles = Boolean(
    actorRole && !isSelf && canManageRoles(actorRole) && canModerateTarget(actorRole, member.role, "role"),
  );

  const run = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      if (pending === "kick") {
        await kickMember(roomId, member.userId);
        toast.success(t("toast.kicked", { name: member.displayName }));
      } else if (pending === "ban") {
        await banMember(roomId, member.userId);
        toast.success(t("toast.banned", { name: member.displayName }));
      } else if (pending === "mute") {
        await muteMember(roomId, { userId: member.userId, muted: !member.muted });
        toast.success(t(member.muted ? "toast.unmuted" : "toast.muted", { name: member.displayName }));
      } else {
        await setMemberRole(roomId, { userId: member.userId, role: pending });
        toast.success(t("toast.roleChanged"));
      }
      setPending(null);
      onClose();
    } catch {
      toast.error(t("error.generic"));
    } finally {
      setBusy(false);
    }
  };

  const confirmTitle =
    pending === "kick"
      ? t("mod.kickTitle", { name: member.displayName })
      : pending === "ban"
        ? t("mod.banTitle", { name: member.displayName })
        : pending === "mute"
          ? t("mod.muteTitle", { name: member.displayName })
          : pending
            ? t("mod.roleTitle", { name: member.displayName })
            : t("mod.memberTitle", { name: member.displayName });

  return (
    <>
      {shell({
        open: open && pending === null,
        onClose,
        title: t("mod.memberTitle", { name: member.displayName }),
        children: (
          <>
            <div className={cn("flex items-center gap-3", identityClassName)}>
              <Avatar id={member.userId} name={member.displayName} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">
                  {member.displayName}
                  {isSelf ? <span className="text-ink-subtle"> ({t("app.you")})</span> : null}
                </p>
                <RoleBadge role={member.role} />
              </div>
            </div>
            {canRoles ? (
              <fieldset className="mt-4">
                <legend className="label-caps mb-2 text-ink-muted">{t("mod.roleLegend")}</legend>
                <div className="grid gap-2">
                  {(["admin", "moderator", "member"] as const).map((role) => (
                    <Button
                      key={role}
                      variant={member.role === role ? "primary" : "secondary"}
                      onClick={() => setPending(role)}
                      disabled={member.role === role}
                    >
                      {t(role === "admin" ? "mod.setAdmin" : role === "moderator" ? "mod.setModerator" : "mod.setMember")}
                    </Button>
                  ))}
                </div>
              </fieldset>
            ) : null}
            {canMute || canKick || canBan ? (
              <div className="mt-4 flex flex-col gap-2">
                {canMute ? (
                  <Button variant="secondary" onClick={() => setPending("mute")}>
                    {member.muted ? t("mod.unmute") : t("mod.mute")}
                  </Button>
                ) : null}
                {canKick ? (
                  <Button variant="secondary" onClick={() => setPending("kick")}>
                    {t("mod.kick")}
                  </Button>
                ) : null}
                {canBan ? (
                  <Button variant="danger" onClick={() => setPending("ban")}>
                    {t("mod.ban")}
                  </Button>
                ) : null}
              </div>
            ) : null}
            {!isSelf ? (
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="secondary" onClick={() => setLocalMuted(member.userId, !localMuted)}>
                  {localMuted ? t("mod.unmuteLocally") : t("mod.muteLocally")}
                </Button>
              </div>
            ) : null}
            {isSelf ? <p className="mt-4">{t("mod.selfHint")}</p> : null}
          </>
        ),
      })}
      <Dialog
        open={pending !== null}
        onClose={() => setPending(null)}
        title={confirmTitle}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPending(null)}>
              {t("app.cancel")}
            </Button>
            <Button
              variant={pending === "ban" || pending === "kick" ? "danger" : "primary"}
              onClick={() => void run()}
              loading={busy}
            >
              {t("app.confirm")}
            </Button>
          </>
        }
      >
        <p>
          {pending === "kick"
            ? t("mod.kickBody")
            : pending === "ban"
              ? t("mod.banBody")
              : pending === "mute"
                ? t("mod.muteBody")
                : t("mod.roleBody")}
        </p>
      </Dialog>
    </>
  );
}
