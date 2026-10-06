import React, { useEffect, useState, useMemo } from 'react';
import { BetEntity } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { STATUS_MAP } from '../utils/statusMapping';
import {
  Search,
  X,
  Download,
  HelpCircle,
} from 'lucide-react';
import { fetchSearch } from '../lib/realData';

interface SearchViewProps {
  entities: BetEntity[];
  initialQuery?: string;
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

const selectClass = "w-full text-xs py-2 px-2.5 rounded border focus:outline-none bg-transparent";

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
  const [remote, setRemote] = useState<BetEntity[] | null>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setRemote(null);
      return;
    }
    let cancelled = false;
    fetchSearch(q)
      .then((rows) => { if (!cancelled) setRemote(rows); })
      .catch(() => { if (!cancelled) setRemote(null); });
    return () => { cancelled = true; };
  }, [searchQuery]);

  const pool = remote ?? entities;

  const filteredEntities = useMemo(() => {
    return pool.filter((entity) => {
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

      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        matchesStatus = entity.status === selectedStatus;
      }

      let matchesSphere = true;
      if (selectedSphere !== 'all') {
        matchesSphere = entity.sphere === selectedSphere;
      }

      let matchesLiveness = true;
      if (selectedLiveness !== 'all') {
        matchesLiveness = entity.domains.some(d => d.liveness === selectedLiveness);
      }

      return matchesText && matchesStatus && matchesSphere && matchesLiveness;
    });
  }, [pool, searchQuery, selectedStatus, selectedSphere, selectedLiveness]);

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
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      <div className="border-b pb-4" style={{ borderColor: 'var(--color-card-border)' }}>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Consulta Cadastral e Regulatória
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Pesquise por nome fantasia, razão social, CNPJ ou host específico (.bet.br, .com, etc.)
        </p>
      </div>

      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite nome da marca, domínio (ex: betano.bet.br) ou CNPJ com ou sem pontuação..."
            className="w-full pl-11 pr-10 py-2.5 text-sm sm:text-base rounded-md focus:outline-none border bg-transparent"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80"
              style={{ color: 'var(--color-text-tertiary)' }}
              aria-label="Limpar texto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Status Regulatório
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={selectClass}
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
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

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Esfera Governamental
            </label>
            <select
              value={selectedSphere}
              onChange={(e) => setSelectedSphere(e.target.value)}
              className={selectClass}
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="all">Todas as esferas</option>
              <option value="federal">Federal (Ministério da Fazenda / SPA)</option>
              <option value="estadual">Estadual (Loterj / Lotepar / Lemg)</option>
              <option value="judicial">Decisão Judicial Federal</option>
              <option value="nenhuma">Sem registro formal localizado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Sonda Técnica (Liveness)
            </label>
            <select
              value={selectedLiveness}
              onChange={(e) => setSelectedLiveness(e.target.value)}
              className={selectClass}
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            >
              <option value="all">Qualquer estado de conexão</option>
              <option value="ONLINE">Online (HTTP 200)</option>
              <option value="BLOCKED_DNS">Bloqueado no DNS</option>
              <option value="UNRESPONSIVE">Inacessível / Timeout</option>
              <option value="OFFLINE">Offline (Host não encontrado)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs border-t flex-wrap gap-2" style={{ borderColor: 'var(--color-card-border)' }}>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            Mostrando <strong style={{ color: 'var(--color-text-primary)' }}>{filteredEntities.length}</strong> de {entities.length} registros cadastrados
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium cursor-pointer hover:opacity-80"
                style={{ color: 'var(--status-nao-autorizada)' }}
              >
                Limpar filtros
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-white/10"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)' }}
              title="Exportar registros filtrados para planilha CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
        </div>
      </GlassCard>

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
          <GlassCard className="p-10 text-center space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto" style={{ color: 'var(--color-text-tertiary)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Nenhum registro encontrado
            </h3>
            <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Não localizamos casas ou domínios correspondentes a <strong>"{searchQuery}"</strong> com os filtros selecionados.
            </p>
            <div className="pt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-medium rounded transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                Redefinir busca e filtros
              </button>
            </div>
          </GlassCard>
        )}
      </div>

    </div>
  );
};
