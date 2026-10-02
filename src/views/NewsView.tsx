import React from 'react';
import { Newspaper } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

export const NewsView: React.FC = () => {
  return (
    <div className="relative">
      <AmbientGlow />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="pb-5 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div
            className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Cobertura do setor
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            O que muda na regulação das apostas no Brasil
          </h1>
          <p className="text-sm sm:text-base mt-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Atualizado ao longo do dia com fontes oficiais e imprensa.
          </p>
        </div>

        <GlassCard className="p-8 flex flex-col items-center text-center gap-3">
          <Newspaper className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            O feed de notícias está em construção nesta base de desenvolvimento.
            A estrutura visual (cards de volume diário, listagem cronológica) acompanha a
            tela &ldquo;05 · Notícias&rdquo; do Figma e será preenchida na próxima fase.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
