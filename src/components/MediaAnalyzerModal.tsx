import React, { useState, useRef } from 'react';
import { PostConfig, MediaDisplayMode, TemplateType, StickerType } from '../types';
import {
  Upload,
  Video,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  X,
  Check,
  RefreshCw,
  Sliders,
  Flame,
  AlertTriangle,
  Film,
  Dice5,
  Smile,
  Pill,
  Brain,
  FileCheck,
  Stethoscope,
  HeartCrack,
  Clock,
  Zap,
  Activity,
  Copy,
  Music,
  Hash,
  Share2,
  Layers
} from 'lucide-react';

interface MediaAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMeme: (memeData: {
    text: string;
    highlightText: string;
    template?: TemplateType;
    systemTitle?: string;
    windowButtonText?: string;
    shadowColor?: string;
    sticker?: StickerType;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    mediaDisplayMode: MediaDisplayMode;
    mediaCaption?: string;
    detectedTopic?: string;
  }) => void;
  currentConfig: PostConfig;
}

interface VisualVariation {
  styleName: string;
  template: TemplateType;
  description: string;
}

interface PublishingMetadata {
  caption: string;
  hashtags: string[];
  viralAudioSuggestion: string;
  threeVisualVariations?: VisualVariation[];
}

interface MemeOption {
  title?: string;
  text: string;
  highlight: string;
  template: TemplateType;
  systemTitle?: string;
  windowButtonText?: string;
  shadowColor?: string;
  sticker?: StickerType;
}

const HUMOR_VIBES = [
  { 
    id: 'farmacologia-remedios', 
    label: '💊 Remédios & Farmácia', 
    desc: 'Antidepressivos, tarja preta, libido zero, Zolpidem, efeitos colaterais' 
  },
  { 
    id: 'dsm5-psiquiatria', 
    label: '🧠 DSM-5 & Psiquiatria', 
    desc: 'Laudos, CID F32, F41, TDAH, Bipolaridade, crises sinápticas' 
  },
  { 
    id: 'terapia-psicologia', 
    label: '🛋️ Terapia & Psicólogo', 
    desc: 'Sessão de 50 min, TCC, psicanálise, fingir que tá são' 
  },
  { 
    id: 'crise-existencial', 
    label: '⚡ Crise das 03h & Vácuo', 
    desc: 'Pensamentos intrusivos, insônia, olhar pro teto' 
  },
  { 
    id: 'nostalgia-2000', 
    label: '💾 Emo & Nostalgia 2000', 
    desc: 'MSN, Orkut, Fresno, internet discada e drama adolescente' 
  },
  { 
    id: 'variado-psicopatologia', 
    label: '🎲 Mix Completo Psiquiátrico', 
    desc: 'Equilíbrio perfeito de todos os estilos de humor' 
  },
];

const SAMPLE_PRESETS = [
  {
    name: '💊 Remédios & Ansiedade',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    topic: 'Frascos de remédio e rotina farmacológica',
  },
  {
    name: '🛋️ Olhar Vazio no Sofá',
    url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    topic: 'Gato ou pessoa deitada encarando o vazio existencial',
  },
  {
    name: '💻 Monitor & Erro Fatal',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    topic: 'Computador retrô com tela azul e colapso',
  },
  {
    name: '🏖️ Praia vs Mente em Chamas',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    topic: 'Paz no ambiente mas turbilhão psiquiátrico na mente',
  }
];

export const MediaAnalyzerModal: React.FC<MediaAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onApplyMeme,
  currentConfig,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(
    currentConfig.mediaUrl || null
  );
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);

  const [extraContext, setExtraContext] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('farmacologia-remedios');
  const [displayMode, setDisplayMode] = useState<MediaDisplayMode>(
    currentConfig.mediaDisplayMode || 'tweet-media'
  );

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedHashtags, setCopiedHashtags] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    detectedScene: string;
    identifiedTopic: string;
    publishingMetadata?: PublishingMetadata;
    primaryMeme: MemeOption;
    alternativeMemes?: MemeOption[];
  } | null>(null);

  const [selectedMemeIndex, setSelectedMemeIndex] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle file selection (Image or Video)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setAnalysisError(null);

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setMediaPreviewUrl(dataUrl);

      if (!isVideo) {
        setExtractedFrameUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Video frame capture
  const captureVideoFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.85);
        setExtractedFrameUrl(frameData);
        return frameData;
      }
    } catch (err) {
      console.error('Erro ao capturar frame de vídeo:', err);
    }
    return null;
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Select sample preset image
  const handleSelectSample = (sample: typeof SAMPLE_PRESETS[0]) => {
    setMediaType('image');
    setMediaPreviewUrl(sample.url);
    setExtractedFrameUrl(sample.url);
    setExtraContext('');
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  // Run AI multimodal analysis with Gemini 3.7 Flash
  const handleAnalyze = async (customTemp?: number) => {
    let imageToAnalyze = extractedFrameUrl;

    // If it's a video, capture current scrubber frame first
    if (mediaType === 'video' && videoRef.current) {
      const frame = captureVideoFrame();
      if (frame) imageToAnalyze = frame;
    }

    if (!imageToAnalyze) {
      setAnalysisError('Por favor, selecione ou envie uma foto ou vídeo primeiro.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setSelectedMemeIndex(0);

    try {
      let base64Payload = imageToAnalyze;
      if (imageToAnalyze.startsWith('http')) {
        const response = await fetch(imageToAnalyze);
        const blob = await response.blob();
        base64Payload = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const res = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Payload,
          mimeType: 'image/jpeg',
          extraContext,
          vibe: selectedVibe,
          temperature: customTemp || 1.05,
          mediaType,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro HTTP ${res.status} ao analisar mídia.`);
      }

      const data = await res.json();
      if (data && (data.primaryMeme || data.alternativeMemes)) {
        setAnalysisResult(data);
      } else {
        throw new Error('A IA não retornou o formato esperado de frases.');
      }
    } catch (err: any) {
      console.error('Erro na análise da mídia:', err);
      setAnalysisError(
        err.message || 'Não foi possível analisar a imagem. Tente novamente ou teste outra foto.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply chosen meme + media attachment to the canvas
  const handleApply = (meme: MemeOption) => {
    const finalMedia = extractedFrameUrl || mediaPreviewUrl;
    if (!finalMedia) return;

    onApplyMeme({
      text: meme.text,
      highlightText: meme.highlight,
      template: meme.template || 'tweet-parede',
      systemTitle: meme.systemTitle,
      windowButtonText: meme.windowButtonText,
      shadowColor: meme.shadowColor,
      sticker: meme.sticker,
      mediaUrl: finalMedia,
      mediaType,
      mediaDisplayMode: displayMode,
      mediaCaption: analysisResult?.identifiedTopic || undefined,
      detectedTopic: analysisResult?.identifiedTopic,
    });

    onClose();
  };

  // Compile all meme options (primary + alternatives)
  const allMemeOptions: MemeOption[] = analysisResult
    ? [
        analysisResult.primaryMeme,
        ...(analysisResult.alternativeMemes || []),
      ].filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#12151E] border-2 border-blue-500/50 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-950/60 via-[#151926] to-[#12151E]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/40">
              <Pill className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-lg text-white">
                  Analisador Visual com IA: Psiquiatria, Farmácia & DSM-5
                </h2>
                <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-bold tracking-wider">
                  VISÃO PSICOLÓGICA & FARMACOLÓGICA
                </span>
              </div>
              <p className="text-xs text-gray-400">
                A IA analisa a cena visual e gera 8 opções de memes com foco em antidepressivos, efeitos colaterais, CID-10, terapia e psicologia
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

        {/* Modal Body: Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B0D13]">
          {/* Left Column: Upload / Video Frame / Media Preview (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Upload Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition relative overflow-hidden group min-h-[190px] ${
                mediaPreviewUrl
                  ? 'border-blue-500/60 bg-[#121622]'
                  : 'border-gray-700 hover:border-blue-400 bg-[#141824] hover:bg-[#1A2030]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {mediaPreviewUrl ? (
                <div className="w-full flex flex-col items-center">
                  {mediaType === 'video' ? (
                    <div className="w-full">
                      <video
                        ref={videoRef}
                        src={mediaPreviewUrl}
                        controls
                        onLoadedMetadata={(e) => {
                          setVideoDuration(e.currentTarget.duration);
                          captureVideoFrame();
                        }}
                        onTimeUpdate={(e) => {
                          setVideoCurrentTime(e.currentTarget.currentTime);
                          captureVideoFrame();
                        }}
                        className="w-full max-h-[180px] rounded-lg object-contain bg-black"
                      />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1 text-blue-400">
                          <Film className="w-3.5 h-3.5" /> Vídeo Carregado
                        </span>
                        <span className="text-yellow-400">Pause no frame desejado</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full flex flex-col items-center">
                      <img
                        src={mediaPreviewUrl}
                        alt="Preview"
                        className="max-h-[180px] w-auto max-w-full rounded-lg object-contain border border-gray-700 shadow-md"
                      />
                      <span className="text-[11px] text-gray-400 mt-2 font-mono">
                        Clique para trocar de foto/vídeo
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-200">
                      Arraste ou clique para enviar foto ou vídeo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Suporta PNG, JPG, WEBP, MP4 ou WEBM
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Presets Rápidos de Exemplo */}
            <div>
              <span className="text-[11px] font-mono text-gray-400 block mb-1.5 uppercase font-bold">
                Ou teste com fotos de exemplo:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SAMPLE_PRESETS.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => handleSelectSample(sample)}
                    className="text-left text-xs bg-[#151926] hover:bg-[#20273D] border border-gray-800 hover:border-blue-500/50 p-2 rounded-lg text-gray-300 hover:text-white transition flex items-center gap-2"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-7 h-7 rounded object-cover flex-shrink-0"
                    />
                    <span className="truncate font-medium">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo da Moldura no Post */}
            <div className="bg-[#141824] p-3.5 rounded-xl border border-gray-800">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Moldura da Imagem no Post Final:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'tweet-media', label: 'Borda Brutalista (Padrão)' },
                  { id: 'win-viewer', label: 'Janela Windows 98' },
                  { id: 'polaroid', label: 'Polaroid Retrô' },
                  { id: 'msn-webcam', label: 'Webcam MSN 2005' },
                  { id: 'background', label: 'Fundo Escurecido' },
                  { id: 'none', label: 'Apenas Contexto (Sem Foto)' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setDisplayMode(mode.id as MediaDisplayMode)}
                    className={`p-2 rounded-lg text-left transition font-medium border ${
                      displayMode === mode.id
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-[#1A1F2F] text-gray-400 border-gray-800 hover:text-gray-200 hover:bg-[#242B40]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Meme Generation (7 Cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Escolha da Vibe / Estilo Psiquiátrico */}
            <div className="bg-[#141824] p-4 rounded-xl border border-gray-800 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Foco Psiquiátrico / Farmacológico:</span>
                  <span className="text-[10px] text-yellow-400 font-mono">SELEÇÃO DIRETA</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {HUMOR_VIBES.map((vibe) => (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`p-2 rounded-lg text-left text-xs transition border ${
                        selectedVibe === vibe.id
                          ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                          : 'bg-[#191F30] text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="truncate font-bold">{vibe.label}</div>
                      <div className="text-[10px] text-gray-400 truncate opacity-80 mt-0.5">{vibe.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contexto Opcional */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Detalhe ou remédio específico (opcional - ex: Escitalopram, Zolpidem, Sertralina, Terapia):
                </label>
                <input
                  type="text"
                  placeholder="ex: tomando 15mg de escitalopram, libido zero, fingindo sanidade mental..."
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  className="w-full bg-[#0E1118] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                />
              </div>

              {/* Botão Principal de Análise */}
              <button
                onClick={() => handleAnalyze(1.05)}
                disabled={isAnalyzing || (!mediaPreviewUrl && !extractedFrameUrl)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-yellow-300" />
                    <span className="font-bold">Diagnosticando a imagem e gerando 8 opções psiquiátricas...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-yellow-300 animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {analysisResult ? 'Gerar Outras Ideias Psiquiátricas' : 'Analisar Imagem & Gerar 8 Memes de Psiquiatria'}
                    </span>
                  </>
                )}
              </button>

              {analysisError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{analysisError}</span>
                </div>
              )}
            </div>

            {/* Generated Memes Result Section */}
            {analysisResult && (
              <div className="flex-1 flex flex-col gap-3 animate-in fade-in zoom-in-95">
                {/* Scene Recognition Tag */}
                <div className="bg-[#141926] border border-blue-500/40 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                      🔍 A IA Identificou na Foto:
                    </span>
                    <p className="text-xs font-semibold text-gray-200 truncate">
                      {analysisResult.detectedScene}
                    </p>
                  </div>
                  {analysisResult.identifiedTopic && (
                    <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-1 rounded font-mono font-bold border border-blue-500/30">
                      {analysisResult.identifiedTopic}
                    </span>
                  )}
                </div>

                {/* Metadados de Publicação (Legenda, Áudio Viral, 3 Variações Visuais) */}
                {analysisResult.publishingMetadata && (
                  <div className="bg-[#101420] border border-purple-500/30 rounded-xl p-3.5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5 font-mono uppercase">
                        <Share2 className="w-3.5 h-3.5 text-purple-400" />
                        Metadados de Publicação (Pronto para Postar)
                      </span>
                      <span className="text-[10px] bg-purple-950/80 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-800">
                        Passo 2 / Fluxo Mestre
                      </span>
                    </div>

                    {/* Sugestão de Áudio Viral */}
                    {analysisResult.publishingMetadata.viralAudioSuggestion && (
                      <div className="bg-[#151928] p-2.5 rounded-lg border border-purple-500/20 flex items-start gap-2 text-xs">
                        <Music className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-pink-300 block text-[11px]">
                            🎵 Sugestão de Áudio em Alta (Reels / TikTok):
                          </span>
                          <p className="text-gray-300 text-[11px] mt-0.5">
                            {analysisResult.publishingMetadata.viralAudioSuggestion}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Legenda & CTA */}
                    {analysisResult.publishingMetadata.caption && (
                      <div className="bg-[#151928] p-2.5 rounded-lg border border-gray-800 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-300">
                            📝 Legenda com CTA p/ DM:
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `${analysisResult.publishingMetadata?.caption}\n\n${analysisResult.publishingMetadata?.hashtags.join(' ')}`
                              );
                              setCopiedCaption(true);
                              setTimeout(() => setCopiedCaption(false), 2000);
                            }}
                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800 transition"
                          >
                            {copiedCaption ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            {copiedCaption ? 'Copiado!' : 'Copiar Legenda Completa'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-300 italic whitespace-pre-line">
                          "{analysisResult.publishingMetadata.caption}"
                        </p>
                        {analysisResult.publishingMetadata.hashtags && (
                          <div className="text-[10px] font-mono text-blue-400/90 pt-1 border-t border-gray-800/60">
                            {analysisResult.publishingMetadata.hashtags.join(' ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3 Variações Visuais Recomendadas */}
                    {analysisResult.publishingMetadata.threeVisualVariations && analysisResult.publishingMetadata.threeVisualVariations.length > 0 && (
                      <div className="bg-[#151928] p-2.5 rounded-lg border border-gray-800 flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-yellow-300 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          3 Variações Visuais Recomendadas (Passo 3):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-1">
                          {analysisResult.publishingMetadata.threeVisualVariations.map((v, i) => (
                            <div key={i} className="bg-[#0D1018] p-2 rounded border border-gray-800 text-[10px]">
                              <span className="font-bold text-white block truncate">{v.styleName}</span>
                              <span className="text-gray-400 block mt-0.5 leading-tight">{v.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Botões de Ação Rápida */}
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="font-bold text-white">
                    Escolha uma das {allMemeOptions.length} opções psiquiátricas geradas:
                  </span>
                  <button
                    onClick={() => handleAnalyze(1.2)}
                    disabled={isAnalyzing}
                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-bold bg-[#1C2236] px-2.5 py-1 rounded-lg border border-yellow-500/30 transition hover:bg-[#252E48]"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                    <span>Regerar Mais Ideias (+8)</span>
                  </button>
                </div>

                {/* Meme Options Cards List */}
                <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {allMemeOptions.map((meme, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedMemeIndex(idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        selectedMemeIndex === idx
                          ? 'bg-[#1A2238] border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                          : 'bg-[#141824] border-gray-800 hover:border-gray-700 hover:bg-[#181D2C]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
                        <span className="text-[11px] font-bold text-yellow-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          {meme.title || `Opção ${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
                          {meme.template}
                        </span>
                      </div>

                      <p className="text-white font-impact text-base uppercase leading-snug my-1 whitespace-pre-line tracking-wide">
                        {meme.text}
                      </p>

                      <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-yellow-400 text-black font-bold">
                          Destaque: {meme.highlight}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(meme);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Usar Esta Frase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => handleApply(allMemeOptions[selectedMemeIndex])}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 mt-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Opção #{selectedMemeIndex + 1} no Post</span>
                </button>
              </div>
            )}

            {!analysisResult && !isAnalyzing && (
              <div className="h-56 border border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-gray-500 bg-[#10131B]">
                <Pill className="w-10 h-10 mb-2 opacity-30 text-blue-400" />
                <p className="text-sm font-semibold text-gray-300">
                  Suba sua foto ou vídeo e gere frases sobre psiquiatria, remédios e saúde mental
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-md">
                  A IA analisa a expressão facial, olhar, postura e ambiente da imagem para gerar piadas de antidepressivos (Escitalopram, Sertralina, Zolpidem), laudos do DSM-5/CID e sessões de terapia.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
