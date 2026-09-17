/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Vote,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertCircle,
  Filter,
  Calendar,
  Tag,
  BookOpen,
  ListFilter,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Deputy, RollCallVote, VoteType, YearKey, ActiveTab } from '../types';
import { rollCallVotesData } from '../data/votesData';
import { propositionsList } from '../data/propositionsData';
import { amendmentsList } from '../data/amendmentsData';
import { matchesSearch } from '../utils/searchMatcher';

interface VotingMatrixViewProps {
  deputies: Deputy[];
  selectedYear?: YearKey;
  searchQuery?: string;
  onSelectDeputy: (deputy: Deputy) => void;
  onSelectVote?: (vote: RollCallVote) => void;
  onSelectTag?: (tag: string) => void;
  onSelectYear?: (year: YearKey) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const VotingMatrixView: React.FC<VotingMatrixViewProps> = ({
  deputies,
  selectedYear = 'all',
  searchQuery = '',
  onSelectDeputy,
  onSelectVote,
  onSelectTag,
  onSelectYear,
  onSelectTab
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVoteType, setFilterVoteType] = useState<string>('all');

  // Filter votes based on year, category, and smart search query
  const filteredVotes = rollCallVotesData.filter(v => {
    if (selectedYear !== 'all' && v.ano !== selectedYear) return false;
    if (filterCategory !== 'all' && v.categoria !== filterCategory) return false;

    if (searchQuery.trim()) {
      const searchableString = [
        v.codigo,
        v.titulo,
        v.ementa,
        v.categoria,
        v.classificacaoOficial || '',
        ...(v.tags || [])
      ].join(' ');

      if (!matchesSearch(searchableString, searchQuery)) return false;
    }
    return true;
  });

  // Calculate matching votes across all years
  const matchingAllYears = rollCallVotesData.filter(v => {
    if (searchQuery.trim()) {
      const searchableString = [
        v.codigo,
        v.titulo,
        v.ementa,
        v.categoria,
        v.classificacaoOficial || '',
        ...(v.tags || [])
      ].join(' ');
      return matchesSearch(searchableString, searchQuery);
    }
    return true;
  });

  // Cross-tab counts
  const matchingPropsCount = propositionsList.filter(p => {
    const searchable = [p.codigo, p.ementa, p.autorNome, p.classificacaoOficial, ...p.tags].join(' ');
    return matchesSearch(searchable, searchQuery);
  }).length;

  const matchingAmdsCount = amendmentsList.filter(a => {
    const searchable = [a.numeroEmenda, a.objeto, a.funcaoGoverno, a.autorNome, ...a.tags].join(' ');
    return matchesSearch(searchable, searchQuery);
  }).length;

  const [selectedVoteId, setSelectedVoteId] = useState<string>(
    filteredVotes.length > 0 ? filteredVotes[0].id : rollCallVotesData[0].id
  );

  // Keep selectedVoteId valid when filters change
  const activeVote =
    filteredVotes.find(v => v.id === selectedVoteId) ||
    filteredVotes[0] ||
    rollCallVotesData[0];

  const categories = Array.from(new Set(rollCallVotesData.map(v => v.categoria)));

  const getBadgeStyle = (type: VoteType) => {
    switch (type) {
      case 'SIM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'NÃO':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'ABSTENÇÃO':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'AUSENTE':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const deputyVotesList = deputies
    .map(dep => ({
      deputy: dep,
      vote: activeVote.votos[dep.id] || 'AUSENTE'
    }))
    .filter(item => {
      if (filterVoteType !== 'all' && item.vote !== filterVoteType) return false;
      return true;
    });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <Vote className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-purple-950">
                  Painel de Votações Nominais da CLDF
                </h2>
                {/* Direct Year Selector inside Votes */}
                {onSelectYear && (
                  <div className="inline-flex items-center gap-1 bg-white border border-purple-200 rounded-lg p-0.5 text-xs">
                    {(['all', '2023', '2024', '2025'] as const).map(y => (
                      <button
                        key={y}
                        onClick={() => onSelectYear(y)}
                        className={`px-2 py-0.5 rounded font-medium transition ${
                          selectedYear === y
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {y === 'all' ? 'Todos os Anos' : y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-purple-800 mt-1 max-w-2xl">
                Registro nominal do voto individual de cada um dos 24 deputados distritais nas deliberações em Plenário pelo Painel Eletrônico. Selecione a proposição para auditar a lista nominal de votos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposition Selector & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700 uppercase">Filtrar Categoria:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {filteredVotes.length} matérias encontradas
          </div>
        </div>

        {/* Horizontal Card Selector of Votes */}
        {filteredVotes.length === 0 ? (
          <div className="p-8 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50">
            <div className="text-center max-w-lg mx-auto">
              <p className="text-slate-700 text-sm font-semibold">
                Nenhuma votação nominal encontrada para os filtros atuais {selectedYear !== 'all' ? `no exercício de ${selectedYear}` : ''}.
              </p>
              {searchQuery.trim() && (
                <p className="text-xs text-slate-500 mt-1">
                  Termo pesquisado: <strong>"{searchQuery}"</strong>
                </p>
              )}
            </div>

            {/* Smart Cross-Year Recovery */}
            {selectedYear !== 'all' && matchingAllYears.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-purple-950 text-center sm:text-left">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Encontramos <strong>{matchingAllYears.length} votações nominais</strong> sobre este tema em outros anos da 9ª Legislatura (2023-2025).
                  </span>
                </div>
                {onSelectYear && (
                  <button
                    onClick={() => onSelectYear('all')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-md shadow-xs shrink-0 transition"
                  >
                    Ver Todos os Anos
                  </button>
                )}
              </div>
            )}

            {/* Cross-Tab Guidance */}
            {(matchingPropsCount > 0 || matchingAmdsCount > 0) && onSelectTab && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-blue-900 text-center sm:text-left">
                  <span>
                    Também encontramos registros com o tema <strong>"{searchQuery}"</strong> em outras seções:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1 font-semibold">
                    {matchingPropsCount > 0 && <span>• {matchingPropsCount} Proposições de Lei</span>}
                    {matchingAmdsCount > 0 && <span>• {matchingAmdsCount} Emendas Parlamentares</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {matchingPropsCount > 0 && (
                    <button
                      onClick={() => onSelectTab('propositions')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                    >
                      Ir para Proposições <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {matchingAmdsCount > 0 && (
                    <button
                      onClick={() => onSelectTab('amendments')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                    >
                      Ir para Emendas <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVotes.map(vote => (
              <button
                key={vote.id}
                onClick={() => setSelectedVoteId(vote.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  activeVote.id === vote.id
                    ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-purple-700">{vote.codigo}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {vote.data}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{vote.titulo}</h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">{vote.categoria}</span>
                  <span className="font-bold text-emerald-700">{vote.resultado}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Vote Details & Nominal Votes Breakdown */}
      {filteredVotes.length > 0 && activeVote && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/60">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800">
                  {activeVote.codigo}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {activeVote.categoria}
                </span>
                {activeVote.classificacaoOficial && (
                  <span className="text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    {activeVote.classificacaoOficial}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Data da Sessão: {activeVote.data}</span>
                {onSelectVote && (
                  <button
                    onClick={() => onSelectVote(activeVote)}
                    className="text-xs px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition inline-flex items-center gap-1 shadow-2xs"
                  >
                    <span>Ficha da Votação &rarr;</span>
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeVote.titulo}</h3>

            <div className="bg-white/80 rounded-lg p-3 border border-slate-200 mt-2.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" />
                Ementa da Matéria Deliberada
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {activeVote.ementa}
              </p>
            </div>

            {/* Quick Score */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">SIM: {activeVote.votosSim}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="font-bold text-slate-800">NÃO: {activeVote.votosNao}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-800">ABSTENÇÃO: {activeVote.abstencoes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="font-bold text-slate-800">AUSENTES: {activeVote.ausencias}</span>
              </div>
              <div className="ml-auto font-bold text-xs sm:text-sm text-emerald-800">
                Resultado: {activeVote.resultado}
              </div>
            </div>

            {/* Tags for this vote */}
            {activeVote.tags && activeVote.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  Tags da Matéria:
                </span>
                {activeVote.tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onSelectTag && onSelectTag(tag)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 border border-slate-200 transition"
                    title={`Filtrar por "${tag}"`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter by vote type */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1">Filtrar Voto:</span>
              {['all', 'SIM', 'NÃO', 'ABSTENÇÃO', 'AUSENTE'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterVoteType(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    filterVoteType === t
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'Todos' : t}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Exibindo {deputyVotesList.length} deputados filtrados
            </span>
          </div>

          {/* Nominal Votes Grid */}
          {deputyVotesList.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              Nenhum parlamentar encontrado para o filtro atual de voto ou partido.
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {deputyVotesList.map(({ deputy, vote }) => (
                <div
                  key={deputy.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2 hover:bg-slate-100/60 transition"
                >
                  <div
                    onClick={() => onSelectDeputy(deputy)}
                    className="flex items-center gap-2 min-w-0 cursor-pointer group"
                    title="Clique para ver o perfil completo"
                  >
                    <img
                      src={deputy.foto}
                      alt={deputy.nomeParlamentar}
                      className="w-8 h-8 rounded-full border border-slate-200 shrink-0 group-hover:ring-2 ring-emerald-500 transition"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
                        {deputy.nomeParlamentar}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {deputy.partido}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getBadgeStyle(vote)}`}>
                    {vote}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
