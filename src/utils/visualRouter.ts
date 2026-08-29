import { PostConfig, TemplateType } from '../types';

export interface VisualTemplateInfo {
  id: TemplateType;
  officialNumber: number;
  name: string;
  shortName: string;
  tag: string;
  themeUseCases: string;
  icon: string;
  colors: {
    bg: string;
    text: string;
    highlight: string;
    shadow: string;
  };
  defaultSystemTitle: string;
  defaultButtonText: string;
  defaultSticker: PostConfig['sticker'];
}

/**
 * OS 4 TEMPLATES OFICIAIS DO DEPRESSIVOS 2000 (DIRETOR DE ARTE)
 */
export const OFFICIAL_TEMPLATES: Record<string, VisualTemplateInfo> = {
  'cupom-fiscal': {
    id: 'cupom-fiscal',
    officialNumber: 1,
    name: '1. CUPOM FISCAL EXISTENCIAL',
    shortName: 'Cupom Fiscal Existencial',
    tag: 'BOLETOS & GASTOS',
    themeUseCases: 'Gastos, exaustão, consequências de escolhas ruins, boletos, compras impulsivas, ou o "preço emocional" de ser adulto.',
    icon: '🧾',
    colors: {
      bg: '#FDFBF7',
      text: '#1A1A1A',
      highlight: '#FFD700',
      shadow: '#1A1A1A',
    },
    defaultSystemTitle: '*** CUPOM FISCAL EXISTENCIAL ***',
    defaultButtonText: 'PAGAR FATURA',
    defaultSticker: 'none',
  },
  'laudo-medico': {
    id: 'laudo-medico',
    officialNumber: 2,
    name: '2. LAUDO MÉDICO (Janela Windows)',
    shortName: 'Laudo Médico Win98',
    tag: 'DIAGNÓSTICOS & REMÉDIOS',
    themeUseCases: 'Diagnósticos absurdos de saúde mental, ansiedade, terapia, medicamentos (Escitalopram, Zolpidem, Rivotril) e doenças da vida adulta.',
    icon: '🩺',
    colors: {
      bg: '#c0c0c0',
      text: '#1A1A1A',
      highlight: '#FF3333',
      shadow: '#000080',
    },
    defaultSystemTitle: 'Laudo Médico - CID_F32.exe',
    defaultButtonText: 'ACEITAR LAUDO',
    defaultSticker: 'warning',
  },
  'erro-fatal': {
    id: 'erro-fatal',
    officialNumber: 3,
    name: '3. ERRO FATAL (Scanlines CRT)',
    shortName: 'Erro Fatal com Scanlines',
    tag: 'EXPECTATIVA VS REALIDADE',
    themeUseCases: 'Choques de realidade, quebra de expectativas (Expectativa vs. Realidade), crises de idade (Crise dos 30) e surtos repentinos.',
    icon: '❌',
    colors: {
      bg: '#c0c0c0',
      text: '#1A1A1A',
      highlight: '#FF0000',
      shadow: '#FF0000',
    },
    defaultSystemTitle: 'Erro Fatal - crise_dos_30.exe',
    defaultButtonText: 'OK',
    defaultSticker: 'error',
  },
  'nostalgia-social': {
    id: 'nostalgia-social',
    officialNumber: 4,
    name: '4. NOSTALGIA SOCIAL (Orkut / MSN)',
    shortName: 'Nostalgia Social MSN',
    tag: 'RELACIONAMENTOS & STALK',
    themeUseCases: 'Relacionamentos, stalkear ex, interações sociais, solidão, vácuo no WhatsApp e status de humor.',
    icon: '🦋',
    colors: {
      bg: '#E8F1FC',
      text: '#1A1A1A',
      highlight: '#FF007F',
      shadow: '#000080',
    },
    defaultSystemTitle: 'MSN Messenger - Conversa com Crush',
    defaultButtonText: 'CHAMAR ATENÇÃO',
    defaultSticker: 'msn',
  },
};

/**
 * Normaliza qualquer template string para um dos 4 oficiais
 */
export function normalizeToOfficialTemplate(template: string): TemplateType {
  if (template === 'nota-fiscal' || template === 'cupom-fiscal') return 'cupom-fiscal';
  if (template === 'sistema-alerta' || template === 'laudo-medico') return 'laudo-medico';
  if (template === 'erro-fatal') return 'erro-fatal';
  if (template === 'msn-nostalgia' || template === 'nostalgia-social') return 'nostalgia-social';
  
  // Default fallback
  return 'laudo-medico';
}

/**
 * CLASSIFICADOR INTELIGENTE (DIRETOR DE ARTE TRAUMAS.ZIP)
 * Analisa o texto do meme e determina automaticamente qual dos 4 templates oficiais usar.
 */
export function classifyAndRouteVisualTemplate(
  text: string,
  currentConfig?: Partial<PostConfig>
): {
  template: TemplateType;
  templateInfo: VisualTemplateInfo;
  systemTitle: string;
  windowButtonText: string;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
  shadowColor: string;
  sticker: PostConfig['sticker'];
  showScanlines: boolean;
  justification: string;
} {
  const lower = (text || '').toLowerCase();

  // 1. Critérios para CUPOM FISCAL EXISTENCIAL (Gastos, boletos, custos, compras, CLT, dinheiro)
  const cupomKeywords = [
    'gasto', 'gastar', 'gastos', 'comprei', 'comprar', 'compra', 'cartão', 'fatura', 'boleto', 
    'boletos', 'salário', 'dinheiro', 'reais', 'r$', 'preço', 'custo', 'caro', 'barato', 
    'clt', 'trabalho', 'empresa', 'chefe', 'horas extras', 'cansado', 'cansaço', 'exaustão', 
    'acordar cedo', 'aluguel', 'mercado livre', 'frete', 'ifood', 'delivery', 'pagar', 
    'falência', 'pobre', 'conta bancária', 'pix', 'patrão', 'combustível', 'gasolina'
  ];
  const cupomScore = cupomKeywords.reduce((acc, word) => acc + (lower.includes(word) ? 1 : 0), 0);

  // 2. Critérios para LAUDO MÉDICO (Remédios, psiquiatria, terapia, diagnósticos, DSM/CID)
  const laudoKeywords = [
    'remédio', 'remédios', 'escitalopram', 'sertralina', 'rivotril', 'clonazepam', 'zolpidem', 
    'fluoxetina', 'venlafaxina', 'bupropiona', 'quetiapina', 'venvanse', 'ritalina', 'droga',
    'psicólogo', 'psicóloga', 'psiquiatra', 'terapia', 'terapeuta', 'consultório', 'sessão', 
    'laudo', 'cid', 'dsm', 'diagnóstico', 'transtorno', 'ansiedade', 'depressão', 'pânico', 
    'tdah', 'borderline', 'burnout', 'libido', 'doses', 'mg', 'gotas', 'bula', 'efeito colateral',
    'psicanálise', 'freud', 'tarja preta', 'farmácia', 'receita', 'crise de pânico', 'somatizar'
  ];
  const laudoScore = laudoKeywords.reduce((acc, word) => acc + (lower.includes(word) ? 1 : 0), 0);

  // 3. Critérios para ERRO FATAL (Expectativa vs Realidade, Crise dos 30, Choque, Surtos)
  const erroFatalKeywords = [
    'expectativa', 'realidade', 'crise dos 30', '30 anos', '20 anos', 'quando eu tinha', 
    'quando eu era', 'achei que', 'hoje eu', 'na minha cabeça', 'surto', 'surtar', 'surtei', 
    'erro', 'erro fatal', 'falha', 'colapso', 'choque', 'descobri', 'ilusão', 'deu errado', 
    'travar', 'fui de base', 'fui tapeado', 'deu ruim', 'me fudi', 'fudeu', 'pane', 'reiniciar',
    'memória cheia', 'não carrega', 'falência múltipla', 'cringe', 'envelhecer'
  ];
  const erroFatalScore = erroFatalKeywords.reduce((acc, word) => acc + (lower.includes(word) ? 1 : 0), 0);

  // 4. Critérios para NOSTALGIA SOCIAL (Relacionamentos, ex, stalk, vácuo, MSN, Orkut, crush)
  const nostalgiaKeywords = [
    'ex', 'stalk', 'stalkear', 'crush', 'vácuo', 'visualizou', 'mensagem', 'bloqueou', 
    'story', 'stories', 'whatsapp', 'instagram', 'orkut', 'msn', 'subnick', 'nudge', 
    'depoimento', 'topo', 'relacionamento', 'date', 'ficante', 'solidão', 'saudade', 
    'sozinho', 'carente', 'carência', 'responder', 'áudio', 'notificação', 'chamar atenção',
    'chato', 'evanescence', 'depressivo', 'indireta', 'feed', 'direct', 'dm', 'conversa'
  ];
  const nostalgiaScore = nostalgiaKeywords.reduce((acc, word) => acc + (lower.includes(word) ? 1 : 0), 0);

  // Determinar vencedor
  let selectedId: TemplateType = 'laudo-medico';
  let justification = 'Tema relacionado a diagnósticos da vida adulta e saúde mental.';

  const maxScore = Math.max(cupomScore, laudoScore, erroFatalScore, nostalgiaScore);

  if (maxScore > 0) {
    if (cupomScore === maxScore) {
      selectedId = 'cupom-fiscal';
      justification = 'Classificado como Cupom Fiscal Existencial devido ao tema de gastos, boletos, cansaço ou custos emocionais da vida adulta.';
    } else if (erroFatalScore === maxScore) {
      selectedId = 'erro-fatal';
      justification = 'Classificado como Erro Fatal devido ao tema de choque de realidade, expectativa vs realidade ou crise dos 30.';
    } else if (nostalgiaScore === maxScore) {
      selectedId = 'nostalgia-social';
      justification = 'Classificado como Nostalgia Social (MSN/Orkut) devido ao tema de relacionamentos, stalk de ex, vácuo ou interações sociais.';
    } else {
      selectedId = 'laudo-medico';
      justification = 'Classificado como Laudo Médico devido ao tema de farmacologia, psiquiatria, terapia ou ansiedade.';
    }
  } else {
    // Se nenhum gatilho disparou, analisa o texto para fallback semântico
    if (lower.includes('vs') || lower.includes('esperava') || lower.includes('aos 30') || lower.includes('30s')) {
      selectedId = 'erro-fatal';
      justification = 'Detectada quebra de expectativa ou contraste temporal.';
    } else if (lower.includes('amor') || lower.includes('coração') || lower.includes('pessoa') || lower.includes('alguém')) {
      selectedId = 'nostalgia-social';
      justification = 'Detectado tema interpessoal / relacionamento.';
    } else if (lower.includes('vida') || lower.includes('tempo') || lower.includes('dia') || lower.includes('dormir')) {
      selectedId = 'cupom-fiscal';
      justification = 'Detectado tema de rotina e cansaço diário.';
    }
  }

  const info = OFFICIAL_TEMPLATES[selectedId] || OFFICIAL_TEMPLATES['laudo-medico'];

  // Gerar títulos contextuais conforme o template
  let dynamicTitle = info.defaultSystemTitle;
  let dynamicButton = info.defaultButtonText;

  if (selectedId === 'cupom-fiscal') {
    dynamicTitle = '*** CUPOM FISCAL EXISTENCIAL ***';
    dynamicButton = 'TOTAL A PAGAR';
  } else if (selectedId === 'laudo-medico') {
    if (lower.includes('escitalopram')) dynamicTitle = 'Laudo Médico - CID_F32_escitalopram.exe';
    else if (lower.includes('zolpidem')) dynamicTitle = 'Laudo Médico - zolpidem_blackout.exe';
    else if (lower.includes('rivotril') || lower.includes('clonazepam')) dynamicTitle = 'Laudo Médico - rivotril_gotas.exe';
    else if (lower.includes('terapia') || lower.includes('terapeuta')) dynamicTitle = 'Laudo Médico - sessao_terapia.exe';
    else if (lower.includes('ansiedade')) dynamicTitle = 'Laudo Médico - CID_F41_ansiedade.exe';
    else dynamicTitle = 'Laudo Médico - CID_F32.exe';
    dynamicButton = 'ACEITAR LAUDO';
  } else if (selectedId === 'erro-fatal') {
    if (lower.includes('30') || lower.includes('trinta')) dynamicTitle = 'Erro Fatal - crise_dos_30.exe';
    else if (lower.includes('expectativa') || lower.includes('realidade')) dynamicTitle = 'Erro Fatal - expectativa_vs_realidade.exe';
    else dynamicTitle = 'Erro Fatal - memoria_insuficiente.exe';
    dynamicButton = 'OK';
  } else if (selectedId === 'nostalgia-social') {
    if (lower.includes('ex')) dynamicTitle = 'MSN Messenger - Stalkeando Ex (Offline)';
    else if (lower.includes('vácuo') || lower.includes('visualizou')) dynamicTitle = 'MSN Messenger - (No Vácuo Há 3 Dias)';
    else dynamicTitle = 'MSN Messenger - Conversa com Crush';
    dynamicButton = 'CHAMAR ATENÇÃO';
  }

  return {
    template: selectedId,
    templateInfo: info,
    systemTitle: currentConfig?.systemTitle && currentConfig.systemTitle !== 'Alerta do Sistema - recaida.exe' ? currentConfig.systemTitle : dynamicTitle,
    windowButtonText: currentConfig?.windowButtonText && currentConfig.windowButtonText !== 'CHAMAR ATENÇÃO' ? currentConfig.windowButtonText : dynamicButton,
    backgroundColor: info.colors.bg,
    textColor: info.colors.text,
    highlightColor: info.colors.highlight,
    shadowColor: info.colors.shadow,
    sticker: info.defaultSticker,
    showScanlines: selectedId === 'erro-fatal',
    justification,
  };
}
