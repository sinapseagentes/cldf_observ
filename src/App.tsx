/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, Deputy, YearKey, PropositionItem, AmendmentItem, RollCallVote } from './types';
import { deputiesData } from './data/cldfData';
import { propositionsList } from './data/propositionsData';
import { amendmentsList } from './data/amendmentsData';
import { rollCallVotesData } from './data/votesData';
import { matchesSearch } from './utils/searchMatcher';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MetricsOverview } from './components/MetricsOverview';
import { DeputyCard } from './components/DeputyCard';
import { DeputyModal } from './components/DeputyModal';
import { DeputyCompareModal } from './components/DeputyCompareModal';
import { PropositionModal } from './components/PropositionModal';
import { AmendmentModal } from './components/AmendmentModal';
import { VoteModal } from './components/VoteModal';
import { PropositionsView } from './components/PropositionsView';
import { AmendmentsView } from './components/AmendmentsView';
import { AttendanceView } from './components/AttendanceView';
import { CalendarView } from './components/CalendarView';
import { VotingMatrixView } from './components/VotingMatrixView';
import { SourcesGuideView } from './components/SourcesGuideView';
import { UniversalExportBar } from './components/UniversalExportBar';
import { Landmark, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [selectedYear, setSelectedYear] = useState<YearKey>('all');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedDeputy, setSelectedDeputy] = useState<Deputy | null>(null);
  const [selectedProposition, setSelectedProposition] = useState<PropositionItem | null>(null);
  const [selectedAmendment, setSelectedAmendment] = useState<AmendmentItem | null>(null);
  const [selectedVote, setSelectedVote] = useState<RollCallVote | null>(null);
  const [compareList, setCompareList] = useState<Deputy[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Robust accent-insensitive normalization
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  // Filter deputies based on search, party, authored propositions, amendments, and commissions
  const filteredDeputies = deputiesData.filter(dep => {
    if (selectedParty !== 'all' && dep.partido.toLowerCase() !== selectedParty.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const depIdNorm = dep.id.toLowerCase();
      const depNameNorm = normalize(dep.nomeParlamentar);

      // Collect related authored propositions tags, titles, and ementas
      const deputyProps = propositionsList.filter(p =>
        p.autorId.toLowerCase() === depIdNorm ||
        p.autorId.toLowerCase() === `dep-${depIdNorm}` ||
        normalize(p.autorNome).includes(depNameNorm)
      );
      const propText = deputyProps.map(p => `${p.codigo} ${p.ementa} ${p.classificacaoOficial} ${p.tags.join(' ')}`).join(' ');

      // Collect related authored amendments tags, objects, and functions
      const deputyAmds = amendmentsList.filter(a =>
        a.autorId.toLowerCase() === depIdNorm ||
        a.autorId.toLowerCase() === `dep-${depIdNorm}` ||
        normalize(a.autorNome).includes(depNameNorm)
      );
      const amdText = deputyAmds.map(a => `${a.numeroEmenda} ${a.objeto} ${a.funcaoGoverno} ${a.subfuncao} ${a.orgaoExecutor} ${a.tags.join(' ')}`).join(' ');

      // Collect commission names across years
      const commText = Object.values(dep.historico)
        .flatMap(h => h.presenca.comissoes.map(c => `${c.nome} ${c.cargo}`))
        .join(' ');

      // Collect highlight amendments from history
      const highlightsText = Object.values(dep.historico)
        .flatMap(h => h.emendas.destaques)
        .join(' ');

      const searchableString = [
        dep.nomeParlamentar,
        dep.nomeCompleto,
        dep.partido,
        dep.regiaoBase,
        dep.cargoMesa || '',
        dep.bloco || '',
        dep.biografiaCurta,
        commText,
        highlightsText,
        propText,
        amdText
      ].join(' ');

      return matchesSearch(searchableString, searchQuery);
    }
    return true;
  });

  // Calculate live counts of matching propositions, amendments and votes
  const matchingPropositions = propositionsList.filter(p => {
    if (selectedYear !== 'all' && p.ano !== Number(selectedYear)) return false;
    if (selectedParty !== 'all' && p.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchable = [p.codigo, p.tipo, p.tipoDescricao, p.ementa, p.autorNome, p.autorPartido, p.classificacaoOficial, p.subclassificacao || '', p.tramitacaoAtual, ...p.tags].join(' ');
      return matchesSearch(searchable, searchQuery);
    }
    return true;
  });

  const matchingAmendments = amendmentsList.filter(a => {
    if (selectedYear !== 'all' && a.ano !== Number(selectedYear)) return false;
    if (selectedParty !== 'all' && a.autorPartido.toLowerCase() !== selectedParty.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const searchable = [a.numeroEmenda, a.objeto, a.funcaoGoverno, a.subfuncao, a.orgaoExecutor, a.regiaoAdministrativa, a.autorNome, a.autorPartido, a.classificacaoOficial, ...a.tags].join(' ');
      return matchesSearch(searchable, searchQuery);
    }
    return true;
  });

  const matchingVotes = rollCallVotesData.filter(v => {
    if (selectedYear !== 'all' && v.ano !== selectedYear) return false;
    if (searchQuery.trim()) {
      const searchable = [v.codigo, v.titulo, v.ementa, v.categoria, v.classificacaoOficial || '', ...(v.tags || [])].join(' ');
      return matchesSearch(searchable, searchQuery);
    }
    return true;
  });

  const tabCounts = {
    deputies: filteredDeputies.length,
    propositions: matchingPropositions.length,
    amendments: matchingAmendments.length,
    voting: matchingVotes.length
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedParty('all');
  };

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleToggleCompare = (deputy: Deputy) => {
    if (compareList.some(d => d.id === deputy.id)) {
      setCompareList(compareList.filter(d => d.id !== deputy.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], deputy]);
      } else {
        setCompareList([...compareList, deputy]);
      }
    }
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onOpenSources={() => setActiveTab('sources')}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        selectedParty={selectedParty}
      />

      {/* Navigation & Filter Bar */}
      <FilterBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedParty={selectedParty}
        onSelectParty={setSelectedParty}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onClearCompare={handleClearCompare}
        onSelectTag={handleSelectTag}
        tabCounts={tabCounts}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Universal Export Action Bar for every view */}
        <UniversalExportBar
          activeTab={activeTab}
          selectedYear={selectedYear}
          searchQuery={searchQuery}
          selectedParty={selectedParty}
          deputies={filteredDeputies}
          propositions={matchingPropositions}
          amendments={matchingAmendments}
          votes={matchingVotes}
        />

        {/* Active Tab Views */}
        {activeTab === 'overview' && (
          <MetricsOverview
            selectedYear={selectedYear}
            deputies={filteredDeputies}
            searchQuery={searchQuery}
            selectedParty={selectedParty}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onClearFilters={handleClearFilters}
            onSelectTag={handleSelectTag}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'deputies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Deputados Distritais da 9ª Legislatura
                </h2>
                <p className="text-xs text-slate-500">
                  Exibindo {filteredDeputies.length} de {deputiesData.length} parlamentares • Ano selecionado:{' '}
                  {selectedYear === 'all' ? 'Toda a legislatura' : selectedYear}
                </p>
              </div>

              {compareList.length > 0 && (
                <button
                  onClick={() => setIsCompareOpen(true)}
                  disabled={compareList.length < 2}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    compareList.length === 2
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Comparar 2 Selecionados
                </button>
              )}
            </div>

            {filteredDeputies.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-xs">
                <p className="text-slate-600 text-sm font-semibold">
                  Nenhum parlamentar com autoria direta encontrado para "{searchQuery}".
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Você pode conferir as abas <strong>Proposições</strong>, <strong>Emendas</strong> ou <strong>Painel de Votações</strong> para ver a lista de matérias com essa classificação oficial.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('propositions')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    Ver Proposições ({searchQuery})
                  </button>
                  <button
                    onClick={() => setActiveTab('amendments')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition"
                  >
                    Ver Emendas ({searchQuery})
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDeputies.map(deputy => (
                  <DeputyCard
                    key={deputy.id}
                    deputy={deputy}
                    selectedYear={selectedYear}
                    onOpenProfile={dep => setSelectedDeputy(dep)}
                    isSelectedForCompare={compareList.some(d => d.id === deputy.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'propositions' && (
          <PropositionsView
            deputies={filteredDeputies}
            selectedYear={selectedYear}
            searchQuery={searchQuery}
            selectedParty={selectedParty}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onSelectProposition={prop => setSelectedProposition(prop)}
            onSelectTag={handleSelectTag}
            onSelectYear={setSelectedYear}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'amendments' && (
          <AmendmentsView
            deputies={filteredDeputies}
            selectedYear={selectedYear}
            searchQuery={searchQuery}
            selectedParty={selectedParty}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onSelectAmendment={amd => setSelectedAmendment(amd)}
            onSelectTag={handleSelectTag}
            onSelectYear={setSelectedYear}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            deputies={filteredDeputies}
            selectedYear={selectedYear}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            selectedYear={selectedYear}
            deputies={filteredDeputies}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'voting' && (
          <VotingMatrixView
            deputies={filteredDeputies}
            selectedYear={selectedYear}
            searchQuery={searchQuery}
            onSelectDeputy={dep => setSelectedDeputy(dep)}
            onSelectVote={vote => setSelectedVote(vote)}
            onSelectTag={handleSelectTag}
            onSelectYear={setSelectedYear}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'sources' && <SourcesGuideView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-200">
              Observatório Parlamentar da CLDF • Dados Abertos
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <a
              href="https://transparencia.cl.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Portal da Transparência CLDF</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://dadosabertos.cl.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Dados Abertos CLDF</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://transparencia.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Transparência DF (SIGGO)</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://tc.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>TCDF</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <p className="text-slate-500 text-[11px] text-center md:text-right">
            Conformidade com a Lei de Acesso à Informação (Lei Federal nº 12.527/2011)
          </p>
        </div>
      </footer>

      {/* Deputy Detail Modal */}
      {selectedDeputy && (
        <DeputyModal
          deputy={selectedDeputy}
          onClose={() => setSelectedDeputy(null)}
          onSelectProposition={prop => setSelectedProposition(prop)}
          onSelectAmendment={amd => setSelectedAmendment(amd)}
          onSelectVote={vote => setSelectedVote(vote)}
        />
      )}

      {/* Proposition Detail Modal */}
      {selectedProposition && (
        <PropositionModal
          proposition={selectedProposition}
          deputies={deputiesData}
          onClose={() => setSelectedProposition(null)}
          onSelectDeputy={dep => {
            setSelectedDeputy(dep);
            setSelectedProposition(null);
          }}
          onSelectTag={handleSelectTag}
        />
      )}

      {/* Amendment Detail Modal */}
      {selectedAmendment && (
        <AmendmentModal
          amendment={selectedAmendment}
          deputies={deputiesData}
          onClose={() => setSelectedAmendment(null)}
          onSelectDeputy={dep => {
            setSelectedDeputy(dep);
            setSelectedAmendment(null);
          }}
          onSelectTag={handleSelectTag}
        />
      )}

      {/* Roll-Call Vote Detail Modal */}
      {selectedVote && (
        <VoteModal
          vote={selectedVote}
          deputies={deputiesData}
          onClose={() => setSelectedVote(null)}
          onSelectDeputy={dep => {
            setSelectedDeputy(dep);
            setSelectedVote(null);
          }}
          onSelectTag={handleSelectTag}
        />
      )}

      {/* Deputy Compare Modal */}
      {isCompareOpen && (
        <DeputyCompareModal
          deputies={compareList}
          selectedYear={selectedYear}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
}
