import React, { useState } from 'react';
import { BetEntity } from '../types';
import { STATUS_MAP } from '../utils/statusMapping';
import { X, Copy, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <h3 id="share-modal-title" className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Compartilhar Verificação
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Card factual e rastreável conforme o Brand System BetLegal
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

        {/* Visual Social Card Preview — sempre escuro, representa o card de OpenGraph gerado */}
        <div className="p-6" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div className="text-xs font-mono font-medium uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Pré-visualização do Card Social / OpenGraph
          </div>

          <div className="p-6 rounded-lg shadow-sm space-y-4" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="flex items-center justify-between text-xs border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.14)' }}>
              <span className="font-bold tracking-widest">
                BETLEGAL <span style={{ color: '#A3A3A3' }}>· VERIFICAÇÃO</span>
              </span>
              <span className="font-mono text-[11px]" style={{ color: '#A3A3A3' }}>
                {entity.verifiedAt} {entity.lastCheckedTime}
              </span>
            </div>

            <div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight mb-1">
                {host}
              </div>
              <div className="text-xs" style={{ color: '#D4D4D4' }}>
                {entity.legalName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
              </div>
            </div>

            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: '#A3A3A3' }}>Status Factual</div>
              <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--status-autorizada)' }}>
                {statusInfo.publicText}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t" style={{ color: '#A3A3A3', borderColor: 'rgba(255,255,255,0.14)' }}>
              <span>Fonte: {entity.sphere === 'federal' ? 'SPA/MF' : entity.stateJurisdiction || 'Oficial'}</span>
              <span className="font-medium" style={{ color: '#FFFFFF' }}>Bet legal? Confere.</span>
            </div>
          </div>
        </div>

        {/* Copy Actions */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Link Direto da Ficha de Evidência
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="flex-1 rounded px-3 py-2 text-xs font-mono select-all focus:outline-none border bg-transparent"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Texto Factual para Mensagens (WhatsApp / Telegram)
            </label>
            <textarea
              readOnly
              rows={4}
              value={shareText}
              className="w-full rounded p-3 text-xs font-mono select-all focus:outline-none resize-none leading-relaxed border bg-transparent"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Linguagem neutra sem incentivos ou juízos de valor indevidos.
              </span>
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText ? 'Texto Copiado!' : 'Copiar Texto Formatado'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium cursor-pointer hover:opacity-80"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
