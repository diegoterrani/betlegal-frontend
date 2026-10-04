// Réplica de apps/web/app/api/v1/authorized/route.ts (prod).
import { getSupabaseServer, fetchAllRows } from '../_lib/supabaseServer';
import { ok, fail, domainRecord } from '../_lib/contract';

const AUTHORIZED_STATUSES = ['AUTORIZADA_NACIONAL', 'AUTORIZADA_ESTADUAL', 'DECISAO_JUDICIAL', 'REQUERIMENTO_EM_ANALISE'];
const KIND_TO_FIELD: Record<string, string> = { NACIONAL: 'NACIONAL', JUDICIAL: 'JUDICIAL', ESTADUAL: 'ESTADUAL', REQUERIMENTO: 'REQUERIMENTO' };

export default async function handler(req: any, res: any) {
  const client = getSupabaseServer();
  if (!client) { fail(res, 503, 'Supabase não configurado neste ambiente.'); return; }

  try {
    const url = new URL(req.url, 'http://localhost');
    const kind = url.searchParams.get('kind');
    const uf = url.searchParams.get('uf');
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
    const pageSize = Math.min(200, 1000);

    const buildQuery = () => {
      let q = client.from('public_domain_view_published').select('*', { count: 'exact' }).in('status', AUTHORIZED_STATUSES);
      if (kind && KIND_TO_FIELD[kind]) q = q.eq('authorization_kind', KIND_TO_FIELD[kind]);
      if (uf) q = q.eq('uf', uf.slice(0, 2).toUpperCase());
      return q.order('brand_name', { ascending: true, nullsFirst: false }).order('host');
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
    fail(res, 500, 'Não foi possível buscar as autorizadas agora.');
  }
}
