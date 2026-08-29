import React, { useState } from 'react';
import { PostConfig } from '../types';
import { Sparkles, X, Wand2, RefreshCw, AlertCircle } from 'lucide-react';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (data: { text: string; highlightText: string; systemTitle?: string }) => void;
}

const THEME_IDEAS = [
  'Efeitos colaterais do Escitalopram e libido zero',
  'Diagnóstico DSM-5, CID F32 e F41',
  'Comprando coisas de madrugada sob efeito do Zolpidem',
  'Pagar R$ 250 de terapia pra ouvir "e como você se sente?"',
  'Falta de serotonina e dependência de Rivotril',
  'Crise dos 30 e choques na cabeça por esquecer o remédio',
  'Tentando parecer funcional sob medicação tarja preta',
  'Nostalgia do MSN, Fresno e drama existencial dos anos 2000',
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated,
}) => {
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('Sarcástico e existencial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    text: string;
    highlight: string;
    systemTitle?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme || 'vida adulta e cansaço',
          tone,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha no servidor de IA. Usando gerador criativo local.');
      }

      const data = await res.json();
      if (data && data.text) {
        setGeneratedResult({
          text: data.text,
          highlight: data.highlight || '',
          systemTitle: data.systemTitle || '',
        });
      } else {
        throw new Error('Formato inesperado.');
      }
    } catch (err: any) {
      console.warn('Fallback local para geração criativa:', err);
      // Smart offline fallback generator
      const offlineQuotes = [
        {
          text: 'A médica aumentou meu Escitalopram para 20mg.\n\nResultado: a ansiedade sumiu, mas a libido foi junto e agora sou oficialmente um monge tibetano.',
          highlight: 'libido foi junto',
          systemTitle: 'Bula_Interativa - escitalopram.exe',
        },
        {
          text: 'Diagnóstico segundo o DSM-5:\nCID F41.1 (TAG)\nCID F32 (Depressão)\n\nMinha mente: "e que tal mais um pensamento catastrófico antes de dormir?"',
          highlight: 'pensamento catastrófico',
          systemTitle: 'Laudo_Psiquiatrico.dll',
        },
        {
          text: 'Tomei Zolpidem ontem às 23h pra dormir e acordei dono de um curso de day trade e uma airfryer parcelada em 12x.',
          highlight: 'Tomei Zolpidem',
          systemTitle: '> zolpidem_blackout.sh',
        },
        {
          text: 'Paguei R$ 250 de terapia pra psicóloga perguntar "e como você se sente sobre isso?" e eu responder "com vontade de reiniciar o Windows".',
          highlight: 'reiniciar o Windows',
          systemTitle: 'Terapia_TCC.exe',
        },
      ];

      const pick = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];
      setGeneratedResult(pick);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyGenerated({
        text: generatedResult.text,
        highlightText: generatedResult.highlight,
        systemTitle: generatedResult.systemTitle,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181B22] border-2 border-purple-500/40 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-950/40 to-[#181B22]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                Gerador de Frases com IA (Gemini)
              </h2>
              <p className="text-xs text-gray-400">
                Gere novas piadas existenciais e memes estilo Traumas.zip
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

        {/* Form Body */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Sobre o que você quer reclamar hoje? (Tema)
            </label>
            <input
              type="text"
              placeholder="ex: acordar cedo pra trabalhar, dor nas costas, ex no orkut..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#101217] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-500"
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">
              Sugestões rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {THEME_IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setTheme(idea)}
                  className="text-[11px] bg-[#222735] hover:bg-[#2F3649] text-purple-200 px-2.5 py-1 rounded-md border border-purple-500/20 transition"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consultando traumas e gerando...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-yellow-300" />
                <span>Gerar Frase Inédita</span>
              </>
            )}
          </button>

          {/* Result Box */}
          {generatedResult && (
            <div className="bg-[#12141A] border-2 border-purple-500/50 rounded-xl p-4 mt-2 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold border border-purple-500/40">
                  Frase Gerada
                </span>
                {generatedResult.highlight && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-400 text-black font-bold">
                    Destaque: {generatedResult.highlight}
                  </span>
                )}
              </div>

              <p className="text-white font-impact text-lg uppercase tracking-tight my-2 leading-snug">
                {generatedResult.text}
              </p>

              <button
                onClick={handleApply}
                className="w-full mt-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md"
              >
                ✓ Aplicar no Meu Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
