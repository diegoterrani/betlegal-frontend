import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { BetLegalLogo } from './brand/BetLegalBrand';
import { UserRole } from '../types';

const ROLE_LABEL: Record<UserRole, string> = {
  client: 'Cliente',
  operator: 'Operadora',
  admin: 'Administrador',
  super_admin: 'Admin. geral',
};

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickSearch: () => void;
}

const PRIMARY_LINKS = [
  { label: 'Painel', path: '/' },
  { label: 'Autorizadas', path: '/autorizadas' },
  { label: 'Não autorizadas', path: '/radar' },
  { label: 'Notícias', path: '/noticias' },
  { label: 'Dados', path: '/series' },
  { label: 'Mudanças', path: '/mudancas' },
];

const MORE_LINKS = [
  { label: 'Avaliações', path: '/avaliacoes' },
  { label: 'Como verificamos', path: '/metodologia' },
  { label: 'API', path: '/api' },
  { label: 'Denunciar ou contestar', path: '/contestar' },
];

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenQuickSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useUser();
  const moreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const isActive = (path: string) =>
    currentPath === path || (path !== '/' && currentPath.startsWith(path));

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setAccountOpen(false);
  };

  const leave = () => {
    setAccountOpen(false);
    logout();
    handleNav('/');
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 92%, transparent)', borderColor: 'var(--color-card-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <button
          onClick={() => handleNav('/')}
          className="text-left group cursor-pointer focus-visible:outline-none rounded-sm py-1"
          aria-label="Bet Legal - Painel"
        >
          <BetLegalLogo theme={resolvedTheme} variant="compact" className="h-7 sm:h-8 w-auto" />
        </button>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {PRIMARY_LINKS.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="transition-colors cursor-pointer relative py-1 focus-visible:outline-none"
              style={isActive(link.path) ? { color: 'var(--color-text-primary)', fontWeight: 600 } : undefined}
            >
              {link.label}
              {isActive(link.path) && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--status-dado-declarado)' }}
                />
              )}
            </button>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 transition-colors cursor-pointer py-1"
              aria-haspopup="true"
              aria-expanded={moreOpen}
            >
              Mais
              <ChevronDown className={"w-3.5 h-3.5 transition-transform " + (moreOpen ? 'rotate-180' : '')} />
            </button>
            {moreOpen && (
              <div
                className="glass-card absolute right-0 mt-2 w-56 rounded-lg p-1.5 shadow-lg"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {MORE_LINKS.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className="block w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer hover:bg-white/5"
                    style={{ color: isActive(link.path) ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenQuickSearch}
            className="p-2 rounded-md transition-colors cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--color-text-tertiary)' }}
            title="Atalho de busca rápida (Ctrl+K)"
            aria-label="Abrir busca rápida"
          >
            <Search className="w-4 h-4" />
          </button>

          <ThemeToggle />

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((open) => !open)}
                  className="flex items-center cursor-pointer rounded-full focus-visible:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Abrir conta"
                >
                  {user.photo ? (
                    <img src={user.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
                    >
                      {(user.name || user.email).slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="glass-card absolute right-0 mt-2 w-56 rounded-lg p-1.5 shadow-lg"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>{ROLE_LABEL[user.role]}</p>
                    </div>
                    <button role="menuitem" onClick={() => handleNav('/perfil')} className="block w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-secondary)' }}>Profile</button>
                    {user.role === 'super_admin' && (
                      <button role="menuitem" onClick={() => handleNav('/painel')} className="block w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-secondary)' }}>Painel Geral</button>
                    )}
                    {(user.role === 'operator' || user.role === 'super_admin') && (
                      <button role="menuitem" onClick={() => handleNav('/operadora')} className="block w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-secondary)' }}>Operador</button>
                    )}
                    <button role="menuitem" onClick={leave} className="block w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-white/5" style={{ color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-card-border)' }}>Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNav('/entrar')}
                  className="px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer hover:bg-white/5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleNav('/criar-conta')}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
                >
                  Criar conta
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Abrir ou fechar menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 space-y-1 shadow-lg"
          style={{ borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {[...PRIMARY_LINKS, ...MORE_LINKS].map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {link.label}
            </button>
          ))}

          {!user && (
            <div className="pt-2 mt-1 border-t space-y-1" style={{ borderColor: 'var(--color-card-border)' }}>
              <button
                onClick={() => handleNav('/entrar')}
                className="block w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Entrar
              </button>
              <button
                onClick={() => handleNav('/criar-conta')}
                className="block w-full text-left px-3 py-2 text-sm font-semibold rounded-md"
                style={{ color: 'var(--status-dado-declarado)' }}
              >
                Criar conta
              </button>
            </div>
          )}

          <div className="pt-3 mt-2 border-t flex items-center justify-between px-3 py-2" style={{ borderColor: 'var(--color-card-border)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Modo de Exibição</span>
            <div className="flex items-center gap-1 p-1 rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className="px-2.5 py-1 text-xs rounded transition-colors"
                  style={{
                    backgroundColor: theme === mode ? 'var(--status-dado-declarado)' : 'transparent',
                    color: theme === mode ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                    fontWeight: theme === mode ? 600 : 400,
                  }}
                >
                  {mode === 'light' ? 'Claro' : mode === 'dark' ? 'Escuro' : 'Auto'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
