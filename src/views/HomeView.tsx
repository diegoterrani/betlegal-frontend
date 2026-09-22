import React, { useState } from 'react';
import { BetEntity, RegulatoryChange } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Database, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  History,
  Terminal,
  FileCheck2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { MARKET_SERIES_DATA } from '../data/mockData';

interface HomeViewProps {
  entities: BetEntity[];
  changes: RegulatoryChange[];
  onSearchSubmit: (query: string) => void;
  onNavigate: (path: string) => void;
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  entities,
  changes,
  onSearchSubmit,
  onNavigate,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const sampleQueries = [
    { label: 'Betano', query: 'betano' },
    { label: 'Bet365', query: 'bet365' },
    { label: 'Superbet', query: 'superbet' },
    { label: 'Pixbet (Loterj)', query: 'pixbet' },
    { label: 'CNPJ 41.693.684...', query: '41.693.684/0001-44' },
    { label: 'betano-app-bonus.xyz (Clone)', query: 'betano-app-bonus.xyz' },
  ];

  // Featured entities for home showcase
  const featuredEntities = entities.slice(0, 3);
  const recentChanges = changes.slice(0, 4);

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* 1. HERO RECOMENDADO (Page 15 Brand Book) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4 sm:pt-8">
        
        {/* Brand line principal */}
        <div className="inline-block">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1F5FD1] dark:text-sky-400 uppercase">
            Plataforma Independente de Verificação
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B1F33] dark:text-white mt-2">
            BET LEGAL? <span className="text-[#1F5FD1] dark:text-[#3B82F6]">CONFERE.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Pesquise uma casa de apostas pelo nome, domínio ou CNPJ e veja status regulatório, fonte oficial, evidências e histórico.
        </p>

        {/* Unified Search Input Box */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto mt-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white dark:bg-[#0D1B2A] border-2 border-slate-300 dark:border-slate-700 focus-within:border-[#1F5FD1] dark:focus-within:border-sky-400 rounded-lg shadow-sm transition-all">
            <div className="flex items-center gap-2 px-3 w-full sm:flex-1 py-1 sm:py-0">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ex: betano.bet.br, Superbet, ou 41.693.684/0001-44"
                className="w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus:outline-none bg-transparent"
                aria-label="Pesquise por nome, domínio ou CNPJ"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#1F5FD1] hover:bg-[#184ebd] active:bg-[#143e99] dark:bg-[#1F5FD1] dark:hover:bg-[#2a6ced] text-white font-bold text-sm tracking-wide rounded-md transition-colors cursor-pointer shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F5FD1]"
            >
              CONFERIR
            </button>
          </div>
        </form>

        {/* Linha de Confiança Obrigatória (Page 15) */}
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center flex-wrap gap-2 pt-1">
          <span>Fontes públicas</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span>Atualização recorrente</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Sem afiliados</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Sem bônus</span>
        </div>

        {/* Exemplos de busca rápida */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium mr-1 text-slate-600 dark:text-slate-300">Consultas frequentes:</span>
          {sampleQueries.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setSearchInput(item.query);
                onSearchSubmit(item.query);
              }}
              className="px-2.5 py-1 bg-white dark:bg-[#0D1B2A] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded text-xs transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. COMO FUNCIONA (Page 15: Consultar → Cruzar → Mostrar) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 transition-colors">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1F5FD1] dark:text-sky-400 mb-1">
            Metodologia Transparente
          </div>
          <h2 className="text-2xl font-bold text-[#0B1F33] dark:text-white mb-6">
            Como funciona a checagem no BetLegal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Passo 1 */}
            <div className="space-y-2 p-4 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#1F5FD1] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                  01
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Consultar</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Varredura contínua nas 4 janelas diárias de fontes primárias: Diário Oficial da União, SIGAP/SPA, despachos de autorização e loterias estaduais.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="space-y-2 p-4 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#1F5FD1] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                  02
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Cruzar</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Validação cadastral de CNPJ na Receita Federal, verificação de zona .bet.br no Registro.br, testes de conectividade técnica (liveness) e histórico.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="space-y-2 p-4 bg-[#F6F8FB] dark:bg-[#081320] rounded border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#1F5FD1] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                  03
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Mostrar</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Apresentação no formato do <strong>BetLegal Card</strong>: status factual, nome do órgão, data/hora da sonda e link direto para a fonte oficial.
              </p>
            </div>
          </div>

          {/* Principle quote from Page 3 */}
          <div className="mt-6 p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong className="font-semibold">Princípio de precisão editorial: </strong>
              <em>“Legal é a pergunta. Evidência é a resposta.”</em> Mostramos o que consta — ou não consta — nas fontes oficiais.
            </div>
            <button
              onClick={() => onNavigate('/metodologia')}
              className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
            >
              Ver metodologia completa
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. VERIFICAÇÕES EM DESTAQUE (BetLegal Card showcase) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33] dark:text-white">
              Consultas e Verificações Recentes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fichas de evidência atualizadas na janela operacional de hoje
            </p>
          </div>
          <button
            onClick={() => onNavigate('/busca')}
            className="text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todas as casas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {featuredEntities.map((item) => (
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
      </section>

      {/* 4. ÚLTIMAS MUDANÇAS & RADAR DE CLONES (Page 15) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Coluna 1: Últimas Mudanças Regulatórias */}
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-[#0B1F33] dark:text-white text-base flex items-center gap-2">
                <History className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
                Últimas Mudanças Regulatórias
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Eventos e diff temporal das listas oficiais</p>
            </div>
            <button
              onClick={() => onNavigate('/mudancas')}
              className="text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline cursor-pointer"
            >
              Ver diffs
            </button>
          </div>

          <div className="space-y-3">
            {recentChanges.map((chg) => (
              <div key={chg.id} className="p-3 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{chg.brandName}</span>
                  <span className="font-mono">{chg.date} {chg.time}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-snug">{chg.summary}</p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  Fonte: <span className="text-slate-700 dark:text-slate-200 font-medium">{chg.sourceDoc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 2: Radar & Descoberta Ativa */}
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-[#0B1F33] dark:text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Radar de Clones e Bloqueios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sinais técnicos observados e lista Anatel</p>
            </div>
            <button
              onClick={() => onNavigate('/radar')}
              className="text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline cursor-pointer"
            >
              Abrir Radar
            </button>
          </div>

          <div className="space-y-3">
            {/* Card clone warning example */}
            <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-900 dark:text-rose-300">betano-app-bonus.xyz</span>
                <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded">
                  Lookalike Detectado
                </span>
              </div>
              <p className="text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
                Domínio registrado no exterior sem autorização SPA/MF. Utiliza logo da Betano para oferta ilegítima de bônus via link patrocinado.
              </p>
              <div className="text-[11px] text-rose-700 dark:text-rose-400 font-mono">
                Host legítimo da marca: <strong className="font-bold">betano.bet.br</strong>
              </div>
            </div>

            {/* Blocked sample */}
            <div className="p-3 bg-slate-50 dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">bet365-apostas-vip.online</span>
                <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 px-1.5 py-0.5 rounded">
                  Bloqueio Anatel
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Constou na lista formal de bloqueio enviada à Anatel. Redirecionamento DNS para página de advertência pelos provedores.
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate('/radar')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold text-xs transition-colors cursor-pointer"
              >
                Consultar ferramenta comparadora de clones no Radar →
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* 5. DADOS DO MERCADO (Page 15: Séries & Estatísticas) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B7A75] dark:text-teal-400 mb-0.5">
                Inteligência e Dados Abertos
              </div>
              <h2 className="text-2xl font-bold text-[#0B1F33] dark:text-white">
                Panorama do Mercado Regulado no Brasil
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/series')}
              className="text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Acessar série histórica detalhada
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Autorizadas Nacional (SPA)</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0B1F33] dark:text-white tabular-nums">
                {MARKET_SERIES_DATA.totalAuthorizedNational}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">outorgas federais</span>
            </div>

            <div className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Autorizadas Estaduais</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0B1F33] dark:text-white tabular-nums">
                {MARKET_SERIES_DATA.totalAuthorizedEstadual}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">Loterj, Lotepar, Lemg</span>
            </div>

            <div className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Domínios Bloqueados</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-400 tabular-nums">
                {MARKET_SERIES_DATA.totalBlockedAnatel}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">listas Anatel / MF</span>
            </div>

            <div className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-100 dark:border-slate-800 rounded">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Domínios Monitorados</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1F5FD1] dark:text-sky-400 tabular-nums">
                {MARKET_SERIES_DATA.totalVerifiedDomains}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">sondas técnicas ativas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. API E INTEGRAÇÃO B2B (Page 15) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0B1F33] dark:bg-[#050E17] text-white rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-transparent dark:border-slate-800 transition-colors">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider">
              Para Jornalistas, Pesquisadores & Compliance
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              API Pública BetLegal: Dados Estruturados em Tempo Real
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulte endpoints REST padronizados para integrar verificações de domínio, CNPJ, listas de bloqueio da Anatel e histórico de alterações em sistemas de antifraude e redações.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('/api')}
              className="px-5 py-2.5 bg-[#1F5FD1] hover:bg-[#184ebd] text-white text-xs sm:text-sm font-semibold rounded transition-colors cursor-pointer"
            >
              Explorar Documentação da API
            </button>
            <button
              onClick={() => onNavigate('/contestar')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold rounded border border-white/20 transition-colors cursor-pointer"
            >
              Canal de Contestação
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
