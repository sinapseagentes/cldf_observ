/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
  CalendarDays,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { YearKey, Deputy, ActiveTab } from '../types';
import {
  CLDF_ANNUAL_CALENDARS,
  WEEKLY_SCHEDULE_RULES,
  COMMISSIONS_SCHEDULE,
  CommissionSchedule
} from '../data/cldfCalendarData';
import { formatNumber } from '../data/cldfData';

interface CalendarViewProps {
  selectedYear: YearKey;
  deputies: Deputy[];
  onSelectDeputy?: (deputy: Deputy) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedYear,
  deputies,
  onSelectDeputy,
  onSelectTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grade' | 'comissoes' | 'regras_denominador'>('grade');
  const [selectedCommission, setSelectedCommission] = useState<CommissionSchedule | null>(null);

  const calKey = selectedYear === 'all' ? '2024' : selectedYear;
  const currentCalendar = CLDF_ANNUAL_CALENDARS[calKey] || CLDF_ANNUAL_CALENDARS['2024'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Calendário Oficial de Funcionamento da CLDF
                </h2>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Regimento Interno & Lei Orgânica
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                Grade regimental de funcionamento do <strong>Plenário Lúcio Costa</strong> e das{' '}
                <strong>Comissões Permanentes</strong>. Entenda como são convocadas as sessões e como o
                denominador anual de assiduidade parlamentar é oficialmente estruturado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab && onSelectTab('attendance')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              <span>Ver Assiduidade dos Deputados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('grade')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'grade'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Grade Semanal (Plenário & Atividades)
          </button>
          <button
            onClick={() => setActiveSubTab('comissoes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'comissoes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Quadro das Comissões Permanentes ({COMMISSIONS_SCHEDULE.length})
          </button>
          <button
            onClick={() => setActiveSubTab('regras_denominador')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'regras_denominador'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            Cálculo do Denominador de Sessões
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: GRADE SEMANAL */}
      {activeSubTab === 'grade' && (
        <div className="space-y-6">
          {/* Key Facts Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Horário do Plenário</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2">Ter, Qua e Qui</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Às 15h00 (Duração regimental: 4h)</p>
              <div className="mt-2 text-[11px] text-slate-600 bg-amber-50 p-2 rounded-md border border-amber-100">
                Pequeno Expediente, Grande Expediente e Ordem do Dia para votações.
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Comissões Técnicas</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2">Manhãs (9h às 12h)</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Segundas, Terças e Quintas</p>
              <div className="mt-2 text-[11px] text-slate-600 bg-blue-50 p-2 rounded-md border border-blue-100">
                CCJ, CEOF, CAS, CESC e demais comissões se reúnem antes do Plenário.
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Sessões Solenes</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2">Segundas & Sextas</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Manhãs ou Noites (19h)</p>
              <div className="mt-2 text-[11px] text-slate-600 bg-purple-50 p-2 rounded-md border border-purple-100">
                Homenagens oficiais, títulos honorários e datas comemorativas regimentais.
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Período Ativo Anual</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2">Fev a Jun • Ago a Dez</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Recessos: Julho e Janeiro</p>
              <div className="mt-2 text-[11px] text-slate-600 bg-emerald-50 p-2 rounded-md border border-emerald-100">
                Aprovação da LDO tranca recesso de julho; LOA tranca o recesso de dezembro.
              </div>
            </div>
          </div>

          {/* Weekly Schedule Days Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Grade Regimental Semanal da Câmara Legislativa (LODF & Regimento)
                </h3>
                <p className="text-xs text-slate-500">
                  Distribuição típica dos dias de trabalho deliberativo no Plenário e nas comissões técnicas
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                9ª Legislatura Oficial
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {WEEKLY_SCHEDULE_RULES.map((rule, idx) => (
                <div key={idx} className="p-4 sm:p-5 hover:bg-slate-50/70 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {rule.dayOfWeek.slice(0, 3)}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{rule.dayOfWeek}</h4>
                        <span className="text-xs text-slate-500 font-medium">
                          {rule.instancia} • {rule.turno}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`self-start sm:self-auto px-2.5 py-1 rounded text-[11px] font-bold ${
                        rule.instancia.includes('Plenário')
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : rule.instancia.includes('Comissões')
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-purple-100 text-purple-900 border border-purple-200'
                      }`}
                    >
                      {rule.instancia}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">{rule.descricao}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">Principais Atividades:</span>
                    {rule.reunioesPrincipais.map((rp, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{rp}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: QUADRO DE COMISSÕES */}
      {activeSubTab === 'comissoes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Comissões Permanentes da 9ª Legislatura da CLDF
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  As comissões apreciam a admissibilidade jurídica, impacto orçamentário e mérito temático de todas as matérias.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
                {COMMISSIONS_SCHEDULE.length} Comissões Oficiais
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {COMMISSIONS_SCHEDULE.map(comm => (
                <div
                  key={comm.sigla}
                  onClick={() => setSelectedCommission(comm)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-xs">
                        {comm.sigla}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {comm.totalMembros} membros
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 group-hover:text-blue-700 transition">
                      {comm.nome}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {comm.descricaoRegimental}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Reuniões:
                      </span>
                      <span className="font-semibold text-slate-800">{comm.diaSemana}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> Local:
                      </span>
                      <span className="font-semibold text-slate-800">{comm.local}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Users className="w-3.5 h-3.5" /> Presidência:
                      </span>
                      <span className="font-semibold text-blue-900">{comm.presidenteAtual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: REGRAS E DENOMINADOR OFICIAL */}
      {activeSubTab === 'regras_denominador' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-amber-950">
                  Reavaliação Regimental do Denominador de Sessões
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
                  <strong>Por que o número de sessões anterior parecia abaixo da realidade?</strong> Anteriormente, 
                  muitos painéis contabilizavam apenas as sessões ordinárias com votação nominal formal de projetos de lei, 
                  ignorando sessões de comunicações, esforços concentrados e sessões extraordinárias e solenes.
                </p>
                <p className="text-xs sm:text-sm text-amber-900 mt-2 leading-relaxed">
                  O <strong>Observatório Parlamentar CLDF</strong> reavaliou e auditou o denominador regimental para computar{' '}
                  <strong>todas as convocações oficiais do Plenário Lúcio Costa</strong> (3 sessões ordinárias por semana ao longo de 40 semanas ativas por ano, mais as extraordinárias de pacotes governamentais e solenes).
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Statistics Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">
              Demonstrativo do Denominador Oficial por Exercício da 9ª Legislatura
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['2023', '2024', '2025'].map(ano => {
                const c = CLDF_ANNUAL_CALENDARS[ano];
                return (
                  <div key={ano} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900 text-base">Exercício {ano}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {c.totalSessoesPlenariasEsperadas} Sessões Plenárias
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Sessões Ordinárias (Ter/Qua/Qui):</span>
                        <strong className="text-slate-900">{c.sessoesOrdinariasPrevistas}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Sessões Extraordinárias convocadas:</span>
                        <strong className="text-slate-900">{c.sessoesExtraordinariasTipicas}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Sessões Solenes & Especiais:</span>
                        <strong className="text-slate-900">{c.sessoesSolenesEspeciais}</strong>
                      </div>
                      {c.sessoesPreparatorias > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Sessões Preparatórias (Posse):</span>
                          <strong className="text-slate-900">{c.sessoesPreparatorias}</strong>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-800 font-semibold">
                        <span>Reuniões de Comissões (por membro):</span>
                        <strong className="text-blue-700">~{c.comissoesReunioesEsperadasPorDeputado}</strong>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                      <p><strong>1º Período:</strong> {c.periodo1.inicio} a {c.periodo1.fim}</p>
                      <p><strong>2º Período:</strong> {c.periodo2.inicio} a {c.periodo2.fim}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-4 bg-slate-900 text-slate-200 rounded-lg text-xs leading-relaxed">
              <strong className="text-emerald-400">Total Consolidado da Legislatura (2023-2025): </strong>
              Ao selecionar <em>"Toda a Legislatura"</em> no cabeçalho, o denominador de assiduidade do painel soma{' '}
              <strong>538 sessões plenárias convocadas</strong> (342 ordinárias + 116 extraordinárias + 78 solenes e preparatórias), 
              refletindo com rigor a presença real do parlamentar em plenário.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
