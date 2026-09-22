import React, { useState } from 'react';
import { BetEntity, DomainInfo } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2, 
  AlertCircle, 
  ShieldCheck, 
  Server, 
  Lock, 
  History, 
  FileText, 
  Globe, 
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0B1F33] dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para listagem
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare(entity, currentDomain.host)}
            className="px-3 py-1.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#1F5FD1] dark:text-sky-400" />
            Compartilhar Card Factual
          </button>
          <button
            onClick={() => onReport(entity, currentDomain.host)}
            className="px-3 py-1.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 rounded text-xs font-medium text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Reportar Contestação
          </button>
        </div>
      </div>

      {/* Main Header File Card */}
      <div className="bg-white dark:bg-[#0D1B2A] border-2 border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
        
        {/* Title & Status */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Ficha Técnica de Evidência e Rastreabilidade
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F33] dark:text-white tracking-tight font-mono">
                {currentDomain.host}
              </h1>
              <button
                onClick={handleCopyHost}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copiar domínio"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Marca comercial: <strong className="text-slate-900 dark:text-white">{entity.brandName}</strong>
            </div>
          </div>

          <div className="md:text-right space-y-1">
            <div className="inline-block px-3.5 py-1.5 rounded text-xs sm:text-sm font-bold tracking-wide uppercase border border-slate-200 dark:border-slate-700">
              <span className={statusInfo.badgeClass.split(' ')[0]}>
                {statusInfo.publicText.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Verificado em {entity.verifiedAt} às {entity.lastCheckedTime}
            </div>
          </div>
        </div>

        {/* Clone Alert notice if any */}
        {entity.cloneRiskNotice && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded text-xs text-rose-900 dark:text-rose-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Aviso de Risco / Lookalike:</strong>
              <p className="mt-0.5 leading-relaxed">{entity.cloneRiskNotice}</p>
            </div>
          </div>
        )}

        {/* Grid de Dados Cadastrais e Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Col 1: Dados Regulatórios & Jurídicos */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
              Dados Cadastrais & Regulatórios
            </h3>

            <div className="bg-[#F6F8FB] dark:bg-[#081320] p-4 rounded border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Razão Social do Operador</span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{entity.legalName}</span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">CNPJ</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 text-sm font-medium">{entity.cnpj}</span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Esfera Regulamentar</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {entity.sphere === 'federal' ? 'Federal (Secretaria de Prêmios e Apostas - SPA/MF)' : entity.stateJurisdiction || 'Sem registro'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Protocolo / Portaria</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                  {entity.portariaNumber || entity.sigapProtocol || 'Não informado'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Fonte Oficial</span>
                <a
                  href={entity.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  {entity.officialSource}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Auditoria Técnica (Liveness, DNS & SSL) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#0B7A75] dark:text-teal-400" />
              Sonda Técnica e Infraestrutura
            </h3>

            <div className="bg-[#F6F8FB] dark:bg-[#081320] p-4 rounded border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Disponibilidade (Liveness)</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${currentDomain.liveness === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className={`font-semibold ${livenessInfo.textClass}`}>
                    {livenessInfo.label} (HTTP {currentDomain.httpCode})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Endereço IP & Provedor ASN</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium block">
                  {currentDomain.ipAddress || 'Não resolvido'}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono block">
                  {currentDomain.asn || 'Sem ASN'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Certificado SSL / TLS</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                  Emissor: {currentDomain.sslIssuer || 'N/A'}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                  Válido até: {currentDomain.sslValidUntil || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Hospedagem & Infraestrutura</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {currentDomain.hostingProvider || 'Informação não divulgada'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Histórico Temporal e Diff */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
            Linha do Tempo e Modificações Averbas
          </h3>

          <div className="border border-slate-200 dark:border-slate-800 rounded divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
            {entity.historicalChanges.map((change, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-[#081320] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white mr-2">{change.date}</span>
                  <span className="text-slate-700 dark:text-slate-300">{change.description}</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] shrink-0">
                  {change.source}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Standard */}
        <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
          <strong>Aviso de escopo:</strong> A exibição deste domínio e seu status factual são baseados nas informações públicas acessíveis na última janela de consulta. BetLegal não atua como órgão certificador, operadora ou afiliada.
        </div>

      </div>

    </div>
  );
};
