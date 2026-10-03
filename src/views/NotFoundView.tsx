import React from 'react';
import { SearchX } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => (
  <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
    <div
      className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto"
      style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}
    >
      <SearchX className="w-7 h-7" aria-hidden="true" />
    </div>
    <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Página não encontrada</h1>
    <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
      O endereço pode ter mudado ou estar digitado errado. Para conferir uma casa de apostas, volte para a busca.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => onNavigate('/')}
        className="px-4 py-2.5 text-sm font-semibold rounded-md cursor-pointer"
        style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
      >
        Ir para a busca
      </button>
      <button
        onClick={() => onNavigate('/autorizadas')}
        className="px-4 py-2.5 text-sm font-semibold rounded-md cursor-pointer border hover:bg-white/5"
        style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
      >
        Ver casas autorizadas
      </button>
    </div>
  </div>
);
