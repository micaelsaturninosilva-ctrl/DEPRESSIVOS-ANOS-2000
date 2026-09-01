import React, { useState, useRef, useEffect } from 'react';
import { PostConfig } from '../types';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Sparkles, Upload } from 'lucide-react';

interface WindowsMediaPlayerTemplateProps {
  config: PostConfig;
  scale?: number;
  width?: number;
  height?: number;
  hasAttachedMedia?: boolean;
  getBaseFontSize: (defaultSize: number) => number;
  getTextStyles: (align?: 'left' | 'center' | 'right', customLineHeight?: number) => React.CSSProperties;
  renderHighlightedText: (
    text: string,
    highlight: string | undefined,
    color: string,
    mode?: 'badge' | 'textColor',
    normalTextColor?: string
  ) => React.ReactNode;
}

export const WindowsMediaPlayerTemplate: React.FC<WindowsMediaPlayerTemplateProps> = ({
  config,
  scale = 1,
  width = 1080,
  height = 1080,
  hasAttachedMedia,
  getBaseFontSize,
  getTextStyles,
  renderHighlightedText,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState('01:24');
  const [totalTime, setTotalTime] = useState('03:45');
  const [progress, setProgress] = useState(38);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideo = config.mediaType === 'video' || (config.mediaUrl && (config.mediaUrl.endsWith('.mp4') || config.mediaUrl.endsWith('.webm') || config.mediaUrl.startsWith('data:video/')));
  const hasMedia = Boolean(config.mediaUrl);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 select-none">
      {/* 1. PAPEL DE PAREDE BLISS DO WINDOWS XP (CÉU AZUL COM NUVENS + COLINAS VERDES) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: config.backgroundColor && config.backgroundColor !== '#F4F4F0' && config.backgroundColor !== '#0000FF' && config.backgroundColor !== '#FAFAFA'
            ? config.backgroundColor
            : 'linear-gradient(180deg, #1868C8 0%, #3B8BEA 32%, #7AB3F5 48%, #A8D1FA 58%, #68A832 60%, #468A1B 75%, #316E10 100%)',
        }}
      >
        {/* Nuvens fotorrealistas e Colina Verde estilo Windows XP Bliss */}
        <svg className="w-full h-full absolute inset-0 opacity-90" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <defs>
            {/* Gradiente do Céu */}
            <linearGradient id="xpSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E6CD9" />
              <stop offset="35%" stopColor="#4A93EC" />
              <stop offset="55%" stopColor="#87BEF7" />
              <stop offset="62%" stopColor="#C4E0FA" />
            </linearGradient>

            {/* Gradiente das Colinas */}
            <linearGradient id="xpHill1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78C236" />
              <stop offset="50%" stopColor="#519B1E" />
              <stop offset="100%" stopColor="#306910" />
            </linearGradient>
            <linearGradient id="xpHill2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#89D43E" />
              <stop offset="40%" stopColor="#5EA824" />
              <stop offset="100%" stopColor="#2E630D" />
            </linearGradient>

            {/* Filtro de Nuvem Suave */}
            <radialGradient id="cloudGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#F0F6FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E2EEF8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Céu */}
          <rect x="0" y="0" width="1000" height="620" fill="url(#xpSky)" />

          {/* Nuvens Brancas volumosas */}
          <ellipse cx="150" cy="180" rx="220" ry="110" fill="url(#cloudGrad1)" />
          <ellipse cx="280" cy="140" rx="180" ry="90" fill="url(#cloudGrad1)" />
          <ellipse cx="80" cy="220" rx="140" ry="80" fill="url(#cloudGrad1)" />

          <ellipse cx="820" cy="240" rx="260" ry="130" fill="url(#cloudGrad1)" />
          <ellipse cx="920" cy="190" rx="200" ry="100" fill="url(#cloudGrad1)" />
          <ellipse cx="700" cy="280" rx="180" ry="90" fill="url(#cloudGrad1)" />

          <ellipse cx="500" cy="360" rx="350" ry="120" fill="url(#cloudGrad1)" opacity="0.6" />

          {/* Colina de Fundo */}
          <path
            d="M 0 620 Q 300 520 600 580 T 1000 540 L 1000 1000 L 0 1000 Z"
            fill="url(#xpHill1)"
          />

          {/* Colina Principal da Frente */}
          <path
            d="M 0 580 Q 350 490 700 620 T 1000 600 L 1000 1000 L 0 1000 Z"
            fill="url(#xpHill2)"
          />
        </svg>
      </div>

      {/* 2. JANELA CLÁSSICA DO WINDOWS MEDIA PLAYER (WINDOWS XP / WMP 9 / 10) */}
      <div className="relative w-full max-w-[860px] bg-[#001740] rounded-t-[10px] rounded-b-[8px] border-[3px] border-[#0A3D91] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_5px_15px_rgba(0,0,0,0.5)] flex flex-col z-10 overflow-hidden">
        
        {/* BARRA DE TÍTULO AZUL XP DEGRADÊ COM BOTÕES CLÁSSICOS */}
        <div 
          className="h-9 px-2.5 flex items-center justify-between select-none relative"
          style={{
            background: 'linear-gradient(180deg, #0A5FD9 0%, #2073E8 25%, #1865DC 50%, #0B4EB5 75%, #083E96 100%)',
            borderBottom: '1px solid #062F75',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.7)',
          }}
        >
          {/* Logo WMP (Esfera colorida) + Título */}
          <div className="flex items-center gap-2">
            {/* Ícone 4-cores do WMP */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF9900] via-[#33CC33] to-[#0099FF] p-[2px] shadow-sm flex items-center justify-center border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#003399]" />
              </div>
            </div>
            <span className="font-sans font-bold text-white text-xs sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide truncate max-w-[340px] sm:max-w-[500px]">
              {config.systemTitle || 'Windows Media Player'}
            </span>
          </div>

          {/* Botões do Windows XP: Minimizar, Maximizar, Fechar */}
          <div className="flex items-center gap-1">
            {/* Minimizar */}
            <button className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] hover:brightness-110 border border-[#93C5FD] shadow-inner flex items-center justify-center text-white text-xs font-bold leading-none">
              <span className="mb-1.5 font-mono font-bold">_</span>
            </button>
            {/* Maximizar */}
            <button className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] hover:brightness-110 border border-[#93C5FD] shadow-inner flex items-center justify-center text-white text-[10px] font-bold leading-none">
              <div className="w-2.5 h-2.5 border border-white" />
            </button>
            {/* Fechar (Vermelho / Laranja clássico XP) */}
            <button className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#B91C1C] hover:brightness-110 border border-[#FCA5A5] shadow-inner flex items-center justify-center text-white text-xs font-bold leading-none">
              ✕
            </button>
          </div>
        </div>

        {/* BARRA DE MENUS SUPERIOR: File, View, Play, Tools, Help */}
        <div className="bg-[#ECE9D8] px-3 py-1 border-b border-[#D0C9B6] flex items-center justify-between text-[11px] text-[#111827] font-sans">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:bg-[#316AC5] hover:text-white px-1.5 py-0.5 rounded-sm">File</span>
            <span className="cursor-pointer hover:bg-[#316AC5] hover:text-white px-1.5 py-0.5 rounded-sm">View</span>
            <span className="cursor-pointer hover:bg-[#316AC5] hover:text-white px-1.5 py-0.5 rounded-sm">Play</span>
            <span className="cursor-pointer hover:bg-[#316AC5] hover:text-white px-1.5 py-0.5 rounded-sm">Tools</span>
            <span className="cursor-pointer hover:bg-[#316AC5] hover:text-white px-1.5 py-0.5 rounded-sm">Help</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
            <span>Now Playing</span>
            <span className="text-gray-400">|</span>
            <span className="text-[#0055EA] font-bold">{config.handle || '@DEPRESSIVOS2000'}</span>
          </div>
        </div>

        {/* SUB-BARRA DE RECURSOS / EQUALIZER STRIP */}
        <div className="bg-gradient-to-r from-[#D8E1F0] via-[#C0D2EB] to-[#D8E1F0] px-3 py-1 border-b border-[#9FBADB] flex items-center justify-between text-[10px] text-[#1E3A8A] font-sans">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-[#1E40AF] text-white px-1.5 py-0.2 rounded text-[9px]">VIDEO</span>
            <span>{config.highlightText || 'Depressivos 2000 - Traumas.wmv'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 h-3">
              {[40, 70, 90, 60, 85, 45, 100, 75, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#2563EB] rounded-t-xs"
                  style={{ height: `${isPlaying ? h : 20}%` }}
                />
              ))}
            </div>
            <Maximize2 className="w-3 h-3 text-[#1E3A8A] cursor-pointer" />
          </div>
        </div>

        {/* ÁREA DE TELA PRINCIPAL (VIDEO / FOTO / CONTEÚDO CHROMA OU POST) */}
        <div 
          className="relative w-full bg-black min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: hasMedia ? '#000000' : (config.backgroundColor || '#080C14'),
          }}
        >
          {/* Se houver mídia anexada (Vídeo / Imagem / GIF) */}
          {hasMedia ? (
            <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={config.mediaUrl || ''}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full"
                  style={{
                    objectFit: config.mediaFit || 'contain',
                    objectPosition: `${config.mediaPositionX ?? 50}% ${config.mediaPositionY ?? 50}%`,
                    transform: `scale(${config.mediaZoom || 1}) rotate(${config.mediaRotate || 0}deg)`,
                    transformOrigin: `${config.mediaPositionX ?? 50}% ${config.mediaPositionY ?? 50}%`,
                  }}
                />
              ) : (
                <img
                  src={config.mediaUrl || ''}
                  alt="Windows Media Player Content"
                  className="w-full h-full"
                  style={{
                    objectFit: config.mediaFit || 'contain',
                    objectPosition: `${config.mediaPositionX ?? 50}% ${config.mediaPositionY ?? 50}%`,
                    transform: `scale(${config.mediaZoom || 1}) rotate(${config.mediaRotate || 0}deg)`,
                    transformOrigin: `${config.mediaPositionX ?? 50}% ${config.mediaPositionY ?? 50}%`,
                  }}
                />
              )}

              {/* Botão de Play central translúcido sobreposto no vídeo */}
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-black/10 hover:bg-black/25 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-xs border border-white/50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {isPlaying ? (
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1 drop-shadow" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-0.5 fill-white drop-shadow" />
                  )}
                </div>
              </div>

              {/* Texto do Post / Legenda sobreposta se houver */}
              {config.text && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center z-10">
                  <p className="font-impact text-white uppercase text-base sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
                    {renderHighlightedText(
                      config.text,
                      config.highlightText,
                      config.highlightColor || '#00FF66',
                      'badge',
                      '#FFFFFF'
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Se for modo texto puro: Layout de Post Existencial no Player */
            <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-between items-center text-center relative z-10">
              
              {/* Top OSD Information */}
              <div className="w-full flex items-center justify-between font-mono text-xs text-blue-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  WMV • 720x480 (29.97 fps)
                </span>
                <span>TRAUMAS_2000.WMV</span>
              </div>

              {/* Frase / Post Central */}
              <div className="my-auto max-w-[650px] py-6">
                <h1
                  className="font-impact leading-tight tracking-tight uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]"
                  style={{
                    fontSize: `${getBaseFontSize(54)}px`,
                    color: config.textColor || '#FFFFFF',
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    config.highlightColor || '#00FF66',
                    'badge',
                    config.textColor || '#FFFFFF'
                  )}
                </h1>
              </div>

              {/* Tag Inferior */}
              <div className="w-full flex items-center justify-between font-mono text-xs text-gray-400 border-t border-gray-800 pt-3">
                <span className="text-blue-400 font-bold">● REPRODUZINDO NO WMP 9</span>
                <span className="text-gray-300">{config.handle || '@DEPRESSIVOS2000'}</span>
              </div>
            </div>
          )}

          {/* Reflexo sutil de tela */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 25%, transparent 50%)',
            }}
          />
        </div>

        {/* 3. PAINEL INFERIOR DE CONTROLES METÁLICOS DO WINDOWS MEDIA PLAYER */}
        <div 
          className="relative px-4 py-3 flex flex-col gap-2 select-none"
          style={{
            background: 'linear-gradient(180deg, #1C4485 0%, #2A5BA8 15%, #184282 50%, #0F2D5E 85%, #0A2046 100%)',
            borderTop: '2px solid #3B6EB5',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        >
          {/* BARRA DE PROGRESSO VERDE COM SLIDER THUMB DO WMP */}
          <div className="w-full flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold text-white tracking-wider drop-shadow">
              {currentTime}
            </span>

            {/* Trilha do Seeker */}
            <div 
              className="flex-1 h-2 bg-[#09172E] rounded-full overflow-hidden border border-[#0D2447] relative cursor-pointer shadow-inner"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = Math.round((clickX / rect.width) * 100);
                setProgress(Math.max(0, Math.min(100, newPct)));
              }}
            >
              {/* Barra verde fluorescente clássica WMP */}
              <div 
                className="h-full bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#86EFAC] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                {/* Thumb Slider */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-gray-400 shadow-sm" />
              </div>
            </div>

            <span className="font-mono text-[11px] font-bold text-gray-300 tracking-wider">
              {totalTime}
            </span>
          </div>

          {/* BOTÕES DE REPRODUÇÃO REDONDOS CLÁSSICOS (WMP BLUE SKIN) */}
          <div className="flex items-center justify-between pt-1">
            
            {/* Controles de Faixa: Play, Pause, Stop, Prev, Next */}
            <div className="flex items-center gap-2">
              {/* Botão Play Redondo Gigante WMP */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-b from-[#60A5FA] via-[#2563EB] to-[#1E40AF] hover:brightness-110 active:scale-95 border-2 border-[#93C5FD] shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center text-white transition-all cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white text-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                )}
              </button>

              {/* Botão Stop */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setProgress(0);
                  setCurrentTime('00:00');
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                }}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-95 border border-[#93C5FD] shadow flex items-center justify-center text-white cursor-pointer"
                title="Parar"
              >
                <Square className="w-3.5 h-3.5 fill-white text-white" />
              </button>

              {/* Voltar Faixa */}
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-95 border border-[#93C5FD] shadow flex items-center justify-center text-white cursor-pointer"
                title="Retroceder"
              >
                <SkipBack className="w-3.5 h-3.5 fill-white text-white" />
              </button>

              {/* Avançar Faixa */}
              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="w-7 h-7 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] hover:brightness-110 active:scale-95 border border-[#93C5FD] shadow flex items-center justify-center text-white cursor-pointer"
                title="Avançar"
              >
                <SkipForward className="w-3.5 h-3.5 fill-white text-white" />
              </button>
            </div>

            {/* Controle de Volume com Slider */}
            <div className="flex items-center gap-2 bg-[#0A1A36] px-3 py-1.5 rounded-full border border-[#1E3A8A]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-green-400" />
                )}
              </button>
              
              {/* Slider de Volume Verde */}
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1.5 accent-green-400 bg-[#071120] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. CURSOR DO MOUSE DO WINDOWS XP NO CANTO INFERIOR DIREITO (COMO NA IMAGEM) */}
      <div className="absolute bottom-6 right-8 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] z-30">
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <path
            d="M2 2L12 32L16 20L26 18L2 2Z"
            fill="white"
            stroke="black"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
