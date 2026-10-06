import React, { useState } from 'react';
import { ContestationTicket } from '../types';
import { apiSend } from '../lib/http';
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
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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
    if (!formData.brandOrDomain || formData.justification.trim().length < 10) {
      setError('Informe o domínio e uma justificativa com pelo menos 10 caracteres.');
      return;
    }
    setBusy(true);
    setError('');
    apiSend<{ id: number; status: string }>('/contestar/enviar', 'POST', {
      type: formData.type,
      brandOrDomain: formData.brandOrDomain,
      requesterName: formData.requesterName,
      requesterEmail: formData.requesterEmail,
      requesterRole: formData.requesterRole,
      justification: formData.justification,
      evidenceLinks: formData.evidenceLinks,
    })
      .then((body) => {
        setSubmittedTicket({
          id: String(body.id),
          type: formData.type,
          brandOrDomain: formData.brandOrDomain,
          requesterName: formData.requesterName,
          requesterEmail: formData.requesterEmail,
          requesterRole: formData.requesterRole,
          justification: formData.justification,
          evidenceLinks: formData.evidenceLinks,
          createdAt: new Date().toLocaleString('pt-BR'),
          status: 'recebido',
        });
      })
      .catch((err: Error) => setError(err.message || 'Não foi possível registrar.'))
      .finally(() => setBusy(false));
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

            {error && <p role="alert" className="text-xs" style={{ color: 'var(--status-nao-autorizada)' }}>{error}</p>}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                A fila real fica no painel, depois do login de quem modera.
              </span>
              <button
                type="submit"
                disabled={busy}
                className="px-6 py-2.5 font-semibold text-xs sm:text-sm rounded transition-colors cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
              >
                <Send className="w-4 h-4" />
                {busy ? 'Enviando…' : 'Submeter para Avaliação'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

    </div>
  );
};
