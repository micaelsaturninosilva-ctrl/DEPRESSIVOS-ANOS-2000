import React, { useState, useRef, useEffect } from 'react';
import { PostConfig, TemplateType, PresetQuote } from './types';
import { PRESET_QUOTES } from './data/presets';
import { classifyAndRouteVisualTemplate } from './utils/visualRouter';
import { PostCanvas } from './components/PostCanvas';
import { EditorControls } from './components/EditorControls';
import { PresetsModal } from './components/PresetsModal';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { BatchGalleryModal } from './components/BatchGalleryModal';
import { MediaAnalyzerModal } from './components/MediaAnalyzerModal';
import { StrategyHubModal } from './components/StrategyHubModal';
import { VideoExportModal } from './components/VideoExportModal';
import { RlhfCuratorModal } from './components/RlhfCuratorModal';
import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Sparkles,
  RefreshCw,
  Layers,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Share2,
  Flame,
  Terminal,
  Monitor,
  Square,
  AlertTriangle,
  Image as ImageIcon,
  Video,
  Film,
  BrainCircuit
} from 'lucide-react';

const DEFAULT_CONFIG: PostConfig = {
  template: 'tweet-parede',
  text: 'Mandar meme é minha linguagem do amor.\n\nSe eu não te mando nada, eu não lembro que você existe.',
  highlightText: 'linguagem do amor',
  highlightColor: '#FFD700',
  handle: '@DEPRESSIVOS2000',
  systemTitle: 'Erro do Sistema - crise_dos_30.exe',
  terminalPrompt: '> terminal_pensamentos_intrusivos',
  windowButtonText: 'OK',
  shadowColor: '#0000FF',
  backgroundColor: '#F4F4F0',
  textColor: '#1A1A1A',
  borderWidth: 16,
  fontSize: 1.0,
  textAlign: 'left',
  lineHeightMultiplier: 1.15,
  textTransform: 'uppercase',
  showNoise: true,
  showScanlines: false,
  sticker: 'broken-heart',
  aspectRatio: '1:1',
  crtPreset: 'none',
  crtCurvature: false,
  crtFlicker: false,
  crtBlur: false,
  crtVignette: false,
  crtRgbShift: false,
  crtScanlinesIntensity: 85,
};

export default function App() {
  const [config, setConfig] = useState<PostConfig>(DEFAULT_CONFIG);
  const [previewScale, setPreviewScale] = useState<number>(0.48);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState<boolean>(false);
  const [isVideoExportOpen, setIsVideoExportOpen] = useState<boolean>(false);
  const [isRlhfCuratorOpen, setIsRlhfCuratorOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Responsive scale calculation based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPreviewScale(0.31);
      } else if (window.innerWidth < 1024) {
        setPreviewScale(0.40);
      } else if (window.innerWidth < 1440) {
        setPreviewScale(0.48);
      } else {
        setPreviewScale(0.55);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Quick switch to one of the 3 iconic prompt originals
  const handleQuickTemplate = (type: TemplateType) => {
    if (type === 'tweet-parede') {
      const match = PRESET_QUOTES.find((p) => p.id === 'original-1');
      if (match) applyPreset(match);
      else setConfig((c) => ({ ...c, template: 'tweet-parede', shadowColor: '#0000FF', backgroundColor: '#F4F4F0' }));
    } else if (type === 'sistema-alerta') {
      const match = PRESET_QUOTES.find((p) => p.id === 'original-2');
      if (match) applyPreset(match);
      else setConfig((c) => ({ ...c, template: 'sistema-alerta', shadowColor: '#1A1A1A', backgroundColor: '#c0c0c0' }));
    } else if (type === 'terminal-dark') {
      const match = PRESET_QUOTES.find((p) => p.id === 'original-3');
      if (match) applyPreset(match);
      else setConfig((c) => ({ ...c, template: 'terminal-dark', shadowColor: '#FF3333', backgroundColor: '#1A1A1A' }));
    } else {
      setConfig((c) => ({ ...c, template: type }));
    }
  };

  const applyPreset = (preset: PresetQuote) => {
    setConfig((prev) => ({
      ...prev,
      template: preset.template,
      text: preset.text,
      highlightText: preset.highlightText,
      highlightColor: preset.highlightColor,
      systemTitle: preset.systemTitle || prev.systemTitle,
      terminalPrompt: preset.terminalPrompt || prev.terminalPrompt,
      windowButtonText: preset.windowButtonText || prev.windowButtonText,
      shadowColor: preset.shadowColor || prev.shadowColor,
      sticker: preset.sticker || prev.sticker,
      backgroundColor:
        preset.template === 'tweet-parede'
          ? '#F4F4F0'
          : preset.template === 'sistema-alerta'
          ? '#c0c0c0'
          : preset.template === 'terminal-dark'
          ? '#1A1A1A'
          : preset.template === 'msn-nostalgia'
          ? '#E8F1FC'
          : preset.template === 'nota-fiscal'
          ? '#FFFEEA'
          : '#0C111C',
    }));
  };

  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_QUOTES.length);
    const selected = PRESET_QUOTES[randomIndex];
    applyPreset(selected);
    showToast(`🎲 Sorteada: "${selected.category}"`);
  };

  // Export as 1080x1080 High-Res PNG
  const handleDownloadImage = async () => {
    const node = canvasRef.current;
    if (!node) return;

    setIsExporting(true);
    try {
      // Temporarily render at scale 1 for 1080p full resolution export
      const originalTransform = node.style.transform;
      node.style.transform = 'scale(1)';

      // Generate full HD PNG data
      const dataUrl = await toPng(node, {
        quality: 1.0,
        pixelRatio: 2, // 2x ultra crisp render
        cacheBust: true,
      });

      // Restore original preview scale
      node.style.transform = originalTransform;

      // Create download trigger
      const link = document.createElement('a');
      const filename = `depressivos2000-${config.template}-${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0000FF', '#FF3333', '#FFD700', '#00FF66'],
      });

      showToast('✨ Imagem em alta resolução (1080x1080) baixada com sucesso!');
    } catch (err) {
      console.error('Erro ao baixar imagem:', err);
      showToast('❌ Erro ao exportar imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image directly to Clipboard
  const handleCopyClipboard = async () => {
    const node = canvasRef.current;
    if (!node) return;

    setIsExporting(true);
    try {
      const originalTransform = node.style.transform;
      node.style.transform = 'scale(1)';

      const blob = await toBlob(node, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      node.style.transform = originalTransform;

      if (blob && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob }),
        ]);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FFD700', '#0000FF'],
        });

        showToast('📋 Imagem copiada para a área de transferência!');
      } else {
        throw new Error('ClipboardItem não suportado neste navegador.');
      }
    } catch (err) {
      console.warn('Fallback: baixando imagem em vez de copiar para clipboard:', err);
      await handleDownloadImage();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1116] text-[#E0E0E0] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* TOP HEADER & BRANDING */}
      {/* ============================================================ */}
      <header className="bg-[#141720] border-b border-gray-800 sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700] border-2 border-black px-2.5 py-1 text-black font-impact text-lg font-black tracking-tight shadow-[3px_3px_0px_#0000FF]">
              Y2K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-impact text-xl sm:text-2xl text-white uppercase tracking-tight">
                  GERADOR DE POSTS
                </h1>
                <span className="font-mono text-xs text-[#FFD700] font-bold bg-[#1E222D] px-2 py-0.5 rounded border border-gray-700">
                  @DEPRESSIVOS2000
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono hidden sm:block">
                Crie posts e memes nostálgicos dos anos 2000 em alta resolução (1080x1080)
              </p>
            </div>
          </div>

          {/* Top Quick Actions (Export & Presets) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsRlhfCuratorOpen(true)}
              id="header-btn-rlhf-curator"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-xs text-white font-extrabold rounded-lg shadow-lg shadow-emerald-600/20 border border-emerald-300 transition"
              title="Curadoria com Swipe e Aprendizado Contínuo (RLHF)"
            >
              <BrainCircuit className="w-4 h-4 text-[#00FF66] animate-pulse" />
              <span>Curadoria RLHF (Swipe)</span>
            </button>

            <button
              onClick={() => setIsStrategyOpen(true)}
              id="header-btn-strategy"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 active:scale-95 text-xs text-black font-extrabold rounded-lg shadow-lg shadow-yellow-500/20 border border-yellow-300 transition"
              title="Central @DEPRESSIVOS2000 (20 Memes, 10 Reels, Análise & Quadros)"
            >
              <Flame className="w-4 h-4 text-black" />
              <span>Central Estratégica & 20 Memes</span>
            </button>

            <button
              onClick={() => setIsGalleryOpen(true)}
              id="header-btn-gallery"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#1F2432] hover:bg-[#2A3144] active:scale-95 text-xs text-gray-200 font-semibold rounded-lg border border-gray-700 transition"
              title="Comparar todos os modelos lado a lado"
            >
              <Grid className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Ver Galeria</span>
            </button>

            <button
              onClick={handleCopyClipboard}
              disabled={isExporting}
              id="header-btn-copy"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#262C3D] hover:bg-[#323A50] active:scale-95 text-xs text-white font-semibold rounded-lg border border-gray-600 transition shadow-sm disabled:opacity-50"
              title="Copiar imagem pronta para colar no WhatsApp ou redes"
            >
              <Copy className="w-4 h-4 text-yellow-400" />
              <span>Copiar</span>
            </button>

            <button
              onClick={() => setIsVideoExportOpen(true)}
              id="header-btn-download-video"
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-purple-500 active:scale-95 text-xs text-white font-black rounded-lg shadow-lg shadow-red-900/30 border border-pink-400/40 transition"
              title="Exportar post em vídeo MP4 (1080p) com áudio e animação para Reels/TikTok"
            >
              <Film className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Baixar MP4 (Vídeo)</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              id="header-btn-download"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-xs text-white font-bold rounded-lg shadow-lg shadow-blue-900/30 transition disabled:opacity-50"
              title="Baixar post em PNG 1080x1080 para publicar"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exportando...' : 'Baixar PNG (1080p)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Style Switcher Bar */}
        <div className="max-w-7xl mx-auto pt-3 mt-2 border-t border-gray-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            Modelos Originais:
          </span>

          <button
            onClick={() => handleQuickTemplate('tweet-parede')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'tweet-parede'
                ? 'bg-[#F4F4F0] text-[#1A1A1A] border-black shadow-[2px_2px_0px_#0000FF]'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [1] Tweet de Parede (Dia 1)
          </button>

          <button
            onClick={() => handleQuickTemplate('sistema-alerta')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'sistema-alerta'
                ? 'bg-[#c0c0c0] text-[#1A1A1A] border-white shadow-[2px_2px_0px_#1A1A1A]'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [2] Alerta Windows 98 (Dia 4)
          </button>

          <button
            onClick={() => handleQuickTemplate('terminal-dark')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'terminal-dark'
                ? 'bg-[#1A1A1A] text-[#F4F4F0] border-red-500 shadow-[2px_2px_0px_#FF3333]'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [3] Dark Mode 3h (Dia 9)
          </button>

          <button
            onClick={() => handleQuickTemplate('msn-nostalgia')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'msn-nostalgia'
                ? 'bg-[#2B60DE] text-white border-blue-300'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [4] MSN 2005
          </button>

          <button
            onClick={() => handleQuickTemplate('nota-fiscal')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'nota-fiscal'
                ? 'bg-[#FFFEEA] text-black border-black'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [5] Cupom Fiscal
          </button>

          <button
            onClick={() => handleQuickTemplate('winamp-retro')}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition whitespace-nowrap border ${
              config.template === 'winamp-retro'
                ? 'bg-black text-[#00FF66] border-[#00FF66]'
                : 'bg-[#1A1D26] text-gray-300 border-gray-700 hover:bg-[#252A38]'
            }`}
          >
            [6] Winamp MP3
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN WORKSPACE (PREVIEW + EDITOR) */}
      {/* ============================================================ */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: POST PREVIEW STAGE (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col items-center sticky top-24">
          {/* Preview Canvas Stage Toolbar */}
          <div className="w-full bg-[#151821] border border-gray-800 rounded-t-2xl px-4 py-2.5 flex items-center justify-between shadow-sm flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono text-gray-300 font-bold uppercase tracking-wider">
                Pré-visualização 1080p
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                ({config.aspectRatio})
              </span>
              {config.crtPreset && config.crtPreset !== 'none' && (
                <span className="text-[10px] font-mono font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-700/60 px-2 py-0.5 rounded flex items-center gap-1">
                  <span>📺</span>
                  <span>{config.crtPreset.toUpperCase()}</span>
                </span>
              )}
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1.5 bg-[#0F1116] px-2 py-1 rounded-lg border border-gray-800">
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.25, s - 0.05))}
                className="text-gray-400 hover:text-white p-1 transition"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-gray-300 px-1">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(0.8, s + 0.05))}
                className="text-gray-400 hover:text-white p-1 transition"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Stage Container */}
          <div
            ref={containerRef}
            className="w-full bg-[#090A0E] bg-dot-pattern border-x border-b border-gray-800 rounded-b-2xl p-6 sm:p-10 flex items-center justify-center min-h-[480px] sm:min-h-[580px] shadow-2xl overflow-hidden relative"
          >
            {/* The Post Canvas Engine */}
            <PostCanvas
              config={config}
              canvasRef={canvasRef}
              scale={previewScale}
            />
          </div>

          {/* Quick Share / Export Tips */}
          <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 font-mono px-2">
            <span>Dimensão do print: 1080 × 1080 px (Ultra HD)</span>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsVideoExportOpen(true)}
                className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 transition underline decoration-dotted"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Exportar em Vídeo MP4 (com áudio)</span>
              </button>
              <span className="text-blue-400 font-bold">#Depressivos2000</span>
            </div>
          </div>
        </div>

        {/* RIGHT: CONTROLS & INSPECTOR PANEL (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <EditorControls
            config={config}
            onChange={setConfig}
            onOpenPresets={() => setIsPresetsOpen(true)}
            onOpenAiGenerator={() => setIsAiModalOpen(true)}
            onOpenMediaAnalyzer={() => setIsMediaModalOpen(true)}
            onOpenVideoExport={() => setIsVideoExportOpen(true)}
            onOpenRlhfCurator={() => setIsRlhfCuratorOpen(true)}
            onRandomQuote={handleRandomQuote}
            onReset={() => setConfig(DEFAULT_CONFIG)}
          />
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODALS */}
      {/* ============================================================ */}
      <RlhfCuratorModal
        isOpen={isRlhfCuratorOpen}
        onClose={() => setIsRlhfCuratorOpen(false)}
        onApplyPost={(post) => {
          setConfig((prev) => ({
            ...prev,
            text: post.text,
            highlightText: post.highlight,
            template: post.template || prev.template,
            systemTitle: post.systemTitle || prev.systemTitle,
            windowButtonText: post.windowButtonText || prev.windowButtonText,
            shadowColor: post.shadowColor || prev.shadowColor,
            sticker: (post.sticker as any) || prev.sticker,
          }));
        }}
        onShowToast={showToast}
      />

      <VideoExportModal
        isOpen={isVideoExportOpen}
        onClose={() => setIsVideoExportOpen(false)}
        config={config}
        canvasRef={canvasRef}
        onShowToast={showToast}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={applyPreset}
        currentConfig={config}
      />

      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyGenerated={({ text, highlightText, systemTitle }) => {
          const routed = classifyAndRouteVisualTemplate(text);
          setConfig((prev) => ({
            ...prev,
            text,
            highlightText: highlightText || routed.highlightColor,
            template: routed.template,
            backgroundColor: routed.backgroundColor,
            textColor: routed.textColor,
            highlightColor: routed.highlightColor,
            shadowColor: routed.shadowColor,
            systemTitle: systemTitle || routed.systemTitle,
            windowButtonText: routed.windowButtonText,
            sticker: routed.sticker,
            showScanlines: routed.showScanlines,
          }));
          showToast(`🪄 Aplicado no modelo oficial: ${routed.templateInfo.name}`);
        }}
      />

      <MediaAnalyzerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        currentConfig={config}
        onApplyMeme={(memeData) => {
          setConfig((prev) => ({
            ...prev,
            text: memeData.text,
            highlightText: memeData.highlightText,
            template: memeData.template || prev.template,
            systemTitle: memeData.systemTitle || prev.systemTitle,
            windowButtonText: memeData.windowButtonText || prev.windowButtonText,
            shadowColor: memeData.shadowColor || prev.shadowColor,
            sticker: memeData.sticker || prev.sticker,
            mediaUrl: memeData.mediaUrl,
            mediaType: memeData.mediaType,
            mediaDisplayMode: memeData.mediaDisplayMode,
            mediaCaption: memeData.mediaCaption,
            detectedTopic: memeData.detectedTopic,
          }));
          showToast('📸 Foto/Vídeo e meme contextual aplicados com sucesso!');
        }}
      />

      <BatchGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        config={config}
        onSelectTemplate={(template) => {
          setConfig((prev) => ({
            ...prev,
            template,
            shadowColor:
              template === 'terminal-dark'
                ? '#FF3333'
                : template === 'tweet-parede'
                ? '#0000FF'
                : template === 'winamp-retro'
                ? '#00FF66'
                : template === 'msn-nostalgia'
                ? '#000080'
                : '#1A1A1A',
          }));
          showToast(`Estilo alterado para: ${template}`);
        }}
      />

      <StrategyHubModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        currentPostText={config.text}
        onApplyPost={(meme) => {
          const routed = classifyAndRouteVisualTemplate(meme.text);
          setConfig((prev) => ({
            ...prev,
            text: meme.text,
            highlightText: meme.highlightText,
            template: meme.template || routed.template,
            backgroundColor: routed.backgroundColor,
            textColor: routed.textColor,
            highlightColor: routed.highlightColor,
            shadowColor: meme.shadowColor || routed.shadowColor,
            systemTitle: meme.systemTitle || routed.systemTitle,
            windowButtonText: routed.windowButtonText,
            sticker: meme.sticker || routed.sticker,
            showScanlines: routed.showScanlines,
          }));
          showToast(`⚡ Meme aplicado no modelo: ${routed.templateInfo.name}`);
        }}
      />

      {/* ============================================================ */}
      {/* FLOATING TOAST NOTIFICATION */}
      {/* ============================================================ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2432] text-white border-2 border-blue-500 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
