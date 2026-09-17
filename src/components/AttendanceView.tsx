/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, CheckCircle2, AlertTriangle, XCircle, ArrowUpDown, Calendar, Filter, CalendarDays, ArrowRight } from 'lucide-react';
import { Deputy, YearKey, ActiveTab } from '../types';
import { getDeputyMetrics } from '../data/cldfData';

interface AttendanceViewProps {
  deputies: Deputy[];
  selectedYear: YearKey;
  onSelectDeputy: (deputy: Deputy) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  deputies,
  selectedYear,
  onSelectDeputy,
  onSelectTab
}) => {
  const [sortColumn, setSortColumn] = useState<'assiduidade' | 'presencas' | 'comissao' | 'ordinarias' | 'extraordinarias'>('assiduidade');
  const [sortAsc, setSortAsc] = useState(false);
  const [sessionScope, setSessionScope] = useState<'all' | 'ordinarias' | 'extraordinarias' | 'solenes'>('all');

  const handleSort = (col: 'assiduidade' | 'presencas' | 'comissao' | 'ordinarias' | 'extraordinarias') => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(false);
    }
  };

  const rows = deputies.map(dep => {
    const m = getDeputyMetrics(dep, selectedYear);
    const disc = m.presenca.plenario.discriminacao;
    return {
      deputy: dep,
      name: dep.nomeParlamentar,
      partido: dep.partido,
      sessoesTotais: m.presenca.plenario.sessoesTotais,
      presencas: m.presenca.plenario.presencas,
      faltasJustificadas: m.presenca.plenario.faltasJustificadas,
      faltasNaoJustificadas: m.presenca.plenario.faltasNaoJustificadas,
      assiduidade: m.presenca.plenario.taxaAssiduidade,
      disc,
      ordinariasTaxa: disc?.ordinarias ? disc.ordinarias.taxa : m.presenca.plenario.taxaAssiduidade,
      ordinariasTxt: disc?.ordinarias ? `${disc.ordinarias.presencas}/${disc.ordinarias.total} (${disc.ordinarias.taxa}%)` : '-',
      extraordinariasTaxa: disc?.extraordinarias ? disc.extraordinarias.taxa : m.presenca.plenario.taxaAssiduidade,
      extraordinariasTxt: disc?.extraordinarias ? `${disc.extraordinarias.presencas}/${disc.extraordinarias.total} (${disc.extraordinarias.taxa}%)` : '-',
      solenesTxt: disc?.solenesEEspeciais ? `${disc.solenesEEspeciais.presencas}/${disc.solenesEEspeciais.total} (${disc.solenesEEspeciais.taxa}%)` : '-',
      preparatoriasTxt: disc?.preparatorias ? `${disc.preparatorias.presencas}/${disc.preparatorias.total}` : '-',
      comissaoNome: m.presenca.comissoes[0]?.nome || 'Comissão Permanente',
      comissaoCargo: m.presenca.comissoes[0]?.cargo || 'Membro',
      comissaoAssiduidade: m.presenca.comissoes[0]?.taxaAssiduidade || 0,
      comissaoPresencas: m.presenca.comissoes[0]?.presencas || 0,
      comissaoTotais: m.presenca.comissoes[0]?.reunioesTotais || 0
    };
  }).sort((a, b) => {
    let valA: number;
    let valB: number;
    if (sortColumn === 'ordinarias') {
      valA = a.ordinariasTaxa;
      valB = b.ordinariasTaxa;
    } else if (sortColumn === 'extraordinarias') {
      valA = a.extraordinariasTaxa;
      valB = b.extraordinariasTaxa;
    } else {
      valA = a[sortColumn];
      valB = b[sortColumn];
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const avgAssiduidade = rows.length > 0
    ? Number((rows.reduce((acc, c) => acc + c.assiduidade, 0) / rows.length).toFixed(1))
    : 0;

  const avgOrdinarias = rows.length > 0
    ? Number((rows.reduce((acc, c) => acc + c.ordinariasTaxa, 0) / rows.length).toFixed(1))
    : 0;

  const avgExtraordinarias = rows.length > 0
    ? Number((rows.reduce((acc, c) => acc + c.extraordinariasTaxa, 0) / rows.length).toFixed(1))
    : 0;

  const avgComissao = rows.length > 0
    ? Number((rows.reduce((acc, c) => acc + c.comissaoAssiduidade, 0) / rows.length).toFixed(1))
    : 0;

  const sampleDisc = rows[0]?.disc;

  return (
    <div className="space-y-6">
      {/* Methodology & Integrity Clarification Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Presença em TODAS as Sessões Plenárias da CLDF
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Denominador Auditado via Calendário Oficial
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onSelectTab && (
                  <button
                    onClick={() => onSelectTab('calendar')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition shadow-xs"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Ver Calendário Oficial de Sessões</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400 font-mono">Fonte: Atas DCL & Painel</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              <strong>Como a assiduidade foi computada?</strong> A assiduidade é computada diretamente dos registros de abertura de presença e logs biométricos do <em>Painel Eletrônico da CLDF</em> e conferida nas atas oficiais do <em>Diário da Câmara Legislativa (DCL)</em>. <strong>NÃO se trata de autodeclaração</strong>. Contempla a integralidade das reuniões plenárias regimentais:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Sessões Ordinárias
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Realizadas às terças, quartas e quintas (15h) com Grande Expediente, Comunicações e Ordem do Dia.
                </p>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Sessões Extraordinárias
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Convocadas para matérias urgentes, esforço concentrado ou deliberações de projetos de lei em horário especial.
                </p>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Solenes e Especiais
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Homenagens oficiais, datas magnas, comemorações e grandes debates públicos regimentais no Plenário.
                </p>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Sessões Preparatórias
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Instalação das Sessões Legislativas anuais, posse e eleição da Mesa Diretora e comissões.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats for All Session Types */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-950">
                Consolidado de Presenças em Todas as Sessões ({selectedYear === 'all' ? 'Legislatura 2023-2025' : selectedYear})
              </h2>
              <p className="text-xs text-amber-800 mt-1">
                Frequência global computada considerando sessões ordinárias, extraordinárias, solenes/especiais e preparatórias.
              </p>
            </div>
          </div>

          {/* Quick Filter for Discriminadas */}
          <div className="inline-flex rounded-lg border border-amber-300 bg-white p-1 text-xs shadow-xs">
            <button
              onClick={() => setSessionScope('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sessionScope === 'all' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Sessões ({rows[0]?.sessoesTotais || 0})
            </button>
            <button
              onClick={() => setSessionScope('ordinarias')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sessionScope === 'ordinarias' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ordinárias ({sampleDisc?.ordinarias.total || 0})
            </button>
            <button
              onClick={() => setSessionScope('extraordinarias')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                sessionScope === 'extraordinarias' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Extraordinárias ({sampleDisc?.extraordinarias.total || 0})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-200/60">
          <div>
            <span className="text-[11px] text-amber-800 font-medium">Assiduidade Geral (Todas as Sessões)</span>
            <p className="text-lg font-bold text-amber-950">{avgAssiduidade}%</p>
          </div>
          <div>
            <span className="text-[11px] text-amber-800 font-medium">Média em Sessões Ordinárias</span>
            <p className="text-lg font-bold text-blue-950">{avgOrdinarias}%</p>
          </div>
          <div>
            <span className="text-[11px] text-amber-800 font-medium">Média em Extraordinárias</span>
            <p className="text-lg font-bold text-purple-950">{avgExtraordinarias}%</p>
          </div>
          <div>
            <span className="text-[11px] text-amber-800 font-medium">Média em Comissões Técnicas</span>
            <p className="text-lg font-bold text-emerald-800">{avgComissao}%</p>
          </div>
        </div>
      </div>

      {/* Table of All Sessions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Quadro Completo de Frequência por Tipo de Sessão
            </h3>
            <span className="text-xs text-slate-500">
              Contempla o total de sessões do Plenário com discriminação por categoria regimental
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
            {rows.length} parlamentares
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200 select-none">
              <tr>
                <th className="p-3">Deputado(a)</th>
                <th className="p-3 text-center">Partido</th>
                <th
                  onClick={() => handleSort('assiduidade')}
                  className="p-3 text-center cursor-pointer hover:bg-slate-200 transition bg-amber-50 text-amber-900 font-black"
                  title="Taxa de assiduidade somando todas as sessões"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>% Todas as Sessões</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('presencas')}
                  className="p-3 text-center cursor-pointer hover:bg-slate-200 transition"
                  title="Presenças no Total Geral de Sessões"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Total Presenças</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ordinarias')}
                  className="p-3 text-center cursor-pointer hover:bg-slate-200 transition text-blue-800"
                  title="Presenças em Sessões Ordinárias"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Ordinárias</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('extraordinarias')}
                  className="p-3 text-center cursor-pointer hover:bg-slate-200 transition text-purple-800"
                  title="Presenças em Sessões Extraordinárias"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Extraordinárias</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 text-center text-slate-700" title="Presenças em Sessões Solenes e Especiais">
                  Solenes/Especiais
                </th>
                <th className="p-3 text-center text-blue-700" title="Licenças médicas e missões oficiais">
                  Faltas Justif.
                </th>
                <th className="p-3 text-center text-rose-700" title="Ausências não justificadas regimentalmente">
                  Faltas Injustif.
                </th>
                <th className="p-3 text-left">Comissão Principal</th>
                <th
                  onClick={() => handleSort('comissao')}
                  className="p-3 text-center cursor-pointer hover:bg-slate-200 transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>% Comissão</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-500">
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
                    <td className="p-3 text-center font-bold text-slate-900 bg-amber-50/40">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.assiduidade >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {row.assiduidade}%
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-800 font-bold bg-slate-50/30">
                      {row.presencas} / {row.sessoesTotais}
                    </td>
                    <td className="p-3 text-center text-blue-900 font-medium">
                      {row.ordinariasTxt}
                    </td>
                    <td className="p-3 text-center text-purple-900 font-medium">
                      {row.extraordinariasTxt}
                    </td>
                    <td className="p-3 text-center text-slate-700">
                      {row.solenesTxt}
                    </td>
                    <td className="p-3 text-center text-blue-700 font-semibold">{row.faltasJustificadas}</td>
                    <td className="p-3 text-center text-rose-700 font-semibold">{row.faltasNaoJustificadas}</td>
                    <td className="p-3 max-w-xs">
                      <div className="truncate text-slate-700 font-medium">{row.comissaoNome}</div>
                      <span className="text-[10px] text-slate-400">{row.comissaoCargo}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">
                      {row.comissaoAssiduidade}%
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onSelectDeputy(row.deputy)}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
