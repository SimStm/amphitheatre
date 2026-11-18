import { zodResolver } from "@hookform/resolvers/zod";
import { IconLock, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { JoinFlow } from "../../hooks/use-join-flow.ts";
import { createRoom } from "../../lib/api.ts";
import { createRoomSchema, type CreateRoomValues } from "../../lib/schemas.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { useSessionStore } from "../../stores/session-store.ts";
import { Button } from "../ui/button.tsx";
import { Card } from "../ui/card.tsx";
import { Field } from "../ui/field.tsx";
import { Input } from "../ui/input.tsx";
import { RadioCard } from "../ui/radio-card.tsx";

export function CreateRoomCard({ flow }: { flow: JoinFlow }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setRoom = useRoomStore((s) => s.setRoom);
  const draft = useSessionStore((s) => s.displayNameDraft);
  const setDraft = useSessionStore((s) => s.setDisplayNameDraft);
  const form = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { displayName: draft, name: "", visibility: "public", password: "" },
  });
  const nameError = form.formState.errors.name?.message;
  const displayNameError = form.formState.errors.displayName?.message;

  useEffect(() => {
    if (form.getValues("displayName") === draft) return;
    form.setValue("displayName", draft, { shouldValidate: form.formState.isSubmitted });
  }, [draft, form]);

  const submit = form.handleSubmit((values) =>
    flow.ensureSession(async () => {
      try {
        const room = await createRoom({
          name: values.name,
          isPublic: values.visibility === "public",
          password: values.password.trim() || undefined,
        });
        setRoom(room);
        toast.success(t("toast.roomCreated"));
        await navigate({ to: "/rooms/$roomId", params: { roomId: room.id } });
      } catch {
        toast.error(t("toast.createFailed"));
      }
    }),
  );

  return (
    <Card icon={<IconPlus stroke={1.9} />} title={t("home.createTitle")}>
      <form className="flex flex-1 flex-col gap-[18px] px-5 pb-[22px] pt-6 sm:px-7" onSubmit={submit} noValidate>
        <Field
          id="display-name"
          label={t("join.nameLabel")}
          error={displayNameError ? t(displayNameError) : undefined}
        >
          <Input
            id="display-name"
            placeholder={t("join.namePlaceholder")}
            autoComplete="nickname"
            error={Boolean(displayNameError)}
            aria-describedby={displayNameError ? "display-name-error" : undefined}
            {...form.register("displayName", {
              onChange: (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
            })}
          />
        </Field>
        <Field id="room-name" label={t("home.roomName")} error={nameError ? t(nameError) : undefined}>
          <Input
            id="room-name"
            placeholder={t("home.roomNamePlaceholder")}
            autoComplete="off"
            error={Boolean(nameError)}
            aria-describedby={nameError ? "room-name-error" : undefined}
            {...form.register("name")}
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-[13px] leading-4 text-ink-muted">{t("home.visibility")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <RadioCard
              value="public"
              title={t("home.visibilityPublic")}
              description={t("home.visibilityPublicHint")}
              {...form.register("visibility")}
            />
            <RadioCard
              value="private"
              title={t("home.visibilityPrivate")}
              description={t("home.visibilityPrivateHint")}
              {...form.register("visibility")}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Field id="room-password" label={t("home.password")} optional={t("home.passwordOptional")}>
            <Input
              id="room-password"
              type="password"
              autoComplete="new-password"
              placeholder={t("home.passwordPlaceholder")}
              leading={<IconLock stroke={1.75} aria-hidden="true" />}
              {...form.register("password")}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" loading={form.formState.isSubmitting}>
            {t("home.createAction")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
