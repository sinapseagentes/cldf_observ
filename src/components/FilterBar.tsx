/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  CalendarCheck,
  CalendarDays,
  Vote,
  Database,
  Search,
  X,
  ArrowLeftRight,
  Tag,
  Sparkles
} from 'lucide-react';
import { ActiveTab, SearchTag } from '../types';
import { PARTIES } from '../data/cldfData';
import { getAutocompleteSuggestions, OFFICIAL_SEARCH_TAGS } from '../data/searchTagsData';

interface FilterBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedParty: string;
  onSelectParty: (p: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onClearCompare: () => void;
  onSelectTag?: (tag: string) => void;
  tabCounts?: Partial<Record<ActiveTab, number>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  selectedParty,
  onSelectParty,
  compareCount,
  onOpenCompare,
  onClearCompare,
  onSelectTag,
  tabCounts
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasFilterActive = Boolean(searchQuery.trim() || selectedParty !== 'all');

  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Visão Geral', icon: LayoutDashboard },
    {
      id: 'deputies' as ActiveTab,
      label: hasFilterActive && tabCounts?.deputies !== undefined ? `Deputados (${tabCounts.deputies})` : 'Deputados (24)',
      icon: Users
    },
    {
      id: 'propositions' as ActiveTab,
      label: hasFilterActive && tabCounts?.propositions !== undefined ? `Proposições (${tabCounts.propositions})` : 'Proposições',
      icon: FileText
    },
    {
      id: 'amendments' as ActiveTab,
      label: hasFilterActive && tabCounts?.amendments !== undefined ? `Emendas (${tabCounts.amendments})` : 'Emendas',
      icon: DollarSign
    },
    { id: 'attendance' as ActiveTab, label: 'Presença & Assiduidade', icon: CalendarCheck },
    { id: 'calendar' as ActiveTab, label: 'Calendário de Sessões', icon: CalendarDays },
    {
      id: 'voting' as ActiveTab,
      label: hasFilterActive && tabCounts?.voting !== undefined ? `Votações (${tabCounts.voting})` : 'Painel de Votações',
      icon: Vote
    },
    { id: 'sources' as ActiveTab, label: 'Fontes Oficiais', icon: Database }
  ];

  const suggestions = getAutocompleteSuggestions(searchQuery, 8);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyTag = (tagLabel: string) => {
    onSearchChange(tagLabel);
    if (onSelectTag) onSelectTag(tagLabel);
    setIsDropdownOpen(false);
  };

  // Popular quick tags to show on empty or quick click
  const quickTags = [
    { label: 'Saúde', searchVal: 'Saúde', badge: 'LOA 10' },
    { label: 'Educação', searchVal: 'Educação', badge: 'LOA 12' },
    { label: 'Urbanismo', searchVal: 'Urbanismo', badge: 'LOA 15' },
    { label: 'Segurança', searchVal: 'Segurança', badge: 'LOA 06' },
    { label: 'Defesa da Mulher', searchVal: 'Defesa da Mulher' },
    { label: 'Não Se Cale DF', searchVal: 'Não Se Cale DF' },
    { label: 'Passe Livre', searchVal: 'Passe Livre' },
    { label: 'Ceilândia', searchVal: 'Ceilândia' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[73px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 pt-2 border-b border-slate-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Party Filters */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
            {/* Search Input with Autocomplete Dropdown */}
            <div ref={containerRef} className="relative min-w-[260px] sm:min-w-[320px] max-w-md flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                placeholder="Buscar por tag oficial, ementa, emenda, deputado..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={e => {
                  onSearchChange(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder-slate-400 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchQuery.trim().length > 0 ? (
                    suggestions.length > 0 ? (
                      <div>
                        <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          Sugestões de Classificação Oficial & Tags
                        </div>
                        <ul className="py-1">
                          {suggestions.map(tag => (
                            <li key={tag.id}>
                              <button
                                type="button"
                                onClick={() => handleApplyTag(tag.label)}
                                className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between group transition text-xs"
                              >
                                <span className="font-semibold text-slate-800 group-hover:text-emerald-900">
                                  {tag.label}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                                  {tag.categoryLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Nenhuma tag oficial correspondente a "{searchQuery}". Pressione Enter para buscar o termo livre.
                      </div>
                    )
                  ) : (
                    <div>
                      <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Autopreenchimento por Classificação Oficial
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {OFFICIAL_SEARCH_TAGS.slice(0, 8).map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleApplyTag(tag.label)}
                            className="text-left p-2 rounded-lg border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/70 transition"
                          >
                            <p className="text-xs font-bold text-slate-800">{tag.label}</p>
                            <span className="text-[10px] text-slate-500">{tag.categoryLabel}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Party Selector */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
              <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Partido:</span>
              <button
                id="party-filter-all"
                onClick={() => onSelectParty('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  selectedParty === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              {PARTIES.map(p => (
                <button
                  key={p}
                  id={`party-filter-${p}`}
                  onClick={() => onSelectParty(p)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    selectedParty === p
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Bar if selected */}
          {compareCount > 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <span className="text-xs font-medium text-emerald-800">
                {compareCount} de 2 selecionados
              </span>
              {compareCount === 2 && (
                <button
                  id="open-compare-btn"
                  onClick={onOpenCompare}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition shadow-xs"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Comparar
                </button>
              )}
              <button
                onClick={onClearCompare}
                className="text-emerald-700 hover:text-emerald-900 text-xs underline ml-1"
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* Quick Tag Pills Strip */}
        <div className="pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            Tags Oficiais:
          </span>
          {quickTags.map(qt => {
            const isSelected = searchQuery.toLowerCase().includes(qt.searchVal.toLowerCase());
            return (
              <button
                key={qt.label}
                onClick={() => handleApplyTag(isSelected ? '' : qt.searchVal)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition shrink-0 border inline-flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{qt.label}</span>
                {qt.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono font-semibold ${
                      isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {qt.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

