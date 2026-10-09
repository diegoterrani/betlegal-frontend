import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BetLegalLogo } from './brand/BetLegalBrand';
import { ironWatchMark } from '../assets/brand/ironWatchMark';
import { useUser } from '../context/UserContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const linkStyle = { color: '#A3A3A3' };
const headingStyle = { color: '#E5E5E5' };

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { user } = useUser();
  return (
    <footer className="pt-12 pb-8 mt-16 transition-colors" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF', borderTop: '1px solid rgba(255,255,255,0.14)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.14)' }}>

          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <BetLegalLogo theme="dark" variant="compact" className="h-7 w-auto" />
            <p className="text-xs font-semibold tracking-wide" style={linkStyle}>
              BET LEGAL? CONFERE.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#D4D4D4' }}>
              Plataforma independente de verificação e inteligência sobre o mercado brasileiro de apostas.
            </p>
            <div className="pt-2 text-[11px] space-y-1" style={linkStyle}>
              <div className="flex items-center gap-1.5 font-medium" style={{ color: '#34A871' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sem afiliados · Sem bônus
              </div>
              <div>Atualização contínua em 4 janelas diárias.</div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs" style={linkStyle}>Aparência:</span>
              <ThemeToggle compact />
            </div>
          </div>

          {/* Col 2: Consulta & Superfícies */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={headingStyle}>
              Consulta & Verificação
            </h4>
            <ul className="space-y-2 text-xs" style={linkStyle}>
              <li>
                <button onClick={() => onNavigate('/busca')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Busca por Nome, Domínio ou CNPJ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/autorizadas')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Lista Positiva Nacional (SPA/MF)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/radar')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Radar de Clones e Bloqueios Anatel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/mudancas')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Histórico de Mudanças e Diffs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/series')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Séries Temporais do Mercado
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/avaliacoes')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Avaliações de Usuários
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Inteligência & Regulação */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={headingStyle}>
              Transparência & B2B
            </h4>
            <ul className="space-y-2 text-xs" style={linkStyle}>
              <li>
                <button onClick={() => onNavigate('/metodologia')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Metodologia e Fontes Oficiais
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sobre')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Sobre
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacidade')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacidade
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/avaliacoes')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Reputação e Defesa do Consumidor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contestar')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Canal de Contestação e Denúncia
                </button>
              </li>
              {user?.role === 'super_admin' && (
                <li>
                  <button onClick={() => onNavigate('/painel')} className="hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px]">
                    Área Operacional / Crawlers
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onNavigate('/operadora')} className="hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px]">
                  Área da Operadora
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Fontes Oficiais Integradas */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={headingStyle}>
              Fontes Públicas Primárias
            </h4>
            <ul className="space-y-2 text-xs" style={linkStyle}>
              <li>
                <a
                  href="https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  SPA / Ministério da Fazenda
                  <ExternalLink className="w-3 h-3" style={{ color: '#737373' }} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.in.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  Diário Oficial da União (DOU)
                  <ExternalLink className="w-3 h-3" style={{ color: '#737373' }} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.anatel.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  Anatel (Ordens de Bloqueio)
                  <ExternalLink className="w-3 h-3" style={{ color: '#737373' }} />
                </a>
              </li>
              <li>
                <a
                  href="https://registro.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  Registro.br (Zona restrita .bet.br)
                  <ExternalLink className="w-3 h-3" style={{ color: '#737373' }} />
                </a>
              </li>
              <li className="pt-1">
                <button onClick={() => onNavigate('/fontes')} className="hover:text-white transition-colors cursor-pointer text-left font-semibold" style={{ color: '#FFFFFF' }}>
                  Ver todas as fontes →
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-xs space-y-4">
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-4 leading-relaxed p-4 rounded-lg border"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(226,226,224,0.78)' }}
          >
            <a href="https://iron-security.com" target="_blank" rel="noopener noreferrer" className="shrink-0 self-start">
              <img src={ironWatchMark} alt="Iron Security" className="h-14 w-auto rounded-md bg-black" />
            </a>
            <p>
              <strong className="block mb-1 font-medium" style={{ color: '#FFFFFF' }}>Aviso legal e de independência:</strong>
              Criado pela{' '}
              <a
                href="https://iron-security.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white"
                style={{ color: '#FFFFFF' }}
              >
                Iron Security
              </a>
              , empresa de segurança cibernética. Consulta pública e gratuita sobre casas de apostas autorizadas e não autorizadas no Brasil. Sem comissão e sem indicação de aposta.
            </p>
          </div>
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
            style={{ color: 'rgba(226,226,224,0.6)' }}
          >
            <span className="text-center sm:text-left">
              Bet Legal © 2026 · “Bet legal? Confere.” · Horário oficial de Brasília (America/Sao_Paulo)
            </span>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span>Atualizações 4x ao dia</span>
              <span aria-hidden="true">·</span>
              <span>Zero comissões</span>
              <span aria-hidden="true">·</span>
              <span>Sem bônus</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
