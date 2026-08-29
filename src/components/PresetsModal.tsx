import React, { useState } from 'react';
import { PRESET_QUOTES } from '../data/presets';
import { PresetQuote, PostConfig } from '../types';
import { X, Search, Sparkles, Check, Bookmark } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetQuote) => void;
  currentConfig: PostConfig;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  if (!isOpen) return null;

  const categories = ['Todas', ...Array.from(new Set(PRESET_QUOTES.map((p) => p.category)))];

  const filteredPresets = PRESET_QUOTES.filter((preset) => {
    const matchesCategory =
      selectedCategory === 'Todas' || preset.category === selectedCategory;
    const matchesSearch =
      preset.text.toLowerCase().includes(search.toLowerCase()) ||
      preset.category.toLowerCase().includes(search.toLowerCase()) ||
      (preset.highlightText && preset.highlightText.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181B22] border-2 border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#13151B]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                Biblioteca de Frases Traumas.zip
              </h2>
              <p className="text-xs text-gray-400">
                Selecione uma frase pronta ou use como base para editar
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

        {/* Search & Categories */}
        <div className="p-4 border-b border-gray-800 bg-[#161820] flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por palavras, crises, memes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0E1015] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#212530] text-gray-400 hover:text-white hover:bg-[#2A3040]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="bg-[#1E222D] hover:bg-[#252B39] border border-gray-700/80 hover:border-blue-500 rounded-xl p-4 cursor-pointer transition flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-800 text-yellow-400 font-bold">
                    {preset.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {preset.template}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-100 line-clamp-3 leading-relaxed">
                  {preset.text}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
                <span className="text-xs text-blue-400 group-hover:underline flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Aplicar no gerador
                </span>
                {preset.highlightText && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
                    style={{
                      backgroundColor: preset.highlightColor,
                      color: '#1A1A1A',
                    }}
                  >
                    {preset.highlightText}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredPresets.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              <p className="text-sm">Nenhuma frase encontrada para essa busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
