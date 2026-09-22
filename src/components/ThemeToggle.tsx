import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, showLabels = false }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    { mode: 'light', label: 'Modo Claro', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { mode: 'dark', label: 'Modo Escuro', icon: <Moon className="w-4 h-4 text-sky-400" /> },
    { mode: 'system', label: 'Automático (Sistema)', icon: <Monitor className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD1] bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-[#0B1726] dark:hover:bg-[#13253B] dark:text-slate-200 dark:border-slate-700"
        aria-label="Alternar tema de cor (claro ou escuro)"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Tema atual: ${theme === 'system' ? `Sistema (${resolvedTheme === 'dark' ? 'Escuro' : 'Claro'})` : theme === 'dark' ? 'Escuro' : 'Claro'}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        )}

        {(showLabels || !compact) && (
          <span className="hidden sm:inline text-xs font-mono">
            {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Escuro' : 'Claro'}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-48 rounded-md bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-700 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
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
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 text-[#0B1F33] font-semibold dark:bg-[#13253B] dark:text-white'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#112236]'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1F5FD1] dark:text-sky-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
