import React, { useState } from 'react';
import { BetEntity, DomainInfo, RegulatoryStatus } from '../types';
import { STATUS_MAP, LIVENESS_MAP } from '../utils/statusMapping';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  AlertCircle,
  Server,
  History,
  Building,
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  FileWarning,
  ChevronDown,
} from 'lucide-react';

interface DomainDetailViewProps {
  entity: BetEntity;
  hostName: string;
  onBack: () => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onNavigate?: (path: string) => void;
}

type Tone = 'ok' | 'alerta' | 'risco' | 'neutro';

const TONE_STYLE: Record<Tone, { border: string; bg: string; icon: React.ReactNode }> = {
  ok: {
    border: 'color-mix(in srgb, var(--status-autorizada) 35%, transparent)',
    bg: 'color-mix(in srgb, var(--status-autorizada) 6%, transparent)',
    icon: <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--status-autorizada)' }} />,
  },
  alerta: {
    border: 'color-mix(in srgb, var(--status-atencao) 35%, transparent)',
    bg: 'color-mix(in srgb, var(--status-atencao) 6%, transparent)',
    icon: <AlertTriangle className="w-6 h-6" style={{ color: 'var(--status-atencao)' }} />,
  },
  risco: {
    border: 'color-mix(in srgb, var(--status-nao-autorizada) 35%, transparent)',
    bg: 'color-mix(in srgb, var(--status-nao-autorizada) 6%, transparent)',
    icon: <ShieldAlert className="w-6 h-6" style={{ color: 'var(--status-nao-autorizada)' }} />,
  },
  neutro: {
    border: 'var(--color-card-border)',
    bg: 'rgba(255,255,255,0.02)',
    icon: <HelpCircle className="w-6 h-6" style={{ color: 'var(--color-text-tertiary)' }} />,
  },
};

function getVerdict(status: RegulatoryStatus): { tone: Tone; headline: string; explanation: string } {
  switch (status) {
    case 'AUTORIZADA_NACIONAL':
    case 'AUTORIZADA_ESTADUAL':
    case 'DECISAO_JUDICIAL':
      return {
        tone: 'ok',
        headline: 'Sim, este site tem autorização.',
        explanation:
          'Está na lista oficial da Secretaria de Prêmios e Apostas (SPA/MF) ou de um órgão lotérico estadual, ou opera por decisão judicial, e pode oferecer apostas dentro do escopo da sua outorga.',
      };
    case 'REQUERIMENTO_EM_ANALISE':
      return {
        tone: 'alerta',
        headline: 'Requerimento em análise — ainda não há autorização vigente.',
        explanation:
          'A operadora protocolou pedido no SIGAP e aguarda decisão do órgão regulador. Isso não equivale a uma autorização concedida.',
      };
    case 'SUSPENSA_REVOGADA':
      return {
        tone: 'risco',
        headline: 'A autorização deste site foi suspensa ou revogada.',
        explanation: 'Este domínio já teve outorga, mas ela deixou de valer. Não deposite dinheiro aqui.',
      };
    case 'BLOQUEADA_ANATEL':
      return {
        tone: 'risco',
        headline: 'Este site consta em lista de bloqueio publicada.',
        explanation:
          'A SPA/MF encaminhou este domínio à Anatel para bloqueio no nível de DNS/IP junto às operadoras de telecomunicações.',
      };
    case 'INATIVA':
      return {
        tone: 'neutro',
        headline: 'Não encontramos atividade recente neste domínio.',
        explanation: 'O monitoramento não identificou operação em curso neste endereço na última verificação.',
      };
    case 'NAO_AUTORIZADA_DETECTADA':
    default:
      return {
        tone: 'risco',
        headline: 'Não encontramos autorização para este site.',
        explanation:
          'Ele não aparece em nenhuma das listas oficiais consultadas na última verificação. Não deposite dinheiro aqui.',
      };
  }
}

interface LookupRow {
  label: string;
  outcome: 'found' | 'absent' | 'unknown';
  detail?: string;
}

function buildLookupRows(entity: BetEntity): LookupRow[] {
  // A classificação encontrada/ausente usa entity.status (o campo que também define o
  // veredito e o badge) como fonte da verdade — entity.sphere vem do grant casado ao
  // domínio e pode não refletir o status quando um domínio tem mais de um grant (ex:
  // outorga nacional e um registro estadual antigo); usar status evita essa inconsistência.
  const isFederal = entity.status === 'AUTORIZADA_NACIONAL';
  const isEstadual = entity.status === 'AUTORIZADA_ESTADUAL';
  const isJudicial = entity.status === 'DECISAO_JUDICIAL';
  return [
    {
      label: 'Secretaria de Prêmios e Apostas (SPA/MF) — lista nacional',
      outcome: isFederal ? 'found' : 'absent',
      detail: isFederal ? entity.portariaNumber || entity.officialSource : undefined,
    },
    {
      label: `Loteria estadual${isEstadual && entity.stateJurisdiction ? ` — ${entity.stateJurisdiction}` : ''}`,
      outcome: isEstadual ? 'found' : 'absent',
      detail: isEstadual ? entity.portariaNumber : undefined,
    },
    {
      label: 'Decisão judicial em trâmite ou vigente',
      outcome: isJudicial ? 'found' : 'absent',
    },
  ];
}

const OUTCOME_ICON: Record<LookupRow['outcome'], React.ReactNode> = {
  found: <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-autorizada)' }} />,
  absent: <XCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-nao-autorizada)' }} />,
  unknown: <HelpCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-tertiary)' }} />,
};

export const DomainDetailView: React.FC<DomainDetailViewProps> = ({
  entity,
  hostName,
  onBack,
  onShare,
  onReport,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { user } = useUser();
  const isSuperAdmin = user?.role === 'super_admin';

  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [dossierGenerated, setDossierGenerated] = useState(false);

  const statusInfo = STATUS_MAP[entity.status] || STATUS_MAP.DESCONHECIDA;
  const isAuthorized = entity.status === 'AUTORIZADA_NACIONAL' || entity.status === 'AUTORIZADA_ESTADUAL' || entity.status === 'DECISAO_JUDICIAL';
  const verdict = getVerdict(entity.status);
  const tone = TONE_STYLE[verdict.tone];

  const currentDomain: DomainInfo =
    entity.domains.find(d => d.host === hostName) ||
    entity.domains[0] || {
      host: hostName,
      isPrimary: true,
      registeredToCnpj: entity.cnpj,
      liveness: 'ONLINE',
      httpCode: 200,
    };

  const livenessInfo = LIVENESS_MAP[currentDomain.liveness] || LIVENESS_MAP.ONLINE;
  const lookupRows = buildLookupRows(entity);
  const hasTech = Boolean(currentDomain.ipAddress || currentDomain.asn || currentDomain.hostingCountry);

  const handleCopyHost = () => {
    navigator.clipboard.writeText(currentDomain.host);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/dominio/${currentDomain.host}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:opacity-80"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight font-mono" style={{ color: 'var(--color-text-primary)' }}>
            {currentDomain.host}
          </h1>
          <button
            onClick={handleCopyHost}
            className="p-1.5 rounded transition-colors hover:bg-white/10 cursor-pointer"
            style={{ color: 'var(--color-text-tertiary)' }}
            title="Copiar domínio"
          >
            {copied ? <Check className="w-4 h-4" style={{ color: 'var(--status-autorizada)' }} /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={`https://${currentDomain.host}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Acessar o site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="text-sm mt-1.5" style={{ color: 'var(--color-text-secondary)' }}>
          Marca comercial: <strong style={{ color: 'var(--color-text-primary)' }}>{entity.brandName}</strong>
          {entity.legalName !== 'Não identificado' && (
            <>
              {' '}· Operado por <strong style={{ color: 'var(--color-text-primary)' }}>{entity.legalName}</strong>
              {entity.cnpj && <> · CNPJ <span className="font-mono">{entity.cnpj}</span></>}
            </>
          )}
        </div>
      </div>

      {/* Veredito */}
      <GlassCard className="p-6 sm:p-8 space-y-5" style={{ borderColor: tone.border, backgroundColor: tone.bg }}>
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
          Ficha do site · Veredito
        </div>

        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{tone.icon}</div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {verdict.headline}
            </h2>
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {verdict.explanation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wide uppercase border ${statusInfo.badgeClass}`}>
            {statusInfo.publicText.toUpperCase()}
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border"
            style={{ borderColor: 'var(--color-card-border)' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentDomain.liveness === 'ONLINE' ? 'var(--status-autorizada)' : 'var(--status-nao-autorizada)' }}
            />
            <span className={livenessInfo.textClass}>{livenessInfo.label}</span>
          </div>
        </div>

        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Verificado em {entity.verifiedAt} às {entity.lastCheckedTime}
        </div>

        {entity.officialSourceUrl && (
          <a
            href={entity.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Ver na fonte oficial
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
          <button
            onClick={() => onReport(entity, currentDomain.host)}
            className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--status-nao-autorizada)' }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Informar um erro
          </button>
          <button
            onClick={() => onNavigate?.('/avaliacoes')}
            className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            <Building className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />
            Ver a marca e as avaliações
          </button>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-white/5"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
          >
            {linkCopied ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--status-autorizada)' }} /> : <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />}
            {linkCopied ? 'Link copiado!' : 'Copiar link da ficha'}
          </button>
        </div>
      </GlassCard>

      {/* Aviso de risco / lookalike */}
      {entity.cloneRiskNotice && (
        <GlassCard
          className="p-4 text-xs flex items-start gap-3"
          style={{ backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--status-nao-autorizada) 35%, transparent)' }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--status-nao-autorizada)' }} />
          <div>
            <strong className="font-semibold block text-sm" style={{ color: 'var(--status-nao-autorizada)' }}>Aviso de Risco / Lookalike:</strong>
            <p className="mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{entity.cloneRiskNotice}</p>
          </div>
        </GlassCard>
      )}

      {/* Ações administrativas (restrito ao administrador geral) */}
      {isSuperAdmin && (
        <GlassCard className="p-5 space-y-3" style={{ borderColor: 'color-mix(in srgb, var(--status-dado-declarado) 30%, transparent)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--status-dado-declarado)' }}>
            <ShieldAlert className="w-4 h-4" />
            Ações administrativas
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAdminNote('Marcado como revisado pela administração.')}
              className="px-3 py-1.5 rounded text-xs font-medium border hover:bg-white/5 cursor-pointer"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            >
              Marcar como revisado
            </button>
            <button
              onClick={() => setAdminNote('Nova sincronização solicitada — resultado chega na próxima janela de verificação.')}
              className="px-3 py-1.5 rounded text-xs font-medium border hover:bg-white/5 cursor-pointer"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            >
              Forçar nova sincronização
            </button>
            {!isAuthorized && (
              <button
                onClick={() => setDossierGenerated(true)}
                disabled={dossierGenerated}
                className="px-3 py-1.5 rounded text-xs font-medium border hover:bg-white/5 cursor-pointer disabled:opacity-50 disabled:cursor-default flex items-center gap-1.5"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--status-nao-autorizada)' }}
              >
                <FileWarning className="w-3.5 h-3.5" />
                {dossierGenerated ? 'Dossiê gerado' : 'Gerar dossiê para a Anatel'}
              </button>
            )}
          </div>
          {adminNote && (
            <p className="text-xs" style={{ color: 'var(--status-autorizada)' }}>{adminNote}</p>
          )}
          <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
            Ações simuladas nesta prévia — não acionam o backend de produção.
          </p>
        </GlassCard>
      )}

      {/* Onde procuramos */}
      <GlassCard className="p-5 sm:p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
          Onde procuramos
        </h3>
        <div className="rounded border divide-y overflow-hidden text-xs" style={{ borderColor: 'var(--color-card-border)' }}>
          {lookupRows.map((row, idx) => (
            <div key={idx} className="p-3 flex items-center justify-between gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2">
                {OUTCOME_ICON[row.outcome]}
                <span style={{ color: 'var(--color-text-secondary)' }}>{row.label}</span>
              </div>
              {row.detail && (
                <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{row.detail}</span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Documento de origem */}
      <GlassCard className="p-5 sm:p-6 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
          Documento de origem
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {entity.evidenceSummary}
        </p>
        {entity.officialSourceUrl && (
          <a
            href={entity.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            {entity.officialSource}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </GlassCard>

      {/* Três datas deste endereço */}
      {!isAuthorized && (currentDomain.registeredAt || currentDomain.firstCertAt || currentDomain.detectedAt) && (
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
            Três datas deste endereço
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <dt className="font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Registro do domínio</dt>
              <dd className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{currentDomain.registeredAt || 'Não disponível'}</dd>
              <dd className="mt-1 leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>Quando o domínio foi registrado junto ao provedor, conforme WHOIS.</dd>
            </div>
            <div>
              <dt className="font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Primeiro certificado TLS</dt>
              <dd className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{currentDomain.firstCertAt || 'Não disponível'}</dd>
              <dd className="mt-1 leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>Primeira emissão de certificado SSL observada para este host.</dd>
            </div>
            <div>
              <dt className="font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>Primeira vez no radar</dt>
              <dd className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{currentDomain.detectedAt || 'Não disponível'}</dd>
              <dd className="mt-1 leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>Momento em que o monitoramento do Bet Legal passou a observar este domínio.</dd>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Histórico */}
      <GlassCard className="p-5 sm:p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
          <History className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
          Linha do Tempo e Modificações Averbadas
        </h3>
        {entity.historicalChanges.length > 0 ? (
          <div className="rounded border divide-y overflow-hidden text-xs" style={{ borderColor: 'var(--color-card-border)' }}>
            {entity.historicalChanges.map((change, idx) => (
              <div
                key={idx}
                className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <div>
                  <span className="font-bold mr-2" style={{ color: 'var(--color-text-primary)' }}>{change.date}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{change.description}</span>
                </div>
                <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>
                  {change.source}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhuma alteração de status registrada até o momento.</p>
        )}
      </GlassCard>

      {/* Detalhes técnicos (colapsável) */}
      {hasTech && (
        <GlassCard className="p-5 sm:p-6">
          <details>
            <summary
              className="text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer select-none"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4" style={{ color: 'var(--status-autorizada)' }} />
                Detalhes técnicos
              </span>
              <ChevronDown className="w-4 h-4" />
            </summary>
            <div className="mt-3 p-4 rounded border space-y-3 text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Endereço IP & Provedor ASN</span>
                <span className="font-mono font-medium block" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentDomain.ipAddress || 'Não resolvido'}
                </span>
                <span className="text-[11px] font-mono block" style={{ color: 'var(--color-text-tertiary)' }}>
                  {currentDomain.asn || 'Sem ASN'}
                </span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>País da hospedagem</span>
                <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentDomain.hostingCountry || 'Não identificado'}
                </span>
              </div>
              <div>
                <span className="block mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Certificado SSL / TLS</span>
                <span className="font-mono text-[11px] block" style={{ color: 'var(--color-text-secondary)' }}>
                  Emissor: {currentDomain.sslIssuer || 'N/A'}
                </span>
              </div>
            </div>
          </details>
        </GlassCard>
      )}

      {/* Disclaimer */}
      <div className="pt-2 text-[11px] leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
        <strong>Aviso de escopo:</strong> A exibição deste domínio e seu status factual são baseados nas informações públicas acessíveis na última janela de consulta. BetLegal não atua como órgão certificador, operadora ou afiliada.
      </div>

    </div>
  );
};
