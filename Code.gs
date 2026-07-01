/**
 * Checklist FV SENAI HUB - Google Apps Script
 * Cole este código em Extensões > Apps Script dentro da sua planilha Google.
 * Depois execute setupPlanilha() uma vez e publique como Aplicativo da Web.
 */

const ABA_REGISTROS = 'Registros_Praticas';
const ABA_PROFESSORES = 'Professores';
const ABA_TURMAS = 'Turmas';
const ABA_AULAS = 'Aulas_Praticas';
const ABA_VALIDACOES = 'Validacoes_Coordenador';
const ABA_DASHBOARD = 'Dashboard_Coordenacao';
const ABA_LOGS = 'Logs';

const CABECALHO_REGISTROS = [
  'Chave', 'ID', 'Enviado em', 'Data da aula', 'Professor', 'Turma', 'Curso/UC',
  'Aula nº', 'Tema', 'Objetivo', 'Total itens', 'Itens concluídos', 'Progresso %',
  'Status', 'Checklist JSON', 'Itens marcados', 'Observações', 'Versão app', 'Origem'
];

const CABECALHO_PROFESSORES = ['Nome', 'E-mail', 'Perfil', 'Status'];
const CABECALHO_TURMAS = ['Turma', 'Curso/UC', 'Turno', 'Professor responsável', 'Status'];
const CABECALHO_AULAS = ['Aula', 'Tema', 'Objetivo', 'Evidência esperada'];
const CABECALHO_VALIDACOES = ['Data validação', 'Chave registro', 'Coordenador', 'Status validação', 'Observação do coordenador'];
const CABECALHO_LOGS = ['Timestamp', 'Tipo', 'Mensagem', 'Origem', 'Payload JSON'];

const AULAS_PADRAO = [
  [14, 'Segurança, APR, ordem de serviço e reconhecimento do sistema fotovoltaico', 'Preparar o aluno para atuar no laboratório com segurança, interpretando documentos e componentes.', 'APR preenchida, checklist de materiais e identificação dos componentes.'],
  [15, 'Cabos solares, conectores MC4 e crimpagem', 'Preparar cabos solares e instalar conectores MC4 com polaridade correta.', 'Cabos solares com conectores MC4 instalados, testados e identificados.'],
  [16, 'Montagem da estrutura de fixação dos módulos', 'Montar estrutura fotovoltaica com alinhamento, fixação e torque.', 'Estrutura montada, alinhada e inspecionada.'],
  [17, 'Instalação física dos módulos fotovoltaicos', 'Instalar módulos na estrutura respeitando manuseio, fixação e organização dos cabos.', 'Módulos instalados, fixados e com cabos organizados.'],
  [18, 'Associação de módulos: série, paralelo e strings', 'Montar strings com polaridade correta e medições seguras.', 'String montada, medida e identificada.'],
  [19, 'Montagem e ligação da string box CC', 'Instalar string box CC e dispositivos de proteção.', 'String box instalada, conectada e testada.'],
  [20, 'Instalação do inversor on-grid e quadro CA', 'Instalar inversor conectado à rede com proteção CA.', 'Inversor instalado e quadro CA montado.'],
  [21, 'Testes iniciais e partida do sistema on-grid em bancada', 'Realizar testes de pré-energização e partida segura do sistema.', 'Relatório de partida com medições e status do inversor.'],
  [22, 'Sistema fotovoltaico off-grid: controlador, baterias e inversor isolado', 'Montar sistema isolado com controlador, baterias, inversor e cargas.', 'Sistema off-grid funcionando com medições registradas.'],
  [23, 'Sistema fotovoltaico híbrido com baterias e cargas essenciais', 'Operar sistema híbrido com FV, rede, baterias e backup.', 'Sistema híbrido com backup de cargas essenciais testado.'],
  [24, 'Configuração de monitoramento, datalogger e aplicativo', 'Configurar monitoramento do inversor e interpretar dados de geração.', 'Monitoramento configurado e dados visualizados.'],
  [25, 'Comissionamento do sistema fotovoltaico', 'Validar tecnicamente o sistema instalado por inspeções, medições e testes.', 'Checklist e relatório de comissionamento.'],
  [26, 'Manutenção preventiva e preditiva', 'Executar inspeção, limpeza, reaperto, análise térmica e plano de manutenção.', 'Checklist de manutenção e plano simples de manutenção.'],
  [27, 'Diagnóstico de falhas e manutenção corretiva', 'Localizar falhas, corrigir e registrar a manutenção.', 'Relatório de diagnóstico e falha corrigida.'],
  [28, 'Projeto prático final: montagem, testes e entrega técnica', 'Integrar montagem, testes, monitoramento, comissionamento e entrega técnica.', 'Sistema completo montado, testado e apresentado pela equipe.']
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Checklist FV')
    .addItem('Configurar abas', 'setupPlanilha')
    .addToUi();
}

function setupPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  prepararAba(ss, ABA_REGISTROS, CABECALHO_REGISTROS);
  prepararAba(ss, ABA_PROFESSORES, CABECALHO_PROFESSORES);
  prepararAba(ss, ABA_TURMAS, CABECALHO_TURMAS);
  prepararAba(ss, ABA_AULAS, CABECALHO_AULAS);
  prepararAba(ss, ABA_VALIDACOES, CABECALHO_VALIDACOES);
  prepararAba(ss, ABA_LOGS, CABECALHO_LOGS);
  prepararDashboard(ss);

  const aulas = ss.getSheetByName(ABA_AULAS);
  if (aulas.getLastRow() < 2) {
    aulas.getRange(2, 1, AULAS_PADRAO.length, AULAS_PADRAO[0].length).setValues(AULAS_PADRAO);
  }

  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_REGISTROS));
  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_AULAS));
  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_PROFESSORES));
  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_TURMAS));
  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_VALIDACOES));
  aplicarFormatacaoBasica_(ss.getSheetByName(ABA_LOGS));

  return 'Planilha configurada com sucesso.';
}

function prepararAba(ss, nome, cabecalho) {
  let sheet = ss.getSheetByName(nome);
  if (!sheet) sheet = ss.insertSheet(nome);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  } else {
    const atual = sheet.getRange(1, 1, 1, cabecalho.length).getValues()[0];
    const vazio = atual.every(c => c === '');
    if (vazio) sheet.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, cabecalho.length)
    .setBackground('#0f4b91')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
}

function prepararDashboard(ss) {
  let sh = ss.getSheetByName(ABA_DASHBOARD);
  if (!sh) sh = ss.insertSheet(ABA_DASHBOARD, 0);
  sh.clear();
  sh.getRange('A1:F1').merge().setValue('Dashboard de Acompanhamento das Aulas Práticas Fotovoltaicas')
    .setBackground('#0f4b91').setFontColor('#ffffff').setFontWeight('bold').setFontSize(14).setHorizontalAlignment('center');

  const linhas = [
    ['Indicador', 'Valor'],
    ['Total de registros enviados', '=COUNTA(Registros_Praticas!A2:A)'],
    ['Aulas concluídas', '=COUNTIF(Registros_Praticas!N2:N,"Concluída")'],
    ['Aulas em andamento', '=COUNTIF(Registros_Praticas!N2:N,"Em andamento")'],
    ['Média de progresso', '=IFERROR(AVERAGE(Registros_Praticas!M2:M),0)']
  ];
  sh.getRange(3, 1, linhas.length, 2).setValues(linhas);
  sh.getRange('A3:B3').setBackground('#f04a13').setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange('B7').setNumberFormat('0%');
  sh.getRange('A9').setValue('Use filtros na aba Registros_Praticas para acompanhar por professor, turma, data, aula e status.');
  sh.getRange('A9:F9').merge().setWrap(true).setBackground('#eef5ff');
  sh.autoResizeColumns(1, 6);
}

function aplicarFormatacaoBasica_(sheet) {
  if (!sheet) return;
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  sheet.autoResizeColumns(1, lastCol);
  sheet.getDataRange().setWrap(true).setVerticalAlignment('middle');
}

function doGet(e) {
  return ContentService
    .createTextOutput('Checklist FV SENAI HUB: Web App online. Use o aplicativo HTML para enviar registros via POST.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    setupPlanilha();
    const payload = parsePayload_(e);

    if (payload.tipo === 'teste') {
      registrarLog_('teste', payload.mensagem || 'Teste recebido', payload);
      return resposta_({ ok: true, tipo: 'teste', mensagem: 'Teste recebido com sucesso.' });
    }

    if (payload.tipo !== 'registro_pratica') {
      registrarLog_('erro', 'Tipo de payload não reconhecido', payload);
      return resposta_({ ok: false, erro: 'Tipo de payload não reconhecido.' });
    }

    salvarOuAtualizarRegistro_(payload);
    registrarLog_('registro_pratica', 'Registro salvo/atualizado', { chaveRegistro: payload.chaveRegistro, aulaNumero: payload.aulaNumero });
    return resposta_({ ok: true, mensagem: 'Registro salvo com sucesso.', chaveRegistro: payload.chaveRegistro });
  } catch (erro) {
    registrarLog_('erro', erro.message, { stack: erro.stack });
    return resposta_({ ok: false, erro: erro.message });
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return e && e.parameter ? e.parameter : {};
}

function salvarOuAtualizarRegistro_(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABA_REGISTROS);
  const checklistJson = JSON.stringify(p.checklist || []);
  const row = [
    p.chaveRegistro || '',
    p.id || '',
    p.enviadoEm ? new Date(p.enviadoEm) : new Date(),
    p.dataAula || '',
    p.professor || '',
    p.turma || '',
    p.curso || '',
    Number(p.aulaNumero || 0),
    p.tema || '',
    p.objetivo || '',
    Number(p.totalItens || 0),
    Number(p.itensConcluidos || 0),
    Number(p.progresso || 0) / 100,
    p.status || '',
    checklistJson,
    p.itensMarcadosTexto || '',
    p.observacoes || '',
    p.versaoApp || '',
    p.origem || 'HTML/PWA'
  ];

  const chave = row[0];
  let targetRow = -1;
  const lastRow = sh.getLastRow();
  if (lastRow >= 2 && chave) {
    const chaves = sh.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const idx = chaves.indexOf(chave);
    if (idx >= 0) targetRow = idx + 2;
  }

  if (targetRow > 0) {
    sh.getRange(targetRow, 1, 1, row.length).setValues([row]);
  } else {
    sh.appendRow(row);
    targetRow = sh.getLastRow();
  }

  sh.getRange(targetRow, 3).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sh.getRange(targetRow, 4).setNumberFormat('dd/MM/yyyy');
  sh.getRange(targetRow, 13).setNumberFormat('0%');
}

function registrarLog_(tipo, mensagem, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA_LOGS);
  if (!sh) {
    sh = ss.insertSheet(ABA_LOGS);
    sh.appendRow(CABECALHO_LOGS);
  }
  sh.appendRow([new Date(), tipo, mensagem, 'Apps Script', JSON.stringify(payload || {})]);
}

function resposta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
