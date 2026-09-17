/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  UserCheck,
  Vote,
  TrendingUp,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  ListFilter,
  Tag,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { YearKey, Deputy, ActiveTab, PropositionItem, AmendmentItem, RollCallVote } from '../types';
import {
  getGlobalAggregates,
  getDeputyMetrics,
  formatCurrency,
  formatNumber
} from '../data/cldfData';
import { propositionsList } from '../data/propositionsData';
import { amendmentsList } from '../data/amendmentsData';
import { rollCallVotesData } from '../data/votesData';
import { matchesSearch } from '../utils/searchMatcher';

interface MetricsOverviewProps {
  selectedYear: YearKey;
  deputies: Deputy[];
  searchQuery?: string;
  selectedParty?: string;
  onSelectDeputy: (deputy: Deputy) => void;
  onClearFilters?: () => void;
  onSelectTag?: (tag: string) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

const COLORS = ['#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#4B5563'];

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  selectedYear,
  deputies,
  searchQuery = '',
  selectedParty = 'all',
  onSelectDeputy,
  onClearFilters,
  onSelectTag,
  onSelectTab
}) => {
  const [dashboardListTab, setDashboardListTab] = useState<'propositions' | 'amendments' | 'votes'>('propositions');

  const global = getGlobalAggregates(selectedYear);
  const hasActiveFilter = Boolean(searchQuery.trim() || selectedParty !== 'all');

  // Filter individual propositions matching year, party, and search query
  const filteredPropositions = propositionsList.filter(prop => {
    if (selectedYear !== 'all' && prop.ano !== Number(selectedYear)) return false;
    if (selectedParty !== 'all' && prop.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchable = [
        prop.codigo,
        prop.tipo,
        prop.tipoDescricao,
        prop.ementa,
        prop.autorNome,
        prop.autorPartido,
        prop.classificacaoOficial,
        prop.subclassificacao || '',
        prop.tramitacaoAtual,
        ...prop.tags
      ].join(' ');
      if (!matchesSearch(searchable, searchQuery)) return false;
    }
    return true;
  });

  // Filter individual amendments matching year, party, and search query
  const filteredAmendments = amendmentsList.filter(amd => {
    if (selectedYear !== 'all' && amd.ano !== Number(selectedYear)) return false;
    if (selectedParty !== 'all' && amd.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchable = [
        amd.numeroEmenda,
        amd.objeto,
        amd.funcaoGoverno,
        amd.subfuncao,
        amd.orgaoExecutor,
        amd.regiaoAdministrativa,
        amd.autorNome,
        amd.autorPartido,
        amd.classificacaoOficial,
        ...amd.tags
      ].join(' ');
      if (!matchesSearch(searchable, searchQuery)) return false;
    }
    return true;
  });

  // Filter roll call votes matching year and search query
  const filteredVotes = rollCallVotesData.filter(vote => {
    if (selectedYear !== 'all' && vote.ano !== selectedYear) return false;
    if (searchQuery.trim()) {
      const searchable = [
        vote.codigo,
        vote.titulo,
        vote.ementa,
        vote.categoria,
        vote.classificacaoOficial || '',
        ...(vote.tags || [])
      ].join(' ');
      if (!matchesSearch(searchable, searchQuery)) return false;
    }
    return true;
  });

  // Calculate sum of indicated and paid for filtered amendments
  const filteredAmendmentsTotalIndicado = filteredAmendments.reduce((acc, a) => acc + a.valorIndicado, 0);
  const filteredAmendmentsTotalPago = filteredAmendments.reduce((acc, a) => acc + a.valorPago, 0);

  // Top deputies by proposition count
  const topProposers = [...deputies]
    .map(dep => {
      const m = getDeputyMetrics(dep, selectedYear);
      return {
        id: dep.id,
        deputy: dep,
        name: dep.nomeParlamentar,
        partido: dep.partido,
        total: m.proposicoes.total,
        pls: m.proposicoes.pl
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Area distribution of amendments
  const areaTotals: Record<string, number> = {};
  deputies.forEach(dep => {
    const m = getDeputyMetrics(dep, selectedYear);
    m.emendas.areas.forEach(a => {
      areaTotals[a.area] = (areaTotals[a.area] || 0) + a.valor;
    });
  });

  const areaPieData = Object.entries(areaTotals).map(([name, value]) => ({
    name,
    value
  }));

  // Average attendance by party
  const partyAttendance: Record<string, { total: number; count: number }> = {};
  deputies.forEach(dep => {
    const m = getDeputyMetrics(dep, selectedYear);
    if (!partyAttendance[dep.partido]) {
      partyAttendance[dep.partido] = { total: 0, count: 0 };
    }
    partyAttendance[dep.partido].total += m.presenca.plenario.taxaAssiduidade;
    partyAttendance[dep.partido].count += 1;
  });

  const partyAttendanceData = Object.entries(partyAttendance).map(([partido, val]) => ({
    partido,
    assiduidade: Number((val.total / val.count).toFixed(1))
  })).sort((a, b) => b.assiduidade - a.assiduidade);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada / Sancionada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Em Tramitação':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pronta para Pauta':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Arquivada':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'PL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PLC':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'PELO':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'PDL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PR':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'IND':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REQ':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'MOC':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'REC':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Status Banner if active */}
      {hasActiveFilter && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Filtro ativo: {searchQuery ? `termo "${searchQuery}"` : ''}{' '}
              {selectedParty !== 'all' ? `• partido ${selectedParty}` : ''} •{' '}
              <strong>{filteredPropositions.length} proposições</strong>,{' '}
              <strong>{filteredAmendments.length} emendas</strong> e{' '}
              <strong>{filteredVotes.length} votações</strong> correspondentes.
            </span>
          </div>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition shadow-xs"
            >
              Limpar Filtro
            </button>
          )}
        </div>
      )}

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Proposições */}
        <div
          onClick={() => onSelectTab && onSelectTab('propositions')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {hasActiveFilter ? 'Proposições Filtradas' : 'Proposições Apresentadas'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatNumber(hasActiveFilter ? filteredPropositions.length : global.totalProposicoes)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {hasActiveFilter ? (
                <span className="text-blue-600 font-semibold">
                  Matérias com a classificação/busca atual
                </span>
              ) : (
                <>
                  <span className="font-semibold text-blue-600">{formatNumber(global.totalPL)}</span> Projetos de Lei (PLs)
                </>
              )}
            </p>
          </div>
        </div>

        {/* Pillar 2: Emendas Orçamentárias */}
        <div
          onClick={() => onSelectTab && onSelectTab('amendments')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {hasActiveFilter ? 'Emendas Filtradas' : 'Emendas Indicadas'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {hasActiveFilter
                ? formatCurrency(filteredAmendmentsTotalIndicado)
                : formatCurrency(global.totalEmendasIndicadas)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {hasActiveFilter ? (
                <span className="text-emerald-700 font-semibold">
                  {filteredAmendments.length} emendas ({formatCurrency(filteredAmendmentsTotalPago)} pagas)
                </span>
              ) : (
                <>
                  <span className="font-semibold text-emerald-600">{formatCurrency(global.totalEmendasPagas)}</span> pagas ({global.taxaExecucaoEmendas}% exec.)
                </>
              )}
            </p>
          </div>
        </div>

        {/* Pillar 3: Assiduidade */}
        <div
          onClick={() => onSelectTab && onSelectTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assiduidade Média Plenário
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {global.mediaAssiduidade}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Todas as sessões (ordinárias e extras)
            </p>
          </div>
        </div>

        {/* Pillar 4: Votações Nominais */}
        <div
          onClick={() => onSelectTab && onSelectTab('voting')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {hasActiveFilter ? 'Votações Filtradas' : 'Votações Nominais'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Vote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {hasActiveFilter ? filteredVotes.length : global.totalVotacoes}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {hasActiveFilter ? 'Deliberações com o termo/filtro' : 'Matérias deliberadas em plenário'}
            </p>
          </div>
        </div>
      </div>

      {/* CORE USER REQUIREMENT: DASHBOARD LISTING SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Section Header & Sub-Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ListFilter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Listagem do Dashboard: Matérias Filtradas
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhe diretamente as proposições regimentais, emendas orçamentárias e votações nominais
              </p>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setDashboardListTab('propositions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                dashboardListTab === 'propositions'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Proposições ({filteredPropositions.length})
            </button>
            <button
              onClick={() => setDashboardListTab('amendments')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                dashboardListTab === 'amendments'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Emendas ({filteredAmendments.length})
            </button>
            <button
              onClick={() => setDashboardListTab('votes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                dashboardListTab === 'votes'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              Votações ({filteredVotes.length})
            </button>
          </div>
        </div>

        {/* 1. PROPOSITIONS LISTING */}
        {dashboardListTab === 'propositions' && (
          <div className="divide-y divide-slate-100">
            {filteredPropositions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma proposição encontrada para o filtro atual.
              </div>
            ) : (
              filteredPropositions.slice(0, 10).map(prop => (
                <div key={prop.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getTypeColor(prop.tipo)}`}>
                        {prop.codigo}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prop.tipoDescricao}
                      </span>
                      <span className="text-xs text-slate-400">• Ano {prop.ano}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(prop.status)}`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {prop.ementa}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={prop.autorFoto}
                        alt={prop.autorNome}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-900">{prop.autorNome}</span>
                      <span className="text-slate-500 font-medium">({prop.autorPartido})</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600 font-medium">{prop.classificacaoOficial}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {prop.tags.slice(0, 3).map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onSelectTag && onSelectTag(tag)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition"
                        >
                          #{tag}
                        </button>
                      ))}
                      {onSelectTab && (
                        <button
                          onClick={() => onSelectTab('propositions')}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 ml-2 inline-flex items-center gap-0.5"
                        >
                          Detalhes <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {filteredPropositions.length > 10 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                <button
                  onClick={() => onSelectTab && onSelectTab('propositions')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  Ver todas as {filteredPropositions.length} proposições na aba detalhada
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. AMENDMENTS LISTING */}
        {dashboardListTab === 'amendments' && (
          <div className="divide-y divide-slate-100">
            {filteredAmendments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma emenda orçamentária encontrada para o filtro atual.
              </div>
            ) : (
              filteredAmendments.slice(0, 10).map(amd => (
                <div key={amd.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {amd.numeroEmenda}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {amd.funcaoGoverno}
                      </span>
                      <span className="text-xs text-slate-400">• {amd.regiaoAdministrativa}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(amd.valorIndicado)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Pago: {formatCurrency(amd.valorPago)} ({amd.taxaExecucao}%)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {amd.objeto}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={amd.autorFoto}
                        alt={amd.autorNome}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-900">{amd.autorNome}</span>
                      <span className="text-slate-500 font-medium">({amd.autorPartido})</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600 font-medium">{amd.orgaoExecutor}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {amd.tags.slice(0, 3).map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onSelectTag && onSelectTag(tag)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition"
                        >
                          #{tag}
                        </button>
                      ))}
                      {onSelectTab && (
                        <button
                          onClick={() => onSelectTab('amendments')}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 ml-2 inline-flex items-center gap-0.5"
                        >
                          Detalhes <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {filteredAmendments.length > 10 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                <button
                  onClick={() => onSelectTab && onSelectTab('amendments')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                >
                  Ver todas as {filteredAmendments.length} emendas na aba detalhada
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. VOTES LISTING */}
        {dashboardListTab === 'votes' && (
          <div className="divide-y divide-slate-100">
            {filteredVotes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma votação nominal encontrada para o filtro atual.
              </div>
            ) : (
              filteredVotes.slice(0, 10).map(vote => (
                <div key={vote.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        {vote.codigo}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {vote.titulo}
                      </span>
                      <span className="text-xs text-slate-400">• {vote.data}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      vote.resultado === 'Aprovado'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {vote.resultado}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {vote.ementa}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-medium">{vote.categoria}</span>
                      <span className="text-emerald-700 font-bold">{vote.votosSim} SIM</span>
                      <span className="text-rose-700 font-bold">{vote.votosNao} NÃO</span>
                      <span className="text-slate-500">{vote.abstencoes} Abs.</span>
                    </div>

                    {onSelectTab && (
                      <button
                        onClick={() => onSelectTab('voting')}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-0.5"
                      >
                        Painel de Votos <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {filteredVotes.length > 10 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                <button
                  onClick={() => onSelectTab && onSelectTab('voting')}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
                >
                  Ver todas as {filteredVotes.length} votações no painel nominal
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Proposições por Deputado */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Top 8 Deputados em Proposições
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">PLs e Matérias Totais</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProposers} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: number) => [`${formatNumber(val)} matérias`, 'Volume']}
                  labelFormatter={(label) => `Deputado(a): ${label}`}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} name="Total de Proposições" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-right">
            Clique no card do deputado na aba "Deputados" para ver detalhes de tramitação.
          </p>
        </div>

        {/* Chart 2: Emendas por Área */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Destinação de Emendas por Área
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Volume Alocado</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {areaPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Alocação']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '8px' }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-700">{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Highlights and Party Assiduity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assiduidade por Partido */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                Assiduidade em Plenário por Bancada / Partido
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">% de Presenças</span>
          </div>

          <div className="space-y-3">
            {partyAttendanceData.map(item => (
              <div key={item.partido} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.partido}</span>
                  <span>{item.assiduidade}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${item.assiduidade}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guia Rápido de Interpretação */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Como auditar os 4 eixos</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Proposições:</strong> Não observe apenas a quantidade. Verifique se são Projetos de Lei com impacto real ou apenas Indicações de zeladoria.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Emendas:</strong> Compare o valor <em>indicado</em> na LOA com o valor <em>pago</em> no Portal da Transparência do DF (SIGGO).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Comissões:</strong> A presença em comissões (CCJ, CEOF) é tão vital quanto o Plenário, pois lá os projetos são relatados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong>Votações:</strong> Confira as matérias com votação nominal no Painel Eletrônico para entender a coerência de cada mandato.</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            Fonte: Portal da Transparência da CLDF & CGDF
          </div>
        </div>
      </div>
    </div>
  );
};
