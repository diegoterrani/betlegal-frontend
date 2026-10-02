import { useLayoutEffect, useState } from 'react';

/** Largura CSS do container, para o viewBox do SVG coincidir com os pixels na tela.
 * Sem isso, um viewBox fixo (720, 760) encolhe fontSize de 12 para ~5px no celular.
 * O callback acompanha montagem tardia (gráfico que só entra no DOM com os dados). */
export function useChartWidth(fallback = 640): [(node: HTMLElement | null) => void, number] {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(fallback);

  useLayoutEffect(() => {
    if (!node) return;
    const apply = () => {
      const next = Math.floor(node.clientWidth);
      if (next > 0) setWidth(next);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return [setNode, width];
}

/** Índice do ponto mais próximo do ponteiro, no sistema do viewBox. */
export function indexFromPointer(
  event: { clientX: number; currentTarget: SVGSVGElement },
  count: number,
  padLeft: number,
  plotWidth: number,
  svgWidth: number,
): number {
  if (count <= 1 || plotWidth <= 0) return 0;
  const rect = event.currentTarget.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  const x = ((event.clientX - rect.left) / rect.width) * svgWidth;
  const ratio = (x - padLeft) / plotWidth;
  return Math.max(0, Math.min(count - 1, Math.round(ratio * (count - 1))));
}
