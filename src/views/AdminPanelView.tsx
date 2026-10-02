import React, { useState } from 'react';
import { BetEntity, ContestationTicket } from '../types';
import {
  INITIAL_TICKETS,
  PIPELINE_QUEUES,
  HUMAN_REVIEW_QUEUE,
  ADMIN_USERS,
  ADMIN_HOLDS,
  ADMIN_REVIEWS,
  CLONE_LINKS,
  HumanReviewTask,
  HumanReviewGroup,
  AdminUserAccount,
  AdminUserRole,
  AdminHoldAccount,
  AdminReviewModeration,
} from '../data/mockData';
import { Server, Lock, RefreshCw, CheckCircle2, XCircle, ExternalLink, Layers } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { KpiCard } from '../components/ui/KpiCard';
import { useUser } from '../context/UserContext';

interface AdminPanelViewProps {
  entities: BetEntity[];
  onNavigate: (path: string) => void;
}

type Panel = 'operacao' | 'validacoes' | 'clones';

const REVIEW_FILTERS: { id: HumanReviewGroup | 'todas'; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'baixa', label: 'Confiança baixa' },
  { id: 'terceiro', label: 'Página de terceiro' },
  { id: 'sonda', label: 'Sonda do Brasil' },
  { id: 'betbr', label: '.bet.br fora da lista' },
  { id: 'contestacao', label: 'Contestação' },
];

function percent(value: number | null): string {
  if (value === null) return '—';
  return `${Math.round(value * 100)}%`;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ entities, onNavigate }) => {
  const { user } = useUser();
  const [panel, setPanel] = useState<Panel>('operacao');
  const [tickets, setTickets] = useState<ContestationTicket[]>(INITIAL_TICKETS);
  const [syncingCrawler, setSyncingCrawler] = useState<string | null>(null);
  const [reviewQueue, setReviewQueue] = useState<HumanReviewTask[]>(HUMAN_REVIEW_QUEUE);
  const [reviewFilter, setReviewFilter] = useState<HumanReviewGroup | 'todas'>('todas');
  const [users, setUsers] = useState<AdminUserAccount[]>(ADMIN_USERS);
  const [holds, setHolds] = useState<AdminHoldAccount[]>(ADMIN_HOLDS);
  const [reviews, setReviews] = useState<AdminReviewModeration[]>(ADMIN_REVIEWS);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'client' as AdminUserRole });
  const [cloneSearch, setCloneSearch] = useState('');

  const tabBtnStyle = (active: boolean) => ({
    backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
  });

  const handleResolveTicket = (ticketId: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'concluido' } : t));
  };

  const handleTriggerSync = (crawlerName: string) => {
    setSyncingCrawler(crawlerName);
    setTimeout(() => setSyncingCrawler(null), 1200);
  };

  const decideReview = (id: number) => {
    setReviewQueue((q) => q.filter((t) => t.id !== id));
  };

  const changeUserRole = (id: number, to: AdminUserRole) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, role: to } : u)));
  };

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;
    setUsers((list) => [...list, { id: Date.now(), email: newUser.email, role: newUser.role }]);
    setNewUser({ email: '', password: '', role: 'client' });
  };

  const saveHoldName = (id: number, legalName: string) => {
    setHolds((list) => list.map((h) => (h.id === id ? { ...h, legalName } : h)));
  };

  const saveReviewComment = (id: number, comment: string, hidden: boolean) => {
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, comment, hidden } : r)));
  };

  const visibleReviews = reviewQueue.filter((t) => reviewFilter === 'todas' || t.group === reviewFilter);

  const cloneHouses = entities.filter((e) => CLONE_LINKS.some((link) => link.officialSlug === e.slug));
  const cloneEntities = entities.filter((e) => CLONE_LINKS.some((link) => link.cloneSlug === e.slug));
  const cloneQuery = cloneSearch.trim().toLowerCase();
  const filteredCloneHouses = cloneHouses.filter((house) => {
    if (!cloneQuery) return true;
    const clones = CLONE_LINKS.filter((l) => l.officialSlug === house.slug).map((l) => cloneEntities.find((c) => c.slug === l.cloneSlug));
    const haystack = [house.brandName, house.legalName, house.cnpj, ...clones.filter(Boolean).map((c) => c!.domains[0]?.host || '')].join(' ').toLowerCase();
    return haystack.includes(cloneQuery);
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const showClones = user?.role === 'super_admin';
  const activePanel = panel === 'clones' && !showClones ? 'operacao' : panel;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
          style={{ backgroundColor: 'color-mix(in srgb, var(--status-atencao) 15%, transparent)' }}
        >
          <Lock className="w-6 h-6" style={{ color: 'var(--status-atencao)' }} />
        </div>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Acesso restrito</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          O painel abre só com a sessão de administrador. Use a conta de demonstração "Diego Terrani" (Super Admin) na tela de entrada.
        </p>
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

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Title */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
          <Lock className="w-4 h-4" />
          Área Operacional Interna · Noindex · Administrador geral
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Painel de Auditoria e Sondas de Fontes
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Monitoramento das 4 janelas operacionais, integridade dos crawlers de dados públicos e fila de contestação técnica.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b pb-2 flex-wrap" style={{ borderColor: 'var(--color-card-border)' }}>
        <button onClick={() => setPanel('operacao')} className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors" style={tabBtnStyle(activePanel === 'operacao')}>
          Operação
        </button>
        <button onClick={() => setPanel('validacoes')} className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors" style={tabBtnStyle(activePanel === 'validacoes')}>
          Validações humanas ({reviewQueue.length})
        </button>
        {showClones && (
        <button onClick={() => setPanel('clones')} className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors" style={tabBtnStyle(activePanel === 'clones')}>
          Gestão de Clones
        </button>
        )}
      </div>

      {activePanel === 'operacao' && (
        <div className="space-y-6">
          {/* KPIs Operacionais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4">
              <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Cobertura de Fontes Oficiais</span>
              <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums" style={{ color: 'var(--status-autorizada)' }}>99.8%</span>
              <span className="text-[11px] block mt-1" style={{ color: 'var(--color-text-tertiary)' }}>DOU, SIGAP e Loterias</span>
            </GlassCard>

            <GlassCard className="p-4">
              <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Domínios Monitorados</span>
              <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>4.890</span>
              <span className="text-[11px] block mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Sondas HTTP/SSL a cada 4h</span>
            </GlassCard>

            <GlassCard className="p-4">
              <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Fila de Revisão Humana</span>
              <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums" style={{ color: 'var(--status-atencao)' }}>
                {tickets.filter(t => t.status !== 'concluido').length}
              </span>
              <span className="text-[11px] block mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Tickets pendentes de triagem</span>
            </GlassCard>

            <GlassCard className="p-4">
              <span className="text-xs block mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Última Janela Concluída</span>
              <span className="font-mono text-xl sm:text-2xl font-semibold" style={{ color: 'var(--status-dado-declarado)' }}>12:00 BRT</span>
              <span className="text-[11px] block mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Próxima sonda: 18:00 BRT</span>
            </GlassCard>
          </div>

          {/* Filas do pipeline */}
          <GlassCard className="p-4 sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Layers className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
                Filas do pipeline
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Atualizado em {PIPELINE_QUEUES.updatedAt}</p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              {([
                ['descoberta', 'Fila de Descoberta'],
                ['verificacao', 'Fila de Verificação'],
                ['classificacao', 'Fila de Classificação'],
                ['confronto', 'Fila de Confronto'],
                ['publicacao', 'Fila de Publicação'],
              ] as const).map(([key, label]) => (
                <div key={key} className="rounded-lg border px-3 py-3" style={{ borderColor: 'var(--color-card-border)' }}>
                  <dt className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{label}</dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{PIPELINE_QUEUES[key].toLocaleString('pt-BR')}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>

          {/* Status dos Crawlers / Robôs de Sincronização */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
              <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Server className="w-4 h-4" style={{ color: 'var(--status-dado-declarado)' }} />
                Status das Integrações de Fontes Públicas
              </h2>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>Sync Interval: 6 horas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { id: 'dou', name: 'Crawler DOU (Diário Oficial da União)', target: 'Portarias SPA/MF e Decretos', status: 'Operacional', latency: '120ms' },
                { id: 'sigap', name: 'Conector SIGAP (Ministério da Fazenda)', target: 'Requerimentos e Habilitações', status: 'Operacional', latency: '240ms' },
                { id: 'anatel', name: 'Parser de Notificações Anatel', target: 'Listagens de Bloqueio DNS', status: 'Operacional', latency: '80ms' },
                { id: 'registrobr', name: 'Sonda WHOIS Registro.br (.bet.br)', target: 'Delegação de DNS e Titularidade', status: 'Operacional', latency: '150ms' },
              ].map((c) => (
                <div key={c.id} className="p-4 rounded border flex items-center justify-between gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                  <div>
                    <span className="font-semibold block" style={{ color: 'var(--color-text-primary)' }}>{c.name}</span>
                    <span className="block text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{c.target}</span>
                    <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                      <span className="font-semibold flex items-center gap-1" style={{ color: 'var(--status-autorizada)' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-autorizada)' }} />
                        {c.status}
                      </span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{c.latency}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerSync(c.id)}
                    disabled={syncingCrawler === c.id}
                    className="px-3 py-1.5 rounded font-medium cursor-pointer text-xs flex items-center gap-1 shrink-0 transition-colors border hover:bg-white/5"
                    style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" style={syncingCrawler === c.id ? { animation: 'spin 1s linear infinite', color: 'var(--status-dado-declarado)' } : undefined} />
                    {syncingCrawler === c.id ? 'Sondando...' : 'Forçar Sync'}
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Fila de Contestação e Denúncias (Revisão Humana) */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Fila de Triagem Técnica e Contestações
                </h2>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Solicitações de operadores, usuários e pesquisadores</p>
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                {tickets.filter(t => t.status !== 'concluido').length} pendente(s)
              </span>
            </div>

            <div className="text-xs">
              {tickets.map((ticket, idx) => (
                <div key={ticket.id} className="py-4 space-y-2" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--color-card-border)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold" style={{ color: 'var(--color-text-primary)' }}>{ticket.id}</span>
                      <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Alvo: {ticket.brandOrDomain}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        {ticket.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{ticket.createdAt}</span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{
                          color: ticket.status === 'concluido' ? 'var(--status-autorizada)' : 'var(--status-atencao)',
                          backgroundColor: ticket.status === 'concluido' ? 'color-mix(in srgb, var(--status-autorizada) 12%, transparent)' : 'color-mix(in srgb, var(--status-atencao) 12%, transparent)',
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed p-3 rounded border" style={{ color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Justificativa: </strong>{ticket.justification}
                  </p>

                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    <div>
                      Solicitante: <strong style={{ color: 'var(--color-text-secondary)' }}>{ticket.requesterName}</strong> ({ticket.requesterEmail}) · {ticket.requesterRole}
                    </div>

                    {ticket.status !== 'concluido' && (
                      <button
                        onClick={() => handleResolveTicket(ticket.id)}
                        className="px-3 py-1 font-semibold rounded cursor-pointer transition-colors"
                        style={{ backgroundColor: 'var(--status-autorizada)', color: 'var(--color-bg)' }}
                      >
                        Homologar Revisão e Fechar Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Usuários */}
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Usuários</h2>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={addUser}>
              <input
                required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="e-mail" aria-label="E-mail do novo usuário"
                className="flex-1 px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              />
              <input
                required type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="senha" aria-label="Senha do novo usuário"
                className="flex-1 px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              />
              <select
                value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUserRole })}
                aria-label="Papel do novo usuário"
                className="px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
              >
                <option value="client">Cliente</option>
                <option value="operator">Operadora</option>
                <option value="admin">Administrador</option>
                <option value="super_admin">Administrador geral</option>
              </select>
              <button type="submit" className="px-4 py-2 text-xs font-semibold rounded cursor-pointer" style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}>
                Incluir
              </button>
            </form>
            {users.map((account) => (
              <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2" style={{ borderTop: '1px solid var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
                <span className="break-all">{account.email}</span>
                <select
                  value={account.role}
                  onChange={(e) => changeUserRole(account.id, e.target.value as AdminUserRole)}
                  aria-label={`Papel de ${account.email}`}
                  className="px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none"
                  style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
                >
                  <option value="client">Cliente</option>
                  <option value="operator">Operadora</option>
                  <option value="admin">Administrador</option>
                  <option value="super_admin">Administrador geral</option>
                </select>
              </div>
            ))}
          </GlassCard>

          {/* Operadoras cadastradas */}
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Operadoras cadastradas</h2>
            {holds.map((hold) => (
              <form
                key={hold.id}
                className="pt-2 space-y-2"
                style={{ borderTop: '1px solid var(--color-card-border)' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  saveHoldName(hold.id, String(form.get('legalName') || hold.legalName));
                }}
              >
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {hold.email} · CNPJ {hold.cnpj} · {hold.status === 'active' ? 'Ativa' : 'E-mail pendente de confirmação'}
                </p>
                <input
                  name="legalName" defaultValue={hold.legalName} aria-label={`Razão social de ${hold.email}`}
                  className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
                  style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
                />
                <button type="submit" className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border hover:bg-white/5" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
                  Salvar razão social
                </button>
              </form>
            ))}
          </GlassCard>

          {/* Comentários */}
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Comentários</h2>
            {reviews.map((review) => (
              <form
                key={review.id}
                className="pt-2 space-y-2"
                style={{ borderTop: '1px solid var(--color-card-border)' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  saveReviewComment(review.id, String(form.get('comment') || ''), form.get('hidden') === 'on');
                }}
              >
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{review.brand} · {review.email}</p>
                <textarea
                  name="comment" defaultValue={review.comment || ''} rows={2} aria-label={`Comentário sobre ${review.brand}`}
                  className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none resize-none"
                  style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
                />
                <label className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <input type="checkbox" name="hidden" defaultChecked={review.hidden} /> Ocultar comentário
                </label>
                <button type="submit" className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border hover:bg-white/5" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
                  Salvar comentário
                </button>
              </form>
            ))}
          </GlassCard>
        </div>
      )}

      {activePanel === 'validacoes' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Validações humanas</h2>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Casos que a publicação automática não fecha. Casa de apostas com confiança acima de 80% entra no ar sozinha, inclusive quando a página parece de terceiro. Confiança abaixo de 40% é descartada. De 40% a 80%, .bet.br fora da lista, sonda e contestação continuam aqui. {reviewQueue.length} pendentes.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {REVIEW_FILTERS.map((item) => {
              const count = item.id === 'todas' ? reviewQueue.length : reviewQueue.filter((t) => t.group === item.id).length;
              if (item.id !== 'todas' && count === 0) return null;
              const selected = reviewFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setReviewFilter(item.id)}
                  className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                  style={selected
                    ? { backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)', borderColor: 'var(--status-dado-declarado)' }
                    : { borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </div>

          {visibleReviews.length === 0 && (
            <GlassCard className="p-6 text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Nenhuma validação pendente neste recorte.
            </GlassCard>
          )}

          <div className="space-y-3">
            {visibleReviews.map((task) => (
              <GlassCard key={task.id} className="p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}>
                        {task.groupLabel}
                      </span>
                      <a
                        className="inline-flex items-center gap-1 min-w-0 font-mono text-sm font-bold break-all hover:underline"
                        style={{ color: 'var(--status-dado-declarado)' }}
                        href={task.finalUrl || `https://${task.host}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        {task.host}
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                    {task.title && <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{task.title}</p>}
                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{task.reason}</p>
                  </div>
                  <div className="text-xs shrink-0 text-right" style={{ color: 'var(--color-text-secondary)' }}>
                    <div>Confiança: <strong style={{ color: 'var(--color-text-primary)' }}>{percent(task.confidence)}</strong></div>
                    <div style={{ color: 'var(--color-text-tertiary)' }}>Mira o Brasil: {percent(task.confidenceTargetsBrazil)}</div>
                  </div>
                </div>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div><dt style={{ color: 'var(--color-text-tertiary)' }}>Casa de apostas</dt><dd style={{ color: 'var(--color-text-secondary)' }}>{task.isBettingSite === null ? '—' : task.isBettingSite ? 'sim' : 'não'}</dd></div>
                  <div><dt style={{ color: 'var(--color-text-tertiary)' }}>Mira o Brasil</dt><dd style={{ color: 'var(--color-text-secondary)' }}>{task.targetsBrazil === null ? '—' : task.targetsBrazil ? 'sim' : 'não'}</dd></div>
                  <div><dt style={{ color: 'var(--color-text-tertiary)' }}>Português / Pix</dt><dd style={{ color: 'var(--color-text-secondary)' }}>{task.signals.ptBr ? 'PT-BR' : 'sem PT-BR'} · {task.signals.pix ? 'Pix' : 'sem Pix'}</dd></div>
                  <div><dt style={{ color: 'var(--color-text-tertiary)' }}>Palavras de aposta</dt><dd style={{ color: 'var(--color-text-secondary)' }}>{task.signals.keywords}{task.signals.lookalike ? ` · sósia de ${task.signals.lookalike}` : ''}</dd></div>
                </dl>
                {task.rationale && <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{task.rationale}</p>}
                <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  <span>{task.createdAt}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => decideReview(task.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--status-autorizada)', color: 'var(--color-bg)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Publicar como não autorizada
                  </button>
                  <button
                    onClick={() => decideReview(task.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5 border"
                    style={{ borderColor: 'var(--status-nao-autorizada)', color: 'var(--status-nao-autorizada)' }}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Descartar
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {activePanel === 'clones' && showClones && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Gestão de Clones</h2>
            <p className="text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Cada casa da lista oficial aparece uma vez e reúne todos os domínios que redirecionam para o endereço autorizado ou citam o CNPJ da operadora.
              A autorização vale para o domínio listado, não para o operador. Casa sem essa linha não significa ausência de clone: só que não há esse vínculo medido.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard label="Total de Hold" value={cloneHouses.length} />
            <KpiCard label="Total de Domínios Autorizados" value={cloneHouses.reduce((n, h) => n + h.domains.length, 0)} accent="var(--status-autorizada)" />
            <KpiCard label="Total de Domínios Clones" value={cloneEntities.length} accent="var(--status-nao-autorizada)" />
          </div>

          <GlassCard className="p-4">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Busca</label>
            <input
              type="search"
              value={cloneSearch}
              onChange={(e) => setCloneSearch(e.target.value)}
              placeholder="Marca, CNPJ ou domínio"
              aria-label="Buscar marca, CNPJ ou domínio"
              className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </GlassCard>

          {filteredCloneHouses.length === 0 ? (
            <GlassCard className="p-8 text-center text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Nenhuma casa encontrada com os filtros selecionados.
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {filteredCloneHouses.map((house) => {
                const links = CLONE_LINKS.filter((l) => l.officialSlug === house.slug);
                return (
                  <GlassCard key={house.slug} className="p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{house.brandName}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{house.legalName}</p>
                        <p className="font-mono text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{house.cnpj}</p>
                      </div>
                      <div className="text-xs text-right space-y-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                        {house.domains.map((d) => <div key={d.host} className="font-mono" style={{ color: 'var(--status-autorizada)' }}>{d.host}</div>)}
                      </div>
                    </div>
                    <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                      {links.length === 0 ? (
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhum vínculo direto medido.</p>
                      ) : links.map((link) => {
                        const clone = cloneEntities.find((c) => c.slug === link.cloneSlug);
                        if (!clone) return null;
                        return (
                          <div key={link.cloneSlug} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
                            <div>
                              <span className="font-mono text-xs font-semibold" style={{ color: 'var(--status-nao-autorizada)' }}>{clone.domains[0]?.host}</span>
                              <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{link.relationLabel}</p>
                            </div>
                            <span
                              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                              style={{ color: 'var(--status-nao-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 12%, transparent)' }}
                            >
                              {clone.statusText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
