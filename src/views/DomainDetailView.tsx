import React, { useState } from 'react';
import { BetEntity, DomainInfo } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  AlertCircle,
  Server,
  History,
  Building,
  Check,
  Copy,
  AlertTriangle
} from 'lucide-react';

interface DomainDetailViewProps {
  entity: BetEntity;
  hostName: string;
  onBack: () => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
}

export const DomainDetailView: React.FC<DomainDetailViewProps> = ({
  entity,
  hostName,
  onBack,
  onShare,
  onReport,
}) => {
  const [copied, setCopied] = useState(false);
  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;
  const isAuthorized = entity.status === 'AUTORIZADA_NACIONAL' || entity.status === 'AUTORIZADA_ESTADUAL' || entity.status === 'DECISAO_JUDICIAL';

  const currentDomain: DomainInfo =
    entity.domains.find(d => d.host === hostName) ||
    entity.domains[0] || {
      host: hostName,
      isPrimary: true,
      registeredToCnpj: entity.cnpj,
      liveness: 'ONLINE',
      httpCode: 200,
    };

  const livenessInfo = LIVENESS_MAP[currentDomain.liveness] || LIVENESS_MAP.ONLINE;

  const handleCopyHost = () => {
    navigator.clipboard.writeText(currentDomain.host);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <AmbientGlow />

      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--color-card-border)' }}>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare(entity, currentDomain.host)}
            className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />
            Compartilhar
          </button>
          <button
            onClick={() => onReport(entity, currentDomain.host)}
            className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--status-nao-autorizada)' }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Denunciar / Contestar
          </button>
        </div>
      </div>

      {/* Veredito Header */}
      <GlassCard className="p-6 sm:p-8 space-y-6">

        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
          Ficha do site · Veredito
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight font-mono" style={{ color: 'var(--color-text-primary)' }}>
                {currentDomain.host}
              </h1>
              <button
                onClick={handleCopyHost}
                className="p-1.5 rounded transition-colors hover:bg-white/10"
                style={{ color: 'var(--color-text-tertiary)' }}
                title="Copiar domínio"
              >
                {copied ? <Check className="w-4 h-4" style={{ color: 'var(--status-autorizada)' }} /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm mt-1 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Marca comercial: <strong style={{ color: 'var(--color-text-primary)' }}>{entity.brandName}</strong>
            </div>
          </div>

          <div className="md:text-right space-y-1">
            <div className={`inline-block px-3.5 py-1.5 rounded text-xs sm:text-sm font-bold tracking-wide uppercase border ${statusInfo.badgeClass}`}>
              {statusInfo.publicText.toUpperCase()}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Verificado em {entity.verifiedAt} às {entity.lastCheckedTime}
            </div>
          </div>
        </div>

        {/* Veredito plain-language statement */}
        <div
          className="p-4 rounded border text-sm leading-relaxed"
          style={{
            backgroundColor: isAuthorized ? 'color-mix(in srgb, var(--status-autorizada) 8%, transparent)' : 'color-mix(in srgb, var(--status-nao-autorizada) 8%, transparent)',
            borderColor: isAuthorized ? 'color-mix(in srgb, var(--status-autorizada) 30%, transparent)' : 'color-mix(in srgb, var(--status-nao-autorizada) 30%, transparent)',
            color: 'var(--color-text-primary)',
          }}
        >
          {isAuthorized
            ? 'Sim, este site tem autorização. Está na lista oficial da Secretaria de Prêmios e Apostas (SPA/MF) ou de um órgão lotérico estadual, e pode oferecer apostas dentro do escopo da sua outorga.'
            : 'Não encontramos autorização para este site. Ele não aparece em nenhuma das listas oficiais consultadas na última verificação. Não deposite dinheiro aqui.'}
        </div>

        {entity.cloneRiskNotice && (
          <div
            className="p-4 rounded border text-xs flex items-start gap-3"
            style={{ backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--status-nao-autorizada) 35%, transparent)', color: 'var(--status-nao-autorizada)' }}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Aviso de Risco / Lookalike:</strong>
              <p className="mt-0.5 leading-relaxed">{entity.cloneRiskNotice}</p>
            </div>
          </div>
        )}

        {/* Grid de Dados Cadastrais e Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              <Building className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
              Dados Cadastrais & Regulatórios
            </h3>

            <div className="p-4 rounded border space-y-3 text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Razão Social do Operador</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{entity.legalName}</span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>CNPJ</span>
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{entity.cnpj}</span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Esfera Regulamentar</span>
                <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {entity.sphere === 'federal' ? 'Federal (Secretaria de Prêmios e Apostas - SPA/MF)' : entity.stateJurisdiction || 'Sem registro'}
                </span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Protocolo / Portaria</span>
                <span className="font-mono text-[11px] block" style={{ color: 'var(--color-text-secondary)' }}>
                  {entity.portariaNumber || entity.sigapProtocol || 'Não informado'}
                </span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Fonte Oficial</span>
                <a
                  href={entity.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium inline-flex items-center gap-1"
                  style={{ color: 'var(--status-dado-declarado)' }}
                >
                  {entity.officialSource}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              <Server className="w-4 h-4" style={{ color: 'var(--status-autorizada)' }} />
              Sonda Técnica e Infraestrutura
            </h3>

            <div className="p-4 rounded border space-y-3 text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Disponibilidade (Liveness)</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentDomain.liveness === 'ONLINE' ? 'var(--status-autorizada)' : 'var(--status-nao-autorizada)' }}
                  />
                  <span className={`font-semibold ${livenessInfo.textClass}`}>
                    {livenessInfo.label} (HTTP {currentDomain.httpCode})
                  </span>
                </div>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Endereço IP & Provedor ASN</span>
                <span className="font-mono font-medium block" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentDomain.ipAddress || 'Não resolvido'}
                </span>
                <span className="text-[11px] font-mono block" style={{ color: 'var(--color-text-tertiary)' }}>
                  {currentDomain.asn || 'Sem ASN'}
                </span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Certificado SSL / TLS</span>
                <span className="font-mono text-[11px] block" style={{ color: 'var(--color-text-secondary)' }}>
                  Emissor: {currentDomain.sslIssuer || 'N/A'}
                </span>
                <span className="text-[11px] block" style={{ color: 'var(--color-text-tertiary)' }}>
                  Válido até: {currentDomain.sslValidUntil || 'N/A'}
                </span>
              </div>

              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Hospedagem & Infraestrutura</span>
                <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentDomain.hostingProvider || 'Informação não divulgada'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Histórico Temporal e Diff */}
        <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--color-card-border)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
            <History className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
            Linha do Tempo e Modificações Averbadas
          </h3>

          <div className="rounded border divide-y overflow-hidden text-xs" style={{ borderColor: 'var(--color-card-border)' }}>
            {entity.historicalChanges.map((change, idx) => (
              <div
                key={idx}
                className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--color-card-border)' }}
              >
                <div>
                  <span className="font-bold mr-2" style={{ color: 'var(--color-text-primary)' }}>{change.date}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{change.description}</span>
                </div>
                <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                  {change.source}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Standard */}
        <div className="pt-2 text-[11px] border-t leading-relaxed" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}>
          <strong>Aviso de escopo:</strong> A exibição deste domínio e seu status factual são baseados nas informações públicas acessíveis na última janela de consulta. BetLegal não atua como órgão certificador, operadora ou afiliada.
        </div>

      </GlassCard>

    </div>
  );
};
