import React, { useEffect, useMemo, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useChartWidth, indexFromPointer } from '../lib/useChartWidth';
import { useTheme } from '../context/ThemeContext';
import { apiGet } from '../lib/http';
import symbolDark from '../assets/brand/bet-legal-symbol-dark.svg';
import symbolLight from '../assets/brand/bet-legal-symbol-light.svg';

interface PresencePoint {
  label: string;
  detectedOnline: number;
  detectedOffline: number;
}

interface PresencePayload {
  asOfLabel?: string;
  points?: PresencePoint[];
}

const ONLINE = 'var(--status-autorizada)';
const OFFLINE = 'var(--status-nao-autorizada)';
const fmt = (n: number) => n.toLocaleString('pt-BR');

function axisMax(max: number): number {
  if (max <= 0) return 1;
  if (max <= 100) return Math.ceil(max / 10) * 10;
  return Math.ceil(max / 1000) * 1000;
}

function axisTicks(max: number): number[] {
  if (max <= 100) return [0, max / 2, max];
  const step = max <= 2000 ? 500 : 1000;
  const ticks: number[] = [];
  for (let value = 0; value <= max; value += step) ticks.push(value);
  return ticks;
}

function axisText(value: number, top: boolean): string {
  const compact = value > 0 && value % 1000 === 0 ? `${value / 1000}K` : fmt(value);
  return top ? `${compact} sites` : compact;
}

export const PresenceChart: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [payload, setPayload] = useState<PresencePayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [setFrame, width] = useChartWidth(640);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus('loading');
    apiGet<PresencePayload>('/api/v1/unauthorized/presence')
      .then((body) => {
        if (ctrl.signal.aborted) return;
        setPayload(body);
        setStatus('ready');
      })
      .catch(() => {
        if (ctrl.signal.aborted) return;
        setStatus('error');
      });
    return () => ctrl.abort();
  }, [attempt]);

  const points = payload?.points ?? [];
  const ready = status === 'ready' && points.length > 1;
  const online = points.map((point) => point.detectedOnline);
  const offline = points.map((point) => point.detectedOffline);
  const last = Math.max(points.length - 1, 0);
  const hourLabel = points[last]?.label.split(' ').pop() ?? '';

  const height = 300;
  const padL = 62;
  const padR = 16;
  const padT = 18;
  const padB = 36;
  const plotW = Math.max(width - padL - padR, 1);
  const plotH = height - padT - padB;
  const baseline = padT + plotH;
  const max = axisMax(Math.max(0, ...online, ...offline));
  const yTicks = axisTicks(max);
  const yOf = (value: number) => baseline - (value / max) * plotH;
  const xOf = (index: number) => padL + (points.length <= 1 ? plotW / 2 : (index / (points.length - 1)) * plotW);
  const labelStep = Math.max(1, Math.ceil(points.length / Math.max(3, Math.floor(plotW / 72))));

  const summary = useMemo(() => {
    if (!ready) return 'Carregando bloqueados e não bloqueados hora a hora.';
    const point = points[hover ?? last];
    return `${point.label}: ${fmt(point.detectedOnline)} não bloqueados e ${fmt(point.detectedOffline)} bloqueados.`;
  }, [ready, points, hover, last]);

  const mark = Math.min(plotH * 0.46, plotW * 0.34, 168);
  const markH = mark * (70 / 74);

  return (
    <GlassCard className="p-5 sm:p-6">
      <h2 className="sr-only">Bloqueados e não bloqueados, hora a hora</h2>
      <p
        className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-text-tertiary) 12%, transparent)', color: 'var(--color-text-primary)' }}
      >
        Só detectadas
      </p>

      {status === 'loading' && <p className="mt-6 text-sm" style={{ color: 'var(--color-text-tertiary)' }} role="status">Carregando a série hora a hora.</p>}
      {status === 'error' && (
        <p className="mt-6 text-sm" style={{ color: 'var(--color-text-tertiary)' }} role="status">
          Não foi possível carregar o gráfico.{' '}
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="font-semibold underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
            Tentar de novo
          </button>
        </p>
      )}

      {ready && (
        <div className="mt-5">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <p className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: ONLINE }}>{fmt(online[last])}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Não bloqueados às {hourLabel}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: OFFLINE }}>{fmt(offline[last])}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Bloqueados às {hourLabel}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text-primary)' }}>{fmt(online[last] + offline[last])}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Total medido às {hourLabel}</p>
            </div>
          </div>

          <div ref={setFrame} className="relative mt-4 w-full min-w-0">
            {width > 0 && (
              <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto touch-pan-y"
                role="img"
                aria-label={summary}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse' || event.buttons > 0) {
                    setHover(indexFromPointer(event, points.length, padL, plotW, width));
                  }
                }}
                onPointerLeave={() => setHover(null)}
              >
                {yTicks.map((tick) => {
                  const y = yOf(tick);
                  return (
                    <g key={tick}>
                      <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="var(--color-card-border)" strokeDasharray="4 4" />
                      <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-text-tertiary)" className="font-mono">
                        {axisText(tick, tick === max)}
                      </text>
                    </g>
                  );
                })}
                <image
                  href={resolvedTheme === 'dark' ? symbolDark : symbolLight}
                  x={padL + plotW / 2 - mark / 2}
                  y={padT + plotH / 2 - markH / 2}
                  width={mark}
                  height={markH}
                  opacity={0.12}
                  pointerEvents="none"
                  aria-hidden="true"
                />
                <path d={online.map((value, index) => `${index === 0 ? 'M' : 'L'}${xOf(index).toFixed(1)} ${yOf(value).toFixed(1)}`).join(' ')} fill="none" stroke={ONLINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                <path d={offline.map((value, index) => `${index === 0 ? 'M' : 'L'}${xOf(index).toFixed(1)} ${yOf(value).toFixed(1)}`).join(' ')} fill="none" stroke={OFFLINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {hover != null && (
                  <line x1={xOf(hover)} y1={padT} x2={xOf(hover)} y2={baseline} stroke="var(--color-text-tertiary)" />
                )}
                {points.map((point, index) => {
                  const left = index === 0 ? padL : (xOf(index - 1) + xOf(index)) / 2;
                  const right = index === last ? width - padR : (xOf(index) + xOf(index + 1)) / 2;
                  return (
                    <g key={point.label}>
                      {(index % labelStep === 0 || index === last) && (
                        <text x={xOf(index)} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--color-text-tertiary)" className="font-mono">
                          {point.label}
                        </text>
                      )}
                      <rect
                        x={left}
                        y={padT}
                        width={Math.max(right - left, 1)}
                        height={plotH}
                        fill="transparent"
                        onMouseEnter={() => setHover(index)}
                        onPointerDown={(event) => setHover(indexFromPointer(event, points.length, padL, plotW, width))}
                      >
                        <title>{point.label}: {fmt(online[index])} não bloqueados, {fmt(offline[index])} bloqueados</title>
                      </rect>
                    </g>
                  );
                })}
                <rect
                  x={padL}
                  y={padT}
                  width={plotW}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  className="outline-none"
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight') {
                      event.preventDefault();
                      setHover(Math.min(last, (hover ?? 0) + 1));
                    } else if (event.key === 'ArrowLeft') {
                      event.preventDefault();
                      setHover(Math.max(0, (hover ?? last) - 1));
                    } else if (event.key === 'Home') {
                      event.preventDefault();
                      setHover(0);
                    } else if (event.key === 'End') {
                      event.preventDefault();
                      setHover(last);
                    }
                  }}
                />
              </svg>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ONLINE }} aria-hidden="true" />
              Não bloqueados (no ar)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: OFFLINE }} aria-hidden="true" />
              Bloqueados (fora do ar)
            </span>
          </div>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }} aria-live="polite">{summary}</p>
          <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Só detectadas</span> fica só com as que hoje não constam nas listas de autorização.
          </p>
        </div>
      )}
    </GlassCard>
  );
};
