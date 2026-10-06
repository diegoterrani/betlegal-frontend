import React, { useEffect, useState } from 'react';
import { fetchTodayUnauthorizedFlow, PublicStats } from '../lib/realData';

const fmt = (n: number) => n.toLocaleString('pt-BR');

export const DetectionBreakdownCards: React.FC<{ stats: PublicStats | null }> = ({ stats }) => {
  const by = stats?.byStatus || {};
  const nacional = by.AUTORIZADA_NACIONAL || 0;
  const estadual = by.AUTORIZADA_ESTADUAL || 0;
  const judicial = by.DECISAO_JUDICIAL || 0;
  const authorizedTotal = nacional + estadual + judicial;
  const detected = by.NAO_AUTORIZADA_DETECTADA || 0;
  const online = stats?.detectedReach.active || 0;
  const offline = stats?.detectedReach.inactive || 0;
  const unchecked = stats?.detectedReach.unchecked || 0;
  const offlineAfter = stats?.offlineAfterProhibition || 0;
  const [today, setToday] = useState<{ detected: number; returned: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTodayUnauthorizedFlow()
      .then((flow) => { if (!cancelled) setToday(flow); })
      .catch(() => { if (!cancelled) setToday({ detected: 0, returned: 0 }); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Headline
          value={authorizedTotal}
          label="Autorizadas"
          detail={`${fmt(nacional)} nacionais · ${fmt(estadual)} estaduais · ${fmt(judicial)} por decisão judicial`}
          tone="var(--data-base)"
        />
        <Headline
          value={detected}
          label="Não autorizadas"
          detail="Fora de qualquer lista oficial, desde a assinatura da MP."
          tone="var(--data-risco)"
        />
      </div>

      <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        Das {fmt(detected)} detectadas
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SplitCard
          value={online}
          label="Online"
          detail="Página ainda respondendo."
          tone="var(--data-risco)"
        />
        <SplitCard
          value={offline}
          label="Fora do ar"
          detail={`A checagem não encontrou a página. ${fmt(offlineAfter)} saíram do ar depois de 25/09 às 18h.`}
          tone="var(--data-estado)"
        />
        <SplitCard
          value={unchecked}
          label="Sem checagem"
          detail="Ainda não há leitura conclusiva de disponibilidade."
          tone="var(--color-text-secondary)"
        />
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
        {fmt(online)} + {fmt(offline)} + {fmt(unchecked)} = {fmt(detected)}
      </p>

      <div className="text-sm font-semibold pt-2" style={{ color: 'var(--color-text-primary)' }}>
        Hoje, já dentro das detectadas
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SplitCard
          value={today?.detected ?? 0}
          label="Não autorizadas — detectadas hoje"
          detail="Primeira vez que a verificação de página classifica o domínio como não autorizado. Sonda de disponibilidade não entra."
          tone="var(--data-risco)"
        />
        <SplitCard
          value={today?.returned ?? 0}
          label="Não autorizadas — voltaram ao ar hoje"
          detail="Já eram não autorizadas, estavam fora do ar, e uma leitura de página as encontrou de novo. A sonda não entra."
          tone="var(--data-estado)"
        />
      </div>
    </div>
  );
};

const Headline: React.FC<{ value: number; label: string; detail: string; tone: string }> = ({ value, label, detail, tone }) => (
  <div
    className="rounded border p-5"
    style={{
      backgroundColor: `color-mix(in srgb, ${tone} 10%, transparent)`,
      borderColor: `color-mix(in srgb, ${tone} 30%, transparent)`,
    }}
  >
    <div className="font-mono text-4xl font-medium tracking-tight" style={{ color: tone }}>{fmt(value)}</div>
    <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{detail}</div>
  </div>
);

const SplitCard: React.FC<{ value: number; label: string; detail: string; tone: string }> = ({ value, label, detail, tone }) => (
  <div className="glass-card rounded p-5">
    <div className="font-mono text-3xl font-medium tracking-tight" style={{ color: tone }}>{fmt(value)}</div>
    <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{detail}</div>
  </div>
);
