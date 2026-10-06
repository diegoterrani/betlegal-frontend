import React from 'react';
import { PublicStats } from '../lib/realData';

export const DetectionBreakdownCards: React.FC<{ stats: PublicStats | null }> = ({ stats }) => {
  const by = stats?.byStatus || {};
  const nacional = by.AUTORIZADA_NACIONAL || 0;
  const estadual = by.AUTORIZADA_ESTADUAL || 0;
  const judicial = by.DECISAO_JUDICIAL || 0;
  const authorizedTotal = nacional + estadual + judicial;
  const unauthorizedTotal = (by.NAO_AUTORIZADA_DETECTADA || 0) + (by.BLOQUEADA_ANATEL || 0) + (by.SUSPENSA_REVOGADA || 0) + (by.INATIVA || 0);
  const detected = by.NAO_AUTORIZADA_DETECTADA || 0;
  const blocked = by.BLOQUEADA_ANATEL || 0;
  const inactive = by.INATIVA || 0;
  const detectedPct = unauthorizedTotal > 0 ? (detected / unauthorizedTotal) * 100 : 0;

  const livenessSegments = [
    { label: 'Detectadas', value: detected, color: 'var(--live-fg)' },
    { label: 'Bloqueadas', value: blocked, color: 'var(--color-text-secondary)' },
    { label: 'Inativas', value: inactive, color: 'var(--color-text-tertiary)' },
  ];

  return (
    <div className="space-y-4">
      {/* Headline pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded border p-5"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--data-base) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--data-base) 30%, transparent)',
          }}
        >
          <div className="font-mono text-4xl font-medium tracking-tight" style={{ color: 'var(--data-base)' }}>
            {authorizedTotal}
          </div>
          <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>Autorizadas</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {nacional} nacionais · {estadual} estaduais · {judicial} por decisão judicial
          </div>
        </div>

        <div
          className="rounded border p-5"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--data-risco) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--data-risco) 30%, transparent)',
          }}
        >
          <div className="font-mono text-4xl font-medium tracking-tight" style={{ color: 'var(--data-risco)' }}>
            {unauthorizedTotal.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>Não autorizadas</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Fora de qualquer lista oficial, desde a assinatura da MP.
          </div>
        </div>
      </div>

      {/* Liveness breakdown — mesmo formato do antigo "Mercado agora" */}
      <div className="glass-card rounded p-6 sm:p-8">
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
          Das {unauthorizedTotal.toLocaleString('pt-BR')} fora da autorização vigente
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
          <span style={{ color: 'var(--live-fg)' }}>{detectedPct.toFixed(0)}%</span> ainda estão só como detectadas, sem bloqueio publicado
        </h3>
        <p className="text-xs mt-1 mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
          Contagem do catálogo publicado. Detectadas, bloqueadas e inativas são situações diferentes.
        </p>

        <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {livenessSegments.map((seg) => (
            <div key={seg.label} style={{ width: `${unauthorizedTotal ? (seg.value / unauthorizedTotal) * 100 : 0}%`, backgroundColor: seg.color }} title={seg.label} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {livenessSegments.map((seg) => (
            <div key={seg.label} className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: seg.color }} />
              <div>
                <div className="font-mono text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {seg.value.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{seg.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
