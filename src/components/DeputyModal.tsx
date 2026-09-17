/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  UserCheck,
  Vote,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Deputy, YearKey, PropositionItem, AmendmentItem, RollCallVote } from '../types';
import { getDeputyMetrics, formatCurrency, formatNumber, YEARS, isAuthorOf, normalizeDeputyId } from '../data/cldfData';
import { propositionsList } from '../data/propositionsData';
import { amendmentsList } from '../data/amendmentsData';
import { rollCallVotesData } from '../data/votesData';

interface DeputyModalProps {
  deputy: Deputy | null;
  onClose: () => void;
  onSelectProposition?: (prop: PropositionItem) => void;
  onSelectAmendment?: (amd: AmendmentItem) => void;
  onSelectVote?: (vote: RollCallVote) => void;
}

export const DeputyModal: React.FC<DeputyModalProps> = ({
  deputy,
  onClose,
  onSelectProposition,
  onSelectAmendment,
  onSelectVote
}) => {
  const [modalYear, setModalYear] = useState<YearKey>('all');
  const [activeSubTab, setActiveSubTab] = useState<'evolution' | 'propositions' | 'amendments' | 'attendance' | 'voting'>('evolution');
  const [propCategoryFilter, setPropCategoryFilter] = useState<string>('all');

  if (!deputy) return null;

  const currentMetrics = getDeputyMetrics(deputy, modalYear);
  const m23 = deputy.historico['2023'];
  const m24 = deputy.historico['2024'];
  const m25 = deputy.historico['2025'];

  // Deputy's actual individual items from the open data registries
  const deputyPropositions = propositionsList.filter(p => {
    if (!isAuthorOf(p.autorId, deputy.id)) return false;
    if (modalYear !== 'all' && p.ano !== Number(modalYear)) return false;
    if (propCategoryFilter !== 'all' && p.tipo !== propCategoryFilter) return false;
    return true;
  });

  const deputyAmendments = amendmentsList.filter(a => {
    if (!isAuthorOf(a.autorId, deputy.id)) return false;
    if (modalYear !== 'all' && a.ano !== Number(modalYear)) return false;
    return true;
  });

  const depNormalizedId = normalizeDeputyId(deputy.id);

  const deputyVotes = rollCallVotesData.filter(v => {
    if (modalYear !== 'all' && v.ano !== modalYear) return false;
    return true;
  }).map(v => {
    const rawChoice = v.votos[deputy.id] || v.votos[depNormalizedId] || 'AUSENTE';
    return {
      vote: v,
      choice: rawChoice
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={deputy.foto}
              alt={deputy.nomeParlamentar}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-500 shadow-md object-cover bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white">
                  {deputy.partido}
                </span>
                {deputy.cargoMesa && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {deputy.cargoMesa}
                  </span>
                )}
                {deputy.bloco && (
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    • {deputy.bloco}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {deputy.nomeParlamentar}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {deputy.nomeCompleto}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base Regional: {deputy.regiaoBase}</span>
                <span className="mx-1">•</span>
                <span>{formatNumber(deputy.votosEleicao)} votos em {deputy.anoEleicao}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Year Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Subtabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveSubTab('evolution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'evolution'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Evolução Ano a Ano
            </button>
            <button
              onClick={() => setActiveSubTab('propositions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'propositions'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Proposições
            </button>
            <button
              onClick={() => setActiveSubTab('amendments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'amendments'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Emendas Orçamentárias
            </button>
            <button
              onClick={() => setActiveSubTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'attendance'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Presença & Comissões
            </button>
            <button
              onClick={() => setActiveSubTab('voting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSubTab === 'voting'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Votações Nominais
            </button>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg">
            {YEARS.map(y => (
              <button
                key={y.key}
                onClick={() => setModalYear(y.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                  modalYear === y.key
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {y.key === 'all' ? 'Total' : y.key}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Subtab: Evolução Ano a Ano */}
          {activeSubTab === 'evolution' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Quadro Comparativo Anual (Legislatura 2023 - 2025)
                </h3>
                <p className="text-xs text-slate-500">
                  Acompanhe a progressão quantitativa de matérias, dotação orçamentária e frequência em plenário.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-3 border border-slate-200">Dimensão / Métrica</th>
                      <th className="p-3 border border-slate-200 text-center bg-blue-50/50">2023</th>
                      <th className="p-3 border border-slate-200 text-center bg-emerald-50/50">2024</th>
                      <th className="p-3 border border-slate-200 text-center bg-amber-50/50">2025</th>
                      <th className="p-3 border border-slate-200 text-center bg-slate-200/60 font-black">Total Acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Proposições Totais</td>
                      <td className="p-3 text-center">{formatNumber(m23.proposicoes.total)}</td>
                      <td className="p-3 text-center">{formatNumber(m24.proposicoes.total)}</td>
                      <td className="p-3 text-center">{formatNumber(m25.proposicoes.total)}</td>
                      <td className="p-3 text-center font-bold bg-slate-50">{formatNumber(m23.proposicoes.total + m24.proposicoes.total + m25.proposicoes.total)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Projetos de Lei (PLs)</td>
                      <td className="p-3 text-center">{m23.proposicoes.pl}</td>
                      <td className="p-3 text-center">{m24.proposicoes.pl}</td>
                      <td className="p-3 text-center">{m25.proposicoes.pl}</td>
                      <td className="p-3 text-center font-bold bg-slate-50">{m23.proposicoes.pl + m24.proposicoes.pl + m25.proposicoes.pl}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Emendas Indicadas</td>
                      <td className="p-3 text-center">{formatCurrency(m23.emendas.indicado)}</td>
                      <td className="p-3 text-center">{formatCurrency(m24.emendas.indicado)}</td>
                      <td className="p-3 text-center">{formatCurrency(m25.emendas.indicado)}</td>
                      <td className="p-3 text-center font-bold bg-slate-50">{formatCurrency(m23.emendas.indicado + m24.emendas.indicado + m25.emendas.indicado)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Emendas Efetivamente Pagas</td>
                      <td className="p-3 text-center text-emerald-700 font-semibold">{formatCurrency(m23.emendas.pago)} ({m23.emendas.taxaExecucao}%)</td>
                      <td className="p-3 text-center text-emerald-700 font-semibold">{formatCurrency(m24.emendas.pago)} ({m24.emendas.taxaExecucao}%)</td>
                      <td className="p-3 text-center text-emerald-700 font-semibold">{formatCurrency(m25.emendas.pago)} ({m25.emendas.taxaExecucao}%)</td>
                      <td className="p-3 text-center font-bold bg-slate-50 text-emerald-800">
                        {formatCurrency(m23.emendas.pago + m24.emendas.pago + m25.emendas.pago)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Assiduidade Plenário</td>
                      <td className="p-3 text-center">{m23.presenca.plenario.taxaAssiduidade}% ({m23.presenca.plenario.presencas}/{m23.presenca.plenario.sessoesTotais})</td>
                      <td className="p-3 text-center">{m24.presenca.plenario.taxaAssiduidade}% ({m24.presenca.plenario.presencas}/{m24.presenca.plenario.sessoesTotais})</td>
                      <td className="p-3 text-center">{m25.presenca.plenario.taxaAssiduidade}% ({m25.presenca.plenario.presencas}/{m25.presenca.plenario.sessoesTotais})</td>
                      <td className="p-3 text-center font-bold bg-slate-50">
                        {(
                          ((m23.presenca.plenario.presencas + m24.presenca.plenario.presencas + m25.presenca.plenario.presencas) /
                            (m23.presenca.plenario.sessoesTotais + m24.presenca.plenario.sessoesTotais + m25.presenca.plenario.sessoesTotais)) *
                          100
                        ).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Frequência em Comissões</td>
                      <td className="p-3 text-center">{m23.presenca.comissoes[0]?.taxaAssiduidade}%</td>
                      <td className="p-3 text-center">{m24.presenca.comissoes[0]?.taxaAssiduidade}%</td>
                      <td className="p-3 text-center">{m25.presenca.comissoes[0]?.taxaAssiduidade}%</td>
                      <td className="p-3 text-center font-bold bg-slate-50">
                        {(
                          ((m23.presenca.comissoes[0]?.presencas + m24.presenca.comissoes[0]?.presencas + m25.presenca.comissoes[0]?.presencas) /
                            (m23.presenca.comissoes[0]?.reunioesTotais + m24.presenca.comissoes[0]?.reunioesTotais + m25.presenca.comissoes[0]?.reunioesTotais)) *
                          100
                        ).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Participação em Votações</td>
                      <td className="p-3 text-center">{m23.votacoes.taxaParticipacao}%</td>
                      <td className="p-3 text-center">{m24.votacoes.taxaParticipacao}%</td>
                      <td className="p-3 text-center">{m25.votacoes.taxaParticipacao}%</td>
                      <td className="p-3 text-center font-bold bg-slate-50">
                        {(
                          (((m23.votacoes.totalVotacoes - m23.votacoes.ausencias) +
                            (m24.votacoes.totalVotacoes - m24.votacoes.ausencias) +
                            (m25.votacoes.totalVotacoes - m25.votacoes.ausencias)) /
                            (m23.votacoes.totalVotacoes + m24.votacoes.totalVotacoes + m25.votacoes.totalVotacoes)) *
                          100
                        ).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Bio */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Atuação Parlamentar & Linha Política
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {deputy.biografiaCurta}
                </p>
              </div>
            </div>
          )}

          {/* Subtab: Proposições */}
          {activeSubTab === 'propositions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Detalhamento de Proposições ({modalYear === 'all' ? 'Total Legislatura' : modalYear})
                </h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  {formatNumber(currentMetrics.proposicoes.total)} matérias
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'PL', label: 'Projetos de Lei Ordinária (PL)', val: currentMetrics.proposicoes.pl, desc: 'Leis distritais ordinárias' },
                  { key: 'PLC', label: 'Leis Complementares (PLC)', val: currentMetrics.proposicoes.plc || 0, desc: 'LUOS, PDOT, tributos e códigos' },
                  { key: 'PELO', label: 'Emendas à Lei Orgânica (PELO)', val: currentMetrics.proposicoes.pelo, desc: 'Alterações constitucionais do DF' },
                  { key: 'PDL', label: 'Decretos Legislativos (PDL)', val: currentMetrics.proposicoes.pdl, desc: 'Sustação de atos e honrarias' },
                  { key: 'PR', label: 'Resoluções da CLDF (PR)', val: currentMetrics.proposicoes.pr || 0, desc: 'Regimento Interno e frentes' },
                  { key: 'IND', label: 'Indicações (IND)', val: currentMetrics.proposicoes.ind, desc: 'Obras e zeladoria nas RAs' },
                  { key: 'REQ', label: 'Requerimentos (REQ)', val: currentMetrics.proposicoes.req, desc: 'Fiscalização e audiências' },
                  { key: 'MOC', label: 'Moções (MOC)', val: currentMetrics.proposicoes.moc || 0, desc: 'Apoio, louvor ou repúdio' },
                  { key: 'REC', label: 'Recursos (REC)', val: currentMetrics.proposicoes.rec || 0, desc: 'Recurso regimental ao Plenário' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPropCategoryFilter(propCategoryFilter === item.key ? 'all' : item.key)}
                    className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                      propCategoryFilter === item.key
                        ? 'bg-blue-50 border-blue-500 shadow-xs ring-2 ring-blue-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs text-slate-600 font-medium block truncate">{item.label}</span>
                    <p className={`text-lg font-bold mt-1 ${propCategoryFilter === item.key ? 'text-blue-900' : 'text-slate-900'}`}>{item.val}</p>
                    <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Status breakdown */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Status de Tramitação</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 font-semibold">Aprovadas / Sancionadas</span>
                    <p className="text-base font-bold text-emerald-900 mt-1">{currentMetrics.proposicoes.aprovadas}</p>
                  </div>
                  <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-blue-700 font-semibold">Em Tramitação nas Comissões</span>
                    <p className="text-base font-bold text-blue-900 mt-1">{currentMetrics.proposicoes.emTramitacao}</p>
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-600 font-semibold">Arquivadas / Prejudicadas</span>
                    <p className="text-base font-bold text-slate-900 mt-1">{currentMetrics.proposicoes.arquivadas}</p>
                  </div>
                </div>
              </div>

              {/* Real Propositions List with Clickable Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">
                      Lista de Matérias Apresentadas ({deputyPropositions.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Clique em qualquer proposição para abrir o detalhamento completo de tramitação e ementa.
                    </p>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
                    {(['all', 'PL', 'PLC', 'PELO', 'PDL', 'PR', 'IND', 'REQ', 'MOC', 'REC'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setPropCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition shrink-0 ${
                          propCategoryFilter === cat
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'Todos os Tipos' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {deputyPropositions.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-2">
                    <p className="text-xs text-slate-600 font-medium">
                      Nenhuma matéria encontrada com os filtros atuais
                      {propCategoryFilter !== 'all' ? ` (Tipo: ${propCategoryFilter})` : ''}
                      {modalYear !== 'all' ? ` no ano de ${modalYear}` : ''}.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      {propCategoryFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setPropCategoryFilter('all')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          Ver Todos os Tipos
                        </button>
                      )}
                      {modalYear !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setModalYear('all')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition"
                        >
                          Ver Toda a Legislatura (Total)
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 divide-y divide-slate-100">
                    {deputyPropositions.map(prop => (
                      <div
                        key={prop.id}
                        onClick={() => onSelectProposition && onSelectProposition(prop)}
                        className="pt-2 first:pt-0 p-2.5 rounded-lg hover:bg-blue-50/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 group-hover:border-blue-400">
                              {prop.codigo}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {prop.tipoDescricao} • {prop.ano}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                              {prop.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                            {prop.ementa}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{prop.classificacaoOficial}</span>
                            <span>•</span>
                            <span>{prop.tramitacaoAtual}</span>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1 text-slate-400 group-hover:text-blue-600 transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab: Emendas */}
          {activeSubTab === 'amendments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Execução de Emendas Orçamentárias ({modalYear === 'all' ? 'Total' : modalYear})
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  {currentMetrics.emendas.taxaExecucao}% taxa de pagamento
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Indicado na LOA</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(currentMetrics.emendas.indicado)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Empenhado pelo GDF</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(currentMetrics.emendas.empenhado)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Liquidado</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(currentMetrics.emendas.liquidado)}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-medium">Pago Efetivamente</span>
                  <p className="text-base font-bold text-emerald-900 mt-1">{formatCurrency(currentMetrics.emendas.pago)}</p>
                </div>
              </div>

              {/* Destinação por área */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Destinação por Área Temática</h4>
                <div className="space-y-2.5">
                  {currentMetrics.emendas.areas.map(area => (
                    <div key={area.area} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{area.area}</span>
                        <span>{formatCurrency(area.valor)} ({area.percentual}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${area.percentual}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized Amendments List */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    Emendas Individuais na LOA ({deputyAmendments.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Clique em qualquer emenda para conferir valores liquidados, empenhados e o órgão executor do GDF.
                  </p>
                </div>

                {deputyAmendments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Nenhuma emenda orçamentária detalhada registrada para este filtro.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
                    {deputyAmendments.map(amd => (
                      <div
                        key={amd.id}
                        onClick={() => onSelectAmendment && onSelectAmendment(amd)}
                        className="pt-2 first:pt-0 p-2.5 rounded-lg hover:bg-emerald-50/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 group-hover:border-emerald-400">
                              {amd.numeroEmenda}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              LOA {amd.ano} • {amd.funcaoGoverno}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                              {amd.statusExecucao} ({amd.taxaExecucao}%)
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed">
                            {amd.objeto}
                          </p>
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-slate-500 font-medium truncate">
                              {amd.regiaoAdministrativa} • {amd.orgaoExecutor}
                            </span>
                            <span className="font-extrabold text-emerald-900 shrink-0">
                              {formatCurrency(amd.valorPago)} pagos
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1 text-slate-400 group-hover:text-emerald-700 transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtab: Presença */}
          {activeSubTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Frequência em Plenário e Comissões
                </h3>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                  {currentMetrics.presenca.plenario.taxaAssiduidade}% assiduidade geral
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Sessões Plenárias</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{currentMetrics.presenca.plenario.sessoesTotais}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-medium">Presenças</span>
                  <p className="text-lg font-bold text-emerald-900 mt-1">{currentMetrics.presenca.plenario.presencas}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="text-xs text-blue-700 font-medium">Faltas Justificadas</span>
                  <p className="text-lg font-bold text-blue-900 mt-1">{currentMetrics.presenca.plenario.faltasJustificadas}</p>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                  <span className="text-xs text-rose-700 font-medium">Faltas Injustificadas</span>
                  <p className="text-lg font-bold text-rose-900 mt-1">{currentMetrics.presenca.plenario.faltasNaoJustificadas}</p>
                </div>
              </div>

              {/* Session Types Breakdown */}
              {currentMetrics.presenca.plenario.discriminacao && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
                    <span>Frequência Detalhada por Tipo de Sessão</span>
                    <span className="text-[10px] text-slate-500 font-normal">Todas as Reuniões Regimentais</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-600 font-semibold block text-[11px]">Sessões Ordinárias</span>
                      <p className="text-base font-bold text-blue-900 mt-1">
                        {currentMetrics.presenca.plenario.discriminacao.ordinarias.presencas} / {currentMetrics.presenca.plenario.discriminacao.ordinarias.total}
                      </p>
                      <span className="text-[10px] text-blue-700 font-bold">
                        {currentMetrics.presenca.plenario.discriminacao.ordinarias.taxa}% assiduidade
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-600 font-semibold block text-[11px]">Extraordinárias</span>
                      <p className="text-base font-bold text-purple-900 mt-1">
                        {currentMetrics.presenca.plenario.discriminacao.extraordinarias.presencas} / {currentMetrics.presenca.plenario.discriminacao.extraordinarias.total}
                      </p>
                      <span className="text-[10px] text-purple-700 font-bold">
                        {currentMetrics.presenca.plenario.discriminacao.extraordinarias.taxa}% assiduidade
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-600 font-semibold block text-[11px]">Solenes & Especiais</span>
                      <p className="text-base font-bold text-slate-900 mt-1">
                        {currentMetrics.presenca.plenario.discriminacao.solenesEEspeciais.presencas} / {currentMetrics.presenca.plenario.discriminacao.solenesEEspeciais.total}
                      </p>
                      <span className="text-[10px] text-slate-600 font-bold">
                        {currentMetrics.presenca.plenario.discriminacao.solenesEEspeciais.taxa}% assiduidade
                      </span>
                    </div>
                    {currentMetrics.presenca.plenario.discriminacao.preparatorias && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-600 font-semibold block text-[11px]">Preparatórias</span>
                        <p className="text-base font-bold text-slate-900 mt-1">
                          {currentMetrics.presenca.plenario.discriminacao.preparatorias.presencas} / {currentMetrics.presenca.plenario.discriminacao.preparatorias.total}
                        </p>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {currentMetrics.presenca.plenario.discriminacao.preparatorias.taxa}% assiduidade
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comissões Permanentes */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Atuação em Comissões Técnicas</h4>
                <div className="space-y-3">
                  {currentMetrics.presenca.comissoes.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                          {c.cargo}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-1">{c.nome}</p>
                        <p className="text-[11px] text-slate-500">
                          {c.presencas} presenças em {c.reunioesTotais} reuniões deliberativas
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-emerald-700">{c.taxaAssiduidade}%</span>
                        <p className="text-[10px] text-slate-400">frequência</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metodologia de apuração */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
                <p>
                  <strong>Metodologia da Assiduidade:</strong> Dados computados a partir dos registros oficiais do Painel Eletrônico de Presença e Votação da CLDF e das atas das sessões publicadas no Diário da Câmara Legislativa (DCL). Contempla 100% das sessões plenárias convocadas (ordinárias, extraordinárias, solenes e preparatórias), e não apenas sessões com votação. As ausências justificadas decorrem de licenças médicas homologadas pela perícia da CLDF ou missões oficiais autorizadas pela Mesa Diretora (Regimento Interno, art. 28). Não se trata de autodeclaração.
                </p>
              </div>
            </div>
          )}

              {/* Subtab: Votações */}
          {activeSubTab === 'voting' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Registro de Votações em Plenário
                </h3>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded">
                  {currentMetrics.votacoes.totalVotacoes} votações nominais
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold">Votos SIM</span>
                  <p className="text-xl font-bold text-emerald-900 mt-1">{currentMetrics.votacoes.votosSim}</p>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                  <span className="text-xs text-rose-800 font-semibold">Votos NÃO</span>
                  <p className="text-xl font-bold text-rose-900 mt-1">{currentMetrics.votacoes.votosNao}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <span className="text-xs text-amber-800 font-semibold">Abstenções</span>
                  <p className="text-xl font-bold text-amber-900 mt-1">{currentMetrics.votacoes.abstencoes}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-600 font-semibold">Ausências</span>
                  <p className="text-xl font-bold text-slate-800 mt-1">{currentMetrics.votacoes.ausencias}</p>
                </div>
              </div>

              {/* Individual Roll-Call Votes Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    Votos Nominais Registrados em Plenário ({deputyVotes.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Clique em qualquer votação para inspecionar o painel eletrônico completo e o voto dos 24 distritais.
                  </p>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-slate-100">
                  {deputyVotes.map(({ vote, choice }) => (
                    <div
                      key={vote.id}
                      onClick={() => onSelectVote && onSelectVote(vote)}
                      className="pt-2 first:pt-0 p-2.5 rounded-lg hover:bg-purple-50/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 group-hover:border-purple-400">
                            {vote.codigo}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {vote.data} • {vote.categoria}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                            choice === 'SIM'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : choice === 'NÃO'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : choice === 'ABSTENÇÃO'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            VOTO: {choice}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {vote.titulo}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {vote.ementa}
                        </p>
                      </div>

                      <div className="shrink-0 pt-1 text-slate-400 group-hover:text-purple-700 transition flex items-center gap-1">
                        <span className="text-[10px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 hidden sm:inline">
                          Painel Completo
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Institutional Contact Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Gabinete: {deputy.telefoneGab}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <a href={`mailto:${deputy.email}`} className="text-emerald-700 hover:underline">
                {deputy.email}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
