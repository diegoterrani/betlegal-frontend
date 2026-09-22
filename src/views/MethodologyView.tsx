import React from 'react';
import { 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck,
  Search,
  Database
} from 'lucide-react';
import { MARKET_SERIES_DATA } from '../data/mockData';

export const MethodologyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="text-xs font-bold text-[#1F5FD1] dark:text-sky-400 uppercase tracking-wider mb-1">
          Transparência e Governança Editorial
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B1F33] dark:text-white">
          Metodologia e Arquitetura de Confiança
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Como o BetLegal consulta, cruza, valida e documenta as informações sobre casas de apostas autorizadas, não autorizadas e bloqueadas no Brasil.
        </p>
      </div>

      {/* Core Principle Quote */}
      <div className="p-6 bg-[#0B1F33] dark:bg-[#081320] border border-slate-800 text-white rounded-lg space-y-2 transition-colors">
        <span className="text-xs font-bold tracking-widest text-[#1F5FD1] dark:text-sky-400 uppercase">
          Princípio de Precisão
        </span>
        <blockquote className="text-xl sm:text-2xl font-bold tracking-tight">
          “Legal é a pergunta. Evidência é a resposta.”
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 leading-relaxed pt-1">
          A interface nunca converte automaticamente uma ausência de autorização em uma sentença jurídica. O produto mostra o que consta — ou não consta — nas fontes consultadas, quando foi verificado e quais evidências sustentam o status exibido.
        </p>
      </div>

      {/* As 4 Janelas Diárias de Atualização */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1F5FD1] dark:text-sky-400" />
          <h2 className="text-xl font-bold text-[#0B1F33] dark:text-white">
            As 4 Janelas Operacionais de Atualização
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Para garantir rastreabilidade temporal e consistência com publicações governamentais, nossos robôs de auditoria e analistas executam checagens estruturadas em quatro horários diários (Horário de Brasília):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {MARKET_SERIES_DATA.crawlSchedule.map((s) => (
            <div key={s.window} className="p-4 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs space-y-1 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B1F33] dark:text-white text-sm">{s.window}</span>
                <span className="font-mono text-xs font-semibold text-[#1F5FD1] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                  {s.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{s.target}</p>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                Status: <strong className="text-slate-700 dark:text-slate-300">{s.status}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fontes Primárias Consultadas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#0B7A75] dark:text-teal-400" />
          <h2 className="text-xl font-bold text-[#0B1F33] dark:text-white">
            Fontes Primárias Oficiais
          </h2>
        </div>

        <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 text-xs transition-colors">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white text-sm block">Diário Oficial da União (DOU)</strong>
              <p className="text-slate-600 dark:text-slate-400">Portarias definitivas de outorga, decretos e despachos decisórios da SPA/MF.</p>
            </div>
            <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">in.gov.br</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white text-sm block">Sistema de Gestão de Apostas (SIGAP)</strong>
              <p className="text-slate-600 dark:text-slate-400">Protocolos administrativos de requerimento, documentação de habilitação e razão social.</p>
            </div>
            <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">fazenda.gov.br/sigap</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white text-sm block">Anatel (Agência Nacional de Telecomunicações)</strong>
              <p className="text-slate-600 dark:text-slate-400">Listagens formais de domínios encaminhados para ordem de bloqueio aos ISPs nacionais.</p>
            </div>
            <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">anatel.gov.br</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white text-sm block">Loterias Estaduais (Loterj, Lotepar, Lemg)</strong>
              <p className="text-slate-600 dark:text-slate-400">Editais de concorrência, credenciamentos e termos de concessão vigentes em âmbito estadual.</p>
            </div>
            <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">Portais Estaduais</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <strong className="text-slate-900 dark:text-white text-sm block">Registro.br / Núcleo de Informação e Coordenação (NIC.br)</strong>
              <p className="text-slate-600 dark:text-slate-400">Validação da concessão restrita da terminação oficial <strong>.bet.br</strong> e autoridade DNS.</p>
            </div>
            <span className="font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">registro.br</span>
          </div>
        </div>
      </section>

      {/* Princípios Permanentes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#0B1F33] dark:text-white" />
          <h2 className="text-xl font-bold text-[#0B1F33] dark:text-white">
            Princípios Permanentes (Brand System v1.0)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded transition-colors">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">Clareza</strong>
            <p className="text-slate-600 dark:text-slate-400">Status explicado em linguagem simples, sem juridiquês ou evasivas.</p>
          </div>
          <div className="p-3.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded transition-colors">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">Evidência</strong>
            <p className="text-slate-600 dark:text-slate-400">Toda afirmação relevante aponta diretamente para fonte, data ou observação técnica.</p>
          </div>
          <div className="p-3.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded transition-colors">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">Neutralidade</strong>
            <p className="text-slate-600 dark:text-slate-400">A marca informa; o usuário decide. Sem comissão, sem afiliados e sem ranking patrocinado.</p>
          </div>
          <div className="p-3.5 bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 rounded transition-colors">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">Responsabilidade</strong>
            <p className="text-slate-600 dark:text-slate-400">Sem incentivo à aposta, sem bônus e sem promessas irresponsáveis de segurança absoluta.</p>
          </div>
        </div>
      </section>

      {/* Limites da Informação e Direito de Contestação */}
      <section className="p-5 bg-[#F6F8FB] dark:bg-[#081320] border border-slate-200 dark:border-slate-800 rounded-lg space-y-3 text-xs text-slate-700 dark:text-slate-300 transition-colors">
        <h3 className="font-bold text-[#0B1F33] dark:text-white text-sm">
          Limites da Informação & Canal de Contestação
        </h3>
        <p className="leading-relaxed">
          O mercado regulatório brasileiro é dinâmico. Decisões judiciais liminares, recursos administrativos e alterações societárias podem alterar o status de um operador entre as janelas de consulta. Qualquer operador, procurador ou cidadão possui direito incondicional de solicitar retificação com apresentação de documento comprobatório.
        </p>
        <div>
          <a
            href="/contestar"
            className="text-[#1F5FD1] dark:text-sky-400 hover:underline font-semibold inline-flex items-center gap-1"
          >
            Acessar canal de contestação formal e denúncia de clones →
          </a>
        </div>
      </section>

    </div>
  );
};
