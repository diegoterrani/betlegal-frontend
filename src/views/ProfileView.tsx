import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { useUser } from '../context/UserContext';
import { UserRole } from '../types';
import { apiGet } from '../lib/http';

function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const size = 160;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Não lemos essa imagem.'));
        return;
      }
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não lemos essa imagem.'));
    };
    image.src = url;
  });
}

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
  const { user, saveProfile } = useUser();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState<string | null>(user?.photo || null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiGet<ProfilePayload>('/api/v1/profile')
      .then(setProfile)
      .catch((err: Error) => setError(err.message || 'O perfil não carregou.'));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhoto(user.photo);
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
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Profile</h1>
      </div>

      <GlassCard className="p-5">
        <form
          className="flex flex-col items-center text-center gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const next = name.trim();
            if (next.length < 2) {
              setError('O nome precisa de pelo menos 2 letras.');
              return;
            }
            setSaving(true);
            setSaved(false);
            setError('');
            saveProfile({ name: next, photo })
              .then(() => setSaved(true))
              .catch((err: Error) => setError(err.message || 'Não salvamos o perfil.'))
              .finally(() => setSaving(false));
          }}
        >
          <label className="cursor-pointer">
            {photo ? (
              <img src={photo} alt="" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <span
                className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                {(name || user.email).slice(0, 1).toUpperCase()}
              </span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                readPhoto(file)
                  .then((data) => { setPhoto(data); setSaved(false); })
                  .catch((err: Error) => setError(err.message));
              }}
            />
            <span className="block mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Inserir foto</span>
          </label>
          <label className="w-full max-w-sm text-left space-y-1">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nome</span>
            <input
              value={name}
              onChange={(event) => { setName(event.target.value); setSaved(false); }}
              maxLength={80}
              className="w-full rounded border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </label>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold rounded cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
          >
            {saving ? 'Salvando…' : 'Atualizar'}
          </button>
          {saved && <p className="text-xs" style={{ color: 'var(--status-autorizada)' }}>Perfil atualizado.</p>}
          {photo && (
            <button
              type="button"
              className="text-xs cursor-pointer"
              style={{ color: 'var(--color-text-tertiary)' }}
              onClick={() => { setPhoto(null); setSaved(false); }}
            >
              Remover foto
            </button>
          )}
        </form>
      </GlassCard>

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

      {user.role === 'super_admin' && (
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
