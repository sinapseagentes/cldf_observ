/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ExternalLink, ShieldCheck, FileSpreadsheet, Code, BookOpen, Layers } from 'lucide-react';
import { publicDataSources } from '../data/sourcesData';
import { PublicDataSource } from '../types';

export const SourcesGuideView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(publicDataSources.map(s => s.categoria)));

  const filteredSources = publicDataSources.filter(s => {
    if (selectedCategory !== 'all' && s.categoria !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Guide */}
      <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Guia Oficial de Fontes Públicas & Dados Abertos
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lei nº 12.527/2011 (LAI)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Consulte aqui os repositórios oficiais e as ferramentas governamentais para auditar, baixar em formatos estruturados (CSV, JSON, APIs) e cruzar os dados dos 24 deputados distritais da CLDF ano a ano.
            </p>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filtrar por Órgão:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas as Fontes ({publicDataSources.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map(source => (
          <div
            key={source.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {source.categoria}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {source.nome}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {source.orgao}
                  </p>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition border border-slate-200"
                  title="Abrir portal oficial"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {source.descricao}
              </p>

              {/* Consultation Details */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Como consultar:</span>
                </div>
                <p className="text-slate-600 leading-normal text-[11px]">
                  {source.comoConsultar}
                </p>
              </div>
            </div>

            {/* Formats & Periodicidade */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Formatos:</span>
                {source.formatos.map(fmt => (
                  <span
                    key={fmt}
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                Atualização: {source.periodicidade}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Structured API & Citizen Audit Step Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-600" />
          <span>Passo a Passo para Obtenção de Dados Estruturados em Massa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block mb-1">1. Proposições & Votações</span>
            <p className="leading-relaxed">
              Acesse o <strong>Portal de Dados Abertos da CLDF</strong> ou use o endpoint REST da Secretaria Legislativa para baixar os arquivos CSV de proposições divididos por ano de tramitação.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block mb-1">2. Execução de Emendas</span>
            <p className="leading-relaxed">
              Consulte o <strong>SIGGO no Portal da Transparência do DF</strong> para exportar a planilha de empenhos e liquidações por código de autor parlamentar e número da emenda.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 text-sm block mb-1">3. Presença & Atas</span>
            <p className="leading-relaxed">
              Caso precise da série unificada de presença em comissões técnicas (que não está em CSV direto), protocole pedido via <strong>e-SIC da Ouvidoria da CLDF</strong> com amparo na LAI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
