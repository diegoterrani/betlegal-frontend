import React from 'react';
import { MARKET_SERIES_DATA } from '../data/mockData';
import { BarChart3, Download } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { MarketGrowthChart } from '../components/MarketGrowthChart';

export const SeriesView: React.FC = () => {
  const handleExportSeries = () => {
    const csv = 'Mes,Bloqueios_Acumulados_Anatel,Outorgas_Ativas\n' +
      MARKET_SERIES_DATA.monthlyBlockGrowth.map(d => `${d.month},${d.blocks},${d.authorized}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `betlegal_series_historicas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <AmbientGlow />

      {/* Title */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              <BarChart3 className="w-4 h-4" />
              Séries Históricas e Métricas Abertas
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Inteligência de Dados do Mercado Brasileiro
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
              Datasets consolidados sobre pedidos de outorga, empresas licenciadas e volume de ordens de bloqueio de operadores não autorizados.
            </p>
          </div>

          <button
            onClick={handleExportSeries}
            className="px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />
            Baixar Série (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Outorgas Federais</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--color-text-primary)' }}>
            {MARKET_SERIES_DATA.totalAuthorizedNational}
          </span>
          <span className="text-[11px] mt-1 block" style={{ color: 'var(--color-text-tertiary)' }}>SPA / Ministério da Fazenda</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Outorgas Estaduais</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-dado-declarado)' }}>
            {MARKET_SERIES_DATA.totalAuthorizedEstadual}
          </span>
          <span className="text-[11px] mt-1 block" style={{ color: 'var(--color-text-tertiary)' }}>Loterj, Lotepar e Lemg</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Domínios Bloqueados</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-bloqueada)' }}>
            {MARKET_SERIES_DATA.totalBlockedAnatel}
          </span>
          <span className="text-[11px] mt-1 block" style={{ color: 'var(--color-text-tertiary)' }}>Ordens formais Anatel</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Requerimentos no SIGAP</span>
          <span className="font-mono text-3xl font-semibold tabular-nums block" style={{ color: 'var(--status-atencao)' }}>
            {MARKET_SERIES_DATA.totalUnderAnalysis}
          </span>
          <span className="text-[11px] mt-1 block" style={{ color: 'var(--color-text-tertiary)' }}>Em análise de conformidade</span>
        </GlassCard>
      </div>

      {/* Monthly Block Timeline Chart */}
      <MarketGrowthChart />

      {/* State breakdown table */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Distribuição de Outorgas por Jurisdição
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="font-semibold border-b" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
              <tr>
                <th className="py-2.5 px-3">Jurisdição / Órgão</th>
                <th className="py-2.5 px-3 text-right">Empresas Autorizadas</th>
                <th className="py-2.5 px-3 text-right">Participação</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_SERIES_DATA.stateBreakdown.map((item) => (
                <tr key={item.state} className="transition-colors hover:bg-white/5 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
                  <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.state}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{item.count}</td>
                  <td className="py-2.5 px-3 text-right font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{item.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
