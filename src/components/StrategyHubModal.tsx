import React, { useState } from 'react';
import { PostConfig, TemplateType, StickerType } from '../types';
import { OFFICIAL_SHOWS } from '../data/presets';
import {
  Sparkles,
  Zap,
  Film,
  MessageSquare,
  BarChart3,
  Calendar,
  Check,
  Copy,
  X,
  RefreshCw,
  Flame,
  Pill,
  Brain,
  Layers,
  ArrowRight,
  TrendingUp,
  Smile
} from 'lucide-react';

interface StrategyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPost: (meme: {
    text: string;
    highlightText: string;
    template?: TemplateType;
    systemTitle?: string;
    windowButtonText?: string;
    terminalPrompt?: string;
    shadowColor?: string;
    sticker?: StickerType;
    backgroundColor?: string;
  }) => void;
  currentPostText: string;
}

const LOCAL_FALLBACK_MEMES = [
  // 1. ALERTA WINDOWS 98
  {
    id: "loc-win-1",
    category: "Alerta do Windows 98",
    quadro: "Diagnóstico: Você é Fudido",
    text: "ERRO CRÍTICO: Recaida.exe\n\nVocê tentou manter a postura madura, mas o sistema detectou que você abriu a conversa arquivada 14 vezes nas últimas 2 horas.\n\n[ CANCELAR DIGNIDADE ]  [ REPETIR ERRO ]",
    highlight: "ERRO CRÍTICO: Recaida.exe",
    template: "sistema-alerta" as TemplateType,
    systemTitle: "Alerta do Sistema - recaida.exe",
    windowButtonText: "REPETIR ERRO",
    shadowColor: "#1A1A1A",
    sticker: "warning" as StickerType,
    caption: "O Windows detectou colapso na dignidade às 23:45. Manda pra pessoa que vive no 'repetir erro'.",
    hashtags: ["#depressivos2000", "#windows98", "#recaida", "#humoradulto"],
    viralAudio: "Som de erro clássico do Windows XP em loop",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows 98", template: "sistema-alerta" as TemplateType },
      { name: "Opção 2: Terminal Dark 3AM", template: "terminal-dark" as TemplateType },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" as TemplateType }
    ]
  },
  {
    id: "loc-win-2",
    category: "Alerta do Windows 98",
    quadro: "A Mente Não Colabora",
    text: "MEMÓRIA INSUFICIENTE\n\nNão foi possível processar mais uma reunião de 1 hora que poderia ter sido um e-mail de 2 linhas.\n\n[ FINGIR DEMÊNCIA ]  [ REINICIAR CÉREBRO ]",
    highlight: "MEMÓRIA INSUFICIENTE",
    template: "sistema-alerta" as TemplateType,
    systemTitle: "Memória Esgotada - burnout.dll",
    windowButtonText: "FINGIR DEMÊNCIA",
    shadowColor: "#0000FF",
    sticker: "error" as StickerType,
    caption: "A memória RAM biológica foi de base. Quem nunca quis apertar 'Fingir Demência'?",
    hashtags: ["#depressivos2000", "#trabalho", "#burnout", "#humorcorporativo"],
    viralAudio: "Música de elevador distorcida com som de erro do Windows",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType },
      { name: "Opção 3: Barra 99%", template: "barra-carregamento-99" as TemplateType }
    ]
  },
  {
    id: "loc-win-3",
    category: "Alerta do Windows 98",
    quadro: "No Consultório",
    text: "AVISO DE SEGURANÇA:\n\nA sua psicanalista fez uma pergunta simples e você está prestes a chorar por causa de um brinquedo que seu primo quebrou em 2003.\n\n[ DESVIAR ASSUNTO ]  [ RIR NERVOSO ]",
    highlight: "AVISO DE SEGURANÇA",
    template: "sistema-alerta" as TemplateType,
    systemTitle: "Sessão TCC - trauma_infancia.exe",
    windowButtonText: "RIR NERVOSO",
    shadowColor: "#FF3333",
    sticker: "broken-heart" as StickerType,
    caption: "50 minutos de sessão: 45 de piada e 5 encarando o teto. Manda pro amigo que faz terapia.",
    hashtags: ["#depressivos2000", "#terapia", "#psicanalise", "#rirpranaochorar"],
    viralAudio: "Áudio do meme 'E como você se sente sobre isso?' com violino dramático",
    threeVisualVariations: [
      { name: "Opção 1: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 2: Cupom Fiscal", template: "nota-fiscal" as TemplateType },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" as TemplateType }
    ]
  },

  // 2. DARK MODE / TERMINAL 3 DA MANHÃ
  {
    id: "loc-term-1",
    category: "Dark Mode / Terminal",
    quadro: "3 da Manhã",
    text: "> terminal_pensamentos_intrusivos.sh\n\nÀs 03:14 AM seu cérebro não quer dormir: ele quer calcular se aquela pessoa que não respondeu sua mensagem em 2019 já casou e se o cachorro dela ainda lembra de você.",
    highlight: "03:14 AM",
    template: "terminal-dark" as TemplateType,
    systemTitle: "> pensamentos_intrusivos.sh",
    windowButtonText: "TENTAR DORMIR",
    shadowColor: "#FF3333",
    sticker: "skull" as StickerType,
    caption: "Insônia não é falta de sono, é excesso de teorias da conspiração às 3 da manhã.",
    hashtags: ["#depressivos2000", "#3damanha", "#insonia", "#humoracido"],
    viralAudio: "Batida lo-fi sombria dos anos 2000 com teclado digitando",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" as TemplateType },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" as TemplateType }
    ]
  },
  {
    id: "loc-term-2",
    category: "Dark Mode / Terminal",
    quadro: "Bula da Depressão & Remédios",
    text: "> zolpidem_blackout.sh\n\n[23:00] Tomei meio comprimido pra descansar.\n[02:17] Comprei uma máquina de fazer gelo, um kit de pescaria e mandei áudio de 6 minutos pro meu ex-chefe.",
    highlight: "zolpidem_blackout.sh",
    template: "terminal-dark" as TemplateType,
    systemTitle: "> compra_madrugada.log",
    windowButtonText: "CANCELAR COMPRA",
    shadowColor: "#00FF66",
    sticker: "skull" as StickerType,
    caption: "O efeito colateral mais comum do Zolpidem é a transportadora bater na sua porta com coisas que você não lembra de ter comprado.",
    hashtags: ["#depressivos2000", "#zolpidem", "#mercadolivre", "#madrugada"],
    viralAudio: "Áudio viral 'O que foi que eu fiz ontem à noite?'",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" as TemplateType },
      { name: "Opção 2: Cupom Fiscal", template: "nota-fiscal" as TemplateType },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" as TemplateType }
    ]
  },
  {
    id: "loc-term-3",
    category: "Dark Mode / Terminal",
    quadro: "Farmácia Popular",
    text: "> serotonina_status.log\n\nDopamina: 0%\nSerotonina: [404 NOT FOUND]\nEscitalopram 15mg: Ativo\nLibido: Conectando via modem discado (sem sinal)",
    highlight: "404 NOT FOUND",
    template: "terminal-dark" as TemplateType,
    systemTitle: "> laudo_quimico.sh",
    windowButtonText: "REINICIAR",
    shadowColor: "#00FF66",
    sticker: "battery" as StickerType,
    caption: "A serotonina sumiu mas pelo menos a ansiedade virou apatia serena KKKKKK.",
    hashtags: ["#depressivos2000", "#escitalopram", "#quimicaemocional", "#terapia"],
    viralAudio: "Som de modem discado 56k conectando e caindo",
    threeVisualVariations: [
      { name: "Opção 1: Terminal Dark", template: "terminal-dark" as TemplateType },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType },
      { name: "Opção 3: TV de Tubo VHS", template: "mockup-tv-vhs" as TemplateType }
    ]
  },

  // 3. MSN MESSENGER 2005
  {
    id: "loc-msn-1",
    category: "MSN 2005 Nostalgia",
    quadro: "Recaída no MSN",
    text: "(subnick do MSN)\n·•● (D) Micael ~ (ocupado) ●•·\n\"o silêncio às vezes é a resposta mais barulhenta (N)\"\n\n*(entrando e saindo 12 vezes seguidas para a janelinha subir no canto da tela de quem te deu vácuo)*",
    highlight: "entrando e saindo 12 vezes",
    template: "msn-nostalgia" as TemplateType,
    systemTitle: "MSN Messenger - (Ausente da Sanidade)",
    windowButtonText: "CHAMAR ATENÇÃO",
    shadowColor: "#000080",
    sticker: "msn" as StickerType,
    caption: "A arte milenar de entrar e sair do MSN para forçar a notificação no PC da pessoa. Quem viveu sabe.",
    hashtags: ["#depressivos2000", "#msn", "#anos2000", "#nostalgia", "#vacuo"],
    viralAudio: "Som clássico do 'Tudum' do MSN e som de chamar atenção (tremer a tela)",
    threeVisualVariations: [
      { name: "Opção 1: MSN Messenger", template: "msn-nostalgia" as TemplateType },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 3: Winamp MP3", template: "winamp-retro" as TemplateType }
    ]
  },
  {
    id: "loc-msn-2",
    category: "MSN 2005 Nostalgia",
    quadro: "Relacionamentos Modernos",
    text: "MSN Messenger 7.5:\n\nFulano enviou um alerta de 'CHAMAR ATENÇÃO'!\n\nSua tela tremeu, mas o coração nem mexe mais depois de 5 anos de desilusões amorosas e boletos.",
    highlight: "CHAMAR ATENÇÃO",
    template: "msn-nostalgia" as TemplateType,
    systemTitle: "MSN Messenger 7.5 - Conversa",
    windowButtonText: "CHAMAR ATENÇÃO",
    shadowColor: "#000080",
    sticker: "msn" as StickerType,
    caption: "Se o WhatsApp tivesse o botão de tremer a tela do MSN a taxa de infarto no Brasil triplicava.",
    hashtags: ["#depressivos2000", "#msnmessenger", "#nostalgia2000", "#humorbr"],
    viralAudio: "Efeito sonoro da janela do MSN tremendo com grave estourado",
    threeVisualVariations: [
      { name: "Opção 1: MSN Messenger", template: "msn-nostalgia" as TemplateType },
      { name: "Opção 2: Tweet de Parede", template: "tweet-parede" as TemplateType },
      { name: "Opção 3: TV de Tubo", template: "mockup-tv-vhs" as TemplateType }
    ]
  },

  // 4. CUPOM FISCAL
  {
    id: "loc-cupom-1",
    category: "Cupom Fiscal",
    quadro: "Farmácia Popular",
    text: "EXTRATO DE GASTOS EMOCIONAIS - 28/08\n------------------------------------\n• 1x Café com esperança de ser produtivo ...... R$ 18,00\n• 1x Compra de item inútil no Zolpidem às 02:40 .. R$ 249,90\n• 4x Stalking sem autorização prévia ......... R$ 0,00\n• 1x Humilhação no direct ..................... SEM VALOR\n------------------------------------\nTOTAL A PAGAR: 3 anos de terapia",
    highlight: "TOTAL A PAGAR: 3 anos de terapia",
    template: "nota-fiscal" as TemplateType,
    systemTitle: "Drogaria São Paulo - Cupom Fiscal",
    windowButtonText: "PAGAR EM 12X",
    shadowColor: "#FF007F",
    sticker: "battery" as StickerType,
    caption: "O extrato do mês detalhado por categoria de humilhação. Manda no grupo que divide as desgraças.",
    hashtags: ["#depressivos2000", "#cupomfiscal", "#terapia", "#boletos", "#humoradulto"],
    viralAudio: "Som de impressora de cupom fiscal matricial imprimindo sem parar",
    threeVisualVariations: [
      { name: "Opção 1: Cupom Fiscal", template: "nota-fiscal" as TemplateType },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 3: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType }
    ]
  },
  {
    id: "loc-cupom-2",
    category: "Cupom Fiscal",
    quadro: "Farmácia Popular",
    text: "DROGARIA MEMÓRIA CURTA\n------------------------------------\n• 01x Escitalopram 20mg ......... R$ 89,90\n• 01x Rivotril Gotas (paz falsa) . R$ 34,50\n• 01x Energético 2L .............. R$ 14,00\n• 01x Barra de chocolate 70% ..... R$ 12,00\n------------------------------------\nSubtotal: Sanidade comprada no cartão de crédito",
    highlight: "Sanidade comprada no cartão",
    template: "nota-fiscal" as TemplateType,
    systemTitle: "Farmácia Popular - Extrato",
    windowButtonText: "PARCELAR",
    shadowColor: "#FF3333",
    sticker: "none" as StickerType,
    caption: "A cesta básica do jovem adulto contemporâneo: cafeína de dia e tarja preta de noite.",
    hashtags: ["#depressivos2000", "#farmacia", "#tarjapreta", "#vidareal"],
    viralAudio: "Áudio 'Eu não tenho um minuto de paz' com som de caixa registradora",
    threeVisualVariations: [
      { name: "Opção 1: Cupom Fiscal", template: "nota-fiscal" as TemplateType },
      { name: "Opção 2: Terminal Dark", template: "terminal-dark" as TemplateType },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" as TemplateType }
    ]
  },

  // 5. MP3 PLAYER / WINAMP NOSTÁLGICO
  {
    id: "loc-mp3-1",
    category: "MP3 Player / Winamp",
    quadro: "Ansiedade da Geração 2000",
    text: "NOW PLAYING: 03. O Som do Vácuo (Feat. Humilhação)\n[ 01:24 ━━━━━━●─────── 03:45 ]\n⏮  ❚❚  ⏭   🔀  🔁\n\n\"Faixa bônus: áudio de 4 minutos gravado chorando no carro que você apagou 'para todos' 3 segundos depois de mandar.\"",
    highlight: "O Som do Vácuo",
    template: "winamp-retro" as TemplateType,
    systemTitle: "Winamp 2.91 - Trilha do Colapso.mp3",
    windowButtonText: "PAUSE",
    shadowColor: "#FFD700",
    sticker: "cd" as StickerType,
    caption: "A discografia completa das recaídas amorosas tocando no Winamp às 2 da manhã.",
    hashtags: ["#depressivos2000", "#winamp", "#mp3", "#anos2000", "#humorbrasil"],
    viralAudio: "Trecho nostálgico de Fresno - Quebre As Correntes desacelerado",
    threeVisualVariations: [
      { name: "Opção 1: Winamp MP3", template: "winamp-retro" as TemplateType },
      { name: "Opção 2: MSN Messenger", template: "msn-nostalgia" as TemplateType },
      { name: "Opção 3: TV Tubo VHS", template: "mockup-tv-vhs" as TemplateType }
    ]
  },
  {
    id: "loc-mp3-2",
    category: "MP3 Player / Winamp",
    quadro: "Ansiedade da Geração 2000",
    text: "NOW PLAYING: 07. Fresno - Alguém Que Te Faz Chorar\n[ 02:40 ━━━━━━━●────── 03:50 ]\n\nMemória desbloqueada: você chorando na frente do PC com monitor de tubo enquanto olhava os scraps do Orkut.",
    highlight: "Fresno - Alguém Que Te Faz Chorar",
    template: "winamp-retro" as TemplateType,
    systemTitle: "Winamp - emo_2006.mp3",
    windowButtonText: "REPEAT",
    shadowColor: "#0000FF",
    sticker: "broken-heart" as StickerType,
    caption: "A trilha sonora oficial da geração que sofria por amor usando franja e calça apertada.",
    hashtags: ["#depressivos2000", "#fresno", "#emo", "#nostalgia2000", "#orkut"],
    viralAudio: "Refrão marcante de 'Alguém que te faz chorar' com eco nostálgico",
    threeVisualVariations: [
      { name: "Opção 1: Winamp MP3", template: "winamp-retro" as TemplateType },
      { name: "Opção 2: TV Tubo DVD", template: "mockup-tv-dvd" as TemplateType },
      { name: "Opção 3: Tweet de Parede", template: "tweet-parede" as TemplateType }
    ]
  },

  // 6. TV DE TUBO COM VHS / DVD & MONITOR BEGE
  {
    id: "loc-tv-1",
    category: "TV de Tubo Retrô",
    quadro: "Coisas Que Ninguém Admite",
    text: "Assistindo minha juventude passar tipo fita VHS mofada que travou no meio do cabeçote e agora precisa ser limpa com cotonete e álcool isopropílico.",
    highlight: "fita VHS mofada",
    template: "mockup-tv-vhs" as TemplateType,
    systemTitle: "TV Quasar 20' - Canal 3 AV",
    windowButtonText: "REBOBINAR",
    shadowColor: "#0000FF",
    sticker: "avatar-sad" as StickerType,
    caption: "A sensação de cansaço aos 30 anos é exatamente a de uma fita VHS mastigada no videocassete.",
    hashtags: ["#depressivos2000", "#tvdetubo", "#vhs", "#vintage", "#humor"],
    viralAudio: "Som de fita VHS entrando no videocassete e rebobinando rápido",
    threeVisualVariations: [
      { name: "Opção 1: TV Tubo VHS", template: "mockup-tv-vhs" as TemplateType },
      { name: "Opção 2: TV Tubo DVD", template: "mockup-tv-dvd" as TemplateType },
      { name: "Opção 3: Monitor Bege", template: "mockup-monitor-bege" as TemplateType }
    ]
  },
  {
    id: "loc-tv-2",
    category: "TV de Tubo Retrô",
    quadro: "A Mente Não Colabora",
    text: "Meu cérebro em repouso tá exatamente igual ao protetor de tela do DVD: batendo de quina em quina sem nunca acertar o centro.",
    highlight: "protetor de tela do DVD",
    template: "mockup-tv-dvd" as TemplateType,
    systemTitle: "DVD Player Memorex - STANDBY",
    windowButtonText: "EJECT",
    shadowColor: "#0000FF",
    sticker: "cd" as StickerType,
    caption: "Aguardando o momento exato em que a sanidade bate perfeitamente no canto da tela.",
    hashtags: ["#depressivos2000", "#dvd", "#anos2000", "#humoracido"],
    viralAudio: "Música de menu de DVD dos anos 2000 em loop infinito",
    threeVisualVariations: [
      { name: "Opção 1: TV Tubo DVD", template: "mockup-tv-dvd" as TemplateType },
      { name: "Opção 2: Monitor Bege", template: "mockup-monitor-bege" as TemplateType },
      { name: "Opção 3: Celular Flip V3", template: "mockup-celular-flip" as TemplateType }
    ]
  },

  // 7. RELACIONAMENTOS & VÁCUO
  {
    id: "loc-rel-1",
    category: "Relacionamentos & Vácuo",
    quadro: "Relacionamentos Modernos",
    text: "Fui stalkear um perfil de 2017 e meu dedo deu dois toques acidentais na foto do batizado do sobrinho da pessoa.\n\nJá estou com as malas prontas para morar no interior do Paraguai sob nova identidade.",
    highlight: "dois toques acidentais",
    template: "tweet-parede" as TemplateType,
    systemTitle: "Alerta de Stalking - fail.exe",
    windowButtonText: "MUDAR DE PAÍS",
    shadowColor: "#0000FF",
    sticker: "warning" as StickerType,
    caption: "O pior tipo de ataque cardíaco é a curtida sem querer em foto de 8 anos atrás.",
    hashtags: ["#depressivos2000", "#stalker", "#vergonhaalheia", "#mandaamigos"],
    viralAudio: "Áudio de suspense tenso 'NÃO, NÃO, NÃO, APAGA!'",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" as TemplateType },
      { name: "Opção 2: Alerta Windows", template: "sistema-alerta" as TemplateType },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" as TemplateType }
    ]
  },
  {
    id: "loc-rel-2",
    category: "Relacionamentos & Vácuo",
    quadro: "Não Era Saudade",
    text: "— Você tá bem?\n— Sim.\n— Então por que você tá olhando fixamente pro micro-ondas desligado há 18 minutos enquanto ensaia uma discussão mental?",
    highlight: "18 minutos",
    template: "tweet-parede" as TemplateType,
    systemTitle: "Diálogo Psicanalítico",
    windowButtonText: "CANCELAR ENSAIO",
    shadowColor: "#FF3333",
    sticker: "broken-heart" as StickerType,
    caption: "Discussão mental com réplica, tréplica e lágrimas falsas que nunca vai acontecer na vida real.",
    hashtags: ["#depressivos2000", "#dialogo", "#apegoansioso", "#humorreal"],
    viralAudio: "Silêncio constrangedor com som de grilo no fundo",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" as TemplateType },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" as TemplateType }
    ]
  },
  {
    id: "loc-rel-3",
    category: "Relacionamentos & Vácuo",
    quadro: "Relacionamentos Modernos",
    text: "A pessoa visualizou minha mensagem às 14:02.\nSão 23:45 e eu já elaborei 6 teorias de conspiração, briguei mentalmente com ela e bloqueei a mãe dela no LinkedIn.",
    highlight: "bloqueei a mãe dela no LinkedIn",
    template: "tweet-parede" as TemplateType,
    systemTitle: "Apego Ansioso em Ação",
    windowButtonText: "BLOQUEAR",
    shadowColor: "#0000FF",
    sticker: "sad-smile" as StickerType,
    caption: "Manda pra pessoa que transforma um vácuo de 30 minutos em um documentário criminal.",
    hashtags: ["#depressivos2000", "#vacuo", "#whatsapp", "#ansiedade"],
    viralAudio: "Áudio dramático de novela mexicana",
    threeVisualVariations: [
      { name: "Opção 1: Tweet de Parede", template: "tweet-parede" as TemplateType },
      { name: "Opção 2: MSN Messenger", template: "msn-nostalgia" as TemplateType },
      { name: "Opção 3: Terminal Dark", template: "terminal-dark" as TemplateType }
    ]
  },

  // 8. TELA AZUL BRUTALISTA
  {
    id: "loc-azul-1",
    category: "Tela Azul Brutalista",
    quadro: "Diagnóstico: Você é Fudido",
    text: "SUA BATERIA SOCIAL ATINGIU 1%.\n\nPressione qualquer tecla para fingir demência em eventos sociais ou feche os olhos até segunda-feira de manhã.",
    highlight: "BATERIA SOCIAL ATINGIU 1%",
    template: "tela-azul-brutalista" as TemplateType,
    systemTitle: "BSoD - bateria_esgotada.sys",
    windowButtonText: "DESLIGAR",
    shadowColor: "#0000FF",
    sticker: "battery" as StickerType,
    caption: "A bateria social não aguenta mais nem 10 minutos de conversa fiada no elevador.",
    hashtags: ["#depressivos2000", "#telaazul", "#introvertido", "#bateriasocial"],
    viralAudio: "Som de TV fora do ar / estática suave",
    threeVisualVariations: [
      { name: "Opção 1: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType },
      { name: "Opção 2: Barra 99%", template: "barra-carregamento-99" as TemplateType },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" as TemplateType }
    ]
  },
  {
    id: "loc-azul-2",
    category: "Tela Azul Brutalista",
    quadro: "A Mente Não Colabora",
    text: "PROCESSANDO MATURIDADE EMOCIONAL... 99%\n\nTempo restante estimado: 47 anos.\nErro encontrado: O usuário ainda guarda rancor de 2011.",
    highlight: "99%",
    template: "barra-carregamento-99" as TemplateType,
    systemTitle: "Processando Maturidade.exe",
    windowButtonText: "CANCELAR",
    shadowColor: "#0000FF",
    sticker: "warning" as StickerType,
    caption: "A barra de carregamento da maturidade travou nos 99% e nunca mais avançou.",
    hashtags: ["#depressivos2000", "#barra99", "#maturidade", "#humorbr"],
    viralAudio: "Som de relógio tiquetaqueando angustiante",
    threeVisualVariations: [
      { name: "Opção 1: Barra 99%", template: "barra-carregamento-99" as TemplateType },
      { name: "Opção 2: Tela Azul Brutalista", template: "tela-azul-brutalista" as TemplateType },
      { name: "Opção 3: Alerta Windows", template: "sistema-alerta" as TemplateType }
    ]
  }
];

export const StrategyHubModal: React.FC<StrategyHubModalProps> = ({
  isOpen,
  onClose,
  onApplyPost,
  currentPostText,
}) => {
  const [activeTab, setActiveTab] = useState<'memes20' | 'reels10' | 'analyze' | 'calendar' | 'shows'>('memes20');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [memeFilter, setMemeFilter] = useState<string>('todos');

  // States for Batch Memes - initialized with 20 rich presets so it's instant!
  const [batchMemes, setBatchMemes] = useState<any[]>(LOCAL_FALLBACK_MEMES);
  
  // States for Reels
  const [reelsScripts, setReelsScripts] = useState<any[]>([]);

  // States for Post Analyzer
  const [analysis, setAnalysis] = useState<any | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getShuffledLocal = (category = 'todos') => {
    let list = [...LOCAL_FALLBACK_MEMES];
    if (category !== 'todos') {
      const filtered = list.filter(m => m.category.toLowerCase().includes(category.toLowerCase()) || m.template.includes(category));
      if (filtered.length > 0) list = filtered;
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  // Generate 20 Memes
  const fetch20Memes = async (selectedFilter = memeFilter) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-batch-memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 20, filterCategory: selectedFilter }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.memes) && data.memes.length > 0) {
        setBatchMemes(data.memes);
      } else {
        setBatchMemes(getShuffledLocal(selectedFilter));
      }
    } catch (err) {
      console.warn("Usando gerador local instantâneo:", err);
      setBatchMemes(getShuffledLocal(selectedFilter));
    } finally {
      setLoading(false);
    }
  };

  // Generate 10 Reels
  const fetch10Reels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-reels-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10 }),
      });
      const data = await res.json();
      if (data && data.reels) {
        setReelsScripts(data.reels);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Analyze Current Post
  const handleAnalyzePost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-post-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postText: currentPostText }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMemeToPost = (meme: any, variationTemplate?: TemplateType) => {
    const targetTemplate: TemplateType = variationTemplate || meme.template || 'tweet-parede';
    
    // Map optimal styling attributes based on template archetype
    let bgColor = '#F4F4F0';
    let shadow = meme.shadowColor || '#0000FF';
    let btnText = meme.windowButtonText || 'OK';
    let title = meme.systemTitle || 'Alerta do Sistema';

    if (targetTemplate === 'sistema-alerta') {
      bgColor = '#C0C0C0';
      shadow = '#1A1A1A';
      title = meme.systemTitle || 'Alerta do Sistema - erro.exe';
      btnText = meme.windowButtonText || 'REPETIR ERRO';
    } else if (targetTemplate === 'terminal-dark') {
      bgColor = '#1A1A1A';
      shadow = '#00FF66';
      title = meme.systemTitle || '> pensamentos_intrusivos.sh';
      btnText = 'CANCELAR';
    } else if (targetTemplate === 'msn-nostalgia') {
      bgColor = '#E8F1FC';
      shadow = '#000080';
      title = meme.systemTitle || 'MSN Messenger 7.5 - Conversa';
      btnText = 'CHAMAR ATENÇÃO';
    } else if (targetTemplate === 'nota-fiscal') {
      bgColor = '#FFFEEA';
      shadow = '#FF007F';
      title = meme.systemTitle || 'Drogaria São Paulo - Cupom Fiscal';
      btnText = 'PAGAR EM 12X';
    } else if (targetTemplate === 'winamp-retro') {
      bgColor = '#0C111C';
      shadow = '#0000FF';
      title = meme.systemTitle || 'Winamp 2.91 - Trilha do Colapso.mp3';
      btnText = 'PLAY';
    } else if (targetTemplate === 'tela-azul-brutalista') {
      bgColor = '#F4F4F0';
      shadow = '#0000FF';
    }

    onApplyPost({
      text: meme.text,
      highlightText: meme.highlight,
      template: targetTemplate,
      systemTitle: title,
      windowButtonText: btnText,
      terminalPrompt: meme.systemTitle?.startsWith('>') ? meme.systemTitle : undefined,
      shadowColor: shadow,
      backgroundColor: bgColor,
      sticker: meme.sticker || 'broken-heart',
    });
    onClose();
  };

  const filteredMemes = memeFilter === 'todos' 
    ? batchMemes 
    : batchMemes.filter(m => 
        (m.category && m.category.toLowerCase().includes(memeFilter.toLowerCase())) ||
        (m.template && m.template.includes(memeFilter))
      );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12151E] border-2 border-yellow-400/60 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-yellow-950/40 via-[#151926] to-[#12151E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-xl border border-yellow-400/40 font-black">
              @DEPRESSIVOS
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg text-white">
                  DEPRESSIVOS 2000 — Central Estratégica & Banco de Conteúdo
                </h2>
                <span className="text-[10px] font-mono bg-yellow-400 text-black px-2 py-0.5 rounded font-black tracking-wider">
                  "Estamos todos meio ferrados, mas vamos rir disso"
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Geração em massa de memes engraçados, roteiros de Reels, 12 quadros fixos e análise de viralização
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-[#0E1118] px-4 gap-1 sm:gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => {
              setActiveTab('memes20');
              if (batchMemes.length === 0) fetch20Memes();
            }}
            className={`py-3 px-3 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'memes20'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" /> ME DÊ 20 MEMES
          </button>
          <button
            onClick={() => {
              setActiveTab('reels10');
              if (reelsScripts.length === 0) fetch10Reels();
            }}
            className={`py-3 px-3 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'reels10'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" /> ME DÊ 10 REELS / TIKTOK
          </button>
          <button
            onClick={() => {
              setActiveTab('analyze');
              if (!analysis) handleAnalyzePost();
            }}
            className={`py-3 px-3 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'analyze'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> ANALISE ESSE POST
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            className={`py-3 px-3 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'shows'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> 12 QUADROS OFICIAIS
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-3 font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'calendar'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> PLANO 30 DIAS
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B0D13]">
          {/* TAB: 20 MEMES */}
          {activeTab === 'memes20' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-white text-base">Banco Gerador: 20 Memes Inéditos por Modelo</h3>
                  <p className="text-xs text-gray-400">
                    Templates específicos dos anos 2000 (Windows 98, Dark Mode, MSN, Cupom Fiscal, MP3) prontos para postar.
                  </p>
                </div>
                <button
                  onClick={() => fetch20Memes(memeFilter)}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Gerando 20 Memes...' : 'Gerar Novos 20 Memes'}
                </button>
              </div>

              {/* Model Sub-Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'todos', label: '🌟 Todos (20)' },
                  { id: 'windows', label: '🪟 Alerta Windows 98' },
                  { id: 'dark', label: '💻 Dark Mode / 3 AM' },
                  { id: 'msn', label: '📟 MSN 2005' },
                  { id: 'cupom', label: '🧾 Cupom Fiscal' },
                  { id: 'mp3', label: '🎵 MP3 Winamp' },
                  { id: 'tv', label: '📺 TV de Tubo Retrô' },
                  { id: 'relacionamento', label: '💔 Relacionamentos & Vácuo' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setMemeFilter(f.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap border ${
                      memeFilter === f.id
                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-sm'
                        : 'bg-[#151926] text-gray-300 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading && filteredMemes.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mb-3" />
                  <p className="font-bold text-white text-sm">Criando memes nos modelos selecionados...</p>
                  <p className="text-xs text-gray-400 mt-1">Windows 98, Cupom Fiscal, MSN 2005 e Winamp</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMemes.map((meme, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141824] border border-gray-800 hover:border-yellow-400/50 p-4 rounded-xl flex flex-col justify-between transition group gap-2.5"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                            #{idx + 1} • {meme.quadro || meme.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-gray-800">
                            {meme.template || 'tweet-parede'}
                          </span>
                        </div>
                        <p className="text-white font-impact uppercase text-base leading-snug my-2 whitespace-pre-line tracking-wide">
                          {meme.text}
                        </p>

                        {/* Metadados e Áudio Viral */}
                        {meme.viralAudio && (
                          <div className="bg-[#0E121B] p-2 rounded-lg border border-purple-500/20 text-[11px] text-purple-300 flex items-center gap-1.5 my-1.5 font-mono">
                            <Zap className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                            <span className="truncate">Áudio Viral: {meme.viralAudio}</span>
                          </div>
                        )}

                        {/* 3 Opções de Visual */}
                        {meme.threeVisualVariations && meme.threeVisualVariations.length > 0 && (
                          <div className="flex items-center gap-1 my-1 overflow-x-auto">
                            <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">3 Modelos:</span>
                            {meme.threeVisualVariations.map((v: any, vi: number) => (
                              <button
                                key={vi}
                                onClick={() => handleApplyMemeToPost(meme, v.template)}
                                className="text-[10px] bg-[#1B2133] hover:bg-[#28324E] text-yellow-300 px-2 py-0.5 rounded border border-gray-700 hover:border-yellow-400 transition truncate"
                                title={`Aplicar no estilo ${v.name}`}
                              >
                                {v.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-2.5 border-t border-gray-800/80 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-mono text-gray-400">
                          Destaque: <strong className="text-yellow-400">{meme.highlight}</strong>
                        </span>
                        <div className="flex gap-1.5">
                          {meme.caption && (
                            <button
                              onClick={() => copyToClipboard(`${meme.caption}\n\n${(meme.hashtags || []).join(' ')}`, `cap-${idx}`)}
                              className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800 text-purple-300 rounded-lg text-xs font-mono transition flex items-center gap-1"
                              title="Copiar legenda com CTA"
                            >
                              {copiedId === `cap-${idx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                              Legenda
                            </button>
                          )}
                          <button
                            onClick={() => copyToClipboard(meme.text, `meme-${idx}`)}
                            className="p-1.5 bg-[#1C2234] hover:bg-[#252E44] text-gray-300 rounded-lg text-xs transition"
                            title="Copiar texto do meme"
                          >
                            {copiedId === `meme-${idx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleApplyMemeToPost(meme)}
                            className="px-3 py-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Usar no Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: 10 REELS */}
          {activeTab === 'reels10' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-white text-base">Roteiros Completos para Reels & TikTok</h3>
                  <p className="text-xs text-gray-400">
                    Com Hook nos 3 primeiros segundos, texto na tela, áudio viral e CTA natural.
                  </p>
                </div>
                <button
                  onClick={fetch10Reels}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Gerando Roteiros...' : 'Gerar Novos 10 Roteiros'}
                </button>
              </div>

              {loading && reelsScripts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin mb-3" />
                  <p className="font-bold text-white text-sm">Escrevendo 10 roteiros de Reels & TikTok...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reelsScripts.map((reel, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141824] border border-gray-800 p-4 rounded-xl flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                          <Film className="w-4 h-4" /> Roteiro #{idx + 1}: {reel.quadro || 'No Consultório'}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                          <span className="bg-gray-800 px-2 py-0.5 rounded">Duração: {reel.duration || '10s'}</span>
                          <span className="bg-green-950 text-green-400 px-2 py-0.5 rounded border border-green-800">
                            Compartilhamento: {reel.sharePotential || 'Alto'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="bg-[#0D1017] p-3 rounded-lg border border-gray-800">
                          <span className="text-[10px] uppercase font-mono text-yellow-400 font-bold block mb-1">
                            🎯 Hook (0 a 3s)
                          </span>
                          <p className="text-white font-medium">{reel.hook}</p>
                        </div>
                        <div className="bg-[#0D1017] p-3 rounded-lg border border-gray-800">
                          <span className="text-[10px] uppercase font-mono text-blue-400 font-bold block mb-1">
                            📱 Texto na Tela
                          </span>
                          <p className="text-gray-200 font-semibold">{reel.screenText}</p>
                        </div>
                        <div className="bg-[#0D1017] p-3 rounded-lg border border-gray-800">
                          <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block mb-1">
                            🎵 Sugestão de Áudio
                          </span>
                          <p className="text-gray-300">{reel.audio}</p>
                        </div>
                      </div>

                      <div className="bg-[#0D1017] p-3 rounded-lg border border-gray-800 text-xs">
                        <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1">
                          🎬 Cena Visual & Roteiro:
                        </span>
                        <p className="text-gray-300 leading-relaxed">{reel.script}</p>
                      </div>

                      <div className="bg-[#181D2C] p-3 rounded-lg border border-gray-800 flex items-center justify-between text-xs flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-gray-400 font-bold block">
                            Legenda & CTA:
                          </span>
                          <p className="text-gray-200">{reel.caption} • <strong className="text-yellow-400">{reel.cta}</strong></p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${reel.screenText}\n\n${reel.caption}\n${reel.cta}`, `reel-${idx}`)}
                          className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-lg transition flex items-center gap-1"
                        >
                          {copiedId === `reel-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          Copiar Roteiro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ANALISE ESSE POST */}
          {activeTab === 'analyze' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#141824] p-4 rounded-xl border border-gray-800">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1">
                  Texto Atual do Post no Editor:
                </span>
                <p className="text-white font-impact text-lg uppercase whitespace-pre-line">
                  {currentPostText}
                </p>
                <button
                  onClick={handleAnalyzePost}
                  disabled={loading}
                  className="mt-3 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Analisando...' : 'Reavaliar Post'}
                </button>
              </div>

              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#141824] p-4 rounded-xl border border-gray-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Score de Potencial</span>
                      <span className="text-lg font-black text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-lg border border-yellow-400/30">
                        {analysis.score || '8.5 / 10'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 flex flex-col gap-2">
                      <div>
                        <strong className="text-yellow-400 block">Identificação & Humor:</strong>
                        <p>{analysis.humorEvaluation || 'Forte conexão com quem já viveu a situação.'}</p>
                      </div>
                      <div>
                        <strong className="text-blue-400 block">Compartilhamento (DM/Stories):</strong>
                        <p>{analysis.shareability || 'Alto potencial de envio privado para amigos.'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141824] p-4 rounded-xl border border-yellow-400/40 flex flex-col gap-3">
                    <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Versão Otimizada (Mais Afiada e Cômica):
                    </span>
                    <p className="text-white font-impact text-base uppercase whitespace-pre-line bg-[#0D1017] p-3 rounded-lg border border-gray-800">
                      {analysis.improvedVersion || currentPostText}
                    </p>
                    <button
                      onClick={() => {
                        if (analysis.improvedVersion) {
                          onApplyPost({
                            text: analysis.improvedVersion,
                            highlightText: analysis.improvedVersion.split(' ')[0] || 'remedios',
                          });
                          onClose();
                        }
                      }}
                      className="py-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Aplicar Versão Otimizada no Canvas
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: 12 QUADROS OFICIAIS */}
          {activeTab === 'shows' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {OFFICIAL_SHOWS.map((show) => (
                <div
                  key={show.id}
                  className="bg-[#141824] border border-gray-800 hover:border-yellow-400 p-4 rounded-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{show.icon}</span>
                      <h4 className="font-bold text-white text-sm">{show.name}</h4>
                    </div>
                    <p className="text-xs text-gray-400">{show.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PLANO DE 30 DIAS */}
          {activeTab === 'calendar' && (
            <div className="bg-[#141824] p-5 rounded-xl border border-gray-800 flex flex-col gap-4 text-xs">
              <h3 className="font-bold text-white text-base">Estratégia de Lançamento — Primeiros 30 Dias (Zero a 100k)</h3>
              <p className="text-gray-300 leading-relaxed">
                O objetivo inicial não é vender terapia, e sim descobrir: <strong className="text-yellow-400">“O que faz as pessoas seguirem e compartilharem o Traumas.zip?”</strong>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="bg-[#0D1017] p-3.5 rounded-xl border border-gray-800">
                  <strong className="text-yellow-400 block mb-1">Semana 1: Fixação de Identidade</strong>
                  <ul className="text-gray-400 space-y-1 list-disc list-inside">
                    <li>2 Posts estáticos/dia (Tweet Parede)</li>
                    <li>1 Reel com áudio em alta e texto na tela</li>
                    <li>Testar quadros "No Consultório" e "Bula"</li>
                  </ul>
                </div>
                <div className="bg-[#0D1017] p-3.5 rounded-xl border border-gray-800">
                  <strong className="text-blue-400 block mb-1">Semana 2 & 3: Tração & Compartilhamento</strong>
                  <ul className="text-gray-400 space-y-1 list-disc list-inside">
                    <li>Foco total em compartilhamento por DM</li>
                    <li>Memes de relacionamentos e vácuo</li>
                    <li>Stories interativos (enquetes absurdas)</li>
                  </ul>
                </div>
                <div className="bg-[#0D1017] p-3.5 rounded-xl border border-gray-800">
                  <strong className="text-purple-400 block mb-1">Semana 4: Segunda Camada (Psicólogo)</strong>
                  <ul className="text-gray-400 space-y-1 list-disc list-inside">
                    <li>Inserção discreta na bio ("por trás: psicólogo")</li>
                    <li>Stories respondendo caixinha com humor afiado</li>
                    <li>Início da jornada de conversão natural</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
