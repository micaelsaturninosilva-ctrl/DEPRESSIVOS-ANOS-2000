import React from 'react';
import { 
  PostConfig, 
  TemplateType, 
  AspectRatioType, 
  StickerType, 
  MediaDisplayMode, 
  MediaFilterType,
  CrtPresetType 
} from '../types';
import { FAMOUS_ALBUMS, searchOfficialAppleArtwork } from '../data/albumCovers';
import { OFFICIAL_TEMPLATES, classifyAndRouteVisualTemplate } from '../utils/visualRouter';
import { 
  Type, 
  Palette, 
  Sparkles, 
  Layers, 
  Smile, 
  Sliders, 
  Tv, 
  Square, 
  RectangleVertical, 
  Smartphone,
  RefreshCw,
  Terminal,
  Monitor,
  FileText,
  Music,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Trash2,
  Wand2,
  Zap,
  Activity,
  SlidersHorizontal,
  Sun,
  Eye,
  Search,
  CheckCircle2,
  Loader2,
  BrainCircuit,
  Receipt,
  AlertTriangle,
  XCircle,
  Share2,
  Percent,
  Gauge,
  Play
} from 'lucide-react';
import { Sticker } from './Stickers';
import { extractPercentageFromText, hasPercentageInText } from './PercentageLoader';
import { autoFormatMemeStructure } from '../utils/textFormatter';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Minus, 
  Plus,
  CaseUpper,
  CaseSensitive,
  Sparkle
} from 'lucide-react';

interface EditorControlsProps {
  config: PostConfig;
  onChange: (newConfig: PostConfig) => void;
  onOpenPresets: () => void;
  onOpenAiGenerator: () => void;
  onOpenMediaAnalyzer: () => void;
  onOpenVideoExport?: () => void;
  onOpenRlhfCurator?: () => void;
  onRandomQuote: () => void;
  onReset: () => void;
}

const CRT_PRESETS: {
  id: CrtPresetType;
  name: string;
  desc: string;
  icon: string;
  badge: string;
  settings: Partial<PostConfig>;
}[] = [
  {
    id: 'none',
    name: 'Digital Plano',
    desc: 'Sem distorção analógica, imagem 100% nítida',
    icon: '🖥️',
    badge: 'FLAT',
    settings: {
      crtPreset: 'none',
      showScanlines: false,
      crtCurvature: false,
      crtFlicker: false,
      crtBlur: false,
      crtVignette: false,
      crtRgbShift: false,
    },
  },
  {
    id: 'crt-classic',
    name: 'Tubo Trinitron 2000',
    desc: 'Curva suave de lente, scanlines clássicas e vinheta',
    icon: '📺',
    badge: 'Y2K',
    settings: {
      crtPreset: 'crt-classic',
      showScanlines: true,
      crtCurvature: true,
      crtFlicker: false,
      crtBlur: false,
      crtVignette: true,
      crtRgbShift: true,
      crtScanlinesIntensity: 85,
    },
  },
  {
    id: 'crt-flicker',
    name: 'Monitor 60Hz (Cintilação)',
    desc: 'Oscilação do feixe analógico 60Hz + scanlines ativas',
    icon: '⚡',
    badge: '60Hz',
    settings: {
      crtPreset: 'crt-flicker',
      showScanlines: true,
      crtCurvature: true,
      crtFlicker: true,
      crtBlur: false,
      crtVignette: true,
      crtRgbShift: false,
      crtScanlinesIntensity: 90,
    },
  },
  {
    id: 'crt-blur',
    name: 'VGA 640x480 (Desfoque)',
    desc: 'Filtro de desfoque óptico de fósforo e bloom suave',
    icon: '🌫️',
    badge: 'LOW-RES',
    settings: {
      crtPreset: 'crt-blur',
      showScanlines: true,
      crtCurvature: true,
      crtFlicker: false,
      crtBlur: true,
      crtVignette: true,
      crtRgbShift: true,
      crtScanlinesIntensity: 75,
    },
  },
  {
    id: 'crt-cyber',
    name: 'Fósforo Verde Matrix',
    desc: 'Monocromático verde hacker com glow analógico',
    icon: '🟢',
    badge: 'MATRIX',
    settings: {
      crtPreset: 'crt-cyber',
      showScanlines: true,
      crtCurvature: true,
      crtFlicker: false,
      crtBlur: false,
      crtVignette: true,
      crtRgbShift: false,
      crtScanlinesIntensity: 95,
    },
  },
  {
    id: 'crt-amber',
    name: 'Fósforo Âmbar 80s/90s',
    desc: 'Tonalidade âmbar vintage de computadores antigos',
    icon: '🟠',
    badge: 'RETRO',
    settings: {
      crtPreset: 'crt-amber',
      showScanlines: true,
      crtCurvature: true,
      crtFlicker: false,
      crtBlur: false,
      crtVignette: true,
      crtRgbShift: false,
      crtScanlinesIntensity: 90,
    },
  },
  {
    id: 'crt-vhs',
    name: 'Fita VHS / Glitch RF',
    desc: 'Aberração cromática RGB, ruído de fita e flicker',
    icon: '📼',
    badge: 'VHS',
    settings: {
      crtPreset: 'crt-vhs',
      showScanlines: true,
      showNoise: true,
      crtCurvature: false,
      crtFlicker: true,
      crtBlur: true,
      crtVignette: true,
      crtRgbShift: true,
      crtScanlinesIntensity: 85,
    },
  },
  {
    id: 'crt-heavy',
    name: 'Lente Fisheye Extrema',
    desc: 'Curvatura esférica acentuada, moldura e vinheta pesada',
    icon: '🔮',
    badge: 'FISHEYE',
    settings: {
      crtPreset: 'crt-heavy',
      showScanlines: true,
      showNoise: true,
      crtCurvature: true,
      crtFlicker: true,
      crtBlur: true,
      crtVignette: true,
      crtRgbShift: true,
      crtScanlinesIntensity: 100,
    },
  },
];

const TEMPLATES: { id: TemplateType; name: string; icon: React.ReactNode; desc: string; tag: string; isOfficial?: boolean }[] = [
  // ============================================================
  // OS 4 TEMPLATES OFICIAIS (DIRETOR DE ARTE TRAUMAS.ZIP / DEPRESSIVOS 2000)
  // ============================================================
  {
    id: 'cupom-fiscal',
    name: '1. Cupom Fiscal Existencial',
    icon: <Receipt className="w-5 h-5 text-amber-500" />,
    desc: 'Gastos, boletos, consequências de escolhas ruins, preço emocional. Borda tracejada e código de barras.',
    tag: 'OFICIAL 1',
    isOfficial: true,
  },
  {
    id: 'laudo-medico',
    name: '2. Laudo Médico (Janela Win98)',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    desc: 'Diagnósticos absurdos, saúde mental, remédios, terapia. Janela 3D cinza com botão ACEITAR LAUDO.',
    tag: 'OFICIAL 2',
    isOfficial: true,
  },
  {
    id: 'erro-fatal',
    name: '3. Erro Fatal (Scanlines CRT)',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    desc: 'Expectativa vs Realidade, choque de realidade, crise dos 30. Scanlines de monitor CRT e botão OK.',
    tag: 'OFICIAL 3',
    isOfficial: true,
  },
  {
    id: 'nostalgia-social',
    name: '4. Nostalgia Social (MSN / Orkut)',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    desc: 'Relacionamentos, stalk de ex, vácuo no WhatsApp. Gradiente azul, borboleta MSN e rosa neon.',
    tag: 'OFICIAL 4',
    isOfficial: true,
  },

  // ============================================================
  // VARIAÇÕES & CSS ART MOCKUPS
  // ============================================================
  {
    id: 'tela-azul-brutalista',
    name: 'Tela Azul Pura (Brutalista)',
    icon: <Square className="w-5 h-5 text-[#0000FF]" />,
    desc: 'Neo-brutalismo com Bege Gabinete #F4F4F0 e sombra sólida Azul Puro',
    tag: 'BRUTAL',
  },
  {
    id: 'barra-carregamento-99',
    name: 'Barra Travada em 99%',
    icon: <Sliders className="w-5 h-5 text-[#0000FF]" />,
    desc: 'Processando maturidade emocional... 99% travado há 10 anos',
    tag: '99%',
  },
  {
    id: 'aviso-sistema-bateria',
    name: 'Alerta Azul do Sistema',
    icon: <Monitor className="w-5 h-5 text-yellow-400" />,
    desc: 'Tela Azul com checklist psicanalítico: [X] Fingir demência',
    tag: 'ALERTA',
  },
  {
    id: 'terminal-dark',
    name: 'Terminal 3 da Manhã',
    icon: <Terminal className="w-5 h-5 text-[#00FF66]" />,
    desc: 'Modo escuro com sombra vermelha e prompt de comando',
    tag: '3 AM',
  },
  {
    id: 'mockup-tv-vhs',
    name: '📺 TV Tubo VHS Quasar',
    icon: <Tv className="w-5 h-5 text-yellow-300" />,
    desc: 'Carcaça bege/branca, entrada de fita VHS, botões 3D e adesivos nostálgicos',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-tv-dvd',
    name: '📺 TV Tubo DVD Memorex',
    icon: <Tv className="w-5 h-5 text-gray-300" />,
    desc: 'Carcaça prata metálico, bandeja DVD, 3 conectores RCA e visor fluorescente',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-monitor-bege',
    name: '🖥️ Monitor Tubo Bege 95/98',
    icon: <Tv className="w-5 h-5 text-blue-400" />,
    desc: 'Gabinete 3D bege, botões OSD em relevo, scanlines e tela 4:3',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-celular-flip',
    name: '📱 Celular Tijolão / Flip V3',
    icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
    desc: 'Carcaça grafite metálica, antena, teclado numérico iluminado',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-tv-madeira',
    name: '📺 TV Madeira Analógica',
    icon: <Tv className="w-5 h-5 text-amber-500" />,
    desc: 'Madeira mogno, botões giratórios VHF/UHF, tela abaulada e antena V',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-gameboy',
    name: '🎮 Console Portátil 8-Bit',
    icon: <SlidersHorizontal className="w-5 h-5 text-purple-400" />,
    desc: 'Plástico cinza retrô, D-Pad preto, botões A/B roxos e LCD verde',
    tag: 'CSS ART',
  },
  {
    id: 'mockup-mp3-player',
    name: '🎵 Display LCD iPod Y2K',
    icon: <Music className="w-5 h-5 text-sky-400" />,
    desc: 'Apenas a tela do iPod: Capa com reflexo, álbum, scrubber azul em movimento e timer ao vivo',
    tag: 'Display',
  },
];

const SHADOW_PALETTES = [
  { name: 'Azul Brutal', color: '#0000FF', bg: '#0000FF' },
  { name: 'Vermelho 3h', color: '#FF3333', bg: '#FF3333' },
  { name: 'Amarelo Y2K', color: '#FFD700', bg: '#FFD700' },
  { name: 'Matrix Verde', color: '#00FF66', bg: '#00FF66' },
  { name: 'Hot Pink Orkut', color: '#FF007F', bg: '#FF007F' },
  { name: 'Preto Puro', color: '#000000', bg: '#000000' },
  { name: 'Azul Windows', color: '#000080', bg: '#000080' },
  { name: 'Ciano Cyber', color: '#00FFFF', bg: '#00FFFF' },
];

const TEXT_COLORS = [
  { name: 'Branco Puro', color: '#FFFFFF', bg: '#FFFFFF', isDark: false },
  { name: 'Off-White Retrô', color: '#F4F4F0', bg: '#F4F4F0', isDark: false },
  { name: 'Preto Grafite', color: '#1A1A1A', bg: '#1A1A1A', isDark: true },
  { name: 'Amarelo Ouro', color: '#FFD700', bg: '#FFD700', isDark: false },
  { name: 'Verde Matrix', color: '#00FF66', bg: '#00FF66', isDark: false },
  { name: 'Azul Elétrico', color: '#0000FF', bg: '#0000FF', isDark: true },
  { name: 'Vermelho Erro', color: '#FF3333', bg: '#FF3333', isDark: false },
  { name: 'Hot Pink', color: '#FF007F', bg: '#FF007F', isDark: false },
  { name: 'Ciano Cyber', color: '#00FFFF', bg: '#00FFFF', isDark: false },
  { name: 'Laranja Vívido', color: '#FF6B00', bg: '#FF6B00', isDark: false },
];

const BACKGROUND_COLORS = [
  { name: 'Bege Retrô', color: '#F4F4F0' },
  { name: 'Cinza Win98', color: '#C0C0C0' },
  { name: 'Dark Terminal', color: '#12141C' },
  { name: 'Azul Tela Morte', color: '#0000FF' },
  { name: 'Branco', color: '#FFFFFF' },
  { name: 'Amarelo Cupom', color: '#FFFEEA' },
  { name: 'Azul MSN', color: '#E8F1FC' },
  { name: 'Preto', color: '#000000' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Azul Puro', color: '#0000FF' },
  { name: 'Amarelo Caneta', color: '#FFD700' },
  { name: 'Vermelho Erro', color: '#FF3333' },
  { name: 'Verde Neon', color: '#00FF66' },
  { name: 'Ciano Glow', color: '#00FFFF' },
  { name: 'Rosa Choque', color: '#FF007F' },
  { name: 'Branco', color: '#FFFFFF' },
];

const STICKERS: { id: StickerType; label: string }[] = [
  { id: 'none', label: 'Nenhum' },
  { id: 'avatar-sad', label: 'Avatar :(' },
  { id: 'avatar-exe', label: 'erro.exe' },
  { id: 'sticker-alerta-azul', label: 'Alerta Azul' },
  { id: 'sticker-loading-bar', label: 'Barra 99%' },
  { id: 'sticker-checkbox', label: '[X] Demência' },
  { id: 'warning', label: 'Aviso ⚠️' },
  { id: 'error', label: 'Erro ❌' },
  { id: 'broken-heart', label: 'Coração 💔' },
  { id: 'skull', label: 'Crânio 💀' },
  { id: 'floppy', label: 'Disquete 💾' },
  { id: 'msn', label: 'MSN 🦋' },
  { id: 'dialup', label: 'Modem 56k ☎️' },
  { id: 'cd', label: 'CD-ROM 💿' },
  { id: 'battery', label: 'Bateria Fraca 🪫' },
  { id: 'sad-smile', label: 'Smile Triste 😐' },
  { id: 'cursor', label: 'Cursor 🖱️' },
];

export const EditorControls: React.FC<EditorControlsProps> = ({
  config,
  onChange,
  onOpenPresets,
  onOpenAiGenerator,
  onOpenMediaAnalyzer,
  onOpenVideoExport,
  onOpenRlhfCurator,
  onRandomQuote,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearchingCover, setIsSearchingCover] = React.useState(false);
  const [searchFeedback, setSearchFeedback] = React.useState<string | null>(null);

  const update = (partial: Partial<PostConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleSearchRealCover = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim() || config.text;
    if (!query) return;

    setIsSearchingCover(true);
    setSearchFeedback('Buscando capa oficial no Apple Music / iTunes...');
    try {
      const result = await searchOfficialAppleArtwork(query);
      if (result && result.coverUrl) {
        update({
          text: `${result.artist} - ${result.song} (${result.album || 'Single'})`,
          highlightText: result.song,
          mediaUrl: result.coverUrl,
          audioPreviewUrl: result.previewUrl || null,
          mediaType: 'image',
          mediaDisplayMode: 'mp3-player',
          template: 'winamp-retro',
        });
        setSearchFeedback(`✓ Capa oficial e áudio encontrados: ${result.artist} - ${result.song}`);
        setTimeout(() => setSearchFeedback(null), 4000);
      } else {
        setSearchFeedback('Música não encontrada no catálogo global. Tente outro nome/artista.');
        setTimeout(() => setSearchFeedback(null), 4000);
      }
    } catch {
      setSearchFeedback('Erro ao buscar capa oficial.');
      setTimeout(() => setSearchFeedback(null), 4000);
    } finally {
      setIsSearchingCover(false);
    }
  };

  const handleInsertHighlightTag = () => {
    // If there is selected text in the textarea, wrap it with [destaque]...[/destaque]
    const textarea = document.getElementById('post-main-text-input') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      if (selected) {
        const newText =
          textarea.value.substring(0, start) +
          `[destaque]${selected}[/destaque]` +
          textarea.value.substring(end);
        update({ text: newText });
      } else {
        update({ text: config.text + ' [destaque]texto destacado[/destaque]' });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 text-sm text-gray-200">
      {/* Video MP4 Export Banner */}
      {onOpenVideoExport && (
        <button
          onClick={onOpenVideoExport}
          id="btn-open-video-export-banner"
          className="w-full p-3.5 bg-gradient-to-r from-red-600 via-pink-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 active:scale-[0.99] text-white rounded-xl shadow-lg border border-pink-400/40 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 bg-black/30 rounded-lg group-hover:scale-110 transition flex-shrink-0">
              <Video className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Exportar Vídeo MP4 (1080p)
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#00FF66] text-black px-1.5 py-0.2 rounded">
                  ÁUDIO & REELS
                </span>
              </div>
              <p className="text-xs text-pink-100/90">
                Gere arquivos em vídeo MP4/WebM com som do iPod e animações
              </p>
            </div>
          </div>
          <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mr-1 animate-bounce" />
        </button>
      )}

      {/* RLHF Feedback Loop Banner */}
      {onOpenRlhfCurator && (
        <button
          onClick={onOpenRlhfCurator}
          id="btn-open-rlhf-curator-banner"
          className="w-full p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 active:scale-[0.99] text-white rounded-xl shadow-lg border border-emerald-400/40 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 bg-black/30 rounded-lg group-hover:scale-110 transition flex-shrink-0">
              <BrainCircuit className="w-5 h-5 text-[#00FF66]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Curadoria & Aprendizado RLHF
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#FFD700] text-black px-1.5 py-0.2 rounded">
                  MATCH / SWIPE
                </span>
              </div>
              <p className="text-xs text-emerald-100/90">
                Avalie posts para ensinar a IA a evoluir o DNA dos seus memes
              </p>
            </div>
          </div>
          <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0 mr-1 animate-bounce" />
        </button>
      )}

      {/* Feature Banner: Upload Media & AI Visual Humor */}
      <button
        onClick={onOpenMediaAnalyzer}
        id="btn-open-media-analyzer-banner"
        className="w-full p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] text-white rounded-xl shadow-lg border border-blue-400/40 flex items-center justify-between transition group"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-black/30 rounded-lg group-hover:scale-110 transition flex-shrink-0">
            <ImageIcon className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                Subir Foto / Vídeo + IA Contextual
              </span>
              <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.2 rounded">
                NOVO
              </span>
            </div>
            <p className="text-xs text-blue-100/90">
              Analisa o que está na imagem e cria piadas no contexto exato
            </p>
          </div>
        </div>
        <Wand2 className="w-5 h-5 text-yellow-300 flex-shrink-0 mr-1 animate-pulse" />
      </button>

      {/* Quick Action Bar: Randomizer & AI & Presets & Media */}
      <div className="grid grid-cols-4 gap-2 bg-[#1A1D24] p-2.5 rounded-xl border border-gray-800">
        <button
          onClick={onRandomQuote}
          id="btn-random-quote"
          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 bg-[#242936] hover:bg-[#303748] active:scale-95 text-white text-xs font-medium rounded-lg transition border border-gray-700 shadow-sm"
          title="Sortear uma frase da coleção"
        >
          <RefreshCw className="w-4 h-4 text-yellow-400" />
          <span className="truncate">Sortear</span>
        </button>

        <button
          onClick={onOpenPresets}
          id="btn-open-presets"
          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 bg-[#242936] hover:bg-[#303748] active:scale-95 text-white text-xs font-medium rounded-lg transition border border-gray-700 shadow-sm"
          title="Ver acervo de frases prontas"
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="truncate">Acervo</span>
        </button>

        <button
          onClick={onOpenAiGenerator}
          id="btn-open-ai"
          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 bg-[#242936] hover:bg-[#303748] active:scale-95 text-white text-xs font-medium rounded-lg transition border border-gray-700 shadow-sm"
          title="Gerar nova frase com Inteligência Artificial"
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="truncate">Texto IA</span>
        </button>

        <button
          onClick={onOpenMediaAnalyzer}
          id="btn-quick-media"
          className="flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 bg-[#242936] hover:bg-[#303748] active:scale-95 text-white text-xs font-medium rounded-lg transition border border-gray-700 shadow-sm"
          title="Subir imagem ou vídeo para análise visual"
        >
          <ImageIcon className="w-4 h-4 text-cyan-300" />
          <span className="truncate">Mídia IA</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* SEÇÃO: MÍDIA & MOCKUPS RETRÔ (CSS ART ANOS 2000) */}
      {/* ============================================================ */}
      <div className="bg-[#141824] p-4 rounded-xl border-2 border-blue-500/50 flex flex-col gap-3.5 shadow-lg relative overflow-hidden">
        {/* Header da Seção */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30">
              <Tv className="w-4 h-4" />
            </span>
            <div>
              <label className="font-impact text-sm text-white uppercase tracking-wider block leading-tight">
                Mockups Retrô & Molduras (CSS Art)
              </label>
              <span className="text-[10px] text-yellow-400 font-mono font-bold">
                100% CSS ART NOSTÁLGICO ANOS 2000
              </span>
            </div>
          </div>

          {config.mediaUrl && (
            <button
              onClick={() => update({ mediaUrl: undefined, mediaType: undefined })}
              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 px-2 py-1 rounded border border-red-800/60 transition"
              title="Remover mídia customizada"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar Mídia
            </button>
          )}
        </div>

        {/* Status da Mídia e Botões Rápidos */}
        {config.mediaUrl ? (
          <div className="flex gap-3 items-center bg-[#1A2030] p-2.5 rounded-lg border border-blue-500/30">
            {config.mediaType === 'video' || config.mediaUrl.startsWith('data:video') ? (
              <video
                src={config.mediaUrl}
                autoPlay
                loop
                muted
                className="w-14 h-14 rounded-lg object-cover border border-blue-400/40 flex-shrink-0"
              />
            ) : (
              <img
                src={config.mediaUrl}
                alt="Mídia anexada"
                className="w-14 h-14 rounded-lg object-cover border border-blue-400/40 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-blue-300 font-bold truncate">
                {config.detectedTopic ? `Tópico: ${config.detectedTopic}` : 'Mídia Personalizada Carregada'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Exibindo dentro do dispositivo retrô selecionado
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-[#1A2030] p-2.5 rounded-lg border border-gray-700/60">
            <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
              <span className="text-base">🕹️</span>
              <div>
                <p className="font-bold text-white leading-none">Tela Retrô Ativa</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Usando animação/gráfico 2000</p>
              </div>
            </div>
            {/* Quick Test Demo Media Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  update({
                    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
                    mediaType: 'image',
                    mediaDisplayMode: config.mediaDisplayMode === 'none' ? 'monitor-bege' : config.mediaDisplayMode,
                  })
                }
                className="text-[10px] bg-blue-900/60 hover:bg-blue-800 text-blue-200 px-2 py-1 rounded border border-blue-700 font-mono transition"
                title="Carregar foto vintage de teste"
              >
                + Foto Demo
              </button>
              <button
                onClick={onOpenMediaAnalyzer}
                className="text-[10px] bg-purple-900/60 hover:bg-purple-800 text-purple-200 px-2 py-1 rounded border border-purple-700 font-mono transition flex items-center gap-1"
                title="Fazer upload de foto/vídeo com IA"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Upload / IA
              </button>
            </div>
          </div>
        )}

        {/* SELETOR DOS 5 APARELHOS NOSTÁLGICOS CSS ART */}
        <div>
          <label className="text-xs text-gray-300 font-semibold block mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Escolha o Dispositivo / Moldura:</span>
            </span>
            <span className="text-[10px] text-yellow-400 font-mono font-bold">10 MODELOS</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
            {[
              { id: 'tv-vhs', label: '📼 TV VHS Quasar' },
              { id: 'tv-dvd', label: '💿 TV DVD Memorex' },
              { id: 'monitor-bege', label: '🖥️ Monitor Tubo Bege' },
              { id: 'celular-flip', label: '📱 Celular Flip / V3' },
              { id: 'tv-madeira', label: '📺 TV Madeira Analógica' },
              { id: 'gameboy-retro', label: '🎮 Portátil Gameboy' },
              { id: 'mp3-player', label: '🎵 MP3 Player / iPod' },
              { id: 'win-viewer', label: '🪟 Windows 98 Foto' },
              { id: 'polaroid', label: '📷 Foto Polaroid' },
              { id: 'msn-webcam', label: '📹 MSN Webcam' },
              { id: 'tweet-media', label: '⬛ Borda Brutalista' },
              { id: 'background', label: '🌌 Fundo Escuro' },
              { id: 'none', label: '🚫 Apenas Texto' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => update({ mediaDisplayMode: mode.id as MediaDisplayMode })}
                className={`p-2 rounded-lg text-left transition font-medium border flex items-center gap-1.5 ${
                  (config.mediaDisplayMode || 'monitor-bege') === mode.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md font-bold'
                    : 'bg-[#1F2536] text-gray-300 border-gray-700 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-xs truncate">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros Retrô de Imagem */}
        <div>
          <label className="text-xs text-gray-300 font-semibold block mb-1.5">
            Filtro Visual Retrô:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-mono">
            {[
              { id: 'none', label: 'Normal' },
              { id: 'vintage-2000', label: 'Cyber 2000' },
              { id: 'pixelate', label: 'Pixelado' },
              { id: 'grayscale', label: 'P&B' },
              { id: 'contrast-high', label: 'Contraste' },
            ].map((flt) => (
              <button
                key={flt.id}
                onClick={() => update({ mediaFilter: flt.id as MediaFilterType })}
                className={`p-1.5 rounded text-center transition font-medium border ${
                  (config.mediaFilter || 'none') === flt.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm font-bold'
                    : 'bg-[#1F2536] text-gray-400 border-gray-700 hover:text-gray-200'
                }`}
              >
                {flt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda Opcional */}
        <div>
          <label className="text-xs text-gray-300 font-semibold block mb-1">
            Legenda do Aparelho / Faixa (Opcional):
          </label>
          <input
            type="text"
            value={config.mediaCaption || ''}
            onChange={(e) => update({ mediaCaption: e.target.value })}
            placeholder="ex: CPM 22 - Um Minuto Para o Fim do Mundo.mp3"
            className="w-full bg-[#121316] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* CATÁLOGO DE ÁLBUNS COM FOTO E CAPA OFICIAL (1-CLIQUE OU BUSCA ONLINE) */}
        {(config.mediaDisplayMode === 'mp3-player' || config.template === 'winamp-retro') && (
          <div className="mt-2 pt-3 border-t border-gray-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-sky-400 flex items-center gap-1.5 font-mono">
                <Music className="w-3.5 h-3.5" />
                <span>Capa de Álbum Oficial Real:</span>
              </label>
              <span className="text-[10px] text-yellow-300 font-mono font-bold bg-yellow-950/60 px-1.5 py-0.5 rounded border border-yellow-700/50">
                100% OFICIAL APPLE MUSIC
              </span>
            </div>

            {/* BARRA DE BUSCA DE QUALQUER MÚSICA / ÁLBUM DO MUNDO */}
            <form onSubmit={handleSearchRealCover} className="flex gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar qualquer artista ou música (ex: Nirvana, Pitty, Travis Scott)..."
                  className="w-full bg-[#0D1017] border border-blue-500/40 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 font-mono"
                />
                <Search className="w-3.5 h-3.5 text-blue-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={isSearchingCover}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition flex-shrink-0 shadow border border-blue-400/50"
              >
                {isSearchingCover ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Buscar Capa Real</span>
                  </>
                )}
              </button>
            </form>

            {searchFeedback && (
              <p className={`text-[11px] font-mono px-2 py-1 rounded ${
                searchFeedback.startsWith('✓') 
                  ? 'bg-green-950/60 text-green-300 border border-green-800' 
                  : 'bg-blue-950/60 text-blue-300 border border-blue-800'
              }`}>
                {searchFeedback}
              </p>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {FAMOUS_ALBUMS.map((album) => {
                const isCurrent =
                  config.mediaUrl === album.coverUrl ||
                  config.text?.includes(album.songTitle);

                return (
                  <button
                    key={album.id}
                    onClick={() => {
                      update({
                        text: `${album.artistName} - ${album.songTitle} (${album.albumName})`,
                        highlightText: album.songTitle,
                        mediaUrl: album.coverUrl,
                        audioPreviewUrl: album.previewUrl,
                        mediaType: 'image',
                        mediaDisplayMode: 'mp3-player',
                        template: 'winamp-retro',
                      });
                    }}
                    className={`p-1.5 rounded-lg border text-left flex flex-col gap-1.5 transition group ${
                      isCurrent
                        ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-500'
                        : 'bg-[#181E2E] border-gray-700 hover:border-gray-500 hover:bg-[#20273C]'
                    }`}
                  >
                    <div className="w-full aspect-square rounded overflow-hidden relative shadow bg-black">
                      <img
                        src={album.coverUrl}
                        alt={album.songTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {album.badge && (
                        <span className="absolute bottom-1 left-1 bg-black/80 text-[8px] text-yellow-300 font-mono px-1 py-0.5 rounded font-bold">
                          {album.badge}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate leading-tight">
                        {album.songTitle}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate mt-0.5">
                        {album.artistName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 1. MÓDULO DE ROTEAMENTO VISUAL (OS 4 TEMPLATES OFICIAIS) */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border-2 border-blue-500/40 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-800">
          <div>
            <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Módulo de Roteamento Visual (4 Templates)
            </label>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Diretor de Arte Traumas.zip: Cupom Fiscal, Laudo Médico, Erro Fatal e Nostalgia Social
            </p>
          </div>

          {/* Botão de Auto-Classificação Visual Inteligente */}
          <button
            onClick={() => {
              const routed = classifyAndRouteVisualTemplate(config.text, config);
              update({
                template: routed.template,
                backgroundColor: routed.backgroundColor,
                textColor: routed.textColor,
                highlightColor: routed.highlightColor,
                shadowColor: routed.shadowColor,
                systemTitle: routed.systemTitle,
                windowButtonText: routed.windowButtonText,
                sticker: routed.sticker,
                showScanlines: routed.showScanlines,
              });
            }}
            id="btn-auto-visual-routing"
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-lg border border-blue-400 flex items-center gap-1.5 shadow-md transition"
            title="Analisa o tema do texto e aplica o template exato com CSS e Tailwind oficiais"
          >
            <Wand2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Auto-Roteamento (IA)</span>
          </button>
        </div>

        {/* Quick info banner when official template is active */}
        {OFFICIAL_TEMPLATES[config.template] && (
          <div className="mb-3 p-2.5 bg-blue-950/40 border border-blue-500/30 rounded-lg flex items-start gap-2 text-xs">
            <span className="text-base">{OFFICIAL_TEMPLATES[config.template].icon}</span>
            <div>
              <span className="font-bold text-blue-300">
                {OFFICIAL_TEMPLATES[config.template].name}
              </span>
              <p className="text-[11px] text-gray-300 mt-0.5">
                {OFFICIAL_TEMPLATES[config.template].themeUseCases}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TEMPLATES.map((tpl) => {
            const isSelected = config.template === tpl.id;
            return (
              <button
                key={tpl.id}
                id={`template-select-${tpl.id}`}
                onClick={() => {
                  if (tpl.id === 'cupom-fiscal' || tpl.id === 'nota-fiscal') {
                    update({
                      template: 'cupom-fiscal',
                      backgroundColor: '#FDFBF7',
                      textColor: '#1A1A1A',
                      highlightColor: '#FFD700',
                      shadowColor: '#1A1A1A',
                      systemTitle: '*** CUPOM FISCAL EXISTENCIAL ***',
                      windowButtonText: 'PAGAR FATURA',
                    });
                  } else if (tpl.id === 'laudo-medico' || tpl.id === 'sistema-alerta') {
                    update({
                      template: 'laudo-medico',
                      backgroundColor: '#c0c0c0',
                      textColor: '#1A1A1A',
                      highlightColor: '#FF3333',
                      shadowColor: '#000080',
                      systemTitle: 'Laudo Médico - CID_F32.exe',
                      windowButtonText: 'ACEITAR LAUDO',
                      sticker: 'warning',
                    });
                  } else if (tpl.id === 'erro-fatal') {
                    update({
                      template: 'erro-fatal',
                      backgroundColor: '#c0c0c0',
                      textColor: '#1A1A1A',
                      highlightColor: '#FF0000',
                      shadowColor: '#FF0000',
                      systemTitle: 'Erro Fatal - crise_dos_30.exe',
                      windowButtonText: 'OK',
                      sticker: 'error',
                      showScanlines: true,
                    });
                  } else if (tpl.id === 'nostalgia-social' || tpl.id === 'msn-nostalgia') {
                    update({
                      template: 'nostalgia-social',
                      backgroundColor: '#E8F1FC',
                      textColor: '#1A1A1A',
                      highlightColor: '#FF007F',
                      shadowColor: '#000080',
                      systemTitle: 'MSN Messenger - Conversa com Crush',
                      windowButtonText: 'CHAMAR ATENÇÃO',
                      sticker: 'msn',
                    });
                  } else if (tpl.id === 'terminal-dark') {
                    update({
                      template: tpl.id,
                      backgroundColor: '#12141C',
                      textColor: '#F4F4F0',
                      shadowColor: config.shadowColor === '#0000FF' ? '#FF3333' : config.shadowColor,
                      highlightColor: config.highlightColor === '#0000FF' ? '#00FF66' : (config.highlightColor || '#00FF66'),
                    });
                  } else if (tpl.id === 'aviso-sistema-bateria') {
                    update({
                      template: tpl.id,
                      backgroundColor: '#0000FF',
                      textColor: '#FFFFFF',
                      shadowColor: '#1A1A1A',
                      highlightColor: '#FFD700',
                    });
                  } else if (tpl.id === 'tela-azul-brutalista' || tpl.id === 'barra-carregamento-99' || tpl.id === 'tweet-parede') {
                    update({
                      template: tpl.id,
                      backgroundColor: config.backgroundColor === '#12141C' || config.backgroundColor === '#1A1A1A' || config.backgroundColor === '#0000FF' ? '#F4F4F0' : config.backgroundColor,
                      textColor: config.textColor === '#F4F4F0' || config.textColor === '#FFFFFF' ? '#1A1A1A' : config.textColor,
                      shadowColor: config.shadowColor === '#FF3333' ? '#0000FF' : config.shadowColor,
                    });
                  } else {
                    update({ template: tpl.id });
                  }
                }}
                className={`p-3 rounded-lg flex flex-col text-left transition border ${
                  isSelected
                    ? 'bg-[#2A334B] border-blue-500 text-white shadow-lg ring-1 ring-blue-500'
                    : tpl.isOfficial
                    ? 'bg-[#181D2A] border-blue-900/60 text-gray-300 hover:text-white hover:border-blue-500/50'
                    : 'bg-[#15171D] border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                    {tpl.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : tpl.isOfficial
                        ? 'bg-blue-950 text-blue-300 border border-blue-700/50'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {tpl.tag}
                  </span>
                </div>
                <span className="font-bold text-xs text-white truncate">
                  {tpl.name}
                </span>
                <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                  {tpl.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TEXTO PRINCIPAL, FORMATAÇÃO E CONTROLE DE TAMANHO */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border border-gray-800 flex flex-col gap-3.5 shadow-md">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
            <Type className="w-4 h-4 text-blue-400" />
            Texto do Post
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                const formatted = autoFormatMemeStructure(config.text);
                update({ text: formatted });
              }}
              className="text-xs bg-[#242A38] hover:bg-[#313A4E] text-cyan-300 px-2.5 py-1 rounded font-mono border border-cyan-800/50 flex items-center gap-1 transition"
              title="Organiza automaticamente o meme com quebra entre contexto e punchline"
            >
              <Sparkle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Organizar Meme</span>
            </button>
            <button
              onClick={handleInsertHighlightTag}
              className="text-xs bg-[#2B313F] hover:bg-[#384154] text-yellow-300 px-2.5 py-1 rounded font-mono border border-gray-700 flex items-center gap-1 transition"
              title="Destaque o trecho selecionado com a cor configurada"
            >
              <span>+ Destacar [destaque]</span>
            </button>
          </div>
        </div>

        <textarea
          id="post-main-text-input"
          value={config.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={4}
          placeholder="Digite o texto do seu post..."
          className="w-full bg-[#121316] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans leading-relaxed"
        />

        {/* BARRA DE FERRAMENTAS TIPOGRÁFICAS (TAMANHO, ALINHAMENTO, ENTRELINHA) */}
        <div className="p-3 bg-[#15171D] border border-gray-800 rounded-lg flex flex-col gap-2.5">
          {/* Controles de Tamanho de Fonte (Aumentar / Diminuir) */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase font-mono flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                Tamanho da Fonte:
              </span>
              <span className="bg-[#202534] text-blue-300 font-mono text-xs px-2 py-0.5 rounded border border-blue-800/60 font-bold">
                {Math.round((config.fontSize || 1) * 100)}%
              </span>
            </div>

            {/* Botões A- e A+ */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const nextSize = Math.max(0.4, Number(((config.fontSize || 1) - 0.1).toFixed(2)));
                  update({ fontSize: nextSize });
                }}
                className="px-2.5 py-1 rounded bg-[#202534] hover:bg-[#2B3247] text-white border border-gray-700 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                title="Diminuir tamanho do texto (-10%)"
              >
                <Minus className="w-3 h-3 text-gray-400" />
                <span>A-</span>
              </button>

              <button
                onClick={() => {
                  const nextSize = Math.min(2.2, Number(((config.fontSize || 1) + 0.1).toFixed(2)));
                  update({ fontSize: nextSize });
                }}
                className="px-2.5 py-1 rounded bg-[#202534] hover:bg-[#2B3247] text-white border border-gray-700 text-xs font-bold flex items-center gap-1 transition active:scale-95"
                title="Aumentar tamanho do texto (+10%)"
              >
                <Plus className="w-3 h-3 text-blue-400" />
                <span>A+</span>
              </button>
            </div>
          </div>

          {/* Slider e Presets de Tamanho */}
          <div className="flex flex-col gap-1.5">
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.05"
              value={config.fontSize || 1}
              onChange={(e) => update({ fontSize: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-800 rounded-lg"
            />
            <div className="grid grid-cols-5 gap-1 font-mono text-[10px]">
              {[
                { label: '65% PP', val: 0.65 },
                { label: '85% P', val: 0.85 },
                { label: '100% Padrão', val: 1.0 },
                { label: '125% G', val: 1.25 },
                { label: '150% GG', val: 1.5 },
              ].map((p) => {
                const isActive = Math.abs((config.fontSize || 1) - p.val) < 0.04;
                return (
                  <button
                    key={p.label}
                    onClick={() => update({ fontSize: p.val })}
                    className={`py-1 rounded border text-center transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold border-blue-400'
                        : 'bg-[#181E2E] text-gray-400 border-gray-800 hover:bg-[#22293C] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alinhamento, Entrelinha e Caixa Alta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-800/80">
            {/* Alinhamento */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-mono uppercase">Alinhamento:</span>
              <div className="flex gap-1">
                {[
                  { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" />, title: 'Esquerda' },
                  { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" />, title: 'Centro' },
                  { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" />, title: 'Direita' },
                ].map((item) => {
                  const active = (config.textAlign || 'left') === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update({ textAlign: item.id as any })}
                      title={item.title}
                      className={`flex-1 py-1.5 flex justify-center items-center rounded border transition ${
                        active
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-[#181E2E] text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Espaçamento / Entrelinha */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-mono uppercase">Espaçamento:</span>
              <div className="flex gap-1">
                {[
                  { id: 0.95, label: 'Compacto' },
                  { id: 1.15, label: 'Normal' },
                  { id: 1.35, label: 'Amplo' },
                ].map((item) => {
                  const active = (config.lineHeightMultiplier || 1.15) === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update({ lineHeightMultiplier: item.id })}
                      className={`flex-1 py-1 text-[10px] font-mono rounded border transition ${
                        active
                          ? 'bg-blue-600 text-white border-blue-400 font-bold'
                          : 'bg-[#181E2E] text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caixa Alta / Natural */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-mono uppercase">Estilo do Texto:</span>
              <button
                onClick={() => {
                  const next = config.textTransform === 'none' ? 'uppercase' : 'none';
                  update({ textTransform: next });
                }}
                className={`w-full py-1.5 px-2 rounded border text-xs font-mono flex items-center justify-center gap-1.5 transition ${
                  config.textTransform === 'none'
                    ? 'bg-[#232838] border-cyan-600/60 text-cyan-200 font-bold'
                    : 'bg-[#181E2E] border-gray-800 text-gray-300 hover:text-white'
                }`}
                title="Alternar entre Tudo Maiúsculo e Texto Natural"
              >
                {config.textTransform === 'none' ? (
                  <>
                    <CaseSensitive className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Aa Natural</span>
                  </>
                ) : (
                  <>
                    <CaseUpper className="w-3.5 h-3.5 text-yellow-400" />
                    <span>AA MAIÚSCULAS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLE COMPLETO DA COR DO TEXTO */}
        <div className="p-3 bg-[#15171D] border border-gray-800 rounded-lg flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5 uppercase font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              Cor do Texto do Post (Principal):
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Invert black/white text contrast
                  const current = config.textColor || '#1A1A1A';
                  const nextColor = current.toLowerCase() === '#ffffff' || current.toLowerCase() === '#f4f4f0' ? '#1A1A1A' : '#FFFFFF';
                  update({ textColor: nextColor });
                }}
                className="text-[10px] font-mono font-bold bg-[#232838] hover:bg-[#2F374E] text-blue-300 px-2 py-0.5 rounded border border-blue-700/50 flex items-center gap-1"
                title="Inverter entre Claro e Escuro"
              >
                🌓 Inverter Contraste
              </button>
            </div>
          </div>

          {/* Paleta rápida de cores de texto */}
          <div className="flex gap-1.5 items-center flex-wrap">
            {TEXT_COLORS.map((tc) => {
              const isSelected = (config.textColor || '#1A1A1A').toLowerCase() === tc.color.toLowerCase();
              return (
                <button
                  key={tc.color}
                  onClick={() => update({ textColor: tc.color })}
                  title={`${tc.name} (${tc.color})`}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-400 scale-110 border-white shadow-md'
                      : 'border-gray-700 hover:border-gray-500 opacity-90 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: tc.bg }}
                >
                  {isSelected && (
                    <span className={`text-[10px] font-black ${tc.isDark ? 'text-white' : 'text-black'}`}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <div className="flex items-center gap-1.5 ml-1 bg-[#121316] border border-gray-700 rounded-md px-1.5 py-0.5">
              <input
                type="color"
                value={config.textColor || '#1A1A1A'}
                onChange={(e) => update({ textColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                title="Escolher qualquer cor para o texto"
              />
              <input
                type="text"
                value={config.textColor || '#1A1A1A'}
                onChange={(e) => update({ textColor: e.target.value })}
                className="w-16 bg-transparent text-[11px] font-mono text-gray-300 focus:outline-none uppercase"
                placeholder="#HEX"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Word Highlighter and Highlight Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Palavra/Frase a destacar:
            </label>
            <input
              type="text"
              value={config.highlightText}
              onChange={(e) => update({ highlightText: e.target.value })}
              placeholder="ex: crise existencial"
              className="w-full bg-[#121316] border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Cor do Destaque (Badge / Grifo):
            </label>
            <div className="flex gap-1.5 items-center flex-wrap">
              {HIGHLIGHT_COLORS.map((hc) => (
                <button
                  key={hc.color}
                  onClick={() => update({ highlightColor: hc.color })}
                  title={hc.name}
                  className={`w-6 h-6 rounded-md border transition ${
                    config.highlightColor === hc.color
                      ? 'ring-2 ring-white scale-110 border-black'
                      : 'border-gray-700 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: hc.color }}
                />
              ))}
              <input
                type="color"
                value={config.highlightColor || '#FFD700'}
                onChange={(e) => update({ highlightColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                title="Cor personalizada de destaque"
              />
            </div>
          </div>
        </div>

        {/* Sub-inputs based on Template */}
        {config.template === 'sistema-alerta' && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Título da Janela Windows:
              </label>
              <input
                type="text"
                value={config.systemTitle}
                onChange={(e) => update({ systemTitle: e.target.value })}
                className="w-full bg-[#121316] border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Texto do Botão:
              </label>
              <input
                type="text"
                value={config.windowButtonText}
                onChange={(e) => update({ windowButtonText: e.target.value })}
                className="w-full bg-[#121316] border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        )}

        {config.template === 'terminal-dark' && (
          <div className="pt-2 border-t border-gray-800">
            <label className="text-xs text-gray-400 block mb-1">
              Prompt do Terminal:
            </label>
            <input
              type="text"
              value={config.terminalPrompt}
              onChange={(e) => update({ terminalPrompt: e.target.value })}
              className="w-full bg-[#121316] border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        )}
      </div>

      {/* 3. CORES, SOMBRA E FUNDO BRUTALISTA */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border border-gray-800 flex flex-col gap-3.5">
        <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          <Palette className="w-4 h-4 text-pink-400" />
          Fundo & Sombra Brutalista
        </label>

        {/* Cor de Fundo do Post */}
        <div>
          <label className="text-xs text-gray-400 block mb-1.5 font-mono">
            Cor de Fundo do Post (Canvas / Card):
          </label>
          <div className="flex gap-1.5 items-center flex-wrap">
            {BACKGROUND_COLORS.map((bgc) => {
              const isSelected = (config.backgroundColor || '#F4F4F0').toLowerCase() === bgc.color.toLowerCase();
              return (
                <button
                  key={bgc.color}
                  onClick={() => update({ backgroundColor: bgc.color })}
                  className={`px-2 py-1 rounded border text-xs font-mono transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-blue-400 bg-[#2B313F] text-white ring-1 ring-blue-400'
                      : 'border-gray-800 bg-[#121316] text-gray-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-700 inline-block"
                    style={{ backgroundColor: bgc.color }}
                  />
                  <span>{bgc.name}</span>
                </button>
              );
            })}
            <input
              type="color"
              value={config.backgroundColor || '#F4F4F0'}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer bg-transparent border border-gray-700"
              title="Cor de fundo personalizada"
            />
          </div>
        </div>

        {/* Sombra Brutalista */}
        <div className="pt-2 border-t border-gray-800">
          <label className="text-xs text-gray-400 block mb-1.5 font-mono">
            Cor da Sombra Brutalista:
          </label>
          <div className="flex gap-2 flex-wrap items-center">
            {SHADOW_PALETTES.map((sp) => (
              <button
                key={sp.color}
                onClick={() => update({ shadowColor: sp.color })}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition ${
                  config.shadowColor === sp.color
                    ? 'border-white bg-[#2B313F] text-white ring-1 ring-white'
                    : 'border-gray-800 bg-[#121316] text-gray-400 hover:text-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40"
                  style={{ backgroundColor: sp.bg }}
                />
                <span>{sp.name}</span>
              </button>
            ))}
            <input
              type="color"
              value={config.shadowColor}
              onChange={(e) => update({ shadowColor: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer bg-transparent border border-gray-700"
              title="Cor de sombra personalizada"
            />
          </div>
        </div>
      </div>

      {/* 4. ADESIVOS E STICKERS RETRÔ */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border border-gray-800">
        <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
          <Smile className="w-4 h-4 text-green-400" />
          Carimbo / Sticker Retrô
        </label>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {STICKERS.map((stk) => {
            const isSelected = config.sticker === stk.id;
            return (
              <button
                key={stk.id}
                onClick={() => update({ sticker: stk.id })}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                  isSelected
                    ? 'bg-blue-900/40 border-blue-500 text-white ring-1 ring-blue-500'
                    : 'bg-[#121316] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {stk.id === 'none' ? (
                  <div className="w-7 h-7 flex items-center justify-center text-xs font-mono text-gray-500">
                    Ø
                  </div>
                ) : (
                  <Sticker type={stk.id} size={28} />
                )}
                <span className="text-[10px] truncate max-w-full text-center">
                  {stk.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4.5. BARRA DE CARREGAMENTO & PORCENTAGEM DINÂMICA (SUBINDO %) */}
      {(() => {
        const textHasPercent = hasPercentageInText(config.text);
        const extractedPct = extractPercentageFromText(config.text);
        const currentPct = config.customPercentage !== undefined ? config.customPercentage : (extractedPct ?? 99);
        const isBarActive = config.showPercentageBar || textHasPercent || config.template === 'barra-carregamento-99';

        return (
          <div className="bg-[#1A1D24] p-4 rounded-xl border-2 border-emerald-500/40 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-600/30 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <Percent className="w-4 h-4" />
                </span>
                <div>
                  <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                    Barra de Carregamento (% Subindo)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {textHasPercent ? `Detectado no texto: ${extractedPct}%` : 'Carregamento animado em tempo real'}
                  </span>
                </div>
              </div>

              {/* Botão de Reanimar / Recarregar a barra */}
              <button
                onClick={() => {
                  update({ animatePercentage: false });
                  setTimeout(() => {
                    update({ animatePercentage: true });
                  }, 50);
                }}
                className="text-[11px] font-mono bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700/60 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                title="Reiniciar animação da porcentagem subindo do 0%"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reanimar %</span>
              </button>
            </div>

            {/* Toggle para Forçar Exibição da Barra se não tiver % no texto */}
            <div className="flex items-center justify-between bg-[#121316] p-2.5 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Exibir Barra de Progresso no Card:</span>
              </div>
              <button
                onClick={() => update({ showPercentageBar: !isBarActive })}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition border ${
                  isBarActive
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                    : 'bg-[#242936] text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                {isBarActive ? 'ATIVADO ✓' : 'DESATIVADO'}
              </button>
            </div>

            {/* Slider de Porcentagem & Presets Rápidos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 font-bold">Valor da Porcentagem Final:</span>
                <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                  {currentPct}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={currentPct}
                onChange={(e) => update({ customPercentage: Number(e.target.value), showPercentageBar: true })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              {/* Botões Rápidos de % Típicos dos Memes */}
              <div className="grid grid-cols-6 gap-1 mt-1 font-mono text-[11px]">
                {[0, 1, 12, 50, 99, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => update({ customPercentage: pct, showPercentageBar: true })}
                    className={`py-1 rounded border text-center transition ${
                      currentPct === pct
                        ? 'bg-emerald-600 text-white font-bold border-emerald-400'
                        : 'bg-[#181E2E] text-gray-400 border-gray-700 hover:bg-[#22293C] hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Rótulo / Legenda Customizada da Barra */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                <span>Rótulo / Descrição da Barra:</span>
                <span className="text-[10px] text-gray-500 font-mono">Opcional</span>
              </label>
              <input
                type="text"
                value={config.percentageLabel || ''}
                onChange={(e) => update({ percentageLabel: e.target.value, showPercentageBar: true })}
                placeholder="ex: Processando maturidade emocional... ou Nível de Bateria Social:"
                className="w-full bg-[#121316] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>
        );
      })()}

      {/* 5. PRESETS DE MONITOR ANTIGO & EFEITOS CRT (ANOS 2000) */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border border-yellow-500/30 flex flex-col gap-3.5 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <label className="font-bold text-yellow-400 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Tv className="w-4 h-4 text-yellow-400" />
            Presets de Monitor Antigo (CRT Anos 2000)
          </label>
          <span className="text-[10px] font-mono font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-800 px-2 py-0.5 rounded">
            Tubo & Lente CRT
          </span>
        </div>

        {/* Grade de Presets Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CRT_PRESETS.map((preset) => {
            const isActive = (config.crtPreset || 'none') === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => update(preset.settings)}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between gap-1.5 transition group ${
                  isActive
                    ? 'bg-yellow-950/40 border-yellow-400 text-white ring-1 ring-yellow-400'
                    : 'bg-[#121316] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg">{preset.icon}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : 'bg-[#1D2230] text-gray-400 group-hover:text-yellow-300'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-xs block text-white leading-tight">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-gray-400 block leading-tight mt-0.5">
                    {preset.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Controles Manuais / Ajuste Fino dos Efeitos Analógicos */}
        <div className="pt-2 border-t border-gray-800/80 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5 uppercase font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            Ajuste Fino de Distorção & Filtros Analógicos:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* Curvatura de Lente CRT */}
            <button
              onClick={() => update({ crtCurvature: !config.crtCurvature })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.crtCurvature
                  ? 'bg-blue-950/60 border-blue-400 text-blue-200 font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
                Lente Curva CRT
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.crtCurvature ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>

            {/* Cintilação / Flicker 60Hz */}
            <button
              onClick={() => update({ crtFlicker: !config.crtFlicker })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.crtFlicker
                  ? 'bg-yellow-950/60 border-yellow-400 text-yellow-200 font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Cintilação (60Hz)
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.crtFlicker ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>

            {/* Desfoque / Phosphor Blur */}
            <button
              onClick={() => update({ crtBlur: !config.crtBlur })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.crtBlur
                  ? 'bg-purple-950/60 border-purple-400 text-purple-200 font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                Desfoque Fósforo
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.crtBlur ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>

            {/* Vinheta de Tubo */}
            <button
              onClick={() => update({ crtVignette: !config.crtVignette })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.crtVignette
                  ? 'bg-gray-800 border-gray-400 text-white font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full border border-gray-400 bg-black/60" />
                Vinheta do Tubo
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.crtVignette ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>

            {/* Aberração Cromática RGB */}
            <button
              onClick={() => update({ crtRgbShift: !config.crtRgbShift })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.crtRgbShift
                  ? 'bg-pink-950/60 border-pink-400 text-pink-200 font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-pink-400 font-mono">RGB</span>
                Aberração Shift
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.crtRgbShift ? 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>

            {/* Scanlines CRT Toggle */}
            <button
              onClick={() => update({ showScanlines: !config.showScanlines })}
              className={`px-2.5 py-2 rounded-lg border text-xs flex items-center justify-between transition ${
                config.showScanlines
                  ? 'bg-green-950/60 border-green-400 text-green-200 font-bold'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-green-400" />
                Scanlines (Linhas)
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  config.showScanlines ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-gray-700'
                }`}
              />
            </button>
          </div>

          {/* Slider de Intensidade de Scanlines se ativo */}
          {config.showScanlines && (
            <div className="bg-[#121316] p-2.5 rounded-lg border border-gray-800 flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="text-[11px] text-gray-300">Intensidade das Linhas de Varredura:</span>
                <span className="font-mono text-green-400 font-bold">
                  {config.crtScanlinesIntensity ?? 85}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={config.crtScanlinesIntensity ?? 85}
                onChange={(e) => update({ crtScanlinesIntensity: parseInt(e.target.value) })}
                className="w-full accent-green-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* 6. FORMATO & AJUSTES VISUAIS */}
      <div className="bg-[#1A1D24] p-4 rounded-xl border border-gray-800 flex flex-col gap-4">
        <label className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-purple-400" />
          Formato & Proporção
        </label>

        {/* Aspect ratio */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: '1:1' as AspectRatioType, label: '1:1 Quadrado', sub: 'Instagram / X', icon: <Square className="w-4 h-4" /> },
            { id: '4:5' as AspectRatioType, label: '4:5 Feed', sub: 'Instagram', icon: <RectangleVertical className="w-4 h-4" /> },
            { id: '9:16' as AspectRatioType, label: '9:16 Stories', sub: 'Status / Reels', icon: <Smartphone className="w-4 h-4" /> },
            { id: '16:9' as AspectRatioType, label: '16:9 Banner', sub: 'Twitter / Web', icon: <Tv className="w-4 h-4" /> },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => update({ aspectRatio: ratio.id })}
              className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                config.aspectRatio === ratio.id
                  ? 'bg-[#2A334B] border-blue-500 text-white ring-1 ring-blue-500'
                  : 'bg-[#121316] border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              {ratio.icon}
              <span className="font-bold text-xs">{ratio.label}</span>
              <span className="text-[9px] text-gray-500">{ratio.sub}</span>
            </button>
          ))}
        </div>

        {/* Font size & Border sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Tamanho do Texto:</span>
              <span className="font-mono text-white">{Math.round(config.fontSize * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={config.fontSize}
              onChange={(e) => update({ fontSize: parseFloat(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Espessura da Borda:</span>
              <span className="font-mono text-white">{config.borderWidth}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={config.borderWidth}
              onChange={(e) => update({ borderWidth: parseInt(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Texture Toggles & Handle Customizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-800">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Assinatura / Handle:
            </label>
            <input
              type="text"
              value={config.handle}
              onChange={(e) => update({ handle: e.target.value })}
              className="w-full bg-[#121316] border border-gray-700 rounded px-2.5 py-1.5 text-xs text-white font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showNoise}
                onChange={(e) => update({ showNoise: e.target.checked })}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
              <span>Ruído Analógico</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.showScanlines}
                onChange={(e) => update({ showScanlines: e.target.checked })}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
              <span>Scanlines CRT</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reset to Default */}
      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-300 underline flex items-center gap-1 transition"
        >
          <span>Restaurar Padrão Inicial</span>
        </button>
      </div>
    </div>
  );
};
