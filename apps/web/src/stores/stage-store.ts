import { create } from "zustand";
import { focusStream, toggleStream, type SelectableStream } from "../lib/stage-selection.ts";

type StageState = {
  choice: string[] | null;
  focus: (id: string) => void;
  toggle: (streams: SelectableStream[], id: string) => void;
  clear: () => void;
};

export const useStageStore = create<StageState>((set) => ({
  choice: null,
  focus: (id) => set({ choice: focusStream(id) }),
  toggle: (streams, id) => set((state) => ({ choice: toggleStream(state.choice, streams, id) })),
  clear: () => set({ choice: null }),
}));
