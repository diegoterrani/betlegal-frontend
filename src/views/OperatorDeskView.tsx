import React, { useState } from 'react';
import { BetEntity } from '../types';
import { OPERATOR_DESK } from '../data/mockData';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { HoldEditModal } from '../components/HoldEditModal';
import { ContestModal, ContestPreset, CloneModal } from '../components/OperatorModals';
import { AlertTriangle, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useReviews } from '../context/ReviewsContext';

interface OperatorDeskViewProps {
  entities: BetEntity[];
  onNavigate: (path: string) => void;
}

type TabId = 'hold' | 'reviews' | 'clones';

const TABS: { id: TabId; label: string }[] = [
  { id: 'hold', label: 'Operadora e casas' },
  { id: 'reviews', label: 'Comentários' },
  { id: 'clones', label: 'Possíveis cópias' },
];

export const OperatorDeskView: React.FC<OperatorDeskViewProps> = ({ entities, onNavigate }) => {
  const { user } = useUser();
  const { reviews: allReviews, addReply } = useReviews();
  const [tab, setTab] = useState<TabId>('hold');
  const [hold, setHold] = useState(OPERATOR_DESK.hold);
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [contestedHosts, setContestedHosts] = useState<Set<string>>(new Set());
  const [editingHold, setEditingHold] = useState(false);
  const [contest, setContest] = useState<ContestPreset | null>(null);
  const [cloneHost, setCloneHost] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const houses = entities.filter((e) => OPERATOR_DESK.houseSlugs.includes(e.slug));
  const clones = entities.filter((e) => OPERATOR_DESK.cloneSlugs.includes(e.slug));
  const reviews = allReviews.filter((r) => OPERATOR_DESK.houseSlugs.includes(r.brandSlug));

  const tabBtnStyle = (active: boolean) => ({
    backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
  });

  const sendReply = (reviewId: number) => {
    const body = (replyDraft[reviewId] || '').trim();
    if (!body) return;
    addReply(reviewId, body);
    setReplyDraft((d) => ({ ...d, [reviewId]: '' }));
  };

  const unanswered = reviews.filter((r) => !r.reply).length;
  const openClones = clones.filter((c) => !contestedHosts.has(c.domains[0]?.host || '')).length;

  const attention: { id: string; text: string; action?: { label: string; run: () => void } }[] = [];
  if (hold.status === 'pending') {
    attention.push({ id: 'email', text: 'Confirme o e-mail da operadora. O link chegou no endereço da conta e vale 48 horas. Até lá, comentários e possíveis cópias ficam ocultos.' });
  }
  if (unanswered > 0) {
    attention.push({
      id: 'reviews',
      text: `${unanswered} ${unanswered === 1 ? 'comentário sem resposta' : 'comentários sem resposta'}.`,
      action: { label: 'Responder', run: () => setTab('reviews') },
    });
  }
  if (openClones > 0) {
    attention.push({
      id: 'clones',
      text: `${openClones} ${openClones === 1 ? 'possível cópia de casa sua ainda sem pedido de remoção' : 'possíveis cópias de casas suas ainda sem pedido de remoção'}.`,
      action: { label: 'Ver cópias', run: () => setTab('clones') },
    });
  }

  const submitContest = (reason: string) => {
    if (!contest) return;
    if (contest.type === 'report') {
      setContestedHosts((set) => new Set(set).add(contest.host));
    }
    setContest(null);
    setNotice(contest.type === 'report' ? 'Pedido de remoção enviado. Acompanhe pelo protocolo no seu e-mail.' : 'Contestação enviada. Acompanhe pelo protocolo no seu e-mail.');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Painel do operador</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Use a conta de demonstração "Kaizen Gaming (Betano)" (Operadora) na tela de entrada.
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

  if (user.role !== 'operator' && user.role !== 'super_admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
          style={{ backgroundColor: 'color-mix(in srgb, var(--status-atencao) 15%, transparent)' }}
        >
          <Lock className="w-6 h-6" style={{ color: 'var(--status-atencao)' }} />
        </div>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Painel do operador</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Esta área é só para operadoras cadastradas.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-5">
      <AmbientGlow />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--status-dado-declarado)' }}>
            {user.role === 'super_admin' ? 'Administrador geral' : 'Área da operadora'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{hold.legalName}</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
        </div>
        <button
          onClick={() => setContest({ host: hold.domain, type: 'contest', reason: '' })}
          className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-md shrink-0 cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
        >
          Abrir contestação
        </button>
      </div>

      {notice && (
        <p role="status" className="text-sm" style={{ color: 'var(--status-autorizada)' }}>{notice}</p>
      )}

      <section
        aria-labelledby="attention-title"
        className="rounded-xl border p-4"
        style={attention.length
          ? { borderColor: 'color-mix(in srgb, var(--status-atencao) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--status-atencao) 8%, var(--color-surface))' }
          : { borderColor: 'var(--color-card-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <h2 id="attention-title" className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          {attention.length
            ? <AlertTriangle className="w-4 h-4" style={{ color: 'var(--status-atencao)' }} />
            : <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-autorizada)' }} />}
          {attention.length ? 'Precisa da sua atenção' : 'Tudo em dia'}
        </h2>
        {attention.length === 0 ? (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Nenhum comentário sem resposta e nenhuma cópia pendente.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {attention.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span>{item.text}</span>
                {item.action && (
                  <button
                    onClick={item.action.run}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border hover:bg-white/5"
                    style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
                  >
                    {item.action.label}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex items-center gap-1 border-b pb-2 flex-wrap" style={{ borderColor: 'var(--color-card-border)' }}>
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-colors"
            style={tabBtnStyle(tab === item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'hold' && (
        <section className="space-y-4">
          <GlassCard className="p-4 text-sm space-y-1 relative">
            <button
              onClick={() => setEditingHold(true)}
              className="absolute top-4 right-4 text-xs font-semibold cursor-pointer hover:underline"
              style={{ color: 'var(--status-dado-declarado)' }}
            >
              Editar dados
            </button>
            <p style={{ color: 'var(--color-text-primary)' }}>CNPJ <span className="font-mono">{hold.cnpj}</span></p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Domínio da operadora {hold.domain} · {hold.status !== 'active'
                ? 'As casas aparecem depois da confirmação do e-mail, pela última lista da SPA/MF.'
                : hold.linkedToSpa
                  ? `Casas da última lista da SPA/MF${hold.spaCheckedAt ? `, conferida em ${hold.spaCheckedAt}` : ''}.`
                  : 'Esse CNPJ não consta na última lista publicada pela SPA/MF.'}
            </p>
          </GlassCard>
          <div className="space-y-2">
            {houses.flatMap((house) => house.domains.map((domain) => (
              <GlassCard key={domain.host} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{house.brandName}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--status-dado-declarado)' }}>{domain.host}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    Casa da lista oficial da SPA/MF{house.portariaNumber ? ` · ${house.portariaNumber}` : ''}{domain.detectedAt ? ` · verificada em ${domain.detectedAt}` : ''}
                  </p>
                </div>
                <span
                  className="text-[11px] font-bold uppercase px-2 py-1 rounded shrink-0"
                  style={{ color: 'var(--status-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-autorizada) 12%, transparent)' }}
                >
                  {house.statusText}
                </span>
              </GlassCard>
            )))}
            {houses.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {hold.status !== 'active'
                  ? 'Confirme o e-mail para ver as casas que a SPA/MF publica para esse CNPJ.'
                  : 'Nenhuma casa autorizada na última lista da SPA/MF para esse CNPJ.'}
              </p>
            )}
          </div>
        </section>
      )}

      {tab === 'reviews' && (
        <section className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Nenhum comentário nas casas desta operadora. Quando alguém avaliar uma casa sua, a resposta fica aqui.</p>
          ) : reviews.map((item) => (
            <GlassCard key={item.id} className="p-4 space-y-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {item.brand} <span className="font-normal" style={{ color: 'var(--color-text-tertiary)' }}>· {item.createdAt}</span>
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Segurança {item.starsSafety} · Pagamento {item.starsPayout} · Suporte {item.starsSupport} · Rapidez {item.starsSpeed} · Jogo responsável {item.starsResponsible}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.comment}</p>
              {item.reply && <p className="text-sm" style={{ color: 'var(--status-autorizada)' }}>Resposta publicada: {item.reply}</p>}
              {!item.reply && (
                <>
                  <textarea
                    value={replyDraft[item.id] || ''}
                    onChange={(e) => setReplyDraft((d) => ({ ...d, [item.id]: e.target.value }))}
                    rows={3}
                    placeholder="Responder este comentário"
                    aria-label={`Resposta ao comentário sobre ${item.brand}`}
                    className="w-full px-3 py-2 text-xs rounded border bg-transparent focus:outline-none resize-none"
                    style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
                  />
                  <button
                    onClick={() => sendReply(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer"
                    style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
                  >
                    Publicar resposta
                  </button>
                </>
              )}
            </GlassCard>
          ))}
        </section>
      )}

      {tab === 'clones' && (
        <section className="space-y-2">
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Sites não autorizados cujo endereço imita uma casa da operadora na lista da SPA/MF.</p>
          {clones.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Nenhuma casa clone identificada. Comparamos os sites sem autorização com as casas da operadora.</p>
          ) : clones.map((clone) => {
            const host = clone.domains[0]?.host || '';
            const contested = contestedHosts.has(host);
            return (
              <GlassCard key={clone.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{host}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{clone.evidenceSummary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[11px] font-bold uppercase px-2 py-1 rounded"
                    style={{ color: 'var(--status-nao-autorizada)', backgroundColor: 'color-mix(in srgb, var(--status-nao-autorizada) 12%, transparent)' }}
                  >
                    {clone.statusText}
                  </span>
                  <button
                    onClick={() => setCloneHost(host)}
                    className="px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border hover:bg-white/5"
                    style={{ borderColor: 'var(--color-card-border)', color: contested ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}
                  >
                    {contested ? 'Pedido já enviado' : 'Detalhes e pedido de remoção'}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </section>
      )}

      {editingHold && (
        <HoldEditModal
          legalName={hold.legalName}
          cnpj={hold.cnpj}
          domain={hold.domain}
          onClose={() => setEditingHold(false)}
          onSaved={(legalName, domain) => { setHold({ ...hold, legalName, domain }); setEditingHold(false); }}
        />
      )}
      {contest && (
        <ContestModal
          email={user.email}
          preset={contest}
          onClose={() => setContest(null)}
          onDone={submitContest}
        />
      )}
      {cloneHost && (
        <CloneModal
          host={cloneHost}
          entity={clones.find((c) => c.domains[0]?.host === cloneHost) || null}
          onClose={() => setCloneHost(null)}
          onContest={(host, reason) => { setCloneHost(null); setContest({ host, type: 'report', reason }); }}
        />
      )}
    </div>
  );
};
