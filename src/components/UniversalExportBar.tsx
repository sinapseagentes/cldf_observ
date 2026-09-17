/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { ActiveTab, YearKey, Deputy, PropositionItem, AmendmentItem, RollCallVote } from '../types';
import { exportToCSV, exportToPDF, ExportContext } from '../utils/exportUtils';

interface UniversalExportBarProps {
  activeTab: ActiveTab;
  selectedYear: YearKey;
  searchQuery?: string;
  selectedParty?: string;
  deputies: Deputy[];
  propositions?: PropositionItem[];
  amendments?: AmendmentItem[];
  votes?: RollCallVote[];
}

export const UniversalExportBar: React.FC<UniversalExportBarProps> = ({
  activeTab,
  selectedYear,
  searchQuery,
  selectedParty,
  deputies,
  propositions = [],
  amendments = [],
  votes = []
}) => {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const getTabLabel = (tab: ActiveTab): string => {
    switch (tab) {
      case 'overview': return 'Visão Geral & Indicadores';
      case 'deputies': return 'Quadro de Deputados Distritais';
      case 'propositions': return 'Catálogo de Proposições';
      case 'amendments': return 'Execução de Emendas Orçamentárias';
      case 'attendance': return 'Frequência Plenária & Comissões';
      case 'calendar': return 'Calendário e Grade Oficial CLDF';
      case 'voting': return 'Matérias & Votações Nominais';
      case 'sources': return 'Guia de Fontes e Dados Abertos';
    }
  };

  const getRecordCount = (): string => {
    switch (activeTab) {
      case 'overview':
      case 'deputies':
      case 'attendance':
        return `${deputies.length} deputados distritais`;
      case 'propositions':
        return `${propositions.length} proposições registradas`;
      case 'amendments':
        return `${amendments.length} emendas orçamentárias`;
      case 'voting':
        return `${votes.length} votações nominais`;
      case 'calendar':
        return 'Grade semanal regimental e 9 comissões';
      case 'sources':
        return '4 portais governamentais';
    }
  };

  const handleExportCSV = () => {
    const ctx: ExportContext = {
      activeTab,
      selectedYear,
      searchQuery,
      selectedParty,
      deputies,
      propositions,
      amendments,
      votes
    };
    exportToCSV(ctx);
    setShowFeedback('Arquivo CSV gerado com sucesso!');
    setTimeout(() => setShowFeedback(null), 3500);
  };

  const handleExportPDF = () => {
    const ctx: ExportContext = {
      activeTab,
      selectedYear,
      searchQuery,
      selectedParty,
      deputies,
      propositions,
      amendments,
      votes
    };
    exportToPDF(ctx);
    setShowFeedback('Relatório executivo aberto para impressão/PDF.');
    setTimeout(() => setShowFeedback(null), 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Exportar Dados Desta Tela:</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
              {getTabLabel(activeTab)}
            </span>
          </div>
          <p className="text-slate-500 text-[11px] mt-0.5">
            {getRecordCount()} • Ano:{' '}
            <strong>{selectedYear === 'all' ? 'Toda a legislatura' : selectedYear}</strong>
            {searchQuery ? ` • Filtro: "${searchQuery}"` : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showFeedback && (
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {showFeedback}
          </span>
        )}

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition shadow-xs"
          title="Baixar planilha em formato CSV estruturado"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exportar CSV</span>
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-xs"
          title="Gerar e imprimir relatório diagramado em PDF"
        >
          <Printer className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>
      </div>
    </div>
  );
};
