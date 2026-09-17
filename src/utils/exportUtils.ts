/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Deputy, YearKey, PropositionItem, AmendmentItem, RollCallVote, ActiveTab } from '../types';
import { getDeputyMetrics } from '../data/cldfData';
import { CLDF_ANNUAL_CALENDARS, WEEKLY_SCHEDULE_RULES, COMMISSIONS_SCHEDULE } from '../data/cldfCalendarData';

export interface ExportContext {
  activeTab: ActiveTab;
  selectedYear: YearKey;
  searchQuery?: string;
  selectedParty?: string;
  deputies: Deputy[];
  propositions?: PropositionItem[];
  amendments?: AmendmentItem[];
  votes?: RollCallVote[];
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports current view or complete dataset to structured CSV
 */
export function exportToCSV(ctx: ExportContext) {
  const { activeTab, selectedYear, deputies, propositions = [], amendments = [], votes = [] } = ctx;
  const yearLabel = selectedYear === 'all' ? '2023-2025' : selectedYear;

  let headers: string[] = [];
  let rows: string[][] = [];
  let filename = `cldf_${activeTab}_${yearLabel}.csv`;

  switch (activeTab) {
    case 'overview':
    case 'deputies': {
      headers = [
        'Deputado',
        'Nome_Completo',
        'Partido',
        'Bloco',
        'Cargo_Mesa',
        'Regiao_Base',
        'Votos_Eleicao',
        'Ano_Referencia',
        'Proposicoes_Total',
        'Projetos_Lei_PL',
        'Emendas_Indicadas_R$',
        'Emendas_Pagas_R$',
        'Taxa_Execucao_Emendas_%',
        'Presenca_Plenario_%',
        'Presencas_Plenario',
        'Sessoes_Totais_Plenario',
        'Ordinarias_Presencas',
        'Ordinarias_Totais',
        'Extraordinarias_Presencas',
        'Extraordinarias_Totais',
        'Solenes_Presencas',
        'Solenes_Totais',
        'Faltas_Justificadas',
        'Faltas_Nao_Justificadas',
        'Comissao_Principal',
        'Presenca_Comissao_%',
        'Total_Votacoes',
        'Votos_Sim',
        'Votos_Nao',
        'Abstencoes',
        'Ausencias'
      ];
      rows = deputies.map(dep => {
        const m = getDeputyMetrics(dep, selectedYear);
        const disc = m.presenca.plenario.discriminacao;
        return [
          `"${dep.nomeParlamentar}"`,
          `"${dep.nomeCompleto}"`,
          `"${dep.partido}"`,
          `"${dep.bloco || 'Independente'}"`,
          `"${dep.cargoMesa || 'Nenhum'}"`,
          `"${dep.regiaoBase}"`,
          String(dep.votosEleicao),
          `"${yearLabel}"`,
          String(m.proposicoes.total),
          String(m.proposicoes.pl),
          String(m.emendas.indicado),
          String(m.emendas.pago),
          String(m.emendas.taxaExecucao),
          String(m.presenca.plenario.taxaAssiduidade),
          String(m.presenca.plenario.presencas),
          String(m.presenca.plenario.sessoesTotais),
          String(disc?.ordinarias.presencas ?? 0),
          String(disc?.ordinarias.total ?? 0),
          String(disc?.extraordinarias.presencas ?? 0),
          String(disc?.extraordinarias.total ?? 0),
          String(disc?.solenesEEspeciais.presencas ?? 0),
          String(disc?.solenesEEspeciais.total ?? 0),
          String(m.presenca.plenario.faltasJustificadas),
          String(m.presenca.plenario.faltasNaoJustificadas),
          `"${m.presenca.comissoes[0]?.nome || ''}"`,
          String(m.presenca.comissoes[0]?.taxaAssiduidade ?? 0),
          String(m.votacoes.totalVotacoes),
          String(m.votacoes.votosSim),
          String(m.votacoes.votosNao),
          String(m.votacoes.abstencoes),
          String(m.votacoes.ausencias)
        ];
      });
      break;
    }

    case 'propositions': {
      headers = [
        'Codigo',
        'Tipo',
        'Tipo_Descricao',
        'Numero',
        'Ano',
        'Autor_Parlamentar',
        'Autor_Partido',
        'Ementa',
        'Data_Apresentacao',
        'Status_Tramitacao',
        'Classificacao_Oficial',
        'Subclassificacao',
        'Tramitacao_Atual',
        'Tags'
      ];
      rows = propositions.map(p => [
        `"${p.codigo}"`,
        `"${p.tipo}"`,
        `"${p.tipoDescricao}"`,
        String(p.numero),
        String(p.ano),
        `"${p.autorNome}"`,
        `"${p.autorPartido}"`,
        `"${(p.ementa || '').replace(/"/g, '""')}"`,
        `"${p.dataApresentacao}"`,
        `"${p.status}"`,
        `"${p.classificacaoOficial}"`,
        `"${p.subclassificacao || ''}"`,
        `"${p.tramitacaoAtual}"`,
        `"${p.tags.join('; ')}"`
      ]);
      break;
    }

    case 'amendments': {
      headers = [
        'Numero_Emenda',
        'Tipo_Emenda',
        'Ano',
        'Autor_Parlamentar',
        'Autor_Partido',
        'Funcao_Governo',
        'Subfuncao',
        'Orgao_Executor',
        'Regiao_Administrativa',
        'Objeto_Gasto',
        'Valor_Indicado_R$',
        'Valor_Empenhado_R$',
        'Valor_Liquidado_R$',
        'Valor_Pago_R$',
        'Taxa_Execucao_%',
        'Status_Execucao',
        'Classificacao_Oficial',
        'Tags'
      ];
      rows = amendments.map(a => [
        `"${a.numeroEmenda}"`,
        `"${a.tipo}"`,
        String(a.ano),
        `"${a.autorNome}"`,
        `"${a.autorPartido}"`,
        `"${a.funcaoGoverno}"`,
        `"${a.subfuncao}"`,
        `"${a.orgaoExecutor}"`,
        `"${a.regiaoAdministrativa}"`,
        `"${(a.objeto || '').replace(/"/g, '""')}"`,
        String(a.valorIndicado),
        String(a.valorEmpenhado),
        String(a.valorLiquidado),
        String(a.valorPago),
        String(a.taxaExecucao),
        `"${a.statusExecucao}"`,
        `"${a.classificacaoOficial}"`,
        `"${a.tags.join('; ')}"`
      ]);
      break;
    }

    case 'attendance':
    case 'calendar': {
      headers = [
        'Deputado',
        'Partido',
        'Ano_Referencia',
        'Assiduidade_Geral_%',
        'Sessoes_Presencas',
        'Sessoes_Totais_Convocadas',
        'Ordinarias_Presencas',
        'Ordinarias_Totais',
        'Ordinarias_%',
        'Extraordinarias_Presencas',
        'Extraordinarias_Totais',
        'Extraordinarias_%',
        'Solenes_Presencas',
        'Solenes_Totais',
        'Faltas_Justificadas',
        'Faltas_Injustificadas',
        'Comissao_Permanente',
        'Comissao_Cargo',
        'Comissao_Presencas',
        'Comissao_Reunioes_Totais',
        'Comissao_Assiduidade_%'
      ];
      rows = deputies.map(dep => {
        const m = getDeputyMetrics(dep, selectedYear);
        const disc = m.presenca.plenario.discriminacao;
        const com = m.presenca.comissoes[0];
        return [
          `"${dep.nomeParlamentar}"`,
          `"${dep.partido}"`,
          `"${yearLabel}"`,
          String(m.presenca.plenario.taxaAssiduidade),
          String(m.presenca.plenario.presencas),
          String(m.presenca.plenario.sessoesTotais),
          String(disc?.ordinarias.presencas ?? 0),
          String(disc?.ordinarias.total ?? 0),
          String(disc?.ordinarias.taxa ?? 0),
          String(disc?.extraordinarias.presencas ?? 0),
          String(disc?.extraordinarias.total ?? 0),
          String(disc?.extraordinarias.taxa ?? 0),
          String(disc?.solenesEEspeciais.presencas ?? 0),
          String(disc?.solenesEEspeciais.total ?? 0),
          String(m.presenca.plenario.faltasJustificadas),
          String(m.presenca.plenario.faltasNaoJustificadas),
          `"${com?.nome || ''}"`,
          `"${com?.cargo || ''}"`,
          String(com?.presencas ?? 0),
          String(com?.reunioesTotais ?? 0),
          String(com?.taxaAssiduidade ?? 0)
        ];
      });
      break;
    }

    case 'voting': {
      headers = [
        'Codigo_Votacao',
        'Titulo',
        'Data',
        'Ano',
        'Categoria',
        'Resultado',
        'Votos_Sim',
        'Votos_Nao',
        'Abstencoes',
        'Ausencias',
        'Ementa'
      ];
      rows = votes.map(v => [
        `"${v.codigo}"`,
        `"${v.titulo.replace(/"/g, '""')}"`,
        `"${v.data}"`,
        `"${v.ano}"`,
        `"${v.categoria}"`,
        `"${v.resultado}"`,
        String(v.votosSim),
        String(v.votosNao),
        String(v.abstencoes),
        String(v.ausencias),
        `"${(v.ementa || '').replace(/"/g, '""')}"`
      ]);
      break;
    }

    case 'sources': {
      headers = ['Modulo', 'Descricao', 'URL_Oficial'];
      rows = [
        ['Portal da Transparência CLDF', 'Dados de folha, compras, atas e diários', 'https://transparencia.cl.df.gov.br'],
        ['Sistema de Apoio ao Processo Legislativo (SAPL)', 'Tramitação legislativa e matérias', 'https://sapl.cl.df.gov.br'],
        ['SIGGO / Siga-DF Orçamento', 'Execução orçamentária de emendas parlamentares', 'https://www.siggo.df.gov.br'],
        ['Painel de Sessões e Presença', 'Logs biométricos e atas de plenário', 'https://www.cl.df.gov.br/painel-eletronico']
      ];
      break;
    }
  }

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generates an executive, highly formatted, printable HTML/PDF report
 * that opens directly in a new print-ready window with window.print() trigger
 */
export function exportToPDF(ctx: ExportContext) {
  const { activeTab, selectedYear, deputies, propositions = [], amendments = [], votes = [] } = ctx;
  const yearLabel = selectedYear === 'all' ? 'Legislatura Completa (2023-2025)' : `Exercício ${selectedYear}`;
  const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  let tabTitle = 'Relatório Geral do Observatório';
  let contentHtml = '';

  if (activeTab === 'overview' || activeTab === 'deputies') {
    tabTitle = 'Quadro Geral de Desempenho Parlamentar';
    const rowsHtml = deputies.map(d => {
      const m = getDeputyMetrics(d, selectedYear);
      return `
        <tr>
          <td style="padding: 6px 8px; font-weight: 600;">${d.nomeParlamentar}</td>
          <td style="padding: 6px 8px; text-align: center;">${d.partido}</td>
          <td style="padding: 6px 8px;">${d.regiaoBase}</td>
          <td style="padding: 6px 8px; text-align: right;">${m.proposicoes.total}</td>
          <td style="padding: 6px 8px; text-align: right;">${m.proposicoes.pl}</td>
          <td style="padding: 6px 8px; text-align: right;">R$ ${(m.emendas.indicado / 1000000).toFixed(1)} mi</td>
          <td style="padding: 6px 8px; text-align: right;">R$ ${(m.emendas.pago / 1000000).toFixed(1)} mi</td>
          <td style="padding: 6px 8px; text-align: right; font-weight: bold;">${m.emendas.taxaExecucao}%</td>
          <td style="padding: 6px 8px; text-align: right; font-weight: bold; color: ${m.presenca.plenario.taxaAssiduidade >= 95 ? '#047857' : '#1e293b'};">${m.presenca.plenario.taxaAssiduidade}%</td>
          <td style="padding: 6px 8px; text-align: center;">${m.presenca.plenario.presencas}/${m.presenca.plenario.sessoesTotais}</td>
        </tr>
      `;
    }).join('');

    contentHtml = `
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 8px; text-align: left;">Parlamentar</th>
            <th style="padding: 8px; text-align: center;">Partido</th>
            <th style="padding: 8px; text-align: left;">Região Base</th>
            <th style="padding: 8px; text-align: right;">Props.</th>
            <th style="padding: 8px; text-align: right;">PLs</th>
            <th style="padding: 8px; text-align: right;">Emendas Ind.</th>
            <th style="padding: 8px; text-align: right;">Emendas Pagas</th>
            <th style="padding: 8px; text-align: right;">Execução</th>
            <th style="padding: 8px; text-align: right;">Assiduidade</th>
            <th style="padding: 8px; text-align: center;">Presenças/Sessões</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  } else if (activeTab === 'attendance') {
    tabTitle = 'Relatório Oficial de Assiduidade e Frequência Plenária';
    const cal = selectedYear !== 'all' ? CLDF_ANNUAL_CALENDARS[selectedYear] : null;

    const rowsHtml = deputies.map(d => {
      const m = getDeputyMetrics(d, selectedYear);
      const disc = m.presenca.plenario.discriminacao;
      const com = m.presenca.comissoes[0];
      return `
        <tr>
          <td style="padding: 6px 8px; font-weight: 600;">${d.nomeParlamentar}</td>
          <td style="padding: 6px 8px; text-align: center;">${d.partido}</td>
          <td style="padding: 6px 8px; text-align: center; font-weight: bold; background: #fef3c7;">${m.presenca.plenario.taxaAssiduidade}%</td>
          <td style="padding: 6px 8px; text-align: center;">${m.presenca.plenario.presencas} / ${m.presenca.plenario.sessoesTotais}</td>
          <td style="padding: 6px 8px; text-align: center;">${disc?.ordinarias ? `${disc.ordinarias.presencas}/${disc.ordinarias.total} (${disc.ordinarias.taxa}%)` : '-'}</td>
          <td style="padding: 6px 8px; text-align: center;">${disc?.extraordinarias ? `${disc.extraordinarias.presencas}/${disc.extraordinarias.total} (${disc.extraordinarias.taxa}%)` : '-'}</td>
          <td style="padding: 6px 8px; text-align: center;">${disc?.solenesEEspeciais ? `${disc.solenesEEspeciais.presencas}/${disc.solenesEEspeciais.total}` : '-'}</td>
          <td style="padding: 6px 8px; text-align: center; color: #1d4ed8;">${m.presenca.plenario.faltasJustificadas}</td>
          <td style="padding: 6px 8px; text-align: center; color: #be123c;">${m.presenca.plenario.faltasNaoJustificadas}</td>
          <td style="padding: 6px 8px;">${com?.nome || ''}</td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 600;">${com?.taxaAssiduidade ?? 0}%</td>
        </tr>
      `;
    }).join('');

    contentHtml = `
      <div style="background: #f8fafc; border-left: 4px solid #d97706; padding: 10px 14px; margin-top: 10px; font-size: 11px;">
        <strong>Critério Regimental do Denominador:</strong> O total de sessões do Plenário contempla o calendário integral das sessões 
        Ordinárias convocadas às terças, quartas e quintas-feiras (15h), somadas às sessões Extraordinárias e Solenes regimentais. 
        ${cal ? `Exercício ${cal.ano}: ${cal.totalSessoesPlenariasEsperadas} sessões plenárias convocadas (${cal.sessoesOrdinariasPrevistas} ordinárias, ${cal.sessoesExtraordinariasTipicas} extraordinárias, ${cal.sessoesSolenesEspeciais} solenes).` : 'Legislatura 2023-2025: Denominador consolidado de 538 sessões plenárias convocadas.'}
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 15px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 7px; text-align: left;">Parlamentar</th>
            <th style="padding: 7px; text-align: center;">Partido</th>
            <th style="padding: 7px; text-align: center;">Assiduidade Global</th>
            <th style="padding: 7px; text-align: center;">Total Presenças</th>
            <th style="padding: 7px; text-align: center;">Ordinárias</th>
            <th style="padding: 7px; text-align: center;">Extraordinárias</th>
            <th style="padding: 7px; text-align: center;">Solenes</th>
            <th style="padding: 7px; text-align: center;">Faltas Just.</th>
            <th style="padding: 7px; text-align: center;">Faltas Injust.</th>
            <th style="padding: 7px; text-align: left;">Comissão</th>
            <th style="padding: 7px; text-align: center;">% Com.</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  } else if (activeTab === 'calendar') {
    tabTitle = 'Calendário Oficial de Funcionamento: Plenário e Comissões';
    const scheduleHtml = WEEKLY_SCHEDULE_RULES.map(r => `
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; color: #0f172a; font-size: 12px;">
          <span>${r.dayOfWeek} — ${r.instancia}</span>
          <span style="color: #475569; font-weight: normal;">${r.turno}</span>
        </div>
        <p style="margin: 4px 0 6px 0; color: #334155; font-size: 11px;">${r.descricao}</p>
        <ul style="margin: 0; padding-left: 18px; color: #475569; font-size: 10.5px;">
          ${r.reunioesPrincipais.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const commHtml = COMMISSIONS_SCHEDULE.map(c => `
      <tr>
        <td style="padding: 6px 8px; font-weight: bold;">${c.sigla}</td>
        <td style="padding: 6px 8px;">${c.nome}</td>
        <td style="padding: 6px 8px;">${c.diaSemana} (${c.horario})</td>
        <td style="padding: 6px 8px;">${c.local}</td>
        <td style="padding: 6px 8px;">${c.presidenteAtual}</td>
        <td style="padding: 6px 8px; text-align: center;">~${c.frequenciaAnualEstimada} / ano</td>
      </tr>
    `).join('');

    contentHtml = `
      <div style="margin-top: 15px;">
        <h3 style="font-size: 13px; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 10px;">
          Grade Semanal Regimental da Câmara Legislativa do Distrito Federal
        </h3>
        ${scheduleHtml}

        <h3 style="font-size: 13px; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px;">
          Quadro Oficial das Comissões Permanentes da CLDF
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="padding: 7px; text-align: left;">Sigla</th>
              <th style="padding: 7px; text-align: left;">Comissão</th>
              <th style="padding: 7px; text-align: left;">Dia & Horário</th>
              <th style="padding: 7px; text-align: left;">Local</th>
              <th style="padding: 7px; text-align: left;">Presidência</th>
              <th style="padding: 7px; text-align: center;">Reuniões Previstas</th>
            </tr>
          </thead>
          <tbody>
            ${commHtml}
          </tbody>
        </table>
      </div>
    `;
  } else if (activeTab === 'propositions') {
    tabTitle = 'Catálogo Oficial de Proposições Legislativas';
    const rowsHtml = propositions.slice(0, 150).map(p => `
      <tr>
        <td style="padding: 5px 8px; font-weight: bold; white-space: nowrap;">${p.codigo}</td>
        <td style="padding: 5px 8px; white-space: nowrap;">${p.autorNome} (${p.autorPartido})</td>
        <td style="padding: 5px 8px; font-size: 10px;">${p.ementa}</td>
        <td style="padding: 5px 8px; white-space: nowrap;">${p.classificacaoOficial}</td>
        <td style="padding: 5px 8px; white-space: nowrap; font-weight: 600;">${p.status}</td>
      </tr>
    `).join('');

    contentHtml = `
      <p style="font-size: 11px; color: #475569; margin-top: 5px;">
        Exibindo ${Math.min(150, propositions.length)} de ${propositions.length} proposições registradas para os filtros ativos.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 6px; text-align: left;">Código</th>
            <th style="padding: 6px; text-align: left;">Autor</th>
            <th style="padding: 6px; text-align: left;">Ementa</th>
            <th style="padding: 6px; text-align: left;">Tema / Área</th>
            <th style="padding: 6px; text-align: left;">Situação</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  } else if (activeTab === 'amendments') {
    tabTitle = 'Execução de Emendas Orçamentárias Parlamentares';
    const rowsHtml = amendments.slice(0, 150).map(a => `
      <tr>
        <td style="padding: 5px 8px; font-weight: bold; white-space: nowrap;">${a.numeroEmenda}</td>
        <td style="padding: 5px 8px; white-space: nowrap;">${a.autorNome} (${a.autorPartido})</td>
        <td style="padding: 5px 8px;">${a.regiaoAdministrativa}</td>
        <td style="padding: 5px 8px; font-size: 10px;">${a.objeto}</td>
        <td style="padding: 5px 8px; text-align: right; white-space: nowrap;">R$ ${a.valorIndicado.toLocaleString('pt-BR')}</td>
        <td style="padding: 5px 8px; text-align: right; white-space: nowrap;">R$ ${a.valorPago.toLocaleString('pt-BR')}</td>
        <td style="padding: 5px 8px; text-align: right; font-weight: bold;">${a.taxaExecucao}%</td>
        <td style="padding: 5px 8px; white-space: nowrap;">${a.statusExecucao}</td>
      </tr>
    `).join('');

    contentHtml = `
      <p style="font-size: 11px; color: #475569; margin-top: 5px;">
        Exibindo ${Math.min(150, amendments.length)} de ${amendments.length} emendas orçamentárias registradas.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 6px; text-align: left;">Emenda</th>
            <th style="padding: 6px; text-align: left;">Autor</th>
            <th style="padding: 6px; text-align: left;">Região</th>
            <th style="padding: 6px; text-align: left;">Objeto</th>
            <th style="padding: 6px; text-align: right;">Indicado</th>
            <th style="padding: 6px; text-align: right;">Pago</th>
            <th style="padding: 6px; text-align: right;">% Exec.</th>
            <th style="padding: 6px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  } else if (activeTab === 'voting') {
    tabTitle = 'Matérias e Votações Nominais em Plenário';
    const rowsHtml = votes.map(v => `
      <tr>
        <td style="padding: 6px 8px; font-weight: bold; white-space: nowrap;">${v.codigo}</td>
        <td style="padding: 6px 8px;"><strong>${v.titulo}</strong><br/><span style="font-size: 9.5px; color: #475569;">${v.ementa}</span></td>
        <td style="padding: 6px 8px; text-align: center; white-space: nowrap;">${v.data}</td>
        <td style="padding: 6px 8px; text-align: center; font-weight: bold; color: ${v.resultado === 'Aprovado' ? '#047857' : '#b91c1c'};">${v.resultado}</td>
        <td style="padding: 6px 8px; text-align: center; color: #047857;">${v.votosSim}</td>
        <td style="padding: 6px 8px; text-align: center; color: #b91c1c;">${v.votosNao}</td>
        <td style="padding: 6px 8px; text-align: center;">${v.abstencoes}</td>
        <td style="padding: 6px 8px; text-align: center; color: #64748b;">${v.ausencias}</td>
      </tr>
    `).join('');

    contentHtml = `
      <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 15px;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 7px; text-align: left;">Matéria</th>
            <th style="padding: 7px; text-align: left;">Título / Ementa</th>
            <th style="padding: 7px; text-align: center;">Data</th>
            <th style="padding: 7px; text-align: center;">Resultado</th>
            <th style="padding: 7px; text-align: center;">Sim</th>
            <th style="padding: 7px; text-align: center;">Não</th>
            <th style="padding: 7px; text-align: center;">Abs.</th>
            <th style="padding: 7px; text-align: center;">Aus.</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  } else {
    tabTitle = 'Guia de Fontes Oficiais e Integridade de Dados';
    contentHtml = `
      <div style="font-size: 11px; line-height: 1.6; margin-top: 15px;">
        <p>Este relatório compila informações estruturadas da Câmara Legislativa do Distrito Federal (CLDF), auditadas perante o Diário da Câmara Legislativa (DCL), Sistema SAPL, SIGGO e Portal da Transparência.</p>
      </div>
    `;
  }

  const printDocument = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>${tabTitle} - CLDF (${yearLabel})</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 10mm 12mm 10mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 10px;
          }
          table, th, td {
            border: 1px solid #cbd5e1;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: bold;">Pré-visualização para Impressão / Salvar em PDF</span>
          <div>
            <button onclick="window.print()" style="background: #047857; color: white; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; cursor: pointer; margin-right: 8px;">Imprimir / Salvar PDF</button>
            <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Fechar Janela</button>
          </div>
        </div>

        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 style="margin: 0; font-size: 18px; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px;">
              Observatório Parlamentar da CLDF • 9ª Legislatura
            </h1>
            <h2 style="margin: 4px 0 0 0; font-size: 14px; color: #047857; font-weight: 600;">
              ${tabTitle} — ${yearLabel}
            </h2>
          </div>
          <div style="text-align: right; font-size: 10px; color: #64748b;">
            <span>Gerado em: ${now}</span><br/>
            <span>Fonte: Dados Abertos CLDF, SAPL, DCL & SIGGO</span>
          </div>
        </div>

        ${contentHtml}

        <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 9.5px; color: #64748b; display: flex; justify-content: space-between;">
          <span>Observatório Parlamentar CLDF — Ferramenta de Fiscalização Cívica e Controle Social</span>
          <span>Página 1</span>
        </div>

        <script>
          // Automatically trigger system print dialog after loading
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printDocument);
    printWindow.document.close();
  }
}
