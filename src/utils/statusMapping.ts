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
    badgeClass: 'text-[var(--status-autorizada)] bg-[var(--status-autorizada)]/10 border border-[var(--status-autorizada)]/30',
    description: 'Consta na lista definitiva/vigente da Secretaria de Prêmios e Apostas do Ministério da Fazenda.',
  },
  AUTORIZADA_ESTADUAL: {
    code: 'AUTORIZADA_ESTADUAL',
    publicText: 'Autorizada — estadual',
    shortLabel: 'Estadual',
    badgeClass: 'text-[var(--status-dado-declarado)] bg-[var(--status-dado-declarado)]/10 border border-[var(--status-dado-declarado)]/30',
    description: 'Consta em lista oficial de órgão lotérico estadual (ex: Loterj/RJ, Lotepar/PR, Lemg/MG).',
  },
  DECISAO_JUDICIAL: {
    code: 'DECISAO_JUDICIAL',
    publicText: 'Opera por decisão judicial',
    shortLabel: 'Decisão Judicial',
    badgeClass: 'text-[var(--status-decisao-judicial)] bg-[var(--status-decisao-judicial)]/10 border border-[var(--status-decisao-judicial)]/30',
    description: 'Atuação amparada por liminar ou sentença judicial em trâmite.',
  },
  REQUERIMENTO_EM_ANALISE: {
    code: 'REQUERIMENTO_EM_ANALISE',
    publicText: 'Requerimento em análise',
    shortLabel: 'Em Análise',
    badgeClass: 'text-[var(--status-atencao)] bg-[var(--status-atencao)]/10 border border-[var(--status-atencao)]/30',
    description: 'Submeteu pedido no SIGAP e cumpre período de instrução processual pelo órgão regulador.',
  },
  SUSPENSA_REVOGADA: {
    code: 'SUSPENSA_REVOGADA',
    publicText: 'Saiu da lista oficial / suspensa',
    shortLabel: 'Suspensa / Revogada',
    badgeClass: 'text-[var(--status-bloqueada)] bg-[var(--status-bloqueada)]/10 border border-[var(--status-bloqueada)]/30',
    description: 'Autorização anterior teve efeitos suspensos ou foi retirada das portarias vigentes.',
  },
  NAO_AUTORIZADA_DETECTADA: {
    code: 'NAO_AUTORIZADA_DETECTADA',
    publicText: 'Não consta nas listas de autorização consultadas',
    shortLabel: 'Não Autorizada',
    badgeClass: 'text-[var(--status-nao-autorizada)] bg-[var(--status-nao-autorizada)]/10 border border-[var(--status-nao-autorizada)]/30',
    description: 'Não foram localizados registros no SIGAP/SPA ou em loterias estaduais nas janelas consultadas.',
  },
  BLOQUEADA_ANATEL: {
    code: 'BLOQUEADA_ANATEL',
    publicText: 'Constou em lista de bloqueio publicada',
    shortLabel: 'Bloqueio Publicado',
    badgeClass: 'text-[var(--status-bloqueada)] bg-[var(--status-bloqueada)]/10 border border-[var(--status-bloqueada)]/30',
    description: 'Domínio listado em despacho formal da SPA/MF encaminhado à Anatel para restrição de acesso.',
  },
  INATIVA: {
    code: 'INATIVA',
    publicText: 'Inativa',
    shortLabel: 'Inativa',
    badgeClass: 'text-[var(--color-text-tertiary)] bg-[var(--color-text-tertiary)]/10 border border-[var(--color-text-tertiary)]/30',
    description: 'Operação descontinuada ou domínio sem atividades identificadas pelo monitoramento.',
  },
  DESCONHECIDA: {
    code: 'DESCONHECIDA',
    publicText: 'Em verificação',
    shortLabel: 'Em Verificação',
    badgeClass: 'text-[var(--color-text-secondary)] bg-[var(--color-text-secondary)]/10 border border-[var(--color-text-secondary)]/30',
    description: 'Informações em processo de consolidação e cruzamento cadastral.',
  },
};

export const LIVENESS_MAP: Record<LivenessStatus, { label: string; textClass: string; desc: string }> = {
  ONLINE: {
    label: 'Online (HTTP 200)',
    textClass: 'text-[var(--status-autorizada)]',
    desc: 'O domínio responde normalmente a requisições HTTP/S.',
  },
  UNRESPONSIVE: {
    label: 'Inacessível / Timeout',
    textClass: 'text-[var(--status-atencao)]',
    desc: 'Sem resposta ou conexão recusada na última sonda técnica.',
  },
  BLOCKED_DNS: {
    label: 'Bloqueado no DNS',
    textClass: 'text-[var(--status-nao-autorizada)]',
    desc: 'Endereço redirecionado para página de notificação ou sem resolução de IP pelos provedores.',
  },
  REDIRECT_DETECTED: {
    label: 'Redirecionamento Ativo',
    textClass: 'text-[var(--status-dado-declarado)]',
    desc: 'O domínio encaminha para outro host ou landing page externa.',
  },
  OFFLINE: {
    label: 'Offline (Host não encontrado)',
    textClass: 'text-[var(--color-text-tertiary)]',
    desc: 'Zona DNS vazia ou servidor desativado.',
  },
};
