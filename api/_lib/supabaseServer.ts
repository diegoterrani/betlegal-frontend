// Client Supabase do LADO DO SERVIDOR (funções serverless da Vercel). Usa a mesma chave anon
// (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY) já configurada no projeto — RLS continua valendo
// normalmente, só muda ONDE a consulta roda (servidor, não mais o navegador do visitante).
import { createClient } from '@supabase/supabase-js';

let cached: any = null;

export function getSupabaseServer() {
  if (cached) return cached;
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

/** O PostgREST deste projeto limita cada resposta a 100 linhas (max-rows), não importa o que
 * .range()/.limit() peça. Pagina até esgotar ou bater em `maxRows`. */
export async function fetchAllRows(
  buildQuery: (from: number, to: number) => PromiseLike<{ data: any[] | null; error: any }>,
  maxRows: number,
  pageSize = 100
): Promise<any[]> {
  const rows: any[] = [];
  let from = 0;
  while (rows.length < maxRows) {
    const to = Math.min(from + pageSize, maxRows) - 1;
    const { data, error } = await buildQuery(from, to);
    if (error) throw error;
    const page = data || [];
    rows.push(...page);
    if (page.length < to - from + 1) break;
    from += pageSize;
  }
  return rows;
}
