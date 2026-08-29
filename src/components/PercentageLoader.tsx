import React, { useState, useEffect, useRef } from 'react';

/**
 * Utilitário para extrair porcentagem e rótulo de qualquer texto
 */
export function extractPercentageFromText(text: string): { percentage: number; label?: string } | null {
  if (!text) return null;

  // Regex para capturar números seguidos de % (ex: 99%, 0%, 50%, 1.5%, 99,9%)
  const percentMatch = text.match(/(\d+(?:[.,]\d+)?)\s*%/i);
  if (!percentMatch) return null;

  const rawNum = percentMatch[1].replace(',', '.');
  let parsed = parseFloat(rawNum);
  if (isNaN(parsed)) return null;
  parsed = Math.min(100, Math.max(0, parsed));

  // Tentar encontrar um rótulo de contexto no texto
  const lower = text.toLowerCase();
  let label = 'Processando...';

  if (lower.includes('bateria') || lower.includes('bateria social')) {
    label = 'Nível de Bateria Social:';
  } else if (lower.includes('maturidade') || lower.includes('emocional')) {
    label = 'Processando maturidade emocional:';
  } else if (lower.includes('paciência') || lower.includes('paciencia')) {
    label = 'Paciência restante:';
  } else if (lower.includes('sanidade') || lower.includes('saúde mental') || lower.includes('saude mental')) {
    label = 'Nível de Sanidade Mental:';
  } else if (lower.includes('vontade de viver') || lower.includes('vontade')) {
    label = 'Vontade de Viver:';
  } else if (lower.includes('chance') || lower.includes('dar certo') || lower.includes('dar errado')) {
    label = 'Probabilidade de Colapso:';
  } else if (lower.includes('sono') || lower.includes('cansado') || lower.includes('cansaço')) {
    label = 'Nível de Exaustão:';
  } else if (lower.includes('esperança') || lower.includes('esperanca')) {
    label = 'Nível de Esperança:';
  } else if (lower.includes('crise') || lower.includes('ansiedade')) {
    label = 'Processando Crise Existencial:';
  }

  return { percentage: parsed, label };
}

export function hasPercentageInText(text: string): boolean {
  return extractPercentageFromText(text) !== null;
}

export interface PercentageLoaderProps {
  targetPercentage?: number;
  text?: string;
  customLabel?: string;
  styleType?: 'win98' | 'brutalist' | 'terminal' | 'receipt';
  accentColor?: string;
  shadowColor?: string;
  animate?: boolean;
  compact?: boolean;
  className?: string;
}

export const PercentageLoader: React.FC<PercentageLoaderProps> = ({
  targetPercentage,
  text = '',
  customLabel,
  styleType = 'brutalist',
  accentColor = '#0000FF',
  shadowColor = '#1A1A1A',
  animate = true,
  compact = false,
  className = '',
}) => {
  // Determinar o valor alvo da porcentagem
  const extracted = text ? extractPercentageFromText(text) : null;
  const finalTarget =
    typeof targetPercentage === 'number'
      ? Math.min(100, Math.max(0, targetPercentage))
      : extracted
      ? extracted.percentage
      : 99;

  const displayLabel = customLabel || (extracted?.label ? extracted.label : 'Status do Processamento:');

  const [currentPercent, setCurrentPercent] = useState<number>(animate ? 0 : finalTarget);
  const [isDone, setIsDone] = useState<boolean>(!animate);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Efeito de animação progressiva (Count-up suave subindo de 0% até a % que mostra)
  useEffect(() => {
    if (!animate) {
      setCurrentPercent(finalTarget);
      setIsDone(true);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1800; // 1.8 segundos para carregar suavemente

    setIsDone(false);
    setCurrentPercent(0);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva de facilitação (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(easeProgress * finalTarget * 10) / 10;

      setCurrentPercent(Math.min(finalTarget, val));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrentPercent(finalTarget);
        setIsDone(true);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [finalTarget, animate, animationKey]);

  // Função para reiniciar animação ao clicar
  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const formattedPercent = Number.isInteger(currentPercent)
    ? `${currentPercent}%`
    : `${currentPercent.toFixed(1)}%`;

  // ==========================================
  // 1. ESTILO WINDOWS 98 CLÁSSICO (BLOCOS AZUIS)
  // ==========================================
  if (styleType === 'win98') {
    const totalBlocks = 24;
    const filledBlocks = Math.round((currentPercent / 100) * totalBlocks);

    return (
      <div
        className={`w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-4 select-none shadow-md ${className}`}
        onClick={handleReplay}
        title="Clique para reiniciar a animação"
      >
        <div className="flex justify-between items-center mb-2 font-sans">
          <span className="text-xs md:text-sm font-bold text-[#1A1A1A] truncate pr-2">
            {displayLabel}
          </span>
          <span className="font-mono text-xs md:text-sm font-bold bg-white px-2 py-0.5 border border-gray-600 text-[#000080]">
            {formattedPercent} {finalTarget >= 99 && isDone ? '(TRAVADO)' : ''}
          </span>
        </div>

        {/* 3D Sunken Progress Track */}
        <div className="w-full h-8 md:h-9 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1 flex gap-1 items-center overflow-hidden">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-colors duration-75 ${
                i < filledBlocks
                  ? 'bg-[#000080] shadow-inner'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-gray-700 mt-2 font-bold">
          <span>Tempo estimado: {finalTarget === 0 ? 'Impossível' : finalTarget >= 99 ? 'Indeterminado' : 'Calculando...'}</span>
          <span className="text-[#000080]">{isDone ? '● STATUS: 100% TRAUMAS' : '▲ CARREGANDO...'}</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ESTILO TERMINAL HACKER / DOS (NEON GREEN)
  // ==========================================
  if (styleType === 'terminal') {
    const totalChars = 20;
    const filledChars = Math.round((currentPercent / 100) * totalChars);
    const barString = '█'.repeat(filledChars) + '░'.repeat(Math.max(0, totalChars - filledChars));

    return (
      <div
        className={`w-full bg-[#12141C] border-2 border-[#00FF66]/50 p-4 font-mono text-[#00FF66] shadow-[6px_6px_0px_#000000] select-none ${className}`}
        onClick={handleReplay}
        title="Clique para reiniciar a animação"
      >
        <div className="flex justify-between items-center text-xs md:text-sm font-bold mb-2">
          <span>&gt; {displayLabel}</span>
          <span className="text-[#00FF66] bg-[#00FF66]/20 px-2 py-0.5 border border-[#00FF66]">
            [{formattedPercent}]
          </span>
        </div>

        <div className="bg-black/80 border border-[#00FF66]/40 p-2 text-xs md:text-base font-bold tracking-widest text-[#00FF66] flex items-center justify-between overflow-hidden">
          <span className="truncate">{barString}</span>
          <span className="text-xs text-[#00FF66] animate-pulse ml-2 font-bold">
            {isDone ? 'DONE' : 'SYNCING'}
          </span>
        </div>

        <div className="flex justify-between items-center text-[10px] md:text-xs opacity-75 mt-2">
          <span>MEMÓRIA BUFFER: 100% ANSIEDADE</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. ESTILO CUPOM / RECIBO TÉRMICO
  // ==========================================
  if (styleType === 'receipt') {
    return (
      <div
        className={`w-full bg-[#FDFBF7] border-2 border-dashed border-[#1A1A1A] p-3 md:p-4 font-mono text-[#1A1A1A] select-none ${className}`}
        onClick={handleReplay}
      >
        <div className="flex justify-between items-center text-xs md:text-sm font-bold mb-1.5 border-b border-dashed border-gray-400 pb-1">
          <span>ITEM PROCESSO: {displayLabel}</span>
          <span className="text-red-600 font-bold">{formattedPercent}</span>
        </div>

        <div className="w-full h-6 bg-white border border-[#1A1A1A] p-0.5 relative overflow-hidden">
          <div
            className="h-full bg-[#1A1A1A] transition-all duration-75 flex items-center justify-end pr-1"
            style={{ width: `${currentPercent}%` }}
          >
            {currentPercent > 15 && (
              <span className="text-[9px] font-mono font-bold text-white tracking-tighter">
                {formattedPercent}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
          <span>VALOR EMOCIONAL: ALTO</span>
          <span>FATURA: EM ABERTO</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. ESTILO BRUTALISTA TRAUMAS.ZIP (PADRÃO)
  // ==========================================
  return (
    <div
      className={`w-full bg-white border-4 border-[#1A1A1A] p-4 md:p-5 select-none transition-all ${className}`}
      style={{
        boxShadow: `8px 8px 0px ${shadowColor || '#1A1A1A'}`,
      }}
      onClick={handleReplay}
      title="Clique para reiniciar a animação da porcentagem"
    >
      {/* Barra de Título Superior com Label e Badge de % */}
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-mono text-xs md:text-sm font-bold text-[#0000FF] uppercase tracking-wider truncate pr-2">
          {displayLabel}
        </span>
        <span className="font-impact text-sm md:text-base text-[#1A1A1A] bg-yellow-300 px-2.5 py-0.5 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] tracking-wider animate-pulse flex items-center gap-1">
          <span>{formattedPercent}</span>
          {finalTarget >= 99 && isDone && (
            <span className="text-[10px] text-red-600 font-mono font-bold">(TRAVADO)</span>
          )}
        </span>
      </div>

      {/* Trilho da Barra com Borda Grossa e Preenchimento em Alta Resolução */}
      <div className="w-full h-10 md:h-12 bg-[#F4F4F0] border-4 border-[#1A1A1A] p-1 relative overflow-hidden shadow-[4px_4px_0px_#1A1A1A]">
        {/* Fundo listrado retro */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.04)_10px,rgba(0,0,0,0.04)_20px)] pointer-events-none" />

        <div
          className="h-full transition-all duration-75 border-r-4 border-[#1A1A1A] flex items-center justify-end pr-2 relative overflow-hidden"
          style={{
            width: `${Math.max(2, currentPercent)}%`,
            backgroundColor: accentColor || '#0000FF',
          }}
        >
          {/* Listras dinâmicas na barra */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.15),rgba(255,255,255,0.15)_8px,transparent_8px,transparent_16px)]" />

          {currentPercent > 18 && (
            <span className="font-mono text-xs md:text-sm font-bold text-white tracking-widest relative z-10 drop-shadow">
              {formattedPercent}
            </span>
          )}
        </div>
      </div>

      {/* Rodapé Informativo da Barra */}
      <div className="flex justify-between items-center font-mono text-[10px] md:text-xs text-gray-700 mt-2 font-bold">
        <span>
          TEMPO ESTIMADO:{' '}
          <strong className="text-[#0000FF]">
            {finalTarget === 0 ? '0s (NADA)' : finalTarget >= 99 ? 'INDETERMINADO' : 'EM PROCESSAMENTO'}
          </strong>
        </span>
        <span className="text-red-600">
          RECURSOS: {finalTarget >= 80 ? '99% ANSIEDADE' : 'BATERIA BAIXA'}
        </span>
      </div>
    </div>
  );
};
