import { RegulatoryStatus, LivenessStatus } from '../types';

export interface StatusMeta {
  code: RegulatoryStatus;
  publicText: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
}

export const STATUS_MAP: Record<RegulatoryStatus, StatusMeta> = {
  AUTORIZADA_NACIONAL: {
    code: 'AUTORIZADA_NACIONAL',
    publicText: 'Autorizada — nacional, SPA/MF',
    shortLabel: 'Nacional (SPA/MF)',
    badgeClass: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80',
    description: 'Consta na lista definitiva/vigente da Secretaria de Prêmios e Apostas do Ministério da Fazenda.',
  },
  AUTORIZADA_ESTADUAL: {
    code: 'AUTORIZADA_ESTADUAL',
    publicText: 'Autorizada — estadual',
    shortLabel: 'Estadual',
    badgeClass: 'text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/80',
    description: 'Consta em lista oficial de órgão lotérico estadual (ex: Loterj/RJ, Lotepar/PR, Lemg/MG).',
  },
  DECISAO_JUDICIAL: {
    code: 'DECISAO_JUDICIAL',
    publicText: 'Opera por decisão judicial',
    shortLabel: 'Decisão Judicial',
    badgeClass: 'text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80',
    description: 'Atuação amparada por liminar ou sentença judicial em trâmite.',
  },
  REQUERIMENTO_EM_ANALISE: {
    code: 'REQUERIMENTO_EM_ANALISE',
    publicText: 'Requerimento em análise',
    shortLabel: 'Em Análise',
    badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80',
    description: 'Submeteu pedido no SIGAP e cumpre período de instrução processual pelo órgão regulador.',
  },
  SUSPENSA_REVOGADA: {
    code: 'SUSPENSA_REVOGADA',
    publicText: 'Saiu da lista oficial / suspensa',
    shortLabel: 'Suspensa / Revogada',
    badgeClass: 'text-orange-900 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/80',
    description: 'Autorização anterior teve efeitos suspensos ou foi retirada das portarias vigentes.',
  },
  NAO_AUTORIZADA_DETECTADA: {
    code: 'NAO_AUTORIZADA_DETECTADA',
    publicText: 'Não consta nas listas de autorização consultadas',
    shortLabel: 'Não Autorizada',
    badgeClass: 'text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80',
    description: 'Não foram localizados registros no SIGAP/SPA ou em loterias estaduais nas janelas consultadas.',
  },
  BLOQUEADA_ANATEL: {
    code: 'BLOQUEADA_ANATEL',
    publicText: 'Constou em lista de bloqueio publicada',
    shortLabel: 'Bloqueio Publicado',
    badgeClass: 'text-red-900 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80',
    description: 'Domínio listado em despacho formal da SPA/MF encaminhado à Anatel para restrição de acesso.',
  },
  INATIVA: {
    code: 'INATIVA',
    publicText: 'Inativa',
    shortLabel: 'Inativa',
    badgeClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    description: 'Operação descontinuada ou domínio sem atividades identificadas pelo monitoramento.',
  },
  DESCONHECIDA: {
    code: 'DESCONHECIDA',
    publicText: 'Em verificação',
    shortLabel: 'Em Verificação',
    badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700',
    description: 'Informações em processo de consolidação e cruzamento cadastral.',
  },
};

export const LIVENESS_MAP: Record<LivenessStatus, { label: string; textClass: string; desc: string }> = {
  ONLINE: {
    label: 'Online (HTTP 200)',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    desc: 'O domínio responde normalmente a requisições HTTP/S.',
  },
  UNRESPONSIVE: {
    label: 'Inacessível / Timeout',
    textClass: 'text-amber-700 dark:text-amber-400',
    desc: 'Sem resposta ou conexão recusada na última sonda técnica.',
  },
  BLOCKED_DNS: {
    label: 'Bloqueado no DNS',
    textClass: 'text-red-700 dark:text-red-400',
    desc: 'Endereço redirecionado para página de notificação ou sem resolução de IP pelos provedores.',
  },
  REDIRECT_DETECTED: {
    label: 'Redirecionamento Ativo',
    textClass: 'text-blue-700 dark:text-blue-400',
    desc: 'O domínio encaminha para outro host ou landing page externa.',
  },
  OFFLINE: {
    label: 'Offline (Host não encontrado)',
    textClass: 'text-slate-500 dark:text-slate-400',
    desc: 'Zona DNS vazia ou servidor desativado.',
  },
};
