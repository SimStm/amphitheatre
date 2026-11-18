import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconAlertTriangle,
  IconLinkOff,
  IconLock,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { FlowStep, JoinFlow } from "../../hooks/use-join-flow.ts";
import { useCountdown } from "../../hooks/use-media.ts";
import { formatRemaining } from "../../lib/format.ts";
import { attemptsLeft } from "../../lib/join-flow.ts";
import { nameSchema, type NameValues } from "../../lib/schemas.ts";
import { useSessionStore } from "../../stores/session-store.ts";
import type { Room } from "../../shared-types.ts";
import { Button } from "../ui/button.tsx";
import { DialogFrame } from "../ui/dialog.tsx";
import { Field } from "../ui/field.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { IconTile } from "../ui/icon-tile.tsx";
import { Input } from "../ui/input.tsx";
import { PasswordInput } from "../ui/password-input.tsx";

type JoinDialogsProps = {
  flow: JoinFlow;
  onExit?: () => void;
  onOtherCode: () => void;
};

type ShellProps = {
  titleId: string;
  icon: ReactNode;
  tone?: "accent" | "danger";
  title: string;
  body: string;
  onClose: () => void;
  children?: ReactNode;
  actions: ReactNode;
  footer?: string;
};

function dialogGroup(step: FlowStep): string {
  switch (step.kind) {
    case "password":
    case "locked":
      return "password";
    case "needs-name":
    case "duplicate-name":
    case "rename":
      return "name";
    default:
      return step.kind;
  }
}

function Shell({ titleId, icon, tone = "accent", title, body, onClose, children, actions, footer }: ShellProps) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 flex-col overflow-y-auto">
      <div className="flex flex-col px-6 pt-8 sm:px-8">
        <div className="flex items-start justify-between">
          <IconTile tone={tone} size="lg">
            {icon}
          </IconTile>
          <IconButton label={t("app.close")} size="sm" onClick={onClose} className="-mr-2 -mt-1">
            <IconX aria-hidden="true" stroke={1.75} />
          </IconButton>
        </div>
        <h2 id={titleId} className="mt-5 font-display text-[22px] font-bold leading-7 text-ink">
          {title}
        </h2>
        <p className="mt-2 text-[14.5px] leading-[22px] text-ink-dim">{body}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
      <div className="mt-7 grid grid-cols-2 gap-4 border-t border-border px-6 pb-6 pt-7 sm:px-8">{actions}</div>
      {footer ? <p className="px-6 pb-6 text-center text-[13px] text-ink-subtle sm:px-8">{footer}</p> : null}
    </div>
  );
}

function PasswordStep({
  step,
  flow,
  titleId,
  onClose,
}: {
  step: Extract<FlowStep, { kind: "password" | "locked" }>;
  flow: JoinFlow;
  titleId: string;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const until = step.kind === "locked" ? step.until : null;
  const remaining = useCountdown(until);
  const locked = until !== null && remaining > 0;
  const wrong = step.kind === "password" && step.wrong;
  const failures = step.kind === "password" ? step.failures : 0;
  const left = attemptsLeft(failures);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (failures === 0) return;
    void animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.36 });
    inputRef.current?.select();
  }, [animate, failures, scope]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!password || locked || flow.busy) return;
    void flow.submitPassword(password);
  };

  return (
    <form onSubmit={submit}>
      <Shell
        titleId={titleId}
        icon={<IconLock stroke={1.75} />}
        title={t("join.protectedTitle", { name: step.room.name })}
        body={t("join.protectedBody")}
        onClose={onClose}
        footer={t("join.ownerHint")}
        actions={
          <>
            <Button type="button" variant="secondary" size="lg" onClick={onClose}>
              {t("join.back")}
            </Button>
            <Button type="submit" size="lg" loading={flow.busy} disabled={locked || !password}>
              {t("join.enter")}
            </Button>
          </>
        }
      >
        <div ref={scope}>
          <Field id="join-password" label={t("join.password")}>
            <PasswordInput
              ref={inputRef}
              id="join-password"
              value={password}
              error={wrong}
              disabled={locked}
              autoComplete="off"
              aria-describedby={wrong || locked ? "join-password-status" : undefined}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
        </div>
        <div id="join-password-status" className="mt-3 min-h-10 text-[13px]" role="status">
          {locked ? (
            <p className="font-bold text-danger-text">
              {t("join.lockout", { time: formatRemaining(remaining, i18n.language) })}
            </p>
          ) : wrong ? (
            <>
              <p className="font-bold text-danger-text">{t("join.wrongPassword")}</p>
              <p className="mt-1 text-ink-subtle">
                {left === 1
                  ? t("join.attemptsBeforeLockOne")
                  : t("join.attemptsBeforeLock", { count: left })}
              </p>
            </>
          ) : null}
        </div>
      </Shell>
    </form>
  );
}

function SeatPips({ room }: { room: Room }) {
  const shown = Math.min(room.memberLimit, 24);
  const stagger = Math.min(0.03, 0.36 / shown);
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: shown }, (_, index) => (
        <motion.span
          key={index}
          className="size-2.5 rounded-full bg-accent"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.35, visualDuration: 0.3, delay: index * stagger }}
        />
      ))}
    </div>
  );
}

function NameStep({
  step,
  flow,
  titleId,
  onClose,
}: {
  step: Extract<FlowStep, { kind: "needs-name" | "duplicate-name" | "rename" }>;
  flow: JoinFlow;
  titleId: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const draft = useSessionStore((s) => s.displayNameDraft);
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { displayName: draft },
  });
  const validation = form.formState.errors.displayName?.message;
  const error = validation
    ? t(validation)
    : step.kind === "duplicate-name"
      ? t("join.duplicateName")
      : undefined;

  useEffect(() => {
    form.setFocus("displayName", { shouldSelect: true });
  }, [form, step.kind]);

  return (
    <form onSubmit={form.handleSubmit((values) => flow.submitName(values.displayName))}>
      <Shell
        titleId={titleId}
        icon={<IconUser stroke={1.75} />}
        title={t("join.nameTitle")}
        body={t("join.nameBody")}
        onClose={onClose}
        actions={
          <>
            <Button type="button" variant="secondary" size="lg" onClick={onClose}>
              {t("join.back")}
            </Button>
            <Button type="submit" size="lg" loading={flow.busy}>
              {t("join.nameAction")}
            </Button>
          </>
        }
      >
        <Field id="join-name" label={t("join.nameLabel")} error={error}>
          <Input
            id="join-name"
            placeholder={t("join.namePlaceholder")}
            autoComplete="nickname"
            error={Boolean(error)}
            aria-describedby={error ? "join-name-error" : undefined}
            {...form.register("displayName")}
          />
        </Field>
      </Shell>
    </form>
  );
}

function StepContent({
  step,
  flow,
  titleId,
  onClose,
  onOtherCode,
}: {
  step: FlowStep;
  flow: JoinFlow;
  titleId: string;
  onClose: () => void;
  onOtherCode: () => void;
}) {
  const { t } = useTranslation();

  switch (step.kind) {
    case "password":
    case "locked":
      return <PasswordStep step={step} flow={flow} titleId={titleId} onClose={onClose} />;
    case "needs-name":
    case "duplicate-name":
    case "rename":
      return <NameStep step={step} flow={flow} titleId={titleId} onClose={onClose} />;
    case "full": {
      const counts = { count: step.room.memberCount, limit: step.room.memberLimit };
      return (
        <Shell
          titleId={titleId}
          icon={<IconUsers stroke={1.75} />}
          title={t("join.fullTitle")}
          body={t("join.fullBody", { name: step.room.name, ...counts })}
          onClose={onClose}
          footer={t("join.fullHint")}
          actions={
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("join.backHome")}
              </Button>
              <Button size="lg" loading={flow.busy} onClick={() => void flow.retry()}>
                {t("join.tryAgain")}
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-3 rounded-[var(--radius-control)] bg-surface-bright p-4">
            <SeatPips room={step.room} />
            <p className="font-display text-[13px] font-bold text-ink-soft">{t("join.fullSeats", counts)}</p>
          </div>
        </Shell>
      );
    }
    case "invalid":
      return (
        <Shell
          titleId={titleId}
          tone="danger"
          icon={<IconLinkOff stroke={1.75} />}
          title={t("join.invalidTitle")}
          body={t("join.invalidBody")}
          onClose={onClose}
          footer={t("join.invalidFooter")}
          actions={
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("join.backHome")}
              </Button>
              <Button size="lg" onClick={onOtherCode}>
                {t("join.otherCode")}
              </Button>
            </>
          }
        >
          <p className="font-display text-[13px] font-bold text-ink-soft">{t("join.invalidCode")}</p>
          <p className="mt-2 flex min-h-12 items-center break-all rounded-[var(--radius-control)] border border-border-input bg-surface-bright px-4 py-2 text-[15px] text-ink">
            {step.code}
          </p>
          <p className="mt-3 text-[13px] text-ink-subtle">{t("join.invalidHint")}</p>
        </Shell>
      );
    case "failed":
      return (
        <Shell
          titleId={titleId}
          tone="danger"
          icon={<IconAlertTriangle stroke={1.75} />}
          title={t("join.problemTitle")}
          body={t(step.messageKey)}
          onClose={onClose}
          actions={
            <>
              <Button variant="secondary" size="lg" onClick={onClose}>
                {t("join.backHome")}
              </Button>
              <Button size="lg" loading={flow.busy} onClick={() => void flow.retry()}>
                {t("join.tryAgain")}
              </Button>
            </>
          }
        />
      );
  }
}

export function JoinDialogs({ flow, onExit, onOtherCode }: JoinDialogsProps) {
  const titleId = useId();
  const { step } = flow;
  const [shown, setShown] = useState(step);
  if (step && step !== shown) setShown(step);
  const visible = step ?? shown;

  const exit = () => {
    flow.close();
    onExit?.();
  };

  return (
    <DialogFrame open={step !== null} onClose={exit} labelledBy={titleId}>
      <AnimatePresence mode="wait" initial={false}>
        {visible ? (
          <motion.div
            key={dialogGroup(visible)}
            className="flex min-h-0 flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            <StepContent
              step={visible}
              flow={flow}
              titleId={titleId}
              onClose={exit}
              onOtherCode={onOtherCode}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </DialogFrame>
  );
}
