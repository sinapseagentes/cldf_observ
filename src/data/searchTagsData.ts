/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchTag } from '../types';
import { propositionsList } from './propositionsData';
import { amendmentsList } from './amendmentsData';

export const OFFICIAL_SEARCH_TAGS: SearchTag[] = [
  // 1. Classificação Oficial de Proposições (CLDF)
  { id: 'cp-saude', label: 'Saúde Pública', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-educacao', label: 'Educação Básica e Pedagógica', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-mulher', label: 'Defesa da Mulher e Direitos Humanos', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-transporte', label: 'Transporte e Mobilidade Urbana', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-seguranca', label: 'Segurança Pública e Justiça', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-urbanismo', label: 'Urbanismo e Regularização Fundiária', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-trabalho', label: 'Trabalho e Serviços Terceirizados', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-meioambiente', label: 'Meio Ambiente e Proteção ao Cerrado', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-infancia', label: 'Primeira Infância e Juventude', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-cultura', label: 'Cultura, Juventude e Periferia', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-orcamento', label: 'Orçamento e Finanças Públicas', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-saneamento', label: 'Saneamento Básico e Habitação', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },
  { id: 'cp-desenvolvimento', label: 'Desenvolvimento Econômico e Tecnologia', category: 'classificacao_proposicao', categoryLabel: 'Tema de Proposição' },

  // 2. Classificação Oficial Orçamentária de Emendas (LOA/GDF - Funções & Subfunções)
  { id: 'ce-saude', label: '10 - Saúde', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-educacao', label: '12 - Educação', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-urbanismo', label: '15 - Urbanismo', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-seguranca', label: '06 - Segurança Pública', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-social', label: '08 - Assistência Social', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-esporte', label: '27 - Desporto e Lazer', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-cultura', label: '13 - Cultura', category: 'classificacao_emenda', categoryLabel: 'Função Orçamentária (LOA)' },
  { id: 'ce-ubs', label: 'Atenção Básica (UBS)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-hospital', label: 'Assistência Hospitalar (HRC / UPAs)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-escolas', label: 'Infraestrutura Escolar (SEEDF)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-asfalto', label: 'Pavimentação e Drenagem (NOVACAP)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-led', label: 'Iluminação Pública LED', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-caesb', label: 'Saneamento e Água (CAESB)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-cras', label: 'Assistência Comunitária (CRAS)', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },
  { id: 'ce-quadras', label: 'Quadras Poliesportivas e Grama Sintética', category: 'classificacao_emenda', categoryLabel: 'Subfunção / Objeto' },

  // 3. Tipos Regimentais de Proposição
  { id: 'tp-pl', label: 'PL (Projeto de Lei Ordinária)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-plc', label: 'PLC (Projeto de Lei Complementar)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-pelo', label: 'PELO (Emenda à Lei Orgânica)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-pdl', label: 'PDL (Projeto de Decreto Legislativo)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-pr', label: 'PR (Projeto de Resolução)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-ind', label: 'IND (Indicação Comunitária)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-req', label: 'REQ (Requerimento Regimental)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-moc', label: 'MOC (Moção de Apelo/Repúdio/Louvor)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },
  { id: 'tp-rec', label: 'REC (Recurso Regimental)', category: 'tipo_proposicao', categoryLabel: 'Tipo Regimental' },

  // 4. Tags de Ementas & Assuntos Relevantes
  { id: 'te-nao-se-cale', label: 'Não Se Cale DF', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-passe-livre', label: 'Passe Livre Estudantil', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-maria-penha', label: 'Maria da Penha / Feminicídio', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-vigilantes', label: 'Vigilantes e Terceirizados', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-autismo', label: 'Autismo (TEA)', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-regularizacao', label: 'Regularização Fundiária', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-creches', label: 'Creches e Primeira Infância', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-queimadas', label: 'Incêndios Florestais e Queimadas', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-fcdf', label: 'Fundo Constitucional (FCDF)', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-enfermagem', label: 'Apoio aos Profissionais de Enfermagem', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },
  { id: 'te-startups', label: 'Startups e Biotic', category: 'tema_ementa', categoryLabel: 'Ementa / Tema' },

  // 5. Regiões Administrativas do DF
  { id: 'ra-ceilandia', label: 'Ceilândia', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-taguatinga', label: 'Taguatinga', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-samambaia', label: 'Samambaia', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-planaltina', label: 'Planaltina', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-saosebastiao', label: 'São Sebastião', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-planopiloto', label: 'Plano Piloto', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-candangolandia', label: 'Candangolândia', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-sobradinho', label: 'Sobradinho', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-gama', label: 'Gama', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-vicentepires', label: 'Vicente Pires', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' },
  { id: 'ra-solnascente', label: 'Sol Nascente / Pôr do Sol', category: 'regiao_administrativa', categoryLabel: 'Região Administrativa' }
];

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Autocomplete suggestions dynamically synthesized from:
 * 1. Official classification tags of propositions, LOA amendments and RAs
 * 2. Real proposition codes and key ementa phrases in propositionsList
 * 3. Real amendment numbers, executing organs and objects in amendmentsList
 */
export function getAutocompleteSuggestions(query: string, maxResults: number = 8): SearchTag[] {
  if (!query || query.trim().length < 1) return [];

  const cleanQuery = normalize(query);
  const results: SearchTag[] = [];
  const seenLabels = new Set<string>();

  const addResult = (tag: SearchTag) => {
    const key = `${tag.label.toLowerCase()}::${tag.category}`;
    if (!seenLabels.has(key)) {
      seenLabels.add(key);
      results.push(tag);
    }
  };

  // 1. Check curated official tags
  for (const tag of OFFICIAL_SEARCH_TAGS) {
    const labelNorm = normalize(tag.label);
    const catLabelNorm = normalize(tag.categoryLabel);
    if (labelNorm.includes(cleanQuery) || catLabelNorm.includes(cleanQuery)) {
      addResult(tag);
    }
    if (results.length >= maxResults * 2) break;
  }

  // 2. Check propositions list for exact codes or ementa subjects
  for (const prop of propositionsList) {
    const codeNorm = normalize(prop.codigo);
    const ementaNorm = normalize(prop.ementa);
    const classNorm = normalize(prop.classificacaoOficial);

    if (codeNorm.includes(cleanQuery)) {
      addResult({
        id: `prop-code-${prop.id}`,
        label: prop.codigo,
        category: 'classificacao_proposicao',
        categoryLabel: `Proposição (${prop.autorNome})`
      });
    }

    if (classNorm.includes(cleanQuery)) {
      addResult({
        id: `prop-class-${prop.classificacaoOficial}`,
        label: prop.classificacaoOficial,
        category: 'classificacao_proposicao',
        categoryLabel: 'Classificação Oficial CLDF'
      });
    }

    // Check tags
    for (const t of prop.tags) {
      if (normalize(t).includes(cleanQuery)) {
        addResult({
          id: `tag-${t}`,
          label: t,
          category: 'tema_ementa',
          categoryLabel: 'Tag de Ementa'
        });
      }
    }
  }

  // 3. Check amendments list for amendment numbers or organ
  for (const amd of amendmentsList) {
    const numNorm = normalize(amd.numeroEmenda);
    const funcNorm = normalize(amd.funcaoGoverno);
    const organNorm = normalize(amd.orgaoExecutor);

    if (numNorm.includes(cleanQuery)) {
      addResult({
        id: `amd-num-${amd.id}`,
        label: amd.numeroEmenda,
        category: 'classificacao_emenda',
        categoryLabel: `Emenda (${amd.regiaoAdministrativa})`
      });
    }

    if (funcNorm.includes(cleanQuery)) {
      addResult({
        id: `amd-func-${amd.funcaoGoverno}`,
        label: amd.funcaoGoverno,
        category: 'classificacao_emenda',
        categoryLabel: 'Função LOA'
      });
    }

    if (organNorm.includes(cleanQuery)) {
      addResult({
        id: `amd-organ-${amd.id}`,
        label: amd.orgaoExecutor,
        category: 'classificacao_emenda',
        categoryLabel: 'Órgão Executor GDF'
      });
    }

    for (const t of amd.tags) {
      if (normalize(t).includes(cleanQuery)) {
        addResult({
          id: `amd-tag-${t}`,
          label: t,
          category: 'tema_ementa',
          categoryLabel: 'Tag Orçamentária'
        });
      }
    }
  }

  return results.slice(0, maxResults);
}
