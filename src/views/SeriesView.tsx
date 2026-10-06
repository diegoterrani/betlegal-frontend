import React, { useEffect, useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { MarketGrowthChart } from '../components/MarketGrowthChart';
import { fetchPublicStats, fetchTimeseries, PublicStats, SeriesPoint } from '../lib/realData';

function count(stats: PublicStats | null, key: string): number {
  return stats?.byStatus[key] || 0;
}

export const SeriesView: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [points, setPoints] = useState<SeriesPoint[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchPublicStats(), fetchTimeseries()])
      .then(([nextStats, nextPoints]) => {
        if (cancelled) return;
        setStats(nextStats);
        setPoints(nextPoints);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'A série não carregou.');
      });
    return () => { cancelled = true; };
  }, []);

  const last = points[points.length - 1];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <AmbientGlow />

      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              <BarChart3 className="w-4 h-4" />
              Séries históricas
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Contagem diária publicada
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
              Cada ponto vem de /api/v1/timeseries. O CSV é o mesmo arquivo que o BFF entrega em /api/v1/timeseries.csv.
            </p>
          </div>
          <a
            href="/api/v1/timeseries.csv"
            className="px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />
            Baixar série (CSV)
          </a>
        </div>
      </div>

      {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Autorizadas nacionais</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--color-text-primary)' }}>
            {count(stats, 'AUTORIZADA_NACIONAL')}
          </span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Autorizadas estaduais</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-dado-declarado)' }}>
            {count(stats, 'AUTORIZADA_ESTADUAL')}
          </span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Bloqueadas na série</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-bloqueada)' }}>
            {last?.unauthorized_blocked ?? '—'}
          </span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Pontos diários</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-atencao)' }}>
            {points.length}
          </span>
        </GlassCard>
      </div>

      <MarketGrowthChart points={points} />

      <GlassCard className="p-6 space-y-4">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Jurisdição publicada
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="font-semibold border-b" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
              <tr>
                <th className="py-2.5 px-3">Jurisdição</th>
                <th className="py-2.5 px-3 text-right">Empresas</th>
                <th className="py-2.5 px-3 text-right">Participação</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.jurisdiction || []).map((item) => (
                <tr key={item.state} className="transition-colors hover:bg-white/5 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
                  <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.state}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{item.count}</td>
                  <td className="py-2.5 px-3 text-right font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{item.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats && stats.jurisdiction.length === 0 && (
            <p className="text-xs pt-3" style={{ color: 'var(--color-text-tertiary)' }}>A jurisdição ainda não chegou em /api/v1/stats.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
