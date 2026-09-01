export type TemplateType = 
  // OS 4 TEMPLATES OFICIAIS (DIRETOR DE ARTE TRAUMAS.ZIP / DEPRESSIVOS 2000):
  | 'cupom-fiscal'         // 1. CUPOM FISCAL EXISTENCIAL (Gastos, boletos, cansaço, fatura, preço emocional)
  | 'laudo-medico'         // 2. LAUDO MÉDICO (Janela Clássica Win98: Diagnósticos, CID, remédios, terapia)
  | 'erro-fatal'           // 3. ERRO FATAL (Com Scanlines de Monitor CRT: Choque de realidade, Expectativa vs Realidade, Crise 30)
  | 'nostalgia-social'     // 4. NOSTALGIA SOCIAL (Orkut / MSN: Relacionamentos, ex, stalk, vácuo, status)
  // Aliases & Estilos Clássicos:
  | 'nota-fiscal'          // Alias para Cupom Fiscal
  | 'sistema-alerta'       // Alias para Laudo Médico
  | 'msn-nostalgia'        // Alias para Nostalgia Social MSN
  | 'tela-azul-brutalista' // IDENTIDADE OFICIAL: Tela Azul Pura / Neo-Brutalismo
  | 'barra-carregamento-99' // BARRA 99%: Processando maturidade emocional...
  | 'aviso-sistema-bateria' // ALERTA AZUL: Aviso do Sistema / Bateria Social Crítica
  | 'terminal-dark' 
  | 'mockup-tv-vhs'        // 📺 TV de Tubo Bege/Branca com VHS & Adesivos (Quasar)
  | 'mockup-tv-dvd'        // 📺 TV de Tubo Prata com DVD & Cabos RCA (Memorex)
  | 'mockup-monitor-bege'  // 🖥️ Monitor de Tubo Bege (Windows 95/98)
  | 'mockup-celular-flip'  // 📱 Celular Tijolão / Flip (V3 / Nokia)
  | 'mockup-tv-madeira'    // 📺 TV Analógica de Madeira
  | 'mockup-gameboy'       // 🎮 Console Portátil (Gameboy)
  | 'mockup-mp3-player'    // 🎵 Reprodutor de MP3 / iPod
  | 'tweet-parede' 
  | 'winamp-retro'
  | 'windows-media-player' // 🎬 Windows Media Player XP (Bliss Wallpaper, Controles WMP 9, Vídeo/Foto)
  | 'wmp-xp';

export type AspectRatioType = '1:1' | '4:5' | '9:16' | '16:9';

export type StickerType = 
  | 'none'
  | 'avatar-sad'         // Avatar Oficial IG: :( 90deg Circular Azul Puro
  | 'avatar-exe'         // Avatar Oficial Quadrado: erro.exe
  | 'sticker-alerta-azul' // Caixa de Alerta Azul Puro
  | 'sticker-loading-bar' // Barra de Carregamento 99%
  | 'sticker-checkbox'    // [X] Fingir demência
  | 'warning'
  | 'error'
  | 'floppy'
  | 'skull'
  | 'broken-heart'
  | 'dialup'
  | 'msn'
  | 'cd'
  | 'battery'
  | 'sad-smile'
  | 'cursor';

export type MediaDisplayMode = 
  | 'none'                  // Don't render the image inside the card, just used for context
  // === FILTROS PUROS NA IMAGEM (SEM MOCKUP / SEM TEXTO / SEM DATA E HORA) ===
  | 'filter-crt-tv'         // 📺 Foto/Print de TV de Tubo CRT (Scanlines + Grade RGB + Curvatura + Vinheta de Tubo)
  | 'filter-vhs-tape'       // 📼 Fita VHS Analógica (Scanlines + RGB Aberration + Ruído Analógico)
  | 'filter-tv-dvd'         // 💿 TV Analógica 480i (Brilho de Tubo + Scanlines 480i + Cores Saturadas)
  | 'filter-cell-screen'    // 📱 Visor de Celular Antigo (Matriz de Pixels LCD + Backlight Cristal Líquido)
  | 'filter-pc-monitor'     // 🖥️ Monitor CRT de Computador (Scanlines VGA 60Hz + Fósforo)
  | 'filter-tv-static'      // ⚡ TV com Estática / Interferência Analógica de Antena
  | 'filter-film-photo'     // 📷 Foto Analógica 35mm (Granulação de Filme + Halation + Cores Vintage)
  | 'filter-security-screen'// 🚨 Monitor de CFTV / P&B Analógico (Scanlines + Alto Contraste)
  | 'filter-lcd-game'       // 🎮 Visor LCD 8-Bit (Matriz de Pontos Verde-Oliva)
  | 'tweet-media'           // ⬛ Imagem Pura / Normal (Sem filtro)
  | 'background'            // 🌌 Fundo do Post
  // Legados para retrocompatibilidade
  | 'effect-vhs'
  | 'effect-dvd'
  | 'effect-crt'
  | 'effect-camcorder'
  | 'effect-digicam'
  | 'effect-glitch'
  | 'effect-cftv'
  | 'tv-vhs'
  | 'tv-dvd'
  | 'monitor-bege'
  | 'celular-flip'
  | 'tv-madeira'
  | 'gameboy-retro'
  | 'mp3-player'
  | 'win-viewer'
  | 'polaroid'
  | 'msn-webcam';

export type MediaFilterType = 
  | 'none'
  | 'vintage-2000'
  | 'pixelate'
  | 'grayscale'
  | 'contrast-high';

export type CrtPresetType = 
  | 'none'          // Monitor Moderno (Flat / Digital)
  | 'crt-classic'   // Tubo CRT 2000 (Trinitron)
  | 'crt-flicker'   // Monitor 60Hz com Cintilação (Flicker)
  | 'crt-blur'      // VGA 640x480 (Desfoque de Fósforo)
  | 'crt-cyber'     // Fósforo Verde (Matrix Terminal)
  | 'crt-amber'     // Fósforo Âmbar (IBM Retro 1980s)
  | 'crt-vhs'       // Fita VHS / Glitch Analógico
  | 'crt-heavy';    // Distorção Lente Esférica (Fisheye CRT)

export interface PostConfig {
  id?: string;
  template: TemplateType;
  text: string;
  highlightText: string;
  highlightColor: string; // e.g. '#FFD700', '#FF3333', '#00FF66', '#00FFFF', '#FF007F'
  handle: string; // default '@DEPRESSIVOS2000'
  systemTitle: string; // e.g. 'Erro do Sistema - crise_dos_30.exe'
  terminalPrompt: string; // e.g. '> terminal_pensamentos_intrusivos'
  windowButtonText: string; // e.g. 'OK', 'FECHAR', 'ABORTAR'
  shadowColor: string; // e.g. '#0000FF', '#FF3333', '#000000'
  backgroundColor: string; // custom or template default
  textColor: string;
  borderWidth: number; // in pixels at 1080p scale (e.g. 16, 12, 8, 20)
  fontSize: number; // relative size multiplier 0.4 to 2.0
  textAlign?: 'left' | 'center' | 'right';
  lineHeightMultiplier?: number; // e.g. 1.0, 1.15, 1.3, 1.5
  letterSpacing?: number; // in pixels, e.g. -4, -2, 0, 2, 4, 8, 12
  textTransform?: 'uppercase' | 'none';
  showNoise: boolean;
  showScanlines: boolean;
  sticker: StickerType;
  aspectRatio: AspectRatioType;
  subnick?: string;
  statusText?: string;
  
  // Monitor Presets & CRT Retro Display Effects
  crtPreset?: CrtPresetType;
  crtCurvature?: boolean;         // Distorção curva de lente CRT / abaulamento
  crtFlicker?: boolean;           // Cintilação 60Hz
  crtBlur?: boolean;              // Desfoque óptico de fósforo / bloom
  crtVignette?: boolean;          // Vinheta escura nos cantos do tubo
  crtRgbShift?: boolean;          // Aberração cromática RGB
  crtScanlinesIntensity?: number; // 0 - 100 intensidade
  
  // Media / Video / Image / Audio Attachment
  mediaUrl?: string | null;
  mediaType?: 'image' | 'video';
  mediaDisplayMode?: MediaDisplayMode;
  mediaFilter?: MediaFilterType;
  mediaCaption?: string;
  detectedTopic?: string;
  audioPreviewUrl?: string | null;
  isPlayingAudio?: boolean;

  // Media Framing, Zoom & Positioning
  mediaFit?: 'cover' | 'contain' | 'fill'; // Modo de preenchimento (Preencher tela vs Mostrar inteiro)
  mediaZoom?: number; // 50 to 300 (% de zoom)
  mediaPositionX?: number; // 0 to 100 (% horizontal pan / object-position X)
  mediaPositionY?: number; // 0 to 100 (% vertical pan / object-position Y)
  mediaAspectRatio?: 'auto' | '16:9' | '4:3' | '1:1' | '9:16' | '4:5' | '3:4' | '21:9'; // Proporção do quadro da mídia
  mediaHeight?: number; // Altura personalizada em pixels
  mediaRotate?: number; // 0, 90, 180, 270 graus

  // Percentage Loading / Barra de Progresso Dinâmica
  showPercentageBar?: boolean;
  customPercentage?: number; // 0 to 100
  percentageLabel?: string;
  percentageStyle?: 'win98' | 'brutalist' | 'terminal' | 'receipt';
  animatePercentage?: boolean;
}

export interface PresetQuote {
  id: string;
  category: string;
  template: TemplateType;
  text: string;
  highlightText: string;
  highlightColor: string;
  systemTitle?: string;
  terminalPrompt?: string;
  windowButtonText?: string;
  shadowColor?: string;
  sticker?: StickerType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaDisplayMode?: MediaDisplayMode;
  mediaFilter?: MediaFilterType;
  mediaCaption?: string;
  audioPreviewUrl?: string;
}
