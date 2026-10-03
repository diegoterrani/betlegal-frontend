import React, { useState } from 'react';
import { ContestationTicket } from '../types';
import { INITIAL_TICKETS } from '../data/mockData';
import { CheckCircle2, Send } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';

interface ContestViewProps {
  initialHost?: string;
}

const fieldClass = "w-full text-xs p-2.5 rounded focus:outline-none border bg-transparent";
const fieldStyle = { borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' };
const labelClass = "block text-xs font-semibold mb-1";
const labelStyle = { color: 'var(--color-text-secondary)' };

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
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <AmbientGlow />

      {/* Title */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
          Canal Formal de Governança
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Contestação Cadastral e Reporte de Clones
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Garantia de contraditório e retificação célere. Operadores e cidadãos podem contestar informações, notificar novos domínios autorizados ou denunciar páginas clonadas.
        </p>
      </div>

      {submittedTicket ? (
        <GlassCard className="p-6 sm:p-8 space-y-4 text-center" style={{ borderColor: 'var(--status-autorizada)' }}>
          <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: 'var(--status-autorizada)' }} />
          <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Protocolo de Contestação Registrado
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Sua solicitação foi anexada à fila operacional da próxima janela de auditoria.
          </p>

          <div className="rounded p-4 max-w-sm mx-auto font-mono text-xs text-left space-y-1.5 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}>
            <div><strong>Número de Protocolo:</strong> <span className="font-bold" style={{ color: 'var(--status-dado-declarado)' }}>{submittedTicket.id}</span></div>
            <div><strong>Alvo:</strong> {submittedTicket.brandOrDomain}</div>
            <div><strong>Registrado em:</strong> {submittedTicket.createdAt}</div>
            <div><strong>Status inicial:</strong> Recebido para triagem técnica</div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2 text-xs font-semibold rounded transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
            >
              Registrar Nova Solicitação
            </button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Tipo de solicitação */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Finalidade do Requerimento *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className={fieldClass}
                style={fieldStyle}
              >
                <option value="contestacao_status">Contestação de Status Regulatório (Apresentar Portaria/DOU)</option>
                <option value="denuncia_clone">Denúncia de Clone / Lookalike / Phishing de Marca</option>
                <option value="atualizacao_dados">Atualização Cadastral (Razão Social, CNPJ ou Domínio .bet.br)</option>
                <option value="outro">Outra Solicitação Institucional</option>
              </select>
            </div>

            {/* Marca / Domínio */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Marca ou Domínio Objeto *
              </label>
              <input
                type="text"
                required
                value={formData.brandOrDomain}
                onChange={(e) => setFormData({ ...formData, brandOrDomain: e.target.value })}
                placeholder="Ex: exemplo.bet.br ou exemplo-bonus-falso.xyz"
                className={`${fieldClass} font-mono`}
                style={fieldStyle}
              />
            </div>

            {/* Identificação do Requerente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Nome do Solicitante / Procurador *
                </label>
                <input
                  type="text"
                  required
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="Nome completo ou razão social"
                  className={fieldClass}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  E-mail Institucional para Resposta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.requesterEmail}
                  onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                  placeholder="exemplo@operador.com.br"
                  className={fieldClass}
                  style={fieldStyle}
                />
              </div>
            </div>

            {/* Papel */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Qualificação do Requerente *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'operador', label: 'Operador / Jurídico' },
                  { id: 'usuario', label: 'Apostador / Consumidor' },
                  { id: 'orgao_publico', label: 'Órgão Regulador / Público' },
                  { id: 'advogado', label: 'Pesquisador / Imprensa' },
                ].map((item) => {
                  const active = formData.requesterRole === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setFormData({ ...formData, requesterRole: item.id as any })}
                      className="p-2 rounded border text-left cursor-pointer transition-colors hover:bg-white/5"
                      style={{
                        backgroundColor: active ? 'var(--status-dado-declarado)' : 'rgba(255,255,255,0.03)',
                        borderColor: active ? 'var(--status-dado-declarado)' : 'var(--color-card-border)',
                        color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Justificativa */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Fundamentação Factual / Detalhes da Contestação *
              </label>
              <textarea
                required
                rows={4}
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Descreva com precisão o fato: número da portaria publicada, data do Diário Oficial, evidência de titularidade da marca ou comportamento irregular do clone denunciado..."
                className={`${fieldClass} leading-relaxed`}
                style={fieldStyle}
              />
            </div>

            {/* Links de Evidência */}
            <div>
              <label className={labelClass} style={labelStyle}>
                Links de Evidência e Fontes Oficiais (Opcional)
              </label>
              <input
                type="text"
                value={formData.evidenceLinks}
                onChange={(e) => setFormData({ ...formData, evidenceLinks: e.target.value })}
                placeholder="Ex: https://in.gov.br/materia/... ou link de processo judicial"
                className={`${fieldClass} font-mono`}
                style={fieldStyle}
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Prazo de triagem técnica: até 12 horas úteis.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 font-semibold text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                <Send className="w-4 h-4" />
                Submeter para Avaliação
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Recentes Protocolos Públicos Anônimos */}
      <GlassCard className="p-5 space-y-3">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-tertiary)' }}>
          Transparência da Fila de Contestação
        </h3>
        <div className="text-xs">
          {tickets.slice(0, 3).map((t, idx) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--color-card-border)' }}>
              <div>
                <span className="font-mono font-bold mr-2" style={{ color: 'var(--color-text-secondary)' }}>{t.id}</span>
                <span className="mr-2" style={{ color: 'var(--color-text-tertiary)' }}>Alvo: <strong style={{ color: 'var(--color-text-primary)' }}>{t.brandOrDomain}</strong></span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>({t.type.replace('_', ' ')})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>{t.createdAt}</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{
                    color: t.status === 'concluido' ? 'var(--status-autorizada)' : 'var(--status-atencao)',
                    backgroundColor: t.status === 'concluido' ? 'color-mix(in srgb, var(--status-autorizada) 12%, transparent)' : 'color-mix(in srgb, var(--status-atencao) 12%, transparent)',
                  }}
                >
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};
