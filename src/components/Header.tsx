import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickSearch: () => void;
}

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: 'Início', path: '/' },
  { label: 'Autorizadas', path: '/autorizadas' },
  { label: 'Não Autorizadas', path: '/radar' },
  { label: 'Notícias', path: '/noticias' },
  { label: 'Séries', path: '/series' },
  { label: 'Mudanças', path: '/mudancas' },
];

const moreLinks: NavLink[] = [
  { label: 'Metodologia', path: '/metodologia' },
  { label: 'Avaliações', path: '/avaliacoes' },
  { label: 'Contestar registro', path: '/contestar' },
  { label: 'Área operacional', path: '/painel' },
];

function isActivePath(currentPath: string, path: string) {
  if (path === '/') return currentPath === '/';
  return currentPath === path || currentPath.startsWith(`${path}/`);
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenQuickSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const moreActive = moreLinks.some((link) => isActivePath(currentPath, link.path));

  useEffect(() => {
    if (!moreOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#081320]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => handleNav('/')}
          className="shrink-0 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] rounded-sm py-1"
          aria-label="BetLegal - Início"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F33] dark:text-white transition-colors group-hover:text-[#1F5FD1] dark:group-hover:text-[#3B82F6]">
            Bet<span className="font-semibold text-[#1F5FD1] dark:text-[#3B82F6]">Legal</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-stretch h-full gap-4 xl:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Principal">
          {navLinks.map((link) => {
            const isActive = isActivePath(currentPath, link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`relative inline-flex items-center whitespace-nowrap transition-colors hover:text-[#0B1F33] dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] ${
                  isActive ? 'text-[#0B1F33] dark:text-white font-semibold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F5FD1] dark:bg-[#3B82F6] rounded-full" />
                )}
              </button>
            );
          })}

          <div className="relative flex items-stretch" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((open) => !open)}
              className={`relative inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#0B1F33] dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] ${
                moreActive || moreOpen ? 'text-[#0B1F33] dark:text-white font-semibold' : ''
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-current={moreActive ? 'page' : undefined}
            >
              Mais
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              {moreActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F5FD1] dark:bg-[#3B82F6] rounded-full" />
              )}
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute top-full right-0 mt-0 w-56 rounded-b-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1B2A] shadow-lg py-1.5 z-50"
              >
                {moreLinks.map((link) => {
                  const isActive = isActivePath(currentPath, link.path);
                  return (
                    <button
                      key={link.path}
                      role="menuitem"
                      onClick={() => handleNav(link.path)}
                      className={`block w-full text-left px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                        isActive
                          ? 'text-[#0B1F33] dark:text-white font-semibold bg-slate-50 dark:bg-slate-800/70'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0B1F33] dark:hover:text-white'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenQuickSearch}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#0B1F33] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer"
            title="Atalho de busca rápida (Ctrl+K)"
            aria-label="Abrir busca rápida"
          >
            <Search className="w-4 h-4" />
          </button>

          <ThemeToggle />

          <button
            onClick={() => handleNav('/busca')}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1F5FD1] hover:bg-[#184ebd] active:bg-[#143e99] dark:bg-[#1F5FD1] dark:hover:bg-[#2a6ced] rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F5FD1]"
          >
            CONFERIR
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md cursor-pointer"
            aria-label="Abrir ou fechar menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1B2A] px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = isActivePath(currentPath, link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                  isActive
                    ? 'font-semibold text-[#0B1F33] dark:text-white bg-slate-50 dark:bg-slate-800/70'
                    : 'font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p className="px-3 pt-1 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Mais
            </p>
            {moreLinks.map((link) => {
              const isActive = isActivePath(currentPath, link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? 'font-semibold text-[#0B1F33] dark:text-white bg-slate-50 dark:bg-slate-800/70'
                      : 'font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Modo de Exibição</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
              <button
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-[#0B1F33] dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Claro
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-[#0B1F33] dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Escuro
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-[#0B1F33] dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
