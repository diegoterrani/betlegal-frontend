import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { UserRole } from '../types';
import { apiGet } from '../lib/http';

interface ProfileViewProps {
  onNavigate: (path: string) => void;
}

interface ProfilePayload {
  profile: {
    email: string;
    role: UserRole;
    hold: {
      legalName: string;
      cnpj: string;
      domain: string;
      status: string;
      houses: { name: string; host: string }[];
    } | null;
  };
  reviews: { id: number; comment: string | null; created_at: string; brand: string; reply: string | null }[];
}

const ROLE_LABEL: Record<UserRole, string> = {
  client: 'Cliente',
  operator: 'Operadora',
  admin: 'Administrador',
  super_admin: 'Administrador geral',
};

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    apiGet<ProfilePayload>('/api/v1/profile')
      .then(setProfile)
      .catch((err: Error) => setError(err.message || 'O perfil não carregou.'));
  }, [user]);

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

  const hold = profile?.profile.hold;
  const reviews = profile?.reviews || [];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <AmbientGlow />

      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--status-dado-declarado)' }}>{ROLE_LABEL[user.role]}</p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{user.name}</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
      </div>

      {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}

      {user.role === 'client' && (
        <GlassCard className="p-5 space-y-2">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Você acessa o seu perfil e pode avaliar uma casa autorizada. A avaliação fica na ficha da marca.
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

      {hold && (
        <GlassCard className="p-5 space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{hold.legalName}</h2>
          <p>CNPJ {hold.cnpj} · domínio {hold.domain} · {hold.status}</p>
          {hold.houses.map((house) => (
            <p key={house.host}>{house.name} · {house.host}</p>
          ))}
        </GlassCard>
      )}

      {reviews.length > 0 && (
        <GlassCard className="p-5 space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Avaliações da hold</h2>
          {reviews.map((review) => (
            <div key={review.id} className="pt-2 text-xs space-y-1" style={{ borderTop: '1px solid var(--color-card-border)' }}>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {review.brand} <span className="font-normal" style={{ color: 'var(--color-text-tertiary)' }}>· {new Date(review.created_at).toLocaleDateString('pt-BR')}</span>
              </p>
              {review.comment && <p style={{ color: 'var(--color-text-secondary)' }}>{review.comment}</p>}
              {review.reply && <p style={{ color: 'var(--status-autorizada)' }}>Resposta: {review.reply}</p>}
            </div>
          ))}
        </GlassCard>
      )}

      {(user.role === 'admin' || user.role === 'super_admin') && (
        <GlassCard className="p-5 space-y-2">
          <button
            onClick={() => onNavigate('/painel')}
            className="block text-xs font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Abrir painel →
          </button>
        </GlassCard>
      )}

      {user.role === 'operator' && (
        <GlassCard className="p-5">
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
