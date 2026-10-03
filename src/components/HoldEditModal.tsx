import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HoldEditModalProps {
  legalName: string;
  cnpj: string;
  domain: string;
  onClose: () => void;
  onSaved: (legalName: string, domain: string) => void;
}

export const HoldEditModal: React.FC<HoldEditModalProps> = ({ legalName, cnpj, domain, onClose, onSaved }) => {
  const [name, setName] = useState(legalName);
  const [dom, setDom] = useState(domain);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-md w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hold-edit-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <h3 id="hold-edit-title" className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Editar dados da operadora
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSaved(name.trim() || legalName, dom.trim() || domain);
          }}
        >
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>CNPJ</label>
            <input
              type="text" readOnly value={cnpj}
              className="w-full px-3 py-2 text-xs font-mono rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Razão social</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Domínio da operadora</label>
            <input
              type="text" value={dom} onChange={(e) => setDom(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-medium cursor-pointer hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded cursor-pointer"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
