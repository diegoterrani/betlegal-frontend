import React from 'react';
import { GlassCard } from './GlassCard';

interface KpiCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
  className?: string;
}

/**
 * Large tabular-number KPI tile, matching the Figma dashboard "KPI · *" cards
 * (Geist Mono, heavy negative tracking at large sizes).
 */
export const KpiCard: React.FC<KpiCardProps> = ({ label, value, helper, accent, className = '' }) => {
  return (
    <GlassCard className={`p-5 ${className}`}>
      <div
        className="text-[11px] font-medium uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {label}
      </div>
      <div
        className="mt-2 font-mono text-4xl font-medium tracking-tight"
        style={{ color: accent || 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
      >
        {value}
      </div>
      {helper && (
        <div className="mt-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {helper}
        </div>
      )}
    </GlassCard>
  );
};
