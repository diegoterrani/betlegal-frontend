import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { BetLegalLogo } from './brand/BetLegalBrand';
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.14)' }}>

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
          </div>

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
            </ul>
          </div>

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
                <button onClick={() => onNavigate('/avaliacoes')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Reputação e Defesa do Consumidor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/api')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Documentação da API Pública
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

        <div className="pt-6 pb-6 text-xs space-y-2" style={linkStyle}>
          <div className="font-semibold" style={{ color: '#D4D4D4' }}>
            Aviso de Transparência — Informação, não parecer jurídico
          </div>
          <p className="leading-relaxed text-[11px] sm:text-xs" style={linkStyle}>
            BetLegal é uma plataforma independente de informação baseada em fontes públicas e verificações
            automatizadas com revisão humana quando aplicável. Em caso de divergência, prevalece a fonte oficial
            (Diário Oficial da União, SPA/MF e órgãos reguladores competentes). A plataforma não recebe
            comissão de operadores, não publica bônus e não recomenda onde apostar.
          </p>
        </div>

        <div
          className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#737373' }}
        >
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>BetLegal Brand System v1.0 • 22 de setembro de 2026 • Brasil</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('/sobre')} className="hover:text-white transition-colors cursor-pointer">Sobre</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('/privacidade')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="dark flex items-center gap-2">
              <span className="text-xs" style={{ color: '#A3A3A3' }}>Tema:</span>
              <ThemeToggle compact showLabels />
            </div>
            <div className="font-mono" style={{ color: '#A3A3A3' }}>
              Consulte. Confira. Decida.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
