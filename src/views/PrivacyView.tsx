import React from 'react';
import { Lock } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--status-autorizada)' }}>
          <Lock className="w-4 h-4" />
          <span>LGPD e Segurança da Informação</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Política de privacidade e proteção de dados
        </h1>
        <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Transparência absoluta sobre o tratamento de identificadores e o compromisso de privacidade por padrão do BetLegal.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8 space-y-6 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
            1. Tratamento do CPF via Hash Criptográfico
          </h2>
          <p>
            O CPF é coletado unicamente no momento do cadastro com a finalidade legítima de evitar fraudes e votos robóticos nas notas da comunidade.
            O dado é processado imediatamente por função de hash unidirecional (SHA-256 com sal e pimenta secreta de servidor). O número original em texto claro <strong style={{ color: 'var(--color-text-primary)' }}>nunca é salvo em disco</strong>, não transita para terceiros e não pode ser descriptografado nem mesmo pela equipe do BetLegal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
            2. Consultas e Buscas Públicas
          </h2>
          <p>
            A consulta pública de domínios, marcas e CNPJs é livre e aberta. O sistema não associa o histórico de buscas anônimas a IPs individuais de forma permanente. Nenhuma busca de usuário é vendida ou repassada para casas de apostas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
            3. Cookies e Rastreamento
          </h2>
          <p>
            Utilizamos apenas cookies técnicos estritamente necessários para gerenciamento de sessão autenticada. Não utilizamos rastreadores de publicidade de cassinos, nem pixels de retargeting esportivo.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
            4. Direitos do Titular (LGPD)
          </h2>
          <p>
            Qualquer usuário autenticado tem direito de revogar o consentimento, solicitar exclusão definitiva de sua conta ou exportar o histórico de avaliações submetidas através do canal oficial{' '}
            <span className="font-mono font-semibold" style={{ color: 'var(--status-dado-declarado)' }}>privacidade@betlegal.com.br</span>.
          </p>
        </section>
      </GlassCard>
    </div>
  );
};
