/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Vote,
  Calendar,
  CheckCircle2,
  XCircle,
  MinusCircle,
  HelpCircle,
  ExternalLink,
  Tag,
  Filter
} from 'lucide-react';
import { RollCallVote, Deputy, VoteType } from '../types';

interface VoteModalProps {
  vote: RollCallVote | null;
  deputies: Deputy[];
  onClose: () => void;
  onSelectDeputy?: (deputy: Deputy) => void;
  onSelectTag?: (tag: string) => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  vote,
  deputies,
  onClose,
  onSelectDeputy,
  onSelectTag
}) => {
  const [filterType, setFilterType] = useState<VoteType | 'all'>('all');

  if (!vote) return null;

  const deputyVotes = deputies.map(dep => ({
    deputy: dep,
    voteValue: (vote.votos[dep.id] || 'AUSENTE') as VoteType
  }));

  const filteredDeputyVotes = deputyVotes.filter(item => {
    if (filterType === 'all') return true;
    return item.voteValue === filterType;
  });

  const getVoteBadge = (type: VoteType) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-purple-300 px-2.5 py-0.5 bg-purple-950/80 border border-purple-700/60 rounded-md">
                {vote.codigo}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {vote.categoria}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sessão em {new Date(vote.data).toLocaleDateString('pt-BR')} (Ano {vote.ano})
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
              {vote.titulo}
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
          {/* Result Banner */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider block">
                Resultado Oficial do Plenário
              </span>
              <span className={`inline-block mt-1 text-sm font-black px-3 py-1 rounded-full border ${
                vote.resultado === 'Aprovado'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {vote.resultado}
              </span>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs w-full sm:w-auto">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                <span className="text-[10px] text-emerald-700 font-bold block">SIM</span>
                <p className="text-base font-extrabold text-emerald-900">{vote.votosSim}</p>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                <span className="text-[10px] text-rose-700 font-bold block">NÃO</span>
                <p className="text-base font-extrabold text-rose-900">{vote.votosNao}</p>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                <span className="text-[10px] text-amber-700 font-bold block">ABST.</span>
                <p className="text-base font-extrabold text-amber-900">{vote.abstencoes}</p>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                <span className="text-[10px] text-slate-500 font-bold block">AUS.</span>
                <p className="text-base font-extrabold text-slate-700">{vote.ausencias}</p>
              </div>
            </div>
          </div>

          {/* Ementa da Deliberação */}
          <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ementa e Objeto da Matéria Votada
            </h3>
            <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
              {vote.ementa}
            </p>
          </div>

          {/* Votos Nominais dos 24 Deputados */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Voto Individual dos 24 Parlamentares
              </h3>

              {/* Vote Filter */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs shadow-2xs">
                {(['all', 'SIM', 'NÃO', 'ABSTENÇÃO', 'AUSENTE'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition text-[11px] ${
                      filterType === type
                        ? 'bg-slate-800 text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === 'all' ? 'Todos (24)' : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredDeputyVotes.map(({ deputy, voteValue }) => (
                <div
                  key={deputy.id}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs hover:border-purple-300 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={deputy.foto}
                      alt={deputy.nomeParlamentar}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {deputy.nomeParlamentar}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {deputy.partido}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${getVoteBadge(voteValue)}`}>
                      {voteValue}
                    </span>
                    {onSelectDeputy && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectDeputy(deputy);
                        }}
                        className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold p-1 hover:bg-purple-50 rounded"
                        title="Ver perfil completo"
                      >
                        &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {vote.tags && vote.tags.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Tags e Assuntos Relacionados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vote.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (onSelectTag) {
                        onClose();
                        onSelectTag(tag);
                      }
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 border border-slate-200 shadow-2xs transition"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fonte Oficial */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-center justify-between gap-3">
            <div>
              <strong>Fonte Oficial:</strong> Painel Eletrônico de Votação da CLDF e ata publicada no Diário da Câmara Legislativa (DCL).
            </div>
            <a
              href="https://transparencia.cl.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-purple-800 hover:text-purple-950 font-bold shrink-0 hover:underline"
            >
              <span>Portal da CLDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {vote.codigo} • 9ª Legislatura
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Fechar Votação
          </button>
        </div>
      </div>
    </div>
  );
};
