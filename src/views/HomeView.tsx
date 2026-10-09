import React, { useEffect, useState } from 'react';
import { BetEntity, RegulatoryChange } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { AuthorizationTrendChart } from '../components/AuthorizationTrendChart';
import { DetectionBreakdownCards } from '../components/DetectionBreakdownCards';
import { PresenceChart } from '../components/PresenceChart';
import { DatesNotice } from '../components/DatesNotice';
import { BetLegalLogo } from '../components/brand/BetLegalBrand';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  ArrowRight,
  History,
  AlertTriangle,
} from 'lucide-react';
import { AuthorizationTrendPoint } from '../data/mockData';
import { fetchPublicStats, fetchTimeseries, PublicStats, SeriesPoint } from '../lib/realData';

/** Janela do gráfico da home. Antes disso a série existe, mas a coleta de não autorizadas ainda não. */
const CHART_START = '2026-09-01';

function todayInBrasilia(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function homeTrend(series: SeriesPoint[], stats: PublicStats | null): AuthorizationTrendPoint[] {
  const today = todayInBrasilia();
  const by = stats?.byStatus;
  const live = by
    ? {
        authorized: (by.AUTORIZADA_NACIONAL || 0) + (by.AUTORIZADA_ESTADUAL || 0) + (by.DECISAO_JUDICIAL || 0),
        unauthorized: by.NAO_AUTORIZADA_DETECTADA || 0,
      }
    : null;
  return series
    .filter((point) => point.day >= CHART_START)
    .map((point) => ({
      date: point.day,
      displayDate: `${point.day.slice(8, 10)}/${point.day.slice(5, 7)}`,
      authorized: live && point.day === today ? live.authorized : point.authorized,
      unauthorized: live && point.day === today ? live.unauthorized : point.unauthorized,
    }));
}

interface HomeViewProps {
  entities: BetEntity[];
  changes: RegulatoryChange[];
  catalogState?: 'loading' | 'ready' | 'error';
  onSearchSubmit: (query: string) => void;
  onNavigate: (path: string) => void;
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  entities,
  changes,
  catalogState = 'ready',
  onSearchSubmit,
  onNavigate,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const { resolvedTheme } = useTheme();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicStats().then((next) => { if (!cancelled) setStats(next); }).catch(() => {});
    fetchTimeseries().then((next) => { if (!cancelled) setSeries(next); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const trend = homeTrend(series, stats);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
    }
  };

  const featuredEntities = entities.slice(0, 3);
  const recentChanges = changes.slice(0, 4);

  return (
    <div className="relative space-y-16 py-6 sm:py-10">
      <AmbientGlow />
      <DatesNotice onNavigate={onNavigate} />

      {/* 1. HERO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-4 sm:pt-8">
        <h1>
          <BetLegalLogo theme={resolvedTheme} variant="full" className="h-16 sm:h-20 w-auto mx-auto" />
        </h1>

        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto mt-4">
          <div className="glass-card flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-lg transition-all">
            <div className="flex items-center gap-2 px-3 w-full sm:flex-1 py-1 sm:py-0">
              <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ex: betano.bet.br, Superbet, ou 41.693.684/0001-44"
                className="w-full text-sm sm:text-base focus:outline-none bg-transparent"
                style={{ color: 'var(--color-text-primary)' }}
                aria-label="Pesquise por nome, domínio ou CNPJ"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 font-semibold text-sm tracking-wide rounded-md transition-colors cursor-pointer shrink-0"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              CONFERIR
            </button>
          </div>
        </form>

        <div className="text-xs font-medium flex items-center justify-center flex-wrap gap-2 pt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          <span>Fontes públicas</span>
          <span aria-hidden="true">·</span>
          <span>Atualização recorrente</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold" style={{ color: 'var(--status-autorizada)' }}>Sem afiliados</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold" style={{ color: 'var(--status-autorizada)' }}>Sem bônus</span>
        </div>

      </section>

      {/* 2. EVOLUÇÃO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
              Evolução
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Panorama do mercado regulado
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/series')}
            className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Série histórica detalhada
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <DetectionBreakdownCards stats={stats} />

        <div className="mt-5">
          {trend.length > 1 ? (
            <AuthorizationTrendChart data={trend} />
          ) : (
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>A série diária ainda não chegou.</p>
          )}
        </div>

        <div className="mt-4">
          <PresenceChart />
        </div>
      </section>

      {/* 3. METODOLOGIA TRANSPARENTE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <GlassCard className="p-6 sm:p-8">
          <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
            Metodologia Transparente
          </div>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Como funciona a checagem no BetLegal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Consultar', desc: 'Varredura contínua nas 4 janelas diárias de fontes primárias: Diário Oficial da União, SIGAP/SPA, despachos de autorização e loterias estaduais.' },
              { n: '02', title: 'Cruzar', desc: 'Validação cadastral de CNPJ na Receita Federal, verificação de zona .bet.br no Registro.br, testes de conectividade técnica (liveness) e histórico.' },
              { n: '03', title: 'Mostrar', desc: 'Apresentação no formato do BetLegal Card: status factual, nome do órgão, data/hora da sonda e link direto para a fonte oficial.' },
            ].map((step) => (
              <div key={step.n} className="space-y-2 p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-sm font-semibold px-2 py-0.5 rounded border"
                    style={{ color: 'var(--status-dado-declarado)', borderColor: 'var(--status-dado-declarado)', backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 10%, transparent)' }}
                  >
                    {step.n}
                  </span>
                  <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 p-3.5 rounded text-xs flex items-center justify-between flex-wrap gap-2 border"
            style={{ backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--status-dado-declarado) 25%, transparent)', color: 'var(--color-text-secondary)' }}
          >
            <div>
              <strong className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Princípio de precisão editorial: </strong>
              <em>"Legal é a pergunta. Evidência é a resposta."</em> Mostramos o que consta — ou não consta — nas fontes oficiais.
            </div>
            <button
              onClick={() => onNavigate('/metodologia')}
              className="font-semibold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Ver metodologia completa
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>
      </section>

      {/* 4. VERIFICAÇÕES EM DESTAQUE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Consultas e Verificações Recentes
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Fichas de evidência atualizadas na janela operacional de hoje
            </p>
          </div>
          <button
            onClick={() => onNavigate('/busca')}
            className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Ver todas as casas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {catalogState === 'loading' && (
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>O catálogo publicado está carregando.</p>
        )}
        {catalogState === 'error' && featuredEntities.length === 0 && (
          <p className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>O catálogo não carregou nesta origem.</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {featuredEntities.map((item) => (
            <BetLegalCard
              key={item.id}
              entity={item}
              onOpenHistory={onOpenHistory}
              onShare={onShare}
              onReport={onReport}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 5. ÚLTIMAS MUDANÇAS & RADAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <History className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
                Últimas Mudanças Regulatórias
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Eventos e diff temporal das listas oficiais</p>
            </div>
            <button
              onClick={() => onNavigate('/mudancas')}
              className="text-xs font-semibold hover:underline cursor-pointer shrink-0"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Ver diffs
            </button>
          </div>

          <div className="space-y-3">
            {recentChanges.map((chg) => (
              <div key={chg.id} className="p-3 rounded border text-xs space-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{chg.brandName}</span>
                  <span className="font-mono">{chg.date} {chg.time}</span>
                </div>
                <p className="leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{chg.summary}</p>
                <div className="text-[11px] pt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Fonte: <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{chg.sourceDoc}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
            <div>
              <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--status-atencao)' }} />
                Radar de Clones e Bloqueios
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Sinais técnicos observados e lista Anatel</p>
            </div>
            <button
              onClick={() => onNavigate('/radar')}
              className="text-xs font-semibold hover:underline cursor-pointer shrink-0"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Abrir Radar
            </button>
          </div>

          <div className="space-y-3">
            <div
              className="p-3 rounded text-xs space-y-1.5 border"
              style={{ backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--status-nao-autorizada) 30%, transparent)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold" style={{ color: 'var(--status-nao-autorizada)' }}>betano-app-bonus.xyz</span>
                <span
                  className="text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                  style={{ color: 'var(--status-nao-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 15%, transparent)' }}
                >
                  Lookalike Detectado
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Domínio registrado no exterior sem autorização SPA/MF. Utiliza logo da Betano para oferta ilegítima de bônus via link patrocinado.
              </p>
              <div className="text-[11px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                Host legítimo da marca: <strong>betano.bet.br</strong>
              </div>
            </div>

            <div className="p-3 rounded border text-xs space-y-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold" style={{ color: 'var(--color-text-secondary)' }}>bet365-apostas-vip.online</span>
                <span
                  className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border"
                  style={{ color: 'var(--status-bloqueada)', borderColor: 'var(--status-bloqueada)' }}
                >
                  Bloqueio Anatel
                </span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Constou na lista formal de bloqueio enviada à Anatel. Redirecionamento DNS para página de advertência pelos provedores.
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate('/radar')}
                className="w-full py-2 rounded font-semibold text-xs transition-colors cursor-pointer hover:bg-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)' }}
              >
                Consultar ferramenta comparadora de clones no Radar →
              </button>
            </div>
          </div>
        </GlassCard>
      </section>

    </div>
  );
};
