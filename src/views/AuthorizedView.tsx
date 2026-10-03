import React, { useState, useMemo } from 'react';
import { BetEntity } from '../types';
import { BetLegalCard } from '../components/BetLegalCard';
import { GlassCard } from '../components/ui/GlassCard';
import { AmbientGlow } from '../components/ui/AmbientGlow';
import {
  CheckCircle2,
  Download,
  LayoutList,
  LayoutGrid,
  Search
} from 'lucide-react';

interface AuthorizedViewProps {
  entities: BetEntity[];
  onOpenHistory: (entity: BetEntity) => void;
  onShare: (entity: BetEntity, host: string) => void;
  onReport: (entity: BetEntity, host: string) => void;
  onViewDetails: (entity: BetEntity) => void;
}

export const AuthorizedView: React.FC<AuthorizedViewProps> = ({
  entities,
  onOpenHistory,
  onShare,
  onReport,
  onViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'federal' | 'estadual' | 'judicial'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [filterText, setFilterText] = useState('');

  const authorizedEntities = entities.filter(e =>
    e.status === 'AUTORIZADA_NACIONAL' ||
    e.status === 'AUTORIZADA_ESTADUAL' ||
    e.status === 'DECISAO_JUDICIAL'
  );

  const displayedEntities = authorizedEntities.filter(e => {
    if (activeTab === 'federal' && e.sphere !== 'federal') return false;
    if (activeTab === 'estadual' && e.sphere !== 'estadual') return false;
    if (activeTab === 'judicial' && e.sphere !== 'judicial') return false;

    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      const matchBrand = e.brandName.toLowerCase().includes(q);
      const matchLegal = e.legalName.toLowerCase().includes(q);
      const matchCnpj = e.cnpj.includes(q);
      const matchDomain = e.domains.some(d => d.host.toLowerCase().includes(q));
      return matchBrand || matchLegal || matchCnpj || matchDomain;
    }

    return true;
  });

  const composition = useMemo(() => {
    const federal = authorizedEntities.filter(e => e.sphere === 'federal').length;
    const estadual = authorizedEntities.filter(e => e.sphere === 'estadual').length;
    const judicial = authorizedEntities.filter(e => e.sphere === 'judicial').length;
    const total = federal + estadual + judicial || 1;
    return { federal, estadual, judicial, total };
  }, [authorizedEntities]);

  const handleExportCSV = () => {
    const headers = ['Marca', 'Razao_Social', 'CNPJ', 'Esfera', 'Protocolo', 'Dominio'];
    const rows = displayedEntities.map(e => [
      `"${e.brandName}"`, `"${e.legalName}"`, `"${e.cnpj}"`, `"${e.sphere}"`,
      `"${e.sigapProtocol || e.portariaNumber || ''}"`, `"${e.domains[0]?.host || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `betlegal_autorizadas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabBtnStyle = (active: boolean) => ({
    backgroundColor: active ? 'var(--status-dado-declarado)' : 'transparent',
    color: active ? 'var(--color-bg)' : 'var(--color-text-secondary)',
  });

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <AmbientGlow />

      {/* Title & Trust Header */}
      <div className="border-b pb-5" style={{ borderColor: 'var(--color-card-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--status-autorizada)' }}>
              <CheckCircle2 className="w-4 h-4" />
              Lista Positiva Vigente
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Casas de Apostas com Autorização Publicada
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
              Relação de pessoas jurídicas outorgadas pela Secretaria de Prêmios e Apostas (SPA/MF), loterias estaduais credenciadas ou decisão judicial em vigor.
            </p>
          </div>

          <GlassCard className="p-3 text-xs shrink-0" >
            <div style={{ color: 'var(--color-text-secondary)' }}>Fonte primária: <strong style={{ color: 'var(--color-text-primary)' }}>SPA/MF e DOU</strong></div>
            <div style={{ color: 'var(--color-text-secondary)' }}>Janela de atualização: <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>Hoje 12:00 BRT</span></div>
          </GlassCard>
        </div>
      </div>

      {/* Composição */}
      <GlassCard className="p-5 sm:p-6">
        <div className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
          Composição
        </div>
        <div className="h-2.5 rounded-full overflow-hidden flex mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div style={{ width: `${(composition.federal / composition.total) * 100}%`, backgroundColor: 'var(--status-autorizada)' }} />
          <div style={{ width: `${(composition.estadual / composition.total) * 100}%`, backgroundColor: 'var(--status-dado-declarado)' }} />
          <div style={{ width: `${(composition.judicial / composition.total) * 100}%`, backgroundColor: 'var(--status-decisao-judicial)' }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--status-autorizada)' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Nacional / SPA: <strong style={{ color: 'var(--color-text-primary)' }}>{composition.federal}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--status-dado-declarado)' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Estaduais: <strong style={{ color: 'var(--color-text-primary)' }}>{composition.estadual}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--status-decisao-judicial)' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Decisão Judicial: <strong style={{ color: 'var(--color-text-primary)' }}>{composition.judicial}</strong></span>
          </div>
        </div>
      </GlassCard>

      {/* Navigation tabs & controls */}
      <GlassCard className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {([
            ['all', `Todas (${authorizedEntities.length})`],
            ['federal', `Nacional / SPA (${composition.federal})`],
            ['estadual', `Estaduais (${composition.estadual})`],
            ['judicial', `Decisão Judicial (${composition.judicial})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer"
              style={tabBtnStyle(activeTab === key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar nesta lista..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded border focus:outline-none bg-transparent"
              style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-primary)' }}
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="p-1.5 rounded border transition-colors cursor-pointer hover:bg-white/5 shrink-0"
            style={{ borderColor: 'var(--color-card-border)', color: 'var(--color-text-secondary)' }}
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="flex items-center rounded p-0.5 shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 rounded transition-colors cursor-pointer"
              style={{ backgroundColor: viewMode === 'table' ? 'rgba(255,255,255,0.08)' : 'transparent', color: viewMode === 'table' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}
              title="Visualização em tabela cadastral"
              aria-label="Tabela"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className="p-1.5 rounded transition-colors cursor-pointer"
              style={{ backgroundColor: viewMode === 'cards' ? 'rgba(255,255,255,0.08)' : 'transparent', color: viewMode === 'cards' ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}
              title="Visualização em BetLegal Cards"
              aria-label="Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Content display */}
      {viewMode === 'table' ? (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--color-text-secondary)' }} className="font-semibold tracking-wide border-b" >
                <tr style={{ borderColor: 'var(--color-card-border)' }}>
                  <th className="py-3 px-4">Marca Comercial</th>
                  <th className="py-3 px-4">Razão Social & CNPJ</th>
                  <th className="py-3 px-4">Esfera / Órgão</th>
                  <th className="py-3 px-4">Protocolo / Ato</th>
                  <th className="py-3 px-4">Domínio Homologado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {displayedEntities.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-white/[0.03] border-b"
                    style={{ borderColor: 'var(--color-card-border)' }}
                  >
                    <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      <button
                        onClick={() => onViewDetails(item)}
                        className="text-left cursor-pointer hover:underline"
                      >
                        {item.brandName}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium line-clamp-1" style={{ color: 'var(--color-text-primary)' }}>{item.legalName}</div>
                      <div className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.cnpj}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.sphere === 'federal' ? 'Nacional (SPA/MF)' : item.stateJurisdiction || item.sphere}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                      {item.sigapProtocol ? `SIGAP ${item.sigapProtocol}` : item.portariaNumber?.slice(0, 30) || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.domains[0]?.host || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="hover:underline font-semibold cursor-pointer"
                        style={{ color: 'var(--status-dado-declarado)' }}
                      >
                        Ficha
                      </button>
                      <button
                        onClick={() => onShare(item, item.domains[0]?.host || '')}
                        className="cursor-pointer hover:underline"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        Compartilhar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {displayedEntities.map((item) => (
            <BetLegalCard
              key={item.id}
              entity={item}
              onOpenHistory={onOpenHistory}
              onShare={onShare}
              onReport={onReport}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* Regulatory Rule Note */}
      <GlassCard className="p-4 text-xs space-y-1">
        <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Regra Editorial BetLegal nº 2:</div>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          <em>"Nunca chamar de 'segura' apenas por estar autorizada."</em> A autorização regulatória atesta o cumprimento dos requisitos legais de funcionamento perante o Ministério da Fazenda ou estado outorgante. Não equivale a selo de invulnerabilidade ou garantia contra perdas financeiras decorrentes de apostas.
        </p>
      </GlassCard>

    </div>
  );
};
