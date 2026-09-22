import React, { useState } from 'react';
import { RegulatoryChange } from '../types';
import { STATUS_MAP } from '../utils/statusMapping';
import { History, Filter, ExternalLink, Calendar, RefreshCw, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';

interface ChangesViewProps {
  changes: RegulatoryChange[];
  onSelectBrand?: (brandName: string) => void;
}

export const ChangesView: React.FC<ChangesViewProps> = ({ changes, onSelectBrand }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredChanges = changes.filter(chg => {
    if (filterType === 'all') return true;
    return chg.type === filterType;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider mb-1">
          <History className="w-4 h-4" />
          Rastreabilidade Temporal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Registro de Mudanças e Diffs Regulatórios
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Histórico cronológico de inclusões, revogações, alterações de outorga e despachos de bloqueio publicados nos diários e órgãos oficiais.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 font-semibold rounded cursor-pointer transition-colors whitespace-nowrap ${
            filterType === 'all' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Todas as Alterações ({changes.length})
        </button>
        <button
          onClick={() => setFilterType('block_anatel')}
          className={`px-3 py-1.5 font-semibold rounded cursor-pointer transition-colors whitespace-nowrap ${
            filterType === 'block_anatel' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Bloqueios Anatel
        </button>
        <button
          onClick={() => setFilterType('license_update')}
          className={`px-3 py-1.5 font-semibold rounded cursor-pointer transition-colors whitespace-nowrap ${
            filterType === 'license_update' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Atualizações de Outorga
        </button>
        <button
          onClick={() => setFilterType('status_change')}
          className={`px-3 py-1.5 font-semibold rounded cursor-pointer transition-colors whitespace-nowrap ${
            filterType === 'status_change' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Transições de Status
        </button>
      </div>

      {/* Changes Timeline */}
      <div className="space-y-4">
        {filteredChanges.map((item) => {
          const currentMeta = STATUS_MAP[item.currentStatus] || STATUS_MAP.DESCONHECIDA;
          const prevMeta = item.previousStatus ? STATUS_MAP[item.previousStatus] : null;

          return (
            <article key={item.id} className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0B1F33] dark:text-white text-base">
                    {item.brandName}
                  </span>
                  {item.host && (
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.host}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{item.date} às {item.time}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.summary}
              </div>

              {/* Status Diff Badge */}
              <div className="p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded text-xs flex flex-wrap items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status averbado:</span>
                {prevMeta && (
                  <>
                    <span className="line-through text-slate-400">{prevMeta.shortLabel}</span>
                    <span className="text-slate-400">→</span>
                  </>
                )}
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${currentMeta.badgeClass}`}>
                  {currentMeta.publicText}
                </span>
              </div>

              {/* Source Document Reference */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                <div>
                  Fonte: <strong className="text-slate-700 dark:text-slate-300">{item.sourceDoc}</strong>
                </div>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1F5FD1] dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Consultar documento oficial
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
