import React, { useEffect, useState } from 'react';
import { apiGet } from '../lib/http';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

interface BrandPayload {
  brand: { name: string; slug: string; operator: { legal_name: string; cnpj: string } | null };
  domains: { host: string; status_label?: string; status?: string }[];
  unauthorized_domains: { host: string; status_label?: string }[];
}

interface ReviewRow {
  comment: string;
  created_at: string;
  reply: string | null;
}

export const BrandView: React.FC<{ slug: string; onNavigate: (path: string) => void }> = ({ slug, onNavigate }) => {
  const [brand, setBrand] = useState<BrandPayload | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setPhase('loading');
    Promise.all([
      apiGet<BrandPayload>(`/api/v1/brands/${encodeURIComponent(slug)}`),
      apiGet<{ reviews?: ReviewRow[] }>(`/api/v1/brands/${encodeURIComponent(slug)}/reviews`).catch(() => ({ reviews: [] })),
    ])
      .then(([nextBrand, nextReviews]) => {
        if (cancelled) return;
        setBrand(nextBrand);
        setReviews(nextReviews.reviews || []);
        setPhase('ready');
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Não foi possível abrir a marca.');
        setPhase('error');
      });
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <AmbientGlow />
      {phase === 'loading' && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Abrindo a marca…</p>}
      {phase === 'error' && <p className="text-sm" role="alert" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}
      {phase === 'ready' && brand && (
        <>
          <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{brand.brand.name}</h1>
            {brand.brand.operator && (
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {brand.brand.operator.legal_name} · {brand.brand.operator.cnpj}
              </p>
            )}
          </div>
          <GlassCard className="p-5 space-y-2">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Domínios autorizados</h2>
            {brand.domains.length === 0 && <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhum domínio autorizado publicado.</p>}
            {brand.domains.map((domain) => (
              <button key={domain.host} type="button" onClick={() => onNavigate(`/dominio/${encodeURIComponent(domain.host)}`)} className="block text-sm font-mono hover:underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
                {domain.host}
              </button>
            ))}
          </GlassCard>
          {brand.unauthorized_domains.length > 0 && (
            <GlassCard className="p-5 space-y-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Domínios não autorizados ligados a esta casa</h2>
              {brand.unauthorized_domains.map((domain) => (
                <button key={domain.host} type="button" onClick={() => onNavigate(`/dominio/${encodeURIComponent(domain.host)}`)} className="block text-sm font-mono hover:underline cursor-pointer" style={{ color: 'var(--status-nao-autorizada)' }}>
                  {domain.host}
                </button>
              ))}
            </GlassCard>
          )}
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Avaliações publicadas</h2>
            {reviews.length === 0 && <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhum comentário publicado.</p>}
            {reviews.map((review) => (
              <div key={review.created_at + review.comment} className="text-xs space-y-1 pt-2" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>
                <p style={{ color: 'var(--color-text-tertiary)' }}>{new Date(review.created_at).toLocaleString('pt-BR')}</p>
                {review.reply && <p style={{ color: 'var(--status-autorizada)' }}>Resposta: {review.reply}</p>}
              </div>
            ))}
          </GlassCard>
        </>
      )}
    </div>
  );
};
