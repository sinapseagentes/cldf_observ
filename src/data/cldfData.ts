/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Deputy, DeputyYearData, YearKey, PropositionMetrics, AmendmentMetrics, AttendanceMetrics, VoteRecordSummary } from '../types';
import { deputiesData } from './deputiesData';
import { rollCallVotesData } from './votesData';
import { publicDataSources } from './sourcesData';

export { deputiesData, rollCallVotesData, publicDataSources };

export const YEARS: { key: YearKey; label: string }[] = [
  { key: 'all', label: 'Toda a Legislatura (2023-2025)' },
  { key: '2025', label: '2025 (Ano Corrente)' },
  { key: '2024', label: '2024' },
  { key: '2023', label: '2023' }
];

export const PARTIES: string[] = Array.from(new Set(deputiesData.map(d => d.partido))).sort();

export function getDeputyMetrics(deputy: Deputy, year: YearKey): DeputyYearData {
  if (year !== 'all') {
    return deputy.historico[year];
  }

  // Aggregate across all 3 years
  const y23 = deputy.historico['2023'];
  const y24 = deputy.historico['2024'];
  const y25 = deputy.historico['2025'];

  const proposicoes: PropositionMetrics = {
    total: y23.proposicoes.total + y24.proposicoes.total + y25.proposicoes.total,
    pl: y23.proposicoes.pl + y24.proposicoes.pl + y25.proposicoes.pl,
    plc: (y23.proposicoes.plc || 0) + (y24.proposicoes.plc || 0) + (y25.proposicoes.plc || 0),
    pelo: y23.proposicoes.pelo + y24.proposicoes.pelo + y25.proposicoes.pelo,
    pdl: y23.proposicoes.pdl + y24.proposicoes.pdl + y25.proposicoes.pdl,
    pr: (y23.proposicoes.pr || 0) + (y24.proposicoes.pr || 0) + (y25.proposicoes.pr || 0),
    ind: y23.proposicoes.ind + y24.proposicoes.ind + y25.proposicoes.ind,
    req: y23.proposicoes.req + y24.proposicoes.req + y25.proposicoes.req,
    moc: y23.proposicoes.moc + y24.proposicoes.moc + y25.proposicoes.moc,
    rec: (y23.proposicoes.rec || 0) + (y24.proposicoes.rec || 0) + (y25.proposicoes.rec || 0),
    aprovadas: y23.proposicoes.aprovadas + y24.proposicoes.aprovadas + y25.proposicoes.aprovadas,
    emTramitacao: y23.proposicoes.emTramitacao + y24.proposicoes.emTramitacao + y25.proposicoes.emTramitacao,
    arquivadas: y23.proposicoes.arquivadas + y24.proposicoes.arquivadas + y25.proposicoes.arquivadas
  };

  const indicado = y23.emendas.indicado + y24.emendas.indicado + y25.emendas.indicado;
  const empenhado = y23.emendas.empenhado + y24.emendas.empenhado + y25.emendas.empenhado;
  const liquidado = y23.emendas.liquidado + y24.emendas.liquidado + y25.emendas.liquidado;
  const pago = y23.emendas.pago + y24.emendas.pago + y25.emendas.pago;
  const taxaExecucao = Number(((pago / indicado) * 100).toFixed(1));

  // Merge areas
  const areaTotals: Record<string, number> = {};
  [y23, y24, y25].forEach(y => {
    y.emendas.areas.forEach(a => {
      areaTotals[a.area] = (areaTotals[a.area] || 0) + a.valor;
    });
  });

  const areas = Object.entries(areaTotals).map(([area, valor]) => ({
    area,
    valor,
    percentual: Number(((valor / indicado) * 100).toFixed(1))
  }));

  const emendas: AmendmentMetrics = {
    indicado,
    empenhado,
    liquidado,
    pago,
    taxaExecucao,
    areas,
    destaques: [...y25.emendas.destaques]
  };

  const sTot = y23.presenca.plenario.sessoesTotais + y24.presenca.plenario.sessoesTotais + y25.presenca.plenario.sessoesTotais;
  const sPres = y23.presenca.plenario.presencas + y24.presenca.plenario.presencas + y25.presenca.plenario.presencas;
  const sFaltJ = y23.presenca.plenario.faltasJustificadas + y24.presenca.plenario.faltasJustificadas + y25.presenca.plenario.faltasJustificadas;
  const sFaltNJ = y23.presenca.plenario.faltasNaoJustificadas + y24.presenca.plenario.faltasNaoJustificadas + y25.presenca.plenario.faltasNaoJustificadas;

  const ordTot = y23.presenca.plenario.discriminacao.ordinarias.total + y24.presenca.plenario.discriminacao.ordinarias.total + y25.presenca.plenario.discriminacao.ordinarias.total;
  const ordPres = y23.presenca.plenario.discriminacao.ordinarias.presencas + y24.presenca.plenario.discriminacao.ordinarias.presencas + y25.presenca.plenario.discriminacao.ordinarias.presencas;

  const extTot = y23.presenca.plenario.discriminacao.extraordinarias.total + y24.presenca.plenario.discriminacao.extraordinarias.total + y25.presenca.plenario.discriminacao.extraordinarias.total;
  const extPres = y23.presenca.plenario.discriminacao.extraordinarias.presencas + y24.presenca.plenario.discriminacao.extraordinarias.presencas + y25.presenca.plenario.discriminacao.extraordinarias.presencas;

  const solTot = y23.presenca.plenario.discriminacao.solenesEEspeciais.total + y24.presenca.plenario.discriminacao.solenesEEspeciais.total + y25.presenca.plenario.discriminacao.solenesEEspeciais.total;
  const solPres = y23.presenca.plenario.discriminacao.solenesEEspeciais.presencas + y24.presenca.plenario.discriminacao.solenesEEspeciais.presencas + y25.presenca.plenario.discriminacao.solenesEEspeciais.presencas;

  const prepTot = (y23.presenca.plenario.discriminacao.preparatorias?.total || 0) + (y24.presenca.plenario.discriminacao.preparatorias?.total || 0) + (y25.presenca.plenario.discriminacao.preparatorias?.total || 0);
  const prepPres = (y23.presenca.plenario.discriminacao.preparatorias?.presencas || 0) + (y24.presenca.plenario.discriminacao.preparatorias?.presencas || 0) + (y25.presenca.plenario.discriminacao.preparatorias?.presencas || 0);
  const prepTaxa = prepTot > 0 ? Number(((prepPres / prepTot) * 100).toFixed(1)) : 100;

  const presenca: AttendanceMetrics = {
    plenario: {
      sessoesTotais: sTot,
      presencas: sPres,
      faltasJustificadas: sFaltJ,
      faltasNaoJustificadas: sFaltNJ,
      taxaAssiduidade: Number(((sPres / sTot) * 100).toFixed(1)),
      discriminacao: {
        ordinarias: { total: ordTot, presencas: ordPres, taxa: Number(((ordPres / ordTot) * 100).toFixed(1)) },
        extraordinarias: { total: extTot, presencas: extPres, taxa: Number(((extPres / extTot) * 100).toFixed(1)) },
        solenesEEspeciais: { total: solTot, presencas: solPres, taxa: Number(((solPres / solTot) * 100).toFixed(1)) },
        preparatorias: { total: prepTot, presencas: prepPres, taxa: prepTaxa }
      }
    },
    comissoes: y24.presenca.comissoes.map(c => {
      const cTot = (y23.presenca.comissoes[0]?.reunioesTotais || 0) + (y24.presenca.comissoes[0]?.reunioesTotais || 0) + (y25.presenca.comissoes[0]?.reunioesTotais || 0);
      const cPres = (y23.presenca.comissoes[0]?.presencas || 0) + (y24.presenca.comissoes[0]?.presencas || 0) + (y25.presenca.comissoes[0]?.presencas || 0);
      return {
        ...c,
        reunioesTotais: cTot,
        presencas: cPres,
        taxaAssiduidade: Number(((cPres / cTot) * 100).toFixed(1))
      };
    })
  };

  const totVot = y23.votacoes.totalVotacoes + y24.votacoes.totalVotacoes + y25.votacoes.totalVotacoes;
  const vSim = y23.votacoes.votosSim + y24.votacoes.votosSim + y25.votacoes.votosSim;
  const vNao = y23.votacoes.votosNao + y24.votacoes.votosNao + y25.votacoes.votosNao;
  const vAbs = y23.votacoes.abstencoes + y24.votacoes.abstencoes + y25.votacoes.abstencoes;
  const vAus = y23.votacoes.ausencias + y24.votacoes.ausencias + y25.votacoes.ausencias;

  const votacoes: VoteRecordSummary = {
    totalVotacoes: totVot,
    votosSim: vSim,
    votosNao: vNao,
    abstencoes: vAbs,
    ausencias: vAus,
    taxaParticipacao: Number((((totVot - vAus) / totVot) * 100).toFixed(1))
  };

  return { proposicoes, emendas, presenca, votacoes };
}

export function getGlobalAggregates(year: YearKey) {
  let totalProposicoes = 0;
  let totalPL = 0;
  let totalEmendasIndicadas = 0;
  let totalEmendasPagas = 0;
  let sumAssiduidade = 0;
  let totalVotacoes = 0;

  deputiesData.forEach(dep => {
    const data = getDeputyMetrics(dep, year);
    totalProposicoes += data.proposicoes.total;
    totalPL += data.proposicoes.pl;
    totalEmendasIndicadas += data.emendas.indicado;
    totalEmendasPagas += data.emendas.pago;
    sumAssiduidade += data.presenca.plenario.taxaAssiduidade;
    totalVotacoes = Math.max(totalVotacoes, data.votacoes.totalVotacoes);
  });

  const mediaAssiduidade = Number((sumAssiduidade / deputiesData.length).toFixed(1));
  const taxaExecucaoEmendas = Number(((totalEmendasPagas / totalEmendasIndicadas) * 100).toFixed(1));

  return {
    totalProposicoes,
    totalPL,
    totalEmendasIndicadas,
    totalEmendasPagas,
    taxaExecucaoEmendas,
    mediaAssiduidade,
    totalVotacoes,
    totalDeputados: deputiesData.length
  };
}

export function formatCurrency(val: number): string {
  if (val >= 1_000_000_000) {
    return `R$ ${(val / 1_000_000_000).toFixed(2).replace('.', ',')} bi`;
  }
  if (val >= 1_000_000) {
    return `R$ ${(val / 1_000_000).toFixed(1).replace('.', ',')} mi`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('pt-BR').format(val);
}

/**
 * Normalizes deputy and author identifiers to guarantee bidirectional matching
 * across propositions, amendments, voting records and deputies regardless of 'dep-' prefix
 * or slight slug variations.
 */
export function normalizeDeputyId(id: string): string {
  if (!id) return '';
  const clean = id.toLowerCase().replace(/^dep-/, '').trim();
  // Handle known historical slug aliases
  if (clean === 'doutora-jane' || clean === 'jane-klebia') return 'jane-klebia';
  if (clean === 'pastor-daniel-de-castro' || clean === 'pastor-daniel-castro') return 'pastor-daniel-castro';
  if (clean === 'thiago-manfroi' || clean === 'thiago-manzoni') return 'thiago-manzoni';
  return clean;
}

export function isAuthorOf(autorId: string, deputyId: string): boolean {
  if (!autorId || !deputyId) return false;
  return normalizeDeputyId(autorId) === normalizeDeputyId(deputyId);
}

export function findDeputyByAuthorId(deputies: Deputy[], autorId: string): Deputy | undefined {
  if (!autorId) return undefined;
  const target = normalizeDeputyId(autorId);
  return deputies.find(d => normalizeDeputyId(d.id) === target);
}
