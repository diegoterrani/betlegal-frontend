import React, { useState, useMemo } from 'react';
import { BetEntity, RegulatoryStatus, RegulatorySphere } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { STATUS_MAP } from '../utils/statusMapping';
import { 
  Search, 
  Filter, 
  X, 
  Download, 
  FileSpreadsheet, 
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';

interface SearchViewProps {
  entities: BetEntity[];
  initialQuery?: string;
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  entities,
  initialQuery = '',
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [selectedLiveness, setSelectedLiveness] = useState<string>('all');

  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      // 1. Text Search query matching brand, tradeNames, legalName, cnpj, or any domain host
      const q = searchQuery.trim().toLowerCase();
      let matchesText = true;
      if (q) {
        const cleanCnpj = q.replace(/\D/g, '');
        const entityCleanCnpj = entity.cnpj.replace(/\D/g, '');

        const matchesName = entity.brandName.toLowerCase().includes(q);
        const matchesTrade = entity.tradeNames.some(t => t.toLowerCase().includes(q));
        const matchesLegal = entity.legalName.toLowerCase().includes(q);
        const matchesCnpj = entity.cnpj.toLowerCase().includes(q) || (cleanCnpj.length > 3 && entityCleanCnpj.includes(cleanCnpj));
        const matchesDomain = entity.domains.some(d => d.host.toLowerCase().includes(q));
        const matchesSigap = entity.sigapProtocol?.toLowerCase().includes(q);

        matchesText = Boolean(matchesName || matchesTrade || matchesLegal || matchesCnpj || matchesDomain || matchesSigap);
      }

      // 2. Status Filter
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        matchesStatus = entity.status === selectedStatus;
      }

      // 3. Sphere Filter
      let matchesSphere = true;
      if (selectedSphere !== 'all') {
        matchesSphere = entity.sphere === selectedSphere;
      }

      // 4. Liveness Filter
      let matchesLiveness = true;
      if (selectedLiveness !== 'all') {
        matchesLiveness = entity.domains.some(d => d.liveness === selectedLiveness);
      }

      return matchesText && matchesStatus && matchesSphere && matchesLiveness;
    });
  }, [entities, searchQuery, selectedStatus, selectedSphere, selectedLiveness]);

  const handleExportCSV = () => {
    const headers = ['Marca', 'Razao_Social', 'CNPJ', 'Status_Regulatorio', 'Esfera', 'Protocolo_SIGAP', 'Dominio_Principal', 'Data_Verificacao'];
    const rows = filteredEntities.map(e => [
      `"${e.brandName}"`,
      `"${e.legalName}"`,
      `"${e.cnpj}"`,
      `"${STATUS_MAP[e.status]?.publicText || e.status}"`,
      `"${e.sphere}"`,
      `"${e.sigapProtocol || ''}"`,
      `"${e.domains[0]?.host || ''}"`,
      `"${e.verifiedAt} ${e.lastCheckedTime}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `betlegal_consulta_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedSphere('all');
    setSelectedLiveness('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'all' || selectedSphere !== 'all' || selectedLiveness !== 'all';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Title & Description */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Consulta Cadastral e Regulatória
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Pesquise por nome fantasia, razão social, CNPJ ou host específico (.bet.br, .com, etc.)
        </p>
      </div>

      {/* Search Bar & Filters Form */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
        
        {/* Search input with reset icon */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite nome da marca, domínio (ex: betano.bet.br) ou CNPJ com ou sem pontuação..."
            className="w-full pl-11 pr-10 py-2.5 text-sm sm:text-base border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-[#1F5FD1] focus:ring-1 focus:ring-[#1F5FD1] bg-[#F6F8FB]/50 dark:bg-[#081320] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Limpar texto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Status Regulatório
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white dark:bg-[#081320] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1F5FD1]"
            >
              <option value="all">Todos os Status Factuais</option>
              <option value="AUTORIZADA_NACIONAL">Autorizada — nacional, SPA/MF</option>
              <option value="AUTORIZADA_ESTADUAL">Autorizada — estadual (Loterj, Lotepar, etc.)</option>
              <option value="DECISAO_JUDICIAL">Opera por decisão judicial</option>
              <option value="REQUERIMENTO_EM_ANALISE">Requerimento em análise</option>
              <option value="SUSPENSA_REVOGADA">Saiu da lista oficial / suspensa</option>
              <option value="NAO_AUTORIZADA_DETECTADA">Não consta nas listas consultadas</option>
              <option value="BLOQUEADA_ANATEL">Constou em lista de bloqueio publicada</option>
            </select>
          </div>

          {/* Esfera Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Esfera Governamental
            </label>
            <select
              value={selectedSphere}
              onChange={(e) => setSelectedSphere(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white dark:bg-[#081320] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1F5FD1]"
            >
              <option value="all">Todas as esferas</option>
              <option value="federal">Federal (Ministério da Fazenda / SPA)</option>
              <option value="estadual">Estadual (Loterj / Lotepar / Lemg)</option>
              <option value="judicial">Decisão Judicial Federal</option>
              <option value="nenhuma">Sem registro formal localizado</option>
            </select>
          </div>

          {/* Liveness Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Sonda Técnica (Liveness)
            </label>
            <select
              value={selectedLiveness}
              onChange={(e) => setSelectedLiveness(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-white dark:bg-[#081320] border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1F5FD1]"
            >
              <option value="all">Qualquer estado de conexão</option>
              <option value="ONLINE">Online (HTTP 200)</option>
              <option value="BLOCKED_DNS">Bloqueado no DNS</option>
              <option value="UNRESPONSIVE">Inacessível / Timeout</option>
              <option value="OFFLINE">Offline (Host não encontrado)</option>
            </select>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="text-slate-600 dark:text-slate-400">
            Mostrando <strong className="font-semibold text-slate-900 dark:text-white">{filteredEntities.length}</strong> de {entities.length} registros cadastrados
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium cursor-pointer"
              >
                Limpar filtros
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Exportar registros filtrados para planilha CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredEntities.length > 0 ? (
          filteredEntities.map((entity) => (
            <BetLegalCard
              key={entity.id}
              entity={entity}
              onOpenHistory={onOpenHistory}
              onShare={onShare}
              onReport={onReport}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-10 text-center space-y-3 transition-colors">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white">
              Nenhum registro encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Não localizamos casas ou domínios correspondentes a <strong>"{searchQuery}"</strong> com os filtros selecionados.
            </p>
            <div className="pt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#1F5FD1] text-white text-xs font-medium rounded hover:bg-[#184ebd] transition-colors cursor-pointer"
              >
                Redefinir busca e filtros
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
