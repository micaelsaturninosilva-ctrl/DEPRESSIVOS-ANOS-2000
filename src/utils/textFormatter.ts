/**
 * Utilitários para formatação e estruturação de texto de memes
 * Depressivos 2000 & Traumas.zip
 * Garante leitura fluida, coesa e sem frases cortadas ou desconexas
 */

/**
 * Organiza e limpa o texto do meme para garantir leitura instantânea e sem desconexão
 * - Unifica frases contínuas que foram quebradas indevidamente ao meio
 * - Mantém diálogos (Eu: / Psicóloga:) e listas limpas
 * - Garante que setup e punchline tenham pontuação clara se forem separados
 */
export function autoFormatMemeStructure(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  let text = rawText.trim();

  // 1. Normalizar quebras de linha e espaços duplos
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  text = text.replace(/[ \t]+/g, ' ');

  // 2. Se for diálogo ou lista identificada, preservar a estrutura de linhas
  const rawLines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const isDialogOrList = rawLines.some((l) =>
    /^[-•*]|\d+\.|\b(eu|ela|ele|mãe|pai|chefe|psicóloga|terapeuta|médico|uber|atendente|banco|crush|psiquiatra)\s*:/i.test(l)
  );

  if (isDialogOrList) {
    // Formata cada linha de diálogo limpa
    return rawLines.join('\n');
  }

  // 3. Verificar se há dois pontos (Setup: Punchline)
  // Ex: "QUANDO A BATERIA SOCIAL ACABA: SUMO SEM AVISAR NINGUÉM"
  if (text.includes(':') && !text.includes('\n')) {
    const parts = text.split(':');
    if (parts.length === 2 && parts[0].trim().length > 3 && parts[1].trim().length > 3) {
      return `${parts[0].trim()}:\n${parts[1].trim()}`;
    }
  }

  // 4. Analisar blocos separados por quebras de linha
  const paragraphs = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  
  if (paragraphs.length <= 1) {
    return paragraphs[0] || text;
  }

  // Verificar se os parágrafos são partes da MESMA oração contínua
  // (ex: Parágrafo 1 não termina com . ? ! : e Parágrafo 2 continua a frase)
  const merged: string[] = [];
  let current = paragraphs[0];

  for (let i = 1; i < paragraphs.length; i++) {
    const next = paragraphs[i];
    const endsWithTerminalPunctuation = /[:.!?…]$/.test(current.trim());
    const startsWithConjunctionOrVerb = /^(e|ou|mas|porém|porque|pra|para|que|de|do|da|com|em|sem|gasta|faz|toma|dorme|acorda|come|chora|entra|sai|fica|vai|quando|onde|aqui|ali)\b/i.test(next);

    if (!endsWithTerminalPunctuation || startsWithConjunctionOrVerb) {
      // É a continuação da mesma frase! Junta com espaço para não ficar desconexo
      current = `${current} ${next}`;
    } else {
      // É uma nova frase ou punchline separada
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  return merged.join('\n');
}

/**
 * Detecta se o texto possui estrutura de diálogo
 */
export function isDialogText(text: string): boolean {
  return /[-•*]\s*|\b(eu|ela|ele|mãe|pai|chefe|psicóloga|terapeuta|médico|uber|atendente|banco|crush|psiquiatra)\s*:/i.test(text);
}

/**
 * Detecta se o texto possui estrutura de Setup + Punchline
 */
export function hasSetupAndPunchline(text: string): boolean {
  return text.includes('\n') || /[:?!]\s+[A-Z0-9À-Ú]/.test(text);
}

/**
 * Garante que o trecho de destaque (highlight) seja coeso e não engula conectivos soltos
 */
export function sanitizeHighlightString(highlight: string, fullText: string): string {
  if (!highlight || !highlight.trim()) return '';
  let clean = highlight.trim();

  // Remove pontuações terminais soltas do highlight
  clean = clean.replace(/^[.,;:!?\s]+|[.,;:!?\s]+$/g, '');

  // Se o highlight existe dentro do texto completo, retorna limpo
  if (fullText.toLowerCase().includes(clean.toLowerCase())) {
    return clean;
  }

  return '';
}
