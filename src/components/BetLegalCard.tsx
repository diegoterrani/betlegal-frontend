import React, { useState } from 'react';
import { BetEntity, DomainInfo } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { GlassCard } from './ui/GlassCard';
import {
  ExternalLink,
  Share2,
  History,
  AlertTriangle,
  Copy,
  FileText,
  AlertCircle
} from 'lucide-react';

interface BetLegalCardProps {
  entity: BetEntity;
  selectedDomain?: string;
  onSelectDomain?: (host: string) => void;
  onOpenHistory?: (entity: BetEntity) => void;
  onShare?: (entity: BetEntity, host: string) => void;
  onReport?: (entity: BetEntity, host: string) => void;
  onViewDetails?: (entity: BetEntity) => void;
}

export const BetLegalCard: React.FC<BetLegalCardProps> = ({
  entity,
  selectedDomain,
  onSelectDomain,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [copiedHost, setCopiedHost] = useState<string | null>(null);
  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;

  const primaryDomain: DomainInfo =
    entity.domains.find(d => d.host === selectedDomain) ||
    entity.domains.find(d => d.isPrimary) ||
    entity.domains[0] || {
      host: `${entity.slug}.com`,
      isPrimary: true,
      registeredToCnpj: entity.cnpj,
      liveness: 'ONLINE',
      httpCode: 200,
    };

  const livenessInfo = LIVENESS_MAP[primaryDomain.liveness] || LIVENESS_MAP.ONLINE;

  const handleCopyDomain = (host: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(host);
    setCopiedHost(host);
    setTimeout(() => setCopiedHost(null), 1800);
  };

  return (
    <GlassCard className="p-5 sm:p-6 relative transition-colors hover:border-white/20">
      <article aria-label={`Ficha de verificação: ${entity.brandName} - ${primaryDomain.host}`}>
      {/* 1. CABEÇALHO PADRÃO BETLEGAL */}
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b"
        style={{ borderColor: 'var(--color-card-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              onClick={() => onViewDetails ? onViewDetails(entity) : null}
              className={`text-xl sm:text-2xl font-semibold tracking-tight ${onViewDetails ? 'hover:opacity-80 cursor-pointer' : ''}`}
              style={{ color: 'var(--color-text-primary)' }}
            >
              {entity.brandName.toUpperCase()}
            </h3>

            {entity.tradeNames && entity.tradeNames.length > 1 && (
              <span className="text-xs font-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                (Grupo / Marcas: {entity.tradeNames.join(', ')})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm sm:text-base font-semibold tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              {primaryDomain.host}
            </span>
            <button
              onClick={(e) => handleCopyDomain(primaryDomain.host, e)}
              className="p-1 rounded transition-colors cursor-pointer text-xs flex items-center gap-1 hover:bg-white/10"
              style={{ color: 'var(--color-text-tertiary)' }}
              title="Copiar domínio"
              aria-label="Copiar domínio"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedHost === primaryDomain.host && (
                <span className="text-[11px] font-sans" style={{ color: 'var(--status-autorizada)' }}>Copiado</span>
              )}
            </button>
          </div>
        </div>

        <div className="sm:text-right">
          <div className={`inline-block px-3 py-1 rounded text-xs sm:text-sm font-semibold tracking-wide uppercase border ${statusInfo.badgeClass}`}>
            {statusInfo.publicText.toUpperCase()}
          </div>

          <div className="text-xs mt-1.5 flex items-center sm:justify-end gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {entity.sphere === 'federal' ? 'SPA/MF' : entity.stateJurisdiction ? entity.stateJurisdiction : 'Base Pública'}
            </span>
            <span aria-hidden="true">·</span>
            <span>verificado {entity.verifiedAt} {entity.lastCheckedTime}</span>
          </div>
        </div>
      </div>

      {/* 2. CORPO DO CARD: EVIDÊNCIA & DADOS TÉCNICOS */}
      <div className="py-4 space-y-3.5">

        {entity.cloneRiskNotice && (
          <div
            className="p-3 rounded text-xs flex items-start gap-2.5 border"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--status-atencao) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--status-atencao) 35%, transparent)',
              color: 'var(--status-atencao)',
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Atenção à evidência: </strong>
              {entity.cloneRiskNotice}
            </div>
          </div>
        )}

        <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>{entity.evidenceSummary}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 text-xs">
          <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Razão Social & CNPJ</span>
            <span className="font-medium line-clamp-1 block" style={{ color: 'var(--color-text-primary)' }} title={entity.legalName}>
              {entity.legalName}
            </span>
            <span className="font-mono text-[11px] block mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              {entity.cnpj}
            </span>
          </div>

          <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Ato / Protocolo Regulatório</span>
            <span className="font-medium block truncate" style={{ color: 'var(--color-text-primary)' }} title={entity.portariaNumber || entity.sigapProtocol}>
              {entity.sigapProtocol ? `SIGAP nº ${entity.sigapProtocol}` : entity.portariaNumber || 'Sem protocolo formal'}
            </span>
            <span className="text-[11px] block mt-0.5 truncate" style={{ color: 'var(--color-text-tertiary)' }} title={entity.officialSource}>
              {entity.officialSource}
            </span>
          </div>

          <div className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Sonda Técnica (Liveness)</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    primaryDomain.liveness === 'ONLINE' ? 'var(--status-autorizada)' :
                    primaryDomain.liveness === 'BLOCKED_DNS' ? 'var(--status-nao-autorizada)' :
                    'var(--status-atencao)',
                }}
              />
              <span className={`font-medium ${livenessInfo.textClass}`}>
                {livenessInfo.label}
              </span>
            </div>
            <span className="text-[11px] block mt-0.5 font-mono truncate" style={{ color: 'var(--color-text-tertiary)' }}>
              {primaryDomain.ipAddress || 'DNS em análise'}
            </span>
          </div>
        </div>

        {entity.domains.length > 1 && (
          <div className="pt-1">
            <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Outros domínios registrados sob esta autorização:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {entity.domains.map((dom) => (
                <button
                  key={dom.host}
                  onClick={() => onSelectDomain ? onSelectDomain(dom.host) : null}
                  className="font-mono text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer"
                  style={
                    dom.host === primaryDomain.host
                      ? { backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text-primary)' }
                      : { color: 'var(--color-text-secondary)', borderColor: 'var(--color-card-border)' }
                  }
                >
                  {dom.host}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. BARRA DE AÇÕES */}
      <div
        className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-card-border)' }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {entity.officialSourceUrl && (
            <a
              href={entity.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Ver fonte
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => onOpenHistory ? onOpenHistory(entity) : null}
            className="font-medium inline-flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <History className="w-3.5 h-3.5" />
            Ver histórico ({entity.historicalChanges.length})
          </button>

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(entity)}
              className="font-medium inline-flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <FileText className="w-3.5 h-3.5" />
              Ficha detalhada
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onShare ? onShare(entity, primaryDomain.host) : null}
            className="font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded border border-transparent transition-colors cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Compartilhar verificação"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>

          <button
            onClick={() => onReport ? onReport(entity, primaryDomain.host) : null}
            className="font-medium inline-flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
            style={{ color: 'var(--status-nao-autorizada)' }}
            title="Reportar correção ou clone"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Reportar correção
          </button>
        </div>
      </div>
      </article>
    </GlassCard>
  );
};
