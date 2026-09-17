/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Landmark,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  CalendarDays,
  Download,
  ChevronDown
} from 'lucide-react';
import { YearKey, ActiveTab, Deputy, PropositionItem, AmendmentItem, RollCallVote } from '../types';
import { YEARS, deputiesData } from '../data/cldfData';
import { exportToCSV, exportToPDF, ExportContext } from '../utils/exportUtils';
import { propositionsList } from '../data/propositionsData';
import { amendmentsList } from '../data/amendmentsData';
import { rollCallVotesData } from '../data/votesData';

interface HeaderProps {
  selectedYear: YearKey;
  onSelectYear: (year: YearKey) => void;
  onOpenSources: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  searchQuery?: string;
  selectedParty?: string;
}

export const Header: React.FC<HeaderProps> = ({
  selectedYear,
  onSelectYear,
  onOpenSources,
  activeTab,
  onSelectTab,
  searchQuery = '',
  selectedParty = 'all'
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const getExportContext = (): ExportContext => ({
    activeTab,
    selectedYear,
    searchQuery,
    selectedParty,
    deputies: deputiesData,
    propositions: propositionsList,
    amendments: amendmentsList,
    votes: rollCallVotesData
  });

  const handleExportCSV = () => {
    exportToCSV(getExportContext());
    setIsExportMenuOpen(false);
  };

  const handleExportPDF = () => {
    exportToPDF(getExportContext());
    setIsExportMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onSelectTab('overview')}
              className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-inner text-white font-bold text-xl cursor-pointer hover:bg-emerald-500 transition"
              title="Ir para o Início"
            >
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  onClick={() => onSelectTab('overview')}
                  className="text-lg sm:text-xl font-bold tracking-tight text-white cursor-pointer hover:text-emerald-400 transition"
                >
                  Observatório Parlamentar CLDF
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  9ª Legislatura
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fiscalização, transparência regimental e dados abertos auditados
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              {YEARS.map(y => (
                <button
                  key={y.key}
                  id={`year-btn-${y.key}`}
                  onClick={() => onSelectYear(y.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedYear === y.key
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {y.key === 'all' ? 'Todos' : y.key}
                </button>
              ))}
            </div>

            {/* Quick Link to Calendar */}
            <button
              id="header-calendar-btn"
              onClick={() => onSelectTab('calendar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition border ${
                activeTab === 'calendar'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Calendário e Grade Oficial de Plenário e Comissões"
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Calendário CLDF</span>
              <span className="sm:hidden">Calendário</span>
            </button>

            {/* Universal Export Dropdown/Group */}
            <div className="relative inline-flex rounded-lg shadow-xs">
              <button
                id="export-csv-btn"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-l-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-r-0 border-slate-700 transition"
                title="Exportar planilha CSV da tela atual"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>
              <button
                id="export-pdf-btn"
                onClick={handleExportPDF}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-r-lg bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 transition"
                title="Exportar relatório imprimível em PDF da tela atual"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>

            {/* Official Sources Button */}
            <button
              id="sources-guide-btn"
              onClick={onOpenSources}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition border ${
                activeTab === 'sources'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
              }`}
              title="Guia de Fontes Oficiais e Integridade"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Fontes</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
