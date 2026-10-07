import { apiGet } from './http';
import { BetEntity, BrandReputation, RegulatoryChange, RegulatoryStatus, LivenessStatus } from '../types';

/** Leitura da mesma origem em /api/v1. No deploy, o rewrite da Vercel entrega o BFF de
 * bet-legal.org (papel radar_web). O navegador não fala com o PostgREST. */

function formatCNPJ(raw: string | null | undefined): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length !== 14) return raw || '';
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function formatTimeBR(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })} BRT`;
}

function slugifyHost(host: string): string {
  return host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const STATUS_TEXT: Record<RegulatoryStatus, string> = {
  AUTORIZADA_NACIONAL: 'Autorizada — nacional, SPA/MF',
  AUTORIZADA_ESTADUAL: 'Autorizada — estadual',
  DECISAO_JUDICIAL: 'Opera por decisão judicial',
  REQUERIMENTO_EM_ANALISE: 'Requerimento em análise',
  SUSPENSA_REVOGADA: 'Saiu da lista oficial / suspensa',
  NAO_AUTORIZADA_DETECTADA: 'Não consta nas listas de autorização consultadas',
  BLOQUEADA_ANATEL: 'Constou em lista de bloqueio publicada',
  INATIVA: 'Inativa',
  DESCONHECIDA: 'Em verificação',
};

function livenessFromApi(liveness: string): LivenessStatus {
  if (liveness === 'NO_AR') return 'ONLINE';
  if (liveness === 'FORA_DO_AR') return 'OFFLINE';
  return 'UNRESPONSIVE';
}

const EMPTY_REPUTATION = {
  reclameAquiScore: 0,
  complaintsCount: 0,
  solvedRatePercent: 0,
  answeredRatePercent: 0,
  avgResponseHours: 0,
  proconNotificationsCount: 0,
  ratingLabel: 'Sem índice' as const,
};

function ratingLabelFromScore(score: number): BrandReputation['ratingLabel'] {
  if (score >= 8) return 'Ótimo';
  if (score >= 6) return 'Bom';
  if (score >= 4) return 'Regular';
  if (score >= 2) return 'Ruim';
  if (score > 0) return 'Não Recomendado';
  return 'Sem índice';
}

// --- contrato de /api/v1/catalog e /api/v1/changes (ver api/_lib/contract.ts) ---

interface ApiDomainRecord {
  host: string;
  brand_slug: string;
  brand_name: string;
  operator_name: string;
  operator_cnpj: string;
  status: RegulatoryStatus;
  detection_kind: 'DOMINIO_DE_OPERADOR_AUTORIZADO' | null;
  detection_target?: string;
  registered_at?: string;
  first_cert_at?: string;
  liveness: 'NO_AR' | 'FORA_DO_AR' | 'NAO_CHECADO';
  first_seen: string;
  last_seen: string;
  verified_at: string;
  effective_at?: string;
  source_name: string;
  source_url: string;
  evidence_snippet: string;
  hosting_ip?: string;
  hosting_asn?: string;
  hosting_country?: string;
}

interface ApiBrandRecord {
  slug: string;
  uf?: string;
  community_rating?: { score: number };
  reclame_aqui?: { score: number; complaints: number; solved_rate: number } | null;
}

interface ApiChangeRecord {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  type: RegulatoryChange['type'];
  brandName: string;
  host: string;
  previousStatus: RegulatoryStatus | null;
  currentStatus: RegulatoryStatus;
  sourceDoc: string;
  summary: string;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${path} respondeu ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[realData] Falha ao buscar ${path}.`, err);
    return null;
  }
}

const STATE_FROM_SOURCE = /Loteria estadual \(([A-Z]{2})\)/;

/** Busca o catálogo real (api/v1/catalog) e o feed de mudanças (api/v1/changes), e monta
 * BetEntity[] — uma entidade por domínio, refletindo o status real por domínio, não por marca.
 * O catálogo traz TODOS os domínios publicados (sem amostragem — a antiga limitação de até 900
 * não autorizadas era do fetch direto do navegador, paginado 100 em 100; o endpoint já resolve
 * isso do lado do servidor). */
export async function fetchRealEntities(): Promise<BetEntity[] | null> {
  const [catalog, changes] = await Promise.all([
    fetchJson<{ domains: ApiDomainRecord[]; brands: ApiBrandRecord[] }>('/api/v1/catalog'),
    fetchJson<{ changes: ApiChangeRecord[] }>('/api/v1/changes?limit=1000'),
  ]);
  if (!catalog) return null;

  const brandBySlug = new Map(catalog.brands.map((b) => [b.slug, b]));

  const eventsByHost = new Map<string, ApiChangeRecord[]>();
  for (const c of changes?.changes || []) {
    const list = eventsByHost.get(c.host) || [];
    if (list.length < 8) list.push(c);
    eventsByHost.set(c.host, list);
  }

  return mapDomains(catalog.domains, brandBySlug, eventsByHost);
}

export function mapDomains(
  domains: ApiDomainRecord[],
  brandBySlug: Map<string, ApiBrandRecord>,
  eventsByHost: Map<string, ApiChangeRecord[]>
): BetEntity[] {
  return domains.map((d) => {
    const brand = brandBySlug.get(d.brand_slug);
    const sphere =
      d.status === 'AUTORIZADA_NACIONAL' ? 'federal' as const :
      d.status === 'AUTORIZADA_ESTADUAL' ? 'estadual' as const :
      d.status === 'DECISAO_JUDICIAL' ? 'judicial' as const : 'nenhuma' as const;
    const stateMatch = STATE_FROM_SOURCE.exec(d.source_name);
    const reclameAqui = brand?.reclame_aqui;
    const communityScore = brand?.community_rating?.score;
    const reputationScore = reclameAqui?.score ?? communityScore;

    return {
      id: `domain-${d.host}`,
      slug: slugifyHost(d.host),
      brandSlug: d.brand_slug || undefined,
      brandName: d.brand_name,
      tradeNames: [],
      legalName: d.operator_name || 'Não identificado',
      cnpj: d.operator_cnpj ? formatCNPJ(d.operator_cnpj) : '',
      status: d.status,
      statusText: STATUS_TEXT[d.status] || d.status,
      sphere,
      stateJurisdiction: stateMatch?.[1] || brand?.uf || undefined,
      portariaNumber: undefined,
      officialSource: d.source_name,
      officialSourceUrl: d.source_url,
      licenseDate: d.effective_at ? formatDateBR(d.effective_at) : undefined,
      verifiedAt: formatDateBR(d.verified_at),
      lastCheckedTime: formatTimeBR(d.verified_at),
      domains: [
        {
          host: d.host,
          isPrimary: true,
          registeredToCnpj: d.operator_cnpj ? formatCNPJ(d.operator_cnpj) : '',
          liveness: livenessFromApi(d.liveness),
          httpCode: d.liveness === 'NO_AR' ? 200 : 0,
          ipAddress: d.hosting_ip || undefined,
          asn: d.hosting_asn || undefined,
          hostingCountry: d.hosting_country || undefined,
          detectedAt: d.first_seen ? `${formatDateBR(d.first_seen)} ${formatTimeBR(d.first_seen)}` : undefined,
          registeredAt: d.registered_at ? formatDateBR(d.registered_at) : undefined,
          firstCertAt: d.first_cert_at ? formatDateBR(d.first_cert_at) : undefined,
        },
      ],
      evidenceSummary: d.evidence_snippet,
      cloneRiskNotice: d.status === 'NAO_AUTORIZADA_DETECTADA' || d.status === 'BLOQUEADA_ANATEL'
        ? 'Possível clone / lookalike — este domínio não consta nas listas oficiais de autorização.'
        : undefined,
      reputation: reputationScore != null ? {
        ...EMPTY_REPUTATION,
        reclameAquiScore: reclameAqui?.score ?? 0,
        complaintsCount: reclameAqui?.complaints ?? 0,
        solvedRatePercent: reclameAqui?.solved_rate ?? 0,
        ratingLabel: ratingLabelFromScore(reputationScore),
      } : EMPTY_REPUTATION,
      historicalChanges: (eventsByHost.get(d.host) || []).map((e) => ({
        date: e.date,
        description: e.summary,
        source: 'Histórico de status — Bet Legal',
      })),
    } satisfies BetEntity;
  });
}

/** Busca os eventos de status mais recentes (feed de "Mudanças"), via api/v1/changes. */
export async function fetchRealChanges(limit = 80): Promise<RegulatoryChange[] | null> {
  const data = await fetchJson<{ changes: ApiChangeRecord[] }>(`/api/v1/changes?limit=${limit}`);
  if (!data) return null;
  return data.changes.map((c) => ({
    id: c.id,
    timestamp: c.timestamp,
    date: c.date,
    time: c.time,
    type: c.type,
    brandName: c.brandName,
    host: c.host,
    cnpj: undefined,
    previousStatus: c.previousStatus || undefined,
    currentStatus: c.currentStatus,
    sourceDoc: c.sourceDoc,
    sourceUrl: '',
    summary: c.summary,
  } satisfies RegulatoryChange));
}

export interface UnauthorizedReach {
  noAr: number;
  foraDoAr: number;
  naoChecado: number;
}

/** GET /api/v1/unauthorized/reach no BFF. A conta (proibição de 25/09/2026) fica no servidor. */
export async function fetchUnauthorizedReach(): Promise<UnauthorizedReach | null> {
  const data = await apiGet<{ no_ar: number; fora_do_ar: number; nao_checado: number }>('/api/v1/unauthorized/reach');
  return {
    noAr: Number(data.no_ar || 0),
    foraDoAr: Number(data.fora_do_ar || 0),
    naoChecado: Number(data.nao_checado || 0),
  };
}

export interface DetectedReach {
  active: number;
  inactive: number;
  unchecked: number;
}

/** Destino técnico da última leitura de cada casa com autorização nacional ou estadual. */
export interface AuthorizedRedirect {
  oficial: number;
  intermediaria: number;
  outraPagina: number;
  foraDoAr: number;
  proprioSite: number;
  checkedAt: string | null;
}

export interface PublicStats {
  byStatus: Record<string, number>;
  detectedReach: DetectedReach;
  offlineAfterProhibition: number;
  jurisdiction: { state: string; count: number; pct: number }[];
  lastRunAt: string | null;
  authorizedRedirect: AuthorizedRedirect | null;
}

function toAuthorizedRedirect(raw: {
  oficial?: number;
  oficial_apos_intermediaria?: number;
  outra_pagina?: number;
  sem_resposta?: number;
  proprio_site?: number;
  checked_at?: string | null;
} | null | undefined): AuthorizedRedirect | null {
  if (!raw || typeof raw !== 'object') return null;
  const num = (value: unknown) => (Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0);
  const at = typeof raw.checked_at === 'string' && raw.checked_at ? raw.checked_at : null;
  return {
    oficial: num(raw.oficial),
    intermediaria: num(raw.oficial_apos_intermediaria),
    outraPagina: num(raw.outra_pagina),
    foraDoAr: num(raw.sem_resposta),
    proprioSite: num(raw.proprio_site),
    checkedAt: at,
  };
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const data = await apiGet<{
    stats?: {
      by_status?: Record<string, number>;
      detected_reach?: Partial<DetectedReach>;
      offline_after_prohibition?: number;
      last_successful_run?: { finished_at?: string } | null;
      authorized_redirect?: {
        oficial?: number;
        oficial_apos_intermediaria?: number;
        outra_pagina?: number;
        sem_resposta?: number;
        proprio_site?: number;
        checked_at?: string | null;
      };
    };
    jurisdiction?: { state: string; count: number; pct: number }[];
  }>('/api/v1/stats');
  const reach = data.stats?.detected_reach;
  return {
    byStatus: data.stats?.by_status || {},
    detectedReach: {
      active: Number(reach?.active || 0),
      inactive: Number(reach?.inactive || 0),
      unchecked: Number(reach?.unchecked || 0),
    },
    offlineAfterProhibition: Number(data.stats?.offline_after_prohibition || 0),
    jurisdiction: data.jurisdiction || [],
    lastRunAt: data.stats?.last_successful_run?.finished_at || null,
    authorizedRedirect: toAuthorizedRedirect(data.stats?.authorized_redirect),
  };
}

/** Fluxo do dia civil de Brasília. Mesma conta dos cards “detectadas hoje” e “voltaram ao ar hoje”. */
export async function fetchTodayUnauthorizedFlow(): Promise<{ detected: number; returned: number }> {
  const data = await apiGet<{
    detected?: { total?: number };
    returned?: { total?: number };
    total?: number;
  }>('/api/v1/unauthorized/hourly');
  return {
    detected: Number(data.detected?.total ?? data.total ?? 0),
    returned: Number(data.returned?.total ?? 0),
  };
}

export interface SeriesPoint {
  day: string;
  authorized: number;
  unauthorized: number;
  unauthorized_blocked: number;
  unauthorized_active: number;
  authorized_blocked: number;
}

export async function fetchTimeseries(): Promise<SeriesPoint[]> {
  const data = await apiGet<{ points?: SeriesPoint[] }>('/api/v1/timeseries');
  return data.points || [];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  image_url: string | null;
  published_at: string;
  topic: string;
  topic_label: string;
  source: { slug: string; name: string; kind: string; kind_label: string; url: string; paywall?: boolean };
  also_published_by: number;
}

export interface NewsTopic { id: string; label: string }
export interface NewsDay { date: string; count: number }

export async function fetchNews(filters?: { topic?: string; day?: string }): Promise<{ news: NewsItem[]; topics: NewsTopic[]; days: NewsDay[] }> {
  const params = new URLSearchParams();
  if (filters?.topic) params.set('topic', filters.topic);
  if (filters?.day) params.set('day', filters.day);
  const qs = params.toString();
  const data = await apiGet<{ news?: NewsItem[]; topics?: NewsTopic[]; days?: NewsDay[] }>(`/api/v1/news${qs ? `?${qs}` : ''}`);
  return { news: data.news || [], topics: data.topics || [], days: data.days || [] };
}

export async function fetchDomainRecord(host: string): Promise<BetEntity | null> {
  const data = await apiGet<{ record?: ApiDomainRecord; evidence?: { title?: string | null; fetched_at?: string } | null }>(
    `/api/v1/domains/${encodeURIComponent(host)}`
  );
  if (!data.record?.host) return null;
  const [entity] = mapDomains([data.record], new Map(), new Map());
  if (!entity) return null;
  if (data.evidence?.title) {
    entity.evidenceSummary = data.evidence.title;
  }
  return entity;
}

interface SearchHit {
  host: string;
  status: RegulatoryStatus;
  status_label?: string;
  active?: boolean | null;
  brand?: { name: string; slug: string } | null;
  operator?: { legal_name: string | null; cnpj: string | null } | null;
  verified_at?: string | null;
  first_seen_at?: string | null;
  hosting?: { ip?: string | null; asn?: number | null; cc?: string | null } | null;
  source?: { name?: string; url?: string } | null;
}

export async function fetchSearch(query: string): Promise<BetEntity[]> {
  const data = await apiGet<{ results?: SearchHit[] }>(`/api/v1/search?q=${encodeURIComponent(query)}`);
  return (data.results || []).map((hit) => {
    const record: ApiDomainRecord = {
      host: hit.host,
      brand_slug: hit.brand?.slug || hit.host,
      brand_name: hit.brand?.name || hit.host,
      operator_name: hit.operator?.legal_name || '',
      operator_cnpj: hit.operator?.cnpj || '',
      status: hit.status,
      detection_kind: null,
      liveness: hit.active === true ? 'NO_AR' : hit.active === false ? 'FORA_DO_AR' : 'NAO_CHECADO',
      first_seen: hit.first_seen_at || hit.verified_at || new Date().toISOString(),
      last_seen: hit.verified_at || hit.first_seen_at || new Date().toISOString(),
      verified_at: hit.verified_at || hit.first_seen_at || new Date().toISOString(),
      source_name: hit.source?.name || 'Verificação Bet Legal',
      source_url: hit.source?.url || 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas',
      evidence_snippet: hit.status_label || hit.status,
      hosting_ip: hit.hosting?.ip || undefined,
      hosting_asn: hit.hosting?.asn != null ? `AS${hit.hosting.asn}` : undefined,
      hosting_country: hit.hosting?.cc || undefined,
    };
    return mapDomains([record], new Map(), new Map())[0];
  });
}
