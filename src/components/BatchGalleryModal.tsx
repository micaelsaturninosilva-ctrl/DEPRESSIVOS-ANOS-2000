import React from 'react';
import { PostConfig, TemplateType } from '../types';
import { PostCanvas } from './PostCanvas';
import { X, Check, Grid, Download } from 'lucide-react';

interface BatchGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PostConfig;
  onSelectTemplate: (template: TemplateType) => void;
}

const TEMPLATE_VARIANTS: { id: TemplateType; title: string; subtitle: string }[] = [
  {
    id: 'tweet-parede',
    title: 'Tweet de Parede (Dia 1)',
    subtitle: 'Brutalismo clássico com sombra azul',
  },
  {
    id: 'sistema-alerta',
    title: 'Alerta de Sistema (Dia 4)',
    subtitle: 'Erro Windows 98 com botão OK',
  },
  {
    id: 'terminal-dark',
    title: 'Dark Mode / 3 da Manhã (Dia 9)',
    subtitle: 'Pensamentos intrusivos e sombra vermelha',
  },
  {
    id: 'msn-nostalgia',
    title: 'MSN Messenger (2005)',
    subtitle: 'Janela de bate-papo nostálgica',
  },
  {
    id: 'nota-fiscal',
    title: 'Cupom Fiscal Existencial',
    subtitle: 'Extrato térmico com código de barras',
  },
  {
    id: 'winamp-retro',
    title: 'Player MP3 128kbps',
    subtitle: 'Equalizador verde e estética Winamp',
  },
];

export const BatchGalleryModal: React.FC<BatchGalleryModalProps> = ({
  isOpen,
  onClose,
  config,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#14171E] border-2 border-gray-700 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#0F1116]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                Comparativo de Modelos em Tempo Real
              </h2>
              <p className="text-xs text-gray-400">
                Veja seu texto renderizado em todos os 6 estilos icônicos e escolha o melhor
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

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0B0D12]">
          {TEMPLATE_VARIANTS.map((variant) => {
            const variantConfig: PostConfig = {
              ...config,
              template: variant.id,
              // Adjust default colors per template if not specifically overridden
              shadowColor:
                variant.id === 'terminal-dark'
                  ? '#FF3333'
                  : variant.id === 'tweet-parede'
                  ? '#0000FF'
                  : variant.id === 'winamp-retro'
                  ? '#00FF66'
                  : variant.id === 'msn-nostalgia'
                  ? '#000080'
                  : '#1A1A1A',
            };

            const isCurrent = config.template === variant.id;

            return (
              <div
                key={variant.id}
                className={`bg-[#181B24] rounded-2xl p-4 border flex flex-col items-center justify-between transition group shadow-lg ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-500/40'
                    : 'border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="w-full flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {variant.title}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {variant.subtitle}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                      SELECIONADO
                    </span>
                  )}
                </div>

                {/* Scaled Preview Box */}
                <div className="w-full flex items-center justify-center py-2 overflow-hidden bg-black/40 rounded-xl border border-gray-900">
                  <div className="transform scale-[0.24] origin-center -m-[410px]">
                    <PostCanvas
                      config={variantConfig}
                      scale={1}
                      previewMode={true}
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    onSelectTemplate(variant.id);
                    onClose();
                  }}
                  className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#242936] hover:bg-blue-600 text-gray-200 hover:text-white border border-gray-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'Estilo Ativo' : 'Usar Este Modelo'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
