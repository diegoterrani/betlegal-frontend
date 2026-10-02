import React from 'react';
import { FileCheck, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import { STATUS_MAP } from '../utils/statusMapping';
import { AskedQuestions } from './AskedQuestions';

interface MethodologyViewProps {
  onNavigate: (path: string) => void;
}

const STEPS = [
  { num: '01', title: 'Coletamos', desc: 'Monitoramento automatizado do Diário Oficial da União (DOU), diários oficiais dos estados (Loterj, Lottopar, etc.) e ofícios de bloqueio remetidos à Anatel.' },
  { num: '02', title: 'Verificamos', desc: 'Conferimos se cada site está no ar, se usa conexão segura e quem registrou o endereço.' },
  { num: '03', title: 'Cruzamos', desc: 'Associação estrita entre o domínio web (.bet.br ou outros), a marca comercial anunciada e a razão social do operador outorgado.' },
  { num: '04', title: 'Classificamos', desc: 'Aplicação das regras determinísticas da taxonomia pública, isolando status regulatório de conectividade técnica.' },
  { num: '05', title: 'Publicamos', desc: 'O resultado fica disponível para consulta gratuita, atualizado 4 vezes ao dia, sem cobrança e sem afiliados.' },
  { num: '06', title: 'Acompanhamos', desc: 'Histórico perpétuo de mudanças de status com data de vigência legal e data de constatação pela plataforma.' },
];

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <AmbientGlow />

      {/* Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
          <FileCheck className="w-4 h-4" />
          <span>Critérios Científicos e Rastreabilidade</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Metodologia de apuração e dados
        </h1>
        <p className="text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Entenda como o BetLegal processa registros oficiais, realiza varreduras técnicas de rede e cataloga informações públicas do mercado brasileiro de apostas.
        </p>
      </div>

      {/* Fluxo contínuo de checagem */}
      <GlassCard className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          O Fluxo Contínuo de Checagem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="space-y-2 p-4 rounded border"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded border"
                  style={{
                    color: 'var(--status-dado-declarado)',
                    borderColor: 'var(--status-dado-declarado)',
                    backgroundColor: 'color-mix(in srgb, var(--status-dado-declarado) 10%, transparent)',
                  }}
                >
                  ETAPA {step.num}
                </span>
              </div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{step.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Taxonomia completa de status */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Taxonomia Rigorosa de Status
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Cada classificação visual reflete exclusivamente uma situação documental verificada perante as fontes públicas.
          </p>
        </div>

        <div>
          {Object.entries(STATUS_MAP).map(([key, meta], idx) => (
            <div
              key={key}
              className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--color-card-border)' }}
            >
              <div className="sm:w-1/3">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold tracking-wide uppercase border ${meta.badgeClass}`}>
                  {meta.publicText.toUpperCase()}
                </span>
              </div>
              <div className="sm:w-2/3 space-y-1">
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{meta.description}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* O que cada data significa */}
      <GlassCard className="p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            O que cada data significa
          </h2>
          <p className="text-sm mt-2 leading-relaxed max-w-3xl" style={{ color: 'var(--color-text-secondary)' }}>
            O BetLegal não afirma que o site foi criado ou publicado na data mostrada. A ficha traz três datas diferentes, lado a lado, para não confundir "nós vimos agora" com "nasceu agora".
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Detectado pelo BetLegal em</div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              O dia em que a varredura encontrou aquele endereço. É a data da nossa descoberta, não a data em que o site entrou no ar.
            </p>
          </div>
          <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Domínio registrado em</div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              O dia em que alguém comprou o endereço no registro de domínios. Um domínio pode ficar anos parado e só depois virar casa de apostas. Quando o registro não responde, a ficha diz isso e não dá para afirmar.
            </p>
          </div>
          <div className="p-4 rounded border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--color-card-border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Primeiro certificado de segurança</div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              O dia em que o site passou a abrir com o cadeado do navegador. É o indício mais próximo de "entrou no ar". Essa data falta em parte das fichas, porque a fonte limita a consulta. Mesmo quando aparece, não prova que naquele dia o endereço já era casa de apostas.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--color-text-secondary)' }}>
          Saber quando o endereço foi comprado não diz quando ele virou casa de apostas. Um domínio antigo pode ter sido reaproveitado depois.
        </p>
      </GlassCard>

      <AskedQuestions />

      {/* O que o BetLegal NÃO é */}
      <section
        className="rounded-xl border p-6 sm:p-8"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--status-atencao) 8%, var(--color-surface))',
          borderColor: 'color-mix(in srgb, var(--status-atencao) 30%, transparent)',
        }}
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--status-atencao)' }} />
          O que o BetLegal NÃO é
        </h2>
        <ul className="space-y-2 text-xs leading-relaxed list-disc list-inside" style={{ color: 'var(--color-text-secondary)' }}>
          <li><strong style={{ color: 'var(--color-text-primary)' }}>Não é uma casa de apostas:</strong> Não oferecemos jogos, apostas, pagamentos ou promoções.</li>
          <li><strong style={{ color: 'var(--color-text-primary)' }}>Não é afiliado comercial:</strong> Não recebemos remuneração, comissões de apostas geradas ou links de bônus de nenhum operador.</li>
          <li><strong style={{ color: 'var(--color-text-primary)' }}>Não é parecer jurídico de mérito:</strong> A plataforma descreve fatos cadastrais públicos nas datas das checagens.</li>
          <li><strong style={{ color: 'var(--color-text-primary)' }}>Não afirma data de criação ou de publicação:</strong> Não afirmamos que os sites foram criados ou publicados nas datas exibidas. São as datas em que a plataforma identificou o endereço, em que o domínio foi registrado, ou em que apareceu o primeiro certificado.</li>
          <li><strong style={{ color: 'var(--color-text-primary)' }}>Não é SAC ou ouvidoria de prêmios:</strong> Não intermediamos disputas de saldo ou saques entre usuários e operadores.</li>
        </ul>
      </section>

      {/* Como contestar */}
      <GlassCard className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Identificou alguma inconsistência documental?
          </h2>
          <p className="text-xs mt-1 max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
            Operadores com novas portarias ou certidões podem submeter pedido formal de revisão através do nosso canal de contestação com prazo de análise de 5 dias úteis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/contestar')}
          className="px-4 py-2.5 text-xs font-semibold rounded-md transition-colors shrink-0"
          style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
        >
          Abrir contestação documental
        </button>
      </GlassCard>
    </div>
  );
};
