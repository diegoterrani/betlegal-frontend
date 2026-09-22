import React, { useState } from 'react';
import { BetEntity, ContestationTicket } from '../types';
import { INITIAL_TICKETS } from '../data/mockData';
import { 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Database,
  FileCheck2,
  Lock,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface AdminPanelViewProps {
  entities: BetEntity[];
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ entities }) => {
  const [tickets, setTickets] = useState<ContestationTicket[]>(INITIAL_TICKETS);
  const [syncingCrawler, setSyncingCrawler] = useState<string | null>(null);

  const handleResolveTicket = (ticketId: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'concluido' } : t));
  };

  const handleTriggerSync = (crawlerName: string) => {
    setSyncingCrawler(crawlerName);
    setTimeout(() => {
      setSyncingCrawler(null);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-mono">
          <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          Área Operacional Interna · Noindex
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Painel de Auditoria e Sondas de Fontes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Monitoramento das 4 janelas operacionais, integridade dos crawlers de dados públicos e fila de contestação técnica.
        </p>
      </div>

      {/* KPIs Operacionais (Page 5 Brand Book) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Cobertura de Fontes Oficiais</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">99.8%</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">DOU, SIGAP e Loterias</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Domínios Monitorados</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-[#0B1F33] dark:text-white tabular-nums">4.890</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">Sondas HTTP/SSL a cada 4h</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Fila de Revisão Humana</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {tickets.filter(t => t.status !== 'concluido').length}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">Tickets pendentes de triagem</span>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Última Janela Concluída</span>
          <span className="font-mono text-xl sm:text-2xl font-bold text-[#1F5FD1] dark:text-sky-400">12:00 BRT</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">Próxima sonda: 18:00 BRT</span>
        </div>
      </div>

      {/* Status dos Crawlers / Robôs de Sincronização */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-[#1F5FD1] dark:text-sky-400" />
            Status das Integrações de Fontes Públicas
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Sync Interval: 6 horas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { id: 'dou', name: 'Crawler DOU (Diário Oficial da União)', target: 'Portarias SPA/MF e Decretos', status: 'Operacional', latency: '120ms' },
            { id: 'sigap', name: 'Conector SIGAP (Ministério da Fazenda)', target: 'Requerimentos e Habilitações', status: 'Operacional', latency: '240ms' },
            { id: 'anatel', name: 'Parser de Notificações Anatel', target: 'Listagens de Bloqueio DNS', status: 'Operacional', latency: '80ms' },
            { id: 'registrobr', name: 'Sonda WHOIS Registro.br (.bet.br)', target: 'Delegação de DNS e Titularidade', status: 'Operacional', latency: '150ms' },
          ].map((c) => (
            <div key={c.id} className="p-4 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between gap-3 transition-colors">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">{c.target}</span>
                <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {c.status}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-slate-500 dark:text-slate-400">{c.latency}</span>
                </div>
              </div>

              <button
                onClick={() => handleTriggerSync(c.id)}
                disabled={syncingCrawler === c.id}
                className="px-3 py-1.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded font-medium text-slate-700 dark:text-slate-300 cursor-pointer text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCrawler === c.id ? 'animate-spin text-[#1F5FD1] dark:text-sky-400' : ''}`} />
                {syncingCrawler === c.id ? 'Sondando...' : 'Forçar Sync'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fila de Contestação e Denúncias (Revisão Humana) */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-[#0B1F33] dark:text-white">
              Fila de Triagem Técnica e Contestações
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Solicitações de operadores, usuários e pesquisadores</p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {tickets.filter(t => t.status !== 'concluido').length} pendente(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="py-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{ticket.id}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Alvo: {ticket.brandOrDomain}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {ticket.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">{ticket.createdAt}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ticket.status === 'concluido' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed bg-[#F6F8FB] dark:bg-[#081320] p-3 rounded border border-slate-100 dark:border-slate-800">
                <strong>Justificativa: </strong>{ticket.justification}
              </p>

              <div className="flex items-center justify-between pt-1 flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div>
                  Solicitante: <strong className="text-slate-700 dark:text-slate-300">{ticket.requesterName}</strong> ({ticket.requesterEmail}) · {ticket.requesterRole}
                </div>

                {ticket.status !== 'concluido' && (
                  <button
                    onClick={() => handleResolveTicket(ticket.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer transition-colors"
                  >
                    Homologar Revisão e Fechar Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
