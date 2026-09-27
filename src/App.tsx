import React, { useState, useEffect } from 'react';
import { BetEntity, RegulatoryChange } from './types';
import { INITIAL_ENTITIES, REGULATORY_CHANGES } from './data/mockData';
import { ThemeProvider } from './context/ThemeContext';
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
import { NoticiasView } from './views/NoticiasView';
import { ContestView } from './views/ContestView';
import { ApiDocsView } from './views/ApiDocsView';
import { AdminPanelView } from './views/AdminPanelView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [entities, setEntities] = useState<BetEntity[]>(INITIAL_ENTITIES);
  const [changes] = useState<RegulatoryChange[]>(REGULATORY_CHANGES);

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
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#F6F8FB] dark:bg-[#081320] text-[#0B1F33] dark:text-slate-100 selection:bg-[#1F5FD1]/20 selection:text-[#0B1F33] transition-colors">
        
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
              entities={entities}
              changes={changes}
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
              entities={entities}
              initialQuery={searchQuery}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/autorizadas' && (
            <AuthorizedView
              entities={entities}
              onOpenHistory={handleOpenHistory}
              onShare={handleOpenShare}
              onReport={handleOpenReport}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/radar' && (
            <RadarView
              entities={entities}
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
              changes={changes}
              onSelectBrand={(brand) => {
                setSearchQuery(brand);
                navigate('/busca');
              }}
            />
          )}

          {currentPath === '/series' && (
            <SeriesView />
          )}

          {currentPath === '/noticias' && (
            <NoticiasView onNavigate={(path) => navigate(path)} />
          )}

          {currentPath === '/avaliacoes' && (
            <ReviewsView
              entities={entities}
              onViewDetails={handleViewDomainDetail}
            />
          )}

          {currentPath === '/metodologia' && (
            <MethodologyView />
          )}

          {currentPath === '/contestar' && (
            <ContestView initialHost={activeDomainDetail?.host || ''} />
          )}

          {currentPath === '/api' && (
            <ApiDocsView entities={entities} />
          )}

          {currentPath === '/painel' && (
            <AdminPanelView entities={entities} />
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
          entities={entities}
          onSelectEntity={(entity) => {
            handleViewDomainDetail(entity);
          }}
          onSelectRoute={(path) => navigate(path)}
        />

      </div>
    </ThemeProvider>
  );
}
