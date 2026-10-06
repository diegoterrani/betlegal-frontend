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
