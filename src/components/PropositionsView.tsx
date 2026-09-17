/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  ArrowUpDown,
  Tag,
  ExternalLink,
  Filter,
  ListFilter,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';
import { Deputy, YearKey, PropositionType, PropositionStatus, ActiveTab, PropositionItem } from '../types';
import { getDeputyMetrics, formatNumber, findDeputyByAuthorId, isAuthorOf } from '../data/cldfData';
import { propositionsList } from '../data/propositionsData';
import { amendmentsList } from '../data/amendmentsData';
import { rollCallVotesData } from '../data/votesData';
import { matchesSearch } from '../utils/searchMatcher';

interface PropositionsViewProps {
  deputies: Deputy[];
  selectedYear: YearKey;
  searchQuery?: string;
  selectedParty?: string;
  onSelectDeputy: (deputy: Deputy) => void;
  onSelectProposition?: (prop: PropositionItem) => void;
  onSelectTag?: (tag: string) => void;
  onSelectYear?: (year: YearKey) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const PropositionsView: React.FC<PropositionsViewProps> = ({
  deputies,
  selectedYear,
  searchQuery = '',
  selectedParty = 'all',
  onSelectDeputy,
  onSelectProposition,
  onSelectTag,
  onSelectYear,
  onSelectTab
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [typeFilter, setTypeFilter] = useState<'all' | PropositionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PropositionStatus>('all');
  const [selectedDeputyId, setSelectedDeputyId] = useState<string>('all');
  const [displayLimit, setDisplayLimit] = useState<number>(30);

  React.useEffect(() => {
    setDisplayLimit(30);
  }, [selectedYear, selectedParty, typeFilter, statusFilter, selectedDeputyId, searchQuery]);

  // Sorting for deputy summary table
  const [sortColumn, setSortColumn] = useState<'total' | 'pl' | 'pelo' | 'aprovadas' | 'plc' | 'pdl' | 'pr' | 'ind' | 'req' | 'moc'>('total');
  const [sortAsc, setSortAsc] = useState(false);

  // When type filter changes, automatically sort by that category
  const handleTypeFilterChange = (type: 'all' | PropositionType) => {
    setTypeFilter(type);
    if (type === 'all') {
      setSortColumn('total');
      setSortAsc(false);
    } else {
      const typeKey = type.toLowerCase() as any;
      setSortColumn(typeKey);
      setSortAsc(false);
    }
  };

  // Filter individual propositions for list inspection
  const filteredPropositions = propositionsList.filter(prop => {
    // Year filter
    if (selectedYear !== 'all' && prop.ano !== Number(selectedYear)) {
      return false;
    }
    // Party filter
    if (selectedParty !== 'all' && prop.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) {
      return false;
    }
    // Deputy filter
    if (selectedDeputyId !== 'all' && !isAuthorOf(prop.autorId, selectedDeputyId)) {
      return false;
    }
    // Type filter
    if (typeFilter !== 'all' && prop.tipo !== typeFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && prop.status !== statusFilter) {
      return false;
    }
    // Smart Topic & Token Search
    if (searchQuery.trim()) {
      const searchableString = [
        prop.codigo,
        prop.ementa,
        prop.autorNome,
        prop.autorPartido,
        prop.classificacaoOficial,
        prop.subclassificacao || '',
        prop.tramitacaoAtual,
        ...prop.tags
      ].join(' ');

      if (!matchesSearch(searchableString, searchQuery)) return false;
    }
    return true;
  });

  // Calculate matching items in other years for smart suggestion
  const matchingAllYears = propositionsList.filter(prop => {
    if (selectedParty !== 'all' && prop.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchableString = [
        prop.codigo,
        prop.ementa,
        prop.autorNome,
        prop.autorPartido,
        prop.classificacaoOficial,
        prop.subclassificacao || '',
        prop.tramitacaoAtual,
        ...prop.tags
      ].join(' ');
      return matchesSearch(searchableString, searchQuery);
    }
    return true;
  });

  // Calculate matching amendments and votes for cross-tab guidance
  const matchingAmendmentsCount = amendmentsList.filter(amd => {
    const searchable = [amd.numeroEmenda, amd.objeto, amd.funcaoGoverno, amd.subfuncao, amd.autorNome, ...amd.tags].join(' ');
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

      return {
        deputy: dep,
        name: dep.nomeParlamentar,
        partido: dep.partido,
        regiao: dep.regiaoBase,
        total: m.proposicoes.total,
        pl: m.proposicoes.pl,
        plc: m.proposicoes.plc || 0,
        pelo: m.proposicoes.pelo,
        pdl: m.proposicoes.pdl,
        pr: m.proposicoes.pr || 0,
        ind: m.proposicoes.ind,
        req: m.proposicoes.req,
        moc: m.proposicoes.moc || 0,
        rec: m.proposicoes.rec || 0,
        aprovadas: m.proposicoes.aprovadas,
        emTramitacao: m.proposicoes.emTramitacao,
        arquivadas: m.proposicoes.arquivadas
      };
    })
    .sort((a, b) => {
      const valA = (a as any)[sortColumn] ?? 0;
      const valB = (b as any)[sortColumn] ?? 0;
      return sortAsc ? valA - valB : valB - valA;
    });

  // Aggregate quantitative totals across all displayed deputies for the active categories
  const totals = rows.reduce(
    (acc, cur) => {
      acc.total += cur.total;
      acc.pl += cur.pl;
      acc.plc += cur.plc;
      acc.pelo += cur.pelo;
      acc.pdl += cur.pdl;
      acc.pr += cur.pr;
      acc.ind += cur.ind;
      acc.req += cur.req;
      acc.moc += cur.moc;
      acc.rec += cur.rec;
      acc.aprovadas += cur.aprovadas;
      acc.emTramitacao += cur.emTramitacao;
      acc.arquivadas += cur.arquivadas;
      return acc;
    },
    { total: 0, pl: 0, plc: 0, pelo: 0, pdl: 0, pr: 0, ind: 0, req: 0, moc: 0, rec: 0, aprovadas: 0, emTramitacao: 0, arquivadas: 0 }
  );

  const getStatusBadge = (status: PropositionStatus) => {
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

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-blue-950">
                  Todas as Proposições da 9ª Legislatura
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  100% das Matérias Regimentais
                </span>
                {/* Year Selector Pills inside Propositions */}
                {onSelectYear && (
                  <div className="inline-flex items-center gap-1 bg-white border border-blue-200 rounded-lg p-0.5 text-xs">
                    {(['all', '2023', '2024', '2025'] as const).map(y => (
                      <button
                        key={y}
                        onClick={() => onSelectYear(y)}
                        className={`px-2 py-0.5 rounded font-medium transition ${
                          selectedYear === y
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {y === 'all' ? 'Todos os Anos' : y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-blue-800 mt-1 max-w-2xl leading-relaxed">
                Contempla <strong>todos os instrumentos regimentais de atuação parlamentar</strong>: Projetos de Lei Ordinária (PL), Leis Complementares (PLC), Emendas à Lei Orgânica (PELO), Decretos Legislativos (PDL), Resoluções (PR), Indicações de Serviços e Obras Comunitárias (IND), Requerimentos de Fiscalização e Audiências (REQ), Moções (MOC) e Recursos (REC).
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex rounded-lg border border-blue-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Lista de Proposições ({filteredPropositions.length})
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Quadro Resumo por Parlamentar
            </button>
          </div>
        </div>

        {/* Aggregate Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-blue-200/60">
          <div>
            <span className="text-[11px] text-blue-700 font-medium">
              {typeFilter !== 'all'
                ? `Total de ${typeFilter} Apresentados`
                : statusFilter !== 'all'
                ? `Total de Matérias ${statusFilter}`
                : 'Total Geral de Proposições'}
            </span>
            <p className="text-lg font-bold text-blue-950">
              {formatNumber(
                typeFilter !== 'all'
                  ? (totals as any)[typeFilter.toLowerCase()] ?? totals.total
                  : statusFilter === 'Aprovada / Sancionada'
                  ? totals.aprovadas
                  : statusFilter === 'Em Tramitação'
                  ? totals.emTramitacao
                  : statusFilter === 'Arquivada'
                  ? totals.arquivadas
                  : totals.total
              )}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-blue-700 font-medium">Leis & Códigos (PL/PLC/PELO)</span>
            <p className="text-lg font-bold text-blue-950">
              {formatNumber(totals.pl + totals.plc + totals.pelo)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-blue-700 font-medium">Fiscalização & Comunidade (REQ/IND/MOC/REC)</span>
            <p className="text-lg font-bold text-indigo-900">
              {formatNumber(totals.ind + totals.req + totals.moc + totals.rec)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-blue-700 font-medium">Matérias Aprovadas</span>
            <p className="text-lg font-bold text-emerald-800">
              {formatNumber(totals.aprovadas)}
            </p>
          </div>
        </div>
      </div>

      {/* Regimental Category & Status Filters (Applies to both Ranking and List) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categoria Regimental:
          </span>
          {[
            { key: 'all', label: 'Todas as Categorias' },
            { key: 'PL', label: 'PL (Lei Ordinária)' },
            { key: 'PLC', label: 'PLC (Lei Complementar)' },
            { key: 'PELO', label: 'PELO (Emenda Lei Orgânica)' },
            { key: 'PDL', label: 'PDL (Decreto Legislativo)' },
            { key: 'PR', label: 'PR (Resolução)' },
            { key: 'IND', label: 'IND (Indicação Comunitária)' },
            { key: 'REQ', label: 'REQ (Requerimento)' },
            { key: 'MOC', label: 'MOC (Moção)' },
            { key: 'REC', label: 'REC (Recurso)' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => handleTypeFilterChange(t.key as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                typeFilter === t.key
                  ? 'bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Situação / Tramitação:</span>
          {(['all', 'Aprovada / Sancionada', 'Em Tramitação', 'Pronta para Pauta', 'Arquivada'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === s
                  ? 'bg-slate-800 text-white shadow-xs font-bold ring-2 ring-slate-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'Todas as Situações' : s}
            </button>
          ))}
        </div>

        {/* Deputy Selector Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Parlamentar Autor:
          </span>
          <select
            value={selectedDeputyId}
            onChange={e => setSelectedDeputyId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os 24 Deputados Distritais</option>
            {deputies.map(d => (
              <option key={d.id} value={d.id}>
                {d.nomeParlamentar} ({d.partido})
              </option>
            ))}
          </select>
          {selectedDeputyId !== 'all' && (
            <button
              onClick={() => setSelectedDeputyId('all')}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline ml-1"
            >
              Ver todos os deputados
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: DETAILED LIST OF FILTERED PROPOSITIONS */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Header count info */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-1">
            <span>
              Exibindo <strong>{Math.min(displayLimit, filteredPropositions.length)}</strong> de <strong>{formatNumber(filteredPropositions.length)}</strong> proposições encontradas
              {selectedDeputyId !== 'all' ? ` do(a) ${deputies.find(d => d.id === selectedDeputyId)?.nomeParlamentar}` : ''}
              {typeFilter !== 'all' ? ` (${typeFilter})` : ''}
              {selectedYear !== 'all' ? ` em ${selectedYear}` : ' na 9ª Legislatura'}
            </span>
            {(typeFilter !== 'all' || statusFilter !== 'all' || selectedDeputyId !== 'all' || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setSelectedDeputyId('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Limpar filtros de proposições
              </button>
            )}
          </div>

          {/* Proposition Cards List */}
          {filteredPropositions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="text-center max-w-lg mx-auto">
                <p className="text-slate-700 text-sm font-semibold">
                  Nenhuma proposição encontrada para os filtros atuais {selectedYear !== 'all' ? `no ano de ${selectedYear}` : ''}.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Termo pesquisado: <strong>"{searchQuery}"</strong>
                </p>
              </div>

              {/* Smart Cross-Year Recovery */}
              {selectedYear !== 'all' && matchingAllYears.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-blue-900 text-center sm:text-left">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Encontramos <strong>{matchingAllYears.length} proposições</strong> com este tema em outros anos da 9ª Legislatura (2023-2025).
                    </span>
                  </div>
                  {onSelectYear && (
                    <button
                      onClick={() => onSelectYear('all')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs shrink-0 transition"
                    >
                      Ver Todos os Anos
                    </button>
                  )}
                </div>
              )}

              {/* Cross-Tab Guidance */}
              {(matchingAmendmentsCount > 0 || matchingVotesCount > 0) && onSelectTab && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-emerald-900 text-center sm:text-left">
                    <span>
                      Também encontramos registros com o tema <strong>"{searchQuery}"</strong> em outras seções:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1 font-semibold">
                      {matchingAmendmentsCount > 0 && <span>• {matchingAmendmentsCount} Emendas Orçamentárias</span>}
                      {matchingVotesCount > 0 && <span>• {matchingVotesCount} Votações Nominais</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {matchingAmendmentsCount > 0 && (
                      <button
                        onClick={() => onSelectTab('amendments')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                      >
                        Ir para Emendas <ArrowRight className="w-3.5 h-3.5" />
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
            <>
              <div className="space-y-3.5">
                {filteredPropositions.slice(0, displayLimit).map(prop => {
                const authorDeputy = findDeputyByAuthorId(deputies, prop.autorId);
                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition flex flex-col gap-3"
                  >
                    {/* Header Row: Code, Year, Type, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => onSelectProposition && onSelectProposition(prop)}
                          className="text-sm font-extrabold text-blue-950 px-2.5 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 rounded-md transition inline-flex items-center gap-1.5"
                          title="Clique para ver o detalhamento completo desta matéria"
                        >
                          <span>{prop.codigo}</span>
                          <span className="text-[10px] text-blue-700 bg-white px-1.5 py-0.2 rounded font-semibold border border-blue-200">
                            Ver Detalhes &rarr;
                          </span>
                        </button>
                        <span className="text-xs font-medium text-slate-500">
                          {prop.tipoDescricao} • Ano {prop.ano}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(prop.status)}`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>

                    {/* Author Information */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prop.autorFoto}
                          alt={prop.autorNome}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {prop.autorNome}
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold">
                              {prop.autorPartido}
                            </span>
                          </p>
                          <span className="text-[11px] text-slate-400">
                            Apresentado em {new Date(prop.dataApresentacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {authorDeputy && (
                        <button
                          onClick={() => onSelectDeputy(authorDeputy)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Ver Perfil do Deputado &rarr;
                        </button>
                      )}
                    </div>

                    {/* Official Ementa */}
                    <div
                      onClick={() => onSelectProposition && onSelectProposition(prop)}
                      className="bg-slate-50/80 hover:bg-blue-50/40 rounded-lg p-3.5 border border-slate-100 hover:border-blue-200 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-blue-700">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                          Ementa Oficial
                        </h4>
                        <span className="text-[10px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                          Clique para detalhamento completo &rarr;
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {prop.ementa}
                      </p>
                    </div>

                    {/* Official Classification & Tramitação */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Classificação Oficial:
                        </span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                          {prop.classificacaoOficial}
                        </span>
                        {prop.subclassificacao && (
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {prop.subclassificacao}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        <strong>Tramitação:</strong> {prop.tramitacaoAtual}
                      </div>
                    </div>

                    {/* Thematic Tags (Clickable) */}
                    {prop.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-400" />
                          Tags:
                        </span>
                        {prop.tags.map(tag => (
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

            {/* Load More Pagination */}
            {filteredPropositions.length > displayLimit && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 pb-2">
                <button
                  type="button"
                  onClick={() => setDisplayLimit(prev => prev + 30)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>Carregar Mais 30 Matérias</span>
                  <span className="bg-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                    +{Math.min(30, filteredPropositions.length - displayLimit)} restantes
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayLimit(filteredPropositions.length)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Exibir Todas as {formatNumber(filteredPropositions.length)} Matérias
                </button>
              </div>
            )}
          </>
        )}
      </div>
      )}

      {/* VIEW 2: CONSOLIDATED DEPUTY SUMMARY TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Ranking e Quantitativo de Proposições por Parlamentar
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
                  <th
                    onClick={() => {
                      if (sortColumn === 'total') setSortAsc(!sortAsc);
                      else { setSortColumn('total'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'all' && sortColumn === 'total' ? 'bg-blue-100/80 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Total Geral</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'pl') setSortAsc(!sortAsc);
                      else { setSortColumn('pl'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'PL' || sortColumn === 'pl' ? 'bg-blue-100 text-blue-900 font-extrabold' : 'text-blue-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PL</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'plc') setSortAsc(!sortAsc);
                      else { setSortColumn('plc'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'PLC' || sortColumn === 'plc' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PLC</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'pelo') setSortAsc(!sortAsc);
                      else { setSortColumn('pelo'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'PELO' || sortColumn === 'pelo' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PELO</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'pdl') setSortAsc(!sortAsc);
                      else { setSortColumn('pdl'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'PDL' || sortColumn === 'pdl' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PDL</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'pr') setSortAsc(!sortAsc);
                      else { setSortColumn('pr'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'PR' || sortColumn === 'pr' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>PR</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'ind') setSortAsc(!sortAsc);
                      else { setSortColumn('ind'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'IND' || sortColumn === 'ind' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>IND</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'req') setSortAsc(!sortAsc);
                      else { setSortColumn('req'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'REQ' || sortColumn === 'req' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>REQ</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'moc') setSortAsc(!sortAsc);
                      else { setSortColumn('moc'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      typeFilter === 'MOC' || sortColumn === 'moc' ? 'bg-blue-100 text-blue-900 font-extrabold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>MOC</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortColumn === 'aprovadas') setSortAsc(!sortAsc);
                      else { setSortColumn('aprovadas'); setSortAsc(false); }
                    }}
                    className={`p-3 text-center cursor-pointer hover:bg-slate-200 transition ${
                      statusFilter === 'Aprovada / Sancionada' || sortColumn === 'aprovadas' ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'text-emerald-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Aprovadas</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-slate-500">
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
                      <td className={`p-3 text-center font-bold ${typeFilter === 'all' && sortColumn === 'total' ? 'bg-blue-100/60 text-blue-950 font-extrabold' : 'text-slate-900 bg-slate-50/50'}`}>{formatNumber(row.total)}</td>
                      <td className={`p-3 text-center font-bold ${typeFilter === 'PL' || sortColumn === 'pl' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-blue-700 bg-blue-50/30'}`}>{row.pl}</td>
                      <td className={`p-3 text-center ${typeFilter === 'PLC' || sortColumn === 'plc' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-700'}`}>{row.plc}</td>
                      <td className={`p-3 text-center ${typeFilter === 'PELO' || sortColumn === 'pelo' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-700'}`}>{row.pelo}</td>
                      <td className={`p-3 text-center ${typeFilter === 'PDL' || sortColumn === 'pdl' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-700'}`}>{row.pdl}</td>
                      <td className={`p-3 text-center ${typeFilter === 'PR' || sortColumn === 'pr' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-700'}`}>{row.pr}</td>
                      <td className={`p-3 text-center ${typeFilter === 'IND' || sortColumn === 'ind' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-600'}`}>{row.ind}</td>
                      <td className={`p-3 text-center ${typeFilter === 'REQ' || sortColumn === 'req' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-600'}`}>{row.req}</td>
                      <td className={`p-3 text-center ${typeFilter === 'MOC' || sortColumn === 'moc' ? 'bg-blue-100 text-blue-950 font-extrabold' : 'text-slate-600'}`}>{row.moc}</td>
                      <td className={`p-3 text-center font-bold ${statusFilter === 'Aprovada / Sancionada' || sortColumn === 'aprovadas' ? 'bg-emerald-100 text-emerald-950 font-extrabold' : 'text-emerald-700 bg-emerald-50/30'}`}>{row.aprovadas}</td>
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
