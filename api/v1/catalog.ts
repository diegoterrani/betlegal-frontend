// Réplica de apps/web/app/api/v1/catalog/route.ts (prod): domínios publicados + ranking de
// marcas, na mesma forma (domainRecord/brandRecords). Lê de public_domain_view_published e
// brand_ranking (views reais, liberadas por GRANT dedicado — ver migração
// anon_read_public_domain_view_published_and_brand_ranking) via a mesma chave anon do projeto.
import { getSupabaseServer, fetchAllRows } from '../_lib/supabaseServer.js';
import { ok, fail, domainRecord, brandRecords } from '../_lib/contract.js';

export default async function handler(req: any, res: any) {
  const client = getSupabaseServer();
  if (!client) { fail(res, 503, 'Supabase não configurado neste ambiente.'); return; }

  try {
    const [domainRows, rankingRows] = await Promise.all([
      fetchAllRows(
        (from: number, to: number) =>
          client.from('public_domain_view_published').select('*').order('host').range(from, to),
        8000
      ),
      fetchAllRows(
        (from: number, to: number) => client.from('brand_ranking').select('*').range(from, to),
        2000
      ),
    ]);

    const domains = domainRows.map(domainRecord);
    const brands = brandRecords(domains, rankingRows);
    ok(res, { domains, brands }, 60);
  } catch (err) {
    console.error('[api/v1/catalog]', err);
    fail(res, 500, 'Não foi possível montar o catálogo agora.');
  }
}
