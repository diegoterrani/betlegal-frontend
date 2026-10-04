// Porta fiel do contrato real de prod (apps/web/lib/status.ts, catalog.ts, change-note.ts,
// entity.ts, api.ts) — mesmos rótulos, mesma forma de montar o dado. Fonte: origin/main, lida
// via `git show` em 2026-10-04.

export const API_VERSION = 'v1';

export const DISCLAIMER =
  'Informação regulatória baseada em fontes públicas (SPA/MF, loterias estaduais, Anatel) e em verificações automatizadas com revisão humana. Não é aconselhamento jurídico. Em caso de divergência, a lista oficial da SPA/MF prevalece. Este site não tem vínculo com casas de apostas, não recebe comissões e não recomenda apostar.';

export const STATUS_LABEL: Record<string, string> = {
  AUTORIZADA_NACIONAL: 'Autorizada (nacional, SPA/MF)',
  AUTORIZADA_ESTADUAL: 'Autorizada (estadual)',
  DECISAO_JUDICIAL: 'Opera por decisão judicial',
  REQUERIMENTO_EM_ANALISE: 'Requerimento em análise',
  SUSPENSA_REVOGADA: 'Saiu da lista oficial / suspensa',
  NAO_AUTORIZADA_DETECTADA: 'Não consta nas listas de autorização',
  BLOQUEADA_ANATEL: 'Constou em lista de bloqueio (Anatel)',
  INATIVA: 'Inativa',
  DESCONHECIDA: 'Em verificação',
};

export const SITE_SOURCE = 'Verificação Bet Legal';
export const OFFICIAL_DIFF_SOURCE = 'Comparação com a lista oficial';
export const SPA_URL = 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas';

export interface DomainViewRow {
  id: number;
  host: string;
  status: string;
  published: boolean;
  contested: boolean;
  confidence: number | null;
  last_verified_at: string | null;
  status_changed_at: string | null;
  first_seen_at: string;
  active: boolean | null;
  active_checked_at: string | null;
  hosting_ip: string | null;
  hosting_asn: number | null;
  hosting_asn_org: string | null;
  hosting_cc: string | null;
  brand_id: number | null;
  brand_name: string | null;
  brand_slug: string | null;
  legal_name: string | null;
  cnpj: string | null;
  authorization_kind: string | null;
  uf: string | null;
  portaria: string | null;
  portaria_date: string | null;
  reference: string | null;
  detection_rule: string | null;
  detection_target: string | null;
  registered_at: string | null;
  first_cert_at: string | null;
  provenance_checked_at: string | null;
}

export type DetectionKind = 'DOMINIO_DE_OPERADOR_AUTORIZADO' | null;

export function detectionKindOf(d: Pick<DomainViewRow, 'status' | 'detection_rule'>): DetectionKind {
  if (d.status !== 'NAO_AUTORIZADA_DETECTADA') return null;
  return (d.detection_rule ?? '').startsWith('R8_') ? 'DOMINIO_DE_OPERADOR_AUTORIZADO' : null;
}

export type LivenessStatus = 'NO_AR' | 'FORA_DO_AR' | 'NAO_CHECADO';

export function livenessOf(active: boolean | null): LivenessStatus {
  if (active === true) return 'NO_AR';
  if (active === false) return 'FORA_DO_AR';
  return 'NAO_CHECADO';
}

function sourceName(d: DomainViewRow): string {
  switch (d.status) {
    case 'AUTORIZADA_NACIONAL': return 'SPA/MF - planilha de autorizações';
    case 'DECISAO_JUDICIAL': return 'SPA/MF - autorização por decisão judicial';
    case 'AUTORIZADA_ESTADUAL': return `Loteria estadual (${d.uf ?? 'UF'})`;
    case 'REQUERIMENTO_EM_ANALISE': return 'SPA/MF - requerimentos';
    case 'BLOQUEADA_ANATEL': return 'Anatel - lista de bloqueio';
    case 'SUSPENSA_REVOGADA': return OFFICIAL_DIFF_SOURCE;
    default: return SITE_SOURCE;
  }
}

function unauthorizedDomainEvidence(target: string | null, brandName: string | null): string {
  const ofWho = brandName ? `da casa autorizada ${brandName}` : 'de uma casa autorizada';
  const asWho = brandName ? `a casa autorizada ${brandName}` : 'uma casa autorizada';
  return target
    ? `Este endereço redireciona para ${target}, domínio ${ofWho}, mas não consta na lista oficial da SPA/MF — a autorização vale para o domínio .bet.br listado, não para o operador.`
    : `Este endereço se apresenta como ${asWho} (cita o CNPJ dela), mas não consta na lista oficial da SPA/MF — a autorização vale para o domínio .bet.br listado, não para o operador.`;
}

export function domainRecord(d: DomainViewRow) {
  const official = sourceName(d);
  const kind = detectionKindOf(d);
  const evidence = kind === 'DOMINIO_DE_OPERADOR_AUTORIZADO'
    ? unauthorizedDomainEvidence(d.detection_target, d.brand_name)
    : d.status === 'NAO_AUTORIZADA_DETECTADA'
      ? 'Não consta nas listas de autorização consultadas na data da verificação.'
      : `${STATUS_LABEL[d.status]}. Fonte: ${official}.`;
  const sourceUrl = d.reference?.startsWith('http') ? d.reference : SPA_URL;
  return {
    host: d.host,
    brand_slug: d.brand_slug || d.host,
    brand_name: d.brand_name || d.host,
    operator_name: d.legal_name || '',
    operator_cnpj: d.cnpj || '',
    status: d.status,
    detection_kind: kind,
    detection_target: kind ? d.detection_target || undefined : undefined,
    registered_at: d.registered_at || undefined,
    first_cert_at: d.first_cert_at || undefined,
    provenance_checked: Boolean(d.provenance_checked_at),
    liveness: livenessOf(d.active),
    first_seen: d.first_seen_at,
    last_seen: d.active_checked_at || d.last_verified_at || d.first_seen_at,
    verified_at: d.last_verified_at || d.first_seen_at,
    effective_at: d.portaria_date || d.status_changed_at || undefined,
    created_at: d.first_seen_at,
    source_name: d.portaria || official,
    source_url: sourceUrl,
    evidence_snippet: evidence,
    hosting_ip: d.hosting_ip || undefined,
    hosting_asn: d.hosting_asn != null ? `AS${d.hosting_asn}` : undefined,
    hosting_country: d.hosting_cc || undefined,
  };
}

function brandStatus(kind: string | null): string {
  if (kind === 'ESTADUAL') return 'AUTORIZADA_ESTADUAL';
  if (kind === 'JUDICIAL') return 'DECISAO_JUDICIAL';
  return 'AUTORIZADA_NACIONAL';
}

export interface RankingViewRow {
  brand_id: number;
  operator_id: number | null;
  name: string;
  slug: string;
  legal_name: string | null;
  cnpj: string | null;
  authorization_kind: string | null;
  uf: string | null;
  avg_safety: string | number | null;
  avg_payout: string | number | null;
  avg_support: string | number | null;
  avg_speed: string | number | null;
  avg_responsible: string | number | null;
  avg_total: string | number | null;
  review_count: number;
  ra_score: string | number | null;
  ra_complaints: number | null;
  ra_solved_percent: string | number | null;
  ra_url: string | null;
  ra_fetched_at: string | null;
}

export function brandRecords(
  domains: { brand_slug: string; host: string; detection_kind?: DetectionKind }[],
  ranking: RankingViewRow[]
) {
  const hosts = new Map<string, string[]>();
  const unauthorized = new Map<string, string[]>();
  for (const d of domains) {
    if (d.detection_kind === 'DOMINIO_DE_OPERADOR_AUTORIZADO') {
      const list = unauthorized.get(d.brand_slug) || [];
      list.push(d.host);
      unauthorized.set(d.brand_slug, list);
      continue;
    }
    const list = hosts.get(d.brand_slug) || [];
    list.push(d.host);
    hosts.set(d.brand_slug, list);
  }
  return ranking.map((r) => {
    const count = Number(r.review_count || 0);
    const hasCommunity = count > 0 && r.avg_total != null;
    return {
      slug: r.slug,
      name: r.name,
      operator_name: r.legal_name || '',
      operator_cnpj: r.cnpj || '',
      status: brandStatus(r.authorization_kind),
      authorization_type: r.authorization_kind === 'ESTADUAL' ? 'ESTADUAL' : r.authorization_kind === 'JUDICIAL' ? 'DECISAO_JUDICIAL' : 'NACIONAL',
      uf: r.uf || undefined,
      domains: hosts.get(r.slug) || [],
      unauthorized_domains: unauthorized.get(r.slug) || [],
      official_source: 'Listas públicas de autorização',
      official_url: SPA_URL,
      verified_at: r.ra_fetched_at || '',
      community_rating: hasCommunity ? {
        score: Number(r.avg_total),
        count,
        criteria: {
          security: Number(r.avg_safety || 0),
          payout: Number(r.avg_payout || 0),
          support: Number(r.avg_support || 0),
          speed: Number(r.avg_speed || 0),
          responsible_gaming: r.avg_responsible == null ? undefined : Number(r.avg_responsible),
        },
      } : undefined,
      reclame_aqui: r.ra_score == null ? null : {
        score: Number(r.ra_score),
        complaints: Number(r.ra_complaints || 0),
        solved_rate: r.ra_solved_percent == null ? 0 : Number(r.ra_solved_percent),
        last_sync: r.ra_fetched_at || '',
        url: r.ra_url || '',
      },
    };
  });
}

// --- changes (status_event) ---

const LIST_LABEL: Record<string, string> = {
  spa_national: 'lista nacional da SPA/MF',
  spa_judicial: 'lista de autorizações judiciais da SPA/MF',
  state_rj: 'lista da Loterj (RJ)',
  state_pr: 'lista da Lottopar (PR)',
  state_pb: 'lista da Lotep (PB)',
};

function listLabel(sourceId: string): string {
  return LIST_LABEL[sourceId] ?? 'lista oficial';
}

const DETECTED_NOTE = 'Detectado pela varredura do Bet Legal: não consta nas listas oficiais de autorização.';

export function humanizeNote(note: string | null | undefined, ruleId?: string | null): string {
  const text = (note ?? '').trim();
  const rule = (ruleId ?? '').trim();

  const removedByRule = /^official_removed:([a-z_]+)$/.exec(rule);
  const removedByNote = /^saiu da lista ([a-z_]+)$/.exec(text);
  const removed = removedByRule?.[1] ?? removedByNote?.[1];
  if (removed) return `Deixou de constar na ${listLabel(removed)}.`;

  if (rule === 'R4_confidence_below_40') return 'Confiança abaixo de 40%: detecção descartada, sem publicação.';
  if (rule === 'R4_low_confidence') return 'Em análise: detectado pela varredura, aguardando revisão.';
  if (rule === 'R4_terceiro_suspeito') return 'Em análise: a página parece falar sobre casas de apostas (afiliado, review ou lista de links), não ser uma. Aguardando revisão.';
  if (rule === 'R8_dominio_nao_autorizado') {
    const target = /redireciona para ([a-z0-9.-]+)/i.exec(text)?.[1];
    return target
      ? `Domínio não autorizado de operador autorizado: redireciona para ${target}, mas este endereço não consta na lista oficial da SPA/MF.`
      : 'Domínio não autorizado de operador autorizado: cita o CNPJ de uma casa autorizada, mas este endereço não consta na lista oficial da SPA/MF.';
  }
  if (rule === 'R3_high_confidence' || rule === 'R3_foreign_accessible' || rule === 'R3_confidence_above_80' || /^llm=[\d.]+, sinais=\d+/.test(text)) return DETECTED_NOTE;
  if (rule === 'R2_bet_br_not_listed') return 'Domínio .bet.br que não consta na lista oficial da SPA/MF.';
  if (rule === 'R5_inactive') return 'Site sem conteúdo em 3 ou mais verificações seguidas.';
  if (rule === 'seed_official_block' && !text) return 'Consta em lista de bloqueio da Anatel.';

  return text;
}

export function changeType(from: string | null, to: string): 'inclusion' | 'removal' | 'status_change' | 'block_anatel' | 'license_update' {
  if (to === 'BLOQUEADA_ANATEL') return 'block_anatel';
  if (!from && (to.startsWith('AUTORIZADA') || to === 'DECISAO_JUDICIAL')) return 'inclusion';
  if (to === 'SUSPENSA_REVOGADA' || to === 'INATIVA') return 'removal';
  if (from && (to.startsWith('AUTORIZADA') || to === 'DECISAO_JUDICIAL')) return 'license_update';
  return 'status_change';
}

// --- envelope ---

export function ok(res: any, data: unknown, cacheSeconds = 60) {
  res.setHeader('Cache-Control', `public, s-maxage=${cacheSeconds}, stale-while-revalidate=600`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    api_version: API_VERSION,
    generated_at: new Date().toISOString(),
    disclaimer: DISCLAIMER,
    ...(data as object),
  });
}

export function fail(res: any, status: number, message: string) {
  res.status(status).json({ api_version: API_VERSION, error: message });
}
