import React from 'react';
import { REGULATORY_CHANGES } from '../data/mockData';
import { Newspaper, ArrowRight } from 'lucide-react';

interface NoticiasViewProps {
  onNavigate: (path: string) => void;
}

const KICKERS: Record<string, string> = {
  inclusion: 'Outorga',
  removal: 'Revogação',
  status_change: 'Regulação',
  block_anatel: 'Bloqueio',
  license_update: 'Autorização',
};

export const NoticiasView: React.FC<NoticiasViewProps> = ({ onNavigate }) => {
  const stories = [...REGULATORY_CHANGES].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const [lead, ...rest] = stories;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider mb-1">
          <Newspaper className="w-4 h-4" />
          Cobertura do mercado regulado
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Notícias
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Leituras curtas sobre outorgas, bloqueios e clones, sempre com a fonte pública que originou o registro.
        </p>
      </div>

      {lead && (
        <article className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1F5FD1] dark:text-sky-400">
            <span>{KICKERS[lead.type] || 'Mercado'}</span>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
            <time className="font-mono font-medium text-slate-500 dark:text-slate-400 normal-case tracking-normal">
              {lead.date} {lead.time}
            </time>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33] dark:text-white leading-snug">
            {lead.brandName}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {lead.summary}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fonte: <span className="text-slate-700 dark:text-slate-200 font-medium">{lead.sourceDoc}</span>
          </p>
          <button
            onClick={() => onNavigate('/mudancas')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline cursor-pointer"
          >
            Ver o registro completo em Mudanças
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </article>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-[#0B7A75] dark:text-teal-400">
                {KICKERS[item.type] || 'Mercado'}
              </span>
              <time className="font-mono text-slate-500 dark:text-slate-400">{item.date}</time>
            </div>
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-white leading-snug">
              {item.brandName}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.summary}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {item.sourceDoc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
