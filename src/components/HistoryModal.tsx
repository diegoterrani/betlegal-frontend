import React from 'react';
import { BetEntity } from '../types';
import { X, History, ExternalLink, Calendar } from 'lucide-react';
import { STATUS_MAP } from '../utils/statusMapping';

interface HistoryModalProps {
  entity: BetEntity | null;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ entity, onClose }) => {
  if (!entity) return null;

  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-[#0D1B2A] rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 id="history-modal-title" className="text-base font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
              Histórico Regulatório & Averbações
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {entity.brandName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="px-6 py-3 bg-[#F6F8FB] dark:bg-[#081320] border-b border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-300 font-medium">Status Vigente:</span>
          <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${statusInfo.badgeClass}`}>
            {statusInfo.publicText}
          </span>
        </div>

        {/* Timeline list */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {entity.historicalChanges.length > 0 ? (
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-4 space-y-6">
              {entity.historicalChanges.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#1F5FD1] dark:bg-sky-400 border-2 border-white dark:border-[#0D1B2A] ring-2 ring-slate-100 dark:ring-slate-800" />
                  
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-[#0B1F33] dark:text-white">
                      {item.date}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Fonte: <span className="text-slate-700 dark:text-slate-200 font-medium">{item.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-4">
              Nenhuma alteração averbada desde a primeira inclusão cadastral.
            </p>
          )}

          {/* Official documentation note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Base Oficial Registrada:</span>
            <p className="leading-snug">{entity.portariaNumber || entity.sigapProtocol || 'Sem ato publicado'}</p>
            {entity.officialSourceUrl && (
              <a
                href={entity.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1F5FD1] dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-semibold pt-1"
              >
                Acessar publicação no portal oficial
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B1726] border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
