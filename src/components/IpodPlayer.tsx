import React, { useState, useEffect, useRef } from 'react';
import { resolveAlbumCover, resolveAudioPreview } from '../data/albumCovers';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface IpodPlayerProps {
  songTitle?: string;
  artistName?: string;
  albumName?: string;
  trackIndex?: string; // e.g. "2 of 5"
  mediaUrl?: string;
  audioPreviewUrl?: string;
  mediaType?: 'image' | 'video';
  mediaFilter?: string;
  showEarbuds?: boolean;
  showMsnBadge?: boolean;
  handle?: string;
  className?: string;
  scale?: number;
}

export const IpodPlayer: React.FC<IpodPlayerProps> = ({
  songTitle = 'Tum Se Hi',
  artistName = 'Mohit Chauhan',
  albumName = 'Jab We Met',
  trackIndex = '2 of 5',
  mediaUrl,
  audioPreviewUrl,
  mediaType = 'image',
  mediaFilter = 'none',
  showEarbuds = true,
  showMsnBadge = true,
  handle = '@DEPRESSIVOS2000',
  className = '',
}) => {
  // Resolve official album cover & audio preview
  const albumCoverSrc = resolveAlbumCover(songTitle, artistName, albumName, mediaUrl);
  const audioSrc = resolveAudioPreview(songTitle, artistName, albumName, audioPreviewUrl);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setElapsed(0);

      if (hasInteracted) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [audioSrc]);

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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
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
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback blocked/failed:', err);
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

  // Format seconds to mm:ss
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRemaining = (secs: number): string => {
    const rem = Math.max(0, (duration || 30) - secs);
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    return `-${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (elapsed / (duration || 30)) * 100));

  return (
    <div className={`relative w-full flex items-center justify-center p-4 md:p-8 select-none ${className}`}>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        playsInline
      />

      {/* ============================================================ */}
      {/* OS CLÁSSICOS FONES BRANCOS DO IPOD (EARBUDS ANOS 2000) */}
      {/* ============================================================ */}
      {showEarbuds && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-95">
          {/* Fio do Fone Esquerdo com Curva Orgânica */}
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 280 20 C 180 80, 140 220, 220 340 S 300 480, 360 520"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            />
            <path
              d="M 520 20 C 620 90, 660 260, 580 380 S 480 480, 440 520"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            />
          </svg>

          {/* Fone Esquerdo (Earbud Cápsula Branca com Grade Cinza) */}
          <div className="absolute top-2 left-60 w-9 h-14 bg-gradient-to-br from-white via-[#F0F2F5] to-[#D8DCE3] rounded-full shadow-[0_6px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_white] border border-gray-300 transform -rotate-45 flex flex-col items-center justify-start pt-1">
            <div className="w-5 h-5 rounded-full bg-[#374151] border-2 border-gray-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            </div>
            <div className="w-1.5 h-6 bg-white rounded-full mt-1 shadow-sm" />
          </div>

          {/* Fone Direito (Earbud Cápsula Branca com Grade Cinza) */}
          <div className="absolute top-2 right-60 w-9 h-14 bg-gradient-to-bl from-white via-[#F0F2F5] to-[#D8DCE3] rounded-full shadow-[0_6px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_white] border border-gray-300 transform rotate-45 flex flex-col items-center justify-start pt-1">
            <div className="w-5 h-5 rounded-full bg-[#374151] border-2 border-gray-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            </div>
            <div className="w-1.5 h-6 bg-white rounded-full mt-1 shadow-sm" />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CORPO PRINCIPAL DO IPOD (CHASSI BRANCO + AÇO POLIDO 3D) */}
      {/* ============================================================ */}
      <div className="relative z-10 w-[360px] md:w-[420px] rounded-[44px] bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] p-4 md:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.8),inset_0_1px_3px_rgba(255,255,255,1),inset_0_-4px_12px_rgba(0,0,0,0.08)] border-4 border-[#D2D8E2]">
        
        {/* Aço Inoxidável Polido nas Bordas Laterais do Chassi */}
        <div className="w-full h-full rounded-[38px] bg-gradient-to-b from-[#FAFAFA] to-[#F1F3F5] p-3 md:p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
          
          <div className="flex flex-col items-center">

            {/* ======================================================== */}
            {/* A TELA DO IPOD (DISPLAY LCD RETRÔ 4:3 DOS ANOS 2000) */}
            {/* ======================================================== */}
            <div className="w-full aspect-[4/3] bg-[#0A0D14] p-2.5 md:p-3.5 rounded-2xl shadow-[inset_0_3px_12px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,0,0,0.25)] border border-black relative overflow-hidden flex flex-col justify-between">
              
              {/* Moldura Interna do Display de LCD */}
              <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between shadow-inner relative">
                
                {/* 1. Header do iPod: 9:23 AM • Play Icon • Battery Bar */}
                <div className="ipod-header-gloss px-3 py-1.5 border-b border-[#A6B0BE] flex items-center justify-between shadow-sm select-none">
                  <span className="font-sans font-black text-xs md:text-sm text-black tracking-tight">
                    9:23 AM
                  </span>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="focus:outline-none">
                      {isMuted ? (
                        <VolumeX className="w-3 h-3 text-red-500" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-blue-600" />
                      )}
                    </button>

                    <button 
                      onClick={togglePlay}
                      className="focus:outline-none"
                      title={isPlaying ? 'Pausar' : 'Tocar'}
                    >
                      <span 
                        className={`text-[#108BEA] text-xs font-black transition-opacity ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                      >
                        ▶
                      </span>
                    </button>

                    <div className="flex items-center">
                      <div className="w-6 h-3 bg-white border border-gray-800 rounded-[2px] p-[1px] flex items-center shadow-inner">
                        <div className="w-full h-full bg-[#34C759] rounded-[1px]" />
                      </div>
                      <div className="w-[2px] h-1.5 bg-gray-800 rounded-r-[1px]" />
                    </div>
                  </div>
                </div>

                {/* 2. Área Central: Capa Oficial + Metadados da Música */}
                <div className="flex-1 p-3 flex flex-col justify-center bg-gradient-to-b from-white to-[#F6F8FA]">
                  
                  <div className="flex items-center gap-3.5">
                    
                    {/* Capa com Reflexo de Piso Espelhado */}
                    <div 
                      onClick={togglePlay}
                      className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded overflow-hidden shadow-md border border-gray-300 relative ipod-reflect bg-[#1C2333] flex items-center justify-center cursor-pointer group"
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
                          className={`w-full h-full object-cover ${mediaFilter}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/c7/43/3dc74387-e7f4-2342-397c-4cf2037c69a5/8902894623223_cover.jpg/600x600bb.jpg';
                          }}
                        />
                      )}

                      {/* Glossy reflex */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 via-transparent to-black/10" />

                      {/* Play overlay */}
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-80'}`}>
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white text-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Informações da Música */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center text-left font-sans">
                      
                      {/* Song Title (Bold) */}
                      <h1 className="font-bold text-base md:text-lg text-black leading-tight truncate">
                        {songTitle}
                      </h1>

                      {/* Artist Name */}
                      <h2 className="text-xs md:text-sm font-medium text-[#4B5563] mt-0.5 truncate">
                        {artistName}
                      </h2>

                      {/* Album Name */}
                      <h3 className="text-xs md:text-sm font-normal text-[#6B7280] mt-0.5 truncate">
                        {albumName}
                      </h3>

                      {/* Track Counter (e.g. "2 of 5") */}
                      <div className="text-[11px] font-medium text-[#9CA3AF] mt-2 flex items-center gap-2">
                        <span>{trackIndex}</span>
                        <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                          AAC 256K
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* 3. Live Animated Scrubber Bar & Dynamic Timers */}
                  <div className="mt-4 pt-1">
                    
                    {/* Blue Scrubber Bar */}
                    <div 
                      className="w-full h-3 bg-[#E2E8F0] rounded-sm border border-[#B8C0CA] p-[1px] shadow-inner flex overflow-hidden relative cursor-pointer"
                      onClick={() => {
                        const audio = audioRef.current;
                        if (audio) {
                          audio.currentTime = (audio.currentTime + 10) % (duration || 30);
                        }
                      }}
                      title="Clique para avançar 10s"
                    >
                      <div 
                        className="h-full ipod-scrubber-blue rounded-l-[1px] transition-all duration-200 ease-linear"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Timers below scrubber */}
                    <div className="flex justify-between items-center text-[11px] font-bold text-black font-sans mt-1 px-0.5">
                      <span className="tabular-nums">{formatTime(elapsed)}</span>

                      <div className="flex items-end gap-0.5 h-2.5 opacity-60">
                        <span className={`w-0.5 h-full bg-[#108BEA] ${isPlaying ? 'animate-bounce' : 'h-1/2'}`} />
                        <span className={`w-0.5 h-2/3 bg-[#108BEA] ${isPlaying ? 'animate-pulse' : 'h-1/3'}`} />
                        <span className={`w-0.5 h-4/5 bg-[#108BEA] ${isPlaying ? 'animate-bounce' : 'h-2/3'}`} />
                      </div>

                      <span className="tabular-nums text-gray-800">{formatRemaining(elapsed)}</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ======================================================== */}
            {/* IPOD WHITE CLICK WHEEL */}
            {/* ======================================================== */}
            <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full bg-[#FFFFFF] shadow-[0_6px_22px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-3px_6px_rgba(0,0,0,0.06)] border border-[#CCD1D9] relative flex items-center justify-center select-none mt-6">
              
              {/* MENU Button (Top) */}
              <button 
                className="absolute top-3 text-xs md:text-sm font-sans font-black text-[#8B939E] tracking-wider uppercase hover:text-black transition-colors"
                onClick={togglePlay}
              >
                MENU
              </button>

              {/* Rewind Button (Left) */}
              <button 
                className="absolute left-3.5 text-xs md:text-sm font-sans font-black text-[#8B939E] hover:text-black transition-colors"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                  }
                }}
              >
                |◀◀
              </button>

              {/* Forward Button (Right) */}
              <button 
                className="absolute right-3.5 text-xs md:text-sm font-sans font-black text-[#8B939E] hover:text-black transition-colors"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                  }
                }}
              >
                ▶▶|
              </button>

              {/* Play/Pause Button (Bottom) */}
              <button 
                className="absolute bottom-3 text-xs md:text-sm font-sans font-black text-[#8B939E] hover:text-black transition-colors flex items-center gap-1"
                onClick={togglePlay}
              >
                {isPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
              </button>

              {/* Concave Center Button */}
              <div 
                className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#F4F7FA] to-[#DFE4EA] border border-[#CCD2DC] shadow-[0_2px_4px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
                onClick={togglePlay}
                title="Clique para Tocar/Pausar a Música"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-500 fill-gray-400" />
                ) : (
                  <Play className="w-5 h-5 text-gray-500 fill-gray-400 ml-0.5" />
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* VINTAGE MSN MESSENGER NOTIFICATION BADGE (ANOS 2000) */}
      {/* ============================================================ */}
      {showMsnBadge && (
        <div className="absolute bottom-2 md:bottom-4 left-4 right-4 md:left-auto md:right-6 z-40 max-w-sm bg-[#FFFDF5] border-2 border-[#1A1A1A] p-2.5 rounded-lg shadow-[6px_6px_0px_#0000FF] font-mono text-xs text-[#1A1A1A]">
          <div className="flex items-center gap-2 border-b border-gray-300 pb-1 mb-1 font-bold text-[11px] text-[#0000FF]">
            <span className={`w-2.5 h-2.5 rounded-full bg-[#00FF66] border border-black inline-block ${isPlaying ? 'animate-ping' : ''}`} />
            <span>MSN MESSENGER 7.5 • (8) {isPlaying ? 'OUVINDO AGORA' : 'STATUS'}</span>
          </div>
          <div className="text-[11px] truncate">
            <span className="font-bold text-[#1A1A1A]">{artistName}</span> - {songTitle}
          </div>
          <div className="text-[9px] text-gray-500 italic mt-0.5 truncate">
            status: &quot;{isPlaying ? 'ouvindo no volume máximo 🎧' : 'offline pra quem eu não quero falar...'}&quot;
          </div>
        </div>
      )}

      {/* Top watermark handle */}
      {handle && (
        <div className="absolute top-2 right-4 font-mono text-[11px] font-bold text-gray-500 z-10">
          {handle}
        </div>
      )}

    </div>
  );
};
