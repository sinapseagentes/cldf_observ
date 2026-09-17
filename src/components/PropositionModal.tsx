/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Share2,
  Building
} from 'lucide-react';
import { PropositionItem, Deputy } from '../types';
import { findDeputyByAuthorId } from '../data/cldfData';

interface PropositionModalProps {
  proposition: PropositionItem | null;
  deputies: Deputy[];
  onClose: () => void;
  onSelectDeputy?: (deputy: Deputy) => void;
  onSelectTag?: (tag: string) => void;
}

export const PropositionModal: React.FC<PropositionModalProps> = ({
  proposition,
  deputies,
  onClose,
  onSelectDeputy,
  onSelectTag
}) => {
  if (!proposition) return null;

  const authorDeputy = findDeputyByAuthorId(deputies, proposition.autorId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada / Sancionada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Em Tramitação':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pronta para Pauta':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Arquivada':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Vetada':
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
              <span className="text-sm font-extrabold text-blue-300 px-2.5 py-0.5 bg-blue-950/80 border border-blue-700/60 rounded-md">
                {proposition.codigo}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {proposition.tipoDescricao}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ano {proposition.ano}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
              Detalhamento da Matéria Legislativa
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
          {/* Status and Tramitação banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Situação Regimental Atual
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(proposition.status)}`}>
                  {proposition.status}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Fase de Tramitação
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                {proposition.tramitacaoAtual}
              </p>
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={proposition.autorFoto}
                alt={proposition.autorNome}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
              />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Autoria Parlamentar
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  {proposition.autorNome}
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold border border-slate-200">
                    {proposition.autorPartido}
                  </span>
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Protocolada em {new Date(proposition.dataApresentacao).toLocaleDateString('pt-BR')}</span>
                </p>
              </div>
            </div>

            {authorDeputy && onSelectDeputy && (
              <button
                onClick={() => {
                  onClose();
                  onSelectDeputy(authorDeputy);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition shrink-0"
              >
                Ver Ficha do Autor &rarr;
              </button>
            )}
          </div>

          {/* Ementa Oficial */}
          <div className="bg-slate-50/90 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Ementa Oficial (Texto do Protocolo)
            </h3>
            <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
              {proposition.ementa}
            </p>
          </div>

          {/* Classificações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                Classificação Oficial da Matéria
              </span>
              <p className="text-sm font-bold text-emerald-800 mt-1">
                {proposition.classificacaoOficial}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                Subclassificação / Tema Específico
              </span>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {proposition.subclassificacao || 'Legislação Geral / Não discriminada'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {proposition.tags && proposition.tags.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Indexação Temática & Palavras-Chave:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {proposition.tags.map(tag => (
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

          {/* Link para DCL / Transparência */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
            <div>
              <strong>Fonte Oficial:</strong> Matéria registrada no Sistema de Tramitação de Proposições (SPL) e publicada no Diário da Câmara Legislativa (DCL).
            </div>
            <a
              href="https://transparencia.cl.df.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold shrink-0 hover:underline"
            >
              <span>Portal da CLDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {proposition.codigo} • 9ª Legislatura
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
