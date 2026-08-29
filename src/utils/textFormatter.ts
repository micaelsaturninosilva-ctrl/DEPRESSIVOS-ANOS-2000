/**
 * Utilitários para formatação e estruturação de texto de memes
 * Depressivos 2000 & Traumas.zip
 */

/**
 * Organiza e limpa o texto do meme para garantir leitura instantânea
 * - Separa Contexto/Setup de Punchline/Desfecho com quebra dupla
 * - Remove quebras de linha quebradas no meio de frases
 * - Formata diálogos e listas
 */
export function autoFormatMemeStructure(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  let text = rawText.trim();

  // 1. Normalizar quebras de linha
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Se o texto contém dois pontos (ex: "FOTO TIRADA ANTES DE...:") e não tem quebra dupla logo depois
  // ex: "FOTO TIRADA ANTES DO ZOLPIDEM BATER NO ESTÔMAGO VAZIO: ACORDEI COM..." -> separa em 2 parágrafos
  text = text.replace(/([:?!])\s*(\n*)\s*([A-Z0-9À-Ú])/g, (match, p1, p2, p3) => {
    // Se já tinha quebra dupla, mantém
    if (p2.includes('\n\n')) return `${p1}\n\n${p3}`;
    return `${p1}\n\n${p3}`;
  });

  // 3. Limpar quebras de linha soltas no meio de frases contínuas (ex: "FOTO TIRADA \n EXATAMENTE 7 MINUTOS" -> "FOTO TIRADA EXATAMENTE 7 MINUTOS")
  // a não ser que seja diálogo ou lista
  const paragraphs = text.split(/\n\s*\n/);
  const formattedParagraphs = paragraphs.map((p) => {
    const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
    
    // Se as linhas parecem diálogo (- Eu: / - Psicóloga:) ou lista (1., [ ], •), preserva as quebras
    const isDialogOrList = lines.some((l) => /^[-•*]|\d+\.|\b(eu|ela|ele|mãe|pai|chefe|psicóloga|terapeuta|médico|uber)\s*:/i.test(l));
    if (isDialogOrList) {
      return lines.join('\n');
    }

    // Se não for lista ou diálogo, junta as linhas quebradas do mesmo parágrafo para fluir naturalmente
    return lines.join(' ');
  });

  return formattedParagraphs.join('\n\n');
}

/**
 * Detecta se o texto possui estrutura de diálogo
 */
export function isDialogText(text: string): boolean {
  return /[-•*]\s*|\b(eu|ela|ele|mãe|pai|chefe|psicóloga|terapeuta|médico|uber|atendente|banco)\s*:/i.test(text);
}

/**
 * Detecta se o texto possui estrutura de Setup + Punchline
 */
export function hasSetupAndPunchline(text: string): boolean {
  return text.includes('\n\n') || /[:?!]\s+[A-Z0-9À-Ú]/.test(text);
}
