import React, { useEffect, useState } from 'react';
import { BetEntity } from '../types';
import { fetchDomainRecord } from '../lib/realData';
import { DomainDetailView } from './DomainDetailView';

interface DomainRouteProps {
  host: string;
  entities: BetEntity[];
  onBack: () => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onNavigate: (path: string) => void;
}

export const DomainRoute: React.FC<DomainRouteProps> = ({
  host, entities, onBack, onShare, onReport, onNavigate,
}) => {
  const known = entities.find((entity) => entity.domains.some((domain) => domain.host === host)) || null;
  const [entity, setEntity] = useState<BetEntity | null>(known);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'missing' | 'error'>(known ? 'ready' : 'loading');

  useEffect(() => {
    const match = entities.find((item) => item.domains.some((domain) => domain.host === host)) || null;
    if (match) {
      setEntity(match);
      setPhase('ready');
      return;
    }
    let cancelled = false;
    setPhase('loading');
    fetchDomainRecord(host)
      .then((found) => {
        if (cancelled) return;
        setEntity(found);
        setPhase(found ? 'ready' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setPhase('error');
      });
    return () => { cancelled = true; };
  }, [host, entities]);

  if (phase === 'loading') {
    return <p className="max-w-3xl mx-auto px-4 py-16 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Abrindo a ficha de {host}…</p>;
  }
  if (phase === 'error') {
    return <p className="max-w-3xl mx-auto px-4 py-16 text-sm" role="alert" style={{ color: 'var(--status-nao-autorizada)' }}>Não foi possível abrir {host}.</p>;
  }
  if (!entity || phase === 'missing') {
    return <p className="max-w-3xl mx-auto px-4 py-16 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{host} não está no catálogo publicado.</p>;
  }
  return (
    <DomainDetailView
      entity={entity}
      hostName={host}
      onBack={onBack}
      onShare={onShare}
      onReport={onReport}
      onNavigate={onNavigate}
    />
  );
};
