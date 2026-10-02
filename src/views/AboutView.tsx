import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--status-dado-declarado)' }}>
          <Shield className="w-4 h-4" />
          <span>Um projeto da Iron Security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Sobre o BetLegal
        </h1>
        <p className="text-sm mt-2 max-w-2xl leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          O BetLegal existe para proteger a sociedade contra sites ilegais de apostas. Foi criado e é desenvolvido de forma independente pela{' '}
          <a
            href="https://iron-security.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: 'var(--status-dado-declarado)' }}
          >
            Iron Security
          </a>
          , empresa de segurança cibernética que atua em todos os setores do mercado brasileiro.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Por que este site existe</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Quem vai apostar precisa saber, antes de depositar, se o site é autorizado. A lista oficial é difícil de consultar, muda com frequência e não mostra os endereços que operam fora dela. O BetLegal reúne esses fatos num só lugar: o que consta nas listas públicas, o que foi encontrado fora delas e o que mudou.
        </p>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Quem faz</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          A Iron Security é uma empresa de segurança cibernética. Trabalha com empresas de setores distintos do mercado brasileiro, entre eles apostas, instituições financeiras e saúde digital. O BetLegal é um projeto próprio da Iron Security, de consulta pública e gratuita. Não é um produto vendido a casas de apostas e não se confunde com os serviços comerciais da empresa.
        </p>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>O que publicamos</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Cada registro traz a situação regulatória, a fonte, a data e a evidência. "Autorizada" segue a lista oficial. "Não autorizada" significa que o endereço não consta nessas listas. O site não emite parecer jurídico e não decide se um site é ilegal: mostra o que as fontes públicas registram.
        </p>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>O que não fazemos</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed list-disc list-inside" style={{ color: 'var(--color-text-secondary)' }}>
          <li>Não recebemos comissão de casas de apostas.</li>
          <li>Não publicamos bônus, cupom ou indicação de onde apostar.</li>
          <li>Nenhuma casa paga para alterar a própria situação.</li>
          <li>O trabalho comercial da Iron Security não muda o que é publicado aqui.</li>
        </ul>
      </GlassCard>

      <div
        className="rounded-xl p-8 text-center space-y-4"
        style={{ backgroundColor: 'var(--status-dado-declarado)', color: 'var(--color-bg)' }}
      >
        <blockquote className="text-lg sm:text-xl font-semibold italic max-w-xl mx-auto">
          "Não presumimos. Não recomendamos. Só Conferimos."
        </blockquote>
        <p className="text-xs opacity-80 max-w-lg mx-auto leading-relaxed">
          A informação precisa, com fonte e data, ajuda quem aposta e quem pesquisa a decidir com mais segurança.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/metodologia')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors"
            style={{ backgroundColor: 'var(--color-bg)', color: 'var(--status-dado-declarado)' }}
          >
            <span>Como verificamos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
