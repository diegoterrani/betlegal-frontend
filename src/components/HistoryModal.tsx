import React from 'react';
import { BetEntity } from '../types';
import { X, History, ExternalLink } from 'lucide-react';
import { STATUS_MAP } from '../utils/statusMapping';

interface HistoryModalProps {
  entity: BetEntity | null;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ entity, onClose }) => {
  if (!entity) return null;

  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <h3 id="history-modal-title" className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <History className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
              Histórico Regulatório &amp; Averbações
            </h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              {entity.brandName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div
          className="px-6 py-3 border-b text-xs flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}
        >
          <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>Status Vigente:</span>
          <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${statusInfo.badgeClass}`}>
            {statusInfo.publicText}
          </span>
        </div>

        {/* Timeline list */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {entity.historicalChanges.length > 0 ? (
            <div className="relative border-l-2 ml-3 pl-4 space-y-6" style={{ borderColor: 'var(--color-card-border)' }}>
              {entity.historicalChanges.map((item, idx) => (
                <div key={idx} className="relative">
                  <span
                    className="absolute -left-[23px] top-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--status-dado-declarado)', border: '2px solid var(--color-surface)', boxShadow: '0 0 0 2px var(--color-card-border)' }}
                  />

                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {item.date}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.description}
                    </p>
                    <div className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      Fonte: <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Nenhuma alteração averbada desde a primeira inclusão cadastral.
            </p>
          )}

          {/* Official documentation note */}
          <div className="pt-4 border-t text-xs space-y-1" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}>
            <span className="font-bold block" style={{ color: 'var(--color-text-secondary)' }}>Base Oficial Registrada:</span>
            <p className="leading-snug">{entity.portariaNumber || entity.sigapProtocol || 'Sem ato publicado'}</p>
            {entity.officialSourceUrl && (
              <a
                href={entity.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1 font-semibold pt-1"
                style={{ color: 'var(--status-dado-declarado)' }}
              >
                Acessar publicação no portal oficial
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
