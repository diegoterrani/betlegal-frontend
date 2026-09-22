import React, { useState, useEffect } from 'react';
import { BetEntity } from '../types';
import { Search, X, ArrowRight, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { STATUS_MAP } from '../utils/statusMapping';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: BetEntity[];
  onSelectEntity: (entity: BetEntity) => void;
  onSelectRoute: (path: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  entities,
  onSelectEntity,
  onSelectRoute,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() ? entities.filter(e => {
    const q = query.toLowerCase();
    return (
      e.brandName.toLowerCase().includes(q) ||
      e.domains.some(d => d.host.toLowerCase().includes(q)) ||
      e.cnpj.includes(q) ||
      e.legalName.toLowerCase().includes(q)
    );
  }).slice(0, 6) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#0B1F33]/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-[#0D1B2A] rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100"
        role="dialog"
      >
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite nome, host (.bet.br) ou CNPJ..."
            className="w-full py-2 text-sm text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {query.trim() && filtered.length === 0 && (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
              Nenhuma casa ou domínio correspondente. Pressione Enter para buscar no índice geral.
            </div>
          )}

          {filtered.map((item) => {
            const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.DESCONHECIDA;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectEntity(item);
                  onClose();
                }}
                className="w-full p-2.5 hover:bg-slate-50 dark:hover:bg-[#13253B] rounded flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#1F5FD1] dark:group-hover:text-[#3B82F6]">
                      {item.brandName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                      {item.domains[0]?.host}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.legalName} • {item.cnpj}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${statusInfo.badgeClass}`}>
                  {statusInfo.shortLabel}
                </span>
              </button>
            );
          })}

          {!query.trim() && (
            <div className="p-3 text-slate-500 dark:text-slate-400 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Navegação Rápida
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Lista Positiva (Autorizadas)', path: '/autorizadas' },
                  { label: 'Radar de Clones e Bloqueios', path: '/radar' },
                  { label: 'Mudanças e Diffs Recentes', path: '/mudancas' },
                  { label: 'Séries Históricas do Mercado', path: '/series' },
                  { label: 'Metodologia e 4 Janelas', path: '/metodologia' },
                  { label: 'API Pública de Consulta', path: '/api' },
                ].map(r => (
                  <button
                    key={r.path}
                    onClick={() => {
                      onSelectRoute(r.path);
                      onClose();
                    }}
                    className="p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
