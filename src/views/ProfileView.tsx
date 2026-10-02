import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { useReviews } from '../context/ReviewsContext';
import { UserRole } from '../types';

interface ProfileViewProps {
  onNavigate: (path: string) => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  client: 'Cliente',
  operator: 'Operadora',
  admin: 'Administrador',
  super_admin: 'Administrador geral',
};

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const { reviews } = useReviews();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Seu perfil</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Entre para ver sua conta.</p>
        <button
          onClick={() => onNavigate('/entrar')}
          className="w-full px-4 py-2.5 text-sm font-semibold rounded-md cursor-pointer"
          style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
        >
          Entrar
        </button>
      </div>
    );
  }

  const myReviews = reviews.filter((r) => r.authorEmail === user.email);

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <AmbientGlow />

      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--status-dado-declarado)' }}>{ROLE_LABEL[user.role]}</p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{user.name}</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
      </div>

      {user.role === 'client' && (
        <GlassCard className="p-5 space-y-2">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Você acessa só o seu perfil e pode comentar e avaliar qualquer casa autorizada.
          </p>
          <button
            onClick={() => onNavigate('/avaliacoes')}
            className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Ir para avaliações <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      )}

      {myReviews.length > 0 && (
        <GlassCard className="p-5 space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Suas avaliações</h2>
          {myReviews.map((r) => (
            <div key={r.id} className="pt-2 text-xs space-y-1" style={{ borderTop: '1px solid var(--color-card-border)' }}>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{r.brand} <span className="font-normal" style={{ color: 'var(--color-text-tertiary)' }}>· {r.createdAt}</span></p>
              {r.comment && <p style={{ color: 'var(--color-text-secondary)' }}>{r.comment}</p>}
              {r.reply && <p style={{ color: 'var(--status-autorizada)' }}>Resposta da operadora: {r.reply}</p>}
            </div>
          ))}
        </GlassCard>
      )}

      {(user.role === 'admin' || user.role === 'super_admin') && (
        <GlassCard className="p-5 space-y-2">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {user.role === 'super_admin'
              ? 'Você administra a plataforma, as operadoras e os usuários.'
              : 'Você administra clientes, responde contestações e modera comentários.'}
          </p>
          <button
            onClick={() => onNavigate('/painel')}
            className="block text-xs font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Abrir painel →
          </button>
          {user.role === 'super_admin' && (
            <button
              onClick={() => onNavigate('/operadora')}
              className="block text-xs font-semibold cursor-pointer hover:underline"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Abrir operadoras e casas →
            </button>
          )}
        </GlassCard>
      )}

      {user.role === 'operator' && (
        <GlassCard className="p-5 space-y-2">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            A área da operadora reúne as casas na lista da SPA/MF, os comentários, as contestações e as possíveis cópias.
          </p>
          <button
            onClick={() => onNavigate('/operadora')}
            className="inline-flex items-center gap-1 text-xs font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Abrir a área da operadora <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      )}
    </div>
  );
};
