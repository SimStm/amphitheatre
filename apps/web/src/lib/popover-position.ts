export type PopoverPlacementInput = {
  anchor: { left: number; right: number; centerY: number };
  size: { width: number; height: number };
  viewport: { width: number; height: number };
  gap?: number;
  margin?: number;
  arrowInset?: number;
};

export type PopoverPlacement = {
  left: number;
  top: number;
  arrowTop: number;
  side: "left" | "right" | "none";
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Places a popover beside its anchor, preferring the right, with the arrow on the anchor. */
export function placePopover({
  anchor,
  size,
  viewport,
  gap = 14,
  margin = 12,
  arrowInset = 22,
}: PopoverPlacementInput): PopoverPlacement {
  const fitsRight = anchor.right + gap + size.width <= viewport.width - margin;
  const fitsLeft = anchor.left - gap - size.width >= margin;
  const side = fitsRight ? "right" : fitsLeft ? "left" : "none";
  const preferred = side === "left" ? anchor.left - gap - size.width : anchor.right + gap;
  const left = clamp(preferred, margin, viewport.width - size.width - margin);
  const top = clamp(anchor.centerY - size.height / 2, margin, viewport.height - size.height - margin);
  const arrowTop = clamp(anchor.centerY - top, arrowInset, size.height - arrowInset);
  return { left, top, arrowTop, side };
}
