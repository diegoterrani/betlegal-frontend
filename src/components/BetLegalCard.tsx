import React, { useState } from 'react';
import { BetEntity, DomainInfo } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { 
  ExternalLink, 
  Share2, 
  History, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Server, 
  Lock, 
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
    <article 
      className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors relative"
      aria-label={`Ficha de verificação: ${entity.brandName} - ${primaryDomain.host}`}
    >
      {/* 1. CABEÇALHO PADRÃO BETLEGAL (Page 14 Brand Book) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          {/* Identidade: Marca */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              onClick={() => onViewDetails ? onViewDetails(entity) : null}
              className={`text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F33] dark:text-white ${onViewDetails ? 'hover:text-[#1F5FD1] dark:hover:text-[#3B82F6] cursor-pointer' : ''}`}
            >
              {entity.brandName.toUpperCase()}
            </h3>

            {entity.tradeNames && entity.tradeNames.length > 1 && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                (Grupo / Marcas: {entity.tradeNames.join(', ')})
              </span>
            )}
          </div>

          {/* Domínio com botão de cópia rápida */}
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
              {primaryDomain.host}
            </span>
            <button
              onClick={(e) => handleCopyDomain(primaryDomain.host, e)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1 rounded transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Copiar domínio"
              aria-label="Copiar domínio"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedHost === primaryDomain.host && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">Copiado</span>
              )}
            </button>
          </div>
        </div>

        {/* Status Factual Padronizado (Semáforo evitado, texto claro) */}
        <div className="sm:text-right">
          <div className="inline-block px-3 py-1 rounded text-xs sm:text-sm font-semibold tracking-wide uppercase border">
            <span className={statusInfo.badgeClass.split(' ')[0]}>
              {statusInfo.publicText.toUpperCase()}
            </span>
          </div>

          {/* Linha de Metadados: Fonte + Data/Hora (Page 14) */}
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center sm:justify-end gap-1.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {entity.sphere === 'federal' ? 'SPA/MF' : entity.stateJurisdiction ? entity.stateJurisdiction : 'Base Pública'}
            </span>
            <span aria-hidden="true">·</span>
            <span>verificado {entity.verifiedAt} {entity.lastCheckedTime}</span>
          </div>
        </div>
      </div>

      {/* 2. CORPO DO CARD: EVIDÊNCIA & DADOS TÉCNICOS */}
      <div className="py-4 space-y-3.5">
        
        {/* Alerta de Clone / Risco (Se detectado) */}
        {entity.cloneRiskNotice && (
          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Atenção à evidência: </strong>
              {entity.cloneRiskNotice}
            </div>
          </div>
        )}

        {/* Resumo da Evidência Factual */}
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>{entity.evidenceSummary}</p>
        </div>

        {/* Ficha técnica em grade limpa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 text-xs">
          
          {/* Razão Social e CNPJ */}
          <div className="bg-[#F6F8FB] dark:bg-[#081320] p-2.5 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Razão Social & CNPJ</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1" title={entity.legalName}>
              {entity.legalName}
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px] block mt-0.5">
              {entity.cnpj}
            </span>
          </div>

          {/* Processo / Outorga */}
          <div className="bg-[#F6F8FB] dark:bg-[#081320] p-2.5 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Ato / Protocolo Regulatório</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium block truncate" title={entity.portariaNumber || entity.sigapProtocol}>
              {entity.sigapProtocol ? `SIGAP nº ${entity.sigapProtocol}` : entity.portariaNumber || 'Sem protocolo formal'}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5 truncate" title={entity.officialSource}>
              {entity.officialSource}
            </span>
          </div>

          {/* Liveness Técnico (Separado do status legal!) */}
          <div className="bg-[#F6F8FB] dark:bg-[#081320] p-2.5 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Sonda Técnica (Liveness)</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${primaryDomain.liveness === 'ONLINE' ? 'bg-emerald-500' : primaryDomain.liveness === 'BLOCKED_DNS' ? 'bg-red-500' : 'bg-amber-500'}`} />
              <span className={`font-medium ${livenessInfo.textClass}`}>
                {livenessInfo.label}
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5 font-mono truncate">
              {primaryDomain.ipAddress || 'DNS em análise'}
            </span>
          </div>
        </div>

        {/* Lista de domínios alternativos/secundários se houver */}
        {entity.domains.length > 1 && (
          <div className="pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Outros domínios registrados sob esta autorização:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {entity.domains.map((dom) => (
                <button
                  key={dom.host}
                  onClick={() => onSelectDomain ? onSelectDomain(dom.host) : null}
                  className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    dom.host === primaryDomain.host
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                      : 'bg-white dark:bg-[#0B1726] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {dom.host}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. BARRA DE AÇÕES OBRIGATÓRIAS (Page 14) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* Ver fonte oficial */}
          {entity.officialSourceUrl && (
            <a
              href={entity.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              Ver fonte
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Ver histórico */}
          <button
            onClick={() => onOpenHistory ? onOpenHistory(entity) : null}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            Ver histórico ({entity.historicalChanges.length})
          </button>

          {/* Ficha completa do domínio */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(entity)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Ficha detalhada
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Compartilhar */}
          <button
            onClick={() => onShare ? onShare(entity, primaryDomain.host) : null}
            className="text-slate-600 dark:text-slate-400 hover:text-[#1F5FD1] dark:hover:text-sky-400 font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title="Compartilhar verificação"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartilhar
          </button>

          {/* Reportar correção / contestação */}
          <button
            onClick={() => onReport ? onReport(entity, primaryDomain.host) : null}
            className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Reportar correção ou clone"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Reportar correção
          </button>
        </div>
      </div>
    </article>
  );
};
