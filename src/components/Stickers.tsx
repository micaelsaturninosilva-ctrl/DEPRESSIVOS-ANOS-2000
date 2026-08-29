import React from 'react';
import { StickerType } from '../types';

interface StickerProps {
  type: StickerType;
  className?: string;
  size?: number;
}

export const Sticker: React.FC<StickerProps> = ({ type, className = '', size = 64 }) => {
  if (type === 'none') return null;

  switch (type) {
    case 'avatar-sad':
      return (
        <div
          className={`rounded-full bg-[#0000FF] flex items-center justify-center font-mono font-bold text-white shadow-[4px_4px_0px_#1A1A1A] select-none ${className}`}
          style={{ width: size, height: size }}
        >
          <span
            style={{
              fontSize: size * 0.55,
              transform: 'rotate(90deg)',
              display: 'inline-block',
              lineHeight: 1,
              marginTop: -size * 0.05,
            }}
          >
            :(
          </span>
        </div>
      );
    case 'avatar-exe':
      return (
        <div
          className={`bg-[#0000FF] border-[3px] border-[#1A1A1A] shadow-[5px_5px_0px_#1A1A1A] flex items-center justify-center font-mono font-bold text-white select-none ${className}`}
          style={{ width: size, height: size }}
        >
          <span style={{ fontSize: size * 0.22, letterSpacing: '-0.5px' }}>erro.exe</span>
        </div>
      );
    case 'sticker-alerta-azul':
      return (
        <div
          className={`bg-[#0000FF] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] text-white p-2 font-mono select-none ${className}`}
          style={{ minWidth: size * 1.6 }}
        >
          <div className="font-impact text-[11px] uppercase tracking-wider mb-1 text-white border-b border-white/30 pb-0.5">
            AVISO DO SISTEMA
          </div>
          <div className="text-[9px] leading-tight font-bold">
            [ ] Tentar interagir<br />
            [X] Fingir demência
          </div>
        </div>
      );
    case 'sticker-loading-bar':
      return (
        <div
          className={`border-2 border-[#1A1A1A] bg-[#F4F4F0] p-1.5 shadow-[3px_3px_0px_#0000FF] font-mono select-none ${className}`}
          style={{ width: size * 2 }}
        >
          <div className="text-[9px] font-bold text-[#0000FF] mb-1 truncate">
            Processando... 99%
          </div>
          <div className="w-full h-3.5 bg-[#F4F4F0] border border-[#1A1A1A] relative overflow-hidden">
            <div className="h-full bg-[#0000FF] w-[99%] border-r border-[#1A1A1A]" />
          </div>
        </div>
      );
    case 'sticker-checkbox':
      return (
        <div
          className={`bg-[#F4F4F0] border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#0000FF] px-2.5 py-1.5 font-mono text-[11px] font-bold text-[#1A1A1A] select-none ${className}`}
        >
          <span className="text-[#0000FF] font-bold mr-1">[X]</span> Fingir demência
        </div>
      );
    case 'warning':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <polygon points="24,4 44,42 4,42" fill="#FFCC00" stroke="#000000" strokeWidth="3" strokeLinejoin="bevel" />
            <rect x="22" y="16" width="4" height="12" fill="#000000" />
            <rect x="22" y="32" width="4" height="4" fill="#000000" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <circle cx="24" cy="24" r="20" fill="#FF3333" stroke="#000000" strokeWidth="3" />
            <line x1="14" y1="14" x2="34" y2="34" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="square" />
            <line x1="34" y1="14" x2="14" y2="34" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="square" />
          </svg>
        </div>
      );
    case 'floppy':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <path d="M6 6H36L42 12V42H6V6Z" fill="#000080" stroke="#000000" strokeWidth="3" />
            <rect x="12" y="6" width="22" height="14" fill="#E0E0E0" stroke="#000000" strokeWidth="2" />
            <rect x="16" y="8" width="6" height="10" fill="#000080" />
            <rect x="12" y="24" width="24" height="18" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            <line x1="16" y1="29" x2="32" y2="29" stroke="#000080" strokeWidth="2" />
            <line x1="16" y1="34" x2="28" y2="34" stroke="#000080" strokeWidth="2" />
          </svg>
        </div>
      );
    case 'broken-heart':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <path
              d="M24 42L7 25C1 19 2 9 11 5C17 2 22 6 24 9C26 6 31 2 37 5C46 9 47 19 41 25L24 42Z"
              fill="#FF1A75"
              stroke="#000000"
              strokeWidth="3"
            />
            <path
              d="M24 9L21 19L27 24L21 31L24 42"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinejoin="bevel"
            />
          </svg>
        </div>
      );
    case 'skull':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <path d="M10 20C10 11 16 6 24 6C32 6 38 11 38 20C38 26 34 30 32 32V38H16V32C14 30 10 26 10 20Z" fill="#F4F4F0" stroke="#000000" strokeWidth="3" />
            <circle cx="18" cy="20" r="4" fill="#000000" />
            <circle cx="30" cy="20" r="4" fill="#000000" />
            <path d="M24 26L22 29H26L24 26Z" fill="#000000" />
            <line x1="20" y1="34" x2="20" y2="38" stroke="#000000" strokeWidth="2" />
            <line x1="24" y1="34" x2="24" y2="38" stroke="#000000" strokeWidth="2" />
            <line x1="28" y1="34" x2="28" y2="38" stroke="#000000" strokeWidth="2" />
          </svg>
        </div>
      );
    case 'msn':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            {/* MSN Butterfly Wings */}
            <path d="M22 20C16 10 6 12 8 22C10 32 20 26 22 24Z" fill="#00B0F0" stroke="#000000" strokeWidth="2" />
            <path d="M26 20C32 10 42 12 40 22C38 32 28 26 26 24Z" fill="#92D050" stroke="#000000" strokeWidth="2" />
            <path d="M22 26C16 32 10 38 14 42C18 46 22 34 23 30Z" fill="#FFC000" stroke="#000000" strokeWidth="2" />
            <path d="M26 26C32 32 38 38 34 42C30 46 26 34 25 30Z" fill="#FF0000" stroke="#000000" strokeWidth="2" />
            <ellipse cx="24" cy="24" rx="2" ry="8" fill="#1A1A1A" />
          </svg>
        </div>
      );
    case 'dialup':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <rect x="6" y="14" width="36" height="24" rx="2" fill="#D3D3D3" stroke="#000000" strokeWidth="3" />
            <line x1="12" y1="20" x2="36" y2="20" stroke="#000000" strokeWidth="2" />
            <circle cx="12" cy="28" r="2" fill="#00FF00" />
            <circle cx="18" cy="28" r="2" fill="#FFCC00" />
            <circle cx="24" cy="28" r="2" fill="#FF0000" />
            <rect x="30" y="24" width="8" height="8" fill="#505050" />
          </svg>
        </div>
      );
    case 'cd':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <circle cx="24" cy="24" r="20" fill="#E8EEF5" stroke="#000000" strokeWidth="3" />
            <path d="M12 24C12 17.37 17.37 12 24 12" stroke="#00FFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M36 24C36 30.63 30.63 36 24 36" stroke="#FF00FF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="24" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
            <circle cx="24" cy="24" r="2" fill="#000000" />
          </svg>
        </div>
      );
    case 'battery':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <rect x="6" y="16" width="32" height="16" rx="2" fill="#1A1A1A" stroke="#000000" strokeWidth="3" />
            <rect x="38" y="21" width="4" height="6" fill="#000000" />
            <rect x="9" y="19" width="6" height="10" fill="#FF3333" />
            <line x1="22" y1="20" x2="22" y2="28" stroke="#FF3333" strokeWidth="2" strokeDasharray="2 2" />
          </svg>
        </div>
      );
    case 'sad-smile':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <circle cx="24" cy="24" r="20" fill="#FFD700" stroke="#000000" strokeWidth="3" />
            <circle cx="17" cy="18" r="3" fill="#000000" />
            <circle cx="31" cy="18" r="3" fill="#000000" />
            <path d="M16 34C19 28 29 28 32 34" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'cursor':
      return (
        <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
            <polygon points="8,4 8,36 17,27 25,44 31,41 23,24 34,24" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};
