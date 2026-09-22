import React, { useState } from 'react';
import { BetEntity } from '../types';
import { Terminal, Copy, Check, Play, Code, BookOpen, Layers, Key } from 'lucide-react';

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
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Terminal className="w-4 h-4" />
          Infraestrutura Pública B2B & Pesquisa
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Documentação da API Pública BetLegal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
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
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedEndpoint(item.id as any);
              setResponseJson(null);
            }}
            className={`p-3 rounded border text-left cursor-pointer transition-colors ${
              selectedEndpoint === item.id
                ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white border-[#0B1F33] dark:border-[#1F5FD1]'
                : 'bg-white dark:bg-[#0D1B2A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 mr-1.5">
              {item.method}
            </span>
            <span className="font-semibold block mt-1">{item.label}</span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 block truncate">{item.path}</span>
          </button>
        ))}
      </div>

      {/* Interactive Playground & Spec Box */}
      <div className="bg-white dark:bg-[#0D1B2A] border-2 border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-6 transition-colors">
        
        {/* Endpoint path title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              GET
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {selectedEndpoint === 'check' ? `/v1/check/{host}` : `/v1/${selectedEndpoint}`}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Rate-limit: 120 req/min (sem chave)
          </span>
        </div>

        {/* Dynamic Parameter Input */}
        {selectedEndpoint === 'check' && (
          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Parâmetro de Consulta: <span className="font-mono text-[#1F5FD1] dark:text-sky-400">host</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                placeholder="Ex: betano.bet.br"
                className="flex-1 p-2 font-mono text-xs bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded focus:outline-none focus:border-[#1F5FD1]"
              />
              <button
                onClick={handleRunRequest}
                className="px-4 py-2 bg-[#1F5FD1] hover:bg-[#184ebd] text-white font-semibold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
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
              className="px-4 py-2 bg-[#1F5FD1] hover:bg-[#184ebd] text-white font-semibold rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Executar Requisição de Teste
            </button>
          </div>
        )}

        {/* cURL Example */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Comando cURL</span>
            <button
              onClick={handleCopyCurl}
              className="hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCurl ? 'Copiado' : 'Copiar comando'}
            </button>
          </div>
          <pre className="bg-[#0B1F33] dark:bg-[#081320] text-emerald-400 dark:text-emerald-300 p-4 rounded text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            {getCurlSnippet()}
          </pre>
        </div>

        {/* JSON Response Window */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Resposta JSON (Content-Type: application/json)</span>
            {responseJson && (
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">Status HTTP 200 OK</span>
            )}
          </div>
          <div className="bg-[#0B1F33] dark:bg-[#081320] text-slate-100 p-4 rounded text-xs font-mono min-h-[160px] overflow-x-auto border border-slate-800">
            {runLoading ? (
              <div className="text-slate-400 animate-pulse">Executando requisição ao cluster de dados...</div>
            ) : responseJson ? (
              <pre className="text-emerald-300 leading-relaxed">{responseJson}</pre>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 italic">
                Clique em "Testar Endpoint" ou "Executar Requisição" para simular a resposta em tempo real.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
