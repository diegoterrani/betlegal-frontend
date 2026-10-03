import React, { useMemo, useState } from 'react';
import { BetEntity, LivenessStatus, RegulatoryStatus } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { KpiCard } from '../components/ui/KpiCard';
import {
  Radio,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface RadarViewProps {
  entities: BetEntity[];
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

const NON_AUTHORIZED: RegulatoryStatus[] = [
  'REQUERIMENTO_EM_ANALISE',
  'SUSPENSA_REVOGADA',
  'NAO_AUTORIZADA_DETECTADA',
  'BLOQUEADA_ANATEL',
  'INATIVA',
  'DESCONHECIDA',
];

type SortOrder = 'recent' | 'name';
type StatusFilter = 'all' | RegulatoryStatus;
type LivenessFilter = 'all' | LivenessStatus;

const PAGE_SIZE = 20;

export const RadarView: React.FC<RadarViewProps> = ({
  entities,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [livenessFilter, setLivenessFilter] = useState<LivenessFilter>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [page, setPage] = useState(1);

  const radarDomains = useMemo(
    () => entities.filter((e) => NON_AUTHORIZED.includes(e.status)),
    [entities]
  );

  const countries = useMemo(() => {
    const set = new Set<string>();
    radarDomains.forEach((e) => {
      const cc = e.domains[0]?.hostingCountry;
      if (cc) set.add(cc);
    });
    return Array.from(set).sort();
  }, [radarDomains]);

  const onlineCount = useMemo(
    () => radarDomains.filter((e) => e.domains.some((d) => d.liveness === 'ONLINE')).length,
    [radarDomains]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = radarDomains.filter((e) => {
      const host = e.domains[0]?.host || '';
      const matchesQuery =
        !q ||
        host.toLowerCase().includes(q) ||
        e.brandName.toLowerCase().includes(q) ||
        e.evidenceSummary.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesLiveness = livenessFilter === 'all' || e.domains.some((d) => d.liveness === livenessFilter);
      const matchesCountry = countryFilter === 'all' || e.domains.some((d) => d.hostingCountry === countryFilter);
      return matchesQuery && matchesStatus && matchesLiveness && matchesCountry;
    });

    list = [...list].sort((a, b) => {
      if (sortOrder === 'name') return a.brandName.localeCompare(b.brandName);
      return (b.verifiedAt + b.lastCheckedTime).localeCompare(a.verifiedAt + a.lastCheckedTime);
    });

    return list;
  }, [radarDomains, search, statusFilter, livenessFilter, countryFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setLivenessFilter('all');
    setCountryFilter('all');
    setSortOrder('recent');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search) || statusFilter !== 'all' || livenessFilter !== 'all' || countryFilter !== 'all';

  const inputStyle = { borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)', backgroundColor: 'transparent' };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--status-atencao)' }}>
          <Radio className="w-4 h-4 animate-pulse" />
          Monitoramento Contínuo e Bloqueios
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Radar de não autorizadas
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          Domínios sem outorga vigente, requerimentos em análise, suspensões e bloqueios publicados pela SPA/MF à Anatel — atualizado continuamente pelo monitoramento do Bet Legal.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        <KpiCard
          label="Domínios no radar"
          value={radarDomains.length}
          helper="Fora da lista de autorização vigente"
          accent="var(--status-nao-autorizada)"
        />
        <KpiCard
          label="Online agora"
          value={onlineCount}
          helper="Acessíveis neste momento"
          accent="var(--status-atencao)"
        />
      </div>

      {/* Critério de neutralidade e rastreabilidade */}
      <GlassCard
        className="p-4 text-xs flex items-start gap-3"
        style={{ backgroundColor: 'color-mix(in srgb, var(--status-atencao) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--status-atencao) 30%, transparent)' }}
      >
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--status-atencao)' }} />
        <div>
          <strong className="font-semibold block" style={{ color: 'var(--color-text-primary)' }}>Critério de Neutralidade e Rastreabilidade</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            "Não consta nas listas de autorização" é uma observação factual sobre as listas públicas consultadas na data indicada — não é juízo de valor nem parecer jurídico. Toda classificação é rastreável à sua fonte e à data da última verificação.
          </span>
        </div>
      </GlassCard>

      {/* Filtros */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              placeholder="Buscar por domínio, marca ou evidência..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded border focus:outline-none"
              style={inputStyle}
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded text-xs font-semibold border flex items-center gap-1.5 cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(() => setStatusFilter(e.target.value as StatusFilter))}
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="all">Todos os status</option>
            {NON_AUTHORIZED.map((s) => (
              <option key={s} value={s}>{STATUS_MAP[s].shortLabel}</option>
            ))}
          </select>

          <select
            value={livenessFilter}
            onChange={(e) => handleFilterChange(() => setLivenessFilter(e.target.value as LivenessFilter))}
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="all">Toda disponibilidade</option>
            {(Object.keys(LIVENESS_MAP) as LivenessStatus[]).map((l) => (
              <option key={l} value={l}>{LIVENESS_MAP[l].label}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => handleFilterChange(() => setCountryFilter(e.target.value))}
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="all">Todos os países</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="recent">Mais recentes primeiro</option>
            <option value="name">Ordem alfabética (marca)</option>
          </select>
        </div>
      </GlassCard>

      {/* Tabela — desktop */}
      <GlassCard className="p-0 overflow-hidden hidden md:block">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--color-card-border)' }}>
              {['Domínio', 'Status', 'Site', 'Detectado em', 'Última verificação', 'Evidência / fonte', 'Ação'].map((h) => (
                <th key={h} className="text-left p-3 font-semibold uppercase tracking-wide text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((entity) => {
              const domain = entity.domains[0];
              const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;
              const livenessInfo = domain ? LIVENESS_MAP[domain.liveness] : LIVENESS_MAP.OFFLINE;
              return (
                <tr key={entity.id} className="border-b last:border-0" style={{ borderColor: 'var(--color-card-border)' }}>
                  <td className="p-3">
                    <div className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{domain?.host}</div>
                    <div className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      {entity.brandName}
                      {entity.cloneRiskNotice && (
                        <span className="ml-1.5 font-semibold" style={{ color: 'var(--status-nao-autorizada)' }}>· possível lookalike</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusInfo.badgeClass}`}>
                      {statusInfo.shortLabel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${livenessInfo.textClass}`}>{livenessInfo.label}</span>
                  </td>
                  <td className="p-3 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{domain?.detectedAt || '—'}</td>
                  <td className="p-3 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{entity.verifiedAt} {entity.lastCheckedTime}</td>
                  <td className="p-3 max-w-xs truncate" style={{ color: 'var(--color-text-secondary)' }} title={entity.evidenceSummary}>
                    {entity.evidenceSummary}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onViewDetails(entity)}
                      className="font-semibold hover:underline cursor-pointer whitespace-nowrap"
                      style={{ color: 'var(--status-dado-declarado)' }}
                    >
                      Ver ficha →
                    </button>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                  Nenhum domínio encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>

      {/* Lista — mobile */}
      <ul className="space-y-3 md:hidden">
        {pageItems.map((entity) => {
          const domain = entity.domains[0];
          const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;
          const livenessInfo = domain ? LIVENESS_MAP[domain.liveness] : LIVENESS_MAP.OFFLINE;
          return (
            <li key={entity.id}>
              <GlassCard className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{domain?.host}</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusInfo.badgeClass}`}>
                    {statusInfo.shortLabel}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{entity.brandName}</div>
                <div className="text-xs flex items-center justify-between">
                  <span className={`font-semibold ${livenessInfo.textClass}`}>{livenessInfo.label}</span>
                  <span className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{entity.verifiedAt}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{entity.evidenceSummary}</p>
                <button
                  onClick={() => onViewDetails(entity)}
                  className="font-semibold hover:underline cursor-pointer text-xs"
                  style={{ color: 'var(--status-dado-declarado)' }}
                >
                  Ver ficha →
                </button>
              </GlassCard>
            </li>
          );
        })}
        {pageItems.length === 0 && (
          <li className="text-xs text-center p-6" style={{ color: 'var(--color-text-tertiary)' }}>
            Nenhum domínio encontrado com os filtros atuais.
          </li>
        )}
      </ul>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>Página {currentPage} de {totalPages} · {filtered.length} resultados</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded border disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--color-card-border)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded border disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--color-card-border)' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
