/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type YearKey = 'all' | '2023' | '2024' | '2025';

export type VoteType = 'SIM' | 'NÃO' | 'ABSTENÇÃO' | 'AUSENTE';

export type PropositionType = 'PL' | 'PLC' | 'PELO' | 'PDL' | 'PR' | 'IND' | 'REQ' | 'MOC' | 'REC';

export interface PropositionMetrics {
  total: number;
  pl: number; // Projetos de Lei Ordinária
  plc: number; // Projetos de Lei Complementar
  pelo: number; // Propostas de Emenda à Lei Orgânica
  pdl: number; // Projetos de Decreto Legislativo
  pr: number; // Projetos de Resolução
  ind: number; // Indicações comunitárias/RAs
  req: number; // Requerimentos (CPI, audiência pública, fiscalização)
  moc: number; // Moções (apelo, repúdio, louvor)
  rec: number; // Recursos
  aprovadas: number;
  emTramitacao: number;
  arquivadas: number;
}

export interface AmendmentArea {
  area: string;
  valor: number; // em R$
  percentual: number;
}

export interface AmendmentBeneficiary {
  nome: string;
  regiaoAdministrativa: string;
  valor: number;
  objeto: string;
}

export interface AmendmentMetrics {
  indicado: number;
  empenhado: number;
  liquidado: number;
  pago: number;
  taxaExecucao: number; // %
  areas: AmendmentArea[];
  destaques: AmendmentBeneficiary[];
}

export interface CommitteeAttendance {
  nome: string;
  cargo: 'Presidente' | 'Vice-Presidente' | 'Membro Titular' | 'Membro Suplente';
  reunioesTotais: number;
  presencas: number;
  taxaAssiduidade: number;
}

export interface SessionTypeStat {
  total: number;
  presencas: number;
  taxa: number;
}

export interface SessionBreakdown {
  ordinarias: SessionTypeStat; // Sessões de terça, quarta e quinta
  extraordinarias: SessionTypeStat; // Convocadas fora do horário regimental para deliberações urgentes
  solenesEEspeciais: SessionTypeStat; // Homenagens, posses, datas comemorativas e debates temáticos
  preparatorias?: SessionTypeStat; // Instalação da legislatura e eleição de mesa
}

export interface AttendanceMetrics {
  plenario: {
    sessoesTotais: number; // TOTAL DE TODAS AS SESSÕES PLENÁRIAS convocadas (Ordinárias, Extraordinárias, Solenes, Especiais)
    presencas: number;
    faltasJustificadas: number;
    faltasNaoJustificadas: number;
    taxaAssiduidade: number;
    discriminacao: SessionBreakdown;
  };
  comissoes: CommitteeAttendance[];
}

export interface VoteRecordSummary {
  totalVotacoes: number;
  votosSim: number;
  votosNao: number;
  abstencoes: number;
  ausencias: number;
  taxaParticipacao: number;
}

export type PropositionStatus = 'Aprovada / Sancionada' | 'Em Tramitação' | 'Pronta para Pauta' | 'Arquivada' | 'Vetada';

export interface PropositionItem {
  id: string;
  codigo: string; // Ex: "PL 142/2023", "PELO 08/2024"
  tipo: PropositionType;
  tipoDescricao: string;
  numero: number;
  ano: number;
  autorId: string;
  autorNome: string;
  autorPartido: string;
  autorFoto: string;
  ementa: string;
  dataApresentacao: string; // YYYY-MM-DD
  status: PropositionStatus;
  classificacaoOficial: string;
  subclassificacao?: string;
  tags: string[];
  tramitacaoAtual: string;
}

export type AmendmentType = 'Individual' | 'Bancada' | 'Comissão';
export type AmendmentStatus = 'Pago Total' | 'Pago Parcial' | 'Empenhado' | 'Em Liquidação' | 'Cancelado';

export interface AmendmentItem {
  id: string;
  numeroEmenda: string; // Ex: "EMD 2023-042"
  tipo: AmendmentType;
  ano: number;
  autorId: string;
  autorNome: string;
  autorPartido: string;
  autorFoto: string;
  funcaoGoverno: string; // "10 - Saúde", "12 - Educação", etc.
  subfuncao: string;
  orgaoExecutor: string;
  regiaoAdministrativa: string;
  objeto: string;
  valorIndicado: number;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
  taxaExecucao: number;
  statusExecucao: AmendmentStatus;
  classificacaoOficial: string;
  tags: string[];
}

export type SearchTagCategory =
  | 'classificacao_proposicao'
  | 'classificacao_emenda'
  | 'tipo_proposicao'
  | 'regiao_administrativa'
  | 'tema_ementa'
  | 'autor';

export interface SearchTag {
  id: string;
  label: string;
  category: SearchTagCategory;
  categoryLabel: string;
  count?: number;
}

export interface DeputyYearData {
  proposicoes: PropositionMetrics;
  emendas: AmendmentMetrics;
  presenca: AttendanceMetrics;
  votacoes: VoteRecordSummary;
}

export interface Deputy {
  id: string;
  nomeParlamentar: string;
  nomeCompleto: string;
  partido: string;
  foto: string;
  cargoMesa?: string;
  bloco?: string;
  anoEleicao: number;
  votosEleicao: number;
  biografiaCurta: string;
  telefoneGab: string;
  email: string;
  regiaoBase: string;
  historico: {
    '2023': DeputyYearData;
    '2024': DeputyYearData;
    '2025': DeputyYearData;
  };
}

export interface RollCallVote {
  id: string;
  codigo: string;
  titulo: string;
  ementa: string;
  data: string;
  ano: '2023' | '2024' | '2025';
  categoria: 'Orçamento & Tributação' | 'Transporte & Mobilidade' | 'Saúde & Social' | 'Educação' | 'Urbanismo & PDOT' | 'Serviço Público' | 'Segurança';
  resultado: 'Aprovado' | 'Rejeitado';
  votosSim: number;
  votosNao: number;
  abstencoes: number;
  ausencias: number;
  votos: Record<string, VoteType>;
  tags?: string[];
  classificacaoOficial?: string;
}

export interface PublicDataSource {
  id: string;
  categoria: 'CLDF Oficial' | 'Execução Orçamentária GDF' | 'Controle Externo & Auditoria' | 'Transparência Passiva';
  nome: string;
  sigla: string;
  orgao: string;
  url: string;
  descricao: string;
  tipoDados: 'API / Dados Abertos' | 'Painel Interativo' | 'Diário Oficial (PDF)' | 'Relatório de Auditoria';
  formatos: string[];
  periodicidade: string;
  comoConsultar: string;
}

export type ActiveTab =
  | 'overview'
  | 'deputies'
  | 'propositions'
  | 'amendments'
  | 'attendance'
  | 'calendar'
  | 'voting'
  | 'sources';
