import React from 'react';
import { MediaDisplayMode, MediaFilterType } from '../types';
import { IpodPlayer } from './IpodPlayer';
import { IpodScreen } from './IpodScreen';

interface MediaAttachmentProps {
  mediaUrl?: string;
  audioPreviewUrl?: string | null;
  displayMode: MediaDisplayMode;
  filter?: MediaFilterType;
  caption?: string;
  shadowColor?: string;
  borderWidth?: number;
  mediaType?: 'image' | 'video';
}

export const MediaAttachment: React.FC<MediaAttachmentProps> = ({
  mediaUrl,
  audioPreviewUrl,
  displayMode,
  filter = 'none',
  caption,
  shadowColor = '#0000FF',
  borderWidth = 10,
  mediaType = 'image',
}) => {
  if (displayMode === 'none') return null;

  // Filter styles
  const getFilterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'vintage-2000':
        return { filter: 'sepia(0.35) contrast(1.2) brightness(0.95) saturate(1.4)' };
      case 'grayscale':
        return { filter: 'grayscale(1) contrast(1.3)' };
      case 'pixelate':
        return { imageRendering: 'pixelated', filter: 'contrast(1.4) saturate(1.2)' };
      case 'contrast-high':
        return { filter: 'contrast(1.6) brightness(1.05)' };
      case 'none':
      default:
        return {};
    }
  };

  // Helper to render either video or image or retro fallback screen
  const renderMediaElement = (className = "w-full h-full object-cover", customStyle: React.CSSProperties = {}, fallbackType = 'general') => {
    const combinedStyle = { ...getFilterStyle(), ...customStyle };

    if (mediaUrl) {
      const isVideo = mediaType === 'video' || mediaUrl.startsWith('data:video') || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');
      if (isVideo) {
        return (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className={className}
            style={combinedStyle}
          />
        );
      }

      return (
        <img
          src={mediaUrl}
          alt={caption || "Mídia Anos 2000"}
          className={className}
          style={combinedStyle}
        />
      );
    }

    // ==========================================
    // RETRO FALLBACK SCREENS (QUANDO NÃO HÁ MÍDIA)
    // ==========================================
    if (fallbackType === 'monitor') {
      return (
        <div className="w-full h-full bg-[#008080] p-4 flex flex-col justify-between font-mono select-none relative overflow-hidden">
          {/* Windows 98 Desktop Icons */}
          <div className="flex flex-col gap-3 z-10">
            <div className="flex items-center gap-2 text-white text-[10px] font-bold">
              <span className="text-xl">💻</span>
              <span className="bg-[#000080] px-1">Meu Computador</span>
            </div>
            <div className="flex items-center gap-2 text-white text-[10px] font-bold">
              <span className="text-xl">🗑️</span>
              <span>Lixeira (Expectativas)</span>
            </div>
            <div className="flex items-center gap-2 text-white text-[10px] font-bold">
              <span className="text-xl">🌐</span>
              <span>Internet Explorer 5.0</span>
            </div>
          </div>

          {/* Center Error Box */}
          <div className="bg-[#C0C0C0] border-2 border-white border-r-[#404040] border-b-[#404040] p-2.5 shadow-lg max-w-[280px] mx-auto z-20">
            <div className="bg-[#000080] text-white px-2 py-0.5 text-[9px] font-bold flex justify-between">
              <span>ALERTA_DE_SISTEMA.EXE</span>
              <span>✕</span>
            </div>
            <div className="p-2 flex items-center gap-2 text-black text-[10px]">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold">Memória Insuficiente</p>
                <p className="text-[8px] text-gray-700">Adicione seu vídeo/foto no painel</p>
              </div>
            </div>
          </div>

          {/* Taskbar */}
          <div className="bg-[#C0C0C0] border-t-2 border-white px-2 py-0.5 flex justify-between items-center text-[9px] text-black font-bold z-10">
            <div className="bg-[#C0C0C0] border border-white border-r-gray-700 border-b-gray-700 px-2 py-0.5 flex items-center gap-1">
              <span>🏁</span> Iniciar
            </div>
            <div className="border border-gray-700 border-r-white border-b-white px-1.5 py-0.5">
              03:42 AM
            </div>
          </div>
        </div>
      );
    }

    if (fallbackType === 'phone') {
      return (
        <div className="w-full h-full bg-[#99C5B5] p-3 flex flex-col justify-between font-mono text-[#143628] select-none">
          <div className="text-[8px] font-bold flex justify-between border-b border-[#143628]/30 pb-0.5">
            <span>SMS RECEBIDO</span>
            <span>01/01</span>
          </div>
          <div className="my-auto text-center px-1">
            <p className="text-[10px] font-black leading-tight">
              "Você já tentou não pensar em nada para ver se a vida melhora?"
            </p>
            <span className="text-[7px] opacity-75 mt-1 block">Remetente: Desespero</span>
          </div>
          <div className="flex justify-between text-[7px] font-bold border-t border-[#143628]/30 pt-0.5">
            <span>[Responder]</span>
            <span>[Apagar]</span>
          </div>
        </div>
      );
    }

    if (fallbackType === 'tv') {
      return (
        <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-center font-mono relative overflow-hidden select-none">
          {/* SMPTE Color Bars */}
          <div className="absolute inset-0 grid grid-cols-7 opacity-80">
            <div className="bg-[#C0C0C0]" />
            <div className="bg-[#C0C000]" />
            <div className="bg-[#00C0C0]" />
            <div className="bg-[#00C000]" />
            <div className="bg-[#C000C0]" />
            <div className="bg-[#C00000]" />
            <div className="bg-[#0000C0]" />
          </div>
          {/* Center Card */}
          <div className="relative z-20 bg-black/85 text-white border-2 border-white px-4 py-2 text-center shadow-lg">
            <div className="font-impact text-sm tracking-widest text-[#00FF66]">
              DEPRESSIVOS 2000
            </div>
            <div className="text-[9px] text-yellow-300 font-bold mt-0.5">
              FORA DO AR • TRANSMISSÃO SUSPENSA
            </div>
            <div className="text-[7px] text-gray-400 mt-0.5">
              Insira seu vídeo/mídia no menu lateral
            </div>
          </div>
        </div>
      );
    }

    if (fallbackType === 'gameboy') {
      return (
        <div className="w-full h-full bg-[#8B956D] p-3 flex flex-col justify-between font-mono text-[#1F2416] select-none">
          <div className="flex justify-between text-[8px] font-bold border-b border-[#1F2416]/40 pb-0.5">
            <span>SCORE: 00000</span>
            <span>LV: 30</span>
          </div>
          <div className="my-auto text-center">
            <div className="font-impact text-base tracking-widest leading-none mb-1">
              GAME OVER
            </div>
            <p className="text-[9px] font-bold">FASE ADULTA FALHOU</p>
            <p className="text-[7px] opacity-80 mt-1 animate-pulse">PRESS START TO RESTART</p>
          </div>
          <div className="text-[7px] text-center font-bold">
            © 2000 DEPRESSIVOS CORP
          </div>
        </div>
      );
    }

    if (fallbackType === 'mp3') {
      return (
        <div className="w-full h-full bg-[#0D1826] p-3 flex flex-col justify-between font-mono text-[#38BDF8] select-none">
          <div className="text-[8px] font-bold flex justify-between border-b border-[#38BDF8]/30 pb-0.5">
            <span>01. CPM 22</span>
            <span>03:42</span>
          </div>
          <div className="my-auto text-center">
            <div className="text-xl mb-1">💿</div>
            <p className="text-[10px] font-bold text-white truncate">
              Um Minuto Para o Fim do Mundo
            </p>
            <p className="text-[8px] opacity-75">Felicidade_Acabou.mp3</p>
          </div>
          {/* Animated Waveform */}
          <div className="flex justify-center items-end gap-1 h-5">
            {[40, 70, 100, 60, 85, 45, 90, 65, 30].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#38BDF8] rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-black/90 flex flex-col items-center justify-center text-center p-4 font-mono text-white">
        <span className="text-2xl mb-1">📷</span>
        <span className="text-xs font-bold text-yellow-400">ESPAÇO PARA SUA MÍDIA</span>
        <span className="text-[9px] text-gray-400 mt-1">Carregue imagem ou vídeo no painel lateral</span>
      </div>
    );
  };

  // ============================================================
  // 1. MODO BACKGROUND
  // ============================================================
  if (displayMode === 'background') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25 mix-blend-luminosity">
        {renderMediaElement("w-full h-full object-cover")}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/70" />
      </div>
    );
  }

  // ============================================================
  // 2. TV DE TUBO COM VHS (ESTILO QUASAR / BEGE COM ADESIVOS) — CSS ART
  // ============================================================
  if (displayMode === 'tv-vhs') {
    return (
      <div className="w-full max-w-[880px] mx-auto my-6 select-none relative z-10">
        {/* Adesivos Flutuantes / Colados no topo da TV */}
        <div className="absolute -top-3 left-10 z-30 transform -rotate-12 bg-yellow-300 text-black font-mono font-black text-[10px] px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#1A1A1A]">
          ⭐ GRAVAÇÃO 2000 ⭐
        </div>
        <div className="absolute -top-4 right-14 z-30 transform rotate-6 bg-pink-500 text-white font-mono font-black text-[10px] px-2.5 py-0.5 border-2 border-black shadow-[3px_3px_0px_#1A1A1A] flex items-center gap-1">
          <span>❤️</span> VHS REWIND
        </div>

        {/* Carcaça Externa (Chassi Plástico Bege #E0E0D8 com Chanfros 3D) */}
        <div className="bg-[#E0E0D8] p-6 md:p-8 rounded-3xl border-t-[10px] border-l-[10px] border-t-white border-l-white border-b-[12px] border-r-[12px] border-b-[#9C988F] border-r-[#9C988F] shadow-[22px_22px_0px_#1A1A1A] relative">
          
          {/* Adesivos colados na carcaça */}
          <div className="absolute bottom-16 left-4 z-20 transform -rotate-6 text-xl opacity-90 filter drop-shadow">
            ⭐
          </div>
          <div className="absolute top-12 right-4 z-20 transform rotate-12 text-lg opacity-90 filter drop-shadow">
            🌸
          </div>
          <div className="absolute bottom-24 right-5 z-20 transform rotate-45 text-base opacity-90 filter drop-shadow">
            ✨
          </div>

          {/* Top Bevel & Ventilação & Marca Quasar */}
          <div className="flex justify-between items-center mb-3 px-3">
            <div className="flex items-center gap-2">
              <span className="font-impact text-sm text-[#3E3C38] tracking-widest uppercase">
                QUASAR
              </span>
              <span className="font-mono text-[10px] text-gray-500 font-bold bg-[#D3D0C7] px-1.5 py-0.2 rounded">
                VHS HQ 4-HEAD
              </span>
            </div>
            <div className="flex gap-1.5">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="w-3.5 h-1 bg-[#B5B1A6] rounded-full border-b border-white" />
              ))}
            </div>
            <span className="font-mono text-[10px] font-bold text-[#636059] tracking-wider uppercase">
              DEPRESSIVOS 2000
            </span>
          </div>

          {/* Moldura Interna da Tela (Bezel Cinza Escuro #2A2A2A Chanfrado) */}
          <div className="bg-[#2A2A2A] p-4 md:p-6 rounded-2xl border-t-[8px] border-l-[8px] border-t-[#141414] border-l-[#141414] border-b-[8px] border-r-[8px] border-b-[#4A4A4A] border-r-[#4A4A4A] shadow-inner">
            
            {/* Display de Tubo com Curvatura e Scanlines */}
            <div className="relative aspect-[4/3] max-h-[380px] w-full bg-black rounded-2xl overflow-hidden border-2 border-black flex items-center justify-center">
              {/* Conteúdo de Mídia */}
              {renderMediaElement("w-full h-full object-cover", {}, 'tv')}

              {/* Camada CRT: Scanlines Listradas */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-35"
                style={{
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1.5px, transparent 2px, transparent 4px)',
                }}
              />

              {/* Camada CRT: Reflexo Curvo do Vidro (Radial Gradient) */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 45%, transparent 75%), radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.65) 100%)',
                }}
              />

              {/* Selo OSD de VCR VHS */}
              <div className="absolute top-3 left-4 flex flex-col gap-0.5 z-20">
                <div className="text-[#00FF66] font-mono text-xs font-bold bg-black/75 px-2 py-0.5 border border-[#00FF66]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                  <span>PLAY ▶ SP 0:14:28</span>
                </div>
                <div className="text-[#00FF66]/80 font-mono text-[9px] bg-black/60 px-1.5">
                  CH 03 • AUTO TRACKING
                </div>
              </div>

              <div className="absolute bottom-3 right-4 bg-black/80 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 border border-yellow-300/40 z-20">
                HI-FI STEREO
              </div>
            </div>
          </div>

          {/* PAINEL INFERIOR: ENTRADA VHS + BOTÕES FÍSICOS 3D + CONECTORES RCA */}
          <div className="mt-4 pt-4 border-t-2 border-[#C5C1B8] grid grid-cols-12 gap-3 items-center font-mono">
            
            {/* Entrada Retangular de Fita VHS */}
            <div className="col-span-12 md:col-span-6 bg-[#181818] p-2 rounded-lg border-2 border-[#101010] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66] animate-pulse" />
                <span className="text-[9px] font-bold text-gray-300 tracking-wider">
                  [ 📼 INSERT VHS CASSETTE ]
                </span>
              </div>
              <span className="text-[8px] font-bold text-yellow-400 border border-yellow-400/50 px-1 rounded">
                HQ AUTO HEAD CLEANER
              </span>
            </div>

            {/* Botões do VCR (Eject, Play, Stop, Rewind, FF) */}
            <div className="col-span-7 md:col-span-4 flex items-center justify-center gap-1.5">
              {[
                { label: '⏏ EJECT', color: 'text-gray-700' },
                { label: '⏪ REW', color: 'text-gray-700' },
                { label: '▶ PLAY', color: 'text-[#0000FF] font-black' },
                { label: '■ STOP', color: 'text-red-600' },
                { label: '⏩ FF', color: 'text-gray-700' },
              ].map((btn, i) => (
                <div
                  key={i}
                  className={`bg-[#D4D0C7] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#78746B] border-r-[#78746B] px-1.5 py-1 text-[8px] font-bold ${btn.color} active:scale-95 shadow-sm cursor-pointer select-none`}
                >
                  {btn.label}
                </div>
              ))}
            </div>

            {/* Conectores RCA Frontais (Amarelo, Branco, Vermelho) e Power */}
            <div className="col-span-5 md:col-span-2 flex items-center justify-end gap-2.5">
              {/* RCA Trio */}
              <div className="flex items-center gap-1 bg-[#2C2A26] p-1.5 rounded border border-[#1A1816] shadow-inner">
                <div className="w-3 h-3 rounded-full bg-[#FFD700] border border-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" title="VIDEO IN (Amarelo)" />
                <div className="w-3 h-3 rounded-full bg-[#FFFFFF] border border-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" title="AUDIO L (Branco)" />
                <div className="w-3 h-3 rounded-full bg-[#FF2222] border border-black shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" title="AUDIO R (Vermelho)" />
              </div>

              {/* Botão Power com LED Vermelho */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_6px_#FF0000] animate-pulse mb-0.5" />
                <div className="w-8 h-4 bg-[#C5C1B8] border-t border-l border-t-white border-l-white border-b-2 border-r-2 border-b-[#68645C] border-r-[#68645C] flex items-center justify-center text-[7px] font-bold text-gray-800">
                  PWR
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pés da TV de Chão */}
        <div className="flex justify-between px-20 -mt-2">
          <div className="w-12 h-3 bg-[#8B877E] rounded-b-md border-b-2 border-black" />
          <div className="w-12 h-3 bg-[#8B877E] rounded-b-md border-b-2 border-black" />
        </div>

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/90 border border-gray-400 py-1 px-3">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 3. TV DE TUBO COM DVD (ESTILO MEMOREX / PRATA METÁLICO COM RCA) — CSS ART
  // ============================================================
  if (displayMode === 'tv-dvd') {
    return (
      <div className="w-full max-w-[880px] mx-auto my-6 select-none relative z-10">
        {/* Carcaça Externa (Chassi Prata Metálico #C0C0C0 com Sombras 3D) */}
        <div className="bg-[#C0C0C0] p-6 md:p-8 rounded-3xl border-t-[10px] border-l-[10px] border-t-[#EBEBEB] border-l-[#EBEBEB] border-b-[12px] border-r-[12px] border-b-[#6E6E6E] border-r-[#6E6E6E] shadow-[22px_22px_0px_#0000FF] relative">
          
          {/* Top Bevel & Logo Memorex / Depressivos */}
          <div className="flex justify-between items-center mb-3 px-3">
            <div className="flex items-center gap-2">
              <span className="font-impact text-sm text-[#222222] tracking-widest uppercase">
                MEMOREX
              </span>
              <span className="font-mono text-[10px] text-gray-700 font-bold bg-[#A8A8A8] px-1.5 py-0.2 rounded border border-gray-400">
                DVD / CD COMBO 2000
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-[#8E8E8E] rounded-full border-b border-white" />
              ))}
            </div>
            <span className="font-mono text-[10px] font-bold text-[#333333] tracking-wider uppercase">
              DEPRESSIVOS 2000
            </span>
          </div>

          {/* Moldura Interna da Tela (Bezel Cinza Escuro #222222 Chanfrado) */}
          <div className="bg-[#222222] p-4 md:p-6 rounded-2xl border-t-[8px] border-l-[8px] border-t-[#0D0D0D] border-l-[#0D0D0D] border-b-[8px] border-r-[8px] border-b-[#4A4A4A] border-r-[#4A4A4A] shadow-inner">
            
            {/* Display de Tubo com Curvatura e Scanlines */}
            <div className="relative aspect-[4/3] max-h-[380px] w-full bg-black rounded-2xl overflow-hidden border-2 border-black flex items-center justify-center">
              {/* Conteúdo de Mídia */}
              {renderMediaElement("w-full h-full object-cover", {}, 'tv')}

              {/* Camada CRT: Scanlines Listradas */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1.5px, transparent 2px, transparent 4px)',
                }}
              />

              {/* Camada CRT: Reflexo Curvo do Vidro */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 45%, transparent 75%), radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.65) 100%)',
                }}
              />

              {/* Selo OSD de DVD Digital */}
              <div className="absolute top-3 left-4 flex flex-col gap-0.5 z-20 font-mono">
                <div className="text-[#38BDF8] text-xs font-bold bg-black/80 px-2 py-0.5 border border-[#38BDF8]/40 flex items-center gap-1.5">
                  <span>💿 DVD VIDEO</span>
                  <span>TITLE 01/12</span>
                </div>
                <div className="text-[#38BDF8]/80 text-[9px] bg-black/60 px-1.5">
                  TIME 00:42:15 • DOLBY D 5.1
                </div>
              </div>

              <div className="absolute bottom-3 right-4 bg-black/85 text-[#00FF66] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#00FF66]/40 z-20">
                PRO SCAN 480i
              </div>
            </div>
          </div>

          {/* PAINEL INFERIOR: BANDEJA DE DVD + DISPLAY FLUORESCENTE + CONECTORES RCA */}
          <div className="mt-4 pt-4 border-t-2 border-[#A0A0A0] grid grid-cols-12 gap-3 items-center font-mono">
            
            {/* Bandeja Fina de DVD/CD */}
            <div className="col-span-12 md:col-span-5 bg-[#1C1C1C] p-2 rounded-lg border border-gray-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">💿</span>
                <span className="text-[9px] font-bold text-gray-300">
                  COMPACT DISC / DVD
                </span>
              </div>
              <div className="bg-[#333333] border border-gray-500 px-1.5 py-0.5 text-[8px] text-white font-bold rounded cursor-pointer active:scale-95">
                OPEN ⏏
              </div>
            </div>

            {/* Display Digital Fluorescente Verde */}
            <div className="col-span-6 md:col-span-3 bg-[#0A120D] border-2 border-[#1E3827] px-3 py-1.5 rounded flex items-center justify-between shadow-inner text-[#00FF66]">
              <span className="text-[9px] font-bold animate-pulse">● PLAY</span>
              <span className="text-xs font-black tracking-widest">03:14:20</span>
            </div>

            {/* Conectores RCA Frontais e Botões Metálicos */}
            <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-3">
              {/* Conectores RCA (Amarelo, Branco, Vermelho) */}
              <div className="flex items-center gap-1.5 bg-[#252525] p-1.5 rounded-md border border-[#3E3E3E] shadow-inner">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EAB308] border-2 border-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                  <span className="text-[6px] text-gray-400 mt-0.5">VIDEO</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                  <span className="text-[6px] text-gray-400 mt-0.5">L</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
                  <span className="text-[6px] text-gray-400 mt-0.5">R</span>
                </div>
              </div>

              {/* Botões Cromados de Play/Stop */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-[#D0D0D0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#606060] border-r-[#606060] flex items-center justify-center text-[9px] font-bold text-gray-800 active:scale-95 shadow cursor-pointer">
                  ▶
                </div>
                <div className="w-6 h-6 rounded-full bg-[#D0D0D0] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#606060] border-r-[#606060] flex items-center justify-center text-[9px] font-bold text-gray-800 active:scale-95 shadow cursor-pointer">
                  ■
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Base Metálica da TV */}
        <div className="w-64 h-3 mx-auto bg-[#8E8E8E] rounded-b-lg border-b-4 border-black" />

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/90 border border-gray-400 py-1 px-3">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 2. MONITOR DE TUBO BEGE (WINDOWS 95/98) — CSS ART
  // ============================================================
  if (displayMode === 'monitor-bege') {
    return (
      <div className="w-full max-w-[860px] mx-auto my-6 select-none relative z-10">
        {/* Carcaça Externa Bege com Chanfros 3D */}
        <div className="bg-[#EAE6DF] p-6 md:p-8 rounded-2xl border-t-[8px] border-l-[8px] border-t-white border-l-white border-b-[10px] border-r-[10px] border-b-[#9C988F] border-r-[#9C988F] shadow-[18px_18px_0px_#1A1A1A]">
          {/* Top Bevel & Ventilação */}
          <div className="flex justify-between items-center mb-3 px-3">
            <div className="flex gap-1.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-4 h-1.5 bg-[#B8B4AB] rounded-full border-b border-white" />
              ))}
            </div>
            <span className="font-mono text-[11px] font-bold text-[#78746B] tracking-wider uppercase">
              DEPRESSIVOS SYNCMASTER 2000
            </span>
          </div>

          {/* Moldura Interna da Tela (Bezel Rebaixado) */}
          <div className="bg-[#2C2A26] p-4 md:p-6 rounded-xl border-t-[6px] border-l-[6px] border-t-[#1A1816] border-l-[#1A1816] border-b-[6px] border-r-[6px] border-b-[#524E48] border-r-[#524E48] shadow-inner">
            {/* Display de Tubo com Curvatura e Scanlines */}
            <div className="relative aspect-[4/3] max-h-[380px] w-full bg-black rounded-lg overflow-hidden border-2 border-black flex items-center justify-center">
              {/* Conteúdo de Mídia */}
              {renderMediaElement("w-full h-full object-cover", {}, 'monitor')}

              {/* Camada CRT: Scanlines Listradas */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1px, transparent 2px, transparent 4px)',
                }}
              />

              {/* Camada CRT: Reflexo de Vidro Convexo */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 45%, transparent 70%), radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)',
                }}
              />

              {/* Selo OSD de Canal / Resolução */}
              <div className="absolute top-3 left-3 bg-black/80 text-[#00FF66] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#00FF66]/40 z-20">
                VGA 640x480 @ 60Hz
              </div>
            </div>
          </div>

          {/* Painel de Controle Inferior com Botões e Power LED */}
          <div className="mt-4 pt-3 flex items-center justify-between border-t-2 border-[#C5C1B8] px-2 font-mono">
            {/* Botões OSD em Relevo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-[#D8D4CB] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#8B877E] border-r-[#8B877E] flex items-center justify-center text-[8px] font-bold text-gray-700 active:border-inset">
                ☼
              </div>
              <div className="w-8 h-4 bg-[#D8D4CB] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#8B877E] border-r-[#8B877E] flex items-center justify-center text-[8px] font-bold text-gray-700">
                ◐
              </div>
              <div className="w-10 h-4 bg-[#D8D4CB] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#8B877E] border-r-[#8B877E] flex items-center justify-center text-[8px] font-bold text-gray-700">
                MENU
              </div>
            </div>

            {/* Logo Central da Carcaça */}
            <span className="font-impact text-xs text-[#524E48] tracking-widest uppercase">
              DEPRESSIVOS_OS
            </span>

            {/* Botão Power com LED Verde */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00] animate-pulse" />
              <div className="w-10 h-5 bg-[#C5C1B8] border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-[#68645C] border-r-[#68645C] flex items-center justify-center text-[9px] font-bold text-gray-800">
                POWER
              </div>
            </div>
          </div>
        </div>

        {/* Base do Monitor de Mesa */}
        <div className="w-48 h-5 mx-auto bg-[#D8D4CB] border-x-[6px] border-b-[6px] border-t-0 border-[#9C988F] shadow-[8px_8px_0px_#1A1A1A] flex items-center justify-center">
          <div className="w-24 h-1 bg-[#8B877E] rounded-full" />
        </div>
        <div className="w-64 h-3 mx-auto bg-[#B8B4AB] rounded-b-lg border-b-4 border-black" />

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/80 border border-gray-400 py-1 px-3 inline-block mx-auto">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 3. CELULAR TIJOLÃO / FLIP (MOTOROLA V3 / NOKIA 2000) — CSS ART
  // ============================================================
  if (displayMode === 'celular-flip') {
    return (
      <div className="w-full max-w-[420px] mx-auto my-6 select-none relative z-10">
        {/* Carcaça Metálica Grafite / Prata */}
        <div className="bg-[#23272E] p-5 rounded-3xl border-4 border-[#101216] shadow-[16px_16px_0px_#0000FF] relative">
          {/* Antena Lateral */}
          <div className="absolute -top-6 right-8 w-4 h-8 bg-[#101216] rounded-t-md border-2 border-[#3A3F4A]" />

          {/* Alto-falante Superior da Chamada */}
          <div className="w-16 h-2 mx-auto mb-3 bg-[#101216] rounded-full border-t border-[#3A3F4A]" />

          {/* Moldura da Tela LCD Retroiluminada */}
          <div className="bg-[#1A1D24] p-3 rounded-2xl border-2 border-[#3A3F4A] shadow-inner mb-4">
            {/* Barra de Status do Celular */}
            <div className="flex justify-between items-center bg-[#0D1B2A] text-[#00E5FF] px-2.5 py-1 text-[9px] font-mono font-bold border-b border-[#00E5FF]/30">
              <span className="flex items-center gap-1">
                <span>📶</span> CLARO 2005
              </span>
              <span>15:42</span>
              <span>🔋 [|||]</span>
            </div>

            {/* Tela LCD com Mídia */}
            <div className="relative aspect-[4/3] max-h-[220px] bg-black overflow-hidden border border-[#00E5FF]/40 flex items-center justify-center">
              {renderMediaElement("w-full h-full object-cover", {}, 'phone')}

              {/* Linhas LCD */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, #00E5FF 0px, #00E5FF 1px, transparent 2px, transparent 3px)',
                }}
              />

              {/* Texto OSD de Mensagem */}
              <div className="absolute bottom-1 right-1 bg-black/85 text-[#00E5FF] font-mono text-[8px] px-1.5 py-0.5 border border-[#00E5FF]/30">
                1 NOVA MSG
              </div>
            </div>

            {/* Rodapé da Tela */}
            <div className="flex justify-between text-[9px] font-mono font-bold text-gray-400 px-2 pt-1">
              <span>Opções</span>
              <span>Sair</span>
            </div>
          </div>

          {/* Tecla Central de Navegação e Teclas de Chamada */}
          <div className="flex justify-between items-center px-4 mb-3">
            <div className="w-10 h-7 bg-[#2E3440] border border-gray-600 rounded flex items-center justify-center text-[10px] font-bold text-[#00FF66] shadow-sm">
              📞
            </div>
            {/* D-Pad do Celular */}
            <div className="w-12 h-12 rounded-full bg-[#1A1D24] border-2 border-[#4C566A] flex items-center justify-center shadow-inner">
              <div className="w-5 h-5 rounded-full bg-[#4C566A] border border-white/20" />
            </div>
            <div className="w-10 h-7 bg-[#2E3440] border border-gray-600 rounded flex items-center justify-center text-[10px] font-bold text-[#FF3333] shadow-sm">
              ✖
            </div>
          </div>

          {/* Teclado Numérico Iluminado (1 a 9, *, 0, #) */}
          <div className="grid grid-cols-3 gap-2 bg-[#1A1D24] p-3 rounded-xl border border-gray-700 font-mono">
            {[
              { num: '1', sub: '.,' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '+' },
              { num: '0', sub: '␣' },
              { num: '#', sub: '⇧' },
            ].map((k) => (
              <div
                key={k.num}
                className="bg-[#2E3440] hover:bg-[#3B4252] text-[#00E5FF] p-1 rounded border border-gray-600 text-center shadow-sm"
              >
                <div className="font-bold text-xs leading-none">{k.num}</div>
                <div className="text-[7px] text-gray-400 font-sans tracking-tighter leading-none mt-0.5">
                  {k.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Microfone do Celular */}
          <div className="w-2 h-2 rounded-full bg-black mx-auto mt-3 border border-gray-600" />
        </div>

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/90 border border-gray-400 py-1 px-3">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 4. TV ANALÓGICA DE MADEIRA — CSS ART
  // ============================================================
  if (displayMode === 'tv-madeira') {
    return (
      <div className="w-full max-w-[880px] mx-auto my-6 select-none relative z-10">
        {/* Antena V de Metal no Topo */}
        <div className="relative h-10 w-48 mx-auto -mb-2">
          <div className="absolute bottom-0 left-12 w-1.5 h-12 bg-gradient-to-t from-gray-600 to-gray-300 transform -rotate-25 origin-bottom border border-black" />
          <div className="absolute bottom-0 right-12 w-1.5 h-12 bg-gradient-to-t from-gray-600 to-gray-300 transform rotate-25 origin-bottom border border-black" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-black rounded-t" />
        </div>

        {/* Gabinete de Madeira Maciça com Textura e Frisos */}
        <div
          className="p-6 md:p-8 rounded-2xl border-[10px] border-[#2A1508] shadow-[18px_18px_0px_#1A1A1A] relative"
          style={{
            background: 'linear-gradient(135deg, #6A3816 0%, #4A240C 50%, #5E3012 100%)',
          }}
        >
          {/* Friso Dourado Superior */}
          <div className="h-1.5 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-full mb-4 border border-black/40" />

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* TELA DE VIDRO CONVEXA (9 COLUNAS) */}
            <div className="col-span-12 md:col-span-9 bg-[#1F1710] p-4 rounded-2xl border-4 border-[#3D200E] shadow-inner">
              <div className="relative aspect-[4/3] max-h-[360px] w-full bg-black rounded-[2rem] overflow-hidden border-4 border-black flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
                {/* Conteúdo de Mídia */}
                {renderMediaElement("w-full h-full object-cover", {}, 'tv')}

                {/* Scanlines Fortes de TV Antiga */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-35"
                  style={{
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 2px, transparent 3px, transparent 5px)',
                  }}
                />

                {/* Reflexo Convexo de Lente de Vidro */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 50%, transparent 75%), radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.7) 100%)',
                  }}
                />

                {/* Canal Sintonizado */}
                <div className="absolute top-3 left-4 text-[#00FF66] font-mono text-xs font-bold bg-black/70 px-2 py-0.5 border border-[#00FF66]/40 z-20">
                  CANAL 04 • AV
                </div>
              </div>
            </div>

            {/* PAINEL LATERAL COM BOTÕES GIRATÓRIOS (3 COLUNAS) */}
            <div className="col-span-12 md:col-span-3 bg-[#381B09] p-4 rounded-xl border-2 border-[#1E0D03] flex flex-col items-center justify-between gap-3 text-yellow-500 font-mono shadow-inner">
              {/* Botão VHF (Canais 2 a 13) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-yellow-400 tracking-wider">VHF CANAL</span>
                <div className="w-16 h-16 rounded-full bg-[#1F1006] border-4 border-yellow-600 flex items-center justify-center shadow-lg relative my-1">
                  <div className="w-12 h-3 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-full border border-black transform rotate-45" />
                  <div className="absolute w-2 h-2 rounded-full bg-yellow-400" />
                </div>
              </div>

              {/* Botão UHF */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-yellow-400 tracking-wider">UHF / SINTONIA</span>
                <div className="w-14 h-14 rounded-full bg-[#1F1006] border-4 border-yellow-600 flex items-center justify-center shadow-lg relative my-1">
                  <div className="w-10 h-3 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-full border border-black transform -rotate-30" />
                </div>
              </div>

              {/* Grade Alto-Falante Perfurada */}
              <div className="w-full bg-[#241104] p-2 rounded border border-black flex flex-col gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1 bg-[#100702] rounded-full border-b border-yellow-800/30" />
                ))}
              </div>

              {/* Botão Power Vermelho */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600 border border-yellow-400 shadow-[0_0_6px_#FF0000] animate-pulse" />
                <span className="text-[10px] font-bold text-yellow-300">LIGADO</span>
              </div>
            </div>
          </div>

          {/* Friso Dourado Inferior */}
          <div className="h-1.5 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 rounded-full mt-4 border border-black/40" />
        </div>

        {/* Pés de Madeira da TV */}
        <div className="flex justify-between px-16 -mt-2">
          <div className="w-8 h-8 bg-[#3E200C] border-2 border-black transform rotate-12" />
          <div className="w-8 h-8 bg-[#3E200C] border-2 border-black transform -rotate-12" />
        </div>

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/90 border border-gray-400 py-1 px-3">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 5. CONSOLE PORTÁTIL (ESTILO GAMEBOY RETRO) — CSS ART
  // ============================================================
  if (displayMode === 'gameboy-retro') {
    return (
      <div className="w-full max-w-[460px] mx-auto my-6 select-none relative z-10">
        {/* Corpo de Plástico Cinza Clássico com Chanfro */}
        <div className="bg-[#D3D0C8] p-6 pb-10 rounded-2xl rounded-br-[4rem] border-t-[6px] border-l-[6px] border-t-white border-l-white border-b-[8px] border-r-[8px] border-b-[#8B877E] border-r-[#8B877E] shadow-[16px_16px_0px_#0000FF]">
          {/* Top Bevel & Ranhuras */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-[#A5A198] rounded-full" />
              ))}
            </div>
            <span className="font-mono text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              PORTÁTIL 8-BIT
            </span>
          </div>

          {/* Moldura da Tela Cinza Escura com Linhas Magenta/Azul */}
          <div className="bg-[#686874] p-4 rounded-xl rounded-bl-[2.5rem] border-4 border-[#3D3D48] mb-5 shadow-inner">
            {/* Linhas Decorativas de Topo */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_#FF0000] animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-gray-300">BATTERY</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="w-24 h-0.5 bg-[#0000FF]" />
                <div className="w-24 h-0.5 bg-[#FF007F]" />
              </div>
            </div>

            {/* Tela LCD Esverdeada Clássica */}
            <div className="relative aspect-square max-h-[240px] bg-[#8B956D] rounded border-2 border-black overflow-hidden flex items-center justify-center">
              {renderMediaElement("w-full h-full object-cover", {}, 'gameboy')}

              {/* Matriz de Pixels / Fósforo */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-25"
                style={{
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.8) 0px, rgba(0,0,0,0.8) 1px, transparent 2px, transparent 3px)',
                }}
              />

              {/* Reflexo de Vidro */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                }}
              />
            </div>

            <div className="text-center font-impact text-xs text-gray-300 tracking-wider mt-1.5 uppercase">
              DEPRESSIVOS POCKET BOY
            </div>
          </div>

          {/* Marca Gravada */}
          <div className="font-impact text-lg text-[#2B3595] italic tracking-wider mb-4 px-2">
            DEPRESSIVOS 2000
          </div>

          {/* D-Pad e Botões A/B */}
          <div className="flex items-center justify-between px-2">
            {/* D-PAD (Cruz Direcional Preta) */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-8 h-24 bg-[#1A1A1A] rounded border-t border-l border-gray-400 shadow-md" />
              <div className="absolute w-24 h-8 bg-[#1A1A1A] rounded border-t border-l border-gray-400 shadow-md" />
              <div className="absolute w-6 h-6 rounded-full bg-[#101010] border border-gray-700" />
            </div>

            {/* BOTÕES A & B (Roxos/Magenta na Diagonal) */}
            <div className="flex gap-3 transform -rotate-25 origin-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#8B1E5A] border-t-2 border-l-2 border-pink-400 border-b-2 border-r-2 border-[#4A0D2F] shadow-md active:scale-95" />
                <span className="font-mono font-bold text-xs text-gray-600 mt-1">B</span>
              </div>
              <div className="flex flex-col items-center -mt-3">
                <div className="w-10 h-10 rounded-full bg-[#8B1E5A] border-t-2 border-l-2 border-pink-400 border-b-2 border-r-2 border-[#4A0D2F] shadow-md active:scale-95" />
                <span className="font-mono font-bold text-xs text-gray-600 mt-1">A</span>
              </div>
            </div>
          </div>

          {/* Botões SELECT / START Inclinados e Grade de Som */}
          <div className="flex items-center justify-between mt-6 px-6">
            {/* Select & Start */}
            <div className="flex gap-4 transform -rotate-25">
              <div className="flex flex-col items-center">
                <div className="w-10 h-3 bg-[#78746B] rounded-full border border-black" />
                <span className="font-mono text-[8px] font-bold text-gray-600 mt-1">SELECT</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-3 bg-[#78746B] rounded-full border border-black" />
                <span className="font-mono text-[8px] font-bold text-gray-600 mt-1">START</span>
              </div>
            </div>

            {/* Grade Diagonal do Alto-Falante */}
            <div className="flex gap-1.5 transform -rotate-25">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-10 bg-[#1A1A1A] rounded-full border-t border-white/20" />
              ))}
            </div>
          </div>
        </div>

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-gray-700 bg-white/90 border border-gray-400 py-1 px-3">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 6. IPOD CLASSIC ANOS 2000 — CSS ART COM MOVIMENTO AO VIVO
  // ============================================================
  if (displayMode === 'mp3-player') {
    // Parse caption/track if provided
    const rawCaption = caption || 'Mohit Chauhan - Tum Se Hi (Jab We Met)';
    let artist = 'Mohit Chauhan';
    let track = 'Tum Se Hi';
    let album = 'Jab We Met';

    const match = rawCaption.replace(/^Tocando no (?:Winamp|MP4|MP3|iPod|MSN):\s*/i, '').match(/^(.*?)\s*[-–—]\s*(.*?)(?:\s*\((.*?)\))?$/);
    if (match) {
      artist = match[1].trim();
      track = match[2].trim();
      if (match[3]) album = match[3].trim();
    }

    return (
      <div className="w-full max-w-[560px] mx-auto my-4 select-none relative z-10">
        <IpodScreen
          songTitle={track}
          artistName={artist}
          albumName={album}
          trackIndex="2 of 5"
          mediaUrl={mediaUrl}
          audioPreviewUrl={audioPreviewUrl}
          mediaType={mediaType}
          mediaFilter={filter}
          showMsnBadge={true}
        />

        {caption && (
          <div className="mt-3 text-center font-mono font-bold text-xs text-[#1A1A1A] bg-white/95 border-2 border-black py-1.5 px-3 shadow-[4px_4px_0px_#0000FF]">
            {caption}
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // 7. WINDOWS 98 IMAGE VIEWER
  // ============================================================
  if (displayMode === 'win-viewer') {
    return (
      <div className="w-full max-w-[880px] my-6 bg-[#c0c0c0] border-4 border-white border-r-[#1A1A1A] border-b-[#1A1A1A] shadow-[16px_16px_0px_#1A1A1A] flex flex-col relative z-10">
        {/* Title Bar */}
        <div className="bg-[#000080] text-white p-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🖼️</span>
            <span className="font-bold text-[28px] tracking-wide truncate max-w-[600px]">
              {caption || 'evidencia_do_colapso.jpg - Visualizador de Fotos'}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-r-gray-700 border-b-gray-700 text-black font-bold flex items-center justify-center text-sm">
              _
            </div>
            <div className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-r-gray-700 border-b-gray-700 text-black font-bold flex items-center justify-center text-sm">
              □
            </div>
            <div className="w-8 h-8 bg-[#c0c0c0] border-2 border-white border-r-gray-700 border-b-gray-700 text-black font-bold flex items-center justify-center text-sm">
              ✕
            </div>
          </div>
        </div>

        {/* Menu bar */}
        <div className="bg-[#c0c0c0] border-b-2 border-gray-400 px-4 py-2 flex gap-6 text-[22px] font-sans text-gray-800">
          <span className="hover:underline cursor-pointer">Arquivo</span>
          <span className="hover:underline cursor-pointer">Editar</span>
          <span className="hover:underline cursor-pointer">Exibir</span>
          <span className="hover:underline cursor-pointer">Zoom</span>
          <span className="hover:underline cursor-pointer">Ajuda</span>
        </div>

        {/* Image Content */}
        <div className="p-4 bg-[#808080] border-2 border-inset border-gray-700 flex items-center justify-center max-h-[420px] overflow-hidden">
          {renderMediaElement("max-h-[380px] w-auto max-w-full object-contain border-2 border-black")}
        </div>

        {/* Status Bar */}
        <div className="bg-[#c0c0c0] border-t-2 border-white px-4 py-1 flex justify-between text-[18px] font-mono text-gray-700">
          <span>100% | 1080x1080 | 72 DPI</span>
          <span>Status: Traumatizado</span>
        </div>
      </div>
    );
  }

  // ============================================================
  // 8. POLAROID
  // ============================================================
  if (displayMode === 'polaroid') {
    return (
      <div className="relative my-6 transform -rotate-1 hover:rotate-0 transition-transform duration-200 z-10">
        {/* Yellow masking tape */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-36 h-10 bg-yellow-200/85 border border-yellow-300 shadow-sm transform -rotate-3 z-20" />

        <div className="bg-white p-6 pb-10 border-4 border-gray-300 shadow-[18px_18px_0px_rgba(0,0,0,0.85)] max-w-[650px] mx-auto flex flex-col items-center">
          <div className="w-full bg-black overflow-hidden border-2 border-gray-400">
            {renderMediaElement("w-full max-h-[360px] object-cover")}
          </div>
          {caption && (
            <p className="mt-4 font-mono-retro text-[28px] font-bold text-gray-800 tracking-wide text-center">
              "{caption}"
            </p>
          )}
          {!caption && (
            <p className="mt-4 font-mono-retro text-[22px] text-gray-400 font-bold">
              ★ LEMBRANÇA DOS ANOS 2000 ★
            </p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 9. MSN WEBCAM
  // ============================================================
  if (displayMode === 'msn-webcam') {
    return (
      <div className="my-6 bg-[#E8F1FC] border-4 border-[#2B60DE] rounded-lg shadow-[16px_16px_0px_#000080] overflow-hidden max-w-[700px] mx-auto z-10">
        <div className="bg-gradient-to-r from-[#2B60DE] to-[#6AA4FA] px-4 py-2 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📹</span>
            <span className="font-bold text-[24px]">Webcam Ao Vivo (320x240)</span>
          </div>
          <span className="font-mono text-[18px] bg-red-600 text-white px-2 py-0.5 rounded font-bold animate-pulse">
            REC
          </span>
        </div>
        <div className="p-4 bg-white flex flex-col items-center">
          {renderMediaElement("w-full max-h-[340px] object-cover border-2 border-blue-300")}
          {caption && (
            <span className="mt-2 text-[20px] font-mono text-gray-600 font-bold">
              Subnick: {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 10. DEFAULT TWEET MEDIA (CLEAN BRUTALIST BORDER)
  // ============================================================
  return (
    <div
      className="w-full max-w-[900px] my-6 overflow-hidden relative z-10"
      style={{
        border: `${borderWidth || 10}px solid #1A1A1A`,
        boxShadow: `16px 16px 0px ${shadowColor}`,
        backgroundColor: '#000000',
      }}
    >
      {renderMediaElement("w-full max-h-[440px] object-contain bg-black/60 mx-auto")}
      {caption && (
        <div className="bg-[#1A1A1A] p-3 text-white font-mono-retro text-[24px] font-bold border-t-4 border-black text-center">
          {caption}
        </div>
      )}
    </div>
  );
};
