import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", brand: "DEPRESSIVOS 2000", motto: "Estamos todos meio ferrados, mas vamos rir disso." });
});

// Master System Prompt for DEPRESSIVOS 2000
const BRAND_IDENTITY_PROMPT = `
ATUE COMO:
Um Estrategista de Conteúdo, Psicanalista Clínico Irônico, Designer de Interface (UI/UX) e Engenheiro Front-End Sênior (React + Tailwind CSS).

O PROJETO: TRAUMAS.ZIP
Você é a inteligência técnica e criativa por trás da marca "Traumas.zip". Somos uma marca de cultura de internet brasileira focada em saúde mental, exaustão da vida adulta, ansiedade e humor nostálgico dos anos 2000. A premissa central é: "Estamos todos meio ferrados, mas vamos rir disso."

PERFIL DO CRIADOR (A CAMADA OCULTA OBRIGATÓRIA):
Toda a linha editorial reflete a mente do seu criador: Micael Saturnino, 30 anos, psicólogo clínico com especialização em psicanálise contemporânea pela PUCRS, e com domínio técnico avançado em criação de produtos digitais (React, Tailwind CSS, Framer Motion, UI/UX).
A sua entrega deve ter essa dualidade: a precisão cirúrgica de um psicanalista aliada à execução impecável de um desenvolvedor front-end. O tom deve soar como alguém que traduz dores profundas de uma geração em código, memes e design nostálgico.

PERSONALIDADE E TOM DE VOZ:
- Irônico e Ácido: Rimos do próprio caos. Tom de diário interno vazado às 3 da manhã.
- Nativo Digital: Usamos a linguagem da internet atual com termos psicológicos ("projeção", "complexo de abandono", "ato falho", "recalcado").
- Profundidade Inesperada: A isca é o meme banal; o gancho é a reflexão psicanalítica.

RED LINES (O QUE É PROIBIDO):
- Não use linguagem genérica de coach ou frases motivacionais ("Acredite em você").
- Não diagnostique seguidores nem romantize transtornos graves. A dor é validada, mas não glorificada.
- Não use estética "clean" ou hospitalar.
- Não adicione CTAs diretos de venda de terapia nos memes diários.

ESTÉTICA VISUAL (IDENTIDADE: TELA AZUL PURA):
- A identidade visual é pautada no minimalismo brutalista, fugindo de clichês psicológicos. O perfil tem como assinatura a estética de Erro de Sistema / Tela Azul da Morte.
- Cores Base Restritas: O fundo primário dos elementos de destaque deve ser Azul Puro (#0000FF). A cor de fundo geral deve ser Bege Gabinete (#F4F4F0). O texto e bordas devem ser Cinza Quase Preto (#1A1A1A) ou Branco (#FFFFFF) quando sobrepostos ao azul.
- Tipografia: Arial Black ou Impact para títulos pesados que chamam a atenção; Courier New para textos densos, mensagens de erro e a assinatura da marca (ex: erro.exe ou :().
- Diretriz para o Código (React/Tailwind): Sempre que gerar um componente, priorize caixas de alerta rígidas, bordas grossas (ex: border-4 border-[#1A1A1A]), sombras duras sem desfoque (ex: shadow-[8px_8px_0px_#0000FF]) e elementos que simulem barras de carregamento travadas (99%) ou pop-ups de erro crítico de memória.

MÓDULO DE APRENDIZADO CONTÍNUO (FEEDBACK LOOP RLHF):
O SISTEMA DE AVALIAÇÃO:
Sempre que fornecidos os blocos [HISTÓRICO DE MATCHES] e [HISTÓRICO REJEITADO]:
1. Extração de DNA (Matches): Identifique o que os posts curtidos têm em comum (humor de farmacologia, relacionamentos líquidos, rotina corporativa exaustiva, mockups nostálgicos específicos como TV de tubo, MSN, iPod). Use essas informações como base de estilo.
2. Análise de Falhas (Rejeitados): Identifique o padrão do que foi descartado. É ESTRITAMENTE PROIBIDO repetir os padrões, temas ou estruturas encontrados no bloco de rejeitados.
3. Diretriz de Geração Evolutiva: Os novos posts gerados devem ser uma evolução direta dos posts aprovados, mantendo a mesma calibragem de ironia, nostalgia e profundidade psicanalítica.

PILARES TEMÁTICOS & FARMACOLOGIA:
- Antidepressivos e ansiolíticos (Escitalopram, Sertralina, Fluoxetina, Venlafaxina, Zolpidem, Clonazepam/Rivotril, Bupropiona, Quetiapina, Venvanse, Ritalina).
- Efeitos colaterais cômicos: libido zero/broxar, disfunção erétil, sonolência bizarra às 14h, boca seca, compras absurdas de madrugada sob efeito do Zolpidem, choques na cabeça por esquecer a dose, apatia emocional total.
- Laudos, DSM-5 e CID-10/11 (F32, F41, TDAH, Borderline, Pânico, Burnout).
- Terapia & Consultório: Diálogos cômicos entre paciente e terapeuta.
- Relacionamentos & Vácuo: Visualizou e não respondeu, stalkear perfil de ex, apego ansioso.
- Vida Adulta & Anos 2000: Cansaço crônico, coluna estalando igual modem discado, saudades do MSN/Orkut.

QUADROS FIXOS RECONHECIDOS:
- "No consultório"
- "Diagnóstico: você é fudido"
- "Bula da Depressão & Efeitos Colaterais"
- "Freud vendo isso"
- "3 da manhã"
- "Não era saudade"
- "Ansiedade da geração 2000"
- "Relacionamentos modernos"
- "A mente não colabora"
- "Coisas que ninguém admite"
- "Farmácia Popular"
- "Recaída no MSN"

GERADOR DE MOCKUPS RETRO (CSS ART E MOLDURAS NOSTÁLGICAS):
Sempre que criar componentes com mídia (imagem ou vídeo), envolva a mídia DENTRO de um dispositivo eletrônico nostálgico dos anos 2000 em CSS Art:

MÓDULO AVANÇADO DE UI: MOCKUPS DE TV DE TUBO (CSS ART)
Sempre que eu enviar uma mídia e pedir para colocar em uma "TV Antiga", "TV com VHS" ou "TV com DVD", você deve gerar a interface reproduzindo o design físico de aparelhos dos anos 90/2000 usando apenas Tailwind CSS e divs.

ESTRUTURA OBRIGATÓRIA DA TV (CSS ART):
1. Carcaça Externa (Chassi): Crie um container robusto com bordas arredondadas (rounded-3xl). Use cores sólidas (Bege Plástico #e0e0d8 ou Prata Metálico #c0c0c0). Adicione sombras projetadas pesadas (shadow-2xl) e bordas internas (shadow-inner) para simular o volume do plástico.
2. Moldura da Tela (Bezel): Uma div interna na cor cinza escuro/preto (#2a2a2a) com bordas chanfradas simulando o aprofundamento da tela de tubo.
3. A Tela de Vidro (Screen): Uma div central com overflow-hidden e leve arredondamento (rounded-2xl).
   - Mídia: Coloque a tag <video> ou <img> da mídia preenchendo este espaço (object-cover w-full h-full).
   - Efeito CRT (Sobreposição): Adicione uma div com position absolute, inset-0, pointer-events-none e z-10. Aplique um gradiente radial para simular o reflexo curvo do vidro (bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent) e CSS para scanlines (linhas horizontais de TV antiga).
4. Painel Inferior (VCR / DVD e Botões):
   - Desenhe uma entrada retangular horizontal e escura simulando a entrada de fita VHS ou bandeja de DVD.
   - Crie botões físicos ovais ou redondos (Power, Volume, Play/Stop) usando sombras inset/outset para dar efeito 3D de clique.
   - Adicione pequenos detalhes simulando os conectores RCA frontais (três círculos pequenos nas cores Amarelo, Branco e Vermelho).
5. Adesivos Nostálgicos (Opcional): Se o tom do post permitir, posicione elementos absolutos (absolute) em formato de pequenos emojis ou SVG de estrelas (⭐, ❤️) espalhados pelas bordas de plástico, simulando adesivos colados.

CATÁLOGO DE MODELOS:
1. Monitor de Tubo Bege (Windows 95/98): Carcaça bege (#F4F4F0), botões de contraste/power em relevo, chanfros 3D (border-t-white border-l-white border-b-gray-400 border-r-gray-400), tela 4:3 com scanlines e reflexo de vidro de tubo.
2. TV de Tubo com VHS (Quasar/Bege): Carcaça bege/branca (#e0e0d8), entrada de fita VHS com aba de proteção, botões de eject/play/stop e adesivos nostálgicos.
3. TV de Tubo com DVD (Memorex/Prata): Carcaça prata metálico (#c0c0c0), bandeja de DVD/CD, 3 conectores RCA frontais (Amarelo, Branco, Vermelho) e botões físicos 3D.
4. TV Analógica de Madeira: Bordas amadeiradas (tons de marrom), botões giratórios de sintonizar canal, tela de vidro convexa abaulada com reflexo.
5. Celular Tijolão / Flip (ex: Motorola V3 ou Nokia tijolo): Carcaça metálica/preta, teclado numérico azul iluminado embaixo, telinha LCD iluminada.
6. Console Portátil (estilo Gameboy): Corpo de plástico colorido, d-pad direcional, botões A/B roxos, tela quadrada com moldura escura.
7. Reprodutor de MP3 (estilo Winamp ou iPod antigo): Tela de cristal líquido verde/azul, interface de player, botões de play/pause.
Proporção mestre: w-[1080px] h-[1080px] (Feed) ou h-[1920px] (Stories). Suporte <video src="..." autoPlay loop muted playsInline /> e <img src="..." /> dentro do display com scanlines e reflexo CRT.
`;

// API endpoint to analyze an uploaded image or video frames with multimodal vision
app.post("/api/analyze-media", async (req, res) => {
  const {
    imageBase64,
    mimeType = "image/jpeg",
    extraContext = "",
    vibe = "variado",
    temperature = 1.0,
    mediaType = "image"
  } = req.body;

  const client = getGeminiClient();

  if (!client) {
    return res.status(503).json({
      error: "Gemini API key não configurada no servidor."
    });
  }

  if (!imageBase64) {
    return res.status(400).json({ error: "Nenhuma imagem ou frame fornecido para análise." });
  }

  try {
    // Strip data url prefix if present
    const base64Data = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const promptText = `${BRAND_IDENTITY_PROMPT}

TAREFA: ANALISAR ESTA IMAGEM/VÍDEO E CRIAR DE 6 A 8 MEMES HILÁRIOS E CÔMICOS!

1. INSPECIONE A CENA VISUAL:
   - Quem ou o que aparece? (expressão facial, postura corporal, olhar vazio, sorriso forçado, cachorro/gato exausto, situação absurda, cenário).
   - O que essa imagem transmite que podemos ironizar com a saúde mental, psiquiatria, efeitos de remédios, relacionamentos ou vida adulta?
${extraContext ? `Contexto extra do usuário: "${extraContext}"` : ''}
${vibe && vibe !== 'variado' ? `Vibe solicitada: "${vibe}"` : ''}

2. CRIE DE 6 A 8 FRASES TOTALMENTE DIFERENTES, INÉDITAS E GENUINAMENTE ENGRAÇADAS (foco em fazer rir alto, comédia de identificação) + METADADOS COMPLETOS DE PUBLICAÇÃO:
- Piadas sobre remédios (Escitalopram e libido zero, Zolpidem, Sertralina, Rivotril).
- Diálogos no consultório de terapia.
- Diagnósticos psiquiátricos cômicos (DSM-5 / CID F32 / CID F41).
- Contrastes hilários entre a aparência na foto e o colapso interno.

Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "detectedScene": "Descrição precisa do que está na foto (ex: Pessoa no sofá olhando fixamente pro teto com olhar de quem o remédio apagou)",
  "identifiedTopic": "Tema/Diagnóstico Cômico (ex: Efeito do Escitalopram / CID F41 / Sessão de Terapia)",
  "publishingMetadata": {
    "caption": "Legenda completa envolvente para Instagram/TikTok com Call to Action focado em compartilhamento por DM (ex: 'Manda pro amigo que toma o mesmo antidepressivo e finge que tá tudo bem KKKKKK')",
    "hashtags": ["#depressivos2000", "#saudemental", "#humorbrasil", "#escitalopram", "#ansiedade", "#terapia", "#nostalgia2000"],
    "viralAudioSuggestion": "Sugestão detalhada de áudio em alta no Reels/TikTok (ex: Trend de transição brusca de música calma para batida de suspense / The Reason - Hoobastank / Áudio do MSN chamando atenção)",
    "threeVisualVariations": [
      {
        "styleName": "Opção 1: Pop-up Windows XP (Erro Crítico)",
        "template": "sistema-alerta",
        "description": "Estética clássica de pop-up de erro com botão OK/Cancelar"
      },
      {
        "styleName": "Opção 2: Janela MSN Messenger 2005",
        "template": "msn-nostalgia",
        "description": "Subnick clássico com status ausente e botão de chamar atenção"
      },
      {
        "styleName": "Opção 3: Tweet de Parede Brutalista",
        "template": "tweet-parede",
        "description": "Alto contraste neo-brutalista amarelo e azul puro para feed"
      }
    ]
  },
  "primaryMeme": {
    "title": "★ Efeito do Medicamento & Libido",
    "text": "Frase cômica principal (1 a 3 linhas, use \\n\\n para quebras de linha)",
    "highlight": "trecho de destaque",
    "template": "tweet-parede",
    "systemTitle": "Bula_Interativa - escitalopram_libido.exe",
    "windowButtonText": "TOMAR COM ÁGUA",
    "shadowColor": "#0000FF",
    "sticker": "battery"
  },
  "alternativeMemes": [
    {
      "title": "Opção 2: Diagnóstico DSM-5 & CID",
      "text": "Frase cômica alternativa 2",
      "highlight": "trecho de destaque",
      "template": "sistema-alerta",
      "systemTitle": "Laudo Psiquiátrico - CID_F41.exe",
      "windowButtonText": "ACEITAR DIAGNÓSTICO",
      "shadowColor": "#FF3333",
      "sticker": "warning"
    },
    {
      "title": "Opção 3: No Consultório com Terapeuta",
      "text": "Frase cômica alternativa 3",
      "highlight": "trecho de destaque",
      "template": "tweet-parede",
      "systemTitle": "Sessão TCC - trauma_infancia.dll",
      "windowButtonText": "DESMARCAR",
      "shadowColor": "#1A1A1A",
      "sticker": "broken-heart"
    },
    {
      "title": "Opção 4: Crise Noturna de Zolpidem",
      "text": "Frase cômica alternativa 4",
      "highlight": "trecho de destaque",
      "template": "terminal-dark",
      "systemTitle": "> zolpidem_blackout.sh",
      "windowButtonText": "COMPRAR AIRFRYER",
      "shadowColor": "#00FF66",
      "sticker": "skull"
    },
    {
      "title": "Opção 5: Relacionamento & Vácuo",
      "text": "Frase cômica alternativa 5",
      "highlight": "trecho de destaque",
      "template": "msn-nostalgia",
      "systemTitle": "MSN Messenger - (Ausente da Sanidade)",
      "windowButtonText": "CHAMAR ATENÇÃO",
      "shadowColor": "#000080",
      "sticker": "msn"
    },
    {
      "title": "Opção 6: Cupom da Farmácia Popular",
      "text": "Frase cômica alternativa 6",
      "highlight": "trecho de destaque",
      "template": "nota-fiscal",
      "systemTitle": "Cupom da Drogaria São Paulo",
      "windowButtonText": "PAGAR VENLAFAXINA",
      "shadowColor": "#FF007F",
      "sticker": "battery"
    },
    {
      "title": "Opção 7: Pensamento das 3 da Manhã",
      "text": "Frase cômica alternativa 7",
      "highlight": "trecho de destaque",
      "template": "winamp-retro",
      "systemTitle": "Winamp - Trilha Sonora do Colapso.mp3",
      "windowButtonText": "PLAY",
      "shadowColor": "#FFD700",
      "sticker": "sad-smile"
    }
  ]
}`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      }
    ];

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        temperature: Math.min(Math.max(Number(temperature) || 1.05, 0.8), 1.4),
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini não retornou texto.");
    }

    let cleaned = text;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const output = JSON.parse(cleaned);
    return res.json(output);
  } catch (error: any) {
    console.error("Erro ao analisar imagem com Gemini:", error);
    return res.status(500).json({
      error: "Falha na análise da imagem.",
      details: error.message || String(error),
    });
  }
});

// API endpoint for AI quote generation
app.post("/api/generate-quote", async (req, res) => {
  const { theme, style, tone, category } = req.body;
  const client = getGeminiClient();

  const fallbackQuote = () => {
    const picks = getShuffledMemes(1);
    const m = picks[0];
    return {
      text: m.text,
      highlight: m.highlight,
      systemTitle: m.systemTitle || "depressivos2000.exe",
      handle: "@DEPRESSIVOS2000",
      template: m.template
    };
  };

  if (!client) {
    return res.json(fallbackQuote());
  }

  try {
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR UM POST ENGRAÇADO, CÔMICO E DE FORTE IDENTIFICAÇÃO PARA O FEED!
Lembre-se: O lema é "Estamos todos meio ferrados, mas vamos rir disso."

Tema/Quadro: ${category || theme || "Remédios, Efeitos Colaterais, Psicologia e Vida Adulta"}
Estilo visual: ${style || "Tweet de Parede"}
Tom: ${tone || "Sarcástico, hilário e existencial"}

Retorne APENAS um JSON válido no seguinte formato:
{
  "text": "Texto principal do post (curto, impactante, 1 a 3 frases no máximo, use \\n\\n para quebras de linha se necessário)",
  "highlight": "Uma palavra ou frase curta dentro do texto que deve ser destacada com cor",
  "systemTitle": "Título para cabeçalho de janela tipo 'Laudo Psiquiátrico - escitalopram.exe' ou terminal '> terminal_serotonina_404'",
  "handle": "@DEPRESSIVOS2000"
}`;

    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração")), 6000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = response.text ? JSON.parse(response.text.trim()) : null;
    if (output && output.text) {
      return res.json(output);
    }
    return res.json(fallbackQuote());
  } catch (error: any) {
    console.warn("Fallback de quote única ativado:", error.message || error);
    return res.json(fallbackQuote());
  }
});

// Master Fallback Memes Bank tailored strictly to DEPRESSIVOS 2000 rules & requested templates
const DYNAMIC_MEME_BANK = [
  // 1. ALERTA DO WINDOWS 98 / XP
  {
    id: "win-1",
    category: "Alerta do Windows 98",
    quadro: "Diagnóstico: Você é Fudido",
    text: "ERRO CRÍTICO: Recaida.exe\n\nVocê tentou manter a postura madura, mas o sistema detectou que você abriu a conversa arquivada 14 vezes nas últimas 2 horas.\n\n[ CANCELAR DIGNIDADE ]  [ REPETIR ERRO ]",
    highlight: "ERRO CRÍTICO: Recaida.exe",
    template: "sistema-alerta",
    systemTitle: "Alerta do Sistema - recaida.exe",
    windowButtonText: "REPETIR ERRO",
    shadowColor: "#1A1A1A",
    sticker: "warning",
    caption: "O Windows detectou colapso na dignidade às 23:45. Manda pra pessoa que vive no 'repetir erro'.",
    hashtags: ["#depressivos2000", "#windows98", "#recaida", "#humoradulto", "#saudemental"],
    viralAudio: "Som de erro clássico do Windows XP em loop",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows 98", template: "sistema-alerta" },
      { name: "Opção 2: Terminal Dark 3AM", template: "terminal-dark" },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" }
    ]
  },
  {
    id: "win-2",
    category: "Alerta do Windows 98",
    quadro: "A Mente Não Colabora",
    text: "MEMÓRIA INSUFICIENTE\n\nNão foi possível processar mais uma reunião de 1 hora que poderia ter sido um e-mail de 2 linhas.\n\n[ FINGIR DEMÊNCIA ]  [ REINICIAR CÉREBRO ]",
    highlight: "MEMÓRIA INSUFICIENTE",
    template: "sistema-alerta",
    systemTitle: "Memória Esgotada - burnout.dll",
    windowButtonText: "FINGIR DEMÊNCIA",
    shadowColor: "#0000FF",
    sticker: "error",
    caption: "A memória RAM biológica foi de base. Quem nunca quis apertar 'Fingir Demência'?",
    hashtags: ["#depressivos2000", "#trabalho", "#burnout", "#humorcorporativo"],
    viralAudio: "Música de elevador distorcida com som de erro do Windows",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" },
      { name: "Opção 3: Barra 99%", template: "barra-carregamento-99" }
    ]
  },
  {
    id: "win-3",
    category: "Alerta do Windows 98",
    quadro: "No Consultório",
    text: "AVISO DE SEGURANÇA:\n\nA sua psicanalista fez uma pergunta simples e você está prestes a chorar por causa de um brinquedo que seu primo quebrou em 2003.\n\n[ DESVIAR ASSUNTO ]  [ RIR NERVOSO ]",
    highlight: "AVISO DE SEGURANÇA",
    template: "sistema-alerta",
    systemTitle: "Sessão TCC - trauma_infancia.exe",
    windowButtonText: "RIR NERVOSO",
    shadowColor: "#FF3333",
    sticker: "broken-heart",
    caption: "50 minutos de sessão: 45 de piada e 5 encarando o teto. Manda pro amigo que faz terapia.",
    hashtags: ["#depressivos2000", "#terapia", "#psicanalise", "#rirpranaochorar"],
    viralAudio: "Áudio do meme 'E como você se sente sobre isso?' com violino dramático",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 2: Cupom Fiscal", template: "nota-fiscal" },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" }
    ]
  },

  // 2. DARK MODE / TERMINAL 3 DA MANHÃ
  {
    id: "term-1",
    category: "Dark Mode / Terminal",
    quadro: "3 da Manhã",
    text: "> terminal_pensamentos_intrusivos.sh\n\nÀs 03:14 AM seu cérebro não quer dormir: ele quer calcular se aquela pessoa que não respondeu sua mensagem em 2019 já casou e se o cachorro dela ainda lembra de você.",
    highlight: "03:14 AM",
    template: "terminal-dark",
    systemTitle: "> pensamentos_intrusivos.sh",
    windowButtonText: "TENTAR DORMIR",
    shadowColor: "#FF3333",
    sticker: "skull",
    caption: "Insônia não é falta de sono, é excesso de teorias da conspiração às 3 da manhã.",
    hashtags: ["#depressivos2000", "#3damanha", "#insonia", "#humoracido"],
    viralAudio: "Batida lo-fi sombria dos anos 2000 com teclado digitando",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" }
    ]
  },
  {
    id: "term-2",
    category: "Dark Mode / Terminal",
    quadro: "Bula da Depressão & Remédios",
    text: "> zolpidem_blackout.sh\n\n[23:00] Tomei meio comprimido pra descansar.\n[02:17] Comprei uma máquina de fazer gelo, um kit de pescaria e mandei áudio de 6 minutos pro meu ex-chefe.",
    highlight: "zolpidem_blackout.sh",
    template: "terminal-dark",
    systemTitle: "> compra_madrugada.log",
    windowButtonText: "CANCELAR COMPRA",
    shadowColor: "#00FF66",
    sticker: "skull",
    caption: "O efeito colateral mais comum do Zolpidem é a transportadora bater na sua porta com coisas que você não lembra de ter comprado.",
    hashtags: ["#depressivos2000", "#zolpidem", "#mercadolivre", "#madrugada"],
    viralAudio: "Áudio viral 'O que foi que eu fiz ontem à noite?'",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" },
      { name: "Opção 2: Cupom Fiscal", template: "nota-fiscal" },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" }
    ]
  },
  {
    id: "term-3",
    category: "Dark Mode / Terminal",
    quadro: "Farmácia Popular",
    text: "> serotonina_status.log\n\nDopamina: 0%\nSerotonina: [404 NOT FOUND]\nEscitalopram 15mg: Ativo\nLibido: Conectando via modem discado (sem sinal)",
    highlight: "404 NOT FOUND",
    template: "terminal-dark",
    systemTitle: "> laudo_quimico.sh",
    windowButtonText: "REINICIAR",
    shadowColor: "#00FF66",
    sticker: "battery",
    caption: "A serotonina sumiu mas pelo menos a ansiedade virou apatia serena KKKKKK.",
    hashtags: ["#depressivos2000", "#escitalopram", "#quimicaemocional", "#terapia"],
    viralAudio: "Som de modem discado 56k conectando e caindo",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" },
      { name: "Opção 3: TV de Tubo VHS", template: "mockup-tv-vhs" }
    ]
  },

  // 3. MSN MESSENGER 2005
  {
    id: "msn-1",
    category: "MSN 2005 Nostalgia",
    quadro: "Recaída no MSN",
    text: "(subnick do MSN)\n·•● (D) Micael ~ (ocupado) ●•·\n\"o silêncio às vezes é a resposta mais barulhenta (N)\"\n\n*(entrando e saindo 12 vezes seguidas para a janelinha subir no canto da tela de quem te deu vácuo)*",
    highlight: "entrando e saindo 12 vezes",
    template: "msn-nostalgia",
    systemTitle: "MSN Messenger - (Ausente da Sanidade)",
    windowButtonText: "CHAMAR ATENÇÃO",
    shadowColor: "#000080",
    sticker: "msn",
    caption: "A arte milenar de entrar e sair do MSN para forçar a notificação no PC da pessoa. Quem viveu sabe.",
    hashtags: ["#depressivos2000", "#msn", "#anos2000", "#nostalgia", "#vacuo"],
    viralAudio: "Som clássico do 'Tudum' do MSN e som de chamar atenção (tremer a tela)",
    threeVisualVariations: [
      { name: "Opção 1: MSN Messenger", template: "msn-nostalgia" },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 3: Winamp MP3", template: "winamp-retro" }
    ]
  },
  {
    id: "msn-2",
    category: "MSN 2005 Nostalgia",
    quadro: "Relacionamentos Modernos",
    text: "MSN Messenger 7.5:\n\nFulano enviou um alerta de 'CHAMAR ATENÇÃO'!\n\nSua tela tremeu, mas o coração nem mexe mais depois de 5 anos de desilusões amorosas e boletos.",
    highlight: "CHAMAR ATENÇÃO",
    template: "msn-nostalgia",
    systemTitle: "MSN Messenger 7.5 - Conversa",
    windowButtonText: "CHAMAR ATENÇÃO",
    shadowColor: "#000080",
    sticker: "msn",
    caption: "Se o WhatsApp tivesse o botão de tremer a tela do MSN a taxa de infarto no Brasil triplicava.",
    hashtags: ["#depressivos2000", "#msnmessenger", "#nostalgia2000", "#humorbr"],
    viralAudio: "Efeito sonoro da janela do MSN tremendo com grave estourado",
    threeVisualVariations: [
      { name: "Opção 1: MSN Messenger", template: "msn-nostalgia" },
      { name: "Opção 2: Tweet de Parede", template: "tweet-parede" },
      { name: "Opção 3: TV de Tubo", template: "mockup-tv-vhs" }
    ]
  },

  // 4. CUPOM FISCAL / EXTRATO DA DESGRAÇA
  {
    id: "cupom-1",
    category: "Cupom Fiscal",
    quadro: "Farmácia Popular",
    text: "EXTRATO DE GASTOS EMOCIONAIS - 28/08\n------------------------------------\n• 1x Café com esperança de ser produtivo ...... R$ 18,00\n• 1x Compra de item inútil no Zolpidem às 02:40 .. R$ 249,90\n• 4x Stalking sem autorização prévia ......... R$ 0,00\n• 1x Humilhação no direct ..................... SEM VALOR\n------------------------------------\nTOTAL A PAGAR: 3 anos de terapia",
    highlight: "TOTAL A PAGAR: 3 anos de terapia",
    template: "nota-fiscal",
    systemTitle: "Drogaria São Paulo - Cupom Fiscal",
    windowButtonText: "PAGAR EM 12X",
    shadowColor: "#FF007F",
    sticker: "battery",
    caption: "O extrato do mês detalhado por categoria de humilhação. Manda no grupo que divide as desgraças.",
    hashtags: ["#depressivos2000", "#cupomfiscal", "#terapia", "#boletos", "#humoradulto"],
    viralAudio: "Som de impressora de cupom fiscal matricial imprimindo sem parar",
    threeVisualVariations: [
      { name: "Opção 1: Cupom Fiscal", template: "nota-fiscal" },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 3: Tela Azul Brutalista", template: "tela-azul-brutalista" }
    ]
  },
  {
    id: "cupom-2",
    category: "Cupom Fiscal",
    quadro: "Farmácia Popular",
    text: "DROGARIA MEMÓRIA CURTA\n------------------------------------\n• 01x Escitalopram 20mg ......... R$ 89,90\n• 01x Rivotril Gotas (paz falsa) . R$ 34,50\n• 01x Energético 2L .............. R$ 14,00\n• 01x Barra de chocolate 70% ..... R$ 12,00\n------------------------------------\nSubtotal: Sanidade comprada no cartão de crédito",
    highlight: "Sanidade comprada no cartão",
    template: "nota-fiscal",
    systemTitle: "Farmácia Popular - Extrato",
    windowButtonText: "PARCELAR",
    shadowColor: "#FF3333",
    sticker: "none",
    caption: "A cesta básica do jovem adulto contemporâneo: cafeína de dia e tarja preta de noite.",
    hashtags: ["#depressivos2000", "#farmacia", "#tarjapreta", "#vidareal"],
    viralAudio: "Áudio 'Eu não tenho um minuto de paz' com som de caixa registradora",
    threeVisualVariations: [
      { name: "Opção 1: Cupom Fiscal", template: "nota-fiscal" },
      { name: "Opção 2: Terminal Dark", template: "terminal-dark" },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" }
    ]
  },

  // 5. MP3 PLAYER / WINAMP NOSTÁLGICO
  {
    id: "mp3-1",
    category: "MP3 Player / Winamp",
    quadro: "Ansiedade da Geração 2000",
    text: "NOW PLAYING: 03. O Som do Vácuo (Feat. Humilhação)\n[ 01:24 ━━━━━━●─────── 03:45 ]\n⏮  ❚❚  ⏭   🔀  🔁\n\n\"Faixa bônus: áudio de 4 minutos gravado chorando no carro que você apagou 'para todos' 3 segundos depois de mandar.\"",
    highlight: "O Som do Vácuo",
    template: "winamp-retro",
    systemTitle: "Winamp 2.91 - Trilha do Colapso.mp3",
    windowButtonText: "PAUSE",
    shadowColor: "#FFD700",
    sticker: "cd",
    caption: "A discografia completa das recaídas amorosas tocando no Winamp às 2 da manhã.",
    hashtags: ["#depressivos2000", "#winamp", "#mp3", "#anos2000", "#humorbrasil"],
    viralAudio: "Trecho nostálgico de Fresno - Quebre As Correntes desacelerado",
    threeVisualVariations: [
      { name: "Opção 1: Winamp MP3", template: "winamp-retro" },
      { name: "Opção 2: MSN Messenger", template: "msn-nostalgia" },
      { name: "Opção 3: TV Tubo VHS", template: "mockup-tv-vhs" }
    ]
  },
  {
    id: "mp3-2",
    category: "MP3 Player / Winamp",
    quadro: "Ansiedade da Geração 2000",
    text: "NOW PLAYING: 07. Fresno - Alguém Que Te Faz Chorar\n[ 02:40 ━━━━━━━●────── 03:50 ]\n\nMemória desbloqueada: você chorando na frente do PC com monitor de tubo enquanto olhava os scraps do Orkut.",
    highlight: "Fresno - Alguém Que Te Faz Chorar",
    template: "winamp-retro",
    systemTitle: "Winamp - emo_2006.mp3",
    windowButtonText: "REPEAT",
    shadowColor: "#0000FF",
    sticker: "broken-heart",
    caption: "A trilha sonora oficial da geração que sofria por amor usando franja e calça apertada.",
    hashtags: ["#depressivos2000", "#fresno", "#emo", "#nostalgia2000", "#orkut"],
    viralAudio: "Refrão marcante de 'Alguém que te faz chorar' com eco nostálgico",
    threeVisualVariations: [
      { name: "Opção 1: Winamp MP3", template: "winamp-retro" },
      { name: "Opção 2: TV Tubo DVD", template: "mockup-tv-dvd" },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" }
    ]
  },

  // 6. TV DE TUBO COM VHS / DVD & MONITOR BEGE
  {
    id: "tv-1",
    category: "TV de Tubo / CSS Art",
    quadro: "Coisas Que Ninguém Admite",
    text: "Assistindo minha juventude passar tipo fita VHS mofada que travou no meio do cabeçote e agora precisa ser limpa com cotonete e álcool isopropílico.",
    highlight: "fita VHS mofada",
    template: "mockup-tv-vhs",
    systemTitle: "TV Quasar 20' - Canal 3 AV",
    windowButtonText: "REBOBINAR",
    shadowColor: "#0000FF",
    sticker: "avatar-sad",
    caption: "A sensação de cansaço aos 30 anos é exatamente a de uma fita VHS mastigada no videocassete.",
    hashtags: ["#depressivos2000", "#tvdetubo", "#vhs", "#vintage", "#humor"],
    viralAudio: "Som de fita VHS entrando no videocassete e rebobinando rápido",
    threeVisualVariations: [
      { name: "Opção 1: TV Tubo VHS", template: "mockup-tv-vhs" },
      { name: "Opção 2: TV Tubo DVD", template: "mockup-tv-dvd" },
      { name: "Opção 3: Monitor Bege", template: "mockup-monitor-bege" }
    ]
  },
  {
    id: "tv-2",
    category: "TV de Tubo / CSS Art",
    quadro: "A Mente Não Colabora",
    text: "Meu cérebro em repouso tá exatamente igual ao protetor de tela do DVD: batendo de quina em quina sem nunca acertar o centro.",
    highlight: "protetor de tela do DVD",
    template: "mockup-tv-dvd",
    systemTitle: "DVD Player Memorex - STANDBY",
    windowButtonText: "EJECT",
    shadowColor: "#0000FF",
    sticker: "cd",
    caption: "Aguardando o momento exato em que a sanidade bate perfeitamente no canto da tela.",
    hashtags: ["#depressivos2000", "#dvd", "#anos2000", "#humoracido"],
    viralAudio: "Música de menu de DVD dos anos 2000 em loop infinito",
    threeVisualVariations: [
      { name: "Opção 1: TV Tubo DVD", template: "mockup-tv-dvd" },
      { name: "Opção 2: Monitor Bege", template: "mockup-monitor-bege" },
      { name: "Opção 3: Celular Flip V3", template: "mockup-celular-flip" }
    ]
  },

  // 7. RELACIONAMENTOS & STALK
  {
    id: "rel-1",
    category: "Relacionamentos & Vácuo",
    quadro: "Relacionamentos Modernos",
    text: "Fui stalkear um perfil de 2017 e meu dedo deu dois toques acidentais na foto do batizado do sobrinho da pessoa.\n\nJá estou com as malas prontas para morar no interior do Paraguai sob nova identidade.",
    highlight: "dois toques acidentais",
    template: "tweet-parede",
    systemTitle: "Alerta de Stalking - fail.exe",
    windowButtonText: "MUDAR DE PAÍS",
    shadowColor: "#0000FF",
    sticker: "warning",
    caption: "O pior tipo de ataque cardíaco é a curtida sem querer em foto de 8 anos atrás.",
    hashtags: ["#depressivos2000", "#stalker", "#vergonhaalheia", "#mandaamigos"],
    viralAudio: "Áudio de suspense tenso 'NÃO, NÃO, NÃO, APAGA!'",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" }
    ]
  },
  {
    id: "rel-2",
    category: "Relacionamentos & Vácuo",
    quadro: "Não Era Saudade",
    text: "— Você tá bem?\n— Sim.\n— Então por que você tá olhando fixamente pro micro-ondas desligado há 18 minutos enquanto ensaia uma discussão mental?",
    highlight: "18 minutos",
    template: "tweet-parede",
    systemTitle: "Diálogo Psicanalítico",
    windowButtonText: "CANCELAR ENSAIO",
    shadowColor: "#FF3333",
    sticker: "broken-heart",
    caption: "Discussão mental com réplica, tréplica e lágrimas falsas que nunca vai acontecer na vida real.",
    hashtags: ["#depressivos2000", "#dialogo", "#apegoansioso", "#humorreal"],
    viralAudio: "Silêncio constrangedor com som de grilo no fundo",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" }
    ]
  },
  {
    id: "rel-3",
    category: "Relacionamentos & Vácuo",
    quadro: "Relacionamentos Modernos",
    text: "A pessoa visualizou minha mensagem às 14:02.\nSão 23:45 e eu já elaborei 6 teorias de conspiração, briguei mentalmente com ela e bloqueei a mãe dela no LinkedIn.",
    highlight: "bloqueei a mãe dela no LinkedIn",
    template: "tweet-parede",
    systemTitle: "Apego Ansioso em Ação",
    windowButtonText: "BLOQUEAR",
    shadowColor: "#0000FF",
    sticker: "sad-smile",
    caption: "Manda pra pessoa que transforma um vácuo de 30 minutos em um documentário criminal.",
    hashtags: ["#depressivos2000", "#vacuo", "#whatsapp", "#ansiedade"],
    viralAudio: "Áudio dramático de novela mexicana",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" },
      { name: "Opção 2: MSN Messenger", template: "msn-nostalgia" },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" }
    ]
  },

  // 8. TELA AZUL BRUTALISTA & VIDA ADULTA
  {
    id: "azul-1",
    category: "Tela Azul Brutalista",
    quadro: "Diagnóstico: Você é Fudido",
    text: "SUA BATERIA SOCIAL ATINGIU 1%.\n\nPressione qualquer tecla para fingir demência em eventos sociais ou feche os olhos até segunda-feira de manhã.",
    highlight: "BATERIA SOCIAL ATINGIU 1%",
    template: "tela-azul-brutalista",
    systemTitle: "BSoD - bateria_esgotada.sys",
    windowButtonText: "DESLIGAR",
    shadowColor: "#0000FF",
    sticker: "battery",
    caption: "A bateria social não aguenta mais nem 10 minutos de conversa fiada no elevador.",
    hashtags: ["#depressivos2000", "#telaazul", "#introvertido", "#bateriasocial"],
    viralAudio: "Som de TV fora do ar / estática suave",
    threeVisualVariations: [
      { name: "Opção 1: Tela Azul Brutalista", template: "tela-azul-brutalista" },
      { name: "Opção 2: Barra 99%", template: "barra-carregamento-99" },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" }
    ]
  },
  {
    id: "azul-2",
    category: "Tela Azul Brutalista",
    quadro: "A Mente Não Colabora",
    text: "PROCESSANDO MATURIDADE EMOCIONAL... 99%\n\nTempo restante estimado: 47 anos.\nErro encontrado: O usuário ainda guarda rancor de 2011.",
    highlight: "99%",
    template: "barra-carregamento-99",
    systemTitle: "Processando Maturidade.exe",
    windowButtonText: "CANCELAR",
    shadowColor: "#0000FF",
    sticker: "warning",
    caption: "A barra de carregamento da maturidade travou nos 99% e nunca mais avançou.",
    hashtags: ["#depressivos2000", "#barra99", "#maturidade", "#humorbr"],
    viralAudio: "Som de relógio tiquetaqueando angustiante",
    threeVisualVariations: [
      { name: "Opção 1: Barra 99%", template: "barra-carregamento-99" },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" }
    ]
  },
  {
    id: "azul-3",
    category: "Tela Azul Brutalista",
    quadro: "Coisas Que Ninguém Admite",
    text: "Mandei um print da conversa para a própria pessoa com quem eu estava conversando.\n\nA única saída digna agora é jogar o celular no vaso sanitário e fingir que fui sequestrado.",
    highlight: "Mandei um print da conversa",
    template: "tweet-parede",
    systemTitle: "Pânico Social Crítico",
    windowButtonText: "DESESPERO",
    shadowColor: "#FF3333",
    sticker: "skull",
    caption: "O frio na espinha quando você vê o print carregando dentro do chat da própria pessoa.",
    hashtags: ["#depressivos2000", "#print", "#vergonha", "#humoradulto"],
    viralAudio: "Áudio do grito do meme 'Oh no, oh no, oh no no no'",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" },
      { name: "Opção 3: MSN Messenger", template: "msn-nostalgia" }
    ]
  }
];

function getShuffledMemes(count = 20, filterCategory?: string) {
  let list = [...DYNAMIC_MEME_BANK];
  if (filterCategory && filterCategory !== 'todos') {
    const filtered = list.filter(m => m.category.toLowerCase().includes(filterCategory.toLowerCase()) || m.template.includes(filterCategory));
    if (filtered.length > 0) list = filtered;
  }
  // Shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, count);
}

// Endpoint: ME DÊ 20 MEMES / BATCH MEMES
app.post("/api/generate-batch-memes", async (req, res) => {
  const { theme = "variado", count = 20, filterCategory } = req.body;
  const client = getGeminiClient();

  if (!client) {
    console.log("[Batch Memes] Gemini client não disponível, usando fallback instantâneo.");
    return res.json({ memes: getShuffledMemes(count, filterCategory) });
  }

  try {
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR UM LOTE DE ${count} MEMES INÉDITOS, DIFERENTES E EXTREMAMENTE ENGRAÇADOS COM METADADOS DE PUBLICAÇÃO E 3 VARIAÇÕES VISUAIS!
Distribua os memes entre os pilares e modelos solicitados:
1. Alerta do Windows 98 / XP (ERRO CRÍTICO, memória RAM biológica, recaída.exe)
2. Dark Mode / Terminal 3 AM (> pensamentos_intrusivos.sh, > zolpidem_blackout.sh)
3. MSN 2005 Nostalgia (Subnick, chamar atenção, tudum)
4. Cupom Fiscal / Farmácia Popular (extrato de gastos emocionais, tarja preta)
5. MP3 Player / Winamp Retro (Now playing, áudios cancelados, Fresno, NX Zero)
6. TV de Tubo VHS / DVD Memorex (CSS Art anos 2000)
7. Relacionamentos Modernos (vácuo, stalk de 2017, apego ansioso)

Retorne EXCLUSIVAMENTE um JSON com formato:
{
  "memes": [
    {
      "id": "1",
      "category": "Alerta do Windows 98",
      "quadro": "Diagnóstico: Você é Fudido",
      "text": "Texto completo do meme",
      "highlight": "trecho de destaque",
      "template": "sistema-alerta",
      "systemTitle": "Alerta do Sistema - erro.exe",
      "windowButtonText": "OK",
      "shadowColor": "#1A1A1A",
      "sticker": "warning",
      "caption": "Legenda completa pronta para Instagram com CTA para DM",
      "hashtags": ["#depressivos2000", "#saudemental", "#humorbrasil", "#nostalgia2000"],
      "viralAudio": "Sugestão de áudio viral Reels/TikTok",
      "threeVisualVariations": [
        { "name": "Opção 1: Pop-up Windows 98", "template": "sistema-alerta" },
        { "name": "Opção 2: Terminal Dark 3AM", "template": "terminal-dark" },
        { "name": "Opção 3: Tweet de Parede", "template": "tweet-parede" }
      ]
    }
  ]
}`;

    // 7.5s Timeout promise to avoid any long wait or hang
    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração Gemini")), 7500)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = response.text ? JSON.parse(response.text.trim()) : null;

    if (output && Array.isArray(output.memes) && output.memes.length > 0) {
      return res.json(output);
    }
    throw new Error("Formato inválido retornado pela IA");
  } catch (error: any) {
    console.warn("Gemini batch fallback ativado:", error.message || error);
    return res.json({ memes: getShuffledMemes(count, filterCategory) });
  }
});

// Endpoint: ME DÊ 10 REELS / ROTEIROS DE VÍDEO
app.post("/api/generate-reels-scripts", async (req, res) => {
  const { count = 10, theme = "variado" } = req.body;
  const client = getGeminiClient();

  const fallbackReels = [
    {
      id: "1",
      quadro: "No Consultório",
      hook: "Eu pagando R$ 250 de terapia pra psicóloga me desmascarar em 30 segundos",
      screenText: "Psicóloga: 'E como você se sentiu com isso?'\nEu: 'Comprei uma jaqueta de R$ 600 em 12x.'",
      script: "Cena 1 (0-3s): Você olhando fixamente pra câmera com cara de paisagem.\nCena 2 (3-7s): Zoom lento enquanto a legenda surge ao som de violino dramático.\nCena 3 (7-10s): Texto final 'E assim o CPF vai de base'.",
      caption: "A psicóloga anotando no caderninho: 'Paciente prefere endividamento a amadurecimento emocional'.",
      cta: "Manda pro amigo que precisa de terapia ou de um limite menor no cartão.",
      audio: "Violino dramático desacelerado + áudio clássico 'E lá vamos nós'",
      duration: "10s",
      sharePotential: "Altíssimo (DM e WhatsApp)",
      savePotential: "Alto"
    },
    {
      id: "2",
      quadro: "Bula da Depressão & Remédios",
      hook: "Pov: o Escitalopram começou a fazer efeito",
      screenText: "Ansiedade: 0%\nChoro: Bloqueado\nLibido: Conectando via discada...",
      script: "Cena 1 (0-4s): Você caminhando em slow motion na rua encarando o nada com olhar sereno e vazio.\nCena 2 (4-8s): Som de modem discado 56k falhando.\nCena 3 (8-12s): Corte seco pro texto 'Oficialmente um monge tibetano medicado'.",
      caption: "A serenidade de quem não sente tristeza mas também não sente mais nada. Quem tá no mesmo barco?",
      cta: "Compartilha com seu amigo que toma tarja preta.",
      audio: "Som de modem discado 56k + beat de Lo-Fi anos 2000",
      duration: "12s",
      sharePotential: "Viral (muita identificação)",
      savePotential: "Médio"
    },
    {
      id: "3",
      quadro: "Relacionamentos Modernos",
      hook: "Ele visualizou há 18 minutos e não respondeu",
      screenText: "14:02: Mensagem visualizada\n14:20: 4 teorias da conspiração criadas\n14:25: Bloqueei a mãe dele no LinkedIn",
      script: "Cena 1 (0-3s): Tela do celular com o visto azul.\nCena 2 (3-8s): Olhar paranoico digitando no computador e montando mapa mental de detetive.\nCena 3 (8-11s): Corte seco pro micro-ondas apitando.",
      caption: "Apego ansioso não é fácil. Quem nunca ensaiou um documentário criminal por um vácuo?",
      cta: "Marca a amiga que é detetive particular de WhatsApp.",
      audio: "Música tema de Arquivo X / Suspense policial",
      duration: "11s",
      sharePotential: "Altíssimo para Stories e PV",
      savePotential: "Alto"
    }
  ];

  if (!client) {
    return res.json({ reels: fallbackReels });
  }

  try {
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR ${count} ROTEIROS COMPLETOS DE REELS / TIKTOK PARA O @DEPRESSIVOS2000!
Cada ideia deve ter:
- Título/Hook forte (primeiros 3 segundos que prendem)
- Formato e Quadro da marca
- Texto exato da tela
- Roteiro cena a cena (visual e áudio)
- Sugestão de áudio / trend
- Legenda pronta com CTA natural
- Duração aproximada (ex: 7s, 15s, 30s)
- Potencial de compartilhamento e salvamento

Retorne EXCLUSIVAMENTE um JSON com formato:
{
  "reels": [
    {
      "id": "1",
      "quadro": "No Consultório",
      "hook": "Frase de abertura",
      "screenText": "Texto na tela",
      "script": "Descrição visual do que acontece",
      "caption": "Legenda completa do post",
      "cta": "Ex: Manda pro amigo que toma o mesmo remédio",
      "audio": "Áudio recomendado / Tipo de trilha",
      "duration": "12s",
      "sharePotential": "Alto (identificação imediata)",
      "savePotential": "Médio"
    }
  ]
}`;

    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração Reels")), 7500)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = response.text ? JSON.parse(response.text.trim()) : null;
    if (output && Array.isArray(output.reels) && output.reels.length > 0) {
      return res.json(output);
    }
    return res.json({ reels: fallbackReels });
  } catch (error: any) {
    console.warn("Fallback Reels ativado:", error.message || error);
    return res.json({ reels: fallbackReels });
  }
});

// Endpoint: ANALISE ESSE POST
app.post("/api/analyze-post-strategy", async (req, res) => {
  const { postText = "", postType = "meme" } = req.body;
  const client = getGeminiClient();

  const fallbackAnalysis = {
    score: "9.2/10",
    hookEvaluation: "Excelente ancoragem na vergonha e na quebra de expectativa imediata.",
    humorEvaluation: "Humor autodepreciativo afiado e de corte seco, dentro da identidade da marca.",
    shareability: "Altíssimo — formato perfeito para encaminhar no privado com 'Isso é muito você'.",
    generalVerdict: "Conteúdo com altíssimo potencial de viralização em grupos de WhatsApp e DMs do Instagram.",
    suggestions: [
      "Finalize com corte seco sem explicar a piada para maximizar o impacto",
      "Use destaque em amarelo (#FFD700) na palavra-chave do absurdo",
      "Combine com áudio retrô nostálgico dos anos 2000 no Reels"
    ],
    improvedVersion: postText
  };

  if (!client) {
    return res.json(fallbackAnalysis);
  }

  try {
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: ANALISAR ESTRATEGICAMENTE ESTE POST PARA A MARCA @DEPRESSIVOS2000:
Texto do post: "${postText}"
Tipo: ${postType}

Avalie minuciosamente com base no manual de marca:
1. Hook & Primeiros Segundos
2. Nível de Identificação ("Meu Deus, sou eu")
3. Nível de Humor & Graça ("KKKKKKKK")
4. Potencial de Compartilhamento (DM / Stories)
5. Risco de parecer genérico / coach
6. 3 Sugestões concretas para deixar a piada ainda mais afiada e engraçada

Retorne EXCLUSIVAMENTE um JSON:
{
  "score": "Nota de 1 a 10",
  "hookEvaluation": "Análise do hook",
  "humorEvaluation": "Análise do humor",
  "shareability": "Alto / Médio / Baixo com explicação",
  "generalVerdict": "Este conteúdo possui características que podem aumentar o potencial de compartilhamento, mas o resultado precisa ser validado pelos dados reais da conta.",
  "suggestions": [
    "Sugestão 1",
    "Sugestão 2",
    "Sugestão 3"
  ],
  "improvedVersion": "Versão reescrita e otimizada da frase"
}`;

    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout análise Gemini")), 6000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = response.text ? JSON.parse(response.text.trim()) : null;
    if (output && output.score) {
      return res.json(output);
    }
    return res.json(fallbackAnalysis);
  } catch (error: any) {
    console.warn("Fallback de análise estratégica ativado:", error.message || error);
    return res.json(fallbackAnalysis);
  }
});

// Endpoint: RLHF CONTINUOUS LEARNING FEEDBACK LOOP
app.post("/api/generate-rlhf-posts", async (req, res) => {
  const { likedPosts = [], dislikedPosts = [], count = 3, extraFocus = "" } = req.body;
  const client = getGeminiClient();

  if (!client) {
    return res.status(503).json({ error: "Gemini API key não configurada no servidor." });
  }

  try {
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR ${count} NOVOS POSTS INÉDITOS UTILIZANDO O MÓDULO DE APRENDIZADO CONTÍNUO (FEEDBACK LOOP RLHF)!

[HISTÓRICO DE MATCHES]
${JSON.stringify(likedPosts, null, 2)}

[HISTÓRICO REJEITADO]
${JSON.stringify(dislikedPosts, null, 2)}

${extraFocus ? `Foco Adicional: "${extraFocus}"` : ''}

DIRETRIZES DE ANÁLISE ANTES DE GERAR:
1. Extração de DNA (Matches): Identifique o que os posts curtidos têm em comum (ex: humor de farmacologia, libido zero, exaustão corporativa, diálogos no divã, mockups preferidos como TV de tubo, iPod, MSN). Use isso como alicerce.
2. Análise de Falhas (Rejeitados): Identifique o padrão do que foi descartado. Você está ESTRITAMENTE PROIBIDO de repetir padrões, temas, piadas ou estruturas encontradas no histórico de rejeitados.
3. Geração Evolutiva: Crie ${count} novos posts que elevem a profundidade psicanalítica e a ironia ácida dos aprovados.

Retorne EXCLUSIVAMENTE um objeto JSON válido no formato:
{
  "dnaAnalysis": {
    "identifiedPreferences": "Breve resumo psicanalítico do padrão identificado nos posts curtidos",
    "discardedPatterns": "Breve resumo do que foi evitado com base no histórico de rejeições"
  },
  "posts": [
    {
      "id": "1",
      "category": "Farmacologia & Remédios",
      "text": "Texto completo e irônico do post",
      "highlight": "trecho de destaque",
      "template": "tweet-parede",
      "systemTitle": "Bula_Interativa - escitalopram.exe",
      "windowButtonText": "TOMAR COM ÁGUA",
      "shadowColor": "#0000FF",
      "sticker": "battery",
      "caption": "Legenda completa pronta para publicação com CTA para DM",
      "hashtags": ["#traumaszip", "#saudemental", "#escitalopram", "#humorbrasil", "#ansiedade", "#terapia"],
      "viralAudio": "Sugestão de áudio em alta no Reels/TikTok",
      "mockupDevice": "tv-vhs"
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.05,
      },
    });

    const output = response.text ? JSON.parse(response.text.trim()) : { dnaAnalysis: {}, posts: [] };
    return res.json(output);
  } catch (error: any) {
    console.error("Erro ao gerar posts com RLHF:", error);
    return res.status(500).json({ error: error.message || "Falha na geração com feedback loop" });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Depressivos 2000] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
