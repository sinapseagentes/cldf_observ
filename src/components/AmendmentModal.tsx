/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  DollarSign,
  Building2,
  MapPin,
  FileSpreadsheet,
  CheckCircle,
  ExternalLink,
  Tag,
  TrendingUp,
  Percent
} from 'lucide-react';
import { AmendmentItem, Deputy } from '../types';
import { formatCurrency, findDeputyByAuthorId } from '../data/cldfData';

interface AmendmentModalProps {
  amendment: AmendmentItem | null;
  deputies: Deputy[];
  onClose: () => void;
  onSelectDeputy?: (deputy: Deputy) => void;
  onSelectTag?: (tag: string) => void;
}

export const AmendmentModal: React.FC<AmendmentModalProps> = ({
  amendment,
  deputies,
  onClose,
  onSelectDeputy,
  onSelectTag
}) => {
  if (!amendment) return null;

  const authorDeputy = findDeputyByAuthorId(deputies, amendment.autorId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago Total':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Pago Parcial':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Empenhado':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Em Liquidação':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelado':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-emerald-300 px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-700/60 rounded-md">
                {amendment.numeroEmenda}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Emenda {amendment.tipo}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                LOA {amendment.ano} (Exercício Financeiro)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
              Detalhamento de Execução Orçamentária
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Status & Execution Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Status no SIGGO / Fazenda DF
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(amendment.statusExecucao)}`}>
                  {amendment.statusExecucao}
                </span>
                <span className="text-xs font-extrabold text-emerald-900">
                  {amendment.taxaExecucao}% pago
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Função de Governo
              </span>
              <p className="text-sm font-bold text-emerald-950 mt-1">
                {amendment.funcaoGoverno}
              </p>
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={amendment.autorFoto}
                alt={amendment.autorNome}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
              />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Parlamentar Autor
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  {amendment.autorNome}
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold border border-slate-200">
                    {amendment.autorPartido}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indicação na Lei Orçamentária Anual
                </p>
              </div>
            </div>

            {authorDeputy && onSelectDeputy && (
              <button
                onClick={() => {
                  onClose();
                  onSelectDeputy(authorDeputy);
                }}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition shrink-0"
              >
                Ver Ficha do Autor &rarr;
              </button>
            )}
          </div>

          {/* Objeto e Destinação */}
          <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Objeto Descritivo da Emenda (Finalidade do Gasto)
            </h3>
            <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
              {amendment.objeto}
            </p>
          </div>

          {/* Estágios Financeiros da Despesa */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Estágios da Despesa Pública (SIGGO / GDF)</span>
              <span className="text-[11px] font-normal text-slate-500">Execução Financeira</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">1. Indicado na LOA</span>
                <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(amendment.valorIndicado)}</p>
                <span className="text-[10px] text-slate-400">Dotação Aprovada</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">2. Empenhado</span>
                <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(amendment.valorEmpenhado)}</p>
                <span className="text-[10px] text-slate-400">Reserva Orçamentária</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold block">3. Liquidado</span>
                <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(amendment.valorLiquidado)}</p>
                <span className="text-[10px] text-slate-400">Serviço/Bem Atestado</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">4. Efetivamente Pago</span>
                <p className="text-base font-bold text-emerald-950 mt-1">{formatCurrency(amendment.valorPago)}</p>
                <span className="text-[10px] text-emerald-700 font-bold">{amendment.taxaExecucao}% do total</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Progresso da Execução Financeira</span>
                <span className="font-bold text-emerald-800">{amendment.taxaExecucao}% concluído</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(amendment.taxaExecucao, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Details: Órgão Executor, Região Administrativa, Subfunção */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Órgão Executor do GDF
              </span>
              <p className="font-bold text-slate-900 text-xs">
                {amendment.orgaoExecutor}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Região Administrativa
              </span>
              <p className="font-bold text-slate-900 text-xs">
                {amendment.regiaoAdministrativa}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                Subfunção Orçamentária
              </span>
              <p className="font-bold text-emerald-800 text-xs">
                {amendment.subfuncao}
              </p>
            </div>
          </div>

          {/* Tags */}
          {amendment.tags && amendment.tags.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Classificação e Palavras-Chave:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {amendment.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (onSelectTag) {
                        onClose();
                        onSelectTag(tag);
                      }
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 shadow-2xs transition"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fonte Oficial */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-3">
            <div>
              <strong>Fonte dos Dados:</strong> Sistema Integrado de Gestão Governamental (SIGGO) e Portal da Transparência do Governo do Distrito Federal (GDF).
            </div>
            <a
              href="https://transparencia.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold shrink-0 hover:underline"
            >
              <span>Transparência DF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {amendment.numeroEmenda} • LOA {amendment.ano}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
