import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, showLabels = false }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Modo Claro', icon: <Sun className="w-4 h-4" /> },
    { mode: 'dark', label: 'Modo Escuro', icon: <Moon className="w-4 h-4" /> },
    { mode: 'system', label: 'Automático (Sistema)', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 hover:bg-white/5"
        style={{
          borderColor: 'var(--color-card-border)',
          color: 'var(--color-text-secondary)',
          ['--tw-ring-color' as any]: 'var(--status-dado-declarado)',
        }}
        aria-label="Alternar tema de cor (claro ou escuro)"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Tema atual: ${theme === 'system' ? `Sistema (${resolvedTheme === 'dark' ? 'Escuro' : 'Claro'})` : theme === 'dark' ? 'Escuro' : 'Claro'}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Sun className="w-3.5 h-3.5 shrink-0" />
        )}

        {(showLabels || !compact) && (
          <span className="hidden sm:inline text-xs font-mono">
            {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Escuro' : 'Claro'}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass-card absolute right-0 mt-1.5 w-48 rounded-md shadow-lg py-1 z-50"
          style={{ backgroundColor: 'var(--color-surface)' }}
          role="menu"
          aria-orientation="vertical"
        >
          <div
            className="px-3 py-1.5 border-b text-[11px] font-mono font-medium uppercase tracking-[0.15em]"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-tertiary)' }}
          >
            Aparência
          </div>

          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer hover:bg-white/5"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                }}
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--status-dado-declarado)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
