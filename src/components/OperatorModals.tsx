import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { BetEntity } from '../types';

export interface ContestPreset {
  host: string;
  type: 'contest' | 'report';
  reason: string;
}

interface ContestModalProps {
  email: string;
  preset: ContestPreset;
  onClose: () => void;
  onDone: (reason: string) => void;
}

export const ContestModal: React.FC<ContestModalProps> = ({ email, preset, onClose, onDone }) => {
  const [host, setHost] = useState(preset.host);
  const [type, setType] = useState<ContestPreset['type']>(preset.type);
  const [reason, setReason] = useState(preset.reason);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contest-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <h3 id="contest-modal-title" className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {type === 'report' ? 'Pedido de remoção' : 'Abrir contestação'}
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Enviado pela conta {email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-tertiary)' }} aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onDone(reason.trim());
          }}
        >
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Tipo de solicitação</label>
            <select
              value={type} onChange={(e) => setType(e.target.value as ContestPreset['type'])}
              className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="contest">Contestação de status regulatório</option>
              <option value="report">Denúncia de clone / pedido de remoção</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Domínio</label>
            <input
              type="text" value={host} onChange={(e) => setHost(e.target.value)} required
              className="w-full px-3 py-2 text-xs font-mono rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Motivo</label>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)} rows={4} required
              placeholder="Descreva o motivo e, se houver, anexe o link das evidências"
              className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none resize-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium cursor-pointer hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-semibold rounded cursor-pointer" style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CloneModalProps {
  host: string;
  entity: BetEntity | null;
  onClose: () => void;
  onContest: (host: string, reason: string) => void;
}

export const CloneModal: React.FC<CloneModalProps> = ({ host, entity, onClose, onContest }) => {
  const domain = entity?.domains[0];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clone-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <h3 id="clone-modal-title" className="text-base font-semibold font-mono" style={{ color: 'var(--color-text-primary)' }}>
            {host}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-tertiary)' }} aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p style={{ color: 'var(--color-text-secondary)' }}>{entity?.evidenceSummary || 'Sinais técnicos de clonagem/lookalike detectados por varredura automatizada.'}</p>

          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt style={{ color: 'var(--color-text-tertiary)' }}>Status</dt>
              <dd className="font-semibold" style={{ color: 'var(--status-nao-autorizada)' }}>{entity?.statusText || '—'}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-text-tertiary)' }}>No ar</dt>
              <dd style={{ color: 'var(--color-text-primary)' }}>{domain?.liveness === 'ONLINE' ? 'Sim, HTTP ' + domain.httpCode : domain?.liveness || '—'}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-text-tertiary)' }}>IP / ASN</dt>
              <dd style={{ color: 'var(--color-text-primary)' }}>{domain?.ipAddress || '—'} {domain?.asn ? `· ${domain.asn}` : ''}</dd>
            </div>
            <div>
              <dt style={{ color: 'var(--color-text-tertiary)' }}>Hospedagem</dt>
              <dd style={{ color: 'var(--color-text-primary)' }}>{domain?.hostingProvider || '—'}</dd>
            </div>
          </dl>

          {entity?.cloneRiskNotice && (
            <p className="p-3 rounded border" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
              {entity.cloneRiskNotice}
            </p>
          )}

          <a
            href={`https://${host}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Abrir o site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
          <button onClick={onClose} className="px-4 py-2 text-xs font-medium cursor-pointer hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
            Fechar
          </button>
          <button
            onClick={() => onContest(host, `Pedido de remoção: ${host} imita uma casa autorizada da operadora.`)}
            className="px-4 py-2 text-xs font-semibold rounded cursor-pointer"
            style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
          >
            Pedir remoção
          </button>
        </div>
      </div>
    </div>
  );
};
