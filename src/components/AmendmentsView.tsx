/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowUpDown,
  ListFilter,
  Award,
  Filter,
  Tag,
  Building2,
  MapPin,
  FileSpreadsheet,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Deputy, YearKey, AmendmentStatus, ActiveTab, AmendmentItem } from '../types';
import { getDeputyMetrics, formatCurrency, findDeputyByAuthorId } from '../data/cldfData';
import { amendmentsList } from '../data/amendmentsData';
import { propositionsList } from '../data/propositionsData';
import { rollCallVotesData } from '../data/votesData';
import { matchesSearch } from '../utils/searchMatcher';

interface AmendmentsViewProps {
  deputies: Deputy[];
  selectedYear: YearKey;
  searchQuery?: string;
  selectedParty?: string;
  onSelectDeputy: (deputy: Deputy) => void;
  onSelectAmendment?: (amd: AmendmentItem) => void;
  onSelectTag?: (tag: string) => void;
  onSelectYear?: (year: YearKey) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const AmendmentsView: React.FC<AmendmentsViewProps> = ({
  deputies,
  selectedYear,
  searchQuery = '',
  selectedParty = 'all',
  onSelectDeputy,
  onSelectAmendment,
  onSelectTag,
  onSelectYear,
  onSelectTab
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [functionFilter, setFunctionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AmendmentStatus>('all');

  // Sorting for deputy summary table
  const [sortColumn, setSortColumn] = useState<'pago' | 'indicado' | 'taxaExecucao'>('pago');
  const [sortAsc, setSortAsc] = useState(false);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Filter individual amendments
  const filteredAmendments = amendmentsList.filter(amd => {
    // Year filter
    if (selectedYear !== 'all' && amd.ano !== Number(selectedYear)) {
      return false;
    }
    // Party filter
    if (selectedParty !== 'all' && amd.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) {
      return false;
    }
    // Function filter
    if (functionFilter !== 'all' && !amd.funcaoGoverno.toLowerCase().includes(functionFilter.toLowerCase())) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && amd.statusExecucao !== statusFilter) {
      return false;
    }
    // Smart Topic & Keyword Search
    if (searchQuery.trim()) {
      const searchableString = [
        amd.numeroEmenda,
        amd.objeto,
        amd.autorNome,
        amd.autorPartido,
        amd.funcaoGoverno,
        amd.subfuncao,
        amd.orgaoExecutor,
        amd.regiaoAdministrativa,
        amd.classificacaoOficial,
        ...amd.tags
      ].join(' ');

      if (!matchesSearch(searchableString, searchQuery)) return false;
    }
    return true;
  });

  // Calculate matching items across all years for smart suggestion
  const matchingAllYears = amendmentsList.filter(amd => {
    if (selectedParty !== 'all' && amd.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchableString = [
        amd.numeroEmenda,
        amd.objeto,
        amd.autorNome,
        amd.autorPartido,
        amd.funcaoGoverno,
        amd.subfuncao,
        amd.orgaoExecutor,
        amd.regiaoAdministrativa,
        amd.classificacaoOficial,
        ...amd.tags
      ].join(' ');
      return matchesSearch(searchableString, searchQuery);
    }
    return true;
  });

  // Calculate matching propositions and votes for cross-tab guidance
  const matchingPropositionsCount = propositionsList.filter(prop => {
    const searchable = [prop.codigo, prop.ementa, prop.autorNome, prop.classificacaoOficial, ...prop.tags].join(' ');
    return matchesSearch(searchable, searchQuery);
  }).length;

  const matchingVotesCount = rollCallVotesData.filter(vote => {
    const searchable = [vote.codigo, vote.titulo, vote.ementa, vote.categoria, ...(vote.tags || [])].join(' ');
    return matchesSearch(searchable, searchQuery);
  }).length;

  // Deputy ranking table calculation grounded in official parliamentary category metrics
  const rows = deputies
    .map(dep => {
      const m = getDeputyMetrics(dep, selectedYear);
      let indicado = m.emendas.indicado;
      let empenhado = m.emendas.empenhado;
      let liquidado = m.emendas.liquidado;
      let pago = m.emendas.pago;

      // If user filtered by a specific function/area category, calculate based on deputy's official area breakdown
      if (functionFilter !== 'all') {
        const areaKeyword = functionFilter.replace(/^\d+\s*-\s*/, '').toLowerCase();
        const matchingArea = m.emendas.areas.find(a =>
          a.area.toLowerCase().includes(areaKeyword) ||
          areaKeyword.includes(a.area.toLowerCase())
        );
        if (matchingArea) {
          indicado = matchingArea.valor;
          const execRatio = m.emendas.indicado > 0 ? m.emendas.pago / m.emendas.indicado : 0.8;
          pago = Number((indicado * execRatio).toFixed(2));
          empenhado = Number((indicado * 0.95).toFixed(2));
          liquidado = Number((indicado * 0.88).toFixed(2));
        } else {
          indicado = 0;
          pago = 0;
          empenhado = 0;
          liquidado = 0;
        }
      }

      const taxaExecucao = indicado > 0 ? Number(((pago / indicado) * 100).toFixed(1)) : 0;

      return {
        deputy: dep,
        name: dep.nomeParlamentar,
        partido: dep.partido,
        regiao: dep.regiaoBase,
        count: m.emendas.destaques.length,
        indicado,
        empenhado,
        liquidado,
        pago,
        taxaExecucao,
        destaques: m.emendas.destaques
      };
    })
    .sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      return sortAsc ? valA - valB : valB - valA;
    });

  // Quantitative category totals across all displayed deputies
  const activeTotals = rows.reduce(
    (acc, cur) => {
      acc.indicado += cur.indicado;
      acc.empenhado += cur.empenhado;
      acc.liquidado += cur.liquidado;
      acc.pago += cur.pago;
      return acc;
    },
    { indicado: 0, empenhado: 0, liquidado: 0, pago: 0 }
  );

  const avgTaxa = activeTotals.indicado > 0
    ? Number(((activeTotals.pago / activeTotals.indicado) * 100).toFixed(1))
    : 0;

  const getStatusBadge = (status: AmendmentStatus) => {
    switch (status) {
      case 'Pago Total':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Pago Parcial':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Empenhado':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Em Liquidação':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const functionsList = [
    { key: 'all', label: 'Todas as Funções' },
    { key: '10 - Saúde', label: '10 - Saúde' },
    { key: '12 - Educação', label: '12 - Educação' },
    { key: '15 - Urbanismo', label: '15 - Urbanismo' },
    { key: '06 - Segurança', label: '06 - Segurança' },
    { key: '08 - Assistência', label: '08 - Assistência' },
    { key: '27 - Desporto', label: '27 - Desporto' },
    { key: '13 - Cultura', label: '13 - Cultura' }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-emerald-950">
                  Execução Orçamentária das Emendas Parlamentares
                </h2>
                {/* Direct Year Selector inside Amendments */}
                {onSelectYear && (
                  <div className="inline-flex items-center gap-1 bg-white border border-emerald-200 rounded-lg p-0.5 text-xs">
                    {(['all', '2023', '2024', '2025'] as const).map(y => (
                      <button
                        key={y}
                        onClick={() => onSelectYear(y)}
                        className={`px-2 py-0.5 rounded font-medium transition ${
                          selectedYear === y
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {y === 'all' ? 'Todos os Anos' : y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-emerald-800 mt-1 max-w-2xl">
                Emendas individuais e de bancada indicadas na LOA e executadas pelo Governo do DF. Acompanhe a destinação oficial, órgãos executores e o ciclo orçamentário: <em>Indicado &rarr; Empenhado &rarr; Liquidado &rarr; Pago</em>.
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex rounded-lg border border-emerald-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Consolidado por Deputado
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Emendas Detalhadas na LOA ({filteredAmendments.length})
            </button>
          </div>
        </div>

        {/* Aggregate Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/60">
          <div>
            <span className="text-[11px] text-emerald-800 font-medium">
              {functionFilter !== 'all' ? `Indicado em ${functionFilter}` : 'Total Indicado na LOA'}
            </span>
            <p className="text-lg font-bold text-emerald-950">{formatCurrency(activeTotals.indicado)}</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-800 font-medium">Total Empenhado (Reservado)</span>
            <p className="text-lg font-bold text-emerald-950">{formatCurrency(activeTotals.empenhado)}</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-800 font-medium">Total Pago Efetivamente</span>
            <p className="text-lg font-bold text-emerald-900">{formatCurrency(activeTotals.pago)}</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-800 font-medium">Taxa Média de Execução</span>
            <p className="text-lg font-bold text-emerald-950">{avgTaxa}%</p>
          </div>
        </div>
      </div>

      {/* Sub-filters for Function and Status (Applies to both views) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Function Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Função LOA:
          </span>
          {functionsList.map(fn => (
            <button
              key={fn.key}
              onClick={() => setFunctionFilter(fn.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                functionFilter === fn.key
                  ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {fn.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
          {(['all', 'Pago Total', 'Pago Parcial', 'Empenhado'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-slate-800 text-white shadow-xs font-bold ring-2 ring-slate-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Todos os Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: DETAILED LIST OF FILTERED AMENDMENTS */}
      {viewMode === 'list' && (
        <div className="space-y-4">

          {/* Individual Amendments List */}
          {filteredAmendments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="text-center max-w-lg mx-auto">
                <p className="text-slate-700 text-sm font-semibold">
                  Nenhuma emenda parlamentar encontrada para os filtros atuais {selectedYear !== 'all' ? `no exercício de ${selectedYear}` : ''}.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Termo pesquisado: <strong>"{searchQuery}"</strong>
                </p>
              </div>

              {/* Smart Cross-Year Recovery */}
              {selectedYear !== 'all' && matchingAllYears.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-950 text-center sm:text-left">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Encontramos <strong>{matchingAllYears.length} emendas</strong> sobre este tema em outros anos da 9ª Legislatura (2023-2025).
                    </span>
                  </div>
                  {onSelectYear && (
                    <button
                      onClick={() => onSelectYear('all')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs shrink-0 transition"
                    >
                      Ver Todos os Anos
                    </button>
                  )}
                </div>
              )}

              {/* Cross-Tab Guidance */}
              {(matchingPropositionsCount > 0 || matchingVotesCount > 0) && onSelectTab && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-blue-900 text-center sm:text-left">
                    <span>
                      Também encontramos registros com o tema <strong>"{searchQuery}"</strong> em outras seções:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1 font-semibold">
                      {matchingPropositionsCount > 0 && <span>• {matchingPropositionsCount} Proposições de Lei</span>}
                      {matchingVotesCount > 0 && <span>• {matchingVotesCount} Votações Nominais</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {matchingPropositionsCount > 0 && (
                      <button
                        onClick={() => onSelectTab('propositions')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                      >
                        Ir para Proposições <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {matchingVotesCount > 0 && (
                      <button
                        onClick={() => onSelectTab('voting')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                      >
                        Ir para Votações <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAmendments.map(amd => {
                const authorDeputy = findDeputyByAuthorId(deputies, amd.autorId);
                return (
                  <div
                    key={amd.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition flex flex-col gap-3.5"
                  >
                    {/* Header Row: Amendment Code, Year, Execution Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onSelectAmendment && onSelectAmendment(amd)}
                          className="text-sm font-extrabold text-emerald-950 px-2.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-400 rounded-md transition inline-flex items-center gap-1.5"
                          title="Clique para ver o detalhamento financeiro e execução desta emenda"
                        >
                          <span>{amd.numeroEmenda}</span>
                          <span className="text-[10px] text-emerald-800 bg-white px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                            Ver Detalhes &rarr;
                          </span>
                        </button>
                        <span className="text-xs font-semibold text-slate-500">
                          Emenda {amd.tipo} • LOA {amd.ano}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {amd.funcaoGoverno}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(amd.statusExecucao)}`}>
                          {amd.statusExecucao} ({amd.taxaExecucao}%)
                        </span>
                      </div>
                    </div>

                    {/* Author Information */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={amd.autorFoto}
                          alt={amd.autorNome}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {amd.autorNome}
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold">
                              {amd.autorPartido}
                            </span>
                          </p>
                          <span className="text-[11px] text-slate-400">
                            Autor da Emenda Parlamentar
                          </span>
                        </div>
                      </div>

                      {authorDeputy && (
                        <button
                          onClick={() => onSelectDeputy(authorDeputy)}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                          Ver Perfil do Deputado &rarr;
                        </button>
                      )}
                    </div>

                    {/* Objeto Descritivo da Emenda na LOA */}
                    <div
                      onClick={() => onSelectAmendment && onSelectAmendment(amd)}
                      className="bg-slate-50/90 hover:bg-emerald-50/40 rounded-lg p-3.5 border border-slate-100 hover:border-emerald-200 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-800">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
                          Objeto e Destinação Orçamentária
                        </h4>
                        <span className="text-[10px] text-emerald-800 font-semibold opacity-0 group-hover:opacity-100 transition">
                          Clique para detalhamento financeiro &rarr;
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {amd.objeto}
                      </p>
                    </div>

                    {/* Classification details: Órgão Executor, Região Administrativa, Subfunção */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          Órgão Executor do GDF
                        </span>
                        <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                          {amd.orgaoExecutor}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          Região Administrativa Beneficiada
                        </span>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">
                          {amd.regiaoAdministrativa}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Subfunção / Classificação Oficial
                        </span>
                        <p className="font-bold text-emerald-800 text-xs mt-0.5 truncate">
                          {amd.subfuncao}
                        </p>
                      </div>
                    </div>

                    {/* Financial Stages Breakdown */}
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-medium">Indicado na LOA</span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{formatCurrency(amd.valorIndicado)}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-medium">Empenhado (GDF)</span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{formatCurrency(amd.valorEmpenhado)}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-medium">Liquidado</span>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{formatCurrency(amd.valorLiquidado)}</p>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                          <span className="text-[10px] text-emerald-700 font-medium">Pago Efetivamente</span>
                          <p className="text-xs font-bold text-emerald-900 mt-0.5">{formatCurrency(amd.valorPago)}</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(amd.taxaExecucao, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Thematic Tags (Clickable) */}
                    {amd.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          Tags da Emenda:
                        </span>
                        {amd.tags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => onSelectTag && onSelectTag(tag)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 transition"
                            title={`Filtrar por "${tag}"`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CONSOLIDATED DEPUTY SUMMARY TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Ranking de Execução Orçamentária das Emendas por Parlamentar
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Clique nos cabeçalhos para reordenar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="p-3">Deputado(a)</th>
                  <th className="p-3 text-center">Partido</th>
                  <th className="p-3">Base Eleitoral</th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'indicado') setSortAsc(!sortAsc);
                      else { setSortColumn('indicado'); setSortAsc(false); }
                    }}
                    className="p-3 text-right cursor-pointer hover:bg-slate-200 transition"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Indicado (LOA)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3 text-right">Empenhado</th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'pago') setSortAsc(!sortAsc);
                      else { setSortColumn('pago'); setSortAsc(false); }
                    }}
                    className="p-3 text-right cursor-pointer hover:bg-slate-200 transition text-emerald-800"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Pago Efetivamente</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'taxaExecucao') setSortAsc(!sortAsc);
                      else { setSortColumn('taxaExecucao'); setSortAsc(false); }
                    }}
                    className="p-3 text-center cursor-pointer hover:bg-slate-200 transition"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>% Execução</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      Nenhum parlamentar encontrado para o filtro aplicado.
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.deputy.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={row.deputy.foto}
                            alt={row.name}
                            className="w-7 h-7 rounded-full border border-slate-200 shrink-0"
                          />
                          <span className="font-semibold text-slate-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700">{row.partido}</td>
                      <td className="p-3 text-slate-600">{row.regiao}</td>
                      <td className="p-3 text-right font-medium text-slate-700">
                        {formatCurrency(row.indicado)}
                      </td>
                      <td className="p-3 text-right text-slate-600">
                        {formatCurrency(row.empenhado)}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-800 bg-emerald-50/40">
                        {formatCurrency(row.pago)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            row.taxaExecucao >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.taxaExecucao >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.taxaExecucao}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onSelectDeputy(row.deputy)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
