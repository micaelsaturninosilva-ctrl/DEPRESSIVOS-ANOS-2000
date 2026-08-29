import React, { useState, useEffect, useRef } from 'react';
import { resolveAlbumCover, resolveAudioPreview } from '../data/albumCovers';
import { Volume2, VolumeX, Play, Pause, Music, Disc } from 'lucide-react';

interface IpodScreenProps {
  songTitle?: string;
  artistName?: string;
  albumName?: string;
  trackIndex?: string; // e.g. "2 of 5"
  mediaUrl?: string | null;
  audioPreviewUrl?: string | null;
  mediaType?: 'image' | 'video';
  mediaFilter?: string;
  showMsnBadge?: boolean;
  handle?: string;
  className?: string;
  isFullCanvas?: boolean;
}

export const IpodScreen: React.FC<IpodScreenProps> = ({
  songTitle = 'Tum Se Hi',
  artistName = 'Mohit Chauhan',
  albumName = 'Jab We Met',
  trackIndex = '2 of 5',
  mediaUrl,
  audioPreviewUrl,
  mediaType = 'image',
  mediaFilter = 'none',
  showMsnBadge = true,
  handle = '@DEPRESSIVOS2000',
  className = '',
  isFullCanvas = false,
}) => {
  // 1. Resolve official album cover
  const albumCoverSrc = resolveAlbumCover(songTitle, artistName, albumName, mediaUrl || undefined);

  // 2. Resolve official audio preview stream (.m4a / Apple Music CDN)
  const audioSrc = resolveAudioPreview(songTitle, artistName, albumName, audioPreviewUrl || undefined);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30); // iTunes previews are 30s
  const [audioError, setAudioError] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Sync audio source when song/artist changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setElapsed(0);
      setAudioError(false);

      if (hasInteracted) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [audioSrc]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setElapsed(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setElapsed(0);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn('Audio playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * (duration || 30);
    audio.currentTime = targetTime;
    setElapsed(targetTime);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRemaining = (secs: number): string => {
    const rem = Math.max(0, (duration || 30) - secs);
    const m = Math.floor(rem / 60);
    const s = Math.floor(rem % 60);
    return `-${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (elapsed / (duration || 30)) * 100));

  return (
    <div className={`relative w-full h-full flex flex-col justify-between select-none ${className}`}>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        playsInline
      />

      {/* ============================================================ */}
      {/* A MOLDURA PRETA DA TELA DO IPOD (BEZEL FINO E CHANFRADO) */}
      {/* ============================================================ */}
      <div className="w-full h-full bg-[#0A0D14] p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-[inset_0_4px_16px_rgba(0,0,0,0.95),0_10px_30px_rgba(0,0,0,0.45)] relative overflow-hidden border-2 border-black/80 flex flex-col justify-between">
        
        {/* ============================================================ */}
        {/* INTERIOR DA TELA DO IPOD (DISPLAY LCD RETRÔ ANOS 2000) */}
        {/* ============================================================ */}
        <div className="w-full h-full bg-white rounded-xl overflow-hidden flex flex-col justify-between shadow-sm relative border border-gray-300">
          
          {/* 1. STATUS HEADER BAR: 9:23 AM • PLAY/PAUSE BUTTON • BATTERY */}
          <div className="ipod-header-gloss px-5 md:px-8 py-3 md:py-4 border-b border-[#A6B0BE] flex items-center justify-between shadow-sm select-none shrink-0">
            {/* Relógio Digital */}
            <span className="font-sans font-black text-base md:text-2xl text-black tracking-tight flex items-center gap-2">
              <span>9:23 AM</span>
              {isPlaying && (
                <span className="text-[10px] md:text-xs font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow animate-pulse">
                  <Volume2 className="w-3 h-3" />
                  <span>ÁUDIO REAL</span>
                </span>
              )}
            </span>

            {/* Controles Direita: Play/Pause, Mute e Bateria */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Botão de Som / Mudo */}
              <button
                onClick={toggleMute}
                className="text-gray-700 hover:text-black transition p-1 focus:outline-none"
                title={isMuted ? 'Desmutar Áudio' : 'Mutar Áudio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                )}
              </button>

              {/* Botão de Play / Pause */}
              <button 
                onClick={togglePlay}
                className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full transition-all focus:outline-none cursor-pointer shadow-sm ${
                  isPlaying 
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
                title={isPlaying ? 'Pausar Áudio Oficial' : 'Ouvir Música Oficial (Play)'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 md:w-4 md:h-4 fill-black ml-0.5" />
                )}
              </button>

              {/* Bateria com contorno preto e preenchimento verde clássico */}
              <div className="flex items-center">
                <div className="w-8 md:w-10 h-4 md:h-5 bg-white border-2 border-gray-800 rounded-[3px] p-[1.5px] flex items-center shadow-inner">
                  <div className="w-full h-full bg-[#34C759] rounded-[1px]" />
                </div>
                <div className="w-[3px] h-2 md:h-2.5 bg-gray-800 rounded-r-[1.5px]" />
              </div>
            </div>
          </div>

          {/* 2. ÁREA CENTRAL: CAPA DO ÁLBUM COM REFLEXO + INFORMAÇÕES DA MÚSICA */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-b from-white via-white to-[#F6F8FA] relative">
            
            {/* Banner Chamativo de Reprodução de Áudio */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between gap-2 text-xs md:text-sm font-bold font-mono transition shadow ${
                  isPlaying
                    ? 'bg-blue-900/10 border-blue-600 text-blue-700'
                    : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-400 text-yellow-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isPlaying ? (
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-ping shrink-0" />
                  ) : (
                    <Play className="w-4 h-4 fill-yellow-600 text-yellow-600 shrink-0" />
                  )}
                  <span className="truncate">
                    {isPlaying
                      ? `Tocando Áudio Oficial: ${songTitle}`
                      : 'Clique aqui para OUVIR A MÚSICA OFICIAL (Áudio Real)'}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs font-mono uppercase bg-black text-white px-2 py-0.5 rounded font-bold shrink-0">
                  {isPlaying ? 'PAUSAR' : 'TOCAR AGORA ▶'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-6 md:gap-10">
              
              {/* Capa com Reflexo de Piso Espelhado e Botão de Play sobre a Imagem */}
              <div 
                onClick={togglePlay}
                className="w-40 h-40 md:w-64 md:h-64 shrink-0 rounded-lg overflow-hidden shadow-xl border-2 border-gray-300 relative ipod-reflect bg-[#1C2333] flex items-center justify-center group cursor-pointer"
                title="Clique na capa para tocar/pausar a música"
              >
                {mediaUrl && mediaType === 'video' ? (
                  <video 
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${mediaFilter}`}
                  />
                ) : (
                  <img 
                    src={albumCoverSrc}
                    alt={`${albumName || songTitle} Cover`}
                    className={`w-full h-full object-cover ${mediaFilter} group-hover:scale-105 transition-transform duration-300`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/c7/43/3dc74387-e7f4-2342-397c-4cf2037c69a5/8902894623223_cover.jpg/600x600bb.jpg';
                    }}
                  />
                )}

                {/* Brilho de vidro e reflexo glossy clássico dos anos 2000 */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-black/10" />
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

                {/* Overlay com Ícone de Play ao passar o mouse ou quando pausado */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-80 group-hover:opacity-90'}`}>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 shadow-2xl flex items-center justify-center text-blue-600 transform group-hover:scale-110 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-6 h-6 md:w-8 md:h-8 fill-blue-600" />
                    ) : (
                      <Play className="w-6 h-6 md:w-8 md:h-8 fill-blue-600 ml-1" />
                    )}
                  </div>
                </div>
              </div>

              {/* Informações da Música (Hierarquia Fiel à Tela do iPod) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center text-left font-sans pl-2 md:pl-4">
                
                {/* Nome da Música (Negrito e Grande) */}
                <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl text-black leading-tight truncate">
                  {songTitle}
                </h1>

                {/* Nome do Artista (Cinza Escuro Médio) */}
                <h2 className="text-lg md:text-2xl lg:text-3xl font-medium text-[#4B5563] mt-1.5 md:mt-2.5 truncate">
                  {artistName}
                </h2>

                {/* Nome do Álbum (Cinza Suave) */}
                <h3 className="text-base md:text-xl lg:text-2xl font-normal text-[#6B7280] mt-1 md:mt-2 truncate">
                  {albumName}
                </h3>

                {/* Contador de Faixas (ex: 2 of 5) e Badge Oficial */}
                <div className="flex items-center gap-3 mt-4 md:mt-6">
                  <span className="text-sm md:text-lg font-medium text-[#9CA3AF]">
                    {trackIndex}
                  </span>
                  <span className="text-[10px] md:text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    ÁUDIO REAL • AAC 256KBPS
                  </span>
                </div>

              </div>

            </div>

            {/* 3. SCRUBBER BAR AZUL COM MOVIMENTO AO VIVO E CONTADORES DE TEMPO */}
            <div className="mt-6 md:mt-10 pt-2">
              
              {/* Barra de Progresso Azul com Gradiente Clássico do iPod */}
              <div 
                className="w-full h-4 md:h-6 bg-[#E2E8F0] rounded-sm border border-[#B8C0CA] p-[1.5px] shadow-inner flex overflow-hidden relative cursor-pointer group"
                onClick={handleSeek}
                title="Clique na barra para navegar pelo áudio"
              >
                <div 
                  className="h-full ipod-scrubber-blue rounded-l-[1px] transition-all duration-200 ease-linear shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Contadores de Tempo Dinâmicos (Passando em tempo real com o áudio) */}
              <div className="flex justify-between items-center text-sm md:text-xl font-bold text-black font-sans mt-2.5 md:mt-3 px-1">
                {/* Tempo Decorrido */}
                <span className="tabular-nums font-black">{formatTime(elapsed)}</span>

                {/* Equalizador Animado quando Tocando */}
                <div className="flex items-end gap-1 h-3.5 md:h-4 opacity-70">
                  <span className={`w-1 h-full bg-[#108BEA] ${isPlaying ? 'animate-bounce' : 'h-1/3'}`} />
                  <span className={`w-1 h-2/3 bg-[#108BEA] ${isPlaying ? 'animate-pulse' : 'h-1/2'}`} />
                  <span className={`w-1 h-4/5 bg-[#108BEA] ${isPlaying ? 'animate-bounce' : 'h-2/3'}`} />
                  <span className={`w-1 h-1/2 bg-[#108BEA] ${isPlaying ? 'animate-pulse' : 'h-1/4'}`} />
                </div>

                {/* Tempo Restante */}
                <span className="tabular-nums text-gray-800 font-bold">{formatRemaining(elapsed)}</span>
              </div>

            </div>

          </div>

          {/* 4. FOOTER / NOTIFICAÇÃO VINTAGE MSN MESSENGER (ANOS 2000) */}
          {showMsnBadge && (
            <div className="bg-[#FFFDF5] border-t-2 border-[#1A1A1A] px-4 md:px-6 py-2.5 flex items-center justify-between font-mono text-xs md:text-sm text-[#1A1A1A] shrink-0">
              <div className="flex items-center gap-2 font-bold text-[#0000FF] truncate">
                <span className={`w-2.5 h-2.5 rounded-full bg-[#00FF66] border border-black inline-block shrink-0 ${isPlaying ? 'animate-ping' : ''}`} />
                <span className="truncate">MSN MESSENGER 7.5 • (8) {artistName} - {songTitle}</span>
              </div>
              <div className="text-[11px] md:text-xs text-gray-500 italic hidden sm:block shrink-0">
                &quot;{isPlaying ? 'ouvindo no talo...' : 'offline pra quem eu não quero falar...'}&quot;
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Top watermark handle */}
      {handle && (
        <div className="absolute top-4 right-6 font-mono text-xs md:text-sm font-bold text-gray-400 z-30 pointer-events-none">
          {handle}
        </div>
      )}

    </div>
  );
};
