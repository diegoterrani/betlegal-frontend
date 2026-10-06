import React from 'react';
import { PublicStats } from '../lib/realData';

export const DetectionBreakdownCards: React.FC<{ stats: PublicStats | null }> = ({ stats }) => {
  const by = stats?.byStatus || {};
  const nacional = by.AUTORIZADA_NACIONAL || 0;
  const estadual = by.AUTORIZADA_ESTADUAL || 0;
  const judicial = by.DECISAO_JUDICIAL || 0;
  const authorizedTotal = nacional + estadual + judicial;
  const detected = by.NAO_AUTORIZADA_DETECTADA || 0;
  const reach = stats?.detectedReach || { active: 0, inactive: 0, unchecked: 0 };

  const livenessSegments = [
    { label: 'Online', detail: 'Página ainda respondendo.', value: reach.active, color: 'var(--live-fg)' },
    { label: 'Fora do ar', detail: 'Última leitura conclusiva não encontrou a página.', value: reach.inactive, color: 'var(--color-text-secondary)' },
    { label: 'Sem checagem', detail: 'Ainda não há leitura conclusiva de disponibilidade.', value: reach.unchecked, color: 'var(--color-text-tertiary)' },
  ];

  return (
    <div className="space-y-4">
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
            {detected.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>Não autorizadas</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Fora de qualquer lista oficial, desde a assinatura da MP.
          </div>
        </div>
      </div>

      <div className="glass-card rounded p-6 sm:p-8">
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
          Das {detected.toLocaleString('pt-BR')} detectadas
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
          Online, fora do ar e sem checagem somam o estoque do gráfico
        </h3>
        <p className="text-xs mt-1 mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
          {reach.active.toLocaleString('pt-BR')} + {reach.inactive.toLocaleString('pt-BR')} + {reach.unchecked.toLocaleString('pt-BR')} = {detected.toLocaleString('pt-BR')}. Bloqueadas e inativas não entram neste card.
        </p>

        <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {livenessSegments.map((seg) => (
            <div key={seg.label} style={{ width: `${detected ? (seg.value / detected) * 100 : 0}%`, backgroundColor: seg.color }} title={seg.label} />
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
                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{seg.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
