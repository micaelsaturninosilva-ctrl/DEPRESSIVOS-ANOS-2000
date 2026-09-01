import React from 'react';
import { PostConfig } from '../types';
import { Sticker } from './Stickers';
import { MediaAttachment } from './MediaAttachment';
import { IpodPlayer } from './IpodPlayer';
import { IpodScreen } from './IpodScreen';
import { PercentageLoader, hasPercentageInText } from './PercentageLoader';
import { WindowsMediaPlayerTemplate } from './WindowsMediaPlayerTemplate';
import { autoFormatMemeStructure } from '../utils/textFormatter';

// Helper to detect if a hex/rgb color is dark
export const isDarkColor = (color?: string): boolean => {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  if (['#1a1a1a', '#000000', '#111827', '#12141c', '#121212', '#222222', '#333333', '#1e293b', '#0f172a', '#141824', '#000080', '#0a0d14', '#0c111c', '#15171d', '#181e2e', '#0d1017', '#2b313f'].includes(c)) {
    return true;
  }
  if (c.startsWith('#')) {
    const raw = c.slice(1);
    const hex = raw.length === 3 
      ? `${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}` 
      : raw.length === 6 ? raw : null;
    if (hex) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 128;
      }
    }
  }
  return false;
};

// Helper to determine the effective high-contrast text color
export const getEffectiveTextColor = (
  bgColor: string,
  userTextColor?: string,
  defaultDark = '#1A1A1A',
  defaultLight = '#F4F4F0'
): string => {
  const bgIsDark = isDarkColor(bgColor);
  
  if (!userTextColor) {
    return bgIsDark ? defaultLight : defaultDark;
  }

  const u = userTextColor.trim().toLowerCase();

  // If background is dark and text color is the default dark/black, auto-adjust to light
  if (bgIsDark && (u === '#1a1a1a' || u === '#000000' || u === '#111827' || u === '#12141c')) {
    return defaultLight;
  }

  // If background is light and text color is the default light/white, auto-adjust to dark
  if (!bgIsDark && (u === '#ffffff' || u === '#f4f4f0' || u === '#fff' || u === '#fafafa')) {
    return defaultDark;
  }

  // Respect user-specified custom colors (yellow, green, pink, cyan, custom hex, etc.)
  return userTextColor;
};

interface PostCanvasProps {
  config: PostConfig;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  scale?: number; // scale multiplier for previewing in UI (e.g. 0.35 to 0.6)
  previewMode?: boolean;
}

export const PostCanvas: React.FC<PostCanvasProps> = ({
  config,
  canvasRef,
  scale = 1,
  previewMode = false,
}) => {
  // Dimensions based on aspect ratio (base width is 1080)
  const getDimensions = () => {
    switch (config.aspectRatio) {
      case '4:5':
        return { width: 1080, height: 1350 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '16:9':
        return { width: 1920, height: 1080 };
      case '1:1':
      default:
        return { width: 1080, height: 1080 };
    }
  };

  const { width, height } = getDimensions();

  const hasAttachedMedia =
    Boolean(config.mediaUrl) &&
    config.mediaDisplayMode !== 'none' &&
    config.mediaDisplayMode !== 'background';

  // Helper to render text with highlighted segment, paragraph separation and clean badge flow
  const renderHighlightedText = (
    text: string,
    highlight: string,
    highlightColor: string,
    highlightStyle: 'badge' | 'textColor' = 'badge',
    baseTextColor?: string
  ) => {
    if (!text) return null;

    const fallbackColor = baseTextColor || 'inherit';

    const renderInlineSegment = (segmentText: string, keyPrefix: string) => {
      // Check for explicit [destaque]...[/destaque] markup first
      const tagRegex = /\[destaque\]([\s\S]*?)\[\/destaque\]/gi;
      if (tagRegex.test(segmentText)) {
        const parts = segmentText.split(/(\[destaque\][\s\S]*?\[\/destaque\])/gi);
        return parts.map((part, index) => {
          if (part.toLowerCase().startsWith('[destaque]') && part.toLowerCase().endsWith('[/destaque]')) {
            const content = part.replace(/\[\/?destaque\]/gi, '');
            if (highlightStyle === 'badge') {
              return (
                <span
                  key={`${keyPrefix}-badge-${index}`}
                  className="rounded-[3px]"
                  style={{
                    backgroundColor: highlightColor,
                    color: isDarkColor(highlightColor) ? '#FFFFFF' : '#1A1A1A',
                    padding: '0.04em 0.22em',
                    margin: '0 0.04em',
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    display: 'inline',
                    lineHeight: 'inherit',
                  }}
                >
                  {renderLineBreaks(content, `${keyPrefix}-sub-${index}`)}
                </span>
              );
            } else {
              return (
                <span key={`${keyPrefix}-hl-${index}`} style={{ color: highlightColor }}>
                  {renderLineBreaks(content, `${keyPrefix}-sub-${index}`)}
                </span>
              );
            }
          }
          return (
            <span key={`${keyPrefix}-txt-${index}`} style={{ color: fallbackColor }}>
              {renderLineBreaks(part, `${keyPrefix}-line-${index}`)}
            </span>
          );
        });
      }

      // Otherwise match highlight string if provided
      if (highlight && highlight.trim() && segmentText.toLowerCase().includes(highlight.toLowerCase())) {
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = segmentText.split(regex);
        return parts.map((part, index) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            if (highlightStyle === 'badge') {
              return (
                <span
                  key={`${keyPrefix}-badge-${index}`}
                  className="rounded-[3px]"
                  style={{
                    backgroundColor: highlightColor,
                    color: isDarkColor(highlightColor) ? '#FFFFFF' : '#1A1A1A',
                    padding: '0.04em 0.22em',
                    margin: '0 0.04em',
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    display: 'inline',
                    lineHeight: 'inherit',
                  }}
                >
                  {renderLineBreaks(part, `${keyPrefix}-sub-${index}`)}
                </span>
              );
            } else {
              return (
                <span key={`${keyPrefix}-hl-${index}`} style={{ color: highlightColor }}>
                  {renderLineBreaks(part, `${keyPrefix}-sub-${index}`)}
                </span>
              );
            }
          }
          return (
            <span key={`${keyPrefix}-txt-${index}`} style={{ color: fallbackColor }}>
              {renderLineBreaks(part, `${keyPrefix}-line-${index}`)}
            </span>
          );
        });
      }

      return (
        <span key={`${keyPrefix}-plain`} style={{ color: fallbackColor }}>
          {renderLineBreaks(segmentText, `${keyPrefix}-plain`)}
        </span>
      );
    };

    // Auto format and merge broken lines into a cohesive flow
    const cleanText = autoFormatMemeStructure(text);
    const paragraphs = cleanText.split(/\n+/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 1) {
      return (
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {paragraphs.map((para, pIdx) => (
            <div key={`para-${pIdx}`} className="leading-tight">
              {renderInlineSegment(para, `p-${pIdx}`)}
            </div>
          ))}
        </div>
      );
    }

    return renderInlineSegment(cleanText, 'root');
  };

  const renderLineBreaks = (str: string, keyPrefix = 'line') => {
    const lines = str.split('\n');
    return lines.map((line, i) => (
      <React.Fragment key={`${keyPrefix}-${i}`}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Base font size calculation (auto adjusts if media is attached)
  const getBaseFontSize = (defaultSize: number) => {
    const mediaReduction = hasAttachedMedia ? 0.72 : 1;
    return Math.round(defaultSize * (config.fontSize || 1) * mediaReduction);
  };

  // Text formatting styles helper
  const getTextStyles = (defaultAlign: 'left' | 'center' | 'right' = 'left', defaultLineHeight = 1.15) => ({
    textAlign: (config.textAlign || defaultAlign) as any,
    lineHeight: defaultLineHeight * (config.lineHeightMultiplier || 1),
    textTransform: (config.textTransform === 'none' ? 'none' : 'uppercase') as any,
    letterSpacing: config.letterSpacing !== undefined && config.letterSpacing !== 0 ? `${config.letterSpacing}px` : undefined,
    wordBreak: 'break-word' as any,
  });

  // Compose CRT Classes
  const getCrtContainerClasses = () => {
    const classes = [];
    if (config.crtFlicker) classes.push('crt-flicker-active');
    if (config.crtBlur) classes.push('crt-phosphor-blur');
    if (config.crtRgbShift) classes.push('crt-rgb-shift');
    if (config.crtPreset === 'crt-cyber') classes.push('crt-tint-cyber');
    if (config.crtPreset === 'crt-amber') classes.push('crt-tint-amber');
    if (config.crtCurvature) {
      classes.push(config.crtPreset === 'crt-heavy' ? 'crt-curvature-heavy' : 'crt-curvature-subtle');
    }
    return classes.join(' ');
  };

  // Helper to render media attachment with complete framing, zoom & positioning support
  const renderMediaAttachment = (customShadow?: string, customBorder?: number) => {
    if (!hasAttachedMedia || !config.mediaUrl) return null;
    return (
      <MediaAttachment
        mediaUrl={config.mediaUrl}
        audioPreviewUrl={config.audioPreviewUrl}
        displayMode={config.mediaDisplayMode || 'tweet-media'}
        filter={config.mediaFilter}
        caption={config.mediaCaption}
        shadowColor={customShadow || config.shadowColor || '#0000FF'}
        borderWidth={customBorder ?? config.borderWidth ?? 4}
        mediaType={config.mediaType}
        mediaFit={config.mediaFit}
        mediaZoom={config.mediaZoom}
        mediaPositionX={config.mediaPositionX}
        mediaPositionY={config.mediaPositionY}
        mediaAspectRatio={config.mediaAspectRatio}
        mediaHeight={config.mediaHeight}
        mediaRotate={config.mediaRotate}
      />
    );
  };

  return (
    <div
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        position: 'relative',
      }}
      className="select-none flex-shrink-0 transition-transform origin-top-left"
    >
      <div
        ref={canvasRef}
        id="depressivos-post-canvas"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className={`relative overflow-hidden font-sans ${config.showNoise ? 'bg-noise' : ''} ${getCrtContainerClasses()}`}
      >
        {/* Background Image Mode if active */}
        {config.mediaUrl && config.mediaDisplayMode === 'background' && (
          <MediaAttachment
            mediaUrl={config.mediaUrl}
            displayMode="background"
            filter={config.mediaFilter}
            mediaFit={config.mediaFit}
            mediaZoom={config.mediaZoom}
            mediaPositionX={config.mediaPositionX}
            mediaPositionY={config.mediaPositionY}
            mediaAspectRatio={config.mediaAspectRatio}
            mediaHeight={config.mediaHeight}
            mediaRotate={config.mediaRotate}
          />
        )}

        {/* ============================================================ */}
        {/* TEMPLATE: TELA AZUL PURA (IDENTIDADE OFICIAL NEO-BRUTALISMO) */}
        {/* ============================================================ */}
        {config.template === 'tela-azul-brutalista' && (() => {
          const cardBg = '#FFFFFF';
          const effectiveTextColor = getEffectiveTextColor(cardBg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full p-12 md:p-16 flex flex-col justify-between relative box-border z-10"
              style={{
                backgroundColor: config.backgroundColor || '#F4F4F0',
              }}
            >
              {/* Header com Top Bar de Sistema */}
              <div className="flex items-center justify-between border-b-4 border-[#1A1A1A] pb-5 mb-4">
                <div className="flex items-center gap-4">
                  {/* Avatar Oficial */}
                  <div className="w-14 h-14 rounded-full bg-[#0000FF] border-2 border-[#1A1A1A] flex items-center justify-center text-white font-mono font-bold text-2xl shadow-[3px_3px_0px_#1A1A1A]">
                    <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>:(</span>
                  </div>
                  <div>
                    <h2 className="font-impact text-xl text-[#0000FF] uppercase tracking-wider leading-none">
                      DEPRESSIVOS 2000
                    </h2>
                    <p className="font-mono text-xs text-[#1A1A1A] font-bold mt-1">
                      IDENTIDADE: TELA AZUL PURA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#0000FF] text-white px-3 py-1 font-mono font-bold text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
                    erro.exe
                  </span>
                  {config.sticker !== 'none' && (
                    <Sticker type={config.sticker} size={48} />
                  )}
                </div>
              </div>

              {/* Card Central Brutalista */}
              <div
                className="flex-1 flex flex-col justify-center bg-white p-8 md:p-12 border-4 border-[#1A1A1A] relative my-2"
                style={{
                  boxShadow: `10px 10px 0px ${config.shadowColor || '#0000FF'}`,
                }}
              >
                <div className="mb-4">
                  <span className="font-mono font-bold text-xs text-white bg-[#1A1A1A] px-2.5 py-1 uppercase tracking-widest inline-block mb-3">
                    01. SINTOMA / RELATO
                  </span>
                </div>

                <h1
                  className="font-impact tracking-tight"
                  style={{
                    fontSize: `${getBaseFontSize(76)}px`,
                    color: effectiveTextColor,
                    ...getTextStyles('left', 1.15),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    config.highlightColor || '#0000FF',
                    'badge',
                    effectiveTextColor
                  )}
                </h1>

                {/* Attached Media if any */}
                {renderMediaAttachment(config.shadowColor || '#0000FF', 4)}

                {/* Barra de Progresso Dinâmica se houver % no texto ou ativado */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="mt-4">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel}
                      styleType="brutalist"
                      accentColor={config.shadowColor || '#0000FF'}
                      shadowColor={config.shadowColor || '#1A1A1A'}
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}

                {/* Caixa de Erro Embutida */}
                <div className="mt-6 bg-[#0000FF] border-4 border-[#1A1A1A] p-4 text-white shadow-[6px_6px_0px_#1A1A1A]">
                  <div className="font-impact text-sm uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>AVISO DO SISTEMA</span>
                    <span className="font-mono text-xs opacity-80">0x00002000</span>
                  </div>
                  <div className="font-mono text-xs font-bold leading-relaxed">
                    [ ] Tentar interagir socialmente <br />
                    [X] Fingir demência e abrir o Instagram
                  </div>
                </div>
              </div>

              {/* Footer com Barra e Handle */}
              <div className="pt-4 flex items-center justify-between border-t-4 border-[#1A1A1A] mt-2 font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-[#0000FF]">
                    {config.handle || '@DEPRESSIVOS2000'}
                  </span>
                </div>
                <div className="text-xs text-[#1A1A1A] font-bold">
                  ESTAMOS TODOS MEIO FERRADOS
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE: BARRA DE CARREGAMENTO 99% (MATURIDADE EMOCIONAL) */}
        {/* ============================================================ */}
        {config.template === 'barra-carregamento-99' && (() => {
          const cardBg = '#FFFFFF';
          const effectiveTextColor = getEffectiveTextColor(cardBg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full p-12 md:p-16 flex flex-col justify-between relative box-border z-10"
              style={{
                backgroundColor: config.backgroundColor || '#F4F4F0',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-4 border-[#1A1A1A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0000FF] border-2 border-[#1A1A1A] flex items-center justify-center font-mono font-bold text-white text-xs shadow-[3px_3px_0px_#1A1A1A]">
                    erro.exe
                  </div>
                  <div>
                    <div className="font-impact text-lg text-[#1A1A1A] uppercase tracking-wider">
                      GERENCIADOR DE TAREFAS DA MENTE
                    </div>
                    <div className="font-mono text-xs text-[#0000FF] font-bold">
                      PROCESSO: VIDA_ADULTA.EXE [TRAVADO]
                    </div>
                  </div>
                </div>
                {config.sticker !== 'none' && (
                  <Sticker type={config.sticker} size={50} />
                )}
              </div>

              {/* Card Principal */}
              <div
                className="bg-white border-4 border-[#1A1A1A] p-8 md:p-12 flex flex-col justify-center gap-6 my-auto"
                style={{
                  boxShadow: `12px 12px 0px ${config.shadowColor || '#0000FF'}`,
                }}
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#0000FF] uppercase tracking-widest block mb-2">
                    STATUS DO PROCESSAMENTO
                  </span>
                  <h1
                    className="font-impact tracking-tight"
                    style={{
                      fontSize: `${getBaseFontSize(72)}px`,
                      color: effectiveTextColor,
                      ...getTextStyles('left', 1.15),
                    }}
                  >
                    {renderHighlightedText(
                      config.text,
                      config.highlightText,
                      config.highlightColor || '#0000FF',
                      'badge',
                      effectiveTextColor
                    )}
                  </h1>
                </div>

                {/* Attached Media if any */}
                {hasAttachedMedia && config.mediaUrl && (
                  <div className="my-2 flex justify-center">
                    <MediaAttachment
                      mediaUrl={config.mediaUrl}
                      displayMode={config.mediaDisplayMode || 'tweet-media'}
                      filter={config.mediaFilter}
                      caption={config.mediaCaption}
                      shadowColor={config.shadowColor || '#0000FF'}
                      borderWidth={4}
                      mediaType={config.mediaType}
                    />
                  </div>
                )}

                {/* Barra de Progresso Brutalista Dinâmica com % Subindo */}
                <div className="mt-2">
                  <PercentageLoader
                    text={config.text}
                    targetPercentage={config.customPercentage}
                    customLabel={config.percentageLabel || 'Processando maturidade emocional...'}
                    styleType="brutalist"
                    accentColor={config.shadowColor || '#0000FF'}
                    shadowColor={config.shadowColor || '#1A1A1A'}
                    animate={config.animatePercentage !== false}
                  />
                </div>

                {/* Checklist de Respostas */}
                <div className="bg-[#F4F4F0] border-2 border-[#1A1A1A] p-3.5 font-mono text-xs font-bold text-[#1A1A1A]">
                  <div className="mb-1 text-[#0000FF]">[!] O programa não está respondendo:</div>
                  <div className="space-y-1">
                    <div>[ ] Aguardar o programa responder</div>
                    <div>[X] Reiniciar tomando um café e fingindo que está tudo bem</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t-4 border-[#1A1A1A] pt-4 font-mono font-bold">
                <span className="text-[#0000FF] text-sm">{config.handle || '@DEPRESSIVOS2000'}</span>
                <span className="text-xs text-[#1A1A1A]">FALHA CRÍTICA DE BUFFER SOCIAL</span>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE: AVISO DO SISTEMA (TELA AZUL COMPLETA COM CHECKBOX) */}
        {/* ============================================================ */}
        {config.template === 'aviso-sistema-bateria' && (() => {
          const bg = config.backgroundColor || '#0000FF';
          const effectiveTextColor = getEffectiveTextColor(bg, config.textColor, '#FFFFFF', '#FFFFFF');
          return (
            <div
              className="w-full h-full p-12 md:p-16 flex flex-col justify-between relative box-border z-10 text-white"
              style={{
                backgroundColor: bg,
              }}
            >
              {/* Top Bar com Ícone do Sistema */}
              <div className="flex items-center justify-between border-b-4 border-white pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white text-[#0000FF] flex items-center justify-center font-mono font-bold text-3xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                    <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>:(</span>
                  </div>
                  <div>
                    <h1 className="font-impact text-2xl uppercase tracking-wider text-white">
                      AVISO DO SISTEMA OPERACIONAL
                    </h1>
                    <p className="font-mono text-xs text-white/80 font-bold">
                      CÓDIGO DE PARADA: 0x00000030_CRISE_EXISTENCIAL
                    </p>
                  </div>
                </div>
                <div className="font-mono font-bold text-xs bg-white text-[#0000FF] px-3 py-1.5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]">
                  CRÍTICO
                </div>
              </div>

              {/* Card Central de Erro */}
              <div
                className="bg-[#0000FF] border-4 border-white p-8 md:p-12 my-auto shadow-[12px_12px_0px_#1A1A1A] relative"
                style={{ backgroundColor: bg }}
              >
                <div className="font-impact text-xl uppercase tracking-wider text-yellow-300 mb-4 border-b-2 border-white/40 pb-2">
                  DIAGNÓSTICO: BATERIA SOCIAL ESGOTADA
                </div>

                <h2
                  className="font-impact tracking-tight mb-6"
                  style={{
                    fontSize: `${getBaseFontSize(74)}px`,
                    color: effectiveTextColor,
                    ...getTextStyles('left', 1.15),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    config.highlightColor || '#FFD700',
                    'badge',
                    effectiveTextColor
                  )}
                </h2>

                {/* Attached Media if any */}
                {renderMediaAttachment('#FFFFFF', 4)}

                {/* Barra de Porcentagem Dinâmica */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="my-3">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel || 'Nível de Bateria Social:'}
                      styleType="brutalist"
                      accentColor="#FFD700"
                      shadowColor="#1A1A1A"
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}

                {/* Caixa de Opções / Checkbox Psicanalítico */}
                <div className="bg-white text-[#1A1A1A] border-4 border-[#1A1A1A] p-5 font-mono shadow-[6px_6px_0px_#1A1A1A] mt-4">
                  <div className="font-impact text-sm uppercase text-[#0000FF] mb-2">
                    SELECIONE UMA AÇÃO IMEDIATA:
                  </div>
                  <div className="space-y-2 text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-[#1A1A1A] flex items-center justify-center text-xs"></span>
                      <span>Tentar interagir com pessoas normais</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#0000FF]">
                      <span className="w-5 h-5 bg-[#0000FF] text-white border-2 border-[#1A1A1A] flex items-center justify-center text-xs font-bold">
                        X
                      </span>
                      <span>Fingir demência e ir deitar com o celular no escuro</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t-4 border-white pt-4 font-mono font-bold text-sm">
                <span className="text-white">{config.handle || '@DEPRESSIVOS2000'}</span>
                <span className="text-white/70 text-xs">PRESSIONE QUALQUER TECLA PARA CONTINUAR SOFRENDO</span>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATES DE MOCKUPS RETRÔ (CSS ART ANOS 2000) */}
        {/* ============================================================ */}
        {(config.template === 'mockup-tv-vhs' ||
          config.template === 'mockup-tv-dvd' ||
          config.template === 'mockup-monitor-bege' ||
          config.template === 'mockup-celular-flip' ||
          config.template === 'mockup-tv-madeira' ||
          config.template === 'mockup-gameboy' ||
          config.template === 'mockup-mp3-player') && (() => {
          const bg = config.backgroundColor || '#F4F4F0';
          const effectiveTextColor = getEffectiveTextColor(bg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full p-10 md:p-14 flex flex-col justify-between relative box-border z-10 select-none overflow-hidden"
              style={{
                backgroundColor: bg,
              }}
            >
              {/* Header com Top Bar de Sistema */}
              <div className="flex items-center justify-between border-b-4 border-[#1A1A1A] pb-3 mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0000FF] border-2 border-[#1A1A1A] flex items-center justify-center text-white font-mono font-bold text-xl shadow-[3px_3px_0px_#1A1A1A]">
                    <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>:(</span>
                  </div>
                  <div>
                    <h2 className="font-impact text-lg text-[#0000FF] uppercase tracking-wider leading-none">
                      DEPRESSIVOS 2000
                    </h2>
                    <p className="font-mono text-xs text-[#1A1A1A] font-bold mt-0.5">
                      MOCKUP RETRÔ • CSS ART 100%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#1A1A1A] text-[#00FF66] px-3 py-1 font-mono font-bold text-xs border border-gray-700 shadow-[2px_2px_0px_#0000FF]">
                    {config.template === 'mockup-tv-vhs' && 'TV_QUASAR_VHS.AV'}
                    {config.template === 'mockup-tv-dvd' && 'TV_MEMOREX_DVD.VOB'}
                    {config.template === 'mockup-monitor-bege' && 'MONITOR_98.EXE'}
                    {config.template === 'mockup-celular-flip' && 'CELULAR_V3.APP'}
                    {config.template === 'mockup-tv-madeira' && 'TV_ANALOGICA.AV'}
                    {config.template === 'mockup-gameboy' && 'GAMEBOY_8BIT.ROM'}
                    {config.template === 'mockup-mp3-player' && 'WINAMP_128KBPS.MP3'}
                  </span>
                  {config.sticker !== 'none' && (
                    <Sticker type={config.sticker} size={42} />
                  )}
                </div>
              </div>

              {/* Texto do Post / Meme fora do aparelho (na parede virtual) */}
              <div className="my-2 text-center px-4">
                <h1
                  className="font-impact tracking-tight"
                  style={{
                    fontSize: `${getBaseFontSize(58)}px`,
                    color: effectiveTextColor,
                    ...getTextStyles('center', 1.15),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    config.highlightColor || '#0000FF',
                    'badge',
                    effectiveTextColor
                  )}
                </h1>
              </div>

              {/* O Aparelho Central em CSS Art */}
              <div className="flex-1 flex items-center justify-center my-auto w-full">
                <MediaAttachment
                  mediaUrl={config.mediaUrl}
                  audioPreviewUrl={config.audioPreviewUrl}
                  displayMode={
                    config.template === 'mockup-tv-vhs'
                      ? 'tv-vhs'
                      : config.template === 'mockup-tv-dvd'
                      ? 'tv-dvd'
                      : config.template === 'mockup-monitor-bege'
                      ? 'monitor-bege'
                      : config.template === 'mockup-celular-flip'
                      ? 'celular-flip'
                      : config.template === 'mockup-tv-madeira'
                      ? 'tv-madeira'
                      : config.template === 'mockup-gameboy'
                      ? 'gameboy-retro'
                      : 'mp3-player'
                  }
                  filter={config.mediaFilter}
                  caption={config.mediaCaption}
                  shadowColor={config.shadowColor}
                  borderWidth={config.borderWidth}
                  mediaType={config.mediaType}
                />
              </div>

              {/* Footer com Handle */}
              <div className="pt-3 flex items-center justify-between border-t-4 border-[#1A1A1A] mt-2 font-mono">
                <div className="font-bold text-sm text-[#0000FF]">
                  {config.handle || '@DEPRESSIVOS2000'}
                </div>
                <div className="text-xs text-[#1A1A1A] font-bold">
                  ESTAMOS TODOS MEIO FERRADOS, MAS VAMOS RIR DISSO
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE 1: TWEET DE PAREDE (DIA 1) */}
        {/* ============================================================ */}
        {config.template === 'tweet-parede' && (() => {
          const bg = config.backgroundColor || '#F4F4F0';
          const effectiveTextColor = getEffectiveTextColor(bg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full p-20 flex flex-col justify-center relative box-border z-10"
              style={{
                backgroundColor: bg,
                border: `${config.borderWidth || 16}px solid #1A1A1A`,
                boxShadow: previewMode
                  ? `24px 24px 0px ${config.shadowColor || '#0000FF'}`
                  : `30px 30px 0px ${config.shadowColor || '#0000FF'}`,
              }}
            >
              {/* Top Sticker if any */}
              {config.sticker !== 'none' && (
                <div className="absolute top-14 right-14 z-20">
                  <Sticker type={config.sticker} size={hasAttachedMedia ? 80 : 110} />
                </div>
              )}

              {/* Main Statement */}
              <h1
                className="font-impact tracking-tighter"
                style={{
                  fontSize: `${getBaseFontSize(85)}px`,
                  color: effectiveTextColor,
                  ...getTextStyles('left', 1.12),
                }}
              >
                {renderHighlightedText(
                  config.text,
                  config.highlightText,
                  config.highlightColor || '#FFD700',
                  'badge',
                  effectiveTextColor
                )}
              </h1>

              {/* Attached Media */}
              {renderMediaAttachment()}

              {/* Handle Footer */}
              <div className="mt-8 border-t-8 border-[#1A1A1A] pt-6 w-full flex justify-between items-center">
                <p
                  className="font-mono-retro font-bold"
                  style={{
                    fontSize: hasAttachedMedia ? '32px' : '40px',
                    color: config.shadowColor || '#0000FF',
                    letterSpacing: '0.05em',
                  }}
                >
                  {config.handle || '@DEPRESSIVOS2000'}
                </p>
                <span className="font-mono-retro text-[22px] text-[#1A1A1A] font-bold opacity-60">
                  #DEPRESSIVOS2000
                </span>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE OFICIAL 1: CUPOM FISCAL EXISTENCIAL */}
        {/* ============================================================ */}
        {(config.template === 'cupom-fiscal' || config.template === 'nota-fiscal') && (() => {
          const bg = config.backgroundColor || '#FDFBF7';
          const effectiveTextColor = getEffectiveTextColor(bg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full p-12 md:p-16 flex flex-col justify-between relative box-border z-10 font-mono"
              style={{
                backgroundColor: bg,
                border: `${config.borderWidth || 16}px dashed #1A1A1A`,
                boxShadow: `28px 28px 0px ${config.shadowColor || '#1A1A1A'}`,
              }}
            >
              {/* Header Receipt */}
              <div className="border-b-4 border-dashed border-[#1A1A1A] pb-4 text-center">
                <h2 className="font-mono text-[36px] md:text-[40px] font-bold tracking-widest text-[#1A1A1A]">
                  *** CUPOM FISCAL EXISTENCIAL ***
                </h2>
                <p className="font-mono text-[20px] md:text-[22px] text-gray-800 font-bold mt-1">
                  DEPRESSIVOS 2000 LTDA - CNPJ: 00.000.000/CRISES-00
                </p>
                <div className="flex justify-between items-center text-[18px] text-gray-600 font-mono mt-2 px-4 border-t-2 border-dashed border-gray-400 pt-1">
                  <span>DATA: {new Date().toLocaleDateString('pt-BR')}</span>
                  <span>HORA: 03:14:00</span>
                  <span>CCF: 084920</span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="my-4 flex-1 flex flex-col justify-center items-center px-4">
                <div className="w-full text-left border-b-2 border-dashed border-gray-400 pb-2 mb-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                    ITEM 01 • DESCRIÇÃO DO COLAPSO EMOCIONAL
                  </span>
                </div>

                <h1
                  className="font-mono font-bold tracking-tight text-center"
                  style={{
                    fontSize: `${getBaseFontSize(64)}px`,
                    color: effectiveTextColor,
                    whiteSpace: 'pre-line',
                    ...getTextStyles('center', 1.3),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    config.highlightColor || '#FFD700',
                    'badge',
                    effectiveTextColor
                  )}
                </h1>

                {/* Attached Media in receipt */}
                {renderMediaAttachment()}

                {/* Barra de Porcentagem Dinâmica no Cupom */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="w-full mt-4">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel}
                      styleType="receipt"
                      accentColor="#1A1A1A"
                      shadowColor="#1A1A1A"
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}
              </div>

              {/* Receipt Footer & Barcode */}
              <div className="border-t-4 border-dashed border-[#1A1A1A] pt-4 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-3 px-2">
                  <span className="font-mono text-[26px] md:text-[30px] font-bold text-[#1A1A1A]">
                    TOTAL A PAGAR:
                  </span>
                  <span className="font-impact text-[34px] md:text-[40px] text-[#FF3333] tracking-wide">
                    MINHA SANIDADE
                  </span>
                </div>
                {/* Fake Barcode lines */}
                <div className="w-full h-14 bg-[repeating-linear-gradient(90deg,#1A1A1A,#1A1A1A_4px,transparent_4px,transparent_8px,#1A1A1A_8px,#1A1A1A_14px,transparent_14px,transparent_18px)] mb-2 opacity-90"></div>
                <p className="font-mono text-[24px] font-bold text-[#0000FF]">
                  {config.handle || '@DEPRESSIVOS2000'}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE OFICIAL 2: LAUDO MÉDICO (JANELA CLÁSSICA DO WINDOWS) */}
        {/* ============================================================ */}
        {(config.template === 'laudo-medico' || config.template === 'sistema-alerta') && (() => {
          const winBg = config.backgroundColor || '#c0c0c0';
          const isDarkBg = isDarkColor(winBg);
          const effectiveTextColor = getEffectiveTextColor(winBg, config.textColor, '#1A1A1A', '#F4F4F0');
          const effectiveHighlightColor = config.highlightColor || (isDarkBg ? '#FF5555' : '#FF3333');

          return (
            <div
              className="w-full h-full flex flex-col relative box-border z-10 select-none font-sans"
              style={{
                backgroundColor: winBg,
                borderTop: `${config.borderWidth || 16}px solid ${isDarkBg ? '#3A4259' : '#FFFFFF'}`,
                borderLeft: `${config.borderWidth || 16}px solid ${isDarkBg ? '#3A4259' : '#FFFFFF'}`,
                borderRight: `${config.borderWidth || 16}px solid #0D1017`,
                borderBottom: `${config.borderWidth || 16}px solid #0D1017`,
                boxShadow: `24px 24px 0px ${config.shadowColor || '#000080'}`,
              }}
            >
              {/* Windows 98 Title Bar - Azul Escuro (#000080) */}
              <div className="bg-[#000080] w-full p-6 flex justify-between items-center select-none shadow-md">
                <div className="flex items-center gap-4">
                  {/* Mini System Warning Icon */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Sticker type="warning" size={32} />
                  </div>
                  <p className="font-sans text-white text-[36px] md:text-[38px] font-bold tracking-wide truncate max-w-[800px]">
                    {config.systemTitle || 'Laudo Médico - CID_F32.exe'}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  {/* Window Close / Min / Max buttons */}
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    _
                  </div>
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    □
                  </div>
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    ✕
                  </div>
                </div>
              </div>

              {/* Dialog Content Area */}
              <div className="p-12 md:p-14 flex flex-col justify-center h-full items-center text-center relative overflow-y-auto">
                {/* Alerta Amarelo Obrigatório (⚠️) */}
                <div className="mb-4">
                  <Sticker type={config.sticker !== 'none' ? config.sticker : 'warning'} size={hasAttachedMedia ? 64 : 96} />
                </div>

                <h1
                  className="font-impact tracking-tight mb-6"
                  style={{
                    fontSize: `${getBaseFontSize(72)}px`,
                    color: effectiveTextColor,
                    maxWidth: '920px',
                    ...getTextStyles('center', 1.2),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    effectiveHighlightColor,
                    'textColor',
                    effectiveTextColor
                  )}
                </h1>

                {/* Attached Media */}
                {renderMediaAttachment()}

                {/* Barra de Progresso Win98 Dinâmica */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="w-full max-w-[840px] my-3">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel || 'Progresso do Tratamento / Laudo:'}
                      styleType="win98"
                      accentColor="#000080"
                      shadowColor="#000080"
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}

                {/* Classic Windows 98 3D Action Button: ACEITAR LAUDO */}
                <div
                  className="border-[8px] px-14 py-4 mt-4 active:scale-95 cursor-pointer shadow-md transition-transform"
                  style={{
                    backgroundColor: isDarkBg ? '#232838' : '#c0c0c0',
                    borderTopColor: isDarkBg ? '#48526F' : '#FFFFFF',
                    borderLeftColor: isDarkBg ? '#48526F' : '#FFFFFF',
                    borderRightColor: isDarkBg ? '#0D1017' : '#1A1A1A',
                    borderBottomColor: isDarkBg ? '#0D1017' : '#1A1A1A',
                  }}
                >
                  <p
                    className="font-sans text-[34px] md:text-[36px] font-bold"
                    style={{ color: isDarkBg ? '#F4F4F0' : '#1A1A1A' }}
                  >
                    {config.windowButtonText || 'ACEITAR LAUDO'}
                  </p>
                </div>
              </div>

              {/* Handle watermark */}
              <div className="absolute bottom-6 right-8">
                <p
                  className="font-mono text-[26px] font-bold"
                  style={{ color: isDarkBg ? 'rgba(244,244,240,0.5)' : 'rgba(26,26,26,0.6)' }}
                >
                  {config.handle || '@DEPRESSIVOS2000'}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE OFICIAL 3: ERRO FATAL (COM SCANLINES DE MONITOR) */}
        {/* ============================================================ */}
        {config.template === 'erro-fatal' && (() => {
          const winBg = config.backgroundColor || '#c0c0c0';
          const effectiveTextColor = getEffectiveTextColor(winBg, config.textColor, '#1A1A1A', '#F4F4F0');
          const effectiveHighlightColor = config.highlightColor || '#FF0000';

          // Split Expectativa vs Realidade if text contains [realidade] or vs/quebra
          const rawText = config.text || '';
          let expectativaText = rawText;
          let realidadeText = '';

          if (rawText.includes('[realidade]')) {
            const parts = rawText.split('[realidade]');
            expectativaText = parts[0];
            realidadeText = parts[1]?.replace('[/realidade]', '') || '';
          } else if (rawText.toLowerCase().includes('realidade:')) {
            const idx = rawText.toLowerCase().indexOf('realidade:');
            expectativaText = rawText.substring(0, idx).trim();
            realidadeText = rawText.substring(idx).trim();
          }

          return (
            <div
              className="w-full h-full flex flex-col relative box-border z-10 select-none font-sans overflow-hidden"
              style={{
                backgroundColor: winBg,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, 0.12) 3px, rgba(0, 0, 0, 0.12) 6px)',
                borderTop: `${config.borderWidth || 16}px solid #FFFFFF`,
                borderLeft: `${config.borderWidth || 16}px solid #FFFFFF`,
                borderRight: `${config.borderWidth || 16}px solid #0D1017`,
                borderBottom: `${config.borderWidth || 16}px solid #0D1017`,
                boxShadow: `24px 24px 0px ${config.shadowColor || '#FF0000'}`,
              }}
            >
              {/* Barra de Título Azul (#000080) */}
              <div className="bg-[#000080] w-full p-6 flex justify-between items-center select-none shadow-md">
                <div className="flex items-center gap-4">
                  {/* Ícone de Erro Fatal Vermelho com X */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Sticker type="error" size={32} />
                  </div>
                  <p className="font-sans text-white text-[36px] md:text-[38px] font-bold tracking-wide truncate max-w-[800px]">
                    {config.systemTitle || 'Erro Fatal - crise_dos_30.exe'}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    _
                  </div>
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    □
                  </div>
                  <div className="w-10 h-10 bg-[#c0c0c0] border-4 border-white border-r-gray-700 border-b-gray-700 flex items-center justify-center font-bold text-[#1A1A1A] text-xl">
                    ✕
                  </div>
                </div>
              </div>

              {/* Dialog Content Area com Scanlines e Contraste */}
              <div className="p-12 md:p-14 flex flex-col justify-center h-full items-center text-center relative overflow-y-auto">
                {/* Ícone de Erro Vermelho com X Branco (❌) */}
                <div className="mb-4">
                  <Sticker type="error" size={hasAttachedMedia ? 64 : 96} />
                </div>

                {realidadeText ? (
                  <div className="max-w-[920px] mb-6 flex flex-col gap-4">
                    {/* Texto Superior em Preto: A Expectativa */}
                    <div className="text-left bg-white/70 p-4 border-2 border-gray-400 rounded">
                      <span className="text-xs font-mono font-bold text-gray-600 block mb-1 uppercase">
                        [A EXPECTATIVA]
                      </span>
                      <p
                        className="font-impact text-[#1A1A1A] text-[48px] uppercase leading-tight"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {expectativaText}
                      </p>
                    </div>

                    {/* Texto Inferior Destacado em Vermelho: A Realidade */}
                    <div className="text-left bg-red-100/90 p-4 border-4 border-red-600 rounded">
                      <span className="text-xs font-mono font-bold text-red-700 block mb-1 uppercase">
                        [A REALIDADE / ERRO FATAL]
                      </span>
                      <p
                        className="font-impact text-[#FF0000] text-[56px] uppercase leading-tight"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {realidadeText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <h1
                    className="font-impact tracking-tight mb-6"
                    style={{
                      fontSize: `${getBaseFontSize(72)}px`,
                      color: effectiveTextColor,
                      maxWidth: '920px',
                      ...getTextStyles('center', 1.2),
                    }}
                  >
                    {renderHighlightedText(
                      config.text,
                      config.highlightText,
                      effectiveHighlightColor,
                      'textColor',
                      effectiveTextColor
                    )}
                  </h1>
                )}

                {/* Attached Media */}
                {renderMediaAttachment()}

                {/* Barra de Progresso de Erro Fatal Dinâmica */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="w-full max-w-[840px] my-3">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel || 'Tentativa de Recuperação:'}
                      styleType="win98"
                      accentColor="#FF0000"
                      shadowColor="#FF0000"
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}

                {/* Classic Windows 98 3D Action Button: OK */}
                <div
                  className="border-[8px] px-16 py-4 mt-4 active:scale-95 cursor-pointer shadow-md transition-transform bg-[#c0c0c0] border-t-white border-l-white border-r-[#1A1A1A] border-b-[#1A1A1A]"
                >
                  <p className="font-sans text-[36px] font-bold text-[#1A1A1A]">
                    {config.windowButtonText || 'OK'}
                  </p>
                </div>
              </div>

              {/* Handle watermark */}
              <div className="absolute bottom-6 right-8">
                <p className="font-mono text-[26px] font-bold text-gray-700">
                  {config.handle || '@DEPRESSIVOS2000'}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE OFICIAL 4: NOSTALGIA SOCIAL (ORKUT / MSN) */}
        {/* ============================================================ */}
        {(config.template === 'nostalgia-social' || config.template === 'msn-nostalgia') && (() => {
          const bg = config.backgroundColor || '#E8F1FC';
          const cardBg = '#FFFFFF';
          const effectiveTextColor = getEffectiveTextColor(cardBg, config.textColor, '#1A1A1A', '#F4F4F0');
          return (
            <div
              className="w-full h-full flex flex-col relative box-border z-10 font-sans"
              style={{
                backgroundColor: bg,
                border: `${config.borderWidth || 16}px solid #4B8CF7`,
                boxShadow: `26px 26px 0px ${config.shadowColor || '#000080'}`,
              }}
            >
              {/* MSN Header Bar: Gradiente Azul + Ícone Borboleta + Status (Ocupado) */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex items-center justify-between text-white border-b-4 border-[#1E4AA8]">
                <div className="flex items-center gap-4">
                  <Sticker type="msn" size={48} />
                  <div>
                    <p className="font-bold text-[30px] md:text-[32px] tracking-wide">
                      {config.systemTitle || 'MSN Messenger - Conversa com Crush'}
                    </p>
                    <p className="text-[20px] text-blue-100 font-mono">
                      Status: (Ocupado) - 0% VONTADE DE VIVER
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-600 border-2 border-white flex items-center justify-center font-bold text-white text-xl">
                  ✕
                </div>
              </div>

              {/* Chat History Container com Fundo Azul Claro */}
              <div className="p-10 md:p-12 flex-1 flex flex-col justify-center overflow-y-auto">
                {/* Caixa de Mensagem Branca com Bordas Arredondadas e Sombra Leve */}
                <div className="bg-white border-4 border-[#A3C7FC] p-8 rounded-xl shadow-md mb-6">
                  {/* Foto de Perfil Quadrada com @DEPRESSIVOS2000 */}
                  <div className="flex items-center gap-4 mb-4 border-b-2 border-gray-200 pb-3">
                    <div className="w-16 h-16 bg-[#0000FF] border-2 border-blue-400 flex items-center justify-center text-2xl text-white font-impact rounded-md shadow-sm">
                      :(
                    </div>
                    <div>
                      <span className="font-bold text-[28px] text-[#2B60DE]">
                        {config.handle || '@DEPRESSIVOS2000'}
                      </span>
                      <span className="text-[20px] text-gray-500 ml-4 font-mono">
                        diz (23:42):
                      </span>
                    </div>
                  </div>

                  {/* Texto Marcante com Marca-Texto Rosa Neon (#FF007F / bg-pink-500 text-white) */}
                  <h1
                    className="font-impact tracking-tight"
                    style={{
                      fontSize: `${getBaseFontSize(68)}px`,
                      color: effectiveTextColor,
                      ...getTextStyles('left', 1.18),
                    }}
                  >
                    {renderHighlightedText(
                      config.text,
                      config.highlightText,
                      config.highlightColor || '#FF007F',
                      'badge',
                      effectiveTextColor
                    )}
                  </h1>

                  {/* Attached Media inside MSN chat */}
                  {renderMediaAttachment()}

                  {/* Barra de Progresso MSN Dinâmica */}
                  {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                    <div className="mt-4">
                      <PercentageLoader
                        text={config.text}
                        targetPercentage={config.customPercentage}
                        customLabel={config.percentageLabel || 'Transferindo arquivo de ilusões:'}
                        styleType="win98"
                        accentColor="#4B8CF7"
                        shadowColor="#000080"
                        animate={config.animatePercentage !== false}
                      />
                    </div>
                  )}
                </div>

                {/* Nudge / Chamar Atenção Button */}
                <div className="flex items-center justify-between bg-[#D7E8FC] border-2 border-[#A3C7FC] p-5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <span className="font-bold text-[24px] text-[#2B60DE]">
                      {config.windowButtonText || 'CHAMAR ATENÇÃO (NUDGE)'}
                    </span>
                  </div>
                  <span className="font-mono text-[24px] font-bold text-[#1E4AA8]">
                    {config.handle || '@DEPRESSIVOS2000'}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE: DARK MODE 3H DA MANHÃ / TERMINAL (DIA 9) */}
        {/* ============================================================ */}
        {config.template === 'terminal-dark' && (() => {
          const terminalBg = config.backgroundColor || '#12141C';
          const effectiveTextColor = getEffectiveTextColor(terminalBg, config.textColor, '#F4F4F0', '#F4F4F0');
          const terminalHighlightColor =
            !config.highlightColor || config.highlightColor === '#0000FF' || isDarkColor(config.highlightColor)
              ? '#00FF66'
              : config.highlightColor;

          return (
            <div
              className="w-full h-full p-16 md:p-20 flex flex-col justify-between relative box-border z-10 select-none overflow-hidden"
              style={{
                backgroundColor: terminalBg,
                border: `${config.borderWidth || 16}px solid #222634`,
                boxShadow: `30px 30px 0px ${config.shadowColor || '#FF3333'}`,
              }}
            >
              {/* Top Terminal Prompt with Mac/Linux window buttons */}
              <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FF5F56] border border-red-700/50 inline-block shadow-sm"></span>
                    <span className="w-4 h-4 rounded-full bg-[#FFBD2E] border border-yellow-700/50 inline-block shadow-sm"></span>
                    <span className="w-4 h-4 rounded-full bg-[#27C93F] border border-green-700/50 inline-block shadow-sm"></span>
                  </div>
                  <p
                    className="font-mono font-bold ml-2 truncate max-w-[700px]"
                    style={{
                      fontSize: hasAttachedMedia ? '26px' : '32px',
                      color: config.shadowColor && config.shadowColor !== '#0000FF' ? config.shadowColor : '#00FF66',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {config.terminalPrompt || '> terminal_pensamentos_intrusivos_03am.sh'}
                  </p>
                </div>
                {config.sticker !== 'none' && (
                  <Sticker type={config.sticker} size={hasAttachedMedia ? 56 : 74} />
                )}
              </div>

              {/* Main impact headline - High Contrast and Legible */}
              <div className="my-auto py-4">
                <div className="font-mono text-xs text-gray-500 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#00FF66] font-bold">root@traumas-zip:~#</span>
                  <span>cat pensamentos_das_03h.txt</span>
                </div>

                <h1
                  className="font-impact tracking-tight"
                  style={{
                    fontSize: `${getBaseFontSize(80)}px`,
                    color: effectiveTextColor,
                    ...getTextStyles('left', 1.18),
                  }}
                >
                  {renderHighlightedText(
                    config.text,
                    config.highlightText,
                    terminalHighlightColor,
                    'textColor',
                    effectiveTextColor
                  )}
                </h1>

                {/* Barra de Progresso Hacker Terminal se houver % no texto */}
                {(config.showPercentageBar || hasPercentageInText(config.text)) && (
                  <div className="w-full mt-4">
                    <PercentageLoader
                      text={config.text}
                      targetPercentage={config.customPercentage}
                      customLabel={config.percentageLabel || 'BUFFER SOCIAL RESTANTE:'}
                      styleType="terminal"
                      accentColor="#00FF66"
                      shadowColor="#000000"
                      animate={config.animatePercentage !== false}
                    />
                  </div>
                )}
              </div>

              {/* Attached Media if any */}
              {renderMediaAttachment(config.shadowColor || '#FF3333', config.borderWidth || 4)}

              {/* Footer with handle */}
              <div className="border-t-4 border-gray-800 pt-5 w-full flex justify-between items-center font-mono">
                <span className="text-[26px] text-[#00FF66] font-bold flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#00FF66] animate-pulse"></span>
                  ● ONLINE (03:14 AM)
                </span>
                <p className="text-[28px] text-[#F4F4F0] font-bold">
                  {config.handle || '@DEPRESSIVOS2000'}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE 6: APENAS A TELA DO IPOD ANOS 2000 (COM MOVIMENTO AO VIVO) */}
        {/* ============================================================ */}
        {config.template === 'winamp-retro' && (() => {
          // Parse song/artist/album if formatted like "Mohit Chauhan - Tum Se Hi (Jab We Met)" or "A$AP Rocky - Sundress"
          const rawText = config.text || '';
          let artist = 'Mohit Chauhan';
          let song = 'Tum Se Hi';
          let albumName = 'Jab We Met';
          let trackIndex = '2 of 5';

          const cleanText = rawText.replace(/^Tocando no (?:Winamp|MP4|MP3|iPod|MSN):\s*/i, '').trim();
          const match = cleanText.match(/^(.*?)\s*[-–—]\s*(.*?)(?:\s*\((.*?)\))?$/);
          
          if (match) {
            artist = match[1].trim();
            song = match[2].trim();
            if (match[3]) {
              albumName = match[3].trim();
            } else {
              albumName = song;
            }
          } else if (config.text) {
            song = config.text;
          }

          return (
            <div
              className="w-full h-full p-4 md:p-8 flex flex-col justify-between relative box-border z-10 select-none overflow-hidden"
              style={{
                backgroundColor: config.backgroundColor && config.backgroundColor !== '#F4F4F0' 
                  ? config.backgroundColor 
                  : '#FAFAFA',
                border: `${config.borderWidth || 8}px solid #1A1A1A`,
                boxShadow: `20px 20px 0px ${config.shadowColor || '#0000FF'}`,
              }}
            >
              {/* Dynamic Ipod Screen Component (Apenas a Tela com Movimento e Informações) */}
              <div className="w-full h-full flex flex-col justify-center items-center py-2">
                <IpodScreen
                  songTitle={song}
                  artistName={artist}
                  albumName={albumName}
                  trackIndex={trackIndex}
                  mediaUrl={config.mediaUrl}
                  audioPreviewUrl={config.audioPreviewUrl}
                  mediaType={config.mediaType}
                  mediaFilter={config.mediaFilter}
                  showMsnBadge={true}
                  handle={config.handle}
                  isFullCanvas={true}
                />
              </div>

              {/* Bottom Footer Details */}
              <div className="w-full flex justify-between items-center px-4 font-mono text-xs text-gray-500 z-10 mt-2">
                <span className="font-bold text-[#0000FF]">TRAUMAS.ZIP • IPOD DISPLAY 2000s</span>
                <span className="font-bold text-[#1A1A1A]">
                  {config.handle || '@DEPRESSIVOS2000'}
                </span>
              </div>
            </div>
          );
        })()}

        {/* ============================================================ */}
        {/* TEMPLATE: WINDOWS MEDIA PLAYER XP (BLISS WALLPAPER + WMP 9) */}
        {/* ============================================================ */}
        {(config.template === 'windows-media-player' || config.template === 'wmp-xp') && (
          <WindowsMediaPlayerTemplate
            config={config}
            scale={scale}
            width={width}
            height={height}
            hasAttachedMedia={hasAttachedMedia}
            getBaseFontSize={getBaseFontSize}
            getTextStyles={getTextStyles}
            renderHighlightedText={renderHighlightedText}
          />
        )}

        {/* ============================================================ */}
        {/* CRT RETRO MONITOR OVERLAYS */}
        {/* ============================================================ */}
        
        {/* 1. CRT Scanlines Overlay */}
        {config.showScanlines && (
          <div
            className={`absolute inset-0 pointer-events-none z-30 ${
              config.crtPreset === 'crt-heavy' ? 'crt-scanlines-dense' : 'crt-scanlines'
            }`}
            style={{
              opacity: typeof config.crtScanlinesIntensity === 'number' 
                ? config.crtScanlinesIntensity / 100 
                : 0.85,
            }}
          />
        )}

        {/* 2. CRT Moving Electron Beam */}
        {config.showScanlines && (
          <div className="absolute inset-0 crt-moving-beam pointer-events-none z-31" />
        )}

        {/* 3. CRT Tube Vignette */}
        {config.crtVignette && (
          <div
            className={`absolute inset-0 pointer-events-none z-32 ${
              config.crtPreset === 'crt-heavy' ? 'crt-vignette-heavy' : 'crt-vignette'
            }`}
          />
        )}

        {/* 4. CRT Glass Glare / Screen Curve Reflection */}
        {config.crtCurvature && (
          <div className="absolute inset-0 crt-glass-glare pointer-events-none z-33" />
        )}

        {/* 5. CRT Physical Screen Bezel Rim when curvature is active */}
        {config.crtCurvature && (
          <div
            className={`absolute inset-0 pointer-events-none z-34 border-[#0A0D14] ${
              config.crtPreset === 'crt-heavy'
                ? 'border-[16px] rounded-[56px] shadow-[inset_0_0_24px_rgba(0,0,0,0.95)]'
                : 'border-[8px] rounded-[28px] shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]'
            }`}
          />
        )}
      </div>
    </div>
  );
};

