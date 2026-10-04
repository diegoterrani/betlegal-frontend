import React, { useMemo, useState } from 'react';
import { UnauthorizedReach } from '../lib/realData';
import { GlassCard } from './ui/GlassCard';

interface UnauthorizedReachPieProps {
  reach: UnauthorizedReach;
}

const SIZE = 180;
const STROKE = 28;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const fmt = (n: number) => n.toLocaleString('pt-BR');

const SEGMENTS: { key: keyof UnauthorizedReach; label: string; color: string }[] = [
  { key: 'noAr', label: 'No ar', color: 'var(--status-nao-autorizada)' },
  { key: 'foraDoAr', label: 'Fora do ar', color: 'var(--color-text-tertiary)' },
  { key: 'naoChecado', label: 'Sem checagem', color: 'var(--status-atencao)' },
];

export const UnauthorizedReachPie: React.FC<UnauthorizedReachPieProps> = ({ reach }) => {
  const [hovered, setHovered] = useState<keyof UnauthorizedReach | null>(null);
  const total = reach.noAr + reach.foraDoAr + reach.naoChecado;

  const arcs = useMemo(() => {
    let offset = 0;
    return SEGMENTS.map((seg) => {
      const value = reach[seg.key];
      const fraction = total > 0 ? value / total : 0;
      const length = fraction * CIRCUMFERENCE;
      const arc = { ...seg, value, fraction, dashArray: `${length} ${CIRCUMFERENCE - length}`, dashOffset: -offset };
      offset += length;
      return arc;
    });
  }, [reach, total]);

  const activeKey = hovered ?? 'noAr';
  const active = arcs.find((a) => a.key === activeKey)!;

  return (
    <GlassCard className="p-5 sm:p-6">
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Alcance das não autorizadas identificadas
      </h3>
      <p className="text-xs leading-relaxed mb-4 max-w-2xl" style={{ color: 'var(--color-text-tertiary)' }}>
        Estoque de domínios não autorizados identificados pelo Radar, partido por conectividade na última sonda.
        Bloqueio da Anatel só entra aqui quando é posterior ao anúncio da proibição (25/09/2026, 18h) — bloqueio
        anterior é a lista antiga, não uma identificação do Radar.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Alcance das não autorizadas: ${arcs.map((a) => `${a.label} ${fmt(a.value)}`).join(', ')}`}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" style={{ stroke: 'var(--color-card-border)' }} strokeWidth={STROKE} />
          {arcs.filter((a) => a.value > 0).map((arc) => (
            <circle
              key={arc.key}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              style={{ stroke: arc.color, cursor: 'pointer' }}
              strokeWidth={STROKE}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text x={CENTER} y={CENTER - 6} textAnchor="middle" className="font-mono font-bold" style={{ fontSize: 22, fill: 'var(--color-text-primary)' }}>
            {fmt(active.value)}
          </text>
          <text x={CENTER} y={CENTER + 14} textAnchor="middle" style={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}>
            {active.label}
          </text>
        </svg>

        <div className="space-y-2 text-xs w-full">
          {arcs.map((arc) => (
            <button
              key={arc.key}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
              className="w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded transition-colors cursor-default"
              style={{ backgroundColor: hovered === arc.key ? 'rgba(255,255,255,0.05)' : 'transparent' }}
            >
              <span className="flex items-center gap-2 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: arc.color }} />
                {arc.label}
              </span>
              <span className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {fmt(arc.value)} <span className="font-normal" style={{ color: 'var(--color-text-tertiary)' }}>({total > 0 ? Math.round(arc.fraction * 100) : 0}%)</span>
              </span>
            </button>
          ))}
          <div className="pt-2 mt-1 border-t flex items-center justify-between font-semibold" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}>
            <span>Total identificado</span>
            <span className="font-mono">{fmt(total)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
