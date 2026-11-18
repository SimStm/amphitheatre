import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useJoinFlow, type JoinFlow } from "../../hooks/use-join-flow.ts";
import { getSession } from "../../lib/api.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { useSessionStore } from "../../stores/session-store.ts";
import { PwaInstallBanner } from "../chrome/pwa-install.tsx";
import { JoinDialogs } from "../join/join-dialogs.tsx";
import { PageIntro, SiteShell } from "../site/site-shell.tsx";
import { CreateRoomCard } from "./create-room-card.tsx";
import { HomeHeader } from "./home-header.tsx";
import { JoinRoomCard } from "./join-room-card.tsx";

function useGreeting(name: string): string {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  const period = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  if (!name) return t(`home.greeting${period}Plain`);
  return t(`home.greeting${period}`, { name });
}

export function HomeLayout({ flow, focusToken }: { flow: JoinFlow; focusToken: number }) {
  const { t } = useTranslation();
  const user = useSessionStore((s) => s.user);
  const draft = useSessionStore((s) => s.displayNameDraft);
  const name = draft.trim() || user?.displayName || "";
  const greeting = useGreeting(name);
  const chipName = name || t("home.guestName");

  return (
    <SiteShell
      header={
        <>
          <HomeHeader id={user?.userId ?? chipName} name={chipName} onRename={flow.rename} />
          <PwaInstallBanner />
        </>
      }
      footerNote={t("home.shareNote")}
    >
      <PageIntro title={greeting} lead={t("home.lead")} />
      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
        <CreateRoomCard flow={flow} />
        <JoinRoomCard flow={flow} focusToken={focusToken} />
      </div>
    </SiteShell>
  );
}

export function HomeScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hash = useLocation({ select: (location) => location.hash });
  const setSession = useSessionStore((s) => s.setSession);
  const setRoom = useRoomStore((s) => s.setRoom);
  const setOme = useRoomStore((s) => s.setOme);
  const setLivekitCreds = useRoomStore((s) => s.setLivekitCreds);
  const [focusToken, setFocusToken] = useState(hash === "join" ? 1 : 0);

  const session = useQuery({ queryKey: ["session"], queryFn: getSession });

  useEffect(() => {
    if (session.data) setSession(session.data);
  }, [session.data, setSession]);

  const flow = useJoinFlow({
    onJoined: (result) => {
      setRoom(result.room);
      if (result.ome) setOme(result.ome);
      if (result.livekitToken && result.livekitUrl) {
        setLivekitCreds({ token: result.livekitToken, url: result.livekitUrl });
      }
      toast.success(t("toast.joined"));
      void navigate({ to: "/rooms/$roomId", params: { roomId: result.room.id } });
    },
  });

  return (
    <>
      <HomeLayout flow={flow} focusToken={focusToken} />
      <JoinDialogs
        flow={flow}
        onOtherCode={() => {
          flow.close();
          setFocusToken((value) => value + 1);
        }}
      />
    </>
  );
}
