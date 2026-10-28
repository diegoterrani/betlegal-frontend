import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

/** A página oficial da Loterj passou a dizer "Nenhuma empresa licenciada ativa no momento".
 * Não houve ato publicado de revogação, então o registro anterior continua na base e este aviso
 * explica a diferença. Retirar quando a Loterj publicar o ato ou a lista voltar. */
export const LOTERJ_NOTICE = {
  checkedAt: '28/10/2026',
  url: 'https://www.loterj.rj.gov.br/licenciadas.php',
  quote: 'Nenhuma empresa licenciada ativa no momento.',
};

export function affectedByLoterjNotice(entity: { sphere?: string; stateJurisdiction?: string } | null | undefined): boolean {
  return entity?.sphere === 'estadual' && (entity.stateJurisdiction || '').toUpperCase().startsWith('RJ');
}

interface LoterjLicenseModalProps {
  onClose: () => void;
  /** Nome da marca quando o aviso abre na ficha; sem ele o texto fala de todas as licenças do RJ. */
  brandName?: string;
}

export const LoterjLicenseModal: React.FC<LoterjLicenseModalProps> = ({ onClose, brandName }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    onClick={onClose}
    onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
  >
    <div
      className="glass-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loterj-notice-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
        <h3 id="loterj-notice-title" className="text-base font-semibold flex items-center gap-2 pr-4" style={{ color: 'var(--color-text-primary)' }}>
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-atencao)' }} />
          Licenças do Rio de Janeiro fora da lista oficial
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5 shrink-0"
          style={{ color: 'var(--color-text-tertiary)' }}
          aria-label="Fechar"
          autoFocus
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Em {LOTERJ_NOTICE.checkedAt}, a página de empresas licenciadas da Loterj, a loteria do Estado do Rio de Janeiro, passou a mostrar:
        </p>

        <blockquote className="rounded-lg border p-3 text-sm font-semibold" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          “{LOTERJ_NOTICE.quote}”
        </blockquote>

        <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>
              {brandName ? `A licença estadual de ${brandName} não aparece mais na lista da Loterj.` : 'Nenhuma licença estadual do RJ aparece mais na lista da Loterj.'}
            </strong>{' '}
            A autorização estadual mostrada aqui é o último registro que a Loterj publicou.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Ainda não encontramos o ato de revogação.</strong> Mantemos o registro anterior, marcado com este aviso, até a Loterj publicar o ato ou a lista voltar.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Licença estadual vale só no Rio de Janeiro.</strong> Em caso de divergência, a lista nacional da SPA/MF prevalece.
          </li>
        </ul>

        <div className="pt-1 flex flex-wrap items-center gap-3">
          <a
            href={LOTERJ_NOTICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-10 rounded-md px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
          >
            Ver a página da Loterj
          </a>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-10 rounded-md px-4 py-2.5 text-sm font-semibold cursor-pointer border transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface LoterjLicenseBannerProps {
  title: string;
  children: React.ReactNode;
  onOpen: () => void;
}

export const LoterjLicenseBanner: React.FC<LoterjLicenseBannerProps> = ({ title, children, onOpen }) => (
  <div
    role="status"
    className="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    style={{ borderColor: 'var(--status-atencao)', backgroundColor: 'rgba(255,255,255,0.03)' }}
  >
    <div className="flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--status-atencao)' }} />
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{children}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex items-center justify-center min-h-10 rounded-md px-4 py-2 text-sm font-semibold cursor-pointer border transition-colors hover:bg-white/5 shrink-0"
      style={{ borderColor: 'var(--status-atencao)', color: 'var(--color-text-primary)' }}
    >
      Entenda
    </button>
  </div>
);
