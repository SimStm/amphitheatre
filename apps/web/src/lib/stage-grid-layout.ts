export type StageGridLayout = {
  columns: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
};

const emptyLayout: StageGridLayout = { columns: 0, rows: 0, tileWidth: 0, tileHeight: 0 };

/** Picks the column count that gives each tile the largest area at the given aspect ratio. */
export function computeGrid(
  count: number,
  width: number,
  height: number,
  aspect: number,
  gap: number,
): StageGridLayout {
  if (count <= 0 || width <= 0 || height <= 0) return emptyLayout;

  let best = emptyLayout;
  for (let columns = 1; columns <= count; columns += 1) {
    const rows = Math.ceil(count / columns);
    const cellWidth = (width - gap * (columns - 1)) / columns;
    const cellHeight = (height - gap * (rows - 1)) / rows;
    if (cellWidth <= 0 || cellHeight <= 0) continue;
    const tileWidth = Math.min(cellWidth, cellHeight * aspect);
    if (tileWidth > best.tileWidth) {
      best = { columns, rows, tileWidth, tileHeight: tileWidth / aspect };
    }
  }
  return best;
}
