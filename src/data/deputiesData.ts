/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Deputy, DeputyYearData } from '../types';

interface RawDeputySeed {
  id: string;
  nomeParlamentar: string;
  nomeCompleto: string;
  partido: string;
  cargoMesa?: string;
  bloco?: string;
  anoEleicao: number;
  votosEleicao: number;
  biografiaCurta: string;
  telefoneGab: string;
  email: string;
  regiaoBase: string;
  comissaoPrincipal: string;
  cargoComissao: 'Presidente' | 'Vice-Presidente' | 'Membro Titular' | 'Membro Suplente';
  perfilFoco: 'Fiscalização e Direitos' | 'Saúde Pública' | 'Empreendedorismo e Gestão' | 'Educação e Juventude' | 'Segurança e Militar' | 'Desenvolvimento Regional' | 'Infraestrutura e Obras';
  // Modifiers
  propRatio: number; // multiplier for proposition volume
  amendmentBase: number; // in R$ millions
  assiduidadeBase: number; // 0.85 to 0.99
}

export const rawDeputies: RawDeputySeed[] = [
  {
    id: 'chico-vigilante',
    nomeParlamentar: 'Chico Vigilante',
    nomeCompleto: 'Francisco Domingos dos Santos',
    partido: 'PT',
    bloco: 'Bloco Democracia e Cidadania',
    anoEleicao: 2022,
    votosEleicao: 43854,
    biografiaCurta: 'Liderança sindical e vigilante profissional, atua com foco na defesa dos trabalhadores terceirizados, vigilância, fiscalização de contratos públicos e direitos sociais.',
    telefoneGab: '(61) 3348-8100',
    email: 'dep.chicovigilante@cl.df.gov.br',
    regiaoBase: 'Ceilândia',
    comissaoPrincipal: 'Comissão de Defesa dos Direitos Humanos, Cidadania e Fiscalização (CDDHC)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Fiscalização e Direitos',
    propRatio: 1.35,
    amendmentBase: 26.5,
    assiduidadeBase: 0.96
  },
  {
    id: 'dayse-amarilio',
    nomeParlamentar: 'Dayse Amarilio',
    nomeCompleto: 'Dayse Amarilio Donetts Severino',
    partido: 'PSB',
    bloco: 'Bloco Democracia e Cidadania',
    anoEleicao: 2022,
    votosEleicao: 11090,
    biografiaCurta: 'Enfermeira obstetra e ex-presidente do SindEnfermeiro-DF. Tem mandato fortemente voltado à saúde pública, direitos das mulheres, maternidade e valorização dos servidores de enfermagem.',
    telefoneGab: '(61) 3348-8102',
    email: 'dep.dayseamarilio@cl.df.gov.br',
    regiaoBase: 'Guará / Taguatinga',
    comissaoPrincipal: 'Comissão de Educação, Saúde e Cultura (CESC)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Saúde Pública',
    propRatio: 1.25,
    amendmentBase: 24.8,
    assiduidadeBase: 0.95
  },
  {
    id: 'eduardo-pedrosa',
    nomeParlamentar: 'Eduardo Pedrosa',
    nomeCompleto: 'Eduardo Pedrosa Ribeiro dos Santos',
    partido: 'União Brasil',
    bloco: 'Bloco União Pelo DF',
    anoEleicao: 2022,
    votosEleicao: 22489,
    biografiaCurta: 'Empresário e gestor, foca em projetos de desregulamentação econômica, incentivo a startups, qualificação profissional e ampliação do apoio a pessoas com transtorno do espectro autista (TEA).',
    telefoneGab: '(61) 3348-8104',
    email: 'dep.eduardopedrosa@cl.df.gov.br',
    regiaoBase: 'Lago Sul / Plano Piloto',
    comissaoPrincipal: 'Comissão de Economia, Orçamento e Finanças (CEOF)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Empreendedorismo e Gestão',
    propRatio: 1.15,
    amendmentBase: 28.0,
    assiduidadeBase: 0.94
  },
  {
    id: 'fabio-felix',
    nomeParlamentar: 'Fábio Felix',
    nomeCompleto: 'Fábio Felix Silveira',
    partido: 'PSOL',
    cargoMesa: 'Corregedor da CLDF',
    bloco: 'PSOL',
    anoEleicao: 2022,
    votosEleicao: 51792,
    biografiaCurta: 'Assistente social e professor, foi o deputado distrital mais votado da história do DF em 2022. Preside a CDDHC e lidera pautas de direitos humanos, combate à violência contra mulheres e minorias.',
    telefoneGab: '(61) 3348-8106',
    email: 'dep.fabiofelix@cl.df.gov.br',
    regiaoBase: 'Plano Piloto / Samambaia',
    comissaoPrincipal: 'Comissão de Defesa dos Direitos Humanos, Cidadania e Fiscalização (CDDHC)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Fiscalização e Direitos',
    propRatio: 1.50,
    amendmentBase: 27.2,
    assiduidadeBase: 0.98
  },
  {
    id: 'gabriel-magno',
    nomeParlamentar: 'Gabriel Magno',
    nomeCompleto: 'Gabriel Magno Pereira Cruz',
    partido: 'PT',
    bloco: 'Bloco Democracia e Cidadania',
    anoEleicao: 2022,
    votosEleicao: 18063,
    biografiaCurta: 'Professor e gestor público, destaca-se na presidência da Comissão de Educação, Saúde e Cultura, com atuação focada em infraestrutura das escolas públicas, Fundeb e valorização dos docentes.',
    telefoneGab: '(61) 3348-8108',
    email: 'dep.gabrielmagno@cl.df.gov.br',
    regiaoBase: 'Sobradinho / Plano Piloto',
    comissaoPrincipal: 'Comissão de Educação, Saúde e Cultura (CESC)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Educação e Juventude',
    propRatio: 1.30,
    amendmentBase: 25.0,
    assiduidadeBase: 0.94
  },
  {
    id: 'hermeto',
    nomeParlamentar: 'Hermeto',
    nomeCompleto: 'Hermeto Pereira de Oliveira',
    partido: 'MDB',
    cargoMesa: 'Líder de Governo',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 27732,
    biografiaCurta: 'Subtenente da PMDF da reserva e ex-administrador regional da Candangolândia. Foco em segurança pública, reformas de praças esportivas, asfalto e apoio às corporações militares.',
    telefoneGab: '(61) 3348-8110',
    email: 'dep.hermeto@cl.df.gov.br',
    regiaoBase: 'Candangolândia / Núcleo Bandeirante',
    comissaoPrincipal: 'Comissão de Segurança (CS)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Segurança e Militar',
    propRatio: 1.05,
    amendmentBase: 29.5,
    assiduidadeBase: 0.95
  },
  {
    id: 'iolando',
    nomeParlamentar: 'Iolando',
    nomeCompleto: 'Iolando Almeida de Souza',
    partido: 'MDB',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 22310,
    biografiaCurta: 'Militar da reserva e ativista da causa das pessoas com deficiência. Trabalha com foco em acessibilidade urbana, infraestrutura em Brazlândia e ampliação de serviços especializados do SUS.',
    telefoneGab: '(61) 3348-8112',
    email: 'dep.iolando@cl.df.gov.br',
    regiaoBase: 'Brazlândia',
    comissaoPrincipal: 'Comissão de Defesa dos Direitos Humanos (CDDHC)',
    cargoComissao: 'Vice-Presidente',
    perfilFoco: 'Desenvolvimento Regional',
    propRatio: 1.10,
    amendmentBase: 27.0,
    assiduidadeBase: 0.93
  },
  {
    id: 'jaqueline-silva',
    nomeParlamentar: 'Jaqueline Silva',
    nomeCompleto: 'Jaqueline Silva de Sousa',
    partido: 'MDB',
    cargoMesa: 'Segunda-Secretária da Mesa Diretora',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 26452,
    biografiaCurta: 'Ex-administradora regional de Santa Maria, com forte presença em políticas comunitárias, fomento a projetos sociais de mulheres e obras viárias de mobilidade na região sul do DF.',
    telefoneGab: '(61) 3348-8114',
    email: 'dep.jaquelinesilva@cl.df.gov.br',
    regiaoBase: 'Santa Maria / Gama',
    comissaoPrincipal: 'Comissão de Constituição e Justiça (CCJ)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Desenvolvimento Regional',
    propRatio: 1.18,
    amendmentBase: 28.5,
    assiduidadeBase: 0.96
  },
  {
    id: 'jane-klebia',
    nomeParlamentar: 'Dra. Jane Klebia',
    nomeCompleto: 'Jane Klebia Silva Reis do Nascimento',
    partido: 'MDB',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 19006,
    biografiaCurta: 'Delegada da Polícia Civil do DF, professora e ex-administradora de Sobradinho. Foco na defesa dos direitos das mulheres, acolhimento em delegacias e segurança comunitária integrada.',
    telefoneGab: '(61) 3348-8116',
    email: 'dep.janeklebia@cl.df.gov.br',
    regiaoBase: 'Sobradinho / Planaltina',
    comissaoPrincipal: 'Comissão de Constituição e Justiça (CCJ)',
    cargoComissao: 'Vice-Presidente',
    perfilFoco: 'Segurança e Militar',
    propRatio: 1.22,
    amendmentBase: 27.8,
    assiduidadeBase: 0.94
  },
  {
    id: 'joaquim-roriz-neto',
    nomeParlamentar: 'Joaquim Roriz Neto',
    nomeCompleto: 'Joaquim Domingos Roriz Neto',
    partido: 'PL',
    bloco: 'Bloco PL',
    anoEleicao: 2022,
    votosEleicao: 21057,
    biografiaCurta: 'Neto do ex-governador Joaquim Roriz, concentra esforços em regularização fundiária, moradia de interesse social, pavimentação e programas de assistência alimentar em cidades satélites.',
    telefoneGab: '(61) 3348-8118',
    email: 'dep.joaquimroriz@cl.df.gov.br',
    regiaoBase: 'Samambaia / Ceilândia',
    comissaoPrincipal: 'Comissão de Assuntos Fundiários (CAF)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Infraestrutura e Obras',
    propRatio: 1.10,
    amendmentBase: 28.2,
    assiduidadeBase: 0.92
  },
  {
    id: 'jorge-vianna',
    nomeParlamentar: 'Jorge Vianna',
    nomeCompleto: 'Jorge Vianna de Sousa',
    partido: 'PSD',
    bloco: 'Bloco PSD',
    anoEleicao: 2022,
    votosEleicao: 30640,
    biografiaCurta: 'Técnico de enfermagem e socorrista do Samu, líder comunitário focado na saúde básica, reestruturação das UPAs, valorização das carreiras de apoio da saúde e atendimento pré-hospitalar.',
    telefoneGab: '(61) 3348-8120',
    email: 'dep.jorgevianna@cl.df.gov.br',
    regiaoBase: 'Samambaia / Ceilândia',
    comissaoPrincipal: 'Comissão de Educação, Saúde e Cultura (CESC)',
    cargoComissao: 'Vice-Presidente',
    perfilFoco: 'Saúde Pública',
    propRatio: 1.28,
    amendmentBase: 27.6,
    assiduidadeBase: 0.95
  },
  {
    id: 'martins-machado',
    nomeParlamentar: 'Martins Machado',
    nomeCompleto: 'Martins Machado da Silva',
    partido: 'Republicanos',
    cargoMesa: 'Primeiro-Secretário da Mesa Diretora',
    bloco: 'Bloco Republicanos',
    anoEleicao: 2022,
    votosEleicao: 31993,
    biografiaCurta: 'Radialista e pastor evangélico, atua em projetos de combate às drogas, recuperação de dependentes químicos, ampliação de escolinhas esportivas comunitárias e apoio à terceira idade.',
    telefoneGab: '(61) 3348-8122',
    email: 'dep.martinsmachado@cl.df.gov.br',
    regiaoBase: 'Planaltina / Ceilândia',
    comissaoPrincipal: 'Comissão de Assuntos Sociais (CAS)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Fiscalização e Direitos',
    propRatio: 1.14,
    amendmentBase: 29.0,
    assiduidadeBase: 0.96
  },
  {
    id: 'max-maciel',
    nomeParlamentar: 'Max Maciel',
    nomeCompleto: 'Max Maciel da Silva',
    partido: 'PSOL',
    bloco: 'PSOL',
    anoEleicao: 2022,
    votosEleicao: 35758,
    biografiaCurta: 'Pedagogo, ativista cultural da periferia e produtor hip-hop de Ceilândia. Preside a Comissão de Transporte e Mobilidade Urbana, pautando o passe livre, cultura periférica e ciclomobilidade.',
    telefoneGab: '(61) 3348-8124',
    email: 'dep.maxmaciel@cl.df.gov.br',
    regiaoBase: 'Ceilândia / Sol Nascente',
    comissaoPrincipal: 'Comissão de Transporte e Mobilidade Urbana (CTMU)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Educação e Juventude',
    propRatio: 1.45,
    amendmentBase: 26.8,
    assiduidadeBase: 0.97
  },
  {
    id: 'pastor-daniel-castro',
    nomeParlamentar: 'Pastor Daniel de Castro',
    nomeCompleto: 'Daniel de Castro Sousa',
    partido: 'PP',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 20475,
    biografiaCurta: 'Advogado, teólogo e pastor, com trabalho focado em regularização de templos religiosos, ação comunitária em Vicente Pires e combate à burocracia do alvará comercial.',
    telefoneGab: '(61) 3348-8126',
    email: 'dep.danieldelcastro@cl.df.gov.br',
    regiaoBase: 'Vicente Pires / Taguatinga',
    comissaoPrincipal: 'Comissão de Assuntos Fundiários (CAF)',
    cargoComissao: 'Vice-Presidente',
    perfilFoco: 'Desenvolvimento Regional',
    propRatio: 1.08,
    amendmentBase: 28.0,
    assiduidadeBase: 0.93
  },
  {
    id: 'paula-belmonte',
    nomeParlamentar: 'Paula Belmonte',
    nomeCompleto: 'Paula Belmonte Ribeiro',
    partido: 'Cidadania',
    bloco: 'Cidadania',
    anoEleicao: 2022,
    votosEleicao: 17208,
    biografiaCurta: 'Ex-deputada federal e empresária. Concentra o mandato na defesa da primeira infância, fiscalização rigorosa dos contratos de terceirização da saúde e combate a privilégios tributários.',
    telefoneGab: '(61) 3348-8128',
    email: 'dep.paulabelmonte@cl.df.gov.br',
    regiaoBase: 'Plano Piloto / Lago Norte',
    comissaoPrincipal: 'Comissão de Fiscalização, Governança, Transparência e Controle (CFGTC)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Fiscalização e Direitos',
    propRatio: 1.32,
    amendmentBase: 25.4,
    assiduidadeBase: 0.96
  },
  {
    id: 'pepa',
    nomeParlamentar: 'Pepa',
    nomeCompleto: 'Luciano Pepa de Oliveira',
    partido: 'PP',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 15362,
    biografiaCurta: 'Líder comunitário de Planaltina, focado em agricultura familiar, pavimentação de vicinais rurais, reforma de escolas rurais e abastecimento de água no Vale do Amanhecer.',
    telefoneGab: '(61) 3348-8130',
    email: 'dep.pepa@cl.df.gov.br',
    regiaoBase: 'Planaltina / Vale do Amanhecer',
    comissaoPrincipal: 'Comissão de Desenvolvimento Econômico Sustentável (CDESCTMAT)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Desenvolvimento Regional',
    propRatio: 1.02,
    amendmentBase: 27.5,
    assiduidadeBase: 0.91
  },
  {
    id: 'ricardo-vale',
    nomeParlamentar: 'Ricardo Vale',
    nomeCompleto: 'Ricardo Vale Ferreira',
    partido: 'PT',
    cargoMesa: 'Vice-Presidente da Mesa Diretora',
    bloco: 'Bloco Democracia e Cidadania',
    anoEleicao: 2022,
    votosEleicao: 17077,
    biografiaCurta: 'Arquiteto e urbanista, atua com ênfase na política de cultura comunitária, apoio à economia criativa, skate/esportes radicais e mobilidade ativa no Distrito Federal.',
    telefoneGab: '(61) 3348-8132',
    email: 'dep.ricardovale@cl.df.gov.br',
    regiaoBase: 'Sobradinho / Paranoá',
    comissaoPrincipal: 'Comissão de Constituição e Justiça (CCJ)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Educação e Juventude',
    propRatio: 1.20,
    amendmentBase: 26.0,
    assiduidadeBase: 0.97
  },
  {
    id: 'roberio-negreiros',
    nomeParlamentar: 'Robério Negreiros',
    nomeCompleto: 'Robério Bandeira de Negreiros Filho',
    partido: 'PSD',
    cargoMesa: 'Segundo-Secretário em exercício',
    bloco: 'Bloco PSD',
    anoEleicao: 2022,
    votosEleicao: 31394,
    biografiaCurta: 'Advogado e empresário em seu quarto mandato consecutivo na CLDF. Especialista em regimento interno, gestão pública, finanças distritais e concessões de serviços públicos.',
    telefoneGab: '(61) 3348-8134',
    email: 'dep.roberionegreiros@cl.df.gov.br',
    regiaoBase: 'Plano Piloto / Lago Sul',
    comissaoPrincipal: 'Comissão de Economia, Orçamento e Finanças (CEOF)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Empreendedorismo e Gestão',
    propRatio: 1.12,
    amendmentBase: 28.5,
    assiduidadeBase: 0.95
  },
  {
    id: 'rogerio-morro-da-cruz',
    nomeParlamentar: 'Rogério Morro da Cruz',
    nomeCompleto: 'Rogério Alves dos Santos',
    partido: 'PRD',
    bloco: 'Independente',
    anoEleicao: 2022,
    votosEleicao: 16129,
    biografiaCurta: 'Líder popular e fundador de associações de moradores em São Sebastião. Foco absoluto em saneamento básico, asfaltamento e regularização habitacional no Morro da Cruz e Mangueiral.',
    telefoneGab: '(61) 3348-8136',
    email: 'dep.rogeriomorro@cl.df.gov.br',
    regiaoBase: 'São Sebastião / Mangueiral',
    comissaoPrincipal: 'Comissão de Assuntos Fundiários (CAF)',
    cargoComissao: 'Membro Titular',
    perfilFoco: 'Infraestrutura e Obras',
    propRatio: 1.06,
    amendmentBase: 27.9,
    assiduidadeBase: 0.92
  },
  {
    id: 'roosevelt-vilela',
    nomeParlamentar: 'Roosevelt Vilela',
    nomeCompleto: 'Roosevelt Vilela Pires',
    partido: 'PL',
    bloco: 'Bloco PL',
    anoEleicao: 2022,
    votosEleicao: 22596,
    biografiaCurta: 'Coronel da reserva do Corpo de Bombeiros Militar do DF. Atua na modernização das forças de socorro e segurança pública, defesa civil e projetos de prevenção de desastres urbanos.',
    telefoneGab: '(61) 3348-8138',
    email: 'dep.rooseveltvilela@cl.df.gov.br',
    regiaoBase: 'Núcleo Bandeirante / Riacho Fundo',
    comissaoPrincipal: 'Comissão de Segurança (CS)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Segurança e Militar',
    propRatio: 1.16,
    amendmentBase: 28.0,
    assiduidadeBase: 0.94
  },
  {
    id: 'thiago-manzoni',
    nomeParlamentar: 'Thiago Manzoni',
    nomeCompleto: 'Thiago Manzoni dos Santos',
    partido: 'PL',
    bloco: 'Bloco PL',
    anoEleicao: 2022,
    votosEleicao: 25520,
    biografiaCurta: 'Advogado constitucionalista, preside a Comissão de Constituição e Justiça (CCJ). Defende pautas liberais, redução da carga tributária local, liberdade econômica e segurança jurídica para investimentos.',
    telefoneGab: '(61) 3348-8140',
    email: 'dep.thiagomanzoni@cl.df.gov.br',
    regiaoBase: 'Taguatinga / Águas Claras',
    comissaoPrincipal: 'Comissão de Constituição e Justiça (CCJ)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Empreendedorismo e Gestão',
    propRatio: 1.26,
    amendmentBase: 27.4,
    assiduidadeBase: 0.97
  },
  {
    id: 'wellington-luiz',
    nomeParlamentar: 'Wellington Luiz',
    nomeCompleto: 'Wellington Luiz de Souza Silva',
    partido: 'MDB',
    cargoMesa: 'Presidente da CLDF',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 28657,
    biografiaCurta: 'Policial civil e presidente da Câmara Legislativa na 9ª Legislatura. Conduz a articulação institucional entre os poderes, preside as sessões deliberativas e incentiva a modernização da Casa.',
    telefoneGab: '(61) 3348-8000',
    email: 'dep.wellingtonluiz@cl.df.gov.br',
    regiaoBase: 'Gama / Plano Piloto',
    comissaoPrincipal: 'Mesa Diretora',
    cargoComissao: 'Presidente',
    perfilFoco: 'Empreendedorismo e Gestão',
    propRatio: 0.95,
    amendmentBase: 31.0,
    assiduidadeBase: 0.99
  },
  {
    id: 'daniel-donizet',
    nomeParlamentar: 'Daniel Donizet',
    nomeCompleto: 'Daniel Donizet de Sousa Gomes',
    partido: 'MDB',
    bloco: 'Bloco MDB / PP',
    anoEleicao: 2022,
    votosEleicao: 33573,
    biografiaCurta: 'Principal articulador da causa animal no DF, idealizador do Hospital Veterinário Público e autor de leis de proteção da fauna, castração gratuita e combate a maus-tratos.',
    telefoneGab: '(61) 3348-8142',
    email: 'dep.danieldonizet@cl.df.gov.br',
    regiaoBase: 'Santa Maria / Gama',
    comissaoPrincipal: 'Comissão de Meio Ambiente (CMA)',
    cargoComissao: 'Presidente',
    perfilFoco: 'Fiscalização e Direitos',
    propRatio: 1.15,
    amendmentBase: 27.3,
    assiduidadeBase: 0.93
  },
  {
    id: 'joao-cardoso',
    nomeParlamentar: 'João Cardoso',
    nomeCompleto: 'João Cardoso da Silva',
    partido: 'Avante',
    bloco: 'Independente',
    anoEleicao: 2022,
    votosEleicao: 17579,
    biografiaCurta: 'Auditor fiscal de atividades urbanas e professor de biologia. Atua na regularização de feiras permanentes, incentivo a cooperativas de reciclagem e fiscalização de posturas urbanas.',
    telefoneGab: '(61) 3348-8144',
    email: 'dep.joaocardoso@cl.df.gov.br',
    regiaoBase: 'Sobradinho / Paranoá',
    comissaoPrincipal: 'Comissão de Assuntos Sociais (CAS)',
    cargoComissao: 'Vice-Presidente',
    perfilFoco: 'Desenvolvimento Regional',
    propRatio: 1.04,
    amendmentBase: 26.2,
    assiduidadeBase: 0.90
  }
];

// Helper to generate year breakdown deterministically based on seed
function generateYearData(seed: RawDeputySeed, year: '2023' | '2024' | '2025'): DeputyYearData {
  const yFactor = year === '2023' ? 1.0 : year === '2024' ? 1.12 : 0.88;
  const pl = Math.round(18 * seed.propRatio * yFactor);
  const plc = Math.max(1, Math.round(3 * seed.propRatio * yFactor));
  const pelo = Math.max(1, Math.round(2 * seed.propRatio * yFactor));
  const pdl = Math.round(6 * seed.propRatio * yFactor);
  const pr = Math.round(4 * seed.propRatio * yFactor);
  const ind = Math.round(140 * seed.propRatio * yFactor);
  const req = Math.round(35 * seed.propRatio * yFactor);
  const moc = Math.round(20 * seed.propRatio * yFactor);
  const rec = Math.round(2 * seed.propRatio * yFactor);
  const total = pl + plc + pelo + pdl + pr + ind + req + moc + rec;
  const aprovadas = Math.round(pl * 0.28 + plc * 0.25 + pelo * 0.15 + pdl * 0.70 + pr * 0.60 + ind * 0.45 + req * 0.85 + moc * 0.80);
  const arquivadas = Math.round(total * 0.08);
  const emTramitacao = total - aprovadas - arquivadas;

  // Amendments
  const indicado = Math.round(seed.amendmentBase * 1000000 * (year === '2023' ? 0.92 : year === '2024' ? 1.05 : 1.15));
  const taxaExecucao = year === '2023' ? 88.4 : year === '2024' ? 79.2 : 62.1;
  const empenhado = Math.round(indicado * 0.96);
  const liquidado = Math.round(indicado * (taxaExecucao / 100 + 0.05));
  const pago = Math.round(indicado * (taxaExecucao / 100));

  const areas = [
    { area: 'Saúde Pública', valor: Math.round(indicado * 0.32), percentual: 32 },
    { area: 'Educação & Escolas', valor: Math.round(indicado * 0.24), percentual: 24 },
    { area: 'Infraestrutura & Obras', valor: Math.round(indicado * 0.20), percentual: 20 },
    { area: 'Esporte & Lazer Comunitário', valor: Math.round(indicado * 0.12), percentual: 12 },
    { area: 'Assistência Social & Cidadania', valor: Math.round(indicado * 0.08), percentual: 8 },
    { area: 'Cultura & Eventos', valor: Math.round(indicado * 0.04), percentual: 4 }
  ];

  const destaques = [
    {
      nome: 'Reforma de UBS / Equipamentos Hospitalares',
      regiaoAdministrativa: seed.regiaoBase.split('/')[0].trim(),
      valor: Math.round(indicado * 0.22),
      objeto: 'Aquisição de aparelhos médicos e reformas de coberturas'
    },
    {
      nome: 'Manutenção de Escolas Públicas (PDAF)',
      regiaoAdministrativa: seed.regiaoBase.split('/')[0].trim(),
      valor: Math.round(indicado * 0.18),
      objeto: 'Pintura, climatização e modernização de laboratórios'
    },
    {
      nome: 'Pavimentação Asfáltica e Calçadas Acessíveis',
      regiaoAdministrativa: seed.regiaoBase,
      valor: Math.round(indicado * 0.15),
      objeto: 'Construção de pistas de caminhada e iluminação pública'
    }
  ];

  // Plenary attendance - COMPUTED OVER ALL SUMMONED PLENARY SESSIONS
  // Re-evaluated to faithfully reflect the official CLDF calendar:
  // 3 ordinary sessions/week over 40 active weeks (~114-116/yr) + urgent extraordinaries + solemn/special sessions
  const nOrd = year === '2023' ? 114 : year === '2024' ? 116 : 112;
  const nExt = year === '2023' ? 38 : year === '2024' ? 42 : 36;
  const nSol = year === '2023' ? 26 : year === '2024' ? 28 : 24;
  const nPrep = year === '2023' ? 2 : 0;
  const sessoesTotais = nOrd + nExt + nSol + nPrep;

  const presOrd = Math.min(nOrd, Math.round(nOrd * seed.assiduidadeBase));
  const presExt = Math.min(nExt, Math.round(nExt * Math.max(0.7, seed.assiduidadeBase - 0.02)));
  const presSol = Math.min(nSol, Math.round(nSol * Math.min(1.0, seed.assiduidadeBase + 0.02)));
  const presPrep = nPrep;
  const presencas = presOrd + presExt + presSol + presPrep;

  const faltasTotais = sessoesTotais - presencas;
  const faltasJustificadas = Math.round(faltasTotais * 0.8);
  const faltasNaoJustificadas = faltasTotais - faltasJustificadas;
  const taxaAssiduidade = Number(((presencas / sessoesTotais) * 100).toFixed(1));

  const discriminacao = {
    ordinarias: { total: nOrd, presencas: presOrd, taxa: Number(((presOrd / nOrd) * 100).toFixed(1)) },
    extraordinarias: { total: nExt, presencas: presExt, taxa: Number(((presExt / nExt) * 100).toFixed(1)) },
    solenesEEspeciais: { total: nSol, presencas: presSol, taxa: Number(((presSol / nSol) * 100).toFixed(1)) },
    ...(nPrep > 0 ? { preparatorias: { total: nPrep, presencas: presPrep, taxa: 100 } } : {})
  };

  // Committee attendance - Reflects weekly/biweekly committee meetings over 40 weeks
  const reunioesTotais = year === '2023' ? 48 : year === '2024' ? 50 : 46;
  const presencasComissao = Math.min(reunioesTotais, Math.round(reunioesTotais * (seed.assiduidadeBase - 0.02)));
  const comissoes = [
    {
      nome: seed.comissaoPrincipal,
      cargo: seed.cargoComissao,
      reunioesTotais,
      presencas: presencasComissao,
      taxaAssiduidade: Number(((presencasComissao / reunioesTotais) * 100).toFixed(1))
    }
  ];

  // Voting stats
  const totalVotacoes = year === '2023' ? 142 : year === '2024' ? 156 : 58;
  const ausencias = Math.max(1, Math.round(totalVotacoes * (1 - seed.assiduidadeBase)));
  const votosParticipados = totalVotacoes - ausencias;
  const votosSim = Math.round(votosParticipados * 0.82);
  const votosNao = Math.round(votosParticipados * 0.14);
  const abstencoes = votosParticipados - votosSim - votosNao;
  const taxaParticipacao = Number(((votosParticipados / totalVotacoes) * 100).toFixed(1));

  return {
    proposicoes: {
      total,
      pl,
      plc,
      pelo,
      pdl,
      pr,
      ind,
      req,
      moc,
      rec,
      aprovadas,
      emTramitacao,
      arquivadas
    },
    emendas: {
      indicado,
      empenhado,
      liquidado,
      pago,
      taxaExecucao,
      areas,
      destaques
    },
    presenca: {
      plenario: {
        sessoesTotais,
        presencas,
        faltasJustificadas,
        faltasNaoJustificadas,
        taxaAssiduidade,
        discriminacao
      },
      comissoes
    },
    votacoes: {
      totalVotacoes,
      votosSim,
      votosNao,
      abstencoes,
      ausencias,
      taxaParticipacao
    }
  };
}

export const deputiesData: Deputy[] = rawDeputies.map((seed) => ({
  id: seed.id,
  nomeParlamentar: seed.nomeParlamentar,
  nomeCompleto: seed.nomeCompleto,
  partido: seed.partido,
  foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(seed.nomeParlamentar)}&background=0D47A1&color=fff&size=160&bold=true`,
  cargoMesa: seed.cargoMesa,
  bloco: seed.bloco,
  anoEleicao: seed.anoEleicao,
  votosEleicao: seed.votosEleicao,
  biografiaCurta: seed.biografiaCurta,
  telefoneGab: seed.telefoneGab,
  email: seed.email,
  regiaoBase: seed.regiaoBase,
  historico: {
    '2023': generateYearData(seed, '2023'),
    '2024': generateYearData(seed, '2024'),
    '2025': generateYearData(seed, '2025')
  }
}));
