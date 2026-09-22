import React, { useState } from 'react';
import { BetEntity } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { STATUS_MAP } from '../utils/statusMapping';
import { 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Building2, 
  FileCheck, 
  Scale, 
  LayoutList, 
  LayoutGrid,
  Search
} from 'lucide-react';

interface AuthorizedViewProps {
  entities: BetEntity[];
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const AuthorizedView: React.FC<AuthorizedViewProps> = ({
  entities,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'federal' | 'estadual' | 'judicial'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [filterText, setFilterText] = useState('');

  // Filter positive list only (National, State, Judicial)
  const authorizedEntities = entities.filter(e => 
    e.status === 'AUTORIZADA_NACIONAL' || 
    e.status === 'AUTORIZADA_ESTADUAL' || 
    e.status === 'DECISAO_JUDICIAL'
  );

  const displayedEntities = authorizedEntities.filter(e => {
    if (activeTab === 'federal' && e.sphere !== 'federal') return false;
    if (activeTab === 'estadual' && e.sphere !== 'estadual') return false;
    if (activeTab === 'judicial' && e.sphere !== 'judicial') return false;

    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      const matchBrand = e.brandName.toLowerCase().includes(q);
      const matchLegal = e.legalName.toLowerCase().includes(q);
      const matchCnpj = e.cnpj.includes(q);
      const matchDomain = e.domains.some(d => d.host.toLowerCase().includes(q));
      return matchBrand || matchLegal || matchCnpj || matchDomain;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Title & Trust Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Lista Positiva Vigente
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
              Casas de Apostas com Autorização Publicada
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Relação de pessoas jurídicas outorgadas pela Secretaria de Prêmios e Apostas (SPA/MF), loterias estaduais credenciadas ou decisão judicial em vigor.
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded p-3">
            <div>Fonte primária: <strong className="text-slate-800 dark:text-slate-200">SPA/MF e DOU</strong></div>
            <div>Janela de atualização: <span className="font-mono text-slate-700 dark:text-slate-300">Hoje 12:00 BRT</span></div>
          </div>
        </div>
      </div>

      {/* Navigation tabs & controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#0D1B2A] p-3 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors">
        
        {/* Segmented Tab Buttons (Clean, without pill candy) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todas ({authorizedEntities.length})
          </button>
          <button
            onClick={() => setActiveTab('federal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'federal'
                ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Nacional / SPA ({authorizedEntities.filter(e => e.sphere === 'federal').length})
          </button>
          <button
            onClick={() => setActiveTab('estadual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'estadual'
                ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Estaduais ({authorizedEntities.filter(e => e.sphere === 'estadual').length})
          </button>
          <button
            onClick={() => setActiveTab('judicial')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'judicial'
                ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Decisão Judicial ({authorizedEntities.filter(e => e.sphere === 'judicial').length})
          </button>
        </div>

        {/* Search within list & View mode switch */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar nesta lista..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-[#1F5FD1] bg-slate-50 dark:bg-[#081320] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded p-0.5 bg-slate-50 dark:bg-[#081320] shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-[#0D1B2A] shadow-xs text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Visualização em tabela cadastral"
              aria-label="Tabela"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white dark:bg-[#0D1B2A] shadow-xs text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Visualização em BetLegal Cards"
              aria-label="Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Content display */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1F33] dark:bg-[#081320] text-white border-b border-slate-800 font-semibold tracking-wide">
                <tr>
                  <th className="py-3 px-4">Marca Comercial</th>
                  <th className="py-3 px-4">Razão Social & CNPJ</th>
                  <th className="py-3 px-4">Esfera / Órgão</th>
                  <th className="py-3 px-4">Protocolo / Ato</th>
                  <th className="py-3 px-4">Domínio Homologado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {displayedEntities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#13253B] transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="hover:text-[#1F5FD1] dark:hover:text-sky-400 text-left cursor-pointer"
                      >
                        {item.brandName}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{item.legalName}</div>
                      <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{item.cnpj}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.sphere === 'federal' ? 'Nacional (SPA/MF)' : item.stateJurisdiction || item.sphere}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {item.sigapProtocol ? `SIGAP ${item.sigapProtocol}` : item.portariaNumber?.slice(0, 30) || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                      {item.domains[0]?.host || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                      >
                        Ficha
                      </button>
                      <button
                        onClick={() => onShare(item, item.domains[0]?.host || '')}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                      >
                        Compartilhar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEntities.map((item) => (
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

      {/* Regulatory Rule Note from Page 17 & Page 25 */}
      <div className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded text-xs text-slate-600 dark:text-slate-400 space-y-1 transition-colors">
        <div className="font-bold text-slate-800 dark:text-slate-200">Regra Editorial BetLegal nº 2:</div>
        <p>
          <em>"Nunca chamar de 'segura' apenas por estar autorizada."</em> A autorização regulatória atesta o cumprimento dos requisitos legais de funcionamento perante o Ministério da Fazenda ou estado outorgante. Não equivale a selo de invulnerabilidade ou garantia contra perdas financeiras decorrentes de apostas.
        </p>
      </div>

    </div>
  );
};
