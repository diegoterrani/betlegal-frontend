import React, { useState } from 'react';
import { BetEntity } from '../types';
import { STATUS_MAP } from '../utils/statusMapping';
import { X, Copy, Check, Share2, Download, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  entity: BetEntity | null;
  host: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ entity, host, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!entity) return null;

  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;
  const pageUrl = `${window.location.origin}/dominio/${host}`;

  const shareText = `BETLEGAL • VERIFICAÇÃO\n${host}\n${statusInfo.publicText}\nVerificado em ${entity.verifiedAt} às ${entity.lastCheckedTime}\n\nFonte: ${entity.officialSource}\nConsulte o histórico completo em: ${pageUrl}\n\nBet legal? Confere. Plataforma independente • Sem afiliados • Sem bônus`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-[#0D1B2A] rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 id="share-modal-title" className="text-base font-bold text-[#0B1F33] dark:text-white">
              Compartilhar Verificação
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Card factual e rastreável conforme o Brand System BetLegal
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

        {/* Visual Social Card Preview (Page 20 do Brand System) */}
        <div className="p-6 bg-[#F6F8FB] dark:bg-[#081320]">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Pré-visualização do Card Social / OpenGraph
          </div>

          <div className="bg-[#0B1F33] dark:bg-[#050E17] text-white p-6 rounded-lg shadow-sm border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <span className="font-bold tracking-widest text-[#1F5FD1] dark:text-sky-400">
                BETLEGAL <span className="text-slate-400">· VERIFICAÇÃO</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                {entity.verifiedAt} {entity.lastCheckedTime}
              </span>
            </div>

            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
                {host}
              </div>
              <div className="text-xs text-slate-300">
                {entity.legalName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Status Factual</div>
              <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                {statusInfo.publicText}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Fonte: {entity.sphere === 'federal' ? 'SPA/MF' : entity.stateJurisdiction || 'Oficial'}</span>
              <span className="text-[#1F5FD1] dark:text-sky-400 font-medium">Bet legal? Confere.</span>
            </div>
          </div>
        </div>

        {/* Copy Actions */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Link Direto da Ficha de Evidência
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="flex-1 bg-slate-50 dark:bg-[#081320] border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Texto Factual para Mensagens (WhatsApp / Telegram)
            </label>
            <textarea
              readOnly
              rows={4}
              value={shareText}
              className="w-full bg-slate-50 dark:bg-[#081320] border border-slate-200 dark:border-slate-700 rounded p-3 text-xs font-mono text-slate-700 dark:text-slate-200 select-all focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Linguagem neutra sem incentivos ou juízos de valor indevidos.
              </span>
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 bg-[#1F5FD1] hover:bg-[#184ebd] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText ? 'Texto Copiado!' : 'Copiar Texto Formatado'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0B1726] border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
