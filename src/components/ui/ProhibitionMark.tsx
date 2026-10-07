import React from 'react';

/** 25/09/2026, 18h, horário de Brasília: anúncio da proibição. */
export const PROHIBITION_DAY = '2026-09-25';
export const PROHIBITION_HOUR = 18;

export const PROHIBITION_CAPTION =
  '25/09/2026 às 18h, horário de Brasília: anúncio da proibição das bets regulamentadas pelo governo brasileiro.';

export function prohibitionLabelSide(x: number, plotLeft: number, plotRight: number): 'left' | 'right' {
  return x > (plotLeft + plotRight) / 2 ? 'left' : 'right';
}

export const COMPULSORY_BLOCK_DAY = '2026-10-05';

export const COMPULSORY_BLOCK_CAPTION =
  '05/10/2026: bloqueio geral de todas as casas regulamentadas.';

export const ProhibitionMark: React.FC<{
  x: number;
  y: number;
  baseline: number;
  top: number;
  side: 'left' | 'right';
  label?: string;
  caption?: string;
}> = ({ x, y, baseline, top, side, label = '18h · Proibição', caption = PROHIBITION_CAPTION }) => {
  const labelX = side === 'left' ? x - 10 : x + 10;
  const labelY = Math.max(12, top - 8);
  return (
    <g className="prohibition-mark" pointerEvents="none">
      <line
        x1={x}
        y1={top}
        x2={x}
        y2={baseline}
        stroke="var(--danger)"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <circle className="prohibition-pulse" cx={x} cy={y} r="11" fill="var(--danger)" />
      <circle cx={x} cy={y} r="5.5" fill="var(--danger)" stroke="var(--card)" strokeWidth="2" />
      <text
        x={labelX}
        y={labelY}
        textAnchor={side === 'left' ? 'end' : 'start'}
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="700"
        fill="var(--danger)"
      >
        {label}
      </text>
      <title>{caption}</title>
    </g>
  );
};
