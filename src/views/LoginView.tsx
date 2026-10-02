import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Briefcase, User } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { UserRole, UserSession } from '../types';
import { MOCK_ACCOUNTS } from '../data/mockData';

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

const VALUE_PROPS = [
  'Avalie casas autorizadas',
  'Salve fichas para acompanhar',
  'Receba alertas de mudanças',
];

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  super_admin: <ShieldCheck className="w-4 h-4" />,
  operator: <Briefcase className="w-4 h-4" />,
  client: <User className="w-4 h-4" />,
  admin: <ShieldCheck className="w-4 h-4" />,
};

const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  operator: 'Operadora',
  client: 'Cliente',
  admin: 'Administrador',
};

function destinationFor(role: UserRole): string {
  if (role === 'super_admin' || role === 'admin') return '/painel';
  if (role === 'operator') return '/operadora';
  return '/';
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, loginAs } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSession = (session: UserSession | null) => {
    if (!session) {
      setError('E-mail ou senha inválidos. Use uma das contas de demonstração abaixo.');
      return;
    }
    onNavigate(destinationFor(session.role));
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-12 px-4">
      <AmbientGlow />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div
            className="text-[11px] font-mono font-medium uppercase tracking-[0.2em]"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Conta Bet Legal
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Avaliações e alertas do mercado em um só lugar.
          </p>
        </div>

        <ul className="space-y-1.5">
          {VALUE_PROPS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-autorizada)' }} />
              {item}
            </li>
          ))}
        </ul>

        <GlassCard className="p-6 space-y-4">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Entrar no Bet Legal
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Acesse suas avaliações e ferramentas de monitoramento.
            </p>
          </div>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSession(login(email, password));
            }}
          >
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg px-3 py-2 text-sm bg-transparent border outline-none transition-colors"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-3 py-2 text-sm bg-transparent border outline-none transition-colors"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              />
            </div>
            {error && (
              <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg py-2 text-sm font-semibold transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              Continuar
            </button>
          </form>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            Não tem conta?{' '}
            <button onClick={() => onNavigate('/criar-conta')} className="underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
              Criar conta
            </button>
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Contas de demonstração</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Ambiente de dev sem backend: entre direto com um dos 3 perfis para validar os painéis logados.
            </p>
          </div>
          <div className="space-y-2">
            {MOCK_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleSession(loginAs(account.role))}
                className="w-full flex items-center justify-between gap-3 p-3 rounded border text-left transition-colors hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--color-card-border)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ color: 'var(--status-dado-declarado)', backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 10%, transparent)' }}
                  >
                    {ROLE_ICON[account.role]}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{account.name}</div>
                    <div className="text-[11px] font-mono truncate" style={{ color: 'var(--color-text-tertiary)' }}>{account.email}</div>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0"
                  style={{ color: 'var(--status-dado-declarado)', backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 10%, transparent)' }}
                >
                  {ROLE_LABEL[account.role]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[11px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            Senha de qualquer conta de demonstração: demo123
          </p>
        </GlassCard>

        <p className="text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          A consulta de sites continua livre, sem conta.
        </p>
      </div>
    </div>
  );
};
