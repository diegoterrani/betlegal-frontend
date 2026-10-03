import React, { useState, useEffect } from 'react';
import { BetEntity, RegulatoryChange } from './types';
import { INITIAL_ENTITIES, REGULATORY_CHANGES } from './data/mockData';
import { fetchRealEntities, fetchRealChanges } from './lib/realData';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { HistoryModal } from './components/HistoryModal';
import { QuickSearchModal } from './components/QuickSearchModal';

// Views
import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { AuthorizedView } from './views/AuthorizedView';
import { RadarView } from './views/RadarView';
import { DomainDetailView } from './views/DomainDetailView';
import { ChangesView } from './views/ChangesView';
import { SeriesView } from './views/SeriesView';
import { ReviewsView } from './views/ReviewsView';
import { MethodologyView } from './views/MethodologyView';
import { ContestView } from './views/ContestView';
import { ApiDocsView } from './views/ApiDocsView';
import { AdminPanelView } from './views/AdminPanelView';
import { OperatorDeskView } from './views/OperatorDeskView';
import { NewsView } from './views/NewsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { AboutView } from './views/AboutView';
import { SourcesView } from './views/SourcesView';
import { PrivacyView } from './views/PrivacyView';
import { ProfileView } from './views/ProfileView';
import { NotFoundView } from './views/NotFoundView';

const KNOWN_PATHS = [
  '/', '/busca', '/autorizadas', '/radar', '/mudancas', '/series', '/avaliacoes',
  '/metodologia', '/sobre', '/fontes', '/privacidade', '/contestar', '/api',
  '/painel', '/operadora', '/noticias', '/entrar', '/criar-conta', '/perfil',
];

function isKnownPath(path: string): boolean {
  return KNOWN_PATHS.includes(path) || path.startsWith('/dominio/');
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [entities, setEntities] = useState<BetEntity[]>(INITIAL_ENTITIES);
  const [changes] = useState<RegulatoryChange[]>(REGULATORY_CHANGES);

  // Dados reais (read-only) do Supabase de prod, usados nas páginas públicas de verificação.
  // O painel admin e a área da operadora continuam no mock curado (entities/changes acima),
  // porque dependem de slugs específicos (CLONE_LINKS, OPERATOR_DESK) só presentes no mock.
  const [publicEntities, setPublicEntities] = useState<BetEntity[]>(INITIAL_ENTITIES);
  const [publicChanges, setPublicChanges] = useState<RegulatoryChange[]>(REGULATORY_CHANGES);

  useEffect(() => {
    let cancelled = false;
    fetchRealEntities().then((real) => {
      if (!cancelled && real && real.length > 0) setPublicEntities(real);
    });
    fetchRealChanges().then((real) => {
      if (!cancelled && real && real.length > 0) setPublicChanges(real);
    });
    return () => { cancelled = true; };
  }, []);

  // Selected detail item for /dominio/:host
  const [activeDomainDetail, setActiveDomainDetail] = useState<{ entity: BetEntity; host: string } | null>(null);

  // Modals state
  const [shareData, setShareData] = useState<{ entity: BetEntity; host: string } | null>(null);
  const [historyEntity, setHistoryEntity] = useState<BetEntity | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Listen to hash or manual state navigation
  const navigate = (path: string, param?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    navigate('/busca');
  };

  const handleOpenShare = (entity: BetEntity, host: string) => {
    setShareData({ entity, host });
  };

  const handleOpenHistory = (entity: BetEntity) => {
    setHistoryEntity(entity);
  };

  const handleOpenReport = (entity: BetEntity, host: string) => {
    navigate('/contestar');
  };

  const handleViewDomainDetail = (entity: BetEntity) => {
    const host = entity.domains[0]?.host || `${entity.slug}.bet.br`;
    setActiveDomainDetail({ entity, host });
    navigate(`/dominio/${host}`);
  };

  return (
    <UserProvider>
    <ReviewsProvider>
    <ThemeProvider>
      <div
        className="min-h-screen flex flex-col transition-colors"
        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
      >

        {/* Top Bar Header */}
        <Header
          currentPath={currentPath}
          onNavigate={(path) => navigate(path)}
          onOpenQuickSearch={() => setQuickSearchOpen(true)}
        />

        {/* Main View Router */}
        <main className="flex-1">
          {currentPath === '/' && (
            <HomeView
              entities={publicEntities}
              changes={publicChanges}
              onSearchSubmit={handleSearchSubmit}
              onNavigate={(path) => navigate(path)}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/busca' && (
            <SearchView
              entities={publicEntities}
              initialQuery={searchQuery}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/autorizadas' && (
            <AuthorizedView
              entities={publicEntities}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/radar' && (
            <RadarView
              entities={publicEntities}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath.startsWith('/dominio/') && activeDomainDetail && (
            <DomainDetailView
              entity={activeDomainDetail.entity}
              hostName={activeDomainDetail.host}
              onBack={() => navigate('/busca')}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
            />
          )}

          {currentPath === '/mudancas' && (
            <ChangesView
              changes={publicChanges}
              onSelectBrand={(brand) => {
                setSearchQuery(brand);
                navigate('/busca');
              }}
            />
          )}

          {currentPath === '/series' && (
            <SeriesView />
          )}

          {currentPath === '/avaliacoes' && (
            <ReviewsView
              entities={publicEntities}
              onViewDetails={handleViewDomainDetail}
              onNavigate={(path) => navigate(path)}
            />
          )}

          {currentPath === '/metodologia' && (
            <MethodologyView onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/sobre' && (
            <AboutView onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/fontes' && (
            <SourcesView />
          )}

          {currentPath === '/privacidade' && (
            <PrivacyView />
          )}

          {currentPath === '/contestar' && (
            <ContestView initialHost={activeDomainDetail?.host || ''} />
          )}

          {currentPath === '/api' && (
            <ApiDocsView entities={publicEntities} />
          )}

          {currentPath === '/painel' && (
            <AdminPanelView entities={entities} onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/operadora' && (
            <OperatorDeskView entities={entities} onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/noticias' && (
            <NewsView />
          )}

          {currentPath === '/entrar' && (
            <LoginView onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/criar-conta' && (
            <RegisterView onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/perfil' && (
            <ProfileView onNavigate={(path) => navigate(path)} />
          )}

          {!isKnownPath(currentPath) && (
            <NotFoundView onNavigate={(path) => navigate(path)} />
          )}
        </main>

        {/* Footer */}
        <Footer onNavigate={(path) => navigate(path)} />

        {/* Share Modal */}
        {shareData && (
          <ShareModal
            entity={shareData.entity}
            host={shareData.host}
            onClose={() => setShareData(null)}
          />
        )}

        {/* History Modal */}
        {historyEntity && (
          <HistoryModal
            entity={historyEntity}
            onClose={() => setHistoryEntity(null)}
          />
        )}

        {/* Quick Search Modal */}
        <QuickSearchModal
          isOpen={quickSearchOpen}
          onClose={() => setQuickSearchOpen(false)}
          entities={publicEntities}
          onSelectEntity={(entity) => {
            handleViewDomainDetail(entity);
          }}
          onSelectRoute={(path) => navigate(path)}
        />

      </div>
    </ThemeProvider>
    </ReviewsProvider>
    </UserProvider>
  );
}
