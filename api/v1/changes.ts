// Réplica de apps/web/app/api/v1/changes/route.ts (prod). listChanges() em prod lê de
// status_event JOIN domain JOIN brand — tabelas base já liberadas por anon_read_status_event /
// anon_read_domain_published / anon_read_brand, sem precisar de view nova.
import { getSupabaseServer, fetchAllRows } from '../_lib/supabaseServer.js';
import { ok, fail, STATUS_LABEL, humanizeNote, changeType } from '../_lib/contract.js';

export default async function handler(req: any, res: any) {
  const client = getSupabaseServer();
  if (!client) { fail(res, 503, 'Supabase não configurado neste ambiente.'); return; }

  try {
    const url = new URL(req.url, 'http://localhost');
    const since = url.searchParams.get('since');
    const validSince = since && /^\d{4}-\d{2}-\d{2}$/.test(since) ? since : undefined;
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 200) || 200, 1000);

    const rows = await fetchAllRows(
      (from: number, to: number) => {
        let q = client
          .from('status_event')
          .select('id, created_at, effective_at, from_status, to_status, actor, rule_id, note, domain:domain_id!inner(host, published, brand:brand_id(name, slug))')
          .neq('actor', 'rollback')
          .not('from_status', 'eq', 'to_status')
          .eq('domain.published', true);
        if (validSince) q = q.gte('created_at', validSince);
        return q.order('created_at', { ascending: false }).order('id', { ascending: false }).range(from, to);
      },
      limit
    );

    const mapped = rows.map((c: any) => {
      const dt = new Date(c.created_at);
      const text = humanizeNote(c.note, c.rule_id);
      const referenceAt = c.rule_id === 'review:approved' ? c.effective_at : c.created_at;
      const host = c.domain?.host ?? '';
      const brandName = c.domain?.brand?.name || host;
      return {
        id: String(c.id),
        timestamp: c.created_at,
        effectiveAt: referenceAt,
        date: dt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        time: dt.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }),
        type: changeType(c.from_status, c.to_status),
        brandName,
        host,
        previousStatus: c.from_status,
        currentStatus: c.to_status,
        sourceDoc: text || STATUS_LABEL[c.to_status],
        sourceUrl: `/dominio/${encodeURIComponent(host)}`,
        summary: text || `${c.from_status ?? 'início'} → ${STATUS_LABEL[c.to_status]}`,
      };
    });

    ok(res, {
      count: rows.length,
      changes: mapped,
      results: rows.map((c: any) => ({
        id: c.id,
        at: c.created_at,
        host: c.domain?.host ?? '',
        brand: c.domain?.brand?.name ?? null,
        from_status: c.from_status,
        to_status: c.to_status,
        to_status_label: STATUS_LABEL[c.to_status],
        actor: c.actor,
        rule_id: c.rule_id,
        note: c.note,
        url: `/dominio/${encodeURIComponent(c.domain?.host ?? '')}`,
      })),
    });
  } catch (err) {
    fail(res, 500, 'Não foi possível buscar as mudanças agora.');
  }
}
