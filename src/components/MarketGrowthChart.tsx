import React, { useMemo, useState } from 'react';
import { SeriesPoint } from '../lib/realData';
import { GlassCard } from './ui/GlassCard';
import { BrandWatermark } from './brand/BetLegalBrand';
import { useTheme } from '../context/ThemeContext';
import { useChartWidth, indexFromPointer } from '../lib/useChartWidth';

const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

const pctFmt = (n: number) =>
  `${n >= 0 ? '+' : ''}${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

export const MarketGrowthChart: React.FC<{ points?: SeriesPoint[] }> = ({ points = [] }) => {
  const { resolvedTheme } = useTheme();
  const [setChartNode, width] = useChartWidth(640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const months = useMemo(() => {
    const byMonth = new Map<string, SeriesPoint>();
    for (const point of points) byMonth.set(point.day.slice(0, 7), point);
    return Array.from(byMonth.entries()).map(([month, point]) => ({
      month,
      blocks: point.unauthorized_blocked,
      authorized: point.authorized,
    }));
  }, [points]);
  const lastIndex = months.length - 1;

  const series = useMemo(() => {
    if (months.length < 2) return [];
    const baseBlocks = months[0].blocks || 1;
    const baseAuthorized = months[0].authorized || 1;
    return months.map((m) => ({
      month: m.month,
      blocks: m.blocks,
      authorized: m.authorized,
      blocksPct: (m.blocks / baseBlocks - 1) * 100,
      authorizedPct: (m.authorized / baseAuthorized - 1) * 100,
    }));
  }, [months]);

  if (months.length < 2) {
    return (
      <GlassCard className="p-6">
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>A série mensal vem de /api/v1/timeseries e ainda não carregou.</p>
      </GlassCard>
    );
  }

  const plotWidth = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const maxPct = Math.max(1, ...series.flatMap((d) => [d.blocksPct, d.authorizedPct]));
  const midPct = maxPct / 2;

  const xScale = (i: number) => PAD_LEFT + (i / lastIndex) * plotWidth;
  const yScale = (v: number) => PAD_TOP + plotHeight - (v / maxPct) * plotHeight;

  const linePath = (key: 'blocksPct' | 'authorizedPct') =>
    series.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[key])}`).join(' ');

  const activeIndex = hoverIndex ?? lastIndex;
  const active = series[activeIndex];

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    setHoverIndex(indexFromPointer(e, series.length, PAD_LEFT, plotWidth, width));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const current = hoverIndex ?? lastIndex;
    if (e.key === 'ArrowRight') { e.preventDefault(); setHoverIndex(Math.min(lastIndex, current + 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setHoverIndex(Math.max(0, current - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setHoverIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setHoverIndex(lastIndex); }
  };

  const summarySentence = `${active.month}: bloqueios ${active.blocks.toLocaleString('pt-BR')} (${pctFmt(active.blocksPct)}), autorizações ${active.authorized} (${pctFmt(active.authorizedPct)}) desde ${months[0].month}`;

  return (
    <GlassCard className="p-5 sm:p-6 relative overflow-hidden">
      <BrandWatermark theme={resolvedTheme} className="absolute bottom-3 right-3 h-6 w-auto opacity-[0.1]" />

      <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        Bloqueios Anatel × Autorizações nacionais
      </span>
      <p className="text-[11px] mt-0.5 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
        Variação % acumulada desde {months[0].month}, para comparar o ritmo de crescimento das duas séries.
      </p>

      <div className="flex items-center gap-4 mb-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--data-estado)' }} aria-hidden="true" />
          Bloqueios Anatel
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--data-base)' }} aria-hidden="true" />
          Autorizações nacionais
        </span>
      </div>

      <div ref={setChartNode} className="w-full" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="overflow-visible"
            role="group" aria-label={`Gráfico de variação percentual. ${summarySentence}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          >
            {[0, midPct, maxPct].map((v) => (
              <g key={v}>
                <line x1={PAD_LEFT} x2={width - PAD_RIGHT} y1={yScale(v)} y2={yScale(v)}
                  style={{ stroke: 'var(--color-card-border)' }} strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={yScale(v)} textAnchor="end" dominantBaseline="middle"
                  className="font-mono" style={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}>
                  {v === 0 ? '0%' : `+${Math.round(v)}%`}
                </text>
              </g>
            ))}

            {series.map((d, i) => (
              <text key={d.month} x={xScale(i)} y={HEIGHT - PAD_BOTTOM + 16}
                textAnchor={i === 0 ? 'start' : i === lastIndex ? 'end' : 'middle'}
                className="font-mono" style={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}>
                {d.month}
              </text>
            ))}

            <path d={linePath('blocksPct')} fill="none" style={{ stroke: 'var(--data-estado)' }}
              strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={linePath('authorizedPct')} fill="none" style={{ stroke: 'var(--data-base)' }}
              strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            <circle cx={xScale(lastIndex)} cy={yScale(series[lastIndex].blocksPct)} r={4}
              style={{ fill: 'var(--data-estado)', stroke: 'var(--color-surface)' }} strokeWidth={2} />
            <circle cx={xScale(lastIndex)} cy={yScale(series[lastIndex].authorizedPct)} r={4}
              style={{ fill: 'var(--data-base)', stroke: 'var(--color-surface)' }} strokeWidth={2} />

            <text x={xScale(lastIndex) - 6} y={yScale(series[lastIndex].blocksPct) - 8} textAnchor="end"
              className="font-mono font-semibold" style={{ fontSize: 10, fill: 'var(--data-estado)' }}>
              {pctFmt(series[lastIndex].blocksPct)}
            </text>
            <text x={xScale(lastIndex) - 6} y={yScale(series[lastIndex].authorizedPct) - 8} textAnchor="end"
              className="font-mono font-semibold" style={{ fontSize: 10, fill: 'var(--data-base)' }}>
              {pctFmt(series[lastIndex].authorizedPct)}
            </text>

            {hoverIndex !== null && (
              <>
                <line x1={xScale(hoverIndex)} x2={xScale(hoverIndex)} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM}
                  style={{ stroke: 'var(--color-text-tertiary)' }} strokeWidth={1} strokeOpacity={0.4} />
                <circle cx={xScale(hoverIndex)} cy={yScale(series[hoverIndex].blocksPct)} r={4}
                  style={{ fill: 'var(--data-estado)', stroke: 'var(--color-surface)' }} strokeWidth={2} />
                <circle cx={xScale(hoverIndex)} cy={yScale(series[hoverIndex].authorizedPct)} r={4}
                  style={{ fill: 'var(--data-base)', stroke: 'var(--color-surface)' }} strokeWidth={2} />
              </>
            )}

            <rect
              x={PAD_LEFT} y={0} width={plotWidth} height={HEIGHT} fill="transparent"
              tabIndex={0} role="slider" aria-label="Explorar variação por mês"
              aria-valuemin={0} aria-valuemax={lastIndex} aria-valuenow={activeIndex} aria-valuetext={summarySentence}
              onKeyDown={handleKeyDown}
              className="cursor-crosshair outline-none"
            />
          </svg>
        )}
      </div>

      <div className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        <strong className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{active.month}</strong>
        {' — '}
        <span style={{ color: 'var(--data-estado)' }} className="font-mono font-semibold">
          {active.blocks.toLocaleString('pt-BR')}
        </span>{' '}
        bloqueios ({pctFmt(active.blocksPct)}) ·{' '}
        <span style={{ color: 'var(--data-base)' }} className="font-mono font-semibold">
          {active.authorized}
        </span>{' '}
        autorizações ({pctFmt(active.authorizedPct)})
      </div>
    </GlassCard>
  );
};
