import React from 'react';

/** O link do e-mail aponta para o BFF. Se a pessoa cair nesta rota dentro da SPA, o navegador
 * recarrega o mesmo caminho para o rewrite entregar a confirmação. */
export const ConfirmView: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
      <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Confirmar e-mail</h1>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Abra o link que chegou no e-mail. Ele confirma a conta no endereço público do site.
      </p>
      <button
        type="button"
        className="text-sm font-semibold underline cursor-pointer"
        style={{ color: 'var(--status-dado-declarado)' }}
        onClick={() => window.location.assign(`${window.location.pathname}${window.location.search}`)}
      >
        Tentar de novo neste endereço
      </button>
    </div>
  );
};
