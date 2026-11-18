import { limits } from "@coliseum/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCountdown } from "../../hooks/use-media.ts";
import { cn } from "../../lib/cn.ts";
import { formatClock } from "../../lib/format.ts";
import { isHighlightedRole, roleTextClass } from "../../lib/role-style.ts";
import { chatSchema } from "../../lib/schemas.ts";
import type { ChatMessage, Role } from "../../shared-types.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { useUiStore } from "../../stores/ui-store.ts";
import { Avatar } from "../ui/avatar.tsx";
import { RoleIcon } from "../ui/role-badge.tsx";

type ChatPanelProps = {
  messages: ChatMessage[];
  selfId?: string;
  selfName?: string;
  roomName?: string;
  mutedUntil?: number | null;
  onSend: (text: string) => boolean;
};

function renderText(text: string, mention: string | null): ReactNode {
  if (!mention) return text;
  const index = text.toLowerCase().indexOf(mention.toLowerCase());
  if (index < 0) return text;
  const end = index + mention.length;
  return (
    <>
      {text.slice(0, index)}
      <span className="rounded bg-accent-soft px-1 font-bold text-accent-text">{text.slice(index, end)}</span>
      {text.slice(end)}
    </>
  );
}

export function ChatPanel({ messages, selfId, selfName, roomName, mutedUntil, onSend }: ChatPanelProps) {
  const { t } = useTranslation();
  const locale = useUiStore((s) => s.locale);
  const members = useRoomStore((s) => s.room?.members);
  const roles = useMemo(
    () => new Map<string, Role>(members?.map((member) => [member.userId, member.role])),
    [members],
  );
  const listRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const form = useForm<{ text: string }>({
    resolver: zodResolver(chatSchema),
    defaultValues: { text: useRoomStore.getState().chatDraft },
  });
  const text = form.watch("text");
  const remaining = useCountdown(mutedUntil ?? null);
  const muted = remaining > 0;
  const mention = selfName ? `@${selfName}` : null;
  const nearLimit = (text ?? "").length > limits.chatText.max * 0.8;
  const errorKey = form.formState.errors.text?.message;

  useEffect(() => {
    // Scrolls only the list: scrollIntoView would also move the room while the panel slides in.
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    useRoomStore.getState().setChatDraft(text ?? "");
    const element = areaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, [text]);

  const { ref: registerRef, ...textField } = form.register("text");

  const submit = form.handleSubmit((values) => {
    if (muted) return;
    if (onSend(values.text)) form.reset({ text: "" });
  });

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={t("a11y.chatRegion")}>
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <IconMessageCircle className="size-7 text-ink-faint" stroke={1.5} aria-hidden="true" />
            <p className="font-display text-sm font-bold text-ink">{t("theater.chatEmptyTitle")}</p>
            <p className="text-[13px] leading-5 text-ink-dim">{t("theater.chatEmptyBody")}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const mine = message.userId === selfId;
                const role = roles.get(message.userId);
                const mentioned =
                  !mine && mention !== null && message.text.toLowerCase().includes(mention.toLowerCase());
                return (
                  <motion.li
                    key={message.id}
                    className={cn(
                      "flex min-w-0 gap-2.5 rounded-lg border-l-2 py-1.5 pl-2 pr-2.5",
                      mentioned ? "border-accent bg-accent-faint" : "border-transparent",
                    )}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.1, visualDuration: 0.24 }}
                  >
                    <Avatar
                      id={message.userId}
                      name={message.displayName}
                      size="xs"
                      className="mt-0.5 size-[26px]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <RoleIcon role={role} />
                        <span
                          className={cn(
                            "truncate font-display text-[13px] font-bold",
                            isHighlightedRole(role)
                              ? roleTextClass[role]
                              : mine
                                ? "text-accent-text"
                                : "text-ink",
                          )}
                        >
                          {mine ? t("app.you") : message.displayName}
                        </span>
                        <time className="shrink-0 text-[11px] text-ink-subtle" dateTime={message.createdAt}>
                          {formatClock(message.createdAt, locale)}
                        </time>
                      </div>
                      <p className="whitespace-pre-wrap text-[13.5px] leading-5 text-ink-soft [overflow-wrap:anywhere]">
                        {renderText(message.text, mention)}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <form className="shrink-0 px-2 pb-2" onSubmit={submit}>
        <div className="flex items-end gap-1.5 rounded-[var(--radius-control)] border border-border-input bg-surface-sunken py-1 pl-3 pr-1 focus-within:border-accent">
          <label htmlFor="chat-message" className="sr-only">
            {t("theater.chatLabel")}
          </label>
          <textarea
            id="chat-message"
            rows={1}
            maxLength={limits.chatText.max}
            disabled={muted}
            placeholder={
              muted
                ? t("theater.chatMuted")
                : roomName
                  ? t("theater.chatPlaceholderNamed", { name: roomName })
                  : t("theater.chatPlaceholder")
            }
            className="max-h-40 min-h-9 min-w-0 flex-1 resize-none border-0 bg-transparent py-1.5 text-base leading-6 text-ink outline-none placeholder:text-ink-faint disabled:opacity-60 sm:text-sm"
            aria-invalid={Boolean(errorKey) || undefined}
            {...textField}
            ref={(element) => {
              registerRef(element);
              areaRef.current = element;
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit();
              }
            }}
          />
          <button
            type="submit"
            disabled={muted}
            aria-label={t("theater.chatSend")}
            className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent text-ink-on-accent transition-colors hover:bg-accent-hover active:scale-95 disabled:opacity-40"
          >
            <IconSend className="size-4" stroke={1.9} aria-hidden="true" />
          </button>
        </div>
        {nearLimit || errorKey ? (
          <div className="mt-1 flex items-center justify-between gap-2 px-1 text-[11px] text-ink-subtle">
            <span>
              {(text ?? "").length}/{limits.chatText.max}
            </span>
            {errorKey ? (
              <p className="text-danger-text" role="alert">
                {t(errorKey)}
              </p>
            ) : null}
          </div>
        ) : null}
      </form>
    </section>
  );
}
