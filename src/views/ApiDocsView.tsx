import React, { useState } from 'react';
import { BetEntity } from '../types';
import { Terminal, Copy, Check, Play } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

interface ApiDocsViewProps {
  entities: BetEntity[];
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ entities }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'check' | 'operators' | 'blocked' | 'diff'>('check');
  const [testDomain, setTestDomain] = useState('betano.bet.br');
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<string | null>(null);

  const getCurlSnippet = () => {
    switch (selectedEndpoint) {
      case 'check':
        return `curl -X GET "https://api.betlegal.com.br/v1/check/${testDomain}" \\\n  -H "Accept: application/json" \\\n  -H "X-BetLegal-Source: public-research"`;
      case 'operators':
        return `curl -X GET "https://api.betlegal.com.br/v1/operators?sphere=federal&limit=20" \\\n  -H "Accept: application/json"`;
      case 'blocked':
        return `curl -X GET "https://api.betlegal.com.br/v1/radar/blocked?limit=50" \\\n  -H "Accept: application/json"`;
      case 'diff':
        return `curl -X GET "https://api.betlegal.com.br/v1/diff?since=2026-09-01" \\\n  -H "Accept: application/json"`;
    }
  };

  const handleRunRequest = () => {
    setRunLoading(true);
    setResponseJson(null);

    setTimeout(() => {
      setRunLoading(false);
      if (selectedEndpoint === 'check') {
        const found = entities.find(e => e.domains.some(d => d.host.toLowerCase() === testDomain.toLowerCase()));
        if (found) {
          setResponseJson(JSON.stringify({
            status: "success",
            timestamp: new Date().toISOString(),
            data: {
              host: testDomain,
              regulatoryStatus: found.status,
              publicText: found.statusText,
              legalName: found.legalName,
              cnpj: found.cnpj,
              sphere: found.sphere,
              sigapProtocol: found.sigapProtocol || null,
              officialSource: found.officialSource,
              verifiedAt: found.verifiedAt,
              liveness: found.domains[0]?.liveness || "ONLINE",
              cloneRiskNotice: found.cloneRiskNotice || null
            }
          }, null, 2));
        } else {
          setResponseJson(JSON.stringify({
            status: "success",
            timestamp: new Date().toISOString(),
            data: {
              host: testDomain,
              regulatoryStatus: "NAO_AUTORIZADA_DETECTADA",
              publicText: "Não consta nas listas de autorização consultadas",
              legalName: null,
              cnpj: null,
              sphere: "nenhuma",
              officialSource: "Bases públicas vigentes",
              liveness: "OFFLINE",
              cloneRiskNotice: "Domínio não localizado nos registros do SIGAP/SPA"
            }
          }, null, 2));
        }
      } else if (selectedEndpoint === 'operators') {
        const federalList = entities.filter(e => e.sphere === 'federal').map(e => ({
          brand: e.brandName,
          legalName: e.legalName,
          cnpj: e.cnpj,
          primaryDomain: e.domains[0]?.host,
          sigap: e.sigapProtocol
        }));
        setResponseJson(JSON.stringify({
          status: "success",
          total: federalList.length,
          data: federalList
        }, null, 2));
      } else if (selectedEndpoint === 'blocked') {
        const blockedList = entities.filter(e => e.status === 'BLOQUEADA_ANATEL').map(e => ({
          host: e.domains[0]?.host,
          orderSource: "Ofício SPA/MF encaminhado à Anatel",
          blockStatus: "SINKHOLED"
        }));
        setResponseJson(JSON.stringify({
          status: "success",
          totalOrders: 2954,
          sample: blockedList
        }, null, 2));
      } else {
        setResponseJson(JSON.stringify({
          status: "success",
          timeWindow: "12:00 BRT",
          recentChangesCount: 5,
          notice: "Diffs consolidados a cada 6 horas"
        }, null, 2));
      }
    }, 350);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet() || '');
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <AmbientGlow />

      {/* Title */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1 flex items-center gap-1.5" style={{ color: 'var(--status-dado-declarado)' }}>
          <Terminal className="w-4 h-4" />
          Infraestrutura Pública B2B & Pesquisa
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Documentação da API Pública BetLegal
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          Acesso padronizado para redações jornalísticas, equipes de compliance, pesquisadores acadêmicos e ferramentas de cibersegurança.
        </p>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { id: 'check', method: 'GET', path: '/v1/check/{host}', label: 'Verificar Host' },
          { id: 'operators', method: 'GET', path: '/v1/operators', label: 'Lista de Operadores' },
          { id: 'blocked', method: 'GET', path: '/v1/radar/blocked', label: 'Bloqueios Anatel' },
          { id: 'diff', method: 'GET', path: '/v1/diff', label: 'Eventos & Diffs' },
        ].map((item) => {
          const active = selectedEndpoint === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedEndpoint(item.id as any);
                setResponseJson(null);
              }}
              className="p-3 rounded border text-left cursor-pointer transition-colors hover:bg-white/5"
              style={{
                backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
                borderColor: active ? 'var(--status-dado-declarado)' : 'var(--color-card-border)',
                color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
              }}
            >
              <span
                className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5"
                style={{
                  backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'color-mix(in srgb, var(--status-dado-declarado) 12%, transparent)',
                  color: active ? 'var(--color-bg)' : 'var(--status-dado-declarado)',
                }}
              >
                {item.method}
              </span>
              <span className="font-semibold block mt-1">{item.label}</span>
              <span className="font-mono text-[11px] block truncate" style={{ color: active ? 'var(--color-bg)' : 'var(--color-text-tertiary)', opacity: active ? 0.8 : 1 }}>{item.path}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Playground & Spec Box */}
      <GlassCard className="p-6 space-y-6">

        {/* Endpoint path title */}
        <div className="flex items-center justify-between pb-3 border-b flex-wrap gap-2" style={{ borderColor: 'var(--color-card-border)' }}>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
              style={{ color: 'var(--status-autorizada)', borderColor: 'var(--status-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-autorizada) 10%, transparent)' }}
            >
              GET
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {selectedEndpoint === 'check' ? `/v1/check/{host}` : `/v1/${selectedEndpoint}`}
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            Rate-limit: 120 req/min (sem chave)
          </span>
        </div>

        {/* Dynamic Parameter Input */}
        {selectedEndpoint === 'check' && (
          <div className="space-y-1 text-xs">
            <label className="font-semibold block" style={{ color: 'var(--color-text-secondary)' }}>
              Parâmetro de Consulta: <span className="font-mono" style={{ color: 'var(--status-dado-declarado)' }}>host</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                placeholder="Ex: betano.bet.br"
                className="flex-1 p-2 font-mono text-xs rounded focus:outline-none border bg-transparent"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              />
              <button
                onClick={handleRunRequest}
                className="px-4 py-2 font-semibold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                <Play className="w-3.5 h-3.5" />
                Testar Endpoint
              </button>
            </div>
          </div>
        )}

        {selectedEndpoint !== 'check' && (
          <div className="flex justify-end">
            <button
              onClick={handleRunRequest}
              className="px-4 py-2 font-semibold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              <Play className="w-3.5 h-3.5" />
              Executar Requisição de Teste
            </button>
          </div>
        )}

        {/* cURL Example — terminal fixo escuro independente do tema */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Comando cURL</span>
            <button
              onClick={handleCopyCurl}
              className="hover:opacity-80 inline-flex items-center gap-1 font-medium cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5" style={{ color: '#34A871' }} /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCurl ? 'Copiado' : 'Copiar comando'}
            </button>
          </div>
          <pre className="p-4 rounded text-xs font-mono overflow-x-auto leading-relaxed" style={{ backgroundColor: '#0A0A0A', color: '#34A871', border: '1px solid rgba(255,255,255,0.14)' }}>
            {getCurlSnippet()}
          </pre>
        </div>

        {/* JSON Response Window */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>Resposta JSON (Content-Type: application/json)</span>
            {responseJson && (
              <span className="font-mono font-medium" style={{ color: '#34A871' }}>Status HTTP 200 OK</span>
            )}
          </div>
          <div className="p-4 rounded text-xs font-mono min-h-[160px] overflow-x-auto" style={{ backgroundColor: '#0A0A0A', color: '#E5E5E5', border: '1px solid rgba(255,255,255,0.14)' }}>
            {runLoading ? (
              <div className="animate-pulse" style={{ color: '#A3A3A3' }}>Executando requisição ao cluster de dados...</div>
            ) : responseJson ? (
              <pre className="leading-relaxed" style={{ color: '#5FD39E' }}>{responseJson}</pre>
            ) : (
              <div className="italic" style={{ color: '#A3A3A3' }}>
                Clique em "Testar Endpoint" ou "Executar Requisição" para simular a resposta em tempo real.
              </div>
            )}
          </div>
        </div>

      </GlassCard>

    </div>
  );
};
