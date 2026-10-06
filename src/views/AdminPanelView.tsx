import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { CloneHouse, RegulatedClonesBoard } from '../components/RegulatedClonesBoard';
import { useUser } from '../context/UserContext';
import { apiGet, apiSend } from '../lib/http';

interface AdminPanelViewProps {
  onNavigate: (path: string) => void;
  initialTab?: 'visao' | 'clones';
}

type Tab = 'visao' | 'contestacoes' | 'avaliacoes' | 'clones' | 'filas' | 'usuarios';

interface Overview {
  kpis: {
    authorized_domains: number;
    authorized_brands: number;
    unauthorized_live: number;
    unauthorized_published: number;
    detected_offline?: number;
    detected_unchecked?: number;
    offline_after_prohibition?: number;
    blocked_anatel?: number;
    inactive_domains?: number;
    suspended_domains?: number;
    review_pending: number;
    contest_pending: number;
    last_run_finished: string | null;
  };
  today?: {
    unauthorized: number;
    returned?: number;
    authorized: number;
    blocked: number;
    day: string;
  };
}

interface Contest {
  id: number;
  type: string;
  target_url: string;
  reason: string;
  email?: string;
  created_at: string;
  status: string;
}

interface ReviewRow {
  id: number;
  comment: string | null;
  hidden: boolean;
  brand: string;
  email: string;
}

interface QueuePayload {
  descoberta?: unknown;
  verificacao?: unknown;
  classificacao?: unknown;
  confronto?: unknown;
  publicacao?: unknown;
  updated_at?: string;
}

interface HumanPayload {
  tasks?: { id: number; host?: string; reason?: string; kind?: string }[];
  counts?: Record<string, number>;
}

interface UserRow {
  id: number;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
}

const fmt = (n: number) => n.toLocaleString('pt-BR');

const PanelStock: React.FC<{ kpis: Overview['kpis']; today?: Overview['today'] }> = ({ kpis, today }) => {
  const detected = kpis.unauthorized_published;
  const online = kpis.unauthorized_live;
  const offline = kpis.detected_offline ?? 0;
  const unchecked = kpis.detected_unchecked ?? 0;
  const cards: { label: string; value: number; detail?: string }[] = [
    { label: 'Autorizadas', value: kpis.authorized_domains, detail: `${fmt(kpis.authorized_brands)} marcas` },
    { label: 'Não autorizadas detectadas', value: detected, detail: 'Fora de qualquer lista oficial.' },
    { label: 'Online', value: online, detail: 'Página ainda respondendo, só entre as detectadas.' },
    { label: 'Fora do ar', value: offline, detail: `${fmt(kpis.offline_after_prohibition ?? 0)} saíram do ar depois de 25/09 às 18h.` },
    { label: 'Sem checagem', value: unchecked, detail: 'Ainda não há leitura conclusiva de disponibilidade.' },
    { label: 'Bloqueadas Anatel', value: kpis.blocked_anatel ?? 0, detail: 'Lista de bloqueio. Não entram no estoque detectado.' },
    { label: 'Inativas', value: kpis.inactive_domains ?? 0, detail: 'Fora do estoque detectado.' },
    { label: 'Suspensas', value: kpis.suspended_domains ?? 0, detail: 'Saíram da lista oficial. Não entram no estoque detectado.' },
    { label: 'Detectadas hoje', value: today?.unauthorized ?? 0, detail: 'Classificação de página. A sonda não entra.' },
    { label: 'Voltaram ao ar hoje', value: today?.returned ?? 0, detail: 'Já eram detectadas e uma leitura de página as encontrou.' },
    { label: 'Fila de revisão', value: kpis.review_pending },
    { label: 'Contestações pendentes', value: kpis.contest_pending },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((card) => (
          <GlassCard key={card.label} className="p-4">
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{card.label}</p>
            <p className="font-mono text-2xl" style={{ color: 'var(--color-text-primary)' }}>{fmt(card.value)}</p>
            {card.detail && <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{card.detail}</p>}
          </GlassCard>
        ))}
      </div>
      <p className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
        {fmt(online)} + {fmt(offline)} + {fmt(unchecked)} = {fmt(detected)}
      </p>
    </div>
  );
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'visao', label: 'Visão' },
  { id: 'contestacoes', label: 'Contestações' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'clones', label: 'Clones' },
  { id: 'filas', label: 'Filas' },
  { id: 'usuarios', label: 'Usuários' },
];

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onNavigate, initialTab = 'visao' }) => {
  const { user, ready } = useUser();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [houses, setHouses] = useState<CloneHouse[] | null>(null);
  const [queues, setQueues] = useState<QueuePayload | null>(null);
  const [human, setHuman] = useState<HumanPayload | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [note, setNote] = useState<Record<number, string>>({});

  const superAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!ready || !superAdmin) return;
    let cancelled = false;
    const fail = (err: Error) => { if (!cancelled) setError(err.message); };
    if (tab === 'visao') {
      apiGet<Overview>('/api/v1/admin/overview').then((data) => { if (!cancelled) setOverview(data); }).catch(fail);
    } else if (tab === 'contestacoes') {
      apiGet<{ contests: Contest[] }>('/api/v1/admin/contests').then((data) => { if (!cancelled) setContests(data.contests || []); }).catch(fail);
    } else if (tab === 'avaliacoes') {
      apiGet<{ reviews: ReviewRow[] }>('/api/v1/admin/reviews').then((data) => { if (!cancelled) setReviews(data.reviews || []); }).catch(fail);
    } else if (tab === 'clones' && user?.role === 'super_admin') {
      apiGet<{ houses: CloneHouse[] }>('/api/v1/admin/regulated-clones')
        .then((data) => { if (!cancelled) setHouses(data.houses || []); })
        .catch((err: Error) => { if (!cancelled) { setHouses([]); fail(err); } });
    } else if (tab === 'filas') {
      Promise.allSettled([
        apiGet<QueuePayload>('/api/v1/admin/pipeline-queues'),
        apiGet<HumanPayload>('/api/v1/admin/human-reviews'),
      ]).then(([queueResult, humanResult]) => {
        if (cancelled) return;
        setQueues(queueResult.status === 'fulfilled' ? queueResult.value : null);
        setHuman(humanResult.status === 'fulfilled' ? humanResult.value : null);
      });
    } else if (tab === 'usuarios' && user?.role === 'super_admin') {
      apiGet<{ users: UserRow[] }>('/api/v1/admin/users').then((data) => { if (!cancelled) setUsers(data.users || []); }).catch(fail);
    }
    return () => { cancelled = true; };
  }, [tab, ready, superAdmin, user?.role]);

  if (!ready) return null;
  if (!superAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Painel</h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Esta área abre só com a sessão de super admin na mesma origem.</p>
        <button onClick={() => onNavigate('/entrar?next=/painel')} className="px-4 py-2 text-sm font-semibold rounded cursor-pointer" style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}>Entrar</button>
      </div>
    );
  }

  const kpis = overview?.kpis;

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Painel</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>As ações gravam no BFF de produção pela mesma origem.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button key={item.id} onClick={() => { setError(''); setTab(item.id); }} className="text-xs px-3 py-1.5 rounded cursor-pointer" style={{ backgroundColor: tab === item.id ? 'var(--status-dado-declarado)' : 'transparent', color: tab === item.id ? 'var(--color-bg)' : 'var(--color-text-secondary)', border: '1px solid var(--color-card-border)' }}>
            {item.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}

      {tab === 'visao' && kpis && (
        <PanelStock kpis={kpis} today={overview?.today} />
      )}

      {tab === 'contestacoes' && contests.map((contest) => (
        <GlassCard key={contest.id} className="p-4 space-y-2 text-xs">
          <p style={{ color: 'var(--color-text-primary)' }}>{contest.target_url || 'sem alvo'} · {contest.status}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>{contest.reason}</p>
          {contest.status === 'PENDENTE' && (
            <div className="flex gap-2">
              {(['DEFERIDA', 'INDEFERIDA'] as const).map((status) => (
                <button key={status} className="px-2 py-1 rounded cursor-pointer" style={{ border: '1px solid var(--color-card-border)', color: 'var(--color-text-secondary)' }} onClick={() => {
                  apiSend('/api/v1/admin/contests', 'POST', { id: contest.id, status })
                    .then(() => setContests((rows) => rows.map((row) => row.id === contest.id ? { ...row, status } : row)))
                    .catch((err: Error) => setError(err.message));
                }}>{status}</button>
              ))}
            </div>
          )}
        </GlassCard>
      ))}

      {tab === 'avaliacoes' && reviews.map((review) => (
        <GlassCard key={review.id} className="p-4 space-y-2 text-xs">
          <p style={{ color: 'var(--color-text-primary)' }}>{review.brand} · {review.email} {review.hidden ? '· oculta' : ''}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>{review.comment || 'Sem texto'}</p>
          <button className="px-2 py-1 rounded cursor-pointer" style={{ border: '1px solid var(--color-card-border)' }} onClick={() => {
            apiSend('/api/v1/admin/reviews', 'PATCH', { id: review.id, comment: review.comment, hidden: !review.hidden })
              .then(() => setReviews((rows) => rows.map((row) => row.id === review.id ? { ...row, hidden: !row.hidden } : row)))
              .catch((err: Error) => setError(err.message));
          }}>{review.hidden ? 'Mostrar' : 'Ocultar'}</button>
        </GlassCard>
      ))}

      {tab === 'clones' && (
        <RegulatedClonesBoard houses={houses} onNavigate={onNavigate} />
      )}

      {tab === 'filas' && (
        <div className="space-y-3">
          {queues && (
            <GlassCard className="p-4 text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
              <p>Descoberta {String(queues.descoberta ?? '—')} · verificação {String(queues.verificacao ?? '—')}</p>
              <p>Classificação {String(queues.classificacao ?? '—')} · confronto {String(queues.confronto ?? '—')} · publicação {String(queues.publicacao ?? '—')}</p>
            </GlassCard>
          )}
          {(human?.tasks || []).map((task) => (
            <GlassCard key={task.id} className="p-4 space-y-2 text-xs">
              <p style={{ color: 'var(--color-text-primary)' }}>{task.host || task.kind || `tarefa ${task.id}`}</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>{task.reason}</p>
              <input value={note[task.id] || ''} onChange={(e) => setNote((current) => ({ ...current, [task.id]: e.target.value }))} placeholder="Nota obrigatória" className="w-full rounded border bg-transparent px-2 py-1" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }} />
              <div className="flex gap-2">
                {(['approved', 'rejected'] as const).map((decision) => (
                  <button key={decision} className="px-2 py-1 rounded cursor-pointer" style={{ border: '1px solid var(--color-card-border)' }} onClick={() => {
                    apiSend('/api/v1/admin/human-reviews', 'POST', { id: task.id, decision, note: note[task.id] || '' })
                      .then(() => setHuman((current) => current ? { ...current, tasks: (current.tasks || []).filter((item) => item.id !== task.id) } : current))
                      .catch((err: Error) => setError(err.message));
                  }}>{decision === 'approved' ? 'Aprovar' : 'Recusar'}</button>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {tab === 'usuarios' && users.map((account) => (
        <GlassCard key={account.id} className="p-4 flex items-center justify-between gap-3 text-xs">
          <span style={{ color: 'var(--color-text-primary)' }}>{account.email}</span>
          <select value={account.role} onChange={(e) => {
            const role = e.target.value;
            apiSend('/api/v1/admin/users', 'PATCH', { id: account.id, role })
              .then(() => setUsers((rows) => rows.map((row) => row.id === account.id ? { ...row, role } : row)))
              .catch((err: Error) => setError(err.message));
          }} className="bg-transparent border rounded px-2 py-1" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
            {['client', 'operator', 'admin', 'super_admin'].map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </GlassCard>
      ))}
    </div>
  );
};
