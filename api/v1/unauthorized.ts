// Réplica de apps/web/app/api/v1/unauthorized/route.ts (prod).
import { getSupabaseServer, fetchAllRows } from '../_lib/supabaseServer';
import { ok, fail, domainRecord } from '../_lib/contract';

const ALLOWED_STATUS = ['NAO_AUTORIZADA_DETECTADA', 'BLOQUEADA_ANATEL', 'SUSPENSA_REVOGADA'];
const DEFAULT_STATUSES = ALLOWED_STATUS;

export default async function handler(req: any, res: any) {
  const client = getSupabaseServer();
  if (!client) { fail(res, 503, 'Supabase não configurado neste ambiente.'); return; }

  try {
    const url = new URL(req.url, 'http://localhost');
    const status = url.searchParams.get('status') ?? '';
    const activeParam = url.searchParams.get('active') ?? 'any';
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
    const pageSize = Math.min(200, 1000);

    const buildQuery = () => {
      let q = client
        .from('public_domain_view_published')
        .select('*', { count: 'exact' })
        .in('status', ALLOWED_STATUS.includes(status) ? [status] : DEFAULT_STATUSES);
      if (activeParam === 'true') q = q.eq('active', true);
      else if (activeParam === 'false') q = q.eq('active', false);
      else if (activeParam === 'null') q = q.is('active', null);
      return q
        .order('active', { ascending: false, nullsFirst: false })
        .order('active_checked_at', { ascending: false, nullsFirst: false })
        .order('status_changed_at', { ascending: false, nullsFirst: false })
        .order('host');
    };

    const offset = (page - 1) * pageSize;
    let total = 0;
    const rows = await fetchAllRows(
      async (from: number, to: number) => {
        const { data, error, count } = await buildQuery().range(offset + from, offset + to);
        if (count != null) total = count;
        return { data, error };
      },
      pageSize
    );

    ok(res, { total, page, page_size: pageSize, results: rows.map(domainRecord) });
  } catch (err) {
    fail(res, 500, 'Não foi possível buscar as não autorizadas agora.');
  }
}
