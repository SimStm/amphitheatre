import type { CSSProperties } from "react";
import { cn } from "../../lib/cn.ts";

export type InfiniteGrid3DProps = {
  /** Largura da celula no plano, em px. */
  cellWidth?: number;
  /** Altura da celula no plano, em px (profundidade). */
  cellHeight?: number;
  /** Espessura da linha, em px. */
  lineWidth?: number;
  /** Cor da linha. Padrao: token `--accent`. */
  lineColor?: string;
  /** Cor do fade (mescla com o fundo da Home). Padrao: `--home-page`. */
  fadeColor?: string;
  /** Inclinacao do plano, em graus (90 = chao de perfil). */
  angle?: number;
  /** Perspectiva da camera, em px (menor = mais dramatico). */
  perspective?: number;
  /** Horizonte / vanishing point, em % da altura (0 = topo). */
  horizon?: number;
  /** Duracao de um ciclo do loop, em segundos. */
  duration?: number;
  /** Opacidade do grid (0–1). */
  opacity?: number;
  className?: string;
};

/**
 * Fundo 3D infinite grid (efeito de Tony Baldascino / CodePen ZOjXBp).
 * CSS-only: perspective + rotateX + padrao que avanca um cell por ciclo.
 */
export function InfiniteGrid3D({
  cellWidth = 80,
  cellHeight = 35,
  lineWidth = 2,
  lineColor = "var(--accent)",
  fadeColor = "var(--home-page)",
  angle = 70,
  perspective = 300,
  horizon = 40,
  duration = 1,
  opacity = 0.55,
  className,
}: InfiniteGrid3DProps) {
  return (
    <div
      className={cn("infinite-grid-3d", className)}
      aria-hidden="true"
      style={
        {
          "--ig-cell-w": `${cellWidth}px`,
          "--ig-cell-h": `${cellHeight}px`,
          "--ig-line": `${lineWidth}px`,
          "--ig-color": lineColor,
          "--ig-fade": fadeColor,
          "--ig-angle": `${angle}deg`,
          "--ig-perspective": `${perspective}px`,
          "--ig-horizon": `${horizon}%`,
          "--ig-duration": `${duration}s`,
          "--ig-opacity": opacity,
        } as CSSProperties
      }
    >
      <div className="infinite-grid-3d__scene">
        <div className="infinite-grid-3d__plane">
          <div className="infinite-grid-3d__sheet" />
        </div>
      </div>
      <div className="infinite-grid-3d__fade" />
    </div>
  );
}
