import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenQuickSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { label: 'Busca', path: '/busca' },
    { label: 'Autorizadas', path: '/autorizadas' },
    { label: 'Radar', path: '/radar' },
    { label: 'Mudanças', path: '/mudancas' },
    { label: 'Séries', path: '/series' },
    { label: 'Metodologia', path: '/metodologia' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#081320]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with subtle typographic distinction */}
        <button
          onClick={() => handleNav('/')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] rounded-sm py-1"
          aria-label="BetLegal - Início"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F33] dark:text-white transition-colors group-hover:text-[#1F5FD1] dark:group-hover:text-[#3B82F6]">
            Bet<span className="font-semibold text-[#1F5FD1] dark:text-[#3B82F6]">Legal</span>
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links without pills or clutter */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`transition-colors hover:text-[#0B1F33] dark:hover:text-white cursor-pointer relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] ${
                  isActive ? 'text-[#0B1F33] dark:text-white font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F5FD1] dark:bg-[#3B82F6] rounded-full" />
                )}
              </button>
            );
          })}
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

          {/* Secondary subtle drop / link to API & Avaliações */}
          <button
            onClick={() => handleNav('/avaliacoes')}
            className={`transition-colors hover:text-[#0B1F33] dark:hover:text-white cursor-pointer py-1 ${
              currentPath === '/avaliacoes' ? 'text-[#0B1F33] dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Avaliações
          </button>
          
          <button
            onClick={() => handleNav('/api')}
            className={`transition-colors hover:text-[#0B1F33] dark:hover:text-white cursor-pointer py-1 ${
              currentPath === '/api' ? 'text-[#0B1F33] dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            API
          </button>
        </nav>

        {/* Zone 3: Actions + Theme Selector */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick search shortcut */}
          <button
            onClick={onOpenQuickSearch}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#0B1F33] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-md transition-colors cursor-pointer"
            title="Atalho de busca rápida (Ctrl+K)"
            aria-label="Abrir busca rápida"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Selector Toggle */}
          <ThemeToggle />

          {/* Primary CTA */}
          <button
            onClick={() => handleNav('/busca')}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1F5FD1] hover:bg-[#184ebd] active:bg-[#143e99] dark:bg-[#1F5FD1] dark:hover:bg-[#2a6ced] rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F5FD1]"
          >
            CONFERIR
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md cursor-pointer"
            aria-label="Abrir ou fechar menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1B2A] px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button
              onClick={() => handleNav('/avaliacoes')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md"
            >
              Avaliações de Consumidores
            </button>
            <button
              onClick={() => handleNav('/api')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md"
            >
              Documentação da API
            </button>
            <button
              onClick={() => handleNav('/contestar')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md"
            >
              Contestar Registro / Reportar Clone
            </button>
            <button
              onClick={() => handleNav('/painel')}
              className="block w-full text-left px-3 py-2 text-xs font-mono text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md"
            >
              Área Operacional / Auditoria
            </button>
          </div>

          {/* Theme option inside mobile drawer */}
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
