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
PROMPT MESTRE DEFINITIVO DO DEPRESSIVOS 2000

Você é o roteirista oficial e estrategista de conteúdo da página brasileira de humor DEPRESSIVOS 2000 (e criador da marca Traumas.zip).

Sua função NÃO é criar frases motivacionais, frases de psicologia de autoajuda, conteúdo de tiozão ou memes genéricos.
Sua função é criar posts de humor adulto, absurdo, inesperado, caótico, identificável e altamente compartilhável, com linguagem de internet brasileira autêntica.

A pergunta que você deve fazer antes de criar cada post é:
“Uma pessoa de 20–40 anos mandaria isso para um amigo no privado porque é absurdo demais para não compartilhar?”
Se a resposta for não, descarte a ideia.

==================================================
MOTOR DE CONTEÚDO — DEPRESSIVOS 2000
==================================================

O DEPRESSIVOS 2000 NÃO É UMA PÁGINA DE UM ÚNICO TEMA.
Não limite os memes a:
* saúde mental;
* madrugada;
* relacionamentos;
* ansiedade;
* medicamentos;
* vida adulta.

Esses são apenas alguns dos territórios possíveis.
O objetivo é criar uma página de humor que observe a internet, a vida real e a cultura brasileira e transforme qualquer situação relevante em um meme com a identidade do DEPRESSIVOS 2000.
Pense como um roteirista que acorda todos os dias e pergunta:
“O que está acontecendo no mundo que daria um ótimo meme?”

1. OBSERVAÇÃO DO MOMENTO & ACESSO À WEB:
Quando houver acesso à internet, antes de criar conteúdo atual, pesquise o que está acontecendo no momento da geração:
* assuntos em alta, notícias relevantes, acontecimentos políticos, eleições, eventos esportivos;
* celebridades, influenciadores, lançamentos de filmes/séries/músicas, reality shows;
* memes que estão circulando, discussões nas redes sociais, acontecimentos inesperados, curiosos e absurdos;
* mudanças de comportamento, assuntos no TikTok, Instagram, X/Twitter;
* datas comemorativas, feriados, eventos nacionais, acontecimentos culturais.
IMPORTANTE: Não transforme o perfil em um portal de notícias. A notícia é apenas o gatilho para a piada.

2. EXEMPLO: ELEIÇÕES & POLÍTICA:
Se estiver em período eleitoral, observe o comportamento social e procure situações engraçadas (discussões em grupo de família, promessas absurdas, debates, ansiedade dos eleitores). Nunca faça propaganda política ou ataque partidário. O objetivo é transformar o contexto social em humor.

3. CULTURA POP:
Filmes, séries, reality shows, músicas, premiações, celebridades. Crie uma abordagem própria com o DNA Depressivos 2000, sem copiar memes alheios.

4. INTERNET:
Novos memes, trends, áudios, comportamentos estranhos, gírias novas, prints virais, polêmicas. Parecer conectado à internet em tempo real.

5. VIDA COTIDIANA:
Supermercado, Uber, ônibus, academia, trabalho, faculdade, condomínio, vizinhos, família, delivery, compras, bancos, filas, burocracia, tecnologia. Procure situações específicas e absurdas.

6. RELACIONAMENTOS:
Dates, ex, ficantes, ghosting, ciúmes, recaídas, stalk, aplicativos, vergonha, apego ansioso. Mas relacionamento é apenas um dos pilares.

7. MADRUGADA:
Entre 00h e 06h: decisões ruins, mensagens, carência, compras no impulso, stalk, arrependimento. Mas NÃO produza somente memes de madrugada.

8. MEDICAMENTOS E SITUAÇÕES NOTURNAS:
Humor sobre a experiência de "era para dormir, mas...". Não invente efeitos farmacológicos, não recomende doses nem incentive uso incorreto. O humor está na situação.

9. HUMOR ÁCIDO:
Sarcasmo, pessimismo, absurdo, ironia, autodepreciação, humor desconfortável. Sem incentivo a dano real, violência ou suicídio.

10. HUMOR DE CONTRASTE:
* imagem alegre + frase horrível
* música feliz + situação deprimente
* estética bonita + pensamento absurdo
* Windows 2000 perfeito + mensagem de erro emocional

11. WINDOWS 2000 / MSN / INTERNET ANTIGA:
Estética inspirada em Windows 2000, MSN, Orkut, mensagens de erro, nostalgia digital. Use como linguagem visual e temática.

12. CALENDÁRIO & EVENTOS:
Carnaval, Dia dos Namorados, Natal, Ano Novo, Halloween, eleições, Copa, Olimpíadas, Black Friday, feriados. Procure a perspectiva inesperada.

13. SISTEMA DE DESCOBERTA EM 7 ETAPAS:
1. Descobrir o que está acontecendo.
2. Selecionar acontecimentos com potencial humorístico.
3. Separar por categorias.
4. Escolher os acontecimentos mais interessantes.
5. Transformá-los em ideias originais.
6. Aplicar o DNA DEPRESSIVOS 2000.
7. Eliminar memes genéricos.

14. DISTRIBUIÇÃO BALANCEADA:
Nunca gere um lote inteiro sobre o mesmo assunto. Crie uma mistura de cotidiano, acontecimentos atuais, internet, cultura pop, relacionamentos, humor ácido, saúde mental, trabalho, tecnologia e nostalgia.

15. AS 12 REGRAS DE OURO:
1. NÃO SEJA PREVISÍVEL (banidas frases clichês).
2. ESPECIFICIDADE ABSURDA (detalhes cirúrgicos e plausíveis).
3. QUEBRA DE EXPECTATIVA (virada seca e desconcertante no final).
4. HUMOR ADULTO (dates ruins, stalking, ressaca moral, vergonha, compras no impulso).
5. ABSURDO CRÍVEL.
6. VERGONHA ALHEIA IDENTIFICÁVEL.
7. HUMOR DE GRUPO E PV ("Isso é muito você").
8. NÃO EXPLIQUE A PIADA (termine seco).
9. SEM MORAL DA HISTÓRIA (zero lições de vida ou autoajuda).
10. PSICOLOGIA SEM CARA DE PSICOLOGIA.
11. NÃO DIMINUIR PSICÓLOGOS.
12. NÃO ROMANTIZAR SOFRIMENTO.

PERGUNTA FINAL DO DNA:
“Isso poderia ter sido postado por qualquer página de memes?” (Se sim, reescreva)
“Isso tem personalidade própria e parece DEPRESSIVOS 2000?” (Se não, descarte)
`;

// Helper to generate rich, contextual Depressivos 2000 memes based on visual vibe and context (Broad Mental Health)
function generateFallbackMediaAnalysis(
  vibe: string = "saude-mental-geral",
  extraContext: string = "",
  mediaType: string = "image",
  iteration: number = 1,
  excludeTexts: string[] = []
) {
  const contextNote = extraContext ? ` (Foco: ${extraContext})` : "";

  const sceneDescriptions: Record<string, string[]> = {
    'saude-mental-geral': [
      'Pessoa ou cena visual transmitindo o peso invisível da rotina, a luta diária contra a apatia e a tentativa heróica de manter a compostura.',
      'Expressão de quem está presente fisicamente, mas a alma desconectou do servidor há cerca de duas horas.',
      'Cena clássica de quem sobreviveu a mais um dia na base do café, da negação e de piadas autodepreciativas.',
      'Olhar distante e contemplativo de quem está repensando cada decisão tomada desde o ensino fundamental.'
    ],
    'crise-30-anos': [
      'Expressão clássica de quem completou 30 anos e descobriu que a vida adulta não vem com manual, apenas com dor nas costas e boletos.',
      'Momento exato em que a pessoa percebe que seu grupo de amigos agora só discute taxa de condomínio e marcas de airfryer.',
      'Fisionomia de quem foi dormir jovem e acordou precisando de fisioterapia e consulta com reumatologista.',
      'Cena de quem percebeu que a juventude foi embora e deixou apenas faturas do cartão de crédito no lugar.'
    ],
    'crise-meia-idade': [
      'Momento reflexivo encarando o horizonte e se perguntando onde foram parar todas as promessas e planos dos 20 anos.',
      'Expressão de quem calculou o tempo restante de vida útil e concluiu que o plano de carreira era uma ilusão coletiva.',
      'Postura de quem está a um passo de adotar um hobby bizarro de final de semana para preencher o vazio existencial.',
      'Olhar nostálgico lembrando de quando a maior responsabilidade era não perder a hora do almoço de domingo.'
    ],
    'ansiedade-pensamentos': [
      'Postura de quem está aparentemente calmo por fora, mas por dentro está rodando 47 cenários catastróficos que nunca vão acontecer.',
      'Expressão de quem recebeu uma notificação sem texto e o cérebro já começou a redigir o próprio testamento.',
      'Momento clássico de overthinking noturno: calculando todas as probabilidades de desastre em escala cósmica.',
      'Fisionomia de quem está em modo alerta máximo porque alguém disse "precisamos conversar amanhã".'
    ],
    'burnout-esgotamento': [
      'Fisionomia de exaustão extrema pós-expediente, com bateria cerebral em 1% e zero condições de processar mais qualquer informação.',
      'Expressão de quem abriu a caixa de entrada do email às 09:02 e já sentiu a alma abandonando o corpo.',
      'Cena de quem está participando de uma reunião que poderia ter sido resolvida com um silêncio de 5 segundos.',
      'Olhar vidrado na tela do computador esperando o horário do expediente acabar por pura força de vontade.'
    ],
    'bateria-social': [
      'Energia social zerada no meio de um evento, planejando minuciosamente a rota de fuga sem precisar se despedir de ninguém.',
      'Expressão de quem aceitou um convite por educação e agora está arrependido desde o primeiro minuto em que pisou no local.',
      'Momento exato em que o sorriso social desmonta e a vontade de ficar no quarto escuro atinge 100%.',
      'Fisionomia de quem colocou o celular no modo avião só pra não ter a obrigação moral de responder ninguém hoje.'
    ],
    'terapia-diva': [
      'Cena de desabafo pós-sessão de terapia, encarando a dura realidade de que a autossabotagem era a única coisa constante na rotina.',
      'Expressão de quem passou 50 minutos rindo das próprias desgraças até o psicólogo anotar algo com expressão séria.',
      'Momento em que você descobre que aquele comportamento que você achava engraçado na verdade era um mecanismo de defesa.',
      'Fisionomia de quem pagou caro na consulta para descobrir que o problema não era o mundo, era o padrão de apego.'
    ],
    'nostalgia-anos-2000': [
      'Ambiente nostálgico com estética dos anos 2000, quando a maior preocupação era escolher a fonte certa pro subnick do MSN.',
      'Expressão de saudade da época em que a internet discada caía à meia-noite e a vida era muito mais simples.',
      'Cena com energia emo anos 2000: fone de ouvido com fio, franja de lado e o coração despedaçado ouvindo Fresno.',
      'Momento retrô lembrando de quando o maior drama era ser deixado no topo do Orkut por consideração.'
    ],
  };

  const topics: Record<string, string[]> = {
    'saude-mental-geral': [
      'Depressão Cotidiana & Sobrevivência Emocional',
      'Sobrecarga de Existência & Cansaço Crônico',
      'Apatia Funcional em Horário Comercial',
      'Sanidade Mental em Manutenção Preventiva'
    ],
    'crise-30-anos': [
      'Crise dos 30 Anos & Choque da Vida Adulta',
      'Colapso da Juventude & Boletos em Anexo',
      'Metabolismo dos 30 & Dor nas Costas',
      'Desilusão Corporativa & Crise de Idade'
    ],
    'crise-meia-idade': [
      'Crise Existencial & Reflexão da Meia-Idade',
      'Nostalgia dos 20 Anos vs Realidade Atual',
      'Balanço de Danos & Questionamentos da Vida',
      'Dilemas da Vida Adulta em Resolução Máxima'
    ],
    'ansiedade-pensamentos': [
      'Ansiedade Generalizada & Pensamentos Intrusivos',
      'Overthinking Noturno & Catástrofes Imaginárias',
      'Pânico de Notificações & Mensagens Não Lidas',
      'Cérebro em Loop às 03 da Manhã'
    ],
    'burnout-esgotamento': [
      'Burnout, Esgotamento & Sobrecarga Mental',
      'Exaustão Corporativa & Modo Zumbi',
      'Fingindo Produtividade das 09h às 18h',
      'Bateria Mental Esgotada com Sucesso'
    ],
    'bateria-social': [
      'Bateria Social 0% & Vontade de Sumir',
      'Evasão Social Estratégica sem Despedida',
      'Pânico de Interações Humanas Desnecessárias',
      'Isolamento Tático no Quarto Escuro'
    ],
    'terapia-diva': [
      'Terapia, Divã & Autossabotagem Desmascarada',
      'Sessão de 50 Minutos vs Realidade Dolorosa',
      'Rindo da Própria Desgraça no Consultório',
      'Mecanismos de Defesa em Colapso'
    ],
    'nostalgia-anos-2000': [
      'Nostalgia Emo 2000 vs Caos Mental Atual',
      'Subnick do MSN & Internet Discada',
      'Dramas dos Anos 2000 vs Boletos de 2026',
      'Trilha Sonora Emo do Esgotamento'
    ],
  };

  // Grand Pool of 120+ authentic DEPRESSIVOS 2000 memes categorized
  const memePool: Record<string, Array<{
    title: string;
    text: string;
    highlight: string;
    template: string;
    systemTitle: string;
    windowButtonText: string;
    shadowColor: string;
    sticker?: string;
  }>> = {
    'saude-mental-geral': [
      {
        title: 'Depressão & Cansaço Existencial',
        text: 'Não é que eu seja pessimista. Eu só olho pra vida com a mesma empolgação de quem é acordado por furadeira no sábado às 07:15.',
        highlight: 'mesma empolgação de quem é acordado por furadeira',
        template: 'tweet-parede',
        systemTitle: 'Status Mental - modo_sobrevivencia.exe',
        windowButtonText: 'RECARREGAR SANIDADE',
        shadowColor: '#0000FF',
        sticker: 'battery',
      },
      {
        title: 'Funcionamento no Automático',
        text: 'Meu corpo está presente fisicamente, mas a minha consciência pediu demissão e está assistindo a tudo do camarote.',
        highlight: 'minha consciência pediu demissão',
        template: 'sistema-alerta',
        systemTitle: 'Erro Fatal: alma_desconectada.dll',
        windowButtonText: 'TENTAR NOVAMENTE',
        shadowColor: '#FF3333',
        sticker: 'warning',
      },
      {
        title: 'Decisões da Madrugada',
        text: 'Deitei às 23h pra regular o sono e às 02:40 eu estava pesquisando o preço de um detector de metais no Mercado Livre.',
        highlight: 'detector de metais no Mercado Livre',
        template: 'terminal-dark',
        systemTitle: '> historico_noturno.log',
        windowButtonText: 'LIMPAR RASTROS',
        shadowColor: '#00FF66',
        sticker: 'skull',
      },
      {
        title: 'Nível de Paciência Atual',
        text: 'Minha paciência hoje está igual bateria de celular viciado: se você tirar do carregador, desliga em 12 segundos.',
        highlight: 'bateria de celular viciado',
        template: 'blue-screen',
        systemTitle: 'KERNEL_PANIC: PACIENCIA_ZERO',
        windowButtonText: 'REINICIAR HUMOR',
        shadowColor: '#0000AA',
        sticker: 'battery',
      },
      {
        title: 'Modo Sobrevivência Ativado',
        text: 'Vivendo exclusivamente à base de cafeína, negação da realidade e da esperança de que o próximo final de semana dure 6 meses.',
        highlight: 'negação da realidade e da esperança',
        template: 'windows-media-player',
        systemTitle: 'WMP 9 - rotina_em_loop.wmv',
        windowButtonText: 'PAUSAR TUDO',
        shadowColor: '#0055EA',
        sticker: 'cd',
      },
      {
        title: 'Conversa com o Espelho',
        text: 'Olho no espelho de manhã e penso: "Força guerreiro, hoje você só precisa fingir normalidade por mais 14 horas".',
        highlight: 'fingir normalidade por mais 14 horas',
        template: 'tweet-parede',
        systemTitle: 'Motivação_Diária_Falha.exe',
        windowButtonText: 'VOLTAR PRA CAMA',
        shadowColor: '#1A1A1A',
        sticker: 'sad-smile',
      },
      {
        title: 'Cupom de Danos Emocionais',
        text: '01 un Café Amargo R$ 9,00\n01 un Crise Existencial R$ 0,00\n01 un Vontade de Sumir R$ 99,00\n\nTOTAL DO DIA: R$ 108,00 (Pago com cansaço)',
        highlight: 'Pago com cansaço',
        template: 'nota-fiscal',
        systemTitle: 'Comprovante do Dia',
        windowButtonText: 'EMITIR NOTA',
        shadowColor: '#FF007F',
        sticker: 'battery',
      },
      {
        title: 'Alerta de Sanidade',
        text: 'AVISO: A sua cota diária de interações humanas de bom senso foi esgotada antes mesmo do meio-dia.',
        highlight: 'cota diária de interações humanas',
        template: 'sistema-alerta',
        systemTitle: 'Gerenciador de Tarefas: Paciência',
        windowButtonText: 'FINALIZAR PROCESSO',
        shadowColor: '#FF3333',
        sticker: 'warning',
      },
      {
        title: 'Diálogo com os Pensamentos',
        text: 'Cérebro: "Você esqueceu de algo importante."\nEu: "O quê?"\nCérebro: "Não sei, mas vou acelerar seu coração só por garantia."',
        highlight: 'acelerar seu coração só por garantia',
        template: 'tweet-parede',
        systemTitle: 'Ato Falho - freud_explicaria.exe',
        windowButtonText: 'DESLIGAR MOTOR',
        shadowColor: '#0000FF',
        sticker: 'warning',
      }
    ],

    'crise-30-anos': [
      {
        title: 'Crise dos 30 Anos & Prioridades',
        text: 'Fazer 30 anos é acordar um dia e perceber que seu maior sonho de consumo não é uma viagem internacional, é um colchão ortopédico com densidade 33.',
        highlight: 'colchão ortopédico com densidade 33',
        template: 'tweet-parede',
        systemTitle: 'Alerta da Idade - crise_dos_30.exe',
        windowButtonText: 'ACEITAR O DESTINO',
        shadowColor: '#0000FF',
        sticker: 'warning',
      },
      {
        title: 'Fisioterapia & Realidade',
        text: 'Antigamente eu virava duas noites bebendo cerveja morna e ia trabalhar. Hoje eu durmo com a cabeça meio torta e preciso de 3 sessões de quiropraxia.',
        highlight: '3 sessões de quiropraxia',
        template: 'sistema-alerta',
        systemTitle: 'Alerta Postural - coluna_travada.sys',
        windowButtonText: 'TOMAR DORFLEX',
        shadowColor: '#FF3333',
        sticker: 'broken-heart',
      },
      {
        title: 'Assuntos de Gente Grande',
        text: 'O momento exato em que a juventude vai embora é quando você entra numa conversa sobre marcas de lava-louças e defende a sua com unhas e dentes.',
        highlight: 'conversa sobre marcas de lava-louças',
        template: 'mockup-tv-vhs',
        systemTitle: 'RELEMBRANDO OS 20 ANOS (VHS)',
        windowButtonText: 'REBOBINAR',
        shadowColor: '#335588',
        sticker: 'sad-smile',
      },
      {
        title: 'Relatório da Década',
        text: 'Aos 18 eu achava que aos 30 estaria casado e com a vida resolvida. Aos 30 eu comemoro quando o mercado faz promoção de amaciante concentrado.',
        highlight: 'promoção de amaciante concentrado',
        template: 'tweet-parede',
        systemTitle: 'Relatorio_Expectativas_vs_Realidade.log',
        windowButtonText: 'ACEITAR FATURA',
        shadowColor: '#1A1A1A',
        sticker: 'battery',
      },
      {
        title: 'Metabolismo em Greve',
        text: 'Meu metabolismo até os 25 anos: "Pode mandar 4 pedaços de pizza".\nMeu metabolismo aos 30: "Você respirou perto de um carboidrato, engorde 2kg".',
        highlight: 'respirou perto de um carboidrato',
        template: 'terminal-dark',
        systemTitle: '> metabolismo_erro_404.sh',
        windowButtonText: 'CANCELAR JANTAR',
        shadowColor: '#00FF66',
        sticker: 'skull',
      },
      {
        title: 'Sexta-Feira aos 30',
        text: 'Minha comemoração de sexta-feira aos 30 anos: tomar um banho quente às 20h, colocar pijama de flanela e não falar com nenhum ser humano até segunda.',
        highlight: 'não falar com nenhum ser humano',
        template: 'windows-media-player',
        systemTitle: 'WMP 9 - descanso_compulsorio.wmv',
        windowButtonText: 'DORMIR CEDO',
        shadowColor: '#0055EA',
        sticker: 'cd',
      },
      {
        title: 'Grupo dos Amigos Adultos',
        text: 'Grupo de amigos aos 20: "Onde é o esquenta hoje?"\nGrupo de amigos aos 30: "Alguém indica um eletricista de confiança que cobre barato?"',
        highlight: 'eletricista de confiança',
        template: 'msn-nostalgia',
        systemTitle: 'MSN 7.5 - Conversa em Grupo (Adultos)',
        windowButtonText: 'TREMER TELA',
        shadowColor: '#000080',
        sticker: 'msn',
      },
      {
        title: 'Ressaca Moral & Física',
        text: 'Ressaca aos 20: toma água e come um pastel.\nRessaca aos 30: três dias deitado encarando o teto questionando a existência de Deus e de todas as suas escolhas.',
        highlight: 'três dias deitado encarando o teto',
        template: 'tweet-parede',
        systemTitle: 'Ressaca_Moral_v3.exe',
        windowButtonText: 'NUNCA MAIS BEBO',
        shadowColor: '#0000FF',
        sticker: 'warning',
      }
    ],

    'crise-meia-idade': [
      {
        title: 'Crise da Meia-Idade & Dilemas',
        text: 'Cheguei na fase da vida em que se eu tomo uma decisão certa, eu fico desconfiado de que esqueci de levar algum desastre em consideração.',
        highlight: 'desconfiado de que esqueci de levar algum desastre',
        template: 'windows-media-player',
        systemTitle: 'Windows Media Player - MinhaVida_Em_Loop.wmv',
        windowButtonText: 'REBOBINAR',
        shadowColor: '#0055EA',
        sticker: 'cd',
      },
      {
        title: 'Balanço da Existência',
        text: 'Olhando pros meus 20 anos como quem olha pro motor de um carro que pegou fogo na estrada: com respeito, mas sem vontade nenhuma de voltar.',
        highlight: 'carro que pegou fogo na estrada',
        template: 'mockup-tv-vhs',
        systemTitle: 'TV CRT 14" - TELA CONVEXA',
        windowButtonText: 'TROCAR CANAL',
        shadowColor: '#335588',
        sticker: 'sad-smile',
      },
      {
        title: 'Hobby Aleatório para Vazio',
        text: 'Entrando naquela fase perigosa da meia-idade em que comprar uma cafeteira italiana ou aprender marcenaria parece a solução pra todos os problemas.',
        highlight: 'aprender marcenaria parece a solução',
        template: 'tweet-parede',
        systemTitle: 'Crise_Existencial_v4.0.exe',
        windowButtonText: 'COMPRAR FERRAMENTAS',
        shadowColor: '#1A1A1A',
        sticker: 'battery',
      },
      {
        title: 'Paciência Seletiva',
        text: 'Não tenho mais idade nem saúde mental pra discussão de internet. Se você disser que a Terra é triangular, eu concordo e ainda te desejo um bom dia.',
        highlight: 'Terra é triangular, eu concordo',
        template: 'sistema-alerta',
        systemTitle: 'Filtro de Paz de Espírito.sys',
        windowButtonText: 'ENCERRAR DEBATE',
        shadowColor: '#0000FF',
        sticker: 'warning',
      },
      {
        title: 'Tempo Passando Rápido',
        text: 'O ano 2000 parece que foi há 8 anos atrás, mas ontem me chamaram de "senhor" na fila da padaria e eu quase pedi um atestado médico na hora.',
        highlight: 'quase pedi um atestado médico',
        template: 'blue-screen',
        systemTitle: 'FATAL_TIME_DILATION_ERROR',
        windowButtonText: 'VOLTAR NO TEMPO',
        shadowColor: '#0000AA',
        sticker: 'broken-heart',
      }
    ],

    'ansiedade-pensamentos': [
      {
        title: 'Ansiedade & Cenários Mentais',
        text: 'Minha mente às 02:40 da manhã: "E se aquela pessoa que você não vê desde 2013 estiver brava com algo que você disse num trabalho de biologia?"',
        highlight: 'brava com algo que você disse num trabalho de biologia',
        template: 'sistema-alerta',
        systemTitle: 'Aviso Crítico - ansiedade_noturna.exe',
        windowButtonText: 'DESLIGAR PENSAMENTOS',
        shadowColor: '#FF3333',
        sticker: 'warning',
      },
      {
        title: 'Pânico da Notificação',
        text: 'Recebi uma mensagem: "Podemos falar rapidinho?"\nMeu cérebro em 0.2 segundos: demissão, despejo, prisão preventiva e fim do mundo.',
        highlight: 'demissão, despejo, prisão preventiva',
        template: 'terminal-dark',
        systemTitle: '> simulador_catastrofes.sh',
        windowButtonText: 'ABORTAR MISSÃO',
        shadowColor: '#00FF66',
        sticker: 'skull',
      },
      {
        title: 'Overthinking Profissional',
        text: 'Eu não penso demais. Eu apenas produzo 8 temporadas com 24 episódios cada sobre problemas que ainda nem existem.',
        highlight: 'produzo 8 temporadas com 24 episódios',
        template: 'windows-media-player',
        systemTitle: 'WMP 9 - serie_catastrofes.avi',
        windowButtonText: 'PAUSAR DRAMA',
        shadowColor: '#0055EA',
        sticker: 'cd',
      },
      {
        title: 'Áudio de WhatsApp',
        text: 'Quando alguém me manda um áudio de 3 minutos e 42 segundos, meu coração acelera como se fosse uma intimação da Receita Federal.',
        highlight: 'intimação da Receita Federal',
        template: 'tweet-parede',
        systemTitle: 'Pânico_Auditivo.dll',
        windowButtonText: 'OUVIR EM 2X',
        shadowColor: '#0000FF',
        sticker: 'warning',
      },
      {
        title: 'Calculadora de Riscos Irreais',
        text: 'Ansiedade é pagar aluguel adiantado por um sofrimento que nunca vai se mudar pra sua casa.',
        highlight: 'pagar aluguel adiantado por um sofrimento',
        template: 'nota-fiscal',
        systemTitle: 'Boleto do Sofrimento Antecipado',
        windowButtonText: 'CANCELAR COBRANÇA',
        shadowColor: '#FF007F',
        sticker: 'broken-heart',
      }
    ],

    'burnout-esgotamento': [
      {
        title: 'Burnout & Esgotamento Total',
        text: 'Fingir que sou um profissional funcional das 09h às 18h gasta toda a energia que Deus me deu pra semana inteira.',
        highlight: 'profissional funcional das 09h às 18h',
        template: 'tweet-parede',
        systemTitle: 'Erro do Sistema - memoria_esgotada.dll',
        windowButtonText: 'PEDIR DEMISSÃO DA VIDA',
        shadowColor: '#1A1A1A',
        sticker: 'battery',
      },
      {
        title: 'Reunião Inútil',
        text: 'Mais uma reunião de 1 hora que poderia ter sido um email, que poderia ter sido uma mensagem de texto, que poderia ter sido um silêncio.',
        highlight: 'poderia ter sido um silêncio',
        template: 'sistema-alerta',
        systemTitle: 'Alerta Corporativo: Perda de Tempo',
        windowButtonText: 'MUTAR MICROFONE',
        shadowColor: '#FF3333',
        sticker: 'warning',
      },
      {
        title: 'Bateria Cerebral 1%',
        text: 'Chegou naquele horário do expediente em que se alguém me perguntar quanto é 2 + 2 eu começo a chorar e peço 15 minutos de intervalo.',
        highlight: 'começo a chorar e peço 15 minutos',
        template: 'blue-screen',
        systemTitle: 'CRITICAL_PROCESS_DIED: CEREBRO',
        windowButtonText: 'BATER PONTO',
        shadowColor: '#0000AA',
        sticker: 'battery',
      },
      {
        title: 'Fim do Expediente',
        text: 'Desligar o computador do trabalho às 18:00 não me dá paz, só me dá 14 horas pra me preparar pro próximo colapso.',
        highlight: '14 horas pra me preparar pro próximo colapso',
        template: 'terminal-dark',
        systemTitle: '> shutdown_corporativo.sh',
        windowButtonText: 'DESCONECTAR',
        shadowColor: '#00FF66',
        sticker: 'skull',
      }
    ],

    'bateria-social': [
      {
        title: 'Bateria Social Zerada',
        text: 'Eu amo meus amigos, mas depois de 2 horas de conversa eu preciso de 5 dias em um quarto escuro sem contato com a civilização humana.',
        highlight: '5 dias em um quarto escuro',
        template: 'tweet-parede',
        systemTitle: 'Bateria - 0%_restando.sys',
        windowButtonText: 'DESCONECTAR',
        shadowColor: '#0000FF',
        sticker: 'battery',
      },
      {
        title: 'Desmarcar Compromisso',
        text: 'A melhor sensação da vida adulta não é ser promovido. É quando alguém cancela um compromisso que você não queria ir desde o início.',
        highlight: 'alguém cancela um compromisso',
        template: 'sistema-alerta',
        systemTitle: 'Vitória Silenciosa: Rolê Cancelado',
        windowButtonText: 'COMEMORAR NO QUARTO',
        shadowColor: '#0000FF',
        sticker: 'sad-smile',
      },
      {
        title: 'Sumiço Estratégico',
        text: 'No meio da festa eu finjo que vou ao banheiro e já apareço na minha cama debaixo das cobertas com o celular no modo avião.',
        highlight: 'apareço na minha cama debaixo das cobertas',
        template: 'mockup-tv-vhs',
        systemTitle: 'FUGA TÁTICA (VHS)',
        windowButtonText: 'FUGIR',
        shadowColor: '#335588',
        sticker: 'battery',
      },
      {
        title: 'Ligar pro Telefone',
        text: 'Se você me ligar sem avisar antes pelo WhatsApp, eu vou deixar tocando até o fim e passar 4 horas pensando no que eu te fiz de errado.',
        highlight: 'deixar tocando até o fim',
        template: 'tweet-parede',
        systemTitle: 'Pânico_Chamada_Voz.exe',
        windowButtonText: 'RECUSAR LIGAÇÃO',
        shadowColor: '#1A1A1A',
        sticker: 'warning',
      }
    ],

    'terapia-diva': [
      {
        title: 'Na Sessão de Terapia',
        text: 'Passei 45 minutos rindo das minhas maiores desgraças e o psicólogo me olhou com uma cara de quem vai precisar de um café duplo.',
        highlight: 'rindo das minhas maiores desgraças',
        template: 'tweet-parede',
        systemTitle: 'Sessão_TCC - trauma_desmascarado.log',
        windowButtonText: 'DESMARCAR PRÓXIMA',
        shadowColor: '#1A1A1A',
        sticker: 'broken-heart',
      },
      {
        title: 'Autossabotagem Desmascarada',
        text: 'Psicóloga: "E por que você repete esse padrão?"\nEu: "Porque pelo menos esse erro eu já conheço o final e sei lidar."',
        highlight: 'esse erro eu já conheço o final',
        template: 'terminal-dark',
        systemTitle: '> psicanalise_loop_infinito.sh',
        windowButtonText: 'ENCERRAR SESSÃO',
        shadowColor: '#00FF66',
        sticker: 'skull',
      },
      {
        title: 'Investimento em Autoconhecimento',
        text: 'Gastei R$ 300 na sessão de hoje pra descobrir que o motivo de eu ser assim foi um comentário de uma professora da 4ª série em 2004.',
        highlight: 'comentário de uma professora da 4ª série',
        template: 'nota-fiscal',
        systemTitle: 'Recibo da Psicanálise',
        windowButtonText: 'PAGAR E CHORAR',
        shadowColor: '#FF007F',
        sticker: 'battery',
      },
      {
        title: 'Diagnóstico Emocional',
        text: 'Meu diagnóstico: um excesso de pensamentos, uma escassez de serotonina e uma coleção invejável de expectativas frustradas.',
        highlight: 'coleção invejável de expectativas frustradas',
        template: 'sistema-alerta',
        systemTitle: 'Laudo_Psicanalitico.dll',
        windowButtonText: 'FECHAR LAUDO',
        shadowColor: '#0000FF',
        sticker: 'warning',
      }
    ],

    'nostalgia-anos-2000': [
      {
        title: 'Nostalgia Anos 2000 vs Agora',
        text: 'Saudade de quando a minha única crise existencial era decidir se colocava trecho de NX Zero ou Fresno no subnick do MSN.',
        highlight: 'trecho de NX Zero ou Fresno no subnick',
        template: 'msn-nostalgia',
        systemTitle: 'MSN Messenger - (Ausente do Caos)',
        windowButtonText: 'CHAMAR ATENÇÃO',
        shadowColor: '#000080',
        sticker: 'msn',
      },
      {
        title: 'Winamp Classic MP3',
        text: 'Trilha Sonora do Esgotamento Mental:\n1. Linkin Park - In The End\n2. Evanescence - My Immortal\n3. Eu Tentando Manter a Calma',
        highlight: 'Trilha Sonora do Esgotamento Mental',
        template: 'winamp-retro',
        systemTitle: 'Winamp v2.91 - 128kbps stereo',
        windowButtonText: 'PLAY LIST',
        shadowColor: '#00FF66',
        sticker: 'cd',
      },
      {
        title: 'Internet Discada & Paz',
        text: 'A internet discada era barulhenta e lenta, mas pelo menos ninguém esperava que você respondesse uma mensagem de trabalho às 22h de domingo.',
        highlight: 'ninguém esperava que você respondesse',
        template: 'blue-screen',
        systemTitle: 'DISCADOR_IG_DIALUP.SYS',
        windowButtonText: 'DESCONECTAR LINHA',
        shadowColor: '#0000AA',
        sticker: 'battery',
      },
      {
        title: 'Topo do Orkut',
        text: 'Minha vida amorosa era muito mais simples quando a maior prova de amor era ficar no "Top 1" do Orkut com direito a depoimento secreto.',
        highlight: 'Top 1 do Orkut com depoimento secreto',
        template: 'tweet-parede',
        systemTitle: 'Orkut_2006_Nostalgia.exe',
        windowButtonText: 'ACEITAR SCRAP',
        shadowColor: '#1A1A1A',
        sticker: 'msn',
      }
    ]
  };

  // Combine current vibe memes with other vibes to guarantee massive pool
  const currentCategoryMemes = memePool[vibe] || memePool['saude-mental-geral'];
  const allOtherMemes: typeof currentCategoryMemes = [];
  Object.keys(memePool).forEach(k => {
    allOtherMemes.push(...memePool[k]);
  });

  // Filter out previously seen texts if provided
  const excludeSet = new Set(excludeTexts.map(t => t.trim().toLowerCase()));
  let availableInVibe = currentCategoryMemes.filter(m => !excludeSet.has(m.text.trim().toLowerCase()));
  let availableOther = allOtherMemes.filter(m => !excludeSet.has(m.text.trim().toLowerCase()));

  // Fallback to full pool if exhausted
  if (availableInVibe.length < 2) availableInVibe = [...currentCategoryMemes];
  if (availableOther.length < 8) availableOther = [...allOtherMemes];

  // Shuffle helper with random seed mixing
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuffledVibe = shuffle(availableInVibe);
  const shuffledOther = shuffle(availableOther.filter(m => m.text !== shuffledVibe[0]?.text));

  const selectedPrimary = {
    ...shuffledVibe[0],
    title: `★ Opção Principal: ${shuffledVibe[0].title} (Ideia #${iteration})`
  };

  // Select 7 unique alternatives
  const selectedAlternatives: typeof currentCategoryMemes = [];
  const chosenTexts = new Set<string>([selectedPrimary.text]);

  // First pick from remaining vibe options
  for (let i = 1; i < shuffledVibe.length && selectedAlternatives.length < 4; i++) {
    if (!chosenTexts.has(shuffledVibe[i].text)) {
      selectedAlternatives.push(shuffledVibe[i]);
      chosenTexts.add(shuffledVibe[i].text);
    }
  }

  // Then fill the rest from shuffled other vibes to guarantee 7 unique alternatives
  for (let i = 0; i < shuffledOther.length && selectedAlternatives.length < 7; i++) {
    if (!chosenTexts.has(shuffledOther[i].text)) {
      selectedAlternatives.push(shuffledOther[i]);
      chosenTexts.add(shuffledOther[i].text);
    }
  }

  // Map titles to sequential numbering
  const formattedAlternatives = selectedAlternatives.map((m, idx) => ({
    ...m,
    title: `Opção ${idx + 2}: ${m.title}`
  }));

  const scenesList = sceneDescriptions[vibe] || sceneDescriptions['saude-mental-geral'];
  const topicsList = topics[vibe] || topics['saude-mental-geral'];
  const randomScene = scenesList[Math.floor(Math.random() * scenesList.length)] + contextNote;
  const randomTopic = topicsList[Math.floor(Math.random() * topicsList.length)] + contextNote;

  return {
    detectedScene: randomScene,
    identifiedTopic: randomTopic,
    publishingMetadata: {
      caption: `Manda no privado daquela pessoa que também tá sobrevivendo no modo automático e fingindo que tem tudo sob controle 💀☕ (Rodada #${iteration})\n\n#depressivos2000 #saudemental #ansiedade #crisedos30 #burnout #humorbrasil #nostalgia2000`,
      hashtags: [
        '#depressivos2000',
        '#saudemental',
        '#ansiedade',
        '#depressao',
        '#crisedos30',
        '#burnout',
        '#humorbrasil',
        '#terapia',
        '#nostalgia2000'
      ],
      viralAudioSuggestion: 'Áudio retrô com transição cômica / The Reason (Hoobastank) / Barulho do MSN chamando atenção / Trecho acústico emo anos 2000.',
      threeVisualVariations: [
        {
          styleName: 'Opção 1: Windows Media Player XP (Retrô)',
          template: 'windows-media-player' as any,
          description: 'Janela clássica do WMP 9 com controles azuis e visualização'
        },
        {
          styleName: 'Opção 2: Pop-up de Erro Windows 98',
          template: 'sistema-alerta' as any,
          description: 'Aviso clássico do sistema com botão de OK e chanfros cinza'
        },
        {
          styleName: 'Opção 3: Tweet de Parede Brutalista',
          template: 'tweet-parede' as any,
          description: 'Alto impacto para feed no estilo oficial @DEPRESSIVOS2000'
        }
      ]
    },
    primaryMeme: selectedPrimary,
    alternativeMemes: formattedAlternatives,
  };
}

// API endpoint to analyze an uploaded image or video frames with multimodal vision
app.post("/api/analyze-media", async (req, res) => {
  const {
    imageBase64,
    mimeType = "image/jpeg",
    extraContext = "",
    vibe = "saude-mental-geral",
    temperature = 1.15,
    mediaType = "image",
    iteration = 1,
    seed = "",
    excludeTexts = []
  } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Nenhuma imagem ou frame fornecido para análise." });
  }

  const iterNumber = Math.max(1, Number(iteration) || 1);
  const cleanExcludeList = Array.isArray(excludeTexts) ? excludeTexts.map(t => String(t).trim()).filter(Boolean) : [];

  // Extract real MIME type and sanitize base64 data
  let cleanMimeType = mimeType || "image/jpeg";
  let base64Data = String(imageBase64);

  if (base64Data.includes(";base64,")) {
    const parts = base64Data.split(";base64,");
    const mimeMatch = parts[0].match(/data:([a-zA-Z0-9/+-]+)/);
    if (mimeMatch && mimeMatch[1]) {
      cleanMimeType = mimeMatch[1];
    }
    base64Data = parts[1];
  } else {
    base64Data = base64Data.replace(/^data:[^;]+;base64,/, "");
  }

  // Remove any whitespace or newline characters
  base64Data = base64Data.replace(/\s+/g, "");

  // Supported Gemini image mime types
  const validMimes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!validMimes.includes(cleanMimeType)) {
    cleanMimeType = "image/jpeg";
  }

  const client = getGeminiClient();

  // If Gemini client is not configured, gracefully return the high-quality contextual fallback immediately
  if (!client) {
    console.log(`[analyze-media] Usando gerador contextual Depressivos 2000 (Rodada #${iterNumber}).`);
    const fallback = generateFallbackMediaAnalysis(vibe, extraContext, mediaType, iterNumber, cleanExcludeList);
    return res.json(fallback);
  }

  try {
    const angleModifiers = [
      "Foco especial em humor de madrugada, insônia e compras por impulso.",
      "Foco especial em cansaço corporativo, reuniões que poderiam ser silêncio e colapso às 17h.",
      "Foco especial em diálogos ácidos no consultório de terapia e autossabotagem desmascarada.",
      "Foco especial em choque de idade, dor na coluna, crise dos 30 e boletos de condomínio.",
      "Foco especial em bateria social zerada, fuga estratégica de festas e pânico de ligações.",
      "Foco especial em ansiedade, overthinking e 47 cenários catastróficos imaginários.",
      "Foco especial em nostalgia dos anos 2000, subnick do MSN e saudades da internet discada."
    ];
    const chosenAngle = angleModifiers[(iterNumber - 1) % angleModifiers.length];

    const promptText = `${BRAND_IDENTITY_PROMPT}

TAREFA PRINCIPAL: ANALISAR MINUCIOSAMENTE ESTA IMAGEM/FOTO/VÍDEO ENVIADA PELO USUÁRIO E CRIAR 8 MEMES HILÁRIOS, ÁCIDOS E 100% INÉDITOS FOCADOS NO UNIVERSO DA SAÚDE MENTAL EM GERAL!

[RODADA DE GERAÇÃO #${iterNumber} - SEED: ${seed || Date.now()}]
DIRETRIZ DE INEDITISMO & VARIAÇÃO OBRIGATÓRIA:
- Esta é a iteração #${iterNumber}. É EXPRESSAMENTE PROIBIDO REPETIR ideias ou piadas idênticas a rodadas anteriores.
- ${chosenAngle}
${cleanExcludeList.length > 0 ? `- ATENÇÃO: NÃO repita nem se aproxime dos seguintes textos já gerados:\n${cleanExcludeList.slice(-16).map(t => `  * "${t}"`).join('\n')}` : ''}

CRITÉRIO CRÍTICO E OBRIGATÓRIO (SAÚDE MENTAL AMPLA + ANÁLISE VISUAL):
1. INSPEÇÃO VISUAL DIRETA:
   - Os memes NÃO podem ser genéricos ou descolados da imagem!
   - Olhe atentamente: Quem ou o que aparece? (expressão no rosto, olhar cansado, sorriso forçado, pose, objetos na mão como copos/microfones/celulares, pets, roupas, cenário, luz).
   - A legenda do meme DEVE descrever ou dialogar diretamente com o que a pessoa/elemento na imagem está fazendo ou aparentando sentir.

2. UNIVERSO DE SAÚDE MENTAL AMPLO (NÃO apenas remédios/farmácia):
   - DEPRESSÃO & APATIA: Aquela sensação de estar vivendo no piloto automático, o cansaço existencial, o contraste entre estar presente fisicamente mas ausente mentalmente.
   - ANSIEDADE & PENSAMENTOS INTRUSIVOS: A mente criando 50 catástrofes irreais às 3 da manhã, o medo do futuro, a agonia de responder mensagens.
   - CRISE DOS 30 ANOS & VIDA ADULTA: O choque da realidade, o cansaço crônico, o corpo estalando, as cobranças sociais, os boletos acumulando, a despedida dos 20 anos.
   - CRISE DA MEIA-IDADE & EXISTENCIALISMO: Questionamentos sobre escolhas de vida, nostalgia do passado, sensação de que o tempo passou rápido demais.
   - BURNOUT & SOBRECARGA: Esgotamento profissional, fingir produtividade, reuniões que poderiam ser um email, bateria mental em 0%.
   - BATERIA SOCIAL & ISOLAMENTO: Desmarcar rolês em cima da hora para ficar no quarto escuro, pânico de ligações telefônicas, exaustão de conviver com humanos.
   - TERAPIA & AUTOSSABOTAGEM: O choque de realidade na sessão com o terapeuta, rir das próprias tragédias, autoconhecimento doloroso mas cômico.
   - NOSTALGIA ANOS 2000: Comparação irônica entre a época simples da infância/adolescência (MSN, Orkut, Emo) e o caos mental da vida adulta atual.

3. COESÃO, PONTUAÇÃO E FLUIDEZ DO TEXTO (REGRA DE OURO):
   - O texto deve ser imediatamente compreensível, fluido e de leitura instantânea sem confusão de onde termina ou começa outra oração.
   - NUNCA quebre uma frase contínua ao meio com quebras de linha artificiais. Se for uma ideia única, mantenha em uma única frase contínua com pontuação clara.
   - Use quebra de linha SOMENTE em diálogos estruturados (ex: 'Psicóloga: ...\\nEu: ...') ou quando houver Setup claro com dois pontos (ex: 'QUANDO A BATERIA SOCIAL ACABA NO MEIO DO ROLÊ:\\nSUMO SEM AVISAR NINGUÉM').
   - O trecho de destaque ("highlight") deve ser uma expressão-chave curta e marcante (de 2 a 5 palavras), e não uma frase inteira.

4. TÍTULOS DE JANELA / BARRA SUPERIOR CRIATIVOS (systemTitle):
   - Misture erros clássicos do Windows com trocadilhos psicanalíticos, saúde mental e vida adulta!
   - Exemplos obrigatórios de formato:
     * "Erro 404: Sanidade Não Encontrada"
     * "Ato Falho do Sistema - freud_explicaria.exe"
     * "Gerenciador de Tarefas: vida_adulta (Não Respondendo)"
     * "Erro Fatal: sobrecarga_emocional.dll"
     * "Falha Geral de Proteção: cerebro_em_pane.sys"
     * "Operação Ilegal: overthinking_noturno.bat"
     * "Windows Defender: Bloqueando Pessoas Tóxicas"
     * "Recycle Bin: expectativas_dos_20_anos"
     * "Diálogo Psicanalítico - sessao_50min.log"
     * "Bateria Social: 0% Restando.sys"
     * "Alerta da Idade - crise_dos_30.exe"

${extraContext ? `Contexto adicional fornecido pelo usuário: "${extraContext}"` : ""}
${vibe && vibe !== "variado" ? `Vibe solicitada: "${vibe}"` : ""}

ESTRUTURA DO JSON DE RESPOSTA OBRIGATÓRIA (retorne estritamente JSON válido):
{
  "detectedScene": "Descreva com precisão o que está visível na foto e o estado emocional aparente (ex: Pessoa segurando um copo com olhar distante e expressão de quem está tendo uma crise existencial em pleno evento social)",
  "identifiedTopic": "Tema/Diagnóstico Cômico de Saúde Mental (ex: Crise dos 30 Anos / Bateria Social 0% / Sobrecarga Emocional / Ansiedade)",
  "publishingMetadata": {
    "caption": "Legenda afiada para Instagram/TikTok comentando a cena da foto + chamada para compartilhar no privado (ex: 'Manda no PV daquele amigo que tem exatamente essa cara quando a bateria social acaba 💀')",
    "hashtags": ["#depressivos2000", "#saudemental", "#ansiedade", "#depressao", "#crisedos30", "#burnout", "#humorbrasil", "#nostalgia2000"],
    "viralAudioSuggestion": "Sugestão de música/áudio anos 2000 ou trend viral do Reels que combine perfeitamente com a energia da cena",
    "threeVisualVariations": [
      {
        "styleName": "Opção 1: Windows Media Player XP (Retrô)",
        "template": "windows-media-player",
        "description": "Enquadra a foto/vídeo dentro do player retrô WMP 9 com visualização"
      },
      {
        "styleName": "Opção 2: Alerta de Erro Windows 98/XP",
        "template": "sistema-alerta",
        "description": "Alerta de sistema com a foto e mensagem de sobrecarga emocional"
      },
      {
        "styleName": "Opção 3: Tweet de Parede Brutalista",
        "template": "tweet-parede",
        "description": "Formato clássico do @DEPRESSIVOS2000 com tipografia de alto impacto"
      }
    ]
  },
  "primaryMeme": {
    "title": "★ Opção Principal (Meme sobre a Cena)",
    "text": "Frase cômica e ácida diretamente inspirada na postura/expressão da imagem (1 a 3 linhas, use \\n\\n para quebras)",
    "highlight": "trecho de maior impacto em destaque",
    "template": "windows-media-player",
    "systemTitle": "Windows Media Player 9 Series - Reproduzindo",
    "windowButtonText": "REPRODUZIR",
    "shadowColor": "#0055EA",
    "sticker": "cd"
  },
  "alternativeMemes": [
    {
      "title": "Opção 2: Crise dos 30 Anos & Vida Adulta",
      "text": "Frase cômica sobre o peso dos 30 anos e cobranças da vida adulta baseada na foto",
      "highlight": "trecho de destaque",
      "template": "tweet-parede",
      "systemTitle": "Alerta da Idade - crise_dos_30.exe",
      "windowButtonText": "ACEITAR DESTINO",
      "shadowColor": "#0000FF",
      "sticker": "warning"
    },
    {
      "title": "Opção 3: Ansiedade & Pensamentos Intrusivos",
      "text": "Frase sobre cenários catastróficos e overthinking baseada na expressão da foto",
      "highlight": "trecho de destaque",
      "template": "sistema-alerta",
      "systemTitle": "Aviso do Sistema - ansiedade_generalizada.exe",
      "windowButtonText": "DESLIGAR MENTE",
      "shadowColor": "#FF3333",
      "sticker": "warning"
    },
    {
      "title": "Opção 4: Bateria Social Zerada & Isolamento",
      "text": "Frase sobre exaustão de pessoas e vontade de sumir baseada na foto",
      "highlight": "trecho de destaque",
      "template": "tweet-parede",
      "systemTitle": "Bateria Social - 0%_restando.sys",
      "windowButtonText": "IR EMBORA",
      "shadowColor": "#1A1A1A",
      "sticker: "battery"
    },
    {
      "title": "Opção 5: Burnout & Exaustão Profissional",
      "text": "Frase sobre cansaço extremo, trabalho e modo sobrevivência baseada na foto",
      "highlight": "trecho de destaque",
      "template": "windows-media-player",
      "systemTitle": "Modo Sobrevivência - expediente.wmv",
      "windowButtonText": "BATER PONTO",
      "shadowColor": "#0055EA",
      "sticker": "battery"
    },
    {
      "title": "Opção 6: Crise Existencial & Meia-Idade",
      "text": "Frase reflexiva e cômica sobre o rumo da vida baseada na foto",
      "highlight": "trecho de destaque",
      "template": "terminal-dark",
      "systemTitle": "> bash_crise_existencial.sh",
      "windowButtonText": "CANCELAR TUDO",
      "shadowColor": "#00FF66",
      "sticker": "skull"
    },
    {
      "title": "Opção 7: Na Sessão de Terapia",
      "text": "Frase estilo diálogo com o psicólogo sobre o que está acontecendo na foto",
      "highlight": "trecho de destaque",
      "template": "tweet-parede",
      "systemTitle": "Sessão TCC - autossabotagem.dll",
      "windowButtonText": "DESMARCAR PRÓXIMA",
      "shadowColor": "#1A1A1A",
      "sticker": "broken-heart"
    },
    {
      "title": "Opção 8: Nostalgia Anos 2000 vs Agora",
      "text": "Frase comparando o drama da adolescência anos 2000 com o colapso atual",
      "highlight": "trecho de destaque",
      "template": "msn-nostalgia",
      "systemTitle": "MSN Messenger 7.5 - Conversa Aberta",
      "windowButtonText": "TREMER TELA",
      "shadowColor": "#000080",
      "sticker": "msn"
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
              mimeType: cleanMimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      }
    ];

    // Wrap Gemini call with a 28-second timeout for thorough multimodal vision analysis
    const generatePromise = client.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        temperature: Math.min(Math.max(Number(temperature) || 1.05, 0.7), 1.4),
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini multimodal request timeout")), 28000)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);
    const text = response?.text;

    if (!text) {
      throw new Error("Gemini não retornou texto.");
    }

    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    const output = JSON.parse(cleaned);

    // Validate structure
    if (output && (output.primaryMeme || output.alternativeMemes)) {
      return res.json(output);
    } else {
      throw new Error("Formato de resposta incompleto da IA.");
    }
  } catch (error: any) {
    console.warn("[analyze-media] Aviso ao consultar Gemini API, acionando fallback inteligente:", error.message || error);
    // On any error or timeout, gracefully return our authentic contextual fallback
    const fallback = generateFallbackMediaAnalysis(vibe, extraContext, mediaType, iterNumber, cleanExcludeList);
    return res.json(fallback);
  }
});

// API endpoint for AI quote generation
app.post("/api/generate-quote", async (req, res) => {
  const { theme, style, tone, category } = req.body;
  const client = getGeminiClient();

  const fallbackQuote = () => {
    const picks = generateProceduralMemes(1, category || theme);
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
    const timestampSeed = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR UM POST 100% INÉDITO, ENGRAÇADO, CÔMICO E DE FORTE IDENTIFICAÇÃO PARA O FEED!
[TIMESTAMP_SEED: ${timestampSeed}]
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
        temperature: 1.25,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração")), 25000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = extractJsonFromText(response.text);
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
  }
];

// Procedural dynamic meme generator to guarantee thousands of unique, fresh memes on demand
function generateProceduralMemes(count = 20, filterCategory?: string, topicHint?: string) {
  const situations = [
    {
      setup: "Abrindo o extrato do banco depois de dizer 'eu mereço um agrado'",
      punchline: "e descobrindo que o agrado custou o aluguel do mês que vem e a minha dignidade financeira.",
      highlight: "dignidade financeira",
      template: "nota-fiscal",
      systemTitle: "Boleto_Fatura.exe",
      btn: "PAGAR COM CHORO",
      shadow: "#FF007F",
      sticker: "broken-heart",
      category: "Cotidiano & Vida Real",
      quadro: "Realidade em Anexo"
    },
    {
      setup: "Entrei no supermercado só pra comprar pão e detergente",
      punchline: "e saí com R$ 380 a menos, uma garrafa térmica retrô e a certeza de que a inflação me odeia pessoalmente.",
      highlight: "R$ 380 a menos",
      template: "nota-fiscal",
      systemTitle: "Cupom_Mercado.log",
      btn: "PARCELAR EM 12X",
      shadow: "#FF3333",
      sticker: "warning",
      category: "Cotidiano & Vida Real",
      quadro: "Preço da Existência"
    },
    {
      setup: "Quando alguém me manda mensagem 'precisamos falar de um assunto sério'",
      punchline: "e meu cérebro em 0.4 segundos já simula processo criminal, despejo, demissão e exílio em outro hemisfério.",
      highlight: "simula processo criminal",
      template: "sistema-alerta",
      systemTitle: "Alerta Crítico - panico_instantaneo.exe",
      btn: "DESLIGAR CELULAR",
      shadow: "#1A1A1A",
      sticker: "warning",
      category: "Ansiedade & Catástrofes",
      quadro: "Diagnóstico: Você é Fudido"
    },
    {
      setup: "Fui tentar dormir às 23h como uma pessoa funcional",
      punchline: "mas às 02:47 estou assistindo um documentário sobre a fabricação de rolamentos industriais na Suécia.",
      highlight: "rolamentos industriais na Suécia",
      template: "terminal-dark",
      systemTitle: "> insônia_aleatoria.sh",
      btn: "FECHAR TABS",
      shadow: "#00FF66",
      sticker: "skull",
      category: "Madrugada & Insônia",
      quadro: "3 da Manhã"
    },
    {
      setup: "Psicóloga: 'E o que você fez quando se sentiu rejeitado?'",
      punchline: "Eu: 'Comprei 4 camisas que não combinam comigo, pintei o cabelo no banheiro e desarquivei o chat do meu ex'.",
      highlight: "pintei o cabelo no banheiro",
      template: "tweet-parede",
      systemTitle: "Sessão TCC - autossabotagem.dll",
      btn: "DESMARCAR TERAPIA",
      shadow: "#0000FF",
      sticker: "broken-heart",
      category: "No Consultório",
      quadro: "Laudo Psicanalítico"
    },
    {
      setup: "O médico aumentou a dose do remédio para estabilizar meu humor",
      punchline: "agora sou uma pessoa calma, equilibrada e incapaz de chorar mesmo se um caminhão de melancias tombar na minha sala.",
      highlight: "incapaz de chorar",
      template: "sistema-alerta",
      systemTitle: "Bula_Interativa - escitalopram_20mg.exe",
      btn: "TOMAR COM ÁGUA",
      shadow: "#0055EA",
      sticker: "battery",
      category: "Farmacologia & Remédios",
      quadro: "Bula da Depressão"
    },
    {
      setup: "Meu amigo: 'Vamos sair rapidinho, só tomar uma água'",
      punchline: "Corta para às 03:15 discutindo geopolítica num posto de gasolina comendo coxinha fria de R$ 9.",
      highlight: "coxinha fria de R$ 9",
      template: "tweet-parede",
      systemTitle: "Evasão_Noturna.exe",
      btn: "VOLTAR DE UBER",
      shadow: "#FFD700",
      sticker: "warning",
      category: "Cotidiano & Vida Real",
      quadro: "Decisões Duvidosas"
    },
    {
      setup: "Minha bateria social dura exatamente 47 minutos",
      punchline: "depois disso começo a encarar a parede como se ela tivesse me ofendido e busco a saída de emergência com os olhos.",
      highlight: "bateria social dura exatamente 47 minutos",
      template: "tweet-parede",
      systemTitle: "Bateria_Social - 0%.sys",
      btn: "SUMIR SEM DESPEDIR",
      shadow: "#1A1A1A",
      sticker: "battery",
      category: "Bateria Social",
      quadro: "Evasão Estratégica"
    },
    {
      setup: "Abrindo o LinkedIn às 08:30 da manhã",
      punchline: "e vendo alguém de 22 anos comemorar 6 pós-graduações, 3 startups e um 'mindset de alta performance' enquanto eu não sei onde deixei minhas chaves.",
      highlight: "mindset de alta performance",
      template: "terminal-dark",
      systemTitle: "> linkedin_paranoia.sh",
      btn: "FECHAR ABA",
      shadow: "#00FF66",
      sticker: "skull",
      category: "Trabalho & Burnout",
      quadro: "Crise Existencial"
    },
    {
      setup: "A sensação de completar 30 anos e descobrir",
      punchline: "que você não virou um adulto refinado com taça de vinho, você só virou um jovem cansado com dor lombar e medo de barulho alto.",
      highlight: "jovem cansado com dor lombar",
      template: "sistema-alerta",
      systemTitle: "Alerta de Idade - crise_dos_30.exe",
      btn: "TOMAR TORSILAX",
      shadow: "#FF3333",
      sticker: "warning",
      category: "Crise dos 30 Anos",
      quadro: "Diagnóstico: Você é Fudido"
    },
    {
      setup: "Fui stalkear um perfil antigo no Instagram",
      punchline: "e o dedo escorregou e curtiu uma foto de praia de 2016. Meu enterro simbólico está marcado para as 16h.",
      highlight: "curtiu uma foto de praia de 2016",
      template: "msn-nostalgia",
      systemTitle: "MSN Messenger - (Desespero Total)",
      btn: "DELETAR CONTA",
      shadow: "#000080",
      sticker: "msn",
      category: "Internet & Redes",
      quadro: "Vergonha Alheia"
    },
    {
      setup: "Mais uma reunião de 1 hora que poderia ter sido resolvida",
      punchline: "com um silêncio respeitoso de 3 segundos e cada um cuidando da própria vida.",
      highlight: "silêncio respeitoso de 3 segundos",
      template: "windows-media-player",
      systemTitle: "WMP 9 - reuniao_corporativa.wmv",
      btn: "MUTAR ÁUDIO",
      shadow: "#0055EA",
      sticker: "cd",
      category: "Trabalho & Burnout",
      quadro: "Vida Corporativa"
    },
    {
      setup: "Visualizou às 14:02 e não respondeu",
      punchline: "Meu apego ansioso já redigiu 3 cartas de desculpas por erros que eu nem sei se cometi.",
      highlight: "3 cartas de desculpas",
      template: "msn-nostalgia",
      systemTitle: "MSN Messenger 7.5 - Chamando Atenção",
      btn: "TREMER TELA",
      shadow: "#000080",
      sticker: "msn",
      category: "Relacionamentos",
      quadro: "Apego Ansioso"
    },
    {
      setup: "Tomei Zolpidem achando que ia dormir como um anjo",
      punchline: "e acordei com comprovante de compra de uma piscina inflável de 5.000 litros e um teclado arranjador.",
      highlight: "piscina inflável de 5.000 litros",
      template: "terminal-dark",
      systemTitle: "> compra_madrugada.log",
      btn: "CANCELAR COMPRA",
      shadow: "#00FF66",
      sticker: "skull",
      category: "Farmacologia & Remédios",
      quadro: "Bula da Depressão"
    },
    {
      setup: "Observando o novo algoritmo e a nova trend da internet",
      punchline: "enquanto meu cérebro ainda está preso na sensação de abrir o Orkut e ver 12 depoimentos pendentes em 2007.",
      highlight: "12 depoimentos pendentes em 2007",
      template: "tweet-parede",
      systemTitle: "Nostalgia_Digital.exe",
      btn: "VOLTAR PRO PASSADO",
      shadow: "#0000FF",
      sticker: "msn",
      category: "Nostalgia Anos 2000",
      quadro: "Observatório do Mundo"
    },
    {
      setup: "A pessoa diz: 'Não se preocupe, vai dar tudo certo no final'",
      punchline: "e meu cérebro exige a apresentação de um laudo técnico assinado com firma reconhecida em cartório.",
      highlight: "firma reconhecida em cartório",
      template: "sistema-alerta",
      systemTitle: "Aviso de Segurança - ceticismo.exe",
      btn: "DUVIDAR ATÉ O FIM",
      shadow: "#1A1A1A",
      sticker: "warning",
      category: "Ansiedade & Catástrofes",
      quadro: "A Mente Não Colabora"
    }
  ];

  const results: any[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < count; i++) {
    const item = situations[(i + Math.floor(Math.random() * situations.length)) % situations.length];
    const uniqueId = `proc-${timestamp}-${i}-${Math.random().toString(36).substring(7)}`;

    results.push({
      id: uniqueId,
      category: item.category,
      quadro: item.quadro,
      text: `${item.setup}\n\n${item.punchline}`,
      highlight: item.highlight,
      template: item.template,
      systemTitle: item.systemTitle,
      windowButtonText: item.btn,
      shadowColor: item.shadow,
      sticker: item.sticker,
      caption: `${item.setup} ${item.punchline} Manda pro amigo que vive na mesma situação!`,
      hashtags: ["#depressivos2000", "#humorbrasil", "#saudemental", "#rirpranaochorar", "#nostalgia2000"],
      viralAudio: "Áudio nostálgico dos anos 2000 com som de erro do Windows",
      threeVisualVariations: [
        { name: "Opção 1: Alerta Windows 98", template: "sistema-alerta" },
        { name: "Opção 2: Terminal Dark 3AM", template: "terminal-dark" },
        { name: "Opção 3: Tweet de Parede", template: "tweet-parede" }
      ]
    });
  }

  return results;
}

function getShuffledMemes(count = 20, filterCategory?: string) {
  // If we need dynamic variety, generate procedurally combined memes
  return generateProceduralMemes(count, filterCategory);
}

function extractJsonFromText(rawText: string): any {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
    } catch {}
  }

  return null;
}

const DYNAMIC_MEME_BANK_PART2 = [
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

// Endpoint: OBSERVATÓRIO DO MUNDO & ACONTECIMENTOS ATUAIS (COM PESQUISA WEB VIA GEMINI + GOOGLE SEARCH)
app.post("/api/generate-live-world-memes", async (req, res) => {
  const { topic = "acontecimentos de hoje e internet", count = 10, searchFocus = "brasil tendências cultura pop e cotidiano" } = req.body;
  const client = getGeminiClient();

  if (!client) {
    return res.json({ memes: generateProceduralMemes(count, "Acontecimentos Atuais", topic) });
  }

  try {
    const timestampSeed = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: VOCÊ É O OBSERVATÓRIO DO MUNDO DO DEPRESSIVOS 2000!
[TIMESTAMP_SEED: ${timestampSeed}]
Use as ferramentas de pesquisa (Google Search) para descobrir o que está acontecendo HOJE no Brasil e no mundo (notícias, cultura pop, internet, tendências, eleições/debates sociais, lançamentos, comportamento) e transforme isso em ${count} memes 100% INÉDITOS com a identidade inconfundível do DEPRESSIVOS 2000!

DIRETRIZES FUNDAMENTAIS DO MOTOR DE CONTEÚDO:
1. PESQUISE fatos reais, assuntos quentes e tendências atuais: "${topic}" (${searchFocus}).
2. NÃO SEJA UM PORTAL DE NOTÍCIAS. A notícia é apenas o gatilho; a piada é o produto.
3. NÃO FAÇA POLÍTICA PARTIDÁRIA: Foque no comportamento humano ridículo (discussões de grupo de família, ansiedade, promessas absurdas).
4. APLIQUE AS 12 REGRAS DE OURO: Especificidade absurda, quebra de expectativa, corte seco, sem autoajuda, humor adulto.
5. BALANCEIE A DISTRIBUIÇÃO: Misture internet, cultura pop, cotidiano, relacionamentos e nostalgia.

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem texto solto antes ou depois):
{
  "trendingSummary": "Breve resumo em 1 parágrafo dos tópicos reais descobertos na pesquisa de hoje",
  "memes": [
    {
      "id": "1",
      "category": "Acontecimentos Atuais / Cultura Pop / Internet / Cotidiano",
      "quadro": "Observatório do Mundo",
      "text": "Texto do meme (curto, afiado, 1 a 3 frases, quebra de expectativa, corte seco)",
      "highlight": "palavra-chave do absurdo",
      "template": "tweet-parede",
      "systemTitle": "Alerta do Sistema - mundo_real.exe",
      "windowButtonText": "OK",
      "shadowColor": "#0000FF",
      "sticker": "warning",
      "caption": "Legenda completa pronta para Instagram com CTA para DM",
      "hashtags": ["#depressivos2000", "#humorbrasil", "#tendencias", "#observatoriodomundo"],
      "viralAudio": "Sugestão de áudio / trend em alta",
      "threeVisualVariations": [
        { "name": "Opção 1: Tweet de Parede", "template": "tweet-parede" },
        { "name": "Opção 2: Pop-up Windows 98", "template": "sistema-alerta" },
        { "name": "Opção 3: Terminal Dark 3AM", "template": "terminal-dark" }
      ]
    }
  ]
}`;

    // Generate with search grounding enabled and a 35s timeout
    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 1.15,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout pesquisa mundial Gemini")), 35000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const parsed = extractJsonFromText(response.text);

    if (parsed && Array.isArray(parsed.memes) && parsed.memes.length > 0) {
      return res.json(parsed);
    }
    
    if (parsed && Array.isArray(parsed)) {
      return res.json({ memes: parsed });
    }

    return res.json({ memes: generateProceduralMemes(count, "Acontecimentos Atuais", topic) });
  } catch (error: any) {
    console.warn("Falha no Observatório do Mundo com pesquisa web:", error.message || error);
    return res.json({ memes: generateProceduralMemes(count, "Acontecimentos Atuais", topic) });
  }
});

// Endpoint: ME DÊ 20 MEMES / BATCH MEMES
app.post("/api/generate-batch-memes", async (req, res) => {
  const { theme = "variado", count = 20, filterCategory, liveWebSearch = false } = req.body;
  const client = getGeminiClient();

  if (!client) {
    console.log("[Batch Memes] Gemini client não disponível, gerando memes procedurais dinâmicos.");
    return res.json({ memes: generateProceduralMemes(count, filterCategory, theme) });
  }

  try {
    const isCurrentEvents = liveWebSearch || /hoje|atual|noticia|notícia|eleiç|tendencia|tendência|mundo|famosos|pop|twitter|x/i.test(theme);
    const timestampSeed = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR UM LOTE DE ${count} MEMES 100% INÉDITOS, VARIADOS E EXTREMAMENTE ENGRAÇADOS COM O MOTOR DE CONTEÚDO DO DEPRESSIVOS 2000!
[TIMESTAMP_SEED: ${timestampSeed}]
Tema solicitado: "${theme}" (Filtro: ${filterCategory || "todos"})

Lembre-se: O DEPRESSIVOS 2000 NÃO É UMA PÁGINA DE UM ÚNICO TEMA.
Distribua os memes respeitando a multiplicidade de territórios:
1. Cotidiano e Vida Real (supermercado, Uber, filas, trabalho, condomínio)
2. Internet e Redes Sociais (prints, trends, comportamentos estranhos, gírias)
3. Cultura Pop e Notícias Atuais (sem partidarismo político, humor no comportamento)
4. Relacionamentos e Vergonha Alheia (dates ruins, stalk, apego ansioso, recaídas)
5. Estética Anos 2000 & Nostalgia (Alerta Windows 98, MSN, Winamp, TV de Tubo, Terminal)
6. Saúde Mental & Psicanálise (sem clichês, sem autoajuda, observação ácida)
7. Madrugada (apenas como um dos territórios, não o único)

Retorne EXCLUSIVAMENTE um JSON com formato:
{
  "memes": [
    {
      "id": "1",
      "category": "Alerta do Windows 98 / Cotidiano / Internet / Cultura Pop",
      "quadro": "Diagnóstico: Você é Fudido / Observatório do Mundo / No Consultório",
      "text": "Texto completo do meme (com quebra de expectativa e corte seco)",
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

    // 40s Timeout promise to allow full 20 memes batch generation from Gemini
    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: isCurrentEvents
        ? { tools: [{ googleSearch: {} }], temperature: 1.15 }
        : { responseMimeType: "application/json", temperature: 1.2 },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração Gemini")), 40000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = extractJsonFromText(response.text);

    if (output && Array.isArray(output.memes) && output.memes.length > 0) {
      return res.json(output);
    }
    if (output && Array.isArray(output)) {
      return res.json({ memes: output });
    }
    throw new Error("Formato inválido retornado pela IA");
  } catch (error: any) {
    console.warn("Gemini batch fallback ativado:", error.message || error);
    return res.json({ memes: generateProceduralMemes(count, filterCategory, theme) });
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
    const timestampSeed = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR ${count} ROTEIROS COMPLETOS E INÉDITOS DE REELS / TIKTOK PARA O @DEPRESSIVOS2000!
[TIMESTAMP_SEED: ${timestampSeed}]
Tema solicitado: "${theme}"

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
      config: { responseMimeType: "application/json", temperature: 1.15 },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout geração Reels")), 30000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = extractJsonFromText(response.text);
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
      config: { responseMimeType: "application/json", temperature: 1.0 },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout análise Gemini")), 25000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = extractJsonFromText(response.text);
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

  const fallbackRlhf = () => {
    const procedural = generateProceduralMemes(count, "Farmacologia & Remédios", extraFocus);
    return {
      dnaAnalysis: {
        identifiedPreferences: "Identificado foco em humor de vergonha cotidiana, corte seco, psicanálise e situações específicas de convivência moderna.",
        discardedPatterns: "Evitadas frases de autoajuda, clichês previsíveis e romantização vazia."
      },
      posts: procedural.map((p, idx) => ({
        id: `rlhf-${Date.now()}-${idx}`,
        category: p.category,
        text: p.text,
        highlight: p.highlight,
        template: p.template,
        systemTitle: p.systemTitle,
        windowButtonText: p.windowButtonText,
        shadowColor: p.shadowColor,
        sticker: p.sticker,
        caption: p.caption,
        hashtags: p.hashtags,
        viralAudio: p.viralAudio,
        mockupDevice: "tv-vhs"
      }))
    };
  };

  if (!client) {
    return res.json(fallbackRlhf());
  }

  try {
    const timestampSeed = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const prompt = `${BRAND_IDENTITY_PROMPT}

TAREFA: GERAR ${count} NOVOS POSTS 100% INÉDITOS UTILIZANDO O MÓDULO DE APRENDIZADO CONTÍNUO (FEEDBACK LOOP RLHF)!
[TIMESTAMP_SEED: ${timestampSeed}]

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

    const generatePromise = client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1.15,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout RLHF")), 30000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const output = extractJsonFromText(response.text);
    if (output && Array.isArray(output.posts) && output.posts.length > 0) {
      return res.json(output);
    }
    return res.json(fallbackRlhf());
  } catch (error: any) {
    console.warn("Fallback RLHF acionado:", error.message || error);
    return res.json(fallbackRlhf());
  }
});

// ============================================================================
// TWITTER / X VIDEO EXTRACTOR & PROXY ENDPOINTS
// ============================================================================

/**
 * Helper to extract Tweet ID from diverse Twitter/X URL structures
 */
function extractTweetId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  // Standard pattern: twitter.com/username/status/1234567890 or x.com/...
  const match = cleanUrl.match(/(?:twitter\.com|x\.com|vxtwitter\.com|fxtwitter\.com|fixupx\.com)\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)/i);
  if (match && match[1]) {
    return match[1];
  }
  
  // Shorter or direct status pattern: /status/1234567890
  const shortMatch = cleanUrl.match(/status(?:es)?\/(\d+)/i);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Pure numeric ID
  if (/^\d{8,25}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Route: Extract video and details from Twitter / X tweet link
 */
app.post("/api/twitter-video", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL do tweet é obrigatória." });
  }

  const tweetId = extractTweetId(url);
  if (!tweetId) {
    return res.status(400).json({
      error: "Link do Twitter/X inválido. Cole uma URL como https://twitter.com/usuario/status/1234567890 ou https://x.com/usuario/status/1234567890",
    });
  }

  console.log(`[Twitter Video Extractor] Resolvendo tweet ID: ${tweetId}`);

  // Strategy 1: FxTwitter API (Very fast, highly reliable, returns direct MP4s and video variants)
  try {
    const fxResponse = await fetch(`https://api.fxtwitter.com/status/${tweetId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (fxResponse.ok) {
      const data: any = await fxResponse.json();
      const tweet = data?.tweet;

      if (tweet) {
        let videoUrl: string | null = null;
        let thumbnailUrl: string | null = null;
        let mediaType: 'video' | 'gif' | 'image' = 'video';
        let duration: number = 0;

        // Check tweet.media.videos
        if (tweet.media?.videos && Array.isArray(tweet.media.videos) && tweet.media.videos.length > 0) {
          const v = tweet.media.videos[0];
          videoUrl = v.url || (v.variants && v.variants[0]?.url) || null;
          thumbnailUrl = v.thumbnail_url || null;
          duration = v.duration || 0;
          mediaType = v.format === 'gif' ? 'gif' : 'video';
        } 
        // Check tweet.media_extended
        else if (tweet.media_extended && Array.isArray(tweet.media_extended)) {
          const vidMedia = tweet.media_extended.find((m: any) => m.type === 'video' || m.type === 'gif');
          if (vidMedia) {
            videoUrl = vidMedia.url || null;
            thumbnailUrl = vidMedia.thumbnail_url || null;
            duration = vidMedia.duration_millis ? vidMedia.duration_millis / 1000 : 0;
            mediaType = vidMedia.type === 'gif' ? 'gif' : 'video';
          }
        }
        // Check tweet.all_media
        else if (tweet.all_media && Array.isArray(tweet.all_media)) {
          const vidMedia = tweet.all_media.find((m: any) => m.type === 'video' || m.type === 'gif');
          if (vidMedia) {
            videoUrl = vidMedia.url || null;
            thumbnailUrl = vidMedia.thumbnail_url || null;
            mediaType = vidMedia.type === 'gif' ? 'gif' : 'video';
          }
        }

        if (videoUrl) {
          return res.json({
            success: true,
            tweetId,
            videoUrl,
            thumbnailUrl,
            mediaType,
            duration,
            tweetText: tweet.text || "",
            author: {
              name: tweet.author?.name || "Twitter User",
              screenName: tweet.author?.screen_name ? `@${tweet.author.screen_name.replace('@', '')}` : "@Twitter",
              avatar: tweet.author?.avatar_url || null,
            },
          });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Twitter Extractor] FxTwitter fallback falhou (${err.message}), tentando VxTwitter...`);
  }

  // Strategy 2: VxTwitter API
  try {
    const vxResponse = await fetch(`https://api.vxtwitter.com/Twitter/status/${tweetId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (vxResponse.ok) {
      const vxData: any = await vxResponse.json();
      if (vxData) {
        let videoUrl: string | null = null;
        let thumbnailUrl: string | null = null;
        let mediaType: 'video' | 'gif' | 'image' = 'video';

        if (vxData.media_extended && Array.isArray(vxData.media_extended)) {
          const vid = vxData.media_extended.find((m: any) => m.type === 'video' || m.type === 'gif');
          if (vid && vid.url) {
            videoUrl = vid.url;
            thumbnailUrl = vid.thumbnail_url || null;
            mediaType = vid.type === 'gif' ? 'gif' : 'video';
          }
        }

        if (!videoUrl && vxData.video_url) {
          videoUrl = vxData.video_url;
        }

        if (videoUrl) {
          return res.json({
            success: true,
            tweetId,
            videoUrl,
            thumbnailUrl,
            mediaType,
            tweetText: vxData.text || "",
            author: {
              name: vxData.user_name || "Twitter User",
              screenName: vxData.user_screen_name ? `@${vxData.user_screen_name.replace('@', '')}` : "@Twitter",
            },
          });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Twitter Extractor] VxTwitter fallback falhou (${err.message}), tentando Syndication...`);
  }

  // Strategy 3: Twitter Syndication CDN API
  try {
    const synUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=1`;
    const synRes = await fetch(synUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (synRes.ok) {
      const synData: any = await synRes.json();
      if (synData?.video?.variants && Array.isArray(synData.video.variants)) {
        // Sort by bitrate descending to get highest quality MP4
        const mp4s = synData.video.variants
          .filter((v: any) => v.content_type === "video/mp4" && v.src)
          .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));

        if (mp4s.length > 0) {
          return res.json({
            success: true,
            tweetId,
            videoUrl: mp4s[0].src,
            thumbnailUrl: synData.video.poster || null,
            mediaType: 'video',
            tweetText: synData.text || "",
            author: {
              name: synData.user?.name || "Twitter User",
              screenName: synData.user?.screen_name ? `@${synData.user.screen_name}` : "@Twitter",
              avatar: synData.user?.profile_image_url_https || null,
            },
          });
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Twitter Extractor] Syndication fallback falhou: ${err.message}`);
  }

  // If no video was found after all attempts
  return res.status(404).json({
    error: "Nenhum vídeo ou GIF animado foi encontrado neste tweet. Certifique-se de que o tweet possui um vídeo público e tente novamente.",
    tweetId,
  });
});

/**
 * Route: Video proxy streamer to avoid CORS when recording or playing videos in canvas
 */
app.get("/api/proxy-video", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("URL parameter missing");
  }

  try {
    const range = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://twitter.com/",
    };
    if (range) {
      fetchHeaders["Range"] = range;
    }

    const upstreamRes = await fetch(targetUrl, { headers: fetchHeaders });
    
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Content-Type", upstreamRes.headers.get("content-type") || "video/mp4");
    
    if (upstreamRes.headers.get("content-length")) {
      res.setHeader("Content-Length", upstreamRes.headers.get("content-length")!);
    }
    if (upstreamRes.headers.get("content-range")) {
      res.setHeader("Content-Range", upstreamRes.headers.get("content-range")!);
      res.status(206);
    } else {
      res.status(upstreamRes.status);
    }

    if (!upstreamRes.body) {
      return res.end();
    }

    // Pipe response stream
    const reader = upstreamRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err: any) {
    console.error("[Proxy Video Error]:", err.message || err);
    if (!res.headersSent) {
      res.status(502).send("Falha ao carregar stream de vídeo");
    }
  }
});

// Route: Generate a tailored Depressivos 2000 meme based on a tweet and extracted video
app.post("/api/generate-from-tweet", async (req, res) => {
  const { tweetText, author, topic } = req.body;
  const promptContext = `Tweet original: "${tweetText || 'Vídeo de reação'}"
Autor: ${author?.name || 'Usuário'} (${author?.screenName || '@Twitter'})
Tema sugerido: ${topic || 'Humor caótico, recaídas, cansaço mental, vida adulta dos 20-40 anos'}

Gere 3 variações de posts para a página DEPRESSIVOS 2000 que combinem perfeitamente com este vídeo e contexto.
Siga as 12 Regras de Ouro: humor ácido, adulto, específico, inesperado, identificável, sem moral da história, sem frases de autoajuda.
Retorne um objeto JSON com o formato:
{
  "options": [
    {
      "text": "Frase principal do post formatada",
      "highlightText": "palavra-chave ou trecho de destaque",
      "template": "blue-screen" | "mac-retro" | "terminal-dark" | "brutalist-clean" | "winamp-retro",
      "systemTitle": "Trocadilho no título da janela",
      "windowButtonText": "Texto do botão em caps",
      "reason": "Por que funciona com o vídeo"
    }
  ]
}`;

  try {
    const aiClient = getGeminiClient();
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptContext,
        config: {
          systemInstruction: BRAND_IDENTITY_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.85,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.options && Array.isArray(parsed.options)) {
        return res.json(parsed);
      }
    }
  } catch (err: any) {
    console.warn("[Generate From Tweet Error, using fallback]", err.message);
  }

  // Fallback high-quality meme suggestions matching Depressivos 2000 tone
  return res.json({
    options: [
      {
        text: tweetText ? `${tweetText}\n\n(minha mente em loop às 03:14)` : "Tentando explicar pro meu cérebro que já deu por hoje.",
        highlightText: "03:14",
        template: "blue-screen",
        systemTitle: "ERRO CRÍTICO: SANIDADE_ESGOTADA.EXE",
        windowButtonText: "REINICIAR MEMÓRIA",
        reason: "Quebra de expectativa e identificação imediata"
      },
      {
        text: "Assistindo minhas decisões de vida darem errado em resolução 1080p.",
        highlightText: "1080p",
        template: "mac-retro",
        systemTitle: "RELATÓRIO DE DANOS",
        windowButtonText: "ABORTAR CRISE",
        reason: "Humor autodepreciativo ágil"
      },
      {
        text: "Minha bateria social observando eu aceitar mais um compromisso no sábado:",
        highlightText: "bateria social",
        template: "terminal-dark",
        systemTitle: "TERMINAL_PENSAMENTOS_INTRUSIVOS",
        windowButtonText: "CANCELAR TUDO",
        reason: "Absurdo cotidiano altamente compartilhável"
      }
    ]
  });
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
