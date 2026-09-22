/**
 * BetLegal Brand System v1.0 - Types & Taxonomy
 * Regra fundamental: "Legal é a pergunta. Evidência é a resposta."
 */

export type RegulatoryStatus =
  | 'AUTORIZADA_NACIONAL'
  | 'AUTORIZADA_ESTADUAL'
  | 'DECISAO_JUDICIAL'
  | 'REQUERIMENTO_EM_ANALISE'
  | 'SUSPENSA_REVOGADA'
  | 'NAO_AUTORIZADA_DETECTADA'
  | 'BLOQUEADA_ANATEL'
  | 'INATIVA'
  | 'DESCONHECIDA';

export type LivenessStatus =
  | 'ONLINE'
  | 'UNRESPONSIVE'
  | 'BLOCKED_DNS'
  | 'REDIRECT_DETECTED'
  | 'OFFLINE';

export type RegulatorySphere = 'federal' | 'estadual' | 'judicial' | 'nenhuma';

export interface DomainInfo {
  host: string;
  isPrimary: boolean;
  registeredToCnpj: string;
  liveness: LivenessStatus;
  httpCode: number;
  sslIssuer?: string;
  sslValidUntil?: string;
  ipAddress?: string;
  asn?: string;
  hostingProvider?: string;
  anatelBlockOrder?: string;
  detectedAt?: string;
}

export interface BrandReputation {
  reclameAquiScore: number; // 0 to 10
  complaintsCount: number;
  solvedRatePercent: number;
  answeredRatePercent: number;
  avgResponseHours: number;
  proconNotificationsCount: number;
  ratingLabel: 'Ótimo' | 'Bom' | 'Regular' | 'Ruim' | 'Não Recomendado' | 'Sem índice';
}

export interface BetEntity {
  id: string;
  slug: string;
  brandName: string;
  tradeNames: string[];
  legalName: string;
  cnpj: string;
  status: RegulatoryStatus;
  statusText: string;
  sphere: RegulatorySphere;
  stateJurisdiction?: string; // RJ, PR, MG, etc.
  sigapProtocol?: string;
  portariaNumber?: string;
  officialSource: string;
  officialSourceUrl: string;
  licenseDate?: string;
  verifiedAt: string;
  lastCheckedTime: string;
  domains: DomainInfo[];
  evidenceSummary: string;
  cloneRiskNotice?: string;
  reputation: BrandReputation;
  historicalChanges: {
    date: string;
    description: string;
    source: string;
  }[];
}

export interface RegulatoryChange {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  type: 'inclusion' | 'removal' | 'status_change' | 'block_anatel' | 'license_update';
  brandName: string;
  host?: string;
  cnpj?: string;
  previousStatus?: RegulatoryStatus;
  currentStatus: RegulatoryStatus;
  sourceDoc: string;
  sourceUrl: string;
  summary: string;
}

export interface ContestationTicket {
  id: string;
  type: 'contestacao_status' | 'denuncia_clone' | 'atualizacao_dados' | 'outro';
  brandOrDomain: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'operador' | 'usuario' | 'orgao_publico' | 'advogado';
  justification: string;
  evidenceLinks: string;
  createdAt: string;
  status: 'recebido' | 'em_analise' | 'concluido';
}
