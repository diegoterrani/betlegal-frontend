import { supabase } from './supabaseClient';
import { BetEntity, RegulatoryChange, RegulatoryStatus, LivenessStatus, RegulatorySphere } from '../types';

/** O PostgREST do Supabase limita cada resposta a 100 linhas (max-rows do projeto), não importa
 * o que `.limit()` pede. Para trazer mais que isso, pagina com `.range()` até esgotar ou bater
 * no teto `maxRows`. Usado por toda consulta que pode passar de 100 linhas. */
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

/** Leitura read-only do Supabase de produção (betlegal-prod), via chave anon + RLS
 * restrita a 11 tabelas públicas (ver migração anon_readonly_public_content). Nenhuma
 * escrita passa por aqui. Se o Supabase não estiver configurado (.env ausente) ou a
 * consulta falhar, as funções abaixo retornam null e quem chama mantém o mock. */

interface RawOperator {
  id: number;
  legal_name: string;
  cnpj: string;
}

interface RawBrand {
  id: number;
  name: string;
  slug: string;
  operator: RawOperator | null;
}

interface RawDomain {
  id: number;
  host: string;
  status: RegulatoryStatus;
  published: boolean;
  active: boolean | null;
  first_seen_at: string | null;
  last_verified_at: string | null;
  registered_at: string | null;
  first_cert_at: string | null;
  hosting_ip: string | null;
  hosting_asn: number | null;
  hosting_asn_org: string | null;
  hosting_cc: string | null;
  brand: RawBrand | null;
}

interface RawGrant {
  id: number;
  domain_id: number | null;
  brand_id: number | null;
  kind: 'NACIONAL' | 'ESTADUAL' | 'JUDICIAL' | 'REQUERIMENTO';
  uf: string | null;
  portaria: string | null;
  portaria_date: string | null;
  active: boolean;
}

interface RawStatusEvent {
  id: number;
  domain_id: number;
  from_status: RegulatoryStatus | null;
  to_status: RegulatoryStatus;
  note: string | null;
  effective_at: string;
  created_at: string;
}

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

/** Nome de exibição para domínios sem marca formal vinculada (a maioria dos clones/não
 * autorizados detectados) — deriva do próprio host, já que não há operador cadastrado. */
function displayNameFromHost(host: string): string {
  const base = host.replace(/^www\./, '').split('.')[0] || host;
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const KIND_LABEL: Record<RawGrant['kind'], { sphere: RegulatorySphere; source: string; sourceUrl: string }> = {
  NACIONAL: { sphere: 'federal', source: 'Secretaria de Prêmios e Apostas do Ministério da Fazenda (SPA/MF)', sourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas' },
  ESTADUAL: { sphere: 'estadual', source: 'Loteria estadual', sourceUrl: '' },
  JUDICIAL: { sphere: 'judicial', source: 'Decisão judicial', sourceUrl: '' },
  REQUERIMENTO: { sphere: 'nenhuma', source: 'SIGAP — requerimento em análise', sourceUrl: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas' },
};

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

function livenessFromActive(active: boolean | null): LivenessStatus {
  if (active === true) return 'ONLINE';
  if (active === false) return 'OFFLINE';
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

const DOMAIN_SELECT = 'id, host, status, published, active, first_seen_at, last_verified_at, registered_at, first_cert_at, hosting_ip, hosting_asn, hosting_asn_org, hosting_cc, brand:brand_id(id, name, slug, operator:operator_id(id, legal_name, cnpj))';

const AUTHORIZED_STATUSES: RegulatoryStatus[] = ['AUTORIZADA_NACIONAL', 'AUTORIZADA_ESTADUAL', 'DECISAO_JUDICIAL'];

/** Busca domínios publicados + marca + operadora + outorga + histórico recente, e monta
 * BetEntity[] (uma entidade por domínio — reflete o status real por domínio, não por marca).
 *
 * O catálogo autorizado (status em AUTHORIZED_STATUSES, ~250 linhas) é sempre trazido por
 * completo via paginação. O restante (bloqueadas, inativas, não autorizadas — ~4.800 linhas)
 * é uma amostra limitada a `sampleLimit`: trazer tudo exigiria dezenas de páginas a cada
 * carregamento da home, sem ganho real para validar a integração. */
export async function fetchRealEntities(sampleLimit = 900): Promise<BetEntity[] | null> {
  const client = supabase;
  if (!client) return null;
  try {
    const [authorizedDomains, sampleDomains, grants, events] = await Promise.all([
      fetchAllPages<RawDomain>(
        (from, to) =>
          client
            .from('domain')
            .select(DOMAIN_SELECT)
            .eq('published', true)
            .in('status', AUTHORIZED_STATUSES)
            .range(from, to) as unknown as PromiseLike<{ data: RawDomain[] | null; error: any }>,
        5000
      ),
      fetchAllPages<RawDomain>(
        (from, to) =>
          client
            .from('domain')
            .select(DOMAIN_SELECT)
            .eq('published', true)
            .not('status', 'in', `(${AUTHORIZED_STATUSES.join(',')})`)
            .order('last_verified_at', { ascending: false })
            .range(from, to) as unknown as PromiseLike<{ data: RawDomain[] | null; error: any }>,
        sampleLimit
      ),
      fetchAllPages<RawGrant>(
        (from, to) =>
          client
            .from('authorization_grant')
            .select('id, domain_id, brand_id, kind, uf, portaria, portaria_date, active')
            .range(from, to) as unknown as PromiseLike<{ data: RawGrant[] | null; error: any }>,
        1000
      ),
      fetchAllPages<RawStatusEvent>(
        (from, to) =>
          client
            .from('status_event')
            .select('id, domain_id, from_status, to_status, note, effective_at, created_at')
            .order('effective_at', { ascending: false })
            .range(from, to) as unknown as PromiseLike<{ data: RawStatusEvent[] | null; error: any }>,
        600
      ),
    ]);

    const domains = [...authorizedDomains, ...sampleDomains];

    const grantByDomain = new Map<number, RawGrant>();
    for (const g of grants) {
      if (g.domain_id == null) continue;
      const existing = grantByDomain.get(g.domain_id);
      if (!existing || (g.active && !existing.active)) grantByDomain.set(g.domain_id, g);
    }

    const eventsByDomain = new Map<number, RawStatusEvent[]>();
    for (const e of events) {
      const list = eventsByDomain.get(e.domain_id) || [];
      list.push(e);
      eventsByDomain.set(e.domain_id, list);
    }

    const entities: BetEntity[] = domains.map((d) => {
        // A maioria dos domínios não autorizados/clones não tem marca formal vinculada
        // (não são operadores cadastrados) — nesse caso o host é o único identificador.
        const brand = d.brand || null;
        const operator = brand?.operator || null;
        const grant = grantByDomain.get(d.id);
        const kindInfo = grant ? KIND_LABEL[grant.kind] : null;
        const domainEvents = (eventsByDomain.get(d.id) || []).slice(0, 8);

        return {
          id: `domain-${d.id}`,
          slug: slugifyHost(d.host),
          brandName: brand?.name || displayNameFromHost(d.host),
          tradeNames: [],
          legalName: operator?.legal_name || 'Não identificado',
          cnpj: operator ? formatCNPJ(operator.cnpj) : '',
          status: d.status,
          statusText: STATUS_TEXT[d.status] || d.status,
          sphere: kindInfo?.sphere || 'nenhuma',
          stateJurisdiction: grant?.uf?.trim() || undefined,
          portariaNumber: grant?.portaria || undefined,
          officialSource: kindInfo?.source || 'Fontes públicas consultadas',
          officialSourceUrl: kindInfo?.sourceUrl || '',
          licenseDate: formatDateBR(grant?.portaria_date) || undefined,
          verifiedAt: formatDateBR(d.last_verified_at) || formatDateBR(d.first_seen_at),
          lastCheckedTime: formatTimeBR(d.last_verified_at),
          domains: [
            {
              host: d.host,
              isPrimary: true,
              registeredToCnpj: operator ? formatCNPJ(operator.cnpj) : '',
              liveness: livenessFromActive(d.active),
              httpCode: d.active ? 200 : 0,
              ipAddress: d.hosting_ip || undefined,
              asn: d.hosting_asn ? `AS${d.hosting_asn}${d.hosting_asn_org ? ` (${d.hosting_asn_org})` : ''}` : undefined,
              hostingProvider: d.hosting_asn_org || undefined,
              hostingCountry: d.hosting_cc || undefined,
              detectedAt: d.first_seen_at ? `${formatDateBR(d.first_seen_at)} ${formatTimeBR(d.first_seen_at)}` : undefined,
              registeredAt: d.registered_at ? formatDateBR(d.registered_at) : undefined,
              firstCertAt: d.first_cert_at ? formatDateBR(d.first_cert_at) : undefined,
            },
          ],
          evidenceSummary: grant?.portaria
            ? `Registro ${grant.portaria}${grant.portaria_date ? `, de ${formatDateBR(grant.portaria_date)}` : ''}, conforme fonte oficial.`
            : 'Classificação com base no cruzamento das fontes públicas consultadas pelo Bet Legal.',
          cloneRiskNotice: d.status === 'NAO_AUTORIZADA_DETECTADA' || d.status === 'BLOQUEADA_ANATEL'
            ? 'Possível clone / lookalike — este domínio não consta nas listas oficiais de autorização.'
            : undefined,
          reputation: EMPTY_REPUTATION,
          historicalChanges: domainEvents.map((e) => ({
            date: formatDateBR(e.effective_at),
            description: e.note || `Status alterado${e.from_status ? ` de ${STATUS_TEXT[e.from_status] || e.from_status}` : ''} para ${STATUS_TEXT[e.to_status] || e.to_status}.`,
            source: 'Histórico de status — Bet Legal',
          })),
        } satisfies BetEntity;
      });

    return entities;
  } catch (err) {
    console.warn('[realData] Falha ao buscar entidades reais do Supabase, mantendo mock.', err);
    return null;
  }
}

/** Busca os eventos de status mais recentes (feed de "Mudanças"). */
export async function fetchRealChanges(limit = 80): Promise<RegulatoryChange[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('status_event')
      .select('id, domain_id, from_status, to_status, note, effective_at, domain:domain_id(host, brand:brand_id(name, operator:operator_id(cnpj)))')
      .order('effective_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    const rows = (data || []) as unknown as (RawStatusEvent & { domain: { host: string; brand: { name: string; operator: { cnpj: string } | null } | null } | null })[];

    return rows
      .filter((r) => r.domain)
      .map((r) => {
        const type: RegulatoryChange['type'] =
          r.to_status === 'BLOQUEADA_ANATEL' ? 'block_anatel'
          : !r.from_status ? 'inclusion'
          : r.to_status === 'SUSPENSA_REVOGADA' ? 'removal'
          : 'status_change';
        const host = r.domain!.host;
        const brand = r.domain!.brand;
        return {
          id: `status_event-${r.id}`,
          timestamp: r.effective_at,
          date: formatDateBR(r.effective_at),
          time: formatTimeBR(r.effective_at),
          type,
          brandName: brand?.name || displayNameFromHost(host),
          host,
          cnpj: brand?.operator?.cnpj ? formatCNPJ(brand.operator.cnpj) : undefined,
          previousStatus: r.from_status || undefined,
          currentStatus: r.to_status,
          sourceDoc: 'Histórico de status — Bet Legal',
          sourceUrl: '',
          summary: r.note || `${host} passou para "${STATUS_TEXT[r.to_status] || r.to_status}".`,
        } satisfies RegulatoryChange;
      });
  } catch (err) {
    console.warn('[realData] Falha ao buscar mudanças reais do Supabase, mantendo mock.', err);
    return null;
  }
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

/** Réplica, via PostgREST, da query SQL de apps/web/lib/identified-reach.ts: estoque de
 * casas não autorizadas identificadas pelo Radar, partido por conectividade. Entram domínios
 * NAO_AUTORIZADA_DETECTADA, INATIVA vindos de NAO_AUTORIZADA_DETECTADA, e BLOQUEADA_ANATEL
 * só se o bloqueio aconteceu a partir da proibição (não a lista antiga). */
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
