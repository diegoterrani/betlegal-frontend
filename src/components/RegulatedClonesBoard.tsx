import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { RegulatoryStatus } from '../types';
import { STATUS_MAP } from '../utils/statusMapping';

export interface CloneLink {
  host: string;
  status: RegulatoryStatus;
  liveness: 'NO_AR' | 'FORA_DO_AR' | 'NAO_CHECADO' | string;
  relation: 'redirect' | 'cnpj' | string;
  relation_label: string;
  detection_target?: string | null;
}

export interface CloneHouse {
  name: string;
  slug: string;
  legal_name: string;
  cnpj: string;
  official_domains: { host: string; status?: RegulatoryStatus }[];
  clones: CloneLink[];
}

interface RegulatedClonesBoardProps {
  houses: CloneHouse[] | null;
  onNavigate: (path: string) => void;
}

const CLONE_STATUSES: RegulatoryStatus[] = [
  'NAO_AUTORIZADA_DETECTADA',
  'BLOQUEADA_ANATEL',
  'SUSPENSA_REVOGADA',
  'INATIVA',
  'DESCONHECIDA',
  'REQUERIMENTO_EM_ANALISE',
];

const LIVENESS_LABEL: Record<string, { label: string; color: string }> = {
  NO_AR: { label: 'Online', color: 'var(--status-autorizada)' },
  FORA_DO_AR: { label: 'Fora do ar', color: 'var(--status-nao-autorizada)' },
  NAO_CHECADO: { label: 'Sem checagem', color: 'var(--color-text-tertiary)' },
};

const inputStyle: React.CSSProperties = {
  borderColor: 'var(--color-card-border)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'transparent',
};

const fmt = (n: number) => n.toLocaleString('pt-BR');

function digits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatCNPJ(raw: string): string {
  const value = digits(raw);
  if (value.length !== 14) return raw;
  return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
}

function houseIdentityMatch(house: CloneHouse, query: string, queryDigits: string): boolean {
  if (!query) return true;
  const text = [
    house.name,
    house.legal_name,
    house.slug,
    ...house.official_domains.map((domain) => domain.host),
  ].join(' ').toLowerCase();
  if (text.includes(query)) return true;
  return queryDigits.length >= 3 && digits(house.cnpj).includes(queryDigits);
}

function selectGroups(
  houses: CloneHouse[],
  onlyLinked: boolean,
  query: string,
  queryDigits: string,
  statusFilter: string,
  livenessFilter: string,
  relationFilter: string,
): CloneHouse[] {
  const cloneFiltersOn = statusFilter !== 'ALL' || livenessFilter !== 'ALL' || relationFilter !== 'ALL';
  const groups: CloneHouse[] = [];
  for (const house of houses) {
    const identityMatch = houseIdentityMatch(house, query, queryDigits);
    const clones = house.clones.filter((clone) => {
      if (statusFilter !== 'ALL' && clone.status !== statusFilter) return false;
      if (livenessFilter !== 'ALL' && clone.liveness !== livenessFilter) return false;
      if (relationFilter !== 'ALL' && clone.relation !== relationFilter) return false;
      if (identityMatch) return true;
      return `${clone.host} ${clone.relation_label}`.toLowerCase().includes(query);
    });
    if (clones.length === 0) {
      if (onlyLinked || cloneFiltersOn || (query && !identityMatch)) continue;
      groups.push({ ...house, clones: [] });
      continue;
    }
    groups.push({ ...house, clones });
  }
  return groups;
}

const HostButton: React.FC<{ host: string; onNavigate: (path: string) => void }> = ({ host, onNavigate }) => (
  <button
    type="button"
    onClick={() => onNavigate(`/dominio/${encodeURIComponent(host)}`)}
    className="block font-mono font-semibold text-left hover:underline cursor-pointer"
    style={{ color: 'var(--status-dado-declarado)' }}
  >
    {host}
  </button>
);

export const RegulatedClonesBoard: React.FC<RegulatedClonesBoardProps> = ({ houses, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [livenessFilter, setLivenessFilter] = useState('ALL');
  const [relationFilter, setRelationFilter] = useState('ALL');
  const [onlyLinked, setOnlyLinked] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    if (!houses) return [];
    const query = searchTerm.trim().toLowerCase();
    return selectGroups(houses, onlyLinked, query, digits(searchTerm), statusFilter, livenessFilter, relationFilter);
  }, [houses, onlyLinked, searchTerm, statusFilter, livenessFilter, relationFilter]);

  const totals = useMemo(() => {
    const holds = new Set<string>();
    const authorized = new Set<string>();
    const clones = new Set<string>();
    for (const house of houses || []) {
      holds.add(digits(house.cnpj) || house.slug);
      for (const domain of house.official_domains) authorized.add(domain.host);
      for (const clone of house.clones) clones.add(clone.host);
    }
    const linked = (houses || []).filter((house) => house.clones.length > 0).length;
    return { holds: holds.size, authorized: authorized.size, clones: clones.size, linked, houses: houses?.length ?? 0 };
  }, [houses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const filtersOn = Boolean(searchTerm) || statusFilter !== 'ALL' || livenessFilter !== 'ALL' || relationFilter !== 'ALL' || onlyLinked;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setLivenessFilter('ALL');
    setRelationFilter('ALL');
    setOnlyLinked(false);
    setPage(1);
  };

  if (!houses) {
    return <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Carregando a tabela de clones.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm max-w-3xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        Cada casa da lista oficial aparece uma vez e reúne os domínios que redirecionam para o endereço autorizado ou citam o CNPJ da operadora.
        A autorização vale para o domínio listado. Casa sem essa linha só indica que não há esse vínculo medido.
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        {fmt(totals.houses)} casas regulamentadas. {fmt(totals.linked)} com vínculo direto. {fmt(totals.clones)} domínios não autorizados.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ['Holds', totals.holds, 'Operadoras distintas na lista oficial.'],
          ['Domínios autorizados', totals.authorized, 'Endereços que constam na outorga.'],
          ['Domínios clones', totals.clones, 'Relação direta com uma casa da lista.'],
        ].map(([label, value, detail]) => (
          <GlassCard key={String(label)} className="p-4">
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{label}</p>
            <p className="font-mono text-2xl" style={{ color: 'var(--color-text-primary)' }}>{fmt(Number(value))}</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{detail}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Marca, CNPJ ou domínio"
            aria-label="Buscar marca, CNPJ ou domínio"
            className="flex-1 px-3 py-2 text-sm rounded border focus:outline-none"
            style={inputStyle}
          />
          {filtersOn && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 rounded text-xs font-semibold border cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            aria-label="Filtrar pelo status do domínio não autorizado"
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="ALL">Todos os status</option>
            {CLONE_STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_MAP[status].shortLabel}</option>
            ))}
          </select>
          <select
            value={livenessFilter}
            onChange={(e) => { setLivenessFilter(e.target.value); setPage(1); }}
            aria-label="Filtrar por disponibilidade"
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="ALL">Toda disponibilidade</option>
            <option value="NO_AR">Online</option>
            <option value="FORA_DO_AR">Fora do ar</option>
            <option value="NAO_CHECADO">Sem checagem</option>
          </select>
          <select
            value={relationFilter}
            onChange={(e) => { setRelationFilter(e.target.value); setPage(1); }}
            aria-label="Filtrar pelo tipo de relação"
            className="px-2 py-2 text-xs rounded border focus:outline-none"
            style={inputStyle}
          >
            <option value="ALL">Redirecionamento e CNPJ</option>
            <option value="redirect">Redireciona para o domínio oficial</option>
            <option value="cnpj">Cita o CNPJ da operadora</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
          <input
            type="checkbox"
            checked={onlyLinked}
            onChange={(e) => { setOnlyLinked(e.target.checked); setPage(1); }}
          />
          Só casas com vínculo direto
        </label>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="p-8 text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Nenhuma casa encontrada com os filtros selecionados.{' '}
          <button type="button" onClick={clearFilters} className="font-semibold hover:underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
            Redefinir filtros
          </button>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="p-0 overflow-hidden hidden md:block">
            <table className="w-full text-xs" aria-label="Casas regulamentadas e domínios não autorizados com relação direta">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-card-border)' }}>
                  {['Casa regulamentada', 'Domínio oficial', 'Domínio não autorizado', 'Relação', 'Status', 'No ar'].map((heading) => (
                    <th key={heading} className="text-left p-3 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.flatMap((house) => {
                  const lines: Array<CloneLink | null> = house.clones.length > 0 ? house.clones : [null];
                  return lines.map((clone, index) => {
                    const statusInfo = clone ? (STATUS_MAP[clone.status] || STATUS_MAP.DESCONHECIDA) : null;
                    const live = clone ? (LIVENESS_LABEL[clone.liveness] || { label: 'Sem checagem', color: 'var(--color-text-tertiary)' }) : null;
                    return (
                      <tr key={clone ? `${house.slug}:${clone.host}` : house.slug} className="border-b last:border-0 align-top" style={{ borderColor: 'var(--color-card-border)' }}>
                        {index === 0 && (
                          <td rowSpan={lines.length} className="p-3 align-top border-r" style={{ borderColor: 'var(--color-card-border)' }}>
                            <button type="button" onClick={() => onNavigate(`/marca/${encodeURIComponent(house.slug)}`)} className="font-semibold text-left hover:underline cursor-pointer" style={{ color: 'var(--color-text-primary)' }}>
                              {house.name}
                            </button>
                            {house.legal_name && <p className="mt-0.5 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>{house.legal_name}</p>}
                            {house.cnpj && <p className="font-mono mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{formatCNPJ(house.cnpj)}</p>}
                            <p className="mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                              {house.clones.length === 0 ? 'Nenhum vínculo direto' : `${fmt(house.clones.length)} ${house.clones.length === 1 ? 'clone' : 'clones'}`}
                            </p>
                          </td>
                        )}
                        {index === 0 && (
                          <td rowSpan={lines.length} className="p-3 align-top border-r space-y-1" style={{ borderColor: 'var(--color-card-border)' }}>
                            {house.official_domains.map((domain) => (
                              <HostButton key={domain.host} host={domain.host} onNavigate={onNavigate} />
                            ))}
                          </td>
                        )}
                        <td className="p-3">
                          {clone ? <HostButton host={clone.host} onNavigate={onNavigate} /> : <span style={{ color: 'var(--color-text-tertiary)' }}>Nenhum vínculo direto medido</span>}
                        </td>
                        <td className="p-3 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>{clone?.relation_label ?? '—'}</td>
                        <td className="p-3">
                          {statusInfo ? (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusInfo.badgeClass}`}>
                              {statusInfo.shortLabel}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-3 font-semibold" style={{ color: live?.color }}>{live?.label ?? '—'}</td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </GlassCard>

          <ul className="space-y-3 md:hidden">
            {paged.map((house) => (
              <li key={house.slug}>
                <GlassCard className="p-4 space-y-3">
                  <div>
                    <button type="button" onClick={() => onNavigate(`/marca/${encodeURIComponent(house.slug)}`)} className="font-semibold text-sm text-left hover:underline cursor-pointer" style={{ color: 'var(--color-text-primary)' }}>
                      {house.name}
                    </button>
                    {house.legal_name && <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{house.legal_name}</p>}
                    {house.cnpj && <p className="font-mono text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{formatCNPJ(house.cnpj)}</p>}
                  </div>
                  <div className="text-xs space-y-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    <p>Oficial</p>
                    {house.official_domains.map((domain) => (
                      <HostButton key={domain.host} host={domain.host} onNavigate={onNavigate} />
                    ))}
                  </div>
                  {house.clones.length === 0 ? (
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhum vínculo direto medido</p>
                  ) : (
                    <ul className="space-y-3">
                      {house.clones.map((clone) => {
                        const statusInfo = STATUS_MAP[clone.status] || STATUS_MAP.DESCONHECIDA;
                        const live = LIVENESS_LABEL[clone.liveness] || { label: 'Sem checagem', color: 'var(--color-text-tertiary)' };
                        return (
                          <li key={clone.host} className="space-y-1 border-t pt-3" style={{ borderColor: 'var(--color-card-border)' }}>
                            <div className="flex items-start justify-between gap-2">
                              <HostButton host={clone.host} onNavigate={onNavigate} />
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border shrink-0 ${statusInfo.badgeClass}`}>
                                {statusInfo.shortLabel}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{clone.relation_label}</p>
                            <p className="text-xs font-semibold" style={{ color: live.color }}>{live.label}</p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </GlassCard>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Página {currentPage} de {totalPages}. {fmt(filtered.length)} casas.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded border disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-white/5"
                  style={{ borderColor: 'var(--color-card-border)' }}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded border disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-white/5"
                  style={{ borderColor: 'var(--color-card-border)' }}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
