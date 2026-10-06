import React, { useMemo, useState } from 'react';
import { AuthorizationTrendPoint, AUTHORIZATION_TREND_ANNOTATION } from '../data/mockData';
import { GlassCard } from './ui/GlassCard';
import { ProhibitionMark, prohibitionLabelSide } from './ui/ProhibitionMark';
import { useChartWidth, indexFromPointer } from '../lib/useChartWidth';

interface AuthorizationTrendChartProps {
  data: AuthorizationTrendPoint[];
  annotation?: typeof AUTHORIZATION_TREND_ANNOTATION;
}

const HEIGHT = 260;
const PAD_LEFT = 40;
const PAD_RIGHT = 8;
const PAD_TOP = 34;
const PAD_BOTTOM = 26;
const AXIS_DATES = ['01/09', '07/09', '13/09', '19/09', '25/09', '02/10'];

const fmt = (n: number) => n.toLocaleString('pt-BR');
const fullDate = (iso: string) => iso.split('-').reverse().join('/');

export const AuthorizationTrendChart: React.FC<AuthorizationTrendChartProps> = ({
  data,
  annotation = AUTHORIZATION_TREND_ANNOTATION,
}) => {
  const [setChartNode, width] = useChartWidth(640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const lastIndex = data.length - 1;

  const maxValue = useMemo(
    () => Math.max(1, ...data.flatMap((d) => [d.authorized, d.unauthorized])),
    [data]
  );
  const midValue = Math.round(maxValue / 2);

  if (data.length < 2) {
    return (
      <GlassCard className="p-6">
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>A série diária vem de /api/v1/timeseries e ainda não carregou.</p>
      </GlassCard>
    );
  }

  const xScale = (i: number) => PAD_LEFT + (i / lastIndex) * plotWidth;
  const yScale = (v: number) => PAD_TOP + plotHeight - (v / maxValue) * plotHeight;
  const baselineY = PAD_TOP + plotHeight;

  const linePath = (key: 'authorized' | 'unauthorized') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[key])}`).join(' ');

  const areaPath = (key: 'authorized' | 'unauthorized') =>
    `${linePath(key)} L ${xScale(lastIndex)} ${baselineY} L ${xScale(0)} ${baselineY} Z`;

  const annotationIndex = Math.max(0, data.findIndex((d) => d.date === annotation.date));
  const annotationX = xScale(annotationIndex);
  const activeIndex = hoverIndex ?? lastIndex;
  const activePoint = data[activeIndex];

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    setHoverIndex(indexFromPointer(e, data.length, PAD_LEFT, plotWidth, width));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const current = hoverIndex ?? lastIndex;
    if (e.key === 'ArrowRight') { e.preventDefault(); setHoverIndex(Math.min(lastIndex, current + 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setHoverIndex(Math.max(0, current - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setHoverIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setHoverIndex(lastIndex); }
  };

  const summarySentence = `${fullDate(activePoint.date)}: ${fmt(activePoint.authorized)} autorizadas · ${fmt(activePoint.unauthorized)} não autorizadas`;

  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Autorizadas e não autorizadas
      </h3>
      <p className="text-xs leading-relaxed mb-4 max-w-2xl" style={{ color: 'var(--color-text-tertiary)' }}>
        Estoque diário desde setembro de 2026. Autorizadas reúnem nacional, estadual e decisão judicial.
        Não autorizadas detectadas são o estoque publicado fora de qualquer lista oficial, o mesmo número do card.
      </p>

      <div className="flex items-center gap-4 mb-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--data-base)' }} aria-hidden="true" />
          Autorizadas
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--data-risco)' }} aria-hidden="true" />
          Não autorizadas
        </span>
      </div>

      <div ref={setChartNode} className="w-full" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            viewBox={`0 0 ${width} ${HEIGHT}`}
            className="overflow-visible"
            role="group"
            aria-label={`Gráfico de autorizadas e não autorizadas. ${summarySentence}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="authTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--data-risco)' }} stopOpacity={0.16} />
                <stop offset="100%" style={{ stopColor: 'var(--data-risco)' }} stopOpacity={0} />
              </linearGradient>
            </defs>

            {[0, midValue, maxValue].map((v) => (
              <g key={v}>
                <line
                  x1={PAD_LEFT} x2={width - PAD_RIGHT} y1={yScale(v)} y2={yScale(v)}
                  style={{ stroke: 'var(--color-card-border)' }} strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8} y={yScale(v)} textAnchor="end" dominantBaseline="middle"
                  className="font-mono" style={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
                >
                  {fmt(v)}
                </text>
              </g>
            ))}

            {data.filter((d) => AXIS_DATES.includes(d.displayDate)).map((d) => {
              const i = data.indexOf(d);
              const isAnnotationDate = d.date === annotation.date;
              const anchor = i === 0 ? 'start' : i === lastIndex ? 'end' : 'middle';
              return (
                <text
                  key={d.date} x={xScale(i)} y={HEIGHT - PAD_BOTTOM + 16} textAnchor={anchor}
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    fontWeight: isAnnotationDate ? 600 : 400,
                    fill: isAnnotationDate ? 'var(--danger)' : 'var(--color-text-tertiary)',
                  }}
                >
                  {d.displayDate}
                </text>
              );
            })}

            <path d={areaPath('unauthorized')} fill="url(#authTrendFill)" stroke="none" />
            <path
              d={linePath('unauthorized')} fill="none" style={{ stroke: 'var(--data-risco)' }}
              strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            />
            <path
              d={linePath('authorized')} fill="none" style={{ stroke: 'var(--data-base)' }}
              strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
            />

            <ProhibitionMark
              x={annotationX}
              y={yScale(data[annotationIndex].unauthorized)}
              baseline={baselineY}
              side={prohibitionLabelSide(annotationX, PAD_LEFT, width - PAD_RIGHT)}
            />

            <circle
              cx={xScale(lastIndex)} cy={yScale(data[lastIndex].unauthorized)} r={4}
              style={{ fill: 'var(--data-risco)', stroke: 'var(--color-surface)' }} strokeWidth={2}
            />
            <circle
              cx={xScale(lastIndex)} cy={yScale(data[lastIndex].authorized)} r={4}
              style={{ fill: 'var(--data-base)', stroke: 'var(--color-surface)' }} strokeWidth={2}
            />

            {hoverIndex !== null && (
              <>
                <line
                  x1={xScale(hoverIndex)} x2={xScale(hoverIndex)} y1={PAD_TOP} y2={baselineY}
                  style={{ stroke: 'var(--color-text-tertiary)' }} strokeWidth={1} strokeOpacity={0.4}
                />
                <circle
                  cx={xScale(hoverIndex)} cy={yScale(data[hoverIndex].unauthorized)} r={4}
                  style={{ fill: 'var(--data-risco)', stroke: 'var(--color-surface)' }} strokeWidth={2}
                />
                <circle
                  cx={xScale(hoverIndex)} cy={yScale(data[hoverIndex].authorized)} r={4}
                  style={{ fill: 'var(--data-base)', stroke: 'var(--color-surface)' }} strokeWidth={2}
                />
              </>
            )}

            <rect
              x={PAD_LEFT} y={0} width={plotWidth} height={HEIGHT} fill="transparent"
              tabIndex={0} role="slider" aria-label="Explorar valores diários"
              aria-valuemin={0} aria-valuemax={lastIndex} aria-valuenow={activeIndex} aria-valuetext={summarySentence}
              onKeyDown={handleKeyDown}
              className="cursor-crosshair outline-none"
            />
          </svg>
        )}
      </div>

      <div className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <strong className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {fullDate(activePoint.date)}
        </strong>
        : <span className="font-mono font-semibold" style={{ color: 'var(--data-base)' }}>{fmt(activePoint.authorized)}</span> autorizadas ·{' '}
        <span className="font-mono font-semibold" style={{ color: 'var(--data-risco)' }}>{fmt(activePoint.unauthorized)}</span> não autorizadas
      </div>
      <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
        {annotation.description} Passe o cursor sobre o gráfico para ver outro dia.
      </p>
      <p
        className="text-[11px] mt-3 pt-3 border-t"
        style={{ color: 'var(--color-text-tertiary)', borderColor: 'var(--color-card-border)' }}
      >
        A lista de bloqueio da Anatel e os saldos do dia ficam na aba Dados. Antes de 21/09/2026, zero em não
        autorizadas significa ausência de coleta, não ausência de sites.
      </p>
    </GlassCard>
  );
};
