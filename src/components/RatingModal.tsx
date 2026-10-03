import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { BetEntity } from '../types';

interface RatingModalProps {
  entity: BetEntity;
  authorEmail: string;
  onClose: () => void;
  onSubmit: (stars: { safety: number; payout: number; support: number; speed: number; responsible: number }, comment: string) => void;
}

const CATEGORIES: { key: 'safety' | 'payout' | 'support' | 'speed' | 'responsible'; label: string }[] = [
  { key: 'safety', label: 'Segurança' },
  { key: 'payout', label: 'Pagamento' },
  { key: 'support', label: 'Suporte' },
  { key: 'speed', label: 'Rapidez' },
  { key: 'responsible', label: 'Jogo responsável' },
];

const StarPicker: React.FC<{ value: number; onChange: (v: number) => void; label: string }> = ({ value, onChange, label }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} de 5`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="cursor-pointer p-0.5"
          >
            <Star
              className="w-5 h-5"
              style={{
                color: n <= shown ? 'var(--status-dado-declarado)' : 'var(--color-text-tertiary)',
                fill: n <= shown ? 'var(--status-dado-declarado)' : 'none',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export const RatingModal: React.FC<RatingModalProps> = ({ entity, authorEmail, onClose, onSubmit }) => {
  const [stars, setStars] = useState({ safety: 0, payout: 0, support: 0, speed: 0, responsible: 0 });
  const [comment, setComment] = useState('');

  const allRated = Object.values(stars).every((v) => v > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="glass-card rounded-lg shadow-xl max-w-md w-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <h3 id="rating-modal-title" className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Avaliar {entity.brandName}
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Enviado pela conta {authorEmail}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-tertiary)' }} aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!allRated) return;
            onSubmit(stars, comment.trim());
          }}
        >
          <div className="space-y-2.5">
            {CATEGORIES.map((cat) => (
              <StarPicker key={cat.key} label={cat.label} value={stars[cat.key]} onChange={(v) => setStars((s) => ({ ...s, [cat.key]: v }))} />
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Comentário (opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Conte como foi sua experiência"
              className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none resize-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          {!allRated && (
            <p className="text-xs" style={{ color: 'var(--status-atencao)' }}>Dê uma nota em todas as categorias para enviar.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium cursor-pointer hover:opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!allRated}
              className="px-4 py-2 text-xs font-semibold rounded cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              Enviar avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
