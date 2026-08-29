import React, { useState, useRef, useEffect } from 'react';
import { PostConfig } from '../types';
import { 
  exportNodeToVideo, 
  getSupportedVideoMimeType,
  VideoExportResult 
} from '../utils/videoExporter';
import { resolveAudioPreview } from '../data/albumCovers';
import confetti from 'canvas-confetti';
import {
  Video,
  Download,
  Film,
  Music,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  Smartphone,
  Square,
  Sliders,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface VideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PostConfig;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onShowToast: (msg: string) => void;
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  isOpen,
  onClose,
  config,
  canvasRef,
  onShowToast,
}) => {
  const [duration, setDuration] = useState<number>(5);
  const [fps, setFps] = useState<number>(30);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '4:5'>('1:1');
  
  // Export status
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [exportResult, setExportResult] = useState<VideoExportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview video player
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Resolve active audio track
  const activeAudioUrl = resolveAudioPreview(
    config.text,
    undefined,
    undefined,
    config.audioPreviewUrl
  );

  // Supported format check
  const supportedMime = getSupportedVideoMimeType(format);

  useEffect(() => {
    if (!isOpen) {
      setExportResult(null);
      setProgress(0);
      setIsExporting(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    const node = canvasRef.current;
    if (!node) {
      setErrorMessage('Elemento do canvas não encontrado.');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setErrorMessage(null);
    setExportResult(null);

    // Determine dimensions
    let targetWidth = 1080;
    let targetHeight = 1080;
    if (aspectRatio === '9:16') {
      targetWidth = 1080;
      targetHeight = 1920;
    } else if (aspectRatio === '4:5') {
      targetWidth = 1080;
      targetHeight = 1350;
    }

    try {
      const result = await exportNodeToVideo(node, {
        durationSeconds: duration,
        fps,
        format,
        targetWidth,
        targetHeight,
        includeAudio: includeAudio && !!activeAudioUrl,
        audioUrl: activeAudioUrl,
        onProgress: (p, msg) => {
          setProgress(p);
          setStatusMessage(msg);
        },
      });

      setExportResult(result);
      setIsExporting(false);

      // Trigger download immediately
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      link.click();

      // Confetti celebrate
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0000FF', '#FF3333', '#FFD700', '#00FF66'],
      });

      onShowToast(`🎬 Vídeo MP4 (${duration}s) baixado com sucesso!`);
    } catch (err: unknown) {
      console.error('Erro na renderização do vídeo:', err);
      const errMsg = err instanceof Error ? err.message : 'Falha ao renderizar vídeo';
      setErrorMessage(errMsg);
      setIsExporting(false);
      onShowToast('❌ Falha ao exportar vídeo. Tente diminuir a duração ou FPS.');
    }
  };

  const handleDownloadAgain = () => {
    if (!exportResult) return;
    const link = document.createElement('a');
    link.href = exportResult.url;
    link.download = exportResult.filename;
    link.click();
    onShowToast('📥 Download do vídeo reiniciado!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#141720] border-4 border-[#0000FF] rounded-2xl shadow-[12px_12px_0px_#000000] overflow-hidden text-white font-sans my-8">
        
        {/* ============================================================ */}
        {/* MODAL HEADER: Y2K BLUE TITLEBAR */}
        {/* ============================================================ */}
        <div className="bg-[#0000FF] px-4 py-3 flex items-center justify-between border-b-2 border-black select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#FFD700] border-2 border-black flex items-center justify-center rounded shadow-[2px_2px_0px_#000]">
              <Film className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="font-impact text-lg text-white tracking-wide uppercase flex items-center gap-2">
                <span>EXPORTAR POST EM VÍDEO (MP4)</span>
                <span className="font-mono text-[10px] bg-black text-[#00FF66] px-1.5 py-0.5 rounded border border-[#00FF66]">
                  1080p HD
                </span>
              </h2>
              <p className="font-mono text-[11px] text-blue-100">
                Gere vídeos animados e com áudio para Instagram Reels, TikTok e Stories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            className="w-8 h-8 bg-red-600 hover:bg-red-500 active:scale-95 text-white border-2 border-black font-bold flex items-center justify-center rounded shadow-[2px_2px_0px_#000] transition disabled:opacity-50"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODAL CONTENT */}
        {/* ============================================================ */}
        <div className="p-5 md:p-6 space-y-6">

          {/* ACTIVE STATUS / ERROR NOTICES */}
          {errorMessage && (
            <div className="bg-red-950/80 border-2 border-red-500 rounded-xl p-3.5 flex items-start gap-3 text-red-200 text-xs font-mono">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-100 font-bold uppercase mb-1">
                  Erro ao Processar Vídeo
                </strong>
                <span>{errorMessage}</span>
                <span className="block mt-1 text-gray-400">
                  Dica: Reduza a duração para 5s ou desative temporariamente a trilha de áudio.
                </span>
              </div>
            </div>
          )}

          {/* PROGRESS BAR DISPLAY (DURING EXPORT) */}
          {isExporting && (
            <div className="bg-[#0A0D14] border-2 border-[#0000FF] rounded-xl p-5 shadow-[6px_6px_0px_#0000FF] space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#FFD700] animate-spin" />
                  <span className="font-impact text-base text-white uppercase tracking-wide">
                    GRAVANDO E CODIFICANDO VÍDEO...
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#00FF66] bg-black px-2 py-0.5 rounded border border-[#00FF66]">
                  {progress}%
                </span>
              </div>

              {/* Y2K Retro Striped Progress Bar */}
              <div className="w-full h-5 bg-[#1F2432] rounded-lg border-2 border-black p-0.5 overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#0000FF] via-[#00B4D8] to-[#00FF66] rounded transition-all duration-200 flex items-center justify-end pr-1"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-1.5 h-full bg-white opacity-80 animate-ping" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span className="truncate pr-2">{statusMessage || 'Processando quadros de alta resolução...'}</span>
                <span className="text-[#FFD700] font-bold shrink-0">{duration}s @ {fps}fps</span>
              </div>
            </div>
          )}

          {/* RESULT PREVIEW PLAYER (AFTER EXPORT COMPLETED) */}
          {exportResult && !isExporting && (
            <div className="bg-[#0A0D14] border-2 border-[#00FF66] rounded-xl p-5 shadow-[6px_6px_0px_#00FF66] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00FF66]" />
                  <span className="font-impact text-base text-[#00FF66] uppercase tracking-wide">
                    VÍDEO PRONTO E BAIXADO!
                  </span>
                </div>
                <span className="font-mono text-xs text-gray-300">
                  {exportResult.durationSeconds}s • {exportResult.format.toUpperCase()}
                </span>
              </div>

              {/* Video Player */}
              <div className="relative rounded-lg overflow-hidden border-2 border-black bg-black max-h-[300px] flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  src={exportResult.url}
                  controls
                  loop
                  autoPlay
                  className="max-h-[280px] w-auto mx-auto object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadAgain}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-95 text-white font-impact tracking-wide text-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>BAIXAR VÍDEO NOVAMENTE</span>
                </button>

                <button
                  onClick={() => setExportResult(null)}
                  className="py-2.5 px-4 bg-[#1F2432] hover:bg-[#2A3144] active:scale-95 text-gray-300 font-mono text-xs rounded-lg border border-gray-700 transition"
                >
                  Configurar Outro
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* CONFIGURATION CONTROLS (WHEN NOT EXPORTING) */}
          {/* ============================================================ */}
          {!isExporting && (
            <div className="space-y-5">
              
              {/* 1. DURATION SELECTOR */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-mono font-bold text-gray-300 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                    Duração do Vídeo:
                  </span>
                  <span className="text-[#FFD700]">{duration} Segundos</span>
                </label>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { sec: 3, label: '3s', desc: 'Loop' },
                    { sec: 5, label: '5s', desc: 'Feed' },
                    { sec: 10, label: '10s', desc: 'Reels' },
                    { sec: 15, label: '15s', desc: 'Stories' },
                    { sec: 30, label: '30s', desc: 'Música' },
                  ].map((item) => (
                    <button
                      key={item.sec}
                      type="button"
                      onClick={() => setDuration(item.sec)}
                      className={`p-2 rounded-lg border-2 font-mono transition text-center flex flex-col items-center justify-center ${
                        duration === item.sec
                          ? 'bg-[#0000FF] border-black text-white shadow-[3px_3px_0px_#FFD700]'
                          : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                      }`}
                    >
                      <span className="font-bold text-sm">{item.label}</span>
                      <span className="text-[10px] opacity-75">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. PROPORTION & RESOLUTION */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-mono font-bold text-gray-300 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#00FF66]" />
                    Proporção de Saída:
                  </span>
                  <span className="text-gray-400">
                    {aspectRatio === '1:1' ? '1080x1080 (Quadrado)' : aspectRatio === '9:16' ? '1080x1920 (Vertical)' : '1080x1350 (4:5)'}
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`p-2.5 rounded-lg border-2 font-mono text-xs transition flex items-center justify-center gap-2 ${
                      aspectRatio === '1:1'
                        ? 'bg-[#0000FF] border-black text-white shadow-[3px_3px_0px_#00FF66]'
                        : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>Feed (1:1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-2.5 rounded-lg border-2 font-mono text-xs transition flex items-center justify-center gap-2 ${
                      aspectRatio === '9:16'
                        ? 'bg-[#0000FF] border-black text-white shadow-[3px_3px_0px_#00FF66]'
                        : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Reels / Stories (9:16)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('4:5')}
                    className={`p-2.5 rounded-lg border-2 font-mono text-xs transition flex items-center justify-center gap-2 ${
                      aspectRatio === '4:5'
                        ? 'bg-[#0000FF] border-black text-white shadow-[3px_3px_0px_#00FF66]'
                        : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Retrato (4:5)</span>
                  </button>
                </div>
              </div>

              {/* 3. FORMAT & FPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Format */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                    Formato do Arquivo:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormat('mp4')}
                      className={`p-2 rounded-lg border-2 font-mono text-xs transition text-center ${
                        format === 'mp4'
                          ? 'bg-[#FFD700] border-black text-black font-black shadow-[2px_2px_0px_#0000FF]'
                          : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                      }`}
                    >
                      <span>MP4 (H.264)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('webm')}
                      className={`p-2 rounded-lg border-2 font-mono text-xs transition text-center ${
                        format === 'webm'
                          ? 'bg-[#FFD700] border-black text-black font-black shadow-[2px_2px_0px_#0000FF]'
                          : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                      }`}
                    >
                      <span>WebM (HD)</span>
                    </button>
                  </div>
                </div>

                {/* FPS */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                    Taxa de Quadros (FPS):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFps(30)}
                      className={`p-2 rounded-lg border-2 font-mono text-xs transition text-center ${
                        fps === 30
                          ? 'bg-[#0000FF] border-black text-white font-bold shadow-[2px_2px_0px_#000]'
                          : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                      }`}
                    >
                      <span>30 FPS (Rápido)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFps(60)}
                      className={`p-2 rounded-lg border-2 font-mono text-xs transition text-center ${
                        fps === 60
                          ? 'bg-[#0000FF] border-black text-white font-bold shadow-[2px_2px_0px_#000]'
                          : 'bg-[#181C26] border-gray-800 text-gray-300 hover:bg-[#222736]'
                      }`}
                    >
                      <span>60 FPS (Ultra)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. AUDIO TOGGLE */}
              <div className="bg-[#181C26] border border-gray-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                    includeAudio ? 'bg-blue-600/30 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}>
                    {includeAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-white block">
                      Embutir Trilha Sonora de Áudio
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {activeAudioUrl ? 'Trilha conectada à prévia de áudio ativa' : 'Sem áudio no preset atual (gravará mudo)'}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAudio}
                    onChange={(e) => setIncludeAudio(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0000FF]"></div>
                </label>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* BOTTOM SUBMIT / ACTION BUTTON */}
          {/* ============================================================ */}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2.5 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-mono text-xs rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleStartExport}
              disabled={isExporting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#0000FF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#1E40AF] active:scale-95 text-white font-impact tracking-wide text-base uppercase rounded-xl border-2 border-black shadow-[5px_5px_0px_#FFD700] flex items-center justify-center gap-2.5 transition disabled:opacity-50"
            >
              <Video className="w-5 h-5 text-[#FFD700]" />
              <span>{isExporting ? 'GERANDO VÍDEO...' : `RENDERIZAR E BAIXAR VÍDEO (.${format.toUpperCase()})`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
