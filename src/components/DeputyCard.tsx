/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileText,
  DollarSign,
  UserCheck,
  Vote,
  MapPin,
  Eye,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Deputy, YearKey } from '../types';
import { getDeputyMetrics, formatCurrency, formatNumber } from '../data/cldfData';

interface DeputyCardProps {
  deputy: Deputy;
  selectedYear: YearKey;
  onOpenProfile: (deputy: Deputy) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (deputy: Deputy) => void;
}

export const DeputyCard: React.FC<DeputyCardProps> = ({
  deputy,
  selectedYear,
  onOpenProfile,
  isSelectedForCompare,
  onToggleCompare
}) => {
  const metrics = getDeputyMetrics(deputy, selectedYear);

  return (
    <div
      id={`deputy-card-${deputy.id}`}
      className={`bg-white rounded-xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md ${
        isSelectedForCompare
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header */}
        <div className="flex items-start gap-3">
          <img
            src={deputy.foto}
            alt={deputy.nomeParlamentar}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-inner shrink-0"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                {deputy.partido}
              </span>
              {deputy.cargoMesa && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {deputy.cargoMesa}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
              {deputy.nomeParlamentar}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{deputy.regiaoBase}</span>
            </p>
          </div>
        </div>

        {/* 4 Pillars Matrix for Selected Year */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
          {/* Proposições */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
              <FileText className="w-3 h-3 text-blue-600" />
              <span>Proposições</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {formatNumber(metrics.proposicoes.total)}
            </div>
            <div className="text-[10px] text-slate-500">
              {metrics.proposicoes.pl} Projetos de Lei
            </div>
          </div>

          {/* Emendas */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Emendas Pagas</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {formatCurrency(metrics.emendas.pago)}
            </div>
            <div className="text-[10px] text-slate-500">
              {metrics.emendas.taxaExecucao}% executado
            </div>
          </div>

          {/* Presença */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
              <UserCheck className="w-3 h-3 text-amber-600" />
              <span>Assiduidade</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {metrics.presenca.plenario.taxaAssiduidade}%
            </div>
            <div className="text-[10px] text-slate-500">
              {metrics.presenca.plenario.presencas}/{metrics.presenca.plenario.sessoesTotais} sessões
            </div>
          </div>

          {/* Votações */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
              <Vote className="w-3 h-3 text-purple-600" />
              <span>Votações</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {metrics.votacoes.taxaParticipacao}%
            </div>
            <div className="text-[10px] text-slate-500">
              {metrics.votacoes.totalVotacoes} votações
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-slate-50/70 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between gap-2">
        <button
          id={`compare-toggle-${deputy.id}`}
          onClick={() => onToggleCompare(deputy)}
          className={`text-xs font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded transition ${
            isSelectedForCompare
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
          title="Selecionar para comparar com outro parlamentar"
        >
          {isSelectedForCompare ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>Selecionado</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Comparar</span>
            </>
          )}
        </button>

        <button
          id={`profile-btn-${deputy.id}`}
          onClick={() => onOpenProfile(deputy)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ficha Detalhada</span>
        </button>
      </div>
    </div>
  );
};
