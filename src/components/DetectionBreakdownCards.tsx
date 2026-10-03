import React from 'react';
import { AUTHORIZATION_TREND, DETECTION_BREAKDOWN } from '../data/mockData';

export const DetectionBreakdownCards: React.FC = () => {
  const authorizedTotal = AUTHORIZATION_TREND[AUTHORIZATION_TREND.length - 1].authorized;
  const { authorizedBySphere, unauthorizedTotal, unauthorizedLiveness, today } = DETECTION_BREAKDOWN;
  const onlinePct = (unauthorizedLiveness.online / unauthorizedTotal) * 100;

  const livenessSegments = [
    { label: 'Online', value: unauthorizedLiveness.online, color: 'var(--live-fg)' },
    { label: 'Fora do ar', value: unauthorizedLiveness.offline, color: 'var(--color-text-secondary)' },
    { label: 'Sem checagem', value: unauthorizedLiveness.unchecked, color: 'var(--color-text-tertiary)' },
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
            {authorizedBySphere.nacional} nacionais · {authorizedBySphere.estadual} estaduais · {authorizedBySphere.judicial} por decisão judicial
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
          Das {unauthorizedTotal.toLocaleString('pt-BR')} detectadas
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mt-1" style={{ color: 'var(--color-text-primary)' }}>
          <span style={{ color: 'var(--live-fg)' }}>{onlinePct.toFixed(0)}%</span> das não autorizadas detectadas ainda respondem online
        </h3>
        <p className="text-xs mt-1 mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
          {unauthorizedLiveness.offlineSinceAnnouncement} domínios saíram do ar desde o anúncio de 25/09 às 18h.
        </p>

        <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {livenessSegments.map((seg) => (
            <div key={seg.label} style={{ width: `${(seg.value / unauthorizedTotal) * 100}%`, backgroundColor: seg.color }} title={seg.label} />
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

      {/* Today deltas */}
      <div>
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
          Hoje, já dentro das detectadas
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded p-4">
            <div className="font-mono text-3xl font-medium tracking-tight" style={{ color: 'var(--live-fg)' }}>
              {today.newlyDetected}
            </div>
            <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>Não autorizadas — detectadas hoje</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Primeira vez que a verificação de página classifica o domínio como não autorizado. Sonda de disponibilidade não entra.
            </div>
          </div>
          <div className="glass-card rounded p-4">
            <div className="font-mono text-3xl font-medium tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              {today.backOnline}
            </div>
            <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>Não autorizadas — voltaram ao ar hoje</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Já eram não autorizadas, estavam fora do ar, e uma leitura de página as encontrou de novo. A sonda não entra.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
