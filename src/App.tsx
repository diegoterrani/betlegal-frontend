import React, { useState, useEffect } from 'react';
import { BetEntity, RegulatoryChange } from './types';
import { fetchRealChanges, fetchRealEntities } from './lib/realData';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { HistoryModal } from './components/HistoryModal';
import { QuickSearchModal } from './components/QuickSearchModal';

import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { AuthorizedView } from './views/AuthorizedView';
import { RadarView } from './views/RadarView';
import { DomainRoute } from './views/DomainRoute';
import { BrandView } from './views/BrandView';
import { ChangesView } from './views/ChangesView';
import { SeriesView } from './views/SeriesView';
import { ReviewsView } from './views/ReviewsView';
import { MethodologyView } from './views/MethodologyView';
import { ContestView } from './views/ContestView';
import { AdminPanelView } from './views/AdminPanelView';
import { OperatorDeskView } from './views/OperatorDeskView';
import { NewsView } from './views/NewsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { AboutView } from './views/AboutView';
import { SourcesView } from './views/SourcesView';
import { PrivacyView } from './views/PrivacyView';
import { ProfileView } from './views/ProfileView';
import { ConfirmView } from './views/ConfirmView';
import { NotFoundView } from './views/NotFoundView';

const ALIASES: Record<string, string> = {
  '/nao-autorizadas': '/radar',
  '/ranking': '/avaliacoes',
  '/dados': '/series',
  '/cadastrar': '/criar-conta',
  '/operador': '/operadora',
};

function locationPath(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}` || '/';
}

function cleanOf(path: string): string {
  const bare = (path.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  return ALIASES[bare] ?? bare;
}

function queryOf(path: string): URLSearchParams {
  return new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');
}

const KNOWN = new Set([
  '/', '/busca', '/autorizadas', '/radar', '/mudancas', '/series', '/avaliacoes',
  '/metodologia', '/sobre', '/fontes', '/privacidade', '/contestar',
  '/painel', '/painel/clones', '/operadora', '/noticias', '/entrar', '/criar-conta',
  '/perfil', '/confirmar',
]);

function isKnown(path: string): boolean {
  return KNOWN.has(path) || path.startsWith('/dominio/') || path.startsWith('/marca/');
}

function Shell() {
  const [currentPath, setCurrentPath] = useState<string>(locationPath);
  const [entities, setEntities] = useState<BetEntity[]>([]);
  const [changes, setChanges] = useState<RegulatoryChange[]>([]);
  const [catalogState, setCatalogState] = useState<'loading' | 'ready' | 'error'>('loading');

  const [shareData, setShareData] = useState<{ entity: BetEntity; host: string } | null>(null);
  const [historyEntity, setHistoryEntity] = useState<BetEntity | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setCurrentPath(locationPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const clean = cleanOf(currentPath);
    document.title = clean === '/' ? 'Bet Legal' : `Bet Legal · ${clean}`;
  }, [currentPath]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchRealEntities(), fetchRealChanges(200)])
      .then(([nextEntities, nextChanges]) => {
        if (cancelled) return;
        if (!nextEntities) {
          setCatalogState('error');
          return;
        }
        setEntities(nextEntities);
        setChanges(nextChanges || []);
        setCatalogState('ready');
      })
      .catch(() => {
        if (!cancelled) setCatalogState('error');
      });
    return () => { cancelled = true; };
  }, []);

  const navigate = (path: string) => {
    const next = path.startsWith('/') ? path : `/${path}`;
    if (next === '/mudancas/feed.xml' || next.startsWith('/confirmar?')) {
      window.location.assign(next);
      return;
    }
    window.history.pushState({ betlegal: true }, '', next);
    setCurrentPath(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDomain = (entity: BetEntity, host?: string) => {
    const target = host || entity.domains[0]?.host;
    if (!target) return;
    navigate(`/dominio/${encodeURIComponent(target)}`);
  };

  const cleanPath = cleanOf(currentPath);
  const params = queryOf(currentPath);
  const searchQuery = cleanPath === '/busca' ? (params.get('q') || '') : '';

  const handleSearchSubmit = (query: string) => {
    navigate(`/busca?q=${encodeURIComponent(query)}`);
  };

  let view: React.ReactNode = null;
  if (cleanPath === '/') {
    view = (
      <HomeView
        entities={entities}
        changes={changes}
        catalogState={catalogState}
        onSearchSubmit={handleSearchSubmit}
        onNavigate={navigate}
        onOpenHistory={setHistoryEntity}
        onShare={(entity, host) => setShareData({ entity, host })}
        onReport={() => navigate('/contestar')}
        onViewDetails={(entity) => openDomain(entity)}
      />
    );
  } else if (cleanPath === '/busca') {
    view = (
      <SearchView
        entities={entities}
        initialQuery={searchQuery}
        onOpenHistory={setHistoryEntity}
        onShare={(entity, host) => setShareData({ entity, host })}
        onReport={() => navigate('/contestar')}
        onViewDetails={(entity) => openDomain(entity)}
      />
    );
  } else if (cleanPath === '/autorizadas') {
    view = (
      <AuthorizedView
        entities={entities}
        onOpenHistory={setHistoryEntity}
        onShare={(entity, host) => setShareData({ entity, host })}
        onReport={() => navigate('/contestar')}
        onViewDetails={(entity) => openDomain(entity)}
      />
    );
  } else if (cleanPath === '/radar') {
    view = (
      <RadarView
        entities={entities}
        onOpenHistory={setHistoryEntity}
        onShare={(entity, host) => setShareData({ entity, host })}
        onReport={() => navigate('/contestar')}
        onViewDetails={(entity) => openDomain(entity)}
      />
    );
  } else if (cleanPath.startsWith('/dominio/')) {
    const host = decodeURIComponent(cleanPath.slice('/dominio/'.length));
    view = (
      <DomainRoute
        host={host}
        entities={entities}
        onBack={() => navigate('/busca')}
        onShare={(entity, domainHost) => setShareData({ entity, host: domainHost })}
        onReport={() => navigate(`/contestar?url=${encodeURIComponent(host)}`)}
        onNavigate={navigate}
      />
    );
  } else if (cleanPath.startsWith('/marca/')) {
    const slug = decodeURIComponent(cleanPath.slice('/marca/'.length));
    view = <BrandView slug={slug} onNavigate={navigate} />;
  } else if (cleanPath === '/mudancas') {
    view = (
      <ChangesView
        changes={changes}
        onSelectBrand={(brand) => navigate(`/busca?q=${encodeURIComponent(brand)}`)}
      />
    );
  } else if (cleanPath === '/series') {
    view = <SeriesView />;
  } else if (cleanPath === '/avaliacoes') {
    view = (
      <ReviewsView
        entities={entities}
        onViewDetails={(entity) => openDomain(entity)}
        onNavigate={navigate}
      />
    );
  } else if (cleanPath === '/metodologia') {
    view = <MethodologyView onNavigate={navigate} />;
  } else if (cleanPath === '/sobre') {
    view = <AboutView onNavigate={navigate} />;
  } else if (cleanPath === '/fontes') {
    view = <SourcesView />;
  } else if (cleanPath === '/privacidade') {
    view = <PrivacyView />;
  } else if (cleanPath === '/contestar') {
    view = <ContestView initialHost={params.get('url') || ''} />;
  } else if (cleanPath === '/painel' || cleanPath === '/painel/clones') {
    view = (
      <AdminPanelView
        onNavigate={navigate}
        initialTab={cleanPath === '/painel/clones' ? 'clones' : 'visao'}
      />
    );
  } else if (cleanPath === '/operadora') {
    view = <OperatorDeskView onNavigate={navigate} />;
  } else if (cleanPath === '/noticias') {
    view = <NewsView onNavigate={navigate} />;
  } else if (cleanPath === '/entrar') {
    view = (
      <LoginView
        onNavigate={navigate}
        redirectPath={params.get('redirect') || params.get('next') || ''}
      />
    );
  } else if (cleanPath === '/criar-conta') {
    view = <RegisterView onNavigate={navigate} />;
  } else if (cleanPath === '/perfil') {
    view = <ProfileView onNavigate={navigate} />;
  } else if (cleanPath === '/confirmar') {
    view = <ConfirmView />;
  } else if (!isKnown(cleanPath)) {
    view = <NotFoundView onNavigate={navigate} />;
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
    >
      <Header
        currentPath={cleanPath}
        onNavigate={navigate}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
      />
      {catalogState === 'error' && cleanPath !== '/entrar' && (
        <p className="max-w-6xl mx-auto px-4 pt-4 text-xs" role="alert" style={{ color: 'var(--status-nao-autorizada)' }}>
          O catálogo de produção não respondeu. As listas podem estar vazias até a próxima tentativa.
        </p>
      )}
      <main className="flex-1">{view}</main>
      <Footer onNavigate={navigate} />
      {shareData && (
        <ShareModal entity={shareData.entity} host={shareData.host} onClose={() => setShareData(null)} />
      )}
      {historyEntity && (
        <HistoryModal entity={historyEntity} onClose={() => setHistoryEntity(null)} />
      )}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        entities={entities}
        onSelectEntity={(entity) => openDomain(entity)}
        onSelectRoute={(path) => navigate(path)}
      />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ReviewsProvider>
        <ThemeProvider>
          <Shell />
        </ThemeProvider>
      </ReviewsProvider>
    </UserProvider>
  );
}
