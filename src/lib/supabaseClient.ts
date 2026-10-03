import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Leitura read-only de produção (betlegal-prod), chave anon/publishable + RLS restrita a
 * 11 tabelas públicas. Nenhuma escrita deste app passa por aqui — login, avaliações e
 * mutações do painel continuam mockados em memória (ver UserContext/ReviewsContext). */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const hasSupabase = Boolean(supabase);
