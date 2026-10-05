import { supabase } from './supabaseClient';
import { BetEntity, BrandReputation, RegulatoryChange, RegulatoryStatus, LivenessStatus } from '../types';

/** O PostgREST do Supabase limita cada resposta a 100 linhas (max-rows do projeto), não importa
 * o que `.limit()` pede. Para trazer mais que isso, pagina com `.range()` até esgotar ou bater
 * no teto `maxRows`. Ainda usado por fetchUnauthorizedReach (consulta direta, sem endpoint próprio). */
async function fetchAllPages<T>(
  buildQuery: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: any }>,
  maxRows: number,
  pageSize = 100
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  while (rows.length < maxRows) {
    const to = Math.min(from + pageSize, maxRows) - 1;
    const { data, error } = await buildQuery(from, to);
    if (error) throw error;
    const page = data || [];
    rows.push(...page);
    if (page.length < to - from + 1) break; // última página
    from += pageSize;
  }
  return rows;
}

/** Leitura via a camada /api/v1 (funções serverless da Vercel, ver api/v1/*.ts), que porta a
 * lógica real de apps/web/lib/queries.ts e catalog.ts de prod — mesmos rótulos, mesma forma de
 * montar o dado. Nenhuma escrita passa por aqui. Se o endpoint falhar ou não existir (dev local
 * sem `vercel dev`, por exemplo), as funções abaixo retornam null e quem chama mantém o mock. */

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

  return catalog.domains.map((d) => {
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

/** 25/09/2026 18h de Brasília — anúncio da proibição. Mesma constante de
 * apps/web/lib/blocked-after-prohibition.ts em prod. Bloqueio Anatel anterior a esse
 * instante é a lista antiga (11/10/2024), não a detecção do Radar — fica fora do "no ar". */
const PROHIBITION_AT = '2026-09-25T18:00:00-03:00';

export interface UnauthorizedReach {
  noAr: number;
  foraDoAr: number;
  naoChecado: number;
}

/** Réplica, via PostgREST direto (sem endpoint próprio ainda), da query SQL de
 * apps/web/lib/identified-reach.ts: estoque de casas não autorizadas identificadas pelo Radar,
 * partido por conectividade. Entram domínios NAO_AUTORIZADA_DETECTADA, INATIVA vindos de
 * NAO_AUTORIZADA_DETECTADA, e BLOQUEADA_ANATEL só se o bloqueio aconteceu a partir da
 * proibição (não a lista antiga). */
export async function fetchUnauthorizedReach(): Promise<UnauthorizedReach | null> {
  const client = supabase;
  if (!client) return null;
  try {
    const [domains, inativaEvents, bloqueioEvents] = await Promise.all([
      fetchAllPages<{ id: number; active: boolean | null; status: RegulatoryStatus; discovered_via: string | null }>(
        (from, to) =>
          client
            .from('domain')
            .select('id, active, status, discovered_via')
            .eq('published', true)
            .in('status', ['NAO_AUTORIZADA_DETECTADA', 'INATIVA', 'BLOQUEADA_ANATEL'])
            .range(from, to) as unknown as PromiseLike<{ data: any[] | null; error: any }>,
        6000
      ),
      fetchAllPages<{ domain_id: number }>(
        (from, to) =>
          client
            .from('status_event')
            .select('domain_id')
            .eq('from_status', 'NAO_AUTORIZADA_DETECTADA')
            .eq('to_status', 'INATIVA')
            .range(from, to) as unknown as PromiseLike<{ data: any[] | null; error: any }>,
        3000
      ),
      fetchAllPages<{ domain_id: number; effective_at: string }>(
        (from, to) =>
          client
            .from('status_event')
            .select('domain_id, effective_at')
            .eq('to_status', 'BLOQUEADA_ANATEL')
            .range(from, to) as unknown as PromiseLike<{ data: any[] | null; error: any }>,
        3000
      ),
    ]);

    const inativaFromDetected = new Set(inativaEvents.map((e) => e.domain_id));

    const lastBloqueioAt = new Map<number, string>();
    for (const e of bloqueioEvents) {
      const current = lastBloqueioAt.get(e.domain_id);
      if (!current || e.effective_at > current) lastBloqueioAt.set(e.domain_id, e.effective_at);
    }

    const seedDatePattern = /^seed:anatel_(\d{4}-\d{2}-\d{2})/;

    const reach: UnauthorizedReach = { noAr: 0, foraDoAr: 0, naoChecado: 0 };

    for (const d of domains) {
      let included = false;
      if (d.status === 'NAO_AUTORIZADA_DETECTADA') {
        included = true;
      } else if (d.status === 'INATIVA') {
        included = inativaFromDetected.has(d.id);
      } else if (d.status === 'BLOQUEADA_ANATEL') {
        const latest = lastBloqueioAt.get(d.id);
        const seedMatch = d.discovered_via ? seedDatePattern.exec(d.discovered_via) : null;
        const blockedAt = latest || (seedMatch ? `${seedMatch[1]}T00:00:00-03:00` : null);
        included = blockedAt ? new Date(blockedAt).getTime() >= new Date(PROHIBITION_AT).getTime() : false;
      }
      if (!included) continue;
      if (d.active === true) reach.noAr += 1;
      else if (d.active === false) reach.foraDoAr += 1;
      else reach.naoChecado += 1;
    }

    return reach;
  } catch (err) {
    console.warn('[realData] Falha ao buscar alcance de não autorizadas do Supabase.', err);
    return null;
  }
}
