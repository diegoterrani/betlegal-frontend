import React from 'react';
import { ShieldCheck, ExternalLink, Clock, History } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

const WINDOWS = '4 vezes ao dia (00h, 06h, 12h e 18h, horário de Brasília)';

interface Source {
  name: string;
  scope: string;
  url: string;
  frequency: string;
  docRef: string;
  lastChecked: string;
}

const SOURCES: Source[] = [
  {
    name: 'Secretaria de Prêmios e Apostas (SPA/MF)',
    scope: 'Nacional',
    url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/transparencia-ativa-processos-de-autorizacao-de-apostas-de-quota-fixa/empresas-autorizadas',
    frequency: WINDOWS,
    docRef: 'Empresas autorizadas (Lei nº 14.790/2023). A planilha judicial entra na mesma conferência, com a data dela.',
    lastChecked: 'Lista conferida hoje às 18h',
  },
  {
    name: 'SPA/MF — autorizadas por decisão judicial',
    scope: 'Nacional · judicial',
    url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/transparencia-ativa-processos-de-autorizacao-de-apostas-de-quota-fixa/autorizadas-por-determinacao-judicial',
    frequency: WINDOWS,
    docRef: 'Planilha de empresas autorizadas por determinação judicial.',
    lastChecked: 'Lista conferida hoje às 18h',
  },
  {
    name: 'Loterj (Rio de Janeiro)',
    scope: 'Estadual · RJ',
    url: 'https://www.loterj.rj.gov.br/licenciadas.php',
    frequency: WINDOWS,
    docRef: 'Lista de licenciadas publicada pela Loterj.',
    lastChecked: 'Lista conferida hoje às 18h',
  },
  {
    name: 'Lotep (Paraíba)',
    scope: 'Estadual · PB',
    url: 'https://lotep.pb.gov.br/aposta-de-quota-fixa',
    frequency: WINDOWS,
    docRef: 'Operadores de aposta de quota fixa publicados pela Lotep.',
    lastChecked: 'Lista conferida hoje às 18h',
  },
  {
    name: 'Lottopar (Paraná)',
    scope: 'Estadual · PR',
    url: 'https://www.lottopar.pr.gov.br/Pagina/Operadores-Autorizados-Aposta-de-Quota-Fixa',
    frequency: WINDOWS,
    docRef: 'Operadores autorizados publicados pela Lottopar.',
    lastChecked: 'Lista conferida hoje às 18h',
  },
  {
    name: 'Anatel',
    scope: 'Bloqueios',
    url: 'https://www.gov.br/anatel/pt-br/regulado/fiscalizacao/planilha_operacao_url20241011_09_10-1.pdf',
    frequency: 'Importação manual de cada nova planilha publicada',
    docRef: 'Planilha de bloqueio do processo 53500.082450/2024-13, determinada pela SPA/MF. Planilha em uso: 11/10/2024.',
    lastChecked: 'Planilha importada em 11/10/2024',
  },
  {
    name: 'Reclame Aqui',
    scope: 'Reputação · fonte de terceiros',
    url: 'https://www.reclameaqui.com.br',
    frequency: `${WINDOWS}; o dado de cada marca é renovado quando passa de 6 horas`,
    docRef: 'Nota e número de reclamações das marcas autorizadas, exibidos separados da avaliação da comunidade.',
    lastChecked: 'Última nota atualizada há 4 horas',
  },
];

export const SourcesView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Rastreabilidade de Dados Oficiais</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Fontes oficiais consultadas
        </h1>
        <p className="text-sm mt-1 max-w-3xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Estas são as listas que o BetLegal lê para dizer se uma casa de apostas é autorizada. As datas abaixo vêm do registro das coletas.
        </p>
      </div>

      <div className="space-y-4">
        {SOURCES.map((src) => (
          <GlassCard key={src.name} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{src.name}</h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ color: 'var(--status-dado-declarado)', backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 10%, transparent)' }}
                >
                  {src.scope}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{src.docRef}</p>
              <div className="flex flex-col gap-1 text-sm pt-1" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="flex items-start gap-1.5">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--status-dado-declarado)' }} aria-hidden="true" />
                  <span>Frequência: {src.frequency}</span>
                </span>
                <span className="flex items-start gap-1.5" style={{ color: 'var(--color-text-tertiary)' }} aria-live="polite">
                  <History className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{src.lastChecked}</span>
                </span>
              </div>
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-md text-sm font-semibold transition-colors shrink-0 hover:opacity-80"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <span>Abrir fonte oficial</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </GlassCard>
        ))}
      </div>

      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        As loterias de MG e MA estão mapeadas, mas ainda não fazem parte da coleta. Cada data acima é a última vez que essa fonte foi conferida no banco.
      </p>
    </div>
  );
};
