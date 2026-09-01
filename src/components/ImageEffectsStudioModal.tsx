import React, { useState, useRef } from 'react';
import { PostConfig, MediaDisplayMode, MediaFilterType, CrtPresetType, TemplateType } from '../types';
import {
  Upload,
  Tv,
  Film,
  Sparkles,
  X,
  Check,
  Zap,
  Eye,
  Sun,
  Activity,
  Sliders,
  RotateCcw,
  SlidersHorizontal,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Maximize2
} from 'lucide-react';
import { MediaAttachment } from './MediaAttachment';

interface ImageEffectsStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PostConfig;
  onApplyConfig: (partial: Partial<PostConfig>) => void;
  onShowToast: (msg: string) => void;
}

const EFFECT_MODES: {
  id: MediaDisplayMode;
  name: string;
  badge: string;
  icon: string;
  desc: string;
  category: 'effects' | 'mockups';
}[] = [
  // ============================================================
  // CATEGORIA 1: FILTROS PUROS NA IMAGEM (SEM MOCKUP / SEM TEXTO / SEM DATA E HORA)
  // ============================================================
  {
    id: 'filter-crt-tv',
    name: 'Print / Foto de TV de Tubo CRT',
    badge: 'FILTRO PURO',
    icon: '📺',
    desc: 'Sem carcaça e sem texto: Curvatura de tubo, scanlines 15kHz, grade de fósforo RGB e reflexo de vidro',
    category: 'effects',
  },
  {
    id: 'filter-vhs-tape',
    name: 'Fita VHS Analógica',
    badge: 'FILTRO PURO',
    icon: '📼',
    desc: 'Sem carcaça e sem texto: Textura de fita magnética, scanlines de vídeo composto e ruído analógico',
    category: 'effects',
  },
  {
    id: 'filter-cell-screen',
    name: 'Visor de Celular Antigo (LCD 2000s)',
    badge: 'FILTRO PURO',
    icon: '📱',
    desc: 'Sem carcaça e sem texto: Matriz de pontos LCD (Dot Matrix), subpixels quadriculados e backlight de cristal líquido',
    category: 'effects',
  },
  {
    id: 'filter-pc-monitor',
    name: 'Monitor CRT de Computador (PC)',
    badge: 'FILTRO PURO',
    icon: '🖥️',
    desc: 'Sem carcaça e sem texto: Scanlines finas VGA 60Hz, fósforo fino e reflexo suave de tela de computador',
    category: 'effects',
  },
  {
    id: 'filter-tv-dvd',
    name: 'TV Analógica 480i / DVD',
    badge: 'FILTRO PURO',
    icon: '💿',
    desc: 'Sem carcaça e sem texto: Scanlines suaves 480i, saturação de cor viva e brilho de tubo',
    category: 'effects',
  },
  {
    id: 'filter-tv-static',
    name: 'TV com Estática / Antena',
    badge: 'FILTRO PURO',
    icon: '⚡',
    desc: 'Sem carcaça e sem texto: Interferência analógica de sinal de TV aberta (VHF/UHF) e linhas de varredura',
    category: 'effects',
  },
  {
    id: 'filter-film-photo',
    name: 'Foto Analógica (Filme 35mm)',
    badge: 'FILTRO PURO',
    icon: '📷',
    desc: 'Sem carcaça e sem texto: Granulação orgânica de filme, halation quente e tons retrô',
    category: 'effects',
  },
  {
    id: 'filter-security-screen',
    name: 'Monitor CFTV (P&B Analógico)',
    badge: 'FILTRO PURO',
    icon: '🚨',
    desc: 'Sem carcaça e sem texto: Preto e branco com alto contraste, scanlines de vigilância e vinheta',
    category: 'effects',
  },
  {
    id: 'filter-lcd-game',
    name: 'Visor LCD 8-Bit (Verde-Oliva)',
    badge: 'FILTRO PURO',
    icon: '🎮',
    desc: 'Sem carcaça e sem texto: Grade quadriculada de pixels monocromáticos estilo portátil retrô',
    category: 'effects',
  },
  {
    id: 'tweet-media',
    name: 'Foto Normal (Sem Filtro)',
    badge: 'ORIGINAL',
    icon: '⬛',
    desc: 'Foto limpa original sem filtros sobrepostos',
    category: 'effects',
  },
  {
    id: 'background',
    name: 'Fundo do Post',
    badge: 'WALLPAPER',
    icon: '🌌',
    desc: 'Imagem aplicada em tela cheia no fundo do post',
    category: 'effects',
  },

  // ============================================================
  // CATEGORIA 2: MOCKUPS FÍSICOS (OPCIONAIS COM CARCAÇA DE PLÁSTICO)
  // ============================================================
  {
    id: 'tv-vhs',
    name: 'TV VHS Quasar (Carcaça)',
    badge: 'COM MOCKUP',
    icon: '📺',
    desc: 'Carcaça de TV bege com adesivos e botões físicos VCR',
    category: 'mockups',
  },
  {
    id: 'tv-dvd',
    name: 'TV DVD Memorex (Carcaça)',
    badge: 'COM MOCKUP',
    icon: '📺',
    desc: 'Carcaça prata metálica com gaveta de DVD e cabos RCA',
    category: 'mockups',
  },
  {
    id: 'monitor-bege',
    name: 'Monitor Tubo Win98',
    badge: 'COM MOCKUP',
    icon: '🖥️',
    desc: 'Carcaça de monitor CRT bege com moldura de mesa',
    category: 'mockups',
  },
  {
    id: 'celular-flip',
    name: 'Celular Flip V3',
    badge: 'COM MOCKUP',
    icon: '📱',
    desc: 'Carcaça de celular tijolão com teclado numérico',
    category: 'mockups',
  },
  {
    id: 'polaroid',
    name: 'Foto Polaroid',
    badge: 'COM MOCKUP',
    icon: '📷',
    desc: 'Moldura fotográfica revelada com fita adesiva',
    category: 'mockups',
  },
  {
    id: 'win-viewer',
    name: 'Janela Win98 Foto',
    badge: 'COM MOCKUP',
    icon: '🪟',
    desc: 'Janela clássica do Windows 98 com barra de título azul',
    category: 'mockups',
  },
  {
    id: 'gameboy-retro',
    name: 'Portátil Gameboy',
    badge: 'COM MOCKUP',
    icon: '🎮',
    desc: 'Console portátil clássico com d-pad e botões A/B',
    category: 'mockups',
  },
  {
    id: 'mp3-player',
    name: 'iPod Clássico',
    badge: 'COM MOCKUP',
    icon: '🎵',
    desc: 'Carcaça de tocador MP3 com clickwheel',
    category: 'mockups',
  },
];

const SAMPLE_GALLERY = [
  {
    title: 'Gato Pensativo',
    tag: 'Existencial',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    mode: 'filter-crt-tv' as MediaDisplayMode,
  },
  {
    title: 'Quarto Iluminado 03 AM',
    tag: 'Madrugada',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    mode: 'filter-vhs-tape' as MediaDisplayMode,
  },
  {
    title: 'Monitor Cyber Retrô',
    tag: 'Anos 2000',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    mode: 'filter-cell-screen' as MediaDisplayMode,
  },
  {
    title: 'Cidade Chuvosa Nostálgica',
    tag: 'Melancolia',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    mode: 'filter-pc-monitor' as MediaDisplayMode,
  },
];

export const ImageEffectsStudioModal: React.FC<ImageEffectsStudioModalProps> = ({
  isOpen,
  onClose,
  config,
  onApplyConfig,
  onShowToast,
}) => {
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string>(
    config.mediaUrl || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80'
  );
  const [displayMode, setDisplayMode] = useState<MediaDisplayMode>(
    config.mediaDisplayMode === 'none' || !config.mediaDisplayMode ? 'effect-vhs' : config.mediaDisplayMode
  );
  const [filter, setFilter] = useState<MediaFilterType>(config.mediaFilter || 'none');
  const [caption, setCaption] = useState<string>(config.mediaCaption || 'PLAY ▶ SP 0:14:28');

  // CRT & Post Effects
  const [showScanlines, setShowScanlines] = useState<boolean>(config.showScanlines ?? true);
  const [scanlinesIntensity, setScanlinesIntensity] = useState<number>(config.crtScanlinesIntensity ?? 85);
  const [crtCurvature, setCrtCurvature] = useState<boolean>(config.crtCurvature ?? true);
  const [crtFlicker, setCrtFlicker] = useState<boolean>(config.crtFlicker ?? false);
  const [crtBlur, setCrtBlur] = useState<boolean>(config.crtBlur ?? false);
  const [crtVignette, setCrtVignette] = useState<boolean>(config.crtVignette ?? true);
  const [crtRgbShift, setCrtRgbShift] = useState<boolean>(config.crtRgbShift ?? true);
  const [showNoise, setShowNoise] = useState<boolean>(config.showNoise ?? true);

  const [activeCategory, setActiveCategory] = useState<'all' | 'effects' | 'mockups'>('effects');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      onShowToast('⚠️ Por favor selecione uma imagem ou vídeo válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        setCurrentMediaUrl(res);
        onShowToast('📸 Imagem carregada com sucesso! Escolha os efeitos abaixo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyToPost = () => {
    onApplyConfig({
      mediaUrl: currentMediaUrl,
      mediaType: currentMediaUrl.startsWith('data:video') || currentMediaUrl.endsWith('.mp4') ? 'video' : 'image',
      mediaDisplayMode: displayMode,
      mediaFilter: filter,
      mediaCaption: caption,
      showScanlines,
      crtScanlinesIntensity: scanlinesIntensity,
      crtCurvature,
      crtFlicker,
      crtBlur,
      crtVignette,
      crtRgbShift,
      showNoise,
    });
    onShowToast(`📺 Efeito "${displayMode.toUpperCase()}" aplicado na imagem do post!`);
    onClose();
  };

  const filteredModes = EFFECT_MODES.filter(
    (m) => activeCategory === 'all' || m.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#11141D] border-2 border-yellow-500/50 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* MODAL HEADER */}
        <div className="bg-[#181D2A] px-5 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/40">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-impact text-xl text-white uppercase tracking-wider">
                  Colocar Imagem & Efeitos de TV / VHS / DVD
                </h2>
                <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">
                  ESTÚDIO RETRÔ 2000
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Suba sua foto e aplique efeitos analógicos, molduras de tubo Quasar/Memorex, scanlines e distorção CRT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (TWO COLUMNS: PREVIEW + CONTROLS) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: LIVE PREVIEW OF THE IMAGE WITH EFFECTS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-300 font-bold uppercase flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-yellow-400" />
                Prévia da Imagem com Efeito:
              </span>
              <span className="text-[10px] font-mono text-yellow-300 bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-800">
                {displayMode.toUpperCase()}
              </span>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="w-full bg-[#08090D] border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[340px] max-h-[460px] overflow-hidden relative shadow-inner">
              
              {/* Scanlines Overlay if enabled */}
              {showScanlines && (
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1.5px, transparent 2px, transparent 4px)',
                    opacity: (scanlinesIntensity / 100) * 0.5,
                  }}
                />
              )}

              {/* Curvature & Vignette Overlay */}
              {crtVignette && (
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
                  }}
                />
              )}

              {/* Media Attachment Component Rendered Live */}
              <div className="w-full transform scale-90 sm:scale-95 origin-center transition-all">
                <MediaAttachment
                  mediaUrl={currentMediaUrl}
                  displayMode={displayMode}
                  filter={filter}
                  caption={caption}
                  mediaType="image"
                />
              </div>
            </div>

            {/* QUICK UPLOAD BUTTON */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileUpload(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition flex items-center justify-center gap-3 ${
                isDragging
                  ? 'border-yellow-400 bg-yellow-950/40'
                  : 'border-gray-700 hover:border-yellow-500 bg-[#151926] hover:bg-[#1C2234]'
              }`}
            >
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">
                  Trocar Foto / Imagem do Aparelho
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  Clique ou arraste qualquer imagem (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: EFFECT PICKERS & CONTROLS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* 1. SELETOR DE MOLDURA / DISPOSITIVO ANALÓGICO */}
            <div className="bg-[#161B28] p-4 rounded-xl border border-yellow-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
                  <Tv className="w-4 h-4 text-yellow-400" />
                  1. Escolha o Efeito Analógico (TV VHS, TV DVD, Tubo CRT):
                </label>
                
                {/* Category filters */}
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  {[
                    { id: 'effects' as const, label: '⭐ Só Efeitos' },
                    { id: 'mockups' as const, label: '📺 Aparelhos' },
                    { id: 'all' as const, label: 'Todos' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-md transition font-bold ${
                        activeCategory === cat.id
                          ? 'bg-yellow-400 text-black shadow'
                          : 'bg-[#0E121E] text-gray-400 hover:text-white border border-gray-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of effect modes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredModes.map((mode) => {
                  const isSelected = displayMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setDisplayMode(mode.id);
                        if (mode.id === 'filter-crt-tv') {
                          setShowScanlines(true);
                          setCrtCurvature(true);
                          setCrtRgbShift(true);
                        } else if (mode.id === 'filter-vhs-tape') {
                          setShowScanlines(true);
                          setCrtRgbShift(true);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition group ${
                        isSelected
                          ? 'bg-yellow-950/50 border-yellow-400 ring-2 ring-yellow-400/50 shadow-lg'
                          : 'bg-[#101420] border-gray-800 hover:border-gray-600 hover:bg-[#181F30]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{mode.icon}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isSelected
                              ? 'bg-yellow-400 text-black'
                              : 'bg-[#1C2234] text-gray-400 group-hover:text-yellow-300'
                          }`}
                        >
                          {mode.badge}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {mode.name}
                        </p>
                        <p className="text-[9px] text-gray-400 leading-tight mt-0.5 line-clamp-2">
                          {mode.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. EFEITOS CRT & ANALÓGICOS DIRETOS NA IMAGEM */}
            <div className="bg-[#161B28] p-4 rounded-xl border border-gray-800 flex flex-col gap-3">
              <label className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                2. Ajuste Fino dos Efeitos Analógicos na Imagem:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Lente Curva CRT */}
                <button
                  onClick={() => setCrtCurvature(!crtCurvature)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    crtCurvature
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-cyan-400" />
                    Lente Curva CRT
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crtCurvature ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>

                {/* Scanlines CRT */}
                <button
                  onClick={() => setShowScanlines(!showScanlines)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    showScanlines
                      ? 'bg-green-950/60 border-green-400 text-green-200 font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-green-400" />
                    Scanlines (Linhas)
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      showScanlines ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>

                {/* Aberração Cromática RGB Shift */}
                <button
                  onClick={() => setCrtRgbShift(!crtRgbShift)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    crtRgbShift
                      ? 'bg-pink-950/60 border-pink-400 text-pink-200 font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-pink-400 font-mono">RGB</span>
                    Aberração Shift
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crtRgbShift ? 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>

                {/* Cintilação 60Hz */}
                <button
                  onClick={() => setCrtFlicker(!crtFlicker)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    crtFlicker
                      ? 'bg-yellow-950/60 border-yellow-400 text-yellow-200 font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    Cintilação 60Hz
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crtFlicker ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>

                {/* Desfoque de Fósforo */}
                <button
                  onClick={() => setCrtBlur(!crtBlur)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    crtBlur
                      ? 'bg-purple-950/60 border-purple-400 text-purple-200 font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    Desfoque Fósforo
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crtBlur ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>

                {/* Vinheta do Tubo */}
                <button
                  onClick={() => setCrtVignette(!crtVignette)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between transition ${
                    crtVignette
                      ? 'bg-gray-800 border-gray-400 text-white font-bold'
                      : 'bg-[#101420] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-gray-400 bg-black" />
                    Vinheta Tubo
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      crtVignette ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-gray-700'
                    }`}
                  />
                </button>
              </div>

              {/* Slider de Intensidade de Scanlines se ativo */}
              {showScanlines && (
                <div className="bg-[#101420] p-2.5 rounded-lg border border-gray-800 flex flex-col gap-1 mt-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="text-[11px] text-gray-300">Intensidade das Linhas de Varredura:</span>
                    <span className="font-mono text-green-400 font-bold">{scanlinesIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={scanlinesIntensity}
                    onChange={(e) => setScanlinesIntensity(parseInt(e.target.value))}
                    className="w-full accent-green-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* 3. FILTRO DE COR RETRÔ & LEGENDA */}
            <div className="bg-[#161B28] p-4 rounded-xl border border-gray-800 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  3. Filtro de Cor da Foto:
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-mono">
                {[
                  { id: 'none' as MediaFilterType, label: 'Normal' },
                  { id: 'vintage-2000' as MediaFilterType, label: 'Cyber 2000' },
                  { id: 'pixelate' as MediaFilterType, label: 'Pixelado' },
                  { id: 'grayscale' as MediaFilterType, label: 'Preto & Branco' },
                  { id: 'contrast-high' as MediaFilterType, label: 'Alto Contraste' },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setFilter(flt.id)}
                    className={`p-2 rounded-lg text-center transition font-bold border ${
                      filter === flt.id
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                        : 'bg-[#101420] text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Legenda Customizada do Aparelho */}
              <div className="pt-2 border-t border-gray-800">
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Texto da Faixa / OSD do Aparelho:
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="ex: GRAVAÇÃO 2000 • CH 03 • PLAY ▶"
                  className="w-full bg-[#101420] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>
            </div>

            {/* 4. EXEMPLOS PRONTOS DE IMAGENS NOSTÁLGICAS */}
            <div className="bg-[#161B28] p-4 rounded-xl border border-gray-800 flex flex-col gap-2.5">
              <span className="text-[11px] font-bold text-gray-300 font-mono uppercase">
                Ou escolha uma foto clássica de demonstração:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_GALLERY.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentMediaUrl(item.url);
                      setDisplayMode(item.mode);
                      onShowToast(`📸 Imagem "${item.title}" selecionada!`);
                    }}
                    className="p-1.5 rounded-lg bg-[#101420] hover:bg-[#1B2234] border border-gray-800 hover:border-yellow-400/60 text-left transition flex flex-col gap-1 group"
                  >
                    <div className="w-full aspect-video rounded overflow-hidden bg-black">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-white truncate leading-tight">
                      {item.title}
                    </p>
                    <span className="text-[8px] font-mono text-yellow-300">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#181D2A] px-5 py-3.5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>Moldura atual:</span>
            <span className="text-yellow-400 font-bold">{displayMode.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-mono font-bold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyToPost}
              className="flex-1 sm:flex-initial px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition active:scale-95 border border-yellow-300"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Aplicar Efeitos no Post</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
