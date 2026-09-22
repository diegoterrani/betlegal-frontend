import React from 'react';
import { Shield, ExternalLink, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1F33] dark:bg-[#050B12] text-white border-t border-slate-800 pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="text-xl font-bold tracking-tight text-white">
              Bet<span className="text-[#1F5FD1]">Legal</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold tracking-wide">
              BET LEGAL? CONFERE.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plataforma independente de verificação e inteligência sobre o mercado brasileiro de apostas.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sem afiliados · Sem bônus
              </div>
              <div>Atualização contínua em 4 janelas diárias.</div>
            </div>
          </div>

          {/* Col 2: Consulta & Superfícies */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Consulta & Verificação
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
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

          {/* Col 3: Inteligência & Regulação */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Transparência & B2B
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
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
              <li>
                <button onClick={() => onNavigate('/painel')} className="hover:text-white transition-colors cursor-pointer text-left font-mono text-[11px]">
                  Área Operacional / Crawlers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Fontes Oficiais Integradas */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Fontes Públicas Primárias
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  SPA / Ministério da Fazenda
                  <ExternalLink className="w-3 h-3 text-slate-500" />
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
                  <ExternalLink className="w-3 h-3 text-slate-500" />
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
                  <ExternalLink className="w-3 h-3 text-slate-500" />
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
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Legal & Trust Disclaimer (Page 22) */}
        <div className="pt-6 pb-6 text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-300">
            Aviso de Transparência — Informação, não parecer jurídico
          </div>
          <p className="leading-relaxed text-slate-400 text-[11px] sm:text-xs">
            BetLegal é uma plataforma independente de informação baseada em fontes públicas e verificações 
            automatizadas com revisão humana quando aplicável. Em caso de divergência, prevalece a fonte oficial 
            (Diário Oficial da União, SPA/MF e órgãos reguladores competentes). A plataforma não recebe 
            comissão de operadores, não publica bônus e não recomenda onde apostar.
          </p>
        </div>

        {/* Bottom copyright line + theme toggle */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            BetLegal Brand System v1.0 • 22 de setembro de 2026 • Brasil
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Tema:</span>
              <ThemeToggle compact showLabels />
            </div>
            <div className="font-mono text-slate-400">
              Consulte. Confira. Decida.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
