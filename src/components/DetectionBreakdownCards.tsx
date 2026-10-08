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
        <AuthorizedCard value={authorizedTotal} redirect={stats?.authorizedRedirect ?? null} />
        <Headline
          value={detected}
          label="Não autorizadas"
          detail="Fora de qualquer lista oficial, desde a assinatura da MP."
          tone="var(--status-nao-autorizada)"
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

const REDIRECT_ROWS: Array<{ key: 'oficial' | 'intermediaria' | 'outraPagina' | 'foraDoAr' | 'avisoBloqueio' | 'proprioSite'; label: string }> = [
  { key: 'oficial', label: 'brasilsembets.gov.br' },
  { key: 'intermediaria', label: 'Site intermediário → brasilsembets.gov.br' },
  { key: 'outraPagina', label: 'Servem outra página' },
  { key: 'foraDoAr', label: 'Estão fora do ar' },
  { key: 'avisoBloqueio', label: 'Aviso de bloqueio no próprio site' },
  { key: 'proprioSite', label: 'Continuam no próprio site' },
];

function updatedLabel(iso: string | null): string {
  if (!iso) return 'Ainda sem leitura';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Ainda sem leitura';
  const clock = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date).replace(', ', ' às ');
  return `Atualizado em ${clock}`;
}

const AuthorizedCard: React.FC<{
  value: number;
  redirect: PublicStats['authorizedRedirect'] | null;
}> = ({ value, redirect }) => {
  const tone = 'var(--status-autorizada)';
  return (
    <div
      className="rounded border p-5"
      style={{
        backgroundColor: `color-mix(in srgb, ${tone} 18%, var(--color-surface))`,
        borderColor: `color-mix(in srgb, ${tone} 55%, transparent)`,
      }}
    >
      <div className="grid items-stretch" style={{ gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, max-content)" }}>
        <div className="flex flex-col items-center justify-center text-center px-2">
          <div className="font-mono text-5xl font-semibold tracking-tight leading-none" style={{ color: tone }}>{fmt(value)}</div>
          <div className="text-base font-semibold mt-2" style={{ color: 'var(--color-text-primary)' }}>Autorizadas</div>
        </div>
        <div
          aria-hidden="true"
          className="w-px self-stretch"
          style={{ backgroundColor: `color-mix(in srgb, ${tone} 45%, transparent)` }}
        />
        <ul className="min-w-0 space-y-1 pl-4">
          {REDIRECT_ROWS.map((row) => (
            <li key={row.key} className="flex items-baseline gap-2">
              <span className="w-8 shrink-0 text-right font-mono text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {redirect ? fmt(redirect[row.key]) : '—'}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{row.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
        {updatedLabel(redirect?.checkedAt ?? null)}
      </p>
    </div>
  );
};

const Headline: React.FC<{ value: number; label: string; detail: string; tone: string }> = ({ value, label, detail, tone }) => (
  <div
    className="rounded border p-5 h-full flex flex-col items-center justify-center text-center"
    style={{
      backgroundColor: `color-mix(in srgb, ${tone} 18%, var(--color-surface))`,
      borderColor: `color-mix(in srgb, ${tone} 55%, transparent)`,
    }}
  >
    <div className="font-mono text-5xl font-semibold tracking-tight leading-none" style={{ color: tone }}>{fmt(value)}</div>
    <div className="text-base font-semibold mt-2" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
    <div className="text-xs mt-2 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>{detail}</div>
  </div>
);

const SplitCard: React.FC<{ value: number; label: string; detail: string; tone: string }> = ({ value, label, detail, tone }) => (
  <div className="glass-card rounded p-5">
    <div className="font-mono text-3xl font-medium tracking-tight" style={{ color: tone }}>{fmt(value)}</div>
    <div className="text-sm font-semibold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>{label}</div>
    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{detail}</div>
  </div>
);
