import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Newspaper, X } from 'lucide-react';
import { fetchNews, NewsDay, NewsItem, NewsTopic } from '../lib/realData';

interface NewsViewProps {
  onNavigate: (path: string) => void;
}

type State =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'ready'; news: NewsItem[]; topics: NewsTopic[]; days: NewsDay[] };

export const NewsView: React.FC<NewsViewProps> = ({ onNavigate }) => {
  const [topic, setTopic] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [openItem, setOpenItem] = useState<NewsItem | null>(null);
  const [days, setDays] = useState<NewsDay[]>([]);
  const [topics, setTopics] = useState<NewsTopic[]>([]);

  useEffect(() => {
    let alive = true;
    setState({ kind: 'loading' });
    fetchNews({ topic: topic ?? undefined, day: day ?? undefined })
      .then(({ news, topics, days: nextDays }) => {
        if (!alive) return;
        setState({ kind: 'ready', news, topics, days: nextDays });
        if (topics.length > 0) setTopics(topics);
        if (nextDays.length > 0) setDays(nextDays);
      })
      .catch(() => { if (alive) setState({ kind: 'error' }); });
    return () => { alive = false; };
  }, [topic, day, reloadKey]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
        <Newspaper className="w-4 h-4" aria-hidden="true" />
        Cobertura do setor
      </div>
      <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
        Notícias
      </h1>
      <p className="mt-2 text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
        O que muda na regulação das apostas no Brasil, atualizado ao longo do dia a
        partir de fontes oficiais e de imprensa. Cobrimos cinco assuntos:
        regulação, fiscalização, decisão judicial, bloqueio e jogo responsável.
      </p>

      <div className="mt-5 rounded-lg border p-4" style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Não publicamos promoção.</strong>{' '}
          Ficam de fora bônus, código promocional, palpite, odds, publieditorial e
          manchete de prêmio. Nenhum link aqui leva a uma casa de apostas: o link
          vai sempre para o veículo que publicou.{' '}
          <button
            type="button"
            onClick={() => onNavigate('/metodologia')}
            className="font-semibold underline underline-offset-2 cursor-pointer"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Como verificamos
          </button>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por assunto">
            <TopicChip label="Todos" active={topic === null} onClick={() => setTopic(null)} />
            {topics.map((item) => (
              <TopicChip key={item.id} label={item.label} active={topic === item.id} onClick={() => setTopic(item.id)} />
            ))}
          </div>
        )}
        {days.length > 0 && <DaySelect days={days} value={day} onChange={setDay} />}
      </div>

      {day && (
        <p className="mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Mostrando só {formatDayBR(day)}.{' '}
          <button type="button" onClick={() => setDay(null)} className="font-semibold underline underline-offset-2 cursor-pointer" style={{ color: 'var(--color-text-primary)' }}>
            Ver todos os dias
          </button>
        </p>
      )}

      <div className="mt-6">
        {state.kind === 'loading' && (
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Carregando as notícias.</p>
        )}
        {state.kind === 'error' && (
          <p role="alert" className="text-sm" style={{ color: 'var(--status-nao-autorizada)' }}>
            As notícias não carregaram.{' '}
            <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="font-semibold underline underline-offset-2 cursor-pointer">
              Tentar de novo
            </button>
          </p>
        )}
        {state.kind === 'ready' && state.news.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {emptyText(topic, day)}
          </p>
        )}
        {state.kind === 'ready' && state.news.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 items-start">
            {state.news.map((item) => (
              <NewsCard key={item.id} item={item} onOpen={() => setOpenItem(item)} />
            ))}
          </ul>
        )}
      </div>

      {openItem && <NewsModal item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
};

function emptyText(topic: string | null, day: string | null): string {
  if (day === saoPauloISO(0)) return 'Nada publicado hoje ainda. A coleta roda de 5 em 5 minutos.';
  if (day) return `Nada publicado em ${formatDayBR(day)} neste recorte.`;
  if (topic) return 'Nada publicado neste assunto nos últimos dias.';
  return 'Nada publicado nos últimos dias. Dias sem notícia de regulação são comuns.';
}

function formatDateTimeBR(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return `${formatted} (horário de Brasília)`;
}

function formatDayBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function dayLabel(iso: string, hojeISO: string, ontemISO: string): string {
  if (iso === hojeISO) return `Hoje · ${formatDayBR(iso)}`;
  if (iso === ontemISO) return `Ontem · ${formatDayBR(iso)}`;
  return formatDayBR(iso);
}

function saoPauloISO(offsetDias = 0): string {
  const agora = new Date(Date.now() - offsetDias * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(agora);
}

const DaySelect: React.FC<{
  days: NewsDay[];
  value: string | null;
  onChange: (day: string | null) => void;
}> = ({ days, value, onChange }) => {
  const hoje = saoPauloISO(0);
  const ontem = saoPauloISO(1);
  const total = days.reduce((soma, item) => soma + item.count, 0);
  const opcoes = days.some((item) => item.date === hoje) ? days : [{ date: hoje, count: 0 }, ...days];

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value === hoje ? null : hoje)}
        aria-pressed={value === hoje}
        className="px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer"
        style={chipStyle(value === hoje)}
      >
        Hoje
      </button>
      <label className="inline-flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
        <span className="font-semibold">Dia</span>
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="h-9 rounded-full border px-3 text-xs font-semibold cursor-pointer"
          style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)' }}
        >
          <option value="">Todos os dias ({total})</option>
          {opcoes.map((item) => (
            <option key={item.date} value={item.date}>
              {dayLabel(item.date, hoje, ontem)} ({item.count})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

function chipStyle(active: boolean): React.CSSProperties {
  return active
    ? { borderColor: 'var(--color-text-primary)', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)' }
    : { borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' };
}

const TopicChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className="px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer"
    style={chipStyle(active)}
  >
    {label}
  </button>
);

const NewsImage: React.FC<{ item: NewsItem; onOpen: () => void }> = ({ item, onOpen }) => {
  const [broken, setBroken] = useState(false);
  if (!item.image_url || broken) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={-1}
      aria-hidden="true"
      className="block w-full aspect-video overflow-hidden rounded-lg border cursor-pointer"
      style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <img
        src={item.image_url}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

const NewsCard: React.FC<{ item: NewsItem; onOpen: () => void }> = ({ item, onOpen }) => (
  <li className="flex flex-col gap-2.5">
    <NewsImage item={item} onOpen={onOpen} />
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
      <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{item.source.name}</span>
      <span aria-hidden="true">·</span>
      <SourceKindTag kind={item.source.kind} label={item.source.kind_label} />
      {item.source.paywall && <PaywallTag />}
    </div>
    <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
      <button type="button" onClick={onOpen} className="text-left hover:underline underline-offset-2 cursor-pointer">
        {item.title}
      </button>
    </h2>
    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
      <time dateTime={item.published_at} className="font-mono">{formatDateTimeBR(item.published_at)}</time>
      {' · '}
      {item.topic_label}
    </p>
    {item.summary && (
      <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--color-text-secondary)' }}>{item.summary}</p>
    )}
    <div className="pt-1 flex flex-col gap-1 text-xs">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-1 font-semibold w-fit hover:underline"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Abrir no {item.source.name}
        <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
      </a>
      {item.also_published_by > 0 && (
        <span style={{ color: 'var(--color-text-tertiary)' }}>
          Também publicado por mais {item.also_published_by}{' '}
          {item.also_published_by === 1 ? 'veículo' : 'veículos'}
        </span>
      )}
    </div>
  </li>
);

const NewsModal: React.FC<{ item: NewsItem; onClose: () => void }> = ({ item, onClose }) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-modal-title"
        className="rounded-lg border max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-card-border)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{item.source.name}</span>
            <span aria-hidden="true">·</span>
            <SourceKindTag kind={item.source.kind} label={item.source.kind_label} />
            {item.source.paywall && <PaywallTag />}
            <span aria-hidden="true">·</span>
            <span>{item.topic_label}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1.5 rounded-md cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {item.image_url && (
          <div className="mt-3 w-full aspect-video overflow-hidden rounded-lg border" style={{ borderColor: 'var(--color-card-border)' }}>
            <img src={item.image_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        )}
        <h2 id="news-modal-title" className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight leading-tight" style={{ color: 'var(--color-text-primary)' }}>
          {item.title}
        </h2>
        <p className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Publicado em <time dateTime={item.published_at} className="font-mono">{formatDateTimeBR(item.published_at)}</time>
        </p>
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
          {item.summary ? (
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.summary}</p>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
              Este veículo não publica sob licença livre, então trazemos apenas a manchete. O texto está no site de origem.
            </p>
          )}
        </div>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)' }}
          >
            {item.source.paywall ? `Ler no ${item.source.name} (assinantes)` : `Ler no ${item.source.name}`}
            <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
          {item.also_published_by > 0 && (
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              A mesma notícia saiu em mais {item.also_published_by} {item.also_published_by === 1 ? 'veículo' : 'veículos'}
            </span>
          )}
        </div>
      </article>
    </div>
  );
};

const PaywallTag: React.FC = () => (
  <span
    className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold border"
    style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}
    title="Matéria de veículo por assinatura: o texto completo pode exigir login."
  >
    Assinantes
  </span>
);

const SourceKindTag: React.FC<{ kind: string; label: string }> = ({ kind, label }) => (
  <span
    className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold border"
    style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}
    title={
      kind === 'imprensa' || kind === 'setorial'
        ? 'Veículo de imprensa: trazemos só a manchete e o link.'
        : 'Fonte oficial ou agência pública: conteúdo livre para reprodução com crédito.'
    }
  >
    {label}
  </span>
);
