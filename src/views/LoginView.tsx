import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { UserRole, UserSession } from '../types';

interface LoginViewProps {
  onNavigate: (path: string) => void;
  redirectPath?: string;
}

const VALUE_PROPS = [
  'Avalie casas autorizadas',
  'Salve fichas para acompanhar',
  'Receba alertas de mudanças',
];

function destinationFor(role: UserRole): string {
  if (role === 'super_admin') return '/painel';
  if (role === 'operator') return '/operadora';
  return '/';
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, redirectPath = '' }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSession = (session: UserSession) => {
    const next = redirectPath.startsWith('/') ? redirectPath : destinationFor(session.role);
    onNavigate(next);
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
              setBusy(true);
              setError('');
              login(email, password)
                .then(handleSession)
                .catch((err: Error) => setError(err.message || 'Não foi possível entrar.'))
                .finally(() => setBusy(false));
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
              {busy ? 'Entrando…' : 'Continuar'}
            </button>
          </form>

          <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            Não tem conta?{' '}
            <button onClick={() => onNavigate('/criar-conta')} className="underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
              Criar conta
            </button>
          </p>
        </GlassCard>

        <p className="text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          A consulta de sites continua livre, sem conta.
        </p>
      </div>
    </div>
  );
};
