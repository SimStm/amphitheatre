import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createSession, getRoom, getSession, joinRoom, parseRoomCode } from "../lib/api.ts";
import { attemptJoin, nameToSave, type JoinAttempt, type JoinStep } from "../lib/join-flow.ts";
import type { JoinResponse, Room, SessionResponse } from "../shared-types.ts";
import { useSessionStore } from "../stores/session-store.ts";

export type FlowStep = Exclude<JoinStep, { kind: "joined" }> | { kind: "rename" };

export type JoinFlow = {
  step: FlowStep | null;
  busy: boolean;
  begin: (rawCode: string, options?: { room?: Room | null }) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  submitName: (name: string) => Promise<void>;
  rename: () => void;
  retry: () => Promise<void>;
  close: () => void;
  ensureSession: (action: () => Promise<void>) => Promise<void>;
};

type JoinedInfo = { interactive: boolean };

const joinApi = { getRoom, joinRoom };

function stepRoom(step: FlowStep | null): Room | null {
  if (!step || step.kind === "invalid" || step.kind === "rename") return null;
  return step.room;
}

export function useJoinFlow({
  onJoined,
}: {
  onJoined: (result: JoinResponse, info: JoinedInfo) => void;
}): JoinFlow {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<FlowStep | null>(null);
  const [busy, setBusy] = useState(false);

  const stepRef = useRef<FlowStep | null>(null);
  const codeRef = useRef<string | null>(null);
  const pendingRef = useRef<(() => Promise<void>) | null>(null);
  const interactiveRef = useRef(false);
  const runRef = useRef(0);
  const onJoinedRef = useRef(onJoined);

  useEffect(() => {
    onJoinedRef.current = onJoined;
  }, [onJoined]);

  const show = useCallback((next: FlowStep | null) => {
    stepRef.current = next;
    setStep(next);
  }, []);

  const storeSession = useCallback(
    (session: SessionResponse) => {
      useSessionStore.getState().setSession(
        { userId: session.userId, displayName: session.displayName },
        session.token,
      );
      queryClient.setQueryData(["session"], {
        userId: session.userId,
        displayName: session.displayName,
      });
    },
    [queryClient],
  );

  const saveTypedName = useCallback(async () => {
    const { user, displayNameDraft } = useSessionStore.getState();
    const name = user ? nameToSave(displayNameDraft, user.displayName) : null;
    if (!name) return;
    try {
      storeSession(await createSession(name));
    } catch {
      // The join continues with the name the session already has.
    }
  }, [storeSession]);

  const run = useCallback(
    async (attempt: Omit<JoinAttempt, "code" | "api">) => {
      const code = codeRef.current;
      if (!code) return;
      const id = ++runRef.current;
      setBusy(true);
      let next = await attemptJoin({ code, api: joinApi, ...attempt });
      if (id !== runRef.current) return;

      if (next.kind === "needs-name") {
        const draft = useSessionStore.getState().displayNameDraft.trim();
        if (draft) {
          try {
            storeSession(await createSession(draft));
            next = await attemptJoin({ code, api: joinApi, ...attempt, room: next.room });
          } catch {
            // The name dialog stays as the way forward.
          }
          if (id !== runRef.current) return;
        }
      }

      setBusy(false);
      if (next.kind === "joined") {
        const interactive = interactiveRef.current;
        codeRef.current = null;
        show(null);
        onJoinedRef.current(next.result, { interactive });
        return;
      }
      interactiveRef.current = true;
      show(next);
    },
    [show, storeSession],
  );

  const begin = useCallback<JoinFlow["begin"]>(
    async (rawCode, options) => {
      codeRef.current = parseRoomCode(rawCode);
      pendingRef.current = null;
      interactiveRef.current = false;
      await saveTypedName();
      await run({ room: options?.room ?? null });
    },
    [run, saveTypedName],
  );

  const submitPassword = useCallback<JoinFlow["submitPassword"]>(
    async (password) => {
      const current = stepRef.current;
      await run({
        password,
        failures: current?.kind === "password" ? current.failures : 0,
        room: stepRoom(current),
      });
    },
    [run],
  );

  const close = useCallback(() => {
    runRef.current += 1;
    codeRef.current = null;
    pendingRef.current = null;
    setBusy(false);
    show(null);
  }, [show]);

  const submitName = useCallback<JoinFlow["submitName"]>(
    async (name) => {
      setBusy(true);
      try {
        storeSession(await createSession(name));
      } catch {
        setBusy(false);
        toast.error(t("toast.sessionFailed"));
        return;
      }
      setBusy(false);

      const pending = pendingRef.current;
      if (pending) {
        pendingRef.current = null;
        show(null);
        await pending();
        return;
      }
      const current = stepRef.current;
      const resumes = current?.kind === "needs-name" || current?.kind === "duplicate-name";
      if (resumes && codeRef.current) {
        await run({ room: stepRoom(current) });
        return;
      }
      close();
    },
    [close, run, show, storeSession, t],
  );

  const rename = useCallback(() => show({ kind: "rename" }), [show]);

  const retry = useCallback(async () => {
    await run({ room: stepRoom(stepRef.current) });
  }, [run]);

  const ensureSession = useCallback<JoinFlow["ensureSession"]>(
    async (action) => {
      const store = useSessionStore.getState();
      const draft = store.displayNameDraft;
      const current = store.user ?? (await getSession().catch(() => null));
      const name = nameToSave(draft, current?.displayName);
      if (current && !name) {
        if (!store.user) store.setSession(current);
        await action();
        return;
      }
      if (name) {
        let saved = false;
        try {
          storeSession(await createSession(name));
          saved = true;
        } catch {
          // Falls through to asking for a name.
        }
        if (saved) {
          await action();
          return;
        }
      }
      pendingRef.current = action;
      show({ kind: "needs-name", room: null });
    },
    [show, storeSession],
  );

  return useMemo(
    () => ({ step, busy, begin, submitPassword, submitName, rename, retry, close, ensureSession }),
    [step, busy, begin, submitPassword, submitName, rename, retry, close, ensureSession],
  );
}
