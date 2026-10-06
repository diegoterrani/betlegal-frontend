import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { fetchNews, NewsItem } from '../lib/realData';

export const NewsView: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [days, setDays] = useState<{ date: string; count: number }[]>([]);
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchNews(day || undefined)
      .then((data) => {
        if (cancelled) return;
        setNews(data.news);
        setDays(data.days);
        setError('');
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'As notícias não carregaram.');
      });
    return () => { cancelled = true; };
  }, [day]);

  return (
    <div className="relative">
      <AmbientGlow />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="pb-5 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
            Cobertura do setor
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Notícias publicadas
          </h1>
          <p className="text-sm sm:text-base mt-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            A lista vem de /api/v1/news. O texto de cada matéria é dado externo e não prova autorização.
          </p>
        </div>

        {days.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDay('')}
              className="text-xs px-2 py-1 rounded border cursor-pointer"
              style={{ borderColor: 'var(--color-card-border)', color: day ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}
            >
              Recentes
            </button>
            {days.slice(0, 8).map((item) => (
              <button
                key={item.date}
                onClick={() => setDay(item.date)}
                className="text-xs px-2 py-1 rounded border cursor-pointer font-mono"
                style={{ borderColor: 'var(--color-card-border)', color: day === item.date ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
              >
                {item.date} · {item.count}
              </button>
            ))}
          </div>
        )}

        {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}

        {news.length === 0 && !error && (
          <GlassCard className="p-8 flex flex-col items-center text-center gap-3">
            <Newspaper className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Nenhuma matéria publicada neste recorte.</p>
          </GlassCard>
        )}

        <div className="space-y-3">
          {news.map((item) => (
            <GlassCard key={item.id || item.url} className="p-5 space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>
                {item.source?.name} · {item.topic_label} · {new Date(item.published_at).toLocaleString('pt-BR')}
              </p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold hover:underline" style={{ color: 'var(--color-text-primary)' }}>
                {item.title}
              </a>
              {item.summary && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.summary}</p>}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
