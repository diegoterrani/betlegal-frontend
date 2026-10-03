import React, { useState } from 'react';
import { CheckCircle2, User, Building2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

interface RegisterViewProps {
  onNavigate: (path: string) => void;
}

const VALUE_PROPS_PESSOA = [
  'Avaliações com voto único por pessoa',
  'Alertas sobre casas que você segue',
];

const VALUE_PROPS_OPERADORA = [
  'Área de operadora para acompanhar sua marca',
];

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const [accountType, setAccountType] = useState<'pessoa' | 'operadora'>('pessoa');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
            Crie sua conta para avaliar e acompanhar.
          </p>
        </div>

        <ul className="space-y-1.5">
          {[...VALUE_PROPS_PESSOA, ...VALUE_PROPS_OPERADORA].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--status-autorizada)' }} />
              {item}
            </li>
          ))}
        </ul>

        <GlassCard className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setAccountType('pessoa')}
              className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: accountType === 'pessoa' ? 'var(--status-dado-declarado)' : 'transparent',
                color: accountType === 'pessoa' ? 'var(--color-bg)' : 'var(--color-text-secondary)',
              }}
            >
              <User className="w-3.5 h-3.5" /> Pessoa
            </button>
            <button
              onClick={() => setAccountType('operadora')}
              className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: accountType === 'operadora' ? 'var(--status-dado-declarado)' : 'transparent',
                color: accountType === 'operadora' ? 'var(--color-bg)' : 'var(--color-text-secondary)',
              }}
            >
              <Building2 className="w-3.5 h-3.5" /> Operadora
            </button>
          </div>

          {submitted ? (
            <div className="space-y-3 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                Este é um ambiente de demonstração sem backend: não dá para criar contas novas.
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Use uma das 3 contas prontas (Super Admin, Operadora ou Cliente) na tela de entrada para validar os painéis.
              </p>
              <button
                onClick={() => onNavigate('/entrar')}
                className="w-full rounded-lg py-2 text-sm font-semibold transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                Ver contas de demonstração
              </button>
            </div>
          ) : (
            <>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
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
                <button
                  type="submit"
                  className="w-full rounded-lg py-2 text-sm font-semibold transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
                >
                  Criar conta
                </button>
              </form>

              <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                Já tem conta?{' '}
                <button onClick={() => onNavigate('/entrar')} className="underline cursor-pointer" style={{ color: 'var(--status-dado-declarado)' }}>
                  Entrar
                </button>
              </p>
            </>
          )}
        </GlassCard>

        <p className="text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          A consulta de sites continua livre, sem conta.
        </p>
      </div>
    </div>
  );
};
