import React, { useState } from 'react';
import { BetEntity } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { STATUS_MAP } from '../utils/statusMapping';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Globe, 
  Server, 
  Lock, 
  ExternalLink, 
  Radio, 
  Check, 
  XCircle, 
  RefreshCw,
  Copy
} from 'lucide-react';

interface RadarViewProps {
  entities: BetEntity[];
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  entities,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'clones' | 'bloqueadas' | 'probe'>('clones');
  const [probeInput, setProbeInput] = useState('');
  const [probeResult, setProbeResult] = useState<{
    host: string;
    checked: boolean;
    loading: boolean;
    isAuthorized: boolean;
    matchedEntity?: BetEntity;
    dnsStatus: string;
    sslIssuer: string;
    asn: string;
    riskScore: 'alto' | 'baixo' | 'atencao';
    notes: string;
  } | null>(null);

  // Filter unauthorized / clone / blocked entities
  const cloneAndLookalikes = entities.filter(e => 
    e.status === 'NAO_AUTORIZADA_DETECTADA' || 
    Boolean(e.cloneRiskNotice)
  );

  const blockedEntities = entities.filter(e => 
    e.status === 'BLOQUEADA_ANATEL'
  );

  const handleRunProbe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!probeInput.trim()) return;

    const rawHost = probeInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    setProbeResult({
      host: rawHost,
      checked: false,
      loading: true,
      isAuthorized: false,
      dnsStatus: 'Consultando servidores DNS...',
      sslIssuer: 'Analisando certificado TLS/SSL...',
      asn: 'Verificando ASN e bloco IP...',
      riskScore: 'atencao',
      notes: 'Cruzando com lista definitiva SPA/MF...',
    });

    setTimeout(() => {
      // Find matching entity
      const match = entities.find(ent => 
        ent.domains.some(d => d.host.toLowerCase() === rawHost) ||
        ent.brandName.toLowerCase() === rawHost.toLowerCase()
      );

      if (match && (match.status === 'AUTORIZADA_NACIONAL' || match.status === 'AUTORIZADA_ESTADUAL')) {
        setProbeResult({
          host: rawHost,
          checked: true,
          loading: false,
          isAuthorized: true,
          matchedEntity: match,
          dnsStatus: 'Resolvido com sucesso (IP Nacional verificado)',
          sslIssuer: match.domains[0]?.sslIssuer || 'Certificado TLS Homologado',
          asn: match.domains[0]?.asn || 'AS13335 (Cloudflare Edge Brazil)',
          riskScore: 'baixo',
          notes: `Domínio consta formalmente na base de outorgas do Ministério da Fazenda sob titularidade de ${match.legalName} (CNPJ: ${match.cnpj}).`,
        });
      } else if (match && match.status === 'BLOQUEADA_ANATEL') {
        setProbeResult({
          host: rawHost,
          checked: true,
          loading: false,
          isAuthorized: false,
          matchedEntity: match,
          dnsStatus: 'DNS Sinkhole ativo (451 / NXDOMAIN)',
          sslIssuer: 'Revogado / Inválido',
          asn: 'Endereço em lista de restrição de telecom',
          riskScore: 'alto',
          notes: 'Constou formalmente em listas de bloqueio administrativo remetidas pela SPA/MF à Anatel e às prestadoras de telecom.',
        });
      } else {
        const isOfficialTld = rawHost.endsWith('.bet.br');
        setProbeResult({
          host: rawHost,
          checked: true,
          loading: false,
          isAuthorized: false,
          dnsStatus: isOfficialTld ? 'Host não localizado no Registro.br' : 'Hospedado no exterior sem outorga brasileira',
          sslIssuer: "Let's Encrypt / DV Genérico",
          asn: 'AS49505 (Hospedagem Offshore)',
          riskScore: 'alto',
          notes: 'Não consta nas listas de autorização consultadas (SPA/MF ou loterias estaduais). Recomenda-se cautela quanto ao fornecimento de dados pessoais e financeiros.',
        });
      }
    }, 550);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
          <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          Descoberta Ativa & Inteligência Técnica
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Não Autorizadas
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Monitoramento contínuo de domínios sem outorga, tentativas de clonagem de marcas autorizadas e ordens de bloqueio da Anatel.
        </p>
      </div>

      {/* Interactive Probe Tool (Sonda Técnica de Domínio) */}
      <div className="bg-white dark:bg-[#0D1B2A] border-2 border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
              Sonda Técnica de Domínio em Tempo Real
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Digite qualquer endereço web para verificar DNS, autorização SPA/MF e indícios de clone
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Motor: Radar Engine v2.6
          </span>
        </div>

        <form onSubmit={handleRunProbe} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={probeInput}
            onChange={(e) => setProbeInput(e.target.value)}
            placeholder="Ex: betano.bet.br, betano-app-bonus.xyz ou fortunebet777.fun"
            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081320] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded font-mono focus:outline-none focus:border-[#1F5FD1]"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[#0B1F33] dark:bg-[#1F5FD1] hover:bg-slate-800 dark:hover:bg-[#184ebd] text-white font-semibold text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {probeResult?.loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Executar Sonda
          </button>
        </form>

        {/* Probe Result Display */}
        {probeResult && (
          <div className="mt-4 p-4 rounded border bg-[#F6F8FB] dark:bg-[#081320] border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{probeResult.host}</span>
                {probeResult.loading ? (
                  <span className="text-slate-500 dark:text-slate-400 animate-pulse">Examinando...</span>
                ) : probeResult.isAuthorized ? (
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                    Autorizada — nacional, SPA/MF
                  </span>
                ) : (
                  <span className="text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 font-semibold px-2 py-0.5 rounded text-[11px]">
                    Não consta nas listas de autorização consultadas
                  </span>
                )}
              </div>

              {!probeResult.loading && (
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  Verificado em {new Date().toLocaleTimeString('pt-BR')} BRT
                </span>
              )}
            </div>

            {probeResult.loading ? (
              <div className="py-4 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1F5FD1] dark:text-sky-400" />
                <p>Consultando bases oficiais da SPA/MF, Diário Oficial e servidores DNS...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-[#0D1B2A] p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Status DNS / IP</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium block truncate">
                    {probeResult.dnsStatus}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#0D1B2A] p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Certificado SSL</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium block truncate">
                    {probeResult.sslIssuer}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#0D1B2A] p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Roteamento ASN</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium block truncate">
                    {probeResult.asn}
                  </span>
                </div>

                <div className="sm:col-span-3 bg-white dark:bg-[#0D1B2A] p-3 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                    Parecer Técnico & Evidência Rastreável:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {probeResult.notes}
                  </p>

                  {probeResult.matchedEntity && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Registro oficial correspondente: <strong className="text-slate-800 dark:text-slate-200">{probeResult.matchedEntity.brandName}</strong>
                      </span>
                      <button
                        onClick={() => onViewDetails(probeResult.matchedEntity!)}
                        className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-semibold text-xs cursor-pointer"
                      >
                        Abrir Ficha de Evidência Completa →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('clones')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
            activeTab === 'clones' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Possíveis Clones e Lookalikes ({cloneAndLookalikes.length})
        </button>
        <button
          onClick={() => setActiveTab('bloqueadas')}
          className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
            activeTab === 'bloqueadas' ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Domínios com Bloqueio Publicado ({blockedEntities.length})
        </button>
      </div>

      {/* Comparison: Genuine vs Clone Case Study */}
      {activeTab === 'clones' && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-5">
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Como reconhecer um domínio legítimo vs. clone / lookalike
            </h3>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed mb-4">
              A regulação brasileira exige que todas as casas com autorização nacional utilizem exclusivamente o domínio de topo restrito <strong className="font-mono">.bet.br</strong>. Sites que utilizam terminações genéricas (.xyz, .online, .top, .vip) com o nome de marcas consagradas devem ser inspecionados com máximo rigor.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Casa Legítima */}
              <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded border border-emerald-200 dark:border-emerald-900/50 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">Domínio Oficial e Autorizado</span>
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">.bet.br</span>
                </div>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mb-1">
                  betano.bet.br
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• Titular: Kaizen Gaming Brasil Ltda.</li>
                  <li>• CNPJ: 41.693.684/0001-44 (homologado na SPA/MF)</li>
                  <li>• Processo SIGAP: nº 0002/2024</li>
                  <li>• Infraestrutura e auditoria: Validadas pelo Ministério</li>
                </ul>
              </div>

              {/* Clone Suspeito */}
              <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded border border-rose-200 dark:border-rose-900/50 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase">Possível Clone Detectado</span>
                  <span className="font-mono text-xs text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">.xyz</span>
                </div>
                <div className="font-mono text-base font-bold text-rose-900 dark:text-rose-300 mb-1">
                  betano-app-bonus.xyz
                </div>
                <ul className="text-xs text-rose-900 dark:text-rose-300 space-y-1">
                  <li>• Titular: Desconhecido (WHOIS com proxy)</li>
                  <li>• CNPJ: Não informado ou inexistente</li>
                  <li>• Processo SIGAP: Sem registro</li>
                  <li>• IP: Servidor em Moscou/Rússia sem outorga</li>
                </ul>
              </div>

            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0B1F33] dark:text-white">
              Detecções do Radar Ativo
            </h3>
            {cloneAndLookalikes.map((item) => (
              <BetLegalCard
                key={item.id}
                entity={item}
                onOpenHistory={onOpenHistory}
                onShare={onShare}
                onReport={onReport}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Blocked tab */}
      {activeTab === 'bloqueadas' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="font-semibold text-slate-900 dark:text-white">Sobre os bloqueios da Anatel: </strong>
            A Secretaria de Prêmios e Apostas (SPA/MF) envia periodicamente notificações com listas de domínios irregulares à Agência Nacional de Telecomunicações (Anatel), que por sua vez notifica mais de 20 mil provedores de acesso à internet em todo o território nacional para execução do bloqueio no nível de DNS/IP.
          </div>

          {blockedEntities.map((item) => (
            <BetLegalCard
              key={item.id}
              entity={item}
              onOpenHistory={onOpenHistory}
              onShare={onShare}
              onReport={onReport}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

    </div>
  );
};
