import React from 'react';
import { MARKET_SERIES_DATA } from '../data/mockData';
import { BarChart3, TrendingUp, Download, PieChart, ShieldAlert, Award } from 'lucide-react';

export const SeriesView: React.FC = () => {
  const maxBlock = Math.max(...MARKET_SERIES_DATA.monthlyBlockGrowth.map(d => d.blocks));

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B7A75] dark:text-teal-400 uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              Séries Históricas e Métricas Abertas
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
              Inteligência de Dados do Mercado Brasileiro
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Datasets consolidados sobre pedidos de outorga, empresas licenciadas e volume de ordens de bloqueio de operadores não autorizados.
            </p>
          </div>

          <button
            onClick={handleExportSeries}
            className="px-3.5 py-2 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#1F5FD1] dark:text-sky-400" />
            Baixar Série (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Outorgas Federais</span>
          <span className="font-mono text-3xl font-bold text-[#0B1F33] dark:text-white tabular-nums block">
            {MARKET_SERIES_DATA.totalAuthorizedNational}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">SPA / Ministério da Fazenda</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Outorgas Estaduais</span>
          <span className="font-mono text-3xl font-bold text-[#0B7A75] dark:text-teal-400 tabular-nums block">
            {MARKET_SERIES_DATA.totalAuthorizedEstadual}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Loterj, Lotepar e Lemg</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Domínios Bloqueados</span>
          <span className="font-mono text-3xl font-bold text-red-700 dark:text-red-400 tabular-nums block">
            {MARKET_SERIES_DATA.totalBlockedAnatel}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Ordens formais Anatel</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Requerimentos no SIGAP</span>
          <span className="font-mono text-3xl font-bold text-amber-700 dark:text-amber-400 tabular-nums block">
            {MARKET_SERIES_DATA.totalUnderAnalysis}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Em análise de conformidade</span>
        </div>
      </div>

      {/* Monthly Block Timeline Chart */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-white">
              Evolução de Bloqueios Administrativos da Anatel
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total acumulado de ordens emitidas pela SPA/MF e executadas pelos provedores de internet
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Série Out/2024 — Mar/2025</span>
        </div>

        <div className="space-y-3 pt-2">
          {MARKET_SERIES_DATA.monthlyBlockGrowth.map((point) => {
            const barPct = Math.round((point.blocks / maxBlock) * 100);
            return (
              <div key={point.month} className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                  <span className="font-mono">{point.month}</span>
                  <div className="space-x-3 font-mono">
                    <span className="text-red-700 dark:text-red-400 font-semibold">{point.blocks.toLocaleString('pt-BR')} bloqueios</span>
                    <span className="text-slate-400 dark:text-slate-600">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{point.authorized} autorizadas</span>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden flex">
                  <div 
                    style={{ width: `${barPct}%` }}
                    className="bg-red-600 dark:bg-red-500 transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State breakdown table */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-4 transition-colors">
        <h2 className="text-base font-bold text-[#0B1F33] dark:text-white">
          Distribuição de Outorgas por Jurisdição
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F8FB] dark:bg-[#081320] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Jurisdição / Órgão</th>
                <th className="py-2.5 px-3 text-right">Empresas Autorizadas</th>
                <th className="py-2.5 px-3 text-right">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {MARKET_SERIES_DATA.stateBreakdown.map((item) => (
                <tr key={item.state} className="hover:bg-slate-50 dark:hover:bg-[#13253B] transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{item.state}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">{item.count}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400">{item.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
