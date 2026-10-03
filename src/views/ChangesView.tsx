import React, { useState } from 'react';
import { RegulatoryChange } from '../types';
import { STATUS_MAP } from '../utils/statusMapping';
import { History, ExternalLink, Calendar } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

interface ChangesViewProps {
  changes: RegulatoryChange[];
  onSelectBrand?: (brandName: string) => void;
}

export const ChangesView: React.FC<ChangesViewProps> = ({ changes, onSelectBrand }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredChanges = changes.filter(chg => {
    if (filterType === 'all') return true;
    return chg.type === filterType;
  });

  const tabBtnStyle = (active: boolean) => ({
    backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
  });

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
          <History className="w-4 h-4" />
          Rastreabilidade Temporal
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Registro de Mudanças e Diffs Regulatórios
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          Histórico cronológico de inclusões, revogações, alterações de outorga e despachos de bloqueio publicados nos diários e órgãos oficiais.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b text-xs" style={{ borderColor: 'var(--color-card-border)' }}>
        {([
          ['all', `Todas as Alterações (${changes.length})`],
          ['block_anatel', 'Bloqueios Anatel'],
          ['license_update', 'Atualizações de Outorga'],
          ['status_change', 'Transições de Status'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className="px-3 py-1.5 font-semibold rounded cursor-pointer transition-colors whitespace-nowrap"
            style={tabBtnStyle(filterType === key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Changes Timeline */}
      <div className="space-y-4">
        {filteredChanges.map((item) => {
          const currentMeta = STATUS_MAP[item.currentStatus] || STATUS_MAP.DESCONHECIDA;
          const prevMeta = item.previousStatus ? STATUS_MAP[item.previousStatus] : null;

          return (
            <GlassCard key={item.id} as="article" className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--color-card-border)' }}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>
                    {item.brandName}
                  </span>
                  {item.host && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      {item.host}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date} às {item.time}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {item.summary}
              </div>

              {/* Status Diff Badge */}
              <div className="p-2.5 rounded border text-xs flex flex-wrap items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                <span className="font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Status averbado:</span>
                {prevMeta && (
                  <>
                    <span className="line-through" style={{ color: 'var(--color-text-tertiary)' }}>{prevMeta.shortLabel}</span>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>→</span>
                  </>
                )}
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${currentMeta.badgeClass}`}>
                  {currentMeta.publicText}
                </span>
              </div>

              {/* Source Document Reference */}
              <div className="pt-2 flex items-center justify-between text-xs flex-wrap gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <div>
                  Fonte: <strong style={{ color: 'var(--color-text-secondary)' }}>{item.sourceDoc}</strong>
                </div>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1 font-medium"
                    style={{ color: 'var(--status-dado-declarado)' }}
                  >
                    Consultar documento oficial
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
