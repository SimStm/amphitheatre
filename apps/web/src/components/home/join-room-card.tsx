import { zodResolver } from "@hookform/resolvers/zod";
import { IconLink } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { JoinFlow } from "../../hooks/use-join-flow.ts";
import { listRooms } from "../../lib/api.ts";
import { joinCodeSchema, type JoinCodeValues } from "../../lib/schemas.ts";
import { Button } from "../ui/button.tsx";
import { Card } from "../ui/card.tsx";
import { Label } from "../ui/field.tsx";
import { Input } from "../ui/input.tsx";
import { Skeleton } from "../ui/skeleton.tsx";
import { PublicRoomRow } from "./public-room-row.tsx";

const COLLAPSED_ROOMS = 3;

function PublicRooms({ flow }: { flow: JoinFlow }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const rooms = useQuery({ queryKey: ["public-rooms"], queryFn: listRooms, refetchInterval: 15000 });
  const list = rooms.data ?? [];
  const shown = expanded ? list : list.slice(0, COLLAPSED_ROOMS);

  return (
    <div className="flex flex-1 flex-col gap-3 border-t border-border-soft px-3 pb-2 pt-[18px] sm:px-4">
      <div className="flex items-baseline justify-between px-2 sm:px-3">
        <h3 className="font-display text-[15px] font-bold leading-5 text-ink">{t("home.publicRooms")}</h3>
        {list.length > COLLAPSED_ROOMS ? (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="text-[13px] text-accent-text underline-offset-2 hover:underline"
          >
            {expanded ? t("home.seeFewer") : t("home.seeAll")}
          </button>
        ) : null}
      </div>

      {rooms.isPending ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: COLLAPSED_ROOMS }, (_, index) => (
            <Skeleton key={index} className="h-[50px] rounded-[var(--radius-tile)]" />
          ))}
        </div>
      ) : rooms.isError ? (
        <p className="px-2 py-3 text-[13px] text-ink-dim sm:px-3" role="status">
          {t("home.publicRoomsError")}
        </p>
      ) : list.length === 0 ? (
        <p className="px-2 py-3 text-[13px] text-ink-dim sm:px-3">{t("home.publicRoomsEmpty")}</p>
      ) : (
        <motion.ul
          layout
          className="hide-scrollbar flex max-h-[232px] flex-col gap-2 overflow-y-auto"
          transition={{ type: "spring", bounce: 0.1, visualDuration: 0.3 }}
        >
          <AnimatePresence initial={false}>
            {shown.map((room) => (
              <PublicRoomRow
                key={room.id}
                room={room}
                onOpen={(target) => void flow.begin(target.id, { room: target })}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

export function JoinRoomCard({ flow, focusToken }: { flow: JoinFlow; focusToken: number }) {
  const { t } = useTranslation();
  const form = useForm<JoinCodeValues>({
    resolver: zodResolver(joinCodeSchema),
    defaultValues: { roomId: "" },
  });
  const codeError = form.formState.errors.roomId?.message;

  useEffect(() => {
    if (focusToken > 0) form.setFocus("roomId", { shouldSelect: true });
  }, [focusToken, form]);

  const submit = form.handleSubmit((values) => flow.begin(values.roomId));

  return (
    <Card icon={<IconLink stroke={1.75} />} title={t("home.joinTitle")}>
      <form className="flex flex-col gap-2 px-5 pb-[22px] pt-6 sm:px-7" onSubmit={submit} noValidate>
        <Label htmlFor="room-code">{t("home.roomId")}</Label>
        <div className="flex gap-3">
          <Input
            id="room-code"
            className="min-w-0 flex-1"
            placeholder={t("home.roomIdPlaceholder")}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            error={Boolean(codeError)}
            aria-describedby={codeError ? "room-code-error" : "room-code-hint"}
            {...form.register("roomId")}
          />
          <Button type="submit" variant="secondary" size="lg" className="w-[104px] shrink-0" loading={flow.busy}>
            {t("home.joinAction")}
          </Button>
        </div>
        {codeError ? (
          <p id="room-code-error" role="alert" className="text-[12.5px] font-bold text-danger-text">
            {t(codeError)}
          </p>
        ) : (
          <p id="room-code-hint" className="text-[12.5px] text-ink-subtle">
            {t("home.roomIdHint")}
          </p>
        )}
      </form>
      <PublicRooms flow={flow} />
    </Card>
  );
}
