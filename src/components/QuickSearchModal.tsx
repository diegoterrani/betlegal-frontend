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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-2xl max-w-xl w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
      >
        <div className="p-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-card-border)' }}>
          <Search className="w-5 h-5 shrink-0 ml-2" style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite nome, host (.bet.br) ou CNPJ..."
            className="w-full py-2 text-sm bg-transparent focus:outline-none"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto divide-y text-xs" style={{ borderColor: 'var(--color-card-border)' }}>
          {query.trim() && filtered.length === 0 && (
            <div className="p-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
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
                className="w-full p-2.5 rounded flex items-center justify-between text-left transition-colors cursor-pointer group hover:bg-white/5"
                style={{ borderColor: 'var(--color-card-border)' }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {item.brandName}
                    </span>
                    <span
                      className="font-mono text-[11px] px-1.5 py-0.2 rounded"
                      style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                    >
                      {item.domains[0]?.host}
                    </span>
                  </div>
                  <span className="text-[11px] line-clamp-1 mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
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
            <div className="p-3 space-y-2" style={{ color: 'var(--color-text-tertiary)' }}>
              <span
                className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] block"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
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
                    className="p-2 text-left rounded font-medium cursor-pointer hover:bg-white/5"
                    style={{ color: 'var(--color-text-secondary)' }}
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
