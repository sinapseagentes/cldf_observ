/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PublicDataSource } from '../types';

export const publicDataSources: PublicDataSource[] = [
  {
    id: 'cldf-transparencia',
    categoria: 'CLDF Oficial',
    nome: 'Portal da Transparência da CLDF',
    sigla: 'Transparência CLDF',
    orgao: 'Câmara Legislativa do Distrito Federal',
    url: 'https://transparencia.cl.df.gov.br',
    descricao: 'Portal central da CLDF com painéis interativos de proposições, votações nominais, emendas parlamentares e presença em sessões de plenário.',
    tipoDados: 'Painel Interativo',
    formatos: ['Web', 'HTML', 'Exportação CSV/XLSX'],
    periodicidade: 'Diária / Tempo Real',
    comoConsultar: 'Acesse o menu "Atividade Legislativa" > "Painel de Votações", "Projetos e Proposições" ou "Emendas Parlamentares" para filtrar por deputado e ano.'
  },
  {
    id: 'cldf-dados-abertos',
    categoria: 'CLDF Oficial',
    nome: 'Portal de Dados Abertos da CLDF',
    sigla: 'Dados Abertos CLDF',
    orgao: 'Câmara Legislativa do Distrito Federal',
    url: 'https://dadosabertos.cl.df.gov.br',
    descricao: 'Catálogo de dados brutos e estruturados disponibilizados em formatos abertos e legíveis por máquina para auditoria cidadã e desenvolvimento.',
    tipoDados: 'API / Dados Abertos',
    formatos: ['CSV', 'JSON', 'XML', 'API REST'],
    periodicidade: 'Semanal / Mensal',
    comoConsultar: 'Consulte os datasets "Proposições Legislativas", "Deputados Distritais" e "Votações Nominais" para download direto ou consumo via script.'
  },
  {
    id: 'cldf-splegis',
    categoria: 'CLDF Oficial',
    nome: 'Sistema de Processo Legislativo da CLDF (SPL)',
    sigla: 'SPL / Pesquisa Legislativa',
    orgao: 'Secretaria Legislativa da CLDF',
    url: 'https://cl.df.gov.br',
    descricao: 'Tramitação completa de cada matéria, com inteiro teor das minutas, pareceres nas comissões (CCJ, CEOF, etc.), redações finais e relatorias.',
    tipoDados: 'Painel Interativo',
    formatos: ['PDF', 'HTML'],
    periodicidade: 'Contínua em tempo real',
    comoConsultar: 'Busque pelo número do Projeto de Lei ou filtre por autor para acompanhar pareceres e histórico de votação em cada comissão.'
  },
  {
    id: 'cldf-dcl',
    categoria: 'CLDF Oficial',
    nome: 'Diário da Câmara Legislativa',
    sigla: 'DCL',
    orgao: 'Câmara Legislativa do Distrito Federal',
    url: 'https://cl.df.gov.br/diario-da-camara-legislativa',
    descricao: 'Jornal oficial com fé pública contendo atas oficiais das sessões, registros taquigráficos, extratos de votações nominais e justificativas formais de ausência.',
    tipoDados: 'Diário Oficial (PDF)',
    formatos: ['PDF'],
    periodicidade: 'Diária (dias úteis com sessão)',
    comoConsultar: 'Pesquise por edição ou data da sessão plenária para conferir o extrato oficial e discursos de bancada.'
  },
  {
    id: 'gdf-transparencia',
    categoria: 'Execução Orçamentária GDF',
    nome: 'Portal da Transparência do Distrito Federal (CGDF / SIGGO)',
    sigla: 'Transparência DF',
    orgao: 'Controladoria-Geral do Distrito Federal (CGDF)',
    url: 'https://transparencia.df.gov.br',
    descricao: 'Monitoramento da execução financeira real das emendas parlamentares distritais (empenho, liquidação e pagamento pelo Poder Executivo).',
    tipoDados: 'Painel Interativo',
    formatos: ['CSV', 'JSON', 'XLSX', 'Web'],
    periodicidade: 'Diária',
    comoConsultar: 'Acesse "Despesas" > "Emendas Parlamentares" para filtrar por autor, órgão executor (ex: Novacap, SES-DF, SEEDF) e entidade recebedora.'
  },
  {
    id: 'tcdf-fiscalizacao',
    categoria: 'Controle Externo & Auditoria',
    nome: 'Painel de Fiscalização de Emendas - TCDF',
    sigla: 'TCDF Emendas',
    orgao: 'Tribunal de Contas do Distrito Federal',
    url: 'https://tc.df.gov.br',
    descricao: 'Auditorias operacionais e de conformidade do TCDF sobre a destinação e execução das emendas individuais e de bancada aos órgãos e OSCs.',
    tipoDados: 'Relatório de Auditoria',
    formatos: ['PDF', 'Painel BI'],
    periodicidade: 'Periódica / Relatórios Anuais',
    comoConsultar: 'Consulte os relatórios analíticos de contas de governo e processos de auditoria temática de repasses para organizações sociais.'
  },
  {
    id: 'cldf-esic',
    categoria: 'Transparência Passiva',
    nome: 'Serviço de Informação ao Cidadão (e-SIC / Fala.BR CLDF)',
    sigla: 'e-SIC / LAI CLDF',
    orgao: 'Ouvidoria da CLDF (Lei nº 12.527/2011)',
    url: 'https://cl.df.gov.br/ouvidoria',
    descricao: 'Canal oficial para requisição de relatórios específicos não automatizados (como séries consolidadas de frequência em comissões técnicas).',
    tipoDados: 'API / Dados Abertos',
    formatos: ['CSV', 'XLSX', 'Ofício'],
    periodicidade: 'Sob demanda (prazo de até 20 dias)',
    comoConsultar: 'Abra um pedido de informação formal indicando a legislatura, período (ano a ano) e o conjunto de dados em formato aberto solicitado.'
  }
];
