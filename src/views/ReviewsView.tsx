import React, { useState } from 'react';
import { BetEntity } from '../types';
import { AlertTriangle, ThumbsUp, MessageSquare, Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { RatingModal } from '../components/RatingModal';
import { useUser } from '../context/UserContext';
import { useReviews } from '../context/ReviewsContext';

interface ReviewsViewProps {
  entities: BetEntity[];
  onViewDetails: (entity: BetEntity) => void;
  onNavigate: (path: string) => void;
}

const ratingColor = (score: number) => {
  if (score >= 8) return 'var(--status-autorizada)';
  if (score >= 7) return 'var(--status-dado-declarado)';
  if (score >= 5) return 'var(--status-atencao)';
  return 'var(--status-nao-autorizada)';
};

const ELIGIBLE_FOR_RATING = ['AUTORIZADA_NACIONAL', 'AUTORIZADA_ESTADUAL', 'DECISAO_JUDICIAL'];

export const ReviewsView: React.FC<ReviewsViewProps> = ({ entities, onViewDetails, onNavigate }) => {
  const [sortBy, setSortBy] = useState<'score' | 'complaints' | 'solved'>('score');
  const [ratingTarget, setRatingTarget] = useState<BetEntity | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { user } = useUser();
  const { reviews, addReview } = useReviews();

  const ratedEntities = entities
    .filter(e => e.reputation && e.reputation.complaintsCount > 0)
    .sort((a, b) => {
      if (sortBy === 'score') return b.reputation.reclameAquiScore - a.reputation.reclameAquiScore;
      if (sortBy === 'complaints') return b.reputation.complaintsCount - a.reputation.complaintsCount;
      if (sortBy === 'solved') return b.reputation.solvedRatePercent - a.reputation.solvedRatePercent;
      return 0;
    });

  const handleRateClick = (entity: BetEntity) => {
    if (!user) {
      onNavigate('/entrar');
      return;
    }
    setRatingTarget(entity);
  };

  const communityRating = (slug: string) => {
    const brandReviews = reviews.filter((r) => r.brandSlug === slug);
    if (brandReviews.length === 0) return null;
    const total = brandReviews.reduce(
      (sum, r) => sum + (r.starsSafety + r.starsPayout + r.starsSupport + r.starsSpeed + r.starsResponsible) / 5,
      0
    );
    return { avg: total / brandReviews.length, count: brandReviews.length, items: brandReviews };
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Mandatory Regulatory Separation Disclaimer */}
      <div
        className="p-4 rounded text-xs space-y-1 border"
        style={{ backgroundColor: 'color-mix(in srgb, var(--status-atencao) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--status-atencao) 35%, transparent)', color: 'var(--color-text-primary)' }}
      >
        <div className="font-semibold flex items-center gap-1.5 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-atencao)' }} />
          Aviso Fundamental de Separação de Eixos (Brand Rule nº 2)
        </div>
        <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Status regulatório e reputação do consumidor são dimensões completamente distintas.</strong> Uma casa estar legalmente autorizada pela SPA/MF ou loteria estadual não significa que ela tenha bom atendimento ou seja livre de disputas de pagamento. Da mesma forma, uma nota alta no Reclame Aqui não substitui a obrigatoriedade de outorga governamental.
        </p>
      </div>

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Reputação e Defesa do Consumidor
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              Indicadores públicos de atendimento, resolução de problemas no Reclame Aqui e avaliações de quem usou.
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: 'var(--color-text-tertiary)' }}>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 rounded font-medium focus:outline-none border bg-transparent"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            >
              <option value="score">Nota Reclame Aqui</option>
              <option value="solved">Índice de Solução (%)</option>
              <option value="complaints">Volume de Reclamações</option>
            </select>
          </div>
        </div>

        {!user && (
          <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
            <button onClick={() => onNavigate('/entrar')} className="font-semibold hover:underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
              Entre na sua conta
            </button>{' '}
            para avaliar uma casa autorizada.
          </p>
        )}
      </div>

      {/* List of cards */}
      <div className="space-y-4">
        {ratedEntities.map((entity) => {
          const rep = entity.reputation;
          const color = ratingColor(rep.reclameAquiScore);
          const community = communityRating(entity.slug);
          const eligible = ELIGIBLE_FOR_RATING.includes(entity.status);
          const expanded = expandedSlug === entity.slug;
          return (
            <GlassCard key={entity.id} as="article" className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--color-card-border)' }}>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {entity.brandName}
                  </h3>
                  <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    {entity.legalName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Classificação:</span>
                  <span
                    className="px-2.5 py-0.5 rounded text-xs font-semibold border"
                    style={{ color, borderColor: color, backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}
                  >
                    {rep.ratingLabel} ({rep.reclameAquiScore > 0 ? rep.reclameAquiScore.toFixed(1) : 'Sem nota'}/10)
                  </span>
                </div>
              </div>

              {/* Community rating */}
              {eligible && (
                <div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)', fill: 'var(--status-dado-declarado)' }} />
                    {community ? (
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        <strong className="font-mono">{community.avg.toFixed(1)}</strong> de 5 · {community.count} {community.count === 1 ? 'avaliação' : 'avaliações'} da comunidade
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Ainda sem avaliações da comunidade</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {community && community.count > 0 && (
                      <button
                        onClick={() => setExpandedSlug(expanded ? null : entity.slug)}
                        className="text-xs font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {expanded ? 'Ocultar comentários' : 'Ver comentários'}
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleRateClick(entity)}
                      className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer"
                      style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
                    >
                      Avaliar esta casa
                    </button>
                  </div>
                </div>
              )}

              {eligible && expanded && community && (
                <div className="space-y-2">
                  {community.items.map((r) => (
                    <div key={r.id} className="p-3 rounded border text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ color: 'var(--color-text-tertiary)' }}>{r.authorEmail} · {r.createdAt}</span>
                      </div>
                      {r.comment && <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>{r.comment}</p>}
                      {r.reply && (
                        <p className="mt-2 pt-2 border-t" style={{ color: 'var(--status-autorizada)', borderColor: 'var(--color-card-border)' }}>
                          Resposta da operadora: {r.reply}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <span className="block mb-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reclamações Registradas
                  </span>
                  <span className="font-mono text-base font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                    {rep.complaintsCount.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <span className="block mb-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <ThumbsUp className="w-3.5 h-3.5" style={{ color: 'var(--status-autorizada)' }} />
                    Índice de Solução
                  </span>
                  <span className="font-mono text-base font-semibold tabular-nums" style={{ color: 'var(--status-autorizada)' }}>
                    {rep.solvedRatePercent}%
                  </span>
                </div>

                <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Respostas aos Usuários</span>
                  <span className="font-mono text-base font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                    {rep.answeredRatePercent}%
                  </span>
                </div>

                <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <span className="block mb-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <Clock className="w-3.5 h-3.5" />
                    Tempo Médio Resposta
                  </span>
                  <span className="font-mono text-base font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                    {rep.avgResponseHours} horas
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t flex-wrap gap-2" style={{ borderColor: 'var(--color-card-border)' }}>
                <div style={{ color: 'var(--color-text-tertiary)' }}>
                  Notificações registradas em Procons estaduais: <strong className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{rep.proconNotificationsCount}</strong>
                </div>
                <button
                  onClick={() => onViewDetails(entity)}
                  className="hover:underline font-semibold cursor-pointer"
                  style={{ color: 'var(--status-dado-declarado)' }}
                >
                  Ver Ficha de Evidência e Status Regulatório →
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {ratingTarget && user && (
        <RatingModal
          entity={ratingTarget}
          authorEmail={user.email}
          onClose={() => setRatingTarget(null)}
          onSubmit={(stars, comment) => {
            addReview({
              brandSlug: ratingTarget.slug,
              brand: ratingTarget.brandName,
              authorEmail: user.email,
              comment,
              starsSafety: stars.safety,
              starsPayout: stars.payout,
              starsSupport: stars.support,
              starsSpeed: stars.speed,
              starsResponsible: stars.responsible,
            });
            setRatingTarget(null);
            setExpandedSlug(ratingTarget.slug);
          }}
        />
      )}
    </div>
  );
};
