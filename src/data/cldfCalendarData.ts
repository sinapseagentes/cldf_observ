/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalendarDayRule {
  dayOfWeek: string; // 'Segunda-feira', 'Terça-feira', etc.
  turno: 'Manhã (09h00 - 12h30)' | 'Tarde (15h00 - 19h00)' | 'Manhã/Tarde';
  instancia: 'Plenário Lúcio Costa' | 'Comissões Permanentes' | 'Comissões & Audiências' | 'Solenes & Comunitárias';
  descricao: string;
  reunioesPrincipais: string[];
}

export interface CommissionSchedule {
  sigla: string;
  nome: string;
  diaSemana: string;
  horario: string;
  local: string;
  presidenteAtual: string;
  totalMembros: number;
  frequenciaAnualEstimada: number;
  descricaoRegimental: string;
  temas: string[];
}

export interface AnnualLegislativeCalendar {
  ano: number;
  periodo1: {
    inicio: string;
    fim: string;
    descricao: string;
    diasUteisEstimados: number;
    semanasAtivas: number;
  };
  recessoMeioAno: {
    inicio: string;
    fim: string;
    regra: string;
  };
  periodo2: {
    inicio: string;
    fim: string;
    descricao: string;
    diasUteisEstimados: number;
    semanasAtivas: number;
  };
  recessoFimAno: {
    inicio: string;
    fim: string;
    regra: string;
  };
  sessoesOrdinariasPrevistas: number;
  sessoesExtraordinariasTipicas: number;
  sessoesSolenesEspeciais: number;
  sessoesPreparatorias: number;
  totalSessoesPlenariasEsperadas: number;
  comissoesReunioesEsperadasPorDeputado: number;
}

export const CLDF_ANNUAL_CALENDARS: Record<string, AnnualLegislativeCalendar> = {
  '2023': {
    ano: 2023,
    periodo1: {
      inicio: '01/02/2023',
      fim: '30/06/2023',
      descricao: '1º Período da 1ª Sessão Legislativa da 9ª Legislatura',
      diasUteisEstimados: 104,
      semanasAtivas: 21
    },
    recessoMeioAno: {
      inicio: '16/07/2023',
      fim: '31/07/2023',
      regra: 'Suspende os trabalhos após a aprovação da LDO (Lei de Diretrizes Orçamentárias)'
    },
    periodo2: {
      inicio: '01/08/2023',
      fim: '15/12/2023',
      descricao: '2º Período da 1ª Sessão Legislativa da 9ª Legislatura',
      diasUteisEstimados: 96,
      semanasAtivas: 19
    },
    recessoFimAno: {
      inicio: '16/12/2023',
      fim: '31/01/2024',
      regra: 'Suspende os trabalhos após a aprovação da LOA (Lei Orçamentária Anual)'
    },
    sessoesOrdinariasPrevistas: 114, // 3 por semana ao longo de 40 semanas menos feriados regimentais
    sessoesExtraordinariasTipicas: 38,
    sessoesSolenesEspeciais: 26,
    sessoesPreparatorias: 2, // Posse e eleição da Mesa Diretora
    totalSessoesPlenariasEsperadas: 180,
    comissoesReunioesEsperadasPorDeputado: 48
  },
  '2024': {
    ano: 2024,
    periodo1: {
      inicio: '01/02/2024',
      fim: '30/06/2024',
      descricao: '1º Período da 2ª Sessão Legislativa da 9ª Legislatura',
      diasUteisEstimados: 105,
      semanasAtivas: 21
    },
    recessoMeioAno: {
      inicio: '16/07/2024',
      fim: '31/07/2024',
      regra: 'Condicionado à votação final da LDO de 2025'
    },
    periodo2: {
      inicio: '01/08/2024',
      fim: '15/12/2024',
      descricao: '2º Período da 2ª Sessão Legislativa da 9ª Legislatura',
      diasUteisEstimados: 95,
      semanasAtivas: 19
    },
    recessoFimAno: {
      inicio: '16/12/2024',
      fim: '31/01/2025',
      regra: 'Condicionado à votação da LOA de 2025 e pacotes fiscais'
    },
    sessoesOrdinariasPrevistas: 116,
    sessoesExtraordinariasTipicas: 42,
    sessoesSolenesEspeciais: 28,
    sessoesPreparatorias: 0,
    totalSessoesPlenariasEsperadas: 186,
    comissoesReunioesEsperadasPorDeputado: 50
  },
  '2025': {
    ano: 2025,
    periodo1: {
      inicio: '03/02/2025',
      fim: '30/06/2025',
      descricao: '1º Período da 3ª Sessão Legislativa da 9ª Legislatura',
      diasUteisEstimados: 104,
      semanasAtivas: 21
    },
    recessoMeioAno: {
      inicio: '16/07/2025',
      fim: '31/07/2025',
      regra: 'Recesso constitucional e apreciação de vetos e LDO'
    },
    periodo2: {
      inicio: '01/08/2025',
      fim: '15/12/2025',
      descricao: '2º Período da 3ª Sessão Legislativa (em curso/ano corrente)',
      diasUteisEstimados: 95,
      semanasAtivas: 19
    },
    recessoFimAno: {
      inicio: '16/12/2025',
      fim: '31/01/2026',
      regra: 'Recesso após votação do Orçamento'
    },
    sessoesOrdinariasPrevistas: 112,
    sessoesExtraordinariasTipicas: 36,
    sessoesSolenesEspeciais: 24,
    sessoesPreparatorias: 0,
    totalSessoesPlenariasEsperadas: 172,
    comissoesReunioesEsperadasPorDeputado: 46
  }
};

export const WEEKLY_SCHEDULE_RULES: CalendarDayRule[] = [
  {
    dayOfWeek: 'Segunda-feira',
    turno: 'Manhã (09h00 - 12h30)',
    instancia: 'Comissões & Audiências',
    descricao: 'Reuniões ordinárias de comissões temáticas, audiências públicas regionais e comissões especiais/CPIs.',
    reunioesPrincipais: [
      'CCJ (Comissão de Constituição e Justiça) - Manhã',
      'Audiências Públicas temáticas com a sociedade civil',
      'Sessões Solenes no período noturno (19h)'
    ]
  },
  {
    dayOfWeek: 'Terça-feira',
    turno: 'Manhã/Tarde',
    instancia: 'Plenário Lúcio Costa',
    descricao: 'Manhã dedicada a comissões permanentes prioritárias e tarde para a Sessão Plenária Ordinária.',
    reunioesPrincipais: [
      'Manhã (10h): CEOF (Economia, Orçamento e Finanças) e CAS (Assuntos Sociais)',
      'Tarde (15h): SESSÃO DELIBERATIVA ORDINÁRIA DO PLENÁRIO',
      'Ordem do Dia, deliberação de Projetos de Lei e vetos'
    ]
  },
  {
    dayOfWeek: 'Quarta-feira',
    turno: 'Manhã/Tarde',
    instancia: 'Plenário Lúcio Costa',
    descricao: 'Dia central de votações em Plenário e deliberações das comissões de mérito setorial.',
    reunioesPrincipais: [
      'Manhã (10h): CESC (Educação, Saúde e Cultura) e CDHADC (Direitos Humanos e Cidadania)',
      'Tarde (15h): SESSÃO DELIBERATIVA ORDINÁRIA DO PLENÁRIO',
      'Votações em 1º e 2º turno, redações finais'
    ]
  },
  {
    dayOfWeek: 'Quinta-feira',
    turno: 'Manhã/Tarde',
    instancia: 'Plenário Lúcio Costa',
    descricao: 'Encerramento da semana deliberativa do Plenário e reuniões das comissões de fiscalização e desenvolvimento.',
    reunioesPrincipais: [
      'Manhã (10h): CAF (Assuntos Fundiários) e CDESCTMAT (Desenvolvimento Econômico e Turismo)',
      'Tarde (15h): SESSÃO DELIBERATIVA ORDINÁRIA DO PLENÁRIO',
      'Votação de urgências regimentais e pacotes governamentais'
    ]
  },
  {
    dayOfWeek: 'Sexta-feira',
    turno: 'Manhã (09h00 - 12h30)',
    instancia: 'Solenes & Comunitárias',
    descricao: 'Atividades parlamentares externas, visitas fiscalizatórias nas RAs, audiências públicas e sessões solenes comemorativas.',
    reunioesPrincipais: [
      'Sessões Solenes e entrega de títulos de Cidadão Honorário',
      'Audiências Públicas da LDO, LOA e PDOT nas Regiões Administrativas',
      'Despachos com lideranças comunitárias e gabinetes'
    ]
  }
];

export const COMMISSIONS_SCHEDULE: CommissionSchedule[] = [
  {
    sigla: 'CCJ',
    nome: 'Comissão de Constituição e Justiça',
    diaSemana: 'Terças-feiras (e Segundas quando extraordinária)',
    horario: '10h00',
    local: 'Plenarinho das Comissões',
    presidenteAtual: 'Thiago Manzoni',
    totalMembros: 5,
    frequenciaAnualEstimada: 42,
    descricaoRegimental: 'Analisa a constitucionalidade, legalidade e juridicidade de todas as proposições que tramitam na Casa.',
    temas: ['Constitucionalidade', 'Técnica Legislativa', 'Redação Final', 'Regimento Interno']
  },
  {
    sigla: 'CEOF',
    nome: 'Comissão de Economia, Orçamento e Finanças',
    diaSemana: 'Terças-feiras',
    horario: '10h30',
    local: 'Auditório da CLDF',
    presidenteAtual: 'Hermeto / Robério Negreiros (liderança)',
    totalMembros: 5,
    frequenciaAnualEstimada: 38,
    descricaoRegimental: 'Aprecia o PPA, a LDO, a LOA, créditos suplementares, tributos, dívida pública e emendas parlamentares.',
    temas: ['Orçamento Público', 'LDO / LOA', 'Tributação', 'Emendas Parlamentares', 'Créditos Adicionais']
  },
  {
    sigla: 'CAS',
    nome: 'Comissão de Assuntos Sociais',
    diaSemana: 'Quartas-feiras',
    horario: '09h30',
    local: 'Sala de Comissões 01',
    presidenteAtual: 'Dayse Amarilio',
    totalMembros: 5,
    frequenciaAnualEstimada: 32,
    descricaoRegimental: 'Analisa matérias relativas à seguridade social, previdência, assistência comunitária, trabalho e moradia.',
    temas: ['Assistência Social', 'Trabalho e Renda', 'Previdência Distrital', 'População Vulnerável']
  },
  {
    sigla: 'CESC',
    nome: 'Comissão de Educação, Saúde e Cultura',
    diaSemana: 'Quartas-feiras',
    horario: '10h30',
    local: 'Sala de Comissões 02',
    presidenteAtual: 'Gabriel Magno',
    totalMembros: 5,
    frequenciaAnualEstimada: 36,
    descricaoRegimental: 'Examina políticas públicas para o SUS-DF, rede pública de ensino, patrimônio histórico e fomento à cultura.',
    temas: ['SUS-DF / Hospitais', 'Escolas e PDAF', 'Patrimônio Cultural', 'Carreiras da Saúde e Educação']
  },
  {
    sigla: 'CDHADC',
    nome: 'Comissão de Defesa dos Direitos Humanos, Cidadania e Defesa do Consumidor',
    diaSemana: 'Quintas-feiras',
    horario: '10h00',
    local: 'Plenarinho 03',
    presidenteAtual: 'Fábio Felix',
    totalMembros: 5,
    frequenciaAnualEstimada: 34,
    descricaoRegimental: 'Fiscaliza denúncias de violações de direitos fundamentais, proteção às minorias, cidadania e Procon-DF.',
    temas: ['Direitos Humanos', 'Combate ao Preconceito', 'Sistema Penitenciário', 'Defesa do Consumidor']
  },
  {
    sigla: 'CAF',
    nome: 'Comissão de Assuntos Fundiários',
    diaSemana: 'Quintas-feiras',
    horario: '10h30',
    local: 'Plenarinho 01',
    presidenteAtual: 'Rogério Morro da Cruz',
    totalMembros: 5,
    frequenciaAnualEstimada: 30,
    descricaoRegimental: 'Trata de regularização fundiária urbana e rural, parcelamento do solo, habitação popular e PDOT.',
    temas: ['Regularização Fundiária', 'PDOT', 'Terracap / Codhab', 'Assentamentos Urbanos']
  },
  {
    sigla: 'CDESCTMAT',
    nome: 'Comissão de Desenv. Econômico Sustentável, Ciência, Meio Ambiente e Turismo',
    diaSemana: 'Quintas-feiras',
    horario: '11h00',
    local: 'Sala 04',
    presidenteAtual: 'Eduardo Pedrosa',
    totalMembros: 5,
    frequenciaAnualEstimada: 28,
    descricaoRegimental: 'Promove iniciativas para atração de indústrias, startups, preservação ambiental e turismo no DF.',
    temas: ['Incentivo Econômico', 'Meio Ambiente e Águas', 'Turismo Cívico', 'Inovação Tecnológica']
  },
  {
    sigla: 'CS',
    nome: 'Comissão de Segurança',
    diaSemana: 'Terças-feiras',
    horario: '11h00',
    local: 'Auditório 02',
    presidenteAtual: 'Roosevelt Vilela',
    totalMembros: 5,
    frequenciaAnualEstimada: 26,
    descricaoRegimental: 'Acompanha a política de segurança integrada, PMDF, CBMDF, PCDF e modernização do sistema de socorro.',
    temas: ['Segurança Pública', 'Polícia Civil e Militar', 'Corpo de Bombeiros', 'Defesa Civil']
  },
  {
    sigla: 'CFFO',
    nome: 'Comissão de Fiscalização, Governança, Transparência e Controle',
    diaSemana: 'Segundas-feiras',
    horario: '11h30',
    local: 'Plenarinho 02',
    presidenteAtual: 'Paula Belmonte',
    totalMembros: 5,
    frequenciaAnualEstimada: 30,
    descricaoRegimental: 'Fiscaliza a execução dos contratos e licitações do Poder Executivo e audita o cumprimento das metas fiscais.',
    temas: ['Auditoria de Contratos', 'Transparência Pública', 'Metas Fiscais', 'Fiscalização do GDF']
  }
];
