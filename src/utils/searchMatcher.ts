/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const normalizeSearchText = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

interface TopicDefinition {
  key: string;
  triggerPhrases: string[];
  matchKeywords: string[];
}

const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    key: 'saude',
    triggerPhrases: [
      '10 - saude',
      '10-saude',
      '10 saude',
      'saude',
      'saude publica',
      'hospital',
      'ubs',
      'upa',
      'hrc',
      'sus',
      'enfermagem',
      'atencao basica'
    ],
    matchKeywords: [
      'saude',
      'hospital',
      'ubs',
      'upa',
      'sus',
      'enfermagem',
      'medico',
      'psicossocial',
      'hrc',
      '10 - saude',
      'saude mental',
      'saude materno'
    ]
  },
  {
    key: 'educacao',
    triggerPhrases: [
      '12 - educacao',
      '12-educacao',
      '12 educacao',
      'educacao',
      'educacao basica',
      'escola',
      'seedf',
      'creche',
      'primeira infancia'
    ],
    matchKeywords: [
      'educacao',
      'escola',
      'seedf',
      'ensino',
      'creche',
      'infancia',
      'pedagog',
      'chromebook',
      'cepi',
      '12 - educacao'
    ]
  },
  {
    key: 'urbanismo',
    triggerPhrases: [
      '15 - urbanismo',
      '15-urbanismo',
      '15 urbanismo',
      'urbanismo',
      'obras',
      'asfalto',
      'novacap',
      'regularizacao fundiaria',
      'pdot'
    ],
    matchKeywords: [
      'urbanismo',
      'asfalto',
      'novacap',
      'pavimentacao',
      'drenagem',
      'pdot',
      'regularizacao',
      'calcada',
      'iluminacao',
      'led',
      'obras',
      '15 - urbanismo'
    ]
  },
  {
    key: 'seguranca',
    triggerPhrases: [
      '06 - seguranca',
      '06-seguranca',
      '06 seguranca',
      'seguranca',
      'seguranca publica',
      'policia',
      'pcdf',
      'pmdf',
      'bombeiros',
      'cbmdf'
    ],
    matchKeywords: [
      'seguranca',
      'policia',
      'pcdf',
      'pmdf',
      'bombeiro',
      'cbmdf',
      'defesa civil',
      'crime',
      '06 - seguranca',
      'tornozeleira'
    ]
  },
  {
    key: 'mulher',
    triggerPhrases: [
      'mulher',
      'defesa da mulher',
      'mulheres',
      'nao se cale',
      'maria da penha',
      'feminicidio'
    ],
    matchKeywords: [
      'mulher',
      'mulheres',
      'feminicidio',
      'maria da penha',
      'nao se cale',
      'assedio',
      'violencia contra mulheres',
      'violencia domestica',
      'genero'
    ]
  },
  {
    key: 'transporte',
    triggerPhrases: [
      'transporte',
      'mobilidade',
      'passe livre',
      'onibus',
      'metro'
    ],
    matchKeywords: [
      'transporte',
      'mobilidade',
      'passe livre',
      'metro',
      'onibus',
      'tarifa'
    ]
  },
  {
    key: 'assistencia',
    triggerPhrases: [
      '08 - assistencia social',
      '08 assistencia',
      'assistencia social',
      'cras',
      'sedes',
      'vulnerabilidade'
    ],
    matchKeywords: [
      'assistencia social',
      'cras',
      'sedes',
      'social',
      'acolhimento',
      '08 - assistencia'
    ]
  },
  {
    key: 'cultura',
    triggerPhrases: [
      '13 - cultura',
      'cultura',
      'periferia',
      'galpao cultural',
      'juventude viva'
    ],
    matchKeywords: [
      'cultura',
      'periferia',
      'galpao',
      'musica',
      'hip hop',
      '13 - cultura'
    ]
  },
  {
    key: 'esporte',
    triggerPhrases: [
      '27 - desporto',
      'desporto',
      'esporte',
      'lazer',
      'quadra',
      'grama sintetica'
    ],
    matchKeywords: [
      'esporte',
      'desporto',
      'lazer',
      'quadra',
      'grama sintetica',
      'poliesportiva',
      '27 - desporto'
    ]
  },
  {
    key: 'saneamento',
    triggerPhrases: [
      'saneamento',
      'agua',
      'esgoto',
      'caesb'
    ],
    matchKeywords: [
      'saneamento',
      'caesb',
      'agua',
      'esgoto',
      'adutora'
    ]
  }
];

/**
 * Checks if a searchable text matches a user's search query,
 * supporting smart topic resolution (e.g. '10 - Saúde' matches health PLs, amendments, and deputies),
 * accent-insensitive matching, and clean tokenization.
 */
export function matchesSearch(searchableText: string, query: string): boolean {
  if (!query || !query.trim()) return true;

  const normTarget = normalizeSearchText(searchableText);
  const normQuery = normalizeSearchText(query);

  // 1. Direct substring match
  if (normTarget.includes(normQuery)) {
    return true;
  }

  // 2. Clean punctuation from query to check clean phrase
  const cleanQueryPhrase = normQuery.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanQueryPhrase.length > 2 && normTarget.includes(cleanQueryPhrase)) {
    return true;
  }

  // 3. Topic-based matching (e.g. '10 - Saúde', '12 - Educação', 'Defesa da Mulher', 'Urbanismo')
  for (const topic of TOPIC_DEFINITIONS) {
    const isTopicTriggered = topic.triggerPhrases.some(phrase => {
      return normQuery === phrase || normQuery.includes(phrase) || phrase.includes(normQuery);
    });

    if (isTopicTriggered) {
      const hasTopicMatch = topic.matchKeywords.some(keyword => normTarget.includes(keyword));
      if (hasTopicMatch) {
        return true;
      }
    }
  }

  // 4. Token-based matching (excluding common stop words and standalone numbers like LOA function codes when accompanying words exist)
  const stopWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'e', 'a', 'o', 'para', 'com']);
  const rawTokens = cleanQueryPhrase.split(/\s+/).filter(t => t.length > 0 && !stopWords.has(t));

  if (rawTokens.length === 0) return true;

  // If query had a numeric LOA prefix like '10' from '10 saude' or '12' from '12 educacao'
  // filter out the number if there are other descriptive words
  const hasDescriptiveWords = rawTokens.some(t => isNaN(Number(t)));
  const effectiveTokens = hasDescriptiveWords
    ? rawTokens.filter(t => isNaN(Number(t)) || t.length > 2)
    : rawTokens;

  // All effective tokens must match
  return effectiveTokens.every(token => normTarget.includes(token));
}
