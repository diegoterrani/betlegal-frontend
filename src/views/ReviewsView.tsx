import React, { useState } from 'react';
import { BetEntity } from '../types';
import { Star, ShieldAlert, AlertTriangle, ExternalLink, ThumbsUp, MessageSquare, Clock } from 'lucide-react';

interface ReviewsViewProps {
  entities: BetEntity[];
  onViewDetails: (entity: BetEntity) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ entities, onViewDetails }) => {
  const [sortBy, setSortBy] = useState<'score' | 'complaints' | 'solved'>('score');

  // Filter entities that have consumer metrics
  const ratedEntities = entities
    .filter(e => e.reputation && e.reputation.complaintsCount > 0)
    .sort((a, b) => {
      if (sortBy === 'score') return b.reputation.reclameAquiScore - a.reputation.reclameAquiScore;
      if (sortBy === 'complaints') return b.reputation.complaintsCount - a.reputation.complaintsCount;
      if (sortBy === 'solved') return b.reputation.solvedRatePercent - a.reputation.solvedRatePercent;
      return 0;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Mandatory Regulatory Separation Disclaimer (Page 17 & Page 22) */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 dark:border-amber-600 rounded text-xs text-amber-950 dark:text-amber-200 space-y-1 transition-colors">
        <div className="font-bold flex items-center gap-1.5 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          Aviso Fundamental de Separação de Eixos (Brand Rule nº 2)
        </div>
        <p className="leading-relaxed">
          <strong>Status regulatório e reputação do consumidor são dimensões completamente distintas.</strong> Uma casa estar legalmente autorizada pela SPA/MF ou loteria estadual não significa que ela tenha bom atendimento ou seja livre de disputas de pagamento. Da mesma forma, uma nota alta no Reclame Aqui não substitui a obrigatoriedade de outorga governamental.
        </p>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
              Reputação e Defesa do Consumidor
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Indicadores públicos de atendimento, resolução de problemas no Reclame Aqui e notificações em Procons.
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 bg-white dark:bg-[#081320] border border-slate-300 dark:border-slate-700 rounded font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#1F5FD1]"
            >
              <option value="score">Nota Reclame Aqui</option>
              <option value="solved">Índice de Solução (%)</option>
              <option value="complaints">Volume de Reclamações</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of cards */}
      <div className="space-y-4">
        {ratedEntities.map((entity) => {
          const rep = entity.reputation;
          return (
            <article key={entity.id} className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white">
                    {entity.brandName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {entity.legalName} • CNPJ: <span className="font-mono">{entity.cnpj}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Classificação:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    rep.reclameAquiScore >= 8 
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : rep.reclameAquiScore >= 7
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : rep.reclameAquiScore >= 5
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  }`}>
                    {rep.ratingLabel} ({rep.reclameAquiScore > 0 ? rep.reclameAquiScore.toFixed(1) : 'Sem nota'}/10)
                  </span>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Reclamações Registradas
                  </span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {rep.complaintsCount.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="p-2.5 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Índice de Solução
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {rep.solvedRatePercent}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Respostas aos Usuários</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {rep.answeredRatePercent}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Tempo Médio Resposta
                  </span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {rep.avgResponseHours} horas
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                <div className="text-slate-500 dark:text-slate-400">
                  Notificações registradas em Procons estaduais: <strong className="font-mono text-slate-800 dark:text-slate-200">{rep.proconNotificationsCount}</strong>
                </div>
                <button
                  onClick={() => onViewDetails(entity)}
                  className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                >
                  Ver Ficha de Evidência e Status Regulatório →
                </button>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
