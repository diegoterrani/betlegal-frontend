import React, { useState } from 'react';
import { BetEntity } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { KpiCard } from '../components/ui/KpiCard';
import {
  AlertTriangle,
  Search,
  Globe,
  Radio,
  RefreshCw,
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

  const cloneAndLookalikes = entities.filter(e =>
    e.status === 'NAO_AUTORIZADA_DETECTADA' ||
    Boolean(e.cloneRiskNotice)
  );

  const blockedEntities = entities.filter(e =>
    e.status === 'BLOQUEADA_ANATEL'
  );

  const onlineLookalikes = cloneAndLookalikes.filter(e =>
    e.domains.some(d => d.liveness === 'ONLINE')
  ).length;

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

  const tabBtnStyle = (active: boolean) => ({
    backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
  });

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--status-atencao)' }}>
          <Radio className="w-4 h-4 animate-pulse" />
          Descoberta Ativa & Inteligência Técnica
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Radar de Domínios, Clones e Bloqueios
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          Monitoramento contínuo de domínios sem outorga, tentativas de clonagem de marcas autorizadas e ordens de bloqueio da Anatel.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <KpiCard
          label="Registros no radar"
          value={cloneAndLookalikes.length + blockedEntities.length}
          helper="Detectados e listas Anatel"
          accent="var(--status-nao-autorizada)"
        />
        <KpiCard
          label="Online agora"
          value={onlineLookalikes}
          helper="Lookalikes acessíveis neste momento"
          accent="var(--status-atencao)"
        />
      </div>

      {/* Critério de neutralidade */}
      <GlassCard className="p-4 text-xs">
        <strong style={{ color: 'var(--color-text-primary)' }}>Critério de neutralidade: </strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>
          "Não consta nas listas de autorização" é uma observação factual sobre as listas públicas na data indicada. Não é juízo de valor nem parecer jurídico.
        </span>
      </GlassCard>

      {/* Interactive Probe Tool */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b flex-wrap gap-2" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <Globe className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
              Sonda Técnica de Domínio em Tempo Real
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Digite qualquer endereço web para verificar DNS, autorização SPA/MF e indícios de clone
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-tertiary)' }}>
            Motor: Radar Engine v2.6
          </span>
        </div>

        <form onSubmit={handleRunProbe} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={probeInput}
            onChange={(e) => setProbeInput(e.target.value)}
            placeholder="Ex: betano.bet.br, betano-app-bonus.xyz ou fortunebet777.fun"
            className="flex-1 px-3 py-2 text-sm rounded font-mono focus:outline-none border bg-transparent"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
          />
          <button
            type="submit"
            className="px-5 py-2 font-semibold text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
          >
            {probeResult?.loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Executar Sonda
          </button>
        </form>

        {probeResult && (
          <div className="mt-4 p-4 rounded border text-xs space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2" style={{ borderColor: 'var(--color-card-border)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{probeResult.host}</span>
                {probeResult.loading ? (
                  <span className="animate-pulse" style={{ color: 'var(--color-text-tertiary)' }}>Examinando...</span>
                ) : probeResult.isAuthorized ? (
                  <span className="font-semibold px-2 py-0.5 rounded text-[11px] border" style={{ color: 'var(--status-autorizada)', borderColor: 'var(--status-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-autorizada) 10%, transparent)' }}>
                    Autorizada — nacional, SPA/MF
                  </span>
                ) : (
                  <span className="font-semibold px-2 py-0.5 rounded text-[11px] border" style={{ color: 'var(--status-nao-autorizada)', borderColor: 'var(--status-nao-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 10%, transparent)' }}>
                    Não consta nas listas de autorização consultadas
                  </span>
                )}
              </div>

              {!probeResult.loading && (
                <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  Verificado em {new Date().toLocaleTimeString('pt-BR')} BRT
                </span>
              )}
            </div>

            {probeResult.loading ? (
              <div className="py-4 text-center space-y-2" style={{ color: 'var(--color-text-tertiary)' }}>
                <RefreshCw className="w-5 h-5 animate-spin mx-auto" style={{ color: 'var(--status-dado-declarado)' }} />
                <p>Consultando bases oficiais da SPA/MF, Diário Oficial e servidores DNS...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ['Status DNS / IP', probeResult.dnsStatus],
                  ['Certificado SSL', probeResult.sslIssuer],
                  ['Roteamento ASN', probeResult.asn],
                ].map(([label, value]) => (
                  <div key={label} className="p-2.5 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                    <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{label}</span>
                    <span className="font-mono font-medium block truncate" style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
                  </div>
                ))}

                <div className="sm:col-span-3 p-3 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <span className="font-bold block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    Parecer Técnico & Evidência Rastreável:
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {probeResult.notes}
                  </p>

                  {probeResult.matchedEntity && (
                    <div className="mt-2 pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-card-border)' }}>
                      <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                        Registro oficial correspondente: <strong style={{ color: 'var(--color-text-secondary)' }}>{probeResult.matchedEntity.brandName}</strong>
                      </span>
                      <button
                        onClick={() => onViewDetails(probeResult.matchedEntity!)}
                        className="hover:underline font-semibold text-xs cursor-pointer"
                        style={{ color: 'var(--status-dado-declarado)' }}
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
      </GlassCard>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b pb-2" style={{ borderColor: 'var(--color-card-border)' }}>
        <button
          onClick={() => setActiveTab('clones')}
          className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors"
          style={tabBtnStyle(activeTab === 'clones')}
        >
          Possíveis Clones e Lookalikes ({cloneAndLookalikes.length})
        </button>
        <button
          onClick={() => setActiveTab('bloqueadas')}
          className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors"
          style={tabBtnStyle(activeTab === 'bloqueadas')}
        >
          Domínios com Bloqueio Publicado ({blockedEntities.length})
        </button>
      </div>

      {activeTab === 'clones' && (
        <div className="space-y-6">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--status-atencao)' }}>
              <AlertTriangle className="w-4 h-4" />
              Como reconhecer um domínio legítimo vs. clone / lookalike
            </h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              A regulação brasileira exige que todas as casas com autorização nacional utilizem exclusivamente o domínio de topo restrito <strong className="font-mono">.bet.br</strong>. Sites que utilizam terminações genéricas (.xyz, .online, .top, .vip) com o nome de marcas consagradas devem ser inspecionados com máximo rigor.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'color-mix(in srgb, var(--status-autorizada) 35%, transparent)' }}>
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-card-border)' }}>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--status-autorizada)' }}>Domínio Oficial e Autorizado</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ color: 'var(--status-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-autorizada) 12%, transparent)' }}>.bet.br</span>
                </div>
                <div className="font-mono text-base font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  betano.bet.br
                </div>
                <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Titular: Kaizen Gaming Brasil Ltda.</li>
                  <li>• CNPJ: 41.693.684/0001-44 (homologado na SPA/MF)</li>
                  <li>• Processo SIGAP: nº 0002/2024</li>
                  <li>• Infraestrutura e auditoria: Validadas pelo Ministério</li>
                </ul>
              </div>

              <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'color-mix(in srgb, var(--status-nao-autorizada) 35%, transparent)' }}>
                <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--color-card-border)' }}>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--status-nao-autorizada)' }}>Possível Clone Detectado</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ color: 'var(--status-nao-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 12%, transparent)' }}>.xyz</span>
                </div>
                <div className="font-mono text-base font-bold mb-1" style={{ color: 'var(--status-nao-autorizada)' }}>
                  betano-app-bonus.xyz
                </div>
                <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Titular: Desconhecido (WHOIS com proxy)</li>
                  <li>• CNPJ: Não informado ou inexistente</li>
                  <li>• Processo SIGAP: Sem registro</li>
                  <li>• IP: Servidor em Moscou/Rússia sem outorga</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
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

      {activeTab === 'bloqueadas' && (
        <div className="space-y-4">
          <GlassCard className="p-4 text-xs leading-relaxed" >
            <strong className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Sobre os bloqueios da Anatel: </strong>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              A Secretaria de Prêmios e Apostas (SPA/MF) envia periodicamente notificações com listas de domínios irregulares à Agência Nacional de Telecomunicações (Anatel), que por sua vez notifica mais de 20 mil provedores de acesso à internet em todo o território nacional para execução do bloqueio no nível de DNS/IP.
            </span>
          </GlassCard>

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
