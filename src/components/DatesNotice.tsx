import React, { useState } from 'react';
import { X, CalendarClock } from 'lucide-react';

interface DatesNoticeProps {
  onNavigate: (path: string) => void;
}

const SESSION_KEY = 'betlegal_dates_notice_dismissed';

/** Só quando a Home carrega pela primeira vez nesta aba — não a cada volta via navegação
 * interna da SPA. sessionStorage (não localStorage) porque o aviso deve voltar numa aba nova. */
function shouldShowOnMount(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

export const DatesNotice: React.FC<DatesNoticeProps> = ({ onNavigate }) => {
  const [open, setOpen] = useState(shouldShowOnMount);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dates-notice-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <h3 id="dates-notice-title" className="text-base font-semibold flex items-center gap-2 pr-4" style={{ color: 'var(--color-text-primary)' }}>
            <CalendarClock className="w-4 h-4 shrink-0" style={{ color: 'var(--status-dado-declarado)' }} />
            As datas não são o dia em que o site foi criado
          </h3>
          <button
            onClick={dismiss}
            className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5 shrink-0"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            O Bet Legal não afirma que um site foi criado ou publicado na data mostrada. A ficha traz três datas
            diferentes, lado a lado.
          </p>

          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            <li>
              <strong style={{ color: 'var(--color-text-primary)' }}>Detectado pelo Bet Legal.</strong> O dia em que a
              nossa varredura encontrou o endereço.
            </li>
            <li>
              <strong style={{ color: 'var(--color-text-primary)' }}>Domínio registrado.</strong> O dia em que alguém
              comprou o endereço. Pode ficar anos parado.
            </li>
            <li>
              <strong style={{ color: 'var(--color-text-primary)' }}>Primeiro certificado de segurança.</strong> O dia
              em que o site passou a abrir com o cadeado. É o indício mais próximo de "entrou no ar", e falta em parte
              das fichas.
            </li>
          </ul>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Saber quando o endereço foi comprado não diz quando ele virou casa de apostas.
          </p>

          <div className="rounded-lg border-2 p-4" style={{ borderColor: 'var(--status-dado-declarado)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Clique aqui para saber como verificamos
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => { dismiss(); onNavigate('/metodologia'); }}
                className="inline-flex items-center justify-center min-h-10 rounded-md px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                Como verificamos
              </button>
              <button
                onClick={dismiss}
                className="inline-flex items-center justify-center min-h-10 rounded-md px-4 py-2.5 text-sm font-semibold cursor-pointer border transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
