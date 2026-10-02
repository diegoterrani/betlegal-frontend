import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { AuthorizationTrendPoint, AUTHORIZATION_TREND_ANNOTATION } from '../data/mockData';

interface AuthorizationTrendChartProps {
  data: AuthorizationTrendPoint[];
  annotation?: typeof AUTHORIZATION_TREND_ANNOTATION;
  onNavigate: (path: string) => void;
}

const HEIGHT = 260;
const PAD_LEFT = 40;
const PAD_RIGHT = 8;
const PAD_TOP = 34;
const PAD_BOTTOM = 26;
const AXIS_DATES = ['01/09', '07/09', '13/09', '19/09', '25/09', '02/10'];

const fmt = (n: number) => n.toLocaleString('pt-BR');

export const AuthorizationTrendChart: React.FC<AuthorizationTrendChartProps> = ({
  data,
  annotation = AUTHORIZATION_TREND_ANNOTATION,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(Math.round(w));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const plotWidth = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const lastIndex = data.length - 1;

  const maxValue = useMemo(
    () => Math.max(1, ...data.flatMap((d) => [d.authorized, d.unauthorized])),
    [data]
  );
  const midValue = Math.round(maxValue / 2);

  const xScale = (i: number) => PAD_LEFT + (i / lastIndex) * plotWidth;
  const yScale = (v: number) => PAD_TOP + plotHeight - (v / maxValue) * plotHeight;
  const baselineY = PAD_TOP + plotHeight;

  const linePath = (key: 'authorized' | 'unauthorized') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d[key])}`).join(' ');

  const areaPath = (key: 'authorized' | 'unauthorized') =>
    `${linePath(key)} L ${xScale(lastIndex)} ${baselineY} L ${xScale(0)} ${baselineY} Z`;

  const annotationIndex = Math.max(
    0,
    data.findIndex((d) => d.date === annotation.date)
  );

  const activeIndex = hoverIndex ?? lastIndex;
  const activePoint = data[activeIndex];

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - PAD_LEFT;
    const ratio = Math.min(1, Math.max(0, x / plotWidth));
    setHoverIndex(Math.round(ratio * lastIndex));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const current = hoverIndex ?? lastIndex;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHoverIndex(Math.min(lastIndex, current + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHoverIndex(Math.max(0, current - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHoverIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHoverIndex(lastIndex);
    }
  };

  const summarySentence = `${activePoint.date.split('-').reverse().join('/')}: ${fmt(
    activePoint.authorized
  )} autorizadas · ${fmt(activePoint.unauthorized)} não autorizadas`;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="text-lg sm:text-xl font-bold text-[#0B1F33] dark:text-white">
            Autorizadas e não autorizadas
          </h2>
          <button
            onClick={() => onNavigate('/series')}
            className="shrink-0 text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver o detalhe em Dados
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-5">
          Estoque diário desde setembro de 2026. Autorizadas reúnem nacional, estadual e decisão judicial.
          Não autorizadas detectadas são o estoque publicado fora de qualquer lista oficial, o mesmo número do card.
        </p>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded-full bg-[#334155] dark:bg-[#94A3B8]" aria-hidden="true" />
            Autorizadas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 rounded-full bg-red-600 dark:bg-red-400" aria-hidden="true" />
            Não autorizadas
          </span>
        </div>

        {/* Chart */}
        <div ref={containerRef} className="w-full" style={{ height: HEIGHT }}>
          {width > 0 && (
            <svg
              width={width}
              height={HEIGHT}
              viewBox={`0 0 ${width} ${HEIGHT}`}
              className="overflow-visible"
              role="group"
              aria-label={`Gráfico de autorizadas e não autorizadas. ${summarySentence}`}
            >
              <defs>
                <linearGradient id="unauthorizedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopOpacity={0.18} className="[stop-color:#dc2626] dark:[stop-color:#f87171]" />
                  <stop offset="100%" stopOpacity={0} className="[stop-color:#dc2626] dark:[stop-color:#f87171]" />
                </linearGradient>
              </defs>

              {/* Gridlines + y-axis labels */}
              {[0, midValue, maxValue].map((v) => (
                <g key={v}>
                  <line
                    x1={PAD_LEFT}
                    x2={width - PAD_RIGHT}
                    y1={yScale(v)}
                    y2={yScale(v)}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD_LEFT - 8}
                    y={yScale(v)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-slate-400 dark:fill-slate-500 font-mono"
                    style={{ fontSize: 10 }}
                  >
                    {fmt(v)}
                  </text>
                </g>
              ))}

              {/* X axis labels */}
              {data
                .filter((d) => AXIS_DATES.includes(d.displayDate))
                .map((d) => {
                  const i = data.indexOf(d);
                  const isAnnotationDate = d.date === annotation.date;
                  const anchor = i === 0 ? 'start' : i === lastIndex ? 'end' : 'middle';
                  return (
                    <text
                      key={d.date}
                      x={xScale(i)}
                      y={HEIGHT - PAD_BOTTOM + 16}
                      textAnchor={anchor}
                      className={
                        isAnnotationDate
                          ? 'fill-red-600 dark:fill-red-400 font-mono font-semibold'
                          : 'fill-slate-400 dark:fill-slate-500 font-mono'
                      }
                      style={{ fontSize: 10 }}
                    >
                      {d.displayDate}
                    </text>
                  );
                })}

              {/* Annotation line */}
              <line
                x1={xScale(annotationIndex)}
                x2={xScale(annotationIndex)}
                y1={PAD_TOP - 18}
                y2={baselineY}
                className="stroke-red-400 dark:stroke-red-500"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle
                cx={xScale(annotationIndex)}
                cy={yScale(data[annotationIndex].unauthorized)}
                r={4}
                className="fill-red-500 dark:fill-red-400"
              />
              <text
                x={xScale(annotationIndex)}
                y={PAD_TOP - 22}
                textAnchor="middle"
                className="fill-red-600 dark:fill-red-400 font-semibold"
                style={{ fontSize: 10 }}
              >
                {annotation.time} · {annotation.label}
              </text>

              {/* Unauthorized area + line (emphasis) */}
              <path d={areaPath('unauthorized')} fill="url(#unauthorizedFill)" stroke="none" />
              <path
                d={linePath('unauthorized')}
                fill="none"
                className="stroke-red-600 dark:stroke-red-400"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Authorized line (context) */}
              <path
                d={linePath('authorized')}
                fill="none"
                className="stroke-[#334155] dark:stroke-[#94A3B8]"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* End markers */}
              <circle
                cx={xScale(lastIndex)}
                cy={yScale(data[lastIndex].unauthorized)}
                r={4}
                className="fill-red-600 dark:fill-red-400 stroke-white dark:stroke-[#0D1B2A]"
                strokeWidth={2}
              />
              <circle
                cx={xScale(lastIndex)}
                cy={yScale(data[lastIndex].authorized)}
                r={4}
                className="fill-[#334155] dark:fill-[#94A3B8] stroke-white dark:stroke-[#0D1B2A]"
                strokeWidth={2}
              />

              {/* Hover crosshair */}
              {hoverIndex !== null && (
                <>
                  <line
                    x1={xScale(hoverIndex)}
                    x2={xScale(hoverIndex)}
                    y1={PAD_TOP}
                    y2={baselineY}
                    className="stroke-slate-300 dark:stroke-slate-600"
                    strokeWidth={1}
                  />
                  <circle
                    cx={xScale(hoverIndex)}
                    cy={yScale(data[hoverIndex].unauthorized)}
                    r={4}
                    className="fill-red-600 dark:fill-red-400 stroke-white dark:stroke-[#0D1B2A]"
                    strokeWidth={2}
                  />
                  <circle
                    cx={xScale(hoverIndex)}
                    cy={yScale(data[hoverIndex].authorized)}
                    r={4}
                    className="fill-[#334155] dark:fill-[#94A3B8] stroke-white dark:stroke-[#0D1B2A]"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* Hit area for hover/keyboard */}
              <rect
                x={PAD_LEFT}
                y={0}
                width={plotWidth}
                height={HEIGHT}
                fill="transparent"
                tabIndex={0}
                role="slider"
                aria-label="Explorar valores diários"
                aria-valuemin={0}
                aria-valuemax={lastIndex}
                aria-valuenow={activeIndex}
                aria-valuetext={summarySentence}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setHoverIndex(null)}
                onKeyDown={handleKeyDown}
                className="cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] rounded"
              />
            </svg>
          )}
        </div>

        {/* Readout */}
        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          <strong className="font-mono font-semibold text-[#0B1F33] dark:text-white">
            {activePoint.date.split('-').reverse().join('/')}
          </strong>
          : <span className="font-mono font-semibold">{fmt(activePoint.authorized)}</span> autorizadas ·{' '}
          <span className="font-mono font-semibold text-red-600 dark:text-red-400">{fmt(activePoint.unauthorized)}</span> não autorizadas
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          {annotation.description} Passe o cursor sobre o gráfico para ver outro dia.
        </p>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          A lista de bloqueio da Anatel e os saldos do dia ficam na aba Dados. Antes de 21/09/2026, zero em não
          autorizadas significa ausência de coleta, não ausência de sites.
        </p>
      </div>
    </section>
  );
};
