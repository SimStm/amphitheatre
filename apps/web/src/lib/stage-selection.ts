export type StageStreamKind = "broadcast" | "screen" | "camera";

export type SelectableStream = { id: string; kind: StageStreamKind };

const defaultOrder: StageStreamKind[] = ["broadcast", "screen", "camera"];

export function defaultSelection(streams: SelectableStream[]): string[] {
  for (const kind of defaultOrder) {
    const match = streams.find((stream) => stream.kind === kind);
    if (match) return [match.id];
  }
  return [];
}

/** A null choice means the viewer never picked anything, so the default applies. */
export function resolveSelection(choice: string[] | null, streams: SelectableStream[]): string[] {
  if (!choice) return defaultSelection(streams);
  const available = new Set(streams.map((stream) => stream.id));
  const kept = choice.filter((id) => available.has(id));
  return kept.length > 0 ? kept : defaultSelection(streams);
}

export function focusStream(id: string): string[] {
  return [id];
}

export function toggleStream(
  choice: string[] | null,
  streams: SelectableStream[],
  id: string,
): string[] | null {
  const current = resolveSelection(choice, streams);
  if (!current.includes(id)) return [...current, id];
  const next = current.filter((item) => item !== id);
  return next.length > 0 ? next : null;
}
