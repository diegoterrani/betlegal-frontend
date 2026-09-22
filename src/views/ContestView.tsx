import React, { useState } from 'react';
import { ContestationTicket } from '../types';
import { INITIAL_TICKETS } from '../data/mockData';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Info,
  Building,
  UserCheck
} from 'lucide-react';

interface ContestViewProps {
  initialHost?: string;
}

export const ContestView: React.FC<ContestViewProps> = ({ initialHost = '' }) => {
  const [tickets, setTickets] = useState<ContestationTicket[]>(INITIAL_TICKETS);
  const [formData, setFormData] = useState({
    type: 'contestacao_status' as ContestationTicket['type'],
    brandOrDomain: initialHost,
    requesterName: '',
    requesterEmail: '',
    requesterRole: 'usuario' as ContestationTicket['requesterRole'],
    justification: '',
    evidenceLinks: '',
  });

  const [submittedTicket, setSubmittedTicket] = useState<ContestationTicket | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandOrDomain || !formData.requesterEmail || !formData.justification) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const randomId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: ContestationTicket = {
      id: randomId,
      type: formData.type,
      brandOrDomain: formData.brandOrDomain,
      requesterName: formData.requesterName,
      requesterEmail: formData.requesterEmail,
      requesterRole: formData.requesterRole,
      justification: formData.justification,
      evidenceLinks: formData.evidenceLinks,
      createdAt: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} BRT`,
      status: 'recebido',
    };

    setTickets([newTicket, ...tickets]);
    setSubmittedTicket(newTicket);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      type: 'contestacao_status',
      brandOrDomain: '',
      requesterName: '',
      requesterEmail: '',
      requesterRole: 'usuario',
      justification: '',
      evidenceLinks: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider mb-1">
          Canal Formal de Governança
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-white">
          Contestação Cadastral e Reporte de Clones
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Garantia de contraditório e retificação célere. Operadores e cidadãos podem contestar informações, notificar novos domínios autorizados ou denunciar páginas clonadas.
        </p>
      </div>

      {submittedTicket ? (
        <div className="bg-white dark:bg-[#0D1B2A] border-2 border-emerald-300 dark:border-emerald-700 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm text-center transition-colors">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Protocolo de Contestação Registrado
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Sua solicitação foi anexada à fila operacional da próxima janela de auditoria.
          </p>

          <div className="bg-[#F6F8FB] dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded p-4 max-w-sm mx-auto font-mono text-xs text-left space-y-1.5 text-slate-800 dark:text-slate-200">
            <div><strong>Número de Protocolo:</strong> <span className="text-[#1F5FD1] dark:text-sky-400 font-bold">{submittedTicket.id}</span></div>
            <div><strong>Alvo:</strong> {submittedTicket.brandOrDomain}</div>
            <div><strong>Registrado em:</strong> {submittedTicket.createdAt}</div>
            <div><strong>Status inicial:</strong> Recebido para triagem técnica</div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-[#0B1F33] dark:bg-[#1F5FD1] text-white text-xs font-semibold rounded hover:bg-slate-800 dark:hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Registrar Nova Solicitação
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Tipo de solicitação */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Finalidade do Requerimento *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded focus:outline-none focus:border-[#1F5FD1]"
              >
                <option value="contestacao_status">Contestação de Status Regulatório (Apresentar Portaria/DOU)</option>
                <option value="denuncia_clone">Denúncia de Clone / Lookalike / Phishing de Marca</option>
                <option value="atualizacao_dados">Atualização Cadastral (Razão Social, CNPJ ou Domínio .bet.br)</option>
                <option value="outro">Outra Solicitação Institucional</option>
              </select>
            </div>

            {/* Marca / Domínio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marca ou Domínio Objeto *
              </label>
              <input
                type="text"
                required
                value={formData.brandOrDomain}
                onChange={(e) => setFormData({ ...formData, brandOrDomain: e.target.value })}
                placeholder="Ex: exemplo.bet.br ou exemplo-bonus-falso.xyz"
                className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded font-mono focus:outline-none focus:border-[#1F5FD1]"
              />
            </div>

            {/* Identificação do Requerente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Solicitante / Procurador *
                </label>
                <input
                  type="text"
                  required
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="Nome completo ou razão social"
                  className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded focus:outline-none focus:border-[#1F5FD1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail Institucional para Resposta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.requesterEmail}
                  onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                  placeholder="exemplo@operador.com.br"
                  className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded focus:outline-none focus:border-[#1F5FD1]"
                />
              </div>
            </div>

            {/* Papel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Qualificação do Requerente *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'operador', label: 'Operador / Jurídico' },
                  { id: 'usuario', label: 'Apostador / Consumidor' },
                  { id: 'orgao_publico', label: 'Órgão Regulador / Público' },
                  { id: 'advogado', label: 'Pesquisador / Imprensa' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFormData({ ...formData, requesterRole: item.id as any })}
                    className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                      formData.requesterRole === item.id
                        ? 'bg-[#0B1F33] dark:bg-[#1F5FD1] text-white border-[#0B1F33] dark:border-[#1F5FD1]'
                        : 'bg-[#F6F8FB] dark:bg-[#081320] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Justificativa */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fundamentação Factual / Detalhes da Contestação *
              </label>
              <textarea
                required
                rows={4}
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Descreva com precisão o fato: número da portaria publicada, data do Diário Oficial, evidência de titularidade da marca ou comportamento irregular do clone denunciado..."
                className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded focus:outline-none focus:border-[#1F5FD1] leading-relaxed"
              />
            </div>

            {/* Links de Evidência */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Links de Evidência e Fontes Oficiais (Opcional)
              </label>
              <input
                type="text"
                value={formData.evidenceLinks}
                onChange={(e) => setFormData({ ...formData, evidenceLinks: e.target.value })}
                placeholder="Ex: https://in.gov.br/materia/... ou link de processo judicial"
                className="w-full text-xs p-2.5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded font-mono focus:outline-none focus:border-[#1F5FD1]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Prazo de triagem técnica: até 12 horas úteis.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1F5FD1] hover:bg-[#184ebd] text-white font-bold text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                Submeter para Avaliação
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recentes Protocolos Públicos Anônimos */}
      <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3 transition-colors">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Transparência da Fila de Contestação
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {tickets.slice(0, 3).map((t) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mr-2">{t.id}</span>
                <span className="text-slate-600 dark:text-slate-400 mr-2">Alvo: <strong className="text-slate-900 dark:text-slate-100">{t.brandOrDomain}</strong></span>
                <span className="text-slate-400 dark:text-slate-500">({t.type.replace('_', ' ')})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">{t.createdAt}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  t.status === 'concluido' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                }`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
