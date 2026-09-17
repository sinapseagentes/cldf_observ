/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ArrowLeftRight, Check, Minus } from 'lucide-react';
import { Deputy, YearKey } from '../types';
import { getDeputyMetrics, formatCurrency, formatNumber } from '../data/cldfData';

interface DeputyCompareModalProps {
  deputies: Deputy[];
  selectedYear: YearKey;
  onClose: () => void;
}

export const DeputyCompareModal: React.FC<DeputyCompareModalProps> = ({
  deputies,
  selectedYear,
  onClose
}) => {
  if (deputies.length < 2) return null;

  const [d1, d2] = deputies;
  const m1 = getDeputyMetrics(d1, selectedYear);
  const m2 = getDeputyMetrics(d2, selectedYear);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-bold">
              Comparador Direto de Atuação Parlamentar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Profiles Header */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <img
                src={d1.foto}
                alt={d1.nomeParlamentar}
                className="w-16 h-16 rounded-full mx-auto border-2 border-emerald-500 shadow-xs mb-2"
              />
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-800">
                {d1.partido}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1">{d1.nomeParlamentar}</h3>
              <p className="text-xs text-slate-500">{d1.regiaoBase}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <img
                src={d2.foto}
                alt={d2.nomeParlamentar}
                className="w-16 h-16 rounded-full mx-auto border-2 border-blue-500 shadow-xs mb-2"
              />
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-800">
                {d2.partido}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1">{d2.nomeParlamentar}</h3>
              <p className="text-xs text-slate-500">{d2.regiaoBase}</p>
            </div>
          </div>

          {/* Metrics Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3 border border-slate-200">Métrica ({selectedYear === 'all' ? '2023-2025' : selectedYear})</th>
                  <th className="p-3 border border-slate-200 text-center">{d1.nomeParlamentar}</th>
                  <th className="p-3 border border-slate-200 text-center">{d2.nomeParlamentar}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Proposições Totais</td>
                  <td className={`p-3 text-center font-bold ${m1.proposicoes.total > m2.proposicoes.total ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {formatNumber(m1.proposicoes.total)}
                  </td>
                  <td className={`p-3 text-center font-bold ${m2.proposicoes.total > m1.proposicoes.total ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {formatNumber(m2.proposicoes.total)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Projetos de Lei Ordinária (PL)</td>
                  <td className={`p-3 text-center ${m1.proposicoes.pl > m2.proposicoes.pl ? 'text-emerald-700 font-bold' : ''}`}>
                    {m1.proposicoes.pl}
                  </td>
                  <td className={`p-3 text-center ${m2.proposicoes.pl > m1.proposicoes.pl ? 'text-emerald-700 font-bold' : ''}`}>
                    {m2.proposicoes.pl}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Leis Complementares (PLC)</td>
                  <td className={`p-3 text-center ${(m1.proposicoes.plc || 0) > (m2.proposicoes.plc || 0) ? 'text-emerald-700 font-bold' : ''}`}>
                    {m1.proposicoes.plc || 0}
                  </td>
                  <td className={`p-3 text-center ${(m2.proposicoes.plc || 0) > (m1.proposicoes.plc || 0) ? 'text-emerald-700 font-bold' : ''}`}>
                    {m2.proposicoes.plc || 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Emendas à Lei Orgânica (PELO)</td>
                  <td className={`p-3 text-center ${m1.proposicoes.pelo > m2.proposicoes.pelo ? 'text-emerald-700 font-bold' : ''}`}>
                    {m1.proposicoes.pelo}
                  </td>
                  <td className={`p-3 text-center ${m2.proposicoes.pelo > m1.proposicoes.pelo ? 'text-emerald-700 font-bold' : ''}`}>
                    {m2.proposicoes.pelo}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Decretos Legislativos (PDL)</td>
                  <td className={`p-3 text-center ${m1.proposicoes.pdl > m2.proposicoes.pdl ? 'text-emerald-700 font-bold' : ''}`}>
                    {m1.proposicoes.pdl}
                  </td>
                  <td className={`p-3 text-center ${m2.proposicoes.pdl > m1.proposicoes.pdl ? 'text-emerald-700 font-bold' : ''}`}>
                    {m2.proposicoes.pdl}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Indicações e Requerimentos (IND + REQ)</td>
                  <td className={`p-3 text-center ${m1.proposicoes.ind + m1.proposicoes.req > m2.proposicoes.ind + m2.proposicoes.req ? 'text-emerald-700 font-bold' : ''}`}>
                    {m1.proposicoes.ind + m1.proposicoes.req}
                  </td>
                  <td className={`p-3 text-center ${m2.proposicoes.ind + m2.proposicoes.req > m1.proposicoes.ind + m1.proposicoes.req ? 'text-emerald-700 font-bold' : ''}`}>
                    {m2.proposicoes.ind + m2.proposicoes.req}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Emendas Indicadas</td>
                  <td className="p-3 text-center">{formatCurrency(m1.emendas.indicado)}</td>
                  <td className="p-3 text-center">{formatCurrency(m2.emendas.indicado)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Emendas Efetivamente Pagas</td>
                  <td className={`p-3 text-center font-bold ${m1.emendas.pago > m2.emendas.pago ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {formatCurrency(m1.emendas.pago)} ({m1.emendas.taxaExecucao}%)
                  </td>
                  <td className={`p-3 text-center font-bold ${m2.emendas.pago > m1.emendas.pago ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {formatCurrency(m2.emendas.pago)} ({m2.emendas.taxaExecucao}%)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Taxa de Assiduidade em Plenário</td>
                  <td className={`p-3 text-center font-bold ${m1.presenca.plenario.taxaAssiduidade > m2.presenca.plenario.taxaAssiduidade ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {m1.presenca.plenario.taxaAssiduidade}%
                  </td>
                  <td className={`p-3 text-center font-bold ${m2.presenca.plenario.taxaAssiduidade > m1.presenca.plenario.taxaAssiduidade ? 'text-emerald-700 bg-emerald-50/50' : ''}`}>
                    {m2.presenca.plenario.taxaAssiduidade}%
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Frequência em Comissões</td>
                  <td className="p-3 text-center">{m1.presenca.comissoes[0]?.taxaAssiduidade}%</td>
                  <td className="p-3 text-center">{m2.presenca.comissoes[0]?.taxaAssiduidade}%</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Participação em Votações Nominais</td>
                  <td className="p-3 text-center">{m1.votacoes.taxaParticipacao}%</td>
                  <td className="p-3 text-center">{m2.votacoes.taxaParticipacao}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Fechar Comparação
          </button>
        </div>
      </div>
    </div>
  );
};
