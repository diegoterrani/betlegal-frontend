import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { apiGet, apiSend } from '../lib/http';

interface OperatorDeskViewProps {
  onNavigate: (path: string) => void;
}

interface Desk {
  hold: { legalName: string; cnpj: string; domain: string; status: string; linkedToSpa: boolean } | null;
  houses: { name: string; host: string; statusLabel: string }[];
  reviews: { id: number; comment: string | null; brand: string; reply: string | null; created_at: string }[];
  clones: { host: string; statusLabel: string; officialHost: string | null; contested: boolean }[];
  error?: string;
}

export const OperatorDeskView: React.FC<OperatorDeskViewProps> = ({ onNavigate }) => {
  const { user, ready } = useUser();
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Record<number, string>>({});
  const [legalName, setLegalName] = useState('');

  const allowed = user && (user.role === 'operator' || user.role === 'super_admin');

  useEffect(() => {
    if (!ready || !allowed) return;
    apiGet<Desk>('/api/v1/operator/desk')
      .then((data) => {
        setDesk(data);
        setLegalName(data.hold?.legalName || '');
        if (data.error) setError(data.error);
      })
      .catch((err: Error) => setError(err.message));
  }, [ready, allowed]);

  if (!ready) return null;
  if (!allowed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Operadora</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Esta área exige a sessão da operadora na mesma origem.</p>
        <button onClick={() => onNavigate('/entrar?next=/operadora')} className="px-4 py-2 text-sm font-semibold rounded cursor-pointer" style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}>Entrar</button>
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Operadora</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Casas, comentários e cópias vêm de /api/v1/operator/desk.</p>
      </div>
      {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}

      {desk?.hold && (
        <GlassCard className="p-5 space-y-3 text-sm">
          <p style={{ color: 'var(--color-text-primary)' }}>{desk.hold.legalName}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>CNPJ {desk.hold.cnpj} · {desk.hold.domain} · {desk.hold.status}</p>
          <form className="flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            apiSend('/api/v1/profile', 'PATCH', { legalName })
              .then(() => setDesk((current) => current?.hold ? { ...current, hold: { ...current.hold, legalName } } : current))
              .catch((err: Error) => setError(err.message));
          }}>
            <input value={legalName} onChange={(e) => setLegalName(e.target.value)} className="flex-1 rounded border bg-transparent px-2 py-1 text-xs" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }} />
            <button className="text-xs px-3 py-1 rounded cursor-pointer" style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}>Salvar razão social</button>
          </form>
        </GlassCard>
      )}

      <GlassCard className="p-5 space-y-2">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Casas</h2>
        {(desk?.houses || []).map((house) => (
          <p key={house.host} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{house.name} · {house.host} · {house.statusLabel}</p>
        ))}
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Comentários</h2>
        {(desk?.reviews || []).map((review) => (
          <div key={review.id} className="text-xs space-y-2 pt-2" style={{ borderTop: '1px solid var(--color-card-border)' }}>
            <p style={{ color: 'var(--color-text-primary)' }}>{review.brand}</p>
            <p style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>
            {review.reply ? <p style={{ color: 'var(--status-autorizada)' }}>{review.reply}</p> : (
              <form className="flex gap-2" onSubmit={(e) => {
                e.preventDefault();
                const body = (draft[review.id] || '').trim();
                if (!body) return;
                apiSend('/api/v1/operator/replies', 'POST', { reviewId: review.id, body })
                  .then(() => setDesk((current) => current ? { ...current, reviews: current.reviews.map((item) => item.id === review.id ? { ...item, reply: body } : item) } : current))
                  .catch((err: Error) => setError(err.message));
              }}>
                <input value={draft[review.id] || ''} onChange={(e) => setDraft((current) => ({ ...current, [review.id]: e.target.value }))} className="flex-1 rounded border bg-transparent px-2 py-1" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }} />
                <button className="px-2 rounded cursor-pointer" style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text-secondary)' }}>Responder</button>
              </form>
            )}
          </div>
        ))}
      </GlassCard>

      <GlassCard className="p-5 space-y-2">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Possíveis cópias</h2>
        {(desk?.clones || []).map((clone) => (
          <p key={clone.host} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {clone.host} · {clone.statusLabel}{clone.officialHost ? ` · oficial ${clone.officialHost}` : ''}{clone.contested ? ' · contestado' : ''}
          </p>
        ))}
      </GlassCard>
    </div>
  );
};
